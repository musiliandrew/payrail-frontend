import { Badge } from "@/components/ui/badge";

const steps = [
  {
    step: "01",
    title: "Create Business + Wallet",
    description: "Register a business and configure settlement rules. PayRail issues a wallet for STK Push routing.",
  },
  {
    step: "02",
    title: "Charge via API",
    description: "POST `/v1/payments/charge` with business_id, amount, and reference. PayRail triggers STK Push to its PayBill.",
  },
  {
    step: "03",
    title: "Route Funds Automatically",
    description: "PayRail validates payment, writes a ledger entry, and auto-payouts to bank or M-Pesa.",
  },
  {
    step: "04",
    title: "Receive Webhooks + Status",
    description: "Your system gets real-time webhooks with a canonical transaction record and settlement status.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="info" className="mb-4">
            Money + Data Flow
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            How PayRail Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Accept money once, route it correctly, and expose clean payment data to developers.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          {steps.map((item, index) => (
            <div 
              key={index}
              className="relative flex gap-6 pb-12 last:pb-0"
            >
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-glow z-10">
                  <span className="font-display font-bold text-lg text-primary-foreground">
                    {item.step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-border mt-4" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-2 pb-8">
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-lg">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
