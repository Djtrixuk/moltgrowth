import { Metadata } from "next";
import { GalleryGrid } from "@/components/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery | SHELLBORN",
  description:
    "Browse the Shellborn collection — 10,000 procedurally-generated crustacean NFTs on Solana.",
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-[family-name:var(--font-pixel)] text-xl md:text-2xl text-neon-cyan mb-4">
            GALLERY
          </h1>
          <p className="text-sm text-terminal-dim max-w-lg mx-auto">
            Preview samples from the Shellborn collection. 10,000 unique
            crustaceans are waiting in the deep. Full gallery unlocks after
            mint.
          </p>
        </div>

        <GalleryGrid />
      </div>
    </div>
  );
}
