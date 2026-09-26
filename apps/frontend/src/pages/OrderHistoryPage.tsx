import React, { useEffect, useState } from 'react';
import { Package, Clock, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Order } from '../types/index.js';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';

interface OrderHistoryPageProps {
  onBrowseCatalog: () => void;
  onOpenAuth: (mode: 'login') => void;
}

export const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({
  onBrowseCatalog,
  onOpenAuth,
}) => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchOrders() {
      try {
        setIsLoading(true);
        const data = await api.orders.getOrders();
        setOrders(data.orders || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load order history.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sign in to view your orders</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          Track your package status, view past receipts, and manage your account.
        </p>
        <button
          onClick={() => onOpenAuth('login')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'SHIPPED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PAID':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Order History</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your purchase history and order delivery status.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 animate-pulse"
            >
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="h-12 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No orders placed yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Once you place an order, you will be able to track its simulated shipment status right here.
          </p>
          <button
            onClick={onBrowseCatalog}
            className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 transition-all inline-flex items-center gap-2"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-slate-50/70 p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                      Order Reference
                    </span>
                    <span className="font-mono font-bold text-slate-800">{order.orderNumber}</span>
                  </div>
                  <div className="hidden sm:block border-l border-slate-200 pl-4">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                      Date Placed
                    </span>
                    <span className="text-slate-700 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <span className="font-extrabold text-slate-900 text-base">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 sm:p-6 space-y-4">
                <div className="divide-y divide-slate-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                          {item.quantity}x
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-800">{item.title}</h4>
                          <span className="text-xs text-slate-400">
                            Unit Price: ${item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery Information Footer */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Delivering to: <strong className="text-slate-700">{order.shippingName}</strong> —{' '}
                      {order.shippingAddress}, {order.shippingCity}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>Updated {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
