import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type MenuItem, type InsertOrder, insertOrderSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, Truck, ShieldCheck, MapPin, Phone, User, Mail, DollarSign } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

export default function Checkout() {
  const [, params] = useRoute("/checkout/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const id = params?.id;

  const { data: item, isLoading } = useQuery<MenuItem>({
    queryKey: [buildUrl(api.menuItems.get.path, { id: id || "" })],
  });

  const form = useForm({
    resolver: zodResolver(insertOrderSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      deliveryAddress: "",
      itemId: Number(id),
      totalAmount: 0,
    }
  });

  const orderMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", api.orders.create.path, data);
      return res.json();
    },
    onSuccess: () => {
      const randomMinutes = Math.floor(Math.random() * (45 - 20 + 1)) + 20;
      toast({
        title: "Order Successful!",
        description: `Our delivery partner will reach to you within ${randomMinutes} minutes.`,
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!item) return null;

  const subtotal = item.price;
  const deliveryCharge = 4000; // ₹40.00
  const handlingCharge = 2000; // ₹20.00
  const totalAmount = subtotal + deliveryCharge + handlingCharge;

  const onSubmit = (data: any) => {
    orderMutation.mutate({
      ...data,
      itemId: item.id,
      totalAmount: totalAmount,
    });
  };

  const formatCurrency = (cents: number) => {
    return (cents / 100).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link href={`/menu/${item.id}`}>
          <Button variant="ghost" className="mb-6 gap-2 hover:bg-primary/10 hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Back to Item
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-primary flex items-center gap-2">
                    <Truck className="h-6 w-6" />
                    Delivery Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="customerName">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input id="customerName" className="pl-10" placeholder="John Doe" {...form.register("customerName")} />
                        </div>
                        {form.formState.errors.customerName && <p className="text-xs text-destructive">{form.formState.errors.customerName.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerEmail">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input id="customerEmail" type="email" className="pl-10" placeholder="john@example.com" {...form.register("customerEmail")} />
                        </div>
                        {form.formState.errors.customerEmail && <p className="text-xs text-destructive">{form.formState.errors.customerEmail.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerPhone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input id="customerPhone" className="pl-10" placeholder="10-digit mobile number" {...form.register("customerPhone")} />
                        </div>
                        {form.formState.errors.customerPhone && <p className="text-xs text-destructive">{form.formState.errors.customerPhone.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-primary" />
                          <Input value="Cash on Delivery" disabled className="pl-10 bg-primary/5 border-primary/20 text-primary font-bold" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deliveryAddress">Delivery Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea id="deliveryAddress" className="pl-10 min-h-[100px]" placeholder="Flat No, Building, Area, Landmank..." {...form.register("deliveryAddress")} />
                      </div>
                      {form.formState.errors.deliveryAddress && <p className="text-xs text-destructive">{form.formState.errors.deliveryAddress.message}</p>}
                    </div>

                    <Button type="submit" disabled={orderMutation.isPending} className="w-full h-14 text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-xl shadow-primary/20 gap-3">
                      {orderMutation.isPending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl font-serif">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <img src={item.imageUrl} className="h-16 w-16 rounded-lg object-cover" alt={item.name} />
                    <div>
                      <h4 className="font-bold text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">Qty: 1</p>
                    </div>
                  </div>
                  
                  <div className="h-px bg-border my-4" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Item Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Charge</span>
                      <span>{formatCurrency(deliveryCharge)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Handling Charges</span>
                      <span>{formatCurrency(handlingCharge)}</span>
                    </div>
                  </div>
                  
                  <div className="h-px bg-border my-4" />
                  
                  <div className="flex justify-between items-center text-lg font-bold text-primary">
                    <span>Grand Total</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                    <ShieldCheck className="h-3 w-3 text-primary" />
                    Secure Checkout Experience
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
