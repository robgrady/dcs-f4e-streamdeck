/**
 * Stream Deck LCD key action for multi-position switches.
 *
 * Each press cycles to the next position. The current position
 * is displayed as the button title. Subscribes to a draw argument
 * to sync with actual cockpit state.
 */

import {
  action,
  SingletonAction,
  type KeyDownEvent,
  type WillAppearEvent,
  type WillDisappearEvent,
  type DidReceiveSettingsEvent,
} from "@elgato/streamdeck";
import type { JsonValue } from "@elgato/streamdeck";
import type { CommandSender } from "../dcs/command-sender.js";
import type { StateStore } from "../dcs/state-store.js";
import { PRESETS } from "../f4e/presets.js";

/** Settings for multi-position switch action */
export type SwitchSettings = {
  preset?: string;
  deviceId?: number;
  commandId?: number;
  incrementValue?: number;
  decrementValue?: number;
  monitorArgId?: number;
  positions?: number;
  positionLabels?: string[];
  direction?: "forward" | "bidirectional";
  [key: string]: JsonValue;
};

@action({ UUID: "com.dcs.f4e.switch" })
export class DcsSwitchAction extends SingletonAction<SwitchSettings> {
  private unsubscribes = new Map<string, () => void>();
  private currentPositions = new Map<string, number>();

  constructor(
    private commandSender: CommandSender,
    private stateStore: StateStore,
  ) {
    super();
  }

  private resolveSettings(settings: SwitchSettings): SwitchSettings {
    if (settings.preset && typeof settings.preset === "string" && PRESETS[settings.preset]) {
      const preset = PRESETS[settings.preset];
      return {
        ...settings,
        deviceId: preset.deviceId,
        commandId: preset.commandId,
        incrementValue: (settings.incrementValue as number | undefined) ?? preset.pressValue,
        decrementValue: (settings.decrementValue as number | undefined) ?? preset.releaseValue,
        monitorArgId: (settings.monitorArgId as number | undefined) ?? preset.monitorArgId,
        positions: (settings.positions as number | undefined) ?? preset.positions ?? 2,
        positionLabels:
          (settings.positionLabels as string[] | undefined) ?? preset.positionLabels,
      };
    }
    return settings;
  }

  override async onWillAppear(
    ev: WillAppearEvent<SwitchSettings>,
  ): Promise<void> {
    const settings = this.resolveSettings(ev.payload.settings);
    this.subscribeToState(ev.action.id, ev.action as any, settings);
  }

  override async onWillDisappear(
    ev: WillDisappearEvent<SwitchSettings>,
  ): Promise<void> {
    this.unsubscribes.get(ev.action.id)?.();
    this.unsubscribes.delete(ev.action.id);
    this.currentPositions.delete(ev.action.id);
  }

  override async onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<SwitchSettings>,
  ): Promise<void> {
    this.unsubscribes.get(ev.action.id)?.();
    const settings = this.resolveSettings(ev.payload.settings);
    this.subscribeToState(ev.action.id, ev.action as any, settings);
  }

  override async onKeyDown(ev: KeyDownEvent<SwitchSettings>): Promise<void> {
    const settings = this.resolveSettings(ev.payload.settings);
    const deviceId = settings.deviceId as number | undefined;
    const commandId = settings.commandId as number | undefined;
    const incrementValue = (settings.incrementValue as number | undefined) ?? 0.1;

    if (deviceId === undefined || commandId === undefined) return;
    this.commandSender.sendCommand(deviceId, commandId, incrementValue);
  }

  private subscribeToState(
    actionId: string,
    actionRef: { setTitle(title: string): Promise<void> },
    settings: SwitchSettings,
  ): void {
    const monitorArgId = settings.monitorArgId as number | undefined;
    if (monitorArgId === undefined) return;

    const positions = (settings.positions as number | undefined) ?? 2;
    const labels = settings.positionLabels as string[] | undefined;

    const unsub = this.stateStore.subscribe(
      monitorArgId,
      (_id, value) => {
        const numVal = parseFloat(value);
        const posIndex = Math.round(numVal * (positions - 1));
        const clampedIndex = Math.max(0, Math.min(positions - 1, posIndex));
        this.currentPositions.set(actionId, clampedIndex);

        const label = labels?.[clampedIndex] ?? `${clampedIndex + 1}/${positions}`;
        actionRef.setTitle(label).catch(() => {});
      },
    );
    this.unsubscribes.set(actionId, unsub);
  }
}
