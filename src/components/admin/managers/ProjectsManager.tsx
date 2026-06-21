import { useState } from "react";
import { useProjects, type Project } from "@/lib/portfolio/queries";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadFile } from "@/lib/portfolio/storage";
import { normalizeExternalUrl } from "@/lib/utils";
import { Plus, Trash2, Pencil, Loader2, Upload } from "lucide-react";
import { TextField } from "./ProfileManager";

const CATEGORIES = ["Data Analytics", "Power BI", "SQL", "Python", "Machine Learning", "Recommendation Systems"];

type Form = {
  title: string; description: string; category: string; tech: string;
  github_url: string; demo_url: string; image_url: string; project_date: string; featured: boolean; sort_order: number;
};
const empty: Form = { title: "", description: "", category: "Data Analytics", tech: "", github_url: "", demo_url: "", image_url: "", project_date: "", featured: false, sort_order: 0 };

export function ProjectsManager() {
  const qc = useQueryClient();
  const { data: projects } = useProjects();
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);

  function openNew() { setEditing(null); setShowForm(true); }
  function openEdit(p: Project) { setEditing(p); setShowForm(true); }

  async function remove(id: string) {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["projects"] }); }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Projects</h2>
        <button onClick={openNew} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-violet)] px-4 py-2 text-sm font-medium text-background"><Plus className="h-4 w-4" /> Add project</button>
      </div>
      {showForm && <ProjectForm key={editing?.id ?? "new"} editing={editing} onClose={() => setShowForm(false)} />}
      <div className="grid gap-3">
        {(projects ?? []).map((p) => (
          <div key={p.id} className="glass rounded-2xl p-4 flex items-center gap-4">
            <div className="h-14 w-20 rounded-lg overflow-hidden bg-white/5">
              {p.image_url && <img src={p.image_url} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{p.title}</div>
              <div className="text-xs text-muted-foreground truncate">{p.category} · {p.tech?.slice(0,3).join(", ")}</div>
            </div>
            <button onClick={() => openEdit(p)} className="rounded-lg p-2 hover:bg-white/5 text-muted-foreground"><Pencil className="h-4 w-4" /></button>
            <button onClick={() => remove(p.id)} className="rounded-lg p-2 hover:bg-white/5 text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectForm({ editing, onClose }: { editing: Project | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [f, setF] = useState<Form>(editing ? {
    title: editing.title, description: editing.description, category: editing.category,
    tech: (editing.tech ?? []).join(", "), github_url: editing.github_url ?? "", demo_url: editing.demo_url ?? "",
    image_url: editing.image_url ?? "", project_date: editing.project_date ?? "", featured: editing.featured, sort_order: editing.sort_order,
  } : empty);
  const [saving, setSaving] = useState(false);

  async function uploadImage(file?: File) {
    if (!file) return;
    try { const url = await uploadFile("projects", file); setF({ ...f, image_url: url }); toast.success("Uploaded"); }
    catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Upload failed"); }
  }

  async function save() {
    setSaving(true);
    const payload = {
      title: f.title, description: f.description, category: f.category,
      tech: f.tech.split(",").map((s) => s.trim()).filter(Boolean),
      github_url: normalizeExternalUrl(f.github_url, "github.com") || null,
      demo_url: normalizeExternalUrl(f.demo_url) || null,
      image_url: f.image_url || null, project_date: f.project_date || null, featured: f.featured, sort_order: Number(f.sort_order) || 0,
    };
    const { error } = editing
      ? await supabase.from("projects").update(payload).eq("id", editing.id)
      : await supabase.from("projects").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["projects"] });
    onClose();
  }

  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <TextField label="Title" value={f.title} onChange={(v) => setF({ ...f, title: v })} />
        <div>
          <label className="text-xs text-muted-foreground">Category</label>
          <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className="mt-1 w-full glass rounded-xl px-3 py-2.5 text-sm bg-transparent">
            {CATEGORIES.map((c) => <option key={c} value={c} className="bg-background">{c}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-muted-foreground">Description</label>
          <textarea rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className="mt-1 w-full glass rounded-xl px-3 py-2.5 text-sm" />
        </div>
        <TextField label="Tech (comma separated)" value={f.tech} onChange={(v) => setF({ ...f, tech: v })} className="sm:col-span-2" />
        <TextField label="GitHub URL" value={f.github_url} onChange={(v) => setF({ ...f, github_url: v })} />
        <TextField label="Demo URL" value={f.demo_url} onChange={(v) => setF({ ...f, demo_url: v })} />
        <div>
          <label className="text-xs text-muted-foreground">Date</label>
          <input type="date" value={f.project_date} onChange={(e) => setF({ ...f, project_date: e.target.value })} className="mt-1 w-full glass rounded-xl px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Sort order</label>
          <input type="number" value={f.sort_order} onChange={(e) => setF({ ...f, sort_order: Number(e.target.value) })} className="mt-1 w-full glass rounded-xl px-3 py-2.5 text-sm" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-muted-foreground">Image</label>
          <div className="mt-1 flex items-center gap-3">
            {f.image_url && <img src={f.image_url} alt="" className="h-12 w-20 rounded-lg object-cover" />}
            <label className="inline-flex items-center gap-2 rounded-xl glass px-3 py-2 text-sm cursor-pointer hover:bg-white/5">
              <Upload className="h-4 w-4" /> Upload
              <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e.target.files?.[0])} />
            </label>
          </div>
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={f.featured} onChange={(e) => setF({ ...f, featured: e.target.checked })} /> Featured
        </label>
      </div>
      <div className="flex gap-2">
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-violet)] px-5 py-2 text-sm font-medium text-background">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
        </button>
        <button onClick={onClose} className="rounded-xl glass px-4 py-2 text-sm">Cancel</button>
      </div>
    </div>
  );
}