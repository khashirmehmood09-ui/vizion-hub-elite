import { Section } from "./Section";
import { useServices } from "@/lib/portfolio/queries";
import { motion } from "framer-motion";
import { BarChart3, Database, Bot, LineChart, Workflow, Sparkles, type LucideIcon } from "lucide-react";

const ICON: Record<string, LucideIcon> = {
  chart: BarChart3,
  database: Database,
  bot: Bot,
  line: LineChart,
  workflow: Workflow,
  sparkles: Sparkles,
};

export function ServicesSection() {
  const { data: services } = useServices();
  if (!services || services.length === 0) return null;
  return (
    <Section
      id="services"
      eyebrow="Services"
      title={<>What I <span className="text-gradient">build</span> for clients</>}
      description="Pick a deliverable. I'll handle data, modeling, and presentation."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => {
          const Icon = ICON[s.icon ?? ""] ?? Sparkles;
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-6"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--color-cyan)] to-[var(--color-violet)] grid place-items-center text-background">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}