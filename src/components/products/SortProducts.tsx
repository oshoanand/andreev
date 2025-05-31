"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListOrdered } from "lucide-react";

interface SortProductsProps {
  onSortChange: (value: string) => void;
  currentSort: string;
}

export function SortProducts({ onSortChange, currentSort }: SortProductsProps) {
  return (
    <div className="flex items-center gap-2">
      <ListOrdered className="h-5 w-5 text-muted-foreground" />
      <Select onValueChange={onSortChange} value={currentSort}>
        <SelectTrigger className="w-[180px] bg-background">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="popularity">Popularity</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="name-asc">Name: A to Z</SelectItem>
          <SelectItem value="name-desc">Name: Z to A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
