/**
 * F-4E Phantom II cockpit control definitions.
 *
 * Maps control names to their DCS device IDs, command IDs,
 * and draw argument IDs for state monitoring.
 *
 * Command IDs sourced from DCS-BIOS F-4E module.
 * Draw argument IDs sourced from DCS-BIOS and draw_args.lua.
 */

import { F4EDevice } from "./devices.js";

/** Types of cockpit controls */
export type ControlType =
  | "momentary"
  | "toggle"
  | "rotary"
  | "multi-position"
  | "potentiometer";

/** Definition of a single cockpit control */
export interface ControlDef {
  /** Human-readable name */
  name: string;
  /** Short description */
  description: string;
  /** Cockpit seat: pilot or WSO */
  seat: "pilot" | "wso";
  /** DCS device ID */
  deviceId: F4EDevice;
  /** DCS command/button ID */
  commandId: number;
  /** Control interaction type */
  type: ControlType;
  /** Value sent on press/activation */
  pressValue: number;
  /** Value sent on release/deactivation */
  releaseValue: number;
  /** Draw argument ID to monitor for visual feedback */
  monitorArgId?: number;
  /** For multi-position: number of positions */
  positions?: number;
  /** For multi-position: position labels */
  positionLabels?: string[];
  /** Category for organizing in the UI */
  category: string;
}

// =============================================================================
// PILOT CONTROLS
// =============================================================================

// --- Weapons ---

export const PLT_MASTER_ARM: ControlDef = {
  name: "Master Arm",
  description: "Pilot Master Arm Switch",
  seat: "pilot",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3003,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 248,
  category: "Weapons",
};

export const PLT_GUN_ARM: ControlDef = {
  name: "Gun Arm",
  description: "Pilot Gun Station Arm Switch",
  seat: "pilot",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3004,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 261,
  category: "Weapons",
};

export const PLT_STATION_LO_ARM: ControlDef = {
  name: "Left Outboard Arm",
  description: "Pilot Left Outboard Station Arm",
  seat: "pilot",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3005,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 262,
  category: "Weapons",
};

export const PLT_STATION_LI_ARM: ControlDef = {
  name: "Left Inboard Arm",
  description: "Pilot Left Inboard Station Arm",
  seat: "pilot",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3006,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 263,
  category: "Weapons",
};

export const PLT_STATION_CENTER_ARM: ControlDef = {
  name: "Center Arm",
  description: "Pilot Center Station Arm",
  seat: "pilot",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3007,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 264,
  category: "Weapons",
};

export const PLT_STATION_RI_ARM: ControlDef = {
  name: "Right Inboard Arm",
  description: "Pilot Right Inboard Station Arm",
  seat: "pilot",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3008,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 265,
  category: "Weapons",
};

export const PLT_STATION_RO_ARM: ControlDef = {
  name: "Right Outboard Arm",
  description: "Pilot Right Outboard Station Arm",
  seat: "pilot",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3009,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 266,
  category: "Weapons",
};

export const PLT_DELIVERY_MODE: ControlDef = {
  name: "Delivery Mode",
  description: "Pilot Weapon Delivery Mode Knob",
  seat: "pilot",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3010,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 272,
  positions: 13,
  positionLabels: [
    "OFF",
    "OFF 1",
    "DIRECT",
    "TL",
    "TGT FIND",
    "DT",
    "DL",
    "OFFSET",
    "AGM-45",
    "LOFT",
    "O/S",
    "AGM-12",
    "LABS",
  ],
  category: "Weapons",
};

export const PLT_WEAPON_SELECT: ControlDef = {
  name: "Weapon Select",
  description: "Pilot Weapon Select Knob",
  seat: "pilot",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3011,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 273,
  positions: 8,
  positionLabels: [
    "OFF",
    "ARM",
    "TV",
    "RKT/DISP",
    "BOMB SINGLE",
    "BOMB PAIR",
    "BOMB TRAIN",
    "GUN",
  ],
  category: "Weapons",
};

export const PLT_GUN_RATE: ControlDef = {
  name: "Gun Rate",
  description: "Pilot Gun Rate Switch (HIGH/LOW)",
  seat: "pilot",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3012,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 278,
  category: "Weapons",
};

export const PLT_RADAR_MISSILE_CW: ControlDef = {
  name: "Radar Missile CW",
  description: "Pilot Radar Missile CW Switch",
  seat: "pilot",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3031,
  type: "multi-position",
  pressValue: 1,
  releaseValue: -1,
  monitorArgId: 347,
  positions: 3,
  positionLabels: ["CW OFF", "STANDBY", "CW ON"],
  category: "Weapons",
};

export const PLT_INTERLOCK: ControlDef = {
  name: "Interlock",
  description: "Pilot Interlock Switch",
  seat: "pilot",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3032,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 348,
  category: "Weapons",
};

export const PLT_FUZE_ARM: ControlDef = {
  name: "Fuze Arm",
  description: "Pilot Fuze Arm Selector",
  seat: "pilot",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3047,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 1221,
  positions: 5,
  positionLabels: ["SAFE", "NOSE", "TAIL", "NOSE & TAIL", "SAFE 2"],
  category: "Weapons",
};

export const PLT_JETTISON_SELECT: ControlDef = {
  name: "Jettison Select",
  description: "Pilot Selective Jettison Knob",
  seat: "pilot",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3048,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 1254,
  positions: 9,
  category: "Weapons",
};

export const PLT_JETTISON_PUSH: ControlDef = {
  name: "Jettison",
  description: "Pilot Selective Jettison Button",
  seat: "pilot",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3049,
  type: "momentary",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 1253,
  category: "Weapons",
};

