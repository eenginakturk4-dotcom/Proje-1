const API_BASE = import.meta.env.VITE_API_URL || '/api';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

class ApiService {
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  public async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers = new Headers(options.headers || {});

    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const token = localStorage.getItem('shoppy_access_token');
    if (token && !options.skipAuth) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    let response = await fetch(url, { ...options, headers });

    // Handle token expiration & auto refresh
    if (response.status === 401 && !options.skipAuth && endpoint !== '/auth/login' && endpoint !== '/auth/register' && endpoint !== '/auth/refresh') {
      const refreshToken = localStorage.getItem('shoppy_refresh_token');
      if (refreshToken) {
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          try {
            const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken }),
            });

            if (refreshRes.ok) {
              const data = await refreshRes.json();
              localStorage.setItem('shoppy_access_token', data.accessToken);
              localStorage.setItem('shoppy_refresh_token', data.refreshToken);
              this.onTokenRefreshed(data.accessToken);
            } else {
              // Refresh failed, clear session
              localStorage.removeItem('shoppy_access_token');
              localStorage.removeItem('shoppy_refresh_token');
              localStorage.removeItem('shoppy_user');
              window.dispatchEvent(new Event('shoppy_auth_logout'));
              throw new Error('Session expired');
            }
          } catch (e) {
            this.isRefreshing = false;
            throw e;
          } finally {
            this.isRefreshing = false;
          }
        }

        // Wait for token refresh
        const retryToken = await new Promise<string>((resolve) => {
          this.addRefreshSubscriber((newToken) => resolve(newToken));
        });

        headers.set('Authorization', `Bearer ${retryToken}`);
        response = await fetch(url, { ...options, headers });
      }
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.error || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  }

  // Auth
  auth = {
    register: (body: any) => this.request('/auth/register', { method: 'POST', body: JSON.stringify(body), skipAuth: true }),
    login: (body: any) => this.request('/auth/login', { method: 'POST', body: JSON.stringify(body), skipAuth: true }),
    refresh: (refreshToken: string) => this.request('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }), skipAuth: true }),
    logout: (refreshToken?: string) => this.request('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) }),
    me: () => this.request('/auth/me'),
  };

  // Catalog
  catalog = {
    getCategories: () => this.request('/categories'),
    getFeatured: () => this.request('/products/featured'),
    getProducts: (params?: { category?: string; search?: string; sort?: string; page?: number; limit?: number }) => {
      const query = new URLSearchParams();
      if (params?.category) query.append('category', params.category);
      if (params?.search) query.append('search', params.search);
      if (params?.sort) query.append('sort', params.sort);
      if (params?.page) query.append('page', params.page.toString());
      if (params?.limit) query.append('limit', params.limit.toString());
      return this.request(`/products?${query.toString()}`);
    },
    getProductById: (id: string) => this.request(`/products/${id}`),
  };

  // Cart
  cart = {
    getCart: () => this.request('/cart'),
    addToCart: (productId: string, quantity = 1) => this.request('/cart', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
    updateQuantity: (id: string, quantity: number) => this.request(`/cart/${id}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
    removeItem: (id: string) => this.request(`/cart/${id}`, { method: 'DELETE' }),
    clearCart: () => this.request('/cart', { method: 'DELETE' }),
  };

  // Orders & Checkout
  orders = {
    mockCheckout: (shippingDetails: {
      shippingName: string;
      shippingAddress: string;
      shippingCity: string;
      shippingPostal: string;
      shippingCountry?: string;
    }) => this.request('/checkout/mock', { method: 'POST', body: JSON.stringify(shippingDetails) }),
    getOrders: () => this.request('/orders'),
    getOrderById: (id: string) => this.request(`/orders/${id}`),
  };

  // Admin
  admin = {
    getStats: () => this.request('/admin/stats'),
    getProducts: () => this.request('/admin/products'),
    createProduct: (data: any) => this.request('/admin/products', { method: 'POST', body: JSON.stringify(data) }),
    updateProduct: (id: string, data: any) => this.request(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteProduct: (id: string) => this.request(`/admin/products/${id}`, { method: 'DELETE' }),
    getOrders: () => this.request('/admin/orders'),
    updateOrderStatus: (id: string, status: string) => this.request(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  };
}

export const api = new ApiService();
