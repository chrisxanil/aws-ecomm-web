import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { formatINR } from '../utils/format';
import {
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Search,
  Check,
  X,
  Loader2,
  Clock,
  Layers,
  ArrowUpDown,
  Cpu,
  Truck,
  CheckCircle2,
  Eye,
  MapPin,
  Phone,
  Mail,
  FileText,
  Printer,
  CreditCard,
  ArrowRight
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders'

  // Product modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category_id: 1,
    category_name: 'Neural Processors & TPUs',
    price: '',
    original_price: '',
    stock: 25,
    description: '',
    image_url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
    badge: 'Pro Spec',
    is_featured: true,
    features: {
      "Compute TOPS": "450 TOPS",
      "Power Envelope": "150W TDP",
      "Architecture": "TensorCore v4"
    }
  });

  const [savingProduct, setSavingProduct] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Filters for Products
  const [prodSearch, setProdSearch] = useState('');

  // Filters & State for Orders Placed History
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSort, setOrderSort] = useState('newest');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, prodRes, ordersRes, catRes] = await Promise.all([
        api.getDashboardAnalytics(),
        api.getProducts(),
        api.getAllOrdersAdmin(),
        api.getCategories()
      ]);

      if (analyticsRes.success) setAnalytics(analyticsRes.analytics);
      if (prodRes.success) setProducts(prodRes.products);
      if (ordersRes.success) setOrders(ordersRes.orders);
      if (catRes.success) setCategories(catRes.categories);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const showFeedback = (text, isSuccess = true) => {
    setFeedbackMsg({ text, isSuccess });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Open modal for Create
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category_id: 1,
      category_name: 'Neural Processors & TPUs',
      price: '',
      original_price: '',
      stock: 25,
      description: '',
      image_url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
      badge: 'Pro Spec',
      is_featured: true,
      features: {
        "Compute TOPS": "450 TOPS",
        "Power Envelope": "150W TDP"
      }
    });
    setIsProductModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category_id: prod.category_id || 1,
      category_name: prod.category_name,
      price: prod.price,
      original_price: prod.original_price || '',
      stock: prod.stock,
      description: prod.description,
      image_url: prod.image_url,
      badge: prod.badge || '',
      is_featured: Boolean(prod.is_featured),
      features: prod.features || {}
    });
    setIsProductModalOpen(true);
  };

  // Submit product create/edit
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      if (editingProduct) {
        const res = await api.updateProduct(editingProduct.id, productForm);
        if (res.success) {
          showFeedback('Product updated successfully in database!');
          setIsProductModalOpen(false);
          loadAllAdminData();
        }
      } else {
        const res = await api.createProduct(productForm);
        if (res.success) {
          showFeedback('New neural hardware deployed successfully in database!');
          setIsProductModalOpen(false);
          loadAllAdminData();
        }
      }
    } catch (err) {
      showFeedback(err.message || 'Error saving product.', false);
    } finally {
      setSavingProduct(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}" from the database?`)) {
      return;
    }
    try {
      const res = await api.deleteProduct(id);
      if (res.success) {
        showFeedback(`"${name}" removed from inventory.`);
        loadAllAdminData();
      }
    } catch (err) {
      showFeedback(err.message || 'Failed to delete product.', false);
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.updateOrderStatusAdmin(orderId, newStatus);
      if (res.success) {
        showFeedback(`Order #${orderId} status updated to "${newStatus}".`);
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      showFeedback(err.message || 'Failed to update order status.', false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Truck className="w-3 h-3 mr-1" /> Shipped
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3 mr-1" /> Processing
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <X className="w-3 h-3 mr-1" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-500/10 text-slate-300 border border-slate-500/20">
            <Clock className="w-3 h-3 mr-1" /> {status || 'Pending'}
          </span>
        );
    }
  };

  // Filtered Products
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(prodSearch.toLowerCase()) ||
    p.category_name.toLowerCase().includes(prodSearch.toLowerCase())
  );

  // Filtered & Sorted Orders Placed History
  const filteredOrders = orders.filter(order => {
    const q = orderSearch.toLowerCase();
    const matchesSearch =
      !orderSearch ||
      order.order_number?.toLowerCase().includes(q) ||
      order.customer_name?.toLowerCase().includes(q) ||
      order.customer_email?.toLowerCase().includes(q) ||
      order.shipping_address?.city?.toLowerCase().includes(q);

    const matchesStatus =
      orderStatusFilter === 'all' || order.status === orderStatusFilter;

    return matchesSearch && matchesStatus;
  });

  filteredOrders.sort((a, b) => {
    if (orderSort === 'newest') return new Date(b.created_at) - new Date(a.created_at);
    if (orderSort === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
    if (orderSort === 'amount-high') return b.total_amount - a.total_amount;
    if (orderSort === 'amount-low') return a.total_amount - b.total_amount;
    return 0;
  });

  // Order Counts
  const processingCount = orders.filter(o => o.status === 'Processing').length;
  const shippedCount = orders.filter(o => o.status === 'Shipped').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header with Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-cyber-neonCyan mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Root Administrator Terminal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Nexa Enterprise Command Center</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time telemetry, database inventory, and order placed history.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-2 bg-navy-900 p-1.5 rounded-2xl border border-white/5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-cyber-purple to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Analytics Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-cyber-purple to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Order History ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-cyber-purple to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Hardware ({products.length})</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className={`p-4 rounded-2xl border text-xs font-mono animate-in fade-in duration-150 ${
          feedbackMsg.isSuccess
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          {feedbackMsg.text}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 space-y-3">
          <Loader2 className="w-8 h-8 text-cyber-neonCyan animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-400">Loading cluster analytics & order history...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Executive Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Revenue */}
                <div className="p-6 rounded-3xl glass-card border border-white/10 hover:border-cyber-purple/40 transition-colors">
                  <div className="flex items-center justify-between text-cyber-neonCyan mb-3">
                    <span className="text-xs font-mono uppercase text-slate-400">Gross Sales Revenue</span>
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-extrabold text-white font-mono">
                    {formatINR(analytics?.totalRevenue || 0)}
                  </div>
                  <div className="text-xs text-emerald-400 font-mono mt-2 flex items-center space-x-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+24.8% vs last cycle</span>
                  </div>
                </div>

                {/* Orders */}
                <div
                  onClick={() => setActiveTab('orders')}
                  className="p-6 rounded-3xl glass-card border border-white/10 hover:border-cyber-cyan/40 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-cyber-cyan mb-3">
                    <span className="text-xs font-mono uppercase text-slate-400 group-hover:text-cyber-cyan transition-colors">
                      Total Orders Placed ➔
                    </span>
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-extrabold text-white font-mono">
                    {orders.length}
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-2">
                    {processingCount} processing • {shippedCount} shipped
                  </p>
                </div>

                {/* Products */}
                <div
                  onClick={() => setActiveTab('products')}
                  className="p-6 rounded-3xl glass-card border border-white/10 hover:border-indigo-400/40 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-indigo-400 mb-3">
                    <span className="text-xs font-mono uppercase text-slate-400 group-hover:text-indigo-400 transition-colors">
                      Hardware Catalog Units ➔
                    </span>
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-extrabold text-white font-mono">
                    {products.length}
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-2">
                    Across {categories.length} neural categories
                  </p>
                </div>

                {/* Low Stock Alerts */}
                <div className="p-6 rounded-3xl glass-card border border-white/10 hover:border-amber-500/40 transition-colors">
                  <div className="flex items-center justify-between text-amber-400 mb-3">
                    <span className="text-xs font-mono uppercase text-slate-400">Low Stock Warning</span>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-extrabold text-white font-mono">
                    {products.filter(p => p.stock < 15).length}
                  </div>
                  <p className="text-xs text-amber-400/80 font-mono mt-2">
                    Inventory &lt; 15 units remaining
                  </p>
                </div>

              </div>

              {/* Visual Sales & Category Distribution Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Sales Monthly Trend Chart */}
                <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl glass-card border border-white/10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5 text-cyber-neonCyan" />
                        <span>Sales Trajectory & Monthly Revenue</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Aggregated monthly throughput (INR / ₹)</p>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30">
                      Q3 - Q4 Trend
                    </span>
                  </div>

                  {/* SVG / CSS Bar Chart */}
                  <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-white/5">
                    {(analytics?.monthlySales || [
                      { month: 'Jun', sales: 1840000 },
                      { month: 'Jul', sales: 2420000 },
                      { month: 'Aug', sales: 3150000 },
                      { month: 'Sep', sales: 4290000 },
                      { month: 'Oct', sales: 5820000 },
                      { month: 'Nov', sales: 6740000 }
                    ]).map((bar) => {
                      const maxVal = 7500000;
                      const heightPercent = Math.min(100, Math.max(15, Math.round((bar.sales / maxVal) * 100)));
                      return (
                        <div key={bar.month} className="flex-1 flex flex-col items-center group relative">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 px-2 py-1 rounded bg-navy-950 text-[10px] font-mono text-cyber-neonCyan border border-white/10 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                            {formatINR(bar.sales, 0)}
                          </div>
                          
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className="w-full max-w-[42px] rounded-t-xl bg-gradient-to-t from-indigo-600 via-cyber-purple to-cyber-cyan group-hover:brightness-125 transition-all shadow-lg shadow-cyber-purple/20"
                          />

                          <span className="text-xs font-mono text-slate-400 mt-2">{bar.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Category Inventory Breakdown */}
                <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/10 space-y-5">
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <Layers className="w-5 h-5 text-indigo-400" />
                    <span>Inventory Domains</span>
                  </h3>
                  <p className="text-xs text-slate-400">Distribution of product models per category.</p>

                  <div className="space-y-4 pt-2">
                    {categories.map((cat) => {
                      const count = products.filter(p => p.category_id === cat.id || p.category_name === cat.name).length;
                      const percent = products.length ? Math.round((count / products.length) * 100) : 20;

                      return (
                        <div key={cat.id} className="space-y-1.5 text-xs">
                          <div className="flex justify-between text-slate-300">
                            <span className="truncate pr-2 font-medium">{cat.name}</span>
                            <span className="font-mono text-slate-400">{count} units ({percent}%)</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-navy-950 overflow-hidden">
                            <div
                              style={{ width: `${percent}%` }}
                              className="h-full rounded-full bg-gradient-to-r from-cyber-purple to-cyber-cyan"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Recent Orders Placed Widget */}
              <div className="rounded-3xl glass-card border border-white/10 p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center space-x-2">
                      <Package className="w-5 h-5 text-cyber-cyan" />
                      <span>Latest Orders Placed</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Most recent hardware customer transactions.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-mono text-cyber-cyan hover:underline flex items-center space-x-1"
                  >
                    <span>View All Order History</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-navy-900/60 text-slate-400 uppercase font-mono text-[10px] border-b border-white/5">
                      <tr>
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Total (₹)</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 font-bold text-cyber-neonCyan">{ord.order_number}</td>
                          <td className="p-3 font-sans">
                            <span className="font-medium text-white">{ord.customer_name || 'Alex Vance'}</span>
                          </td>
                          <td className="p-3 font-bold text-white">{formatINR(ord.total_amount)}</td>
                          <td className="p-3">{getStatusBadge(ord.status)}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-cyber-purple text-xs text-slate-300 hover:text-white transition-colors"
                            >
                              Inspect Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ORDER PLACED HISTORY SUITE */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              {/* Top Order Telemetry Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl glass-card border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Total Placed</span>
                  <div className="text-2xl font-bold text-white font-mono">{orders.length}</div>
                </div>
                <div className="p-4 rounded-2xl glass-card border border-amber-500/20 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-amber-400">Processing Queue</span>
                  <div className="text-2xl font-bold text-amber-400 font-mono">{processingCount}</div>
                </div>
                <div className="p-4 rounded-2xl glass-card border border-cyan-500/20 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-cyan-400">In-Transit (Shipped)</span>
                  <div className="text-2xl font-bold text-cyan-400 font-mono">{shippedCount}</div>
                </div>
                <div className="p-4 rounded-2xl glass-card border border-emerald-500/20 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-emerald-400">Delivered Units</span>
                  <div className="text-2xl font-bold text-emerald-400 font-mono">{deliveredCount}</div>
                </div>
              </div>

              {/* Search, Filter & Sort Controls */}
              <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  
                  {/* Search Bar */}
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Search order history by Order ID, client name, email, or city..."
                      className="w-full bg-navy-950 text-xs sm:text-sm text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-purple"
                    />
                  </div>

                  {/* Sort Selector */}
                  <div className="flex items-center space-x-2 w-full md:w-auto">
                    <ArrowUpDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <select
                      value={orderSort}
                      onChange={(e) => setOrderSort(e.target.value)}
                      className="w-full md:w-48 bg-navy-950 text-xs text-white px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-purple font-mono"
                    >
                      <option value="newest">Newest Orders</option>
                      <option value="oldest">Oldest Orders</option>
                      <option value="amount-high">Amount: High to Low</option>
                      <option value="amount-low">Amount: Low to High</option>
                    </select>
                  </div>

                </div>

                {/* Status Filter Tabs */}
                <div className="flex items-center space-x-2 overflow-x-auto pt-1 pb-1 scrollbar-none">
                  {['all', 'Processing', 'Shipped', 'Delivered', 'Pending', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        orderStatusFilter === st
                          ? 'bg-cyber-purple text-white shadow-md'
                          : 'bg-navy-950 text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {st === 'all' ? `All Orders (${orders.length})` : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order History Table */}
              <div className="rounded-3xl glass-card border border-white/10 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-navy-900 text-slate-400 uppercase font-mono text-[10px] border-b border-white/10">
                      <tr>
                        <th className="p-4">Order ID & Date</th>
                        <th className="p-4">Client / Destination</th>
                        <th className="p-4">Hardware Units</th>
                        <th className="p-4">Total Paid (₹)</th>
                        <th className="p-4">Dispatch Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-12 text-center text-slate-400 font-sans">
                            <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            No orders match the current filter or search criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4">
                              <div className="font-bold text-cyber-neonCyan text-xs">{order.order_number}</div>
                              <div className="text-[10px] text-slate-400 flex items-center space-x-1 mt-0.5">
                                <Clock className="w-3 h-3" />
                                <span>{new Date(order.created_at).toLocaleString()}</span>
                              </div>
                            </td>

                            <td className="p-4 font-sans">
                              <div className="font-semibold text-white">{order.customer_name || 'Alex Vance'}</div>
                              <div className="text-[10px] text-slate-400 font-mono truncate max-w-[180px]">
                                {order.customer_email || 'alex@nexacart.ai'}
                              </div>
                              <div className="text-[10px] text-slate-400 flex items-center space-x-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-cyber-purple" />
                                <span>{order.shipping_address?.city || 'Bengaluru'}, {order.shipping_address?.state || 'KA'}</span>
                              </div>
                            </td>

                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                {order.items?.[0]?.image_url && (
                                  <img
                                    src={order.items[0].image_url}
                                    alt="Product"
                                    className="w-8 h-8 rounded-lg object-cover bg-navy-950 border border-white/5"
                                  />
                                )}
                                <div>
                                  <span className="text-slate-200 font-sans truncate max-w-[150px] block">
                                    {order.items?.[0]?.product_name || 'Neural Processor'}
                                  </span>
                                  {order.items?.length > 1 && (
                                    <span className="text-[10px] text-cyber-purple">
                                      +{order.items.length - 1} more unit(s)
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="p-4 font-bold text-white text-sm">
                              {formatINR(order.total_amount)}
                            </td>

                            <td className="p-4">
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className="bg-navy-950 text-xs text-white px-2.5 py-1.5 rounded-lg border border-white/10 focus:outline-none focus:border-cyber-purple font-mono cursor-pointer"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>

                            <td className="p-4 text-right">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="p-2 rounded-xl bg-navy-800 hover:bg-cyber-purple text-slate-200 hover:text-white transition-colors inline-flex items-center space-x-1.5"
                                title="Inspect Full Order Telemetry"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span className="text-[11px] font-sans">Inspect</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={prodSearch}
                    onChange={(e) => setProdSearch(e.target.value)}
                    placeholder="Filter products table..."
                    className="w-full bg-navy-900 text-xs text-white pl-10 pr-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-purple"
                  />
                </div>

                <button
                  onClick={handleOpenCreateProduct}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyber-purple to-indigo-600 text-white hover:opacity-90 shadow-lg shadow-cyber-purple/20 transition-all flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Deploy New Hardware Unit</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="rounded-3xl glass-card border border-white/10 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-navy-900 text-slate-400 uppercase font-mono text-[10px] border-b border-white/10">
                      <tr>
                        <th className="p-4">Hardware Unit</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price (₹)</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 flex items-center space-x-3">
                            <img
                              src={p.image_url}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover bg-navy-950 flex-shrink-0 border border-white/5"
                            />
                            <div>
                              <div className="font-sans font-bold text-white text-xs">{p.name}</div>
                              <div className="text-[10px] text-slate-400">{p.badge || 'Standard Spec'}</div>
                            </div>
                          </td>
                          <td className="p-4 text-slate-300 font-sans">{p.category_name}</td>
                          <td className="p-4 text-white font-bold">{formatINR(p.price)}</td>
                          <td className="p-4">
                            <span className={p.stock < 15 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                              {p.stock} units
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Active
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 rounded-lg bg-navy-800 hover:bg-cyber-purple text-slate-300 hover:text-white transition-colors"
                              title="Edit Silicon Unit"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 rounded-lg bg-navy-800 hover:bg-rose-500 text-slate-300 hover:text-white transition-colors"
                              title="Delete Silicon Unit"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
        </>
      )}

      {/* FULL ORDER DETAILS & INVOICE INSPECTION MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-navy-950/85 backdrop-blur-md" onClick={() => setSelectedOrder(null)} />

          <div className="relative w-full max-w-3xl rounded-3xl glass-card bg-navy-900/95 border border-cyber-purple/40 shadow-2xl p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-150 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-extrabold text-white font-mono">{selectedOrder.order_number}</span>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Placed on {new Date(selectedOrder.created_at).toLocaleString()} • ID #{selectedOrder.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client & Shipping Profile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-navy-950/80 border border-white/5 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">CUSTOMER CONTACT</span>
                <p className="text-white font-sans font-bold text-sm">{selectedOrder.customer_name || 'Alex Vance'}</p>
                <p className="text-slate-300 flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span>{selectedOrder.customer_email || 'alex@nexacart.ai'}</span>
                </p>
                <p className="text-slate-300 flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-cyber-purple" />
                  <span>{selectedOrder.customer_phone || '+91 98110 12345'}</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-navy-950/80 border border-white/5 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">SHIPPING DESTINATION</span>
                <p className="text-slate-200 leading-relaxed font-sans">
                  {selectedOrder.shipping_address?.street || 'Flat 402, Neo Tech Heights'}<br />
                  {selectedOrder.shipping_address?.city || 'Bengaluru'}, {selectedOrder.shipping_address?.state || 'Karnataka'} - {selectedOrder.shipping_address?.zipCode || '560066'}<br />
                  <span className="text-slate-400">{selectedOrder.shipping_address?.country || 'India'}</span>
                </p>
              </div>
            </div>

            {/* Ordered Units Table */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold block">
                Ordered Silicon Units ({selectedOrder.items?.length || 0})
              </span>

              <div className="rounded-2xl bg-navy-950/80 border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-navy-900 text-slate-400 font-mono text-[10px]">
                      <tr>
                        <th className="p-3">Unit</th>
                        <th className="p-3">Unit Price</th>
                        <th className="p-3">Qty</th>
                        <th className="p-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {selectedOrder.items?.map((it, idx) => (
                        <tr key={idx}>
                          <td className="p-3 flex items-center space-x-2.5 font-sans">
                            {it.image_url && (
                              <img src={it.image_url} alt={it.product_name} className="w-8 h-8 rounded-lg object-cover" />
                            )}
                            <span className="font-semibold text-white">{it.product_name}</span>
                          </td>
                          <td className="p-3 text-slate-300">{formatINR(it.price)}</td>
                          <td className="p-3 text-white">{it.quantity}</td>
                          <td className="p-3 text-right text-white font-bold">{formatINR(it.price * it.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Financial Summary & Status Modifier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
              
              {/* Status Modifier */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-300 font-semibold">
                  Update Fulfillment Status:
                </label>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                    className="flex-1 bg-navy-950 text-xs text-white p-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-purple font-mono"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  Payment Method: {selectedOrder.payment_method || 'Simulated AI Pay (UPI/Card)'}
                </p>
              </div>

              {/* Financial Totals */}
              <div className="space-y-1.5 text-xs font-mono text-slate-300 text-right">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatINR(selectedOrder.total_amount - (selectedOrder.tax_amount || 0) - (selectedOrder.shipping_amount || 0) + (selectedOrder.discount_amount || 0))}</span>
                </div>
                {selectedOrder.discount_amount > 0 && (
                  <div className="flex justify-between text-cyber-neonCyan">
                    <span>Discount</span>
                    <span>-{formatINR(selectedOrder.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{selectedOrder.shipping_amount === 0 ? 'FREE' : formatINR(selectedOrder.shipping_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>{formatINR(selectedOrder.tax_amount || 0)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-bold text-white">
                  <span>Grand Total</span>
                  <span className="text-cyber-neonCyan">{formatINR(selectedOrder.total_amount)}</span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-navy-800 hover:bg-navy-700 text-white transition-colors"
              >
                Close Order Details
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-navy-950/85 backdrop-blur-md" onClick={() => setIsProductModalOpen(false)} />

          <div className="relative w-full max-w-2xl rounded-3xl glass-card bg-navy-900/95 border border-white/10 shadow-2xl p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-150">
            
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-6">
              {editingProduct ? 'Edit Hardware Telemetry' : 'Deploy New Silicon Unit'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-mono">Product Name</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Nexa Quantum NPU-1000"
                  className="w-full bg-navy-950 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-cyan"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Category</label>
                  <select
                    value={productForm.category_id}
                    onChange={(e) => {
                      const id = parseInt(e.target.value, 10);
                      const cat = categories.find(c => c.id === id);
                      setProductForm({
                        ...productForm,
                        category_id: id,
                        category_name: cat ? cat.name : 'Neural Processors & TPUs'
                      });
                    }}
                    className="w-full bg-navy-950 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-cyan font-mono"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Spec Badge</label>
                  <input
                    type="text"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    placeholder="Bestseller, Pro Spec, New Era"
                    className="w-full bg-navy-950 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-cyan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="124999.00"
                    className="w-full bg-navy-950 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-cyan font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Original Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.original_price}
                    onChange={(e) => setProductForm({ ...productForm, original_price: e.target.value })}
                    placeholder="149999.00"
                    className="w-full bg-navy-950 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-cyan font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-mono">Stock Count</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="25"
                    className="w-full bg-navy-950 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-cyan font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Image URL</label>
                <input
                  type="url"
                  required
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-navy-950 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-cyan font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-mono">Description</label>
                <textarea
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Engineered with 980 Neural TOPS, dedicated FP8 matrix engines..."
                  className="w-full bg-navy-950 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-cyan resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-navy-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyber-purple to-indigo-600 text-white font-semibold shadow-lg shadow-cyber-purple/20 flex items-center space-x-2"
                >
                  {savingProduct ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to DB...</span>
                    </>
                  ) : (
                    <span>Commit To Database</span>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
