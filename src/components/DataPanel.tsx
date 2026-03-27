import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Zap, FileText, Trash2, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ThreatLogRow {
  id: string;
  ip: string;
  country: string;
  threat_type: string;
  severity: string;
  status: string;
  source: string;
  description: string | null;
  timestamp: string;
}

interface UploadResult {
  totalRows: number;
  cleanedRows: number;
  nullRowsRemoved: number;
  columns: string[];
}

const severityColors: Record<string, string> = {
  critical: "bg-threat-critical text-primary-foreground",
  high: "bg-threat-high text-primary-foreground",
  medium: "bg-threat-medium text-primary-foreground",
  low: "bg-threat-low text-primary-foreground",
};

const UPLOAD_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-data`;
const AUTOGEN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auto-generate`;

const DataPanel = () => {
  const [mode, setMode] = useState<"upload" | "generate">("generate");
  const [threats, setThreats] = useState<ThreatLogRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [uploadText, setUploadText] = useState("");
  const [autoRunning, setAutoRunning] = useState(false);
  const [autoIntervalId, setAutoIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);

  // Fetch latest threats from DB
  const fetchThreats = useCallback(async () => {
    const { data, error } = await supabase
      .from("threat_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (!error && data) setThreats(data as unknown as ThreatLogRow[]);
  }, []);

  // Auto-generate threats
  const toggleAutoGenerate = useCallback(() => {
    if (autoRunning && autoIntervalId) {
      clearInterval(autoIntervalId);
      setAutoIntervalId(null);
      setAutoRunning(false);
      toast({ title: "Auto-generation stopped" });
      return;
    }

    const generate = async () => {
      try {
        await fetch(AUTOGEN_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ count: 3 }),
        });
        fetchThreats();
      } catch (e) {
        console.error("Auto-gen error:", e);
      }
    };

    generate(); // immediate first run
    const id = setInterval(generate, 8000);
    setAutoIntervalId(id);
    setAutoRunning(true);
    toast({ title: "Auto-generation started", description: "New threats every 8 seconds" });
  }, [autoRunning, autoIntervalId, fetchThreats]);

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setUploadResult(null);

    try {
      const text = await file.text();
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      let payload: any;

      if (ext === "json") {
        const parsed = JSON.parse(text);
        payload = { data: Array.isArray(parsed) ? parsed : [parsed], filename: file.name, fileType: "json" };
      } else if (ext === "csv") {
        payload = { csvText: text, filename: file.name, fileType: "csv" };
      } else {
        // Try parsing as CSV for txt/other
        payload = { csvText: text, filename: file.name, fileType: ext };
      }

      const resp = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await resp.json();
      if (!resp.ok) throw new Error(result.error || "Upload failed");

      setUploadResult(result);
      toast({
        title: "Upload successful!",
        description: `${result.cleanedRows} rows cleaned from ${result.totalRows} total. ${result.nullRowsRemoved} null rows removed.`,
      });
      fetchThreats();
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle paste/text upload
  const handleTextUpload = async () => {
    if (!uploadText.trim()) return;
    setIsLoading(true);
    setUploadResult(null);

    try {
      let payload: any;
      // Try JSON first
      try {
        const parsed = JSON.parse(uploadText);
        payload = { data: Array.isArray(parsed) ? parsed : [parsed], filename: "paste.json", fileType: "json" };
      } catch {
        // Treat as CSV
        payload = { csvText: uploadText, filename: "paste.csv", fileType: "csv" };
      }

      const resp = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await resp.json();
      if (!resp.ok) throw new Error(result.error || "Upload failed");

      setUploadResult(result);
      setUploadText("");
      toast({
        title: "Data uploaded & cleaned!",
        description: `${result.cleanedRows} clean rows, ${result.nullRowsRemoved} nulls removed.`,
      });
      fetchThreats();
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useState(() => { fetchThreats(); });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode("upload")}
          className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-mono transition-all ${
            mode === "upload" ? "bg-primary/10 text-primary border border-primary/30" : "bg-secondary text-black hover:text-black border border-border"
          }`}>
          <Upload className="w-4 h-4" /> UPLOAD_STATIC
        </button>
        <button onClick={() => setMode("generate")}
          className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-mono transition-all ${
            mode === "generate" ? "bg-primary/10 text-primary border border-primary/30" : "bg-secondary text-black hover:text-black border border-border"
          }`}>
          <Zap className="w-4 h-4" /> AUTO_GENERATE
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-xs font-mono text-muted-foreground mb-3">
            &gt; {mode === "upload" ? "DATA_INPUT" : "AUTO_FEED"}
          </h3>

          {mode === "upload" ? (
            <div className="space-y-3">
              {/* File upload */}
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/40 transition-colors">
                <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                <span className="text-[10px] font-mono text-muted-foreground">
                  Drop JSON, CSV, or text file
                </span>
                <input type="file" accept=".json,.csv,.txt,.py,.js,.xlsx" onChange={handleFileUpload} className="hidden" />
              </label>

              {/* Text paste */}
              <textarea
                value={uploadText}
                onChange={(e) => setUploadText(e.target.value)}
                rows={6}
                className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
                placeholder="Paste JSON or CSV data here..."
              />
              <button onClick={handleTextUpload} disabled={!uploadText.trim() || isLoading}
                className="w-full bg-primary text-primary-foreground font-mono text-sm py-2 rounded hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {isLoading ? "PROCESSING..." : "UPLOAD & CLEAN"}
              </button>

              {/* Upload result */}
              {uploadResult && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-accent/5 border border-accent/20 rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-2 text-accent text-xs font-mono">
                    <CheckCircle className="w-4 h-4" /> CLEANING REPORT
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground">Total rows: {uploadResult.totalRows}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">Clean rows: {uploadResult.cleanedRows}</p>
                  <p className="text-[10px] font-mono text-threat-high">Null/invalid removed: {uploadResult.nullRowsRemoved}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">Columns: {uploadResult.columns.join(", ")}</p>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                Auto-generate threat intelligence data and store it in the database. Data persists across sessions.
              </p>
              <button onClick={toggleAutoGenerate}
                className={`w-full font-mono text-sm py-2 rounded transition-colors flex items-center justify-center gap-2 ${
                  autoRunning
                    ? "bg-threat-high/20 text-threat-high border border-threat-high/30 hover:bg-threat-high/30"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}>
                {autoRunning ? (
                  <><AlertCircle className="w-4 h-4" /> STOP AUTO-GEN</>
                ) : (
                  <><Zap className="w-4 h-4" /> START AUTO-GEN</>
                )}
              </button>
              {autoRunning && (
                <div className="flex items-center gap-2 text-xs font-mono text-accent">
                  <span className="animate-pulse">●</span> Live feed active — storing to database every 8s
                </div>
              )}
            </div>
          )}
        </div>

        {/* Threat list from DB */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-4 overflow-auto" style={{ maxHeight: "calc(100vh - 240px)" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-mono text-muted-foreground">
              &gt; THREAT_DATABASE ({threats.length} entries)
            </h3>
            <button onClick={fetchThreats} className="text-[10px] font-mono text-primary hover:text-primary/80 transition-colors">
              ⟳ REFRESH
            </button>
          </div>

          <div className="space-y-2">
            {threats.map((threat, i) => (
              <motion.div key={threat.id}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className="bg-secondary/30 border border-border rounded p-3 hover:border-primary/20 transition-colors group">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <FileText className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-[10px] font-mono text-primary">{threat.threat_type}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${severityColors[threat.severity] || "bg-secondary"}`}>
                        {threat.severity.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">[{threat.source}]</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{threat.country}</span>
                    </div>
                    <p className="text-xs font-mono text-foreground/80 truncate">
                      {threat.description || `${threat.threat_type} from ${threat.ip}`}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            {threats.length === 0 && (
              <p className="text-xs font-mono text-muted-foreground text-center py-8">
                No data yet. Upload static data or start auto-generation.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPanel;
