import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from "@/hooks/use-clients";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Trash2, Edit2, Loader2, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertClientSchema, type InsertClient, type Client } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function Clients() {
  const { data: clients, isLoading } = useClients();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { toast } = useToast();
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();
  const deleteMutation = useDeleteClient();

  const form = useForm<InsertClient>({
    resolver: zodResolver(insertClientSchema),
    defaultValues: {
      name: "",
      cafeName: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = async (data: InsertClient) => {
    try {
      if (editingClient) {
        await updateMutation.mutateAsync({ id: editingClient.id, ...data });
        toast({ title: "Success", description: "Client updated successfully" });
      } else {
        await createMutation.mutateAsync(data);
        toast({ title: "Success", description: "Client created successfully" });
      }
      setIsDialogOpen(false);
      form.reset();
      setEditingClient(null);
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive" 
      });
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    form.reset({
      name: client.name,
      cafeName: client.cafeName || "",
      email: client.email || "",
      phone: client.phone || "",
      address: client.address || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (deletingId) {
      try {
        await deleteMutation.mutateAsync(deletingId);
        toast({ title: "Success", description: "Client deleted successfully" });
      } catch (error) {
        toast({ 
          title: "Error", 
          description: "Could not delete client. They may have active invoices.",
          variant: "destructive" 
        });
      } finally {
        setDeletingId(null);
      }
    }
  };

  const filteredClients = clients?.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.cafeName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">Clients</h1>
          <p className="text-muted-foreground mt-1">Manage your customer base</p>
        </div>
        <Button 
          onClick={() => {
            setEditingClient(null);
            form.reset();
            setIsDialogOpen(true);
          }}
          className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Client
        </Button>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search clients..." 
            className="pl-9 bg-card border-border/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Client</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Cafe Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : filteredClients?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No clients found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              filteredClients?.map((client) => (
                <TableRow key={client.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarFallback className="bg-primary/5 text-primary text-xs">
                          {client.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{client.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>{client.email}</span>
                      <span className="text-muted-foreground text-xs">{client.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>{client.cafeName || "-"}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground" title={client.address || ""}>
                    {client.address || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(client)}>
                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeletingId(client.id)}>
                        <Trash2 className="h-4 w-4 text-destructive/70 hover:text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingClient ? "Edit Client" : "Add New Client"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cafeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cafe/Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Sunrise Cafe" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} value={field.value || ''} />
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
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 890" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-6">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {editingClient ? "Update Client" : "Create Client"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the client and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              {deleteMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
