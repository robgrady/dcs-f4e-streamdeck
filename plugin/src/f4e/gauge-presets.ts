/**
 * Gauge preset definitions for the F-4E Phantom II.
 *
 * Each preset maps to one or more DCS draw argument IDs and defines
 * how to convert the raw 0.0–1.0 value into real-world units for
 * display on the Stream Deck + touch strip.
 *
 * Draw argument ranges sourced from:
 *   DCS F-4E cockpit instrument specifications
 *   Mods/aircraft/F-4E/Cockpit/Scripts/draw_args.lua
 */

export type GaugePreset = {
  /** Display label (e.g., "AIRSPEED") */
  label: string;
  /** Unit string (e.g., "KTS") */
  unit: string;
  /** Category for Property Inspector grouping */
  category: "flight" | "engine" | "fuel" | "systems";
  /** Draw argument IDs to monitor (usually 1, altitude uses 3) */
  argIds: number[];
  /** Convert raw DCS values (0.0–1.0) to real-world units */
  convert: (values: number[]) => number;
  /** Format the converted value for display */
  format: (value: number) => string;
  /** Minimum value for bar indicator range */
  min: number;
  /** Maximum value for bar indicator range */
  max: number;
  /** Hex color for the bar fill */
  barColor: string;
  /** Text color (defaults to #00FF00 green) */
  textColor?: string;
  /** Optional: warn (turn text red) when value exceeds this */
  warnAbove?: number;
  /** Optional: warn (turn text red) when value drops below this */
  warnBelow?: number;
};

/** Format helpers */
const int = (v: number) => Math.round(v).toString();
const fixed1 = (v: number) => v.toFixed(1);
const fixed2 = (v: number) => v.toFixed(2);
const heading = (v: number) => {
  const deg = Math.round(v) % 360;
  return deg.toString().padStart(3, "0");
};

