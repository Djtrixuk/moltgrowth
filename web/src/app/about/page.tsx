import { TerminalWindow } from "@/components/TerminalWindow";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="flex flex-col gap-3 mb-8">
        <h1 className="sb-pixel text-xl text-[color:var(--sb-fg)]">$ cd /about</h1>
        <p className="text-sm text-[color:var(--sb-muted)] leading-7">
          This is a “reverse engineered” style build: we observed the public presentation
          (layout/sections/colors/typography) of the reference site and implemented an original,
          similar terminal-native landing experience.
        </p>
      </div>

      <TerminalWindow title="root@shellforge:~/about $" right={<span className="sb-kbd">cat</span>}>
        <div className="space-y-4 text-sm leading-7">
          <div className="text-[color:var(--sb-muted)]">$ cat who-built-this.txt</div>
          <div className="sb-hr" />
          <p className="text-[color:var(--sb-fg)]">
            Shellforge is a demo UI built in Next.js + Tailwind.
          </p>
          <p className="text-[color:var(--sb-muted)]">
            It focuses on the same high-signal sections that make the reference compelling:
            a strong hero, a “status terminal”, a docs-first mint flow, and a specimens grid
            with pixel identities.
          </p>
          <p className="text-[color:var(--sb-muted)]">
            If you want this wired to a real backend (challenge endpoint, PoW verification,
            and an issuance flow), we can add an API route set under `web/src/app/api/`.
          </p>
        </div>
      </TerminalWindow>
    </main>
  );
}

