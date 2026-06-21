import { motion } from "framer-motion";

const tools = [
  { name: "Power BI", color: "#FDD835", glow: "#FDD835" },
  { name: "Data Analysis", color: "#6C6CE5", glow: "#6C6CE5" },
  { name: "ML", color: "#00E5FF", glow: "#00E5FF" },
  { name: "NumPy", color: "#4FC3F7", glow: "#4FC3F7" },
  { name: "Pandas", color: "#17A2B8", glow: "#17A2B8" },
  { name: "Python", color: "#FFD43B", glow: "#FFD43B" },
  { name: "TensorFlow", color: "#FF9900", glow: "#FF9900" },
  { name: "Scikit-Learn", color: "#2E7D32", glow: "#2E7D32" },
  { name: "PyTorch", color: "#EF5350", glow: "#EF5350" },
  { name: "Tableau", color: "#FF8A65", glow: "#FF8A65" },
  { name: "SQL", color: "#FF7043", glow: "#FF7043" },
  { name: "AI", color: "#AB47BC", glow: "#AB47BC" },
];

function ToolBadge({ tool }: { tool: typeof tools[0] }) {
  return (
    <div
      className="flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] whitespace-nowrap"
      style={{
        border: `1.5px solid ${tool.color}`,
        background: `color-mix(in oklab, ${tool.color} 20%, oklch(0.14 0.02 265))`,
        color: tool.color,
        boxShadow: `0 0 24px ${tool.glow}40, inset 0 0 12px ${tool.glow}15`,
        textShadow: `0 0 6px ${tool.glow}75`,
      }}
    >
      <span
        className="inline-block h-2.5 w-2.5 rounded-full"
        style={{
          background: tool.color,
          boxShadow: `0 0 10px ${tool.glow}80, 0 0 18px ${tool.glow}40`,
        }}
      />
      {tool.name}
    </div>
  );
}

function OrbitRing({
  radius,
  duration,
  reverse,
  tools: ringTools,
  delay = 0,
}: {
  radius: number;
  duration: number;
  reverse?: boolean;
  tools: typeof tools;
  delay?: number;
}) {
  const count = ringTools.length;
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ rotate: 0 }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
        delay,
      }}
      style={{ width: radius * 2, height: radius * 2, transformOrigin: "center center" }}
    >
      {ringTools.map((tool, i) => {
        const angle = (i / count) * 360;
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;
        return (
          <motion.div
            key={tool.name}
            className="absolute left-1/2 top-1/2"
            style={{ x, y, translateX: "-50%", translateY: "-50%" }}
            animate={{
              rotate: reverse ? 360 : -360,
              y: [y, y - 8, y],
              opacity: [0.85, 1, 0.85],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: i * 0.15 + delay,
            }}
          >
            <ToolBadge tool={tool} />
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export function TechOrbit() {
  return (
    <div
      className="relative hidden md:flex items-center justify-center shrink-0"
      style={{ width: 520, height: 520 }}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: 320,
          height: 320,
          border: "2px dashed oklch(0.78 0.18 200 / 28%)",
          boxShadow: "0 0 38px oklch(0.78 0.18 200 / 10%)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 420,
          height: 420,
          border: "1.5px dashed oklch(0.7 0.22 295 / 22%)",
          boxShadow: "0 0 28px oklch(0.7 0.22 295 / 8%)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 520,
          height: 520,
          border: "1px dashed oklch(1 0 0 / 12%)",
          boxShadow: "0 0 16px oklch(1 0 0 / 6%)",
        }}
      />

      <OrbitRing radius={145} duration={24} tools={tools.slice(0, 4)} delay={0} />
      <OrbitRing radius={195} duration={34} reverse tools={tools.slice(4, 8)} delay={1.5} />
      <OrbitRing radius={255} duration={44} tools={tools.slice(8, 12)} delay={3} />

      <div
        className="absolute rounded-full"
        style={{
          width: 180,
          height: 180,
          background:
            "radial-gradient(circle, oklch(0.78 0.18 200 / 35%), oklch(0.7 0.22 295 / 15%), transparent 72%)",
          boxShadow: "0 0 60px oklch(0.78 0.18 200 / 20%), 0 0 90px oklch(0.7 0.22 295 / 12%)",
        }}
      />
    </div>
  );
}
