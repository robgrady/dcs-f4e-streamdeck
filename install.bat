@echo off
setlocal enabledelayedexpansion

echo ============================================================
echo   DCS F-4E Phantom II - Stream Deck Plugin Installer
echo ============================================================
echo.

:: ---------------------------------------------------------------
:: 1. Check prerequisites
:: ---------------------------------------------------------------

echo [1/6] Checking prerequisites...

:: Check Node.js (needed for building from source)
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo  WARNING: Node.js is not installed or not in PATH.
    echo  Node.js 20+ is required to build the plugin from source.
    echo  Download from: https://nodejs.org/
    echo.
    echo  If you have a pre-built .streamDeckPlugin file, you can
    echo  skip Node.js and install that directly instead.
    echo.
    set /p CONTINUE="Continue anyway? (y/n): "
    if /i "!CONTINUE!" neq "y" exit /b 1
) else (
    for /f "tokens=*" %%v in ('node --version') do set NODE_VER=%%v
    echo  Node.js: !NODE_VER!
)

:: Check npm
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo  WARNING: npm not found. It usually ships with Node.js.
) else (
    for /f "tokens=*" %%v in ('npm --version') do set NPM_VER=%%v
    echo  npm:     !NPM_VER!
)

:: Check Stream Deck software
set SD_PLUGIN_DIR=%APPDATA%\Elgato\StreamDeck\Plugins
if not exist "%SD_PLUGIN_DIR%" (
    echo.
    echo  WARNING: Stream Deck plugin directory not found:
    echo  %SD_PLUGIN_DIR%
    echo  Make sure Elgato Stream Deck software v6.6+ is installed.
    echo.
    set /p CONTINUE="Continue anyway? (y/n): "
    if /i "!CONTINUE!" neq "y" exit /b 1
) else (
    echo  Stream Deck plugin dir: OK
)

:: Check DCS Saved Games folder
set DCS_DIR=%USERPROFILE%\Saved Games\DCS
if not exist "!DCS_DIR!" (
    set DCS_DIR=%USERPROFILE%\Saved Games\DCS.openbeta
    if not exist "!DCS_DIR!" (
        echo.
        echo  WARNING: DCS Saved Games folder not found.
        echo  Checked: %USERPROFILE%\Saved Games\DCS
        echo           %USERPROFILE%\Saved Games\DCS.openbeta
        echo  Make sure DCS World is installed and has been run once.
        echo.
        set /p DCS_DIR="Enter your DCS Saved Games path (or press Enter to skip): "
        if "!DCS_DIR!"=="" (
            echo  Skipping DCS-ExportScripts installation.
            goto :BUILD_PLUGIN
        )
    )
)
echo  DCS folder: !DCS_DIR!
echo.

:: ---------------------------------------------------------------
:: 2. Install DCS-ExportScripts (check if present)
:: ---------------------------------------------------------------

echo [2/6] Checking DCS-ExportScripts...

set EXPORT_DIR=!DCS_DIR!\Scripts\DCS-ExportScript
if not exist "!EXPORT_DIR!" (
    echo.
    echo  DCS-ExportScripts is NOT installed.
    echo  This plugin requires DCS-ExportScripts to communicate with DCS.
    echo.
    echo  Install it from: https://github.com/s-d-a/DCS-ExportScripts
    echo  Follow their wiki: https://github.com/s-d-a/DCS-ExportScripts/wiki
    echo.
    echo  After installing DCS-ExportScripts, run this installer again.
    echo.
    set /p CONTINUE="Continue without DCS-ExportScripts? (y/n): "
    if /i "!CONTINUE!" neq "y" exit /b 1
) else (
    echo  DCS-ExportScripts: Found
)
echo.

:: ---------------------------------------------------------------
:: 3. Copy F-4E Lua export module
:: ---------------------------------------------------------------

echo [3/6] Installing F-4E export module...

