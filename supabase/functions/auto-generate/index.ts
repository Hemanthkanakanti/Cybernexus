import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// === 200+ CITIES ACROSS ALL CONTINENTS (except Antarctica) ===
const cities = [
  // North America
  { name: "New York", country: "USA", lat: 40.71, lng: -74.01 },
  { name: "Los Angeles", country: "USA", lat: 34.05, lng: -118.24 },
  { name: "Chicago", country: "USA", lat: 41.88, lng: -87.63 },
  { name: "Houston", country: "USA", lat: 29.76, lng: -95.37 },
  { name: "Phoenix", country: "USA", lat: 33.45, lng: -112.07 },
  { name: "San Francisco", country: "USA", lat: 37.77, lng: -122.42 },
  { name: "Seattle", country: "USA", lat: 47.61, lng: -122.33 },
  { name: "Denver", country: "USA", lat: 39.74, lng: -104.99 },
  { name: "Washington DC", country: "USA", lat: 38.91, lng: -77.04 },
  { name: "Boston", country: "USA", lat: 42.36, lng: -71.06 },
  { name: "Atlanta", country: "USA", lat: 33.75, lng: -84.39 },
  { name: "Miami", country: "USA", lat: 25.76, lng: -80.19 },
  { name: "Dallas", country: "USA", lat: 32.78, lng: -96.80 },
  { name: "Detroit", country: "USA", lat: 42.33, lng: -83.05 },
  { name: "Minneapolis", country: "USA", lat: 44.98, lng: -93.27 },
  { name: "Toronto", country: "Canada", lat: 43.65, lng: -79.38 },
  { name: "Vancouver", country: "Canada", lat: 49.28, lng: -123.12 },
  { name: "Montreal", country: "Canada", lat: 45.50, lng: -73.57 },
  { name: "Calgary", country: "Canada", lat: 51.05, lng: -114.07 },
  { name: "Mexico City", country: "Mexico", lat: 19.43, lng: -99.13 },
  { name: "Guadalajara", country: "Mexico", lat: 20.67, lng: -103.35 },
  { name: "Monterrey", country: "Mexico", lat: 25.67, lng: -100.31 },
  { name: "Panama City", country: "Panama", lat: 8.98, lng: -79.52 },
  { name: "San José", country: "Costa Rica", lat: 9.93, lng: -84.08 },
  { name: "Havana", country: "Cuba", lat: 23.11, lng: -82.37 },
  // South America
  { name: "São Paulo", country: "Brazil", lat: -23.55, lng: -46.63 },
  { name: "Rio de Janeiro", country: "Brazil", lat: -22.91, lng: -43.17 },
  { name: "Brasília", country: "Brazil", lat: -15.79, lng: -47.88 },
  { name: "Salvador", country: "Brazil", lat: -12.97, lng: -38.51 },
  { name: "Fortaleza", country: "Brazil", lat: -3.72, lng: -38.53 },
  { name: "Buenos Aires", country: "Argentina", lat: -34.60, lng: -58.38 },
  { name: "Córdoba", country: "Argentina", lat: -31.42, lng: -64.18 },
  { name: "Bogotá", country: "Colombia", lat: 4.71, lng: -74.07 },
  { name: "Medellín", country: "Colombia", lat: 6.25, lng: -75.56 },
  { name: "Lima", country: "Peru", lat: -12.05, lng: -77.04 },
  { name: "Santiago", country: "Chile", lat: -33.45, lng: -70.67 },
  { name: "Caracas", country: "Venezuela", lat: 10.49, lng: -66.88 },
  { name: "Quito", country: "Ecuador", lat: -0.18, lng: -78.47 },
  { name: "Montevideo", country: "Uruguay", lat: -34.90, lng: -56.19 },
  { name: "La Paz", country: "Bolivia", lat: -16.50, lng: -68.15 },
  // Europe
  { name: "London", country: "UK", lat: 51.51, lng: -0.13 },
  { name: "Manchester", country: "UK", lat: 53.48, lng: -2.24 },
  { name: "Birmingham", country: "UK", lat: 52.49, lng: -1.89 },
  { name: "Edinburgh", country: "UK", lat: 55.95, lng: -3.19 },
  { name: "Berlin", country: "Germany", lat: 52.52, lng: 13.40 },
  { name: "Munich", country: "Germany", lat: 48.14, lng: 11.58 },
  { name: "Hamburg", country: "Germany", lat: 53.55, lng: 9.99 },
  { name: "Frankfurt", country: "Germany", lat: 50.11, lng: 8.68 },
  { name: "Paris", country: "France", lat: 48.86, lng: 2.35 },
  { name: "Lyon", country: "France", lat: 45.76, lng: 4.84 },
  { name: "Marseille", country: "France", lat: 43.30, lng: 5.37 },
  { name: "Amsterdam", country: "Netherlands", lat: 52.37, lng: 4.90 },
  { name: "Rotterdam", country: "Netherlands", lat: 51.92, lng: 4.48 },
  { name: "Madrid", country: "Spain", lat: 40.42, lng: -3.70 },
  { name: "Barcelona", country: "Spain", lat: 41.39, lng: 2.17 },
  { name: "Rome", country: "Italy", lat: 41.90, lng: 12.50 },
  { name: "Milan", country: "Italy", lat: 45.46, lng: 9.19 },
  { name: "Naples", country: "Italy", lat: 40.85, lng: 14.27 },
  { name: "Stockholm", country: "Sweden", lat: 59.33, lng: 18.07 },
  { name: "Helsinki", country: "Finland", lat: 60.17, lng: 24.94 },
  { name: "Oslo", country: "Norway", lat: 59.91, lng: 10.75 },
  { name: "Copenhagen", country: "Denmark", lat: 55.68, lng: 12.57 },
  { name: "Dublin", country: "Ireland", lat: 53.35, lng: -6.26 },
  { name: "Lisbon", country: "Portugal", lat: 38.72, lng: -9.14 },
  { name: "Vienna", country: "Austria", lat: 48.21, lng: 16.37 },
  { name: "Zurich", country: "Switzerland", lat: 47.38, lng: 8.54 },
  { name: "Brussels", country: "Belgium", lat: 50.85, lng: 4.35 },
  { name: "Prague", country: "Czech Republic", lat: 50.08, lng: 14.44 },
  { name: "Warsaw", country: "Poland", lat: 52.23, lng: 21.01 },
  { name: "Kraków", country: "Poland", lat: 50.06, lng: 19.94 },
  { name: "Budapest", country: "Hungary", lat: 47.50, lng: 19.04 },
  { name: "Bucharest", country: "Romania", lat: 44.43, lng: 26.10 },
  { name: "Sofia", country: "Bulgaria", lat: 42.70, lng: 23.32 },
  { name: "Athens", country: "Greece", lat: 37.98, lng: 23.73 },
  { name: "Belgrade", country: "Serbia", lat: 44.79, lng: 20.47 },
  { name: "Zagreb", country: "Croatia", lat: 45.81, lng: 15.98 },
  { name: "Tallinn", country: "Estonia", lat: 59.44, lng: 24.75 },
  // Russia & CIS
  { name: "Moscow", country: "Russia", lat: 55.75, lng: 37.62 },
  { name: "St. Petersburg", country: "Russia", lat: 59.93, lng: 30.32 },
  { name: "Novosibirsk", country: "Russia", lat: 55.01, lng: 82.93 },
  { name: "Yekaterinburg", country: "Russia", lat: 56.84, lng: 60.60 },
  { name: "Kazan", country: "Russia", lat: 55.80, lng: 49.11 },
  { name: "Vladivostok", country: "Russia", lat: 43.12, lng: 131.89 },
  { name: "Kyiv", country: "Ukraine", lat: 50.45, lng: 30.52 },
  { name: "Kharkiv", country: "Ukraine", lat: 49.99, lng: 36.23 },
  { name: "Minsk", country: "Belarus", lat: 53.90, lng: 27.57 },
  { name: "Almaty", country: "Kazakhstan", lat: 43.24, lng: 76.95 },
  { name: "Tashkent", country: "Uzbekistan", lat: 41.30, lng: 69.28 },
  // East Asia
  { name: "Beijing", country: "China", lat: 39.90, lng: 116.40 },
  { name: "Shanghai", country: "China", lat: 31.23, lng: 121.47 },
  { name: "Shenzhen", country: "China", lat: 22.54, lng: 114.06 },
  { name: "Guangzhou", country: "China", lat: 23.13, lng: 113.26 },
  { name: "Chengdu", country: "China", lat: 30.57, lng: 104.07 },
  { name: "Hangzhou", country: "China", lat: 30.27, lng: 120.15 },
  { name: "Wuhan", country: "China", lat: 30.59, lng: 114.31 },
  { name: "Nanjing", country: "China", lat: 32.06, lng: 118.80 },
  { name: "Tokyo", country: "Japan", lat: 35.68, lng: 139.69 },
  { name: "Osaka", country: "Japan", lat: 34.69, lng: 135.50 },
  { name: "Nagoya", country: "Japan", lat: 35.18, lng: 136.91 },
  { name: "Seoul", country: "South Korea", lat: 37.57, lng: 126.98 },
  { name: "Busan", country: "South Korea", lat: 35.18, lng: 129.08 },
  { name: "Pyongyang", country: "N. Korea", lat: 39.02, lng: 125.75 },
  { name: "Taipei", country: "Taiwan", lat: 25.03, lng: 121.57 },
  { name: "Hong Kong", country: "Hong Kong", lat: 22.32, lng: 114.17 },
  // South Asia
  { name: "Mumbai", country: "India", lat: 19.08, lng: 72.88 },
  { name: "Delhi", country: "India", lat: 28.61, lng: 77.21 },
  { name: "Bangalore", country: "India", lat: 12.97, lng: 77.59 },
  { name: "Hyderabad", country: "India", lat: 17.39, lng: 78.49 },
  { name: "Chennai", country: "India", lat: 13.08, lng: 80.27 },
  { name: "Kolkata", country: "India", lat: 22.57, lng: 88.36 },
  { name: "Pune", country: "India", lat: 18.52, lng: 73.86 },
  { name: "Ahmedabad", country: "India", lat: 23.02, lng: 72.57 },
  { name: "Karachi", country: "Pakistan", lat: 24.86, lng: 67.01 },
  { name: "Lahore", country: "Pakistan", lat: 31.55, lng: 74.35 },
  { name: "Dhaka", country: "Bangladesh", lat: 23.81, lng: 90.41 },
  { name: "Colombo", country: "Sri Lanka", lat: 6.93, lng: 79.85 },
  // Southeast Asia
  { name: "Singapore", country: "Singapore", lat: 1.35, lng: 103.82 },
  { name: "Bangkok", country: "Thailand", lat: 13.76, lng: 100.50 },
  { name: "Jakarta", country: "Indonesia", lat: -6.21, lng: 106.85 },
  { name: "Surabaya", country: "Indonesia", lat: -7.25, lng: 112.75 },
  { name: "Manila", country: "Philippines", lat: 14.60, lng: 120.98 },
  { name: "Kuala Lumpur", country: "Malaysia", lat: 3.14, lng: 101.69 },
  { name: "Hanoi", country: "Vietnam", lat: 21.03, lng: 105.85 },
  { name: "Ho Chi Minh City", country: "Vietnam", lat: 10.82, lng: 106.63 },
  { name: "Phnom Penh", country: "Cambodia", lat: 11.56, lng: 104.92 },
  // Middle East
  { name: "Dubai", country: "UAE", lat: 25.20, lng: 55.27 },
  { name: "Abu Dhabi", country: "UAE", lat: 24.45, lng: 54.65 },
  { name: "Riyadh", country: "Saudi Arabia", lat: 24.71, lng: 46.68 },
  { name: "Jeddah", country: "Saudi Arabia", lat: 21.49, lng: 39.19 },
  { name: "Tehran", country: "Iran", lat: 35.69, lng: 51.39 },
  { name: "Isfahan", country: "Iran", lat: 32.65, lng: 51.68 },
  { name: "Tel Aviv", country: "Israel", lat: 32.09, lng: 34.77 },
  { name: "Istanbul", country: "Turkey", lat: 41.01, lng: 28.98 },
  { name: "Ankara", country: "Turkey", lat: 39.93, lng: 32.85 },
  { name: "Baghdad", country: "Iraq", lat: 33.31, lng: 44.37 },
  { name: "Doha", country: "Qatar", lat: 25.29, lng: 51.53 },
  { name: "Kuwait City", country: "Kuwait", lat: 29.38, lng: 47.99 },
  { name: "Beirut", country: "Lebanon", lat: 33.89, lng: 35.50 },
  // Africa
  { name: "Lagos", country: "Nigeria", lat: 6.52, lng: 3.38 },
  { name: "Abuja", country: "Nigeria", lat: 9.06, lng: 7.49 },
  { name: "Cairo", country: "Egypt", lat: 30.04, lng: 31.24 },
  { name: "Alexandria", country: "Egypt", lat: 31.20, lng: 29.92 },
  { name: "Johannesburg", country: "South Africa", lat: -26.20, lng: 28.04 },
  { name: "Cape Town", country: "South Africa", lat: -33.93, lng: 18.42 },
  { name: "Durban", country: "South Africa", lat: -29.86, lng: 31.02 },
  { name: "Nairobi", country: "Kenya", lat: -1.29, lng: 36.82 },
  { name: "Addis Ababa", country: "Ethiopia", lat: 9.02, lng: 38.75 },
  { name: "Dar es Salaam", country: "Tanzania", lat: -6.79, lng: 39.28 },
  { name: "Accra", country: "Ghana", lat: 5.56, lng: -0.19 },
  { name: "Casablanca", country: "Morocco", lat: 33.57, lng: -7.59 },
  { name: "Algiers", country: "Algeria", lat: 36.75, lng: 3.04 },
  { name: "Dakar", country: "Senegal", lat: 14.72, lng: -17.47 },
  { name: "Kinshasa", country: "DR Congo", lat: -4.32, lng: 15.31 },
  { name: "Kampala", country: "Uganda", lat: 0.31, lng: 32.58 },
  { name: "Kigali", country: "Rwanda", lat: -1.94, lng: 30.06 },
  { name: "Luanda", country: "Angola", lat: -8.84, lng: 13.23 },
  { name: "Tripoli", country: "Libya", lat: 32.90, lng: 13.18 },
  // Oceania
  { name: "Sydney", country: "Australia", lat: -33.87, lng: 151.21 },
  { name: "Melbourne", country: "Australia", lat: -37.81, lng: 144.96 },
  { name: "Brisbane", country: "Australia", lat: -27.47, lng: 153.03 },
  { name: "Perth", country: "Australia", lat: -31.95, lng: 115.86 },
  { name: "Auckland", country: "New Zealand", lat: -36.85, lng: 174.76 },
  { name: "Wellington", country: "New Zealand", lat: -41.29, lng: 174.78 },
];

