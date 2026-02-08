import type { ReactNode } from "react";

export function TerminalWindow({
  title,
  right,
  children,
  className = "",
}: {
  title: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`sb-terminal ${className}`}>
      <header className="sb-terminal-header">
        <div className="flex items-center gap-3 min-w-0">
          <span className="sb-dots" aria-hidden="true">
            <span className="sb-dot" />
            <span className="sb-dot" />
            <span className="sb-dot" />
          </span>
          <div className="min-w-0">
            <div className="truncate text-sm text-[color:var(--sb-muted)]">
              {title}
            </div>
          </div>
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </header>
      <div className="relative p-4 sm:p-5">{children}</div>
    </section>
  );
}

