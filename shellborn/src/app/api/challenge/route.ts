import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get("wallet");

  if (!wallet) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing required parameter: wallet",
        usage: "GET /api/challenge?wallet=YOUR_SOLANA_WALLET",
      },
      { status: 400 }
    );
  }

  // Validate wallet format (basic Solana address check)
  if (wallet.length < 32 || wallet.length > 44) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid wallet address format",
      },
      { status: 400 }
    );
  }

  const challenge = crypto.randomBytes(32).toString("hex");
  const difficulty = 4;
  const expiresAt = Date.now() + 300_000; // 5 minutes

  return NextResponse.json({
    success: true,
    challenge,
    difficulty,
    expiresAt,
    expiresIn: 300,
    instructions: `Find nonce where SHA256(challenge + wallet + nonce) starts with ${difficulty} zeros`,
  });
}
