# Icons

All icons used by the DCS F-4E Stream Deck plugin.

## Controls (`controls/`)

144x144 PNG icons for individual cockpit controls. Used in the bundled Stream Deck + profiles. Color-coded by category:

| Color | Category | Icons |
|-------|----------|-------|
| Red | Weapons | master-arm, gun-arm, weapon-select, delivery-mode, stations, jettison |
| Red | WRCS | bomb-qty, bomb-interval, drag-coeff, release-advance |
| Blue | Flight | gear, flaps |
| Green | HUD | hud-mode, hud-brightness |
| Amber | Warnings | master-caution |
| Maroon | Countermeasures | cm-dispense |
| Orange | Engine | engine-start, engine-l, engine-r |
| Yellow | Electrical | generator-l, generator-r, battery |
| Cyan | Navigation | tacan, tacan-10s, tacan-1s, ins-power |
| Purple | Radio | uhf-radio, uhf-volume |
| Dark Green | Radar | radar-gain |
| Gray | Status | status |

To regenerate: `node tools/generate-control-icons.js`

## Actions (`actions/`)

Icons for the 5 Stream Deck action types. These are referenced by `manifest.json` and must also exist inside `plugin/com.dcs.f4e.sdPlugin/assets/actions/`.

| Icon | Size | Purpose |
|------|------|---------|
| button / button@2x | 20 / 40 | Action list icon |
| button-off / @2x | 72 / 144 | Button off state |
| button-on / @2x | 72 / 144 | Button on state |
| switch / switch-off / @2x | varies | Switch action icons |
| encoder / @2x | 20 / 40 | Encoder action icon |
| radio / @2x | 20 / 40 | Radio action icon |
| status / status-off / status-on / @2x | varies | Connection status icons |
