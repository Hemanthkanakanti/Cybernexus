import { useMemo } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, TrendingDown, Lightbulb, ShieldCheck } from "lucide-react";

const CHART_COLORS = [
  "hsl(192 95% 55%)", "hsl(330 80% 55%)", "hsl(162 70% 50%)",
  "hsl(270 70% 60%)", "hsl(45 95% 55%)", "hsl(0 80% 55%)",
  "hsl(210 80% 55%)", "hsl(120 60% 50%)",
];

const tooltipStyle = {
  background: "hsl(222 47% 8%)",
  border: "1px solid hsl(222 20% 16%)",
  borderRadius: "8px",
  fontSize: "11px",
  fontFamily: "JetBrains Mono",
};

const colorMap: Record<string, string> = {
  critical: "text-threat-critical",
  high: "text-threat-high",
  medium: "text-threat-medium",
  low: "text-threat-low",
  primary: "text-primary",
  accent: "text-accent",
};

interface DashboardData {
  title: string;
  description?: string;
  cards?: { label: string; value: string; change?: string; color?: string }[];
  charts?: { type: string; title: string; data: { name: string; value: number }[] }[];
  insights?: string[];
  recommendations?: string[];
}

function renderChart(chart: DashboardData["charts"][0], index: number) {
  const { type, title, data } = chart;

  return (
    <div key={index} className="bg-secondary/30 border border-border rounded-lg p-4">
      <h4 className="text-[10px] font-mono text-muted-foreground mb-3 uppercase">&gt; {title}</h4>
      <ResponsiveContainer width="100%" height={180}>
        {type === "pie" ? (
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35} strokeWidth={0}>
              {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        ) : type === "line" || type === "area" ? (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 20% 14%)" />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(220 15% 50%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "hsl(220 15% 50%)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="value" stroke="hsl(192 95% 55%)" fill="hsl(192 95% 55%)" fillOpacity={0.2} strokeWidth={2} />
          </AreaChart>
        ) : (
          <BarChart data={data}>
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(220 15% 50%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "hsl(220 15% 50%)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(222 30% 12%)" }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

export function AIDashboardRenderer({ jsonStr }: { jsonStr: string }) {
  const dashboard = useMemo<DashboardData | null>(() => {
    try { return JSON.parse(jsonStr); }
    catch { return null; }
  }, [jsonStr]);

  if (!dashboard) return null;

  return (
    <div className="my-3 border border-primary/30 rounded-xl overflow-hidden bg-card/50">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-primary/5">
        <h3 className="text-sm font-mono font-bold text-foreground">{dashboard.title}</h3>
        {dashboard.description && <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{dashboard.description}</p>}
      </div>

      <div className="p-4 space-y-4">
        {/* Metric Cards */}
        {dashboard.cards && dashboard.cards.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {dashboard.cards.map((card, i) => (
              <div key={i} className="bg-secondary/30 border border-border rounded-lg p-3">
                <p className="text-[9px] font-mono text-muted-foreground uppercase">{card.label}</p>
                <p className={`text-xl font-mono font-bold ${colorMap[card.color || "primary"] || "text-primary"}`}>{card.value}</p>
                {card.change && (
                  <span className="text-[9px] font-mono flex items-center gap-0.5 text-muted-foreground">
                    {card.change.startsWith("+") ? <TrendingUp className="w-2.5 h-2.5 text-threat-high" /> : <TrendingDown className="w-2.5 h-2.5 text-accent" />}
                    {card.change}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Charts */}
        {dashboard.charts && dashboard.charts.length > 0 && (
          <div className="grid grid-cols-1 gap-3">
            {dashboard.charts.map((chart, i) => renderChart(chart, i))}
          </div>
        )}

        {/* Insights */}
        {dashboard.insights && dashboard.insights.length > 0 && (
          <div className="bg-secondary/30 border border-border rounded-lg p-3">
            <h4 className="text-[10px] font-mono text-muted-foreground mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-3 h-3 text-threat-medium" /> KEY INSIGHTS
            </h4>
            <ul className="space-y-1">
              {dashboard.insights.map((insight, i) => (
                <li key={i} className="text-[11px] font-mono text-foreground flex gap-1.5">
                  <span className="text-primary">▸</span> {insight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {dashboard.recommendations && dashboard.recommendations.length > 0 && (
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-3">
            <h4 className="text-[10px] font-mono text-accent mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" /> RECOMMENDATIONS
            </h4>
            <ul className="space-y-1">
              {dashboard.recommendations.map((rec, i) => (
                <li key={i} className="text-[11px] font-mono text-foreground flex gap-1.5">
                  <span className="text-accent">{i + 1}.</span> {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
