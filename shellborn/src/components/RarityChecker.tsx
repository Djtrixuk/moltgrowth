"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";

interface RarityResult {
  id: number;
  name: string;
  rank: number;
  score: number;
  tier: string;
  tierColor: string;
  faction: string;
  traits: { trait: string; value: string; rarity: string }[];
}

function generateMockRarity(tokenId: number): RarityResult {
  const heads = ["Lobster", "Crab", "Crayfish", "Shrimp", "Mantis", "Anomalocaris", "Sentinel", "Drone", "Walker", "Crawler"];
  const colors = ["Deep Red", "Ocean Blue", "Coral Pink", "Burnt Orange", "Forest Green", "Electric Blue", "Toxic Green", "Chrome", "Obsidian", "Glitch Purple", "Gold", "Iridescent"];
  const eyes = ["Round", "Compound", "Narrow", "Laser Blue", "Scanner", "Diamond", "LED Red", "Visor"];
  const expressions = ["Smile", "Grin", "Neutral", "Fangs", "Frown"];
  const accessories = ["None", "Crown", "Bandana", "Monocle", "Helmet", "Halo", "Scar", "Eyepatch"];
  const claws = ["Standard", "Snapper", "Mechanical", "Crystal", "Golden", "Oversized"];

  // Deterministic pseudo-random based on tokenId
  const seed = (tokenId * 2654435761) >>> 0;
  const pick = (arr: string[], s: number) => arr[s % arr.length];

  const rank = ((seed % 10000) + 1);
  const score = (10000 - rank) / 100;
  const isRobot = tokenId % 5 === 0;
  const faction = isRobot ? "Terminal-Born" : "Crustacean";

  let tier = "Common";
  let tierColor = "#8888aa";
  if (rank <= 100) { tier = "Legendary"; tierColor = "#ff00ff"; }
  else if (rank <= 500) { tier = "Epic"; tierColor = "#a855f7"; }
  else if (rank <= 1500) { tier = "Rare"; tierColor = "#00ffff"; }
  else if (rank <= 4000) { tier = "Uncommon"; tierColor = "#4488ff"; }

  return {
    id: tokenId,
    name: `Shellborn #${String(tokenId + 1).padStart(4, "0")}`,
    rank,
    score: Math.round(score * 100) / 100,
    tier,
    tierColor,
    faction,
    traits: [
      { trait: "Head", value: pick(heads, seed), rarity: `${((seed % 20) + 1)}%` },
      { trait: "Shell Color", value: pick(colors, seed >> 4), rarity: `${((seed >> 4) % 15) + 2}%` },
      { trait: "Eyes", value: pick(eyes, seed >> 8), rarity: `${((seed >> 8) % 18) + 3}%` },
      { trait: "Expression", value: pick(expressions, seed >> 12), rarity: `${((seed >> 12) % 25) + 5}%` },
      { trait: "Accessory", value: pick(accessories, seed >> 16), rarity: `${((seed >> 16) % 30) + 3}%` },
      { trait: "Claws", value: pick(claws, seed >> 20), rarity: `${((seed >> 20) % 22) + 5}%` },
    ],
  };
}

export function RarityChecker() {
  const [tokenId, setTokenId] = useState("");
  const [result, setResult] = useState<RarityResult | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const id = parseInt(tokenId);
    if (isNaN(id) || id < 0 || id > 9999) return;
    setResult(generateMockRarity(id));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-3 mb-8 max-w-lg mx-auto">
        <input
          type="text"
          placeholder="Enter token ID (0-9999)"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          className="flex-1 px-4 py-3 bg-terminal-card border border-terminal-green/30 rounded text-sm text-terminal-green placeholder-terminal-green/30 focus:border-neon-cyan/50 focus:outline-none transition-colors font-mono"
        />
        <button
          type="submit"
          className="px-6 py-3 border border-neon-cyan text-neon-cyan font-mono text-sm rounded hover:bg-neon-cyan/10 transition-colors disabled:opacity-50"
        >
          CHECK
        </button>
      </form>

      {result && (
        <div className="max-w-lg mx-auto mb-12 bg-terminal-card border border-terminal-green/20 rounded-lg p-6 space-y-4">
          <div className="flex items-start gap-4">
            {/* Preview image */}
            <div className="w-24 h-24 shrink-0 relative rounded overflow-hidden border border-terminal-green/20">
              <Image
                src={`/samples/${result.id % 16}.svg`}
                alt={result.name}
                fill
                unoptimized
                className="object-cover image-rendering-pixelated"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-mono text-sm text-neon-cyan font-bold">
                {result.name}
              </h3>
              <p className="text-xs text-terminal-green/50">{result.faction}</p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                  style={{ color: result.tierColor, borderColor: result.tierColor + "40", borderWidth: 1 }}
                >
                  {result.tier}
                </span>
                <span className="text-xs text-terminal-green/40">
                  Rank #{result.rank} &middot; Score {result.score}
                </span>
              </div>
            </div>
          </div>

          {/* Traits */}
          <div className="space-y-2">
            <h4 className="text-xs text-neon-cyan font-mono">TRAITS</h4>
            {result.traits.map((t) => (
              <div
                key={t.trait}
                className="flex items-center justify-between text-xs border-b border-terminal-green/10 pb-1"
              >
                <span className="text-terminal-green/50">{t.trait}</span>
                <span className="text-terminal-green">{t.value}</span>
                <span className="text-terminal-green/30">{t.rarity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
