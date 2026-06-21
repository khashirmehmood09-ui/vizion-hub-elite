import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useIsAdmin } from "@/lib/portfolio/admin";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProfileManager } from "@/components/admin/managers/ProfileManager";
import { ProjectsManager } from "@/components/admin/managers/ProjectsManager";
import { SkillsManager } from "@/components/admin/managers/SkillsManager";
import { CertificationsManager } from "@/components/admin/managers/CertificationsManager";
import { DashboardsManager } from "@/components/admin/managers/DashboardsManager";
import { ServicesManager } from "@/components/admin/managers/ServicesManager";
import { ExperienceManager } from "@/components/admin/managers/ExperienceManager";
import { MessagesManager } from "@/components/admin/managers/MessagesManager";
import { Loader2, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const [tab, setTab] = useState("profile");
  const { data: isAdmin, isLoading } = useIsAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="glass rounded-2xl p-6 max-w-md text-center">
          <ShieldAlert className="h-8 w-8 mx-auto text-[var(--color-cyan)]" />
          <h2 className="mt-3 font-display text-lg font-semibold">Admin access required</h2>
          <p className="mt-2 text-sm text-muted-foreground">Your account is signed in but doesn't have the admin role yet. Ask your developer to grant the admin role to your user.</p>
        </div>
      </div>
    );
  }

  return (
    <AdminShell active={tab} onSelect={setTab}>
      {tab === "profile" && <ProfileManager />}
      {tab === "projects" && <ProjectsManager />}
      {tab === "skills" && <SkillsManager />}
      {tab === "certifications" && <CertificationsManager />}
      {tab === "dashboards" && <DashboardsManager />}
      {tab === "services" && <ServicesManager />}
      {tab === "experience" && <ExperienceManager />}
      {tab === "messages" && <MessagesManager />}
    </AdminShell>
  );
}