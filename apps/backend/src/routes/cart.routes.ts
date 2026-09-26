import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

export const cartRouter = Router();

// All cart endpoints require authentication
cartRouter.use(requireAuth);

// Get current user's cart
cartRouter.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const subtotal = items.reduce((sum, item) => {
      return sum + (item.product ? item.product.price * item.quantity : 0);
    }, 0);

    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return res.json({
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      totalCount,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({ error: 'Failed to retrieve shopping cart.' });
  }
});

// Add item to cart
cartRouter.post('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required.' });
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    // Verify product exists and check stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    if (product.stock < 1) {
      return res.status(400).json({ error: 'This product is currently out of stock.' });
    }

    // Check if item already exists in user's cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    let cartItem;
    if (existingCartItem) {
      const newQty = existingCartItem.quantity + qty;
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQty },
        include: { product: true },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity: qty,
        },
        include: { product: true },
      });
    }

    return res.status(201).json({
      message: 'Item added to cart.',
      item: cartItem,
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({ error: 'Failed to add item to cart.' });
  }
});

// Update cart item quantity
cartRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { quantity } = req.body;

    const qty = parseInt(quantity, 10);

    const existing = await prisma.cartItem.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Cart item not found.' });
    }

    if (qty <= 0) {
      await prisma.cartItem.delete({
        where: { id },
      });
      return res.json({ message: 'Item removed from cart.' });
    }

    const updated = await prisma.cartItem.update({
      where: { id },
      data: { quantity: qty },
      include: { product: true },
    });

    return res.json({ item: updated });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return res.status(500).json({ error: 'Failed to update cart item.' });
  }
});

// Remove item from cart
cartRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const existing = await prisma.cartItem.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Cart item not found.' });
    }

    await prisma.cartItem.delete({
      where: { id },
    });

    return res.json({ message: 'Item successfully removed.' });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return res.status(500).json({ error: 'Failed to remove cart item.' });
  }
});

// Clear entire cart
cartRouter.delete('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    return res.json({ message: 'Cart cleared successfully.' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return res.status(500).json({ error: 'Failed to clear cart.' });
  }
});
