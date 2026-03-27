import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Brain, AlertTriangle, TrendingUp, Shield, Settings2, Send, Bot, Loader2, LayoutDashboard } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, AreaChart, Area } from "recharts";
import ReactMarkdown from "react-markdown";
import { generateInitialLogs, generateThreatLog, calculateRiskLevel, getThreatsPerSeverity, getAttacksByCountry, getAttackTypes, type ThreatLogEntry } from "@/lib/mockData";
import { useDashboardContext } from "@/hooks/useDashboardContext";

const CHART_COLORS = ["hsl(192 95% 55%)", "hsl(330 80% 55%)", "hsl(0 80% 55%)", "hsl(35 90% 55%)", "hsl(142 70% 45%)", "hsl(270 70% 60%)", "hsl(45 95% 55%)", "hsl(210 80% 55%)"];
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cyber-chat`;

interface DashboardConfig {
  title: string;
  description?: string;
  cards: { label: string; value: string; change?: string; color: string }[];
  charts: { type: string; title: string; data: { name: string; value: number }[] }[];
  insights: string[];
  recommendations: string[];
}

interface ChatMessage { role: "user" | "assistant"; content: string; }

const tooltipStyle = {
  background: "hsl(222 47% 8%)",
  border: "1px solid hsl(222 20% 16%)",
  borderRadius: "8px",
  fontSize: "11px",
  fontFamily: "JetBrains Mono",
};

const colorMap: Record<string, string> = {
  critical: "text-threat-critical", high: "text-threat-high",
  medium: "text-threat-medium", low: "text-low", primary: "text-primary", accent: "text-accent",
};
const bgMap: Record<string, string> = {
  critical: "bg-threat-critical/10 border-threat-critical/30",
  high: "bg-threat-high/10 border-threat-high/30",
  medium: "bg-threat-medium/10 border-threat-medium/30",
  low: "bg-accent/10 border-accent/30",
  primary: "bg-primary/10 border-primary/30",
  accent: "bg-accent/10 border-accent/30",
};

function RenderDashboard({ config }: { config: DashboardConfig }) {
  return (
    <div className="space-y-4 mt-4">
      <div className="border-b border-border pb-2">
        <h3 className="text-sm font-mono font-bold text-foreground">{config.title}</h3>
        {config.description && <p className="text-[10px] font-mono text-muted-foreground">{config.description}</p>}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {config.cards.map((c, i) => (
          <div key={i} className={`rounded-lg p-3 border ${bgMap[c.color] || bgMap.primary}`}>
            <p className="text-[10px] font-mono text-muted-foreground">{c.label}</p>
            <p className={`text-2xl font-mono font-bold ${colorMap[c.color] || "text-primary"}`}>{c.value}</p>
            {c.change && <p className="text-[10px] font-mono text-muted-foreground">{c.change}</p>}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {config.charts.map((chart, i) => (
          <div key={i} className="glass-panel-solid rounded-lg p-4">
            <h4 className="text-[10px] font-mono text-muted-foreground mb-3">&gt; {chart.title.toUpperCase()}</h4>
            <ResponsiveContainer width="100%" height={180}>
              {chart.type === "pie" ? (
                <PieChart>
                  <Pie data={chart.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35} strokeWidth={0}>
                    {chart.data.map((_, j) => <Cell key={j} fill={CHART_COLORS[j % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              ) : chart.type === "area" ? (
                <AreaChart data={chart.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 20% 14%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(220 15% 50%)" }} axisLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "hsl(220 15% 50%)" }} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="value" stroke="hsl(192 95% 55%)" fill="hsl(192 95% 55%)" fillOpacity={0.2} />
                </AreaChart>
              ) : chart.type === "line" ? (
                <LineChart data={chart.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 20% 14%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(220 15% 50%)" }} axisLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "hsl(220 15% 50%)" }} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="value" stroke="hsl(192 95% 55%)" strokeWidth={2} dot={false} />
                </LineChart>
              ) : (
                <BarChart data={chart.data}>
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(220 15% 50%)" }} axisLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "hsl(220 15% 50%)" }} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chart.data.map((_, j) => <Cell key={j} fill={CHART_COLORS[j % CHART_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Insights & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {config.insights.length > 0 && (
          <div className="glass-panel-solid rounded-lg p-4">
            <h4 className="text-[10px] font-mono text-muted-foreground mb-2">&gt; INSIGHTS</h4>
            {config.insights.map((ins, i) => (
              <p key={i} className="text-xs font-mono text-foreground flex items-start gap-2 mb-1">
                <span className="text-accent">▸</span> {ins}
              </p>
            ))}
          </div>
        )}
        {config.recommendations.length > 0 && (
          <div className="glass-panel-solid rounded-lg p-4">
            <h4 className="text-[10px] font-mono text-muted-foreground mb-2">&gt; RECOMMENDATIONS</h4>
            {config.recommendations.map((rec, i) => (
              <p key={i} className="text-xs font-mono text-foreground flex items-start gap-2 mb-1">
                <span className="text-primary">●</span> {rec}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const RiskInsights = () => {
  const [logs, setLogs] = useState<ThreatLogEntry[]>(() => generateInitialLogs(50));
  const [customDashboard, setCustomDashboard] = useState<DashboardConfig | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const dashboardContext = useDashboardContext();

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => [generateThreatLog(), ...prev].slice(0, 80));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const risk = calculateRiskLevel(logs);
  const critical = logs.filter(l => l.severity === "critical").length;
  const phishing = logs.filter(l => l.threatType.includes("Phishing")).length;
  const ddos = logs.filter(l => l.threatType === "DDoS").length;
  const active = logs.filter(l => l.status === "active").length;

  const alerts: { level: "high" | "medium" | "low"; icon: any; msg: string }[] = [];
  if (critical > 5) alerts.push({ level: "high", icon: AlertTriangle, msg: `${critical} critical alerts — exceeds threshold. Immediate action needed.` });
  if (phishing > 3) alerts.push({ level: "medium", icon: TrendingUp, msg: `Phishing spike: ${phishing} incidents detected.` });
  if (ddos > 2) alerts.push({ level: "high", icon: AlertTriangle, msg: `${ddos} DDoS attacks active. Infrastructure at risk.` });
  if (active > 5) alerts.push({ level: "medium", icon: Shield, msg: `${active} active incidents pending investigation.` });
  if (alerts.length === 0) alerts.push({ level: "low", icon: Shield, msg: "All indicators normal. Continue monitoring." });

  const riskColor = risk.level === "high" ? "text-threat-high" : risk.level === "medium" ? "text-threat-medium" : "text-accent";
  const riskBg = risk.level === "high" ? "bg-threat-high/10 border-threat-high/30" : risk.level === "medium" ? "bg-threat-medium/10 border-threat-medium/30" : "bg-accent/10 border-accent/30";

  const handleGenerateDashboard = useCallback(async (prompt: string) => {
    if (!prompt.trim() || isLoading) return;
    const userMsg: ChatMessage = { role: "user", content: prompt };
    const newMsgs = [...chatMessages, userMsg];
    setChatMessages(newMsgs);
    setChatInput("");
    setIsLoading(true);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: `Generate a cybersecurity dashboard for: ${prompt}. You MUST respond with a cybernexus-dashboard JSON block.` }],
          dashboardContext,
        }),
      });

      if (!resp.ok || !resp.body) throw new Error("Request failed");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) full += content;
          } catch {}
        }
      }

      setChatMessages(prev => [...prev, { role: "assistant", content: full }]);

      // Extract dashboard JSON
      const match = full.match(/```cybernexus-dashboard\n([\s\S]*?)```/);
      if (match) {
        try {
          const config = JSON.parse(match[1].trim());
          setCustomDashboard(config);
        } catch {}
      }
    } catch (e) {
      setChatMessages(prev => [...prev, { role: "assistant", content: "⚠️ Failed to generate dashboard." }]);
    } finally {
      setIsLoading(false);
    }
  }, [chatMessages, isLoading, dashboardContext]);

  const quickPrompts = [
    "Ransomware threat overview",
    "Top 10 attack origins",
    "Critical severity breakdown",
    "DDoS & network attacks",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-mono font-bold text-foreground">AI Risk Insights</h2>
          <p className="text-xs font-mono text-muted-foreground mt-1">Automated threat assessment & custom dashboards</p>
        </div>
        <button onClick={() => setShowCustomizer(!showCustomizer)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-colors ${
            showCustomizer ? "bg-primary/20 border border-primary/30 text-primary" : "bg-secondary border border-border text-black hover:text-black"
          }`}>
          <LayoutDashboard className="w-4 h-4" />
          {showCustomizer ? "Hide Customizer" : "Custom Dashboard"}
        </button>
      </div>

      {/* Risk gauge */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className={`glass-panel-solid rounded-xl p-8 text-center ${riskBg}`}>
        <Brain className={`w-12 h-12 mx-auto mb-4 ${riskColor}`} />
        <p className="text-6xl font-mono font-bold">{risk.level === "high" ? "🔴" : risk.level === "medium" ? "🟡" : "🟢"}</p>
        <p className={`text-2xl font-mono font-bold mt-3 ${riskColor} uppercase`}>Risk Level: {risk.level}</p>
        <p className="text-sm font-mono text-muted-foreground mt-2">Composite Score: {risk.score}/100</p>
      </motion.div>

      {/* Alerts */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono text-muted-foreground">&gt; ACTIVE_ALERTS</h3>
        {alerts.map((alert, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className={`glass-panel-solid rounded-lg p-4 flex items-start gap-3 ${
              alert.level === "high" ? "border-threat-high/30" : alert.level === "medium" ? "border-threat-medium/30" : "border-accent/30"
            }`}>
            <alert.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              alert.level === "high" ? "text-threat-high" : alert.level === "medium" ? "text-threat-medium" : "text-accent"
            }`} />
            <p className="text-sm font-mono text-foreground">{alert.msg}</p>
          </motion.div>
        ))}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Critical Alerts", value: critical, threshold: 5, color: "text-threat-critical" },
          { label: "Phishing Events", value: phishing, threshold: 3, color: "text-threat-medium" },
          { label: "DDoS Attacks", value: ddos, threshold: 2, color: "text-threat-high" },
          { label: "Active Incidents", value: active, threshold: 5, color: "text-primary" },
        ].map((s, i) => (
          <div key={i} className="glass-panel-solid rounded-xl p-4">
            <p className="text-[10px] font-mono text-muted-foreground uppercase">{s.label}</p>
            <p className={`text-3xl font-mono font-bold mt-1 ${s.color}`}>{s.value}</p>
            <p className="text-[10px] font-mono text-muted-foreground">Threshold: {s.threshold}</p>
          </div>
        ))}
      </div>

      {/* Custom Dashboard Section */}
      {showCustomizer && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel-solid rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Settings2 className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-mono text-muted-foreground">&gt; DASHBOARD_CUSTOMIZER</h3>
          </div>

          {/* Quick prompts */}
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map(q => (
              <button key={q} onClick={() => handleGenerateDashboard(q)} disabled={isLoading}
                className="text-[10px] font-mono px-3 py-1.5 rounded-full bg-secondary border border-border text-black hover:text-black hover:border-primary/30 transition-colors disabled:opacity-50">
                {q}
              </button>
            ))}
          </div>

          {/* Chat input */}
          <form onSubmit={(e) => { e.preventDefault(); handleGenerateDashboard(chatInput); }} className="flex gap-2">
            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
              placeholder="Describe the dashboard you want..."
            />
            <button type="submit" disabled={!chatInput.trim() || isLoading}
              className="bg-primary text-primary-foreground p-2.5 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>

          {/* Chat log (compact) */}
          {chatMessages.length > 0 && (
            <div className="max-h-32 overflow-y-auto space-y-2 border-t border-border pt-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`text-[11px] font-mono ${msg.role === "user" ? "text-primary" : "text-muted-foreground"}`}>
                  <span className="font-bold">{msg.role === "user" ? "> " : "AI: "}</span>
                  {msg.role === "user" ? msg.content : msg.content.replace(/```cybernexus-dashboard[\s\S]*?```/g, "[Dashboard generated ✓]").slice(0, 200)}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          )}

          {/* Rendered custom dashboard */}
          {customDashboard && <RenderDashboard config={customDashboard} />}
        </motion.div>
      )}
    </div>
  );
};

export default RiskInsights;
