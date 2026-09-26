import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { CartProvider } from './context/CartContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { ProductDetailModal } from './components/ProductDetailModal.js';
import { CartDrawer } from './components/CartDrawer.js';
import { AuthModal } from './pages/AuthModal.js';
import { CatalogPage } from './pages/CatalogPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { OrderHistoryPage } from './pages/OrderHistoryPage.js';
import { AdminPage } from './pages/AdminPage.js';
import { Product } from './types/index.js';

type ViewMode = 'catalog' | 'checkout' | 'orders' | 'admin';

const MainLayout: React.FC = () => {
  const { isAdmin } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>('catalog');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: 'login' | 'register';
  }>({
    isOpen: false,
    mode: 'login',
  });

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModal({ isOpen: true, mode });
  };

  const handleCloseAuth = () => {
    setAuthModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Header Navbar */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        onNavigate={handleNavigate}
        currentView={currentView}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {currentView === 'catalog' && (
          <CatalogPage onSelectProduct={(p) => setSelectedProduct(p)} />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onBackToCatalog={() => handleNavigate('catalog')}
            onNavigateToOrders={() => handleNavigate('orders')}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'orders' && (
          <OrderHistoryPage
            onBrowseCatalog={() => handleNavigate('catalog')}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'admin' && <AdminPage />}
      </main>

      {/* Global Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer onCheckout={() => handleNavigate('checkout')} />

      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={handleCloseAuth}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <MainLayout />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
