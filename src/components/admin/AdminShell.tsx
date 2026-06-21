import type { ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, User, FolderKanban, Sparkles, Award, BarChart3, Briefcase, Wrench, Inbox, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { hash: "profile", label: "Profile", Icon: User },
  { hash: "projects", label: "Projects", Icon: FolderKanban },
  { hash: "skills", label: "Skills", Icon: Sparkles },
  { hash: "certifications", label: "Certifications", Icon: Award },
  { hash: "dashboards", label: "Dashboards", Icon: BarChart3 },
  { hash: "services", label: "Services", Icon: Wrench },
  { hash: "experience", label: "Experience", Icon: Briefcase },
  { hash: "messages", label: "Messages", Icon: Inbox },
] as const;

export function AdminShell({ active, onSelect, children }: { active: string; onSelect: (h: string) => void; children: ReactNode }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  return (
    <div className="min-h-screen bg-aurora">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="glass rounded-2xl flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"><Home className="h-4 w-4" /> Site</Link>
            <span className="text-white/20">/</span>
            <span className="font-display font-semibold">Admin</span>
          </div>
          <button onClick={signOut} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><LogOut className="h-4 w-4" /> Sign out</button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-[220px_1fr]">
          <nav className="glass rounded-2xl p-2 h-fit md:sticky md:top-4">
            {NAV.map(({ hash, label, Icon }) => (
              <button
                key={hash}
                onClick={() => onSelect(hash)}
                className={cn(
                  "w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-left text-muted-foreground hover:text-foreground hover:bg-white/5",
                  active === hash && "text-foreground bg-white/5",
                )}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </nav>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}