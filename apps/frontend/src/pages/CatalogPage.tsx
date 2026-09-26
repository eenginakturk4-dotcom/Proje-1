import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Sparkles, AlertCircle } from 'lucide-react';
import { Product, Category } from '../types/index.js';
import { api } from '../services/api.js';
import { ProductCard } from '../components/ProductCard.js';

interface CatalogPageProps {
  onSelectProduct: (product: Product) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ onSelectProduct }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load categories and featured items on mount
  useEffect(() => {
    async function loadInitial() {
      try {
        const [catRes, featRes] = await Promise.all([
          api.catalog.getCategories(),
          api.catalog.getFeatured(),
        ]);
        setCategories(catRes.categories || []);
        setFeaturedProducts(featRes.products || []);
      } catch (err: any) {
        console.warn('Initial data load error:', err);
      }
    }
    loadInitial();
  }, []);

  // Fetch filtered & searched products
  useEffect(() => {
    let isCancelled = false;

    async function fetchCatalog() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.catalog.getProducts({
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          search: searchTerm || undefined,
          sort: sortBy,
          page: currentPage,
          limit: 12,
        });

        if (!isCancelled) {
          setProducts(res.products || []);
          setTotalPages(res.pagination?.totalPages || 1);
        }
      } catch (err: any) {
        if (!isCancelled) {
          setError(err.message || 'Failed to fetch catalog products.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    const timer = setTimeout(() => {
      fetchCatalog();
    }, 250); // 250ms debounce for search

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [selectedCategory, searchTerm, sortBy, currentPage]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-12 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold mb-4 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Learning Full-Stack Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Minimal, modern e-commerce that just works.
          </h1>
          <p className="mt-4 text-sm sm:text-base text-indigo-100 max-w-xl leading-relaxed">
            Practice real authentication, relational databases with Prisma & PostgreSQL, persistent carts, and mock checkout flows without unnecessary fluff.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('catalog-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-2xl bg-white text-indigo-950 font-bold text-sm hover:bg-indigo-50 shadow-lg transition-transform hover:-translate-y-0.5"
            >
              Explore Products
            </button>
            <span className="text-xs text-indigo-200/80">
              ⚡ Over {featuredProducts.length || '10+'} curated items ready to test
            </span>
          </div>
        </div>

        {/* Decorative circle glow */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Filter and Search Bar Controls */}
      <div id="catalog-grid" className="scroll-mt-24 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by title or keyword..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden sm:block" />
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="title_asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Categories
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat.name}
              {cat._count?.products !== undefined && (
                <span className="ml-1.5 opacity-70 text-[10px]">
                  ({cat._count.products})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid State Handling */}
      {error ? (
        <div className="p-8 bg-red-50 border border-red-200 rounded-3xl text-center text-red-700">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
          <p className="font-bold text-sm">Failed to load catalog products</p>
          <p className="text-xs mt-1">{error}</p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl"
          >
            Reset Filters & Retry
          </button>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 animate-pulse"
            >
              <div className="aspect-[4/3] bg-slate-200 rounded-xl" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-full" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-5 bg-slate-200 rounded w-16" />
                <div className="h-8 bg-slate-200 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No products found</h3>
          <p className="text-xs text-slate-500 mt-1">
            No products matched "{searchTerm}" in this category. Try adjusting your search or filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-slate-200 bg-white rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-xs font-semibold text-slate-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-slate-200 bg-white rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
