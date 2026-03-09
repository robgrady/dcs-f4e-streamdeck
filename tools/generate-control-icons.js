#!/usr/bin/env node
/**
 * Control-specific icon generator for DCS F-4E Stream Deck profiles.
 *
 * Creates 144x144 PNG icons for each cockpit control used in the
 * bundled Stream Deck + profiles. Icons use category-based colors
 * and simple recognizable symbols.
 *
 * Usage:
 *   node tools/generate-control-icons.js
 *
 * Requires the canvas package (install globally or use a temp location).
 */

const { createCanvas } = require("/tmp/canvas-gen/node_modules/canvas");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.resolve(
  __dirname,
  "..",
  "icons",
  "controls",
);

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// Color palette by category
// ---------------------------------------------------------------------------
const CAT_COLORS = {
  weapons: { bg: "#8B0000", accent: "#FF4444", border: "#CC2222" },
  flight: { bg: "#1a3366", accent: "#4488FF", border: "#2255AA" },
  engine: { bg: "#8B4500", accent: "#FF8C00", border: "#CC6600" },
  electrical: { bg: "#6B6B00", accent: "#FFD700", border: "#CCAA00" },
  radio: { bg: "#4B0082", accent: "#BB77FF", border: "#7733CC" },
  navigation: { bg: "#005566", accent: "#00CCDD", border: "#0099AA" },
  radar: { bg: "#1a4422", accent: "#44CC66", border: "#228833" },
  hud: { bg: "#1a3a1a", accent: "#33FF55", border: "#22AA33" },
  cm: { bg: "#551122", accent: "#FF6688", border: "#993344" },
  warning: { bg: "#664400", accent: "#FFAA00", border: "#CC8800" },
  status: { bg: "#2a2a2a", accent: "#888888", border: "#555555" },
};

// ---------------------------------------------------------------------------
// Canvas helpers
// ---------------------------------------------------------------------------

function saveIcon(canvas, name) {
  const buffer = canvas.toBuffer("image/png");
  const filepath = path.join(OUTPUT_DIR, `${name}.png`);
  fs.writeFileSync(filepath, buffer);
  console.log(`  ${name}.png (${buffer.length} bytes)`);
}

function drawBackground(ctx, s, colors) {
  // Gradient background
  const grad = ctx.createLinearGradient(0, 0, 0, s);
  grad.addColorStop(0, lighten(colors.bg, 20));
  grad.addColorStop(1, colors.bg);
  ctx.fillStyle = grad;
  roundRect(ctx, 0, 0, s, s, 16);
  ctx.fill();

  // Subtle border
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 3;
  roundRect(ctx, 2, 2, s - 4, s - 4, 14);
  ctx.stroke();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawLabel(ctx, s, text, colors) {
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.font = "bold 16px Arial, sans-serif";
  // Draw text with shadow
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillText(text, s / 2 + 1, s - 9);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, s / 2, s - 10);
}

function drawCategoryBadge(ctx, s, text, colors) {
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.font = "bold 11px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(text, s / 2 + 1, 9);
  ctx.fillStyle = colors.accent;
  ctx.fillText(text, s / 2, 8);
}

function lighten(hex, amount) {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount);
  return `rgb(${r},${g},${b})`;
}

// ---------------------------------------------------------------------------
// Symbol drawing functions
// ---------------------------------------------------------------------------

function drawArmSymbol(ctx, s, colors) {
  // Armed/safety switch symbol - circle with line through it
  const cx = s / 2,
    cy = s / 2 - 8;
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, 28, 0, Math.PI * 2);
  ctx.stroke();
  // Vertical line through circle
  ctx.beginPath();
  ctx.moveTo(cx, cy - 35);
  ctx.lineTo(cx, cy + 35);
  ctx.stroke();
  // Filled when armed
  ctx.fillStyle = colors.accent;
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.arc(cx, cy, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1.0;
}

