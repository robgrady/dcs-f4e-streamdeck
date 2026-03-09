/**
 * DCS F-4E Phantom II Stream Deck Plugin
 *
 * Entry point that wires together:
 * - UDP communication with DCS (via DCS-ExportScripts)
 * - Stream Deck action handlers (buttons, switches, encoders)
 * - F-4E cockpit state management
 */

import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { UdpClient } from "./dcs/udp-client.js";
import { StateStore } from "./dcs/state-store.js";
import { CommandSender } from "./dcs/command-sender.js";

import { DcsButtonAction } from "./actions/dcs-button-action.js";
import { DcsSwitchAction } from "./actions/dcs-switch-action.js";
import { DcsEncoderAction } from "./actions/dcs-encoder-action.js";
import { DcsRadioAction } from "./actions/dcs-radio-action.js";
import { DcsStatusAction } from "./actions/dcs-status-action.js";
import { DcsGaugeAction } from "./actions/dcs-gauge-action.js";

// ---------------------------------------------------------------------------
// Initialize DCS communication
// ---------------------------------------------------------------------------

const stateStore = new StateStore();

const udpClient = new UdpClient({
  receivePort: 1625,
  sendHost: "127.0.0.1",
  sendPort: 26027,
});

const commandSender = new CommandSender(udpClient);

// Wire UDP data to state store
udpClient.on("data", (raw: string) => {
  stateStore.processRawData(raw);
});

udpClient.on("connected", () => {
  streamDeck.logger.info("DCS connection established - receiving data");
});

udpClient.on("disconnected", () => {
  streamDeck.logger.info("DCS connection lost - no data received");
  stateStore.clear();
});

udpClient.on("error", (err: Error) => {
  streamDeck.logger.error(`UDP error: ${err.message}`);
});

// ---------------------------------------------------------------------------
// Register Stream Deck actions
// ---------------------------------------------------------------------------

streamDeck.actions.registerAction(
  new DcsButtonAction(commandSender, stateStore),
);
streamDeck.actions.registerAction(
  new DcsSwitchAction(commandSender, stateStore),
);
streamDeck.actions.registerAction(
  new DcsEncoderAction(commandSender, stateStore),
);
streamDeck.actions.registerAction(
  new DcsRadioAction(commandSender, stateStore),
);
streamDeck.actions.registerAction(
  new DcsStatusAction(udpClient, stateStore),
);
streamDeck.actions.registerAction(
  new DcsGaugeAction(stateStore),
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

// Start UDP listener
udpClient.start();
streamDeck.logger.info("DCS F-4E plugin started - listening on UDP port 1625");

// Connect to Stream Deck
streamDeck.connect();
