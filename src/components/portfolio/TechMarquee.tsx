import { motion } from "framer-motion";

const techStack = [
  "Python", "Excel", "NumPy", "Pandas", "SQL", "Power BI", "Tableau",
  "Machine Learning", "Deep Learning", "AI", "TensorFlow", "PyTorch",
  "Scikit-learn", "Keras", "OpenCV", "NLP", "Data Mining", "Statistics",
  "Matplotlib", "Seaborn", "Plotly", "Streamlit", "FastAPI", "Jupyter",
];

function MarqueeRow({
  items,
  duration,
  reverse,
}: {
  items: string[];
  duration: number;
  reverse?: boolean;
}) {
  const doubled = [...items, ...items, ...items];
  return (
    <div className="relative overflow-hidden py-2">
      <motion.div
        className="flex gap-4 whitespace-nowrap"
        animate={{ x: reverse ? ["-33.33%", "0%"] : ["0%", "-33.33%"] }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {doubled.map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            className="inline-flex items-center rounded-full glass px-4 py-2 text-sm font-medium text-muted-foreground"
          >
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-cyan)]" />
            {tech}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function TechMarquee() {
  const row1 = techStack.slice(0, 8);
  const row2 = techStack.slice(8, 16);
  const row3 = techStack.slice(16);

  return (
    <section className="relative overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-background)] py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--color-background)] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--color-background)] to-transparent z-10" />
      <MarqueeRow items={row1} duration={25} />
      <MarqueeRow items={row2} duration={30} reverse />
      <MarqueeRow items={row3} duration={22} />
    </section>
  );
}
