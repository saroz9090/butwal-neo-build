import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import WebsiteCMSManager from "@/components/WebsiteCMSManager";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, role, isTopAdmin, signOut, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }
    
    // Only allow staff roles
    if (!authLoading && user && role === 'customer') {
      navigate("/customer/dashboard");
    }
  }, [user, role, authLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const getRoleBadge = (roleType: string) => {
    const variants = {
      admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      manager: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      site_staff: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      office_staff: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      staff: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    };
    return variants[roleType as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const userName = profile?.full_name || user.email || 'Staff';

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-muted-foreground">
                Welcome back, {userName}
              </p>
              <Badge className={getRoleBadge(role || '')}>
                {(role || '').replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {isTopAdmin && (
              <Button onClick={() => navigate("/admin/users")} className="gradient-primary flex items-center gap-2">
                <Users className="h-4 w-4" /> Manage Users
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* CMS Manager handles Blog, Projects, and Designs */}
        <WebsiteCMSManager />
      </div>
    </div>
  );
};

export default StaffDashboard;
