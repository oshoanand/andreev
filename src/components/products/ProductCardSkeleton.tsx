
"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col h-full border">
      <CardHeader className="p-0 relative">
        <Skeleton className="aspect-[4/3] w-full" />
      </CardHeader>
      <CardContent className="p-4 flex-grow space-y-2">
        <Skeleton className="h-6 w-3/4" /> 
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-5 w-1/3 mt-2" />
      </CardContent>
      <CardFooter className="p-4 border-t border-border bg-muted/30">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
