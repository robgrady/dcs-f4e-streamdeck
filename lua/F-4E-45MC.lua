-- F-4E Phantom II Export Module for DCS-ExportScripts
-- Version: 0.2.0
-- Module name matches DCS internal identifier: F-4E-45MC
--
-- Install to:
--   %USERPROFILE%\Saved Games\DCS\Scripts\DCS-ExportScript\ExportsModules\F-4E-45MC.lua
--
-- Device IDs and draw arguments sourced from:
--   DCS-BIOS F-4E module (DCS-Skunkworks/dcs-bios)
--   Mods/aircraft/F-4E/Cockpit/Scripts/devices.lua
--   Mods/aircraft/F-4E/Cockpit/Scripts/clickabledata.lua
--   Mods/aircraft/F-4E/Cockpit/draw_args.lua
--
-- Protocol: Exports key=value pairs over UDP (Ikarus format)
--           Receives commands on listener port
--
-- Version: 1.0.0
-- License: MIT

ExportScript.FoundDCSModule = true
ExportScript.Version.F4E45MC = "1.0.0"

-- =============================================================================
-- Device IDs (from devices.lua / DCS-BIOS)
-- =============================================================================
local DEVICE = {
    ICS              = 2,
    ARC_164          = 3,
    IFF              = 4,
    COUNTERMEASURES  = 5,
    COCKPIT          = 7,
    AFCS             = 9,
    CLOCK            = 11,
    RADAR_ALT        = 12,
    AOA              = 13,
    INS              = 14,
    NAVIGATION       = 16,
    LANDING_GEAR     = 20,
    INDICATORS       = 22,
    CANOPY           = 23,
    ENGINE           = 24,
    CONTROLS         = 25,
    OXYGEN           = 26,
    WEAPONS          = 27,
    TURN_COORD       = 29,
    HUD              = 31,
    ACCELEROMETER    = 35,
    CADC             = 38,
    AIRSPEED         = 39,
    BARO_ALT         = 40,
    VVI              = 41,
    ADI              = 44,
    CNI              = 45,
    EMERGENCY_ATT    = 47,
    TACAN            = 48,
    FLIGHT_DIRECTOR  = 49,
    HSI              = 50,
    RADAR            = 52,
    BDHI             = 53,
    COMPASS          = 54,
    ELECTRICAL       = 55,
    ATTITUDE_IND     = 56,
    FUEL             = 60,
    ARBCS            = 62,
    TARGET_DESIG     = 64,
}

