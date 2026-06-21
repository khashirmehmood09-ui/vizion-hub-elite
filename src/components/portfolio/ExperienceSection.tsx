import { Section } from "./Section";
import { useExperience } from "@/lib/portfolio/queries";
import { motion } from "framer-motion";

function fmt(d?: string | null) {
  if (!d) return "Present";
  return new Date(d).toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

export function ExperienceSection() {
  const { data: exp } = useExperience();
  if (!exp || exp.length === 0) return null;
  return (
    <Section id="experience" eyebrow="Experience" title={<>Where I've <span className="text-gradient">worked</span></>}>
      <ol className="relative border-l border-white/10 pl-6 space-y-8">
        {exp.map((e, i) => (
          <motion.li
            key={e.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <span className="absolute -left-1.5 h-3 w-3 rounded-full bg-gradient-to-br from-[var(--color-cyan)] to-[var(--color-violet)] glow-ring" />
            <div className="text-xs text-muted-foreground">{fmt(e.start_date)} — {fmt(e.end_date)}</div>
            <h3 className="font-display text-lg font-semibold mt-1">{e.position} · <span className="text-muted-foreground">{e.company}</span></h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{e.description}</p>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}