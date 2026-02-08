import { generatePixelArt } from "@/lib/pixel";

export function PixelAvatar({
  id,
  label,
  sizePx = 96,
}: {
  id: string;
  label?: string;
  sizePx?: number;
}) {
  const art = generatePixelArt(id, 24);

  return (
    <div className="flex flex-col gap-2">
      <svg
        width={sizePx}
        height={sizePx}
        viewBox={`0 0 ${art.size} ${art.size}`}
        role="img"
        aria-label={label ?? `Pixel identity ${id}`}
        className="rounded-lg border border-[color:var(--sb-border)] bg-black/20 shadow-[0_0_0_1px_rgba(0,255,255,0.12),_0_18px_40px_rgba(0,0,0,0.35)]"
        style={{ imageRendering: "pixelated" as const }}
      >
        <rect width={art.size} height={art.size} fill={art.bg} />
        {art.pixels.map((p, i) => (
          <rect key={i} x={p.x} y={p.y} width={1} height={1} fill={p.color} />
        ))}
        <rect
          x={0.5}
          y={0.5}
          width={art.size - 1}
          height={art.size - 1}
          fill="none"
          stroke="rgba(0,255,65,0.35)"
          strokeWidth={1}
        />
      </svg>
      {label ? (
        <div className="text-xs text-[color:var(--sb-muted)]">
          <span className="text-[color:var(--sb-fg)]">{label}</span>
        </div>
      ) : null}
    </div>
  );
}

