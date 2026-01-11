import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type Order, type MenuItem } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, Clock, CheckCircle2, XCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type OrderWithItem = Order & { item?: MenuItem };

export default function AdminOrders() {
  const { toast } = useToast();
  const { data: orders, isLoading } = useQuery<OrderWithItem[]>({
    queryKey: [api.orders.list.path],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PATCH", api.orders.updateStatus.path.replace(":id", id.toString()), { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.orders.list.path] });
      toast({ title: "Status updated" });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
      case "confirmed": return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Confirmed</Badge>;
      case "out_for_delivery": return <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">Out for Delivery</Badge>;
      case "delivered": return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Delivered</Badge>;
      case "cancelled": return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">Order Management</h1>
            <p className="text-muted-foreground">Monitor and update client orders</p>
          </div>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{orders?.length || 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50 shadow-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Order Info</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold">ORD-{order.id}</span>
                      <span className="text-xs text-muted-foreground">
                        {order.createdAt ? format(new Date(order.createdAt), "MMM d, h:mm a") : "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{order.customerName}</span>
                      <span className="text-xs text-muted-foreground">{order.customerPhone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {order.item && (
                        <img src={order.item.imageUrl} className="h-10 w-10 rounded object-cover" alt="" />
                      )}
                      <span className="text-sm">{order.item?.name || "Unknown Item"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-primary">
                    ₹{order.totalAmount / 100}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      defaultValue={order.status}
                      onValueChange={(value) => updateStatusMutation.mutate({ id: order.id, status: value })}
                      disabled={updateStatusMutation.isPending}
                    >
                      <SelectTrigger className="w-[180px] ml-auto">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
              {(!orders || orders.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center text-muted-foreground italic">
                    No orders placed yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
