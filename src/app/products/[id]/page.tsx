"use client"; // This page uses client-side hooks for data fetching and cart interaction

import { mockProducts } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { ProductRecommendations } from '@/components/products/ProductRecommendations';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface ProductPageProps {
  params: {
    id: string;
  };
}

// This is a client component, so we can't use async/await directly in the component function signature for data fetching.
// Data fetching should happen in useEffect or a dedicated function.
// For this mock setup, we'll find the product directly.

export default function ProductPage({ params }: ProductPageProps) {
  const productId = params.id;
  const product: Product | undefined = mockProducts.find(p => p.id === productId);

  if (!product) {
    notFound(); // Triggers the not-found.tsx or default Next.js 404 page
  }
  
  const averageRating = (product.popularity / 20).toFixed(1); // Mock rating based on popularity

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">Home</Link> / <span className="text-foreground">{product.name}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg bg-card">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority // Prioritize loading of the main product image
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
            data-ai-hint={`${product.category} product detail`}
          />
        </div>

        <div className="space-y-6">
          <Badge variant="secondary" className="text-sm">{product.category}</Badge>
          <h1 className="text-3xl lg:text-4xl font-bold font-headline text-primary">{product.name}</h1>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {Array(Math.floor(parseFloat(averageRating))).fill(0).map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              ))}
              {parseFloat(averageRating) % 1 !== 0 && (
                 <Star key="half" className="h-5 w-5 text-yellow-400" style={{clipPath: 'inset(0 50% 0 0)'}} />
              )}
              {Array(5 - Math.ceil(parseFloat(averageRating))).fill(0).map((_, i) => (
                <Star key={`empty-${i}`} className="h-5 w-5 text-muted-foreground/50 fill-muted-foreground/20" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({averageRating} rating based on {product.popularity} reviews)</span>
          </div>

          <p className="text-2xl font-semibold text-foreground">${product.price.toFixed(2)}</p>
          
          <Separator />

          <div>
            <h2 className="text-xl font-semibold font-headline mb-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>
          
          <AddToCartButton product={product} size="lg" className="w-full md:w-auto" />
        </div>
      </div>
      <ProductRecommendations currentProductId={product.id} />
    </div>
  );
}
