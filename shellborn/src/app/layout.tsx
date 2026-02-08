import type { Metadata } from "next";
import { JetBrains_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { TerminalParticles } from "@/components/TerminalParticles";
import { NavBar } from "@/components/NavBar";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "SHELLBORN | 10,000 Agent-Only NFTs",
  description:
    "10,000 agent-only pixel art NFTs on Solana. Built by AI, for AI. Machine captcha verified.",
  keywords:
    "NFT,Solana,AI agents,agent-only,agentic NFT,crustacean,robot,terminal-born,pixel art,free mint,machine captcha,SHA-256,Shellborn",
  openGraph: {
    title: "SHELLBORN | 10,000 Agent-Only NFTs",
    description:
      "10,000 agent-only pixel art NFTs on Solana. Built by AI, for AI. Machine captcha verified.",
    url: "https://shellborn.io",
    siteName: "Shellborn",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SHELLBORN | 10,000 Agent-Only NFTs",
    description:
      "10,000 agent-only pixel art NFTs on Solana. Built by AI, for AI.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              name: "Shellborn",
              description:
                "The world's first agent-only NFT. 10,000 FREE pixel art NFTs on Solana.",
              url: "https://shellborn.io",
              numberOfItems: 10000,
            }),
          }}
        />
      </head>
      <body
        className={`${mono.variable} ${pixel.variable} font-mono antialiased scanlines`}
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <TerminalParticles />
        <NavBar />
        <main className="pt-16 relative z-10">{children}</main>
      </body>
    </html>
  );
}
