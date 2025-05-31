export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  popularity: number; // Higher is more popular
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
