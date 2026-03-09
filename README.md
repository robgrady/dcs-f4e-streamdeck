# DCS F-4E Phantom II Stream Deck + Integration

Connect your Elgato Stream Deck + to DCS World's F-4E Phantom II cockpit.
Control switches, tune radios with the rotary dials, and see cockpit state
in real-time on your Stream Deck buttons.

## Features

- **120+ cockpit controls** mapped with verified device/command IDs
- **Rotary encoder support** for radio tuning, radar controls, volume knobs
- **Real-time state feedback** - buttons reflect actual cockpit switch positions
- **UHF radio frequency display** on the Stream Deck + touch strip
- **Connection status indicator** - see when DCS is connected
- **Preset system** - pick controls from a dropdown, no need to look up IDs
- **Advanced mode** - enter custom device/command IDs for any DCS control
- **Auto-activate** - Stream Deck profile switches when DCS.exe launches

## Architecture

```
Stream Deck +            Stream Deck Plugin            DCS World
  (Hardware)      <-->   (Node.js / UDP)        <-->   (Export.lua)
                         Port 1625 (receive)           F-4E-45MC.lua
  8 LCD Keys             Port 26027 (send)             DCS-ExportScripts
  4 Encoders
  Touch Strip
```

## Prerequisites

### Required Software

