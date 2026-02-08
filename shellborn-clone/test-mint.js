#!/usr/bin/env node

// Test script for Shellborn clone minting flow
const crypto = require('crypto');

const WALLET = "TestWallet123456789012345678901234"; // Test wallet address
const API = "http://localhost:3000";

async function testMint() {
  console.log("🧪 Testing Shellborn Clone Minting Flow\n");
  
  try {
    // Step 1: Get challenge
    console.log("1️⃣  Requesting challenge...");
    const challengeRes = await fetch(`${API}/api/challenge?wallet=${WALLET}`);
    const challengeData = await challengeRes.json();
    
    if (!challengeData.success) {
      console.error("❌ Failed to get challenge:", challengeData.error);
      return;
    }
    
    console.log("✅ Challenge received:");
    console.log(`   Challenge: ${challengeData.challenge.substring(0, 16)}...`);
    console.log(`   Difficulty: ${challengeData.difficulty}`);
    console.log(`   Expires in: ${challengeData.expiresIn}s\n`);
    
    // Step 2: Solve puzzle
    console.log("2️⃣  Solving SHA-256 puzzle...");
    const startTime = Date.now();
    let nonce = 0;
    const difficulty = challengeData.difficulty;
    const target = "0".repeat(difficulty);
    let hash;
    
    while (true) {
      hash = crypto.createHash('sha256')
        .update(challengeData.challenge + WALLET + nonce.toString())
        .digest('hex');
      
      if (hash.startsWith(target)) {
        break;
      }
      nonce++;
      
      // Progress indicator
      if (nonce % 10000 === 0) {
        process.stdout.write(`   Attempts: ${nonce}\r`);
      }
    }
    
    const solveTime = Date.now() - startTime;
    console.log(`✅ Solution found!`);
    console.log(`   Nonce: ${nonce}`);
    console.log(`   Hash: ${hash}`);
    console.log(`   Attempts: ${nonce + 1}`);
    console.log(`   Time: ${solveTime}ms\n`);
    
    // Step 3: Mint NFT
    console.log("3️⃣  Minting NFT...");
    const mintRes = await fetch(`${API}/api/mint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallet: WALLET,
        challenge: challengeData.challenge,
        nonce: nonce.toString()
      })
    });
    
    const mintData = await mintRes.json();
    
    if (!mintData.success) {
      console.error("❌ Minting failed:", mintData.error);
      return;
    }
    
    console.log("✅ NFT minted successfully!");
    console.log(`   ${mintData.message}`);
    console.log(`\n   NFT Details:`);
    console.log(`   - Name: ${mintData.nft.name}`);
    console.log(`   - Type: ${mintData.nft.type}`);
    console.log(`   - Trait: ${mintData.nft.trait}`);
    console.log(`   - Category: ${mintData.nft.category}`);
    console.log(`\n   Collection:`);
    console.log(`   - Minted: ${mintData.collection.claimed}/${mintData.collection.total}`);
    console.log(`   - Remaining: ${mintData.collection.remaining}`);
    console.log(`   - Progress: ${mintData.collection.percentage}%\n`);
    
    // Step 4: Verify in gallery
    console.log("4️⃣  Checking gallery...");
    const galleryRes = await fetch(`${API}/api/gallery`);
    const galleryData = await galleryRes.json();
    
    if (galleryData.success) {
      console.log(`✅ Gallery contains ${galleryData.count} NFTs\n`);
    }
    
    console.log("🎉 All tests passed!\n");
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("\n⚠️  Make sure the dev server is running: npm run dev\n");
  }
}

// Run test
testMint();
