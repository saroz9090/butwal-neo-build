import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Lock, ArrowLeft, Building2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("customer");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Define account types for type safety
  interface CustomerAccount {
    email: string;
    password: string;
    name: string;
    role: "customer";
    project: string;
  }

  interface StaffAccount {
    email: string;
    password: string;
    name: string;
    role: "admin" | "manager" | "staff";
    permissions?: string[];
    assignedProjects?: string[];
  }

  // Predefined accounts with roles and permissions
  const accounts: { customer: CustomerAccount[]; staff: StaffAccount[] } = {
    customer: [
      { 
        email: "customer1@butwalconstruction.com", 
        password: "customer111", 
        name: "Shyam Sharma", 
        role: "customer",
        project: "Residence-2024-001"
      },
      { 
        email: "customer2@butwalconstruction.com", 
        password: "customer222", 
        name: "Riya Sharma", 
        role: "customer",
        project: "Villa-2024-002"
      },
    ],
    staff: [
      { 
        email: "admin@butwalconstruction.com", 
        password: "admin123", 
        name: "Main Administrator", 
        role: "admin",
        permissions: ["all"],
        assignedProjects: []
      },
      { 
        email: "manager@butwalconstruction.com", 
        password: "manager123", 
        name: "Project Manager", 
        role: "manager",
        permissions: ["view_projects", "manage_timeline", "view_reports"],
        assignedProjects: ["Residence-2024-001", "Villa-2024-002"]
      },
      { 
        email: "staff@butwalconstruction.com", 
        password: "staff123", 
        name: "Site Staff", 
        role: "staff",
        permissions: ["view_assigned", "update_progress"],
        assignedProjects: ["Residence-2024-001"]
      },
    ]
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if credentials match based on active tab
    const userAccounts = accounts[activeTab as keyof typeof accounts];
    const user = userAccounts.find(
      account => account.email === email && account.password === password
    );

    if (user) {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
        variant: "default",
      });
      
      // Store login state with user data
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userRole", user.role);
      
      // Store additional user data based on role
      if (activeTab === "customer") {
        const customerUser = user as CustomerAccount;
        localStorage.setItem("userProject", customerUser.project);
      } else {
        const staffUser = user as StaffAccount;
        if (staffUser.assignedProjects) {
          localStorage.setItem("assignedProjects", JSON.stringify(staffUser.assignedProjects));
        }
        if (staffUser.permissions) {
          localStorage.setItem("userPermissions", JSON.stringify(staffUser.permissions));
        }
      }
      
      // Redirect based on role
      if (user.role === "customer") {
        navigate("/customer/dashboard");
      } else {
        navigate("/staff/dashboard"); // All staff go to same dashboard
      }
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const demoAccounts = {
    customer: [
      { email: "customer1@butwalconstruction.com", password: "customer111", role: "Customer" },
      { email: "customer2@butwalconstruction.com", password: "customer222", role: "Customer" },
    ],
    staff: [
      { email: "admin@butwalconstruction.com", password: "admin123", role: "Administrator" },
      { email: "manager@butwalconstruction.com", password: "manager123", role: "Project Manager" },
      { email: "staff@butwalconstruction.com", password: "staff123", role: "Site Staff" },
    ]
  };

  const fillDemoAccount = (demo: { email: string; password: string }) => {
    setEmail(demo.email);
    setPassword(demo.password);
  };

  const clearForm = () => {
    setEmail("");
    setPassword("");
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "customer":
        return "Access your project dashboard with live updates, camera views, and payment tracking";
      case "staff":
        return "Staff panel with role-based access to project management tools";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Login Card */}
        <Card className="glass border-0">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-primary/10">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Butwal Construction</CardTitle>
              <CardDescription className="text-lg mt-2">
                Project Management Portal
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
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

                {/* Demo Accounts Info */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-2 text-center">Demo Client Accounts</h4>
                  <div className="space-y-2">
                    {demoAccounts.customer.map((account, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <div>
                          <span className="font-medium">{account.role}:</span>
                          <span className="text-muted-foreground ml-2">{account.email}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => fillDemoAccount(account)}
                        >
                          Use
                        </Button>
                      </div>
                    ))}
                  </div>
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

                {/* Demo Accounts Info 
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-2 text-center">Demo Staff Accounts</h4>
                  <div className="space-y-2">
                    {demoAccounts.staff.map((account, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <div>
                          <span className="font-medium">{account.role}:</span>
                          <span className="text-muted-foreground ml-2">{account.email}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => fillDemoAccount(account)}
                        >
                          Use
                        </Button>
                      </div>
                    ))}
                  </div>
                </div> */}

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