export const PLT_STORES_EMERGENCY: ControlDef = {
  name: "Emergency Stores Release",
  description: "Pilot Emergency Stores Release",
  seat: "pilot",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3036,
  type: "momentary",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 965,
  category: "Weapons",
};

export const PLT_GROUND_SAFETY_OVERRIDE: ControlDef = {
  name: "Ground Safety Override",
  description: "Pilot Ground Safety Override Switch",
  seat: "pilot",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3137,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 281,
  category: "Weapons",
};

export const PLT_BOMB_QUANTITY: ControlDef = {
  name: "Bomb Quantity",
  description: "Pilot Bomb Quantity Selector",
  seat: "pilot",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3021,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 305,
  positions: 12,
  category: "Weapons",
};

export const PLT_MISSILE_REJECT: ControlDef = {
  name: "Missile Reject",
  description: "Pilot Missile Reject Switch",
  seat: "pilot",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3134,
  type: "multi-position",
  pressValue: 1,
  releaseValue: -1,
  monitorArgId: 2596,
  positions: 3,
  positionLabels: ["NORM", "REJECT L", "REJECT R"],
  category: "Weapons",
};

// --- Landing Gear & Flight ---

export const PLT_GEAR_LEVER: ControlDef = {
  name: "Landing Gear",
  description: "Pilot Landing Gear Lever",
  seat: "pilot",
  deviceId: F4EDevice.LANDING_GEAR,
  commandId: 3001,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 5,
  category: "Flight",
};

export const PLT_ANTI_SKID: ControlDef = {
  name: "Anti-Skid",
  description: "Pilot Anti-Skid Switch",
  seat: "pilot",
  deviceId: F4EDevice.LANDING_GEAR,
  commandId: 3002,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 63,
  category: "Flight",
};

export const PLT_DRAG_CHUTE: ControlDef = {
  name: "Drag Chute",
  description: "Pilot Drag Chute Deploy",
  seat: "pilot",
  deviceId: F4EDevice.LANDING_GEAR,
  commandId: 3009,
  type: "momentary",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 2767,
  category: "Flight",
};

export const PLT_DRAG_CHUTE_RELEASE: ControlDef = {
  name: "Drag Chute Release",
  description: "Pilot Drag Chute Release",
  seat: "pilot",
  deviceId: F4EDevice.LANDING_GEAR,
  commandId: 3010,
  type: "momentary",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 1516,
  category: "Flight",
};

export const PLT_ARRESTING_HOOK: ControlDef = {
  name: "Arresting Hook",
  description: "Pilot Arresting Hook Switch",
  seat: "pilot",
  deviceId: F4EDevice.LANDING_GEAR,
  commandId: 3021,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 974,
  category: "Flight",
};

export const PLT_FLAPS_SLATS: ControlDef = {
  name: "Flaps/Slats",
  description: "Pilot Flaps and Slats Lever",
  seat: "pilot",
  deviceId: F4EDevice.CONTROLS,
  commandId: 3005,
  type: "multi-position",
  pressValue: 1,
  releaseValue: -1,
  monitorArgId: 222,
  positions: 3,
  positionLabels: ["NORM", "OUT & DOWN", "EMER"],
  category: "Flight",
};

export const PLT_SPEED_BRAKE: ControlDef = {
  name: "Speed Brake",
  description: "Pilot Speed Brake Extension",
  seat: "pilot",
  deviceId: F4EDevice.CONTROLS,
  commandId: 3006,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 188,
  category: "Flight",
};

// --- AFCS (Autopilot) ---

export const PLT_STAB_AUG_YAW: ControlDef = {
  name: "Stab Aug Yaw",
  description: "Pilot Stability Augmentation Yaw",
  seat: "pilot",
  deviceId: F4EDevice.AFCS,
  commandId: 3010,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 1506,
  category: "Autopilot",
};

export const PLT_STAB_AUG_ROLL: ControlDef = {
  name: "Stab Aug Roll",
  description: "Pilot Stability Augmentation Roll",
  seat: "pilot",
  deviceId: F4EDevice.AFCS,
  commandId: 3012,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 1507,
  category: "Autopilot",
};

export const PLT_STAB_AUG_PITCH: ControlDef = {
  name: "Stab Aug Pitch",
  description: "Pilot Stability Augmentation Pitch",
  seat: "pilot",
  deviceId: F4EDevice.AFCS,
  commandId: 3014,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 1508,
  category: "Autopilot",
};

export const PLT_AUTOPILOT: ControlDef = {
  name: "Autopilot",
  description: "Pilot Autopilot Engage",
  seat: "pilot",
  deviceId: F4EDevice.AFCS,
  commandId: 3016,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 1509,
  category: "Autopilot",
};

export const PLT_ALT_HOLD: ControlDef = {
  name: "Altitude Hold",
  description: "Pilot Altitude Hold Engage",
  seat: "pilot",
  deviceId: F4EDevice.AFCS,
  commandId: 3018,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 1510,
  category: "Autopilot",
};

// --- Engine ---

export const PLT_ENGINE_START: ControlDef = {
  name: "Engine Start",
  description: "Pilot Engine Start Button",
  seat: "pilot",
  deviceId: F4EDevice.ENGINE,
  commandId: 3003,
  type: "momentary",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 294,
  category: "Engine",
};

export const PLT_ENGINE_MASTER_L: ControlDef = {
  name: "Engine Master L",
  description: "Pilot Left Engine Master Switch",
  seat: "pilot",
  deviceId: F4EDevice.ENGINE,
  commandId: 3001,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 292,
  category: "Engine",
};

