
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import { mockProducts } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductCardSkeleton } from '@/components/products/ProductCardSkeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';

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
        return;
      }
      
      setCategoryTitle(categoryName);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const filtered = mockProducts.filter(
        (product) => product.category.toLowerCase() === categoryName.toLowerCase()
      );
      
      filtered.sort((a, b) => b.popularity - a.popularity);

      setProducts(filtered);
      setIsLoading(false);
    };

    fetchProducts();
  }, [categoryName]);

   useEffect(() => {
    if (!isLoading && !categoryName && params.categoryName) {
      notFound();
    }
  }, [isLoading, categoryName, params.categoryName]);


  if (!isLoading && !categoryName) {
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
    return (
      <div className="container mx-auto px-4 py-8">
         <div className="mb-6 text-sm text-muted-foreground flex items-center">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-foreground">{categoryTitle}</span>
        </div>
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 text-sm text-muted-foreground flex items-center">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-foreground">{categoryTitle}</span>
      </div>

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
         <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No products found in the "{categoryTitle}" category.</p>
        </div>
      )}
    </div>
  );
}
