import { useState } from "react";
import { useCertifications, type Certification } from "@/lib/portfolio/queries";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadFile } from "@/lib/portfolio/storage";
import { normalizeExternalUrl } from "@/lib/utils";
import { Plus, Trash2, Pencil, Loader2, Upload } from "lucide-react";
import { TextField } from "./ProfileManager";

export function CertificationsManager() {
  const qc = useQueryClient();
  const { data } = useCertifications();
  const [editing, setEditing] = useState<Certification | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function remove(id: string) {
    if (!confirm("Delete this certification?")) return;
    const { error } = await supabase.from("certifications").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["certifications"] }); }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Certifications</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-violet)] px-4 py-2 text-sm font-medium text-background"><Plus className="h-4 w-4" /> Add</button>
      </div>
      {showForm && <CertForm key={editing?.id ?? "new"} editing={editing} onClose={() => setShowForm(false)} />}
      <div className="grid gap-3">
        {(data ?? []).map((c) => (
          <div key={c.id} className="glass rounded-2xl p-4 flex items-center gap-4">
            <div className="h-14 w-20 rounded-lg overflow-hidden bg-white/5">
              {c.image_url && <img src={c.image_url} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{c.name}</div>
              <div className="text-xs text-muted-foreground truncate">{c.organization}</div>
            </div>
            <button onClick={() => { setEditing(c); setShowForm(true); }} className="rounded-lg p-2 hover:bg-white/5 text-muted-foreground"><Pencil className="h-4 w-4" /></button>
            <button onClick={() => remove(c.id)} className="rounded-lg p-2 hover:bg-white/5 text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CertForm({ editing, onClose }: { editing: Certification | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [f, setF] = useState({
    name: editing?.name ?? "", organization: editing?.organization ?? "",
    issue_date: editing?.issue_date ?? "", image_url: editing?.image_url ?? "",
    cert_url: editing?.cert_url ?? "", sort_order: editing?.sort_order ?? 0,
  });
  const [saving, setSaving] = useState(false);

  async function uploadImage(file?: File) {
    if (!file) return;
    try { const url = await uploadFile("certifications", file); setF({ ...f, image_url: url }); toast.success("Uploaded"); }
    catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Upload failed"); }
  }

  async function save() {
    setSaving(true);
    const payload = {
      ...f,
      issue_date: f.issue_date || null,
      image_url: f.image_url || null,
      cert_url: normalizeExternalUrl(f.cert_url) || null,
    };
    const { error } = editing
      ? await supabase.from("certifications").update(payload).eq("id", editing.id)
      : await supabase.from("certifications").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["certifications"] });
    onClose();
  }

  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <TextField label="Name" value={f.name} onChange={(v) => setF({ ...f, name: v })} />
        <TextField label="Organization" value={f.organization} onChange={(v) => setF({ ...f, organization: v })} />
        <div>
          <label className="text-xs text-muted-foreground">Issue date</label>
          <input type="date" value={f.issue_date} onChange={(e) => setF({ ...f, issue_date: e.target.value })} className="mt-1 w-full glass rounded-xl px-3 py-2.5 text-sm" />
        </div>
        <TextField label="Certificate URL" value={f.cert_url} onChange={(v) => setF({ ...f, cert_url: v })} />
        <div className="sm:col-span-2">
          <label className="text-xs text-muted-foreground">Certificate image</label>
          <div className="mt-1 flex items-center gap-3">
            {f.image_url && <img src={f.image_url} alt="" className="h-12 w-20 rounded-lg object-cover" />}
            <label className="inline-flex items-center gap-2 rounded-xl glass px-3 py-2 text-sm cursor-pointer hover:bg-white/5">
              <Upload className="h-4 w-4" /> Upload
              <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e.target.files?.[0])} />
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