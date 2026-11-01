import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import {
  Cpu,
  Bot,
  Activity,
  Eye,
  Server,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Mail,
  Star
} from 'lucide-react';

export default function HomePage({ onOpenAIModal }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.getProducts({ featured: true }),
          api.getCategories()
        ]);
        if (prodRes.success) setFeaturedProducts(prodRes.products || []);
        if (catRes.success) setCategories(catRes.categories || []);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-6 h-6 text-cyber-neonCyan" />;
      case 'Bot': return <Bot className="w-6 h-6 text-cyber-purple" />;
      case 'Activity': return <Activity className="w-6 h-6 text-pink-400" />;
      case 'Eye': return <Eye className="w-6 h-6 text-indigo-400" />;
      case 'Server': return <Server className="w-6 h-6 text-emerald-400" />;
      default: return <Cpu className="w-6 h-6 text-cyber-cyan" />;
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setEmailSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <HeroSection onOpenAIModal={onOpenAIModal} />

      {/* Categories Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-cyber-neonCyan mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Architectural Domains</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Explore The Hardware Matrix
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-cyber-cyan hover:underline mt-4 md:mt-0"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group p-5 rounded-2xl glass-card glass-card-hover border border-white/5 hover:border-cyber-purple/40 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-navy-900 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {getCategoryIcon(cat.icon)}
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyber-cyan transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400 group-hover:text-white">
                <span>Inspect Units</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Hardware Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-cyber-purple mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>Silicon Benchmark Leaders</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Featured Neural Accelerators & Robotics
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-cyber-cyan hover:underline mt-4 md:mt-0"
          >
            <span>Browse Full Catalogue ({featuredProducts.length}+ units)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 rounded-2xl glass-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* AI Startup Value Proposition / Architecture Features */}
      <section className="relative overflow-hidden py-16 bg-navy-900/60 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Engineered For Zero-Compromise AI Workloads
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              From edge transformers to air-gapped home servers, our hardware stack delivers enterprise compute density.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl glass-card border border-white/5 hover:border-cyber-purple/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyber-purple/10 border border-cyber-purple/20 flex items-center justify-center text-cyber-purple mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">100% Air-Gapped Capable</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Run weights locally without mandatory cloud handshakes. Full TPU execution stacks operate behind your perimeter firewall.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-white/5 hover:border-cyber-cyan/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/20 flex items-center justify-center text-cyber-cyan mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">FP8 Tensor Processing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Native FP8, INT8, and BF16 execution kernels achieve up to 4x throughput efficiency with negligible perplexity loss.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-white/5 hover:border-indigo-400/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Universal Framework Support</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Drop-in execution drivers for PyTorch, TensorRT-LLM, ONNX Runtime, and ROS2 autonomous robotics stacks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Case Studies / Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center space-x-1 text-amber-400 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Trusted by Autonomous Labs & AI Researchers
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Real feedback from machine learning engineers deploying NexaCart hardware in production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-card border border-white/5 space-y-4">
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "We migrated our robotics vision inference to the Synapse Core X1 modules. Sub-3ms latency let us increase drone swarm flight speed by 40% with zero collisions."
            </p>
            <div className="flex items-center space-x-3 pt-3 border-t border-white/5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Alex Vance"
                className="w-9 h-9 rounded-full object-cover border border-cyber-purple/30"
              />
              <div>
                <div className="text-xs font-bold text-white">Dr. Elena Rostova</div>
                <div className="text-[10px] font-mono text-slate-400">Lead Autonomous Vision, AeroTech</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-white/5 space-y-4">
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "The Nexa Quantum NPU-900 benchmarked 980 TOPS on our transformer evaluation suite. Liquid cooling kept temperatures well below 60°C during 72-hour stress testing."
            </p>
            <div className="flex items-center space-x-3 pt-3 border-t border-white/5">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="Marcus Chen"
                className="w-9 h-9 rounded-full object-cover border border-cyber-cyan/30"
              />
              <div>
                <div className="text-xs font-bold text-white">Marcus Chen</div>
                <div className="text-[10px] font-mono text-slate-400">Principal Systems Architect, Synthetix AI</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-white/5 space-y-4">
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "The PrismSpatial 3D hologram display gave our spatial computing team a truly immersive CAD viewport without requiring bulky VR headsets. A game changer."
            </p>
            <div className="flex items-center space-x-3 pt-3 border-t border-white/5">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
                alt="Sarah Jenkins"
                className="w-9 h-9 rounded-full object-cover border border-indigo-500/30"
              />
              <div>
                <div className="text-xs font-bold text-white">Sarah Jenkins</div>
                <div className="text-[10px] font-mono text-slate-400">VP Hardware Engineering, NeuroDrive</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / Silicon Updates */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl glass-card bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-cyber-purple/30 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-purple/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyber-cyan/10 rounded-full blur-3xl pointer-events-none" />

          <Mail className="w-10 h-10 text-cyber-neonCyan mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Receive Next-Gen Silicon Release Alerts
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
            Get early access whitepapers, benchmark data, and priority batch allocations for future NPU production drops.
          </p>

          {emailSubscribed ? (
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>Transceiver calibrated! You are registered for silicon dispatch notifications.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter enterprise email..."
                className="w-full bg-navy-950 text-xs text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-cyan"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-purple to-indigo-600 hover:opacity-90 text-white text-xs font-semibold shadow-lg shadow-cyber-purple/30 flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}

