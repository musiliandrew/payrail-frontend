import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const stats = [
  {
    label: "Payments Routed",
    value: "KES 2.4M",
    change: "+11.2%",
    trend: "up",
  },
  {
    label: "Active Businesses",
    value: "128",
    change: "+6.4%",
    trend: "up",
  },
  {
    label: "Webhooks Delivered",
    value: "4,821",
    change: "+9.8%",
    trend: "up",
  },
  {
    label: "Settlement Success",
    value: "99.2%",
    change: "+0.4%",
    trend: "up",
  },
];

const recentPayments = [
  {
    id: "PR-2026-000192",
    business: "Greenview Apartments",
    amount: "KES 5,000",
    status: "completed",
    time: "10:01:22",
  },
  {
    id: "PR-2026-000191",
    business: "Nairobi Rentals",
    amount: "KES 2,500",
    status: "completed",
    time: "09:58:10",
  },
  {
    id: "PR-2026-000190",
    business: "MedCab Kenya",
    amount: "KES 10,000",
    status: "pending",
    time: "09:57:02",
  },
  {
    id: "PR-2026-000189",
    business: "Kwanza Supplies",
    amount: "KES 1,500",
    status: "completed",
    time: "09:54:41",
  },
  {
    id: "PR-2026-000188",
    business: "Harbor Co-Living",
    amount: "KES 7,500",
    status: "failed",
    time: "09:52:09",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
    case "pending":
      return <Badge variant="pending"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    case "failed":
      return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Failed</Badge>;
    default:
      return null;
  }
};

export const DashboardPreview = () => {
  return (
    <section id="ledger" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="info" className="mb-4">
            Live Ledger Preview
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Clean{" "}
            <span className="text-gradient">Payment Truth</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Every transaction has a canonical record with payer, business, references,
            and settlement status in one place.
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-2xl border border-border shadow-strong overflow-hidden">
            {/* Dashboard Header */}
            <div className="bg-secondary/50 px-6 py-4 border-b border-border flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <div className="w-3 h-3 rounded-full bg-warning" />
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="ml-4 text-sm text-muted-foreground">dashboard.payrail.co.ke</span>
            </div>

            {/* Dashboard Content */}
            <div className="p-6">
              {/* Stats Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <Card key={index} variant="stat">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <div className="flex items-end justify-between">
                        <span className="font-display text-2xl font-bold text-foreground">
                          {stat.value}
                        </span>
                        <div className={`flex items-center text-sm font-medium ${
                          stat.trend === "up" ? "text-success" : "text-destructive"
                        }`}>
                          {stat.trend === "up" ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                          {stat.change}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Payments Table */}
              <Card variant="default">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Recent Payments</CardTitle>
                    <Badge variant="secondary">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Live
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Transaction</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Business</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Amount</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                          <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Settled</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentPayments.map((payment, index) => (
                          <tr key={index} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                            <td className="py-3 px-2">
                              <span className="font-mono text-sm">{payment.id}</span>
                            </td>
                            <td className="py-3 px-2">
                              <span className="font-medium">{payment.business}</span>
                            </td>
                            <td className="py-3 px-2">
                              <span className="font-semibold">{payment.amount}</span>
                            </td>
                            <td className="py-3 px-2">
                              {getStatusBadge(payment.status)}
                            </td>
                            <td className="py-3 px-2 text-right">
                              <span className="text-sm text-muted-foreground">{payment.time}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
