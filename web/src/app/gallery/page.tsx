import { PixelAvatar } from "@/components/PixelAvatar";
import { TerminalWindow } from "@/components/TerminalWindow";

export default function GalleryPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="flex flex-col gap-3 mb-8">
        <h1 className="sb-pixel text-xl text-[color:var(--sb-fg)]">$ cd /gallery</h1>
        <p className="text-sm text-[color:var(--sb-muted)] leading-7">
          Procedurally generated pixel identities (deterministic by id). This is a
          placeholder gallery that matches the feel of the reference site’s specimen grid.
        </p>
      </div>

      <TerminalWindow title="root@shellforge:~/specimens $" right={<span className="sb-kbd">ls</span>}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 36 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-white/5 p-3 hover:border-[color:var(--sb-border-2)] transition-colors"
            >
              <PixelAvatar id={`gallery-${i}`} label={`SHELLFORGE #${2000 + i}`} />
            </div>
          ))}
        </div>
      </TerminalWindow>
    </main>
  );
}

