
-- Allow DELETE on all three tables for settings clear functionality
CREATE POLICY "Allow public delete on threat_logs" ON public.threat_logs FOR DELETE USING (true);
CREATE POLICY "Allow public delete on threat_events" ON public.threat_events FOR DELETE USING (true);
CREATE POLICY "Allow public delete on static_uploads" ON public.static_uploads FOR DELETE USING (true);

-- Allow UPDATE on threat_logs
CREATE POLICY "Allow public update on threat_logs" ON public.threat_logs FOR UPDATE USING (true) WITH CHECK (true);
