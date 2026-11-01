import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/format';
import ProductCard from '../components/ProductCard';
import {
  Star,
  ShoppingCart,
  Zap,
  Check,
  Shield,
  Truck,
  RotateCcw,
  Cpu,
  Layers,
  ArrowLeft,
  MessageSquare,
  Send,
  Loader2
} from 'lucide-react';

export default function ProductDetailPage() {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const res = await api.getProductByIdOrSlug(idOrSlug);
        if (res.success && res.product) {
          setProduct(res.product);

          // Fetch related products
          const relatedRes = await api.getProducts({ category: res.product.category_id });
          if (relatedRes.success) {
            setRelatedProducts(relatedRes.products.filter(p => p.id !== res.product.id).slice(0, 4));
          }
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [idOrSlug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleInstantBuy = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await api.addReview(product.id, reviewRating, reviewComment);
      if (res.success) {
        setProduct(prev => ({
          ...prev,
          reviews: [res.review, ...(prev.reviews || [])],
          reviews_count: (prev.reviews_count || 0) + 1
        }));
        setReviewComment('');
        setReviewMessage({ success: true, text: 'Review published successfully!' });
      }
    } catch (err) {
      setReviewMessage({ success: false, text: err.message || 'Failed to submit review.' });
    } finally {
      setSubmittingReview(false);
      setTimeout(() => setReviewMessage(null), 4000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-cyber-neonCyan animate-spin" />
        <p className="text-xs font-mono text-slate-400">Loading silicon telemetry & specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Silicon Unit Not Found</h2>
        <p className="text-xs text-slate-400">The requested neural hardware could not be located in the catalog.</p>
        <Link
          to="/products"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyber-purple text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalogue</span>
        </Link>
      </div>
    );
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const features = product.features && typeof product.features === 'object' ? product.features : {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-white transition-colors">Hardware</Link>
        <span>/</span>
        <span className="text-cyber-neonCyan truncate">{product.name}</span>
      </div>

      {/* Main Product Showcase Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left: Image Container */}
        <div className="relative rounded-3xl glass-card overflow-hidden border border-white/10 aspect-square bg-navy-900 flex items-center justify-center group">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-40" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {product.badge && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyber-purple/90 text-white backdrop-blur-md shadow-lg">
                {product.badge}
              </span>
            )}
            {discount && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/90 text-white backdrop-blur-md shadow-lg">
                -{discount}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Spec & Buy Box */}
        <div className="flex flex-col space-y-6">
          
          <div>
            <div className="inline-block px-2.5 py-1 rounded-md text-xs font-mono bg-navy-800 text-cyber-neonCyan border border-white/10 mb-2">
              {product.category_name}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-3 mt-3">
              <div className="flex items-center space-x-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-sm font-bold text-white">{Number(product.rating || 5).toFixed(1)}</span>
              </div>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-300 font-mono">
                {product.reviews_count || product.reviews?.length || 0} Verified Benchmarks & Reviews
              </span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-2xl bg-navy-900/80 border border-white/5 space-y-1">
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-extrabold text-white font-mono">
                {formatINR(product.price)}
              </span>
              {product.original_price && (
                <span className="text-base text-slate-400 line-through font-mono">
                  {formatINR(product.original_price)}
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-400 font-mono flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Available for dispatch • {product.stock} units in inventory</span>
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Key Specifications Grid */}
          {Object.keys(features).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Silicon Telemetry & Architecture
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(features).map(([key, val]) => (
                  <div key={key} className="p-2.5 rounded-xl bg-navy-850/80 border border-white/5 flex flex-col">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{key}</span>
                    <span className="font-semibold text-slate-200 mt-0.5 truncate">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Row: Quantity + Add to Cart + Buy Now */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-4">
              
              {/* Quantity Selector */}
              <div className="flex items-center rounded-xl bg-navy-900 border border-white/10 px-3 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-slate-400 hover:text-white px-2 text-base font-bold"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-mono font-bold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="text-slate-400 hover:text-white px-2 text-base font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all ${
                  added
                    ? 'bg-emerald-500 text-white'
                    : 'bg-navy-800 hover:bg-navy-700 text-white border border-slate-700/80 hover:border-cyber-purple/50'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Hardware Cart</span>
                  </>
                )}
              </button>
            </div>

            {/* Instant Checkout Button */}
            <button
              onClick={handleInstantBuy}
              disabled={product.stock <= 0}
              className="w-full py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyber-purple via-indigo-600 to-cyber-cyan hover:opacity-95 shadow-xl shadow-cyber-purple/20 flex items-center justify-center space-x-2 transition-all"
            >
              <Zap className="w-4 h-4 text-cyber-neonCyan" />
              <span>Instant Buy & Checkout</span>
            </button>
          </div>

          {/* Confidence Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5 text-[11px] text-slate-400 font-mono">
            <div className="flex items-center space-x-1.5">
              <Truck className="w-4 h-4 text-cyber-cyan" />
              <span>Priority Air Dispatch</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-cyber-purple" />
              <span>5-Year Silicon Warranty</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <RotateCcw className="w-4 h-4 text-indigo-400" />
              <span>30-Day Evaluation</span>
            </div>
          </div>

        </div>

      </div>

      {/* Reviews & Benchmarks Section */}
      <section className="border-t border-white/10 pt-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-cyber-neonCyan" />
              <span>Customer Reviews & Benchmarks ({product.reviews?.length || 0})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Field evaluations from machine learning researchers and hardware engineers.
            </p>
          </div>
        </div>

        {/* Write a Review Box */}
        <div className="p-6 rounded-2xl glass-card border border-white/10">
          {isAuthenticated ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                Submit A Silicon Benchmark Review
              </h4>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Rating:</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-amber-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your thermal measurements, inference tokens/sec, or hardware integration experience..."
                  className="w-full bg-navy-950 text-xs text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-cyan resize-none"
                />
              </div>

              {reviewMessage && (
                <p className={`text-xs font-mono ${reviewMessage.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {reviewMessage.text}
                </p>
              )}

              <button
                type="submit"
                disabled={submittingReview}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-cyber-purple hover:bg-cyber-purple/90 text-white flex items-center space-x-2 shadow-md transition-all"
              >
                {submittingReview ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Review</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Sign in to post benchmark telemetry or review this product.
              </p>
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-navy-800 hover:bg-navy-700 text-white border border-white/10"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {(!product.reviews || product.reviews.length === 0) ? (
            <p className="text-xs text-slate-400 italic">No customer reviews posted yet for this hardware unit.</p>
          ) : (
            product.reviews.map((rev, idx) => (
              <div key={rev.id || idx} className="p-5 rounded-2xl bg-navy-900/80 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">{rev.user_name || 'Verified Researcher'}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-purple/20 text-cyber-purple">
                      Verified Buyer
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-400' : 'text-slate-700'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {rev.comment}
                </p>
                <div className="text-[10px] font-mono text-slate-400">
                  {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : 'Recent'}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-white/10 pt-12 space-y-6">
          <h3 className="text-xl font-bold text-white">Related Silicon Accelerators</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

