#!/usr/bin/env node
/**
 * Gauge/meter action icon generator for DCS F-4E Stream Deck plugin.
 *
 * Creates 20x20 and 40x40 PNG icons depicting a semicircular gauge
 * with tick marks and a needle, in white/light color on transparent
 * background, matching the style of other action icons.
 *
 * Usage:
 *   node tools/generate-gauge-icon.js
 *
 * Requires the canvas package (same location as generate-control-icons.js).
 */

const { createCanvas } = require("/tmp/canvas-gen/node_modules/canvas");
const fs = require("fs");
const path = require("path");

// Output directories
const ICONS_DIR = path.resolve(__dirname, "..", "icons", "actions");
const PLUGIN_DIR = path.resolve(
  __dirname,
  "..",
  "plugin",
  "com.dcs.f4e.sdPlugin",
  "assets",
  "actions",
);

fs.mkdirSync(ICONS_DIR, { recursive: true });
fs.mkdirSync(PLUGIN_DIR, { recursive: true });

/**
 * Draw a gauge/meter icon on the given canvas context.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} s - size in pixels (20 or 40)
 */
function drawGauge(ctx, s) {
  const cx = s / 2;
  const cy = s * 0.6; // center of the arc, shifted down so the semicircle sits nicely
  const radius = s * 0.38;
  const innerRadius = radius * 0.7;

  // Arc angles: from 210 degrees to 330 degrees (a semicircular sweep at the top)
  const startAngle = Math.PI * 1.17; // ~210 degrees
  const endAngle = Math.PI * 1.83; // ~330 degrees
  const sweepRange = endAngle - startAngle;

  // --- Outer arc ---
  ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
  ctx.lineWidth = Math.max(1, s * 0.06);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, endAngle);
  ctx.stroke();

  // --- Tick marks ---
  const numTicks = 5;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
  ctx.lineWidth = Math.max(0.5, s * 0.04);
  for (let i = 0; i <= numTicks; i++) {
    const tickAngle = startAngle + (i / numTicks) * sweepRange;
    const outerX = cx + Math.cos(tickAngle) * radius;
    const outerY = cy + Math.sin(tickAngle) * radius;
    const isMajor = i === 0 || i === numTicks || i === Math.floor(numTicks / 2);
    const tickLen = isMajor ? radius * 0.28 : radius * 0.18;
    const innerX = cx + Math.cos(tickAngle) * (radius - tickLen);
    const innerY = cy + Math.sin(tickAngle) * (radius - tickLen);
    ctx.beginPath();
    ctx.moveTo(outerX, outerY);
    ctx.lineTo(innerX, innerY);
    ctx.stroke();
  }

  // --- Needle (pointing to about 2/3 position) ---
  const needleAngle = startAngle + sweepRange * 0.65;
  const needleLength = radius * 0.82;
  const needleX = cx + Math.cos(needleAngle) * needleLength;
  const needleY = cy + Math.sin(needleAngle) * needleLength;

  ctx.strokeStyle = "rgba(255, 255, 255, 1.0)";
  ctx.lineWidth = Math.max(1, s * 0.06);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(needleX, needleY);
  ctx.stroke();

  // --- Center dot (pivot) ---
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.beginPath();
  ctx.arc(cx, cy, Math.max(1, s * 0.07), 0, Math.PI * 2);
  ctx.fill();

  // --- Small inner arc for style ---
  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = Math.max(0.5, s * 0.03);
  ctx.beginPath();
  ctx.arc(cx, cy, innerRadius, startAngle, endAngle);
  ctx.stroke();
}

/**
 * Generate and save the gauge icon at the specified size.
 */
function generateIcon(size, suffix) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Transparent background (default for canvas)
  ctx.clearRect(0, 0, size, size);

  drawGauge(ctx, size);

  const buffer = canvas.toBuffer("image/png");

  const filename = suffix ? `gauge${suffix}.png` : "gauge.png";

  // Write to icons/actions/
  const iconsPath = path.join(ICONS_DIR, filename);
  fs.writeFileSync(iconsPath, buffer);
  console.log(`  ${iconsPath} (${buffer.length} bytes)`);

  // Write to plugin assets
  const pluginPath = path.join(PLUGIN_DIR, filename);
  fs.writeFileSync(pluginPath, buffer);
  console.log(`  ${pluginPath} (${buffer.length} bytes)`);
}

// ---------------------------------------------------------------------------
// Generate
// ---------------------------------------------------------------------------

console.log("Generating gauge/meter action icons...\n");

generateIcon(20, "");      // 20x20 regular
generateIcon(40, "@2x");   // 40x40 retina

console.log("\nDone! Gauge icons generated.");