export const PLT_ENGINE_MASTER_R: ControlDef = {
  name: "Engine Master R",
  description: "Pilot Right Engine Master Switch",
  seat: "pilot",
  deviceId: F4EDevice.ENGINE,
  commandId: 3002,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 293,
  category: "Engine",
};

export const PLT_ENGINE_FIRE_TEST: ControlDef = {
  name: "Fire Test",
  description: "Pilot Fire Test Button",
  seat: "pilot",
  deviceId: F4EDevice.ENGINE,
  commandId: 3012,
  type: "momentary",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 978,
  category: "Engine",
};

// --- Electrical ---

export const PLT_GENERATOR_L: ControlDef = {
  name: "Generator L",
  description: "Pilot Left Generator Switch",
  seat: "pilot",
  deviceId: F4EDevice.ELECTRICAL,
  commandId: 3002,
  type: "multi-position",
  pressValue: 1,
  releaseValue: -1,
  monitorArgId: 971,
  positions: 3,
  positionLabels: ["OFF", "ON", "EXT"],
  category: "Electrical",
};

export const PLT_GENERATOR_R: ControlDef = {
  name: "Generator R",
  description: "Pilot Right Generator Switch",
  seat: "pilot",
  deviceId: F4EDevice.ELECTRICAL,
  commandId: 3003,
  type: "multi-position",
  pressValue: 1,
  releaseValue: -1,
  monitorArgId: 972,
  positions: 3,
  positionLabels: ["OFF", "ON", "EXT"],
  category: "Electrical",
};

// --- Countermeasures ---

export const PLT_CM_FLARE_NORMAL: ControlDef = {
  name: "Flare Mode",
  description: "Pilot Flare Normal/Override Switch",
  seat: "pilot",
  deviceId: F4EDevice.COUNTERMEASURES,
  commandId: 3001,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 1417,
  category: "Countermeasures",
};

export const PLT_CM_CHAFF_BURST_COUNT: ControlDef = {
  name: "Chaff Burst Count",
  description: "Pilot Chaff Burst Count Selector",
  seat: "pilot",
  deviceId: F4EDevice.COUNTERMEASURES,
  commandId: 3014,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 1500,
  positions: 6,
  positionLabels: ["1", "2", "3", "4", "6", "8"],
  category: "Countermeasures",
};

export const PLT_CM_CHAFF_BURST_INTERVAL: ControlDef = {
  name: "Chaff Burst Interval",
  description: "Pilot Chaff Burst Interval Selector",
  seat: "pilot",
  deviceId: F4EDevice.COUNTERMEASURES,
  commandId: 3015,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 1501,
  positions: 4,
  positionLabels: ["0.1", "0.2", "0.3", "0.4"],
  category: "Countermeasures",
};

export const PLT_CM_CHAFF_SALVO_COUNT: ControlDef = {
  name: "Chaff Salvo Count",
  description: "Pilot Chaff Salvo Count Selector",
  seat: "pilot",
  deviceId: F4EDevice.COUNTERMEASURES,
  commandId: 3016,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 1502,
  positions: 5,
  positionLabels: ["1", "2", "4", "8", "C"],
  category: "Countermeasures",
};

export const PLT_CM_FLARE_BURST_COUNT: ControlDef = {
  name: "Flare Burst Count",
  description: "Pilot Flare Burst Count Selector",
  seat: "pilot",
  deviceId: F4EDevice.COUNTERMEASURES,
  commandId: 3018,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 1504,
  positions: 5,
  positionLabels: ["1", "2", "4", "8", "C"],
  category: "Countermeasures",
};

export const PLT_CM_FLARE_BURST_INTERVAL: ControlDef = {
  name: "Flare Burst Interval",
  description: "Pilot Flare Burst Interval Selector",
  seat: "pilot",
  deviceId: F4EDevice.COUNTERMEASURES,
  commandId: 3019,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 1505,
  positions: 5,
  positionLabels: ["3", "4", "6", "8", "10"],
  category: "Countermeasures",
};

export const WSO_CM_DISPENSE: ControlDef = {
  name: "CM Dispense",
  description: "WSO Countermeasures Dispense Button",
  seat: "wso",
  deviceId: F4EDevice.COUNTERMEASURES,
  commandId: 3013,
  type: "momentary",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 1447,
  category: "Countermeasures",
};

export const WSO_CM_CHAFF_MODE: ControlDef = {
  name: "Chaff Mode",
  description: "WSO Chaff Mode Selector",
  seat: "wso",
  deviceId: F4EDevice.COUNTERMEASURES,
  commandId: 3020,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 1444,
  positions: 4,
  positionLabels: ["OFF", "SGL", "MULT", "PROG"],
  category: "Countermeasures",
};

export const WSO_CM_FLARE_MODE: ControlDef = {
  name: "Flare Mode",
  description: "WSO Flare Mode Selector",
  seat: "wso",
  deviceId: F4EDevice.COUNTERMEASURES,
  commandId: 3021,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 1443,
  positions: 3,
  positionLabels: ["OFF", "SGL", "PROG"],
  category: "Countermeasures",
};

// --- Radio (ARC-164 UHF) ---

export const PLT_ARC164_FREQ_HUNDREDS: ControlDef = {
  name: "UHF Freq 100s",
  description: "Pilot UHF Frequency Hundreds Selector",
  seat: "pilot",
  deviceId: F4EDevice.ARC_164,
  commandId: 3025,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 1375,
  positions: 4,
  positionLabels: ["2", "3", "A", "T"],
  category: "Radio",
};

