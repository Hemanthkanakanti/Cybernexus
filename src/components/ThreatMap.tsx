import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Activity, TrendingUp, Globe } from "lucide-react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface ThreatEvent {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  level: "critical" | "high" | "medium" | "low";
  attacks: number;
  type: string;
}

const levelColors: Record<string, string> = {
  critical: "bg-threat-critical",
  high: "bg-threat-high",
  medium: "bg-threat-medium",
  low: "bg-threat-low",
};

const levelTextColors: Record<string, string> = {
  critical: "text-threat-critical",
  high: "text-threat-high",
  medium: "text-threat-medium",
  low: "text-threat-low",
};

const levelMarkerColors: Record<string, string> = {
  critical: "hsl(330 80% 55%)",
  high: "hsl(0 80% 55%)",
  medium: "hsl(35 90% 55%)",
  low: "hsl(50 80% 55%)",
};

const seedThreats: ThreatEvent[] = [
  { id: "t1", name: "Moscow", country: "Russia", lat: 55.75, lng: 37.62, level: "critical", attacks: 2847, type: "State-sponsored APT" },
  { id: "t2", name: "Beijing", country: "China", lat: 39.9, lng: 116.4, level: "critical", attacks: 3102, type: "Cyber Espionage" },
  { id: "t3", name: "Pyongyang", country: "N. Korea", lat: 39.02, lng: 125.75, level: "high", attacks: 1205, type: "Ransomware" },
  { id: "t4", name: "Tehran", country: "Iran", lat: 35.69, lng: 51.39, level: "high", attacks: 987, type: "DDoS Campaigns" },
  { id: "t5", name: "Lagos", country: "Nigeria", lat: 6.52, lng: 3.38, level: "medium", attacks: 654, type: "Phishing/BEC" },
  { id: "t6", name: "São Paulo", country: "Brazil", lat: -23.55, lng: -46.63, level: "medium", attacks: 432, type: "Banking Trojans" },
  { id: "t7", name: "Mumbai", country: "India", lat: 19.08, lng: 72.88, level: "medium", attacks: 567, type: "Data Breaches" },
  { id: "t8", name: "Bucharest", country: "Romania", lat: 44.43, lng: 26.1, level: "low", attacks: 234, type: "Credential Stuffing" },
  { id: "t9", name: "Kyiv", country: "Ukraine", lat: 50.45, lng: 30.52, level: "high", attacks: 1456, type: "Wiper Malware" },
  { id: "t10", name: "Shanghai", country: "China", lat: 31.23, lng: 121.47, level: "high", attacks: 1890, type: "Supply Chain" },
];

const newThreatPool = [
  { name: "Berlin", country: "Germany", lat: 52.52, lng: 13.4, type: "Ransomware" },
  { name: "Tokyo", country: "Japan", lat: 35.68, lng: 139.69, type: "Zero-Day Exploit" },
  { name: "London", country: "UK", lat: 51.51, lng: -0.13, type: "Phishing Campaign" },
  { name: "New York", country: "USA", lat: 40.71, lng: -74.01, type: "DDoS Attack" },
  { name: "Sydney", country: "Australia", lat: -33.87, lng: 151.21, type: "Data Exfiltration" },
  { name: "Dubai", country: "UAE", lat: 25.2, lng: 55.27, type: "Crypto Scam" },
  { name: "Singapore", country: "Singapore", lat: 1.35, lng: 103.82, type: "APT Campaign" },
  { name: "Mexico City", country: "Mexico", lat: 19.43, lng: -99.13, type: "Banking Malware" },
  { name: "Johannesburg", country: "South Africa", lat: -26.2, lng: 28.04, type: "Insider Threat" },
  { name: "Warsaw", country: "Poland", lat: 52.23, lng: 21.01, type: "Supply Chain" },
];

