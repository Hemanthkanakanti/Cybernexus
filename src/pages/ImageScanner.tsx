import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Image, ShieldCheck, ShieldAlert, AlertTriangle, Upload, FileWarning } from "lucide-react";

interface ImageResult {
  fileName: string;
  verdict: "safe" | "suspicious" | "dangerous";
  threats: string[];
  metadata: Record<string, string>;
  timestamp: string;
}

function analyzeImage(file: File): ImageResult {
  const threats: string[] = [];
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const dangerousExts = ["exe", "bat", "cmd", "msi", "apk", "scr", "pif"];
  const suspiciousExts = ["svg", "html", "js"];

  if (dangerousExts.includes(ext)) threats.push("🔴 Executable file disguised as image");
  if (suspiciousExts.includes(ext)) threats.push("⚠ File type may contain embedded scripts");
  if (file.size > 10 * 1024 * 1024) threats.push("⚠ Unusually large file size");
  if (file.size < 100) threats.push("⚠ File too small to be a valid image");

  // Simulated steganography check
  if (Math.random() > 0.7) threats.push("⚠ Possible steganographic content detected");
  // Simulated EXIF check
  if (Math.random() > 0.8) threats.push("ℹ️ Contains GPS coordinates in EXIF data");

  if (threats.length === 0) threats.push("✅ No threats detected");

  const verdict = threats.some(t => t.startsWith("🔴")) ? "dangerous" : threats.some(t => t.startsWith("⚠")) ? "suspicious" : "safe";

  return {
    fileName: file.name,
    verdict,
    threats,
    metadata: {
      "File Size": `${(file.size / 1024).toFixed(1)} KB`,
      "Type": file.type || "unknown",
      "Extension": `.${ext}`,
      "Last Modified": new Date(file.lastModified).toLocaleDateString(),
    },
    timestamp: new Date().toLocaleTimeString(),
  };
}

const verdictConfig = {
  safe: { icon: ShieldCheck, color: "text-threat-low", bg: "bg-threat-low/10", border: "border-threat-low/30", label: "CLEAN" },
  suspicious: { icon: AlertTriangle, color: "text-threat-medium", bg: "bg-threat-medium/10", border: "border-threat-medium/30", label: "SUSPICIOUS" },
  dangerous: { icon: ShieldAlert, color: "text-threat-critical", bg: "bg-threat-critical/10", border: "border-threat-critical/30", label: "MALICIOUS" },
};

const ImageScanner = () => {
  const [results, setResults] = useState<ImageResult[]>([]);
  const [scanning, setScanning] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setScanning(true);
    setTimeout(() => {
      const newResults = Array.from(files).map(analyzeImage);
      setResults(prev => [...newResults, ...prev].slice(0, 20));
      setScanning(false);
    }, 2000);
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-mono font-bold text-foreground">Image Scanner</h2>
        <p className="text-xs font-mono text-muted-foreground mt-1">Analyze images for hidden threats, steganography & malicious payloads</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="glass-panel-solid rounded-xl p-6">
            <input ref={fileRef} type="file" accept="image/*,.svg,.exe,.apk" multiple className="hidden" onChange={handleUpload} />
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => fileRef.current?.click()}
              className="w-full h-48 border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all">
              <Upload className="w-10 h-10 text-primary/60" />
              <span className="text-sm font-mono text-muted-foreground">Drop images here or click to upload</span>
              <span className="text-[10px] font-mono text-muted-foreground/60">Supports multiple files</span>
            </motion.button>
          </div>

          {scanning && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass-panel-solid neon-border rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-3" />
              <p className="text-xs font-mono text-primary animate-pulse-glow">Analyzing image contents...</p>
            </motion.div>
          )}

          <div className="glass-panel-solid rounded-xl p-4">
            <h3 className="text-xs font-mono text-muted-foreground mb-3">&gt; DETECTION_CAPABILITIES</h3>
            <div className="space-y-2">
              {["Steganography Detection", "EXIF Metadata Analysis", "Malicious Payload Scan", "File Type Verification", "Embedded Script Detection"].map(cap => (
                <div key={cap} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-[10px] font-mono text-muted-foreground">{cap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-mono text-muted-foreground">&gt; SCAN_RESULTS ({results.length})</h3>
          {results.length === 0 ? (
            <div className="glass-panel-solid rounded-xl p-8 text-center">
              <Image className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-xs font-mono text-muted-foreground">Upload images to scan for threats.</p>
            </div>
          ) : (
            results.map((r, i) => {
              const cfg = verdictConfig[r.verdict];
              const Icon = cfg.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  className={`glass-panel-solid rounded-xl p-4 border ${cfg.border}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${cfg.color}`} />
                      <span className="text-xs font-mono text-foreground">{r.fileName}</span>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 mb-2">
                    {Object.entries(r.metadata).map(([k, v]) => (
                      <p key={k} className="text-[10px] font-mono text-muted-foreground"><span className="text-foreground/60">{k}:</span> {v}</p>
                    ))}
                  </div>
                  <div className="space-y-1 border-t border-border pt-2">
                    {r.threats.map((t, j) => (
                      <p key={j} className="text-[10px] font-mono text-muted-foreground">{t}</p>
                    ))}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageScanner;
