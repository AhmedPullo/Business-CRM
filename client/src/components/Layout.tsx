import { Sidebar } from "./Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/toaster";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <ScrollArea className="flex-1">
          <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </ScrollArea>
      </main>
      <Toaster />
    </div>
  );
}
