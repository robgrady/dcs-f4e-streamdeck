/**
 * UDP Test Harness - Simulates DCS-ExportScripts output
 *
 * Sends mock F-4E cockpit data on port 1625 (Ikarus format)
 * and listens for incoming commands on port 26027.
 *
 * Usage:
 *   npx tsx tools/udp-test-harness.ts
 *
 * This allows testing the Stream Deck plugin without DCS running.
 */

import dgram from "node:dgram";

const EXPORT_PORT = 1625;
const LISTENER_PORT = 26027;
const TARGET_HOST = "127.0.0.1";

// ---------------------------------------------------------------------------
// Mock cockpit state
// ---------------------------------------------------------------------------
const state: Record<number, number> = {
  // Flight instruments
  102: 0.45,   // Airspeed
  91: 0.35,    // Altimeter needle
  92: 5,       // Baro hundreds
  93: 2,       // Baro thousands
  94: 1,       // Baro ten-thousands (12,500 ft)
  90: 0.02,    // VVI (slight climb)
  70: 0.3,     // AOA

  // ADI
  613: 0.5,    // Heading
  614: 0.0,    // Roll (wings level)
  615: 0.02,   // Pitch (slight nose up)

  // Engine
  299: 0.85,   // Tach L
  300: 0.85,   // Tach R
  301: 0.6,    // EGT L
  302: 0.6,    // EGT R

  // Fuel
  723: 0.7,    // Fuel gauge
  297: 0.4,    // Fuel flow L
  298: 0.4,    // Fuel flow R

  // Gear
  52: 0,       // Gear left (up)
  51: 0,       // Gear nose (up)
  50: 0,       // Gear right (up)
  5: 0,        // Gear lever (up)

  // Weapons
  248: 0,      // Master arm (off)
  247: 0,      // Master arm switch
  255: 0,      // Gun selected
  261: 0,      // Gun armed

  // Warnings
  218: 0,      // Master caution
  2547: 0,     // Fire L
  2548: 0,     // Fire R
  2571: 0,     // Fuel low

  // Countermeasures
  1414: 0,     // CM ON
  1415: 0,     // CM Flare

  // AFCS
  1506: 1,     // Stab aug yaw (on)
  1507: 1,     // Stab aug roll (on)
  1508: 1,     // Stab aug pitch (on)
  1509: 0,     // Autopilot (off)

  // HSI
  668: 0.75,   // Compass rotation
  670: 0.3,    // Course arrow
  672: 0.25,   // Heading bug

  // Radar
  336: 0.4,    // Radar power (OPR)
  337: 0.4,    // Radar range
};

// ---------------------------------------------------------------------------
// Create sender socket (simulates DCS export)
// ---------------------------------------------------------------------------
const sender = dgram.createSocket("udp4");

function buildExportPacket(): string {
  const pairs: string[] = [];
  for (const [id, value] of Object.entries(state)) {
    pairs.push(`${id}=${typeof value === "number" ? value.toFixed(4) : value}`);
  }

  // Add computed values
  pairs.push("2000= 251.000");    // UHF frequency
  pairs.push("2001=71X");          // TACAN channel
  pairs.push("2999=F-4E-45MC");    // Aircraft type

  return pairs.join(":");
}

function sendExportData(): void {
  const packet = buildExportPacket();
  const buf = Buffer.from(packet, "utf-8");
  sender.send(buf, 0, buf.length, EXPORT_PORT, TARGET_HOST);
}

// ---------------------------------------------------------------------------
// Create listener socket (receives commands from Stream Deck plugin)
// ---------------------------------------------------------------------------
const listener = dgram.createSocket({ type: "udp4", reuseAddr: true });

listener.on("message", (msg: Buffer, rinfo) => {
  const command = msg.toString("utf-8");
  console.log(`[CMD] ${command} (from ${rinfo.address}:${rinfo.port})`);

  // Parse and apply command: C<deviceId>,<commandId>,<value>
  const match = command.match(/^C(\d+),(\d+),([-\d.]+)$/);
  if (match) {
    const deviceId = parseInt(match[1]);
    const commandId = parseInt(match[2]);
    const value = parseFloat(match[3]);
    handleCommand(deviceId, commandId, value);
  }
});

listener.on("listening", () => {
  console.log(`[LISTENER] Listening for commands on port ${LISTENER_PORT}`);
});

listener.bind(LISTENER_PORT);

// ---------------------------------------------------------------------------
// Command handler - simulates cockpit response
// ---------------------------------------------------------------------------
function handleCommand(deviceId: number, commandId: number, value: number): void {
  // Weapons (device 27)
  if (deviceId === 27) {
    if (commandId === 3003) {
      // Master arm toggle
      state[247] = state[247] > 0.5 ? 0 : 1;
      state[248] = state[247]; // indicator follows switch
      console.log(`  -> Master Arm: ${state[247] > 0.5 ? "ARMED" : "SAFE"}`);
    }
  }

  // Landing gear (device 20)
  if (deviceId === 20) {
    if (commandId === 3001) {
      state[5] = state[5] > 0.5 ? 0 : 1;
      // Simulate gear transition
      const gearDown = state[5] > 0.5 ? 2 : 0;
      state[50] = gearDown;
      state[51] = gearDown;
      state[52] = gearDown;
      console.log(`  -> Landing Gear: ${gearDown === 2 ? "DOWN" : "UP"}`);
    }
  }

  // AFCS (device 9)
  if (deviceId === 9) {
    if (commandId === 3016) {
      state[1509] = state[1509] > 0.5 ? 0 : 1;
      console.log(`  -> Autopilot: ${state[1509] > 0.5 ? "ON" : "OFF"}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Simulation loop
// ---------------------------------------------------------------------------
console.log("===========================================");
console.log("  DCS F-4E UDP Test Harness");
console.log("===========================================");
console.log(`[EXPORT] Sending data to ${TARGET_HOST}:${EXPORT_PORT}`);
console.log(`[LISTENER] Waiting for commands on port ${LISTENER_PORT}`);
console.log("");
console.log("Simulating F-4E cockpit data...");
console.log("Press Ctrl+C to stop.");
console.log("");

// Send export data every 50ms (20 Hz, matching DCS-ExportScripts high priority)
setInterval(() => {
  // Slowly vary some instruments to simulate flight
  state[102] = 0.45 + Math.sin(Date.now() / 5000) * 0.02;  // Airspeed wobble
  state[615] = 0.02 + Math.sin(Date.now() / 8000) * 0.01;  // Pitch wobble
  state[90] = Math.sin(Date.now() / 6000) * 0.05;           // VVI oscillation
  state[668] = (state[668] + 0.0001) % 1.0;                 // Slow heading drift

  sendExportData();
}, 50);

// Print status every 5 seconds
setInterval(() => {
  const armed = state[248] > 0.5 ? "ARMED" : "SAFE";
  const gear = state[50] === 2 ? "DOWN" : "UP";
  const ap = state[1509] > 0.5 ? "ON" : "OFF";
  console.log(`[STATUS] MasterArm=${armed} Gear=${gear} AP=${ap} Fuel=${(state[723] * 100).toFixed(0)}%`);
}, 5000);
