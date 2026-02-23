import { Card, CardContent } from "@/components/ui/card";
import { 
  Smartphone, 
  RefreshCw, 
  PieChart, 
  Shield, 
  Zap, 
  Users 
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Single PayBill Escrow",
    description: "PayRail owns one PayBill/Till. Every payment lands in escrow first, then routes to the right business.",
  },
  {
    icon: RefreshCw,
    title: "Instant Payout Routing",
    description: "Auto-payouts to bank or M-Pesa based on business rules. No Daraja per tenant required.",
  },
  {
    icon: PieChart,
    title: "Canonical Transaction Data",
    description: "Every payment becomes a clean transaction record with status, references, and settlement details.",
  },
  {
    icon: Smartphone,
    title: "STK Push + Wallets",
    description: "Create PayRail wallets for businesses to trigger STK Push and reconcile automatically.",
  },
  {
    icon: Zap,
    title: "Developer APIs + Webhooks",
    description: "Charge customers, fetch status, and receive webhooks for payment events with a unified API.",
  },
  {
    icon: Users,
    title: "Multi-Tenant by Design",
    description: "Isolated credentials, routing, and reporting for every tenant with a single platform dashboard.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            The Core of{" "}
            <span className="text-gradient">PayRail</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A transaction router, ledger, and payout engine built for multi-tenant platforms.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              variant="stat"
              className="group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
