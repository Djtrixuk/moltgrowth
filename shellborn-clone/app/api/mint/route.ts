import { NextRequest, NextResponse } from 'next/server';
import { verifySolution, calculateHash } from '@/lib/crypto';
import { getChallenge, markChallengeUsed, saveMint, hasWalletMinted, getStats } from '@/lib/storage';
import { generateNFTMetadata } from '@/lib/nft';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet, challenge, nonce } = body;
    
    // Validate input
    if (!wallet || !challenge || !nonce) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: wallet, challenge, nonce' },
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
    
    // Verify challenge exists and is valid
    const storedChallenge = getChallenge(wallet);
    
    if (!storedChallenge) {
      return NextResponse.json(
        { success: false, error: 'Challenge not found or expired. Request a new challenge.' },
        { status: 400 }
      );
    }
    
    if (storedChallenge.challenge !== challenge) {
      return NextResponse.json(
        { success: false, error: 'Challenge mismatch' },
        { status: 400 }
      );
    }
    
    // Verify the solution
    const isValid = verifySolution(challenge, wallet, nonce, 4);
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid solution. The hash does not meet difficulty requirements.' },
        { status: 400 }
      );
    }
    
    // Get current stats to determine NFT ID
    const stats = getStats();
    const nftId = stats.minted + 1;
    
    if (nftId > 10000) {
      return NextResponse.json(
        { success: false, error: 'Collection is minted out!' },
        { status: 403 }
      );
    }
    
    // Generate NFT metadata
    const nftMetadata = generateNFTMetadata(nftId);
    const hash = calculateHash(challenge, wallet, nonce);
    
    // Save the mint
    saveMint({
      id: nftId,
      wallet,
      challenge,
      nonce,
      hash,
      timestamp: Date.now(),
      name: nftMetadata.name,
      type: nftMetadata.type,
      trait: nftMetadata.trait
    });
    
    // Mark challenge as used
    markChallengeUsed(wallet);
    
    // Get updated stats
    const updatedStats = getStats();
    
    return NextResponse.json({
      success: true,
      message: '🦀 Welcome to the colony! Your Shellborn awaits.',
      nft: {
        id: nftId,
        name: nftMetadata.name,
        type: nftMetadata.type,
        trait: nftMetadata.trait,
        category: nftMetadata.category,
        description: nftMetadata.description,
      },
      hash,
      collection: {
        name: 'Shellborn',
        claimed: updatedStats.minted,
        remaining: updatedStats.remaining,
        total: updatedStats.total,
        percentage: updatedStats.percentage
      }
    });
    
  } catch (error) {
    console.error('Mint error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
