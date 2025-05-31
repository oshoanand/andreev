
"use client"; 

import type { Product } from '@/lib/types';
import Image from 'next/image';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { ProductRecommendations } from '@/components/products/ProductRecommendations';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext'; 

interface ProductDetailsClientProps {
  product: Product;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const { cartItems } = useCart(); 

  const averageRating = (product.popularity / 20).toFixed(1);
  const isOutOfStock = product.stock === 0;
  const isInCart = cartItems.some(item => item.product.id === product.id && !isOutOfStock);
  const isFoodItem = product.category === 'Groceries' || !!product.ingredients || !!product.netWeight;


  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">Home</Link> / <Link href={`/category/${encodeURIComponent(product.category)}`} className="hover:text-primary">{product.category}</Link> / <span className="text-foreground">{product.name}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className={`aspect-square relative rounded-lg overflow-hidden shadow-lg bg-card ${isOutOfStock ? 'opacity-70' : ''}`}>
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`object-cover transition-transform duration-300 hover:scale-105 ${isOutOfStock ? 'grayscale' : ''}`}
            data-ai-hint={`${product.category} product detail`}
          />
           {isOutOfStock && (
            <Badge variant="destructive" className="absolute top-4 left-4 text-base px-3 py-1">
              Out of Stock
            </Badge>
          )}
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
          
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-lg text-muted-foreground line-through">
              Was ${product.originalPrice.toFixed(2)}
            </p>
          )}

          <Separator />

          <div>
            <h2 className="text-xl font-semibold font-headline mb-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {isFoodItem && (
            <>
              <Separator className="my-4" />
              <div className="space-y-3">
                <h3 className="text-xl font-semibold font-headline">Product Details</h3>
                {product.netWeight && (
                  <div>
                    <span className="font-semibold text-foreground">Net Weight: </span>
                    <span className="text-sm text-muted-foreground">{product.netWeight}</span>
                  </div>
                )}
                {product.volume && (
                  <div>
                    <span className="font-semibold text-foreground">Volume: </span>
                    <span className="text-sm text-muted-foreground">{product.volume}</span>
                  </div>
                )}
                {product.ingredients && product.ingredients.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Ingredients:</h4>
                    <p className="text-sm text-muted-foreground">{product.ingredients.join(', ')}</p>
                  </div>
                )}
                {product.allergens && product.allergens.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Allergens:</h4>
                    <p className="text-sm text-muted-foreground">{product.allergens.join(', ')}</p>
                  </div>
                )}
                {product.bestBefore && (
                  <div>
                    <span className="font-semibold text-foreground">Best Before: </span>
                    <span className="text-sm text-muted-foreground">{product.bestBefore}</span>
                  </div>
                )}
                {product.nutritionalInfo && Object.keys(product.nutritionalInfo).length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Nutritional Information:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5">
                      {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                        <li key={key}>
                          <span className="font-medium text-foreground/90">{key}:</span> {value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {product.storageInstructions && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Storage Instructions:</h4>
                    <p className="text-sm text-muted-foreground">{product.storageInstructions}</p>
                  </div>
                )}
              </div>
            </>
          )}
          
          <Separator className="my-4" />

          {isOutOfStock ? (
             <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-md text-center text-destructive">
                <XCircle className="inline-block mr-2 h-5 w-5" />
                Currently unavailable
            </div>
          ) : isInCart ? (
             <Button size="lg" className="w-full md:w-auto" variant="secondary" disabled>
                In Cart
            </Button>
          ) : (
            <AddToCartButton product={product} size="lg" className="w-full md:w-auto" />
          )}
        </div>
      </div>
      <ProductRecommendations currentProductId={product.id} />
    </div>
  );
}