function drawGearSymbol(ctx, s, colors) {
  const cx = s / 2,
    cy = s / 2 - 8;
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 3;
  // Wheel circle
  ctx.beginPath();
  ctx.arc(cx, cy + 10, 20, 0, Math.PI * 2);
  ctx.stroke();
  // Strut
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 25);
  ctx.lineTo(cx, cy - 10);
  ctx.stroke();
  // Oleo/shock absorber
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy - 10);
  ctx.lineTo(cx, cy + 10);
  ctx.lineTo(cx + 8, cy - 10);
  ctx.stroke();
  // Axle
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 22, cy + 10);
  ctx.lineTo(cx + 22, cy + 10);
  ctx.stroke();
}

function drawFlapsSymbol(ctx, s, colors) {
  const cx = s / 2,
    cy = s / 2 - 5;
  ctx.strokeStyle = colors.accent;
  ctx.fillStyle = colors.accent;
  ctx.lineWidth = 3;
  // Wing cross-section
  ctx.beginPath();
  ctx.moveTo(cx - 45, cy + 5);
  ctx.quadraticCurveTo(cx, cy - 15, cx + 45, cy);
  ctx.lineTo(cx + 45, cy + 5);
  ctx.lineTo(cx - 45, cy + 5);
  ctx.closePath();
  ctx.globalAlpha = 0.4;
  ctx.fill();
  ctx.globalAlpha = 1.0;
  ctx.stroke();
  // Flap (angled down)
  ctx.beginPath();
  ctx.moveTo(cx + 15, cy + 5);
  ctx.lineTo(cx + 45, cy + 5);
  ctx.lineTo(cx + 40, cy + 20);
  ctx.lineTo(cx + 10, cy + 20);
  ctx.closePath();
  ctx.stroke();
  // Arrow showing flap deployment
  ctx.beginPath();
  ctx.moveTo(cx + 30, cy + 8);
  ctx.lineTo(cx + 28, cy + 18);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 24, cy + 14);
  ctx.lineTo(cx + 28, cy + 18);
  ctx.lineTo(cx + 32, cy + 14);
  ctx.stroke();
}

function drawCrosshairSymbol(ctx, s, colors) {
  const cx = s / 2,
    cy = s / 2 - 8;
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 3;
  // Circle
  ctx.beginPath();
  ctx.arc(cx, cy, 25, 0, Math.PI * 2);
  ctx.stroke();
  // Crosshairs
  ctx.beginPath();
  ctx.moveTo(cx - 35, cy);
  ctx.lineTo(cx - 12, cy);
  ctx.moveTo(cx + 12, cy);
  ctx.lineTo(cx + 35, cy);
  ctx.moveTo(cx, cy - 35);
  ctx.lineTo(cx, cy - 12);
  ctx.moveTo(cx, cy + 12);
  ctx.lineTo(cx, cy + 35);
  ctx.stroke();
  // Center dot
  ctx.fillStyle = colors.accent;
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawHudSymbol(ctx, s, colors) {
  const cx = s / 2,
    cy = s / 2 - 8;
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 2.5;
  // HUD frame
  roundRect(ctx, cx - 30, cy - 25, 60, 50, 4);
  ctx.stroke();
  // Horizon line
  ctx.beginPath();
  ctx.moveTo(cx - 22, cy);
  ctx.lineTo(cx - 8, cy);
  ctx.moveTo(cx + 8, cy);
  ctx.lineTo(cx + 22, cy);
  ctx.stroke();
  // Pitch ladder marks
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 12, cy - 10);
  ctx.lineTo(cx + 12, cy - 10);
  ctx.moveTo(cx - 12, cy + 10);
  ctx.lineTo(cx + 12, cy + 10);
  ctx.stroke();
  // FPM circle
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.stroke();
  // FPM wings
  ctx.beginPath();
  ctx.moveTo(cx - 5, cy);
  ctx.lineTo(cx - 10, cy);
  ctx.moveTo(cx + 5, cy);
  ctx.lineTo(cx + 10, cy);
  ctx.moveTo(cx, cy - 5);
  ctx.lineTo(cx, cy - 8);
  ctx.stroke();
}

function drawWarningSymbol(ctx, s, colors) {
  const cx = s / 2,
    cy = s / 2 - 5;
  ctx.fillStyle = colors.accent;
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 3;
  // Warning triangle
  ctx.beginPath();
  ctx.moveTo(cx, cy - 28);
  ctx.lineTo(cx + 30, cy + 20);
  ctx.lineTo(cx - 30, cy + 20);
  ctx.closePath();
  ctx.globalAlpha = 0.3;
  ctx.fill();
  ctx.globalAlpha = 1.0;
  ctx.stroke();
  // Exclamation mark
  ctx.fillStyle = colors.accent;
  ctx.font = "bold 28px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("!", cx, cy + 2);
}

