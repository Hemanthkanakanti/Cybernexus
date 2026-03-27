import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Monitor, Shield, Ban, Search, RefreshCw, Globe, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface IPEntry {
  ip: string;
  country: string;
  threatCount: number;
  severity: string;
  lastSeen: string;
  status: "blocked" | "monitored" | "whitelisted";
}

const IPMonitor = () => {
  const [ips, setIps] = useState<IPEntry[]>([]);
  const [searchIP, setSearchIP] = useState("");
  const [loading, setLoading] = useState(true);
  const [lookupResult, setLookupResult] = useState<any>(null);

  const fetchIPs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("threat_logs")
      .select("ip, country, severity, timestamp")
      .order("timestamp", { ascending: false })
      .limit(500);

    if (data) {
      const ipMap: Record<string, IPEntry> = {};
      data.forEach((d: any) => {
        if (!ipMap[d.ip]) {
          ipMap[d.ip] = {
            ip: d.ip,
            country: d.country,
            threatCount: 0,
            severity: d.severity,
            lastSeen: d.timestamp,
            status: d.severity === "critical" ? "blocked" : "monitored",
          };
        }
        ipMap[d.ip].threatCount++;
        if (["critical", "high"].includes(d.severity) && ipMap[d.ip].severity !== "critical") {
          ipMap[d.ip].severity = d.severity;
        }
      });
      setIps(Object.values(ipMap).sort((a, b) => b.threatCount - a.threatCount));
    }
    setLoading(false);
  };

  useEffect(() => { fetchIPs(); }, []);

  const handleLookup = () => {
    if (!searchIP.trim()) return;
    const found = ips.find(i => i.ip === searchIP.trim());
    if (found) {
      setLookupResult(found);
    } else {
      setLookupResult({
        ip: searchIP.trim(),
        country: "Unknown",
        threatCount: 0,
        severity: "none",
        lastSeen: "-",
        status: "whitelisted",
      });
    }
    toast({ title: "IP Lookup Complete", description: `Results for ${searchIP}` });
  };

  const severityColor: Record<string, string> = {
    critical: "text-threat-critical bg-threat-critical/15",
    high: "text-threat-high bg-threat-high/15",
    medium: "text-threat-medium bg-threat-medium/15",
    low: "text-threat-low bg-threat-low/15",
    none: "text-accent bg-accent/15",
  };

  const statusColor: Record<string, string> = {
    blocked: "text-threat-high bg-threat-high/15",
    monitored: "text-threat-medium bg-threat-medium/15",
    whitelisted: "text-accent bg-accent/15",
  };

  const filteredIPs = searchIP
    ? ips.filter(i => i.ip.includes(searchIP))
    : ips;

  const stats = {
    total: ips.length,
    blocked: ips.filter(i => i.status === "blocked").length,
    critical: ips.filter(i => i.severity === "critical").length,
    countries: new Set(ips.map(i => i.country)).size,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-mono font-bold text-foreground flex items-center gap-2">
            <Monitor className="w-5 h-5 text-primary" /> IP Monitoring Center
          </h2>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            Real-time IP intelligence from database
          </p>
        </div>
        <Button onClick={fetchIPs} variant="outline" size="sm" className="font-mono text-xs gap-2">
          <RefreshCw className="w-3 h-3" /> REFRESH
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Unique IPs", value: stats.total, icon: Globe, color: "text-primary" },
          { label: "Blocked IPs", value: stats.blocked, icon: Ban, color: "text-threat-high" },
          { label: "Critical Sources", value: stats.critical, icon: AlertTriangle, color: "text-threat-critical" },
          { label: "Countries", value: stats.countries, icon: Shield, color: "text-accent" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel-solid rounded-xl p-4">
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <p className={`text-2xl font-mono font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] font-mono text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* IP Lookup */}
      <div className="glass-panel-solid rounded-xl p-5">
        <h3 className="text-xs font-mono text-muted-foreground mb-3">&gt; IP_LOOKUP</h3>
        <div className="flex gap-3">
          <Input
            value={searchIP}
            onChange={(e) => setSearchIP(e.target.value)}
            placeholder="Enter IP address (e.g. 192.168.1.1)"
            className="font-mono text-xs bg-black border-border"
            onKeyDown={(e) => e.key === "Enter" && handleLookup()}
          />
          <Button onClick={handleLookup} size="sm" className="font-mono text-xs gap-2">
            <Search className="w-3 h-3" /> LOOKUP
          </Button>
        </div>

        {lookupResult && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-lg bg-secondary/50 border border-border">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "IP Address", value: lookupResult.ip },
                { label: "Country", value: lookupResult.country },
                { label: "Threat Count", value: lookupResult.threatCount },
                { label: "Severity", value: lookupResult.severity?.toUpperCase() },
                { label: "Last Seen", value: lookupResult.lastSeen !== "-" ? new Date(lookupResult.lastSeen).toLocaleString() : "-" },
                { label: "Status", value: lookupResult.status?.toUpperCase() },
              ].map((f) => (
                <div key={f.label}>
                  <p className="text-[10px] font-mono text-muted-foreground">{f.label}</p>
                  <p className="text-xs font-mono text-foreground font-bold">{f.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* IP Table */}
      <div className="glass-panel-solid rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-mono text-muted-foreground">&gt; TRACKED_IPS</h3>
          <span className="text-[10px] font-mono text-muted-foreground">{filteredIPs.length} entries</span>
        </div>
        {loading ? (
          <div className="text-center py-8 text-xs font-mono text-muted-foreground animate-pulse">Loading IP data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["IP Address", "Country", "Threats", "Severity", "Last Seen", "Status"].map(h => (
                    <th key={h} className="text-left text-[10px] font-mono text-muted-foreground py-2 px-3 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredIPs.slice(0, 20).map((ip, i) => (
                  <motion.tr key={ip.ip} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="text-xs font-mono text-foreground py-2.5 px-3">{ip.ip}</td>
                    <td className="text-xs font-mono text-foreground py-2.5 px-3">{ip.country}</td>
                    <td className="text-xs font-mono text-primary py-2.5 px-3 font-bold">{ip.threatCount}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${severityColor[ip.severity]}`}>
                        {ip.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-xs font-mono text-muted-foreground py-2.5 px-3">
                      {new Date(ip.lastSeen).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${statusColor[ip.status]}`}>
                        {ip.status.toUpperCase()}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default IPMonitor;
