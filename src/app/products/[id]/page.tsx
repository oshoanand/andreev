
import type { Metadata, ResolvingMetadata } from 'next';
import { mockProducts } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import { notFound } from 'next/navigation';
import { ProductDetailsClient } from '@/components/products/ProductDetailsClient';

interface ProductPageProps {
  params: {
    id: string;
  };
}

// Placeholder for your site's base URL. Replace with your actual domain.
const SITE_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.your-ecommerce-site.com';

export async function generateMetadata(
  { params }: ProductPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const productId = params.id;
  // In a real app, you would fetch product data from a database here
  // For this example, we'll use mockProducts
  const product: Product | undefined = mockProducts.find(p => p.id === productId);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for does not exist.",
    };
  }

  const siteName = "Shopify Mini"; 
  const productUrl = `${SITE_BASE_URL}/products/${product.id}`;
  
  const metaDescription = product.description.length > 155 
    ? product.description.substring(0, 152) + "..." 
    : product.description;

  const keywords = [product.name, product.category, product.subCategory, siteName].filter(Boolean).join(', ');

  const averageRatingValue = Math.max(0, Math.min(5, parseFloat((product.popularity / 20).toFixed(1))));

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.imageUrl, 
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD", 
      "price": product.price.toFixed(2),
      "url": productUrl,
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(product.popularity > 0 && averageRatingValue > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": averageRatingValue.toString(),
        "reviewCount": product.popularity.toString() 
      }
    })
  };

  return {
    title: `${product.name} | ${product.category} - ${siteName}`,
    description: metaDescription,
    keywords: keywords,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.name} - ${siteName}`,
      description: metaDescription,
      url: productUrl,
      siteName: siteName,
      images: [
        {
          url: product.imageUrl, 
          width: 600, 
          height: 400,
          alt: product.name,
        },
      ],
      locale: 'en_US', 
      type: 'product', 
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - ${siteName}`,
      description: metaDescription,
      images: [product.imageUrl], 
    },
    other: {
      'application/ld+json': JSON.stringify(jsonLd),
    },
  };
}

// This is now a Server Component
export default async function ProductPage({ params }: ProductPageProps) {
  const productId = params.id;
  // Fetch product data on the server
  const product: Product | undefined = mockProducts.find(p => p.id === productId);

  if (!product) {
    notFound();
  }

  // Pass the server-fetched product to the client component
  return <ProductDetailsClient product={product} />;
}