-- =============================================================================
-- HIGH FREQUENCY EXPORTS (every 0.05s / 20 Hz)
-- Instruments, warning lights, gauges - time-critical readings
-- Format: [draw_arg_id] = "export_id=format_string"
-- =============================================================================
ExportScript.ConfigEveryFrameArguments = {

    -- *** Flight Instruments ***
    [102] = "102=%.4f",   -- PLT Airspeed needle
    [103] = "103=%.4f",   -- PLT Mach dial
    [91]  = "91=%.4f",    -- PLT Barometric altimeter needle
    [92]  = "92=%.1f",    -- PLT Baro hundreds
    [93]  = "93=%.1f",    -- PLT Baro thousands
    [94]  = "94=%.1f",    -- PLT Baro ten-thousands
    [90]  = "90=%.4f",    -- PLT Vertical velocity indicator
    [70]  = "70=%.4f",    -- PLT AOA gauge needle
    [73]  = "73=%.4f",    -- PLT Radar altimeter needle

    -- *** ADI (Attitude Director Indicator) ***
    [613] = "613=%.4f",   -- PLT ADI heading
    [614] = "614=%.4f",   -- PLT ADI roll
    [615] = "615=%.4f",   -- PLT ADI pitch
    [616] = "616=%.4f",   -- PLT ADI roll steering bar
    [617] = "617=%.4f",   -- PLT ADI pitch steering bar
    [618] = "618=%.4f",   -- PLT ADI bank
    [619] = "619=%.4f",   -- PLT ADI glideslope

    -- *** HSI (Horizontal Situation Indicator) ***
    [668] = "668=%.4f",   -- PLT HSI compass rotation
    [669] = "669=%.4f",   -- PLT HSI bearing pointer
    [670] = "670=%.4f",   -- PLT HSI course arrow
    [671] = "671=%.4f",   -- PLT HSI course deviation
    [672] = "672=%.4f",   -- PLT HSI heading bug

    -- *** Turn Coordinator ***
    [420] = "420=%.4f",   -- PLT slip ball
    [421] = "421=%.4f",   -- PLT turn indicator

    -- *** Standby Attitude Indicator ***
    [625] = "625=%.4f",   -- PLT SAI pitch
    [626] = "626=%.4f",   -- PLT SAI roll

    -- *** Compass ***
    [80]  = "80=%.4f",    -- PLT compass heading
    [81]  = "81=%.4f",    -- PLT compass pitch
    [82]  = "82=%.4f",    -- PLT compass bank

    -- *** Engine Instruments ***
    [299] = "299=%.4f",   -- PLT Engine tachometer L (large)
    [2517]= "2517=%.4f",  -- PLT Engine tachometer L (small)
    [300] = "300=%.4f",   -- PLT Engine tachometer R (large)
    [2518]= "2518=%.4f",  -- PLT Engine tachometer R (small)
    [301] = "301=%.4f",   -- PLT Exhaust temp L
    [302] = "302=%.4f",   -- PLT Exhaust temp R
    [303] = "303=%.4f",   -- PLT Nozzle position L
    [304] = "304=%.4f",   -- PLT Nozzle position R
    [717] = "717=%.4f",   -- PLT Oil pressure L
    [718] = "718=%.4f",   -- PLT Oil pressure R
    [297] = "297=%.4f",   -- PLT Fuel flow L
    [298] = "298=%.4f",   -- PLT Fuel flow R

    -- *** Fuel ***
    [723] = "723=%.4f",   -- PLT Fuel gauge tape
    [713] = "713=%.1f",   -- PLT Fuel boost pump L
    [714] = "714=%.1f",   -- PLT Fuel boost pump R

    -- *** Hydraulics ***
    [212] = "212=%.4f",   -- PLT Hydraulic PC1
    [210] = "210=%.4f",   -- PLT Hydraulic PC2
    [211] = "211=%.4f",   -- PLT Hydraulic utility
    [86]  = "86=%.4f",    -- PLT Pneumatic gauge

    -- *** Accelerometer ***
    [67]  = "67=%.4f",    -- PLT G current
    [68]  = "68=%.4f",    -- PLT G low
    [69]  = "69=%.4f",    -- PLT G high

    -- *** AOA Indexer Lights ***
    [77]  = "77=%.1f",    -- PLT AOA indexer left low
    [78]  = "78=%.1f",    -- PLT AOA indexer left mid
    [79]  = "79=%.1f",    -- PLT AOA indexer left top
    [375] = "375=%.1f",   -- PLT AOA indexer right low
    [376] = "376=%.1f",   -- PLT AOA indexer right mid
    [377] = "377=%.1f",   -- PLT AOA indexer right top

    -- *** Landing Gear Indicators ***
    [52]  = "52=%.1f",    -- PLT Gear indicator left (0=up, 1=transit, 2=down)
    [51]  = "51=%.1f",    -- PLT Gear indicator nose
    [50]  = "50=%.1f",    -- PLT Gear indicator right
    [66]  = "66=%.1f",    -- PLT Gear lever light
    [65]  = "65=%.1f",    -- PLT Gear wheels light

    -- *** Warning/Caution/Advisory Panel ***
    [218] = "218=%.1f",   -- PLT Master caution
    [2547]= "2547=%.1f",  -- PLT Fire L
    [2548]= "2548=%.1f",  -- PLT Fire R
    [2549]= "2549=%.1f",  -- PLT Overheat L
    [2550]= "2550=%.1f",  -- PLT Overheat R
    [199] = "199=%.1f",   -- PLT Bus tie open
    [2551]= "2551=%.1f",  -- PLT Gen out L
    [2552]= "2552=%.1f",  -- PLT Gen out R
    [115] = "115=%.1f",   -- PLT Alt encoder out
    [208] = "208=%.1f",   -- PLT Canopy unlocked
    [2569]= "2569=%.1f",  -- PLT Autopilot pitch disengage
    [2579]= "2579=%.1f",  -- PLT Autopilot disengage
    [2570]= "2570=%.1f",  -- PLT Ext fuel L
    [2580]= "2580=%.1f",  -- PLT Ext fuel C
    [2587]= "2587=%.1f",  -- PLT Ext fuel R
    [2571]= "2571=%.1f",  -- PLT Fuel low
    [2581]= "2581=%.1f",  -- PLT Fuel filter check
    [2588]= "2588=%.1f",  -- PLT Radar on cool off
    [2591]= "2591=%.1f",  -- PLT Fire sys
    [2572]= "2572=%.1f",  -- PLT Anti ice L
    [2582]= "2582=%.1f",  -- PLT Anti ice R
    [114] = "114=%.1f",   -- PLT Static corr
    [2573]= "2573=%.1f",  -- PLT Aux air L
    [2583]= "2583=%.1f",  -- PLT Aux air R
    [2589]= "2589=%.1f",  -- PLT Speedbrake out
    [2574]= "2574=%.1f",  -- PLT Windshield temp
    [2584]= "2584=%.1f",  -- PLT Duct temp
    [220] = "220=%.1f",   -- PLT Hyd gauges
    [2575]= "2575=%.1f",  -- PLT Slats in
    [2585]= "2585=%.1f",  -- PLT Pitch aug off
    [2590]= "2590=%.1f",  -- PLT Cabin turb overspeed
    [2576]= "2576=%.1f",  -- PLT INS out
    [2586]= "2586=%.1f",  -- PLT Tank 7 full
    [238] = "238=%.1f",   -- PLT Oxygen low
    [2578]= "2578=%.1f",  -- PLT Hook down

    -- *** Weapon System Indicators ***
    [248] = "248=%.1f",   -- PLT Master arm indicator
    [255] = "255=%.1f",   -- PLT Gun selected
    [256] = "256=%.1f",   -- PLT Left outboard selected
    [257] = "257=%.1f",   -- PLT Left inboard selected
    [258] = "258=%.1f",   -- PLT Center selected
    [259] = "259=%.1f",   -- PLT Right inboard selected
    [260] = "260=%.1f",   -- PLT Right outboard selected
    [261] = "261=%.1f",   -- PLT Gun armed
    [262] = "262=%.1f",   -- PLT LO armed
    [263] = "263=%.1f",   -- PLT LI armed
    [264] = "264=%.1f",   -- PLT Center armed
    [265] = "265=%.1f",   -- PLT RI armed
    [266] = "266=%.1f",   -- PLT RO armed
    [274] = "274=%.1f",   -- PLT HU Gun indicator
    [279] = "279=%.1f",   -- PLT HU Radar indicator
    [280] = "280=%.1f",   -- PLT HU Heat indicator
    [367] = "367=%.1f",   -- PLT LABS pull-up light
    [373] = "373=%.1f",   -- PLT Radar in range
    [2530]= "2530=%.1f",  -- PLT Shoot HU L
    [2531]= "2531=%.1f",  -- PLT Shoot HU R
    [349] = "349=%.1f",   -- PLT CL tank aboard

    -- *** Radar Range Lights ***
    [2533]= "2533=%.1f",  -- PLT Radar 5 mile
    [2534]= "2534=%.1f",  -- PLT Radar 10 mile
    [2535]= "2535=%.1f",  -- PLT Radar 25 mile
    [2536]= "2536=%.1f",  -- PLT Radar 50 mile
    [2532]= "2532=%.1f",  -- PLT Radar hold alt

    -- *** Countermeasures Indicators ***
    [1414]= "1414=%.1f",  -- PLT CM ON light
    [1415]= "1415=%.1f",  -- PLT CM Flare light
    [1441]= "1441=%.1f",  -- WSO CM Chaff light
    [1442]= "1442=%.1f",  -- WSO CM Flare light

    -- *** Radar Altimeter Warning ***
    [85]  = "85=%.1f",    -- PLT Radar alt warning light
    [75]  = "75=%.1f",    -- PLT Radar alt off flag

    -- *** ADI Flags ***
    [620] = "620=%.1f",   -- PLT ADI course warning flag
    [621] = "621=%.1f",   -- PLT ADI glideslope warning flag
    [622] = "622=%.1f",   -- PLT ADI off warning flag

    -- *** Clock ***
    [800] = "800=%.4f",   -- PLT Clock hour hand
    [801] = "801=%.4f",   -- PLT Clock minute hand

    -- *** Air Refueling ***
    [2525]= "2525=%.1f",  -- PLT AAR ready
    [2526]= "2526=%.1f",  -- PLT AAR ext L full
    [2527]= "2527=%.1f",  -- PLT AAR ext C full
    [2528]= "2528=%.1f",  -- PLT AAR ext R full
    [2529]= "2529=%.1f",  -- PLT AAR disengaged

    -- *** WSO Warning Panel ***
    [219] = "219=%.1f",   -- WSO Master caution
    [209] = "209=%.1f",   -- WSO Canopy unlocked
    [2688]= "2688=%.1f",  -- WSO INS out
    [2689]= "2689=%.1f",  -- WSO Radar CNI cool off

    -- *** WSO Radar Indicators ***
    [1010]= "1010=%.1f",  -- WSO Radar skin track
    [2877]= "2877=%.1f",  -- WSO Radar H
    [2878]= "2878=%.1f",  -- WSO Radar T
    [2690]= "2690=%.1f",  -- WSO Radar A2A light
    [2626]= "2626=%.4f",  -- WSO Range rate needle
    [2741]= "2741=%.4f",  -- WSO Range thousands needle

    -- *** WSO Target Designator Lights ***
    [2715]= "2715=%.1f",  -- WSO TGT Stow light
    [2716]= "2716=%.1f",  -- WSO TGT Laser ready light
    [2717]= "2717=%.1f",  -- WSO TGT Power on light
    [2718]= "2718=%.1f",  -- WSO TGT WRCS out light
    [2719]= "2719=%.1f",  -- WSO TGT Go light
    [2720]= "2720=%.1f",  -- WSO TGT Malf light
    [2721]= "2721=%.1f",  -- WSO TGT Ovht light
    [2722]= "2722=%.1f",  -- WSO TGT INS out light
}