export const PLT_ARC164_FREQ_TENS: ControlDef = {
  name: "UHF Freq 10s",
  description: "Pilot UHF Frequency Tens Selector",
  seat: "pilot",
  deviceId: F4EDevice.ARC_164,
  commandId: 3009,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 134,
  positions: 10,
  category: "Radio",
};

export const PLT_ARC164_FREQ_ONES: ControlDef = {
  name: "UHF Freq 1s",
  description: "Pilot UHF Frequency Ones Selector",
  seat: "pilot",
  deviceId: F4EDevice.ARC_164,
  commandId: 3008,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 133,
  positions: 10,
  category: "Radio",
};

export const PLT_ARC164_FREQ_TENTHS: ControlDef = {
  name: "UHF Freq .1s",
  description: "Pilot UHF Frequency Tenths Selector",
  seat: "pilot",
  deviceId: F4EDevice.ARC_164,
  commandId: 3007,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 132,
  positions: 10,
  category: "Radio",
};

export const PLT_ARC164_FREQ_HUNDREDTHS: ControlDef = {
  name: "UHF Freq .01s",
  description: "Pilot UHF Frequency Hundredths Selector",
  seat: "pilot",
  deviceId: F4EDevice.ARC_164,
  commandId: 3006,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 131,
  positions: 4,
  positionLabels: ["00", "25", "50", "75"],
  category: "Radio",
};

export const PLT_ARC164_COMM_CHANNEL: ControlDef = {
  name: "UHF Preset Channel",
  description: "Pilot UHF Preset Channel Selector",
  seat: "pilot",
  deviceId: F4EDevice.ARC_164,
  commandId: 3005,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 123,
  positions: 18,
  category: "Radio",
};

export const PLT_ARC164_MODE: ControlDef = {
  name: "UHF Mode",
  description: "Pilot UHF Radio Mode",
  seat: "pilot",
  deviceId: F4EDevice.ARC_164,
  commandId: 3004,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 122,
  positions: 6,
  positionLabels: ["OFF", "T/R", "T/R+G", "ADF", "TEST", "GRD CMD"],
  category: "Radio",
};

export const PLT_ARC164_SQUELCH: ControlDef = {
  name: "UHF Squelch",
  description: "Pilot UHF Squelch Switch",
  seat: "pilot",
  deviceId: F4EDevice.ARC_164,
  commandId: 3024,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 1374,
  category: "Radio",
};

export const PLT_ARC164_VOLUME: ControlDef = {
  name: "UHF Volume",
  description: "Pilot UHF Volume Knob",
  seat: "pilot",
  deviceId: F4EDevice.ARC_164,
  commandId: 3003,
  type: "potentiometer",
  pressValue: 0.05,
  releaseValue: -0.05,
  monitorArgId: 121,
  category: "Radio",
};

// --- TACAN ---

export const PLT_TACAN_TENS: ControlDef = {
  name: "TACAN Channel 10s",
  description: "Pilot TACAN Channel Tens Selector",
  seat: "pilot",
  deviceId: F4EDevice.TACAN,
  commandId: 3003,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 641,
  positions: 13,
  category: "Navigation",
};

export const PLT_TACAN_ONES: ControlDef = {
  name: "TACAN Channel 1s",
  description: "Pilot TACAN Channel Ones Selector",
  seat: "pilot",
  deviceId: F4EDevice.TACAN,
  commandId: 3002,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 640,
  positions: 10,
  category: "Navigation",
};

export const PLT_TACAN_XY: ControlDef = {
  name: "TACAN X/Y",
  description: "Pilot TACAN X/Y Band Toggle",
  seat: "pilot",
  deviceId: F4EDevice.TACAN,
  commandId: 3004,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 654,
  category: "Navigation",
};

export const PLT_TACAN_MODE: ControlDef = {
  name: "TACAN Mode",
  description: "Pilot TACAN Mode Selector",
  seat: "pilot",
  deviceId: F4EDevice.TACAN,
  commandId: 3006,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 646,
  positions: 5,
  positionLabels: ["OFF", "REC", "T/R", "A/A REC", "A/A T/R"],
  category: "Navigation",
};

export const PLT_TACAN_VOLUME: ControlDef = {
  name: "TACAN Volume",
  description: "Pilot TACAN Volume Knob",
  seat: "pilot",
  deviceId: F4EDevice.TACAN,
  commandId: 3005,
  type: "potentiometer",
  pressValue: 0.05,
  releaseValue: -0.05,
  monitorArgId: 642,
  category: "Navigation",
};

// --- HUD ---

export const PLT_HUD_MODE: ControlDef = {
  name: "HUD Mode",
  description: "Pilot HUD Mode Selector",
  seat: "pilot",
  deviceId: F4EDevice.HUD,
  commandId: 3001,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 271,
  positions: 7,
  positionLabels: ["OFF", "STBY", "A/G", "A/A GUNS", "A/A MSL", "BIT", "NAV"],
  category: "HUD",
};

export const PLT_HUD_SHUTTER: ControlDef = {
  name: "HUD Shutter",
  description: "Pilot HUD Shutter Switch",
  seat: "pilot",
  deviceId: F4EDevice.HUD,
  commandId: 3004,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 1200,
  category: "HUD",
};

export const PLT_HUD_BRIGHTNESS: ControlDef = {
  name: "HUD Brightness",
  description: "Pilot HUD Brightness Knob",
  seat: "pilot",
  deviceId: F4EDevice.HUD,
  commandId: 3003,
  type: "potentiometer",
  pressValue: 0.05,
  releaseValue: -0.05,
  monitorArgId: 1201,
  category: "HUD",
};

