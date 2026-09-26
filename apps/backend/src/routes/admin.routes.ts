import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

export const adminRouter = Router();

// Guard all admin routes with authentication and ADMIN role check
adminRouter.use(requireAuth, requireAdmin);

// Dashboard overview stats
adminRouter.get('/stats', async (_req: Request, res: Response) => {
  try {
    const [totalUsers, totalProducts, totalOrders, orders] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.findMany({ select: { totalAmount: true, status: true } }),
    ]);

    const totalRevenue = orders
      .filter((o) => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        items: true,
      },
    });

    return res.json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
      },
      recentOrders,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({ error: 'Failed to retrieve admin dashboard stats.' });
  }
});

// Admin: Get all products
adminRouter.get('/products', async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ products });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// Admin: Create product
adminRouter.post('/products', async (req: Request, res: Response) => {
  try {
    const { title, description, price, imageUrl, categoryId, stock = 10, featured = false } = req.body;

    if (!title || !description || price === undefined || !categoryId) {
      return res.status(400).json({
        error: 'Title, description, price, and categoryId are required fields.',
      });
    }

    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10);

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ error: 'Valid positive price is required.' });
    }

    const defaultImg =
      imageUrl?.trim() ||
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';

    const product = await prisma.product.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        price: parsedPrice,
        imageUrl: defaultImg,
        categoryId,
        stock: isNaN(parsedStock) ? 10 : parsedStock,
        featured: Boolean(featured),
      },
      include: { category: true },
    });

    return res.status(201).json({
      message: 'Product created successfully.',
      product,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ error: 'Failed to create product.' });
  }
});

// Admin: Update product
adminRouter.put('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, price, imageUrl, categoryId, stock, featured } = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const data: any = {};
    if (title !== undefined) data.title = title.trim();
    if (description !== undefined) data.description = description.trim();
    if (price !== undefined) data.price = parseFloat(price);
    if (imageUrl !== undefined) data.imageUrl = imageUrl.trim();
    if (categoryId !== undefined) data.categoryId = categoryId;
    if (stock !== undefined) data.stock = parseInt(stock, 10);
    if (featured !== undefined) data.featured = Boolean(featured);

    const updated = await prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });

    return res.json({
      message: 'Product updated successfully.',
      product: updated,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ error: 'Failed to update product.' });
  }
});

// Admin: Delete product
adminRouter.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    await prisma.product.delete({ where: { id } });

    return res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ error: 'Failed to delete product.' });
  }
});

// Admin: Get all orders
adminRouter.get('/orders', async (_req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ orders });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return res.status(500).json({ error: 'Failed to fetch store orders.' });
  }
});

// Admin: Update order status
adminRouter.patch('/orders/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status: status.toUpperCase() },
      include: {
        items: true,
        user: { select: { name: true, email: true } },
      },
    });

    return res.json({
      message: `Order status updated to ${status.toUpperCase()}.`,
      order: updated,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ error: 'Failed to update order status.' });
  }
});
