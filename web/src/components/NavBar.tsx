"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

const nav = [
  { href: "/mint", label: "mint" },
  { href: "/gallery", label: "gallery" },
  { href: "/rarity", label: "rarity" },
  { href: "/about", label: "about" },
  { href: "/terms", label: "terms" },
];

export function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const activeHref = useMemo(() => {
    if (!pathname) return "/";
    const hit = nav.find((n) => pathname === n.href);
    return hit?.href ?? "/";
  }, [pathname]);

  return (
    <div className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/10 bg-black/0">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="sb-kbd">$</span>
            <Link
              href="/"
              className="truncate text-sm text-[color:var(--sb-fg)] hover:text-[color:var(--sb-cyan)]"
              onClick={() => setOpen(false)}
            >
              agent@shellforge
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-5 text-sm">
            {nav.map((n) => {
              const active = activeHref === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={[
                    "group inline-flex items-center gap-1",
                    active ? "text-[color:var(--sb-cyan)]" : "text-[color:var(--sb-muted)]",
                    "hover:text-[color:var(--sb-fg)]",
                  ].join(" ")}
                >
                  <span className="opacity-60 group-hover:opacity-100 text-[color:var(--sb-green)]">
                    [
                  </span>
                  <span>{n.label}</span>
                  <span className="opacity-60 group-hover:opacity-100 text-[color:var(--sb-green)]">
                    ]
                  </span>
                </Link>
              );
            })}
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="text-[color:var(--sb-muted)] hover:text-[color:var(--sb-fg)]"
            >
              github ↗
            </a>
          </nav>

          <button
            className="md:hidden sb-kbd"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "[×]" : "[≡]"}
          </button>
        </div>

        {open ? (
          <div className="md:hidden pb-4">
            <div className="sb-terminal">
              <div className="sb-terminal-header">
                <div className="text-sm text-[color:var(--sb-muted)]">
                  root@shellforge:~/nav $
                </div>
                <span className="sb-kbd">esc</span>
              </div>
              <div className="p-4 flex flex-col gap-3 text-sm">
                {nav.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="text-[color:var(--sb-fg)] hover:text-[color:var(--sb-cyan)]"
                  >
                    $ cd {n.href}
                  </Link>
                ))}
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[color:var(--sb-muted)] hover:text-[color:var(--sb-fg)]"
                >
                  $ open github ↗
                </a>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="sb-hr" />
    </div>
  );
}

