import React from 'react';
import { Plus, Eye, Check } from 'lucide-react';
import { Product } from '../types/index.js';
import { useCart } from '../context/CartContext.js';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart, items } = useCart();
  const [addedRecently, setAddedRecently] = React.useState(false);

  const isInCart = items.some((item) => item.productId === product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock <= 0) return;
    await addToCart(product, 1);
    setAddedRecently(true);
    setTimeout(() => setAddedRecently(false), 1500);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Pill */}
        {product.category && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {product.category.name}
          </span>
        )}

        {/* Out of stock badge */}
        {product.stock <= 0 ? (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
            Out of Stock
          </span>
        ) : product.featured ? (
          <span className="absolute top-3 right-3 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
            Featured
          </span>
        ) : null}

        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" /> Quick View
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product.title}
          </h3>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-lg font-bold text-slate-900">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all ${
              product.stock <= 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : addedRecently
                ? 'bg-emerald-600 text-white'
                : isInCart
                ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
            }`}
          >
            {addedRecently ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
