ALTER TABLE public.threat_logs ADD COLUMN IF NOT EXISTS threat_name text DEFAULT 'Unknown';
ALTER TABLE public.threat_logs ADD COLUMN IF NOT EXISTS target_system text DEFAULT 'Unknown';