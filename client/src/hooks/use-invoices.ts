import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";
import type { InsertInvoice } from "@shared/schema";

export function useInvoices() {
  return useQuery({
    queryKey: [api.invoices.list.path],
    queryFn: async () => {
      const res = await fetch(api.invoices.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch invoices");
      return api.invoices.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertInvoice) => {
      // Coerce amount to number if it's a string, though schema expects number/decimal
      const payload = {
        ...data,
        clientId: Number(data.clientId),
      };
      
      const validated = api.invoices.create.input.parse(payload);
      const res = await fetch(api.invoices.create.path, {
        method: api.invoices.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.invoices.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create invoice");
      }
      return api.invoices.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.invoices.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertInvoice>) => {
      const validated = api.invoices.update.input.parse(updates);
      const url = buildUrl(api.invoices.update.path, { id });
      const res = await fetch(url, {
        method: api.invoices.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update invoice");
      return api.invoices.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.invoices.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.invoices.delete.path, { id });
      const res = await fetch(url, {
        method: api.invoices.delete.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete invoice");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.invoices.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
    },
  });
}
