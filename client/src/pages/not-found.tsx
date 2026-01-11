import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChefHat, UtensilsCrossed, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden">
          <div className="h-2 bg-primary w-full" />
          <CardContent className="pt-12 pb-10 text-center">
            <div className="relative mb-8 inline-block">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="relative bg-background p-6 rounded-full border border-primary/30">
                <ChefHat className="h-16 w-16 text-primary" />
              </div>
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-2 -right-2 bg-background p-2 rounded-full border border-primary/20 shadow-lg"
              >
                <UtensilsCrossed className="h-6 w-6 text-primary" />
              </motion.div>
            </div>

            <h1 className="font-serif text-6xl font-bold text-primary mb-2">404</h1>
            <h2 className="text-2xl font-semibold mb-4 text-foreground tracking-tight">Recipe Not Found</h2>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              It seems this particular dish isn't on our menu today.
              Let's get you back to the main dining room.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 gap-2 h-11 px-8 rounded-full shadow-lg shadow-primary/20 transition-all active:scale-95">
                  <Home className="h-4 w-4" />
                  Return Home
                </Button>
              </Link>
              <Link href="/menu">
                <Button variant="outline" className="w-full sm:w-auto border-primary/30 text-primary hover:bg-primary/10 gap-2 h-11 px-8 rounded-full transition-all active:scale-95">
                  View Menu
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
