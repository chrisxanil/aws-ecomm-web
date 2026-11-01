import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Cpu,
  Zap,
  ShieldCheck,
  Bot,
  Activity,
  Layers
} from 'lucide-react';

export default function HeroSection({ onOpenAIModal }) {
  const [quickPrompt, setQuickPrompt] = useState('');

  const handlePromptSubmit = (e) => {
    e.preventDefault();
    onOpenAIModal(quickPrompt);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyber-purple/20 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-cyber-cyan/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-1/4 w-[450px] h-[320px] bg-indigo-600/15 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Grid line overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-navy-800/80 border border-cyber-purple/40 text-xs font-mono text-slate-300 shadow-lg shadow-cyber-purple/10 mb-8 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-700">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-neonCyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-cyan"></span>
          </span>
          <span className="text-cyber-neonCyan font-semibold">NEXA ARCHITECTURE 4.0</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">Next-Gen Neural Compute & Autonomous Hardware</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1] mb-6">
          Architect The Intelligence Era With{' '}
          <span className="bg-gradient-to-r from-cyber-purple via-indigo-400 to-cyber-neonCyan bg-clip-text text-transparent neon-text-glow">
            Neural Hardware
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed mb-10">
          Discover enterprise-grade tensor processors, autonomous robotic swarms, light-field holographic displays, and neural bio-interfaces engineered for high-throughput AI workloads.
        </p>

        {/* Interactive AI Prompt Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <form
            onSubmit={handlePromptSubmit}
            className="relative flex items-center p-2 rounded-2xl bg-navy-900/90 border border-cyber-purple/40 shadow-2xl backdrop-blur-xl focus-within:border-cyber-cyan focus-within:ring-2 focus-within:ring-cyber-cyan/20 transition-all"
          >
            <div className="pl-3 pr-2 text-cyber-neonCyan">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <input
              type="text"
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              placeholder="Ask Nexa AI: e.g., 'What hardware do I need for running 70B LLMs offline?'"
              className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none py-2"
            />
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyber-purple to-indigo-600 hover:from-cyber-purple/90 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-cyber-purple/30 transition-all flex-shrink-0"
            >
              <span>Consult AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[11px] text-slate-400">
            <span className="font-mono text-slate-400">Trending Prompts:</span>
            <button
              onClick={() => onOpenAIModal("Best edge TPU for real-time computer vision")}
              className="px-2.5 py-1 rounded-lg bg-navy-850 hover:bg-navy-800 text-slate-300 hover:text-cyber-cyan border border-white/5 transition-colors"
            >
              "Vision TPU"
            </button>
            <button
              onClick={() => onOpenAIModal("Autonomous drone with obstacle avoidance under ₹1,00,000")}
              className="px-2.5 py-1 rounded-lg bg-navy-850 hover:bg-navy-800 text-slate-300 hover:text-cyber-cyan border border-white/5 transition-colors"
            >
              "Autonomous Drone"
            </button>
            <button
              onClick={() => onOpenAIModal("Haptic gloves and AR neural glasses")}
              className="px-2.5 py-1 rounded-lg bg-navy-850 hover:bg-navy-800 text-slate-300 hover:text-cyber-cyan border border-white/5 transition-colors"
            >
              "AR Glasses & Haptics"
            </button>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyber-purple via-indigo-600 to-cyber-cyan hover:opacity-95 shadow-xl shadow-cyber-purple/25 transition-all"
          >
            <span>Explore Hardware Matrix</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onOpenAIModal('')}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-navy-850 hover:bg-navy-800 border border-slate-700/80 hover:border-cyber-purple/50 transition-all"
          >
            <Sparkles className="w-4 h-4 text-cyber-neonCyan" />
            <span>Launch Nexa AI Recommender</span>
          </button>
        </div>

        {/* Hardware Benchmark Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="glass-card p-5 rounded-2xl text-left border border-white/10 hover:border-cyber-purple/40 transition-colors">
            <div className="flex items-center justify-between text-cyber-neonCyan mb-2">
              <Cpu className="w-5 h-5" />
              <span className="text-[10px] font-mono uppercase text-slate-400">Peak Tensor</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">980 TOPS</div>
            <p className="text-xs text-slate-400 mt-1">Dedicated FP8 matrix engines</p>
          </div>

          <div className="glass-card p-5 rounded-2xl text-left border border-white/10 hover:border-cyber-cyan/40 transition-colors">
            <div className="flex items-center justify-between text-cyber-cyan mb-2">
              <Zap className="w-5 h-5" />
              <span className="text-[10px] font-mono uppercase text-slate-400">Ultra-Low Latency</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">&lt; 3.0 ms</div>
            <p className="text-xs text-slate-400 mt-1">Real-time edge neural inference</p>
          </div>

          <div className="glass-card p-5 rounded-2xl text-left border border-white/10 hover:border-indigo-400/40 transition-colors">
            <div className="flex items-center justify-between text-indigo-400 mb-2">
              <Layers className="w-5 h-5" />
              <span className="text-[10px] font-mono uppercase text-slate-400">Bandwidth</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">1.2 TB/s</div>
            <p className="text-xs text-slate-400 mt-1">HBM3e high-throughput interconnect</p>
          </div>

          <div className="glass-card p-5 rounded-2xl text-left border border-white/10 hover:border-pink-500/40 transition-colors">
            <div className="flex items-center justify-between text-pink-400 mb-2">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] font-mono uppercase text-slate-400">Privacy</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">100% Offline</div>
            <p className="text-xs text-slate-400 mt-1">Air-gapped on-prem processing</p>
          </div>
        </div>

      </div>
    </section>
  );
}

