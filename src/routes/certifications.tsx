import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useCertifications } from "@/lib/portfolio/queries";
import { Section } from "@/components/portfolio/Section";
import { Download, ExternalLink, X } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/certifications")({
  head: () => ({
    meta: [
      { title: "Certifications — Hashir Mehmood Qureshi" },
      { name: "description", content: "Professional certifications in data analytics, BI, and machine learning." },
      { property: "og:title", content: "Certifications" },
      { property: "og:description", content: "Verified professional certifications." },
    ],
  }),
  component: CertsPage,
});

function CertsPage() {
  const { data } = useCertifications();
  const [preview, setPreview] = useState<string | null>(null);
  const list = data ?? [];
  return (
    <Section eyebrow="Credentials" title={<>Verified <span className="text-gradient">certifications</span></>}>
      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">No certifications yet — add them from the admin panel.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="glass rounded-2xl overflow-hidden"
            >
              {c.image_url && (
                <button onClick={() => setPreview(c.image_url!)} className="block w-full aspect-[4/3] overflow-hidden">
                  <img src={c.image_url} alt={c.name} className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" />
                </button>
              )}
              <div className="p-4">
                <h3 className="font-display font-semibold">{c.name}</h3>
                <div className="text-xs text-muted-foreground mt-1">{c.organization}{c.issue_date && ` · ${new Date(c.issue_date).toLocaleDateString(undefined, { month: "short", year: "numeric" })}`}</div>
                <div className="mt-3 flex gap-3 text-sm">
                  {c.cert_url && <a href={normalizeExternalUrl(c.cert_url)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"><ExternalLink className="h-4 w-4" /> Verify</a>}
                  {c.image_url && <a href={c.image_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"><Download className="h-4 w-4" /> Download</a>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {preview && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm p-4 flex items-center justify-center" onClick={() => setPreview(null)}>
          <button className="absolute top-4 right-4 rounded-full glass p-2"><X className="h-4 w-4" /></button>
          <img src={preview} alt="Certificate" className="max-h-[90vh] max-w-[90vw] rounded-2xl" />
        </div>
      )}
    </Section>
  );
}