function drawChaffFlareSymbol(ctx, s, colors) {
  const cx = s / 2,
    cy = s / 2 - 8;
  ctx.fillStyle = colors.accent;
  // Scattered dots representing chaff/flares
  const dots = [
    [-18, -15],
    [5, -20],
    [20, -8],
    [-25, 0],
    [-5, -5],
    [12, 5],
    [-15, 12],
    [0, 15],
    [22, 18],
    [-22, -10],
    [8, -12],
    [-8, 8],
    [18, -18],
    [-12, 20],
    [25, 12],
  ];
  for (const [dx, dy] of dots) {
    const r = 2 + Math.random() * 2;
    ctx.beginPath();
    ctx.arc(cx + dx, cy + dy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // Small burst lines
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.6;
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * 5, cy + Math.sin(angle) * 5);
    ctx.lineTo(cx + Math.cos(angle) * 12, cy + Math.sin(angle) * 12);
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;
}

function drawGunSymbol(ctx, s, colors) {
  const cx = s / 2,
    cy = s / 2 - 8;
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 4;
  // Gun barrel
  ctx.beginPath();
  ctx.moveTo(cx - 35, cy);
  ctx.lineTo(cx + 25, cy);
  ctx.stroke();
  // Muzzle
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx + 25, cy - 8);
  ctx.lineTo(cx + 35, cy);
  ctx.lineTo(cx + 25, cy + 8);
  ctx.stroke();
  // Muzzle flash lines
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(cx + 35, cy - 12);
  ctx.lineTo(cx + 42, cy - 16);
  ctx.moveTo(cx + 37, cy);
  ctx.lineTo(cx + 45, cy);
  ctx.moveTo(cx + 35, cy + 12);
  ctx.lineTo(cx + 42, cy + 16);
  ctx.stroke();
  ctx.globalAlpha = 1.0;
}

function drawPylonSymbol(ctx, s, colors, label) {
  const cx = s / 2,
    cy = s / 2 - 8;
  ctx.strokeStyle = colors.accent;
  ctx.fillStyle = colors.accent;
  ctx.lineWidth = 3;
  // Pylon (inverted T shape)
  ctx.beginPath();
  ctx.moveTo(cx, cy - 25);
  ctx.lineTo(cx, cy + 5);
  ctx.stroke();
  // Horizontal bar
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx - 20, cy + 5);
  ctx.lineTo(cx + 20, cy + 5);
  ctx.stroke();
  // Weapon shape hanging
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.5;
  roundRect(ctx, cx - 12, cy + 8, 24, 18, 6);
  ctx.fill();
  ctx.globalAlpha = 1.0;
  // Station label
  if (label) {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, cx, cy + 17);
  }
}

function drawJettisonSymbol(ctx, s, colors) {
  const cx = s / 2,
    cy = s / 2 - 8;
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 3;
  // Downward arrow (eject/release)
  ctx.beginPath();
  ctx.moveTo(cx, cy - 25);
  ctx.lineTo(cx, cy + 20);
  ctx.stroke();
  // Arrowhead
  ctx.beginPath();
  ctx.moveTo(cx - 15, cy + 8);
  ctx.lineTo(cx, cy + 25);
  ctx.lineTo(cx + 15, cy + 8);
  ctx.stroke();
  // Object being jettisoned (small rectangle)
  ctx.fillStyle = colors.accent;
  ctx.globalAlpha = 0.5;
  roundRect(ctx, cx - 10, cy - 28, 20, 10, 3);
  ctx.fill();
  ctx.globalAlpha = 1.0;
}

