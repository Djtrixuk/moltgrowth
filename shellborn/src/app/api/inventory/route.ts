import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get("wallet");

  const baseStats = {
    success: true,
    collection: {
      name: "Shellborn",
      symbol: "SHELL",
      total: 10000,
      claimed: 10000,
      remaining: 0,
      status: "MINTED_OUT",
    },
    factions: {
      crustacean: { total: 8000, claimed: 8000 },
      terminalBorn: { total: 2000, claimed: 2000 },
    },
    rarity: {
      legendary: 100,
      epic: 400,
      rare: 1000,
      uncommon: 2500,
      common: 6000,
    },
  };

  if (wallet) {
    return NextResponse.json({
      ...baseStats,
      wallet: {
        address: wallet,
        holdings: 0,
        nfts: [],
      },
    });
  }

  return NextResponse.json(baseStats);
}
