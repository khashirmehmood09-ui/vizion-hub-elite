import { createFileRoute } from "@tanstack/react-router";
import { ContactSection } from "@/components/portfolio/ContactSection";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Hashir Mehmood Qureshi" },
      { name: "description", content: "Get in touch for freelance projects, full-time opportunities, or collaboration." },
      { property: "og:title", content: "Contact Hashir Mehmood Qureshi" },
      { property: "og:description", content: "Send a message about your data project." },
    ],
  }),
  component: () => <ContactSection />,
});