// Centralized mock cybersecurity data — MASSIVE global threat coverage

export interface ThreatEvent {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  level: "critical" | "high" | "medium" | "low";
  attacks: number;
  type: string;
}

export interface ThreatLogEntry {
  id: string;
  timestamp: string;
  ip: string;
  country: string;
  threatType: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "blocked" | "mitigated" | "active" | "investigating";
}

// === 80+ COMPREHENSIVE THREAT TYPES ===
const allThreatTypes = [
  // Malware
  "Ransomware", "Wiper Malware", "Banking Trojan", "RAT (Remote Access Trojan)", "Rootkit",
  "Spyware", "Adware", "Keylogger", "Botnet", "Worm", "Fileless Malware", "Polymorphic Malware",
  "Cryptojacking", "Infostealer", "Loader/Dropper", "Backdoor", "Logic Bomb", "Trojan Horse",
  "Macro Virus", "Boot Sector Virus", "Multipartite Virus", "Metamorphic Malware",
  // Network
  "DDoS", "DNS Amplification", "SYN Flood", "UDP Flood", "Slowloris", "DNS Tunneling",
  "ARP Spoofing", "BGP Hijacking", "Man-in-the-Middle", "SSL Stripping", "IP Spoofing",
  "VLAN Hopping", "Smurf Attack", "Ping of Death", "HTTP Flood", "NTP Amplification",
  // Web/App
  "SQL Injection", "XSS (Cross-Site Scripting)", "CSRF", "SSRF", "XML External Entity (XXE)",
  "Remote Code Execution", "Path Traversal", "Command Injection", "Deserialization Attack",
  "API Abuse", "Broken Authentication", "LDAP Injection", "OGNL Injection", "Template Injection",
  "HTTP Request Smuggling", "WebSocket Hijacking", "Prototype Pollution",
  // Social Engineering
  "Phishing", "Spear Phishing", "Whaling", "Vishing", "Smishing", "BEC (Business Email Compromise)",
  "Credential Stuffing", "Password Spraying", "Brute Force", "Pretexting", "Baiting",
  "Quid Pro Quo", "Tailgating", "Dumpster Diving",
  // Advanced
  "APT (Advanced Persistent Threat)", "Zero-Day Exploit", "Supply Chain Attack",
  "Firmware Attack", "Side-Channel Attack", "Watering Hole", "Drive-by Download",
  "Living off the Land (LotL)", "Golden Ticket Attack", "Kerberoasting",
  "Pass-the-Hash", "Pass-the-Ticket", "Silver Ticket Attack", "DCSync Attack",
  // Cloud/Modern
  "Cloud Misconfiguration", "Container Escape", "Privilege Escalation",
  "Insider Threat", "Data Exfiltration", "Typosquatting", "Domain Hijacking",
  "SCADA/ICS Attack", "IoT Exploitation", "Bluetooth Attack", "NFC Exploitation",
  "5G Protocol Attack", "Satellite Communication Intercept", "AI Model Poisoning",
  "Deepfake Attack", "Quantum Computing Threat", "Blockchain 51% Attack",
  "Smart Contract Exploit", "DNS Cache Poisoning", "BGP Route Leak",
  "USB Drop Attack", "Evil Twin Attack", "Rogue Access Point",
];

