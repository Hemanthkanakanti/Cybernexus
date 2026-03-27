import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, User, Lock, KeyRound } from "lucide-react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !password) { setError("All fields are required"); return; }
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    
    const role = adminCode === "CYBER-ADMIN-2026" ? "admin" : "user";
    localStorage.setItem("cyberUser", JSON.stringify({ username, password, role }));
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background grid-bg relative overflow-hidden">
      <div className="absolute inset-0 scanline opacity-30" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md mx-4 relative z-10">
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.8 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mb-4 box-glow">
            
            <img src="/logo.jpg" alt="CyberNexus Logo" className="w-12 h-12 rounded object-contain" />
          </motion.div>
          <h1 className="text-2xl font-mono font-bold text-foreground text-glow">CYBER<span className="text-primary">NEXUS</span></h1>
          
        </div>

        <div className="bg-card border border-border rounded-lg p-6 box-glow">
          <h2 className="text-lg font-mono font-semibold text-foreground mb-1">&gt; CREATE_ACCOUNT</h2>
          <p className="text-muted-foreground text-xs font-mono mb-6">Initialize your secure credentials</p>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded px-3 py-2 mb-4">
              <p className="text-destructive text-xs font-mono">[ERROR] {error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-1.5">USERNAME</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                  className="w-full bg-input border border-border rounded px-9 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
                  placeholder="agent_name" />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-1.5">PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-input border border-border rounded px-9 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-1.5">CONFIRM_PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full bg-input border border-border rounded px-9 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
                  placeholder="••••••••" />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-1.5">ADMIN CODE <span className="text-muted-foreground/50">(optional)</span></label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="password" value={adminCode} onChange={e => setAdminCode(e.target.value)}
                  className="w-full bg-input border border-border rounded px-9 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
                  placeholder="Leave blank for standard user" />
              </div>
            </div>

            <button type="submit" className="w-full bg-primary text-primary-foreground font-mono font-semibold py-2.5 rounded hover:bg-primary/90 transition-colors text-sm">&gt; INITIALIZE</button>
          </form>

          <p className="text-center text-xs font-mono text-muted-foreground mt-4">
            Already have credentials? <Link to="/login" className="text-primary hover:underline">LOGIN</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
