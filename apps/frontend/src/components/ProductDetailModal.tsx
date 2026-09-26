import React, { useState } from 'react';
import { X, ShoppingBag, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Product } from '../types/index.js';
import { useCart } from '../context/CartContext.js';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  if (!product) return null;

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(product, quantity);
    setIsAdding(false);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-700 bg-white/80 hover:bg-white rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square md:aspect-auto bg-slate-100 h-full min-h-[300px]">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.category && (
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                {product.category.name}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    product.stock > 0
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
                </span>
                {product.featured && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Featured
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {product.title}
              </h2>

              <p className="mt-2 text-2xl font-bold text-indigo-600">
                ${product.price.toFixed(2)}
              </p>

              <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Learning Badges */}
              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-slate-500">
                <div className="flex flex-col items-center">
                  <Truck className="w-4 h-4 text-indigo-600 mb-1" />
                  <span className="text-[11px] font-medium">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="text-[11px] font-medium">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-4 h-4 text-amber-600 mb-1" />
                  <span className="text-[11px] font-medium">Easy Returns</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Quantity</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-semibold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || isAdding}
                className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                  product.stock <= 0
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : justAdded
                    ? 'bg-emerald-600 text-white shadow-emerald-200'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-5 h-5" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" /> Add to Cart — ${(product.price * quantity).toFixed(2)}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
