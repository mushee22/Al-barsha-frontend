import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Lock, FileText, ArrowRight } from "lucide-react";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/");
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f9] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Branding Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center font-serif text-3xl font-bold text-white shadow-lg mb-4">
            B
          </div>
          <h1 className="text-2xl font-bold text-navy text-center">Al Barsha</h1>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-semibold">
            Documents Typing & Copying
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="text-accent" size={20} />
            <h2 className="text-lg font-bold text-slate-800">Admin Login</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                autoFocus
                className={`w-full bg-slate-50 border ${error ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-accent focus:ring-accent/10"
                  } rounded-xl px-4 py-3 text-sm transition-all outline-none focus:ring-4`}
                placeholder="admin@albarsha.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className={`w-full bg-slate-50 border ${error ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-accent focus:ring-accent/10"
                  } rounded-xl px-4 py-3 text-sm transition-all outline-none focus:ring-4`}
                placeholder="••••••••"
              />
              {error && <p className="text-red-500 text-xs mt-2 ml-1 font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-hover text-white font-bold rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-all shadow-md shadow-accent/20 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Al Barsha Admin</p>
          <p className="mt-1 flex items-center justify-center gap-1">
            <FileText size={12} /> Billing & Dashboard System
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
