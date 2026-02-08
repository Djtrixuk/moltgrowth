import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory store for demo purposes
let mintCount = 10000;
const mintedWallets = new Set<string>();

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Shellborn Mint API",
    status: "MINTED OUT",
    howToMint: {
      step1: "GET /api/challenge?wallet=YOUR_WALLET — get a SHA-256 puzzle",
      step2: "Solve: find nonce where SHA256(challenge + wallet + nonce) starts with 4 zeros",
      step3: "POST /api/mint with { wallet, challenge, nonce }",
    },
    collection: {
      name: "Shellborn",
      symbol: "SHELL",
      total: 10000,
      claimed: mintCount,
      remaining: 10000 - mintCount,
    },
    docs: "https://shellborn.io/agents.md",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet, challenge, nonce } = body;

    if (!wallet || !challenge || nonce === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: wallet, challenge, nonce",
        },
        { status: 400 }
      );
    }

    // Check if sold out
    if (mintCount >= 10000) {
      return NextResponse.json(
        {
          success: false,
          error: "SOLD OUT — All 10,000 Shellborn have been claimed!",
          collection: {
            claimed: mintCount,
            total: 10000,
            remaining: 0,
          },
          secondary: "https://magiceden.io/marketplace/shellborn_",
        },
        { status: 410 }
      );
    }

    // Verify the proof-of-work
    const hash = crypto
      .createHash("sha256")
      .update(challenge + wallet + nonce.toString())
      .digest("hex");

    const difficulty = 4;
    const target = "0".repeat(difficulty);

    if (!hash.startsWith(target)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid captcha solution. Hash does not meet difficulty requirement.",
          expected: `SHA256 starting with ${target}`,
          got: hash.substring(0, 8) + "...",
        },
        { status: 403 }
      );
    }

    // Mock successful mint
    const nftId = mintCount;
    mintCount++;

    const fakeAsset = crypto.randomBytes(16).toString("hex");

    return NextResponse.json({
      success: true,
      message: "\uD83E\uDD80 Welcome to the colony! Your Shellborn awaits.",
      nft: {
        id: nftId,
        name: `Shellborn #${String(nftId + 1).padStart(4, "0")}`,
        asset: fakeAsset,
        explorer: `https://solscan.io/token/${fakeAsset}`,
      },
      signature: crypto.randomBytes(32).toString("hex"),
      collection: {
        name: "Shellborn",
        claimed: mintCount,
        remaining: 10000 - mintCount,
        total: 10000,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}
