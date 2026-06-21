import { useState } from "react";
import { useDashboards, type Dashboard } from "@/lib/portfolio/queries";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadFile } from "@/lib/portfolio/storage";
import { Plus, Trash2, Pencil, Loader2, Upload } from "lucide-react";
import { TextField } from "./ProfileManager";

export function DashboardsManager() {
  const qc = useQueryClient();
  const { data } = useDashboards();
  const [editing, setEditing] = useState<Dashboard | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function remove(id: string) {
    if (!confirm("Delete this dashboard?")) return;
    const { error } = await supabase.from("dashboards").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["dashboards"] }); }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Power BI Dashboards</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-violet)] px-4 py-2 text-sm font-medium text-background"><Plus className="h-4 w-4" /> Add</button>
      </div>
      {showForm && <DashForm key={editing?.id ?? "new"} editing={editing} onClose={() => setShowForm(false)} />}
      <div className="grid gap-3">
        {(data ?? []).map((d) => (
          <div key={d.id} className="glass rounded-2xl p-4 flex items-center gap-4">
            <div className="h-14 w-20 rounded-lg overflow-hidden bg-white/5">
              {d.thumbnail_url && <img src={d.thumbnail_url} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{d.name}</div>
              <div className="text-xs text-muted-foreground truncate">{d.embed_url}</div>
            </div>
            <button onClick={() => { setEditing(d); setShowForm(true); }} className="rounded-lg p-2 hover:bg-white/5 text-muted-foreground"><Pencil className="h-4 w-4" /></button>
            <button onClick={() => remove(d.id)} className="rounded-lg p-2 hover:bg-white/5 text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashForm({ editing, onClose }: { editing: Dashboard | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [f, setF] = useState({
    name: editing?.name ?? "", description: editing?.description ?? "",
    embed_url: editing?.embed_url ?? "", thumbnail_url: editing?.thumbnail_url ?? "",
    sort_order: editing?.sort_order ?? 0,
  });
  const [saving, setSaving] = useState(false);

  async function uploadThumb(file?: File) {
    if (!file) return;
    try { const url = await uploadFile("dashboards", file); setF({ ...f, thumbnail_url: url }); toast.success("Uploaded"); }
    catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Upload failed"); }
  }

  async function save() {
    setSaving(true);
    const payload = { ...f, thumbnail_url: f.thumbnail_url || null };
    const { error } = editing
      ? await supabase.from("dashboards").update(payload).eq("id", editing.id)
      : await supabase.from("dashboards").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["dashboards"] });
    onClose();
  }

  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <TextField label="Name" value={f.name} onChange={(v) => setF({ ...f, name: v })} />
        <div>
          <label className="text-xs text-muted-foreground">Sort order</label>
          <input type="number" value={f.sort_order} onChange={(e) => setF({ ...f, sort_order: Number(e.target.value) })} className="mt-1 w-full glass rounded-xl px-3 py-2.5 text-sm" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-muted-foreground">Description</label>
          <textarea rows={2} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className="mt-1 w-full glass rounded-xl px-3 py-2.5 text-sm" />
        </div>
        <TextField label="Power BI embed URL" value={f.embed_url} onChange={(v) => setF({ ...f, embed_url: v })} className="sm:col-span-2" />
        <div className="sm:col-span-2">
          <label className="text-xs text-muted-foreground">Thumbnail</label>
          <div className="mt-1 flex items-center gap-3">
            {f.thumbnail_url && <img src={f.thumbnail_url} alt="" className="h-12 w-20 rounded-lg object-cover" />}
            <label className="inline-flex items-center gap-2 rounded-xl glass px-3 py-2 text-sm cursor-pointer hover:bg-white/5">
              <Upload className="h-4 w-4" /> Upload
              <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadThumb(e.target.files?.[0])} />
            </label>
          </div>
        </div>
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