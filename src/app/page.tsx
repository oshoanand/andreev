
"use client";

import { mockProducts } from '@/lib/mock-data';
import type { Product, ProductCategory } from '@/lib/types';
import { ProductCard } from '@/components/products/ProductCard';
import { SortProducts } from '@/components/products/SortProducts';
import { CategoryFilter } from '@/components/products/CategoryFilter';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <motion.section
      className="relative rounded-lg shadow-xl overflow-hidden bg-gradient-to-br from-primary/20 via-background to-accent/20 dark:from-primary/30 dark:via-background dark:to-accent/30"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="https://placehold.co/1200x500.png"
          alt="Abstract background representing modern e-commerce products"
          layout="fill"
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

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const searchTermFromUrl = searchParams.get('q') || '';
  const categoryFromUrl = searchParams.get('category') || null;
  
  const [sortOption, setSortOption] = useState('popularity');

  const uniqueCategories = useMemo(() => {
    const categoriesMap = new Map<string, ProductCategory>();
    mockProducts.forEach(product => {
      if (!categoriesMap.has(product.category)) {
        categoriesMap.set(product.category, {
          name: product.category,
          // Placeholder - in a real app, these would come from a CMS or be predefined
          imageUrl: `https://placehold.co/100x100.png?text=${encodeURIComponent(product.category)}`,
          dataAiHint: `${product.category.toLowerCase()}`,
        });
      }
    });
    return Array.from(categoriesMap.values());
  }, [mockProducts]);

  const handleSelectCategory = (categoryName: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryName) {
      params.set('category', categoryName);
    } else {
      params.delete('category');
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  
  const filteredAndSortedProducts = useMemo(() => {
    let products = [...mockProducts];

    if (searchTermFromUrl) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchTermFromUrl.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTermFromUrl.toLowerCase())
      );
    }

    if (categoryFromUrl) {
      products = products.filter(product => product.category === categoryFromUrl);
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
  }, [mockProducts, searchTermFromUrl, categoryFromUrl, sortOption]);

  return (
    <div className="space-y-12">
      <HeroSection />

      <CategoryFilter 
        categories={uniqueCategories}
        selectedCategory={categoryFromUrl}
        onSelectCategory={handleSelectCategory}
      />

      <div id="products-grid" className="space-y-8">
        <div className="flex flex-col md:flex-row justify-end items-center gap-4 p-4 border-b border-border">
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
    </div>
  );
}
