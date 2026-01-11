import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertReservationSchema, type InsertReservation } from "@shared/schema";
import { useCreateReservation } from "@/hooks/use-restaurant";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Reservations() {
  const mutation = useCreateReservation();
  const { toast } = useToast();
  
  const form = useForm<InsertReservation>({
    resolver: zodResolver(insertReservationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      partySize: 2,
    },
  });

  function onSubmit(data: InsertReservation) {
    mutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Reservation Confirmed!",
          description: "We look forward to seeing you at Aaswad.",
        });
        form.reset();
      },
      onError: (error: Error) => {
        toast({
          title: "Reservation Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="min-h-screen pt-24 bg-background">
      {/* Background with overlay */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop" 
          alt="Restaurant ambiance"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <span className="text-primary uppercase tracking-widest font-semibold">Reservations</span>
            <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight">
              Book Your <br/>Table Now
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
              To ensure the best dining experience, we recommend making a reservation at least 24 hours in advance. 
              For parties larger than 8, please contact us directly.
            </p>
            
            <div className="space-y-6 pt-8 border-t border-border/20">
              <div className="flex flex-col gap-1">
                <span className="font-serif font-bold text-xl">Private Dining</span>
                <p className="text-muted-foreground">Available for special events and corporate gatherings.</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-serif font-bold text-xl">Dietary Requirements</span>
                <p className="text-muted-foreground">Please inform us of any allergies when booking.</p>
              </div>
            </div>
          </motion.div>

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card p-8 md:p-10 rounded-xl border border-border/40 shadow-2xl backdrop-blur-sm"
          >
            <h2 className="font-serif text-3xl font-bold mb-8 text-center">Reservation Details</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="bg-background/50 h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="9876543210" {...field} className="bg-background/50 h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} className="bg-background/50 h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date & Time</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal h-12 bg-background/50",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP p")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                            <div className="p-3 border-t border-border">
                              <Input 
                                type="time" 
                                className="w-full" 
                                onChange={(e) => {
                                  if (field.value && e.target.value) {
                                    const [hours, minutes] = e.target.value.split(':');
                                    const newDate = new Date(field.value);
                                    newDate.setHours(parseInt(hours), parseInt(minutes));
                                    field.onChange(newDate);
                                  }
                                }}
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="partySize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Party Size</FormLabel>
                        <Select onValueChange={(v) => field.onChange(parseInt(v))} defaultValue={String(field.value)}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-background/50">
                              <SelectValue placeholder="Select party size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
                              <SelectItem key={size} value={String(size)}>
                                {size} {size === 1 ? 'Guest' : 'Guests'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg uppercase tracking-widest font-bold bg-primary text-primary-foreground hover:bg-primary/90 mt-8"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" /> Processing...
                    </span>
                  ) : (
                    "Confirm Reservation"
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
