import { Outlet, useNavigate } from "react-router-dom";
import { LogOut, ShieldAlert } from "lucide-react";
import AppSidebar from "./AppSidebar";
import { useAdminRole } from "@/hooks/useAdminRole";
import { cn } from "@/lib/utils";
import { useState } from "react";


const DashboardLayout = () => {
  const navigate = useNavigate();
  const stored = localStorage.getItem("cyberUser");
  const username = stored ? JSON.parse(stored).username : "agent";
  const { isAdmin, role } = useAdminRole();
  const [collapsed, setCollapsed] = useState(false);


  const handleLogout = () => {
    localStorage.removeItem("cyberLoggedIn");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />


     <div className={cn(collapsed ? "ml-16" : "ml-60", "min-h-screen flex flex-col transition-all duration-300")}>

        <header className="h-14 border-b border-border bg-card/60 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted-foreground">SYSTEM STATUS:</span>
            <span className="text-[12px] font-mono text-white flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> OPERATIONAL
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isAdmin && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-threat-critical px-2 py-1 rounded bg-threat-critical/10 border border-threat-critical/20">
                <ShieldAlert className="w-3 h-3" /> ADMIN
              </span>
            )}
            {!isAdmin && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-black px-2 py-1 rounded bg-secondary border border-border">
                USER
              </span>
            )}
            <span className="text-xs font-mono text-muted-foreground">
              <span className="text-primary animate-pulse">●</span> {username.toUpperCase()}
            </span>
            <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded hover:bg-destructive/10">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
