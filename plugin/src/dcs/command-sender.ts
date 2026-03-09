/**
 * Formats and sends cockpit commands to DCS via the ExportScript listener.
 *
 * DCS-ExportScripts listener expects commands in the format:
 *   C<device_id>,<button_id>,<value>
 *
 * For example, to press the Master Arm switch (device 27, button 3003):
 *   C27,3003,1
 */

import type { UdpClient } from "./udp-client.js";

export class CommandSender {
  constructor(private udp: UdpClient) {}

  /**
   * Send a cockpit command to DCS.
   *
   * @param deviceId - DCS device ID (e.g., 27 for weapons)
   * @param commandId - Button/command ID (e.g., 3003 for master arm)
   * @param value - Command value (e.g., 1 for on, 0 for off)
   */
  sendCommand(deviceId: number, commandId: number, value: number): void {
    const msg = `C${deviceId},${commandId},${value}`;
    this.udp.send(msg);
  }

  /**
   * Send a press-and-release command pair.
   * Sends the press value immediately, then the release value after a delay.
   *
   * @param deviceId - DCS device ID
   * @param commandId - Button/command ID
   * @param pressValue - Value to send on press
   * @param releaseValue - Value to send on release
   * @param delayMs - Delay between press and release (default: 100ms)
   */
  sendMomentary(
    deviceId: number,
    commandId: number,
    pressValue: number = 1,
    releaseValue: number = 0,
    delayMs: number = 100,
  ): void {
    this.sendCommand(deviceId, commandId, pressValue);
    setTimeout(() => {
      this.sendCommand(deviceId, commandId, releaseValue);
    }, delayMs);
  }
}
