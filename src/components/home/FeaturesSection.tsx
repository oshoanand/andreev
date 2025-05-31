
"use client";

import { Truck, ShieldCheck, BadgeCheck, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Truck className="h-10 w-10 text-primary" />,
    title: "Free Delivery",
    description: "Enjoy complimentary shipping on all orders over $50.",
    dataAiHint: "delivery truck"
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: "Secure Payments",
    description: "Your transactions are protected with our encrypted payment gateway.",
    dataAiHint: "security shield"
  },
  {
    icon: <BadgeCheck className="h-10 w-10 text-primary" />,
    title: "Original Quality",
    description: "We guarantee 100% authentic and high-quality products.",
    dataAiHint: "quality badge"
  },
  {
    icon: <RotateCcw className="h-10 w-10 text-primary" />,
    title: "Easy Returns",
    description: "Not satisfied? Return your items easily within 30 days.",
    dataAiHint: "return arrow"
  },
];

export function FeaturesSection() {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <section className="py-12 bg-muted/50 dark:bg-muted/20 rounded-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-headline font-semibold text-center mb-10 text-foreground">
          Why Shop With Us?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              className="w-full"
            >
              <Card className="text-center h-full shadow-md hover:shadow-lg transition-shadow duration-300 bg-card">
                <CardHeader className="items-center">
                  <div className="p-3 bg-primary/10 rounded-full mb-3" data-ai-hint={feature.dataAiHint}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold font-headline text-primary">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
