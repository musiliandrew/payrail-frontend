import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const CTASection = () => {
  return (
    <section id="cta" className="py-24">
      <div className="container mx-auto px-4">
        <div className="relative max-w-4xl mx-auto">
          {/* Background Glow */}
          <div className="absolute inset-0 gradient-primary rounded-3xl blur-3xl opacity-20" />
          
          {/* Card */}
          <div className="relative gradient-primary rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden">
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full" 
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                  backgroundSize: '40px 40px'
                }}
              />
            </div>

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
                <span className="text-sm font-medium text-primary-foreground">Developer Early Access</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
                Build on PayRail
              </h2>

              <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
                Launch a programmable payment flow with escrow routing, clean ledger data,
                and instant payouts to bank or M-Pesa.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="xl" 
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-strong font-semibold"
                >
                  Request Access
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="xl"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Read the Docs
                </Button>
              </div>

              <p className="text-sm text-primary-foreground/60 mt-8">
                ✓ API-first &nbsp;&nbsp; ✓ Webhooks included &nbsp;&nbsp; ✓ Multi-tenant ready
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
