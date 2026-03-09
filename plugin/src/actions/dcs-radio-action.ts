/**
 * Specialized encoder action for UHF radio frequency tuning.
 *
 * Uses a custom touch strip layout to display the current frequency.
 * Dial rotation changes the selected frequency digit.
 * Push toggles between digit selection (ones, tens, tenths, etc.).
 */

import {
  action,
  SingletonAction,
  type DialRotateEvent,
  type DialDownEvent,
  type TouchTapEvent,
  type WillAppearEvent,
  type WillDisappearEvent,
} from "@elgato/streamdeck";
import type { JsonValue } from "@elgato/streamdeck";
import type { CommandSender } from "../dcs/command-sender.js";
import type { StateStore } from "../dcs/state-store.js";
import { F4EDevice } from "../f4e/devices.js";

/** Settings for the radio frequency encoder */
export type RadioSettings = {
  seat?: "pilot" | "wso";
  [key: string]: JsonValue;
};

/** Frequency digit selector commands for pilot ARC-164 */
const PILOT_FREQ_DIGITS = [
  { name: "100s", commandId: 3025, positions: 4 },
  { name: "10s", commandId: 3009, positions: 10 },
  { name: "1s", commandId: 3008, positions: 10 },
  { name: ".1s", commandId: 3007, positions: 10 },
  { name: ".01s", commandId: 3006, positions: 4 },
];

/** Frequency digit selector commands for WSO ARC-164 */
const WSO_FREQ_DIGITS = [
  { name: "100s", commandId: 3029, positions: 4 },
  { name: "10s", commandId: 3020, positions: 10 },
  { name: "1s", commandId: 3019, positions: 10 },
  { name: ".1s", commandId: 3018, positions: 10 },
  { name: ".01s", commandId: 3017, positions: 4 },
];

@action({ UUID: "com.dcs.f4e.radio" })
export class DcsRadioAction extends SingletonAction<RadioSettings> {
  private selectedDigit = new Map<string, number>();
  private unsubscribes = new Map<string, () => void>();

  constructor(
    private commandSender: CommandSender,
    private stateStore: StateStore,
  ) {
    super();
  }

  override async onWillAppear(
    ev: WillAppearEvent<RadioSettings>,
  ): Promise<void> {
    this.selectedDigit.set(ev.action.id, 1); // Start on tens digit
    const actionRef = ev.action as any;

    const unsub = this.stateStore.subscribe(2000, (_id, value) => {
      const freq = value.trim();
      const digitIndex = this.selectedDigit.get(ev.action.id) ?? 1;
      const digitNames = ["100s", "10s", "1s", ".1s", ".01s"];

      actionRef
        .setFeedback({
          "freq-value": freq || "----.---",
          "freq-label": `UHF [${digitNames[digitIndex]}]`,
        })
        .catch(() => {});
    });
    this.unsubscribes.set(ev.action.id, unsub);

    // Set initial display
    actionRef
      .setFeedback({
        "freq-value": "----.---",
        "freq-label": "UHF [10s]",
      })
      .catch(() => {});
  }

  override async onWillDisappear(
    ev: WillDisappearEvent<RadioSettings>,
  ): Promise<void> {
    this.unsubscribes.get(ev.action.id)?.();
    this.unsubscribes.delete(ev.action.id);
    this.selectedDigit.delete(ev.action.id);
  }

  override async onDialRotate(
    ev: DialRotateEvent<RadioSettings>,
  ): Promise<void> {
    const seat = (ev.payload.settings.seat as string | undefined) ?? "pilot";
    const digits = seat === "wso" ? WSO_FREQ_DIGITS : PILOT_FREQ_DIGITS;
    const digitIndex = this.selectedDigit.get(ev.action.id) ?? 1;
    const digit = digits[digitIndex];

    const ticks = ev.payload.ticks;
    const value = ticks > 0 ? 0.1 : -0.1;
    const count = Math.abs(ticks);

    for (let i = 0; i < count; i++) {
      this.commandSender.sendCommand(
        F4EDevice.ARC_164,
        digit.commandId,
        value,
      );
    }
  }

  override async onDialDown(
    ev: DialDownEvent<RadioSettings>,
  ): Promise<void> {
    const current = this.selectedDigit.get(ev.action.id) ?? 1;
    const next = (current + 1) % 5;
    this.selectedDigit.set(ev.action.id, next);

    const digitNames = ["100s", "10s", "1s", ".1s", ".01s"];
    const freq = this.stateStore.get(2000)?.trim() ?? "----.---";

    (ev.action as any)
      .setFeedback({
        "freq-value": freq,
        "freq-label": `UHF [${digitNames[next]}]`,
      })
      .catch(() => {});
  }

  override async onTouchTap(
    ev: TouchTapEvent<RadioSettings>,
  ): Promise<void> {
    const seat = (ev.payload.settings.seat as string | undefined) ?? "pilot";
    const commandId = seat === "wso" ? 3022 : 3005;
    this.commandSender.sendCommand(F4EDevice.ARC_164, commandId, 0.1);
  }
}
