-- DCS-ExportScripts Config.lua overrides for F-4E Stream Deck integration
-- Copy these settings into your existing Config.lua at:
--   %USERPROFILE%\Saved Games\DCS\Scripts\DCS-ExportScript\Config.lua
--
-- If you don't have DCS-ExportScripts installed, get it from:
--   https://github.com/s-d-a/DCS-ExportScripts

-- Enable Ikarus export (used by the Stream Deck plugin)
ExportScript.Config.IkarusExport    = true
ExportScript.Config.IkarusHost      = "127.0.0.1"
ExportScript.Config.IkarusPort      = 1625
ExportScript.Config.IkarusSeparator = ":"

-- Enable listener for receiving commands from Stream Deck
ExportScript.Config.Listener        = true
ExportScript.Config.ListenerPort    = 26027

-- Export intervals (seconds)
-- High priority: instrument readings, warning lights (20 Hz)
-- Low priority: switch positions, knob settings (2 Hz)
ExportScript.Config.ExportInterval          = 0.05   -- high priority
ExportScript.Config.ExportLowTickInterval   = 0.5    -- low priority
