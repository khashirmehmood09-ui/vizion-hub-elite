import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useDashboards } from "@/lib/portfolio/queries";
import { Section } from "@/components/portfolio/Section";
import { Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboards")({
  head: () => ({
    meta: [
      { title: "Power BI Dashboards — Hashir Mehmood Qureshi" },
      { name: "description", content: "Interactive Power BI dashboards built for analytics and BI." },
      { property: "og:title", content: "Power BI Dashboards" },
      { property: "og:description", content: "Embedded interactive analytics dashboards." },
    ],
  }),
  component: DashboardsPage,
});

function DashboardsPage() {
  const { data } = useDashboards();
  const [active, setActive] = useState<string | null>(null);
  const [full, setFull] = useState(false);
  const list = data ?? [];
  const current = list.find((d) => d.id === (active ?? list[0]?.id)) ?? null;
  return (
    <Section eyebrow="Analytics" title={<>Live <span className="text-gradient">dashboards</span></>} description="Interactive Power BI reports — click a tab to load.">
      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">No dashboards yet — add them from the admin panel.</p>
      ) : (
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {list.map((d) => (
              <button key={d.id} onClick={() => setActive(d.id)} className={cn("glass rounded-full px-3 py-1.5 text-xs text-muted-foreground", (active ?? list[0]?.id) === d.id && "text-background bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-violet)]")}>
                {d.name}
              </button>
            ))}
          </div>
          {current && (
            <div className="glass rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div>
                  <div className="font-display font-semibold">{current.name}</div>
                  <div className="text-xs text-muted-foreground">{current.description}</div>
                </div>
                <button onClick={() => setFull(true)} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><Maximize2 className="h-4 w-4" /> Full screen</button>
              </div>
              <div className="aspect-[16/10] bg-black">
                <iframe key={current.id} title={current.name} src={current.embed_url} className="h-full w-full" allowFullScreen />
              </div>
            </div>
          )}
        </div>
      )}
      {full && current && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="font-display">{current.name}</div>
            <button onClick={() => setFull(false)} className="rounded-full glass p-2"><X className="h-4 w-4" /></button>
          </div>
          <iframe src={current.embed_url} className="flex-1 w-full rounded-xl" allowFullScreen />
        </div>
      )}
    </Section>
  );
}