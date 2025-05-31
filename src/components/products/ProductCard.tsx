
import type { Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Check, XCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cartItems } = useCart();

  const isInCart = cartItems.some(item => item.product.id === product.id);
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    if (!isInCart && !isOutOfStock) {
      addToCart(product);
    }
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  let discountPercent = 0;
  if (hasDiscount && product.originalPrice) {
    discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  }

  return (
    <Card className="overflow-hidden transition-shadow duration-300 flex flex-col h-full border">
      <Link href={`/products/${product.id}`} className="block group">
        <CardHeader className="p-0 relative">
          <div className="aspect-[4/3] relative w-full">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover group-hover:scale-105 transition-transform duration-300 ${isOutOfStock ? 'opacity-60 grayscale' : ''}`}
              data-ai-hint={`${product.category} product`}
            />
          </div>
          {hasDiscount && !isOutOfStock && product.originalPrice && (
            <Badge
              variant="default"
              className="absolute top-2 right-2 bg-primary text-primary-foreground"
            >
              {discountPercent}% OFF
            </Badge>
          )}
          {isOutOfStock && (
            <Badge
              variant="destructive"
              className="absolute top-2 left-2"
            >
              Out of Stock
            </Badge>
          )}
        </CardHeader>
      </Link>
      <CardContent className="p-4 flex-grow">
        <Link href={`/products/${product.id}`} className="block">
          <CardTitle className="text-lg font-headline mb-1 hover:text-primary transition-colors">{product.name}</CardTitle>
        </Link>
        <CardDescription className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</CardDescription>
        <div className="flex items-baseline gap-2">
          <p className="text-lg font-semibold text-foreground">${product.price.toFixed(2)}</p>
          {hasDiscount && product.originalPrice && (
            <p className="text-sm text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t border-border bg-muted/30">
        {isOutOfStock ? (
          <Button className="w-full" variant="secondary" disabled>
            <XCircle className="mr-2 h-4 w-4" /> Out of Stock
          </Button>
        ) : isInCart ? (
          <Button className="w-full" variant="secondary" disabled>
            <Check className="mr-2 h-4 w-4" /> In Cart
          </Button>
        ) : (
          <Button onClick={handleAddToCart} className="w-full" variant="outline">
            <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
