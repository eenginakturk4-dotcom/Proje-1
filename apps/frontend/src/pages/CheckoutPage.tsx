import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, AlertCircle, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { Order } from '../types/index.js';

interface CheckoutPageProps {
  onBackToCatalog: () => void;
  onNavigateToOrders: () => void;
  onOpenAuth: (mode: 'login') => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onBackToCatalog,
  onNavigateToOrders,
  onOpenAuth,
}) => {
  const { items, subtotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [shippingName, setShippingName] = useState(user?.name || '');
  const [shippingAddress, setShippingAddress] = useState('Istiklal Cad. No: 120 Kat: 3');
  const [shippingCity, setShippingCity] = useState('Istanbul');
  const [shippingPostal, setShippingPostal] = useState('34430');
  const [shippingCountry, setShippingCountry] = useState('Turkey');
  const [paymentMethod, setPaymentMethod] = useState<'mock' | 'stripe'>('mock');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Sync shipping name with logged in user if loaded later
  React.useEffect(() => {
    if (user?.name && !shippingName) {
      setShippingName(user.name);
    }
  }, [user, shippingName]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onOpenAuth('login');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty. Add products before placing an order.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await api.orders.mockCheckout({
        shippingName,
        shippingAddress,
        shippingCity,
        shippingPostal,
        shippingCountry,
      });

      setConfirmedOrder(res.order);
      await clearCart();
    } catch (err: any) {
      setError(err.message || 'Payment simulation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Confirmation Receipt View
  if (confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Payment Completed
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            Thank you for your order!
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Your simulated order has been saved in the database with reference code:
          </p>
          <div className="my-4 py-2 px-4 bg-slate-100 rounded-xl inline-block font-mono text-sm font-bold text-slate-800">
            {confirmedOrder.orderNumber}
          </div>

          <div className="border-t border-b border-slate-100 py-4 my-6 text-left space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-700">Recipient:</span>
              <span>{confirmedOrder.shippingName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-700">Shipping Address:</span>
              <span>{confirmedOrder.shippingAddress}, {confirmedOrder.shippingCity}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-700">Total Charged:</span>
              <span className="font-bold text-slate-900 text-sm">
                ${confirmedOrder.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onNavigateToOrders}
              className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-200 transition-all"
            >
              View in My Orders
            </button>
            <button
              onClick={onBackToCatalog}
              className="py-3 px-6 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-16">
      <div className="mb-6 flex items-center gap-2">
        <button
          onClick={onBackToCatalog}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 py-1 px-2.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
        </button>
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
        Checkout & Complete Purchase
      </h1>

      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-indigo-950">You are checking out as a Guest</p>
              <p className="text-[11px] text-indigo-700">
                Sign in to save this order to your persistent account history.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenAuth('login')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            Sign In Now
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Column */}
        <div className="lg:col-span-7">
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            {/* Shipping Address Section */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>1. Shipping Information</span>
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Recipient Name
                </label>
                <input
                  type="text"
                  required
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="123 Main St, Apt 4B"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    placeholder="Istanbul"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingPostal}
                    onChange={(e) => setShippingPostal(e.target.value)}
                    placeholder="34000"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={shippingCountry}
                    onChange={(e) => setShippingCountry(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>2. Payment Method</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mock')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'mock'
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                      Recommended
                    </span>
                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Mock Payment (v1)</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Instantly approve transaction and record order into PostgreSQL database.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'stripe'
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Stretch Goal
                    </span>
                    <CreditCard className="w-5 h-5 text-slate-600" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Stripe Test Mode</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Simulate card authorization using test mode payment credentials.
                  </p>
                </button>
              </div>

              {paymentMethod === 'stripe' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
                  <p className="font-semibold text-slate-800">
                    💳 Stripe Test Mode Simulation Enabled:
                  </p>
                  <p>Card Number: 4242 •••• •••• 4242 | Exp: 12/28 | CVC: 123</p>
                  <p className="text-[11px] text-slate-500 italic">
                    Submitting will verify and place the order through the backend checkout API.
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Pay & Place Order — ${subtotal.toFixed(2)}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Order Summary Column */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm sticky top-24 space-y-5">
            <h2 className="text-base font-bold text-slate-900">Order Summary</h2>

            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex gap-3 items-center">
                  <img
                    src={item.product?.imageUrl}
                    alt={item.product?.title}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {item.product?.title}
                    </p>
                    <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Taxes</span>
                <span className="font-semibold text-slate-900">$0.00</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Due</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Safe mock transaction recorded atomically in PostgreSQL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
