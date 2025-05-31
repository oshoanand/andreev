
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
    subCategory: 'Watches',
    sizes: ['One Size'],
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
    subCategory: 'Scarves & Wraps',
    sizes: ['One Size'],
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
    subCategory: 'Drinkware',
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
    subCategory: 'Bags',
    sizes: ['Large', 'Medium'],
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
    subCategory: 'Lighting',
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
    subCategory: 'Tops',
    sizes: ['S', 'M', 'L', 'XL'],
    popularity: 90,
    stock: 8,
  },
  {
    id: '7',
    name: 'Linen Trousers',
    description: 'Comfortable and breathable linen trousers, perfect for warm weather. Available in a natural beige color.',
    price: 65.00,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Apparel',
    subCategory: 'Bottoms',
    sizes: ['S', 'M', 'L'],
    popularity: 82,
    stock: 12,
  },
  {
    id: '8',
    name: 'Wooden Photo Frame',
    description: 'A rustic wooden photo frame, fits a 5x7 photo. Great for displaying memories.',
    price: 22.00,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Home Goods',
    subCategory: 'Decor',
    popularity: 75,
    stock: 20,
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
    ],
    totalAmount: (mockProducts.find(p => p.id === '1')?.price || 0), 
    orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), 
    status: 'Delivered',
  },
  {
    id: 'order_002',
    items: [
      { product: mockProducts.find(p => p.id === '2')!, quantity: 1 },
    ],
    totalAmount: (mockProducts.find(p => p.id === '2')?.price || 0),
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
    status: 'Shipped',
  },
];