function drawBombSymbol(ctx, s, colors, label) {
  const cx = s / 2,
    cy = s / 2 - 8;
  ctx.strokeStyle = colors.accent;
  ctx.fillStyle = colors.accent;
  ctx.lineWidth = 2.5;
  // Bomb body (oval)
  ctx.beginPath();
  ctx.ellipse(cx, cy, 15, 22, 0, 0, Math.PI * 2);
  ctx.globalAlpha = 0.3;
  ctx.fill();
  ctx.globalAlpha = 1.0;
  ctx.stroke();
  // Fins
  ctx.beginPath();
  ctx.moveTo(cx - 12, cy + 18);
  ctx.lineTo(cx - 18, cy + 28);
  ctx.moveTo(cx + 12, cy + 18);
  ctx.lineTo(cx + 18, cy + 28);
  ctx.stroke();
  // Label inside
  if (label) {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, cx, cy - 2);
  }
}

function drawDeliverySymbol(ctx, s, colors) {
  const cx = s / 2,
    cy = s / 2 - 8;
  ctx.strokeStyle = colors.accent;
  ctx.fillStyle = colors.accent;
  ctx.lineWidth = 2.5;
  // Bomb shape
  ctx.beginPath();
  ctx.ellipse(cx - 10, cy - 10, 10, 16, 0, 0, Math.PI * 2);
  ctx.globalAlpha = 0.3;
  ctx.fill();
  ctx.globalAlpha = 1.0;
  ctx.stroke();
  // Curved trajectory arrow
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 10, cy + 8);
  ctx.quadraticCurveTo(cx + 10, cy + 20, cx + 25, cy + 15);
  ctx.stroke();
  // Arrowhead
  ctx.beginPath();
  ctx.moveTo(cx + 20, cy + 10);
  ctx.lineTo(cx + 25, cy + 15);
  ctx.lineTo(cx + 18, cy + 17);
  ctx.stroke();
}

function drawDragSymbol(ctx, s, colors) {
  const cx = s / 2,
    cy = s / 2 - 8;
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 2;
  // Streamlines showing drag
  for (let i = -2; i <= 2; i++) {
    const y = cy + i * 12;
    ctx.beginPath();
    ctx.moveTo(cx - 35, y);
    // Wavy line
    ctx.quadraticCurveTo(cx - 15, y - 4, cx, y);
    ctx.quadraticCurveTo(cx + 15, y + 4, cx + 35, y);
    ctx.stroke();
  }
  // Drag coefficient symbol (Cd)
  ctx.fillStyle = colors.accent;
  ctx.font = "bold italic 18px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Cd", cx, cy);
}

function drawReleaseSymbol(ctx, s, colors) {
  const cx = s / 2,
    cy = s / 2 - 8;
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 3;
  // Release/advance arrows
  ctx.beginPath();
  ctx.moveTo(cx - 20, cy - 15);
  ctx.lineTo(cx + 10, cy - 15);
  ctx.lineTo(cx + 5, cy - 22);
  ctx.moveTo(cx + 10, cy - 15);
  ctx.lineTo(cx + 5, cy - 8);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 20, cy + 5);
  ctx.lineTo(cx + 10, cy + 5);
  ctx.lineTo(cx + 5, cy - 2);
  ctx.moveTo(cx + 10, cy + 5);
  ctx.lineTo(cx + 5, cy + 12);
  ctx.stroke();
  // Timer arc
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx + 20, cy + 15, 10, -Math.PI * 0.5, Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 20, cy + 5);
  ctx.lineTo(cx + 20, cy + 15);
  ctx.lineTo(cx + 13, cy + 15);
  ctx.stroke();
}

function drawTurbineSymbol(ctx, s, colors) {
  const cx = s / 2,
    cy = s / 2 - 8;
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 2.5;
  // Turbine circle
  ctx.beginPath();
  ctx.arc(cx, cy, 25, 0, Math.PI * 2);
  ctx.stroke();
  // Blades (rotation symbol)
  const blades = 6;
  for (let i = 0; i < blades; i++) {
    const angle = (i / blades) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    const ex = cx + Math.cos(angle) * 22;
    const ey = cy + Math.sin(angle) * 22;
    ctx.lineTo(ex, ey);
    ctx.stroke();
  }
  // Center hub
  ctx.fillStyle = colors.accent;
  ctx.beginPath();
  ctx.arc(cx, cy, 6, 0, Math.PI * 2);
  ctx.fill();
  // Rotation arrow
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 30, -0.5, 0.8);
  ctx.stroke();
  ctx.beginPath();
  const ax = cx + Math.cos(0.8) * 30;
  const ay = cy + Math.sin(0.8) * 30;
  ctx.moveTo(ax - 5, ay - 6);
  ctx.lineTo(ax, ay);
  ctx.lineTo(ax + 6, ay - 4);
  ctx.stroke();
}

