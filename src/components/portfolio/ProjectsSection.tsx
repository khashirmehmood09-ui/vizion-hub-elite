import { Section } from "./Section";
import { useProjects } from "@/lib/portfolio/queries";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { normalizeExternalUrl } from "@/lib/utils";

export function ProjectsSection({ limit, showAll }: { limit?: number; showAll?: boolean }) {
  const { data: projects } = useProjects();
  const list = limit ? (projects ?? []).slice(0, limit) : (projects ?? []);
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title={<>Selected <span className="text-gradient">work</span></>}
      description="Real-world analytics, dashboards, and ML projects."
    >
      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">No projects yet — add them from the admin panel.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="glass group rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 transition-transform"
            >
              <div className="aspect-[16/10] bg-gradient-to-br from-[var(--color-cyan)]/10 to-[var(--color-violet)]/10 overflow-hidden">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="h-full w-full grid place-items-center text-3xl font-display text-gradient">{p.title[0]}</div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span>{p.category}</span>
                  {p.project_date && <span>{new Date(p.project_date).getFullYear()}</span>}
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.description}</p>
                {p.tech?.length ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.tech.slice(0, 5).map((t) => (
                      <span key={t} className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground">{t}</span>
                    ))}
                  </div>
                ) : null}
                <div className="mt-auto pt-4 flex items-center gap-3 text-sm">
                  {p.github_url && (
                    <a href={normalizeExternalUrl(p.github_url, "github.com")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                      <Github className="h-4 w-4" /> Code
                    </a>
                  )}
                  {p.demo_url && (
                    <a href={normalizeExternalUrl(p.demo_url)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                      <ExternalLink className="h-4 w-4" /> Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
      {!showAll && limit && (projects?.length ?? 0) > limit && (
        <div className="mt-8">
          <Link to="/projects" className="inline-flex items-center gap-1 text-sm text-[var(--color-cyan)] hover:underline">
            See all projects <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </Section>
  );
}