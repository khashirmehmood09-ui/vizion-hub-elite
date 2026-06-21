import { useState } from "react";
import { useExperience, type Experience } from "@/lib/portfolio/queries";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react";
import { TextField } from "./ProfileManager";

export function ExperienceManager() {
  const qc = useQueryClient();
  const { data } = useExperience();
  const [editing, setEditing] = useState<Experience | null>(null);
  const [showForm, setShowForm] = useState(false);
  async function remove(id: string) {
    if (!confirm("Delete this entry?")) return;
    const { error } = await supabase.from("experience").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["experience"] }); }
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Experience</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-violet)] px-4 py-2 text-sm font-medium text-background"><Plus className="h-4 w-4" /> Add</button>
      </div>
      {showForm && <ExpForm key={editing?.id ?? "new"} editing={editing} onClose={() => setShowForm(false)} />}
      <div className="grid gap-3">
        {(data ?? []).map((e) => (
          <div key={e.id} className="glass rounded-2xl p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{e.position} · {e.company}</div>
              <div className="text-xs text-muted-foreground truncate">{e.start_date} — {e.end_date ?? "Present"}</div>
            </div>
            <button onClick={() => { setEditing(e); setShowForm(true); }} className="rounded-lg p-2 hover:bg-white/5 text-muted-foreground"><Pencil className="h-4 w-4" /></button>
            <button onClick={() => remove(e.id)} className="rounded-lg p-2 hover:bg-white/5 text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExpForm({ editing, onClose }: { editing: Experience | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [f, setF] = useState({
    company: editing?.company ?? "", position: editing?.position ?? "",
    start_date: editing?.start_date ?? "", end_date: editing?.end_date ?? "",
    description: editing?.description ?? "", sort_order: editing?.sort_order ?? 0,
  });
  const [saving, setSaving] = useState(false);
  async function save() {
    setSaving(true);
    const payload = { ...f, start_date: f.start_date || null, end_date: f.end_date || null };
    const { error } = editing
      ? await supabase.from("experience").update(payload).eq("id", editing.id)
      : await supabase.from("experience").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["experience"] });
    onClose();
  }
  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <TextField label="Position" value={f.position} onChange={(v) => setF({ ...f, position: v })} />
        <TextField label="Company" value={f.company} onChange={(v) => setF({ ...f, company: v })} />
        <div>
          <label className="text-xs text-muted-foreground">Start date</label>
          <input type="date" value={f.start_date} onChange={(e) => setF({ ...f, start_date: e.target.value })} className="mt-1 w-full glass rounded-xl px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">End date (blank = present)</label>
          <input type="date" value={f.end_date} onChange={(e) => setF({ ...f, end_date: e.target.value })} className="mt-1 w-full glass rounded-xl px-3 py-2.5 text-sm" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-muted-foreground">Description</label>
          <textarea rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className="mt-1 w-full glass rounded-xl px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Sort order</label>
          <input type="number" value={f.sort_order} onChange={(e) => setF({ ...f, sort_order: Number(e.target.value) })} className="mt-1 w-full glass rounded-xl px-3 py-2.5 text-sm" />
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