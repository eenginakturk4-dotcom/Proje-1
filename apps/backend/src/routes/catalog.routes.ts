import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const catalogRouter = Router();

// Get all categories
catalogRouter.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

// Get featured products
catalogRouter.get('/products/featured', async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { featured: true },
      include: { category: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ products });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return res.status(500).json({ error: 'Failed to fetch featured products.' });
  }
});

// Get paginated, filtered, searched products
catalogRouter.get('/products', async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt((req.query.limit as string) || '12', 10)));
    const search = ((req.query.search as string) || '').trim();
    const category = ((req.query.category as string) || '').trim();
    const sort = (req.query.sort as string) || 'newest';

    const where: any = {};

    // Category filter by slug or ID
    if (category && category !== 'all') {
      where.OR = [
        { category: { slug: category } },
        { categoryId: category },
      ];
    }

    // Search query filter
    if (search) {
      where.AND = [
        {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
          ],
        },
      ];
    }

    // Sorting
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'title_asc') {
      orderBy = { title: 'asc' };
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return res.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ error: 'Failed to fetch catalog products.' });
  }
});

// Get single product details
catalogRouter.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    return res.json({ product });
  } catch (error) {
    console.error('Error fetching product detail:', error);
    return res.status(500).json({ error: 'Failed to fetch product details.' });
  }
});
