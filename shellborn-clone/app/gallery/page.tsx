'use client';

import { useState, useEffect } from 'react';

interface MintedNFT {
  id: number;
  wallet: string;
  name: string;
  type: string;
  trait: string;
  timestamp: number;
  hash: string;
}

export default function GalleryPage() {
  const [nfts, setNfts] = useState<MintedNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'crustacean' | 'machine'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'id'>('recent');

  useEffect(() => {
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      if (data.success) {
        setNfts(data.nfts);
      }
    } catch (err) {
      console.error('Failed to fetch NFTs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Determine category from type
  const getCategory = (type: string): 'crustacean' | 'machine' => {
    const machines = ['Sentinel', 'Drone', 'Bot', 'Automaton', 'Cyborg', 'Android', 'Mech', 'Construct', 'Synth', 'Droid'];
    return machines.includes(type) ? 'machine' : 'crustacean';
  };

  // Filter and sort NFTs
  const filteredAndSortedNFTs = nfts
    .filter(nft => {
      if (filter === 'all') return true;
      return getCategory(nft.type) === filter;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return b.timestamp - a.timestamp;
      } else {
        return a.id - b.id;
      }
    });

  const stats = {
    total: nfts.length,
    crustaceans: nfts.filter(n => getCategory(n.type) === 'crustacean').length,
    machines: nfts.filter(n => getCategory(n.type) === 'machine').length,
  };

  // Generate a deterministic pixel pattern based on NFT data
  const generatePixelPattern = (id: number, type: string): string => {
    const seed = id + type.length;
    const colors = [
      '#00ff41', '#00ffff', '#ff00ff', '#5555ff',
      '#ff4444', '#ffaa00', '#44ff44', '#aa44ff'
    ];
    
    let svg = '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">';
    svg += '<rect width="100" height="100" fill="#0a0e0a"/>';
    
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const idx = (i * 10 + j + seed) % colors.length;
        const shouldFill = ((i + j + seed) % 3) !== 0;
        if (shouldFill) {
          svg += `<rect x="${i * 10}" y="${j * 10}" width="10" height="10" fill="${colors[idx]}" opacity="0.3"/>`;
        }
      }
    }
    
    svg += '</svg>';
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="terminal-window mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-terminal-green text-2xl md:text-3xl font-bold mb-2">
                Gallery
              </h1>
              <p className="text-terminal-green/60 text-sm">
                {stats.total} NFTs minted • {stats.crustaceans} crustaceans • {stats.machines} machines
              </p>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="bg-terminal-bg border border-terminal-green/30 text-terminal-green px-4 py-2 rounded text-sm focus:outline-none focus:border-terminal-cyan"
                >
                  <option value="all">All ({stats.total})</option>
                  <option value="crustacean">Crustaceans ({stats.crustaceans})</option>
                  <option value="machine">Machines ({stats.machines})</option>
                </select>
              </div>

              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-terminal-bg border border-terminal-green/30 text-terminal-green px-4 py-2 rounded text-sm focus:outline-none focus:border-terminal-cyan"
                >
                  <option value="recent">Recent First</option>
                  <option value="id">By ID</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-terminal-cyan text-lg">Loading gallery...</div>
            <div className="text-terminal-green/60 text-sm mt-2">Fetching NFTs from the colony</div>
          </div>
        )}

        {/* Empty State */}
        {!loading && nfts.length === 0 && (
          <div className="terminal-window text-center py-12">
            <div className="text-terminal-green/60 text-lg mb-4">No NFTs minted yet</div>
            <p className="text-terminal-green/40 text-sm mb-6">
              Be the first to mint a Shellborn NFT
            </p>
            <a
              href="/"
              className="inline-block bg-terminal-cyan/10 border border-terminal-cyan text-terminal-cyan px-6 py-3 rounded hover:bg-terminal-cyan/20 transition-colors"
            >
              Start Minting
            </a>
          </div>
        )}

        {/* Gallery Grid */}
        {!loading && filteredAndSortedNFTs.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredAndSortedNFTs.map((nft) => {
              const category = getCategory(nft.type);
              const bgColor = category === 'machine' ? 'border-terminal-magenta/30' : 'border-terminal-cyan/30';
              
              return (
                <div
                  key={nft.id}
                  className={`group terminal-window hover:border-terminal-green transition-all duration-300 cursor-pointer ${bgColor}`}
                >
                  {/* NFT Image Placeholder */}
                  <div className="relative aspect-square mb-3 bg-terminal-bg rounded overflow-hidden">
                    <img
                      src={generatePixelPattern(nft.id, nft.type)}
                      alt={nft.name}
                      className="w-full h-full object-cover pixel-art"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-terminal-bg/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="text-terminal-cyan text-xs font-bold">
                          #{String(nft.id).padStart(4, '0')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* NFT Info */}
                  <div className="space-y-1">
                    <div className="text-terminal-green text-sm font-bold truncate">
                      {nft.name}
                    </div>
                    <div className="text-terminal-cyan text-xs truncate">
                      {nft.type}
                    </div>
                    <div className="text-terminal-green/60 text-xs truncate">
                      {nft.trait}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-terminal-green/10">
                      <div className={`text-xs px-2 py-0.5 rounded ${
                        category === 'machine' 
                          ? 'bg-terminal-magenta/10 text-terminal-magenta' 
                          : 'bg-terminal-cyan/10 text-terminal-cyan'
                      }`}>
                        {category === 'machine' ? '🤖' : '🦀'}
                      </div>
                      <div className="text-terminal-green/40 text-xs">
                        {new Date(nft.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Filtered Empty State */}
        {!loading && nfts.length > 0 && filteredAndSortedNFTs.length === 0 && (
          <div className="terminal-window text-center py-12">
            <div className="text-terminal-green/60 text-lg mb-2">No NFTs match this filter</div>
            <button
              onClick={() => setFilter('all')}
              className="text-terminal-cyan text-sm hover:underline"
            >
              Show all NFTs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
