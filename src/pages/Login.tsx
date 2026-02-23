import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest, API_BASE } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const login = async () => {
    const result = await apiRequest<any>("/dj-rest-auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (!result.ok) {
      toast({ title: "Login failed", description: result.error });
      return;
    }
    toast({ title: "Logged in", description: "Session created." });
  };

  const register = async () => {
    const result = await apiRequest<any>("/dj-rest-auth/registration/", {
      method: "POST",
      body: JSON.stringify({ email, password1: password, password2: password, full_name: fullName }),
    });
    if (!result.ok) {
      toast({ title: "Registration failed", description: result.error });
      return;
    }
    toast({ title: "Account created", description: "You can now log in." });
  };

  const googleUrl = `${API_BASE}/accounts/google/login/`;
  const githubUrl = `${API_BASE}/accounts/github/login/`;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-lg shadow-strong">
        <CardHeader>
          <CardTitle className="text-2xl font-display">PayRail Developer Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-3">
            <Button variant="outline" onClick={() => (window.location.href = googleUrl)}>
              Continue with Google
            </Button>
            <Button variant="outline" onClick={() => (window.location.href = githubUrl)}>
              Continue with GitHub
            </Button>
          </div>

          <div className="text-sm text-muted-foreground text-center">or</div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Full Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@company.com" />
            </div>
            <div className="grid gap-2">
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={login} className="flex-1">Log In</Button>
              <Button variant="secondary" onClick={register} className="flex-1">Create Account</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