// --- Fuel ---

export const PLT_FUEL_WING_INTERNAL_FEED: ControlDef = {
  name: "Wing Internal Feed",
  description: "Pilot Wing Internal Fuel Feed Switch",
  seat: "pilot",
  deviceId: F4EDevice.FUEL,
  commandId: 3004,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 710,
  category: "Fuel",
};

export const PLT_FUEL_EXTERNAL_TANKS: ControlDef = {
  name: "External Tanks Feed",
  description: "Pilot External Tanks Feed",
  seat: "pilot",
  deviceId: F4EDevice.FUEL,
  commandId: 3005,
  type: "multi-position",
  pressValue: 1,
  releaseValue: -1,
  monitorArgId: 711,
  positions: 3,
  positionLabels: ["OFF", "CTR", "OUTBD"],
  category: "Fuel",
};

export const PLT_FUEL_AIR_REFUEL: ControlDef = {
  name: "Air Refuel",
  description: "Pilot Air Refuel Switch",
  seat: "pilot",
  deviceId: F4EDevice.FUEL,
  commandId: 3006,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 712,
  category: "Fuel",
};

export const PLT_FUEL_DUMP: ControlDef = {
  name: "Fuel Dump",
  description: "Pilot Wing Fuel Dump Switch",
  seat: "pilot",
  deviceId: F4EDevice.FUEL,
  commandId: 3003,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 709,
  category: "Fuel",
};

// --- Warning/Caution ---

export const PLT_MASTER_CAUTION_RESET: ControlDef = {
  name: "Master Caution Reset",
  description: "Pilot Master Caution Reset Button",
  seat: "pilot",
  deviceId: F4EDevice.INDICATORS,
  commandId: 3001,
  type: "momentary",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 218,
  category: "Warnings",
};

export const PLT_WARN_LIGHT_TEST: ControlDef = {
  name: "Warning Light Test",
  description: "Pilot Warning/Caution Light Test",
  seat: "pilot",
  deviceId: F4EDevice.INDICATORS,
  commandId: 3002,
  type: "momentary",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 1354,
  category: "Warnings",
};

// --- Canopy ---

export const PLT_CANOPY: ControlDef = {
  name: "Canopy",
  description: "Pilot Canopy Open/Close",
  seat: "pilot",
  deviceId: F4EDevice.CANOPY,
  commandId: 3001,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 87,
  category: "Cockpit",
};

// --- Flight Director ---

export const PLT_FLIGHT_DIRECTOR: ControlDef = {
  name: "Flight Director",
  description: "Pilot Flight Director Switch",
  seat: "pilot",
  deviceId: F4EDevice.FLIGHT_DIRECTOR,
  commandId: 3003,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 665,
  category: "Navigation",
};

export const PLT_NAV_MODE: ControlDef = {
  name: "Nav Mode",
  description: "Pilot Navigation Mode Selector",
  seat: "pilot",
  deviceId: F4EDevice.FLIGHT_DIRECTOR,
  commandId: 3002,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 663,
  positions: 4,
  positionLabels: ["VOR/ILS", "TACAN", "NAV COMP", "FD OFF"],
  category: "Navigation",
};

// =============================================================================
// WSO CONTROLS
// =============================================================================

// --- Radar ---

export const WSO_RADAR_POWER: ControlDef = {
  name: "Radar Power",
  description: "WSO Radar Power Knob",
  seat: "wso",
  deviceId: F4EDevice.RADAR,
  commandId: 3004,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 336,
  positions: 5,
  positionLabels: ["OFF", "STBY", "OPR", "EMER", "TEST"],
  category: "Radar",
};

export const WSO_RADAR_RANGE: ControlDef = {
  name: "Radar Range",
  description: "WSO Radar Range Selector",
  seat: "wso",
  deviceId: F4EDevice.RADAR,
  commandId: 3005,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 337,
  positions: 6,
  positionLabels: ["AI 10", "AI 25", "AI 50", "AI 100", "AI 200", "BST"],
  category: "Radar",
};

export const WSO_RADAR_MODE: ControlDef = {
  name: "Radar Mode",
  description: "WSO Radar Mode Selector",
  seat: "wso",
  deviceId: F4EDevice.RADAR,
  commandId: 3007,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 339,
  positions: 6,
  positionLabels: ["NORM", "BEACON", "MAP", "VGND MAP", "A/G", "DSCG"],
  category: "Radar",
};

export const WSO_RADAR_DISPLAY: ControlDef = {
  name: "Radar Display",
  description: "WSO Radar Display Mode",
  seat: "wso",
  deviceId: F4EDevice.RADAR,
  commandId: 3006,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 338,
  positions: 5,
  positionLabels: ["B SWEEP", "B EXPAND", "PPI WIDE", "PPI NAR", "PPI EXP"],
  category: "Radar",
};

export const WSO_RADAR_SCAN: ControlDef = {
  name: "Radar Scan",
  description: "WSO Radar Scan Pattern",
  seat: "wso",
  deviceId: F4EDevice.RADAR,
  commandId: 3003,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 342,
  category: "Radar",
};

export const WSO_RADAR_ANTENNA_ELEVATION: ControlDef = {
  name: "Radar Antenna Elev",
  description: "WSO Radar Antenna Elevation",
  seat: "wso",
  deviceId: F4EDevice.RADAR,
  commandId: 3011,
  type: "rotary",
  pressValue: 0.05,
  releaseValue: -0.05,
  monitorArgId: 1014,
  category: "Radar",
};

