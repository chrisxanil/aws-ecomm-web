import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/format';
import {
  Sparkles,
  X,
  Bot,
  ArrowRight,
  ShoppingCart,
  Check,
  Cpu,
  Zap,
  Loader2
} from 'lucide-react';

export default function AIRecommenderModal({ isOpen, onClose, initialPrompt = '' }) {
  const [prompt, setPrompt] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [addedMap, setAddedMap] = useState({});

  const { addToCart } = useCart();

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
      handleSearch(initialPrompt);
    }
  }, [initialPrompt]);

  if (!isOpen) return null;

  const handleSearch = async (queryText = prompt) => {
    if (!queryText.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await api.askNexaAI(queryText, budget ? parseFloat(budget) : null);
      if (data.success) {
        setResult(data);
      } else {
        setError(data.message || 'Could not analyze recommendations.');
      }
    } catch (err) {
      setError(err.message || 'Failed to communicate with Nexa AI Engine.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedMap(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl rounded-3xl glass-card bg-navy-900/95 border border-cyber-purple/40 shadow-2xl p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyber-purple to-cyber-cyan p-0.5 shadow-lg shadow-cyber-purple/30">
            <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
              <Bot className="w-6 h-6 text-cyber-neonCyan animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center space-x-2">
              <span>Ask Nexa AI Engine</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30">
                v4.0
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Describe your workload, neural model architecture, or project goals for automated hardware matching.
            </p>
          </div>
        </div>

        {/* Search Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="space-y-3 mb-6"
        >
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 'I am building an autonomous search-and-rescue rover that requires real-time 3D SLAM and LiDAR point clouds', or 'I need an edge TPU to fine-tune 7B LLMs under ₹1,50,000'..."
              className="w-full bg-navy-950/80 rounded-2xl p-4 text-sm text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="text-xs font-mono text-slate-400">Budget (₹):</span>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Optional max"
                className="w-32 bg-navy-950 text-xs text-white px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-purple"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-cyber-purple via-indigo-600 to-cyber-cyan text-white hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-cyber-purple/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Silicon Match...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Execute Neural Analysis</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono mb-4">
            {error}
          </div>
        )}

        {/* Results Area */}
        {result && (
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1 animate-in fade-in duration-300">
            {/* AI Summary Card */}
            <div className="p-4 rounded-2xl bg-cyber-purple/10 border border-cyber-purple/30">
              <div className="flex items-center space-x-2 text-xs font-bold text-cyber-neonCyan mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nexa Neural Synthesis</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {result.aiSummary}
              </p>
            </div>

            {/* Recommended Products */}
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold pt-1">
              Recommended Hardware Units ({result.recommendedProducts?.length || 0})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.recommendedProducts?.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col p-4 rounded-2xl bg-navy-850/90 border border-white/10 hover:border-cyber-purple/40 transition-colors"
                >
                  <div className="flex space-x-3 mb-3">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-cover bg-navy-950 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono text-cyber-neonCyan">
                        {product.category_name}
                      </span>
                      <h5 className="text-xs font-bold text-white truncate">{product.name}</h5>
                      <div className="text-sm font-extrabold text-white font-mono mt-1">
                        {formatINR(product.price)}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                    {product.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                    <Link
                      to={`/products/${product.slug || product.id}`}
                      onClick={onClose}
                      className="text-xs text-cyber-cyan hover:underline inline-flex items-center space-x-1"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                        addedMap[product.id]
                          ? 'bg-emerald-500 text-white'
                          : 'bg-navy-800 hover:bg-cyber-purple text-white border border-white/10'
                      }`}
                    >
                      {addedMap[product.id] ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

