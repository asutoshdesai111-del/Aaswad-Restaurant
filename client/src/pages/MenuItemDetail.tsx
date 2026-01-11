import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type MenuItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, ShoppingBag, Info, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function MenuItemDetail() {
  const [, params] = useRoute("/menu/:id");
  const id = params?.id;

  const { data: item, isLoading, error } = useQuery<MenuItem>({
    queryKey: [buildUrl(api.menuItems.get.path, { id: id || "" })],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-24">
        <h2 className="text-2xl font-serif font-bold mb-4 text-destructive">Item Not Found</h2>
        <Link href="/menu">
          <Button variant="outline">Back to Menu</Button>
        </Link>
      </div>
    );
  }

  const formattedPrice = (item.price / 100).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4">
        <Link href="/menu">
          <Button variant="ghost" className="mb-6 gap-2 hover:bg-primary/10 hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Back to Menu
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden aspect-square lg:aspect-auto lg:h-[600px] shadow-2xl border border-border/50"
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <Badge variant="outline" className="w-fit mb-4 text-primary border-primary/30 uppercase tracking-widest text-xs px-3 py-1 bg-primary/5">
              Premium Selection
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 tracking-tight leading-tight">
              {item.name}
            </h1>
            <p className="text-3xl font-sans font-bold text-primary mb-8">
              {formattedPrice}
            </p>
            
            <div className="space-y-6 mb-10">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {item.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50">
                  <Info className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-sm">Chef's Note</h4>
                    <p className="text-xs text-muted-foreground">Authentic flavors prepared fresh to order using traditional techniques.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-sm">Quality Guaranteed</h4>
                    <p className="text-xs text-muted-foreground">Sourced from the finest ingredients with strict hygiene standards.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1 h-14 text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-xl shadow-primary/20 gap-3 active:scale-95 transition-all">
                <ShoppingBag className="h-5 w-5" />
                Order Now
              </Button>
              <Link href="/reservations" className="flex-1">
                <Button variant="outline" className="w-full h-14 text-lg border-primary/30 text-primary hover:bg-primary/10 rounded-full active:scale-95 transition-all">
                  Book a Table
                </Button>
              </Link>
            </div>
            
            <p className="mt-8 text-center sm:text-left text-xs text-muted-foreground italic">
              * Delivery charges and taxes apply as per location.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
