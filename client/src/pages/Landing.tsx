import { Button } from "@/components/ui/button";
import { Package2 } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Left Panel - Hero/Branding */}
      <div className="md:w-1/2 bg-slate-950 relative overflow-hidden flex flex-col justify-between p-8 md:p-12 lg:p-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.8))]" />
        
        {/* Abstract shapes for visual interest */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <Package2 className="h-8 w-8 text-white" />
            <span className="text-xl font-bold text-white tracking-tight">CRM Suite</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6 leading-tight">
            Streamline Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Business Operations
            </span>
          </h1>
          
          <p className="text-slate-300 text-lg md:text-xl max-w-md leading-relaxed">
            Manage clients, invoices, and deliveries in one unified platform. 
            Designed for small businesses that need to move fast.
          </p>
        </div>

        <div className="relative z-10 text-sm text-slate-500">
          © {new Date().getFullYear()} CRM Suite. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Auth */}
      <div className="md:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-slate-900">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-display">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400">Sign in to your dashboard to continue</p>
          </div>

          <div className="space-y-4 pt-8">
            <Button 
              size="lg" 
              className="w-full h-12 text-base shadow-lg shadow-primary/20 hover:shadow-xl transition-all duration-300"
              onClick={() => window.location.href = "/api/login"}
            >
              Log In with Replit
            </Button>
            
            <p className="text-center text-xs text-slate-400 mt-6">
              Secure authentication powered by Replit.
              <br />
              No separate account creation required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
