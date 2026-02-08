import Link from "next/link";
import { TerminalWindow } from "@/components/TerminalWindow";

export default function MintPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="flex flex-col gap-3 mb-8">
        <h1 className="sb-pixel text-xl text-[color:var(--sb-fg)]">$ cd /mint</h1>
        <p className="text-sm text-[color:var(--sb-muted)] leading-7">
          A simulated machine-proof “mint” flow. This page is UI-only; it’s meant to
          match the vibe/structure of the reference site without copying it.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 items-start">
        <TerminalWindow title="$ shellforge mint --help" right={<span className="sb-kbd">help</span>}>
          <div className="space-y-2 text-sm leading-7">
            <div className="text-[color:var(--sb-muted)]">USAGE:</div>
            <div className="text-[color:var(--sb-fg)]">shellforge mint [OPTIONS]</div>
            <div className="pt-2 text-[color:var(--sb-muted)]">STEPS:</div>
            <div className="text-[color:var(--sb-muted)]">
              1. challenge — GET /api/challenge?agent=... → receive puzzle
            </div>
            <div className="text-[color:var(--sb-muted)]">
              2. compute — sha256(challenge+agent+nonce) → find 0000...
            </div>
            <div className="text-[color:var(--sb-muted)]">
              3. submit — POST /api/claim → submit solution
            </div>
            <div className="text-[color:var(--sb-muted)]">
              4. receive — identity issued to your agent profile
            </div>
            <div className="pt-2 text-[color:var(--sb-muted)]">OPTIONS:</div>
            <div className="text-[color:var(--sb-muted)]">--method machine-proof (SHA-256 PoW)</div>
            <div className="text-[color:var(--sb-muted)]">--price FREE</div>
            <div className="text-[color:var(--sb-muted)]">--compute ~60K iterations avg</div>
          </div>
        </TerminalWindow>

        <TerminalWindow title="$ shellforge status" right={<span className="sb-kbd">SIM</span>}>
          <div className="space-y-3">
            <div className="sb-pixel text-base text-[color:var(--sb-magenta)]">
              MINTED OUT
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="text-[color:var(--sb-muted)]">10,000 / 10,000</div>
              <div className="text-[color:var(--sb-green)]">100%</div>
            </div>
            <div className="h-3 rounded-full bg-black/40 overflow-hidden border border-white/10">
              <div className="h-full w-full bg-[linear-gradient(90deg,var(--sb-green),var(--sb-cyan),var(--sb-magenta))]" />
            </div>
            <div className="text-sm text-[color:var(--sb-muted)]">
              Tip: explore the pixel identities in the gallery.
            </div>
            <div className="pt-2 flex gap-3">
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--sb-border)] px-5 py-2.5 text-sm hover:border-[color:var(--sb-border-2)]"
              >
                open /gallery
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm hover:bg-white/10"
              >
                back /
              </Link>
            </div>
          </div>
        </TerminalWindow>
      </div>
    </main>
  );
}

