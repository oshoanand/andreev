
"use client";

import type { ProductCategory } from '@/lib/types';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface CategoryFilterProps {
  categories: ProductCategory[];
  isLoading?: boolean;
}

const CategorySkeleton = () => (
  <div className="h-24 w-24 p-2 flex flex-col items-center justify-center space-y-1">
    <Skeleton className="w-14 h-14 rounded-full" />
    <Skeleton className="h-4 w-16" />
  </div>
);

export function CategoryFilter({ categories, isLoading = false }: CategoryFilterProps) {
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
              <Link
                key={category.name}
                href={category.name === 'All' ? '/' : `/category/${encodeURIComponent(category.name)}`}
                passHref
                legacyBehavior // Recommended for custom component children like the div here
              >
                <a // Use an <a> tag for styling and semantics within Link
                  className={cn(
                    "h-24 w-24 p-2 flex flex-col items-center justify-center space-y-1 rounded-full shadow-sm hover:shadow-md transition-all duration-200",
                    "bg-card hover:bg-muted/80 dark:bg-card dark:hover:bg-muted/70",
                    // Basic focus styling, can be enhanced
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
                </a>
              </Link>
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </motion.div>
  );
}
