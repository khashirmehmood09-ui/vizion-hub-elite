import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/#services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/dashboards", label: "Dashboards" },
  { to: "/certifications", label: "Certifications" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="mx-auto mt-3 max-w-6xl px-4">
        <div className="glass flex items-center justify-between rounded-2xl px-4 py-2.5">
          <Link to="/" className="group flex items-center gap-2">
            <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--color-cyan)] to-[var(--color-violet)] grid place-items-center">
              <span className="font-display text-sm font-bold text-background">H</span>
            </div>
            <span className="font-display text-sm font-semibold tracking-tight">Hashir<span className="text-muted-foreground">.dev</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
                  path === item.to && "text-foreground bg-white/5",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              className="hidden md:inline-flex items-center rounded-lg bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-violet)] px-3.5 py-1.5 text-sm font-medium text-background hover:opacity-90"
            >
              Hire me
            </Link>
            <button
              type="button"
              className="md:hidden rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-white/5"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="glass mt-2 rounded-2xl p-2 md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5",
                  path === item.to && "text-foreground bg-white/5",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}