export const WSO_RADAR_GAIN_FINE: ControlDef = {
  name: "Radar Gain Fine",
  description: "WSO Radar Fine Gain Knob",
  seat: "wso",
  deviceId: F4EDevice.RADAR,
  commandId: 3001,
  type: "potentiometer",
  pressValue: 0.05,
  releaseValue: -0.05,
  monitorArgId: 340,
  category: "Radar",
};

export const WSO_RADAR_GAIN_COARSE: ControlDef = {
  name: "Radar Gain Coarse",
  description: "WSO Radar Coarse Gain Knob",
  seat: "wso",
  deviceId: F4EDevice.RADAR,
  commandId: 3002,
  type: "potentiometer",
  pressValue: 0.05,
  releaseValue: -0.05,
  monitorArgId: 341,
  category: "Radar",
};

export const WSO_RADAR_PULSE: ControlDef = {
  name: "Radar Pulse",
  description: "WSO Radar Pulse Switch",
  seat: "wso",
  deviceId: F4EDevice.RADAR,
  commandId: 3013,
  type: "multi-position",
  pressValue: 1,
  releaseValue: -1,
  monitorArgId: 371,
  positions: 3,
  positionLabels: ["NORM", "SHORT", "LONG"],
  category: "Radar",
};

export const WSO_RADAR_TRACK: ControlDef = {
  name: "Radar Track",
  description: "WSO Radar Track Mode",
  seat: "wso",
  deviceId: F4EDevice.RADAR,
  commandId: 3022,
  type: "multi-position",
  pressValue: 1,
  releaseValue: -1,
  monitorArgId: 372,
  positions: 3,
  positionLabels: ["AUTO", "ANGLE", "MAN"],
  category: "Radar",
};

// --- INS ---

export const WSO_INS_POWER: ControlDef = {
  name: "INS Power",
  description: "WSO INS Power Knob",
  seat: "wso",
  deviceId: F4EDevice.INS,
  commandId: 3003,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 998,
  positions: 4,
  positionLabels: ["OFF", "STBY", "ALIGN", "NAV"],
  category: "Navigation",
};

// --- Navigation ---

export const WSO_NAV_MODE: ControlDef = {
  name: "Nav Computer Mode",
  description: "WSO Navigation Computer Mode",
  seat: "wso",
  deviceId: F4EDevice.NAVIGATION,
  commandId: 3001,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 900,
  positions: 5,
  positionLabels: ["TEST", "OFF", "STBY", "D1", "D2"],
  category: "Navigation",
};

// =============================================================================
// ADDITIONAL CONTROLS (from DCS-BIOS verification)
// =============================================================================

// --- Weapons (additional) ---

export const PLT_BOMB_INTERVAL: ControlDef = {
  name: "Bomb Interval",
  description: "Pilot Bomb Release Interval Selector",
  seat: "pilot",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3022,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 307,
  positions: 12,
  category: "Weapons",
};

export const PLT_BOMB_INTERVAL_MULT: ControlDef = {
  name: "Bomb Interval Mult",
  description: "Pilot Bomb Interval Multiplier",
  seat: "pilot",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3023,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 306,
  positions: 4,
  positionLabels: ["x1", "x10", "x100", "x1000"],
  category: "Weapons",
};

export const PLT_LABS_PULLUP_TEST: ControlDef = {
  name: "LABS Pull-Up Test",
  description: "Pilot LABS Pull-Up Light Test",
  seat: "pilot",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3072,
  type: "momentary",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 368,
  category: "Weapons",
};

// --- Landing Gear (additional) ---

export const PLT_GEAR_EMERGENCY: ControlDef = {
  name: "Emergency Gear Ext",
  description: "Pilot Landing Gear Emergency Extension",
  seat: "pilot",
  deviceId: F4EDevice.LANDING_GEAR,
  commandId: 3013,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 3045,
  category: "Flight",
};

export const PLT_EMERGENCY_BRAKE: ControlDef = {
  name: "Emergency Brake",
  description: "Pilot Emergency Wheel Brake",
  seat: "pilot",
  deviceId: F4EDevice.LANDING_GEAR,
  commandId: 3004,
  type: "momentary",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 343,
  category: "Flight",
};

// --- Radio (additional) ---

export const PLT_ARC164_ANTENNA: ControlDef = {
  name: "UHF Antenna",
  description: "Pilot Communication Antenna Selector",
  seat: "pilot",
  deviceId: F4EDevice.ARC_164,
  commandId: 3001,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 118,
  positions: 3,
  positionLabels: ["UPPER", "AUTO", "LOWER"],
  category: "Radio",
};

export const PLT_ARC164_AUX_CHANNEL: ControlDef = {
  name: "UHF AUX Channel",
  description: "Pilot AUX Channel Selector",
  seat: "pilot",
  deviceId: F4EDevice.ARC_164,
  commandId: 3011,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 136,
  positions: 20,
  category: "Radio",
};

export const PLT_ARC164_FREQ_MODE: ControlDef = {
  name: "UHF Freq Mode",
  description: "Pilot UHF Frequency Mode Selector",
  seat: "pilot",
  deviceId: F4EDevice.ARC_164,
  commandId: 3026,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 1376,
  positions: 3,
  positionLabels: ["MANUAL", "PRESET", "GUARD"],
  category: "Radio",
};

// --- TACAN (additional) ---

export const PLT_TACAN_TEST: ControlDef = {
  name: "TACAN Test",
  description: "Pilot TACAN Test Button",
  seat: "pilot",
  deviceId: F4EDevice.TACAN,
  commandId: 3007,
  type: "momentary",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 655,
  category: "Navigation",
};

// --- HUD (additional) ---

