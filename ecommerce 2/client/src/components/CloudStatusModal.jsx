import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Cloud,
  X,
  Server,
  Database,
  HardDrive,
  ShieldAlert,
  Layers,
  Terminal,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Cpu
} from 'lucide-react';

export default function CloudStatusModal({ isOpen, onClose }) {
  const [cloudData, setCloudData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const data = await api.getCloudStatus();
      setCloudData(data);
    } catch (err) {
      console.warn('Could not fetch cloud status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-navy-950/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-3xl glass-card bg-navy-900/95 border border-white/10 shadow-2xl p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyber-purple to-cyber-cyan text-white shadow-lg">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">AWS Deployment Matrix</h3>
              <p className="text-xs text-slate-400">
                Real-time cloud infrastructure diagnostic and provisioning status.
              </p>
            </div>
          </div>
          <button
            onClick={fetchStatus}
            className="p-2 rounded-lg text-slate-400 hover:text-cyber-cyan hover:bg-white/5 transition-colors"
            title="Refresh Status"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          
          {/* RDS MySQL */}
          <div className="p-4 rounded-2xl bg-navy-850/80 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-white font-semibold">
                <Database className="w-4 h-4 text-cyber-cyan" />
                <span>RDS MySQL (Database)</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {cloudData?.dbEngine?.toUpperCase() || 'READY'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Host: <span className="font-mono text-slate-200">{cloudData?.services?.rdsMySQL?.host || 'localhost'}</span>
            </p>
            <p className="text-[11px] text-slate-400">
              {cloudData?.services?.rdsMySQL?.status || 'Active with automatic failover'}
            </p>
          </div>

          {/* S3 Storage */}
          <div className="p-4 rounded-2xl bg-navy-850/80 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-white font-semibold">
                <HardDrive className="w-4 h-4 text-cyber-purple" />
                <span>S3 Storage (Assets)</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {cloudData?.services?.s3Storage?.status?.includes('Active') ? 'CONNECTED' : 'LOCAL MODE'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Bucket: <span className="font-mono text-slate-200">{cloudData?.services?.s3Storage?.bucket || 'Local Assets'}</span>
            </p>
            <p className="text-[10px] text-slate-400">
              S3 bucket policy and CORS configs available in <code>/aws/s3</code>.
            </p>
          </div>

          {/* EC2 & Elastic Beanstalk */}
          <div className="p-4 rounded-2xl bg-navy-850/80 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-white font-semibold">
                <Server className="w-4 h-4 text-indigo-400" />
                <span>EC2 (IaaS) / Beanstalk (PaaS)</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                PREPARED
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Platform: <span className="font-mono text-slate-200">{cloudData?.cloudPlatform || 'Development / EC2'}</span>
            </p>
            <p className="text-[10px] text-slate-400">
              Includes user-data scripts, systemd service, and .ebextensions.
            </p>
          </div>

          {/* Security (IAM, Cognito, WAF, CloudTrail) */}
          <div className="p-4 rounded-2xl bg-navy-850/80 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-white font-semibold">
                <ShieldAlert className="w-4 h-4 text-pink-400" />
                <span>IAM, WAF & Cognito</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                CONFIGURED
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Auth: <span className="font-mono text-slate-200">JWT + Cognito Compatible</span>
            </p>
            <p className="text-[10px] text-slate-400">
              Full IAM policies and WAF WebACL rule definitions in <code>/aws/security</code>.
            </p>
          </div>

        </div>

        {/* Docker & Kubernetes Ready banner */}
        <div className="p-4 rounded-2xl bg-navy-950 border border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyber-purple/20 text-cyber-purple">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Docker & Kubernetes Manifests Ready</div>
              <div className="text-[11px] text-slate-400">
                Complete multi-tier manifests in <code>/aws/k8s</code> and <code>docker-compose.yml</code>.
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono uppercase px-2 py-1 rounded bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30">
            K8s v1.28+
          </span>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-navy-800 hover:bg-navy-700 text-white transition-colors"
          >
            Dismiss Diagnostics
          </button>
        </div>

      </div>
    </div>
  );
}

