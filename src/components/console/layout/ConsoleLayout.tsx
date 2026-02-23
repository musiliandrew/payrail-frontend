import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getApiKey, setApiKey } from "@/lib/api";

const navItems = [
  { label: "Console", path: "/console" },
  { label: "Payments", path: "/payments" },
  { label: "Payouts", path: "/payouts" },
  { label: "Login", path: "/login" },
];

type ConsoleLayoutProps = {
  children: ReactNode;
};

export const ConsoleLayout = ({ children }: ConsoleLayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-card/50 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-display tracking-wide">
            PayRail
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "rounded-full px-3 py-1 transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            {getApiKey() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setApiKey("")}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear Key
              </Button>
            )}
          </nav>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-10 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-display">
            {navItems.find((item) => item.path === location.pathname)?.label || "Console"}
          </h1>
          <p className="text-muted-foreground">
            Manage your PayRail integration, tenants, and settlements.
          </p>
        </div>

        {children}
      </div>
    </div>
  );
};
