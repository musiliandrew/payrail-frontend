import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Smartphone, CheckCircle, Zap } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen gradient-hero pt-24 pb-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left animate-slide-up">
            <Badge variant="info" className="mb-6 px-4 py-1.5">
              <Zap className="w-3 h-3 mr-1" />
              Programmable Payments
            </Badge>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              The{" "}
              <span className="text-gradient">Payment Router</span>
              {" "}for East Africa
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8">
              PayRail accepts money once, routes it to the right business, and produces clean payment data.
              One PayBill, multi-tenant wallets, instant payouts, and developer-first APIs.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-10">
              <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 shadow-soft">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm font-medium">Single PayBill Escrow</span>
              </div>
              <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 shadow-soft">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm font-medium">Multi-Tenant Routing</span>
              </div>
              <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 shadow-soft">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm font-medium">Webhooks + Ledger</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl">
                Get API Keys
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="glass" size="xl">
                View Docs
              </Button>
            </div>

            {/* Trust Indicators */}
            <p className="text-sm text-muted-foreground mt-8">
              Built for marketplaces, property platforms, and SaaS teams
            </p>
          </div>

          {/* Right Content - Phone Mockup */}
          <div className="flex-1 relative animate-float">
            <div className="relative mx-auto max-w-sm">
              {/* Phone Frame */}
              <div className="relative bg-foreground rounded-[3rem] p-3 shadow-strong">
                <div className="bg-card rounded-[2.5rem] overflow-hidden">
                  {/* Status Bar */}
                  <div className="bg-secondary px-6 py-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">9:41</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-2 bg-muted-foreground/50 rounded-sm" />
                      <div className="w-4 h-2 bg-muted-foreground/50 rounded-sm" />
                      <div className="w-6 h-2 bg-success rounded-sm" />
                    </div>
                  </div>

                  {/* App Content */}
                  <div className="p-6">
                    {/* M-Pesa Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">M-Pesa STK Push</p>
                        <p className="text-sm text-muted-foreground">Confirm Payment</p>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-secondary rounded-2xl p-4 mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-display font-bold text-2xl text-foreground">KES 5,000</span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-muted-foreground">To</span>
                        <span className="font-medium text-foreground">PayRail – Greenview Apartments</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Ref</span>
                        <span className="font-mono text-sm text-foreground">Flat 4B</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button variant="hero" className="w-full" size="lg">
                      Enter M-Pesa PIN
                    </Button>

                    {/* Security Note */}
                    <p className="text-xs text-center text-muted-foreground mt-4">
                      🔒 Secured by PayRail
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -right-8 top-1/4 bg-card border border-border rounded-xl p-3 shadow-medium animate-pulse-soft">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-sm font-medium">Payment Confirmed</span>
                </div>
              </div>

              <div className="absolute -left-8 bottom-1/3 bg-card border border-border rounded-xl p-3 shadow-medium">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center">
                    <span className="text-xs font-bold text-accent-foreground">Auto</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payout</p>
                    <p className="text-sm font-semibold">Sent to Bank</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
