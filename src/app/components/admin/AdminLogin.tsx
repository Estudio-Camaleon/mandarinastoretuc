import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Simulate auth delay
    await new Promise((r) => setTimeout(r, 600));
    if (email === "admin@stkrco.com" && password === "admin123") {
      onLogin();
    } else {
      setError("Invalid credentials. Try admin@stkrco.com / admin123");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="font-['Barlow_Condensed'] text-5xl font-black tracking-tight text-foreground">
            STKR<span className="text-primary">.</span>CO
          </div>
          <div className="text-xs font-['Barlow_Condensed'] tracking-widest text-muted-foreground uppercase mt-1">
            Admin Panel
          </div>
        </div>

        <div className="border border-border bg-card p-8">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={16} className="text-primary" />
            <h1 className="font-['Barlow_Condensed'] text-xl font-700 uppercase tracking-wider text-foreground">
              Sign In
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@stkrco.com"
                className="w-full bg-secondary border border-border px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-secondary border border-border px-4 py-3 pr-10 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 px-3 py-2 font-['Barlow_Condensed']">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 font-['Barlow_Condensed'] text-base font-700 tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "SIGNING IN..." : "SIGN IN →"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <div className="text-xs text-muted-foreground font-['Barlow_Condensed'] tracking-wide">
              Demo: admin@stkrco.com / admin123
            </div>
          </div>
        </div>

        <button
          onClick={onBack}
          className="w-full mt-4 text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors py-2"
        >
          ← BACK TO STORE
        </button>
      </div>
    </div>
  );
}
