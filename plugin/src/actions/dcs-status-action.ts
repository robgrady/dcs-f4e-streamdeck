/**
 * Connection status indicator action.
 *
 * Shows whether DCS is running and the plugin is receiving data.
 * Green (state 1) = connected, Red (state 0) = disconnected.
 * Always displays the plugin version number.
 */

import {
  action,
  SingletonAction,
  type KeyDownEvent,
  type WillAppearEvent,
  type WillDisappearEvent,
} from "@elgato/streamdeck";
import type { UdpClient } from "../dcs/udp-client.js";
import type { StateStore } from "../dcs/state-store.js";
import { PLUGIN_VERSION } from "../version.js";

@action({ UUID: "com.dcs.f4e.status" })
export class DcsStatusAction extends SingletonAction {
  private intervals = new Map<string, ReturnType<typeof setInterval>>();

  constructor(
    private udpClient: UdpClient,
    private stateStore: StateStore,
  ) {
    super();
  }

  override async onWillAppear(ev: WillAppearEvent): Promise<void> {
    const actionRef = ev.action as any;

    const interval = setInterval(() => {
      const connected = this.udpClient.connected;
      actionRef.setState(connected ? 1 : 0).catch(() => {});

      const aircraft = this.stateStore.get(2999) ?? "---";
      actionRef
        .setTitle(connected ? `${aircraft}\nv${PLUGIN_VERSION}` : `OFFLINE\nv${PLUGIN_VERSION}`)
        .catch(() => {});
    }, 2000);

    this.intervals.set(ev.action.id, interval);

    actionRef.setState(0).catch(() => {});
    actionRef.setTitle(`OFFLINE\nv${PLUGIN_VERSION}`).catch(() => {});
  }

  override async onWillDisappear(ev: WillDisappearEvent): Promise<void> {
    const interval = this.intervals.get(ev.action.id);
    if (interval) clearInterval(interval);
    this.intervals.delete(ev.action.id);
  }

  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    const actionRef = ev.action as any;
    const connected = this.udpClient.connected;
    const aircraft = this.stateStore.get(2999) ?? "---";
    actionRef
      .setTitle(
        connected
          ? `Connected\n${aircraft}\nv${PLUGIN_VERSION}`
          : `Disconnected\nNo Data\nv${PLUGIN_VERSION}`,
      )
      .catch(() => {});
  }
}
