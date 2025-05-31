
"use client";

import { mockProducts } from '@/lib/mock-data';
import type { Product, ProductCategory } from '@/lib/types';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductCardSkeleton } from '@/components/products/ProductCardSkeleton';
import { CategoryFilter } from '@/components/products/CategoryFilter';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ListFilter } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

const HeroSection = () => {
  return (
    <motion.section
      className="relative rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 via-background to-accent/20 dark:from-primary/30 dark:via-background dark:to-accent/30"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="https://placehold.co/1200x500.png"
          alt="Abstract background representing modern e-commerce products"
          fill
          objectFit="cover"
          className="opacity-10 dark:opacity-5"
          data-ai-hint="abstract modern pattern"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
      </div>
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-24 md:py-36 text-center">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold font-headline text-foreground mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          Discover Your Next Favorite
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          Explore our curated collection of high-quality products, designed to inspire and delight your everyday life.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        >
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl px-8 py-3 text-lg transition-all duration-300 transform hover:scale-105">
            <Link href="#products-grid">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Shop Collection
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
};

type SortOption = 'popularity' | 'price-asc' | 'price-desc' | 'name-asc';

export default function HomePage() {
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>('popularity');

  const searchTermFromUrl = searchParams.get('q') || '';
  
  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      setIsLoading(true);
      setIsLoadingCategories(true);
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      setProducts(mockProducts); 
      setIsLoading(false);
      setIsLoadingCategories(false);
    };
    fetchProductsAndCategories();
  }, []);

  const uniqueCategories = useMemo(() => {
    if (isLoadingCategories) return [];
    const categoriesMap = new Map<string, ProductCategory>();
    products.forEach(product => {
      if (!categoriesMap.has(product.category)) {
        categoriesMap.set(product.category, {
          name: product.category,
          imageUrl: `https://placehold.co/100x100.png?text=${encodeURIComponent(product.category)}`,
          dataAiHint: `${product.category.toLowerCase()}`,
        });
      }
    });
    return Array.from(categoriesMap.values());
  }, [products, isLoadingCategories]);
  
  const filteredAndSortedProducts = useMemo(() => {
    if (isLoading) return [];
    let filtered = [...products];

    if (searchTermFromUrl) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTermFromUrl.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTermFromUrl.toLowerCase())
      );
    }
    
    switch (sortOption) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popularity':
      default:
        filtered.sort((a, b) => b.popularity - a.popularity);
        break;
    }
    
    return filtered;
  }, [products, searchTermFromUrl, isLoading, sortOption]);

  return (
    <div className="space-y-16">
      <HeroSection />

      <CategoryFilter 
        categories={uniqueCategories}
        isLoading={isLoadingCategories} 
      />

      <FeaturesSection />

      <div id="products-grid" className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-b border-border">
          <h2 className="text-2xl font-headline font-semibold text-foreground">Our Products</h2>
          <div className="flex items-center gap-2">
            <Label htmlFor="sort-products" className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</Label>
            <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)} name="sort-products">
              <SelectTrigger className="w-[180px] sm:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => ( 
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredAndSortedProducts.length > 0 ? (
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
    </div>
  );
}
