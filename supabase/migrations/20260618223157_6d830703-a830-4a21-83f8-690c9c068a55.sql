
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

DROP POLICY IF EXISTS "messages_anon_insert" ON public.messages;
DROP POLICY IF EXISTS "messages_auth_insert" ON public.messages;

CREATE POLICY "messages_anon_insert" ON public.messages FOR INSERT TO anon
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 100
    AND char_length(email) BETWEEN 3 AND 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(coalesce(subject,'')) <= 200
    AND char_length(body) BETWEEN 1 AND 4000
    AND read = false
  );

CREATE POLICY "messages_auth_insert" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 100
    AND char_length(email) BETWEEN 3 AND 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(coalesce(subject,'')) <= 200
    AND char_length(body) BETWEEN 1 AND 4000
    AND read = false
  );
