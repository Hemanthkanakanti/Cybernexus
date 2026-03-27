import { useLocation } from "react-router-dom";
import { Construction } from "lucide-react";

const titles: Record<string, string> = {
  "/dashboard/mitre": "MITRE ATT&CK Framework",
  "/dashboard/threat-analysis": "Threat Analysis",
  "/dashboard/qr-verify": "QR Verification",
  "/dashboard/image-scan": "Image Scanner",
  "/dashboard/link-scan": "Link Scanner",
  "/dashboard/ip-monitor": "IP Monitoring",
  "/dashboard/rules": "Rule Engine",
  "/dashboard/data-sources": "Data Sources",
  "/dashboard/health": "System Health",
  "/dashboard/settings": "Settings",
};

const PlaceholderPage = () => {
  const location = useLocation();
  const title = titles[location.pathname] || "Page";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
        <Construction className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-mono font-bold text-foreground mb-2">{title}</h2>
      <p className="text-sm font-mono text-muted-foreground max-w-md">
        This module is under development. Advanced features for {title.toLowerCase()} will be available in an upcoming release.
      </p>
      <div className="mt-6 px-4 py-2 rounded-lg bg-secondary border border-border">
        <p className="text-xs font-mono text-muted-foreground">
          STATUS: <span className="text-threat-medium">IN_DEVELOPMENT</span>
        </p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
