REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "logs_authenticated_insert" ON public.system_logs;
CREATE POLICY "logs_insert_self" ON public.system_logs
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);