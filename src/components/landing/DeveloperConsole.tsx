import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const pretty = (value: unknown) => JSON.stringify(value, null, 2);

export const DeveloperConsole = () => {
  const { toast } = useToast();
  const [ownerEmail, setOwnerEmail] = useState("dev@commerce.io");
  const [appName, setAppName] = useState("Demo Commerce");
  const [appId, setAppId] = useState("");
  const [apiKey, setApiKey] = useState("");

  const [businessName, setBusinessName] = useState("Greenview Apartments");
  const [businessId, setBusinessId] = useState("");
  const [paybillNumber, setPaybillNumber] = useState("123456");
  const [tillNumber, setTillNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [bankName, setBankName] = useState("Equity");
  const [accountMasked, setAccountMasked] = useState("****2341");
  const [mpesaPhone, setMpesaPhone] = useState("2547XXXXXXX");

  const [webhookUrl, setWebhookUrl] = useState("https://your.app/webhooks/payrail");
  const [webhookEvents, setWebhookEvents] = useState("payment.success");

  const [amount, setAmount] = useState("5000");
  const [currency, setCurrency] = useState("KES");
  const [payerPhone, setPayerPhone] = useState("2547XXXXXXX");
  const [payerName, setPayerName] = useState("John Doe");
  const [reference, setReference] = useState("Flat 4B");
  const [transactionId, setTransactionId] = useState("");

  const [appResponse, setAppResponse] = useState<string>("");
  const [businessResponse, setBusinessResponse] = useState<string>("");
  const [verificationResponse, setVerificationResponse] = useState<string>("");
  const [confirmResponse, setConfirmResponse] = useState<string>("");
  const [settlementResponse, setSettlementResponse] = useState<string>("");
  const [webhookResponse, setWebhookResponse] = useState<string>("");
  const [chargeResponse, setChargeResponse] = useState<string>("");
  const [statusResponse, setStatusResponse] = useState<string>("");
  const [deliveriesResponse, setDeliveriesResponse] = useState<string>("");

  const createApp = async () => {
    const result = await apiRequest<any>("/v1/apps", {
      method: "POST",
      body: JSON.stringify({ name: appName, owner_email: ownerEmail }),
    });
    if (!result.ok) {
      toast({ title: "Create app failed", description: result.error });
      setAppResponse(pretty(result));
      return;
    }
    setAppResponse(pretty(result.data));
    if (result.data?.id) setAppId(result.data.id);
    if (result.data?.api_key) setApiKey(result.data.api_key);
  };

  const onboardBusiness = async () => {
    if (!apiKey) {
      toast({ title: "Missing API key", description: "Create an app first." });
      return;
    }
    const result = await apiRequest<any>(
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
    if (!result.ok) {
      toast({ title: "Onboarding failed", description: result.error });
    }
    setBusinessResponse(pretty(result));
    if (result.data?.id) setBusinessId(result.data.id);
  };

  const requestVerification = async () => {
    if (!apiKey || !businessId) {
      toast({ title: "Missing business", description: "Onboard a business first." });
      return;
    }
    const result = await apiRequest<any>(
      "/v1/verification/request",
      {
        method: "POST",
        body: JSON.stringify({
          business_id: businessId,
          paybill_number: paybillNumber,
          till_number: tillNumber,
          amount: 1,
        }),
      },
      apiKey
    );
    if (!result.ok) {
      toast({ title: "Verification failed", description: result.error });
    }
    setVerificationResponse(pretty(result));
    if (result.data?.code) setVerificationCode(result.data.code);
  };

  const confirmVerification = async () => {
    if (!verificationCode) {
      toast({ title: "Missing code", description: "Request verification first." });
      return;
    }
    const result = await apiRequest<any>(
      "/v1/verification/confirm",
      {
        method: "POST",
        body: JSON.stringify({ verification_code: verificationCode }),
      }
    );
    if (!result.ok) {
      toast({ title: "Confirm failed", description: result.error });
    }
    setConfirmResponse(pretty(result));
  };

  const addSettlement = async () => {
    if (!businessId || !apiKey) {
      toast({ title: "Missing business", description: "Onboard a business first." });
      return;
    }
    const result = await apiRequest<any>(
      `/v1/businesses/${businessId}/settlement`,
      {
        method: "POST",
        body: JSON.stringify({
          account_type: "bank",
          bank_name: bankName,
          account_number_masked: accountMasked,
          mpesa_phone: mpesaPhone,
        }),
      },
      apiKey
    );
    if (!result.ok) {
      toast({ title: "Settlement failed", description: result.error });
    }
    setSettlementResponse(pretty(result));
  };

  const createWebhook = async () => {
    if (!apiKey) {
      toast({ title: "Missing API key", description: "Create an app first." });
      return;
    }
    const result = await apiRequest<any>(
      "/v1/webhooks/endpoints",
      {
        method: "POST",
        body: JSON.stringify({
          url: webhookUrl,
          events: webhookEvents.split(",").map((e) => e.trim()).filter(Boolean),
        }),
      },
      apiKey
    );
    if (!result.ok) {
      toast({ title: "Webhook failed", description: result.error });
    }
    setWebhookResponse(pretty(result));
  };

  const chargePayment = async () => {
    if (!apiKey || !businessId) {
      toast({ title: "Missing credentials", description: "Onboard a business first." });
      return;
    }
    const result = await apiRequest<any>(
      "/v1/payments/charge",
      {
        method: "POST",
        body: JSON.stringify({
          amount: Number(amount),
          currency,
          payer_phone: payerPhone,
          payer_name: payerName,
          business_id: businessId,
          reference,
        }),
      },
      apiKey
    );
    if (!result.ok) {
      toast({ title: "Charge failed", description: result.error });
    }
    setChargeResponse(pretty(result));
    if (result.data?.id) setTransactionId(result.data.id);
  };

  const fetchStatus = async () => {
    if (!apiKey || !transactionId) {
      toast({ title: "Missing transaction", description: "Charge a payment first." });
      return;
    }
    const result = await apiRequest<any>(`/v1/payments/${transactionId}`, {}, apiKey);
    if (!result.ok) {
      toast({ title: "Status failed", description: result.error });
    }
    setStatusResponse(pretty(result));
  };

  const fetchDeliveries = async () => {
    if (!apiKey) {
      toast({ title: "Missing API key", description: "Create an app first." });
      return;
    }
    const result = await apiRequest<any>(`/v1/webhooks/deliveries`, {}, apiKey);
    if (!result.ok) {
      toast({ title: "Deliveries failed", description: result.error });
    }
    setDeliveriesResponse(pretty(result));
  };

  return (
    <section id="developer" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="info" className="mb-4">Developer Sandbox</Badge>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Test PayRail in Minutes
          </h2>
          <p className="text-lg text-muted-foreground">
            Create a developer app, onboard a business, verify PayBill/Till, and charge a payment.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>1. Create Developer App</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Owner Email</Label>
                <Input value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>App Name</Label>
                <Input value={appName} onChange={(e) => setAppName(e.target.value)} />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={createApp}>Create App</Button>
                <Input placeholder="app_id" value={appId} onChange={(e) => setAppId(e.target.value)} />
                <Input placeholder="api_key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
              </div>
              <Textarea rows={8} value={appResponse} readOnly placeholder="Response..." />
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>2. Onboard Business</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Business Name</Label>
                <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>PayBill Number</Label>
                  <Input value={paybillNumber} onChange={(e) => setPaybillNumber(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Till Number</Label>
                  <Input value={tillNumber} onChange={(e) => setTillNumber(e.target.value)} />
                </div>
              </div>
              <Button onClick={onboardBusiness}>Onboard Business</Button>
              <Textarea rows={8} value={businessResponse} readOnly placeholder="Response..." />
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>3. Verify PayBill/Till</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={requestVerification}>Request Verification Code</Button>
              <Input placeholder="verification code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
              <Button variant="secondary" onClick={confirmVerification}>Simulate Payment Confirmation</Button>
              <Textarea rows={6} value={verificationResponse} readOnly placeholder="Verification request..." />
              <Textarea rows={6} value={confirmResponse} readOnly placeholder="Confirmation..." />
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>4. Settlement Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <Input value={bankName} onChange={(e) => setBankName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Account (Masked)</Label>
                  <Input value={accountMasked} onChange={(e) => setAccountMasked(e.target.value)} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>M-Pesa Phone (optional)</Label>
                  <Input value={mpesaPhone} onChange={(e) => setMpesaPhone(e.target.value)} />
                </div>
              </div>
              <Button onClick={addSettlement}>Add Settlement</Button>
              <Textarea rows={8} value={settlementResponse} readOnly placeholder="Response..." />
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>5. Webhook Endpoint</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <Input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Events (comma-separated)</Label>
                <Input value={webhookEvents} onChange={(e) => setWebhookEvents(e.target.value)} />
              </div>
              <Button onClick={createWebhook}>Create Webhook</Button>
              <Textarea rows={8} value={webhookResponse} readOnly placeholder="Response..." />
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>6. Charge Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Input value={currency} onChange={(e) => setCurrency(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Payer Phone</Label>
                  <Input value={payerPhone} onChange={(e) => setPayerPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Payer Name</Label>
                  <Input value={payerName} onChange={(e) => setPayerName(e.target.value)} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Reference</Label>
                  <Input value={reference} onChange={(e) => setReference(e.target.value)} />
                </div>
              </div>
              <Button onClick={chargePayment}>Charge Payment</Button>
              <Textarea rows={8} value={chargeResponse} readOnly placeholder="Response..." />
            </CardContent>
          </Card>

          <Card className="shadow-soft lg:col-span-2">
            <CardHeader>
              <CardTitle>7. Fetch Payment Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input placeholder="transaction_id" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
                <Button onClick={fetchStatus}>Fetch Status</Button>
              </div>
              <Textarea rows={8} value={statusResponse} readOnly placeholder="Response..." />
            </CardContent>
          </Card>

          <Card className="shadow-soft lg:col-span-2">
            <CardHeader>
              <CardTitle>8. Webhook Deliveries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={fetchDeliveries}>Fetch Deliveries</Button>
              </div>
              <Textarea rows={8} value={deliveriesResponse} readOnly placeholder="Response..." />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
