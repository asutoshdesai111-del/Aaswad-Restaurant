import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { insertReservationSchema, type InsertReservation } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// ============================================
// Categories Hooks
// ============================================

export function useCategories() {
  return useQuery({
    queryKey: [api.categories.list.path],
    queryFn: async () => {
      const res = await fetch(api.categories.list.path);
      if (!res.ok) throw new Error("Failed to fetch categories");
      return api.categories.list.responses[200].parse(await res.json());
    },
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: [api.categories.get.path, slug],
    queryFn: async () => {
      const url = buildUrl(api.categories.get.path, { slug });
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch category");
      }
      return api.categories.get.responses[200].parse(await res.json());
    },
    enabled: !!slug,
  });
}

// ============================================
// Menu Items Hooks
// ============================================

export function useMenuItems() {
  return useQuery({
    queryKey: [api.menuItems.list.path],
    queryFn: async () => {
      const res = await fetch(api.menuItems.list.path);
      if (!res.ok) throw new Error("Failed to fetch menu items");
      return api.menuItems.list.responses[200].parse(await res.json());
    },
  });
}

// ============================================
// Reservation Hooks
// ============================================

export function useCreateReservation() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: InsertReservation) => {
      const validated = insertReservationSchema.parse(data);
      const res = await fetch(api.reservations.create.path, {
        method: api.reservations.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.reservations.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create reservation");
      }
      
      return api.reservations.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({
        title: "Reservation Confirmed",
        description: "We look forward to hosting you.",
      });
    },
    onError: (error) => {
      toast({
        title: "Reservation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
