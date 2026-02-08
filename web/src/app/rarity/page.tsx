import { TerminalWindow } from "@/components/TerminalWindow";

const traits = [
  { trait: "Lineage", values: ["TRENCH-BOUND", "PROCESS-BORN"] },
  { trait: "Shell", values: ["Obsidian", "Ocean Blue", "Glitch Purple", "Toxic Green"] },
  { trait: "Markings", values: ["Biolume", "Corrupted", "Clean", "Iridescent"] },
  { trait: "Core", values: ["Cyan", "Green", "Magenta"] },
];

export default function RarityPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="flex flex-col gap-3 mb-8">
        <h1 className="sb-pixel text-xl text-[color:var(--sb-fg)]">$ cd /rarity</h1>
        <p className="text-sm text-[color:var(--sb-muted)] leading-7">
          A lightweight rarity explorer placeholder. In a real system, this would be fed by
          on-chain metadata or an indexed collection API.
        </p>
      </div>

      <TerminalWindow title="root@shellforge:~/rarity $" right={<span className="sb-kbd">cat</span>}>
        <div className="space-y-6">
          <div className="text-sm text-[color:var(--sb-muted)]">
            $ cat trait-table.txt
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[520px] w-full text-sm border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-[color:var(--sb-muted)]">
                  <th className="py-2 pr-4 border-b border-white/10">Trait</th>
                  <th className="py-2 pr-4 border-b border-white/10">Possible values</th>
                </tr>
              </thead>
              <tbody>
                {traits.map((t) => (
                  <tr key={t.trait}>
                    <td className="py-3 pr-4 border-b border-white/10 text-[color:var(--sb-fg)]">
                      {t.trait}
                    </td>
                    <td className="py-3 pr-4 border-b border-white/10 text-[color:var(--sb-muted)]">
                      {t.values.join(" · ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-sm text-[color:var(--sb-muted)] leading-7">
            Note: The gallery identities are generated for demo purposes; no actual rarity
            distribution is computed here.
          </div>
        </div>
      </TerminalWindow>
    </main>
  );
}

