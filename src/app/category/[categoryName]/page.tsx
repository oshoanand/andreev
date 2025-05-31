
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import { mockProducts } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductCardSkeleton } from '@/components/products/ProductCardSkeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryTitle, setCategoryTitle] = useState<string>('');

  const categoryName = useMemo(() => {
    if (params.categoryName && typeof params.categoryName === 'string') {
      return decodeURIComponent(params.categoryName);
    }
    return null;
  }, [params.categoryName]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      if (!categoryName) {
        setIsLoading(false);
        // notFound(); // Or handle as "category not specified"
        return;
      }
      
      setCategoryTitle(categoryName);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const filtered = mockProducts.filter(
        (product) => product.category.toLowerCase() === categoryName.toLowerCase()
      );
      
      // Sort by popularity by default
      filtered.sort((a, b) => b.popularity - a.popularity);

      setProducts(filtered);
      setIsLoading(false);
    };

    fetchProducts();
  }, [categoryName]);

  if (!isLoading && !categoryName) {
     // This case implies a routing issue or bad param, redirect or show error
     // For now, redirecting to home for simplicity if categoryName is somehow null after loading
     // A more robust solution might involve a custom error page or server-side checks
    if (typeof window !== "undefined") {
        window.location.href = '/';
    }
    return (
      <div className="text-center py-20">
        <p className="text-xl text-muted-foreground">Category not found. Redirecting...</p>
      </div>
    );
  }
  
  if (!isLoading && products.length === 0 && categoryName) {
    // Category exists, but no products found for it
    return (
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="outline" className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Products
          </Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline mb-8 text-center">
          {categoryTitle}
        </h1>
        <p className="text-center text-xl text-muted-foreground py-12">
          No products found in this category.
        </p>
      </div>
    );
  }
  
  // This specific check for notFound() should ideally be after loading completes and categoryName is confirmed invalid.
  // If categoryName is derived and then found to be invalid from route, notFound() is appropriate.
  // But if categoryName is valid but leads to no products, that's different.
  // The existing logic above handles the "no products" case.
  // Let's assume if categoryName is valid, we always show the page, even if empty.
  // The `notFound()` call from Next.js should typically be used if the route itself is invalid.
  // Here, if categoryName is null after param processing, it's an issue.
   useEffect(() => {
    if (!isLoading && !categoryName && params.categoryName) {
      // This implies decodeURIComponent failed or param was not a string, truly a "not found" scenario for the category
      notFound();
    }
  }, [isLoading, categoryName, params.categoryName]);


  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="outline" className="mb-8 group">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          All Products
        </Link>
      </Button>

      <h1 className="text-4xl font-bold font-headline mb-2 text-center text-primary">
        {categoryTitle}
      </h1>
      <p className="text-center text-muted-foreground mb-10">
        Browse our curated selection in the {categoryTitle.toLowerCase()} category.
      </p>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
         <div className="text-center py-12"> {/* This case should be covered by the check above */}
            <p className="text-xl text-muted-foreground">No products found in the "{categoryTitle}" category.</p>
        </div>
      )}
    </div>
  );
}
