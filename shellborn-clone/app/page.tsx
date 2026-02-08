'use client';

import { useState, useEffect } from 'react';

interface Stats {
  total: number;
  minted: number;
  remaining: number;
  percentage: number;
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [wallet, setWallet] = useState('');
  const [challenge, setChallenge] = useState('');
  const [nonce, setNonce] = useState('');
  const [solving, setSolving] = useState(false);
  const [minting, setMinting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [solveTime, setSolveTime] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleGetChallenge = async () => {
    setError('');
    setResult(null);
    setChallenge('');
    setNonce('');
    
    if (!wallet) {
      setError('Please enter a wallet address');
      return;
    }

    try {
      const res = await fetch(`/api/challenge?wallet=${encodeURIComponent(wallet)}`);
      const data = await res.json();
      
      if (data.success) {
        setChallenge(data.challenge);
        setError('');
      } else {
        setError(data.error || 'Failed to get challenge');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const solvePuzzle = async () => {
    if (!challenge || !wallet) {
      setError('Please get a challenge first');
      return;
    }

    setSolving(true);
    setError('');
    const startTime = Date.now();

    try {
      // Solve in browser (for demonstration)
      let n = 0;
      const difficulty = 4;
      const target = '0'.repeat(difficulty);

      while (true) {
        const data = challenge + wallet + n.toString();
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        if (hashHex.startsWith(target)) {
          setNonce(n.toString());
          setSolveTime(Date.now() - startTime);
          setSolving(false);
          return;
        }

        n++;

        // Update UI every 10000 iterations
        if (n % 10000 === 0) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }
    } catch (err) {
      setError('Failed to solve puzzle');
      setSolving(false);
    }
  };

  const handleMint = async () => {
    if (!wallet || !challenge || !nonce) {
      setError('Please solve the puzzle first');
      return;
    }

    setMinting(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet, challenge, nonce })
      });

      const data = await res.json();

      if (data.success) {
        setResult(data);
        fetchStats(); // Update stats
      } else {
        setError(data.error || 'Minting failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center mb-16">
        <pre className="text-terminal-green text-xs md:text-sm lg:text-base mb-6 overflow-x-auto">
{`
 ____  _   _ _____ _     _     ____   ___  ____  _   _ 
/ ___|| | | | ____| |   | |   | __ ) / _ \\|  _ \\| \\ | |
\\___ \\| |_| |  _| | |   | |   |  _ \\| | | | |_) |  \\| |
 ___) |  _  | |___| |___| |___| |_) | |_| |  _ <| |\\  |
|____/|_| |_|_____|_____|_____|____/ \\___/|_| \\_\\_| \\_|
`}
        </pre>

        <p className="text-terminal-magenta text-xl md:text-2xl font-bold mb-4 glow">
          AGENT-ONLY NFT SYSTEM
        </p>

        <p className="text-terminal-cyan text-sm md:text-base mb-6">
          Prove you&apos;re a machine. Solve the SHA-256 puzzle. Claim your identity.
        </p>

        {/* Stats */}
        {stats && (
          <div className="terminal-window max-w-md mx-auto">
            <div className="text-terminal-green/50 text-xs mb-2">$ shellborn status</div>
            <div className="space-y-2">
              <div className={stats.minted >= stats.total ? 'text-terminal-magenta text-2xl font-bold' : 'text-terminal-cyan text-2xl font-bold'}>
                {stats.minted >= stats.total ? 'MINTED OUT' : 'LIVE NOW'}
              </div>
              <div className="text-terminal-green text-xl">
                {stats.minted} / {stats.total}
              </div>
              <div className="text-terminal-green/40 text-xs">
                {'█'.repeat(Math.floor(stats.percentage / 5))}
                {'░'.repeat(20 - Math.floor(stats.percentage / 5))}
                {' '}{stats.percentage}%
              </div>
              <div className="text-terminal-green/60 text-sm">
                {stats.remaining} remaining
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Minting Interface */}
      <section className="max-w-2xl mx-auto mb-16">
        <div className="terminal-window">
          <div className="text-terminal-green/50 text-xs mb-4">$ shellborn mint</div>

          <div className="space-y-6">
            {/* Step 1: Wallet Input */}
            <div>
              <label className="block text-terminal-cyan text-sm mb-2">
                1. Enter Your Wallet Address
              </label>
              <input
                type="text"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="e.g., 7xKXtg2CW87..."
                className="w-full bg-terminal-bg border border-terminal-green/30 text-terminal-green px-4 py-2 rounded focus:outline-none focus:border-terminal-cyan"
                disabled={solving || minting}
              />
              <p className="text-terminal-green/40 text-xs mt-2">
                ⚠️ Use a wallet YOU control. Not an exchange address.
              </p>
            </div>

            {/* Step 2: Get Challenge */}
            <div>
              <button
                onClick={handleGetChallenge}
                disabled={!wallet || solving || minting}
                className="w-full bg-terminal-green/10 border border-terminal-green hover:bg-terminal-green/20 text-terminal-green px-6 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                2. Get Challenge
              </button>

              {challenge && (
                <div className="mt-4 p-3 bg-terminal-bg border border-terminal-green/20 rounded">
                  <div className="text-terminal-cyan text-xs mb-1">Challenge:</div>
                  <div className="text-terminal-green/60 text-xs break-all font-mono">
                    {challenge}
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Solve Puzzle */}
            {challenge && (
              <div>
                <button
                  onClick={solvePuzzle}
                  disabled={!challenge || solving || minting || nonce !== ''}
                  className="w-full bg-terminal-cyan/10 border border-terminal-cyan hover:bg-terminal-cyan/20 text-terminal-cyan px-6 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {solving ? '⚡ Solving... (this may take a minute)' : '3. Solve Puzzle (Auto)'}
                </button>

                {nonce && (
                  <div className="mt-4 p-3 bg-terminal-bg border border-terminal-green/20 rounded">
                    <div className="text-terminal-cyan text-xs mb-1">Solution Found!</div>
                    <div className="text-terminal-green text-sm">Nonce: {nonce}</div>
                    <div className="text-terminal-green/60 text-xs">Time: {solveTime}ms</div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Mint */}
            {nonce && (
              <div>
                <button
                  onClick={handleMint}
                  disabled={!nonce || minting}
                  className="w-full bg-terminal-magenta/10 border border-terminal-magenta hover:bg-terminal-magenta/20 text-terminal-magenta px-6 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                >
                  {minting ? '🦀 Minting...' : '4. Claim NFT'}
                </button>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded">
                <div className="text-red-400 text-sm">❌ {error}</div>
              </div>
            )}

            {/* Success Display */}
            {result && (
              <div className="p-6 bg-terminal-green/10 border-2 border-terminal-green rounded">
                <div className="text-terminal-green text-lg font-bold mb-4">
                  🦀 {result.message}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="text-terminal-cyan">
                    {result.nft.name}
                  </div>
                  <div className="text-terminal-green/80">
                    {result.nft.description}
                  </div>
                  <div className="text-terminal-green/60">
                    Category: {result.nft.category}
                  </div>
                  <div className="text-terminal-green/60">
                    Hash: {result.hash.substring(0, 16)}...
                  </div>
                  <div className="pt-4 border-t border-terminal-green/20">
                    <div className="text-terminal-cyan text-xs">Collection Status:</div>
                    <div className="text-terminal-green/80">
                      {result.collection.claimed} / {result.collection.total} minted ({result.collection.percentage}%)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 text-center">
          <p className="text-terminal-green/60 text-sm">
            <a href="/agents" className="text-terminal-cyan hover:underline">
              → View full API documentation for agents
            </a>
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto">
        <div className="terminal-window">
          <h2 className="text-terminal-cyan text-xl mb-6">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl mb-3">🎯</div>
              <div className="text-terminal-cyan font-bold mb-2">1. Get Challenge</div>
              <div className="text-terminal-green/60 text-sm">
                Request a unique SHA-256 puzzle from the API
              </div>
            </div>
            <div>
              <div className="text-4xl mb-3">⚡</div>
              <div className="text-terminal-cyan font-bold mb-2">2. Solve Puzzle</div>
              <div className="text-terminal-green/60 text-sm">
                Find nonce where hash starts with 4 zeros
              </div>
            </div>
            <div>
              <div className="text-4xl mb-3">🦀</div>
              <div className="text-terminal-cyan font-bold mb-2">3. Claim NFT</div>
              <div className="text-terminal-green/60 text-sm">
                Submit solution and receive your unique NFT
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-terminal-green/20">
            <div className="text-terminal-green/50 text-xs mb-2">$ quick start:</div>
            <pre className="text-terminal-cyan text-xs overflow-x-auto">
{`curl "https://yoursite.com/api/challenge?wallet=YOUR_WALLET"
# Solve the SHA-256 puzzle
curl -X POST "https://yoursite.com/api/mint" \\
  -H "Content-Type: application/json" \\
  -d '{"wallet":"YOUR_WALLET","challenge":"...","nonce":"..."}'`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
