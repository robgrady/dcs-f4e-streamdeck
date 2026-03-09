/**
 * Reactive cockpit state cache.
 *
 * Stores current values for all exported DCS arguments and notifies
 * subscribers when values change. Stream Deck actions subscribe to
 * specific argument IDs to update their display.
 */

import { parseExportData, type ExportData } from "./data-parser.js";

export type StateListener = (id: number, value: string) => void;

export class StateStore {
  private state: Map<number, string> = new Map();
  private listeners: Map<number, Set<StateListener>> = new Map();
  private globalListeners: Set<(data: ExportData) => void> = new Set();

  /**
   * Process a raw DCS-ExportScripts data packet.
   * Parses the data and updates internal state, notifying listeners on changes.
   */
  processRawData(raw: string): void {
    const data = parseExportData(raw);
    this.update(data);
  }

  /**
   * Update state from parsed export data.
   * Only notifies listeners when a value actually changes.
   */
  update(data: ExportData): void {
    for (const [id, value] of data) {
      const prev = this.state.get(id);
      this.state.set(id, value);

      if (prev !== value) {
        const idListeners = this.listeners.get(id);
        if (idListeners) {
          for (const fn of idListeners) {
            fn(id, value);
          }
        }
      }
    }

    // Notify global listeners
    if (this.globalListeners.size > 0) {
      for (const fn of this.globalListeners) {
        fn(data);
      }
    }
  }

  /** Get the current value for an argument ID */
  get(id: number): string | undefined {
    return this.state.get(id);
  }

  /** Get the current value as a number, or the fallback if not available */
  getNumber(id: number, fallback: number = 0): number {
    const val = this.state.get(id);
    if (val === undefined) return fallback;
    const num = parseFloat(val);
    return isNaN(num) ? fallback : num;
  }

  /**
   * Subscribe to changes for a specific argument ID.
   * Returns an unsubscribe function.
   */
  subscribe(id: number, listener: StateListener): () => void {
    if (!this.listeners.has(id)) {
      this.listeners.set(id, new Set());
    }
    this.listeners.get(id)!.add(listener);

    // Immediately notify with current value if available
    const current = this.state.get(id);
    if (current !== undefined) {
      listener(id, current);
    }

    return () => {
      this.listeners.get(id)?.delete(listener);
    };
  }

  /**
   * Subscribe to all data updates (called for every packet).
   * Returns an unsubscribe function.
   */
  subscribeAll(listener: (data: ExportData) => void): () => void {
    this.globalListeners.add(listener);
    return () => {
      this.globalListeners.delete(listener);
    };
  }

  /** Clear all stored state */
  clear(): void {
    this.state.clear();
  }
}
