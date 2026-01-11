import { useQuery, useMutation } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, isValid } from "date-fns";
import { Loader2, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
import { Reservation } from "@shared/schema";

export default function AdminReservations() {
  const { toast } = useToast();
  const { data: reservations, isLoading, error } = useQuery<Reservation[]>({
    queryKey: [api.reservations.list.path],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest(
        "PATCH",
        buildUrl(api.reservations.update.path, { id }),
        { status }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.reservations.list.path] });
      toast({ title: "Success", description: "Reservation updated successfully" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", buildUrl(api.reservations.delete.path, { id }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.reservations.list.path] });
      toast({ title: "Deleted", description: "Reservation removed" });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-destructive">
        Error loading reservations: {(error as Error).message}
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "cancelled": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const formatDate = (dateStr: string | Date) => {
    const d = new Date(dateStr);
    return isValid(d) ? format(d, "PPP p") : "Invalid Date";
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-primary">Reservation Management</h1>
        <Badge variant="outline" className="text-sm">
          {reservations?.length || 0} Total Bookings
        </Badge>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Party Size</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations?.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>
                  <div className="font-medium">{reservation.name || "N/A"}</div>
                  <div className="text-sm text-muted-foreground">{reservation.email || "N/A"}</div>
                  <div className="text-sm text-muted-foreground">{reservation.phone || "N/A"}</div>
                </TableCell>
                <TableCell>
                  {formatDate(reservation.date)}
                </TableCell>
                <TableCell>{reservation.partySize} Guests</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(reservation.status)}
                    <Select
                      defaultValue={reservation.status}
                      onValueChange={(value) =>
                        updateMutation.mutate({ id: reservation.id, status: value })
                      }
                      disabled={updateMutation.isPending}
                    >
                      <SelectTrigger className="w-[130px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this reservation?")) {
                        deleteMutation.mutate(reservation.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {(!reservations || reservations.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No reservations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
