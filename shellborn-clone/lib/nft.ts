// NFT generation and traits

const CRUSTACEAN_TYPES = [
  'Crab', 'Lobster', 'Shrimp', 'Hermit', 'Crawfish', 
  'Anomalocaris', 'Horseshoe', 'Mantis', 'Krill', 'Barnacle'
];

const MACHINE_TYPES = [
  'Sentinel', 'Drone', 'Bot', 'Automaton', 'Cyborg',
  'Android', 'Mech', 'Construct', 'Synth', 'Droid'
];

const SHELL_COLORS = [
  'Ocean Blue Shell', 'Burnt Orange Shell', 'Toxic Green Shell',
  'Electric Blue Shell', 'Deep Purple Shell', 'Sunset Red Shell',
  'Midnight Black Shell', 'Pearl White Shell', 'Golden Shell', 'Silver Shell'
];

const MACHINE_TRAITS = [
  'Terminal-Born', 'Code-Forged', 'Digital Native', 'Neural Mesh',
  'Quantum Core', 'Binary Soul', 'Cyber Enhanced', 'AI Awakened',
  'Matrix Walker', 'Silicon Heart'
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateNFTMetadata(id: number) {
  // 80% crustaceans, 20% machines
  const isMachine = Math.random() < 0.2;
  
  let type: string;
  let trait: string;
  
  if (isMachine) {
    type = getRandomElement(MACHINE_TYPES);
    trait = getRandomElement(MACHINE_TRAITS);
  } else {
    type = getRandomElement(CRUSTACEAN_TYPES);
    trait = getRandomElement(SHELL_COLORS);
  }
  
  const name = `Shellborn #${String(id).padStart(4, '0')}`;
  
  return {
    id,
    name,
    type,
    trait,
    category: isMachine ? 'machine' : 'crustacean',
    description: `${type} — ${trait}`,
  };
}

export function calculateRarity(type: string, trait: string, category: string): string {
  // Simple rarity calculation
  if (category === 'machine') {
    return 'Rare'; // Machines are 20% of supply
  }
  
  // Crustaceans have different rarities based on combinations
  const rarityScore = Math.random();
  
  if (rarityScore < 0.05) return 'Legendary';
  if (rarityScore < 0.15) return 'Epic';
  if (rarityScore < 0.35) return 'Rare';
  if (rarityScore < 0.60) return 'Uncommon';
  return 'Common';
}