const ThreatMap = () => {
  const [threats, setThreats] = useState<ThreatEvent[]>(seedThreats);
  const [selected, setSelected] = useState<ThreatEvent | null>(null);

  const generateNewThreat = useCallback(() => {
    const pool = newThreatPool[Math.floor(Math.random() * newThreatPool.length)];
    const levels: ThreatEvent["level"][] = ["critical", "high", "medium", "low"];
    const newThreat: ThreatEvent = {
      id: `t-${Date.now()}`,
      ...pool,
      level: levels[Math.floor(Math.random() * levels.length)],
      attacks: Math.floor(Math.random() * 2000) + 100,
    };
    setThreats((prev) => {
      // Update existing city or add new, cap at 20
      const exists = prev.find((t) => t.name === newThreat.name);
      if (exists) {
        return prev.map((t) =>
          t.name === newThreat.name
            ? { ...t, attacks: t.attacks + newThreat.attacks, level: newThreat.level }
            : t
        );
      }
      return [newThreat, ...prev].slice(0, 20);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(generateNewThreat, 4000);
    return () => clearInterval(interval);
  }, [generateNewThreat]);

  const totalAttacks = threats.reduce((s, c) => s + c.attacks, 0);
  const criticalCount = threats.filter((c) => c.level === "critical").length;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: AlertTriangle, label: "ACTIVE THREATS", value: threats.length.toString(), color: "text-threat-high" },
          { icon: Activity, label: "TOTAL ATTACKS", value: totalAttacks.toLocaleString(), color: "text-primary" },
          { icon: TrendingUp, label: "CRITICAL ZONES", value: criticalCount.toString(), color: "text-threat-critical" },
          { icon: Globe, label: "COUNTRIES", value: new Set(threats.map((c) => c.country)).size.toString(), color: "text-accent" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-[10px] font-mono text-muted-foreground">{stat.label}</span>
            </div>
            <p className={`text-2xl font-mono font-bold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-4 overflow-hidden">
          <h3 className="text-xs font-mono text-muted-foreground mb-3">
            &gt; GLOBAL_THREAT_MAP <span className="text-accent animate-pulse-glow">● LIVE</span>
          </h3>
          <ComposableMap
            projectionConfig={{ scale: 147, center: [10, 10] }}
            style={{ width: "100%", height: "auto" }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="hsl(220 15% 14%)"
                    stroke="hsl(220 15% 22%)"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "hsl(220 15% 18%)", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>
            {threats.map((threat) => (
              <Marker
                key={threat.id}
                coordinates={[threat.lng, threat.lat]}
                onClick={() => setSelected(threat)}
              >
                <circle
                  r={6}
                  fill={levelMarkerColors[threat.level]}
                  opacity={0.3}
                  className="animate-ping"
                />
                <circle
                  r={4}
                  fill={levelMarkerColors[threat.level]}
                  stroke="hsl(0 0% 100%)"
                  strokeWidth={0.5}
                  opacity={0.9}
                  className="cursor-pointer"
                />
              </Marker>
            ))}
          </ComposableMap>

          <div className="flex gap-4 mt-3 justify-center">
            {["critical", "high", "medium", "low"].map((level) => (
              <div key={level} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${levelColors[level]}`} />
                <span className="text-[10px] font-mono text-muted-foreground uppercase">{level}</span>
              </div>
            ))}
          </div>
        </div>

        {/* City List */}
        <div className="bg-card border border-border rounded-lg p-4 overflow-auto max-h-[500px]">
          <h3 className="text-xs font-mono text-muted-foreground mb-3">&gt; THREAT_SOURCES</h3>
          <div className="space-y-2">
            {[...threats]
              .sort((a, b) => b.attacks - a.attacks)
              .map((city) => (
                <motion.button
                  key={city.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setSelected(city)}
                  className={`w-full text-left p-3 rounded border transition-colors ${
                    selected?.id === city.id
                      ? "bg-primary/10 border-primary/30"
                      : "bg-secondary/50 border-border hover:border-primary/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-mono text-foreground">{city.name}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${levelColors[city.level]} text-primary-foreground`}>
                      {city.level.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground">{city.country} • {city.type}</p>
                  <p className={`text-xs font-mono mt-1 ${levelTextColors[city.level]}`}>
                    {city.attacks.toLocaleString()} attacks
                  </p>
                </motion.button>
              ))}
          </div>
        </div>
      </div>

      {/* Selected Detail */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card border border-primary/30 rounded-lg p-4 box-glow overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-mono font-bold text-foreground">
                  {selected.name}, {selected.country}
                </h3>
                <p className="text-xs font-mono text-muted-foreground mt-1">
                  Primary Threat: {selected.type} • {selected.attacks.toLocaleString()} tracked attacks
                </p>
              </div>
              <span className={`text-xs font-mono px-2 py-1 rounded ${levelColors[selected.level]} text-primary-foreground`}>
                {selected.level.toUpperCase()}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThreatMap;
