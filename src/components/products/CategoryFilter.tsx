
"use client";

import type { ProductCategory } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';

interface CategoryFilterProps {
  categories: ProductCategory[];
  selectedCategory: string | null;
  onSelectCategory: (categoryName: string | null) => void;
  isLoading?: boolean; // Added isLoading prop
}

const CategorySkeleton = () => (
  <div className="h-24 w-24 p-2 flex flex-col items-center justify-center space-y-1">
    <Skeleton className="w-14 h-14 rounded-full" />
    <Skeleton className="h-4 w-16" />
  </div>
);


export function CategoryFilter({ categories, selectedCategory, onSelectCategory, isLoading = false }: CategoryFilterProps) {
  const allCategoriesOption: ProductCategory = {
    name: 'All',
    imageUrl: '', 
    dataAiHint: 'grid layout',
  };

  const displayCategories = [allCategoriesOption, ...categories];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8"
    >
      <h2 className="text-2xl font-headline font-semibold mb-4 text-center md:text-left">Browse by Category</h2>
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex space-x-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => <CategorySkeleton key={index} />)
          ) : (
            displayCategories.map((category) => (
              <Button
                key={category.name}
                variant="ghost"
                onClick={() => onSelectCategory(category.name === 'All' ? null : category.name)}
                className={cn(
                  "h-24 w-24 p-2 flex flex-col items-center justify-center space-y-1 rounded-full shadow-sm hover:shadow-md transition-all duration-200",
                  "bg-card hover:bg-muted/80", 
                  (selectedCategory === category.name || (selectedCategory === null && category.name === 'All')) && "ring-2 ring-primary bg-primary/10 hover:bg-primary/20"
                )}
              >
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                  {category.name === 'All' ? (
                    <LayoutGrid className="w-8 h-8 text-muted-foreground" />
                  ) : (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      sizes="56px" 
                      className="object-cover"
                      data-ai-hint={category.dataAiHint}
                    />
                  )}
                </div>
                <span className="text-xs font-medium text-foreground truncate w-full text-center">{category.name}</span>
              </Button>
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </motion.div>
  );
}
