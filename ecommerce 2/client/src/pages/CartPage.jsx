import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/format';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  ArrowLeft
} from 'lucide-react';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discountAmount,
    discountCode,
    applyDiscount,
    shipping,
    tax,
    total
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState(null);
  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const res = applyDiscount(promoInput);
    setPromoMsg(res);
    setTimeout(() => setPromoMsg(null), 4000);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-5">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-navy-900 border border-white/10 flex items-center justify-center text-slate-400">
          <ShoppingCart className="w-10 h-10 opacity-30" />
        </div>
        <h2 className="text-2xl font-bold text-white">Your Hardware Cart is Empty</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          You haven't added any quantum coprocessors, robotics, or spatial devices to your cart yet.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-purple to-indigo-600 text-white text-xs font-semibold shadow-lg shadow-cyber-purple/20"
        >
          <span>Explore Silicon Catalogue</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Hardware Shopping Cart</h1>
          <p className="text-xs text-slate-400 mt-1">Review your selected neural units before authorizing simulated checkout.</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-400 hover:text-rose-300 font-mono transition-colors"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl glass-card border border-white/10 gap-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover bg-navy-950 border border-white/5 flex-shrink-0"
                />
                <div>
                  <span className="text-[10px] font-mono text-cyber-neonCyan">{item.category_name}</span>
                  <h3 className="text-sm font-bold text-white">{item.name}</h3>
                  <div className="text-xs font-mono text-slate-300 mt-1">
                    {formatINR(item.price)} each
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6">
                {/* Quantity Controls */}
                <div className="flex items-center rounded-xl bg-navy-900 border border-white/10 px-2 py-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-mono font-bold text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal for item */}
                <div className="text-right">
                  <div className="text-sm font-mono font-bold text-white">
                    {formatINR(item.price * item.quantity)}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[11px] text-rose-400 hover:underline mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <Link
            to="/products"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-cyber-cyan hover:underline pt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping Hardware</span>
          </Link>
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-6">
            <h2 className="text-base font-bold text-white">Order Summary</h2>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Promo Code (NEXAAI20)"
                  className="w-full bg-navy-950 text-xs text-white px-3 py-2 rounded-xl border border-white/10 uppercase font-mono focus:outline-none focus:border-cyber-purple"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-xs font-semibold text-white border border-white/10 transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoMsg && (
                <p className={`text-[11px] font-mono ${promoMsg.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {promoMsg.message}
                </p>
              )}
            </form>

            {/* Pricing details */}
            <div className="space-y-2.5 text-xs text-slate-300 font-mono border-t border-white/5 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">{formatINR(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-cyber-neonCyan">
                  <span>Discount ({discountCode})</span>
                  <span>-{formatINR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-white">
                  {shipping === 0 ? <span className="text-emerald-400">FREE (&gt;₹40,000)</span> : formatINR(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (18%)</span>
                <span className="text-white">{formatINR(tax)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-white/10 text-base font-bold text-white">
                <span>Total Amount</span>
                <span className="text-cyber-neonCyan">{formatINR(total)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyber-purple via-indigo-600 to-cyber-cyan hover:opacity-95 shadow-xl shadow-cyber-purple/20 flex items-center justify-center space-x-2 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Risk Simulated Authorization</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

