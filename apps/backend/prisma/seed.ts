import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing records (in reverse order of dependencies)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing database records.');

  // 2. Seed Users
  const passwordHash = await bcrypt.hash('admin123', 10);
  const userPasswordHash = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Shoppy Admin',
      email: 'admin@shoppy.local',
      passwordHash,
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Demo Customer',
      email: 'user@shoppy.local',
      passwordHash: userPasswordHash,
      role: 'USER',
    },
  });

  console.log(`👤 Created users: Admin (${admin.email}), Customer (${customer.email})`);

  // 3. Seed Categories
  const categoriesData = [
    {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Cutting-edge gadgets, audio devices, and computer accessories.',
    },
    {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Comfortable, durable, and stylish modern everyday wear.',
    },
    {
      name: 'Home & Kitchen',
      slug: 'home-kitchen',
      description: 'Elevate your daily living space with thoughtful essentials.',
    },
    {
      name: 'Books & Stationery',
      slug: 'books-stationery',
      description: 'Curated books and premium stationery for curious minds.',
    },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories[cat.slug] = created.id;
  }
  console.log(`📂 Created ${Object.keys(categories).length} categories.`);

  // 4. Seed Products
  const products = [
    {
      title: 'Studio Pro Wireless Headphones',
      description: 'Active noise-canceling over-ear wireless headphones with 40-hour battery life and spatial audio support.',
      price: 199.99,
      stock: 25,
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      categoryId: categories['electronics'],
    },
    {
      title: 'Mechanical Tenkeyless Keyboard',
      description: 'Custom hot-swappable mechanical keyboard with RGB backlighting, tactile switches, and braided USB-C cable.',
      price: 129.50,
      stock: 18,
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      categoryId: categories['electronics'],
    },
    {
      title: 'Ergonomic Precision Wireless Mouse',
      description: 'High-precision wireless mouse with thumb scroll wheel, ergonomic contouring, and multi-device pairing.',
      price: 79.99,
      stock: 40,
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
      categoryId: categories['electronics'],
    },
    {
      title: 'Ultra HD 4K Streaming Webcam',
      description: 'Crystal-clear 4K streaming webcam with autofocus, dual stereo microphones, and privacy shutter.',
      price: 109.00,
      stock: 15,
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&auto=format&fit=crop&q=80',
      categoryId: categories['electronics'],
    },
    {
      title: 'Minimalist Heavyweight Cotton Hoodie',
      description: '450 GSM French terry hoodie crafted from organic combed cotton. Pre-shrunk relaxed fit.',
      price: 89.00,
      stock: 35,
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      categoryId: categories['clothing'],
    },
    {
      title: 'Classic All-Weather Canvas Jacket',
      description: 'Water-resistant waxed canvas utility jacket with reinforced elbow patches and warm flannel lining.',
      price: 149.00,
      stock: 20,
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80',
      categoryId: categories['clothing'],
    },
    {
      title: 'Everyday Retro Low-Top Sneakers',
      description: 'Timeless low-top vulcanized sneakers featuring cushioned insoles and durable canvas uppers.',
      price: 69.95,
      stock: 28,
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80',
      categoryId: categories['clothing'],
    },
    {
      title: 'Pour-Over Precision Gooseneck Kettle',
      description: 'Matte black temperature-controlled electric gooseneck kettle with built-in brew stopwatch.',
      price: 119.00,
      stock: 12,
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
      categoryId: categories['home-kitchen'],
    },
    {
      title: 'Minimalist Dimmable LED Desk Lamp',
      description: 'Architectural aluminum desk lamp with touch brightness dimmer, warm-to-cool Kelvin tuning, and USB charging.',
      price: 64.50,
      stock: 30,
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
      categoryId: categories['home-kitchen'],
    },
    {
      title: 'Handcrafted Ceramic Coffee Mug Set',
      description: 'Set of two artisanal stoneware mugs with reactive speckle glaze and comfortable wide handles.',
      price: 34.00,
      stock: 50,
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      categoryId: categories['home-kitchen'],
    },
    {
      title: 'Hardcover Dot-Grid Bullet Journal',
      description: '160 GSM bleed-proof bamboo paper notebook with numbered pages, dual ribbon bookmarks, and inner pocket.',
      price: 24.99,
      stock: 45,
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      categoryId: categories['books-stationery'],
    },
    {
      title: 'Solid Brass Refillable Fountain Pen',
      description: 'Precision-machined raw brass fountain pen with fine stainless steel nib. Ages with a distinct natural patina.',
      price: 49.00,
      stock: 22,
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80',
      categoryId: categories['books-stationery'],
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log(`🛍️ Created ${products.length} catalog products.`);

  // 5. Seed a demo order for the customer
  const firstProduct = await prisma.product.findFirst({ where: { featured: true } });
  if (firstProduct) {
    await prisma.order.create({
      data: {
        orderNumber: 'ORD-2026-0001',
        userId: customer.id,
        status: 'DELIVERED',
        totalAmount: firstProduct.price,
        shippingName: 'Demo Customer',
        shippingAddress: 'Atatürk Bulvarı No: 42 Daire: 7',
        shippingCity: 'Istanbul',
        shippingPostal: '34380',
        shippingCountry: 'Turkey',
        paymentMethod: 'mock',
        paymentId: 'mock_pay_initial_seed',
        items: {
          create: [
            {
              productId: firstProduct.id,
              title: firstProduct.title,
              price: firstProduct.price,
              quantity: 1,
            },
          ],
        },
      },
    });
    console.log('📦 Created initial sample order for Demo Customer.');
  }

  console.log('✅ Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
