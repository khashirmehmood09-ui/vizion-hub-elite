import { useState } from "react";
import { useSkills, type Skill } from "@/lib/portfolio/queries";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react";
import { TextField } from "./ProfileManager";

const CATS = ["Languages", "Data & BI", "Frameworks", "ML & Stats", "Tools", "Other"];

export function SkillsManager() {
  const qc = useQueryClient();
  const { data } = useSkills();
  const [editing, setEditing] = useState<Skill | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function remove(id: string) {
    if (!confirm("Delete this skill?")) return;
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["skills"] }); }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Skills</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-violet)] px-4 py-2 text-sm font-medium text-background"><Plus className="h-4 w-4" /> Add skill</button>
      </div>
      {showForm && <SkillForm key={editing?.id ?? "new"} editing={editing} onClose={() => setShowForm(false)} />}
      <div className="grid sm:grid-cols-2 gap-2">
        {(data ?? []).map((s) => (
          <div key={s.id} className="glass rounded-xl p-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{s.name}</div>
              <div className="text-xs text-muted-foreground">{s.category} · Level {s.level}/5</div>
            </div>
            <button onClick={() => { setEditing(s); setShowForm(true); }} className="rounded-lg p-2 hover:bg-white/5 text-muted-foreground"><Pencil className="h-4 w-4" /></button>
            <button onClick={() => remove(s.id)} className="rounded-lg p-2 hover:bg-white/5 text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillForm({ editing, onClose }: { editing: Skill | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [f, setF] = useState({
    name: editing?.name ?? "", category: editing?.category ?? "Other",
    level: editing?.level ?? 3, sort_order: editing?.sort_order ?? 0,
  });
  const [saving, setSaving] = useState(false);
  async function save() {
    setSaving(true);
    const { error } = editing
      ? await supabase.from("skills").update(f).eq("id", editing.id)
      : await supabase.from("skills").insert(f);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["skills"] });
    onClose();
  }
  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <TextField label="Name" value={f.name} onChange={(v) => setF({ ...f, name: v })} />
        <div>
          <label className="text-xs text-muted-foreground">Category</label>
          <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className="mt-1 w-full glass rounded-xl px-3 py-2.5 text-sm bg-transparent">
            {CATS.map((c) => <option key={c} value={c} className="bg-background">{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Level (1-5)</label>
          <input type="number" min={1} max={5} value={f.level} onChange={(e) => setF({ ...f, level: Number(e.target.value) })} className="mt-1 w-full glass rounded-xl px-3 py-2.5 text-sm" />
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