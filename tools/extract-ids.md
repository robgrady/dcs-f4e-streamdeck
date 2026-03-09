# Extracting F-4E Control IDs from DCS

This guide explains how to extract the actual device IDs, button/command IDs,
and draw argument numbers from your local DCS World F-4E installation.

## Why Extract?

The F-4E module is under active development by Heatblur. Control IDs may
change between updates. If the preset controls stop working after a DCS
update, re-extract the IDs and update `plugin/src/f4e/devices.ts` and
`plugin/src/f4e/controls.ts`.

## Method 1: Manual Inspection

The cockpit control files are located at:

```
<DCS Install>\Mods\aircraft\F-4E\Cockpit\Scripts\
```

### Key Files

| File | Contains |
|------|----------|
| `devices.lua` | Device ID numbers (WEAPONS = 27, RADAR = 52, etc.) |
| `command_defs.lua` | Button/command ID numbers (3003, 3010, etc.) |
| `clickabledata.lua` | All clickable cockpit elements with device + button + value range |
| `mainpanel_init.lua` | Draw argument assignments for instrument panels |
| `draw_args.lua` | Complete draw argument reference with human-readable names |

### Example: Finding Master Arm

1. Open `devices.lua` and find: `WEAPONS = 27`
2. Open `command_defs.lua` and find the master arm command: `3003`
3. Open `draw_args.lua` and find the master arm indicator argument: `248`

## Method 2: dcs-clickabledata-extract Tool

1. Clone: https://github.com/charlestytler/dcs-clickabledata-extract
2. Edit `extract_module_main.lua`:
   - Set `DCS_INSTALL_PATH` to your DCS install directory
   - Set `MODULE_NAME` to `F-4E`
3. Run `LuaRunScript.exe`
4. Output: `F-4E_clickabledata.csv` with all control mappings

## Method 3: DCS-BIOS Control Reference

DCS-BIOS has F-4E support. Browse the interactive control reference:

1. Visit: https://dcsbios.com/
2. Select F-4E Phantom II
3. Browse controls by category
4. Note the device IDs, command IDs, and DCS-BIOS addresses

## Updating the Plugin

After extracting new IDs:

1. Update `plugin/src/f4e/devices.ts` with any new device IDs
2. Update `plugin/src/f4e/controls.ts` with corrected command IDs and draw arg IDs
3. Update `lua/F-4E-45MC.lua` with corrected draw argument numbers
4. Rebuild: `cd plugin && npm run build`
