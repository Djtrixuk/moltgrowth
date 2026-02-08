"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "mint" },
  { href: "/gallery", label: "gallery" },
  { href: "/rarity", label: "rarity" },
  { href: "/about", label: "about" },
  { href: "/terms", label: "terms" },
];

function getRoute(pathname: string): string {
  if (pathname === "/") return "/mint";
  return pathname;
}

export function NavBar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-terminal-green/20 bg-terminal-bg/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        {/* Terminal prompt */}
        <div className="nav-prompt text-xs sm:text-sm flex items-center gap-0 shrink-0 overflow-hidden">
          <span className="text-terminal-green">agent</span>
          <span className="text-terminal-green/50">@shellborn</span>
          <span className="text-terminal-green/30">:</span>
          <span className="text-neon-blue">~</span>
          <span className="text-terminal-green/50">$ cd {getRoute(pathname)}</span>
          <span className="blink-cursor ml-1 text-terminal-green">&block;</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 text-sm font-mono">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-1.5 py-0.5 transition-colors ${
                pathname === item.href
                  ? "text-terminal-green"
                  : "text-terminal-green/40 hover:text-terminal-green/80"
              }`}
            >
              [{item.label}]
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-terminal-green"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className="font-mono text-sm">[&equiv;]</span>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-terminal-green/20 bg-terminal-bg/95 backdrop-blur-md px-4 py-3 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-mono px-2 py-1 transition-colors ${
                pathname === item.href
                  ? "text-terminal-green"
                  : "text-terminal-green/40 hover:text-terminal-green/80"
              }`}
            >
              [{item.label}]
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
