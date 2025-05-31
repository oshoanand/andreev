"use client";

import { useEffect, useState } from 'react';
import { getProductRecommendations } from '@/ai/flows/product-recommendation';
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { mockProducts } from '@/lib/mock-data'; // Using mockProducts to find recommended items by ID
import { Loader2 } from 'lucide-react';

interface ProductRecommendationsProps {
  currentProductId: string;
  viewHistorySeed?: string; // Comma-separated string of product IDs
}

export function ProductRecommendations({ currentProductId, viewHistorySeed }: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // For demo, use current product ID as part of view history.
        // A real app would accumulate true view history.
        const history = viewHistorySeed ? `${viewHistorySeed},${currentProductId}` : currentProductId;
        
        const result = await getProductRecommendations({ viewHistory: history });
        
        // The AI returns a comma-separated string of product IDs.
        // We need to find these products in our mock data.
        // In a real app, you'd fetch these product details from your DB.
        const recommendedIds = result.recommendations.split(',').map(id => id.trim());
        
        const foundProducts = mockProducts.filter(p => recommendedIds.includes(p.id) && p.id !== currentProductId);
        
        // If AI gives less than 3, supplement with some random other products (excluding current)
        if (foundProducts.length < 3) {
            const additionalNeeded = 3 - foundProducts.length;
            const otherProducts = mockProducts.filter(p => p.id !== currentProductId && !recommendedIds.includes(p.id));
            const shuffled = otherProducts.sort(() => 0.5 - Math.random());
            foundProducts.push(...shuffled.slice(0, additionalNeeded));
        }

        setRecommendations(foundProducts.slice(0,3)); // Show up to 3 recommendations

      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
        setError("Could not load recommendations at this time.");
        // Fallback: show some random products if AI fails
        const fallbackProducts = mockProducts
            .filter(p => p.id !== currentProductId)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        setRecommendations(fallbackProducts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentProductId, viewHistorySeed]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading recommendations...</p>
      </div>
    );
  }

  if (error && recommendations.length === 0) { // Only show error if no fallback either
    return <p className="text-center text-destructive">{error}</p>;
  }
  
  if (recommendations.length === 0) {
    return null; // Don't show section if no recommendations or error with no fallback
  }


  return (
    <section className="mt-12">
      <h2 className="text-2xl font-headline font-semibold mb-6 text-center">You Might Also Like</h2>
      {error && <p className="text-center text-sm text-muted-foreground mb-4">Showing general suggestions as personalized recommendations failed.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