export const PLT_HUD_DEPRESSION: ControlDef = {
  name: "HUD Reticle Depress",
  description: "Pilot HUD Reticle Depression Knob",
  seat: "pilot",
  deviceId: F4EDevice.HUD,
  commandId: 3002,
  type: "potentiometer",
  pressValue: 0.05,
  releaseValue: -0.05,
  monitorArgId: 267,
  category: "HUD",
};

// --- Fuel (additional) ---

export const PLT_FUEL_REFUEL_SELECTOR: ControlDef = {
  name: "Refuel Selector",
  description: "Pilot Refuel Tank Selector",
  seat: "pilot",
  deviceId: F4EDevice.FUEL,
  commandId: 3002,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 706,
  positions: 4,
  positionLabels: ["ALL", "WING INT", "FUS", "WING EXT"],
  category: "Fuel",
};

// --- Canopy (additional) ---

export const PLT_CANOPY_MANUAL_UNLOCK: ControlDef = {
  name: "Canopy Manual Unlock",
  description: "Pilot Manual Canopy Unlock",
  seat: "pilot",
  deviceId: F4EDevice.CANOPY,
  commandId: 3002,
  type: "momentary",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 204,
  category: "Cockpit",
};

// --- Countermeasures (additional) ---

export const PLT_CM_CHAFF_SALVO_INTERVAL: ControlDef = {
  name: "Chaff Salvo Interval",
  description: "Pilot Chaff Salvo Interval Selector",
  seat: "pilot",
  deviceId: F4EDevice.COUNTERMEASURES,
  commandId: 3017,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 1503,
  positions: 4,
  positionLabels: ["1", "2", "3", "4"],
  category: "Countermeasures",
};

export const WSO_CM_RIPPLE: ControlDef = {
  name: "CM Ripple",
  description: "WSO Ripple Release Toggle",
  seat: "wso",
  deviceId: F4EDevice.COUNTERMEASURES,
  commandId: 3011,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 1445,
  category: "Countermeasures",
};

// --- Radar (additional WSO) ---

export const WSO_RADAR_ANTENNA_STAB: ControlDef = {
  name: "Radar Ant Stab",
  description: "WSO Radar Antenna Stabilization",
  seat: "wso",
  deviceId: F4EDevice.RADAR,
  commandId: 3016,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 1004,
  category: "Radar",
};

export const WSO_RADAR_MANEUVER: ControlDef = {
  name: "Radar Maneuver",
  description: "WSO Radar Maneuver Mode",
  seat: "wso",
  deviceId: F4EDevice.RADAR,
  commandId: 3019,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 1007,
  category: "Radar",
};

export const WSO_RADAR_POLARIZATION: ControlDef = {
  name: "Radar Polarization",
  description: "WSO Radar Polarization Switch",
  seat: "wso",
  deviceId: F4EDevice.RADAR,
  commandId: 3021,
  type: "multi-position",
  pressValue: 1,
  releaseValue: -1,
  monitorArgId: 1009,
  positions: 3,
  positionLabels: ["LIN", "CIRC", "LIN 2"],
  category: "Radar",
};

export const WSO_RADAR_VC: ControlDef = {
  name: "Radar Vc",
  description: "WSO Radar Vc Selector",
  seat: "wso",
  deviceId: F4EDevice.RADAR,
  commandId: 3017,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 1005,
  positions: 7,
  category: "Radar",
};

// --- INS (additional WSO) ---

export const WSO_INS_ALIGN_MODE: ControlDef = {
  name: "INS Align Mode",
  description: "WSO INS Alignment Mode Switch",
  seat: "wso",
  deviceId: F4EDevice.INS,
  commandId: 3002,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 997,
  positions: 3,
  positionLabels: ["STORED HDG", "GYRO", "MAG SLV"],
  category: "Navigation",
};

// --- Navigation (additional WSO) ---

export const WSO_NAV_POSITION_UPDATE: ControlDef = {
  name: "Position Update Mode",
  description: "WSO Position Update Mode Switch",
  seat: "wso",
  deviceId: F4EDevice.NAVIGATION,
  commandId: 3002,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 940,
  positions: 3,
  positionLabels: ["NORM", "FIX ENABLE", "FIX"],
  category: "Navigation",
};

// --- Cockpit (additional WSO) ---

export const WSO_CANOPY: ControlDef = {
  name: "Canopy (WSO)",
  description: "WSO Canopy Open/Close",
  seat: "wso",
  deviceId: F4EDevice.CANOPY,
  commandId: 3004,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 201,
  category: "Cockpit",
};

// --- Electrical (additional WSO) ---

export const WSO_BATTERY_BYPASS: ControlDef = {
  name: "Battery Bypass",
  description: "WSO Battery Bypass Switch",
  seat: "wso",
  deviceId: F4EDevice.ELECTRICAL,
  commandId: 3015,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 1028,
  category: "Electrical",
};

// --- Warnings (additional WSO) ---

export const WSO_WARN_LIGHT_TEST: ControlDef = {
  name: "Warning Light Test (WSO)",
  description: "WSO Warning/Caution Light Test",
  seat: "wso",
  deviceId: F4EDevice.INDICATORS,
  commandId: 3004,
  type: "momentary",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 2513,
  category: "Warnings",
};

// =============================================================================
// WSO RADIO (ARC-164 duplicate panel)
// =============================================================================

export const WSO_ARC164_MODE: ControlDef = {
  name: "UHF Mode (WSO)",
  description: "WSO UHF Radio Mode",
  seat: "wso",
  deviceId: F4EDevice.ARC_164,
  commandId: 3013,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 139,
  positions: 6,
  positionLabels: ["OFF", "T/R", "T/R+G", "ADF", "TEST", "GRD CMD"],
  category: "Radio",
};

