import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Shield, Server, Terminal, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-950/80 backdrop-blur-md pt-16 pb-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-cyber-purple to-cyber-cyan p-0.5">
                <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-cyber-neonCyan" />
                </div>
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                NexaCart<span className="text-cyber-purple font-mono">.AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pioneering commercial distribution of next-generation tensor compute, autonomous swarm robotics, and non-invasive brain-computer interfaces.
            </p>
            <div className="flex items-center space-x-2 pt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
                API Cluster Online
              </span>
            </div>
          </div>

          {/* Neural Categories */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold mb-4">
              Hardware Matrix
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/products?category=neural-processors" className="hover:text-cyber-cyan transition-colors">
                  Quantum NPUs & TPUs
                </Link>
              </li>
              <li>
                <Link to="/products?category=autonomous-robotics" className="hover:text-cyber-cyan transition-colors">
                  Autonomous Robotics & Drones
                </Link>
              </li>
              <li>
                <Link to="/products?category=neuro-wearables" className="hover:text-cyber-cyan transition-colors">
                  Smart Neuro Wearables
                </Link>
              </li>
              <li>
                <Link to="/products?category=vision-systems" className="hover:text-cyber-cyan transition-colors">
                  Holographic 3D Displays
                </Link>
              </li>
              <li>
                <Link to="/products?category=edge-hubs" className="hover:text-cyber-cyan transition-colors">
                  Air-Gapped Edge AI Hubs
                </Link>
              </li>
            </ul>
          </div>

          {/* AWS Cloud Architecture */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold mb-4">
              AWS Infrastructure
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-mono">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-purple"></span>
                <span>EC2 (IaaS) & Elastic Beanstalk (PaaS)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan"></span>
                <span>RDS MySQL Managed Database</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span>S3 Storage & CloudFront CDN</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                <span>IAM, Cognito, WAF & CloudTrail</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Docker & Kubernetes Orchestration</span>
              </li>
            </ul>
          </div>

          {/* Developer / Security */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold mb-4">
              Security & Compliance
            </h4>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-navy-900 border border-white/5 space-y-1.5">
                <div className="flex items-center space-x-2 text-xs font-medium text-slate-200">
                  <Shield className="w-4 h-4 text-cyber-purple" />
                  <span>Zero-Trust Protocol</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  JWT stateless auth, bcrypt salt hashing, and AWS WAF rate-limiting filters active.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-navy-900 border border-white/5 space-y-1.5">
                <div className="flex items-center space-x-2 text-xs font-medium text-slate-200">
                  <Server className="w-4 h-4 text-cyber-cyan" />
                  <span>Resilient Data Layer</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Native MySQL 8.0 schema with automated zero-config local engine fallback.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} NexaCart AI. All rights reserved. Built for high-performance AI commerce.</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0 font-mono text-[11px]">
            <span>React + Vite</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>Node + Express</span>
            <span>•</span>
            <span>MySQL</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

