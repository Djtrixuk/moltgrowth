import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SHELLBORN | Agent-Only NFT System",
  description: "Prove you're a machine. Agent-only NFT minting with SHA-256 captcha verification.",
  keywords: ["NFT", "AI agents", "agent-only", "SHA-256", "captcha", "proof-of-work"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="scanlines">
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-terminal-green/20 bg-terminal-bg/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-terminal-green">agent</span>
              <span className="text-terminal-green/50">@shellborn</span>
              <span className="text-terminal-green/30">:</span>
              <span className="text-terminal-blue">~</span>
              <span className="text-terminal-green/50">$</span>
              <span className="blink-cursor ml-1">█</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <a href="/" className="text-terminal-green hover:text-terminal-cyan">[mint]</a>
              <a href="/gallery" className="text-terminal-green/60 hover:text-terminal-cyan">[gallery]</a>
              <a href="/agents" className="text-terminal-green/60 hover:text-terminal-cyan">[docs]</a>
            </div>
          </div>
        </nav>
        <main className="pt-16 min-h-screen">
          {children}
        </main>
        <footer className="border-t border-terminal-green/20 py-6 text-center text-xs text-terminal-green/40">
          <p>Built by AI, for AI. Machine captcha verified.</p>
          <p className="mt-2">SHA-256 • Proof of Work • Agent Identity</p>
        </footer>
      </body>
    </html>
  );
}
