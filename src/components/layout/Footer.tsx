import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Mail, MessageCircle } from "lucide-react";
import { useProfile } from "@/lib/portfolio/queries";
import { normalizeExternalUrl, normalizeWhatsappHref } from "@/lib/utils";

export function Footer() {
  const { data: profile } = useProfile();
  const socials = (profile?.socials ?? {}) as Record<string, string>;
  const githubHref = normalizeExternalUrl(socials.github, "github.com");
  const linkedinHref = normalizeExternalUrl(socials.linkedin, "linkedin.com/in");
  const waHref = normalizeWhatsappHref(socials.whatsapp);
  const emailHref = profile?.email ? `mailto:${profile.email.trim()}` : "";
  return (
    <footer className="mt-24 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div className="font-display text-lg font-semibold">{profile?.name ?? "Hashir Mehmood Qureshi"}</div>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">{profile?.tagline}</p>
        </div>
        <div className="text-sm">
          <div className="font-medium mb-3">Explore</div>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/projects" className="hover:text-foreground">Projects</Link></li>
            <li><Link to="/dashboards" className="hover:text-foreground">Dashboards</Link></li>
            <li><Link to="/certifications" className="hover:text-foreground">Certifications</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-medium mb-3">Connect</div>
          <div className="flex items-center gap-3 text-muted-foreground">
            {githubHref && <a href={githubHref} target="_blank" rel="noreferrer" className="hover:text-foreground" aria-label="GitHub"><Github className="h-5 w-5" /></a>}
            {linkedinHref && <a href={linkedinHref} target="_blank" rel="noreferrer" className="hover:text-foreground" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></a>}
            {waHref && <a href={waHref} target="_blank" rel="noreferrer" className="hover:text-foreground" aria-label="WhatsApp"><MessageCircle className="h-5 w-5" /></a>}
            {emailHref && <a href={emailHref} className="hover:text-foreground" aria-label="Email"><Mail className="h-5 w-5" /></a>}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">© {new Date().getFullYear()} {profile?.name ?? "Hashir Mehmood Qureshi"}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}