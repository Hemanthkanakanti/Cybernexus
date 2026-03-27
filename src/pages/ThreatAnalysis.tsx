import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Shield, Bug, Crosshair, Flame, Zap, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

interface ThreatEntry {
  id: string;
  name: string;
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "active" | "mitigated" | "investigating";
  source: string;
  firstSeen: string;
  iocs: string[];
  description: string;
}

const categories = ["Ransomware", "Phishing", "APT", "Zero-Day", "DDoS", "Malware", "Supply Chain", "Insider Threat"];
const sources = ["OSINT Feed", "Honeypot", "IDS/IPS", "SIEM Alert", "Threat Intel", "User Report"];
const names = [
  "LockBit 4.0", "BlackCat ALPHV", "Emotet Resurgence", "CVE-2026-3891", "SolarBreeze APT",
  "Lazarus Cluster", "DarkGate Loader", "Akira Variant", "MedusaLocker", "StormBamboo",
  "PhantomCore", "NightOwl RAT", "CryptoShield", "IceBreaker", "VenomSoft",
];

function generateThreat(): ThreatEntry {
  const sevs: ThreatEntry["severity"][] = ["critical", "high", "medium", "low"];
  const stats: ThreatEntry["status"][] = ["active", "mitigated", "investigating"];
  const h = Math.floor(Math.random() * 24);
  return {
    id: `THR-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    name: names[Math.floor(Math.random() * names.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    severity: sevs[Math.floor(Math.random() * sevs.length)],
    status: stats[Math.floor(Math.random() * stats.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    firstSeen: `${h.toString().padStart(2, "0")}:${Math.floor(Math.random() * 60).toString().padStart(2, "0")} UTC`,
    iocs: [
      `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
      `${Math.random().toString(36).slice(2, 10)}.${["com", "ru", "cn", "io"][Math.floor(Math.random() * 4)]}`,
    ],
    description: `Detected ${categories[Math.floor(Math.random() * categories.length)].toLowerCase()} activity targeting enterprise infrastructure.`,
  };
}

const sevColors = { critical: "text-threat-critical", high: "text-threat-high", medium: "text-threat-medium", low: "text-threat-low" };
const sevBg = { critical: "bg-threat-critical", high: "bg-threat-high", medium: "bg-threat-medium", low: "bg-threat-low" };
const statusColors = { active: "text-threat-critical", mitigated: "text-threat-low", investigating: "text-threat-medium" };

const ThreatAnalysis = () => {
  const [threats, setThreats] = useState<ThreatEntry[]>(() => Array.from({ length: 12 }, generateThreat));
  const [search, setSearch] = useState("");
  const [filterSev, setFilterSev] = useState<string>("all");

  useEffect(() => {
    const iv = setInterval(() => {
      setThreats(prev => [generateThreat(), ...prev].slice(0, 30));
    }, 8000);
    return () => clearInterval(iv);
  }, []);

  const filtered = threats.filter(t => {
    if (filterSev !== "all" && t.severity !== filterSev) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const catCounts = categories.map(c => ({ name: c, value: threats.filter(t => t.category === c).length })).filter(c => c.value > 0);
  const sevCounts = [
    { name: "Critical", value: threats.filter(t => t.severity === "critical").length, fill: "hsl(330, 80%, 55%)" },
    { name: "High", value: threats.filter(t => t.severity === "high").length, fill: "hsl(0, 80%, 55%)" },
    { name: "Medium", value: threats.filter(t => t.severity === "medium").length, fill: "hsl(35, 90%, 55%)" },
    { name: "Low", value: threats.filter(t => t.severity === "low").length, fill: "hsl(142, 70%, 45%)" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-mono font-bold text-foreground">Threat Analysis</h2>
        <p className="text-xs font-mono text-muted-foreground mt-1">Real-time threat intelligence and analysis engine</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Bug, label: "TOTAL THREATS", value: threats.length, color: "text-primary" },
          { icon: Flame, label: "CRITICAL", value: threats.filter(t => t.severity === "critical").length, color: "text-threat-critical" },
          { icon: Crosshair, label: "ACTIVE", value: threats.filter(t => t.status === "active").length, color: "text-threat-high" },
          { icon: Shield, label: "MITIGATED", value: threats.filter(t => t.status === "mitigated").length, color: "text-threat-low" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-panel-solid rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className="text-[10px] font-mono text-muted-foreground">{s.label}</span>
            </div>
            <p className={`text-2xl font-mono font-bold ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-panel-solid rounded-xl p-4">
          <h3 className="text-xs font-mono text-muted-foreground mb-3">&gt; SEVERITY_BREAKDOWN</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={sevCounts} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" stroke="none">
                {sevCounts.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(222, 47%, 8%)", border: "1px solid hsl(222, 20%, 16%)", borderRadius: 8, fontFamily: "JetBrains Mono", fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 glass-panel-solid rounded-xl p-4">
          <h3 className="text-xs font-mono text-muted-foreground mb-3">&gt; THREATS_BY_CATEGORY</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={catCounts}>
              <XAxis dataKey="name" tick={{ fill: "hsl(220, 15%, 50%)", fontSize: 9, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(220, 15%, 50%)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(222, 47%, 8%)", border: "1px solid hsl(222, 20%, 16%)", borderRadius: 8, fontFamily: "JetBrains Mono", fontSize: 11 }} />
              <Bar dataKey="value" fill="hsl(192, 95%, 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search threats..."
            className="pl-10 font-mono text-xs bg-black border-border" />
        </div>
        <div className="flex gap-1">
          {["all", "critical", "high", "medium", "low"].map(s => (
            <button key={s} onClick={() => setFilterSev(s)}
              className={`text-[10px] font-mono px-3 py-1.5 rounded-lg border transition-colors ${
                filterSev === s ? "bg-primary/20 border-primary/40 text-primary" : "bg-white border-border text-black hover:border-primary/20"
              }`}>{s.toUpperCase()}</button>
          ))}
        </div>
      </div>

      {/* Threat List */}
      <div className="space-y-2">
        {filtered.map((t) => (
          <motion.div key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="glass-panel-solid rounded-xl p-4 hover:border-primary/20 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-foreground">{t.name}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${sevBg[t.severity]} text-primary-foreground`}>{t.severity.toUpperCase()}</span>
                  <span className={`text-[10px] font-mono ${statusColors[t.status]}`}>● {t.status.toUpperCase()}</span>
                </div>
                <p className="text-[10px] font-mono text-muted-foreground mt-1">{t.category} • {t.source} • First seen: {t.firstSeen}</p>
              </div>
            </div>
            <p className="text-xs font-mono text-muted-foreground mb-2">{t.description}</p>
            <div className="flex gap-2 flex-wrap">
              {t.iocs.map((ioc, j) => (
                <span key={j} className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary border border-border text-black">{ioc}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ThreatAnalysis;
