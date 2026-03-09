/**
 * Stream Deck LCD key action for momentary buttons and toggle switches.
 *
 * Both modes send press value on keyDown and release value on keyUp.
 * DCS requires a complete press+release cycle for all controls.
 *
 * - Toggle: each click toggles the cockpit switch (e.g., Master Arm on/off).
 *   Button icon tracks actual cockpit state via draw argument monitoring.
 * - Momentary: the cockpit control is only active while held (e.g., Engine Start).
 *
 * Subscribes to a draw argument ID to show cockpit state on the button icon.
 */

import {
  action,
  SingletonAction,
  type KeyDownEvent,
  type KeyUpEvent,
  type WillAppearEvent,
  type WillDisappearEvent,
  type DidReceiveSettingsEvent,
} from "@elgato/streamdeck";
import type { JsonValue } from "@elgato/streamdeck";
import type { CommandSender } from "../dcs/command-sender.js";
import type { StateStore } from "../dcs/state-store.js";
import { PRESETS } from "../f4e/presets.js";

/** Settings stored per action instance */
export type ButtonSettings = {
  /** Preset key (e.g., "plt_master_arm") - if set, overrides manual IDs */
  preset?: string;
  /** DCS device ID */
  deviceId?: number;
  /** DCS command/button ID */
  commandId?: number;
  /** Value to send on press */
  pressValue?: number;
  /** Value to send on release */
  releaseValue?: number;
  /** Draw argument ID to monitor for state display */
  monitorArgId?: number;
  /** Interaction mode */
  mode?: "momentary" | "toggle";
  /** Threshold for determining on/off state from draw arg value */
  threshold?: number;
  [key: string]: JsonValue;
};

@action({ UUID: "com.dcs.f4e.button" })
export class DcsButtonAction extends SingletonAction<ButtonSettings> {
  private unsubscribes = new Map<string, () => void>();

  constructor(
    private commandSender: CommandSender,
    private stateStore: StateStore,
  ) {
    super();
  }

  private resolveSettings(settings: ButtonSettings): ButtonSettings {
    if (settings.preset && typeof settings.preset === "string" && PRESETS[settings.preset]) {
      const preset = PRESETS[settings.preset];
      return {
        ...settings,
        deviceId: preset.deviceId,
        commandId: preset.commandId,
        pressValue: settings.pressValue ?? preset.pressValue,
        releaseValue: settings.releaseValue ?? preset.releaseValue,
        monitorArgId: settings.monitorArgId ?? preset.monitorArgId,
        mode:
          settings.mode ??
          (preset.type === "momentary" ? "momentary" : "toggle"),
      };
    }
    return settings;
  }

  override async onWillAppear(
    ev: WillAppearEvent<ButtonSettings>,
  ): Promise<void> {
    const settings = this.resolveSettings(ev.payload.settings);
    this.subscribeToState(ev.action.id, ev.action, settings);
  }

  override async onWillDisappear(
    ev: WillDisappearEvent<ButtonSettings>,
  ): Promise<void> {
    this.unsubscribes.get(ev.action.id)?.();
    this.unsubscribes.delete(ev.action.id);
  }

  override async onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<ButtonSettings>,
  ): Promise<void> {
    // Re-subscribe when settings change
    this.unsubscribes.get(ev.action.id)?.();
    const settings = this.resolveSettings(ev.payload.settings);
    this.subscribeToState(ev.action.id, ev.action, settings);
  }

  override async onKeyDown(ev: KeyDownEvent<ButtonSettings>): Promise<void> {
    const settings = this.resolveSettings(ev.payload.settings);
    const deviceId = settings.deviceId;
    const commandId = settings.commandId;
    const pressValue = settings.pressValue ?? 1;

    if (deviceId === undefined || commandId === undefined) return;
    this.commandSender.sendCommand(deviceId, commandId, pressValue);
  }

  override async onKeyUp(ev: KeyUpEvent<ButtonSettings>): Promise<void> {
    const settings = this.resolveSettings(ev.payload.settings);
    const deviceId = settings.deviceId;
    const commandId = settings.commandId;
    const releaseValue = settings.releaseValue ?? 0;

    if (deviceId === undefined || commandId === undefined) return;

    // Always send release value on key up.
    // DCS requires a complete press+release cycle for all controls:
    //  - Toggle switches: press(1) + release(0) = one click that toggles state
    //  - Momentary buttons: press(1) = active, release(0) = deactivated
    // Without the release, DCS thinks the button is still held and ignores further presses.
    this.commandSender.sendCommand(deviceId, commandId, releaseValue);
  }

  private subscribeToState(
    actionId: string,
    actionRef: any,
    settings: ButtonSettings,
  ): void {
    if (settings.monitorArgId === undefined) return;

    const threshold = settings.threshold ?? 0.5;
    const unsub = this.stateStore.subscribe(
      settings.monitorArgId,
      (_id, value) => {
        const numVal = parseFloat(value);
        const stateIdx = numVal > threshold ? 1 : 0;
        actionRef.setState(stateIdx).catch(() => {});
      },
    );
    this.unsubscribes.set(actionId, unsub);
  }
}
