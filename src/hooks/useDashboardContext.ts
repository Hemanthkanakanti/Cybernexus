import { useMemo } from "react";

// Shared live data snapshot for the AI chatbot to understand the dashboard
// This pulls from the same seed + auto-gen logic used by ThreatMap & DataPanel
export function useDashboardContext() {
  return useMemo(() => ({
    threatMap: {
      description: "Live global threat map showing active cyber attack origins",
      activeThreats: [
        { city: "Moscow", country: "Russia", type: "State-sponsored APT", level: "critical", attacks: 2847 },
        { city: "Beijing", country: "China", type: "Cyber Espionage", level: "critical", attacks: 3102 },
        { city: "Pyongyang", country: "N. Korea", type: "Ransomware", level: "high", attacks: 1205 },
        { city: "Tehran", country: "Iran", type: "DDoS Campaigns", level: "high", attacks: 987 },
        { city: "Lagos", country: "Nigeria", type: "Phishing/BEC", level: "medium", attacks: 654 },
        { city: "São Paulo", country: "Brazil", type: "Banking Trojans", level: "medium", attacks: 432 },
        { city: "Mumbai", country: "India", type: "Data Breaches", level: "medium", attacks: 567 },
        { city: "Kyiv", country: "Ukraine", type: "Wiper Malware", level: "high", attacks: 1456 },
        { city: "Shanghai", country: "China", type: "Supply Chain", level: "high", attacks: 1890 },
      ],
    },
    threatDatabase: {
      description: "Auto-generated threat intelligence feed",
      recentThreats: [
        { type: "Ransomware", severity: "critical", description: "LockBit 3.0 variant targeting healthcare via RDP" },
        { type: "Phishing", severity: "high", description: "Spear-phishing impersonating Microsoft 365 admin" },
        { type: "Zero-Day", severity: "critical", description: "CVE-2026-1234: RCE in popular CMS plugin" },
        { type: "DDoS", severity: "medium", description: "IoT botnet targeting financial services" },
        { type: "Supply Chain", severity: "critical", description: "Compromised npm package injecting cryptominer" },
      ],
    },
  }), []);
}
