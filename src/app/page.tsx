"use client";

import { mockProducts } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/products/ProductCard';
import { SortProducts } from '@/components/products/SortProducts';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('popularity');

  const filteredAndSortedProducts = useMemo(() => {
    let products = [...mockProducts];

    if (searchTerm) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortOption) {
      case 'popularity':
        products.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
    return products;
  }, [mockProducts, searchTerm, sortOption]);

  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-secondary/50 rounded-lg shadow">
        <h1 className="text-4xl font-bold font-headline mb-2 text-primary">Welcome to Shopify Mini</h1>
        <p className="text-lg text-foreground">Discover our curated collection of fine goods.</p>
      </section>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-b border-border">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-10 w-full bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <SortProducts onSortChange={setSortOption} currentSort={sortOption} />
      </div>

      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
