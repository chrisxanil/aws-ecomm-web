import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatINR } from '../utils/format';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Truck,
  Loader2,
  DollarSign
} from 'lucide-react';

export default function CheckoutPage() {
  const { items, subtotal, discountAmount, shipping, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Shipping State
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || 'Alex Vance',
    email: user?.email || 'alex@nexacart.ai',
    street: user?.address || '42 Cyberpunk Ave, Apt 7B',
    city: 'Neo Metropolis',
    state: 'NY',
    zipCode: '10001',
    country: 'United States'
  });

  // Simulated Payment State
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    cardNumber: '•••• •••• •••• 4242',
    cardName: user?.name || 'Alex Vance',
    expDate: '12/28',
    cvv: '980'
  });

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-xs text-slate-400">Add hardware items before proceeding to checkout.</p>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-cyber-purple text-white text-xs font-semibold"
        >
          <span>Explore Silicon Catalogue</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      // Simulate real neural authorization delay (1.2s)
      await new Promise(r => setTimeout(r, 1200));

      const payload = {
        items,
        shippingAddress,
        paymentMethod: paymentMethod === 'card' ? 'Simulated AI Pay (Visa/MC)' : (paymentMethod === 'apple' ? 'Apple Pay (Simulated)' : 'Quantum AI Compute Credits'),
        discountAmount
      };

      const res = await api.createOrder(payload);

      if (res.success && res.order) {
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore if canvas not supported
        }

        clearCart();
        navigate(`/order-confirmation/${res.order.order_number}`, { state: { order: res.order } });
      } else {
        setError(res.message || 'Payment processing failed.');
      }
    } catch (err) {
      setError(err.message || 'Transaction authorization error.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-cyber-neonCyan mb-1">
          <Lock className="w-3.5 h-3.5" />
          <span>Simulated Secure Payment Gateway</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Neural Hardware Checkout</h1>
        <p className="text-xs text-slate-400 mt-1">Review shipping destination and authorize simulated payment.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left 2 Cols: Shipping & Payment */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Shipping Details */}
          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
            <div className="flex items-center space-x-2.5 text-white font-bold text-base">
              <Truck className="w-5 h-5 text-cyber-cyan" />
              <span>1. Dispatch & Shipping Destination</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Full Name / Contact</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  className="w-full bg-navy-950 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Notification Email</label>
                <input
                  type="email"
                  required
                  value={shippingAddress.email}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                  className="w-full bg-navy-950 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1 font-mono">Street Address</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  className="w-full bg-navy-950 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">City</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className="w-full bg-navy-950 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">State</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className="w-full bg-navy-950 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-cyan"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.zipCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                    className="w-full bg-navy-950 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-cyan"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-5">
            <div className="flex items-center space-x-2.5 text-white font-bold text-base">
              <CreditCard className="w-5 h-5 text-cyber-purple" />
              <span>2. Simulated Payment Method</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-cyber-purple/20 border-cyber-purple text-white shadow-lg shadow-cyber-purple/10'
                    : 'bg-navy-950 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-2 text-cyber-neonCyan" />
                <span className="text-xs font-bold text-white">AI Pay Card</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Simulated Visa / MC</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'apple'
                    ? 'bg-cyber-purple/20 border-cyber-purple text-white shadow-lg shadow-cyber-purple/10'
                    : 'bg-navy-950 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <Lock className="w-5 h-5 mb-2 text-cyber-purple" />
                <span className="text-xs font-bold text-white">Apple Pay</span>
                <span className="text-[10px] text-slate-400 mt-0.5">One-Touch Biometrics</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('compute')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'compute'
                    ? 'bg-cyber-purple/20 border-cyber-purple text-white shadow-lg shadow-cyber-purple/10'
                    : 'bg-navy-950 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <Cpu className="w-5 h-5 mb-2 text-emerald-400" />
                <span className="text-xs font-bold text-white">Nexa Compute Credits</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Tokenized balance</span>
              </button>
            </div>

            {/* Card Form */}
            {paymentMethod === 'card' && (
              <div className="p-4 rounded-2xl bg-navy-950/80 border border-white/5 space-y-3 pt-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Simulated Card Number</label>
                  <input
                    type="text"
                    required
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                    className="w-full bg-navy-900 text-white p-3 rounded-xl border border-white/10 font-mono text-sm focus:outline-none focus:border-cyber-purple"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-mono">Expiration (MM/YY)</label>
                    <input
                      type="text"
                      required
                      value={cardData.expDate}
                      onChange={(e) => setCardData({ ...cardData, expDate: e.target.value })}
                      className="w-full bg-navy-900 text-white p-3 rounded-xl border border-white/10 font-mono focus:outline-none focus:border-cyber-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-mono">CVC / Security</label>
                    <input
                      type="text"
                      required
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      className="w-full bg-navy-900 text-white p-3 rounded-xl border border-white/10 font-mono focus:outline-none focus:border-cyber-purple"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Simulated Payment Mode: No real financial charges occur. Orders are processed directly into the database.</span>
            </div>

          </div>

        </div>

        {/* Right Col: Order Breakdown */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-5">
            <h3 className="text-base font-bold text-white">Selected Units ({items.length})</h3>

            {/* Item list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={it.id} className="flex items-center space-x-3 text-xs">
                  <img
                    src={it.image_url}
                    alt={it.name}
                    className="w-10 h-10 rounded-lg object-cover bg-navy-950 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{it.name}</p>
                    <p className="text-[10px] font-mono text-slate-400">Qty: {it.quantity}</p>
                  </div>
                  <span className="font-mono text-slate-200">
                    {formatINR(it.price * it.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary details */}
            <div className="space-y-2 text-xs text-slate-300 font-mono border-t border-white/5 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">{formatINR(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-cyber-neonCyan">
                  <span>Applied Discount</span>
                  <span>-{formatINR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Priority Air Dispatch</span>
                <span className="text-white">
                  {shipping === 0 ? <span className="text-emerald-400">FREE (&gt;₹40,000)</span> : formatINR(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Simulated GST (18%)</span>
                <span className="text-white">{formatINR(tax)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-white/10 text-base font-bold text-white">
                <span>Final Total</span>
                <span className="text-cyber-neonCyan">{formatINR(total)}</span>
              </div>
            </div>

            {/* Authorize Button */}
            <button
              type="submit"
              disabled={processing}
              className="w-full py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyber-purple via-indigo-600 to-cyber-cyan hover:opacity-95 shadow-xl shadow-cyber-purple/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authorizing Neural Transaction...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize & Place Order</span>
                </>
              )}
            </button>

          </div>
        </div>

      </form>

    </div>
  );
}

