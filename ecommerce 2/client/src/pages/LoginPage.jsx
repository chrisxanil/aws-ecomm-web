import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Mail,
  Cpu,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Loader2
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl glass-card bg-navy-900/90 border border-white/10 p-8 sm:p-10 shadow-2xl relative space-y-6">
        
        {/* Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-cyber-purple/20 blur-2xl rounded-full pointer-events-none" />

        {/* Logo Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyber-purple to-cyber-cyan p-0.5 shadow-lg shadow-cyber-purple/20 mb-2">
            <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
              <Cpu className="w-6 h-6 text-cyber-neonCyan" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Access Neural Grid</h1>
          <p className="text-xs text-slate-400">
            Sign in to manage your hardware orders, subscriptions, and AI accelerators.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-mono">Account Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@enterprise.ai"
                className="w-full bg-navy-950 text-white pl-10 pr-3 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-cyan"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-mono">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-navy-950 text-white pl-10 pr-3 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-purple"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-cyber-purple to-indigo-600 hover:opacity-90 text-white shadow-lg shadow-cyber-purple/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authorizing Session...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast-Fill Buttons */}
        <div className="pt-2 border-t border-white/5 space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block text-center">
            One-Click Quick Evaluation Logins:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('alex@nexacart.ai', 'Password123!')}
              className="p-2 rounded-xl bg-navy-800 hover:bg-navy-750 border border-white/5 hover:border-cyber-cyan/50 text-slate-300 hover:text-white transition-all text-left flex items-center space-x-2"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyber-cyan flex-shrink-0" />
              <div className="truncate">
                <div className="font-semibold text-[11px] text-white">Client Alex</div>
                <div className="text-[9px] font-mono text-slate-400 truncate">alex@nexacart.ai</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin@nexacart.ai', 'Password123!')}
              className="p-2 rounded-xl bg-navy-800 hover:bg-navy-750 border border-white/5 hover:border-cyber-purple/50 text-slate-300 hover:text-white transition-all text-left flex items-center space-x-2"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyber-purple flex-shrink-0" />
              <div className="truncate">
                <div className="font-semibold text-[11px] text-white">Admin Commander</div>
                <div className="text-[9px] font-mono text-slate-400 truncate">admin@nexacart.ai</div>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom register link */}
        <p className="text-center text-xs text-slate-400">
          Need an account?{' '}
          <Link to="/register" className="text-cyber-neonCyan hover:underline font-semibold">
            Create Neural Credentials
          </Link>
        </p>

      </div>
    </div>
  );
}

