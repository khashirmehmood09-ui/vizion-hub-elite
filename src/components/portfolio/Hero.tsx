import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, Cpu, Database, Download, Mail, Sparkles } from "lucide-react";
import { useProfile } from "@/lib/portfolio/queries";
import { TechOrbit } from "./TechOrbit";


export function Hero() {
  const { data: profile } = useProfile();
  return (
    <section className="relative pt-16 md:pt-24">
      <div className="mx-auto max-w-6xl px-4 grid gap-12 md:grid-cols-[1fr_auto] md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-cyan)] animate-pulse" />
            Available for freelance & full-time roles
          </div>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05]">
            Hi, I'm <span className="text-gradient">{profile?.name?.split(" ")[0] ?? "Hashir"}</span>.
            <br />
            I turn data into{" "}
            <span className="text-gradient">decisions</span>.
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl">
            {profile?.tagline}
          </p>
          <div className="mt-3 text-sm text-muted-foreground">
            {profile?.title}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-violet)] px-5 py-3 text-sm font-medium text-background hover:opacity-90"
            >
              View projects <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm font-medium hover:bg-white/5"
            >
              <Mail className="h-4 w-4" /> Contact me
            </Link>
            {profile?.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <Download className="h-4 w-4" /> Resume
              </a>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a href="#about" className="inline-flex items-center justify-center rounded-xl glass px-5 py-3 text-sm font-medium hover:bg-white/5">
              About
            </a>
            <Link to="/certifications" className="inline-flex items-center justify-center rounded-xl glass px-5 py-3 text-sm font-medium hover:bg-white/5">
              Certifications
            </Link>
            <a href="#experience" className="inline-flex items-center justify-center rounded-xl glass px-5 py-3 text-sm font-medium hover:bg-white/5">
              Experience
            </a>
            <a href="#projects" className="inline-flex items-center justify-center rounded-xl glass px-5 py-3 text-sm font-medium hover:bg-white/5">
              Projects
            </a>
          </div>
        </motion.div>
        <div className="relative hidden md:flex items-center justify-center" style={{ width: 520, height: 520 }}>
          <DecorativeEnvironment />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <TechOrbit />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative z-10"
          >
            <ProfileAvatar src={profile?.avatar_url ?? undefined} name={profile?.name ?? "Hashir"} />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="md:hidden justify-self-center"
        >
          <ProfileAvatar src={profile?.avatar_url ?? undefined} name={profile?.name ?? "Hashir"} />
        </motion.div>
      </div>
      <FloatingParticles />
    </section>
  );
}

function ProfileAvatar({ src, name }: { src?: string; name: string }) {
  return (
    <div className="relative h-56 w-56 md:h-72 md:w-72">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-cyan)] via-[var(--color-violet)] to-[var(--color-cyan)] blur-2xl opacity-40 animate-pulse" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-cyan)] to-[var(--color-violet)] p-[2px]">
        <div className="h-full w-full rounded-full bg-background grid place-items-center overflow-hidden glow-ring">
          {src ? (
            <img src={src} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className="font-display text-6xl text-gradient">{name.split(" ").map((p) => p[0]).slice(0,2).join("")}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function DecorativeEnvironment() {
  const cards = [
    { icon: Cpu, label: "ML model", accent: "from-[#00E5FF] to-[#4FC3F7]" },
    { icon: Database, label: "Data stack", accent: "from-[#7C3AED] to-[#0EA5E9]" },
    { icon: BarChart3, label: "Insights", accent: "from-[#F59E0B] to-[#EF4444]" },
    { icon: Sparkles, label: "Data science", accent: "from-[#22C55E] to-[#14B8A6]" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {cards.map((card, index) => {
        const positions = [
          { top: "10%", left: "68%" },
          { top: "24%", left: "86%" },
          { top: "62%", left: "78%" },
          { top: "70%", left: "52%" },
        ];
        const pos = positions[index];
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            className={`absolute rounded-3xl border border-white/10 bg-slate-950/80 p-4 shadow-2xl backdrop-blur-xl ${card.accent}`}
            style={{ width: 170, minHeight: 88, ...pos }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: [20, 0, 20] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", delay: index * 0.2 }}
          >
            <div className="flex items-center gap-3">
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} text-background shadow-lg`}>
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{card.label}</div>
                <div className="mt-1 text-sm font-semibold text-white">{card.label.includes("Data") ? "Data science" : card.label}</div>
              </div>
            </div>
          </motion.div>
        );
      })}
      <div className="absolute top-10 left-10 h-24 w-24 rounded-full border border-[rgba(255,255,255,0.12)] bg-white/5 blur-xl" />
      <div className="absolute bottom-8 right-10 h-28 w-28 rounded-full border border-[rgba(56,189,248,0.18)] bg-cyan-500/10 blur-2xl" />
    </div>
  );
}

function FloatingParticles() {
  const dots = Array.from({ length: 14 });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {dots.map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-[var(--color-cyan)]"
          style={{
            left: `${(i * 73) % 100}%`,
            top: `${(i * 47) % 100}%`,
            opacity: 0.5,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}