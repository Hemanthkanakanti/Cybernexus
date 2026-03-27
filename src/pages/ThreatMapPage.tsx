import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Activity, TrendingUp, Globe, RefreshCw } from "lucide-react";
import ThreatGlobe from "@/components/ThreatGlobe";
import { supabase } from "@/integrations/supabase/client";
import { seedThreats, type ThreatEvent } from "@/lib/mockData";

const levelColors: Record<string, string> = {
  critical: "bg-threat-critical", high: "bg-threat-high", medium: "bg-threat-medium", low: "bg-threat-low",
};
const levelTextColors: Record<string, string> = {
  critical: "text-threat-critical", high: "text-threat-high", medium: "text-threat-medium", low: "text-threat-low",
};

const ThreatMapPage = () => {
  const [threats, setThreats] = useState<ThreatEvent[]>(seedThreats);
  const [selected, setSelected] = useState<ThreatEvent | null>(null);

  const fetchFromDB = useCallback(async () => {
    const { data, error } = await supabase
      .from("threat_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);

    if (!error && data && data.length > 0) {
      const mapped: ThreatEvent[] = (data as any[]).map((d) => ({
        id: d.id,
        name: d.name,
        country: d.country,
        lat: d.lat,
        lng: d.lng,
        level: d.level as ThreatEvent["level"],
        attacks: d.attacks,
        type: d.type,
      }));
      // Merge DB data with seed data, dedup by name
      const nameSet = new Set(mapped.map((m) => m.name));
      const merged = [...mapped, ...seedThreats.filter((s) => !nameSet.has(s.name))];
      setThreats(merged.slice(0, 25));
    }
  }, []);

  useEffect(() => {
    fetchFromDB();
    // Subscribe to realtime
    const channel = supabase
      .channel("threat_events_realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "threat_events" }, (payload) => {
        const d = payload.new as any;
        const newThreat: ThreatEvent = {
          id: d.id, name: d.name, country: d.country,
          lat: d.lat, lng: d.lng, level: d.level, attacks: d.attacks, type: d.type,
        };
        setThreats((prev) => {
          const exists = prev.find((t) => t.name === newThreat.name);
          if (exists) return prev.map((t) => t.name === newThreat.name ? { ...t, attacks: t.attacks + newThreat.attacks, level: newThreat.level } : t);
          return [newThreat, ...prev].slice(0, 25);
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchFromDB]);

  const totalAttacks = threats.reduce((s, c) => s + c.attacks, 0);
  const criticalCount = threats.filter((c) => c.level === "critical").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-mono font-bold text-foreground">Live Threat Globe</h2>
          <p className="text-xs font-mono text-muted-foreground mt-1">Real-time 3D global cyber attack visualization — database-backed</p>
        </div>
        <button onClick={fetchFromDB} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs font-mono text-black hover:text-black transition-colors">
          <RefreshCw className="w-3 h-3" /> Sync DB
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: AlertTriangle, label: "ACTIVE THREATS", value: threats.length.toString(), color: "text-threat-high" },
          { icon: Activity, label: "TOTAL ATTACKS", value: totalAttacks.toLocaleString(), color: "text-primary" },
          { icon: TrendingUp, label: "CRITICAL ZONES", value: criticalCount.toString(), color: "text-threat-critical" },
          { icon: Globe, label: "COUNTRIES", value: new Set(threats.map((c) => c.country)).size.toString(), color: "text-accent" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-panel-solid rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-[10px] font-mono text-muted-foreground">{stat.label}</span>
            </div>
            <p className={`text-2xl font-mono font-bold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-panel-solid rounded-xl p-4 overflow-hidden">
          <h3 className="text-xs font-mono text-muted-foreground mb-3">
            &gt; GLOBAL_THREAT_GLOBE <span className="text-accent animate-pulse-glow">● LIVE</span>
          </h3>
          <ThreatGlobe threats={threats} />
        </div>

        <div className="glass-panel-solid rounded-xl p-4 overflow-auto max-h-[600px]">
          <h3 className="text-xs font-mono text-muted-foreground mb-3">&gt; THREAT_SOURCES</h3>
          <div className="space-y-2">
            {[...threats].sort((a, b) => b.attacks - a.attacks).map((city) => (
              <motion.button key={city.id} whileHover={{ x: 4 }} onClick={() => setSelected(city)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selected?.id === city.id ? "bg-primary/10 border-primary/30" : "bg-secondary/50 border-border hover:border-primary/20"
                }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-mono text-foreground">{city.name}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${levelColors[city.level]} text-primary-foreground`}>
                    {city.level.toUpperCase()}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-muted-foreground">{city.country} • {city.type}</p>
                <p className={`text-xs font-mono mt-1 ${levelTextColors[city.level]}`}>{city.attacks.toLocaleString()} attacks</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
          className="glass-panel-solid neon-border rounded-xl p-4 overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-mono font-bold text-foreground">{selected.name}, {selected.country}</h3>
              <p className="text-xs font-mono text-muted-foreground mt-1">Primary Threat: {selected.type} • {selected.attacks.toLocaleString()} tracked attacks</p>
            </div>
            <span className={`text-xs font-mono px-2 py-1 rounded ${levelColors[selected.level]} text-primary-foreground`}>
              {selected.level.toUpperCase()}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ThreatMapPage;