function drawEngineSymbol(ctx, s, colors, label) {
  const cx = s / 2,
    cy = s / 2 - 8;
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 2.5;
  // Simple engine shape
  ctx.beginPath();
  ctx.arc(cx, cy, 22, 0, Math.PI * 2);
  ctx.stroke();
  // Intake
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 22, cy - 12);
  ctx.lineTo(cx - 30, cy - 15);
  ctx.moveTo(cx - 22, cy + 12);
  ctx.lineTo(cx - 30, cy + 15);
  ctx.stroke();
  // Label (L or R)
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 22px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, cx, cy);
}

function drawLightningSymbol(ctx, s, colors, label) {
  const cx = s / 2,
    cy = s / 2 - 8;
  ctx.fillStyle = colors.accent;
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 2;
  // Lightning bolt
  ctx.beginPath();
  ctx.moveTo(cx + 5, cy - 28);
  ctx.lineTo(cx - 12, cy);
  ctx.lineTo(cx - 2, cy);
  ctx.lineTo(cx - 8, cy + 25);
  ctx.lineTo(cx + 12, cy - 2);
  ctx.lineTo(cx + 2, cy - 2);
  ctx.closePath();
  ctx.globalAlpha = 0.4;
  ctx.fill();
  ctx.globalAlpha = 1.0;
  ctx.stroke();
  // Label (L or R)
  if (label) {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Arial, sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText(label, cx + 35, cy - 25);
  }
}

function drawBatterySymbol(ctx, s, colors) {
  const cx = s / 2,
    cy = s / 2 - 8;
  ctx.strokeStyle = colors.accent;
  ctx.fillStyle = colors.accent;
  ctx.lineWidth = 3;
  // Battery body
  roundRect(ctx, cx - 25, cy - 15, 50, 30, 4);
  ctx.stroke();
  // Battery terminal
  ctx.fillRect(cx + 25, cy - 6, 8, 12);
  // Plus sign
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy);
  ctx.lineTo(cx + 8, cy);
  ctx.moveTo(cx, cy - 8);
  ctx.lineTo(cx, cy + 8);
  ctx.stroke();
  // Fill level
  ctx.globalAlpha = 0.3;
  roundRect(ctx, cx - 23, cy - 13, 35, 26, 3);
  ctx.fill();
  ctx.globalAlpha = 1.0;
}

function drawCompassSymbol(ctx, s, colors) {
  const cx = s / 2,
    cy = s / 2 - 8;
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 2.5;
  // Compass circle
  ctx.beginPath();
  ctx.arc(cx, cy, 25, 0, Math.PI * 2);
  ctx.stroke();
  // N pointer (filled triangle pointing up)
  ctx.fillStyle = colors.accent;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 22);
  ctx.lineTo(cx - 6, cy);
  ctx.lineTo(cx + 6, cy);
  ctx.closePath();
  ctx.fill();
  // S pointer (outline)
  ctx.beginPath();
  ctx.moveTo(cx, cy + 22);
  ctx.lineTo(cx - 6, cy);
  ctx.lineTo(cx + 6, cy);
  ctx.closePath();
  ctx.stroke();
  // Cardinal markers
  ctx.fillStyle = colors.accent;
  ctx.font = "bold 10px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("N", cx, cy - 30);
}

