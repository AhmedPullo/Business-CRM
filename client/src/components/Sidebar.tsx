import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Users,
  FileText,
  Truck,
  LogOut,
  Package2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/deliveries", label: "Deliveries", icon: Truck },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout, isLoggingOut } = useAuth();

  return (
    <div className="flex h-screen w-64 flex-col bg-card border-r border-border shadow-sm">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Package2 className="mr-2 h-6 w-6 text-primary" />
        <span className="text-lg font-bold text-foreground font-display tracking-tight">CRM Suite</span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border p-4">
        {user && (
          <div className="mb-4 flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage src={user.profileImageUrl || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">
                {user.firstName} {user.lastName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        )}
        
        <button
          onClick={() => logout()}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
        >
          <LogOut className="h-5 w-5" />
          {isLoggingOut ? "Logging out..." : "Log Out"}
        </button>
      </div>
    </div>
  );
}