| Software | Version | Purpose | Download |
|----------|---------|---------|----------|
| **Windows** | 10+ | DCS is Windows-only | - |
| **DCS World** | Latest | Flight simulator | [digitalcombatsimulator.com](https://www.digitalcombatsimulator.com/) |
| **F-4E Phantom II** | Latest | Aircraft module (Heatblur) | DCS Module Manager |
| **Stream Deck Software** | 6.6+ | Elgato plugin host | [elgato.com](https://www.elgato.com/downloads) |
| **Node.js** | 20+ | Builds the plugin from source | [nodejs.org](https://nodejs.org/) |
| **DCS-ExportScripts** | Latest | Lua export framework | [GitHub](https://github.com/s-d-a/DCS-ExportScripts) |

### About Node.js

Node.js is needed to **build** the plugin from source (compile TypeScript, bundle, install dependencies). The Stream Deck software includes its own Node.js 20 runtime for **running** plugins, so you don't need Node.js in PATH after the initial build.

**Install Node.js:**
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the **LTS** version (20.x or newer)
3. Run the installer — accept defaults (this also installs npm)
4. Open a new Command Prompt and verify: `node --version` and `npm --version`

### About DCS-ExportScripts

DCS-ExportScripts is a Lua framework that runs inside DCS World and exports cockpit data over UDP. Our plugin reads that data and sends commands back.

**Install DCS-ExportScripts:**
1. Download from [GitHub releases](https://github.com/s-d-a/DCS-ExportScripts/releases)
2. Follow the [installation wiki](https://github.com/s-d-a/DCS-ExportScripts/wiki/Documentation-in-English)
3. The framework installs to:
   ```
   %USERPROFILE%\Saved Games\DCS\Scripts\DCS-ExportScript\
   ```

## Installation

### Quick Install (Automated)

Double-click `install.bat` — it checks prerequisites, builds the plugin, copies files, and installs everything.

### Manual Install

#### Step 1: Install the F-4E Export Module

Copy the Lua module to DCS-ExportScripts:

```cmd
copy lua\F-4E-45MC.lua "%USERPROFILE%\Saved Games\DCS\Scripts\DCS-ExportScript\ExportsModules\F-4E-45MC.lua"
```

> **Note:** If you use DCS Open Beta, replace `\DCS\` with `\DCS.openbeta\` in the path.

#### Step 2: Configure DCS-ExportScripts

Edit `%USERPROFILE%\Saved Games\DCS\Scripts\DCS-ExportScript\Config.lua` and ensure these settings are present:

```lua
ExportScript.Config.IkarusExport    = true
ExportScript.Config.IkarusHost      = "127.0.0.1"
ExportScript.Config.IkarusPort      = 1625
ExportScript.Config.IkarusSeparator = ":"
ExportScript.Config.Listener        = true
ExportScript.Config.ListenerPort    = 26027
```

If you don't have a `Config.lua` yet, copy the example:
```cmd
copy lua\Config-example.lua "%USERPROFILE%\Saved Games\DCS\Scripts\DCS-ExportScript\Config.lua"
```

#### Step 3: Build and Install the Stream Deck Plugin

Open Command Prompt (or PowerShell) in the project folder:

```cmd
cd plugin
npm install
npm run build
```

This does three things:
1. `npm install` — downloads TypeScript, Rollup, the Stream Deck SDK, and the Elgato CLI (build tools)
2. `rollup -c` — compiles TypeScript source into `com.dcs.f4e.sdPlugin/bin/plugin.js`
3. Installs the runtime dependency (`@elgato/streamdeck`) inside the `.sdPlugin` folder

Then copy the built plugin to the Stream Deck plugins folder:

```cmd
xcopy /E /I /Y com.dcs.f4e.sdPlugin "%APPDATA%\Elgato\StreamDeck\Plugins\com.dcs.f4e.sdPlugin"
```

**Alternative — Package as distributable:**
```cmd
npm run pack
```
This creates a `.streamDeckPlugin` file that can be double-clicked to install on any PC with Stream Deck software. No Node.js needed on the target machine.

#### Step 5: Restart & Configure

1. Restart the Stream Deck application
2. The **DCS World** category appears in the action list
3. Drag actions onto your Stream Deck layout:
   - **F-4E Button** — for toggles and momentary buttons (LCD keys)
   - **F-4E Multi-Position** — for multi-position selector knobs (LCD keys)
   - **F-4E Dial** — for rotary controls (encoder dials only)
   - **F-4E Radio Freq** — for UHF radio tuning (encoder dials only)
   - **F-4E Connection** — connection status indicator (LCD key)
4. Select a preset from the dropdown or enter custom IDs in Advanced mode

## Stream Deck + Layout Suggestion

```
+--------+--------+--------+--------+--------+--------+--------+--------+
| Master | Gear   | Flaps  | Weapon | HUD    | Master | CM     | Status |
| Arm    |        |        | Select | Mode   | Caution| Disp   |        |
+--------+--------+--------+--------+--------+--------+--------+--------+

  [UHF Radio]    [TACAN Ch]    [Radar Gain]   [HUD Bright]
   Dial 1          Dial 2        Dial 3         Dial 4
```

## Action Types

### F-4E Button (LCD Keys)
Momentary pushbuttons and toggle switches.
- **Momentary**: sends press value on key down, release value on key up
- **Toggle**: sends press value on key down only

### F-4E Multi-Position (LCD Keys)
Multi-position selector switches (weapon select, delivery mode, etc.).
Each press advances to the next position. The button title shows the
current position label.

### F-4E Dial (Encoders)
Rotary controls for the Stream Deck + dials.
- **Rotate**: sends increment/decrement commands
- **Push**: optional push action
- **Touch strip**: displays current value

### F-4E Radio Freq (Encoders)
Specialized radio frequency tuning.
- **Rotate**: changes the selected frequency digit
- **Push**: cycles between digit selection (100s, 10s, 1s, .1s, .01s)
- **Touch strip**: displays current frequency (e.g., "251.000")
- **Touch tap**: cycles through preset channels

## Development

### Testing Without DCS

Use the UDP test harness to simulate DCS export data:

```cmd
cd plugin
npm run test-harness
```

This sends mock F-4E cockpit data on port 1625 and logs any commands
received from the Stream Deck plugin on port 26027.

### Building

```cmd
cd plugin
npm install          :: First time — install all dependencies
npm run build        :: Build once (compile + bundle + runtime deps)
npm run watch        :: Watch mode (recompiles on file changes)
npm run dev          :: Build and restart Stream Deck plugin
npm run pack         :: Build and package as .streamDeckPlugin file
```

### Project Structure

```
dcs-f4e-streamdeck/
  install.bat                      # Automated Windows installer
  plugin/                          # Stream Deck plugin (TypeScript)
    package.json                   # Build dependencies and scripts
    tsconfig.json                  # TypeScript compiler config
    rollup.config.mjs              # Bundler config
    src/
      plugin.ts                    # Entry point
      dcs/                         # UDP communication layer
        udp-client.ts              #   Bind/send UDP sockets
        data-parser.ts             #   Parse ID=VALUE format
        state-store.ts             #   Reactive state cache
        command-sender.ts          #   Format and send DCS commands
      actions/                     # Stream Deck action handlers
        dcs-button-action.ts       #   Momentary/toggle buttons
        dcs-switch-action.ts       #   Multi-position switches
        dcs-encoder-action.ts      #   Rotary encoders
        dcs-radio-action.ts        #   UHF radio tuning
        dcs-status-action.ts       #   Connection status
      f4e/                         # F-4E control definitions
        devices.ts                 #   Device ID enum
        controls.ts                #   120+ control mappings
        presets.ts                 #   UI preset definitions
    com.dcs.f4e.sdPlugin/          # Plugin package (distributable)
      manifest.json                #   Plugin manifest
      package.json                 #   Runtime dependencies
      bin/plugin.js                #   Compiled plugin bundle
      node_modules/                #   Runtime: @elgato/streamdeck
      ui/                          #   Property Inspector HTML
      assets/                      #   Icons and layouts
  lua/                             # DCS Lua export module
    F-4E-45MC.lua                  #   F-4E export script
    Config-example.lua             #   Example DCS-ExportScripts config
  tools/                           # Development utilities
    udp-test-harness.ts            #   Mock DCS simulator
    extract-ids.md                 #   How to re-extract control IDs
```

## Troubleshooting

### Plugin doesn't appear in Stream Deck
- Make sure the plugin folder is at `%APPDATA%\Elgato\StreamDeck\Plugins\com.dcs.f4e.sdPlugin\`
- Verify it contains `bin/plugin.js`, `manifest.json`, and `node_modules/`
- Restart the Stream Deck application completely

### "No connection" status
- Verify DCS World is running with the F-4E loaded
- Check that DCS-ExportScripts is installed and `Config.lua` has the correct settings
- Ensure no firewall is blocking UDP ports 1625 and 26027 on localhost

### Controls don't respond
- Open the Property Inspector and verify a preset is selected
- Check that Advanced mode IDs match the current F-4E module version
- The F-4E is in Early Access — IDs may change with Heatblur updates

### Build errors
- Ensure Node.js 20+ is installed: `node --version`
- Delete `node_modules` and run `npm install` again
- Check TypeScript errors: `npx tsc --noEmit`

## Updating After F-4E Module Updates

The F-4E is in Early Access — Heatblur may change control IDs between updates.
If controls stop working after a DCS update:

1. See `tools/extract-ids.md` for how to re-extract IDs
2. Update `plugin/src/f4e/controls.ts` with corrected IDs
3. Update `lua/F-4E-45MC.lua` if draw argument numbers changed
4. Rebuild: `cd plugin && npm run build`
5. Restart Stream Deck

## Sharing & Distribution

To share with others:

```cmd
cd plugin
npm run pack
```

This creates a `.streamDeckPlugin` file. Recipients just need:
1. Stream Deck software 6.6+
2. DCS World with F-4E module
3. DCS-ExportScripts installed and configured

They double-click the `.streamDeckPlugin` file to install — no Node.js needed on their end.

## License

MIT
