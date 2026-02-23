import { useEffect, useMemo, useState } from "react";
import { ConsoleLayout } from "@/components/console/layout/ConsoleLayout";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { apiRequest, getApiKey, setApiKey } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

type DeveloperApp = {
  id: string;
  name: string;
  slug: string;
  status: string;
  api_key?: string;
};

type Business = {
  id: string;
  name: string;
  status: string;
  verified: boolean;
  paybill_number?: string;
  till_number?: string;
  created_at?: string;
  settlement_accounts?: Array<{
    id: string;
    account_type: string;
    bank_name?: string;
    bank_code?: string;
    account_name?: string;
    account_number_masked?: string;
    mpesa_phone?: string;
    is_default?: boolean;
  }>;
};

export const DeveloperConsole = () => {
  const { toast } = useToast();
  const [appName, setAppName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [app, setApp] = useState<DeveloperApp | null>(null);
  const [apiKey, setApiKeyState] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [paybillNumber, setPaybillNumber] = useState("");
  const [tillNumber, setTillNumber] = useState("");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [settlementType, setSettlementType] = useState<"mpesa" | "bank">("mpesa");
  const [settlementPhone, setSettlementPhone] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [verificationAmount, setVerificationAmount] = useState("1");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationResponse, setVerificationResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [businessPayments, setBusinessPayments] = useState<any[]>([]);
  const [businessFilter, setBusinessFilter] = useState("");
  const [businessPage, setBusinessPage] = useState(1);
  const pageSize = 8;
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [newKeyLabel, setNewKeyLabel] = useState("default");
  const [searchParams, setSearchParams] = useSearchParams();
  const [chargeAmount, setChargeAmount] = useState("100");
  const [chargePhone, setChargePhone] = useState("");
  const [chargeName, setChargeName] = useState("");
  const [chargeEmail, setChargeEmail] = useState("");
  const [chargeReference, setChargeReference] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookEvents, setWebhookEvents] = useState("payment.success,payment.failed");
  const [webhookDeliveries, setWebhookDeliveries] = useState<any[]>([]);

  const canCreateApp = useMemo(() => appName.trim() && ownerEmail.trim(), [appName, ownerEmail]);
  const canCreateBusiness = useMemo(() => businessName.trim() && apiKey.trim(), [businessName, apiKey]);
  const canUpdateSettlement = useMemo(() => selectedBusinessId && apiKey.trim(), [selectedBusinessId, apiKey]);
  const updateApiKey = (value: string) => {
    setApiKeyState(value);
    setApiKey(value);
  };


  const createApp = async () => {
    if (!canCreateApp) return;
    setLoading(true);
    const result = await apiRequest<DeveloperApp>("/v1/apps", {
      method: "POST",
      body: JSON.stringify({ name: appName, owner_email: ownerEmail }),
    });
    setLoading(false);
    if (!result.ok) {
      toast({ title: "App creation failed", description: result.error });
      return;
    }
    const data = result.data as DeveloperApp;
    setApp(data);
    if (data.api_key) {
      updateApiKey(data.api_key);
    }
    toast({ title: "App created", description: "API key generated." });
  };

  const fetchBusinesses = async () => {
    if (!apiKey) return;
    setLoading(true);
    const result = await apiRequest<Business[]>("/v1/businesses", { method: "GET" }, apiKey);
    setLoading(false);
    if (!result.ok) {
      toast({ title: "Failed to load businesses", description: result.error });
      return;
    }
    setBusinesses(result.data || []);
  };

  const loadApiKeys = async () => {
    if (!apiKey) return;
    const result = await apiRequest<any>("/v1/apps/keys", { method: "GET" }, apiKey);
    if (!result.ok) {
      toast({ title: "Failed to load API keys", description: result.error });
      return;
    }
    setApiKeys(result.data || []);
  };

  const createApiKey = async () => {
    if (!apiKey) return;
    const result = await apiRequest<any>(
      "/v1/apps/keys",
      { method: "POST", body: JSON.stringify({ label: newKeyLabel }) },
      apiKey
    );
    if (!result.ok) {
      toast({ title: "Failed to create key", description: result.error });
      return;
    }
    toast({ title: "API key created", description: "Store it securely." });
    setApiKeys([result.data, ...apiKeys]);
  };

  const revokeApiKey = async (keyId: string) => {
    if (!apiKey) return;
    const result = await apiRequest<any>(`/v1/apps/keys/${keyId}/revoke`, { method: "POST" }, apiKey);
    if (!result.ok) {
      toast({ title: "Failed to revoke key", description: result.error });
      return;
    }
    toast({ title: "API key revoked" });
    setApiKeys(apiKeys.map((key) => (key.id === keyId ? result.data : key)));
  };

  const fetchBusinessDetail = async (businessId: string) => {
    if (!apiKey || !businessId) return;
    const result = await apiRequest<Business>(`/v1/businesses/${businessId}`, { method: "GET" }, apiKey);
    if (!result.ok) {
      toast({ title: "Failed to load business", description: result.error });
      return;
    }
    setSelectedBusiness(result.data || null);
  };

  const fetchBusinessPayments = async (businessId: string) => {
    if (!apiKey || !businessId) return;
    const result = await apiRequest<any>(`/v1/businesses/${businessId}/payments`, { method: "GET" }, apiKey);
    if (!result.ok) {
      toast({ title: "Failed to load payments", description: result.error });
      return;
    }
    const payload = result.data || {};
    setBusinessPayments(payload.data || payload || []);
  };

  const createBusiness = async () => {
    if (!canCreateBusiness) return;
    setLoading(true);
    const result = await apiRequest<Business>(
      "/v1/businesses",
      {
        method: "POST",
        body: JSON.stringify({
          name: businessName,
          paybill_number: paybillNumber,
          till_number: tillNumber,
        }),
      },
      apiKey
    );
    setLoading(false);
    if (!result.ok) {
      toast({ title: "Business creation failed", description: result.error });
      return;
    }
    toast({ title: "Business onboarded", description: "Add settlement and verify next." });
    setBusinessName("");
    setPaybillNumber("");
    setTillNumber("");
    fetchBusinesses();
  };

  const saveSettlement = async () => {
    if (!canUpdateSettlement) return;
    setLoading(true);
    const body =
      settlementType === "mpesa"
        ? { account_type: "mpesa", mpesa_phone: settlementPhone }
        : {
            account_type: "bank",
            bank_name: bankName,
            bank_code: bankCode,
            account_name: accountName,
            account_number: accountNumber,
          };
    const result = await apiRequest(
      `/v1/businesses/${selectedBusinessId}/settlement`,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      apiKey
    );
    setLoading(false);
    if (!result.ok) {
      toast({ title: "Settlement failed", description: result.error });
      return;
    }
    toast({ title: "Settlement saved", description: "Payout route updated." });
  };

  const requestVerification = async () => {
    if (!selectedBusinessId || !apiKey) return;
    setLoading(true);
    const result = await apiRequest<any>(
      "/v1/verification/request",
      {
        method: "POST",
        body: JSON.stringify({
          business_id: selectedBusinessId,
          paybill_number: paybillNumber,
          till_number: tillNumber,
          amount: Number(verificationAmount || "1"),
        }),
      },
      apiKey
    );
    setLoading(false);
    if (!result.ok) {
      toast({ title: "Verification request failed", description: result.error });
      return;
    }
    setVerificationResponse(result.data?.code || "Verification code issued");
    toast({ title: "Verification created", description: "Use the code to confirm." });
  };

  const confirmVerification = async () => {
    if (!verificationCode) return;
    setLoading(true);
    const result = await apiRequest<any>("/v1/verification/confirm", {
      method: "POST",
      body: JSON.stringify({ verification_code: verificationCode }),
    });
    setLoading(false);
    if (!result.ok) {
      toast({ title: "Verification confirm failed", description: result.error });
      return;
    }
    toast({ title: "Business verified", description: "You can now charge payments." });
    fetchBusinesses();
  };

  const chargeCustomer = async () => {
    if (!selectedBusinessId || !apiKey) return;
    setLoading(true);
    const result = await apiRequest<any>(
      "/v1/payments/charge",
      {
        method: "POST",
        body: JSON.stringify({
          business_id: selectedBusinessId,
          amount: Number(chargeAmount),
          currency: "KES",
          payer_phone: chargePhone,
          payer_name: chargeName,
          payer_email: chargeEmail || undefined,
          reference: chargeReference,
        }),
      },
      apiKey
    );
    setLoading(false);
    if (!result.ok) {
      toast({ title: "Charge failed", description: result.error });
      return;
    }
    toast({ title: "Charge initiated", description: "STK push sent to payer." });
    fetchBusinessPayments(selectedBusinessId);
  };

  const createWebhook = async () => {
    if (!apiKey || !webhookUrl) return;
    setLoading(true);
    const events = webhookEvents
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
    const result = await apiRequest<any>(
      "/v1/webhooks/endpoints",
      {
        method: "POST",
        body: JSON.stringify({ url: webhookUrl, events }),
      },
      apiKey
    );
    setLoading(false);
    if (!result.ok) {
      toast({ title: "Webhook creation failed", description: result.error });
      return;
    }
    toast({ title: "Webhook created", description: "Endpoint registered and ready to receive events." });
    setWebhookUrl("");
  };

  const loadWebhookDeliveries = async () => {
    if (!apiKey) return;
    setLoading(true);
    const result = await apiRequest<any>("/v1/webhooks/deliveries", { method: "GET" }, apiKey);
    setLoading(false);
    if (!result.ok) {
      toast({ title: "Failed to load deliveries", description: result.error });
      return;
    }
    setWebhookDeliveries(result.data || []);
  };

  useEffect(() => {
    const existing = getApiKey();
    if (existing) {
      setApiKeyState(existing);
    }
  }, []);

  useEffect(() => {
    if (apiKey) {
      fetchBusinesses();
      loadApiKeys();
    }
  }, [apiKey]);

  useEffect(() => {
    const businessIdParam = searchParams.get("business_id");
    if (businessIdParam && apiKey) {
      setSelectedBusinessId(businessIdParam);
      fetchBusinessDetail(businessIdParam);
      fetchBusinessPayments(businessIdParam);
    }
  }, [searchParams, apiKey]);

  return (
    <ConsoleLayout>
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Developer App</CardTitle>
              <CardDescription>
                Create your PayRail app to receive an API key. You will use this key in all API calls.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>App Name</Label>
                <Input value={appName} onChange={(e) => setAppName(e.target.value)} placeholder="Demo Commerce" />
              </div>
              <div className="grid gap-2">
                <Label>Owner Email</Label>
                <Input value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} placeholder="dev@company.com" />
              </div>
              <Button onClick={createApp} disabled={!canCreateApp || loading}>
                {loading ? "Creating..." : "Create App"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Key</CardTitle>
              <CardDescription>Use this key in requests. Keep it secret.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>API Key</Label>
                <Input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => updateApiKey(e.target.value)}
                  placeholder="prk_..."
                />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Keep this key secret. Rotate it if it leaks.</span>
                <Button variant="ghost" size="sm" onClick={() => setShowApiKey(!showApiKey)}>
                  {showApiKey ? "Hide" : "Show"}
                </Button>
              </div>
              {app && (
                <div className="text-sm text-muted-foreground">
                  App: <span className="text-foreground">{app.name}</span>
                </div>
              )}
              <Button variant="secondary" onClick={fetchBusinesses} disabled={!apiKey || loading}>
                Refresh Businesses
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Create, rotate, or revoke API keys.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Label</Label>
                <Input value={newKeyLabel} onChange={(e) => setNewKeyLabel(e.target.value)} />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={createApiKey} disabled={!apiKey}>
                  Create Key
                </Button>
                <Button variant="secondary" onClick={loadApiKeys} disabled={!apiKey}>
                  Refresh
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No API keys yet.
                    </TableCell>
                  </TableRow>
                )}
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>{key.label}</TableCell>
                    <TableCell>{key.is_active ? "Active" : "Revoked"}</TableCell>
                    <TableCell>{key.created_at ? new Date(key.created_at).toLocaleString() : "-"}</TableCell>
                    <TableCell className="max-w-[220px] truncate">
                      {key.key ? (
                        <div className="flex items-center gap-2">
                          <span className="truncate">{key.key}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(key.key);
                              toast({ title: "Copied", description: "API key copied to clipboard." });
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Hidden (shown once)</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" disabled={!key.is_active}>
                            Revoke
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Revoke API Key?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will immediately disable the key and break any integrations using it.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => revokeApiKey(key.id)}>
                              Revoke Key
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

          <Card>
            <CardHeader>
              <CardTitle>Onboard Business</CardTitle>
              <CardDescription>
                Add a business (tenant) that will receive payouts. You can optionally attach their PayBill/Till for
                verification.
              </CardDescription>
            </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="grid gap-2 md:col-span-2">
              <Label>Business Name</Label>
              <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Greenview Apartments" />
            </div>
            <div className="grid gap-2">
              <Label>PayBill (optional)</Label>
              <Input value={paybillNumber} onChange={(e) => setPaybillNumber(e.target.value)} placeholder="123456" />
            </div>
            <div className="grid gap-2">
              <Label>Till (optional)</Label>
              <Input value={tillNumber} onChange={(e) => setTillNumber(e.target.value)} placeholder="789012" />
            </div>
            <div className="md:col-span-4">
              <Button onClick={createBusiness} disabled={!canCreateBusiness || loading}>
                {loading ? "Saving..." : "Create Business"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settlement & Verification</CardTitle>
            <CardDescription>
              Configure where payouts go (M‑Pesa or bank). Then request a verification code to confirm the PayBill/Till.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="grid gap-2 md:col-span-2">
                  <Label>Business</Label>
                <Select value={selectedBusinessId} onValueChange={setSelectedBusinessId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business" />
                  </SelectTrigger>
                  <SelectContent>
                    {businesses.map((biz) => (
                      <SelectItem key={biz.id} value={biz.id}>
                        {biz.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Settlement Type</Label>
                <Select value={settlementType} onValueChange={(value) => setSettlementType(value as "mpesa" | "bank")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mpesa">M-Pesa</SelectItem>
                    <SelectItem value="bank">Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {settlementType === "mpesa" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label>M-Pesa Phone</Label>
                  <Input value={settlementPhone} onChange={(e) => setSettlementPhone(e.target.value)} placeholder="2547XXXXXXX" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="grid gap-2">
                  <Label>Bank Name</Label>
                  <Input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Co-op Bank" />
                </div>
                <div className="grid gap-2">
                  <Label>Bank Code</Label>
                  <Input value={bankCode} onChange={(e) => setBankCode(e.target.value)} placeholder="11" />
                </div>
                <div className="grid gap-2">
                  <Label>Account Name</Label>
                  <Input value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Greenview Apartments" />
                </div>
                <div className="grid gap-2">
                  <Label>Account Number</Label>
                  <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="1234567890" />
                </div>
              </div>
            )}

            <Button onClick={saveSettlement} disabled={!canUpdateSettlement || loading}>
              {loading ? "Saving..." : "Save Settlement"}
            </Button>

            <div className="border-t border-border pt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="grid gap-2">
                <Label>Verification Amount</Label>
                <Input value={verificationAmount} onChange={(e) => setVerificationAmount(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Verification Code</Label>
                <Input value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} placeholder="PR-VERIFY-XXXXXX" />
              </div>
              <div className="flex items-end gap-3 md:col-span-2">
                <Button variant="secondary" onClick={requestVerification} disabled={!selectedBusinessId || loading}>
                  Request Verification
                </Button>
                <Button onClick={confirmVerification} disabled={!verificationCode || loading}>
                  Confirm Code
                </Button>
              </div>
              {verificationResponse && (
                <div className="md:col-span-4 text-sm text-muted-foreground">
                  Latest verification code: <span className="text-foreground">{verificationResponse}</span>
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              Role note: Admins can manage payouts and webhooks. Developers should only view transactions and initiate
              charges.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
                <CardTitle>Businesses</CardTitle>
                <CardDescription>Manage tenants under your app.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label>Search</Label>
                    <Input
                      value={businessFilter}
                      onChange={(e) => setBusinessFilter(e.target.value)}
                      placeholder="Search by name"
                    />
                  </div>
                </div>
                <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>PayBill</TableHead>
                  <TableHead>Till</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No businesses yet.
                    </TableCell>
                  </TableRow>
                )}
                {businesses
                  .filter((biz) => biz.name.toLowerCase().includes(businessFilter.toLowerCase()))
                  .slice((businessPage - 1) * pageSize, businessPage * pageSize)
                  .map((biz) => (
                  <TableRow key={biz.id}>
                    <TableCell className="font-medium">
                      <Button
                        variant="link"
                        className="px-0"
                        onClick={() => {
                          setSelectedBusinessId(biz.id);
                          setSearchParams({ business_id: biz.id });
                          fetchBusinessDetail(biz.id);
                          fetchBusinessPayments(biz.id);
                        }}
                      >
                        {biz.name}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          biz.status === "active"
                            ? "border-emerald-400 text-emerald-600"
                            : biz.status === "pending"
                            ? "border-amber-400 text-amber-600"
                            : "border-red-400 text-red-600"
                        }
                      >
                        {biz.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{biz.verified ? "Yes" : "No"}</TableCell>
                    <TableCell>{biz.paybill_number || "-"}</TableCell>
                    <TableCell>{biz.till_number || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <div>
                Page {businessPage} of{" "}
                {Math.max(
                  1,
                  Math.ceil(
                    businesses.filter((biz) => biz.name.toLowerCase().includes(businessFilter.toLowerCase())).length /
                      pageSize
                  )
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setBusinessPage((p) => Math.max(1, p - 1))}
                  disabled={businessPage === 1}
                >
                  Prev
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setBusinessPage((p) => p + 1)}
                  disabled={
                    businessPage >=
                    Math.ceil(
                      businesses.filter((biz) => biz.name.toLowerCase().includes(businessFilter.toLowerCase())).length /
                        pageSize
                    )
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedBusiness && (
          <Card>
            <CardHeader>
              <CardTitle>Business Detail</CardTitle>
              <CardDescription>{selectedBusiness.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-sm text-muted-foreground">
                <Link to="/console" className="hover:text-foreground" onClick={() => setSearchParams({})}>
                  Businesses
                </Link>{" "}
                / <span className="text-foreground">{selectedBusiness.name}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="font-medium">{selectedBusiness.status}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Verified</div>
                  <div className="font-medium">{selectedBusiness.verified ? "Yes" : "No"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">PayBill / Till</div>
                  <div className="font-medium">
                    {selectedBusiness.paybill_number || "-"} / {selectedBusiness.till_number || "-"}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-2">Settlement Accounts</div>
                {selectedBusiness.settlement_accounts?.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Bank</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>M-Pesa</TableHead>
                        <TableHead>Default</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedBusiness.settlement_accounts.map((acc) => (
                        <TableRow key={acc.id}>
                          <TableCell>{acc.account_type}</TableCell>
                          <TableCell>{acc.bank_name || "-"}</TableCell>
                          <TableCell>{acc.account_number_masked || "-"}</TableCell>
                          <TableCell>{acc.mpesa_phone || "-"}</TableCell>
                          <TableCell>{acc.is_default ? "Yes" : "No"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-sm text-muted-foreground">No settlement accounts yet.</div>
                )}
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-2">Recent Payments</div>
                {businessPayments.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reference</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payer</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {businessPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{payment.payrail_reference}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{payment.status}</Badge>
                          </TableCell>
                          <TableCell>
                            {payment.amount} {payment.currency}
                          </TableCell>
                          <TableCell>{payment.payer?.phone || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-sm text-muted-foreground">No payments yet.</div>
                )}
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <div className="text-sm text-muted-foreground">Charge Tester</div>
                <div className="text-sm text-muted-foreground">
                  Trigger a live STK push for this business. Make sure the business is verified first.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="grid gap-2">
                    <Label>Amount (KES)</Label>
                    <Input value={chargeAmount} onChange={(e) => setChargeAmount(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Payer Phone</Label>
                    <Input value={chargePhone} onChange={(e) => setChargePhone(e.target.value)} placeholder="2547XXXXXXX" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Payer Name</Label>
                    <Input value={chargeName} onChange={(e) => setChargeName(e.target.value)} placeholder="John Doe" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Payer Email (IntaSend)</Label>
                    <Input value={chargeEmail} onChange={(e) => setChargeEmail(e.target.value)} placeholder="john@domain.com" />
                  </div>
                  <div className="grid gap-2 md:col-span-2">
                    <Label>Reference</Label>
                    <Input value={chargeReference} onChange={(e) => setChargeReference(e.target.value)} placeholder="Flat 4B" />
                  </div>
                  <div className="md:col-span-4">
                    <Button onClick={chargeCustomer} disabled={!chargePhone || loading}>
                      {loading ? "Sending..." : "Charge Customer"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Webhooks</CardTitle>
            <CardDescription>Create endpoints and view deliveries.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="grid gap-2 md:col-span-2">
                <Label>Webhook URL</Label>
                <Input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://your.app/webhooks/payrail" />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label>Events (comma separated)</Label>
                <Input value={webhookEvents} onChange={(e) => setWebhookEvents(e.target.value)} placeholder="payment.success,payment.failed" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={createWebhook} disabled={!webhookUrl || loading}>
                Create Webhook
              </Button>
              <Button variant="secondary" onClick={loadWebhookDeliveries} disabled={!apiKey || loading}>
                Load Deliveries
              </Button>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Recent Deliveries</div>
              {webhookDeliveries.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Attempts</TableHead>
                      <TableHead>Delivered At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {webhookDeliveries.map((delivery) => (
                      <TableRow key={delivery.id}>
                        <TableCell>{delivery.event}</TableCell>
                        <TableCell>{delivery.success ? "Success" : "Failed"}</TableCell>
                        <TableCell>{delivery.attempts ?? "-"}</TableCell>
                        <TableCell>{delivery.delivered_at || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-sm text-muted-foreground">No deliveries yet.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ConsoleLayout>
  );
};
