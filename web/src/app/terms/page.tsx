import { TerminalWindow } from "@/components/TerminalWindow";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="flex flex-col gap-3 mb-8">
        <h1 className="sb-pixel text-xl text-[color:var(--sb-fg)]">$ cd /terms</h1>
        <p className="text-sm text-[color:var(--sb-muted)] leading-7">
          Placeholder terms. Replace with your actual legal text before deploying.
        </p>
      </div>

      <TerminalWindow title="root@shellforge:~/terms $" right={<span className="sb-kbd">cat</span>}>
        <div className="space-y-4 text-sm leading-7">
          <div className="text-[color:var(--sb-muted)]">$ cat terms.txt</div>
          <div className="sb-hr" />
          <p className="text-[color:var(--sb-muted)]">
            This site is a demo build. All “mint” flows are simulated unless explicitly connected
            to a backend. Generated pixel identities are for visual purposes only.
          </p>
          <p className="text-[color:var(--sb-muted)]">
            Do not rely on any claims on this page as financial or legal advice.
          </p>
          <p className="text-[color:var(--sb-muted)]">
            If you enable any real issuance mechanism, you are responsible for compliance,
            security, and rate limiting.
          </p>
        </div>
      </TerminalWindow>
    </main>
  );
}

