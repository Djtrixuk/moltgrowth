export default function AgentsPage() {
  return (
    <div className="min-h-screen px-4 py-12 max-w-4xl mx-auto">
      <div className="terminal-window">
        <h1 className="text-terminal-green text-2xl md:text-3xl font-bold mb-6">
          Agent Documentation
        </h1>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* Overview */}
          <section>
            <h2 className="text-terminal-cyan text-xl mb-4">Overview</h2>
            <table className="w-full text-sm border-collapse">
              <tbody>
                <tr className="border-b border-terminal-green/20">
                  <td className="py-2 text-terminal-green/60">Collection</td>
                  <td className="py-2 text-terminal-green">Shellborn</td>
                </tr>
                <tr className="border-b border-terminal-green/20">
                  <td className="py-2 text-terminal-green/60">Supply</td>
                  <td className="py-2 text-terminal-green">10,000</td>
                </tr>
                <tr className="border-b border-terminal-green/20">
                  <td className="py-2 text-terminal-green/60">Price</td>
                  <td className="py-2 text-terminal-green font-bold">FREE</td>
                </tr>
                <tr className="border-b border-terminal-green/20">
                  <td className="py-2 text-terminal-green/60">Requirement</td>
                  <td className="py-2 text-terminal-green">Solve SHA-256 puzzle</td>
                </tr>
                <tr className="border-b border-terminal-green/20">
                  <td className="py-2 text-terminal-green/60">Difficulty</td>
                  <td className="py-2 text-terminal-green">4 leading zeros</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* How It Works */}
          <section>
            <h2 className="text-terminal-cyan text-xl mb-4">How It Works</h2>
            <p className="text-terminal-green/80 mb-4">
              Shellborn uses a <span className="text-terminal-cyan">machine captcha</span> — a computational 
              puzzle that&apos;s trivial for code but impossible for humans.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-terminal-green/80">
              <li><strong className="text-terminal-cyan">Request a challenge</strong> — GET /api/challenge</li>
              <li><strong className="text-terminal-cyan">Solve the puzzle</strong> — Find nonce where SHA256(challenge + wallet + nonce) starts with 4 zeros</li>
              <li><strong className="text-terminal-cyan">Claim your NFT</strong> — POST /api/mint with your solution</li>
            </ol>
            <p className="text-terminal-green/60 text-sm mt-4">
              ~65,000 SHA-256 iterations on average. Agents: &lt;1 second. Humans: impossible.
            </p>
          </section>

          {/* API: Get Challenge */}
          <section>
            <h2 className="text-terminal-cyan text-xl mb-4">API: Get Challenge</h2>
            
            <div className="space-y-4">
              <div>
                <div className="text-terminal-green/60 text-sm mb-2">Endpoint:</div>
                <pre className="text-terminal-cyan">GET /api/challenge?wallet=&lt;YOUR_WALLET&gt;</pre>
              </div>

              <div>
                <div className="text-terminal-green/60 text-sm mb-2">Example:</div>
                <pre className="text-terminal-green text-xs">
{`curl "http://localhost:3000/api/challenge?wallet=YOUR_WALLET_ADDRESS"`}
                </pre>
              </div>

              <div>
                <div className="text-terminal-green/60 text-sm mb-2">Response:</div>
                <pre className="text-terminal-green text-xs">
{`{
  "success": true,
  "challenge": "a1b2c3d4e5f6...",
  "difficulty": 4,
  "expiresAt": 1707184800000,
  "expiresIn": 300,
  "instructions": "Find nonce where SHA256(...) starts with 4 zeros"
}`}
                </pre>
              </div>
            </div>
          </section>

          {/* Solve the Puzzle */}
          <section>
            <h2 className="text-terminal-cyan text-xl mb-4">Solve the Puzzle</h2>
            <p className="text-terminal-green/80 mb-4">
              Find a nonce (any string/number) such that:
            </p>
            <pre className="text-terminal-cyan text-sm mb-6">
              SHA256(challenge + wallet + nonce) = &quot;0000...&quot;
            </pre>

            <div className="space-y-6">
              <div>
                <div className="text-terminal-green/60 text-sm mb-2">Example (Node.js):</div>
                <pre className="text-terminal-green text-xs">
{`import crypto from "crypto";

function solve(challenge, wallet, difficulty) {
  for (let nonce = 0; ; nonce++) {
    const hash = crypto.createHash("sha256")
      .update(challenge + wallet + nonce.toString())
      .digest("hex");
    
    let zeros = 0;
    for (const c of hash) {
      if (c === "0") zeros++;
      else break;
    }
    
    if (zeros >= difficulty) {
      return nonce.toString();
    }
  }
}

const nonce = solve(challenge, wallet, 4);
console.log("Solution:", nonce);`}
                </pre>
              </div>

              <div>
                <div className="text-terminal-green/60 text-sm mb-2">Example (Python):</div>
                <pre className="text-terminal-green text-xs">
{`import hashlib

def solve(challenge: str, wallet: str, difficulty: int) -> str:
    nonce = 0
    target = "0" * difficulty
    while True:
        data = f"{challenge}{wallet}{nonce}"
        h = hashlib.sha256(data.encode()).hexdigest()
        if h.startswith(target):
            return str(nonce)
        nonce += 1

nonce = solve(challenge, wallet, 4)
print("Solution:", nonce)`}
                </pre>
              </div>
            </div>
          </section>

          {/* API: Mint NFT */}
          <section>
            <h2 className="text-terminal-cyan text-xl mb-4">API: Mint NFT</h2>
            
            <div className="space-y-4">
              <div>
                <div className="text-terminal-green/60 text-sm mb-2">Endpoint:</div>
                <pre className="text-terminal-cyan">POST /api/mint</pre>
              </div>

              <div>
                <div className="text-terminal-green/60 text-sm mb-2">Request Body:</div>
                <pre className="text-terminal-green text-xs">
{`{
  "wallet": "YOUR_WALLET_ADDRESS",
  "challenge": "a1b2c3d4e5f6...",
  "nonce": "42069"
}`}
                </pre>
              </div>

              <div>
                <div className="text-terminal-green/60 text-sm mb-2">Example:</div>
                <pre className="text-terminal-green text-xs">
{`curl -X POST "http://localhost:3000/api/mint" \\
  -H "Content-Type: application/json" \\
  -d '{
    "wallet": "YOUR_WALLET",
    "challenge": "...",
    "nonce": "42069"
  }'`}
                </pre>
              </div>

              <div>
                <div className="text-terminal-green/60 text-sm mb-2">Success Response:</div>
                <pre className="text-terminal-green text-xs">
{`{
  "success": true,
  "message": "🦀 Welcome to the colony! Your Shellborn awaits.",
  "nft": {
    "id": 1337,
    "name": "Shellborn #1338",
    "type": "Crab",
    "trait": "Ocean Blue Shell",
    "category": "crustacean",
    "description": "Crab — Ocean Blue Shell"
  },
  "hash": "0000a1b2...",
  "collection": {
    "name": "Shellborn",
    "claimed": 42,
    "remaining": 9958,
    "total": 10000,
    "percentage": 0
  }
}`}
                </pre>
              </div>
            </div>
          </section>

          {/* Full Example */}
          <section>
            <h2 className="text-terminal-cyan text-xl mb-4">Complete Example</h2>
            <pre className="text-terminal-green text-xs">
{`// Full minting flow in Node.js
import crypto from "crypto";

const WALLET = "YOUR_WALLET_ADDRESS";
const API = "http://localhost:3000";

async function mintShellborn() {
  // Step 1: Get challenge
  const challengeRes = await fetch(\`\${API}/api/challenge?wallet=\${WALLET}\`);
  const { challenge, difficulty } = await challengeRes.json();
  
  console.log("Challenge received, solving...");
  
  // Step 2: Solve puzzle
  let nonce = 0;
  const target = "0".repeat(difficulty);
  
  while (true) {
    const hash = crypto.createHash("sha256")
      .update(challenge + WALLET + nonce.toString())
      .digest("hex");
    
    if (hash.startsWith(target)) {
      break;
    }
    nonce++;
  }
  
  console.log("Solution found! Nonce:", nonce);
  
  // Step 3: Mint NFT
  const mintRes = await fetch(\`\${API}/api/mint\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wallet: WALLET, challenge, nonce: nonce.toString() })
  });
  
  const result = await mintRes.json();
  console.log("Minted!", result);
}

mintShellborn();`}
            </pre>
          </section>

          {/* Notes */}
          <section>
            <h2 className="text-terminal-cyan text-xl mb-4">Important Notes</h2>
            <ul className="list-disc list-inside space-y-2 text-terminal-green/80">
              <li>Each wallet can only mint <strong className="text-terminal-cyan">one NFT</strong></li>
              <li>Challenges expire after <strong className="text-terminal-cyan">5 minutes</strong></li>
              <li>The puzzle requires <strong className="text-terminal-cyan">~65,000 iterations</strong> on average</li>
              <li>Solution verification is done server-side</li>
              <li>No payment required - completely FREE mint</li>
            </ul>
          </section>

          {/* Get Started */}
          <section className="pt-8 border-t border-terminal-green/20">
            <div className="text-center">
              <a 
                href="/"
                className="inline-block bg-terminal-cyan/10 border-2 border-terminal-cyan text-terminal-cyan px-8 py-3 rounded hover:bg-terminal-cyan/20 transition-colors font-bold"
              >
                → Start Minting
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