function drawAntennaSymbol(ctx, s, colors) {
  const cx = s / 2,
    cy = s / 2 - 5;
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 3;
  // Antenna mast
  ctx.beginPath();
  ctx.moveTo(cx, cy + 25);
  ctx.lineTo(cx, cy - 10);
  ctx.stroke();
  // Antenna tip
  ctx.fillStyle = colors.accent;
  ctx.beginPath();
  ctx.arc(cx, cy - 12, 4, 0, Math.PI * 2);
  ctx.fill();
  // Radio waves
  ctx.lineWidth = 2;
  for (let i = 1; i <= 3; i++) {
    ctx.globalAlpha = 1.0 - i * 0.25;
    ctx.beginPath();
    ctx.arc(cx, cy - 12, 10 * i, -Math.PI * 0.7, -Math.PI * 0.3);
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;
  // Base
  ctx.lineWidth = 2;
  roundRect(ctx, cx - 15, cy + 18, 30, 12, 3);
  ctx.stroke();
}

function drawSpeakerSymbol(ctx, s, colors) {
  const cx = s / 2,
    cy = s / 2 - 8;
  ctx.strokeStyle = colors.accent;
  ctx.fillStyle = colors.accent;
  ctx.lineWidth = 2.5;
  // Speaker body
  ctx.beginPath();
  ctx.moveTo(cx - 15, cy - 10);
  ctx.lineTo(cx - 5, cy - 10);
  ctx.lineTo(cx + 10, cy - 22);
  ctx.lineTo(cx + 10, cy + 22);
  ctx.lineTo(cx - 5, cy + 10);
  ctx.lineTo(cx - 15, cy + 10);
  ctx.closePath();
  ctx.globalAlpha = 0.3;
  ctx.fill();
  ctx.globalAlpha = 1.0;
  ctx.stroke();
  // Sound waves
  ctx.lineWidth = 2;
  for (let i = 1; i <= 3; i++) {
    ctx.globalAlpha = 1.0 - i * 0.25;
    ctx.beginPath();
    ctx.arc(cx + 10, cy, 8 * i, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;
}

function drawNavDiamondSymbol(ctx, s, colors, label) {
  const cx = s / 2,
    cy = s / 2 - 8;
  ctx.strokeStyle = colors.accent;
  ctx.fillStyle = colors.accent;
  ctx.lineWidth = 3;
  // Diamond shape (TACAN nav marker)
  ctx.beginPath();
  ctx.moveTo(cx, cy - 25);
  ctx.lineTo(cx + 20, cy);
  ctx.lineTo(cx, cy + 25);
  ctx.lineTo(cx - 20, cy);
  ctx.closePath();
  ctx.globalAlpha = 0.3;
  ctx.fill();
  ctx.globalAlpha = 1.0;
  ctx.stroke();
  // Label inside
  if (label) {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, cx, cy);
  }
}

function drawRadarSweepSymbol(ctx, s, colors) {
  const cx = s / 2,
    cy = s / 2 + 10;
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 2.5;
  // Radar screen (half circle)
  ctx.beginPath();
  ctx.arc(cx, cy, 30, Math.PI, 0);
  ctx.lineTo(cx + 30, cy);
  ctx.lineTo(cx - 30, cy);
  ctx.stroke();
  // Range rings
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.arc(cx, cy, 15, Math.PI, 0);
  ctx.stroke();
  ctx.globalAlpha = 1.0;
  // Sweep line
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 2;
  const sweepAngle = -Math.PI * 0.65;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(sweepAngle) * 28, cy + Math.sin(sweepAngle) * 28);
  ctx.stroke();
  // Sweep glow
  ctx.fillStyle = colors.accent;
  ctx.globalAlpha = 0.15;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, 28, sweepAngle, sweepAngle + 0.4);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1.0;
  // Blip
  ctx.fillStyle = colors.accent;
  ctx.beginPath();
  ctx.arc(cx + 8, cy - 18, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawBrightnessSymbol(ctx, s, colors) {
  const cx = s / 2,
    cy = s / 2 - 8;
  ctx.strokeStyle = colors.accent;
  ctx.fillStyle = colors.accent;
  ctx.lineWidth = 2.5;
  // Sun circle
  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, Math.PI * 2);
  ctx.fill();
  // Rays
  const numRays = 8;
  ctx.lineWidth = 3;
  for (let i = 0; i < numRays; i++) {
    const angle = (i / numRays) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * 18, cy + Math.sin(angle) * 18);
    ctx.lineTo(cx + Math.cos(angle) * 28, cy + Math.sin(angle) * 28);
    ctx.stroke();
  }
}

