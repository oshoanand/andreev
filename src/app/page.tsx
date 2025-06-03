
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
import { ShoppingCart, ListFilter, ChevronLeft, ChevronRight, PauseCircle, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence, wrap } from 'framer-motion';
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

const heroSlidesData = [
  {
    id: 1,
    imageUrl: "https://placehold.co/1200x500.png",
    imageAiHint: "modern electronics sale",
    title: "Discover Your Next Favorite",
    subtitle: "Explore our curated collection of high-quality products, designed to inspire and delight your everyday life.",
    buttonText: "Shop Collection",
    buttonLink: "#products-grid"
  },
  {
    id: 2,
    imageUrl: "https://placehold.co/1200x500.png",
    imageAiHint: "fashion apparel new arrivals",
    title: "New Season Styles Arrived",
    subtitle: "Check out the latest trends in fashion. Comfort and style, perfectly blended for you.",
    buttonText: "Explore Apparel",
    buttonLink: "/category/Apparel"
  },
  {
    id: 3,
    imageUrl: "https://placehold.co/1200x500.png",
    imageAiHint: "home decor essentials",
    title: "Elevate Your Home",
    subtitle: "Find unique home decor items that bring personality and warmth to your living space.",
    buttonText: "Discover Home Goods",
    buttonLink: "/category/Home%20Goods"
  }
];

const slideVariants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    };
  }
};

// Determines the swipe direction and velocity threshold for slide change.
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const HeroSection = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);

  const slideIndex = wrap(0, heroSlidesData.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 5000); // Auto-play interval: 5 seconds
    return () => clearInterval(interval);
  }, [page, isPaused]);


  return (
    <motion.section
      className="relative h-[500px] rounded-lg overflow-hidden bg-muted" // Fixed height for carousel
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      aria-roledescription="carousel"
      aria-label="Promotional content"
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0 w-full h-full"
          aria-roledescription="slide"
          aria-label={`${heroSlidesData[slideIndex].title} - Slide ${slideIndex + 1} of ${heroSlidesData.length}`}
        >
          <Image
            src={heroSlidesData[slideIndex].imageUrl}
            alt={heroSlidesData[slideIndex].title}
            fill
            objectFit="cover"
            className="opacity-50 dark:opacity-40"
            data-ai-hint={heroSlidesData[slideIndex].imageAiHint}
            priority={slideIndex === 0} // Prioritize loading the first image
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/30 to-transparent"></div>
          
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-4">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold font-headline text-foreground mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              {heroSlidesData[slideIndex].title}
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              {heroSlidesData[slideIndex].subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            >
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl px-8 py-3 text-lg transition-all duration-300 transform hover:scale-105">
                <Link href={heroSlidesData[slideIndex].buttonLink}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {heroSlidesData[slideIndex].buttonText}
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => paginate(-1)} 
        className="absolute z-20 left-4 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-background/50 hover:bg-background/80"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => paginate(1)} 
        className="absolute z-20 right-4 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-background/50 hover:bg-background/80"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Pagination Dots */}
      <div className="absolute z-20 bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {heroSlidesData.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage([i, i > slideIndex ? 1 : -1])}
            className={`w-3 h-3 rounded-full transition-colors ${i === slideIndex ? 'bg-primary' : 'bg-muted-foreground/50 hover:bg-muted-foreground/80'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
       {/* Pause/Play Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsPaused(!isPaused)}
        className="absolute z-20 top-4 right-4 rounded-full h-10 w-10 bg-background/50 hover:bg-background/80"
        aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
      >
        {isPaused ? <PlayCircle className="h-6 w-6" /> : <PauseCircle className="h-6 w-6" />}
      </Button>
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
      const lowerCaseSearchTerm = searchTermFromUrl.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.category.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    
    switch (sortOption) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - b.price);
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
