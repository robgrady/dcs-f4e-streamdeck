/**
 * Stream Deck + encoder/dial action for rotary controls.
 *
 * Handles:
 * - Dial rotation: sends increment/decrement commands based on tick count
 * - Dial push: optional push action (e.g., toggle a switch)
 * - Touch strip: displays current value via setFeedback()
 *
 * Perfect for radio frequency tuning, radar controls, volume knobs, etc.
 */

import {
  action,
  SingletonAction,
  type DialRotateEvent,
  type DialDownEvent,
  type DialUpEvent,
  type TouchTapEvent,
  type WillAppearEvent,
  type WillDisappearEvent,
  type DidReceiveSettingsEvent,
} from "@elgato/streamdeck";
import type { JsonValue } from "@elgato/streamdeck";
import type { CommandSender } from "../dcs/command-sender.js";
import type { StateStore } from "../dcs/state-store.js";
import { PRESETS } from "../f4e/presets.js";

/** Settings for encoder/dial action */
export type EncoderSettings = {
  preset?: string;
  deviceId?: number;
  commandId?: number;
  incrementValue?: number;
  decrementValue?: number;
  monitorArgId?: number;
  pushDeviceId?: number;
  pushCommandId?: number;
  pushValue?: number;
  displayLabel?: string;
  displayFormat?: "percent" | "raw" | "frequency";
  customMonitorId?: number;
  [key: string]: JsonValue;
};

@action({ UUID: "com.dcs.f4e.encoder" })
export class DcsEncoderAction extends SingletonAction<EncoderSettings> {
  private unsubscribes = new Map<string, (() => void)[]>();

  constructor(
    private commandSender: CommandSender,
    private stateStore: StateStore,
  ) {
    super();
  }

  private resolveSettings(settings: EncoderSettings): EncoderSettings {
    if (settings.preset && typeof settings.preset === "string" && PRESETS[settings.preset]) {
      const preset = PRESETS[settings.preset];
      return {
        ...settings,
        deviceId: preset.deviceId,
        commandId: preset.commandId,
        incrementValue: (settings.incrementValue as number | undefined) ?? preset.pressValue,
        decrementValue:
          (settings.decrementValue as number | undefined) ?? -Math.abs(preset.pressValue),
        monitorArgId: (settings.monitorArgId as number | undefined) ?? preset.monitorArgId,
        displayLabel: (settings.displayLabel as string | undefined) ?? preset.name,
      };
    }
    return settings;
  }

  override async onWillAppear(
    ev: WillAppearEvent<EncoderSettings>,
  ): Promise<void> {
    const settings = this.resolveSettings(ev.payload.settings);
    this.subscribeToState(ev.action.id, ev.action as any, settings);
  }

  override async onWillDisappear(
    ev: WillDisappearEvent<EncoderSettings>,
  ): Promise<void> {
    const unsubs = this.unsubscribes.get(ev.action.id);
    if (unsubs) {
      for (const unsub of unsubs) unsub();
    }
    this.unsubscribes.delete(ev.action.id);
  }

  override async onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<EncoderSettings>,
  ): Promise<void> {
    const unsubs = this.unsubscribes.get(ev.action.id);
    if (unsubs) {
      for (const unsub of unsubs) unsub();
    }
    const settings = this.resolveSettings(ev.payload.settings);
    this.subscribeToState(ev.action.id, ev.action as any, settings);
  }

  override async onDialRotate(
    ev: DialRotateEvent<EncoderSettings>,
  ): Promise<void> {
    const settings = this.resolveSettings(ev.payload.settings);
    const deviceId = settings.deviceId as number | undefined;
    const commandId = settings.commandId as number | undefined;

    if (deviceId === undefined || commandId === undefined) return;

    const ticks = ev.payload.ticks;
    const increment = (settings.incrementValue as number | undefined) ?? 0.1;
    const decrement = (settings.decrementValue as number | undefined) ?? -0.1;

    const value = ticks > 0 ? increment : decrement;
    const count = Math.abs(ticks);

    for (let i = 0; i < count; i++) {
      this.commandSender.sendCommand(deviceId, commandId, value);
    }
  }

  override async onDialDown(
    ev: DialDownEvent<EncoderSettings>,
  ): Promise<void> {
    const settings = this.resolveSettings(ev.payload.settings);
    const pushDeviceId = (settings.pushDeviceId as number | undefined) ?? (settings.deviceId as number | undefined);
    const pushCommandId = settings.pushCommandId as number | undefined;
    const pushValue = (settings.pushValue as number | undefined) ?? 1;

    if (pushDeviceId === undefined || pushCommandId === undefined) return;
    this.commandSender.sendCommand(pushDeviceId, pushCommandId, pushValue);
  }

  override async onDialUp(
    ev: DialUpEvent<EncoderSettings>,
  ): Promise<void> {
    const settings = this.resolveSettings(ev.payload.settings);
    const pushDeviceId = (settings.pushDeviceId as number | undefined) ?? (settings.deviceId as number | undefined);
    const pushCommandId = settings.pushCommandId as number | undefined;

    if (pushDeviceId === undefined || pushCommandId === undefined) return;
    this.commandSender.sendCommand(pushDeviceId, pushCommandId, 0);
  }

  override async onTouchTap(
    ev: TouchTapEvent<EncoderSettings>,
  ): Promise<void> {
    // Touch tap could cycle through presets or open quick-adjust
  }

  private subscribeToState(
    actionId: string,
    actionRef: { setFeedback(feedback: Record<string, unknown>): Promise<void> },
    settings: EncoderSettings,
  ): void {
    const unsubs: (() => void)[] = [];

    const monitorId = (settings.customMonitorId as number | undefined) ?? (settings.monitorArgId as number | undefined);
    if (monitorId !== undefined) {
      const label = (settings.displayLabel as string | undefined) ?? "";
      const format = (settings.displayFormat as string | undefined) ?? "raw";

      const unsub = this.stateStore.subscribe(monitorId, (_id, value) => {
        let displayValue: string;
        const numVal = parseFloat(value);

        switch (format) {
          case "percent":
            displayValue = `${Math.round(numVal * 100)}%`;
            break;
          case "frequency":
            displayValue = value.trim();
            break;
          case "raw":
          default:
            displayValue = isNaN(numVal) ? value : numVal.toFixed(2);
            break;
        }

        actionRef
          .setFeedback({
            value: displayValue,
            title: label,
            indicator: {
              value: isNaN(numVal) ? 0 : Math.round(numVal * 100),
            },
          })
          .catch(() => {});
      });
      unsubs.push(unsub);
    }

    this.unsubscribes.set(actionId, unsubs);
  }
}
