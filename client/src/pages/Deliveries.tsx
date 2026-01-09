import { Layout } from "@/components/Layout";
import { useDeliveries, useUpdateDelivery } from "@/hooks/use-deliveries";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, PackageCheck, MapPin, Truck } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Deliveries() {
  const { data: deliveries, isLoading } = useDeliveries();
  const updateMutation = useUpdateDelivery();
  const { toast } = useToast();

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateMutation.mutateAsync({
        id,
        status: status as "pending" | "delivered",
        deliveryDate: status === "delivered" ? new Date().toISOString().split('T')[0] : undefined
      });
      toast({ title: "Updated", description: "Delivery status updated" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update status" });
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-display">Deliveries</h1>
        <p className="text-muted-foreground mt-1">Manage shipping and fulfillment</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : deliveries?.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-muted-foreground/30">
          <Truck className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
          <h3 className="text-lg font-medium">No deliveries yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-2">
            Create an invoice first, then click the truck icon to generate a delivery order.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {deliveries?.map((delivery) => (
            <Card key={delivery.id} className="overflow-hidden border-border/60 hover:border-primary/30 transition-colors">
              <CardHeader className="bg-muted/20 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge 
                      variant="secondary" 
                      className={delivery.status === 'delivered' 
                        ? "bg-green-100 text-green-800 hover:bg-green-100" 
                        : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                      }
                    >
                      {delivery.status.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    #{delivery.invoice.invoiceNumber}
                  </span>
                </div>
                <CardTitle className="mt-3 text-lg">{delivery.invoice.client.name}</CardTitle>
                <CardDescription>{delivery.invoice.client.cafeName}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">
                      {delivery.invoice.client.address || "No address provided"}
                    </span>
                  </div>
                  
                  {delivery.deliveryDate && (
                    <div className="flex items-center gap-3 text-sm">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Delivered on: {format(new Date(delivery.deliveryDate), "MMM dd, yyyy")}
                      </span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border/50 flex justify-between items-center">
                    <Select 
                      defaultValue={delivery.status} 
                      onValueChange={(val) => handleStatusChange(delivery.id, val)}
                    >
                      <SelectTrigger className="w-[140px] h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>

                    {delivery.status === 'pending' && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleStatusChange(delivery.id, 'delivered')}
                      >
                        <PackageCheck className="h-4 w-4 mr-2" />
                        Mark Done
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
}