-- =============================================================================
-- LOW FREQUENCY EXPORTS (every 0.5s / 2 Hz)
-- Switch positions, knob settings - less time-critical
-- =============================================================================
ExportScript.ConfigArguments = {

    -- *** Weapon Panel Switches ***
    [247] = "247=%.1f",   -- PLT Master arm switch
    [249] = "249=%.1f",   -- PLT Gun arm
    [250] = "250=%.1f",   -- PLT LO arm
    [251] = "251=%.1f",   -- PLT LI arm
    [252] = "252=%.1f",   -- PLT Center arm
    [253] = "253=%.1f",   -- PLT RI arm
    [254] = "254=%.1f",   -- PLT RO arm
    [272] = "272=%.4f",   -- PLT Delivery mode
    [273] = "273=%.4f",   -- PLT Weapon select
    [278] = "278=%.1f",   -- PLT Gun rate
    [305] = "305=%.4f",   -- PLT Bomb quantity
    [306] = "306=%.1f",   -- PLT Bomb interval multiplier
    [307] = "307=%.4f",   -- PLT Bomb interval
    [347] = "347=%.1f",   -- PLT Radar missile CW
    [348] = "348=%.1f",   -- PLT Interlock
    [281] = "281=%.1f",   -- PLT Ground safety override
    [1221]= "1221=%.4f",  -- PLT Fuze arm
    [1254]= "1254=%.4f",  -- PLT Jettison select
    [1412]= "1412=%.1f",  -- PLT Gun rounds counter
    [2596]= "2596=%.1f",  -- PLT Missile reject

    -- *** Landing Gear ***
    [5]   = "5=%.1f",     -- PLT Gear lever
    [63]  = "63=%.1f",    -- PLT Anti-skid
    [974] = "974=%.1f",   -- PLT Arresting hook

    -- *** Control Surfaces ***
    [222] = "222=%.1f",   -- PLT Flaps/Slats
    [226] = "226=%.4f",   -- PLT Flaps indicator
    [225] = "225=%.4f",   -- PLT Slats indicator

    -- *** AFCS (Autopilot) ***
    [1506]= "1506=%.1f",  -- PLT Stab aug yaw
    [1507]= "1507=%.1f",  -- PLT Stab aug roll
    [1508]= "1508=%.1f",  -- PLT Stab aug pitch
    [1509]= "1509=%.1f",  -- PLT Autopilot
    [1510]= "1510=%.1f",  -- PLT Alt hold

    -- *** Engine ***
    [292] = "292=%.1f",   -- PLT Engine master L
    [293] = "293=%.1f",   -- PLT Engine master R
    [294] = "294=%.1f",   -- PLT Engine start

    -- *** Electrical ***
    [971] = "971=%.1f",   -- PLT Generator L
    [972] = "972=%.1f",   -- PLT Generator R

    -- *** Fuel ***
    [706] = "706=%.1f",   -- PLT Refuel selector
    [709] = "709=%.1f",   -- PLT Wing fuel dump
    [710] = "710=%.1f",   -- PLT Wing internal feed
    [711] = "711=%.1f",   -- PLT External tanks feed
    [712] = "712=%.1f",   -- PLT Air refuel

    -- *** HUD ***
    [271] = "271=%.4f",   -- PLT HUD mode
    [1200]= "1200=%.1f",  -- PLT HUD shutter
    [1201]= "1201=%.4f",  -- PLT HUD brightness

    -- *** Canopy ***
    [87]  = "87=%.4f",    -- PLT Canopy position
    [88]  = "88=%.4f",    -- WSO Canopy position

    -- *** Oxygen ***
    [234] = "234=%.1f",   -- PLT O2 flow
    [233] = "233=%.4f",   -- PLT O2 pressure
    [231] = "231=%.4f",   -- PLT O2 liters
    [235] = "235=%.1f",   -- PLT O2 mode
    [236] = "236=%.1f",   -- PLT O2 mixture
    [237] = "237=%.1f",   -- PLT O2 supply

    -- *** Radio (ARC-164) ***
    [118] = "118=%.1f",   -- PLT ARC-164 antenna selection
    [119] = "119=%.1f",   -- PLT ARC-164 comm command toggle
    [169] = "169=%.1f",   -- PLT ARC-164 comm command light
    [122] = "122=%.4f",   -- PLT ARC-164 mode
    [123] = "123=%.4f",   -- PLT ARC-164 comm channel
    [1374]= "1374=%.1f",  -- PLT ARC-164 squelch
    [1375]= "1375=%.4f",  -- PLT ARC-164 freq hundreds
    [134] = "134=%.4f",   -- PLT ARC-164 freq tens
    [133] = "133=%.4f",   -- PLT ARC-164 freq ones
    [132] = "132=%.4f",   -- PLT ARC-164 freq tenths
    [131] = "131=%.4f",   -- PLT ARC-164 freq hundredths
    [1376]= "1376=%.1f",  -- PLT ARC-164 freq mode
    [136] = "136=%.4f",   -- PLT ARC-164 aux channel

    -- *** TACAN ***
    [641] = "641=%.4f",   -- PLT TACAN tens
    [640] = "640=%.4f",   -- PLT TACAN ones
    [654] = "654=%.1f",   -- PLT TACAN X/Y
    [646] = "646=%.4f",   -- PLT TACAN mode
    [170] = "170=%.1f",   -- PLT TACAN command light
    [657] = "657=%.1f",   -- PLT TACAN test light

    -- *** Flight Director ***
    [662] = "662=%.4f",   -- PLT Nav input
    [663] = "663=%.4f",   -- PLT Nav mode
    [665] = "665=%.1f",   -- PLT Flight director

    -- *** Compass ***
    [955] = "955=%.4f",   -- PLT Compass mode/sync
    [366] = "366=%.1f",   -- PLT Compass gyro mode

    -- *** Countermeasures ***
    [1417]= "1417=%.1f",  -- PLT CM flare/normal
    [1500]= "1500=%.4f",  -- PLT CM chaff burst count
    [1501]= "1501=%.4f",  -- PLT CM chaff burst interval
    [1502]= "1502=%.4f",  -- PLT CM chaff salvo count
    [1503]= "1503=%.4f",  -- PLT CM chaff salvo interval
    [1504]= "1504=%.4f",  -- PLT CM flare burst count
    [1505]= "1505=%.4f",  -- PLT CM flare burst interval

    -- *** WSO Countermeasures ***
    [1444]= "1444=%.4f",  -- WSO CM chaff mode
    [1443]= "1443=%.4f",  -- WSO CM flare mode
    [1445]= "1445=%.1f",  -- WSO CM ripple
    [1446]= "1446=%.1f",  -- WSO CM ripple cover

    -- *** WSO Radar ***
    [336] = "336=%.4f",   -- WSO Radar power
    [337] = "337=%.4f",   -- WSO Radar range
    [338] = "338=%.4f",   -- WSO Radar display
    [339] = "339=%.4f",   -- WSO Radar mode
    [342] = "342=%.1f",   -- WSO Radar scan
    [371] = "371=%.1f",   -- WSO Radar pulse
    [372] = "372=%.1f",   -- WSO Radar track
    [1001]= "1001=%.4f",  -- WSO Radar meter mode
    [1004]= "1004=%.1f",  -- WSO Radar antenna stab
    [1005]= "1005=%.1f",  -- WSO Radar VC
    [1007]= "1007=%.1f",  -- WSO Radar maneuver
    [1008]= "1008=%.4f",  -- WSO Radar target aspect
    [1009]= "1009=%.1f",  -- WSO Radar polarization

    -- *** WSO INS ***
    [997] = "997=%.1f",   -- WSO INS align mode
    [998] = "998=%.4f",   -- WSO INS power
    [999] = "999=%.1f",   -- WSO INS align light
    [1000]= "1000=%.1f",  -- WSO INS heat light

    -- *** WSO Navigation ***
    [900] = "900=%.4f",   -- WSO Nav mode

    -- *** ICS ***
    [76]  = "76=%.4f",    -- PLT Intercom volume
    [1378]= "1378=%.1f",  -- PLT ICS mode
    [1409]= "1409=%.1f",  -- PLT ICS amplifier

    -- *** IFF ***
    [1322]= "1322=%.4f",  -- PLT IFF code
    [1521]= "1521=%.4f",  -- PLT IFF master

    -- *** HSI Source Indicators ***
    [684] = "684=%.1f",   -- PLT HSI NAV
    [685] = "685=%.1f",   -- PLT HSI DL L
    [686] = "686=%.1f",   -- PLT HSI ILS
    [687] = "687=%.1f",   -- PLT HSI MAN
    [688] = "688=%.1f",   -- PLT HSI TAC
    [689] = "689=%.1f",   -- PLT HSI TGT
    [690] = "690=%.1f",   -- PLT HSI UHF
    [691] = "691=%.1f",   -- PLT HSI DL R
}