// === 400+ CITIES ACROSS ALL CONTINENTS (except Antarctica) ===
const allCities = [
  // --- NORTH AMERICA (USA - extensive) ---
  { name: "New York", country: "USA", lat: 40.71, lng: -74.01 },
  { name: "Los Angeles", country: "USA", lat: 34.05, lng: -118.24 },
  { name: "Chicago", country: "USA", lat: 41.88, lng: -87.63 },
  { name: "Houston", country: "USA", lat: 29.76, lng: -95.37 },
  { name: "Phoenix", country: "USA", lat: 33.45, lng: -112.07 },
  { name: "Philadelphia", country: "USA", lat: 39.95, lng: -75.17 },
  { name: "San Antonio", country: "USA", lat: 29.42, lng: -98.49 },
  { name: "San Diego", country: "USA", lat: 32.72, lng: -117.16 },
  { name: "Dallas", country: "USA", lat: 32.78, lng: -96.80 },
  { name: "San Francisco", country: "USA", lat: 37.77, lng: -122.42 },
  { name: "Seattle", country: "USA", lat: 47.61, lng: -122.33 },
  { name: "Denver", country: "USA", lat: 39.74, lng: -104.99 },
  { name: "Washington DC", country: "USA", lat: 38.91, lng: -77.04 },
  { name: "Boston", country: "USA", lat: 42.36, lng: -71.06 },
  { name: "Atlanta", country: "USA", lat: 33.75, lng: -84.39 },
  { name: "Miami", country: "USA", lat: 25.76, lng: -80.19 },
  { name: "Minneapolis", country: "USA", lat: 44.98, lng: -93.27 },
  { name: "Detroit", country: "USA", lat: 42.33, lng: -83.05 },
  { name: "Las Vegas", country: "USA", lat: 36.17, lng: -115.14 },
  { name: "Portland", country: "USA", lat: 45.52, lng: -122.68 },
  { name: "Nashville", country: "USA", lat: 36.16, lng: -86.78 },
  { name: "Charlotte", country: "USA", lat: 35.23, lng: -80.84 },
  { name: "Columbus", country: "USA", lat: 39.96, lng: -82.99 },
  { name: "Indianapolis", country: "USA", lat: 39.77, lng: -86.16 },
  { name: "Austin", country: "USA", lat: 30.27, lng: -97.74 },
  { name: "Jacksonville", country: "USA", lat: 30.33, lng: -81.66 },
  { name: "Memphis", country: "USA", lat: 35.15, lng: -90.05 },
  { name: "Baltimore", country: "USA", lat: 39.29, lng: -76.61 },
  { name: "Milwaukee", country: "USA", lat: 43.04, lng: -87.91 },
  { name: "Albuquerque", country: "USA", lat: 35.08, lng: -106.65 },
  { name: "Tucson", country: "USA", lat: 32.22, lng: -110.97 },
  { name: "Sacramento", country: "USA", lat: 38.58, lng: -121.49 },
  { name: "Kansas City", country: "USA", lat: 39.10, lng: -94.58 },
  { name: "Raleigh", country: "USA", lat: 35.78, lng: -78.64 },
  { name: "Salt Lake City", country: "USA", lat: 40.76, lng: -111.89 },
  { name: "Pittsburgh", country: "USA", lat: 40.44, lng: -80.00 },
  { name: "Cincinnati", country: "USA", lat: 39.10, lng: -84.51 },
  { name: "Honolulu", country: "USA", lat: 21.31, lng: -157.86 },
  { name: "Anchorage", country: "USA", lat: 61.22, lng: -149.90 },
  // Canada
  { name: "Toronto", country: "Canada", lat: 43.65, lng: -79.38 },
  { name: "Vancouver", country: "Canada", lat: 49.28, lng: -123.12 },
  { name: "Montreal", country: "Canada", lat: 45.50, lng: -73.57 },
  { name: "Calgary", country: "Canada", lat: 51.05, lng: -114.07 },
  { name: "Ottawa", country: "Canada", lat: 45.42, lng: -75.70 },
  { name: "Edmonton", country: "Canada", lat: 53.55, lng: -113.49 },
  { name: "Winnipeg", country: "Canada", lat: 49.90, lng: -97.14 },
  { name: "Quebec City", country: "Canada", lat: 46.81, lng: -71.21 },
  { name: "Halifax", country: "Canada", lat: 44.65, lng: -63.57 },
  // Mexico & Central America
  { name: "Mexico City", country: "Mexico", lat: 19.43, lng: -99.13 },
  { name: "Guadalajara", country: "Mexico", lat: 20.67, lng: -103.35 },
  { name: "Monterrey", country: "Mexico", lat: 25.67, lng: -100.31 },
  { name: "Puebla", country: "Mexico", lat: 19.04, lng: -98.20 },
  { name: "Tijuana", country: "Mexico", lat: 32.51, lng: -117.04 },
  { name: "León", country: "Mexico", lat: 21.12, lng: -101.68 },
  { name: "Mérida", country: "Mexico", lat: 20.97, lng: -89.62 },
  { name: "Cancún", country: "Mexico", lat: 21.16, lng: -86.85 },
  { name: "Havana", country: "Cuba", lat: 23.11, lng: -82.37 },
  { name: "Kingston", country: "Jamaica", lat: 18.00, lng: -76.79 },
  { name: "San Juan", country: "Puerto Rico", lat: 18.47, lng: -66.11 },
  { name: "Panama City", country: "Panama", lat: 8.98, lng: -79.52 },
  { name: "San José", country: "Costa Rica", lat: 9.93, lng: -84.08 },
  { name: "Guatemala City", country: "Guatemala", lat: 14.63, lng: -90.51 },
  { name: "Tegucigalpa", country: "Honduras", lat: 14.07, lng: -87.19 },
  { name: "Managua", country: "Nicaragua", lat: 12.13, lng: -86.25 },
  { name: "San Salvador", country: "El Salvador", lat: 13.69, lng: -89.19 },
  { name: "Santo Domingo", country: "Dominican Republic", lat: 18.49, lng: -69.90 },
  { name: "Port-au-Prince", country: "Haiti", lat: 18.54, lng: -72.34 },
  { name: "Nassau", country: "Bahamas", lat: 25.05, lng: -77.34 },
  { name: "Bridgetown", country: "Barbados", lat: 13.10, lng: -59.61 },
  { name: "Port of Spain", country: "Trinidad", lat: 10.65, lng: -61.50 },

  // --- SOUTH AMERICA ---
  { name: "São Paulo", country: "Brazil", lat: -23.55, lng: -46.63 },
  { name: "Rio de Janeiro", country: "Brazil", lat: -22.91, lng: -43.17 },
  { name: "Brasília", country: "Brazil", lat: -15.79, lng: -47.88 },
  { name: "Salvador", country: "Brazil", lat: -12.97, lng: -38.51 },
  { name: "Fortaleza", country: "Brazil", lat: -3.72, lng: -38.53 },
  { name: "Belo Horizonte", country: "Brazil", lat: -19.92, lng: -43.94 },
  { name: "Recife", country: "Brazil", lat: -8.05, lng: -34.87 },
  { name: "Manaus", country: "Brazil", lat: -3.12, lng: -60.02 },
  { name: "Curitiba", country: "Brazil", lat: -25.43, lng: -49.27 },
  { name: "Porto Alegre", country: "Brazil", lat: -30.03, lng: -51.23 },
  { name: "Buenos Aires", country: "Argentina", lat: -34.60, lng: -58.38 },
  { name: "Córdoba", country: "Argentina", lat: -31.42, lng: -64.18 },
  { name: "Rosario", country: "Argentina", lat: -32.95, lng: -60.65 },
  { name: "Mendoza", country: "Argentina", lat: -32.89, lng: -68.84 },
  { name: "Bogotá", country: "Colombia", lat: 4.71, lng: -74.07 },
  { name: "Medellín", country: "Colombia", lat: 6.25, lng: -75.56 },
  { name: "Cali", country: "Colombia", lat: 3.45, lng: -76.53 },
  { name: "Barranquilla", country: "Colombia", lat: 10.96, lng: -74.78 },
  { name: "Lima", country: "Peru", lat: -12.05, lng: -77.04 },
  { name: "Arequipa", country: "Peru", lat: -16.41, lng: -71.54 },
  { name: "Cusco", country: "Peru", lat: -13.53, lng: -71.97 },
  { name: "Santiago", country: "Chile", lat: -33.45, lng: -70.67 },
  { name: "Valparaíso", country: "Chile", lat: -33.05, lng: -71.62 },
  { name: "Concepción", country: "Chile", lat: -36.83, lng: -73.05 },
  { name: "Caracas", country: "Venezuela", lat: 10.49, lng: -66.88 },
  { name: "Maracaibo", country: "Venezuela", lat: 10.63, lng: -71.63 },
  { name: "Quito", country: "Ecuador", lat: -0.18, lng: -78.47 },
  { name: "Guayaquil", country: "Ecuador", lat: -2.17, lng: -79.92 },
  { name: "Montevideo", country: "Uruguay", lat: -34.90, lng: -56.19 },
  { name: "Asunción", country: "Paraguay", lat: -25.26, lng: -57.58 },
  { name: "La Paz", country: "Bolivia", lat: -16.50, lng: -68.15 },
  { name: "Santa Cruz", country: "Bolivia", lat: -17.78, lng: -63.18 },
  { name: "Georgetown", country: "Guyana", lat: 6.80, lng: -58.16 },
  { name: "Paramaribo", country: "Suriname", lat: 5.85, lng: -55.20 },

  // --- EUROPE ---
  { name: "London", country: "UK", lat: 51.51, lng: -0.13 },
  { name: "Manchester", country: "UK", lat: 53.48, lng: -2.24 },
  { name: "Birmingham", country: "UK", lat: 52.49, lng: -1.89 },
  { name: "Edinburgh", country: "UK", lat: 55.95, lng: -3.19 },
  { name: "Glasgow", country: "UK", lat: 55.86, lng: -4.25 },
  { name: "Liverpool", country: "UK", lat: 53.41, lng: -2.98 },
  { name: "Bristol", country: "UK", lat: 51.45, lng: -2.59 },
  { name: "Leeds", country: "UK", lat: 53.80, lng: -1.55 },
  { name: "Belfast", country: "UK", lat: 54.60, lng: -5.93 },
  { name: "Cardiff", country: "UK", lat: 51.48, lng: -3.18 },
  { name: "Berlin", country: "Germany", lat: 52.52, lng: 13.40 },
  { name: "Munich", country: "Germany", lat: 48.14, lng: 11.58 },
  { name: "Hamburg", country: "Germany", lat: 53.55, lng: 9.99 },
  { name: "Frankfurt", country: "Germany", lat: 50.11, lng: 8.68 },
  { name: "Cologne", country: "Germany", lat: 50.94, lng: 6.96 },
  { name: "Stuttgart", country: "Germany", lat: 48.78, lng: 9.18 },
  { name: "Düsseldorf", country: "Germany", lat: 51.23, lng: 6.78 },
  { name: "Leipzig", country: "Germany", lat: 51.34, lng: 12.37 },
  { name: "Dresden", country: "Germany", lat: 51.05, lng: 13.74 },
  { name: "Paris", country: "France", lat: 48.86, lng: 2.35 },
  { name: "Lyon", country: "France", lat: 45.76, lng: 4.84 },
  { name: "Marseille", country: "France", lat: 43.30, lng: 5.37 },
  { name: "Toulouse", country: "France", lat: 43.60, lng: 1.44 },
  { name: "Nice", country: "France", lat: 43.71, lng: 7.26 },
  { name: "Bordeaux", country: "France", lat: 44.84, lng: -0.58 },
  { name: "Strasbourg", country: "France", lat: 48.57, lng: 7.75 },
  { name: "Amsterdam", country: "Netherlands", lat: 52.37, lng: 4.90 },
  { name: "Rotterdam", country: "Netherlands", lat: 51.92, lng: 4.48 },
  { name: "The Hague", country: "Netherlands", lat: 52.08, lng: 4.30 },
  { name: "Utrecht", country: "Netherlands", lat: 52.09, lng: 5.12 },
  { name: "Madrid", country: "Spain", lat: 40.42, lng: -3.70 },
  { name: "Barcelona", country: "Spain", lat: 41.39, lng: 2.17 },
  { name: "Valencia", country: "Spain", lat: 39.47, lng: -0.38 },
  { name: "Seville", country: "Spain", lat: 37.39, lng: -5.98 },
  { name: "Bilbao", country: "Spain", lat: 43.26, lng: -2.93 },
  { name: "Málaga", country: "Spain", lat: 36.72, lng: -4.42 },
  { name: "Rome", country: "Italy", lat: 41.90, lng: 12.50 },
  { name: "Milan", country: "Italy", lat: 45.46, lng: 9.19 },
  { name: "Naples", country: "Italy", lat: 40.85, lng: 14.27 },
  { name: "Turin", country: "Italy", lat: 45.07, lng: 7.69 },
  { name: "Florence", country: "Italy", lat: 43.77, lng: 11.25 },
  { name: "Bologna", country: "Italy", lat: 44.49, lng: 11.34 },
  { name: "Venice", country: "Italy", lat: 45.44, lng: 12.32 },
  { name: "Palermo", country: "Italy", lat: 38.12, lng: 13.36 },
  { name: "Stockholm", country: "Sweden", lat: 59.33, lng: 18.07 },
  { name: "Gothenburg", country: "Sweden", lat: 57.71, lng: 11.97 },
  { name: "Malmö", country: "Sweden", lat: 55.60, lng: 13.00 },
  { name: "Helsinki", country: "Finland", lat: 60.17, lng: 24.94 },
  { name: "Tampere", country: "Finland", lat: 61.50, lng: 23.79 },
  { name: "Oslo", country: "Norway", lat: 59.91, lng: 10.75 },
  { name: "Bergen", country: "Norway", lat: 60.39, lng: 5.32 },
  { name: "Copenhagen", country: "Denmark", lat: 55.68, lng: 12.57 },
  { name: "Aarhus", country: "Denmark", lat: 56.15, lng: 10.21 },
  { name: "Dublin", country: "Ireland", lat: 53.35, lng: -6.26 },
  { name: "Cork", country: "Ireland", lat: 51.90, lng: -8.47 },
  { name: "Lisbon", country: "Portugal", lat: 38.72, lng: -9.14 },
  { name: "Porto", country: "Portugal", lat: 41.15, lng: -8.61 },
  { name: "Vienna", country: "Austria", lat: 48.21, lng: 16.37 },
  { name: "Graz", country: "Austria", lat: 47.07, lng: 15.44 },
  { name: "Zurich", country: "Switzerland", lat: 47.38, lng: 8.54 },
  { name: "Geneva", country: "Switzerland", lat: 46.20, lng: 6.14 },
  { name: "Bern", country: "Switzerland", lat: 46.95, lng: 7.45 },
  { name: "Brussels", country: "Belgium", lat: 50.85, lng: 4.35 },
  { name: "Antwerp", country: "Belgium", lat: 51.22, lng: 4.40 },
  { name: "Prague", country: "Czech Republic", lat: 50.08, lng: 14.44 },
  { name: "Brno", country: "Czech Republic", lat: 49.20, lng: 16.61 },
  { name: "Warsaw", country: "Poland", lat: 52.23, lng: 21.01 },
  { name: "Kraków", country: "Poland", lat: 50.06, lng: 19.94 },
  { name: "Wrocław", country: "Poland", lat: 51.11, lng: 17.04 },
  { name: "Gdańsk", country: "Poland", lat: 54.35, lng: 18.65 },
  { name: "Poznań", country: "Poland", lat: 52.41, lng: 16.93 },
  { name: "Budapest", country: "Hungary", lat: 47.50, lng: 19.04 },
  { name: "Debrecen", country: "Hungary", lat: 47.53, lng: 21.63 },
  { name: "Bucharest", country: "Romania", lat: 44.43, lng: 26.10 },
  { name: "Cluj-Napoca", country: "Romania", lat: 46.77, lng: 23.60 },
  { name: "Timișoara", country: "Romania", lat: 45.76, lng: 21.23 },
  { name: "Sofia", country: "Bulgaria", lat: 42.70, lng: 23.32 },
  { name: "Plovdiv", country: "Bulgaria", lat: 42.15, lng: 24.75 },
  { name: "Athens", country: "Greece", lat: 37.98, lng: 23.73 },
  { name: "Thessaloniki", country: "Greece", lat: 40.64, lng: 22.94 },
  { name: "Belgrade", country: "Serbia", lat: 44.79, lng: 20.47 },
  { name: "Novi Sad", country: "Serbia", lat: 45.25, lng: 19.85 },
  { name: "Zagreb", country: "Croatia", lat: 45.81, lng: 15.98 },
  { name: "Split", country: "Croatia", lat: 43.51, lng: 16.44 },
  { name: "Tallinn", country: "Estonia", lat: 59.44, lng: 24.75 },
  { name: "Riga", country: "Latvia", lat: 56.95, lng: 24.11 },
  { name: "Vilnius", country: "Lithuania", lat: 54.69, lng: 25.28 },
  { name: "Bratislava", country: "Slovakia", lat: 48.15, lng: 17.11 },
  { name: "Ljubljana", country: "Slovenia", lat: 46.06, lng: 14.51 },
  { name: "Reykjavik", country: "Iceland", lat: 64.15, lng: -21.94 },
  { name: "Tirana", country: "Albania", lat: 41.33, lng: 19.82 },
  { name: "Sarajevo", country: "Bosnia", lat: 43.86, lng: 18.41 },
  { name: "Skopje", country: "North Macedonia", lat: 42.00, lng: 21.43 },
  { name: "Podgorica", country: "Montenegro", lat: 42.44, lng: 19.26 },
  { name: "Pristina", country: "Kosovo", lat: 42.66, lng: 21.17 },
  { name: "Chișinău", country: "Moldova", lat: 47.01, lng: 28.86 },
  { name: "Valletta", country: "Malta", lat: 35.90, lng: 14.51 },
  { name: "Nicosia", country: "Cyprus", lat: 35.17, lng: 33.36 },
  { name: "Luxembourg City", country: "Luxembourg", lat: 49.61, lng: 6.13 },
  { name: "Monaco", country: "Monaco", lat: 43.73, lng: 7.42 },

  // --- RUSSIA & CIS ---
  { name: "Moscow", country: "Russia", lat: 55.75, lng: 37.62 },
  { name: "St. Petersburg", country: "Russia", lat: 59.93, lng: 30.32 },
  { name: "Novosibirsk", country: "Russia", lat: 55.01, lng: 82.93 },
  { name: "Yekaterinburg", country: "Russia", lat: 56.84, lng: 60.60 },
  { name: "Kazan", country: "Russia", lat: 55.80, lng: 49.11 },
  { name: "Vladivostok", country: "Russia", lat: 43.12, lng: 131.89 },
  { name: "Rostov-on-Don", country: "Russia", lat: 47.24, lng: 39.71 },
  { name: "Chelyabinsk", country: "Russia", lat: 55.16, lng: 61.40 },
  { name: "Omsk", country: "Russia", lat: 54.99, lng: 73.37 },
  { name: "Samara", country: "Russia", lat: 53.19, lng: 50.10 },
  { name: "Krasnoyarsk", country: "Russia", lat: 56.01, lng: 92.87 },
  { name: "Irkutsk", country: "Russia", lat: 52.29, lng: 104.28 },
  { name: "Khabarovsk", country: "Russia", lat: 48.48, lng: 135.08 },
  { name: "Kyiv", country: "Ukraine", lat: 50.45, lng: 30.52 },
  { name: "Kharkiv", country: "Ukraine", lat: 49.99, lng: 36.23 },
  { name: "Odesa", country: "Ukraine", lat: 46.48, lng: 30.74 },
  { name: "Dnipro", country: "Ukraine", lat: 48.46, lng: 35.04 },
  { name: "Lviv", country: "Ukraine", lat: 49.84, lng: 24.03 },
  { name: "Minsk", country: "Belarus", lat: 53.90, lng: 27.57 },
  { name: "Gomel", country: "Belarus", lat: 52.42, lng: 30.98 },
  { name: "Tbilisi", country: "Georgia", lat: 41.72, lng: 44.79 },
  { name: "Baku", country: "Azerbaijan", lat: 40.41, lng: 49.87 },
  { name: "Yerevan", country: "Armenia", lat: 40.18, lng: 44.51 },
  { name: "Almaty", country: "Kazakhstan", lat: 43.24, lng: 76.95 },
  { name: "Nur-Sultan", country: "Kazakhstan", lat: 51.17, lng: 71.43 },
  { name: "Tashkent", country: "Uzbekistan", lat: 41.30, lng: 69.28 },
  { name: "Bishkek", country: "Kyrgyzstan", lat: 42.87, lng: 74.59 },
  { name: "Dushanbe", country: "Tajikistan", lat: 38.56, lng: 68.77 },
  { name: "Ashgabat", country: "Turkmenistan", lat: 37.96, lng: 58.38 },

  // --- EAST ASIA ---
  { name: "Beijing", country: "China", lat: 39.90, lng: 116.40 },
  { name: "Shanghai", country: "China", lat: 31.23, lng: 121.47 },
  { name: "Shenzhen", country: "China", lat: 22.54, lng: 114.06 },
  { name: "Guangzhou", country: "China", lat: 23.13, lng: 113.26 },
  { name: "Chengdu", country: "China", lat: 30.57, lng: 104.07 },
  { name: "Hangzhou", country: "China", lat: 30.27, lng: 120.15 },
  { name: "Wuhan", country: "China", lat: 30.59, lng: 114.31 },
  { name: "Nanjing", country: "China", lat: 32.06, lng: 118.80 },
  { name: "Xi'an", country: "China", lat: 34.26, lng: 108.94 },
  { name: "Chongqing", country: "China", lat: 29.56, lng: 106.55 },
  { name: "Tianjin", country: "China", lat: 39.13, lng: 117.20 },
  { name: "Dalian", country: "China", lat: 38.91, lng: 121.60 },
  { name: "Qingdao", country: "China", lat: 36.07, lng: 120.38 },
  { name: "Harbin", country: "China", lat: 45.75, lng: 126.65 },
  { name: "Kunming", country: "China", lat: 25.04, lng: 102.68 },
  { name: "Xiamen", country: "China", lat: 24.48, lng: 118.09 },
  { name: "Changsha", country: "China", lat: 28.23, lng: 112.94 },
  { name: "Zhengzhou", country: "China", lat: 34.75, lng: 113.65 },
  { name: "Tokyo", country: "Japan", lat: 35.68, lng: 139.69 },
  { name: "Osaka", country: "Japan", lat: 34.69, lng: 135.50 },
  { name: "Yokohama", country: "Japan", lat: 35.44, lng: 139.64 },
  { name: "Nagoya", country: "Japan", lat: 35.18, lng: 136.91 },
  { name: "Fukuoka", country: "Japan", lat: 33.59, lng: 130.40 },
  { name: "Sapporo", country: "Japan", lat: 43.06, lng: 141.35 },
  { name: "Kyoto", country: "Japan", lat: 35.01, lng: 135.77 },
  { name: "Seoul", country: "South Korea", lat: 37.57, lng: 126.98 },
  { name: "Busan", country: "South Korea", lat: 35.18, lng: 129.08 },
  { name: "Incheon", country: "South Korea", lat: 37.46, lng: 126.71 },
  { name: "Daegu", country: "South Korea", lat: 35.87, lng: 128.60 },
  { name: "Pyongyang", country: "N. Korea", lat: 39.02, lng: 125.75 },
  { name: "Taipei", country: "Taiwan", lat: 25.03, lng: 121.57 },
  { name: "Kaohsiung", country: "Taiwan", lat: 22.62, lng: 120.31 },
  { name: "Taichung", country: "Taiwan", lat: 24.15, lng: 120.67 },
  { name: "Hong Kong", country: "Hong Kong", lat: 22.32, lng: 114.17 },
  { name: "Macau", country: "Macau", lat: 22.20, lng: 113.55 },
  { name: "Ulaanbaatar", country: "Mongolia", lat: 47.92, lng: 106.91 },

  // --- SOUTH ASIA ---
  { name: "Mumbai", country: "India", lat: 19.08, lng: 72.88 },
  { name: "Delhi", country: "India", lat: 28.61, lng: 77.21 },
  { name: "Bangalore", country: "India", lat: 12.97, lng: 77.59 },
  { name: "Hyderabad", country: "India", lat: 17.39, lng: 78.49 },
  { name: "Chennai", country: "India", lat: 13.08, lng: 80.27 },
  { name: "Kolkata", country: "India", lat: 22.57, lng: 88.36 },
  { name: "Pune", country: "India", lat: 18.52, lng: 73.86 },
  { name: "Ahmedabad", country: "India", lat: 23.02, lng: 72.57 },
  { name: "Jaipur", country: "India", lat: 26.91, lng: 75.79 },
  { name: "Lucknow", country: "India", lat: 26.85, lng: 80.95 },
  { name: "Kochi", country: "India", lat: 9.93, lng: 76.27 },
  { name: "Chandigarh", country: "India", lat: 30.73, lng: 76.78 },
  { name: "Indore", country: "India", lat: 22.72, lng: 75.86 },
  { name: "Bhopal", country: "India", lat: 23.26, lng: 77.41 },
  { name: "Visakhapatnam", country: "India", lat: 17.69, lng: 83.22 },
  { name: "Coimbatore", country: "India", lat: 11.00, lng: 76.96 },
  { name: "Nagpur", country: "India", lat: 21.15, lng: 79.09 },
  { name: "Surat", country: "India", lat: 21.17, lng: 72.83 },
  { name: "Karachi", country: "Pakistan", lat: 24.86, lng: 67.01 },
  { name: "Lahore", country: "Pakistan", lat: 31.55, lng: 74.35 },
  { name: "Islamabad", country: "Pakistan", lat: 33.69, lng: 73.04 },
  { name: "Faisalabad", country: "Pakistan", lat: 31.42, lng: 73.08 },
  { name: "Rawalpindi", country: "Pakistan", lat: 33.60, lng: 73.05 },
  { name: "Dhaka", country: "Bangladesh", lat: 23.81, lng: 90.41 },
  { name: "Chittagong", country: "Bangladesh", lat: 22.34, lng: 91.83 },
  { name: "Colombo", country: "Sri Lanka", lat: 6.93, lng: 79.85 },
  { name: "Kathmandu", country: "Nepal", lat: 27.72, lng: 85.32 },
  { name: "Thimphu", country: "Bhutan", lat: 27.47, lng: 89.64 },
  { name: "Malé", country: "Maldives", lat: 4.18, lng: 73.51 },

  // --- SOUTHEAST ASIA ---
  { name: "Singapore", country: "Singapore", lat: 1.35, lng: 103.82 },
  { name: "Bangkok", country: "Thailand", lat: 13.76, lng: 100.50 },
  { name: "Chiang Mai", country: "Thailand", lat: 18.79, lng: 98.98 },
  { name: "Phuket", country: "Thailand", lat: 7.88, lng: 98.39 },
  { name: "Jakarta", country: "Indonesia", lat: -6.21, lng: 106.85 },
  { name: "Surabaya", country: "Indonesia", lat: -7.25, lng: 112.75 },
  { name: "Bandung", country: "Indonesia", lat: -6.91, lng: 107.61 },
  { name: "Medan", country: "Indonesia", lat: 3.59, lng: 98.67 },
  { name: "Bali", country: "Indonesia", lat: -8.34, lng: 115.09 },
  { name: "Manila", country: "Philippines", lat: 14.60, lng: 120.98 },
  { name: "Cebu", country: "Philippines", lat: 10.31, lng: 123.89 },
  { name: "Davao", country: "Philippines", lat: 7.19, lng: 125.46 },
  { name: "Kuala Lumpur", country: "Malaysia", lat: 3.14, lng: 101.69 },
  { name: "Penang", country: "Malaysia", lat: 5.41, lng: 100.33 },
  { name: "Johor Bahru", country: "Malaysia", lat: 1.49, lng: 103.74 },
  { name: "Hanoi", country: "Vietnam", lat: 21.03, lng: 105.85 },
  { name: "Ho Chi Minh City", country: "Vietnam", lat: 10.82, lng: 106.63 },
  { name: "Da Nang", country: "Vietnam", lat: 16.05, lng: 108.22 },
  { name: "Phnom Penh", country: "Cambodia", lat: 11.56, lng: 104.92 },
  { name: "Yangon", country: "Myanmar", lat: 16.87, lng: 96.20 },
  { name: "Vientiane", country: "Laos", lat: 17.97, lng: 102.63 },
  { name: "Bandar Seri Begawan", country: "Brunei", lat: 4.94, lng: 114.95 },
  { name: "Dili", country: "Timor-Leste", lat: -8.56, lng: 125.57 },

  // --- MIDDLE EAST ---
  { name: "Dubai", country: "UAE", lat: 25.20, lng: 55.27 },
  { name: "Abu Dhabi", country: "UAE", lat: 24.45, lng: 54.65 },
  { name: "Sharjah", country: "UAE", lat: 25.34, lng: 55.41 },
  { name: "Riyadh", country: "Saudi Arabia", lat: 24.71, lng: 46.68 },
  { name: "Jeddah", country: "Saudi Arabia", lat: 21.49, lng: 39.19 },
  { name: "Dammam", country: "Saudi Arabia", lat: 26.43, lng: 50.10 },
  { name: "Mecca", country: "Saudi Arabia", lat: 21.43, lng: 39.83 },
  { name: "Medina", country: "Saudi Arabia", lat: 24.47, lng: 39.61 },
  { name: "Tehran", country: "Iran", lat: 35.69, lng: 51.39 },
  { name: "Isfahan", country: "Iran", lat: 32.65, lng: 51.68 },
  { name: "Mashhad", country: "Iran", lat: 36.30, lng: 59.60 },
  { name: "Tabriz", country: "Iran", lat: 38.08, lng: 46.29 },
  { name: "Shiraz", country: "Iran", lat: 29.59, lng: 52.58 },
  { name: "Tel Aviv", country: "Israel", lat: 32.09, lng: 34.77 },
  { name: "Jerusalem", country: "Israel", lat: 31.77, lng: 35.23 },
  { name: "Haifa", country: "Israel", lat: 32.79, lng: 34.99 },
  { name: "Istanbul", country: "Turkey", lat: 41.01, lng: 28.98 },
  { name: "Ankara", country: "Turkey", lat: 39.93, lng: 32.85 },
  { name: "Izmir", country: "Turkey", lat: 38.42, lng: 27.14 },
  { name: "Antalya", country: "Turkey", lat: 36.90, lng: 30.69 },
  { name: "Bursa", country: "Turkey", lat: 40.19, lng: 29.06 },
  { name: "Baghdad", country: "Iraq", lat: 33.31, lng: 44.37 },
  { name: "Basra", country: "Iraq", lat: 30.51, lng: 47.81 },
  { name: "Erbil", country: "Iraq", lat: 36.19, lng: 44.01 },
  { name: "Doha", country: "Qatar", lat: 25.29, lng: 51.53 },
  { name: "Muscat", country: "Oman", lat: 23.59, lng: 58.54 },
  { name: "Kuwait City", country: "Kuwait", lat: 29.38, lng: 47.99 },
  { name: "Manama", country: "Bahrain", lat: 26.23, lng: 50.59 },
  { name: "Amman", country: "Jordan", lat: 31.95, lng: 35.93 },
  { name: "Beirut", country: "Lebanon", lat: 33.89, lng: 35.50 },
  { name: "Damascus", country: "Syria", lat: 33.51, lng: 36.29 },
  { name: "Aleppo", country: "Syria", lat: 36.20, lng: 37.16 },
  { name: "Sana'a", country: "Yemen", lat: 15.37, lng: 44.21 },
  { name: "Aden", country: "Yemen", lat: 12.80, lng: 45.04 },

  // --- AFRICA ---
  { name: "Lagos", country: "Nigeria", lat: 6.52, lng: 3.38 },
  { name: "Abuja", country: "Nigeria", lat: 9.06, lng: 7.49 },
  { name: "Kano", country: "Nigeria", lat: 12.00, lng: 8.52 },
  { name: "Port Harcourt", country: "Nigeria", lat: 4.78, lng: 7.01 },
  { name: "Ibadan", country: "Nigeria", lat: 7.38, lng: 3.94 },
  { name: "Cairo", country: "Egypt", lat: 30.04, lng: 31.24 },
  { name: "Alexandria", country: "Egypt", lat: 31.20, lng: 29.92 },
  { name: "Giza", country: "Egypt", lat: 30.01, lng: 31.21 },
  { name: "Luxor", country: "Egypt", lat: 25.69, lng: 32.64 },
  { name: "Johannesburg", country: "South Africa", lat: -26.20, lng: 28.04 },
  { name: "Cape Town", country: "South Africa", lat: -33.93, lng: 18.42 },
  { name: "Durban", country: "South Africa", lat: -29.86, lng: 31.02 },
  { name: "Pretoria", country: "South Africa", lat: -25.75, lng: 28.19 },
  { name: "Port Elizabeth", country: "South Africa", lat: -33.96, lng: 25.60 },
  { name: "Bloemfontein", country: "South Africa", lat: -29.12, lng: 26.21 },
  { name: "Nairobi", country: "Kenya", lat: -1.29, lng: 36.82 },
  { name: "Mombasa", country: "Kenya", lat: -4.04, lng: 39.67 },
  { name: "Kisumu", country: "Kenya", lat: -0.09, lng: 34.77 },
  { name: "Addis Ababa", country: "Ethiopia", lat: 9.02, lng: 38.75 },
  { name: "Dire Dawa", country: "Ethiopia", lat: 9.60, lng: 41.85 },
  { name: "Dar es Salaam", country: "Tanzania", lat: -6.79, lng: 39.28 },
  { name: "Dodoma", country: "Tanzania", lat: -6.17, lng: 35.74 },
  { name: "Kampala", country: "Uganda", lat: 0.31, lng: 32.58 },
  { name: "Accra", country: "Ghana", lat: 5.56, lng: -0.19 },
  { name: "Kumasi", country: "Ghana", lat: 6.69, lng: -1.62 },
  { name: "Casablanca", country: "Morocco", lat: 33.57, lng: -7.59 },
  { name: "Rabat", country: "Morocco", lat: 34.02, lng: -6.84 },
  { name: "Marrakech", country: "Morocco", lat: 31.63, lng: -8.01 },
  { name: "Fez", country: "Morocco", lat: 34.03, lng: -5.00 },
  { name: "Tangier", country: "Morocco", lat: 35.77, lng: -5.80 },
  { name: "Tunis", country: "Tunisia", lat: 36.81, lng: 10.17 },
  { name: "Sfax", country: "Tunisia", lat: 34.74, lng: 10.76 },
  { name: "Algiers", country: "Algeria", lat: 36.75, lng: 3.04 },
  { name: "Oran", country: "Algeria", lat: 35.70, lng: -0.63 },
  { name: "Constantine", country: "Algeria", lat: 36.37, lng: 6.61 },
  { name: "Dakar", country: "Senegal", lat: 14.72, lng: -17.47 },
  { name: "Kinshasa", country: "DR Congo", lat: -4.32, lng: 15.31 },
  { name: "Lubumbashi", country: "DR Congo", lat: -11.66, lng: 27.48 },
  { name: "Luanda", country: "Angola", lat: -8.84, lng: 13.23 },
  { name: "Maputo", country: "Mozambique", lat: -25.97, lng: 32.57 },
  { name: "Harare", country: "Zimbabwe", lat: -17.83, lng: 31.05 },
  { name: "Lusaka", country: "Zambia", lat: -15.39, lng: 28.32 },
  { name: "Kigali", country: "Rwanda", lat: -1.94, lng: 30.06 },
  { name: "Bujumbura", country: "Burundi", lat: -3.38, lng: 29.36 },
  { name: "Abidjan", country: "Ivory Coast", lat: 5.36, lng: -4.01 },
  { name: "Bamako", country: "Mali", lat: 12.64, lng: -8.00 },
  { name: "Ouagadougou", country: "Burkina Faso", lat: 12.37, lng: -1.52 },
  { name: "Niamey", country: "Niger", lat: 13.51, lng: 2.11 },
  { name: "N'Djamena", country: "Chad", lat: 12.13, lng: 15.05 },
  { name: "Tripoli", country: "Libya", lat: 32.90, lng: 13.18 },
  { name: "Benghazi", country: "Libya", lat: 32.12, lng: 20.09 },
  { name: "Mogadishu", country: "Somalia", lat: 2.05, lng: 45.34 },
  { name: "Khartoum", country: "Sudan", lat: 15.59, lng: 32.53 },
  { name: "Juba", country: "South Sudan", lat: 4.85, lng: 31.58 },
  { name: "Asmara", country: "Eritrea", lat: 15.34, lng: 38.93 },
  { name: "Djibouti City", country: "Djibouti", lat: 11.59, lng: 43.15 },
  { name: "Lilongwe", country: "Malawi", lat: -13.96, lng: 33.79 },
  { name: "Windhoek", country: "Namibia", lat: -22.57, lng: 17.08 },
  { name: "Gaborone", country: "Botswana", lat: -24.65, lng: 25.91 },
  { name: "Libreville", country: "Gabon", lat: 0.39, lng: 9.45 },
  { name: "Yaoundé", country: "Cameroon", lat: 3.87, lng: 11.52 },
  { name: "Douala", country: "Cameroon", lat: 4.05, lng: 9.70 },
  { name: "Conakry", country: "Guinea", lat: 9.64, lng: -13.58 },
  { name: "Freetown", country: "Sierra Leone", lat: 8.48, lng: -13.23 },
  { name: "Monrovia", country: "Liberia", lat: 6.30, lng: -10.80 },
  { name: "Lomé", country: "Togo", lat: 6.17, lng: 1.23 },
  { name: "Cotonou", country: "Benin", lat: 6.37, lng: 2.39 },
  { name: "Nouakchott", country: "Mauritania", lat: 18.09, lng: -15.98 },
  { name: "Antananarivo", country: "Madagascar", lat: -18.88, lng: 47.51 },
  { name: "Port Louis", country: "Mauritius", lat: -20.16, lng: 57.50 },

  // --- OCEANIA ---
  { name: "Sydney", country: "Australia", lat: -33.87, lng: 151.21 },
  { name: "Melbourne", country: "Australia", lat: -37.81, lng: 144.96 },
  { name: "Brisbane", country: "Australia", lat: -27.47, lng: 153.03 },
  { name: "Perth", country: "Australia", lat: -31.95, lng: 115.86 },
  { name: "Adelaide", country: "Australia", lat: -34.93, lng: 138.60 },
  { name: "Canberra", country: "Australia", lat: -35.28, lng: 149.13 },
  { name: "Darwin", country: "Australia", lat: -12.46, lng: 130.84 },
  { name: "Hobart", country: "Australia", lat: -42.88, lng: 147.33 },
  { name: "Gold Coast", country: "Australia", lat: -28.02, lng: 153.43 },
  { name: "Auckland", country: "New Zealand", lat: -36.85, lng: 174.76 },
  { name: "Wellington", country: "New Zealand", lat: -41.29, lng: 174.78 },
  { name: "Christchurch", country: "New Zealand", lat: -43.53, lng: 172.64 },
  { name: "Hamilton", country: "New Zealand", lat: -37.79, lng: 175.28 },
  { name: "Suva", country: "Fiji", lat: -18.14, lng: 178.44 },
  { name: "Port Moresby", country: "Papua New Guinea", lat: -6.31, lng: 147.15 },
  { name: "Apia", country: "Samoa", lat: -13.83, lng: -171.76 },
  { name: "Nuku'alofa", country: "Tonga", lat: -21.21, lng: -175.15 },
  { name: "Honiara", country: "Solomon Islands", lat: -9.43, lng: 160.00 },
  { name: "Port Vila", country: "Vanuatu", lat: -17.73, lng: 168.32 },
  { name: "Noumea", country: "New Caledonia", lat: -22.28, lng: 166.46 },
];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

