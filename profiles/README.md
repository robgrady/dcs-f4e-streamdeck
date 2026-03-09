# Stream Deck + Profiles

## Bundled Profiles

Three pre-built profiles for the Stream Deck + are bundled with the plugin and auto-install when you first add it:

### F-4E Default
General-purpose layout for normal flight operations.

```
+--------+--------+--------+--------+--------+--------+--------+--------+
| MASTER | GEAR   | FLAPS  | WPN    | HUD    | MASTER | CM     | STATUS |
| ARM    |        |        | SEL    | MODE   | CAUT   | DISP   |        |
+--------+--------+--------+--------+--------+--------+--------+--------+

  [UHF RADIO]    [TACAN]      [RADAR GAIN]   [HUD BRIGHT]
```

### F-4E Weapons
Weapons delivery and stores management.

```
+--------+--------+--------+--------+--------+--------+--------+--------+
| MASTER | WPN    | DELIV  | GUN    | STA    | STA    | STA    | JETTI- |
| ARM    | SEL    | ERY    | ARM    | LI     | CTR    | RI     | SON    |
+--------+--------+--------+--------+--------+--------+--------+--------+

  [BOMB QTY]     [BOMB INTV]  [DRAG COEF]    [RELEASE ADV]
```

### F-4E Startup
Cold start / ramp start engine and systems bring-up.

```
+--------+--------+--------+--------+--------+--------+--------+--------+
| ENG    | ENG    | ENG    | GEN    | GEN    | BATT   | INS    | STATUS |
| START  | L      | R      | L      | R      | ERY    | PWR    |        |
+--------+--------+--------+--------+--------+--------+--------+--------+

  [UHF RADIO]    [UHF VOL]    [TACAN 10s]    [TACAN 1s]
```

## Where Profiles Live

The actual profile data lives inside the plugin package:

```
plugin/com.dcs.f4e.sdPlugin/
  F-4E Default.streamDeckProfile/
  F-4E Weapons.streamDeckProfile/
  F-4E Startup.streamDeckProfile/
```

They are registered in `manifest.json` under the `Profiles` array and installed automatically by the Stream Deck software.

## Customizing Profiles

All bundled profiles are **editable** — you can rearrange, add, or remove actions in the Stream Deck app. Your changes are saved as user modifications on top of the bundled profile.

To create your own profile from scratch:
1. Open Stream Deck app
2. Create a new profile
3. Drag F-4E actions from the action list onto the canvas
4. Select a preset from the dropdown in each action's settings

## Regenerating Profiles

If you modify the profile layouts in code:

```cmd
node tools/generate-profiles.js
```

This regenerates the `.streamDeckProfile` directories with new UUIDs. The icon images are embedded from `assets/controls/`.

To regenerate the control icons:

```cmd
node tools/generate-control-icons.js
```
