import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Section } from "./Section";
import { useProfile, useProjects, useDashboards, useCertifications, useSkills } from "@/lib/portfolio/queries";

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return <span ref={ref} className="num">{n}{suffix}</span>;
}

export function About() {
  const { data: profile } = useProfile();
  const { data: projects } = useProjects();
  const { data: dashboards } = useDashboards();
  const { data: certs } = useCertifications();
  const { data: skills } = useSkills();

  const stats = [
    { label: "Projects Completed", value: projects?.length ?? 0 },
    { label: "Dashboards Built", value: dashboards?.length ?? 0 },
    { label: "Certifications", value: certs?.length ?? 0 },
    { label: "Technologies", value: skills?.length ?? 0 },
  ];
  return (
    <Section id="about" eyebrow="About" title={<>Computer Science student. <span className="text-gradient">Data-obsessed builder.</span></>}>
      <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-start">
        <p className="text-muted-foreground leading-relaxed">
          {profile?.bio}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5"
            >
              <div className="text-3xl font-display font-semibold text-gradient">
                <Counter value={s.value} suffix="+" />
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}