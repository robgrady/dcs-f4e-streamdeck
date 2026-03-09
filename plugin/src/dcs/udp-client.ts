/**
 * UDP client for bidirectional communication with DCS World.
 *
 * Receives cockpit state data from DCS-ExportScripts on the Ikarus port (1625)
 * and sends cockpit commands to the DCS listener port (26027).
 */

import dgram from "node:dgram";
import { EventEmitter } from "node:events";

export interface UdpClientOptions {
  /** Port to receive DCS export data on (default: 1625) */
  receivePort: number;
  /** Host to send commands to (default: "127.0.0.1") */
  sendHost: string;
  /** Port to send commands to DCS listener (default: 26027) */
  sendPort: number;
}

const DEFAULT_OPTIONS: UdpClientOptions = {
  receivePort: 1625,
  sendHost: "127.0.0.1",
  sendPort: 26027,
};

export class UdpClient extends EventEmitter {
  private socket: dgram.Socket | null = null;
  private options: UdpClientOptions;
  private lastReceiveTime: number = 0;
  private _connected: boolean = false;

  constructor(options: Partial<UdpClientOptions> = {}) {
    super();
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /** Whether we've received data from DCS recently (within 5 seconds) */
  get connected(): boolean {
    return this._connected;
  }

  /** Start listening for DCS export data */
  start(): void {
    if (this.socket) return;

    this.socket = dgram.createSocket({ type: "udp4", reuseAddr: true });

    this.socket.on("message", (msg: Buffer) => {
      this.lastReceiveTime = Date.now();
      if (!this._connected) {
        this._connected = true;
        this.emit("connected");
      }
      this.emit("data", msg.toString("utf-8"));
    });

    this.socket.on("error", (err: Error) => {
      this.emit("error", err);
    });

    this.socket.on("listening", () => {
      const addr = this.socket!.address();
      this.emit("listening", addr);
    });

    this.socket.bind(this.options.receivePort);

    // Periodically check for connection timeout
    this.startConnectionMonitor();
  }

  /** Send a raw string message to DCS */
  send(message: string): void {
    if (!this.socket) return;
    const buf = Buffer.from(message, "utf-8");
    this.socket.send(
      buf,
      0,
      buf.length,
      this.options.sendPort,
      this.options.sendHost,
    );
  }

  /** Stop the UDP client */
  stop(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this._connected = false;
  }

  private connectionMonitorInterval: ReturnType<typeof setInterval> | null =
    null;

  private startConnectionMonitor(): void {
    this.connectionMonitorInterval = setInterval(() => {
      const elapsed = Date.now() - this.lastReceiveTime;
      if (this._connected && elapsed > 5000) {
        this._connected = false;
        this.emit("disconnected");
      }
    }, 2000);
  }
}
