import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";
import type { InsertDelivery } from "@shared/schema";

export function useDeliveries() {
  return useQuery({
    queryKey: [api.deliveries.list.path],
    queryFn: async () => {
      const res = await fetch(api.deliveries.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch deliveries");
      return api.deliveries.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateDelivery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertDelivery) => {
      const payload = {
        ...data,
        invoiceId: Number(data.invoiceId),
      };
      
      const validated = api.deliveries.create.input.parse(payload);
      const res = await fetch(api.deliveries.create.path, {
        method: api.deliveries.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.deliveries.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create delivery");
      }
      return api.deliveries.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.deliveries.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
    },
  });
}

export function useUpdateDelivery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertDelivery>) => {
      const validated = api.deliveries.update.input.parse(updates);
      const url = buildUrl(api.deliveries.update.path, { id });
      const res = await fetch(url, {
        method: api.deliveries.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update delivery");
      return api.deliveries.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.deliveries.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
    },
  });
}
