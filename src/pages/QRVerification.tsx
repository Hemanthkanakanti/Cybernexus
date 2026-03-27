import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { QrCode, Shield, ShieldAlert, ShieldCheck, Upload, Link, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ScanResult {
  url: string;
  verdict: "safe" | "suspicious" | "dangerous";
  score: number;
  details: string[];
  timestamp: string;
}

const maliciousPatterns = [
  /bit\.ly/i, /tinyurl/i, /t\.co/i, /goo\.gl/i,
  /\.ru\//i, /\.cn\//i, /free.*prize/i, /login.*verify/i,
  /paypal.*secure/i, /bank.*update/i, /\.exe$/i, /\.apk$/i,
];

const suspiciousPatterns = [
  /redirect/i, /track/i, /click/i, /aff=/i,
  /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, // raw IP
  /http:\/\//i, // non-https
];

function analyzeURL(url: string): ScanResult {
  const isDangerous = maliciousPatterns.some(p => p.test(url));
  const isSuspicious = suspiciousPatterns.some(p => p.test(url));
  const details: string[] = [];
  let score = 100;

  if (!url.startsWith("https://")) { details.push("⚠ Not using HTTPS encryption"); score -= 20; }
  if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)) { details.push("🔴 Uses raw IP address instead of domain"); score -= 30; }
  if (maliciousPatterns.some(p => p.test(url))) { details.push("🔴 Matches known malicious URL patterns"); score -= 40; }
  if (/redirect|track|click/i.test(url)) { details.push("⚠ Contains redirect/tracking parameters"); score -= 15; }
  if (url.length > 200) { details.push("⚠ Unusually long URL"); score -= 10; }
  if (/\.(exe|apk|bat|cmd|msi)$/i.test(url)) { details.push("🔴 Links to executable file"); score -= 35; }
  if (score === 100) details.push("✅ No suspicious indicators found");

  score = Math.max(0, score);
  const verdict = isDangerous || score < 40 ? "dangerous" : isSuspicious || score < 70 ? "suspicious" : "safe";

  return { url, verdict, score, details, timestamp: new Date().toLocaleTimeString() };
}

const verdictConfig = {
  safe: { icon: ShieldCheck, color: "text-threat-low", bg: "bg-threat-low/10", border: "border-threat-low/30", label: "SAFE" },
  suspicious: { icon: AlertTriangle, color: "text-threat-medium", bg: "bg-threat-medium/10", border: "border-threat-medium/30", label: "SUSPICIOUS" },
  dangerous: { icon: ShieldAlert, color: "text-threat-critical", bg: "bg-threat-critical/10", border: "border-threat-critical/30", label: "DANGEROUS" },
};

const QRVerification = () => {
  const [urlInput, setUrlInput] = useState("");
  const [results, setResults] = useState<ScanResult[]>([]);
  const [scanning, setScanning] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleScan = (url: string) => {
    if (!url.trim()) return;
    setScanning(true);
    setTimeout(() => {
      const result = analyzeURL(url.trim());
      setResults(prev => [result, ...prev].slice(0, 10));
      setScanning(false);
      setUrlInput("");
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Simulate QR code extraction from image
    setScanning(true);
    setTimeout(() => {
      const simulatedUrls = [
        "https://example.com/safe-page",
        "http://192.168.1.1/admin/login",
        "https://bit.ly/3xMalware",
        "https://legitimate-store.com/product/12345",
        "http://free-prize-winner.ru/claim",
      ];
      const url = simulatedUrls[Math.floor(Math.random() * simulatedUrls.length)];
      const result = analyzeURL(url);
      setResults(prev => [result, ...prev].slice(0, 10));
      setScanning(false);
    }, 2000);
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-mono font-bold text-foreground">QR Code Verification</h2>
        <p className="text-xs font-mono text-muted-foreground mt-1">Scan QR codes or paste URLs to check for threats</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="glass-panel-solid rounded-xl p-6">
            <h3 className="text-sm font-mono text-foreground mb-4 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-primary" /> Upload QR Code Image
            </h3>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => fileRef.current?.click()}
              className="w-full h-40 border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all">
              <Upload className="w-8 h-8 text-primary/60" />
              <span className="text-xs font-mono text-muted-foreground">Click to upload QR code image</span>
              <span className="text-[10px] font-mono text-muted-foreground/60">PNG, JPG, SVG supported</span>
            </motion.button>
          </div>

          <div className="glass-panel-solid rounded-xl p-6">
            <h3 className="text-sm font-mono text-foreground mb-4 flex items-center gap-2">
              <Link className="w-4 h-4 text-primary" /> Or Paste URL Directly
            </h3>
            <div className="flex gap-2">
              <Input value={urlInput} onChange={e => setUrlInput(e.target.value)}
                placeholder="https://example.com/..."
                className="font-mono text-xs bg-black border-border"
                onKeyDown={e => e.key === "Enter" && handleScan(urlInput)} />
              <Button onClick={() => handleScan(urlInput)} disabled={scanning || !urlInput.trim()}
                className="font-mono text-xs shrink-0">
                {scanning ? "Scanning..." : "Analyze"}
              </Button>
            </div>
          </div>

          {scanning && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass-panel-solid neon-border rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-3" />
              <p className="text-xs font-mono text-primary animate-pulse-glow">Scanning for threats...</p>
            </motion.div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono text-muted-foreground">&gt; SCAN_RESULTS ({results.length})</h3>
          {results.length === 0 ? (
            <div className="glass-panel-solid rounded-xl p-8 text-center">
              <Shield className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-xs font-mono text-muted-foreground">No scans yet. Upload a QR code or paste a URL.</p>
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
                      <Icon className={`w-5 h-5 ${cfg.color}`} />
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">{r.timestamp}</span>
                  </div>
                  <p className="text-xs font-mono text-foreground/80 break-all mb-2">{r.url}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono text-muted-foreground">Trust Score:</span>
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${r.score > 70 ? "bg-threat-low" : r.score > 40 ? "bg-threat-medium" : "bg-threat-critical"}`}
                        style={{ width: `${r.score}%` }} />
                    </div>
                    <span className={`text-[10px] font-mono font-bold ${cfg.color}`}>{r.score}%</span>
                  </div>
                  <div className="space-y-1">
                    {r.details.map((d, j) => (
                      <p key={j} className="text-[10px] font-mono text-muted-foreground">{d}</p>
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

export default QRVerification;