set MODULE_DIR=!EXPORT_DIR!\ExportsModules
if exist "!MODULE_DIR!" (
    copy /Y "%~dp0lua\F-4E-45MC.lua" "!MODULE_DIR!\F-4E-45MC.lua" >nul 2>&1
    if !errorlevel! equ 0 (
        echo  Copied F-4E-45MC.lua to: !MODULE_DIR!
    ) else (
        echo  WARNING: Could not copy F-4E-45MC.lua. Copy manually:
        echo    FROM: %~dp0lua\F-4E-45MC.lua
        echo    TO:   !MODULE_DIR!\F-4E-45MC.lua
    )
) else (
    echo  ExportsModules dir not found. Skipping Lua module install.
    echo  You'll need to copy lua\F-4E-45MC.lua manually.
)

:: Check Config.lua
set CONFIG_FILE=!EXPORT_DIR!\Config.lua
if exist "!CONFIG_FILE!" (
    findstr /i "IkarusPort" "!CONFIG_FILE!" >nul 2>&1
    if !errorlevel! neq 0 (
        echo.
        echo  NOTE: Your Config.lua may need these settings added:
        echo    ExportScript.Config.IkarusExport    = true
        echo    ExportScript.Config.IkarusPort      = 1625
        echo    ExportScript.Config.Listener        = true
        echo    ExportScript.Config.ListenerPort    = 26027
        echo  See lua\Config-example.lua for a complete example.
    )
) else (
    echo.
    echo  No Config.lua found. Copying example config...
    copy /Y "%~dp0lua\Config-example.lua" "!CONFIG_FILE!" >nul 2>&1
    if !errorlevel! equ 0 (
        echo  Created Config.lua from example. Review and adjust as needed.
    )
)
echo.

:: ---------------------------------------------------------------
:: 4. Build plugin from source
:: ---------------------------------------------------------------

:BUILD_PLUGIN
echo [4/6] Building Stream Deck plugin...

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  Skipping build - Node.js not found.
    goto :INSTALL_PLUGIN
)

cd /d "%~dp0plugin"

echo  Installing build dependencies...
call npm install 2>&1
if !errorlevel! neq 0 (
    echo  ERROR: npm install failed. Check Node.js installation.
    goto :INSTALL_PLUGIN
)

echo  Compiling TypeScript and bundling...
call npm run build 2>&1
if !errorlevel! neq 0 (
    echo  ERROR: Build failed. See errors above.
    goto :INSTALL_PLUGIN
)

echo  Installing plugin runtime dependencies...
cd /d "%~dp0plugin\com.dcs.f4e.sdPlugin"
call npm install --omit=dev 2>&1
if !errorlevel! neq 0 (
    echo  ERROR: Runtime dependency install failed.
    goto :INSTALL_PLUGIN
)

echo  Build complete!
echo.

:: ---------------------------------------------------------------
:: 5. Install to Stream Deck
:: ---------------------------------------------------------------

:INSTALL_PLUGIN
echo [5/6] Installing Stream Deck plugin...

set SD_DEST=%SD_PLUGIN_DIR%\com.dcs.f4e.sdPlugin

if exist "!SD_DEST!" (
    echo  Removing existing plugin installation...
    rmdir /s /q "!SD_DEST!" 2>nul
)

:: Copy plugin to Stream Deck plugins folder
echo  Copying plugin to Stream Deck plugins folder...
xcopy /E /I /Y "%~dp0plugin\com.dcs.f4e.sdPlugin" "!SD_DEST!" >nul 2>&1
if !errorlevel! equ 0 (
    echo  Plugin installed to: !SD_DEST!
) else (
    echo  ERROR: Could not copy plugin. Try running as Administrator.
    echo  Or manually copy:
    echo    FROM: %~dp0plugin\com.dcs.f4e.sdPlugin\
    echo    TO:   !SD_DEST!\
)
echo.

:: ---------------------------------------------------------------
:: 6. Done
:: ---------------------------------------------------------------

echo [6/6] Installation complete!
echo.
echo ============================================================
echo  Next steps:
echo   1. Restart the Stream Deck application
echo   2. Look for "DCS World" category in the action list
echo   3. Drag F-4E actions onto your Stream Deck layout
echo   4. Launch DCS World and fly the F-4E!
echo.
echo  To test without DCS:
echo   cd plugin ^&^& npx tsx ..\tools\udp-test-harness.ts
echo ============================================================
echo.
pause
