import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCategories, useMenuItems } from "@/hooks/use-restaurant";
import { MenuItemCard } from "@/components/MenuItemCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Menu() {
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const { data: menuItems, isLoading: isItemsLoading } = useMenuItems();
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");

  const isLoading = isCategoriesLoading || isItemsLoading;

  const filteredItems = menuItems?.filter(
    item => selectedCategory === "all" || item.categoryId === selectedCategory
  );

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-primary uppercase tracking-widest text-sm font-semibold">Our Offerings</span>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mt-4 mb-6">Seasonal Menu</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Curated dishes featuring the freshest ingredients of the season. 
            Prepared with passion and served with elegance.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                className="uppercase tracking-wider font-semibold min-w-[100px]"
              >
                All
              </Button>
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="uppercase tracking-wider font-semibold min-w-[100px]"
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Menu Grid */}
            <motion.div 
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems?.map((item) => (
                  <MenuItemCard key={item.id} item={item} index={0} />
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredItems?.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                No items found in this category.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
