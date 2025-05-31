
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // Added for discount display
  imageUrl: string;
  category: string;
  subCategory?: string; // For filtering
  sizes?: string[]; // For filtering e.g. ['S', 'M', 'L', 'One Size']
  popularity: number; // Higher is more popular
  stock: number; // Number of items in stock, 0 means out of stock
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  orderDate: string; // ISO date string
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
}

export interface Customer {
  id:string;
  name: string;
  email: string;
  address: string;
  // Orders might be fetched separately or embedded depending on API design
}

export interface ProductCategory {
  name: string;
  imageUrl: string;
  dataAiHint: string;
}

