import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from "recharts";
import { generateInitialLogs, generateThreatLog, getThreatsPerSeverity, type ThreatLogEntry } from "@/lib/mockData";
import { motion } from "framer-motion";

const COLORS = ["hsl(330 80% 55%)", "hsl(0 80% 55%)", "hsl(35 90% 55%)", "hsl(142 70% 45%)"];

const SeverityAnalytics = () => {
  const [logs, setLogs] = useState<ThreatLogEntry[]>(() => generateInitialLogs(60));

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => [generateThreatLog(), ...prev].slice(0, 100));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const severityData = getThreatsPerSeverity(logs);
  const total = logs.length;

  const trendData = Array.from({ length: 12 }, (_, i) => ({
    hour: `${(i + 1) * 2}h`,
    critical: Math.floor(Math.random() * 15) + 2,
    high: Math.floor(Math.random() * 20) + 5,
    medium: Math.floor(Math.random() * 25) + 10,
    low: Math.floor(Math.random() * 15) + 5,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-mono font-bold text-foreground">Severity Analytics</h2>
        <p className="text-xs font-mono text-muted-foreground mt-1">Detailed breakdown by threat severity level</p>
      </div>

      {/* Severity cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {severityData.map((s, i) => (
          <motion.div key={s.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-panel-solid rounded-xl p-5">
            <p className="text-[10px] font-mono text-muted-foreground uppercase">{s.name}</p>
            <p className="text-3xl font-mono font-bold mt-1" style={{ color: COLORS[i] }}>{s.value}</p>
            <p className="text-[10px] font-mono text-muted-foreground mt-1">{((s.value / total) * 100).toFixed(1)}% of total</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-panel-solid rounded-xl p-5">
          <h3 className="text-xs font-mono text-muted-foreground mb-4">&gt; DISTRIBUTION</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={severityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} strokeWidth={0}>
                {severityData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(222 47% 8%)", border: "1px solid hsl(222 20% 16%)", borderRadius: "8px", fontSize: "11px", fontFamily: "JetBrains Mono" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel-solid rounded-xl p-5">
          <h3 className="text-xs font-mono text-muted-foreground mb-4">&gt; SEVERITY_TREND</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 20% 14%)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "hsl(220 15% 50%)" }} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(220 15% 50%)" }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(222 47% 8%)", border: "1px solid hsl(222 20% 16%)", borderRadius: "8px", fontSize: "11px", fontFamily: "JetBrains Mono" }} />
              <Area type="monotone" dataKey="critical" stackId="1" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.3} />
              <Area type="monotone" dataKey="high" stackId="1" stroke={COLORS[1]} fill={COLORS[1]} fillOpacity={0.3} />
              <Area type="monotone" dataKey="medium" stackId="1" stroke={COLORS[2]} fill={COLORS[2]} fillOpacity={0.3} />
              <Area type="monotone" dataKey="low" stackId="1" stroke={COLORS[3]} fill={COLORS[3]} fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SeverityAnalytics;
