import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Shield, Search, ChevronDown, ChevronRight, ExternalLink, AlertTriangle } from "lucide-react";
import { mitreMatrix } from "@/lib/mockData";
import { generateInitialLogs, type ThreatLogEntry } from "@/lib/mockData";

const tacticColors: Record<string, string> = {
  "Reconnaissance": "border-blue-500/30 bg-blue-500/5",
  "Resource Development": "border-purple-500/30 bg-purple-500/5",
  "Initial Access": "border-threat-critical/30 bg-threat-critical/5",
  "Execution": "border-threat-high/30 bg-threat-high/5",
  "Persistence": "border-threat-medium/30 bg-threat-medium/5",
  "Privilege Escalation": "border-threat-high/30 bg-threat-high/5",
  "Defense Evasion": "border-accent/30 bg-accent/5",
  "Credential Access": "border-threat-critical/30 bg-threat-critical/5",
  "Discovery": "border-primary/30 bg-primary/5",
  "Lateral Movement": "border-purple-500/30 bg-purple-500/5",
  "Collection": "border-blue-500/30 bg-blue-500/5",
  "Command and Control": "border-threat-high/30 bg-threat-high/5",
  "Exfiltration": "border-threat-critical/30 bg-threat-critical/5",
  "Impact": "border-threat-critical/30 bg-threat-critical/5",
};

const MitrePage = () => {
  const [search, setSearch] = useState("");
  const [expandedTactics, setExpandedTactics] = useState<Set<string>>(new Set(["TA0001", "TA0002"]));
  const [expandedTechniques, setExpandedTechniques] = useState<Set<string>>(new Set());
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);

  // Generate mock detection data
  const logs = useMemo(() => generateInitialLogs(100), []);
  const detectionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    logs.forEach((l: any) => {
      const tactic = l.mitreTactic || "Initial Access";
      counts[tactic] = (counts[tactic] || 0) + 1;
    });
    return counts;
  }, [logs]);

  const filteredTactics = useMemo(() => {
    if (!search.trim()) return mitreMatrix.tactics;
    const q = search.toLowerCase();
    return mitreMatrix.tactics.map(tactic => ({
      ...tactic,
      techniques: tactic.techniques.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.subtechniques.some(s => s.toLowerCase().includes(q))
      ),
    })).filter(t => t.techniques.length > 0 || t.name.toLowerCase().includes(q));
  }, [search]);

  const toggleTactic = (id: string) => {
    setExpandedTactics(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleTechnique = (id: string) => {
    setExpandedTechniques(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const totalTechniques = mitreMatrix.tactics.reduce((s, t) => s + t.techniques.length, 0);
  const totalSubtechniques = mitreMatrix.tactics.reduce((s, t) => s + t.techniques.reduce((ss, tt) => ss + tt.subtechniques.length, 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-mono font-bold text-foreground">MITRE ATT&CK Framework</h2>
          <p className="text-xs font-mono text-muted-foreground mt-1">Enterprise tactics, techniques, and procedures (TTPs)</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              className="bg-input border border-border rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-foreground w-64 placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
              placeholder="Search techniques (e.g. T1566, Phishing)..."
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "TACTICS", value: mitreMatrix.tactics.length, color: "text-primary" },
          { label: "TECHNIQUES", value: totalTechniques, color: "text-threat-high" },
          { label: "SUB-TECHNIQUES", value: totalSubtechniques, color: "text-threat-medium" },
          { label: "DETECTIONS", value: logs.length, color: "text-accent" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-panel-solid rounded-xl p-4">
            <p className="text-[10px] font-mono text-muted-foreground">{stat.label}</p>
            <p className={`text-2xl font-mono font-bold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Tactic coverage bar */}
      <div className="glass-panel-solid rounded-xl p-4">
        <h3 className="text-xs font-mono text-muted-foreground mb-3">&gt; TACTIC_COVERAGE</h3>
        <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
          {mitreMatrix.tactics.map(tactic => {
            const count = detectionCounts[tactic.name] || 0;
            const maxCount = Math.max(...Object.values(detectionCounts), 1);
            const intensity = Math.max(0.2, count / maxCount);
            return (
              <div key={tactic.id}
                className="flex-1 relative group cursor-pointer transition-all hover:flex-[2]"
                style={{ background: `hsl(var(--primary) / ${intensity})` }}
                onClick={() => toggleTactic(tactic.id)}>
                <div className="absolute inset-0 flex items-center justify-center ">
                  <span className="text-[8px] group-hover:text-[12px] font-mono text-white font-bold whitespace-nowrap">{tactic.name.split(" ")[0]}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[9px] font-mono text-muted-foreground">Low coverage</span>
          <span className="text-[9px] font-mono text-muted-foreground">High coverage</span>
        </div>
      </div>

      {/* Matrix */}
      <div className="space-y-3">
        {filteredTactics.map((tactic, ti) => {
          const isExpanded = expandedTactics.has(tactic.id);
          const count = detectionCounts[tactic.name] || 0;
          const colorClass = tacticColors[tactic.name] || "border-border bg-secondary/5";

          return (
            <motion.div key={tactic.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ti * 0.03 }}
              className={`glass-panel-solid rounded-xl border ${colorClass} overflow-hidden`}>

              <button onClick={() => toggleTactic(tactic.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-3">
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  <Shield className="w-4 h-4 text-primary" />
                  <div>
                    <span className="text-sm font-mono font-bold text-foreground">{tactic.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground ml-2">{tactic.id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {count > 0 && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-threat-high">
                      <AlertTriangle className="w-3 h-3" /> {count} detections
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {tactic.techniques.length} techniques
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4">
                  <p className="text-[10px] font-mono text-muted-foreground mb-3 pl-7">{tactic.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pl-7">
                    {tactic.techniques.map(technique => {
                      const isExpTech = expandedTechniques.has(technique.id);
                      const isSelected = selectedTechnique === technique.id;
                      return (
                        <div key={technique.id}
                          className={`rounded-lg border transition-all ${isSelected ? "border-primary/50 bg-primary/5" : "border-border/50 bg-secondary/20 hover:border-primary/20"}`}>
                          <button
                            onClick={() => {
                              setSelectedTechnique(isSelected ? null : technique.id);
                              if (technique.subtechniques.length > 0) toggleTechnique(technique.id);
                            }}
                            className="w-full text-left p-2.5 flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              {technique.subtechniques.length > 0 && (
                                isExpTech ? <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" /> : <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                              )}
                              <div className="min-w-0">
                                <p className="text-[10px] font-mono text-primary">{technique.id}</p>
                                <p className="text-[11px] font-mono text-foreground truncate">{technique.name}</p>
                              </div>
                            </div>
                            {technique.subtechniques.length > 0 && (
                              <span className="text-[9px] font-mono text-muted-foreground flex-shrink-0 ml-1">
                                +{technique.subtechniques.length}
                              </span>
                            )}
                          </button>
                          {isExpTech && technique.subtechniques.length > 0 && (
                            <div className="px-2.5 pb-2.5 space-y-1 border-t border-border/30 pt-2">
                              {technique.subtechniques.map(sub => (
                                <p key={sub} className="text-[9px] font-mono text-muted-foreground pl-5 hover:text-foreground transition-colors cursor-default">
                                  • {sub}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MitrePage;
