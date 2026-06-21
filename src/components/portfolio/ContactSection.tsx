import { Section } from "./Section";
import { useProfile } from "@/lib/portfolio/queries";
import { ContactForm } from "./ContactForm";
import { Github, Linkedin, Mail, MapPin, MessageCircle } from "lucide-react";
import { normalizeExternalUrl, normalizeWhatsappHref } from "@/lib/utils";

export function ContactSection() {
  const { data: profile } = useProfile();
  const socials = (profile?.socials ?? {}) as Record<string, string>;
  const waHref = normalizeWhatsappHref(socials.whatsapp);
  const githubHref = normalizeExternalUrl(socials.github, "github.com");
  const linkedinHref = normalizeExternalUrl(socials.linkedin, "linkedin.com/in");
  const emailHref = profile?.email ? `mailto:${profile.email.trim()}` : "";
  return (
    <Section id="contact" eyebrow="Contact" title={<>Let's build something <span className="text-gradient">together</span></>} description="Available for freelance projects on Upwork and Fiverr, and full-time opportunities.">
      <div className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
        <div className="glass rounded-2xl p-6 space-y-4">
          {emailHref && (
            <a href={emailHref} className="flex items-center gap-3 text-sm hover:text-[var(--color-cyan)]">
              <Mail className="h-4 w-4" /> {profile?.email}
            </a>
          )}
          {waHref && (
            <a href={waHref} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm hover:text-[var(--color-cyan)]">
              <MessageCircle className="h-4 w-4" /> WhatsApp: {socials.whatsapp}
            </a>
          )}
          {profile?.location && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> {profile.location}
            </div>
          )}
          <div className="pt-2 border-t border-white/10 space-y-2">
            {githubHref && <a href={githubHref} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm hover:text-foreground text-muted-foreground"><Github className="h-4 w-4" /> GitHub</a>}
            {linkedinHref && <a href={linkedinHref} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm hover:text-foreground text-muted-foreground"><Linkedin className="h-4 w-4" /> LinkedIn</a>}
            {socials.upwork && <a href={normalizeExternalUrl(socials.upwork, "www.upwork.com")} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm hover:text-foreground text-muted-foreground">↗ Upwork</a>}
            {socials.fiverr && <a href={normalizeExternalUrl(socials.fiverr, "www.fiverr.com")} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm hover:text-foreground text-muted-foreground">↗ Fiverr</a>}
          </div>
        </div>
        <ContactForm />
      </div>
    </Section>
  );
}