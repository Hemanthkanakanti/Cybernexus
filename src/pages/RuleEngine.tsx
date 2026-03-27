import { useState } from "react";
import { motion } from "framer-motion";
import { Cog, Plus, Trash2, Play, Pause, Shield, Zap, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface Rule {
  id: string;
  name: string;
  condition: string;
  action: string;
  severity: string;
  active: boolean;
  triggered: number;
}

const defaultRules: Rule[] = [
  { id: "r1", name: "Block Critical IPs", condition: "severity == 'critical' AND status == 'active'", action: "AUTO_BLOCK", severity: "critical", active: true, triggered: 142 },
  { id: "r2", name: "Alert on DDoS", condition: "threat_type == 'DDoS' AND attacks > 100", action: "ALERT_SOC", severity: "high", active: true, triggered: 67 },
  { id: "r3", name: "Rate Limit Brute Force", condition: "threat_type == 'Brute Force' AND count > 10", action: "RATE_LIMIT", severity: "medium", active: true, triggered: 231 },
  { id: "r4", name: "Quarantine Ransomware", condition: "threat_type == 'Ransomware'", action: "QUARANTINE", severity: "critical", active: false, triggered: 18 },
  { id: "r5", name: "Log Phishing Attempts", condition: "threat_type == 'Phishing'", action: "LOG_ONLY", severity: "low", active: true, triggered: 445 },
  { id: "r6", name: "Block N. Korea Sources", condition: "country == 'N. Korea'", action: "AUTO_BLOCK", severity: "high", active: true, triggered: 89 },
];

const RuleEngine = () => {
  const [rules, setRules] = useState<Rule[]>(defaultRules);
  const [newName, setNewName] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [newAction, setNewAction] = useState("AUTO_BLOCK");
  const [newSeverity, setNewSeverity] = useState("high");

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
    const rule = rules.find(r => r.id === id);
    toast({
      title: rule?.active ? "Rule Deactivated" : "Rule Activated",
      description: rule?.name,
    });
  };

  const deleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
    toast({ title: "Rule Deleted", description: "Rule removed from engine" });
  };

  const addRule = () => {
    if (!newName.trim() || !newCondition.trim()) {
      toast({ title: "Error", description: "Name and condition required", variant: "destructive" });
      return;
    }
    const rule: Rule = {
      id: `r-${Date.now()}`,
      name: newName,
      condition: newCondition,
      action: newAction,
      severity: newSeverity,
      active: true,
      triggered: 0,
    };
    setRules(prev => [rule, ...prev]);
    setNewName("");
    setNewCondition("");
    toast({ title: "Rule Created", description: `"${newName}" added to engine` });
  };

  const severityColor: Record<string, string> = {
    critical: "text-threat-critical bg-threat-critical/15",
    high: "text-threat-high bg-threat-high/15",
    medium: "text-threat-medium bg-threat-medium/15",
    low: "text-threat-low bg-threat-low/15",
  };

  const actionIcons: Record<string, React.ElementType> = {
    AUTO_BLOCK: Shield,
    ALERT_SOC: AlertTriangle,
    RATE_LIMIT: Zap,
    QUARANTINE: Shield,
    LOG_ONLY: Cog,
  };

  const actions = ["AUTO_BLOCK", "ALERT_SOC", "RATE_LIMIT", "QUARANTINE", "LOG_ONLY"];
  const severities = ["critical", "high", "medium", "low"];

  const activeCount = rules.filter(r => r.active).length;
  const totalTriggered = rules.reduce((sum, r) => sum + r.triggered, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-mono font-bold text-foreground flex items-center gap-2">
          <Cog className="w-5 h-5 text-primary" /> Defense Rule Engine
        </h2>
        <p className="text-xs font-mono text-muted-foreground mt-1">
          Automated threat response rules — {activeCount} active, {totalTriggered} total triggers
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Rules", value: rules.length, color: "text-primary" },
          { label: "Active Rules", value: activeCount, color: "text-accent" },
          { label: "Total Triggers", value: totalTriggered, color: "text-threat-medium" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel-solid rounded-xl p-4 text-center">
            <p className={`text-2xl font-mono font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] font-mono text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Add Rule */}
      <div className="glass-panel-solid rounded-xl p-5">
        <h3 className="text-xs font-mono text-muted-foreground mb-3">&gt; CREATE_RULE</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Rule name"
            className="font-mono text-xs bg-black border-border" />
          <Input value={newCondition} onChange={(e) => setNewCondition(e.target.value)}
            placeholder="Condition (e.g. severity == 'critical')"
            className="font-mono text-xs bg-black border-border" />
        </div>
        <div className="flex gap-3 mt-3 items-center flex-wrap">
          <select value={newAction} onChange={(e) => setNewAction(e.target.value)}
            className="text-xs font-mono bg-black border border-border rounded-md px-3 py-2 text-foreground">
            {actions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={newSeverity} onChange={(e) => setNewSeverity(e.target.value)}
            className="text-xs font-mono bg-black border border-border rounded-md px-3 py-2 text-foreground">
            {severities.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
          </select>
          <Button onClick={addRule} size="sm" className="font-mono text-xs gap-2">
            <Plus className="w-3 h-3" /> ADD RULE
          </Button>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        {rules.map((rule, i) => {
          const ActionIcon = actionIcons[rule.action] || Cog;
          return (
            <motion.div key={rule.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-panel-solid rounded-xl p-4 border-l-2 transition-all ${
                rule.active ? "border-l-accent" : "border-l-muted-foreground opacity-60"
              }`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <ActionIcon className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm font-mono font-bold text-foreground truncate">{rule.name}</span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${severityColor[rule.severity]}`}>
                      {rule.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground truncate">
                    IF {rule.condition} → {rule.action}
                  </p>
                  <p className="text-[10px] font-mono text-primary mt-1">
                    Triggered {rule.triggered} times
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => toggleRule(rule.id)}
                    className="h-8 w-8">
                    {rule.active ? <Pause className="w-3 h-3 text-accent" /> : <Play className="w-3 h-3 text-muted-foreground" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteRule(rule.id)}
                    className="h-8 w-8 hover:bg-destructive/10">
                    <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RuleEngine;