function drawBombIntervalSymbol(ctx, s, colors) {
  const cx = s / 2,
    cy = s / 2 - 8;
  ctx.strokeStyle = colors.accent;
  ctx.fillStyle = colors.accent;
  ctx.lineWidth = 2;
  // Three small bombs with spacing markers
  for (let i = -1; i <= 1; i++) {
    const bx = cx + i * 22;
    ctx.beginPath();
    ctx.ellipse(bx, cy, 6, 10, 0, 0, Math.PI * 2);
    ctx.globalAlpha = 0.4;
    ctx.fill();
    ctx.globalAlpha = 1.0;
    ctx.stroke();
  }
  // Interval arrows between bombs
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 14, cy + 16);
  ctx.lineTo(cx + 14, cy + 16);
  ctx.stroke();
  // Tick marks
  ctx.beginPath();
  ctx.moveTo(cx - 14, cy + 13);
  ctx.lineTo(cx - 14, cy + 19);
  ctx.moveTo(cx + 14, cy + 13);
  ctx.lineTo(cx + 14, cy + 19);
  ctx.moveTo(cx, cy + 13);
  ctx.lineTo(cx, cy + 19);
  ctx.stroke();
}

function drawStatusSymbol(ctx, s, colors) {
  const cx = s / 2,
    cy = s / 2 - 8;
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 3;
  // Signal bars
  for (let i = 0; i < 4; i++) {
    const bh = 10 + i * 8;
    const bx = cx - 25 + i * 16;
    const by = cy + 15 - bh;
    ctx.fillStyle = i < 3 ? colors.accent : "rgba(255,255,255,0.3)";
    roundRect(ctx, bx, by, 10, bh, 2);
    ctx.fill();
  }
}

// ---------------------------------------------------------------------------
// Icon definitions
// ---------------------------------------------------------------------------

