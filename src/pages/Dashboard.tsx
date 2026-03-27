import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Map, MessageSquare, Database, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThreatMap from "@/components/ThreatMap";
import AIChatbot from "@/components/AIChatbot";
import DataPanel from "@/components/DataPanel";

type Tab = "map" | "chat" | "data";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("map");
  const navigate = useNavigate();
  const stored = localStorage.getItem("cyberUser");
  const username = stored ? JSON.parse(stored).username : "agent";

  const handleLogout = () => {
    localStorage.removeItem("cyberLoggedIn");
    navigate("/login");
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "map", label: "THREAT_MAP", icon: <Map className="w-4 h-4" /> },
    { id: "chat", label: "AI_ASSIST", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "data", label: "DATA_OPS", icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background grid-bg relative">
      <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm relative z-20">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center box-glow">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <h1 className="text-lg font-mono font-bold text-foreground">
              CYBER<span className="text-primary">SHIELD</span>
            </h1>
          </div>

          <nav className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-mono transition-all ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted-foreground">
              <span className="text-accent animate-blink">●</span>{" "}
              {username.toUpperCase()}
            </span>
            <button
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1600px] mx-auto p-4 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "map" && <ThreatMap />}
            {activeTab === "chat" && <AIChatbot />}
            {activeTab === "data" && <DataPanel />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
