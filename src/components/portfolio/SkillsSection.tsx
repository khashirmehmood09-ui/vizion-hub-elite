import { useMemo, useState } from "react";
import { Section } from "./Section";
import { useSkills } from "@/lib/portfolio/queries";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SkillsSection() {
  const { data: skills } = useSkills();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const cats = useMemo(() => {
    const s = new Set<string>(["All"]);
    (skills ?? []).forEach((sk) => s.add(sk.category));
    return Array.from(s);
  }, [skills]);
  const filtered = (skills ?? []).filter(
    (s) =>
      (cat === "All" || s.category === cat) &&
      s.name.toLowerCase().includes(q.toLowerCase()),
  );
  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, s) => {
    (acc[s.category] ||= []).push(s);
    return acc;
  }, {});
  const groupKeys = Object.keys(grouped);
  return (
    <Section id="skills" eyebrow="Skills" title={<>The toolkit behind the <span className="text-gradient">work</span></>} description="Search, filter, and explore my data, analytics, and engineering stack.">
      <div className="mb-6 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search skills…"
            className="w-full glass rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-cyan)]/40"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "rounded-full glass px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground",
                cat === c && "text-background bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-violet)]",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No skills yet — add them from the admin panel.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {groupKeys.map((g, gi) => (
            <motion.div
              key={g}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: gi * 0.05 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-base font-semibold">{g}</h3>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {grouped[g].length} {grouped[g].length === 1 ? "skill" : "skills"}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {grouped[g].map((s) => (
                  <div key={s.id} className="rounded-xl bg-white/5 border border-white/5 px-3 py-2.5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-medium truncate">{s.name}</div>
                      <div className="text-[10px] text-muted-foreground tabular-nums shrink-0">{s.level}/5</div>
                    </div>
                    <div className="mt-2 h-1 w-full rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-violet)]"
                        style={{ width: `${(s.level / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Section>
  );
}