export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  featured: boolean;
  categoryId: string;
  category?: Category;
  createdAt: string;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  quantity: number;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  product?: Product;
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostal: string;
  shippingCountry: string;
  paymentMethod: string;
  paymentId?: string;
  items: OrderItem[];
  createdAt: string;
  user?: {
    id?: string;
    name: string;
    email: string;
  };
}

export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}