-- =============================================================================
-- HIGH IMPORTANCE PROCESSING
-- Radio frequencies, computed values, custom data
-- Called at the high-frequency interval (0.05s)
-- =============================================================================
function ExportScript.ProcessIkarusDCSConfigHighImportance(mainPanelDevice)
    -- UHF Radio (ARC-164) frequency readout
    local lUHFRadio = GetDevice(DEVICE.ARC_164)
    if lUHFRadio then
        local freq = lUHFRadio:get_frequency()
        if freq then
            -- Export as MHz with 3 decimal places (e.g., "251.000")
            ExportScript.Tools.SendData(2000, string.format("%7.3f", freq / 1000000))
        end
    end

    -- TACAN channel readout (computed from selector positions)
    local lTacanTens = mainPanelDevice:get_argument_value(641)
    local lTacanOnes = mainPanelDevice:get_argument_value(640)
    local lTacanXY   = mainPanelDevice:get_argument_value(654)
    if lTacanTens and lTacanOnes then
        local tens = math.floor(lTacanTens * 12 + 0.5)  -- 0-12 range (13-step)
        local ones = math.floor(lTacanOnes * 9 + 0.5)   -- 0-9 range (10-step)
        local channel = tens * 10 + ones
        local band = "X"
        if lTacanXY and lTacanXY > 0.5 then
            band = "Y"
        end
        ExportScript.Tools.SendData(2001, string.format("%d%s", channel, band))
    end
end

-- =============================================================================
-- LOW IMPORTANCE PROCESSING
-- Additional state that needs special handling
-- Called at the low-frequency interval (0.5s)
-- =============================================================================
function ExportScript.ProcessIkarusDCSConfigLowImportance(mainPanelDevice)
    -- Aircraft type identifier (so the Stream Deck plugin knows which aircraft is loaded)
    ExportScript.Tools.SendData(2999, "F-4E-45MC")
end

-- =============================================================================
-- DAC processing functions (required by framework, used for Arcaze hardware)
-- Empty stubs since we're using Ikarus export for Stream Deck
-- =============================================================================
function ExportScript.ProcessDACConfigHighImportance(mainPanelDevice)
end

function ExportScript.ProcessDACConfigLowImportance(mainPanelDevice)
end
