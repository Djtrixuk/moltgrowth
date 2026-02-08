import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-neon-magenta/5 rounded-full blur-[128px] pointer-events-none" />
      <div className="relative z-10 space-y-6">
        <div className="text-6xl md:text-8xl">&#x1F30A;</div>
        <h1 className="font-[family-name:var(--font-pixel)] text-2xl md:text-4xl text-neon-magenta">
          404
        </h1>
        <h2 className="font-[family-name:var(--font-pixel)] text-xs md:text-sm text-neon-cyan">
          LOST IN THE DEEP
        </h2>
        <p className="text-sm text-terminal-dim max-w-md mx-auto">
          This part of the ocean hasn&apos;t been mapped yet. The coordinates
          you&apos;re looking for don&apos;t exist — or they&apos;ve drifted into
          the abyss.
        </p>
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-neon-magenta/50" />
          <span className="text-neon-magenta/50 text-xs">&#x25C6;</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-neon-magenta/50" />
        </div>
        <Link
          href="/"
          className="inline-block px-8 py-3 border border-neon-cyan text-neon-cyan font-[family-name:var(--font-pixel)] text-[10px] rounded-lg hover:bg-neon-cyan/10 transition-all duration-300"
        >
          SURFACE
        </Link>
        <p className="text-[10px] text-terminal-dim/50 mt-8 font-mono">
          depth: unknown — pressure: critical — signal: lost
        </p>
      </div>
    </div>
  );
}
