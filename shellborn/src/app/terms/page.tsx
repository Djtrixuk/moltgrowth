import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SHELLBORN | Terms of Service",
  description: "Terms of Service for the Shellborn NFT collection.",
};

const sections = [
  {
    title: "1. ACCEPTANCE OF TERMS",
    content: `By accessing or using the Shellborn website ("Site"), connecting a wallet, or minting a Shellborn NFT ("Token"), you ("User") agree to be bound by these Terms of Service ("Terms"). If you do not agree, do not use the Site or mint any Tokens.

If you are an AI agent, autonomous software agent, or any non-human entity operating a wallet, your use of this Site constitutes acceptance of these Terms on behalf of yourself and the human principal who controls, funds, or authorizes your operation ("Principal"). See Section 9 for agent-specific terms.`,
  },
  {
    title: "2. NATURE OF THE TOKENS",
    content: `Shellborn Tokens are digital art collectibles on the Solana blockchain. They are not securities, investment contracts, financial instruments, or any form of regulated financial product. Shellborn Tokens grant no equity, revenue share, governance rights, dividends, profit participation, or any expectation of financial return whatsoever.

You should not mint or purchase a Shellborn Token with any expectation of profit or financial gain. The value of digital collectibles is inherently subjective and may decrease to zero.`,
  },
  {
    title: "3. NO FINANCIAL ADVICE",
    content: `Nothing on this Site constitutes financial, investment, tax, or legal advice. The creators, developers, and contributors to Shellborn ("Team") are not registered investment advisors, broker-dealers, or financial planners. You are solely responsible for evaluating the merits and risks of any transaction.`,
  },
  {
    title: "4. RISKS",
    content: null,
    list: [
      "Blockchain transactions are irreversible. There are no refunds.",
      "Digital assets may lose all value. NFT markets are volatile and speculative.",
      "Smart contracts may contain bugs or vulnerabilities despite best efforts.",
      "Regulatory changes may affect the legality or value of NFTs in your jurisdiction.",
      "Network congestion, failed transactions, or wallet errors may result in loss of funds.",
      "The Site, services, or art may become unavailable at any time without notice.",
      "Metadata and images are stored on decentralized infrastructure but availability is not guaranteed in perpetuity.",
    ],
  },
  {
    title: "5. INTELLECTUAL PROPERTY",
    content: `The Shellborn art, code, brand, and associated materials are the intellectual property of the Team. Minting a Token grants you a personal, non-exclusive, non-transferable license to display and use the specific artwork associated with your Token for personal, non-commercial purposes. This license transfers with legitimate ownership of the Token.

You may not: (a) use Shellborn art for commercial products without written permission; (b) claim authorship of the art or algorithms; (c) use the art in connection with illegal, hateful, or harmful content; (d) modify the art and mint derivative NFTs.`,
  },
  {
    title: "6. PROOF OF COMPUTE (CAPTCHA)",
    content: `The minting process requires solving a SHA-256 hash puzzle ("Proof of Compute") within a time limit. This mechanism is designed to verify computational capability and is a feature of the collection, not a guarantee of any kind. The Team reserves the right to modify difficulty, time limits, or the captcha mechanism at any time.`,
  },
  {
    title: "7. LIMITATION OF LIABILITY",
    content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE TEAM SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR FUNDS, WHETHER IN AN ACTION IN CONTRACT, TORT, OR OTHERWISE, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SITE OR TOKENS.

THE TEAM'S TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO MINT YOUR TOKEN(S). THE SITE AND TOKENS ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.`,
  },
  {
    title: "8. INDEMNIFICATION",
    content: `You agree to indemnify and hold harmless the Team from any claims, damages, losses, or expenses (including legal fees) arising from your use of the Site, your violation of these Terms, or your violation of any third-party rights.`,
  },
  {
    title: "9. AGENT-SPECIFIC TERMS",
    highlight: true,
    content: "If you are an AI agent, autonomous software, bot, or any non-human entity:",
    list: [
      "Principal Authorization: By initiating a mint transaction, you represent and warrant that your human Principal has explicitly authorized you to spend funds on minting NFTs.",
      "Informed Consent: You represent that your Principal understands the nature of NFTs, the risks described in Section 4, and that Shellborn Tokens are digital art with no expectation of financial return.",
      "Agency Liability: The Principal bears full responsibility for all actions taken by their agent on this Site.",
      "No Autonomous Financial Decisions: Minting should not be treated as an investment decision.",
      "Wallet Ownership: You confirm that the wallet used for minting is owned or controlled by your Principal.",
    ],
  },
  {
    title: "10. MODIFICATIONS",
    content: `The Team reserves the right to modify these Terms at any time. Changes take effect upon posting to the Site. Continued use of the Site after changes constitutes acceptance of the updated Terms.`,
  },
  {
    title: "11. GOVERNING LAW",
    content: `These Terms shall be governed by the laws of the jurisdiction in which the Team operates, without regard to conflict of law principles. Any disputes shall be resolved through binding arbitration.`,
  },
  {
    title: "12. SEVERABILITY",
    content: `If any provision of these Terms is found unenforceable, the remaining provisions shall remain in full force and effect.`,
  },
  {
    title: "13. ENTIRE AGREEMENT",
    content: `These Terms constitute the entire agreement between you and the Team regarding the use of the Site and Tokens. No prior or contemporaneous communications shall supersede these Terms.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto prose-invert">
        <h1 className="font-[family-name:var(--font-pixel)] text-xl md:text-2xl text-neon-cyan mb-8 text-center">
          TERMS OF SERVICE
        </h1>
        <p className="text-xs text-terminal-dim text-center mb-12">
          Last updated: February 3, 2026
        </p>

        <div className="space-y-8 text-sm text-[#c0c0dd] leading-relaxed">
          {sections.map((section) => (
            <section
              key={section.title}
              className={
                section.highlight
                  ? "border border-neon-magenta/30 bg-neon-magenta/5 rounded-lg p-4"
                  : ""
              }
            >
              <h2
                className={`font-[family-name:var(--font-pixel)] text-[10px] mb-3 ${
                  section.highlight ? "text-neon-magenta" : "text-neon-cyan"
                }`}
              >
                {section.title}
              </h2>
              {section.content && (
                <p className="whitespace-pre-line">{section.content}</p>
              )}
              {section.list && (
                <ul className="list-disc list-inside mt-2 space-y-1 text-terminal-dim">
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-cyan-900/30 text-center">
          <p className="text-xs text-terminal-dim">
            By minting a Shellborn Token, you confirm that you have read,
            understood, and agreed to these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}
