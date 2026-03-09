#!/usr/bin/env node
/**
 * Stream Deck + Profile Generator for DCS F-4E Plugin
 *
 * Generates .streamDeckProfile directories that can be bundled
 * inside the .sdPlugin folder. These profiles give users a
 * ready-made layout when they first install the plugin.
 *
 * Usage:
 *   node tools/generate-profiles.js
 *
 * Output:
 *   plugin/com.dcs.f4e.sdPlugin/F-4E Default.streamDeckProfile/
 *   plugin/com.dcs.f4e.sdPlugin/F-4E Weapons.streamDeckProfile/
 *   plugin/com.dcs.f4e.sdPlugin/F-4E Startup.streamDeckProfile/
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const OUTPUT_DIR = path.resolve(
  __dirname,
  "..",
  "plugin",
  "com.dcs.f4e.sdPlugin",
);

const ICONS_DIR = path.resolve(__dirname, "..", "icons", "controls");

// ---------------------------------------------------------------------------
// Icon embedding helper
// ---------------------------------------------------------------------------

/**
 * Load a control icon PNG and return as a data URI for embedding in profiles.
 * Returns undefined if icon file doesn't exist.
 */
function loadIconDataUri(iconName) {
  const iconPath = path.join(ICONS_DIR, `${iconName}.png`);
  if (fs.existsSync(iconPath)) {
    const data = fs.readFileSync(iconPath);
    return `data:image/png;base64,${data.toString("base64")}`;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// UUID helpers
// ---------------------------------------------------------------------------

function uuidV4() {
  const bytes = crypto.randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 1
  const hex = bytes.toString("hex");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

/**
 * Convert a UUID into the base32-like folder ID that Stream Deck uses.
 * The algorithm: take the hex digits, map each to A-V (base32 charset),
 * strip dashes, and append 'Z'.
 */
function profileFolderId(uuid) {
  const hex = uuid.replace(/-/g, "");
  const base32Chars = "ABCDEFGHIJKLMNOPQRSTUV";
  let result = "";
  for (const ch of hex) {
    result += base32Chars[parseInt(ch, 16)];
  }
  return result + "Z";
}

// ---------------------------------------------------------------------------
// Action builders
// ---------------------------------------------------------------------------

const ACTION_ID = "00000000-0000-0000-0000-000000000000";

/** Build a state object with optional embedded icon */
function makeState(title, alignment, iconName) {
  const state = {
    Title: title,
    ShowTitle: true,
    TitleAlignment: alignment || "bottom",
    FontSize: "9",
  };
  const image = iconName ? loadIconDataUri(iconName) : undefined;
  if (image) {
    state.Image = image;
  }
  return state;
}

/** Build a button action (for Keypad controller) */
function buttonAction(preset, title, mode = "toggle", iconName) {
  const numStates = mode === "toggle" ? 2 : 1;
  const states = [];
  for (let i = 0; i < numStates; i++) {
    states.push(makeState(title, "bottom", iconName));
  }
  return {
    ActionID: ACTION_ID,
    LinkedTitle: true,
    Name: "F-4E Button",
    Settings: { preset, mode },
    State: 0,
    States: states,
    UUID: "com.dcs.f4e.button",
  };
}

/** Build a multi-position switch action (for Keypad controller) */
function switchAction(preset, title, iconName) {
  return {
    ActionID: ACTION_ID,
    LinkedTitle: true,
    Name: "F-4E Multi-Position",
    Settings: { preset },
    State: 0,
    States: [makeState(title, "bottom", iconName)],
    UUID: "com.dcs.f4e.switch",
  };
}

/** Build a status action (for Keypad controller) */
function statusAction() {
  return {
    ActionID: ACTION_ID,
    LinkedTitle: true,
    Name: "F-4E Connection",
    Settings: {},
    State: 0,
    States: [
      makeState("STATUS", "middle", "status"),
      makeState("STATUS", "middle", "status"),
    ],
    UUID: "com.dcs.f4e.status",
  };
}

/** Build an encoder action (for Encoder controller) */
function encoderAction(preset, title, iconName) {
  return {
    ActionID: ACTION_ID,
    LinkedTitle: true,
    Name: "F-4E Dial",
    Settings: { preset },
    State: 0,
    States: [makeState(title, "bottom", iconName)],
    UUID: "com.dcs.f4e.encoder",
  };
}

/** Build a radio encoder action (for Encoder controller) */
function radioAction(title, iconName) {
  return {
    ActionID: ACTION_ID,
    LinkedTitle: true,
    Name: "F-4E Radio Freq",
    Settings: {},
    State: 0,
    States: [makeState(title, "bottom", iconName)],
    UUID: "com.dcs.f4e.radio",
  };
}

// ---------------------------------------------------------------------------
// Profile definitions
// ---------------------------------------------------------------------------

const PROFILES = [
  {
    name: "F-4E Default",
    keys: [
      buttonAction("plt_master_arm", "MASTER\nARM", "toggle", "master-arm"),
      buttonAction("plt_gear", "GEAR", "toggle", "gear"),
      switchAction("plt_flaps_slats", "FLAPS", "flaps"),
      switchAction("plt_weapon_select", "WPN SEL", "weapon-select"),
      switchAction("plt_hud_mode", "HUD MODE", "hud-mode"),
      buttonAction("plt_master_caution", "MASTER\nCAUT", "momentary", "master-caution"),
      buttonAction("wso_cm_dispense", "CM DISP", "momentary", "cm-dispense"),
      statusAction(),
    ],
    encoders: [
      radioAction("UHF RADIO", "uhf-radio"),
      encoderAction("plt_tacan_tens", "TACAN", "tacan"),
      encoderAction("wso_radar_gain_fine", "RADAR\nGAIN", "radar-gain"),
      encoderAction("plt_hud_brightness", "HUD\nBRIGHT", "hud-brightness"),
    ],
  },
  {
    name: "F-4E Weapons",
    keys: [
      buttonAction("plt_master_arm", "MASTER\nARM", "toggle", "master-arm"),
      switchAction("plt_weapon_select", "WPN SEL", "weapon-select"),
      switchAction("plt_delivery_mode", "DELIVERY", "delivery-mode"),
      buttonAction("plt_gun_arm", "GUN ARM", "toggle", "gun-arm"),
      buttonAction("plt_station_li", "STA LI", "toggle", "station-li"),
      buttonAction("plt_station_center", "STA CTR", "toggle", "station-ctr"),
      buttonAction("plt_station_ri", "STA RI", "toggle", "station-ri"),
      buttonAction("plt_jettison_push", "JETTISON", "momentary", "jettison"),
    ],
    encoders: [
      encoderAction("plt_bomb_quantity", "BOMB\nQTY", "bomb-qty"),
      encoderAction("plt_bomb_interval", "BOMB\nINTV", "bomb-interval"),
      encoderAction("plt_wrcs_drag_coeff", "DRAG\nCOEF", "drag-coeff"),
      encoderAction("plt_wrcs_release_advance", "RELEASE\nADV", "release-advance"),
    ],
  },
  {
    name: "F-4E Startup",
    keys: [
      buttonAction("plt_engine_start", "ENG\nSTART", "momentary", "engine-start"),
      buttonAction("plt_engine_master_l", "ENG L", "toggle", "engine-l"),
      buttonAction("plt_engine_master_r", "ENG R", "toggle", "engine-r"),
      buttonAction("plt_generator_l", "GEN L", "toggle", "generator-l"),
      buttonAction("plt_generator_r", "GEN R", "toggle", "generator-r"),
      buttonAction("wso_battery_bypass", "BATTERY", "toggle", "battery"),
      switchAction("wso_ins_power", "INS PWR", "ins-power"),
      statusAction(),
    ],
    encoders: [
      radioAction("UHF RADIO", "uhf-radio"),
      encoderAction("plt_uhf_volume", "UHF VOL", "uhf-volume"),
      encoderAction("plt_tacan_tens", "TACAN\n10s", "tacan-10s"),
      encoderAction("plt_tacan_ones", "TACAN\n1s", "tacan-1s"),
    ],
  },
];

// ---------------------------------------------------------------------------
// Profile directory generator
// ---------------------------------------------------------------------------

function generateProfile(profileDef) {
  const profileUuid = uuidV4();
  const folderId = profileFolderId(profileUuid);
  const dirName = `${profileDef.name}.streamDeckProfile`;
  const profileDir = path.join(OUTPUT_DIR, dirName);

  // Build keypad actions map
  const keypadActions = {};
  profileDef.keys.forEach((action, i) => {
    keypadActions[`${i},0`] = action;
  });

  // Build encoder actions map
  const encoderActions = {};
  profileDef.encoders.forEach((action, i) => {
    encoderActions[`${i},0`] = action;
  });

  // Profile-level manifest (inside Profiles/{folderId}/)
  const profileManifest = {
    Controllers: [
      {
        Actions: keypadActions,
        Type: "Keypad",
      },
      {
        Actions: encoderActions,
        Type: "Encoder",
      },
    ],
    Name: profileDef.name,
    UUID: profileUuid,
  };

  // Top-level manifest
  const topManifest = {
    Name: profileDef.name,
    Version: "2.0",
    Pages: {
      current: profileUuid,
      available: [profileUuid],
    },
  };

  // Clean up any existing profile directory (removes stale UUIDs from previous runs)
  if (fs.existsSync(profileDir)) {
    fs.rmSync(profileDir, { recursive: true, force: true });
  }

  // Create directory structure
  const profilesSubdir = path.join(profileDir, "Profiles", folderId);
  fs.mkdirSync(profilesSubdir, { recursive: true });

  // Write manifests
  fs.writeFileSync(
    path.join(profileDir, "manifest.json"),
    JSON.stringify(topManifest, null, 2) + "\n",
  );
  fs.writeFileSync(
    path.join(profilesSubdir, "manifest.json"),
    JSON.stringify(profileManifest, null, 2) + "\n",
  );

  console.log(`  Created: ${dirName}`);
  console.log(`    UUID: ${profileUuid}`);
  console.log(`    Folder: ${folderId}`);
  console.log(`    Keys: ${profileDef.keys.length}, Encoders: ${profileDef.encoders.length}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log("Generating Stream Deck + profiles for DCS F-4E...\n");

for (const profile of PROFILES) {
  generateProfile(profile);
  console.log();
}

console.log("Done! Profiles generated in:");
console.log(`  ${OUTPUT_DIR}`);
console.log();
console.log("Make sure the manifest.json Profiles array references these profiles.");
