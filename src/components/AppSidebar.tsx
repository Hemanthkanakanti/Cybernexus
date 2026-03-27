import {
  LayoutDashboard, Map, BarChart3, Shield, Search, QrCode, Image, Link2,
  Monitor, Cog, Bot, Brain, Database, HeartPulse, Settings, ChevronLeft
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { label: "Live Threat Map", path: "/dashboard/threat-map", icon: Map },
      { label: "Severity Analytics", path: "/dashboard/severity", icon: BarChart3 },
      { label: "MITRE ATT&CK", path: "/dashboard/mitre", icon: Shield },
    ],
  },
  {
    title: "ANALYSIS",
    items: [
      { label: "Threat Analysis", path: "/dashboard/threat-analysis", icon: Search },
      { label: "QR Verification", path: "/dashboard/qr-verify", icon: QrCode },
      // { label: "Image Scanner", path: "/dashboard/image-scan", icon: Image },
      { label: "Link Scanner", path: "/dashboard/link-scan", icon: Link2 },
    ],
  },
  {
    title: "DEFENSE",
    items: [
      { label: "IP Monitoring", path: "/dashboard/ip-monitor", icon: Monitor },
      { label: "Rule Engine", path: "/dashboard/rules", icon: Cog },
      { label: "AI Assistant", path: "/dashboard/ai-assistant", icon: Bot },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "AI Risk Insights", path: "/dashboard/risk-insights", icon: Brain },
      { label: "Data Sources", path: "/dashboard/data-sources", icon: Database },
      { label: "System Health", path: "/dashboard/health", icon: HeartPulse },
      { label: "Settings", path: "/dashboard/settings", icon: Settings },
    ],
  },
];

const AppSidebar = ({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) => {

  // const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen z-30 flex flex-col transition-all duration-300 ease-in-out",
        "bg-sidebar border-r border-sidebar-border",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center box-glow flex-shrink-0">
                  <img src="/logo.jpg" alt="CyberNexus Logo" className="w-7 h-7 rounded object-contain" />

        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-mono font-bold text-foreground whitespace-nowrap">
              CYBER<span className="text-primary">NEXUS</span>
            </h1>
            <p className="text-[9px] font-mono text-muted-foreground">THREAT INTELLIGENCE</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <p className="text-[10px] font-mono text-muted-foreground px-3 mb-2 tracking-wider">
                {group.title}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-xs font-mono transition-all duration-200 group relative",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-black hover:bg-secondary"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r sidebar-glow-indicator" />
                    )}
                    <item.icon className={cn(
                      "w-4 h-4 flex-shrink-0 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-black"
                    )} />
                    {!collapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
  onClick={onToggle}

        className="flex items-center justify-center h-10 border-t border-sidebar-border text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
      </button>
    </aside>
  );
};

export default AppSidebar;
