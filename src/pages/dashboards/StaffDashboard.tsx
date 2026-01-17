import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  EyeOff,
  UserPlus,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useProjects, useInstalments, useTasks, useDailyUpdates, useDeleteProject, useUpdateProject } from "@/hooks/useProjectData";
import AddDailyUpdate from "@/components/AddDailyUpdate";
import AddProjectDialog from "@/components/AddProjectDialog";
import AddInstalmentDialog from "@/components/AddInstalmentDialog";
import AddTaskDialog from "@/components/AddTaskDialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isAddUpdateOpen, setIsAddUpdateOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isAddInstalmentOpen, setIsAddInstalmentOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, role, signOut, loading: authLoading, isAdmin, isManager, isStaff } = useAuth();

  // Real data from database
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: instalments = [], isLoading: instalmentsLoading } = useInstalments();
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: dailyUpdates = [], isLoading: updatesLoading } = useDailyUpdates();
  const deleteProject = useDeleteProject();
  const updateProject = useUpdateProject();

  // Fetch staff members
  const { data: staffMembers = [] } = useQuery({
    queryKey: ['staff_members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          full_name,
          phone
        `)
        .order('full_name');
      if (error) throw error;
      
      // Get roles for each user
      const userIds = data.map(p => p.user_id);
      const { data: roles } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);
      
      const rolesMap = new Map(roles?.map(r => [r.user_id, r.role]) || []);
      
      return data.map(p => ({
        id: p.id,
        user_id: p.user_id,
        full_name: p.full_name,
        phone: p.phone,
        role: rolesMap.get(p.user_id) || 'customer'
      })).filter(p => p.role !== 'customer');
    },
  });

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

  // Calculate stats from real data
  const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'in_progress');
  const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress');
  const todayUpdates = dailyUpdates.filter(u => {
    const today = new Date().toDateString();
    return new Date(u.created_at).toDateString() === today;
  });
  
  // Calculate financial stats
  const totalReceived = instalments.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const pendingPayments = instalments.filter(i => i.status === 'pending' || i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);
  const totalProjectValue = projects.reduce((sum, p) => sum + (p.total_cost || 0), 0);

  // Check if user has permission to see a feature
  const canSee = (feature: string) => {
    switch (feature) {
      case "user_management":
        return isAdmin;
      case "project_management":
        return isAdmin || isManager;
      case "daily_updates":
        return isAdmin || isManager || isStaff;
      case "settings":
        return isAdmin;
      case "financial":
        return isAdmin || isManager;
      default:
        return false;
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const handleAddUpdate = () => {
    setIsAddUpdateOpen(true);
  };

  const handleUpdateSuccess = () => {
    toast({
      title: "Success",
      description: "Daily update posted successfully!",
    });
  };

  const handleDeleteProject = async (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await deleteProject.mutateAsync(projectId);
    }
  };

  const handleAddInstalment = (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsAddInstalmentOpen(true);
  };

  const handleAddTask = (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsAddTaskOpen(true);
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

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
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
            <h1 className="text-3xl font-bold">Staff Dashboard</h1>
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
            {isAdmin && (
              <Button asChild variant="outline">
                <Link to="/admin/users">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Manage Users
                </Link>
              </Button>
            )}
            {canSee("project_management") && (
              <Button variant="outline" onClick={() => setIsAddProjectOpen(true)}>
                <Building2 className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            )}
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
                  <div className="text-2xl font-bold">
                    {projectsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : activeProjects.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {projects.length} total projects
                  </p>
                </CardContent>
              </Card>

              {/* Pending Tasks */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {tasksLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : pendingTasks.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {tasks.length} total tasks
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

              {/* Today's Updates */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Updates</CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {updatesLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : todayUpdates.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dailyUpdates.length} total updates
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Recent Updates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Based on your role: {(role || '').replace('_', ' ')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {canSee("daily_updates") && (
                      <Button className="w-full justify-start" variant="outline" onClick={handleAddUpdate}>
                        <ClipboardList className="h-4 w-4 mr-2" />
                        Submit Daily Progress
                      </Button>
                    )}
                    {canSee("project_management") && (
                      <Button className="w-full justify-start" variant="outline" onClick={() => setIsAddProjectOpen(true)}>
                        <Building2 className="h-4 w-4 mr-2" />
                        Create New Project
                      </Button>
                    )}
                    {canSee("financial") && (
                      <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("financial")}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        View Payment Status
                      </Button>
                    )}
                    {canSee("user_management") && (
                      <Button asChild className="w-full justify-start" variant="outline">
                        <Link to="/admin/users">
                          <UserCheck className="h-4 w-4 mr-2" />
                          Manage Users
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Updates</CardTitle>
                  <CardDescription>
                    Latest project updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {updatesLoading ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : dailyUpdates.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No updates yet</p>
                    ) : (
                      dailyUpdates.slice(0, 5).map((update) => {
                        const project = projects.find(p => p.id === update.project_id);
                        return (
                          <div key={update.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium text-sm">{update.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {project?.name || 'Unknown Project'} • {new Date(update.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            <Badge variant="outline">
                              {new Date(update.created_at).toDateString() === new Date().toDateString() ? 'Today' : 'Past'}
                            </Badge>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Project Progress</CardTitle>
                <CardDescription>
                  Overview of all projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                {projectsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : projects.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No projects yet. Create your first project!</p>
                ) : (
                  <div className="space-y-4">
                    {projects.slice(0, 5).map((project) => (
                      <div key={project.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${project.status === 'active' || project.status === 'in_progress' ? 'bg-green-500' : project.status === 'completed' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                          <div>
                            <div className="font-medium">{project.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {project.code} • Progress: {project.progress}%
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <Badge variant="outline">{project.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                    <Button onClick={() => setIsAddProjectOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {projectsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : projects.length === 0 ? (
                    <div className="text-center py-8">
                      <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No projects yet. Create your first project!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                            <div>
                              <div className="font-semibold">{project.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {project.code} • {formatCurrency(project.total_cost || 0)}
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
                            <Badge variant={project.status === 'active' || project.status === 'in_progress' ? 'default' : 'outline'}>
                              {project.status}
                            </Badge>
                            <Button variant="outline" size="sm" onClick={() => handleAddInstalment(project.id)}>
                              <CreditCard className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleAddTask(project.id)}>
                              <ClipboardList className="h-4 w-4" />
                            </Button>
                            {isAdmin && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDeleteProject(project.id)}
                                disabled={deleteProject.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                    <Button asChild>
                      <Link to="/admin/users">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Staff
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {staffMembers.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No staff members yet. Add users from Admin panel.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {staffMembers.map((staff) => (
                        <div key={staff.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                              <UserCheck className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="font-semibold">{staff.full_name || 'Unnamed'}</div>
                              <div className="text-sm text-muted-foreground">{staff.phone || 'No phone'}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getRoleBadge(staff.role)}>
                              {staff.role.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalReceived)}</div>
                          <div className="text-sm text-muted-foreground">Total Received</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-orange-600">{formatCurrency(pendingPayments)}</div>
                          <div className="text-sm text-muted-foreground">Pending Payments</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold">{formatCurrency(totalProjectValue)}</div>
                          <div className="text-sm text-muted-foreground">Total Project Value</div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Recent Instalments</h3>
                      </div>
                      {instalmentsLoading ? (
                        <div className="flex justify-center py-4">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                      ) : instalments.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No instalments yet</p>
                      ) : (
                        instalments.slice(0, 10).map((instalment) => {
                          const project = projects.find(p => p.id === instalment.project_id);
                          return (
                            <div key={instalment.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">{project?.code || 'Unknown'} - Instalment {instalment.instalment_number}</div>
                                <div className="text-sm text-muted-foreground">
                                  Due: {new Date(instalment.due_date).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">{formatCurrency(instalment.amount)}</div>
                                <Badge variant={instalment.status === 'paid' ? 'default' : instalment.status === 'overdue' ? 'destructive' : 'outline'}>
                                  {instalment.status}
                                </Badge>
                              </div>
                            </div>
                          );
                        })
                      )}
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
                            <div className="text-sm text-muted-foreground">Can manage projects, tasks and daily updates</div>
                          </div>
                          <Badge>Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">Site Staff Role</div>
                            <div className="text-sm text-muted-foreground">Can submit daily updates for assigned projects</div>
                          </div>
                          <Badge>Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">Office Staff Role</div>
                            <div className="text-sm text-muted-foreground">Can view projects and manage documents</div>
                          </div>
                          <Badge>Active</Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                      <div className="space-y-4">
                        <Button asChild variant="outline" className="w-full justify-start">
                          <Link to="/admin/users">
                            <Users className="h-4 w-4 mr-2" />
                            User Management
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Dialogs */}
      <AddDailyUpdate
        isOpen={isAddUpdateOpen}
        onClose={() => setIsAddUpdateOpen(false)}
        onSuccess={handleUpdateSuccess}
      />
      
      <AddProjectDialog
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
      />
      
      <AddInstalmentDialog
        isOpen={isAddInstalmentOpen}
        onClose={() => {
          setIsAddInstalmentOpen(false);
          setSelectedProjectId(null);
        }}
        projects={projects}
        defaultProjectId={selectedProjectId || undefined}
      />
      
      <AddTaskDialog
        isOpen={isAddTaskOpen}
        onClose={() => {
          setIsAddTaskOpen(false);
          setSelectedProjectId(null);
        }}
        projects={projects}
        defaultProjectId={selectedProjectId || undefined}
      />
    </div>
  );
};

export default StaffDashboard;
