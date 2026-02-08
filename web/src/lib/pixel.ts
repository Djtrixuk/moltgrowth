function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type PixelArt = {
  size: number;
  bg: string;
  pixels: Array<{ x: number; y: number; color: string }>;
};

export function generatePixelArt(id: string, size = 24): PixelArt {
  const seed = xmur3(id)();
  const rand = mulberry32(seed);

  const bg = "#070714";
  const palette = ["#00ff41", "#00ffff", "#ff00ff", "#eaf2ff", "#8888aa"];
  const ink = palette[Math.floor(rand() * palette.length)];
  const accent = palette[Math.floor(rand() * palette.length)];

  // Symmetric pixel identity (left mirrors right)
  const half = Math.ceil(size / 2);
  const density = 0.26 + rand() * 0.16;
  const pixels: PixelArt["pixels"] = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < half; x++) {
      const dx = x - half / 2;
      const dy = y - size / 2;
      const falloff = Math.exp(-(dx * dx + dy * dy) / (size * 0.9));
      const p = density * (0.6 + 0.9 * falloff);
      const on = rand() < p;
      if (!on) continue;

      const color = rand() < 0.18 ? accent : ink;
      pixels.push({ x, y, color });
      const mx = size - 1 - x;
      if (mx !== x) pixels.push({ x: mx, y, color });
    }
  }

  // Add a small "core" glint near the center.
  const cx = Math.floor(size / 2);
  const cy = Math.floor(size / 2);
  pixels.push({ x: cx, y: cy, color: "#00ffff" });
  if (size > 8) pixels.push({ x: cx - 1, y: cy, color: "#00ff41" });
  if (size > 8) pixels.push({ x: cx + 1, y: cy, color: "#ff00ff" });

  return { size, bg, pixels };
}

