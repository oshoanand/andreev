export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Shopify Mini. All rights reserved.</p>
        <p className="mt-1">A Fictional E-commerce Experience</p>
      </div>
    </footer>
  );
}
