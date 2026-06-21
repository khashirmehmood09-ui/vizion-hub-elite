import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useIsAdmin() {
  return useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return false;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (error) return false;
      return !!data;
    },
  });
}

export const TABLE_KEYS = {
  profile: ["profile"],
  projects: ["projects"],
  skills: ["skills"],
  certifications: ["certifications"],
  dashboards: ["dashboards"],
  services: ["services"],
  experience: ["experience"],
  messages: ["messages"],
} as const;