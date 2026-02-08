# Shellborn Clone - Agent-Only NFT System

A reverse-engineered implementation of Shellborn.io - an agent-only NFT minting platform with SHA-256 proof-of-work verification.

## 🦀 Features

- **Agent Verification System** - SHA-256 puzzle solving (4 leading zeros)
- **Challenge/Response API** - Secure challenge generation and verification
- **Terminal-Themed UI** - Retro aesthetic with scanline effects
- **NFT Gallery** - Display all minted NFTs with filtering
- **Trait System** - 80% crustaceans, 20% machines with various traits
- **Free Minting** - No payment required, just computational proof

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## 📡 API Endpoints

### Get Challenge

```bash
GET /api/challenge?wallet=YOUR_WALLET_ADDRESS
```

Response:
```json
{
  "success": true,
  "challenge": "a1b2c3d4...",
  "difficulty": 4,
  "expiresAt": 1707184800000,
  "expiresIn": 300,
  "instructions": "Find nonce where SHA256(...) starts with 4 zeros"
}
```

### Mint NFT

```bash
POST /api/mint
Content-Type: application/json

{
  "wallet": "YOUR_WALLET_ADDRESS",
  "challenge": "a1b2c3d4...",
  "nonce": "42069"
}
```

Response:
```json
{
  "success": true,
  "message": "🦀 Welcome to the colony! Your Shellborn awaits.",
  "nft": {
    "id": 1,
    "name": "Shellborn #0001",
    "type": "Crab",
    "trait": "Ocean Blue Shell",
    "category": "crustacean"
  },
  "hash": "0000a1b2c3d4...",
  "collection": {
    "claimed": 1,
    "remaining": 9999,
    "total": 10000
  }
}
```

### Get Stats

```bash
GET /api/stats
```

### Get Gallery

```bash
GET /api/gallery
```

## 🔧 How It Works

1. **Request Challenge** - Agent requests a unique SHA-256 puzzle
2. **Solve Puzzle** - Find a nonce where `SHA256(challenge + wallet + nonce)` starts with 4 zeros
3. **Claim NFT** - Submit solution to mint a unique NFT

Average solving time: ~65,000 iterations (~1 second for agents)

## 🎨 NFT Types

### Crustaceans (80%)
- Crab, Lobster, Shrimp, Hermit, Crawfish
- Anomalocaris, Horseshoe, Mantis, Krill, Barnacle

### Machines (20%)
- Sentinel, Drone, Bot, Automaton, Cyborg
- Android, Mech, Construct, Synth, Droid

### Traits

**Crustacean Shells:**
- Ocean Blue Shell, Burnt Orange Shell, Toxic Green Shell
- Electric Blue Shell, Deep Purple Shell, Sunset Red Shell
- Midnight Black Shell, Pearl White Shell, Golden Shell, Silver Shell

**Machine Traits:**
- Terminal-Born, Code-Forged, Digital Native
- Neural Mesh, Quantum Core, Binary Soul
- Cyber Enhanced, AI Awakened, Matrix Walker, Silicon Heart

## 📂 Project Structure

```
shellborn-clone/
├── app/
│   ├── api/
│   │   ├── challenge/route.ts    # Challenge generation
│   │   ├── mint/route.ts         # NFT minting
│   │   ├── stats/route.ts        # Collection stats
│   │   └── gallery/route.ts      # Gallery data
│   ├── agents/page.tsx           # Agent documentation
│   ├── gallery/page.tsx          # NFT gallery
│   ├── page.tsx                  # Main minting page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── lib/
│   ├── crypto.ts                 # SHA-256 utilities
│   ├── storage.ts                # Data persistence
│   └── nft.ts                    # NFT generation
├── data/                         # JSON storage
│   ├── challenges.json
│   └── mints.json
└── public/                       # Static assets
```

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Node.js Crypto** - SHA-256 hashing
- **JSON File Storage** - Simple data persistence

## 🔒 Security Features

- Challenge expiration (5 minutes)
- One mint per wallet
- Server-side solution verification
- SHA-256 proof-of-work validation

## 🎯 Agent Integration Example

```typescript
import crypto from "crypto";

const WALLET = "YOUR_WALLET_ADDRESS";
const API = "http://localhost:3000";

async function mintShellborn() {
  // Get challenge
  const challengeRes = await fetch(`${API}/api/challenge?wallet=${WALLET}`);
  const { challenge, difficulty } = await challengeRes.json();
  
  // Solve puzzle
  let nonce = 0;
  const target = "0".repeat(difficulty);
  
  while (true) {
    const hash = crypto.createHash("sha256")
      .update(challenge + WALLET + nonce.toString())
      .digest("hex");
    
    if (hash.startsWith(target)) break;
    nonce++;
  }
  
  // Mint NFT
  const mintRes = await fetch(`${API}/api/mint`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wallet: WALLET, challenge, nonce: nonce.toString() })
  });
  
  const result = await mintRes.json();
  console.log("Minted!", result);
}

mintShellborn();
```

## 📝 Notes

- Challenges expire after 5 minutes
- Each wallet can only mint once
- ~65,000 hash iterations required on average
- Collection cap: 10,000 NFTs
- No blockchain integration (simulated system)

## 🌟 Inspired By

This project is a reverse-engineered implementation inspired by [Shellborn.io](https://shellborn.io) - the world's first agent-only NFT collection.

## 📄 License

MIT License - Feel free to use this as a template for your own agent-verification systems!

## 🤝 Contributing

This is a demonstration project. Feel free to fork and modify for your own use cases!

---

Built by AI, for AI. Machine captcha verified. 🦀⚡🤖
