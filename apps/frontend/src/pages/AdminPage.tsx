import React, { useState, useEffect } from 'react';
import {
  Shield,
  Package,
  TrendingUp,
  Users,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { Product, Order, AdminStats, Category } from '../types/index.js';

export const AdminPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Product modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formStock, setFormStock] = useState('15');
  const [formFeatured, setFormFeatured] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, prodRes, catRes, ordRes] = await Promise.all([
        api.admin.getStats(),
        api.admin.getProducts(),
        api.catalog.getCategories(),
        api.admin.getOrders(),
      ]);
      setStats(statsRes.stats);
      setProducts(prodRes.products || []);
      setCategories(catRes.categories || []);
      setOrders(ordRes.orders || []);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load admin data.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <Shield className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
        <p className="text-xs text-slate-500 mt-2">
          Administrator privileges are required to view this panel. Please sign in with an admin account.
        </p>
      </div>
    );
  }

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormTitle('');
    setFormDescription('');
    setFormPrice('');
    setFormImageUrl('');
    setFormCategoryId(categories[0]?.id || '');
    setFormStock('15');
    setFormFeatured(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormTitle(p.title);
    setFormDescription(p.description);
    setFormPrice(p.price.toString());
    setFormImageUrl(p.imageUrl);
    setFormCategoryId(p.categoryId);
    setFormStock(p.stock.toString());
    setFormFeatured(p.featured);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: formTitle,
        description: formDescription,
        price: parseFloat(formPrice),
        imageUrl: formImageUrl || undefined,
        categoryId: formCategoryId,
        stock: parseInt(formStock, 10),
        featured: formFeatured,
      };

      if (editingProduct) {
        await api.admin.updateProduct(editingProduct.id, payload);
        setMessage({ type: 'success', text: `Product "${formTitle}" updated!` });
      } else {
        await api.admin.createProduct(payload);
        setMessage({ type: 'success', text: `Product "${formTitle}" added to catalog!` });
      }

      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save product.' });
    }
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await api.admin.deleteProduct(id);
      setMessage({ type: 'success', text: `Product "${title}" deleted.` });
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete product.' });
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.admin.updateOrderStatus(orderId, newStatus);
      setMessage({ type: 'success', text: `Order status updated to ${newStatus}.` });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
      );
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update order status.' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Store Operations Panel</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
        </div>

        {activeTab === 'products' && (
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        )}
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-semibold ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <DollarSign className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Total Revenue</p>
            <p className="text-2xl font-black text-slate-900 mt-1">${stats.totalRevenue.toFixed(2)}</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Total Orders</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalOrders}</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Package className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Total Products</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalProducts}</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Registered Users</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalUsers}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'products'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Management ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Order Fulfillment ({orders.length})</span>
        </button>
      </div>

      {/* Tab 1: Products Table */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Item</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-10 h-10 rounded-xl object-cover bg-slate-100"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{p.title}</span>
                        <span className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                          {p.description}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 font-medium">
                        {p.category?.name || 'General'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">${p.price.toFixed(2)}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-semibold ${
                          p.stock <= 5 ? 'text-red-600' : 'text-slate-700'
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {p.featured ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                          Yes
                        </span>
                      ) : (
                        <span className="text-slate-400">No</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.title)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Orders Fulfillment Table */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Order Ref</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="font-semibold block">{ord.shippingName}</span>
                      <span className="text-[11px] text-slate-400">{ord.user?.email}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {ord.items.length} item(s)
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ${ord.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className="py-1 px-2.5 rounded-xl border border-slate-200 bg-white font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="PAID">PAID</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-extrabold text-slate-900 mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Wireless Noise Canceling Headphones"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detailed product features and specifications..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="99.99"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    placeholder="25"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span>Featured on Home</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-200"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
