import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { apiRequest, getApiKey, setApiKey } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { ConsoleLayout } from "@/components/console/layout/ConsoleLayout";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

type Payment = {
  id: string;
  status: string;
  amount: number;
  currency: string;
  payrail_reference: string;
  business_reference?: string;
  payer: { phone: string; name?: string };
  business: { business_id: string; name: string };
  settlement?: {
    destination: string;
    status: string;
    bank?: string;
    account_masked?: string;
    mpesa_phone?: string;
  };
  timestamps?: { initiated_at?: string; paid_at?: string; settled_at?: string };
};

export const PaymentsConsole = () => {
  const { toast } = useToast();
  const [apiKey, setApiKeyState] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [businessId, setBusinessId] = useState("");
  const [cursor, setCursor] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canLoad = useMemo(() => apiKey.trim().length > 0, [apiKey]);
  const updateApiKey = (value: string) => {
    setApiKeyState(value);
    setApiKey(value);
  };


  const loadPayments = async (reset = true) => {
    if (!apiKey) return;
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (businessId) params.set("business_id", businessId);
    if (!reset && cursor) params.set("cursor", cursor);
    const result = await apiRequest<any>(`/v1/payments?${params.toString()}`, { method: "GET" }, apiKey);
    setLoading(false);
    if (!result.ok) {
      setErrorMessage(result.error || "Failed to load payments");
      toast({ title: "Failed to load payments", description: result.error });
      return;
    }
    setErrorMessage(null);
    const data = result.data || {};
    setPayments(reset ? data.data || [] : [...payments, ...(data.data || [])]);
    setNextCursor(data.next_cursor || null);
  };

  const refresh = () => {
    setCursor(null);
    setNextCursor(null);
    loadPayments(true);
  };

  const loadMore = () => {
    if (!nextCursor) return;
    setCursor(nextCursor);
    loadPayments(false);
  };

  useEffect(() => {
    const existing = getApiKey();
    if (existing) {
      setApiKeyState(existing);
    }
  }, []);

  useEffect(() => {
    if (canLoad) {
      refresh();
    }
  }, [apiKey]);

  useEffect(() => {
    if (!autoRefresh || !canLoad) return;
    const interval = setInterval(() => refresh(), 15000);
    return () => clearInterval(interval);
  }, [autoRefresh, canLoad]);

  return (
    <ConsoleLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Use your API key to load transactions.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="grid gap-2 md:col-span-2">
              <Label>API Key</Label>
              <Input value={apiKey} onChange={(e) => updateApiKey(e.target.value)} placeholder="prk_..." />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Input value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} placeholder="success" />
            </div>
            <div className="grid gap-2">
              <Label>Business ID</Label>
              <Input value={businessId} onChange={(e) => setBusinessId(e.target.value)} placeholder="uuid" />
            </div>
            <div className="md:col-span-4 flex flex-wrap gap-3">
              <Button onClick={refresh} disabled={!canLoad || loading}>
                {loading ? "Loading..." : "Refresh"}
              </Button>
              <Button variant="secondary" onClick={loadMore} disabled={!nextCursor || loading}>
                Load more
              </Button>
              <Button variant={autoRefresh ? "default" : "secondary"} onClick={() => setAutoRefresh(!autoRefresh)}>
                Auto-refresh {autoRefresh ? "On" : "Off"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payer</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Settlement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="space-y-3 py-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {errorMessage && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-red-600">
                      {errorMessage}
                    </TableCell>
                  </TableRow>
                )}
                {!loading && payments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No payments found.
                    </TableCell>
                  </TableRow>
                )}
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      <div>{payment.payrail_reference}</div>
                      <div className="text-xs text-muted-foreground">{payment.business_reference || "-"}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{payment.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {payment.amount} {payment.currency}
                    </TableCell>
                    <TableCell>
                      <div>{payment.payer?.name || "-"}</div>
                      <div className="text-xs text-muted-foreground">{payment.payer?.phone}</div>
                    </TableCell>
                    <TableCell>
                      {payment.business?.business_id ? (
                        <Link
                          to={`/console?business_id=${payment.business.business_id}`}
                          className="text-primary hover:underline"
                        >
                          {payment.business.name}
                        </Link>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <div>{payment.settlement?.destination || "-"}</div>
                      <div className="text-xs text-muted-foreground">
                        {payment.settlement?.account_masked || payment.settlement?.mpesa_phone || "-"}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ConsoleLayout>
  );
};
