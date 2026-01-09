import { useStats } from "@/hooks/use-stats";
import { StatCard } from "@/components/StatCard";
import { Layout } from "@/components/Layout";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { DollarSign, Users, FileText, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ['#222', '#64748b', '#94a3b8', '#cbd5e1'];

export default function Dashboard() {
  const { data: stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <Layout>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </Layout>
    );
  }

  const invoiceData = [
    { name: 'Paid', value: stats?.invoiceCount || 0 }, // Simplified for example, normally status breakdown
    { name: 'Pending', value: stats?.pendingDeliveries || 0 }, // Using deliveries as proxy for demo
  ];

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight font-display text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your business performance and activities.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Revenue"
            value={`$${Number(stats?.totalSales || 0).toLocaleString()}`}
            icon={DollarSign}
            description="Total collected revenue"
          />
          <StatCard
            title="Active Clients"
            value={stats?.topClients.length || 0}
            icon={Users}
            description="Clients with activity"
          />
          <StatCard
            title="Invoices Issued"
            value={stats?.invoiceCount || 0}
            icon={FileText}
            description="Total invoices generated"
          />
          <StatCard
            title="Pending Deliveries"
            value={stats?.pendingDeliveries || 0}
            icon={Truck}
            description="Orders waiting for delivery"
            className="border-primary/20 bg-primary/5"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4 rounded-xl border border-border/50 bg-card p-6 shadow-sm">
            <h3 className="font-semibold text-lg font-display mb-6">Top Clients by Revenue</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.topClients || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar 
                    dataKey="totalAmount" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-span-3 rounded-xl border border-border/50 bg-card p-6 shadow-sm">
            <h3 className="font-semibold text-lg font-display mb-6">Business Distribution</h3>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={invoiceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {invoiceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 text-sm text-muted-foreground mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[0] }} />
                <span>Invoices</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[1] }} />
                <span>Deliveries</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}
