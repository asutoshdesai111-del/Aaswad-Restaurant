import { motion } from "framer-motion";
import { type MenuItem } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
}

export function MenuItemCard({ item, index }: MenuItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-lg bg-card border border-border/40 hover:border-primary/50 transition-all duration-300"
    >
      <div className="aspect-[4/3] overflow-hidden">
        {/* Placeholder logic for menu items if no image provided */}
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
      </div>
      
      <div className="p-6 relative">
        <div className="flex justify-between items-start gap-4 mb-2">
          <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          <span className="font-sans font-bold text-primary text-lg">
            {(item.price / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </span>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}
