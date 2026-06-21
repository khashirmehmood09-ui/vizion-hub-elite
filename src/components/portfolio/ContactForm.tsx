import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Send } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  subject: z.string().trim().max(200).optional().default(""),
  body: z.string().trim().min(1, "Message required").max(4000),
});

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      subject: fd.get("subject") ?? "",
      body: fd.get("body"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("messages").insert(parsed.data);
    setLoading(false);
    if (error) {
      toast.error("Couldn't send. Please try again.");
      return;
    }
    toast.success("Message sent — I'll reply soon.");
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="glass rounded-2xl p-6 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field name="name" label="Name" placeholder="Jane Doe" required />
        <Field name="email" label="Email" type="email" placeholder="jane@company.com" required />
      </div>
      <Field name="subject" label="Subject" placeholder="Project enquiry" />
      <div>
        <label className="text-xs text-muted-foreground">Message</label>
        <textarea
          name="body"
          required
          rows={5}
          maxLength={4000}
          placeholder="Tell me about your project, goals, and timeline."
          className="mt-1 w-full glass rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-cyan)]/40"
        />
      </div>
      <button
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-violet)] px-5 py-2.5 text-sm font-medium text-background disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Send message
      </button>
    </form>
  );
}

function Field({ name, label, type = "text", placeholder, required }: { name: string; label: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="mt-1 w-full glass rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-cyan)]/40"
      />
    </div>
  );
}