const threatTypes = [
  "Ransomware", "Wiper Malware", "Banking Trojan", "RAT", "Rootkit", "Spyware", "Keylogger",
  "Botnet", "Worm", "Fileless Malware", "Polymorphic Malware", "Cryptojacking", "Infostealer",
  "DDoS", "DNS Amplification", "SYN Flood", "DNS Tunneling", "ARP Spoofing", "BGP Hijacking",
  "Man-in-the-Middle", "SSL Stripping",
  "SQL Injection", "XSS", "CSRF", "SSRF", "XXE", "Remote Code Execution", "Path Traversal",
  "Command Injection", "API Abuse", "Broken Authentication",
  "Phishing", "Spear Phishing", "Whaling", "Vishing", "BEC", "Credential Stuffing",
  "Password Spraying", "Brute Force",
  "APT", "Zero-Day Exploit", "Supply Chain Attack", "Firmware Attack", "Side-Channel Attack",
  "Watering Hole", "Drive-by Download", "Living off the Land", "Golden Ticket",
  "Cloud Misconfiguration", "Container Escape", "Privilege Escalation",
  "Insider Threat", "Data Exfiltration", "SCADA/ICS Attack", "IoT Exploitation",
];
const statuses = ["blocked", "mitigated", "active", "investigating"];
const severities = ["critical", "high", "medium", "low"];
const protocols = ["TCP", "UDP", "HTTP", "HTTPS", "DNS", "SSH", "FTP", "SMTP", "ICMP", "TLS", "QUIC", "RDP", "SMB", "LDAP", "SNMP"];
const ports = [80, 443, 22, 25, 53, 3306, 5432, 8080, 8443, 3389, 445, 1433, 27017, 6379, 9200, 1521, 5900, 161, 636, 389];
const attackVectors = ["Network", "Email", "Web Application", "Supply Chain", "Physical", "Insider", "Social Engineering", "Removable Media", "Cloud Infrastructure", "API Abuse", "Firmware", "IoT", "DNS", "Wireless"];
const mitreTactics = ["Initial Access", "Execution", "Persistence", "Privilege Escalation", "Defense Evasion", "Credential Access", "Discovery", "Lateral Movement", "Collection", "Exfiltration", "Impact", "Command and Control", "Resource Development", "Reconnaissance"];
const targets = ["Web Server", "Database", "Firewall", "DNS Server", "Mail Server", "API Gateway", "Load Balancer", "Auth Service", "CDN", "VPN Gateway", "SCADA System", "Active Directory", "S3 Bucket", "Kubernetes Cluster", "CI/CD Pipeline", "Payment Gateway", "ERP System", "SIEM", "Endpoint", "IoT Device"];
const threatNamePrefixes = ["DARKSTORM", "SHADOWFANG", "COBALT", "NIGHTHAWK", "CRIMSON", "VORTEX", "PHANTOM", "IRONCLAD", "BLACKMIST", "SILENTBYTE", "RAZORWIRE", "FROSTBITE", "TEMPEST", "HYDRA", "SPECTRE", "LAZARUS", "SANDWORM", "TURLA", "FANCY", "COZY"];

