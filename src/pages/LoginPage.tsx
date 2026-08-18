import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Lock, ArrowLeft, Building2, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("customer");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, user, role, loading: authLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user && role) {
      if (role === 'customer') {
        navigate("/customer/dashboard");
      } else {
        navigate("/staff/dashboard");
      }
    }
  }, [user, role, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      console.error("Login error:", signInError);
      setError(signInError.message || "Invalid email or password");
      toast({
        title: "Login Failed",
        description: signInError.message || "Invalid email or password",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      // Navigation will happen via useEffect when user/role updates
    }
    
    setIsLoading(false);
  };

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setError("");
  };

  const getRoleDescription = (roleType: string) => {
    switch (roleType) {
      case "customer":
        return "Access your project dashboard with live updates, camera views, and payment tracking";
      case "staff":
        return "Staff panel with role-based access to project management tools";
      default:
        return "";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Login Card */}
        <Card className="glass border border-primary/30 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-purple-500/10 p-2 text-center text-xs font-semibold text-primary border-b border-primary/20 flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Website Admin & Management Portal
          </div>
          <CardHeader className="text-center space-y-3 pt-6">
            <div className="flex justify-center">
              <div className="p-3.5 rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <Building2 className="h-8 w-8" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-black text-foreground">
                Butwal Construction
              </CardTitle>
              <CardDescription className="text-sm font-medium text-muted-foreground mt-1">
                Website Admin & Client Management Dashboard
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Other Portals Shortcut Box */}
            <div className="bg-muted/40 p-3 rounded-xl border border-border text-xs space-y-2">
              <p className="font-semibold text-foreground text-center">Looking for another system?</p>
              <div className="grid grid-cols-2 gap-2">
                <a 
                  href="https://employee.butwalconstruction.com.np" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-background hover:bg-primary/10 border border-border text-center font-medium text-foreground transition-colors block"
                >
                  Employee Portal ↗
                </a>
                <a 
                  href="https://accounts.butwalconstruction.com.np" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-background hover:bg-emerald-500/10 border border-border text-center font-medium text-foreground transition-colors block"
                >
                  ERP Accounts ↗
                </a>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Login Type Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customer" onClick={clearForm}>
                  <Users className="h-4 w-4 mr-2" />
                  Client
                </TabsTrigger>
                <TabsTrigger value="staff" onClick={clearForm}>
                  <User className="h-4 w-4 mr-2" />
                  Staff
                </TabsTrigger>
              </TabsList>

              {/* Customer Login */}
              <TabsContent value="customer" className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {getRoleDescription("customer")}
                  </p>
                </div>

                {/* Info Box */}
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Client accounts are created by administrators. Contact us if you need access.
                  </p>
                </div>

                <LoginForm
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  isLoading={isLoading}
                  onSubmit={handleLogin}
                  userType="customer"
                />
              </TabsContent>

              {/* Staff Login */}
              <TabsContent value="staff" className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {getRoleDescription("staff")}
                  </p>
                </div>

                {/* Info Box */}
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Staff accounts are managed by administrators only.
                  </p>
                </div>

                <LoginForm
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  isLoading={isLoading}
                  onSubmit={handleLogin}
                  userType="staff"
                />
              </TabsContent>
            </Tabs>

            {/* Contact Information */}
            <div className="text-center text-sm text-muted-foreground border-t pt-4">
              <p>Need help? Contact administration</p>
              <p className="font-medium">support@butwalconstruction.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Reusable Login Form Component
interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  userType: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  isLoading,
  onSubmit,
  userType,
}) => {
  const getPlaceholderEmail = () => {
    switch (userType) {
      case "customer":
        return "client@butwalconstruction.com";
      case "staff":
        return "staff@butwalconstruction.com";
      default:
        return "your@email.com";
    }
  };

  const getButtonText = () => {
    switch (userType) {
      case "customer":
        return "Sign In as Client";
      case "staff":
        return "Sign In as Staff";
      default:
        return "Sign In";
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email Address
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="email"
            type="email"
            placeholder={getPlaceholderEmail()}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full gradient-primary"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Signing in...
          </>
        ) : (
          getButtonText()
        )}
      </Button>
    </form>
  );
};

export default LoginPage;
