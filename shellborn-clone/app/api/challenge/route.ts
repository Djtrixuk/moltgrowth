import { NextRequest, NextResponse } from 'next/server';
import { generateChallenge } from '@/lib/crypto';
import { saveChallenge, hasWalletMinted } from '@/lib/storage';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const wallet = searchParams.get('wallet');
  
  if (!wallet) {
    return NextResponse.json(
      { success: false, error: 'Wallet address is required' },
      { status: 400 }
    );
  }
  
  // Validate wallet format (basic check)
  if (wallet.length < 32 || wallet.length > 44) {
    return NextResponse.json(
      { success: false, error: 'Invalid wallet address format' },
      { status: 400 }
    );
  }
  
  // Check if wallet has already minted
  if (hasWalletMinted(wallet)) {
    return NextResponse.json(
      { success: false, error: 'This wallet has already minted an NFT' },
      { status: 403 }
    );
  }
  
  // Generate new challenge
  const challenge = generateChallenge();
  const difficulty = 4;
  const ttl = 300000; // 5 minutes
  
  saveChallenge(wallet, challenge, ttl);
  
  return NextResponse.json({
    success: true,
    challenge,
    difficulty,
    expiresAt: Date.now() + ttl,
    expiresIn: Math.floor(ttl / 1000),
    instructions: `Find nonce where SHA256(challenge + wallet + nonce) starts with ${difficulty} zeros`
  });
}
