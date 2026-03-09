/**
 * Named presets for the Stream Deck Property Inspector dropdown.
 *
 * Users can select a preset by name instead of entering raw device/button IDs.
 * Presets are grouped by category for the UI.
 */

import type { ControlDef } from "./controls.js";
import * as Controls from "./controls.js";

/** A preset entry with a unique key and its control definition */
export interface PresetEntry {
  key: string;
  control: ControlDef;
}

/** All available presets, keyed by unique identifier */
export const PRESETS: Record<string, ControlDef> = {
  // --- Weapons ---
  plt_master_arm: Controls.PLT_MASTER_ARM,
  plt_gun_arm: Controls.PLT_GUN_ARM,
  plt_station_lo: Controls.PLT_STATION_LO_ARM,
  plt_station_li: Controls.PLT_STATION_LI_ARM,
  plt_station_center: Controls.PLT_STATION_CENTER_ARM,
  plt_station_ri: Controls.PLT_STATION_RI_ARM,
  plt_station_ro: Controls.PLT_STATION_RO_ARM,
  plt_delivery_mode: Controls.PLT_DELIVERY_MODE,
  plt_weapon_select: Controls.PLT_WEAPON_SELECT,
  plt_gun_rate: Controls.PLT_GUN_RATE,
  plt_radar_missile_cw: Controls.PLT_RADAR_MISSILE_CW,
  plt_interlock: Controls.PLT_INTERLOCK,
  plt_fuze_arm: Controls.PLT_FUZE_ARM,
  plt_jettison_select: Controls.PLT_JETTISON_SELECT,
  plt_jettison_push: Controls.PLT_JETTISON_PUSH,
  plt_stores_emergency: Controls.PLT_STORES_EMERGENCY,
  plt_ground_safety: Controls.PLT_GROUND_SAFETY_OVERRIDE,
  plt_bomb_quantity: Controls.PLT_BOMB_QUANTITY,
  plt_bomb_interval: Controls.PLT_BOMB_INTERVAL,
  plt_bomb_interval_mult: Controls.PLT_BOMB_INTERVAL_MULT,
  plt_missile_reject: Controls.PLT_MISSILE_REJECT,
  plt_labs_pullup_test: Controls.PLT_LABS_PULLUP_TEST,
  plt_wrcs_release_advance: Controls.PLT_WRCS_RELEASE_ADVANCE,
  plt_wrcs_bomb_mode: Controls.PLT_WRCS_BOMB_MODE,
  plt_wrcs_drag_coeff: Controls.PLT_WRCS_DRAG_COEFF,
  plt_wrcs_alt_range: Controls.PLT_WRCS_ALT_RANGE,

  // --- Flight ---
  plt_gear: Controls.PLT_GEAR_LEVER,
  plt_gear_emergency: Controls.PLT_GEAR_EMERGENCY,
  plt_anti_skid: Controls.PLT_ANTI_SKID,
  plt_emergency_brake: Controls.PLT_EMERGENCY_BRAKE,
  plt_drag_chute: Controls.PLT_DRAG_CHUTE,
  plt_drag_chute_release: Controls.PLT_DRAG_CHUTE_RELEASE,
  plt_arresting_hook: Controls.PLT_ARRESTING_HOOK,
  plt_flaps_slats: Controls.PLT_FLAPS_SLATS,
  plt_speed_brake: Controls.PLT_SPEED_BRAKE,

  // --- Autopilot ---
  plt_stab_yaw: Controls.PLT_STAB_AUG_YAW,
  plt_stab_roll: Controls.PLT_STAB_AUG_ROLL,
  plt_stab_pitch: Controls.PLT_STAB_AUG_PITCH,
  plt_autopilot: Controls.PLT_AUTOPILOT,
  plt_alt_hold: Controls.PLT_ALT_HOLD,

  // --- Engine ---
  plt_engine_start: Controls.PLT_ENGINE_START,
  plt_engine_master_l: Controls.PLT_ENGINE_MASTER_L,
  plt_engine_master_r: Controls.PLT_ENGINE_MASTER_R,
  plt_fire_test: Controls.PLT_ENGINE_FIRE_TEST,

  // --- Electrical ---
  plt_generator_l: Controls.PLT_GENERATOR_L,
  plt_generator_r: Controls.PLT_GENERATOR_R,
  wso_battery_bypass: Controls.WSO_BATTERY_BYPASS,

  // --- Countermeasures ---
  plt_cm_flare_mode: Controls.PLT_CM_FLARE_NORMAL,
  plt_cm_chaff_burst_count: Controls.PLT_CM_CHAFF_BURST_COUNT,
  plt_cm_chaff_burst_interval: Controls.PLT_CM_CHAFF_BURST_INTERVAL,
  plt_cm_chaff_salvo_count: Controls.PLT_CM_CHAFF_SALVO_COUNT,
  plt_cm_chaff_salvo_interval: Controls.PLT_CM_CHAFF_SALVO_INTERVAL,
  plt_cm_flare_burst_count: Controls.PLT_CM_FLARE_BURST_COUNT,
  plt_cm_flare_burst_interval: Controls.PLT_CM_FLARE_BURST_INTERVAL,
  wso_cm_dispense: Controls.WSO_CM_DISPENSE,
  wso_cm_chaff_mode: Controls.WSO_CM_CHAFF_MODE,
  wso_cm_flare_mode: Controls.WSO_CM_FLARE_MODE,
  wso_cm_ripple: Controls.WSO_CM_RIPPLE,

  // --- Radio ---
  plt_uhf_freq_hundreds: Controls.PLT_ARC164_FREQ_HUNDREDS,
  plt_uhf_freq_tens: Controls.PLT_ARC164_FREQ_TENS,
  plt_uhf_freq_ones: Controls.PLT_ARC164_FREQ_ONES,
  plt_uhf_freq_tenths: Controls.PLT_ARC164_FREQ_TENTHS,
  plt_uhf_freq_hundredths: Controls.PLT_ARC164_FREQ_HUNDREDTHS,
  plt_uhf_channel: Controls.PLT_ARC164_COMM_CHANNEL,
  plt_uhf_aux_channel: Controls.PLT_ARC164_AUX_CHANNEL,
  plt_uhf_mode: Controls.PLT_ARC164_MODE,
  plt_uhf_freq_mode: Controls.PLT_ARC164_FREQ_MODE,
  plt_uhf_squelch: Controls.PLT_ARC164_SQUELCH,
  plt_uhf_volume: Controls.PLT_ARC164_VOLUME,
  plt_uhf_antenna: Controls.PLT_ARC164_ANTENNA,
  wso_uhf_mode: Controls.WSO_ARC164_MODE,
  wso_uhf_freq_mode: Controls.WSO_ARC164_FREQ_MODE,
  wso_uhf_channel: Controls.WSO_ARC164_COMM_CHANNEL,
  wso_uhf_volume: Controls.WSO_ARC164_VOLUME,
  wso_uhf_squelch: Controls.WSO_ARC164_SQUELCH,

  // --- Navigation ---
  plt_tacan_tens: Controls.PLT_TACAN_TENS,
  plt_tacan_ones: Controls.PLT_TACAN_ONES,
  plt_tacan_xy: Controls.PLT_TACAN_XY,
  plt_tacan_mode: Controls.PLT_TACAN_MODE,
  plt_tacan_volume: Controls.PLT_TACAN_VOLUME,
  plt_tacan_test: Controls.PLT_TACAN_TEST,
  plt_nav_mode: Controls.PLT_NAV_MODE,
  plt_flight_director: Controls.PLT_FLIGHT_DIRECTOR,
  wso_ins_power: Controls.WSO_INS_POWER,
  wso_ins_align: Controls.WSO_INS_ALIGN_MODE,
  wso_nav_mode: Controls.WSO_NAV_MODE,
  wso_nav_position_update: Controls.WSO_NAV_POSITION_UPDATE,
  wso_tacan_tens: Controls.WSO_TACAN_TENS,
  wso_tacan_ones: Controls.WSO_TACAN_ONES,
  wso_tacan_xy: Controls.WSO_TACAN_XY,
  wso_tacan_mode: Controls.WSO_TACAN_MODE,
  wso_tacan_volume: Controls.WSO_TACAN_VOLUME,
  wso_tacan_test: Controls.WSO_TACAN_TEST,

  // --- HUD ---
  plt_hud_mode: Controls.PLT_HUD_MODE,
  plt_hud_shutter: Controls.PLT_HUD_SHUTTER,
  plt_hud_brightness: Controls.PLT_HUD_BRIGHTNESS,
  plt_hud_depression: Controls.PLT_HUD_DEPRESSION,

  // --- Fuel ---
  plt_fuel_wing_internal: Controls.PLT_FUEL_WING_INTERNAL_FEED,
  plt_fuel_external_tanks: Controls.PLT_FUEL_EXTERNAL_TANKS,
  plt_fuel_air_refuel: Controls.PLT_FUEL_AIR_REFUEL,
  plt_fuel_dump: Controls.PLT_FUEL_DUMP,
  plt_fuel_refuel_selector: Controls.PLT_FUEL_REFUEL_SELECTOR,

  // --- Warnings ---
  plt_master_caution: Controls.PLT_MASTER_CAUTION_RESET,
  plt_warn_test: Controls.PLT_WARN_LIGHT_TEST,
  wso_warn_test: Controls.WSO_WARN_LIGHT_TEST,

  // --- Cockpit ---
  plt_canopy: Controls.PLT_CANOPY,
  plt_canopy_manual_unlock: Controls.PLT_CANOPY_MANUAL_UNLOCK,
  wso_canopy: Controls.WSO_CANOPY,

  // --- Radar ---
  wso_radar_power: Controls.WSO_RADAR_POWER,
  wso_radar_range: Controls.WSO_RADAR_RANGE,
  wso_radar_mode: Controls.WSO_RADAR_MODE,
  wso_radar_display: Controls.WSO_RADAR_DISPLAY,
  wso_radar_scan: Controls.WSO_RADAR_SCAN,
  wso_radar_antenna_elev: Controls.WSO_RADAR_ANTENNA_ELEVATION,
  wso_radar_antenna_stab: Controls.WSO_RADAR_ANTENNA_STAB,
  wso_radar_gain_fine: Controls.WSO_RADAR_GAIN_FINE,
  wso_radar_gain_coarse: Controls.WSO_RADAR_GAIN_COARSE,
  wso_radar_pulse: Controls.WSO_RADAR_PULSE,
  wso_radar_track: Controls.WSO_RADAR_TRACK,
  wso_radar_maneuver: Controls.WSO_RADAR_MANEUVER,
  wso_radar_polarization: Controls.WSO_RADAR_POLARIZATION,
  wso_radar_vc: Controls.WSO_RADAR_VC,
};

/**
 * Get all presets organized by category.
 * Returns a map of category name to array of preset entries.
 */
export function getPresetsByCategory(): Map<string, PresetEntry[]> {
  const categories = new Map<string, PresetEntry[]>();

  for (const [key, control] of Object.entries(PRESETS)) {
    const cat = control.category;
    if (!categories.has(cat)) {
      categories.set(cat, []);
    }
    categories.get(cat)!.push({ key, control });
  }

  return categories;
}

/**
 * Get presets filtered by control type (for matching to Stream Deck action types).
 */
export function getPresetsForActionType(
  actionType: "button" | "switch" | "encoder",
): PresetEntry[] {
  return Object.entries(PRESETS)
    .filter(([, control]) => {
      switch (actionType) {
        case "button":
          return (
            control.type === "momentary" || control.type === "toggle"
          );
        case "switch":
          return control.type === "multi-position";
        case "encoder":
          return (
            control.type === "rotary" ||
            control.type === "potentiometer" ||
            control.type === "multi-position"
          );
      }
    })
    .map(([key, control]) => ({ key, control }));
}