export const WSO_ARC164_FREQ_MODE: ControlDef = {
  name: "UHF Freq Mode (WSO)",
  description: "WSO UHF Frequency Mode Selector",
  seat: "wso",
  deviceId: F4EDevice.ARC_164,
  commandId: 3031,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 1377,
  positions: 3,
  positionLabels: ["MANUAL", "PRESET", "GUARD"],
  category: "Radio",
};

export const WSO_ARC164_COMM_CHANNEL: ControlDef = {
  name: "UHF Preset Channel (WSO)",
  description: "WSO UHF Preset Channel Selector",
  seat: "wso",
  deviceId: F4EDevice.ARC_164,
  commandId: 3014,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 140,
  positions: 18,
  category: "Radio",
};

export const WSO_ARC164_VOLUME: ControlDef = {
  name: "UHF Volume (WSO)",
  description: "WSO UHF Volume Knob",
  seat: "wso",
  deviceId: F4EDevice.ARC_164,
  commandId: 3012,
  type: "potentiometer",
  pressValue: 0.05,
  releaseValue: -0.05,
  monitorArgId: 138,
  category: "Radio",
};

export const WSO_ARC164_SQUELCH: ControlDef = {
  name: "UHF Squelch (WSO)",
  description: "WSO UHF Squelch Switch",
  seat: "wso",
  deviceId: F4EDevice.ARC_164,
  commandId: 3029,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 1378,
  category: "Radio",
};

// =============================================================================
// WSO TACAN (duplicate panel)
// =============================================================================

export const WSO_TACAN_TENS: ControlDef = {
  name: "TACAN Ch 10s (WSO)",
  description: "WSO TACAN Channel Tens Selector",
  seat: "wso",
  deviceId: F4EDevice.TACAN,
  commandId: 3010,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 651,
  positions: 13,
  category: "Navigation",
};

export const WSO_TACAN_ONES: ControlDef = {
  name: "TACAN Ch 1s (WSO)",
  description: "WSO TACAN Channel Ones Selector",
  seat: "wso",
  deviceId: F4EDevice.TACAN,
  commandId: 3009,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 650,
  positions: 10,
  category: "Navigation",
};

export const WSO_TACAN_XY: ControlDef = {
  name: "TACAN X/Y (WSO)",
  description: "WSO TACAN X/Y Band Toggle",
  seat: "wso",
  deviceId: F4EDevice.TACAN,
  commandId: 3011,
  type: "toggle",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 656,
  category: "Navigation",
};

export const WSO_TACAN_MODE: ControlDef = {
  name: "TACAN Mode (WSO)",
  description: "WSO TACAN Mode Selector",
  seat: "wso",
  deviceId: F4EDevice.TACAN,
  commandId: 3013,
  type: "multi-position",
  pressValue: 0.1,
  releaseValue: -0.1,
  monitorArgId: 649,
  positions: 5,
  positionLabels: ["OFF", "REC", "T/R", "A/A REC", "A/A T/R"],
  category: "Navigation",
};

export const WSO_TACAN_VOLUME: ControlDef = {
  name: "TACAN Volume (WSO)",
  description: "WSO TACAN Volume Knob",
  seat: "wso",
  deviceId: F4EDevice.TACAN,
  commandId: 3012,
  type: "potentiometer",
  pressValue: 0.05,
  releaseValue: -0.05,
  monitorArgId: 652,
  category: "Navigation",
};

export const WSO_TACAN_TEST: ControlDef = {
  name: "TACAN Test (WSO)",
  description: "WSO TACAN Test Button",
  seat: "wso",
  deviceId: F4EDevice.TACAN,
  commandId: 3014,
  type: "momentary",
  pressValue: 1,
  releaseValue: 0,
  monitorArgId: 657,
  category: "Navigation",
};

// =============================================================================
// WRCS (Weapon Release Computer System) - WSO
// =============================================================================

export const PLT_WRCS_RELEASE_ADVANCE: ControlDef = {
  name: "Release Advance",
  description: "Pilot Release Advance Switch",
  seat: "pilot",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3024,
  type: "multi-position",
  pressValue: 1,
  releaseValue: -1,
  monitorArgId: 308,
  positions: 3,
  positionLabels: ["NORM", "STEP 1", "STEP 2"],
  category: "Weapons",
};

export const PLT_WRCS_BOMB_MODE: ControlDef = {
  name: "Bomb Mode",
  description: "Pilot Bomb Release Mode",
  seat: "pilot",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3025,
  type: "multi-position",
  pressValue: 1,
  releaseValue: -1,
  monitorArgId: 309,
  positions: 3,
  positionLabels: ["SGL", "PAIR", "SALVO"],
  category: "Weapons",
};

export const PLT_WRCS_DRAG_COEFF: ControlDef = {
  name: "Drag Coefficient",
  description: "WSO WRCS Drag Coefficient Knob",
  seat: "wso",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3026,
  type: "potentiometer",
  pressValue: 0.05,
  releaseValue: -0.05,
  monitorArgId: 310,
  category: "Weapons",
};

export const PLT_WRCS_ALT_RANGE: ControlDef = {
  name: "Altitude/Range",
  description: "WSO WRCS Altitude/Range Setting Knob",
  seat: "wso",
  deviceId: F4EDevice.WEAPONS,
  commandId: 3027,
  type: "potentiometer",
  pressValue: 0.05,
  releaseValue: -0.05,
  monitorArgId: 311,
  category: "Weapons",
};
