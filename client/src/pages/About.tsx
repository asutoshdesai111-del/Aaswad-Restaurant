import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-primary uppercase tracking-widest text-sm font-semibold">About Us</span>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mt-4 mb-8">Our Philosophy</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We believe that food is more than just sustenance—it is an art form, a memory, and a universal language.
            </p>
          </motion.div>
        </div>

        {/* Content Section 1 */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
            {/* Chef portrait */}
            <img 
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1977&auto=format&fit=crop" 
              alt="Head Chef" 
              className="w-full h-[600px] object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 order-1 md:order-2"
          >
            <h2 className="font-serif text-4xl font-bold">The Chef</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Executive Chef Antoine Laurent brings over 20 years of culinary expertise from the finest kitchens in Paris and Tokyo. 
              His unique approach blends French techniques with Japanese precision, creating dishes that are both comforting and avant-garde.
            </p>
            <blockquote className="border-l-4 border-primary pl-6 py-2 italic text-2xl font-serif text-foreground/80">
              "To cook is to create a memory. Every plate is an opportunity to touch someone's soul."
            </blockquote>
          </motion.div>
        </div>

        {/* Content Section 2 */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="font-serif text-4xl font-bold">The Ambiance</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Lumière is designed to be an sanctuary from the bustling city. 
              The interior features warm wood tones, soft velvet seating, and intimate lighting that sets the stage for an unforgettable evening.
              Every detail, from the hand-made ceramics to the curated playlist, is chosen to enhance your sensory experience.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Interior shot */}
            <img 
              src="https://pixabay.com/get/gcfc0d3d648c0a6971d381bf06159311524e085b33429783d481e8283d2438518b7b2c335c752e70c3be6bded6d3653753f5ecdb55046723c8951874df6965b16_1280.jpg" 
              alt="Restaurant Interior" 
              className="w-full h-[500px] object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>
        </div>

      </div>
    </div>
  );
}
