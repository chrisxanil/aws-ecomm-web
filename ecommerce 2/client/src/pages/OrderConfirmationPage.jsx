import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { api } from '../services/api';
import { formatINR } from '../utils/format';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  User,
  ShieldCheck,
  Calendar,
  CreditCard
} from 'lucide-react';

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order) {
      // In case user refreshed the page or reached via link
      const fetchMyOrders = async () => {
        try {
          const res = await api.getMyOrders();
          if (res.success && res.orders) {
            const match = res.orders.find(o => o.order_number === orderNumber);
            if (match) setOrder(match);
          }
        } catch (err) {
          console.error('Error fetching order confirmation:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchMyOrders();
    }
  }, [order, orderNumber]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="rounded-3xl glass-card bg-navy-900/90 border border-cyber-purple/40 p-8 sm:p-12 shadow-2xl space-y-8 text-center relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-cyber-purple/20 blur-3xl rounded-full pointer-events-none" />

        {/* Success Icon */}
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-cyber-purple to-cyber-cyan p-1 shadow-xl shadow-cyber-purple/30">
          <div className="w-full h-full bg-navy-950 rounded-full flex items-center justify-center text-cyber-neonCyan">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>
        </div>

        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
            Transaction Authorized & Stored
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Order Confirmation
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto">
            Your hardware order has been registered in the database and submitted to our cleanroom dispatch queue.
          </p>
        </div>

        {/* Order Details Receipt Box */}
        <div className="p-6 rounded-2xl bg-navy-950/80 border border-white/5 text-left space-y-5 text-xs font-mono">
          
          <div className="flex flex-col sm:flex-row justify-between pb-4 border-b border-white/5 gap-2">
            <div>
              <span className="text-slate-400 block text-[10px]">ORDER IDENTIFIER</span>
              <span className="text-base font-bold text-cyber-neonCyan font-mono">{orderNumber}</span>
            </div>
            <div className="sm:text-right">
              <span className="text-slate-400 block text-[10px]">DISPATCH STATUS</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30">
                {order?.status || 'Processing'}
              </span>
            </div>
          </div>

          {/* Delivery & Payment info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-white/5">
            <div>
              <span className="text-slate-400 block text-[10px] mb-1">SHIPPING DESTINATION</span>
              <p className="text-slate-200">
                {order?.shipping_address?.fullName || 'Alex Vance'}<br />
                {order?.shipping_address?.street || '42 Cyberpunk Ave, Apt 7B'}<br />
                {order?.shipping_address?.city}, {order?.shipping_address?.state} {order?.shipping_address?.zipCode}
              </p>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] mb-1">PAYMENT PROTOCOL</span>
              <p className="text-slate-200">
                Method: {order?.payment_method || 'Simulated AI Pay'}<br />
                Status: <span className="text-emerald-400">Authorized & Verified</span><br />
                Total Paid: <span className="text-white font-bold">{formatINR(order?.total_amount || 0)}</span>
              </p>
            </div>
          </div>

          {/* Items Purchased */}
          {order?.items && order.items.length > 0 && (
            <div className="space-y-2">
              <span className="text-slate-400 block text-[10px]">ORDERED SILICON UNITS</span>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-200">
                    <span className="truncate pr-4">{item.product_name} (x{item.quantity})</span>
                    <span className="text-white">{formatINR(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/profile"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-semibold border border-white/10 transition-colors"
          >
            <User className="w-4 h-4" />
            <span>View In Order History</span>
          </Link>
          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-purple to-indigo-600 text-white text-xs font-semibold shadow-lg shadow-cyber-purple/20 transition-all"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}

