import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("py-20 md:py-28", className)}>
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-2xl"
        >
          {eyebrow && (
            <div className="text-xs uppercase tracking-widest text-[var(--color-cyan)] mb-3">{eyebrow}</div>
          )}
          <h2 className="font-display text-3xl md:text-4xl font-semibold">{title}</h2>
          {description && <p className="mt-3 text-muted-foreground">{description}</p>}
        </motion.div>
        {children}
      </div>
    </section>
  );
}