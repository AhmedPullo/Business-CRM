import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../api/client';
import { Client, InsertClient } from '../types';

export function useClients() {
  return useQuery<Client[]>({
    queryKey: ['/api/clients'],
    queryFn: async () => {
      const data = await apiFetch('/api/clients');
      return data as Client[];
    },
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: InsertClient) => {
      const res = await apiFetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return res as Client;
    },
    onSuccess() {
      qc.invalidateQueries({ queryKey: ['/api/clients'] });
    },
  });
}
