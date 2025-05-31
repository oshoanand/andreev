
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import { mockProducts } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductCardSkeleton } from '@/components/products/ProductCardSkeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, FilterX } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type SortOption = 'popularity' | 'price-asc' | 'price-desc' | 'name-asc';

const MIN_PRICE_DEFAULT = 0;
const MAX_PRICE_DEFAULT = 1000; // A high enough default if no products

export default function CategoryPage() {
  const params = useParams();
  const [initialProducts, setInitialProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryTitle, setCategoryTitle] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('popularity');

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([MIN_PRICE_DEFAULT, MAX_PRICE_DEFAULT]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);

  const categoryName = useMemo(() => {
    if (params.categoryName && typeof params.categoryName === 'string') {
      return decodeURIComponent(params.categoryName);
    }
    return null;
  }, [params.categoryName]);

  // Derived filter options
  const { availableSizes, availableSubCategories, minPrice, maxPrice } = useMemo(() => {
    if (isLoading || initialProducts.length === 0) {
      return { availableSizes: [], availableSubCategories: [], minPrice: MIN_PRICE_DEFAULT, maxPrice: MAX_PRICE_DEFAULT };
    }
    const sizes = new Set<string>();
    const subCategories = new Set<string>();
    let currentMinPrice = Infinity;
    let currentMaxPrice = 0;

    initialProducts.forEach(product => {
      product.sizes?.forEach(size => sizes.add(size));
      if (product.subCategory) {
        subCategories.add(product.subCategory);
      }
      if (product.price < currentMinPrice) currentMinPrice = product.price;
      if (product.price > currentMaxPrice) currentMaxPrice = product.price;
    });
    
    return {
      availableSizes: Array.from(sizes).sort(),
      availableSubCategories: Array.from(subCategories).sort(),
      minPrice: Math.floor(currentMinPrice),
      maxPrice: Math.ceil(currentMaxPrice),
    };
  }, [initialProducts, isLoading]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      if (!categoryName) {
        setIsLoading(false);
        return;
      }
      
      setCategoryTitle(categoryName);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      const filtered = mockProducts.filter(
        (product) => product.category.toLowerCase() === categoryName.toLowerCase()
      );
      setInitialProducts(filtered);
      setIsLoading(false);
    };

    fetchProducts();
  }, [categoryName]);

  useEffect(() => {
    // Set initial price range once products and their prices are loaded
    if (!isLoading && initialProducts.length > 0) {
        // Ensure minPrice and maxPrice are valid before setting
      const validMinPrice = isFinite(minPrice) ? minPrice : MIN_PRICE_DEFAULT;
      const validMaxPrice = isFinite(maxPrice) && maxPrice > validMinPrice ? maxPrice : MAX_PRICE_DEFAULT;
      setPriceRange([validMinPrice, validMaxPrice]);
    }
  }, [isLoading, initialProducts, minPrice, maxPrice]);


   useEffect(() => {
    if (!isLoading && !categoryName && params.categoryName) {
      notFound();
    }
  }, [isLoading, categoryName, params.categoryName]);

  const handleSizeChange = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleSubCategoryChange = (subCategory: string) => {
    setSelectedSubCategories(prev =>
      prev.includes(subCategory) ? prev.filter(sc => sc !== subCategory) : [...prev, subCategory]
    );
  };
  
  const clearFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedSizes([]);
    setSelectedSubCategories([]);
  };

  const sortedAndFilteredProducts = useMemo(() => {
    if (isLoading) return [];
    
    let processedProducts = [...initialProducts];

    // Apply filters
    processedProducts = processedProducts.filter(product => {
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
      const sizeMatch = selectedSizes.length === 0 || product.sizes?.some(s => selectedSizes.includes(s));
      const subCategoryMatch = selectedSubCategories.length === 0 || (product.subCategory && selectedSubCategories.includes(product.subCategory));
      return priceMatch && sizeMatch && subCategoryMatch;
    });
    
    // Apply sorting
    switch (sortOption) {
      case 'price-asc':
        processedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        processedProducts.sort((a, b) => b.price - b.price);
        break;
      case 'name-asc':
        processedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popularity':
      default:
        // Popularity sort might already be the default for initialProducts or needs explicit sort
        processedProducts.sort((a, b) => b.popularity - a.popularity); 
        break;
    }
    
    return processedProducts;
  }, [initialProducts, isLoading, sortOption, priceRange, selectedSizes, selectedSubCategories]);


  if (!isLoading && !categoryName) {
    // This case should ideally trigger notFound() or redirect earlier
    if (typeof window !== "undefined") { // Ensure this runs client-side
        router.push('/'); // Use Next.js router for navigation
    }
    return (
      <div className="text-center py-20">
        <p className="text-xl text-muted-foreground">Category not found. Redirecting...</p>
      </div>
    );
  }
  
  const hasActiveFilters = selectedSizes.length > 0 || selectedSubCategories.length > 0 || priceRange[0] !== minPrice || priceRange[1] !== maxPrice;

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

      <div className="grid lg:grid-cols-4 gap-8 items-start">
        {/* Filters Section */}
        <div className="lg:col-span-1 space-y-6 sticky top-24">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-headline flex justify-between items-center">
                Filters
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                    <FilterX className="mr-1 h-3 w-3" /> Clear
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" defaultValue={['price', 'subCategory', 'size']} className="w-full">
                <AccordionItem value="price">
                  <AccordionTrigger className="text-md font-semibold">Price Range</AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-3">
                    {initialProducts.length > 0 && !isLoading && (
                      <>
                        <Slider
                          min={minPrice}
                          max={maxPrice}
                          step={1}
                          value={priceRange}
                          onValueChange={(value) => setPriceRange(value as [number, number])}
                          className="w-full"
                          disabled={isLoading || initialProducts.length === 0 || minPrice === maxPrice}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>${priceRange[0]}</span>
                          <span>${priceRange[1]}</span>
                        </div>
                      </>
                    )}
                    {(isLoading || initialProducts.length === 0 || minPrice === maxPrice) && (
                        <p className="text-xs text-muted-foreground">Price filter unavailable.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {availableSubCategories.length > 0 && (
                  <AccordionItem value="subCategory">
                    <AccordionTrigger className="text-md font-semibold">Sub-Categories</AccordionTrigger>
                    <AccordionContent className="pt-2 space-y-2">
                      {availableSubCategories.map(subCat => (
                        <div key={subCat} className="flex items-center space-x-2">
                          <Checkbox
                            id={`subcat-${subCat}`}
                            checked={selectedSubCategories.includes(subCat)}
                            onCheckedChange={() => handleSubCategoryChange(subCat)}
                          />
                          <Label htmlFor={`subcat-${subCat}`} className="text-sm font-normal cursor-pointer">{subCat}</Label>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                )}

                {availableSizes.length > 0 && (
                  <AccordionItem value="size">
                    <AccordionTrigger className="text-md font-semibold">Sizes</AccordionTrigger>
                    <AccordionContent className="pt-2 space-y-2">
                      {availableSizes.map(size => (
                        <div key={size} className="flex items-center space-x-2">
                          <Checkbox
                            id={`size-${size}`}
                            checked={selectedSizes.includes(size)}
                            onCheckedChange={() => handleSizeChange(size)}
                          />
                          <Label htmlFor={`size-${size}`} className="text-sm font-normal cursor-pointer">{size}</Label>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid and Sorting */}
        <div className="lg:col-span-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-y border-border mb-8">
            <h2 className="text-xl font-headline font-semibold text-foreground">
              {isLoading ? 'Loading products...' : `${sortedAndFilteredProducts.length} Product${sortedAndFilteredProducts.length === 1 ? '' : 's'} Found`}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: initialProducts.length > 0 ? initialProducts.length : 3 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : sortedAndFilteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedAndFilteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
             <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">No products found matching your criteria.</p>
                {hasActiveFilters && (
                     <Button variant="link" onClick={clearFilters} className="mt-2">Clear all filters</Button>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
