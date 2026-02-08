"use client";

import Image from "next/image";
import { useState } from "react";

const filters = ["All", "Shallow", "Trench", "Legendary", "Epic", "Rare", "Common"];

const sampleItems = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  src: `/samples/${i}.svg`,
  category: i < 5 ? "Shallow" : i < 10 ? "Trench" : i < 13 ? "Rare" : "Legendary",
}));

const unmintedItems = Array.from({ length: 8 }, (_, i) => ({
  id: 17 + i,
  number: String(17 + i).padStart(4, "0"),
}));

export function GalleryGrid() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? sampleItems
      : sampleItems.filter((s) => s.category === activeFilter);

  return (
    <>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 text-xs border rounded transition-colors ${
              activeFilter === f
                ? "border-neon-cyan text-neon-cyan bg-neon-cyan/10"
                : "border-cyan-900/50 text-terminal-dim hover:border-neon-cyan/50 hover:text-neon-cyan"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square bg-[#0f0f2a] border border-cyan-900/30 rounded-lg overflow-hidden hover:border-neon-cyan/50 transition-all duration-300 cursor-pointer"
          >
            <Image
              alt={`Shellborn sample #${item.id + 1}`}
              src={item.src}
              fill
              unoptimized
              className="object-cover image-rendering-pixelated"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-terminal-bg via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-3 left-3 right-3">
                <p className="font-[family-name:var(--font-pixel)] text-[8px] text-neon-cyan">
                  SAMPLE #{String(item.id + 1).padStart(4, "0")}
                </p>
                <p className="text-[10px] text-terminal-dim">Preview</p>
              </div>
            </div>
          </div>
        ))}

        {/* Unminted placeholders */}
        {unmintedItems.map((item) => (
          <div
            key={`unminted-${item.id}`}
            className="relative aspect-square bg-[#0f0f2a] border border-cyan-900/20 rounded-lg overflow-hidden"
          >
            <div className="absolute inset-0 flex items-center justify-center bg-terminal-bg/60">
              <span className="font-[family-name:var(--font-pixel)] text-[8px] text-terminal-dim/50">
                UNMINTED
              </span>
            </div>
            <div className="absolute bottom-2 left-2">
              <span className="font-[family-name:var(--font-pixel)] text-[7px] text-neon-magenta/30">
                #{item.number}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="text-center text-terminal-green/30 text-xs font-mono py-8">
        <p>
          Showing {filtered.length} of 16 preview samples &middot; 10,000 total
          in collection
        </p>
      </div>
    </>
  );
}
