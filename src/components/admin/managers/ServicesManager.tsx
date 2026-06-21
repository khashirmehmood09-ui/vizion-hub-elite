import { useState } from "react";
import { useServices, type Service } from "@/lib/portfolio/queries";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react";
import { TextField } from "./ProfileManager";

const ICONS = ["chart", "database", "bot", "line", "workflow", "sparkles"];

export function ServicesManager() {
  const qc = useQueryClient();
  const { data } = useServices();
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  async function remove(id: string) {
    if (!confirm("Delete this service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["services"] }); }
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Services</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-violet)] px-4 py-2 text-sm font-medium text-background"><Plus className="h-4 w-4" /> Add</button>
      </div>
      {showForm && <ServiceForm key={editing?.id ?? "new"} editing={editing} onClose={() => setShowForm(false)} />}
      <div className="grid gap-3">
        {(data ?? []).map((s) => (
          <div key={s.id} className="glass rounded-2xl p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{s.title}</div>
              <div className="text-xs text-muted-foreground truncate">{s.description}</div>
            </div>
            <button onClick={() => { setEditing(s); setShowForm(true); }} className="rounded-lg p-2 hover:bg-white/5 text-muted-foreground"><Pencil className="h-4 w-4" /></button>
            <button onClick={() => remove(s.id)} className="rounded-lg p-2 hover:bg-white/5 text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceForm({ editing, onClose }: { editing: Service | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [f, setF] = useState({
    title: editing?.title ?? "", description: editing?.description ?? "",
    icon: editing?.icon ?? "sparkles", sort_order: editing?.sort_order ?? 0,
  });
  const [saving, setSaving] = useState(false);
  async function save() {
    setSaving(true);
    const { error } = editing
      ? await supabase.from("services").update(f).eq("id", editing.id)
      : await supabase.from("services").insert(f);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["services"] });
    onClose();
  }
  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <TextField label="Title" value={f.title} onChange={(v) => setF({ ...f, title: v })} />
        <div>
          <label className="text-xs text-muted-foreground">Icon</label>
          <select value={f.icon} onChange={(e) => setF({ ...f, icon: e.target.value })} className="mt-1 w-full glass rounded-xl px-3 py-2.5 text-sm bg-transparent">
            {ICONS.map((i) => <option key={i} value={i} className="bg-background">{i}</option>)}
          </select>
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