export function generateRandomIP(): string {
  return `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

const threatNamePrefixes = ["DARKSTORM", "SHADOWFANG", "COBALT", "NIGHTHAWK", "CRIMSON", "VORTEX", "PHANTOM", "IRONCLAD", "BLACKMIST", "SILENTBYTE", "RAZORWIRE", "FROSTBITE", "TEMPEST", "HYDRA", "SPECTRE", "LAZARUS", "SANDWORM", "TURLA", "FANCY", "COZY", "CHARMING", "ENERGETIC", "EMBER", "GRANITE", "MAGNET", "VELVET", "MERCURY", "CARBON", "ONYX", "TITANIUM"];
const targets = ["Web Server", "Database", "Firewall", "DNS Server", "Mail Server", "API Gateway", "Load Balancer", "Auth Service", "CDN", "VPN Gateway", "SCADA System", "Active Directory", "S3 Bucket", "Kubernetes Cluster", "CI/CD Pipeline", "Payment Gateway", "ERP System", "SIEM", "Endpoint", "IoT Device", "RADIUS Server", "NAS Storage", "Hypervisor", "Container Registry", "WAF", "Proxy Server"];
const protocols = ["TCP", "UDP", "HTTP", "HTTPS", "DNS", "SSH", "FTP", "SMTP", "ICMP", "TLS", "QUIC", "RDP", "SMB", "LDAP", "SNMP", "SIP", "MQTT", "CoAP", "Modbus", "BACnet"];
const attackVectors = ["Network", "Email", "Web Application", "Supply Chain", "Physical", "Insider", "Social Engineering", "Removable Media", "Cloud Infrastructure", "API Abuse", "Firmware", "IoT", "DNS", "Wireless", "Bluetooth", "5G/Cellular"];
const mitreTactics = ["Initial Access", "Execution", "Persistence", "Privilege Escalation", "Defense Evasion", "Credential Access", "Discovery", "Lateral Movement", "Collection", "Exfiltration", "Impact", "Command and Control", "Resource Development", "Reconnaissance"];
const ports = [80, 443, 22, 25, 53, 3306, 5432, 8080, 8443, 3389, 445, 1433, 27017, 6379, 9200, 1521, 5900, 161, 636, 389, 502, 1883, 5672, 9092, 11211, 6443, 2049, 1723, 4443, 8888];

// Seed threats — use ALL cities for massive coverage
export const seedThreats: ThreatEvent[] = allCities.slice(0, 80).map((city, i) => ({
  id: `t${i + 1}`,
  name: city.name,
  country: city.country,
  lat: city.lat,
  lng: city.lng,
  level: (["critical", "critical", "high", "high", "high", "medium", "medium", "medium", "low", "low"] as const)[i % 10],
  attacks: Math.floor(Math.random() * 4000) + 100,
  type: allThreatTypes[i % allThreatTypes.length],
}));

export const newThreatPool = allCities.slice(80).map((city) => ({
  ...city,
  type: pick(allThreatTypes),
}));

const countries = [...new Set(allCities.map(c => c.country))];
const statuses: ThreatLogEntry["status"][] = ["blocked", "mitigated", "active", "investigating"];
const severities: ThreatLogEntry["severity"][] = ["critical", "high", "medium", "low"];

export function generateThreatLog(): ThreatLogEntry & {
  threatName: string; targetSystem: string; protocol: string;
  port: number; attackVector: string; confidenceScore: number; mitreTactic: string;
} {
  const now = new Date();
  now.setMinutes(now.getMinutes() - Math.floor(Math.random() * 60));
  const prefix = pick(threatNamePrefixes);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return {
    id: `LOG-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    timestamp: now.toISOString(),
    ip: generateRandomIP(),
    country: pick(countries),
    threatType: pick(allThreatTypes),
    severity: pick(severities),
    status: pick(statuses),
    threatName: `${prefix}-${suffix}`,
    targetSystem: pick(targets),
    protocol: pick(protocols),
    port: pick(ports),
    attackVector: pick(attackVectors),
    confidenceScore: Math.floor(Math.random() * 60) + 40,
    mitreTactic: pick(mitreTactics),
  };
}

