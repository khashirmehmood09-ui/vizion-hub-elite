import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/portfolio/Hero";
import { TechMarquee } from "@/components/portfolio/TechMarquee";
import { About } from "@/components/portfolio/About";
import { SkillsSection } from "@/components/portfolio/SkillsSection";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { ServicesSection } from "@/components/portfolio/ServicesSection";
import { ExperienceSection } from "@/components/portfolio/ExperienceSection";
import { ContactSection } from "@/components/portfolio/ContactSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hashir Mehmood Qureshi — Data Analyst & Data Scientist" },
      { name: "description", content: "Portfolio of Hashir Mehmood Qureshi — Power BI, SQL, Python, and Machine Learning for business intelligence." },
      { property: "og:title", content: "Hashir Mehmood Qureshi — Data Analyst & Data Scientist" },
      { property: "og:description", content: "Premium analytics, dashboards, and machine learning solutions." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <About />
      <SkillsSection />
      <ProjectsSection limit={6} />
      <ServicesSection />
      <ExperienceSection />
      <ContactSection />
    </>
  );
}

