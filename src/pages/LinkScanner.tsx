import { useState } from "react";
import { motion } from "framer-motion";
import { Link2, ShieldCheck, ShieldAlert, AlertTriangle, ExternalLink, Globe, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LinkResult {
  url: string;
  verdict: "safe" | "suspicious" | "dangerous";
  score: number;
  checks: { label: string; status: "pass" | "warn" | "fail"; detail: string }[];
  redirectChain: string[];
  timestamp: string;
}

function deepScanLink(url: string): LinkResult {
  const checks: LinkResult["checks"] = [];
  let score = 100;

  // SSL Check
  const isHTTPS = url.startsWith("https://");
  checks.push({ label: "SSL Certificate", status: isHTTPS ? "pass" : "fail", detail: isHTTPS ? "Valid HTTPS connection" : "No SSL encryption" });
  if (!isHTTPS) score -= 25;

  // Domain reputation
  const badDomains = ["malware", "phish", "hack", "free-money", "prize"];
  const hasBadDomain = badDomains.some(d => url.toLowerCase().includes(d));
  checks.push({ label: "Domain Reputation", status: hasBadDomain ? "fail" : "pass", detail: hasBadDomain ? "Domain flagged in threat databases" : "Domain has clean reputation" });
  if (hasBadDomain) score -= 35;

  // URL structure
  const hasIP = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url);
  checks.push({ label: "URL Structure", status: hasIP ? "warn" : "pass", detail: hasIP ? "Uses raw IP instead of domain name" : "Normal domain structure" });
  if (hasIP) score -= 20;

  // Redirect check (simulated)
  const hasRedirect = /redirect|redir|goto|click|bit\.ly|tinyurl/i.test(url);
  const redirectChain = hasRedirect
    ? [url, `https://redirect-${Math.random().toString(36).slice(2, 6)}.com/track`, `https://final-destination.com/page`]
    : [url];
  checks.push({ label: "Redirect Analysis", status: hasRedirect ? "warn" : "pass", detail: hasRedirect ? `${redirectChain.length} redirects detected` : "No redirects" });
  if (hasRedirect) score -= 15;

  // File download check
  const downloadExts = /\.(exe|msi|apk|bat|cmd|ps1|sh|zip|rar)$/i;
  const hasDownload = downloadExts.test(url);
  checks.push({ label: "Download Risk", status: hasDownload ? "fail" : "pass", detail: hasDownload ? "Links to downloadable executable" : "No direct downloads" });
  if (hasDownload) score -= 30;

  // Phishing similarity
  const phishKeywords = /paypal|apple|google|microsoft|amazon|bank/i;
  const looksPhishy = phishKeywords.test(url) && (hasIP || !isHTTPS);
  checks.push({ label: "Phishing Check", status: looksPhishy ? "fail" : "pass", detail: looksPhishy ? "Possible phishing attempt" : "No phishing indicators" });
  if (looksPhishy) score -= 30;

  score = Math.max(0, score);
  const verdict = score < 40 ? "dangerous" : score < 70 ? "suspicious" : "safe";

  return { url, verdict, score, checks, redirectChain, timestamp: new Date().toLocaleTimeString() };
}

const statusIcon = { pass: "🟢", warn: "🟡", fail: "🔴" };

const LinkScanner = () => {
  const [urlInput, setUrlInput] = useState("");
  const [results, setResults] = useState<LinkResult[]>([]);
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    if (!urlInput.trim()) return;
    setScanning(true);
    setTimeout(() => {
      const result = deepScanLink(urlInput.trim());
      setResults(prev => [result, ...prev].slice(0, 15));
      setScanning(false);
      setUrlInput("");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-mono font-bold text-foreground">Link Scanner</h2>
        <p className="text-xs font-mono text-muted-foreground mt-1">Deep scan URLs for phishing, malware, redirects & security risks</p>
      </div>

      <div className="glass-panel-solid rounded-xl p-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={urlInput} onChange={e => setUrlInput(e.target.value)}
              placeholder="Enter URL to scan (e.g. https://example.com)"
              className="pl-10 font-mono text-xs bg-black border-border"
              onKeyDown={e => e.key === "Enter" && handleScan()} />
          </div>
          <Button onClick={handleScan} disabled={scanning || !urlInput.trim()} className="font-mono text-xs">
            {scanning ? "Scanning..." : "Deep Scan"}
          </Button>
        </div>

        <div className="flex gap-2 mt-3 flex-wrap">
          {["https://google.com", "http://192.168.1.1/admin", "https://bit.ly/3xTest", "https://paypal-secure.phishing.com/verify"].map(ex => (
            <button key={ex} onClick={() => setUrlInput(ex)}
              className="text-[10px] font-mono px-2 py-1 rounded bg-black border border-border hover:border-primary/30 text-muted-foreground transition-colors">
              {ex.length > 35 ? ex.slice(0, 35) + "..." : ex}
            </button>
          ))}
        </div>
      </div>

      {scanning && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="glass-panel-solid neon-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <div>
              <p className="text-xs font-mono text-primary animate-pulse-glow">Running deep scan...</p>
              <p className="text-[10px] font-mono text-muted-foreground">Checking SSL, reputation, redirects, phishing patterns</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {results.map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass-panel-solid rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {r.verdict === "safe" ? <ShieldCheck className="w-5 h-5 text-threat-low" /> :
                  r.verdict === "suspicious" ? <AlertTriangle className="w-5 h-5 text-threat-medium" /> :
                  <ShieldAlert className="w-5 h-5 text-threat-critical" />}
                <span className={`text-sm font-mono font-bold ${
                  r.verdict === "safe" ? "text-threat-low" : r.verdict === "suspicious" ? "text-threat-medium" : "text-threat-critical"
                }`}>{r.verdict.toUpperCase()}</span>
                <span className="text-xs font-mono text-muted-foreground">Score: {r.score}/100</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">{r.timestamp}</span>
            </div>

            <p className="text-xs font-mono text-foreground/80 break-all mb-3 flex items-center gap-1">
              {r.url.startsWith("https") ? <Lock className="w-3 h-3 text-threat-low shrink-0" /> : <Unlock className="w-3 h-3 text-threat-critical shrink-0" />}
              {r.url}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {r.checks.map((c, j) => (
                <div key={j} className="flex items-start gap-2 p-2 rounded bg-secondary/50">
                  <span className="text-xs">{statusIcon[c.status]}</span>
                  <div>
                    <p className="text-[10px] font-mono font-bold text-foreground">{c.label}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">{c.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {r.redirectChain.length > 1 && (
              <div className="border-t border-border pt-2">
                <p className="text-[10px] font-mono text-muted-foreground mb-1">Redirect Chain:</p>
                <div className="flex items-center gap-1 flex-wrap">
                  {r.redirectChain.map((u, j) => (
                    <span key={j} className="flex items-center gap-1">
                      <span className="text-[10px] font-mono text-foreground/60 break-all">{u.length > 30 ? u.slice(0, 30) + "..." : u}</span>
                      {j < r.redirectChain.length - 1 && <span className="text-primary">→</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LinkScanner;
