ALTER TABLE public.threat_logs ADD COLUMN IF NOT EXISTS protocol text DEFAULT 'TCP';
ALTER TABLE public.threat_logs ADD COLUMN IF NOT EXISTS port integer DEFAULT 443;
ALTER TABLE public.threat_logs ADD COLUMN IF NOT EXISTS attack_vector text DEFAULT 'Network';
ALTER TABLE public.threat_logs ADD COLUMN IF NOT EXISTS confidence_score integer DEFAULT 50;
ALTER TABLE public.threat_logs ADD COLUMN IF NOT EXISTS mitre_tactic text DEFAULT 'Initial Access';

-- Update existing rows that have "Unknown" threat_name or target_system
UPDATE public.threat_logs SET 
  threat_name = threat_type || '-' || LEFT(id::text, 4),
  target_system = (ARRAY['Web Server','Database','Firewall','DNS Server','Mail Server','API Gateway','Load Balancer','Auth Service','CDN','VPN Gateway'])[floor(random()*10+1)],
  protocol = (ARRAY['TCP','UDP','HTTP','HTTPS','DNS','SSH','FTP','SMTP','ICMP'])[floor(random()*9+1)],
  port = (ARRAY[80,443,22,25,53,3306,5432,8080,8443,3389])[floor(random()*10+1)],
  attack_vector = (ARRAY['Network','Email','Web Application','Supply Chain','Physical','Insider','Social Engineering','Removable Media'])[floor(random()*8+1)],
  confidence_score = floor(random()*100+1)::integer,
  mitre_tactic = (ARRAY['Initial Access','Execution','Persistence','Privilege Escalation','Defense Evasion','Credential Access','Discovery','Lateral Movement','Collection','Exfiltration','Impact','Command and Control'])[floor(random()*12+1)]
WHERE threat_name IS NULL OR threat_name = 'Unknown';