const ICONS = [
  // Weapons
  {
    name: "master-arm",
    cat: "weapons",
    badge: "WEAPONS",
    label: "MASTER ARM",
    draw: drawArmSymbol,
  },
  {
    name: "gun-arm",
    cat: "weapons",
    badge: "WEAPONS",
    label: "GUN ARM",
    draw: drawGunSymbol,
  },
  {
    name: "weapon-select",
    cat: "weapons",
    badge: "WEAPONS",
    label: "WPN SEL",
    draw: drawCrosshairSymbol,
  },
  {
    name: "delivery-mode",
    cat: "weapons",
    badge: "WEAPONS",
    label: "DELIVERY",
    draw: drawDeliverySymbol,
  },
  {
    name: "station-li",
    cat: "weapons",
    badge: "WEAPONS",
    label: "STA LI",
    draw: (ctx, s, c) => drawPylonSymbol(ctx, s, c, "LI"),
  },
  {
    name: "station-ctr",
    cat: "weapons",
    badge: "WEAPONS",
    label: "STA CTR",
    draw: (ctx, s, c) => drawPylonSymbol(ctx, s, c, "C"),
  },
  {
    name: "station-ri",
    cat: "weapons",
    badge: "WEAPONS",
    label: "STA RI",
    draw: (ctx, s, c) => drawPylonSymbol(ctx, s, c, "RI"),
  },
  {
    name: "jettison",
    cat: "weapons",
    badge: "WEAPONS",
    label: "JETTISON",
    draw: drawJettisonSymbol,
  },
  {
    name: "bomb-qty",
    cat: "weapons",
    badge: "WRCS",
    label: "BOMB QTY",
    draw: (ctx, s, c) => drawBombSymbol(ctx, s, c, "QTY"),
  },
  {
    name: "bomb-interval",
    cat: "weapons",
    badge: "WRCS",
    label: "BOMB INTV",
    draw: drawBombIntervalSymbol,
  },
  {
    name: "drag-coeff",
    cat: "weapons",
    badge: "WRCS",
    label: "DRAG COEF",
    draw: drawDragSymbol,
  },
  {
    name: "release-advance",
    cat: "weapons",
    badge: "WRCS",
    label: "RELEASE",
    draw: drawReleaseSymbol,
  },

  // Flight
  {
    name: "gear",
    cat: "flight",
    badge: "FLIGHT",
    label: "GEAR",
    draw: drawGearSymbol,
  },
  {
    name: "flaps",
    cat: "flight",
    badge: "FLIGHT",
    label: "FLAPS",
    draw: drawFlapsSymbol,
  },

  // HUD
  {
    name: "hud-mode",
    cat: "hud",
    badge: "HUD",
    label: "HUD MODE",
    draw: drawHudSymbol,
  },
  {
    name: "hud-brightness",
    cat: "hud",
    badge: "HUD",
    label: "HUD BRIGHT",
    draw: drawBrightnessSymbol,
  },

  // Warnings
  {
    name: "master-caution",
    cat: "warning",
    badge: "WARNING",
    label: "MASTER CAUT",
    draw: drawWarningSymbol,
  },

  // Countermeasures
  {
    name: "cm-dispense",
    cat: "cm",
    badge: "CM",
    label: "CM DISP",
    draw: drawChaffFlareSymbol,
  },

  // Engine
  {
    name: "engine-start",
    cat: "engine",
    badge: "ENGINE",
    label: "ENG START",
    draw: drawTurbineSymbol,
  },
  {
    name: "engine-l",
    cat: "engine",
    badge: "ENGINE",
    label: "ENG L",
    draw: (ctx, s, c) => drawEngineSymbol(ctx, s, c, "L"),
  },
  {
    name: "engine-r",
    cat: "engine",
    badge: "ENGINE",
    label: "ENG R",
    draw: (ctx, s, c) => drawEngineSymbol(ctx, s, c, "R"),
  },

  // Electrical
  {
    name: "generator-l",
    cat: "electrical",
    badge: "ELEC",
    label: "GEN L",
    draw: (ctx, s, c) => drawLightningSymbol(ctx, s, c, "L"),
  },
  {
    name: "generator-r",
    cat: "electrical",
    badge: "ELEC",
    label: "GEN R",
    draw: (ctx, s, c) => drawLightningSymbol(ctx, s, c, "R"),
  },
  {
    name: "battery",
    cat: "electrical",
    badge: "ELEC",
    label: "BATTERY",
    draw: drawBatterySymbol,
  },

  // Navigation
  {
    name: "ins-power",
    cat: "navigation",
    badge: "NAV",
    label: "INS PWR",
    draw: drawCompassSymbol,
  },
  {
    name: "tacan",
    cat: "navigation",
    badge: "NAV",
    label: "TACAN",
    draw: (ctx, s, c) => drawNavDiamondSymbol(ctx, s, c, "T"),
  },
  {
    name: "tacan-10s",
    cat: "navigation",
    badge: "NAV",
    label: "TACAN 10s",
    draw: (ctx, s, c) => drawNavDiamondSymbol(ctx, s, c, "10"),
  },
  {
    name: "tacan-1s",
    cat: "navigation",
    badge: "NAV",
    label: "TACAN 1s",
    draw: (ctx, s, c) => drawNavDiamondSymbol(ctx, s, c, "1"),
  },

  // Radio
  {
    name: "uhf-radio",
    cat: "radio",
    badge: "RADIO",
    label: "UHF RADIO",
    draw: drawAntennaSymbol,
  },
  {
    name: "uhf-volume",
    cat: "radio",
    badge: "RADIO",
    label: "UHF VOL",
    draw: drawSpeakerSymbol,
  },

  // Radar
  {
    name: "radar-gain",
    cat: "radar",
    badge: "RADAR",
    label: "RADAR GAIN",
    draw: drawRadarSweepSymbol,
  },

  // Status
  {
    name: "status",
    cat: "status",
    badge: "DCS",
    label: "STATUS",
    draw: drawStatusSymbol,
  },
];

// ---------------------------------------------------------------------------
// Generate all icons
// ---------------------------------------------------------------------------

console.log("Generating control-specific icons for DCS F-4E profiles...\n");

for (const icon of ICONS) {
  const canvas = createCanvas(144, 144);
  const ctx = canvas.getContext("2d");
  const colors = CAT_COLORS[icon.cat];

  drawBackground(ctx, 144, colors);
  drawCategoryBadge(ctx, 144, icon.badge, colors);
  icon.draw(ctx, 144, colors);
  drawLabel(ctx, 144, icon.label, colors);

  saveIcon(canvas, icon.name);
}

console.log(`\nDone! ${ICONS.length} icons generated in ${OUTPUT_DIR}`);
