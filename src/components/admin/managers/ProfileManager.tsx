import { useEffect, useState } from "react";
import { useProfile } from "@/lib/portfolio/queries";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadFile } from "@/lib/portfolio/storage";
import { Loader2, Upload } from "lucide-react";

export function ProfileManager() {
  const { data: profile } = useProfile();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: "", title: "", tagline: "", bio: "", email: "", location: "",
    avatar_url: "" as string | null, resume_url: "" as string | null,
    github: "", linkedin: "", fiverr: "", upwork: "", whatsapp: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    const s = (profile.socials ?? {}) as Record<string, string>;
    setForm({
      name: profile.name, title: profile.title, tagline: profile.tagline, bio: profile.bio,
      email: profile.email ?? "", location: profile.location ?? "",
      avatar_url: profile.avatar_url, resume_url: profile.resume_url,
      github: s.github ?? "", linkedin: s.linkedin ?? "", fiverr: s.fiverr ?? "", upwork: s.upwork ?? "", whatsapp: s.whatsapp ?? "",
    });
  }, [profile]);

  async function save() {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase.from("profile").update({
      name: form.name, title: form.title, tagline: form.tagline, bio: form.bio,
      email: form.email, location: form.location,
      avatar_url: form.avatar_url, resume_url: form.resume_url,
      socials: { github: form.github, linkedin: form.linkedin, fiverr: form.fiverr, upwork: form.upwork, whatsapp: form.whatsapp },
    }).eq("id", profile.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
    qc.invalidateQueries({ queryKey: ["profile"] });
  }

  async function onFile(kind: "avatar_url" | "resume_url", file?: File) {
    if (!file) return;
    try {
      const url = await uploadFile(kind === "avatar_url" ? "avatars" : "resumes", file);
      setForm((f) => ({ ...f, [kind]: url }));
      toast.success("Uploaded");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    }
  }

  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      <h2 className="font-display text-lg font-semibold">Profile</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        <TextField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <TextField label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <TextField label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} className="sm:col-span-2" />
        <TextField label="Tagline" value={form.tagline} onChange={(v) => setForm({ ...form, tagline: v })} className="sm:col-span-2" />
        <TextField label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
        <div />
        <TextField label="GitHub URL" value={form.github} onChange={(v) => setForm({ ...form, github: v })} />
        <TextField label="LinkedIn URL" value={form.linkedin} onChange={(v) => setForm({ ...form, linkedin: v })} />
        <TextField label="WhatsApp number (with country code, e.g. +923335076880)" value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} className="sm:col-span-2" />
        <TextField label="Fiverr URL" value={form.fiverr} onChange={(v) => setForm({ ...form, fiverr: v })} />
        <TextField label="Upwork URL" value={form.upwork} onChange={(v) => setForm({ ...form, upwork: v })} />
        <div className="sm:col-span-2">
          <label className="text-xs text-muted-foreground">Bio</label>
          <textarea rows={5} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="mt-1 w-full glass rounded-xl px-3 py-2.5 text-sm" />
        </div>
        <FileField label="Profile photo" url={form.avatar_url} onFile={(f) => onFile("avatar_url", f)} accept="image/*" preview />
        <FileField label="Resume (PDF)" url={form.resume_url} onFile={(f) => onFile("resume_url", f)} accept="application/pdf" />
      </div>
      <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-violet)] px-5 py-2 text-sm font-medium text-background">
        {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
      </button>
    </div>
  );
}

function TextField({ label, value, onChange, className }: { label: string; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <div className={className}>
      <label className="text-xs text-muted-foreground">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full glass rounded-xl px-3 py-2.5 text-sm" />
    </div>
  );
}

function FileField({ label, url, onFile, accept, preview }: { label: string; url: string | null; onFile: (f?: File) => void; accept?: string; preview?: boolean }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <div className="mt-1 flex items-center gap-3">
        {preview && url && <img src={url} alt="" className="h-12 w-12 rounded-lg object-cover" />}
        <label className="inline-flex items-center gap-2 rounded-xl glass px-3 py-2 text-sm cursor-pointer hover:bg-white/5">
          <Upload className="h-4 w-4" /> Upload
          <input type="file" accept={accept} className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
        {url && <a href={url} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-foreground truncate max-w-[180px]">View</a>}
      </div>
    </div>
  );
}

export { TextField, FileField };