export function generateInitialLogs(count: number) {
  return Array.from({ length: count }, generateThreatLog).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

// Dashboard metrics
export function getDashboardMetrics(threats: ThreatEvent[], logs: ThreatLogEntry[]) {
  const totalThreats = logs.length;
  const criticalAlerts = logs.filter(l => l.severity === "critical").length;
  const blockedIPs = logs.filter(l => l.status === "blocked").length;
  const activeIncidents = logs.filter(l => l.status === "active").length;
  return { totalThreats, criticalAlerts, blockedIPs, activeIncidents };
}

// Chart data generators
export function getThreatsPerSeverity(logs: ThreatLogEntry[]) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  logs.forEach(l => counts[l.severity]++);
  return [
    { name: "Critical", value: counts.critical, fill: "hsl(330 80% 55%)" },
    { name: "High", value: counts.high, fill: "hsl(0 80% 55%)" },
    { name: "Medium", value: counts.medium, fill: "hsl(35 90% 55%)" },
    { name: "Low", value: counts.low, fill: "hsl(142 70% 45%)" },
  ];
}

export function getAttacksByCountry(logs: ThreatLogEntry[]) {
  const countMap: Record<string, number> = {};
  logs.forEach(l => { countMap[l.country] = (countMap[l.country] || 0) + 1; });
  return Object.entries(countMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}

export function getAttackTypes(logs: ThreatLogEntry[]) {
  const countMap: Record<string, number> = {};
  logs.forEach(l => { countMap[l.threatType] = (countMap[l.threatType] || 0) + 1; });
  return Object.entries(countMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getTimelineData() {
  const hours = [];
  for (let i = 23; i >= 0; i--) {
    const h = new Date();
    h.setHours(h.getHours() - i);
    hours.push({
      time: h.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      threats: Math.floor(Math.random() * 50) + 10,
      blocked: Math.floor(Math.random() * 30) + 5,
    });
  }
  return hours;
}

export function calculateRiskLevel(logs: ThreatLogEntry[]): { level: "low" | "medium" | "high"; score: number } {
  const critical = logs.filter(l => l.severity === "critical").length;
  const active = logs.filter(l => l.status === "active").length;
  const score = Math.min(100, (critical * 10) + (active * 5) + logs.length);
  if (critical > 5 || score > 70) return { level: "high", score };
  if (critical > 2 || score > 40) return { level: "medium", score };
  return { level: "low", score };
}

// MITRE ATT&CK Matrix Data
export const mitreMatrix = {
  tactics: [
    {
      id: "TA0043", name: "Reconnaissance", description: "Gather information to plan future operations",
      techniques: [
        { id: "T1595", name: "Active Scanning", subtechniques: ["T1595.001 Scanning IP Blocks", "T1595.002 Vulnerability Scanning", "T1595.003 Wordlist Scanning"] },
        { id: "T1592", name: "Gather Victim Host Info", subtechniques: ["T1592.001 Hardware", "T1592.002 Software", "T1592.003 Firmware", "T1592.004 Client Config"] },
        { id: "T1589", name: "Gather Victim Identity Info", subtechniques: ["T1589.001 Credentials", "T1589.002 Email Addresses", "T1589.003 Employee Names"] },
        { id: "T1590", name: "Gather Victim Network Info", subtechniques: ["T1590.001 Domain Properties", "T1590.002 DNS", "T1590.003 Network Trust Dependencies"] },
        { id: "T1591", name: "Gather Victim Org Info", subtechniques: ["T1591.001 Determine Physical Locations", "T1591.002 Business Relationships"] },
        { id: "T1598", name: "Phishing for Information", subtechniques: ["T1598.001 Spear Phishing Service", "T1598.002 Spear Phishing Attachment", "T1598.003 Spear Phishing Link"] },
        { id: "T1597", name: "Search Closed Sources", subtechniques: ["T1597.001 Threat Intel Vendors", "T1597.002 Purchase Technical Data"] },
        { id: "T1596", name: "Search Open Technical Databases", subtechniques: ["T1596.001 DNS/Passive DNS", "T1596.002 WHOIS", "T1596.003 Digital Certificates"] },
      ],
    },
    {
      id: "TA0042", name: "Resource Development", description: "Establish resources for operations",
      techniques: [
        { id: "T1583", name: "Acquire Infrastructure", subtechniques: ["T1583.001 Domains", "T1583.002 DNS Server", "T1583.003 Virtual Private Server", "T1583.004 Server", "T1583.005 Botnet", "T1583.006 Web Services"] },
        { id: "T1586", name: "Compromise Accounts", subtechniques: ["T1586.001 Social Media", "T1586.002 Email Accounts", "T1586.003 Cloud Accounts"] },
        { id: "T1584", name: "Compromise Infrastructure", subtechniques: ["T1584.001 Domains", "T1584.002 DNS Server", "T1584.003 Virtual Private Server"] },
        { id: "T1587", name: "Develop Capabilities", subtechniques: ["T1587.001 Malware", "T1587.002 Code Signing Certificates", "T1587.003 Digital Certificates", "T1587.004 Exploits"] },
        { id: "T1585", name: "Establish Accounts", subtechniques: ["T1585.001 Social Media", "T1585.002 Email Accounts"] },
        { id: "T1588", name: "Obtain Capabilities", subtechniques: ["T1588.001 Malware", "T1588.002 Tool", "T1588.003 Code Signing Certificates", "T1588.004 Digital Certificates", "T1588.005 Exploits", "T1588.006 Vulnerabilities"] },
      ],
    },
    {
      id: "TA0001", name: "Initial Access", description: "Gain initial foothold in the network",
      techniques: [
        { id: "T1189", name: "Drive-by Compromise", subtechniques: [] },
        { id: "T1190", name: "Exploit Public-Facing App", subtechniques: [] },
        { id: "T1133", name: "External Remote Services", subtechniques: [] },
        { id: "T1200", name: "Hardware Additions", subtechniques: [] },
        { id: "T1566", name: "Phishing", subtechniques: ["T1566.001 Spear Phishing Attachment", "T1566.002 Spear Phishing Link", "T1566.003 Spear Phishing via Service"] },
        { id: "T1091", name: "Replication Through Removable Media", subtechniques: [] },
        { id: "T1195", name: "Supply Chain Compromise", subtechniques: ["T1195.001 Compromise Software Dependencies", "T1195.002 Compromise Software Supply Chain"] },
        { id: "T1199", name: "Trusted Relationship", subtechniques: [] },
        { id: "T1078", name: "Valid Accounts", subtechniques: ["T1078.001 Default Accounts", "T1078.002 Domain Accounts", "T1078.003 Local Accounts", "T1078.004 Cloud Accounts"] },
      ],
    },
    {
      id: "TA0002", name: "Execution", description: "Run malicious code",
      techniques: [
        { id: "T1059", name: "Command and Scripting Interpreter", subtechniques: ["T1059.001 PowerShell", "T1059.002 AppleScript", "T1059.003 Windows Command Shell", "T1059.004 Unix Shell", "T1059.005 Visual Basic", "T1059.006 Python", "T1059.007 JavaScript"] },
        { id: "T1203", name: "Exploitation for Client Execution", subtechniques: [] },
        { id: "T1559", name: "Inter-Process Communication", subtechniques: ["T1559.001 Component Object Model", "T1559.002 Dynamic Data Exchange"] },
        { id: "T1106", name: "Native API", subtechniques: [] },
        { id: "T1053", name: "Scheduled Task/Job", subtechniques: ["T1053.002 At", "T1053.003 Cron", "T1053.005 Scheduled Task", "T1053.006 Systemd Timers"] },
        { id: "T1129", name: "Shared Modules", subtechniques: [] },
        { id: "T1072", name: "Software Deployment Tools", subtechniques: [] },
        { id: "T1204", name: "User Execution", subtechniques: ["T1204.001 Malicious Link", "T1204.002 Malicious File", "T1204.003 Malicious Image"] },
      ],
    },
    {
      id: "TA0003", name: "Persistence", description: "Maintain foothold",
      techniques: [
        { id: "T1098", name: "Account Manipulation", subtechniques: ["T1098.001 Additional Cloud Credentials", "T1098.002 Additional Email Delegate Permissions", "T1098.003 Additional Cloud Roles"] },
        { id: "T1197", name: "BITS Jobs", subtechniques: [] },
        { id: "T1547", name: "Boot or Logon Autostart Execution", subtechniques: ["T1547.001 Registry Run Keys", "T1547.002 Authentication Package", "T1547.003 Time Providers"] },
        { id: "T1136", name: "Create Account", subtechniques: ["T1136.001 Local Account", "T1136.002 Domain Account", "T1136.003 Cloud Account"] },
        { id: "T1543", name: "Create or Modify System Process", subtechniques: ["T1543.001 Launch Agent", "T1543.002 Systemd Service", "T1543.003 Windows Service"] },
        { id: "T1546", name: "Event Triggered Execution", subtechniques: ["T1546.001 Change Default File Association", "T1546.002 Screensaver", "T1546.003 WMI Event Subscription"] },
      ],
    },
    {
      id: "TA0004", name: "Privilege Escalation", description: "Gain higher-level permissions",
      techniques: [
        { id: "T1548", name: "Abuse Elevation Control Mechanism", subtechniques: ["T1548.001 Setuid and Setgid", "T1548.002 Bypass User Account Control"] },
        { id: "T1134", name: "Access Token Manipulation", subtechniques: ["T1134.001 Token Impersonation/Theft", "T1134.002 Create Process with Token"] },
        { id: "T1068", name: "Exploitation for Privilege Escalation", subtechniques: [] },
        { id: "T1055", name: "Process Injection", subtechniques: ["T1055.001 DLL Injection", "T1055.002 PE Injection", "T1055.003 Thread Execution Hijacking", "T1055.012 Process Hollowing"] },
      ],
    },
    {
      id: "TA0005", name: "Defense Evasion", description: "Avoid detection",
      techniques: [
        { id: "T1140", name: "Deobfuscate/Decode Files", subtechniques: [] },
        { id: "T1070", name: "Indicator Removal", subtechniques: ["T1070.001 Clear Windows Event Logs", "T1070.002 Clear Linux/Mac System Logs", "T1070.003 Clear Command History", "T1070.004 File Deletion"] },
        { id: "T1036", name: "Masquerading", subtechniques: ["T1036.001 Invalid Code Signature", "T1036.003 Rename System Utilities", "T1036.005 Match Legitimate Name or Location"] },
        { id: "T1027", name: "Obfuscated Files or Information", subtechniques: ["T1027.001 Binary Padding", "T1027.002 Software Packing", "T1027.003 Steganography"] },
        { id: "T1218", name: "System Binary Proxy Execution", subtechniques: ["T1218.001 Compiled HTML File", "T1218.003 CMSTP", "T1218.005 Mshta", "T1218.010 Regsvr32", "T1218.011 Rundll32"] },
      ],
    },
    {
      id: "TA0006", name: "Credential Access", description: "Steal credentials",
      techniques: [
        { id: "T1110", name: "Brute Force", subtechniques: ["T1110.001 Password Guessing", "T1110.002 Password Cracking", "T1110.003 Password Spraying", "T1110.004 Credential Stuffing"] },
        { id: "T1555", name: "Credentials from Password Stores", subtechniques: ["T1555.001 Keychain", "T1555.003 Credentials from Web Browsers", "T1555.004 Windows Credential Manager"] },
        { id: "T1056", name: "Input Capture", subtechniques: ["T1056.001 Keylogging", "T1056.002 GUI Input Capture", "T1056.003 Web Portal Capture"] },
        { id: "T1003", name: "OS Credential Dumping", subtechniques: ["T1003.001 LSASS Memory", "T1003.002 Security Account Manager", "T1003.003 NTDS", "T1003.004 LSA Secrets", "T1003.006 DCSync"] },
        { id: "T1558", name: "Steal or Forge Kerberos Tickets", subtechniques: ["T1558.001 Golden Ticket", "T1558.002 Silver Ticket", "T1558.003 Kerberoasting", "T1558.004 AS-REP Roasting"] },
      ],
    },
    {
      id: "TA0007", name: "Discovery", description: "Explore the environment",
      techniques: [
        { id: "T1087", name: "Account Discovery", subtechniques: ["T1087.001 Local Account", "T1087.002 Domain Account", "T1087.003 Email Account", "T1087.004 Cloud Account"] },
        { id: "T1046", name: "Network Service Discovery", subtechniques: [] },
        { id: "T1135", name: "Network Share Discovery", subtechniques: [] },
        { id: "T1057", name: "Process Discovery", subtechniques: [] },
        { id: "T1018", name: "Remote System Discovery", subtechniques: [] },
        { id: "T1082", name: "System Information Discovery", subtechniques: [] },
      ],
    },
    {
      id: "TA0008", name: "Lateral Movement", description: "Move through the environment",
      techniques: [
        { id: "T1210", name: "Exploitation of Remote Services", subtechniques: [] },
        { id: "T1534", name: "Internal Spear Phishing", subtechniques: [] },
        { id: "T1570", name: "Lateral Tool Transfer", subtechniques: [] },
        { id: "T1021", name: "Remote Services", subtechniques: ["T1021.001 Remote Desktop Protocol", "T1021.002 SMB/Windows Admin Shares", "T1021.003 DCOM", "T1021.004 SSH", "T1021.006 Windows Remote Management"] },
        { id: "T1080", name: "Taint Shared Content", subtechniques: [] },
      ],
    },
    {
      id: "TA0009", name: "Collection", description: "Gather data of interest",
      techniques: [
        { id: "T1560", name: "Archive Collected Data", subtechniques: ["T1560.001 Archive via Utility", "T1560.002 Archive via Library", "T1560.003 Archive via Custom Method"] },
        { id: "T1123", name: "Audio Capture", subtechniques: [] },
        { id: "T1119", name: "Automated Collection", subtechniques: [] },
        { id: "T1005", name: "Data from Local System", subtechniques: [] },
        { id: "T1039", name: "Data from Network Shared Drive", subtechniques: [] },
        { id: "T1025", name: "Data from Removable Media", subtechniques: [] },
        { id: "T1114", name: "Email Collection", subtechniques: ["T1114.001 Local Email Collection", "T1114.002 Remote Email Collection", "T1114.003 Email Forwarding Rule"] },
        { id: "T1113", name: "Screen Capture", subtechniques: [] },
        { id: "T1125", name: "Video Capture", subtechniques: [] },
      ],
    },
    {
      id: "TA0011", name: "Command and Control", description: "Communicate with compromised systems",
      techniques: [
        { id: "T1071", name: "Application Layer Protocol", subtechniques: ["T1071.001 Web Protocols", "T1071.002 File Transfer Protocols", "T1071.003 Mail Protocols", "T1071.004 DNS"] },
        { id: "T1132", name: "Data Encoding", subtechniques: ["T1132.001 Standard Encoding", "T1132.002 Non-Standard Encoding"] },
        { id: "T1001", name: "Data Obfuscation", subtechniques: ["T1001.001 Junk Data", "T1001.002 Steganography", "T1001.003 Protocol Impersonation"] },
        { id: "T1568", name: "Dynamic Resolution", subtechniques: ["T1568.001 Fast Flux DNS", "T1568.002 Domain Generation Algorithms"] },
        { id: "T1573", name: "Encrypted Channel", subtechniques: ["T1573.001 Symmetric Cryptography", "T1573.002 Asymmetric Cryptography"] },
        { id: "T1105", name: "Ingress Tool Transfer", subtechniques: [] },
        { id: "T1572", name: "Protocol Tunneling", subtechniques: [] },
        { id: "T1090", name: "Proxy", subtechniques: ["T1090.001 Internal Proxy", "T1090.002 External Proxy", "T1090.003 Multi-hop Proxy"] },
      ],
    },
    {
      id: "TA0010", name: "Exfiltration", description: "Steal data",
      techniques: [
        { id: "T1020", name: "Automated Exfiltration", subtechniques: [] },
        { id: "T1030", name: "Data Transfer Size Limits", subtechniques: [] },
        { id: "T1048", name: "Exfiltration Over Alternative Protocol", subtechniques: ["T1048.001 Exfiltration Over Symmetric Encrypted Non-C2", "T1048.002 Exfiltration Over Asymmetric Encrypted Non-C2"] },
        { id: "T1041", name: "Exfiltration Over C2 Channel", subtechniques: [] },
        { id: "T1011", name: "Exfiltration Over Other Network Medium", subtechniques: ["T1011.001 Exfiltration Over Bluetooth"] },
        { id: "T1052", name: "Exfiltration Over Physical Medium", subtechniques: ["T1052.001 Exfiltration Over USB"] },
        { id: "T1567", name: "Exfiltration Over Web Service", subtechniques: ["T1567.001 Exfiltration to Code Repository", "T1567.002 Exfiltration to Cloud Storage"] },
        { id: "T1029", name: "Scheduled Transfer", subtechniques: [] },
      ],
    },
    {
      id: "TA0040", name: "Impact", description: "Manipulate, interrupt, or destroy systems",
      techniques: [
        { id: "T1531", name: "Account Access Removal", subtechniques: [] },
        { id: "T1485", name: "Data Destruction", subtechniques: [] },
        { id: "T1486", name: "Data Encrypted for Impact", subtechniques: [] },
        { id: "T1565", name: "Data Manipulation", subtechniques: ["T1565.001 Stored Data Manipulation", "T1565.002 Transmitted Data Manipulation", "T1565.003 Runtime Data Manipulation"] },
        { id: "T1491", name: "Defacement", subtechniques: ["T1491.001 Internal Defacement", "T1491.002 External Defacement"] },
        { id: "T1561", name: "Disk Wipe", subtechniques: ["T1561.001 Disk Content Wipe", "T1561.002 Disk Structure Wipe"] },
        { id: "T1499", name: "Endpoint Denial of Service", subtechniques: ["T1499.001 OS Exhaustion Flood", "T1499.002 Service Exhaustion Flood", "T1499.003 Application Exhaustion Flood"] },
        { id: "T1498", name: "Network Denial of Service", subtechniques: ["T1498.001 Direct Network Flood", "T1498.002 Reflection Amplification"] },
        { id: "T1496", name: "Resource Hijacking", subtechniques: [] },
        { id: "T1489", name: "Service Stop", subtechniques: [] },
        { id: "T1529", name: "System Shutdown/Reboot", subtechniques: [] },
      ],
    },
  ],
};

// Export all threat types and cities for use in other components
export { allThreatTypes, allCities };
