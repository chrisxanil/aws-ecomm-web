import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatINR } from '../utils/format';
import {
  User,
  Package,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  Truck,
  Edit2,
  Save,
  Loader2,
  ShieldCheck,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'settings'

  // Edit form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    avatar: user?.avatar || ''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.getMyOrders();
        if (res.success) setOrders(res.orders || []);
      } catch (err) {
        console.error('Failed to fetch user orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await updateProfile(formData);
      if (res.success) {
        setSaveMessage({ success: true, text: 'Profile telemetrics saved successfully.' });
      }
    } catch (err) {
      setSaveMessage({ success: false, text: err.message || 'Failed to update profile.' });
    } finally {
      setSavingProfile(false);
      setTimeout(() => setSaveMessage(null), 3500);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Truck className="w-3 h-3 mr-1" /> In Transit
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3 mr-1" /> {status || 'Processing'}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/10 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
          alt={user?.name}
          className="w-24 h-24 rounded-2xl object-cover border-2 border-cyber-purple/40 shadow-xl"
        />

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
            <h1 className="text-2xl font-extrabold text-white">{user?.name}</h1>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30 w-fit mx-auto sm:mx-0">
              {user?.role === 'admin' ? 'System Administrator' : 'Verified Client'}
            </span>
          </div>

          <p className="text-xs font-mono text-slate-400 mt-1">{user?.email}</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 text-xs text-slate-300">
            {user?.phone && (
              <span className="flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-cyber-cyan" />
                <span>{user.phone}</span>
              </span>
            )}
            {user?.address && (
              <span className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyber-purple" />
                <span className="truncate max-w-xs">{user.address}</span>
              </span>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex space-x-2 bg-navy-900 p-1.5 rounded-2xl border border-white/5">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-cyber-purple text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Order History ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-cyber-purple text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'orders' ? (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Package className="w-5 h-5 text-cyber-cyan" />
            <span>Hardware Dispatch Telemetry & History</span>
          </h2>

          {loadingOrders ? (
            <div className="text-center py-12 space-y-3">
              <Loader2 className="w-6 h-6 text-cyber-neonCyan animate-spin mx-auto" />
              <p className="text-xs font-mono text-slate-400">Querying order transactions...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 rounded-3xl glass-card border border-white/5 space-y-3">
              <Package className="w-12 h-12 text-slate-400 mx-auto opacity-30" />
              <h3 className="text-base font-bold text-white">No Orders Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                You haven't authorized any hardware orders on this account yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 rounded-3xl glass-card border border-white/10 space-y-4 hover:border-cyber-purple/30 transition-colors"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row justify-between pb-4 border-b border-white/5 gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-slate-400">DISPATCH ID</span>
                      <div className="text-sm font-bold text-white font-mono">{order.order_number}</div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-slate-400 block">TOTAL PAID</span>
                        <span className="text-sm font-mono font-bold text-cyber-neonCyan">
                          {formatINR(order.total_amount)}
                        </span>
                      </div>
                      <div>{getStatusBadge(order.status)}</div>
                    </div>
                  </div>

                  {/* Items in order */}
                  <div className="space-y-3">
                    {order.items?.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3">
                          <img
                            src={it.image_url || 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=120&q=80'}
                            alt={it.product_name}
                            className="w-10 h-10 rounded-lg object-cover bg-navy-950 flex-shrink-0 border border-white/5"
                          />
                          <div>
                            <span className="font-semibold text-white">{it.product_name}</span>
                            <span className="text-slate-400 block text-[11px] font-mono">Qty: {it.quantity}</span>
                          </div>
                        </div>
                        <span className="font-mono text-slate-200">
                          {formatINR(it.price * it.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer details */}
                  <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row justify-between text-[11px] font-mono text-slate-400 gap-1">
                    <span>Date: {new Date(order.created_at).toLocaleString()}</span>
                    <span>Method: {order.payment_method}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Settings Tab */
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/10 max-w-2xl">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
            <Edit2 className="w-5 h-5 text-cyber-purple" />
            <span>Update Account Profile</span>
          </h2>

          <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-mono">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-navy-950 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-purple"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-mono">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-navy-950 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-purple"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-mono">Primary Shipping Address</label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="100 Silicon Way, Tech City, CA 94016"
                className="w-full bg-navy-950 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-purple resize-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-mono">Avatar Image URL</label>
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://..."
                className="w-full bg-navy-950 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-purple"
              />
            </div>

            {saveMessage && (
              <p className={`font-mono text-xs ${saveMessage.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                {saveMessage.text}
              </p>
            )}

            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyber-purple to-indigo-600 text-white hover:opacity-90 flex items-center space-x-2 shadow-lg shadow-cyber-purple/20 transition-all"
            >
              {savingProfile ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

    </div>
  );
}

