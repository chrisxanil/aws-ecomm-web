import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-5">
      <div className="w-20 h-20 rounded-3xl bg-navy-900 border border-white/10 flex items-center justify-center text-cyber-neonCyan">
        <Cpu className="w-10 h-10 animate-pulse" />
      </div>
      <h1 className="text-4xl font-extrabold text-white">404 — Neural Node Offline</h1>
      <p className="text-xs sm:text-sm text-slate-400 max-w-md">
        The requested hardware route could not be resolved by our routing matrix.
      </p>
      <Link
        to="/"
        className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-purple to-indigo-600 text-white text-xs font-semibold shadow-lg shadow-cyber-purple/20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return To Home Grid</span>
      </Link>
    </div>
  );
}

