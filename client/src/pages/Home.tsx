import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Star, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMenuItems } from "@/hooks/use-restaurant";
import { MenuItemCard } from "@/components/MenuItemCard";

export default function Home() {
  const { data: menuItems, isLoading } = useMenuItems();
  
  // Get featured items (just taking first 3 for demo)
  const featuredItems = menuItems?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          {/* Restaurant interior with warm lighting */}
          <img 
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"
            alt="Restaurant Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="container relative z-10 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block text-primary uppercase tracking-[0.2em] mb-4 text-sm font-semibold">
              Fine Dining Experience
            </span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              Taste the <span className="text-primary italic">Extraordinary</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl mb-10 leading-relaxed font-light">
              Experience a culinary journey where traditional flavors meet modern innovation. 
              Every dish tells a story of passion and craftsmanship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/menu">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold tracking-wide uppercase px-8 py-6 text-base">
                  View Menu
                </Button>
              </Link>
              <Link href="/reservations">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black font-bold tracking-wide uppercase px-8 py-6 text-base bg-transparent">
                  Book a Table
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Menu Preview */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-primary uppercase tracking-widest text-sm font-semibold">Discover</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mt-2">Signature Dishes</h2>
            </div>
            <Link href="/menu">
              <Button variant="ghost" className="hidden md:flex gap-2 text-primary hover:text-primary/80">
                View Full Menu <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[400px] bg-muted/20 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredItems.map((item, idx) => (
                <MenuItemCard key={item.id} item={item} index={idx} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link href="/menu">
              <Button variant="outline" className="w-full">
                View Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-primary/30" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-primary/30" />
              {/* Chef plating food */}
              <img 
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop" 
                alt="Chef at work" 
                className="w-full h-[600px] object-cover rounded-sm shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            
            <div className="space-y-8">
              <span className="text-primary uppercase tracking-widest text-sm font-semibold">Our Story</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
                Crafting Memories <br />Through Food
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Founded in 2010, Aaswad has become a beacon of culinary excellence. 
                Our philosophy is simple: source the finest ingredients and let them shine through masterful technique.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="text-primary fill-primary" />
                    <span className="font-bold text-xl">Michelin Star</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Awarded for excellence in 2018, 2019, 2023</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="text-primary" />
                    <span className="font-bold text-xl">Since 2010</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Over a decade of serving memories</p>
                </div>
              </div>
              <Link href="/about">
                <Button className="bg-foreground text-background hover:bg-primary hover:text-primary-foreground px-8 py-6 uppercase tracking-wider font-bold mt-4">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation CTA */}
      <section className="py-24 relative overflow-hidden">
        {/* Dark moody bar background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop"
            alt="Bar atmosphere"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/90" />
        </div>

        <div className="container relative z-10 px-4 text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-white">Reserve Your Table</h2>
          <p className="text-gray-300 text-lg mb-10 leading-relaxed">
            Whether it's a romantic dinner for two or a celebration with friends, 
            we ensure every moment is memorable.
          </p>
          <Link href="/reservations">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-white hover:text-black font-bold tracking-wide uppercase px-10 py-8 text-lg">
              Book Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