export const GAUGE_PRESETS: Record<string, GaugePreset> = {
  // =========================================================================
  // FLIGHT INSTRUMENTS
  // =========================================================================

  airspeed: {
    label: "AIRSPEED",
    unit: "KTS",
    category: "flight",
    argIds: [102],
    // F-4E airspeed indicator: 0.0 = 0 kts, 1.0 ≈ 850 kts
    convert: ([v]) => v * 850,
    format: int,
    min: 0,
    max: 850,
    barColor: "#00CCFF",
  },

  mach: {
    label: "MACH",
    unit: "M",
    category: "flight",
    argIds: [103],
    // Mach dial: 0.0 = 0.0 M, 1.0 ≈ 2.5 M
    convert: ([v]) => v * 2.5,
    format: fixed2,
    min: 0,
    max: 2.5,
    barColor: "#00CCFF",
  },

  altitude: {
    label: "ALTITUDE",
    unit: "FT",
    category: "flight",
    argIds: [92, 93, 94],
    // Barometric altimeter: 3 separate digit drums
    // arg 92 = hundreds (0.0–0.9 → digit 0–9)
    // arg 93 = thousands (0.0–0.9 → digit 0–9)
    // arg 94 = ten-thousands (0.0–0.9 → digit 0–9)
    convert: ([hundreds, thousands, tenThousands]) => {
      const h = Math.round(hundreds * 10) * 100;
      const k = Math.round(thousands * 10) * 1000;
      const tk = Math.round(tenThousands * 10) * 10000;
      return h + k + tk;
    },
    format: int,
    min: 0,
    max: 80000,
    barColor: "#00CCFF",
  },

  vvi: {
    label: "VERT SPD",
    unit: "FPM",
    category: "flight",
    argIds: [90],
    // VVI: 0.0 = -6000 fpm, 0.5 = 0, 1.0 = +6000 fpm
    convert: ([v]) => (v - 0.5) * 12000,
    format: int,
    min: -6000,
    max: 6000,
    barColor: "#00CCFF",
  },

  aoa: {
    label: "AOA",
    unit: "\u03B1\u00B0", // α°
    category: "flight",
    argIds: [70],
    // AOA gauge: 0.0 = 0°, 1.0 ≈ 30° (approximate)
    convert: ([v]) => v * 30,
    format: fixed1,
    min: 0,
    max: 30,
    barColor: "#FFCC00",
    warnAbove: 20,
  },

  heading: {
    label: "HEADING",
    unit: "\u00B0", // °
    category: "flight",
    argIds: [668],
    // HSI compass: 0.0 = 0°, 1.0 = 360°
    convert: ([v]) => v * 360,
    format: heading,
    min: 0,
    max: 360,
    barColor: "#00CC66",
  },

  radar_alt: {
    label: "RAD ALT",
    unit: "FT",
    category: "flight",
    argIds: [73],
    // Radar altimeter: 0.0 = 0 ft, 1.0 ≈ 5000 ft
    convert: ([v]) => v * 5000,
    format: int,
    min: 0,
    max: 5000,
    barColor: "#00CC66",
    warnBelow: 200,
  },

  g_force: {
    label: "G-FORCE",
    unit: "G",
    category: "flight",
    argIds: [67],
    // Accelerometer: 0.0 = -3G, approximately 0.25 = 1G, 1.0 = +9G
    convert: ([v]) => v * 12 - 3,
    format: fixed1,
    min: -3,
    max: 9,
    barColor: "#FFCC00",
    warnAbove: 7,
    warnBelow: -1,
  },

  // =========================================================================
  // ENGINE INSTRUMENTS
  // =========================================================================

  rpm_l: {
    label: "RPM LEFT",
    unit: "%",
    category: "engine",
    argIds: [299],
    // Engine tachometer: 0.0 = 0%, 1.0 = 110%
    convert: ([v]) => v * 110,
    format: fixed1,
    min: 0,
    max: 110,
    barColor: "#FF8800",
    warnAbove: 103,
  },

  rpm_r: {
    label: "RPM RIGHT",
    unit: "%",
    category: "engine",
    argIds: [300],
    convert: ([v]) => v * 110,
    format: fixed1,
    min: 0,
    max: 110,
    barColor: "#FF8800",
    warnAbove: 103,
  },

  egt_l: {
    label: "EGT LEFT",
    unit: "\u00B0C", // °C
    category: "engine",
    argIds: [301],
    // Exhaust gas temperature: 0.0 = 0°C, 1.0 ≈ 1200°C
    convert: ([v]) => v * 1200,
    format: int,
    min: 0,
    max: 1200,
    barColor: "#FF8800",
    warnAbove: 650,
  },

  egt_r: {
    label: "EGT RIGHT",
    unit: "\u00B0C",
    category: "engine",
    argIds: [302],
    convert: ([v]) => v * 1200,
    format: int,
    min: 0,
    max: 1200,
    barColor: "#FF8800",
    warnAbove: 650,
  },

  nozzle_l: {
    label: "NOZZ LEFT",
    unit: "%",
    category: "engine",
    argIds: [303],
    // Nozzle position: 0.0 = closed, 1.0 = fully open
    convert: ([v]) => v * 100,
    format: int,
    min: 0,
    max: 100,
    barColor: "#FF8800",
  },

  nozzle_r: {
    label: "NOZZ RIGHT",
    unit: "%",
    category: "engine",
    argIds: [304],
    convert: ([v]) => v * 100,
    format: int,
    min: 0,
    max: 100,
    barColor: "#FF8800",
  },

  oil_press_l: {
    label: "OIL LEFT",
    unit: "PSI",
    category: "engine",
    argIds: [717],
    // Oil pressure: 0.0 = 0 PSI, 1.0 ≈ 100 PSI
    convert: ([v]) => v * 100,
    format: int,
    min: 0,
    max: 100,
    barColor: "#FF8800",
    warnBelow: 25,
  },

  oil_press_r: {
    label: "OIL RIGHT",
    unit: "PSI",
    category: "engine",
    argIds: [718],
    convert: ([v]) => v * 100,
    format: int,
    min: 0,
    max: 100,
    barColor: "#FF8800",
    warnBelow: 25,
  },

  // =========================================================================
  // FUEL
  // =========================================================================

  fuel_qty: {
    label: "FUEL QTY",
    unit: "LBS",
    category: "fuel",
    argIds: [723],
    // Fuel gauge tape: 0.0 = empty, 1.0 = full (≈13,400 lbs internal)
    convert: ([v]) => v * 13400,
    format: int,
    min: 0,
    max: 13400,
    barColor: "#00CC66",
    warnBelow: 2500,
  },

  fuel_flow_l: {
    label: "FF LEFT",
    unit: "PPH",
    category: "fuel",
    argIds: [297],
    // Fuel flow: 0.0 = 0, 1.0 ≈ 12000 PPH
    convert: ([v]) => v * 12000,
    format: int,
    min: 0,
    max: 12000,
    barColor: "#00CC66",
  },

  fuel_flow_r: {
    label: "FF RIGHT",
    unit: "PPH",
    category: "fuel",
    argIds: [298],
    convert: ([v]) => v * 12000,
    format: int,
    min: 0,
    max: 12000,
    barColor: "#00CC66",
  },

  // =========================================================================
  // SYSTEMS
  // =========================================================================

  hyd_pc1: {
    label: "HYD PC1",
    unit: "PSI",
    category: "systems",
    argIds: [212],
    // Hydraulic pressure: 0.0 = 0, 1.0 ≈ 3500 PSI
    convert: ([v]) => v * 3500,
    format: int,
    min: 0,
    max: 3500,
    barColor: "#00CC66",
    warnBelow: 1000,
  },

  hyd_pc2: {
    label: "HYD PC2",
    unit: "PSI",
    category: "systems",
    argIds: [210],
    convert: ([v]) => v * 3500,
    format: int,
    min: 0,
    max: 3500,
    barColor: "#00CC66",
    warnBelow: 1000,
  },

  hyd_utility: {
    label: "HYD UTIL",
    unit: "PSI",
    category: "systems",
    argIds: [211],
    convert: ([v]) => v * 3500,
    format: int,
    min: 0,
    max: 3500,
    barColor: "#00CC66",
    warnBelow: 1000,
  },
};
