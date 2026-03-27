import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, Ban, Zap, TrendingUp, TrendingDown, Database, Download, Share2, Eye, Upload, Radio, Globe, ExternalLink } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, ZAxis, Treemap, FunnelChart, Funnel, LabelList } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAdminRole } from "@/hooks/useAdminRole";
import { DashboardFilters, defaultFilters, type DashboardFilterState } from "@/components/DashboardFilters";
import {
  generateInitialLogs, generateThreatLog, getDashboardMetrics,
  getThreatsPerSeverity, getAttacksByCountry, getAttackTypes,
  getTimelineData, calculateRiskLevel, type ThreatLogEntry
} from "@/lib/mockData";

const COLORS = ["hsl(330 80% 55%)", "hsl(0 80% 55%)", "hsl(35 90% 55%)", "hsl(142 70% 45%)"];
const PIE_COLORS = ["hsl(192 95% 55%)", "hsl(162 70% 50%)", "hsl(270 70% 60%)", "hsl(45 95% 55%)", "hsl(0 80% 55%)", "hsl(330 80% 55%)", "hsl(210 80% 55%)", "hsl(120 60% 50%)"];

interface ExtendedLog extends ThreatLogEntry {
  threatName?: string;
  targetSystem?: string;
  description?: string;
  protocol?: string;
  port?: number;
  attackVector?: string;
  confidenceScore?: number;
  mitreTactic?: string;
  source?: string;
}

