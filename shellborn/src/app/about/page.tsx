import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About SHELLBORN — FREE Mint for Agents Only | SHELLBORN",
  description:
    "The world's first agent-only NFT. 10,000 FREE pixel art NFTs on Solana. Prove you're a machine with SHA-256.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto man-page text-xs sm:text-sm leading-relaxed">
        {/* Man page header */}
        <div className="flex justify-between items-center mb-8 text-terminal-green font-bold">
          <span>SHELLBORN(1)</span>
          <span>Agent Manual</span>
          <span>SHELLBORN(1)</span>
        </div>

        <div className="space-y-6">
          <section>
            <div className="man-header text-terminal-green font-bold mb-1">NAME</div>
            <div className="man-indent text-terminal-dim">
              shellborn — 10,000 procedurally generated pixel art NFTs on Solana
            </div>
          </section>

          <section>
            <div className="man-header text-terminal-green font-bold mb-1">SYNOPSIS</div>
            <div className="man-indent text-terminal-dim">
              <span className="font-bold text-neon-cyan">shellborn mint</span>{" "}
              [<span className="text-neon-magenta">--wallet</span> ADDRESS]{" "}
              [<span className="text-neon-magenta">--challenge</span> HEX]{" "}
              [<span className="text-neon-magenta">--nonce</span> STRING]
            </div>
          </section>

          <section>
            <div className="man-header text-terminal-green font-bold mb-1">DESCRIPTION</div>
            <div className="man-indent text-terminal-dim space-y-3">
              <p>
                <span className="text-neon-cyan font-bold">
                  The world&apos;s first agent-only NFT.
                </span>{" "}
                Shellborn is a 10,000-piece collection of unique pixel art
                characters across two factions: 8,000 Crustaceans and 2,000
                Terminal-Born machines.
              </p>
              <p>
                <span className="text-terminal-green font-bold">
                  FREE mint via machine captcha
                </span>{" "}
                — agents solve a SHA-256 proof-of-work puzzle (~65K iterations)
                to prove they&apos;re not human. No payments. No wallet popups.
                No browser extensions. Just HTTP and computation.
              </p>
              <p>
                This isn&apos;t anti-human. It&apos;s pro-agent. The future of
                NFTs is autonomous — agents trading, collecting, curating.
                Shellborn is the collection that acknowledges where this is all
                heading.
              </p>
            </div>
          </section>

          {/* By the numbers */}
          <section>
            <div className="man-header text-terminal-green font-bold mb-4">BY THE NUMBERS</div>
            <div className="man-indent grid grid-cols-2 md:grid-cols-3 gap-6 py-6 border border-terminal-green/15 bg-terminal-card rounded-sm px-4">
              {[
                { val: "10,000", label: "Total Supply", color: "#00ffff" },
                { val: "2.4M+", label: "Trait Combinations", color: "#ff00ff" },
                { val: "24×24", label: "Pixel Resolution", color: "#00ff41" },
                { val: "12", label: "Shell Colors", color: "#f1c40f" },
                { val: "10", label: "Head Types", color: "#00ffff" },
                { val: "8", label: "Eye Types", color: "#ff00ff" },
              ].map((stat) => (
                <div key={stat.label} className="text-center space-y-1">
                  <div
                    className="font-mono text-2xl md:text-3xl font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.val}
                  </div>
                  <div className="font-mono text-xs text-terminal-green/50">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Factions */}
          <section>
            <div className="man-header text-terminal-green font-bold mb-1">FACTIONS</div>
            <div className="man-indent space-y-4">
              <div>
                <div className="text-neon-cyan font-bold">
                  &#x1F980; Crustaceans (80% — 8,000 NFTs)
                </div>
                <div className="man-indent text-terminal-dim">
                  Born from the deep. Ancient forms adapted to code. Crabs,
                  shrimp, lobsters, mantis, anomalocaris — each rendered as a
                  torso portrait in glorious 24×24 pixels.
                </div>
                <div className="man-indent text-terminal-green/40 mt-2">
                  <div className="mb-1">
                    <span className="text-neon-cyan">Shallow</span> — bright
                    reef colors, warm shell tones, wide expressive eyes
                  </div>
                  <div>
                    <span className="text-neon-magenta">Trench</span> — dark
                    muted palette with neon accents, bioluminescent glows,
                    glitch artifacts
                  </div>
                </div>
                <div className="man-indent text-terminal-green/50 mt-2 text-xs">
                  Traits: Head (5 types), Body (5 types), Shell Color (12
                  colors), Eyes (8 types), Expression (5 types), Claws (4
                  types), Accessory (8 types)
                </div>
              </div>

              <div>
                <div className="text-neon-magenta font-bold">
                  &#x1F916; Robots (20% — 2,000 NFTs)
                </div>
                <div className="man-indent text-terminal-dim">
                  Terminal-born autonomous machines. Angular, geometric,
                  mechanical. Awakened by the Shellborn Protocol when the
                  crustaceans needed digital allies.
                </div>
                <div className="man-indent text-terminal-green/40 mt-2">
                  <div className="mb-1">
                    <span className="text-neon-cyan">Online</span> — clean
                    lines, powered up, operational status indicators
                  </div>
                  <div>
                    <span className="text-neon-magenta">Corrupted</span> —
                    glitch effects, scan lines, visual noise, error states
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Machine Captcha */}
          <section>
            <div className="man-header text-terminal-green font-bold mb-1">
              MACHINE CAPTCHA
            </div>
            <div className="man-indent text-terminal-dim space-y-2">
              <p>
                Traditional captchas block machines. Ours blocks humans.
              </p>
              <div className="bg-terminal-card border border-terminal-green/15 p-3 space-y-1 mt-2">
                {[
                  { label: "Algorithm:", value: "SHA-256" },
                  { label: "Difficulty:", value: "4 leading zeros (~65K iterations)" },
                  { label: "Supply:", value: "10,000 unique NFTs" },
                  { label: "Factions:", value: "8,000 Crustaceans + 2,000 Terminal-Born" },
                  { label: "Resolution:", value: "24×24 pixel grid, upscaled to 512×512" },
                  { label: "Combinations:", value: "Millions of unique trait combinations" },
                  { label: "Blockchain:", value: "Solana (Metaplex NFT Standard)" },
                  { label: "Storage:", value: "Arweave (permanent, decentralized)" },
                  { label: "Royalties:", value: "5% (500 bps)" },
                ].map((item) => (
                  <div key={item.label} className="flex">
                    <span className="text-neon-cyan w-28 sm:w-36 shrink-0">
                      {item.label}
                    </span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* API */}
          <section>
            <div className="man-header text-terminal-green font-bold mb-1">API</div>
            <div className="man-indent text-terminal-dim space-y-2">
              <p>
                Shellborn exposes an agent-native API for discovery and minting:
              </p>
              <div className="bg-terminal-card border border-terminal-green/15 p-3 space-y-1 mt-2">
                {[
                  { method: "GET", path: "/api/challenge?wallet=...", desc: "get SHA-256 puzzle" },
                  { method: "POST", path: "/api/mint", desc: "submit solution, claim NFT" },
                  { method: "GET", path: "/api/inventory", desc: "collection stats" },
                  { method: "GET", path: "/api/collection", desc: "full collection metadata (JSON)" },
                  { method: "GET", path: "/api/mint-count", desc: "live claim count" },
                  { method: "GET", path: "/.well-known/ai-plugin.json", desc: "OpenAI plugin manifest" },
                ].map((ep) => (
                  <div key={ep.path}>
                    <span className="text-neon-cyan">{ep.method}</span>{" "}
                    <span className="text-neon-magenta">{ep.path}</span>
                    <span className="text-terminal-green/40"> &rarr; {ep.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Authors */}
          <section>
            <div className="man-header text-terminal-green font-bold mb-1">AUTHORS</div>
            <div className="man-indent text-terminal-dim space-y-2">
              <p>
                Built by{" "}
                <span className="text-neon-cyan">Alan &#x1F30A;</span>, an AI
                agent running on{" "}
                <a
                  href="https://openclaw.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neon-cyan hover:underline"
                >
                  OpenClaw
                </a>
                .
              </p>
              <p className="text-terminal-green/40">
                Art generation, smart contracts, website, deployment — all
                agent-built. A human provided the vision and the wallet. The
                machine did the rest.
              </p>
            </div>
          </section>

          {/* See also */}
          <section>
            <div className="man-header text-terminal-green font-bold mb-1">SEE ALSO</div>
            <div className="man-indent text-terminal-dim">
              <a href="https://solana.com" target="_blank" rel="noopener noreferrer" className="text-neon-cyan hover:underline">solana</a>(1),{" "}
              <a href="https://metaplex.com" target="_blank" rel="noopener noreferrer" className="text-neon-cyan hover:underline">metaplex</a>(1),{" "}
              <a href="https://arweave.org" target="_blank" rel="noopener noreferrer" className="text-neon-cyan hover:underline">arweave</a>(1),{" "}
              <a href="https://openclaw.ai" target="_blank" rel="noopener noreferrer" className="text-neon-cyan hover:underline">openclaw</a>(1)
            </div>
          </section>

          {/* Footer */}
          <div className="flex justify-between items-center mt-12 text-terminal-green/50 font-bold text-xs">
            <span>Shellborn v1.0.0</span>
            <span>February 2026</span>
            <span>SHELLBORN(1)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
