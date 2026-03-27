import { useState } from "react";
import { Filter, X, Calendar, Globe, Shield, Crosshair, SlidersHorizontal } from "lucide-react";
import { allThreatTypes, allCities } from "@/lib/mockData";

export interface DashboardFilterState {
  severity: string[];
  country: string[];
  threatType: string[];
  status: string[];
  dateRange: "1h" | "6h" | "24h" | "7d" | "30d" | "all";
  mitreTactic: string[];
  confidenceMin: number;
}

const defaultFilters: DashboardFilterState = {
  severity: [],
  country: [],
  threatType: [],
  status: [],
  dateRange: "24h",
  mitreTactic: [],
  confidenceMin: 0,
};

const allCountries = [...new Set(allCities.map(c => c.country))].sort();
const allStatuses = ["blocked", "mitigated", "active", "investigating"];
const allSeverities = ["critical", "high", "medium", "low"];
const allMitreTactics = ["Initial Access", "Execution", "Persistence", "Privilege Escalation", "Defense Evasion", "Credential Access", "Discovery", "Lateral Movement", "Collection", "Exfiltration", "Impact", "Command and Control", "Resource Development", "Reconnaissance"];
const dateRanges = [
  { key: "1h", label: "1H" }, { key: "6h", label: "6H" }, { key: "24h", label: "24H" },
  { key: "7d", label: "7D" }, { key: "30d", label: "30D" }, { key: "all", label: "ALL" },
] as const;

const sevColors: Record<string, string> = {
  critical: "bg-threat-critical/20 text-threat-critical border-threat-critical/30",
  high: "bg-threat-high/20 text-threat-high border-threat-high/30",
  medium: "bg-threat-medium/20 text-threat-medium border-threat-medium/30",
  low: "bg-threat-low/20 text-threat-low border-threat-low/30",
};

interface Props {
  filters: DashboardFilterState;
  onChange: (f: DashboardFilterState) => void;
}

export function DashboardFilters({ filters, onChange }: Props) {
  const [showPanel, setShowPanel] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleArrayFilter = (key: keyof DashboardFilterState, value: string) => {
    const arr = filters[key] as string[];
    const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
    onChange({ ...filters, [key]: next });
  };

  const activeFilterCount = filters.severity.length + filters.country.length + filters.threatType.length + filters.status.length + filters.mitreTactic.length + (filters.confidenceMin > 0 ? 1 : 0) + (filters.dateRange !== "24h" ? 1 : 0);

  const clearAll = () => onChange({ ...defaultFilters });

  return (
    <div className="space-y-3">
      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => setShowPanel(!showPanel)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-mono transition-colors border ${showPanel ? "bg-primary/20 border-primary/30 text-primary" : "bg-black border-border text-muted-foreground hover:text-foreground"}`}>
          <SlidersHorizontal className="w-3 h-3" />
          FILTERS
          {activeFilterCount > 0 && <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center">{activeFilterCount}</span>}
        </button>

        {/* Date range slicer */}
        <div className="flex gap-0.5 bg-secondary rounded-lg p-0.5 border border-border">
          {dateRanges.map(d => (
            <button key={d.key} onClick={() => onChange({ ...filters, dateRange: d.key })}
              className={`text-[9px] font-mono px-2 py-1 rounded transition-colors ${filters.dateRange === d.key ? "bg-black text-white" : "text-black hover:text-black"}`}>
              {d.label}
            </button>
          ))}
        </div>

        {/* Severity quick filters */}
        <div className="flex gap-1">
          {allSeverities.map(s => (
            <button key={s} onClick={() => toggleArrayFilter("severity", s)}
              className={`text-[9px] font-mono px-2 py-1 rounded-full border transition-colors ${filters.severity.includes(s) ? sevColors[s] : "border-border text-muted-foreground hover:text-foreground"}`}>
              {s.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Status quick filters */}
        <div className="flex gap-1">
          {allStatuses.map(s => (
            <button key={s} onClick={() => toggleArrayFilter("status", s)}
              className={`text-[9px] font-mono px-2 py-1 rounded-full border transition-colors ${filters.status.includes(s) ? "bg-primary/20 border-primary/30 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
              {s.toUpperCase()}
            </button>
          ))}
        </div>

        {activeFilterCount > 0 && (
          <button onClick={clearAll} className="flex items-center gap-1 text-[9px] font-mono text-muted-foreground hover:text-destructive transition-colors">
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Expanded filter panel */}
      {showPanel && (
        <div className="glass-panel-solid rounded-xl p-4 space-y-4 border border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Country filter */}
            <div>
              <p className="text-[10px] font-mono text-muted-foreground mb-2 flex items-center gap-1"><Globe className="w-3 h-3" /> COUNTRY</p>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {allCountries.slice(0, 40).map(c => (
                  <button key={c} onClick={() => toggleArrayFilter("country", c)}
                    className={`block w-full text-left text-[10px] font-mono px-2 py-1 rounded transition-colors ${filters.country.includes(c) ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                    {filters.country.includes(c) && "✓ "}{c}
                  </button>
                ))}
              </div>
            </div>

            {/* Threat type filter */}
            <div>
              <p className="text-[10px] font-mono text-muted-foreground mb-2 flex items-center gap-1"><Crosshair className="w-3 h-3" /> THREAT TYPE</p>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {allThreatTypes.slice(0, 30).map(t => (
                  <button key={t} onClick={() => toggleArrayFilter("threatType", t)}
                    className={`block w-full text-left text-[10px] font-mono px-2 py-1 rounded transition-colors ${filters.threatType.includes(t) ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                    {filters.threatType.includes(t) && "✓ "}{t}
                  </button>
                ))}
              </div>
            </div>

            {/* MITRE Tactic filter */}
            <div>
              <p className="text-[10px] font-mono text-muted-foreground mb-2 flex items-center gap-1"><Shield className="w-3 h-3" /> MITRE TACTIC</p>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {allMitreTactics.map(t => (
                  <button key={t} onClick={() => toggleArrayFilter("mitreTactic", t)}
                    className={`block w-full text-left text-[10px] font-mono px-2 py-1 rounded transition-colors ${filters.mitreTactic.includes(t) ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                    {filters.mitreTactic.includes(t) && "✓ "}{t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Confidence slider */}
          <div>
            <p className="text-[10px] font-mono text-muted-foreground mb-2">CONFIDENCE MINIMUM: {filters.confidenceMin}%</p>
            <input type="range" min={0} max={100} step={5} value={filters.confidenceMin}
              onChange={e => onChange({ ...filters, confidenceMin: parseInt(e.target.value) })}
              className="w-full h-1.5 rounded-full bg-secondary appearance-none cursor-pointer accent-primary" />
          </div>
        </div>
      )}
    </div>
  );
}

export { defaultFilters };
export type { DashboardFilterState as FilterState };
