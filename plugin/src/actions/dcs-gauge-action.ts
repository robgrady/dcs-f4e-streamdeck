/**
 * Stream Deck + touch strip gauge readout action.
 *
 * Display-only action that shows live cockpit instrument readings on the
 * encoder touch strip. Subscribes to DCS draw argument IDs, converts raw
 * values to real-world units, and renders label + value + unit + bar.
 *
 * Users pick a gauge preset (Airspeed, Altitude, RPM, Fuel, etc.) from
 * the Property Inspector dropdown. Custom gauges are also supported by
 * entering a draw argument ID and conversion range manually.
 */

import {
  action,
  SingletonAction,
  type WillAppearEvent,
  type WillDisappearEvent,
  type DidReceiveSettingsEvent,
} from "@elgato/streamdeck";
import type { JsonValue } from "@elgato/streamdeck";
import type { StateStore } from "../dcs/state-store.js";
import { GAUGE_PRESETS, type GaugePreset } from "../f4e/gauge-presets.js";

/** Settings stored per gauge action instance */
export type GaugeSettings = {
  /** Preset key (e.g., "airspeed", "rpm_l") */
  preset?: string;
  /** Manual draw argument ID (when preset is empty/custom) */
  customArgId?: number;
  /** Manual display label */
  customLabel?: string;
  /** Manual unit string */
  customUnit?: string;
  /** Manual minimum for bar range */
  customMin?: number;
  /** Manual maximum for bar range */
  customMax?: number;
  [key: string]: JsonValue;
};

/** Feedback target on the touch strip layout */
type GaugeFeedback = {
  label: string;
  value: string;
  unit: string;
  indicator: { value: number; bar_fill_c?: string };
};

@action({ UUID: "com.dcs.f4e.gauge" })
export class DcsGaugeAction extends SingletonAction<GaugeSettings> {
  private unsubscribes = new Map<string, (() => void)[]>();

  constructor(private stateStore: StateStore) {
    super();
  }

  override async onWillAppear(
    ev: WillAppearEvent<GaugeSettings>,
  ): Promise<void> {
    this.setupGauge(ev.action.id, ev.action as any, ev.payload.settings);
  }

  override async onWillDisappear(
    ev: WillDisappearEvent<GaugeSettings>,
  ): Promise<void> {
    this.teardown(ev.action.id);
  }

  override async onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<GaugeSettings>,
  ): Promise<void> {
    this.teardown(ev.action.id);
    this.setupGauge(ev.action.id, ev.action as any, ev.payload.settings);
  }

  // ---------------------------------------------------------------------------
  // Internal
  // ---------------------------------------------------------------------------

  private teardown(actionId: string): void {
    const unsubs = this.unsubscribes.get(actionId);
    if (unsubs) {
      for (const fn of unsubs) fn();
    }
    this.unsubscribes.delete(actionId);
  }

  private setupGauge(
    actionId: string,
    actionRef: { setFeedback(fb: Record<string, unknown>): Promise<void> },
    settings: GaugeSettings,
  ): void {
    const presetKey = settings.preset as string | undefined;
    const preset = presetKey ? GAUGE_PRESETS[presetKey] : undefined;

    if (preset) {
      this.setupPresetGauge(actionId, actionRef, preset);
    } else if (settings.customArgId !== undefined) {
      this.setupCustomGauge(actionId, actionRef, settings);
    } else {
      // No configuration — show placeholder
      actionRef
        .setFeedback({
          label: "GAUGE",
          value: "---",
          unit: "",
          indicator: { value: 0 },
        })
        .catch(() => {});
    }
  }

  /**
   * Set up a preset gauge with proper conversion and formatting.
   */
  private setupPresetGauge(
    actionId: string,
    actionRef: { setFeedback(fb: Record<string, unknown>): Promise<void> },
    preset: GaugePreset,
  ): void {
    const unsubs: (() => void)[] = [];

    // For multi-arg presets (e.g., altitude uses 3 args), we track
    // the latest raw value per arg and recompute on any change.
    const rawValues = new Map<number, number>();

    const updateDisplay = () => {
      // Collect values in the order defined by argIds
      const values = preset.argIds.map(
        (id) => rawValues.get(id) ?? 0,
      );

      const converted = preset.convert(values);
      const displayValue = preset.format(converted);

      // Compute bar position as 0–100
      const range = preset.max - preset.min;
      const barValue = range > 0
        ? Math.max(0, Math.min(100, ((converted - preset.min) / range) * 100))
        : 0;

      // Determine text color (warn thresholds)
      let textColor = preset.textColor ?? "#00FF00";
      if (preset.warnAbove !== undefined && converted > preset.warnAbove) {
        textColor = "#FF3333";
      }
      if (preset.warnBelow !== undefined && converted < preset.warnBelow) {
        textColor = "#FF3333";
      }

      const feedback: Record<string, unknown> = {
        label: preset.label,
        value: { value: displayValue, color: textColor },
        unit: preset.unit,
        indicator: { value: Math.round(barValue), bar_fill_c: preset.barColor },
      };

      actionRef.setFeedback(feedback).catch(() => {});
    };

    // Subscribe to each draw argument
    for (const argId of preset.argIds) {
      const unsub = this.stateStore.subscribe(argId, (_id, value) => {
        const numVal = parseFloat(value);
        rawValues.set(argId, isNaN(numVal) ? 0 : numVal);
        updateDisplay();
      });
      unsubs.push(unsub);
    }

    // Set initial display
    actionRef
      .setFeedback({
        label: preset.label,
        value: "---",
        unit: preset.unit,
        indicator: { value: 0, bar_fill_c: preset.barColor },
      })
      .catch(() => {});

    this.unsubscribes.set(actionId, unsubs);
  }

  /**
   * Set up a custom gauge with user-specified arg ID and range.
   */
  private setupCustomGauge(
    actionId: string,
    actionRef: { setFeedback(fb: Record<string, unknown>): Promise<void> },
    settings: GaugeSettings,
  ): void {
    const argId = settings.customArgId as number;
    const label = (settings.customLabel as string) || "CUSTOM";
    const unit = (settings.customUnit as string) || "";
    const min = (settings.customMin as number) ?? 0;
    const max = (settings.customMax as number) ?? 1;

    const unsub = this.stateStore.subscribe(argId, (_id, value) => {
      const numVal = parseFloat(value);
      const displayValue = isNaN(numVal) ? value : numVal.toFixed(2);

      const range = max - min;
      const barValue = range > 0
        ? Math.max(0, Math.min(100, ((numVal - min) / range) * 100))
        : 0;

      actionRef
        .setFeedback({
          label,
          value: displayValue,
          unit,
          indicator: { value: Math.round(barValue) },
        })
        .catch(() => {});
    });

    // Set initial display
    actionRef
      .setFeedback({
        label,
        value: "---",
        unit,
        indicator: { value: 0 },
      })
      .catch(() => {});

    this.unsubscribes.set(actionId, [unsub]);
  }
}