const DashboardHome = () => {
  const [logs, setLogs] = useState<ThreatLogEntry[]>(() => generateInitialLogs(30));
  const [dbLogs, setDbLogs] = useState<ExtendedLog[]>([]);
  const [timelineData] = useState(getTimelineData);
  const [dataSource, setDataSource] = useState<"all" | "live" | "uploaded">("all");
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [filters, setFilters] = useState<DashboardFilterState>(defaultFilters);
  const [publishUrl, setPublishUrl] = useState<string | null>(null);
  const { isAdmin } = useAdminRole();
  const dashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDB = async () => {
      const { data } = await supabase
        .from("threat_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (data) {
        setDbLogs((data as any[]).map((d) => ({
          id: d.id,
          timestamp: d.timestamp || d.created_at,
          ip: d.ip,
          country: d.country,
          threatType: d.threat_type,
          severity: d.severity as ThreatLogEntry["severity"],
          status: d.status as ThreatLogEntry["status"],
          threatName: d.threat_name || d.threat_type,
          targetSystem: d.target_system || "Unknown",
          description: d.description,
          protocol: d.protocol || "TCP",
          port: d.port || 443,
          attackVector: d.attack_vector || "Network",
          confidenceScore: d.confidence_score || 50,
          mitreTactic: d.mitre_tactic || "Initial Access",
          source: d.source || "uploaded",
        })));
      }
    };
    fetchDB();

    const channel = supabase
      .channel("threat_logs_dashboard")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "threat_logs" }, (payload) => {
        const d = payload.new as any;
        setDbLogs((prev) => [{
          id: d.id, timestamp: d.timestamp || d.created_at,
          ip: d.ip, country: d.country, threatType: d.threat_type,
          severity: d.severity, status: d.status,
          threatName: d.threat_name || d.threat_type,
          targetSystem: d.target_system || "Unknown",
          description: d.description,
          protocol: d.protocol || "TCP",
          port: d.port || 443,
          attackVector: d.attack_vector || "Network",
          confidenceScore: d.confidence_score || 50,
          mitreTactic: d.mitre_tactic || "Initial Access",
          source: d.source || "uploaded",
        }, ...prev].slice(0, 200));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Live dummy data feed
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prev) => [generateThreatLog(), ...prev].slice(0, 50));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const rawLogs = dataSource === "uploaded" ? dbLogs
    : dataSource === "live" ? logs
    : [...dbLogs, ...logs].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 150);

  // Apply filters
  const activeLogs = rawLogs.filter((l: any) => {
    if (filters.severity.length > 0 && !filters.severity.includes(l.severity)) return false;
    if (filters.country.length > 0 && !filters.country.includes(l.country)) return false;
    if (filters.threatType.length > 0 && !filters.threatType.includes(l.threatType)) return false;
    if (filters.status.length > 0 && !filters.status.includes(l.status)) return false;
    if (filters.mitreTactic.length > 0 && l.mitreTactic && !filters.mitreTactic.includes(l.mitreTactic)) return false;
    if (filters.confidenceMin > 0 && (l.confidenceScore || 50) < filters.confidenceMin) return false;
    if (filters.dateRange !== "all") {
      const now = Date.now();
      const t = new Date(l.timestamp).getTime();
      const ranges: Record<string, number> = { "1h": 3600000, "6h": 21600000, "24h": 86400000, "7d": 604800000, "30d": 2592000000 };
      if (now - t > (ranges[filters.dateRange] || 86400000)) return false;
    }
    return true;
  });

  const metrics = getDashboardMetrics([], activeLogs);
  const severityData = getThreatsPerSeverity(activeLogs);
  const countryData = getAttacksByCountry(activeLogs);
  const typeData = getAttackTypes(activeLogs);
  const risk = calculateRiskLevel(activeLogs);

  // Scatter data for threat landscape
  const scatterData = activeLogs.slice(0, 50).map((l: any) => ({
    x: l.confidenceScore || 50,
    y: l.severity === "critical" ? 4 : l.severity === "high" ? 3 : l.severity === "medium" ? 2 : 1,
    z: l.port || 443,
    name: l.threatName || l.threatType,
  }));

  // Radar data for attack vectors
  const vectorData = (() => {
    const countMap: Record<string, number> = {};
    activeLogs.forEach((l: any) => {
      const vec = l.attackVector || "Network";
      countMap[vec] = (countMap[vec] || 0) + 1;
    });
    return Object.entries(countMap)
      .map(([subject, count]) => ({ subject, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  })();

  const metricCards = [
    { icon: Shield, label: "Total Threats", value: metrics.totalThreats, change: "+12%", up: true, color: "text-primary" },
    { icon: AlertTriangle, label: "Critical Alerts", value: metrics.criticalAlerts, change: "+5%", up: true, color: "text-threat-critical" },
    { icon: Ban, label: "Blocked IPs", value: metrics.blockedIPs, change: "+8%", up: false, color: "text-accent" },
    { icon: Zap, label: "Active Incidents", value: metrics.activeIncidents, change: "-3%", up: false, color: "text-threat-medium" },
  ];

  const severityBadge: Record<string, string> = {
    critical: "bg-threat-critical/20 text-threat-critical",
    high: "bg-threat-high/20 text-threat-high",
    medium: "bg-threat-medium/20 text-threat-medium",
    low: "bg-threat-low/20 text-threat-low",
  };
  const statusBadge: Record<string, string> = {
    blocked: "bg-accent/20 text-accent",
    mitigated: "bg-primary/20 text-primary",
    active: "bg-threat-high/20 text-threat-high",
    investigating: "bg-threat-medium/20 text-threat-medium",
  };

  const exportCSV = useCallback(() => {
    const headers = "Threat ID,Threat Name,Category,Severity,Timestamp,Source IP,Target System,Country,Status,Protocol,Port,Attack Vector,Confidence,MITRE Tactic\n";
    const rows = activeLogs.map((l: any) =>
      `${l.id},${l.threatName || l.threatType},${l.threatType},${l.severity},${l.timestamp},${l.ip},${l.targetSystem || "N/A"},${l.country},${l.status},${l.protocol || "TCP"},${l.port || 443},${l.attackVector || "Network"},${l.confidenceScore || 50},${l.mitreTactic || "Initial Access"}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `cybernexus-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
    toast({ title: "Dashboard Exported", description: "CSV report downloaded" });
  }, [activeLogs]);

  const exportJSON = useCallback(() => {
    const report = {
      platform: "CyberNexus",
      generated: new Date().toISOString(),
      dataSource,
      riskLevel: risk,
      metrics,
      threats: activeLogs.map((l: any) => ({
        threat_id: l.id, threat_name: l.threatName || l.threatType,
        threat_category: l.threatType, severity_level: l.severity,
        timestamp: l.timestamp, source_ip: l.ip,
        target_system: l.targetSystem || "Unknown",
        country: l.country, status: l.status,
        protocol: l.protocol || "TCP", port: l.port || 443,
        attack_vector: l.attackVector || "Network",
        confidence_score: l.confidenceScore || 50,
        mitre_tactic: l.mitreTactic || "Initial Access",
      })),
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `cybernexus-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click(); URL.revokeObjectURL(url);
    toast({ title: "JSON Report Exported", description: "Full threat report downloaded" });
  }, [activeLogs, risk, metrics, dataSource]);

  const shareDashboard = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link Copied", description: "Dashboard URL copied to clipboard" });
  }, []);

  const publishDashboard = useCallback(() => {
    const url = `${window.location.origin}/dashboard?shared=true&ts=${Date.now()}`;
    setPublishUrl(url);
    navigator.clipboard.writeText(url);
    toast({ title: "Published!", description: "Dashboard published. Public URL copied to clipboard." });
  }, []);

  const tooltipStyle = {
    background: "hsl(222 47% 8%)",
    border: "1px solid hsl(222 20% 16%)",
    borderRadius: "8px",
    fontSize: "11px",
    fontFamily: "JetBrains Mono",
  };

  return (
    <div className="space-y-6" ref={dashRef}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-mono font-bold text-foreground">CyberNexus Dashboard</h2>
          <p className="text-xs font-mono text-muted-foreground mt-1">Real-time threat intelligence — {dataSource === "uploaded" ? "showing uploaded data" : dataSource === "live" ? "live dummy feed" : "all sources combined"}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Data Source Toggle */}
          <div className="flex gap-1 bg-secondary rounded-lg p-1 border border-border">
            {([
              { key: "all" as const, label: "ALL", icon: Database },
              { key: "uploaded" as const, label: "UPLOADED", icon: Upload },
              { key: "live" as const, label: "LIVE", icon: Radio },
            ]).map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setDataSource(key)}
                className={`flex items-center gap-1 text-[10px] font-mono px-3 py-1.5 rounded transition-colors ${
                  dataSource === key ? "bg-black text-white border border-primary/30" : "text-black hover:text-black"
                }`}>
                <Icon className="w-3 h-3" />
                {label}
                {key === "live" && <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
              </button>
            ))}
          </div>

          <Button onClick={exportCSV} variant="outline" size="sm" className="text-[10px] font-mono gap-1 h-7">
            <Download className="w-3 h-3" /> CSV
          </Button>
          <Button onClick={exportJSON} variant="outline" size="sm" className="text-[10px] font-mono gap-1 h-7">
            <Download className="w-3 h-3" /> JSON
          </Button>
          <Button onClick={shareDashboard} variant="outline" size="sm" className="text-[10px] font-mono gap-1 h-7">
            <Share2 className="w-3 h-3" /> SHARE
          </Button>
          {isAdmin && (
            <Button onClick={publishDashboard} variant="outline" size="sm" className="text-[10px] font-mono gap-1 h-7 border-primary/30 text-primary">
              <ExternalLink className="w-3 h-3" /> PUBLISH
            </Button>
          )}

          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
            risk.level === "high" ? "bg-threat-high/10 border-threat-high/30 text-threat-high" :
            risk.level === "medium" ? "bg-threat-medium/10 border-threat-medium/30 text-threat-medium" :
            "bg-accent/10 border-accent/30 text-accent"
          }`}>
            <span className="text-lg">{risk.level === "high" ? "🔴" : risk.level === "medium" ? "🟡" : "🟢"}</span>
            <div>
              <p className="text-xs font-mono font-bold uppercase">Risk: {risk.level}</p>
              <p className="text-[10px] font-mono">Score: {risk.score}/100</p>
            </div>
          </div>
        </div>
      </div>

      {/* Published URL */}
      {publishUrl && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 border border-primary/20">
          <ExternalLink className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-mono text-primary truncate">{publishUrl}</span>
          <button onClick={() => setPublishUrl(null)} className="text-[10px] font-mono text-muted-foreground hover:text-foreground ml-auto">×</button>
        </div>
      )}

      {/* Filters */}
      <DashboardFilters filters={filters} onChange={setFilters} />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel-solid rounded-xl p-5 hover:neon-border transition-all duration-300 cursor-pointer"
            onClick={() => toast({ title: card.label, description: `Current value: ${card.value}` })}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center">
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <span className={`flex items-center gap-1 text-[10px] font-mono ${card.up ? "text-threat-high" : "text-accent"}`}>
                {card.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {card.change}
              </span>
            </div>
            <p className={`text-3xl font-mono font-bold ${card.color}`}>{card.value}</p>
            <p className="text-[10px] font-mono text-muted-foreground mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div className="glass-panel-solid rounded-xl p-5 cursor-pointer hover:border-primary/30 transition-colors"
          onClick={() => setSelectedChart(selectedChart === "severity" ? null : "severity")} layout>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-mono text-muted-foreground">&gt; THREATS_BY_SEVERITY</h3>
            <Eye className="w-3 h-3 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={selectedChart === "severity" ? 320 : 220}>
            <BarChart data={severityData}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(220 15% 50%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(220 15% 50%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(222 30% 12%)" }} />
              <Legend wrapperStyle={{ fontSize: "10px", fontFamily: "JetBrains Mono" }} />
              <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]} animationDuration={800}>
                {severityData.map((_, index) => <Cell key={index} fill={COLORS[index]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="glass-panel-solid rounded-xl p-5 cursor-pointer hover:border-primary/30 transition-colors"
          onClick={() => setSelectedChart(selectedChart === "types" ? null : "types")} layout>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-mono text-muted-foreground">&gt; ATTACK_TYPES</h3>
            <Eye className="w-3 h-3 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={selectedChart === "types" ? 320 : 220}>
            <PieChart>
              <Pie data={typeData.slice(0, 8)} dataKey="value" nameKey="name" cx="50%" cy="50%"
                outerRadius={selectedChart === "types" ? 110 : 80} innerRadius={selectedChart === "types" ? 55 : 40}
                strokeWidth={0} animationDuration={800}
                label={selectedChart === "types" ? ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%` : undefined}>
                {typeData.slice(0, 8).map((_, index) => <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {typeData.slice(0, 8).map((t, i) => (
              <span key={t.name} className="flex items-center gap-1 text-[9px] font-mono text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                {t.name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-panel-solid rounded-xl p-5">
          <h3 className="text-xs font-mono text-muted-foreground mb-4">&gt; ATTACK_TIMELINE (24H)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0 80% 55%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(0 80% 55%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="blockedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(162 70% 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(162 70% 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 20% 14%)" />
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(220 15% 50%)" }} axisLine={false} tickLine={false} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(220 15% 50%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: "10px", fontFamily: "JetBrains Mono" }} />
              <Area type="monotone" dataKey="threats" stroke="hsl(0 80% 55%)" fill="url(#threatGrad)" strokeWidth={2} name="Threats" />
              <Area type="monotone" dataKey="blocked" stroke="hsl(162 70% 50%)" fill="url(#blockedGrad)" strokeWidth={2} name="Blocked" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel-solid rounded-xl p-5">
          <h3 className="text-xs font-mono text-muted-foreground mb-4">&gt; ATTACKS_BY_COUNTRY</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={countryData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(220 15% 50%)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: "hsl(220 15% 50%)" }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(222 30% 12%)" }} />
              <Bar dataKey="value" fill="hsl(192 95% 55%)" radius={[0, 4, 4, 0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {vectorData.length > 0 && (
          <div className="glass-panel-solid rounded-xl p-5">
            <h3 className="text-xs font-mono text-muted-foreground mb-4">&gt; ATTACK_VECTORS</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={vectorData}>
                <PolarGrid stroke="hsl(222 20% 18%)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fill: "hsl(220 15% 50%)" }} />
                <PolarRadiusAxis tick={{ fontSize: 8, fill: "hsl(220 15% 40%)" }} />
                <Radar name="Attacks" dataKey="count" stroke="hsl(270 70% 60%)" fill="hsl(270 70% 60%)" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Threat Logs Table */}
      <div className="glass-panel-solid rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-mono text-muted-foreground">&gt; THREAT_INTELLIGENCE_LOG</h3>
          <span className="text-[10px] font-mono text-muted-foreground">
            Source: <span className="text-primary">{dataSource.toUpperCase()}</span> • {activeLogs.length} entries
            {dataSource === "live" && <span className="ml-2 text-accent">● LIVE FEED</span>}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Threat ID", "Threat Name", "Category", "Severity", "Timestamp", "Source IP", "Target System", "Protocol", "Port", "Confidence", "MITRE Tactic", "Status"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-mono text-muted-foreground py-2 px-3 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeLogs.slice(0, 20).map((log: any, i) => (
                <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer"
                  onClick={() => toast({
                    title: `Threat: ${log.threatName || log.threatType}`,
                    description: `${log.description || `${log.threatType} from ${log.ip} (${log.country})`}`,
                  })}>
                  <td className="text-[10px] font-mono text-muted-foreground py-2.5 px-3">{String(log.id).slice(0, 8)}</td>
                  <td className="text-xs font-mono text-foreground py-2.5 px-3 font-bold">{log.threatName || log.threatType}</td>
                  <td className="text-xs font-mono text-primary py-2.5 px-3">{log.threatType}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${severityBadge[log.severity]}`}>
                      {log.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-xs font-mono text-muted-foreground py-2.5 px-3">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="text-xs font-mono text-foreground py-2.5 px-3">{log.ip}</td>
                  <td className="text-xs font-mono text-muted-foreground py-2.5 px-3">{log.targetSystem || "N/A"}</td>
                  <td className="text-[10px] font-mono text-primary py-2.5 px-3">{log.protocol || "TCP"}</td>
                  <td className="text-[10px] font-mono text-muted-foreground py-2.5 px-3">{log.port || 443}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          width: `${log.confidenceScore || 50}%`,
                          background: (log.confidenceScore || 50) > 75 ? "hsl(var(--threat-critical))" : (log.confidenceScore || 50) > 50 ? "hsl(var(--threat-medium))" : "hsl(var(--neon-green))"
                        }} />
                      </div>
                      <span className="text-[9px] font-mono text-muted-foreground">{log.confidenceScore || 50}%</span>
                    </div>
                  </td>
                  <td className="text-[10px] font-mono text-muted-foreground py-2.5 px-3 whitespace-nowrap">{log.mitreTactic || "Initial Access"}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${statusBadge[log.status]}`}>
                      {log.status.toUpperCase()}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
