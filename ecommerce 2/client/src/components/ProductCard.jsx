import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/format';
import { ShoppingCart, Star, Check, Zap } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  return (
    <div className="group relative flex flex-col rounded-2xl glass-card glass-card-hover overflow-hidden border border-white/10 hover:border-cyber-purple/40">
      
      {/* Top Image Container */}
      <Link to={`/products/${product.slug || product.id}`} className="relative aspect-[4/3] w-full overflow-hidden bg-navy-900/80">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-60" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {product.badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyber-purple/80 text-white backdrop-blur-md shadow-md">
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/80 text-white backdrop-blur-md">
              -{discount}%
            </span>
          )}
        </div>

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono bg-navy-950/80 text-cyber-neonCyan border border-white/10 backdrop-blur-md">
            {product.category_name}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        
        {/* Rating */}
        <div className="flex items-center space-x-1.5 text-xs text-amber-400 mb-2">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-slate-200">{Number(product.rating || 5).toFixed(1)}</span>
          <span className="text-slate-400 text-[11px]">({product.reviews_count || 12})</span>
        </div>

        {/* Title */}
        <Link to={`/products/${product.slug || product.id}`} className="block group-hover:text-cyber-cyan transition-colors">
          <h3 className="text-base font-bold text-white line-clamp-1">{product.name}</h3>
        </Link>

        {/* Description snippet */}
        <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Bottom Specs & Action */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-extrabold text-white font-mono">
                {formatINR(product.price)}
              </span>
              {product.original_price && (
                <span className="text-xs text-slate-400 line-through font-mono">
                  {formatINR(product.original_price)}
                </span>
              )}
            </div>
            <div className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>In Stock ({product.stock})</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center transition-all ${
              added
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-navy-800 hover:bg-gradient-to-r hover:from-cyber-purple hover:to-indigo-600 text-white border border-slate-700/60 hover:border-transparent shadow-md'
            }`}
            title="Add to Cart"
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
        </div>

      </div>

    </div>
  );
}

