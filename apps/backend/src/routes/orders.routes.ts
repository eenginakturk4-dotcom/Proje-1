import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

export const ordersRouter = Router();

// Mock checkout: converts current cart to paid order
ordersRouter.post('/checkout/mock', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      shippingName,
      shippingAddress,
      shippingCity,
      shippingPostal,
      shippingCountry = 'Turkey',
    } = req.body;

    if (!shippingName || !shippingAddress || !shippingCity || !shippingPostal) {
      return res.status(400).json({
        error: 'Complete shipping details (Name, Address, City, Postal Code) are required.',
      });
    }

    // Fetch user cart
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty. Cannot checkout.' });
    }

    // Verify stock and compute total
    let totalAmount = 0;
    for (const item of cartItems) {
      if (!item.product) {
        return res.status(400).json({ error: `Product in cart is no longer available.` });
      }
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for "${item.product.title}". Only ${item.product.stock} left in stock.`,
        });
      }
      totalAmount += item.product.price * item.quantity;
    }

    totalAmount = Math.round(totalAmount * 100) / 100;

    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    // Execute order creation, stock decrement, and cart clearing atomically
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: 'PAID',
          totalAmount,
          shippingName: shippingName.trim(),
          shippingAddress: shippingAddress.trim(),
          shippingCity: shippingCity.trim(),
          shippingPostal: shippingPostal.trim(),
          shippingCountry: shippingCountry.trim(),
          paymentMethod: 'mock',
          paymentId: `mock_pay_${Date.now()}`,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              title: item.product.title,
              price: item.product.price,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // 2. Decrement stock
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 3. Clear user's cart
      await tx.cartItem.deleteMany({
        where: { userId },
      });

      return newOrder;
    });

    return res.status(201).json({
      message: 'Order placed successfully! Mock payment received.',
      order,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ error: 'Failed to process checkout transaction.' });
  }
});

// Stripe checkout intent (Stretch goal mock / test-mode ready)
ordersRouter.post('/checkout/stripe', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + (item.product ? item.product.price * item.quantity : 0),
      0
    );

    // If STRIPE_SECRET_KEY is configured, we could generate a real PaymentIntent.
    // For v1 without required Stripe credentials, we return client secret simulator:
    const mockClientSecret = `pi_test_${Date.now()}_secret_${Math.random().toString(36).substring(2)}`;

    return res.json({
      clientSecret: mockClientSecret,
      amount: Math.round(subtotal * 100),
      currency: 'usd',
      message: 'Stripe test-mode intent initialized. Complete checkout via mock flow.',
    });
  } catch (error) {
    console.error('Stripe intent error:', error);
    return res.status(500).json({ error: 'Failed to initiate Stripe payment.' });
  }
});

// Get customer's orders
ordersRouter.get('/orders', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'Failed to fetch order history.' });
  }
});

// Get single order details
ordersRouter.get('/orders/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        id,
        // Only return if order belongs to user or user is admin
        ...(req.user!.role === 'ADMIN' ? {} : { userId }),
      },
      include: {
        items: true,
        user: {
          select: { name: true, email: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    return res.json({ order });
  } catch (error) {
    console.error('Error fetching order detail:', error);
    return res.status(500).json({ error: 'Failed to fetch order details.' });
  }
});
