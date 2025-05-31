import Link from 'next/link';
import { Store } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
      <Store className="h-7 w-7" />
      <span className="text-xl font-headline font-semibold">Shopify Mini</span>
    </Link>
  );
}
