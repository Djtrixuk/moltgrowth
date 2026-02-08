// Generates simple 24x24 pixel art PNGs as placeholder samples
// Uses a basic approach without external dependencies

const fs = require("fs");
const path = require("path");

// Simple BMP-like PNG generation (we'll create inline SVGs instead as data)
// For simplicity, let's generate SVG files that look like pixel art

const COLORS = {
  shells: ["#ff3333", "#3388ff", "#ff88aa", "#ff8833", "#338833", "#33ccff", "#33ff88", "#c0c0c0", "#333333", "#aa55ff", "#ffcc33", "#88ffcc"],
  backgrounds: ["#0a0e2a", "#0a1a0a", "#1a0a1a", "#0a1a1a", "#1a1a0a", "#0a0a2a"],
  eyes: ["#ffffff", "#ff0000", "#00ffff", "#ffff00", "#ff00ff"],
};

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePixelArtSVG(id) {
  const bg = randomFrom(COLORS.backgrounds);
  const shell = randomFrom(COLORS.shells);
  const eye = randomFrom(COLORS.eyes);
  const isRobot = id >= 13; // Last few are robots

  let pixels = "";
  const size = 24;
  const pixelSize = 1;

  // Generate a simple creature shape
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let color = null;

      if (isRobot) {
        // Robot body (rectangular)
        if (y >= 6 && y <= 18 && x >= 6 && x <= 18) {
          color = shell;
        }
        // Head
        if (y >= 4 && y <= 8 && x >= 8 && x <= 16) {
          color = "#888888";
        }
        // Eyes
        if (y === 6 && (x === 10 || x === 14)) {
          color = eye;
        }
        // Antenna
        if (y >= 1 && y <= 4 && x === 12) {
          color = "#ffff00";
        }
        // Arms
        if (y >= 10 && y <= 14 && (x === 4 || x === 5 || x === 19 || x === 20)) {
          color = shell;
        }
      } else {
        // Crustacean body (oval-ish)
        const cx = 12, cy = 13;
        const dx = Math.abs(x - cx);
        const dy = Math.abs(y - cy);

        if (dx * dx / 49 + dy * dy / 36 < 1) {
          color = shell;
        }
        // Head area
        if (y >= 4 && y <= 9 && x >= 8 && x <= 16) {
          const headDx = Math.abs(x - 12);
          const headDy = Math.abs(y - 7);
          if (headDx * headDx / 20 + headDy * headDy / 12 < 1) {
            color = shell;
          }
        }
        // Eyes
        if (y === 6 && (x === 10 || x === 14)) {
          color = eye;
        }
        // Claws
        if (y >= 10 && y <= 13) {
          if ((x >= 2 && x <= 5) || (x >= 19 && x <= 22)) {
            color = shell;
          }
        }
        if (y >= 9 && y <= 10 && ((x >= 1 && x <= 3) || (x >= 21 && x <= 23))) {
          color = shell;
        }
      }

      // Add some random noise/detail
      if (color && Math.random() < 0.1) {
        // Slightly vary the color
        color = color + "cc";
      }

      if (color) {
        pixels += `<rect x="${x * pixelSize}" y="${y * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${color}"/>`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="512" height="512" style="background:${bg}">
  <style>rect{shape-rendering:crispEdges}</style>
  ${pixels}
</svg>`;
}

const outDir = path.join(__dirname, "..", "public", "samples");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

for (let i = 0; i < 16; i++) {
  const svg = generatePixelArtSVG(i);
  fs.writeFileSync(path.join(outDir, `${i}.svg`), svg);
  console.log(`Generated sample ${i}.svg`);
}

console.log("Done! Generated 16 sample SVGs.");
