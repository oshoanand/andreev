
import type { Product, Order, Customer } from './types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Elegant Rose Gold Watch',
    description: 'A stunning timepiece with a minimalist design, featuring a rose gold plated case and a soft leather strap. Perfect for everyday elegance.',
    price: 159.99,
    originalPrice: 199.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Accessories',
    popularity: 95,
    stock: 10,
  },
  {
    id: '2',
    name: 'Organic Cotton Scarf',
    description: 'Handwoven from 100% organic cotton, this scarf offers both warmth and style. Its muted olive color complements any outfit.',
    price: 49.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Apparel',
    popularity: 88,
    stock: 5,
  },
  {
    id: '3',
    name: 'Artisan Ceramic Mug Set',
    description: 'Set of two handcrafted ceramic mugs, finished with a dusty rose glaze. Ideal for your morning coffee or tea.',
    price: 35.00,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Home Goods',
    popularity: 92,
    stock: 0, // Out of stock
  },
  {
    id: '4',
    name: 'Leather Tote Bag',
    description: 'A spacious and durable tote bag made from ethically sourced leather. Features an internal pocket and a secure magnetic clasp.',
    price: 90.00,
    originalPrice: 120.00,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Accessories',
    popularity: 70,
    stock: 15,
  },
  {
    id: '5',
    name: 'Minimalist Desk Lamp',
    description: 'Sleek and modern LED desk lamp with adjustable brightness. Its off-white finish adds a touch of sophistication to your workspace.',
    price: 75.50,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Home Goods',
    popularity: 85,
    stock: 0, // Out of stock
  },
  {
    id: '6',
    name: 'Silk Blend Blouse',
    description: 'A luxurious silk blend blouse in a flattering dusty rose shade. Features delicate button detailing and a relaxed fit.',
    price: 89.00,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Apparel',
    popularity: 90,
    stock: 8,
  },
];

export const mockCustomer: Customer = {
  id: 'cust_123',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  address: '123 Blossom Lane, Rose City, RC 12345',
};

export const mockOrders: Order[] = [
  {
    id: 'order_001',
    items: [
      { product: mockProducts.find(p => p.id === '1')!, quantity: 1 },
      // Note: If product '3' was in an order, it implies it was in stock when ordered.
      // For simplicity, current mock orders don't include currently out-of-stock items.
      // Consider how to handle historical orders with items now out of stock.
    ],
    totalAmount: (mockProducts.find(p => p.id === '1')?.price || 0), // Simplified, adjust if more items
    orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    status: 'Delivered',
  },
  {
    id: 'order_002',
    items: [
      { product: mockProducts.find(p => p.id === '2')!, quantity: 1 },
    ],
    totalAmount: (mockProducts.find(p => p.id === '2')?.price || 0),
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    status: 'Shipped',
  },
];
