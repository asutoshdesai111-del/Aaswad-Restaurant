import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-primary uppercase tracking-widest text-sm font-semibold">Get in Touch</span>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mt-4 mb-8">Contact Us</h1>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-12"
          >
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin size={24} />
                </div>
                <h3 className="font-serif text-2xl font-bold">Location</h3>
                <p className="text-muted-foreground">
                  123 Culinary Avenue,<br />
                  SoHo District,<br />
                  New York, NY 10012
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Clock size={24} />
                </div>
                <h3 className="font-serif text-2xl font-bold">Hours</h3>
                <div className="text-muted-foreground text-sm space-y-1">
                  <p className="flex justify-between"><span>Mon-Thu:</span> <span>5pm - 10pm</span></p>
                  <p className="flex justify-between"><span>Fri-Sat:</span> <span>5pm - 11pm</span></p>
                  <p className="flex justify-between"><span>Sun:</span> <span>4pm - 9:30pm</span></p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Phone size={24} />
                </div>
                <h3 className="font-serif text-2xl font-bold">Phone</h3>
                <p className="text-muted-foreground">+1 (212) 555-0123</p>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Mail size={24} />
                </div>
                <h3 className="font-serif text-2xl font-bold">Email</h3>
                <p className="text-muted-foreground">hello@lumiere.com</p>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-[300px] bg-muted rounded-lg overflow-hidden relative group">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" 
                alt="Map location" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Button variant="outline" className="bg-background/80 backdrop-blur-sm">
                  View on Google Maps
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card p-8 rounded-xl border border-border/40"
          >
            <h3 className="font-serif text-2xl font-bold mb-6">Send us a Message</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input placeholder="Your Name" className="h-12 bg-background/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input placeholder="Your Email" className="h-12 bg-background/50" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input placeholder="Inquiry Type" className="h-12 bg-background/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea placeholder="How can we help you?" className="min-h-[150px] bg-background/50" />
              </div>
              <Button className="w-full h-12 uppercase tracking-widest font-bold">
                Send Message
              </Button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
