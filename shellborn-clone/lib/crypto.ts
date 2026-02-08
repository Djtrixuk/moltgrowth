import crypto from 'crypto';

export function generateChallenge(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function verifySolution(
  challenge: string,
  wallet: string,
  nonce: string,
  difficulty: number = 4
): boolean {
  const data = challenge + wallet + nonce;
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  
  // Check if hash starts with required number of zeros
  for (let i = 0; i < difficulty; i++) {
    if (hash[i] !== '0') {
      return false;
    }
  }
  
  return true;
}

export function calculateHash(challenge: string, wallet: string, nonce: string): string {
  const data = challenge + wallet + nonce;
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function solvePuzzle(
  challenge: string,
  wallet: string,
  difficulty: number = 4
): { nonce: string; hash: string; attempts: number } {
  let nonce = 0;
  let attempts = 0;
  
  while (true) {
    attempts++;
    const hash = calculateHash(challenge, wallet, nonce.toString());
    
    let zeros = 0;
    for (const c of hash) {
      if (c === '0') zeros++;
      else break;
    }
    
    if (zeros >= difficulty) {
      return {
        nonce: nonce.toString(),
        hash,
        attempts
      };
    }
    
    nonce++;
  }
}