function randIP() {
  return `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { count = 5 } = await req.json().catch(() => ({}));
    const logBatch = [];
    const eventBatch = [];

    for (let i = 0; i < Math.min(count, 20); i++) {
      const city = pick(cities);
      const type = pick(threatTypes);
      const sev = pick(severities);
      const prefix = pick(threatNamePrefixes);
      const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();

      logBatch.push({
        ip: randIP(),
        country: city.country,
        threat_type: type,
        severity: sev,
        status: pick(statuses),
        source: "auto-generated",
        threat_name: `${prefix}-${suffix}`,
        target_system: pick(targets),
        description: `${type} activity detected from ${city.name}, ${city.country}. Vector: ${pick(attackVectors)}. MITRE: ${pick(mitreTactics)}.`,
        protocol: pick(protocols),
        port: pick(ports),
        attack_vector: pick(attackVectors),
        confidence_score: Math.floor(Math.random() * 60) + 40,
        mitre_tactic: pick(mitreTactics),
      });

      eventBatch.push({
        name: city.name,
        country: city.country,
        lat: city.lat,
        lng: city.lng,
        level: sev,
        attacks: Math.floor(Math.random() * 500) + 50,
        type,
        source: "auto-generated",
      });
    }

    const { error: logErr } = await supabase.from("threat_logs").insert(logBatch);
    if (logErr) throw logErr;

    const { error: eventErr } = await supabase.from("threat_events").insert(eventBatch);
    if (eventErr) throw eventErr;

    return new Response(
      JSON.stringify({ success: true, generated: count }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("auto-generate error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Generation failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
