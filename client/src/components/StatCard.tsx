import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
  description?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  className,
  description
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight text-foreground font-display">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <p className={cn("text-xs font-medium mt-1", trendUp ? "text-green-600" : "text-red-600")}>
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
