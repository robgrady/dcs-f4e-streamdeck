/**
 * F-4E Phantom II DCS device IDs.
 *
 * These correspond to the device numbers in:
 *   Mods/aircraft/F-4E/Cockpit/Scripts/devices.lua
 *
 * Sourced from DCS-BIOS F-4E module (DCS-Skunkworks/dcs-bios).
 */

export enum F4EDevice {
  ICS = 2,
  ARC_164 = 3,
  IFF = 4,
  COUNTERMEASURES = 5,
  COCKPIT = 7,
  AFCS = 9,
  CLOCK = 11,
  RADAR_ALT = 12,
  AOA = 13,
  INS = 14,
  NAVIGATION = 16,
  LANDING_GEAR = 20,
  INDICATORS = 22,
  CANOPY = 23,
  ENGINE = 24,
  CONTROLS = 25,
  OXYGEN = 26,
  WEAPONS = 27,
  TURN_COORD = 29,
  HUD = 31,
  ACCELEROMETER = 35,
  CADC = 38,
  AIRSPEED = 39,
  BARO_ALT = 40,
  VVI = 41,
  ADI = 44,
  CNI = 45,
  EMERGENCY_ATT = 47,
  TACAN = 48,
  FLIGHT_DIRECTOR = 49,
  HSI = 50,
  RADAR = 52,
  BDHI = 53,
  COMPASS = 54,
  ELECTRICAL = 55,
  ATTITUDE_IND = 56,
  FUEL = 60,
  ARBCS = 62,
  TARGET_DESIG = 64,
}
