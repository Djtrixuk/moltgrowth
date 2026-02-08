"use client";

import Image from "next/image";

const samples = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  src: `/samples/${i}.svg`,
  name: `Shellborn #${String(i + 1).padStart(4, "0")}`,
  trait: i >= 13 ? "Sentinel — Terminal-Born" : ["Crab — Deep Red Shell", "Lobster — Ocean Blue Shell", "Shrimp — Coral Pink Shell", "Mantis — Burnt Orange Shell", "Hermit — Forest Green Shell", "Crayfish — Electric Blue Shell", "Anomalocaris — Toxic Green Shell", "Crab — Chrome Shell", "Lobster — Obsidian Shell", "Shrimp — Glitch Purple Shell", "Mantis — Gold Shell", "Crab — Iridescent Shell", "Anomalocaris — Ocean Blue Shell"][i] || "Crustacean — Deep Sea",
}));

function SampleCard({ sample }: { sample: typeof samples[0] }) {
  return (
    <div className="group relative w-32 h-32 md:w-40 md:h-40 shrink-0 bg-terminal-card border border-terminal-green/20 rounded-sm overflow-hidden hover:border-terminal-green/50 transition-all duration-300">
      <Image
        src={sample.src}
        alt={`Shellborn sample — ${sample.trait}`}
        fill
        unoptimized
        className="object-cover image-rendering-pixelated"
        sizes="160px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-terminal-bg via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-2 left-2 right-2 font-mono">
          <p className="text-[8px] text-terminal-green">
            SHELLBORN #{String(sample.id + 1).padStart(4, "0")}
          </p>
          <p className="text-[8px] text-terminal-green/40 truncate">
            {sample.trait}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ScrollingSamples() {
  const row1 = samples.slice(0, 8);
  const row2 = samples.slice(8, 16);

  return (
    <section className="py-12 overflow-hidden">
      <div className="text-center mb-8">
        <h2 className="font-mono text-sm text-neon-cyan tracking-wider">
          SAMPLE SPECIMENS
        </h2>
        <p className="text-xs text-terminal-green/40 mt-1">
          Preview from the colony. 10,000 unique identities await.
        </p>
      </div>

      {/* Row 1 - scrolls left */}
      <div className="overflow-hidden mb-4">
        <div className="flex gap-4 animate-scroll-left" style={{ width: "max-content" }}>
          {[...row1, ...row1, ...row1].map((s, i) => (
            <SampleCard key={`r1-${i}`} sample={s} />
          ))}
        </div>
      </div>

      {/* Row 2 - scrolls right */}
      <div className="overflow-hidden">
        <div className="flex gap-4 animate-scroll-right" style={{ width: "max-content" }}>
          {[...row2, ...row2, ...row2].map((s, i) => (
            <SampleCard key={`r2-${i}`} sample={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
