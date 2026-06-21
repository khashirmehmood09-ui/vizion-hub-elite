import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useProjects } from "@/lib/portfolio/queries";
import { Section } from "@/components/portfolio/Section";
import { Search, Github, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { cn, normalizeExternalUrl } from "@/lib/utils";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Hashir Mehmood Qureshi" },
      { name: "description", content: "Data analytics, Power BI, SQL, Python, and machine learning projects." },
      { property: "og:title", content: "Projects — Hashir Mehmood Qureshi" },
      { property: "og:description", content: "A complete portfolio of analytics and ML projects." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { data: projects } = useProjects();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState<"recent" | "name">("recent");
  const cats = useMemo(() => {
    const s = new Set<string>(["All"]);
    (projects ?? []).forEach((p) => s.add(p.category));
    return Array.from(s);
  }, [projects]);
  const list = (projects ?? [])
    .filter((p) => (cat === "All" || p.category === cat))
    .filter((p) => p.title.toLowerCase().includes(q.toLowerCase()) || p.tech?.some((t) => t.toLowerCase().includes(q.toLowerCase())))
    .sort((a, b) => {
      if (sort === "name") return a.title.localeCompare(b.title);
      return new Date(b.project_date ?? b.created_at).getTime() - new Date(a.project_date ?? a.created_at).getTime();
    });

  return (
    <Section eyebrow="Portfolio" title={<>All <span className="text-gradient">projects</span></>} description="Browse, filter, and sort every project.">
      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects or tech…" className="w-full glass rounded-xl pl-9 pr-3 py-2.5 text-sm" />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="glass rounded-xl px-3 py-2.5 text-sm bg-transparent">
          {cats.map((c) => <option key={c} value={c} className="bg-background">{c}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as "recent" | "name")} className="glass rounded-xl px-3 py-2.5 text-sm bg-transparent">
          <option value="recent" className="bg-background">Most recent</option>
          <option value="name" className="bg-background">Name (A–Z)</option>
        </select>
      </div>
      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">No projects match.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={cn("glass group rounded-2xl overflow-hidden flex flex-col")}
            >
              <div className="aspect-[16/10] overflow-hidden">
                {p.image_url
                  ? <img src={p.image_url} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  : <div className="h-full w-full grid place-items-center text-3xl font-display text-gradient bg-gradient-to-br from-[var(--color-cyan)]/10 to-[var(--color-violet)]/10">{p.title[0]}</div>}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{p.category}</div>
                <h3 className="mt-2 font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.description}</p>
                {p.tech?.length ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.tech.map((t) => <span key={t} className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground">{t}</span>)}
                  </div>
                ) : null}
                <div className="mt-auto pt-4 flex gap-4 text-sm">
                  {p.github_url && <a href={normalizeExternalUrl(p.github_url, "github.com")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"><Github className="h-4 w-4" /> Code</a>}
                  {p.demo_url && <a href={normalizeExternalUrl(p.demo_url)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"><ExternalLink className="h-4 w-4" /> Demo</a>}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </Section>
  );
}