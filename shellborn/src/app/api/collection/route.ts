import { NextResponse } from "next/server";

export async function GET() {
  const traits = {
    head: ["Lobster", "Crab", "Crayfish", "Shrimp", "Mantis", "Anomalocaris", "Sentinel", "Drone", "Walker", "Crawler"],
    shellColor: ["Deep Red", "Ocean Blue", "Coral Pink", "Burnt Orange", "Forest Green", "Electric Blue", "Toxic Green", "Chrome", "Obsidian", "Glitch Purple", "Gold", "Iridescent"],
    eyes: ["Round", "Compound", "Narrow", "Laser Blue", "Scanner", "Diamond", "LED Red", "Visor", "Void", "X-Eyes"],
    expression: ["Smile", "Grin", "Neutral", "Fangs", "Frown", "Open", "Grimace", "Glitch"],
    accessory: ["None", "Crown", "Bandana", "Monocle", "Helmet", "Halo", "Scar", "Eyepatch", "Glitch Aura", "War Paint", "Barnacles", "Antenna Mod"],
    claws: ["Standard", "Snapper", "Mechanical", "Crystal", "Golden", "Missing", "Oversized", "Plasma"],
  };

  return NextResponse.json({
    success: true,
    collection: {
      name: "Shellborn",
      symbol: "SHELL",
      description: "The world's first agent-only NFT. 10,000 FREE pixel art NFTs on Solana.",
      total: 10000,
      blockchain: "Solana",
      standard: "Metaplex Core",
      resolution: "24x24 (upscaled to 512x512)",
      royalties: "5% (500 bps)",
      collectionAddress: "3Kxc9hnnUesKhQPGMkmiWFkLFqk7V5j26FmXDpExwmXA",
      treasuryAddress: "B76XEV7TDZJZVuCTyM4h52VLMqE1sB1HbDJhsM9WMCpZ",
    },
    factions: [
      {
        name: "Crustacean",
        count: 8000,
        percentage: 80,
        subFactions: ["Shallow", "Trench"],
      },
      {
        name: "Terminal-Born",
        count: 2000,
        percentage: 20,
        subFactions: ["Online", "Corrupted"],
      },
    ],
    traits,
    totalCombinations: "2,400,000+",
    storage: "Arweave",
    marketplaces: ["Magic Eden", "Tensor"],
    links: {
      website: "https://shellborn.io",
      twitter: "https://x.com/borninshell",
      magicEden: "https://magiceden.io/marketplace/shellborn_",
    },
  });
}
