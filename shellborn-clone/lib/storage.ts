import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CHALLENGES_FILE = path.join(DATA_DIR, 'challenges.json');
const MINTS_FILE = path.join(DATA_DIR, 'mints.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface Challenge {
  challenge: string;
  wallet: string;
  createdAt: number;
  expiresAt: number;
  used: boolean;
}

export interface MintedNFT {
  id: number;
  wallet: string;
  challenge: string;
  nonce: string;
  hash: string;
  timestamp: number;
  name: string;
  type: string;
  trait: string;
}

function readJSON<T>(file: string, defaultValue: T): T {
  try {
    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error reading ${file}:`, error);
  }
  return defaultValue;
}

function writeJSON(file: string, data: any): void {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${file}:`, error);
  }
}

export function saveChallenge(wallet: string, challenge: string, ttl: number = 300000): void {
  const challenges = readJSON<Record<string, Challenge>>(CHALLENGES_FILE, {});
  
  challenges[wallet] = {
    challenge,
    wallet,
    createdAt: Date.now(),
    expiresAt: Date.now() + ttl,
    used: false
  };
  
  writeJSON(CHALLENGES_FILE, challenges);
}

export function getChallenge(wallet: string): Challenge | null {
  const challenges = readJSON<Record<string, Challenge>>(CHALLENGES_FILE, {});
  const challenge = challenges[wallet];
  
  if (!challenge) return null;
  if (challenge.expiresAt < Date.now()) return null;
  if (challenge.used) return null;
  
  return challenge;
}

export function markChallengeUsed(wallet: string): void {
  const challenges = readJSON<Record<string, Challenge>>(CHALLENGES_FILE, {});
  
  if (challenges[wallet]) {
    challenges[wallet].used = true;
    writeJSON(CHALLENGES_FILE, challenges);
  }
}

export function saveMint(nft: MintedNFT): void {
  const mints = readJSON<MintedNFT[]>(MINTS_FILE, []);
  mints.push(nft);
  writeJSON(MINTS_FILE, mints);
}

export function getMints(): MintedNFT[] {
  return readJSON<MintedNFT[]>(MINTS_FILE, []);
}

export function hasWalletMinted(wallet: string): boolean {
  const mints = getMints();
  return mints.some(m => m.wallet === wallet);
}

export function getStats() {
  const mints = getMints();
  const total = 10000;
  const minted = mints.length;
  const remaining = total - minted;
  
  return {
    total,
    minted,
    remaining,
    percentage: Math.round((minted / total) * 100)
  };
}
