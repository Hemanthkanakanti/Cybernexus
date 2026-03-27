
-- Table for storing auto-generated and uploaded threat data
CREATE TABLE public.threat_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip TEXT NOT NULL DEFAULT '0.0.0.0',
  country TEXT NOT NULL DEFAULT 'Unknown',
  threat_type TEXT NOT NULL DEFAULT 'Unknown',
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('blocked', 'mitigated', 'active', 'investigating')),
  source TEXT NOT NULL DEFAULT 'auto-generated',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table for threat map events (globe markers)
CREATE TABLE public.threat_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  level TEXT NOT NULL DEFAULT 'medium' CHECK (level IN ('critical', 'high', 'medium', 'low')),
  attacks INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL DEFAULT 'Unknown',
  source TEXT NOT NULL DEFAULT 'auto-generated',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table for uploaded static files metadata
CREATE TABLE public.static_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  file_type TEXT NOT NULL,
  row_count INTEGER NOT NULL DEFAULT 0,
  cleaned_row_count INTEGER NOT NULL DEFAULT 0,
  null_rows_removed INTEGER NOT NULL DEFAULT 0,
  columns TEXT[] DEFAULT '{}',
  upload_status TEXT NOT NULL DEFAULT 'processing' CHECK (upload_status IN ('processing', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable realtime for threat_events and threat_logs
ALTER PUBLICATION supabase_realtime ADD TABLE public.threat_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.threat_logs;

-- RLS: allow all reads for now (public dashboard)
ALTER TABLE public.threat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.static_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on threat_logs" ON public.threat_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert on threat_logs" ON public.threat_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on threat_events" ON public.threat_events FOR SELECT USING (true);
CREATE POLICY "Allow public insert on threat_events" ON public.threat_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on threat_events" ON public.threat_events FOR UPDATE USING (true);
CREATE POLICY "Allow public read on static_uploads" ON public.static_uploads FOR SELECT USING (true);
CREATE POLICY "Allow public insert on static_uploads" ON public.static_uploads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on static_uploads" ON public.static_uploads FOR UPDATE USING (true);
