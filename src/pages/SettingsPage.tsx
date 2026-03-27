import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Database, Shield, Bell, Palette, User, Server, Trash2,
  RefreshCw, Download, Eye, EyeOff, CheckCircle, AlertTriangle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

interface DbStats {
  threat_logs: number;
  threat_events: number;
  static_uploads: number;
}

const SettingsPage = () => {
  const [dbStats, setDbStats] = useState<DbStats>({ threat_logs: 0, threat_events: 0, static_uploads: 0 });
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<"database" | "general" | "notifications">("database");

  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || "bugpqcdkggtcsrjydofb";
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

  const fetchStats = async () => {
    setLoading(true);
    const [logs, events, uploads] = await Promise.all([
      supabase.from("threat_logs").select("id", { count: "exact", head: true }),
      supabase.from("threat_events").select("id", { count: "exact", head: true }),
      supabase.from("static_uploads").select("id", { count: "exact", head: true }),
    ]);
    setDbStats({
      threat_logs: logs.count ?? 0,
      threat_events: events.count ?? 0,
      static_uploads: uploads.count ?? 0,
    });
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);

  const clearTable = async (table: "threat_logs" | "threat_events" | "static_uploads") => {
    const { error } = await supabase.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) {
      toast({ title: "Error", description: `Cannot clear ${table}: ${error.message}`, variant: "destructive" });
    } else {
      toast({ title: "Cleared", description: `${table} has been purged.` });
      fetchStats();
    }
  };

  const exportTable = async (table: "threat_logs" | "threat_events" | "static_uploads") => {
    const { data, error } = await supabase.from(table).select("*").limit(5000);
    if (error || !data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${table}_export.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: `${data.length} records downloaded.` });
  };

  const tabs = [
    { id: "database" as const, label: "Database", icon: Database },
    { id: "general" as const, label: "General", icon: Palette },
    { id: "notifications" as const, label: "Alerts", icon: Bell },
  ];

  const tableInfo = [
    { name: "threat_logs", label: "Threat Logs", desc: "All threat intelligence records", count: dbStats.threat_logs, color: "text-[hsl(var(--threat-critical))]" },
    { name: "threat_events", label: "Threat Events", desc: "Map markers & geo events", count: dbStats.threat_events, color: "text-[hsl(var(--neon-glow))]" },
    { name: "static_uploads", label: "Static Uploads", desc: "Uploaded file metadata", count: dbStats.static_uploads, color: "text-[hsl(var(--neon-green))]" },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-mono font-bold text-foreground">Settings</h2>
        <p className="text-xs font-mono text-muted-foreground mt-1">
          System configuration & database management
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
              activeTab === t.id
                ? "bg-primary/10 text-primary border border-primary/30"
                : "bg-secondary text-black border border-border hover:text-black"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Database Tab */}
      {activeTab === "database" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Connection Info */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-[hsl(var(--neon-green))]" />
                <span className="text-sm font-mono font-semibold text-foreground">Cloud Connection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[hsl(var(--neon-green))] animate-pulse" />
                <span className="text-[10px] font-mono text-[hsl(var(--neon-green))]">CONNECTED</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-muted-foreground">PROJECT ID</label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    readOnly
                    value={showKey ? projectId : "••••••••••••••••"}
                    className="text-xs font-mono bg-black border-border h-8"
                  />
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowKey(!showKey)}>
                    {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-mono text-muted-foreground">STATUS</label>
                <div className="flex items-center gap-2 mt-1 h-8 px-3 rounded-md bg-black border border-border">
                  <CheckCircle className="w-3.5 h-3.5 text-[hsl(var(--neon-green))]" />
                  <span className="text-xs font-mono text-foreground">Healthy — Realtime Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {tableInfo.map((t) => (
              <div key={t.name} className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-semibold text-foreground">{t.label}</span>
                  <span className={`text-lg font-mono font-bold ${t.color}`}>{t.count.toLocaleString()}</span>
                </div>
                <p className="text-[10px] font-mono text-muted-foreground mb-3">{t.desc}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[10px] h-7 font-mono flex-1"
                    onClick={() => exportTable(t.name)}
                  >
                    <Download className="w-3 h-3 mr-1" /> Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[10px] h-7 font-mono flex-1 text-destructive hover:bg-destructive/10"
                    onClick={() => clearTable(t.name)}
                  >
                    <Trash2 className="w-3 h-3 mr-1" /> Clear
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Refresh */}
          <Button variant="outline" size="sm" className="text-xs font-mono" onClick={fetchStats} disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh Stats
          </Button>
        </motion.div>
      )}

      {/* General Tab */}
      {activeTab === "general" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="p-4 rounded-xl bg-card border border-border space-y-4">
            <h3 className="text-sm font-mono font-semibold text-foreground flex items-center gap-2">
              <Palette className="w-4 h-4" /> Preferences
            </h3>
            {/* <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-foreground">Dark Mode</p>
                <p className="text-[10px] font-mono text-muted-foreground">Cyber-optimized dark theme (always on)</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={(v) => {
                setDarkMode(v);
                document.documentElement.classList.toggle("dark", v);
              }} />
            </div> */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-foreground">Auto-Refresh Dashboard</p>
                <p className="text-[10px] font-mono text-muted-foreground">Live-update every 5 seconds</p>
              </div>
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-foreground">Data Retention</p>
                <p className="text-[10px] font-mono text-muted-foreground">Keep logs for 90 days</p>
              </div>
              <div className="px-3 py-1 rounded-md bg-secondary border border-border text-xs font-mono text-black">
                90 days
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="p-4 rounded-xl bg-card border border-border space-y-4">
            <h3 className="text-sm font-mono font-semibold text-foreground flex items-center gap-2">
              <Bell className="w-4 h-4" /> Alert Configuration
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-foreground">Critical Threat Alerts</p>
                <p className="text-[10px] font-mono text-muted-foreground">Notify on critical severity events</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-foreground">Daily Summary</p>
                <p className="text-[10px] font-mono text-muted-foreground">Email digest of daily threats</p>
              </div>
              <Switch defaultChecked={false} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-foreground">New IP Detection</p>
                <p className="text-[10px] font-mono text-muted-foreground">Alert when new IPs appear</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SettingsPage;
