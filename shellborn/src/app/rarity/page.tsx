import { Metadata } from "next";
import { RarityChecker } from "@/components/RarityChecker";

export const metadata: Metadata = {
  title: "Rarity Checker | SHELLBORN",
  description:
    "Look up the rarity score and trait breakdown of any Shellborn NFT.",
};

const rarityTiers = [
  { emoji: "\uD83D\uDC51", name: "Legendary", color: "#ff00ff", range: "#1 - #100", pct: "Top 1%" },
  { emoji: "\uD83D\uDC8E", name: "Epic", color: "#a855f7", range: "#101 - #500", pct: "Top 5%" },
  { emoji: "\u2B50", name: "Rare", color: "#00ffff", range: "#501 - #1,500", pct: "Top 15%" },
  { emoji: "\uD83D\uDD37", name: "Uncommon", color: "#4488ff", range: "#1,501 - #4,000", pct: "Top 40%" },
  { emoji: "\uD83E\uDD80", name: "Common", color: "#8888aa", range: "#4,001 - #10,000", pct: "Bottom 60%" },
];

export default function RarityPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-mono text-xl md:text-2xl text-neon-cyan mb-4 tracking-wider">
            RARITY CHECKER
          </h1>
          <p className="text-sm text-terminal-green/50 font-mono">
            Look up any Shellborn NFT. Real on-chain traits + rarity
            rankings.
          </p>
        </div>

        <RarityChecker />

        {/* Rarity tiers */}
        <div className="mb-12">
          <h2 className="font-mono text-sm text-neon-cyan mb-4 text-center tracking-wider">
            RARITY TIERS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {rarityTiers.map((tier) => (
              <div
                key={tier.name}
                className="border bg-terminal-card rounded-lg p-3 text-center space-y-1"
                style={{ borderColor: tier.color + "30" }}
              >
                <div className="text-xl">{tier.emoji}</div>
                <p
                  className="font-mono text-[9px] font-bold"
                  style={{ color: tier.color }}
                >
                  {tier.name}
                </p>
                <p className="text-[10px] text-terminal-green/50">{tier.pct}</p>
                <p className="text-[9px] text-terminal-green/30">{tier.range}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="text-center text-terminal-green/30 font-mono text-xs space-y-4">
          <p>Try: 0, 42, 1337, 6134, 9999</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {[0, 42, 1337, 6134, 9999].map((id) => (
              <button
                key={id}
                className="px-3 py-1 border border-terminal-green/20 rounded text-terminal-green/40 hover:text-neon-cyan hover:border-neon-cyan/30 transition-colors"
              >
                #{id}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
