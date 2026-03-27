import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import ThreatMapPage from "./pages/ThreatMapPage";
import SeverityAnalytics from "./pages/SeverityAnalytics";
import AIAssistant from "./pages/AIAssistant";
import RiskInsights from "./pages/RiskInsights";
import ThreatAnalysis from "./pages/ThreatAnalysis";
import QRVerification from "./pages/QRVerification";
import ImageScanner from "./pages/ImageScanner";
import LinkScanner from "./pages/LinkScanner";
import DataSourcesPage from "./pages/DataSourcesPage";
import IPMonitor from "./pages/IPMonitor";
import RuleEngine from "./pages/RuleEngine";
import MitrePage from "./pages/MitrePage";
import SettingsPage from "./pages/SettingsPage";
import SystemHealth from "./pages/SystemHealth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem("cyberLoggedIn") === "true";
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="threat-map" element={<ThreatMapPage />} />
            <Route path="severity" element={<SeverityAnalytics />} />
            <Route path="ai-assistant" element={<AIAssistant />} />
            <Route path="risk-insights" element={<RiskInsights />} />
            <Route path="mitre" element={<MitrePage />} />
            <Route path="threat-analysis" element={<ThreatAnalysis />} />
            <Route path="qr-verify" element={<QRVerification />} />
            <Route path="image-scan" element={<ImageScanner />} />
            <Route path="link-scan" element={<LinkScanner />} />
            <Route path="ip-monitor" element={<IPMonitor />} />
            <Route path="rules" element={<RuleEngine />} />
            <Route path="data-sources" element={<DataSourcesPage />} />
            <Route path="health" element={<SystemHealth />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
