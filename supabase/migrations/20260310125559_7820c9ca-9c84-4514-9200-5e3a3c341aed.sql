ALTER TABLE public.threat_logs ALTER COLUMN country SET DEFAULT 'Unattributed';
ALTER TABLE public.threat_logs ALTER COLUMN threat_type SET DEFAULT 'Unclassified';
ALTER TABLE public.threat_logs ALTER COLUMN threat_name SET DEFAULT 'PENDING-ANALYSIS';
ALTER TABLE public.threat_logs ALTER COLUMN target_system SET DEFAULT 'Endpoint';