import { useMessages } from "@/lib/portfolio/queries";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, MailOpen } from "lucide-react";

export function MessagesManager() {
  const qc = useQueryClient();
  const { data } = useMessages();

  async function markRead(id: string, read: boolean) {
    const { error } = await supabase.from("messages").update({ read }).eq("id", id);
    if (error) toast.error(error.message); else qc.invalidateQueries({ queryKey: ["messages"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["messages"] }); }
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-semibold">Messages</h2>
      <div className="space-y-3">
        {(data ?? []).length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
        {(data ?? []).map((m) => (
          <div key={m.id} className={`glass rounded-2xl p-4 ${!m.read ? "ring-1 ring-[var(--color-cyan)]/40" : ""}`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-medium">{m.name} <span className="text-muted-foreground font-normal">· {m.email}</span></div>
                <div className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => markRead(m.id, !m.read)} title={m.read ? "Mark unread" : "Mark read"} className="rounded-lg p-2 hover:bg-white/5 text-muted-foreground"><MailOpen className="h-4 w-4" /></button>
                <button onClick={() => remove(m.id)} className="rounded-lg p-2 hover:bg-white/5 text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            {m.subject && <div className="mt-3 text-sm font-medium">{m.subject}</div>}
            <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{m.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}