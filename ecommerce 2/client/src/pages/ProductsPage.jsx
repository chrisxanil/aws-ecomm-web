import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Cpu,
  Layers,
  ArrowUpDown,
  Sparkles,
  Loader2
} from 'lucide-react';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const activeCategory = searchParams.get('category') || 'all';
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'featured');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  // Fetch categories once
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.getCategories();
        if (res.success) setCategories(res.categories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.getProducts({
          category: activeCategory !== 'all' ? activeCategory : undefined,
          search: searchQuery || undefined,
          sort: selectedSort !== 'featured' ? selectedSort : undefined,
          maxPrice: maxPrice || undefined
        });
        if (res.success) setProducts(res.products);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 200);

    return () => clearTimeout(debounceTimer);
  }, [activeCategory, searchQuery, selectedSort, maxPrice]);

  const handleCategorySelect = (slug) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', slug);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSort('featured');
    setMaxPrice('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-cyber-neonCyan mb-1">
          <Cpu className="w-3.5 h-3.5" />
          <span>Silicon Inventory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Hardware & Neural Systems Catalogue
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Browse enterprise tensor accelerators, autonomous robotics, brain-computer interfaces, and spatial holographic displays.
        </p>
      </div>

      {/* Filter and Search Bar Control Strip */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 mb-8 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by hardware name, architecture, specs, or keyword..."
              className="w-full bg-navy-950 text-xs sm:text-sm text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-cyan"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <ArrowUpDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full md:w-48 bg-navy-950 text-xs text-white px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-purple"
            >
              <option value="featured">Featured / Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest Releases</option>
            </select>
          </div>

          {/* Max Price Filter */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-xs font-mono text-slate-400 flex-shrink-0">Max ₹:</span>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="e.g. 150000"
              className="w-28 bg-navy-950 text-xs text-white px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyber-cyan"
            />
          </div>

          {/* Reset Filters */}
          {(searchQuery || activeCategory !== 'all' || maxPrice || selectedSort !== 'featured') && (
            <button
              onClick={handleResetFilters}
              className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-xs text-slate-300 hover:text-white border border-white/10 transition-colors flex-shrink-0"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === 'all'
                ? 'bg-gradient-to-r from-cyber-purple to-indigo-600 text-white shadow-md'
                : 'bg-navy-950 text-slate-300 hover:text-white border border-white/5 hover:border-white/20'
            }`}
          >
            All Hardware ({products.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.slug
                  ? 'bg-gradient-to-r from-cyber-purple to-indigo-600 text-white shadow-md'
                  : 'bg-navy-950 text-slate-300 hover:text-white border border-white/5 hover:border-white/20'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

      </div>

      {/* Product Grid Area */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-80 rounded-2xl glass-card animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 rounded-3xl glass-card border border-white/5 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-navy-900 border border-white/10 flex items-center justify-center text-slate-400">
            <Search className="w-8 h-8 opacity-40" />
          </div>
          <h3 className="text-lg font-bold text-white">No Silicon Units Match Your Filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria, widening the price envelope, or clearing category restrictions.
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-cyber-purple text-white hover:bg-cyber-purple/90 transition-all shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}

