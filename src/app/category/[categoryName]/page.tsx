
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

type SortOption = 'popularity' | 'price-asc' | 'price-desc' | 'name-asc';

export default function CategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryTitle, setCategoryTitle] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('popularity');

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
      
      // Initial sort by popularity can be done here or rely on sortedAndFilteredProducts
      // filtered.sort((a, b) => b.popularity - a.popularity);

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

  const sortedAndFilteredProducts = useMemo(() => {
    if (isLoading) return [];
    let processedProducts = [...products];
    
    switch (sortOption) {
      case 'price-asc':
        processedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        processedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        processedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popularity':
      default:
        processedProducts.sort((a, b) => b.popularity - a.popularity);
        break;
    }
    
    return processedProducts;
  }, [products, isLoading, sortOption]);


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
  
  if (!isLoading && sortedAndFilteredProducts.length === 0 && categoryName) {
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

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-y border-border mb-8">
        <h2 className="text-xl font-headline font-semibold text-foreground">
          {isLoading ? 'Loading products...' : `${sortedAndFilteredProducts.length} Products Found`}
        </h2>
        <div className="flex items-center gap-2">
          <Label htmlFor="sort-products-category" className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</Label>
          <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)} name="sort-products-category">
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
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : sortedAndFilteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedAndFilteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
         <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No products found in the "{categoryTitle}" category with the current filters.</p>
        </div>
      )}
    </div>
  );
}
