#!/usr/bin/env node
/**
 * Version bump utility for dcs-f4e-streamdeck.
 *
 * Updates the version across all files that contain it:
 *   - VERSION (root)
 *   - plugin/package.json
 *   - plugin/com.dcs.f4e.sdPlugin/package.json
 *   - plugin/com.dcs.f4e.sdPlugin/manifest.json
 *   - plugin/src/version.ts (compiled into plugin bundle)
 *   - lua/F-4E-45MC.lua (header comment)
 *
 * Usage:
 *   node tools/bump-version.js patch    # 0.1.0 -> 0.1.1
 *   node tools/bump-version.js minor    # 0.1.0 -> 0.2.0
 *   node tools/bump-version.js major    # 0.1.0 -> 1.0.0
 *   node tools/bump-version.js 1.2.3    # set exact version
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

// Read current version
const versionFile = path.join(ROOT, "VERSION");
const current = fs.readFileSync(versionFile, "utf-8").trim();
const [major, minor, patch] = current.split(".").map(Number);

// Determine new version
const arg = process.argv[2];
let newVersion;

if (!arg) {
  console.log(`Current version: ${current}`);
  console.log("Usage: bump-version.js [major|minor|patch|x.y.z]");
  process.exit(0);
} else if (arg === "patch") {
  newVersion = `${major}.${minor}.${patch + 1}`;
} else if (arg === "minor") {
  newVersion = `${major}.${minor + 1}.0`;
} else if (arg === "major") {
  newVersion = `${major + 1}.0.0`;
} else if (/^\d+\.\d+\.\d+$/.test(arg)) {
  newVersion = arg;
} else {
  console.error(`Invalid argument: ${arg}`);
  console.error("Usage: bump-version.js [major|minor|patch|x.y.z]");
  process.exit(1);
}

const [newMajor, newMinor, newPatch] = newVersion.split(".");
const manifestVersion = `${newMajor}.${newMinor}.${newPatch}.0`;

console.log(`Bumping version: ${current} -> ${newVersion}`);

// 1. VERSION file
fs.writeFileSync(versionFile, newVersion + "\n");
console.log(`  Updated VERSION`);

// 2. plugin/package.json
const pkgPath = path.join(ROOT, "plugin", "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
pkg.version = newVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log(`  Updated plugin/package.json`);

// 3. plugin/com.dcs.f4e.sdPlugin/package.json
const sdPkgPath = path.join(ROOT, "plugin", "com.dcs.f4e.sdPlugin", "package.json");
const sdPkg = JSON.parse(fs.readFileSync(sdPkgPath, "utf-8"));
sdPkg.version = newVersion;
fs.writeFileSync(sdPkgPath, JSON.stringify(sdPkg, null, 2) + "\n");
console.log(`  Updated com.dcs.f4e.sdPlugin/package.json`);

// 4. manifest.json (uses 4-part version: x.y.z.0)
const manifestPath = path.join(ROOT, "plugin", "com.dcs.f4e.sdPlugin", "manifest.json");
let manifest = fs.readFileSync(manifestPath, "utf-8");
manifest = manifest.replace(/"Version":\s*"[\d.]+"/, `"Version": "${manifestVersion}"`);
fs.writeFileSync(manifestPath, manifest);
console.log(`  Updated manifest.json (${manifestVersion})`);

// 5. plugin/src/version.ts (baked into compiled bundle)
const versionTsPath = path.join(ROOT, "plugin", "src", "version.ts");
fs.writeFileSync(
  versionTsPath,
  `/** Plugin version — updated automatically by tools/bump-version.js */\nexport const PLUGIN_VERSION = "${newVersion}";\n`
);
console.log(`  Updated plugin/src/version.ts`);

// 6. Lua module header
const luaPath = path.join(ROOT, "lua", "F-4E-45MC.lua");
if (fs.existsSync(luaPath)) {
  let lua = fs.readFileSync(luaPath, "utf-8");
  // Update version comment if present, or add one
  if (lua.match(/-- Version:/)) {
    lua = lua.replace(/-- Version:.*/, `-- Version: ${newVersion}`);
  } else {
    // Add version after the first comment line
    lua = lua.replace(
      /(-- F-4E-45MC\.lua.*)/,
      `$1\n-- Version: ${newVersion}`
    );
  }
  fs.writeFileSync(luaPath, lua);
  console.log(`  Updated lua/F-4E-45MC.lua`);
}

console.log(`\nVersion bumped to ${newVersion}`);
console.log("Don't forget to rebuild: cd plugin && npm run build");
