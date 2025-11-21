import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Settings, 
  Plus, 
  Edit, 
  Trash2,
  Camera,
  CreditCard,
  ClipboardList,
  Building2,
  UserCheck,
  MessageCircle,
  BarChart3,
  LogOut,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const StaffDashboard = () => {
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock data
  const projects = [
    { id: 1, name: "Modern Residence", code: "RES-2024-001", client: "John Smith", progress: 65, status: "active" },
    { id: 2, name: "Luxury Villa", code: "VILLA-2024-002", client: "Sarah Johnson", progress: 35, status: "active" },
    { id: 3, name: "Commercial Complex", code: "COMM-2024-001", client: "Mike Davis", progress: 15, status: "planning" },
  ];

  const staffMembers = [
    { id: 1, name: "Rajesh Kumar", email: "rajesh@butwalconstruction.com", role: "manager", projects: ["RES-2024-001", "VILLA-2024-002"] },
    { id: 2, name: "Anita Sharma", email: "anita@butwalconstruction.com", role: "staff", projects: ["RES-2024-001"] },
    { id: 3, name: "Suresh Patel", email: "suresh@butwalconstruction.com", role: "staff", projects: ["VILLA-2024-002"] },
  ];

  const pendingUpdates = [
    { project: "RES-2024-001", client: "John Smith", lastUpdate: "2024-03-19", overdue: false },
    { project: "VILLA-2024-002", client: "Sarah Johnson", lastUpdate: "2024-03-18", overdue: true },
  ];

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const name = localStorage.getItem("userName");
    
    if (!role || !name) {
      navigate("/login");
      return;
    }
    
    setUserRole(role);
    setUserName(name);
  }, [navigate]);

  // Check if user has permission to see a feature
  const canSee = (feature: string) => {
    switch (feature) {
      case "user_management":
        return userRole === "admin";
      case "project_management":
        return userRole === "admin" || userRole === "manager";
      case "daily_updates":
        return userRole === "admin" || userRole === "manager" || userRole === "staff";
      case "settings":
        return userRole === "admin";
      case "financial":
        return userRole === "admin" || userRole === "manager";
      default:
        return false;
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleAddUpdate = () => {
    toast({
      title: "Daily Update",
      description: "Ready to add today's progress update",
    });
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "bg-red-100 text-red-800",
      manager: "bg-blue-100 text-blue-800",
      staff: "bg-green-100 text-green-800"
    };
    return variants[role as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  if (!userRole) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Staff Dashboard</h1>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-muted-foreground">
                Welcome back, {userName}
              </p>
              <Badge className={getRoleBadge(userRole)}>
                {userRole.toUpperCase()}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {canSee("daily_updates") && (
              <Button onClick={handleAddUpdate}>
                <Plus className="h-4 w-4 mr-2" />
                Add Daily Update
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {canSee("project_management") && (
              <TabsTrigger value="projects">Projects</TabsTrigger>
            )}
            {canSee("user_management") && (
              <TabsTrigger value="users">Team</TabsTrigger>
            )}
            {canSee("financial") && (
              <TabsTrigger value="financial">Financial</TabsTrigger>
            )}
            {canSee("settings") && (
              <TabsTrigger value="settings">Settings</TabsTrigger>
            )}
          </TabsList>

          {/* Overview Tab - Visible to all staff */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Project Stats */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects.filter(p => p.status === 'active').length}</div>
                  <p className="text-xs text-muted-foreground">
                    In construction phase
                  </p>
                </CardContent>
              </Card>

              {/* Daily Updates */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Updates</CardTitle>
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingUpdates.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Due today
                  </p>
                </CardContent>
              </Card>

              {/* Team Members */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{staffMembers.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Active staff
                  </p>
                </CardContent>
              </Card>

              {/* Client Messages */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Messages</CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    Unread client messages
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Pending Updates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Based on your role: {userRole}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {canSee("daily_updates") && (
                      <Button className="w-full justify-start" variant="outline">
                        <ClipboardList className="h-4 w-4 mr-2" />
                        Submit Daily Progress
                      </Button>
                    )}
                    {canSee("project_management") && (
                      <Button className="w-full justify-start" variant="outline">
                        <Building2 className="h-4 w-4 mr-2" />
                        Manage Project Timeline
                      </Button>
                    )}
                    {canSee("financial") && (
                      <Button className="w-full justify-start" variant="outline">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Update Payment Status
                      </Button>
                    )}
                    {canSee("user_management") && (
                      <Button className="w-full justify-start" variant="outline">
                        <UserCheck className="h-4 w-4 mr-2" />
                        Add Team Member
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Updates</CardTitle>
                  <CardDescription>
                    Projects needing daily updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingUpdates.map((update, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{update.project}</div>
                          <div className="text-sm text-muted-foreground">{update.client}</div>
                        </div>
                        <Badge variant={update.overdue ? "destructive" : "outline"}>
                          {update.overdue ? "Overdue" : "Due Today"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates across all projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.slice(0, 2).map((project) => (
                    <div key={project.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <div>
                          <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Progress: {project.progress}% • {project.client}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{project.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab - Only for Admin and Manager */}
          {canSee("project_management") && (
            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Project Management</CardTitle>
                      <CardDescription>
                        Manage construction projects and assignments
                      </CardDescription>
                    </div>
                    {userRole === "admin" && (
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Project
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Building2 className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <div className="font-semibold">{project.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {project.code} • {project.client}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary rounded-full" 
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-muted-foreground">{project.progress}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={project.status === 'active' ? 'default' : 'outline'}>
                            {project.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {userRole === "admin" && (
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* User Management Tab - Only for Admin */}
          {canSee("user_management") && (
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Team Management</CardTitle>
                      <CardDescription>
                        Manage staff roles and permissions
                      </CardDescription>
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Staff
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {staffMembers.map((staff) => (
                      <div key={staff.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <UserCheck className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-semibold">{staff.name}</div>
                            <div className="text-sm text-muted-foreground">{staff.email}</div>
                            <div className="text-xs text-muted-foreground">
                              Projects: {staff.projects.join(', ')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getRoleBadge(staff.role)}>
                            {staff.role}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Financial Tab - Only for Admin and Manager */}
          {canSee("financial") && (
            <TabsContent value="financial">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Overview</CardTitle>
                  <CardDescription>
                    Project finances and payment tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-green-600">₹25.4L</div>
                          <div className="text-sm text-muted-foreground">Total Received</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-orange-600">₹18.6L</div>
                          <div className="text-sm text-muted-foreground">Pending Payments</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold">₹44L</div>
                          <div className="text-sm text-muted-foreground">Total Project Value</div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-semibold">Recent Payments</h3>
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">RES-2024-001 - Instalment {item}</div>
                            <div className="text-sm text-muted-foreground">John Smith • 2024-03-{20 + item}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">₹{(5 + item).toFixed(1)}L</div>
                            <Badge variant="default">Paid</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Settings Tab - Only for Admin */}
          {canSee("settings") && (
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>
                    Configure system-wide settings and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Role Permissions</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">Manager Role</div>
                            <div className="text-sm text-muted-foreground">Can manage projects and daily updates</div>
                          </div>
                          <Button variant="outline" size="sm">Edit Permissions</Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">Staff Role</div>
                            <div className="text-sm text-muted-foreground">Can submit daily updates only</div>
                          </div>
                          <Button variant="outline" size="sm">Edit Permissions</Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">System Configuration</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Site Camera Access</label>
                          <div className="flex items-center gap-2 mt-2">
                            <Button variant="outline" size="sm">Configure Cameras</Button>
                            <Button variant="outline" size="sm">Test Feeds</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default StaffDashboard;