import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Camera, 
  CreditCard, 
  ClipboardList, 
  CheckCircle, 
  XCircle, 
  Calendar,
  MessageCircle,
  Download,
  Eye,
  Building2,
  LogOut,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useCustomerProject, useInstalments, useTasks, useDailyUpdates } from "@/hooks/useProjectData";

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { user, profile, signOut, loading: authLoading, role } = useAuth();

  // Fetch customer's assigned project
  const { data: project, isLoading: projectLoading } = useCustomerProject();
  
  // Fetch project-related data
  const { data: allInstalments = [], isLoading: instalmentsLoading } = useInstalments(project?.id);
  const { data: allTasks = [], isLoading: tasksLoading } = useTasks(project?.id);
  const { data: allDailyUpdates = [], isLoading: updatesLoading } = useDailyUpdates(project?.id);

  // Filter tasks assigned to client
  const clientTasks = allTasks.filter(t => t.assigned_type === 'client');
  const pendingTasks = clientTasks.filter(t => t.status === 'pending');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }
    
    // Redirect non-customers to staff dashboard
    if (!authLoading && user && role && role !== 'customer') {
      navigate("/staff/dashboard");
    }
  }, [user, role, authLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  const userName = profile?.full_name || user.email || 'Customer';

  // Calculate payment stats
  const totalPaid = allInstalments.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0);
  const totalPending = allInstalments.filter(i => i.status === "pending" || i.status === "overdue").reduce((sum, i) => sum + i.amount, 0);
  const totalCost = project?.total_cost || (totalPaid + totalPending);

  // No project assigned state
  if (!projectLoading && !project) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Project Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome, {userName}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">No Project Assigned</h2>
              <p className="text-muted-foreground mb-6">
                You don't have a project assigned to your account yet. 
                Please contact Butwal Construction & Builders to get started with your construction project.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Phone:</strong> +977-71-540123</p>
                <p><strong>Email:</strong> info@butwalconstruction.com</p>
              </div>
            </CardContent>
          </Card>
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
            <h1 className="text-3xl font-bold">Project Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {userName}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {project && (
              <Badge variant="secondary" className="text-sm">
                Project: {project.code}
              </Badge>
            )}
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Project Overview Card */}
        {projectLoading ? (
          <Card className="mb-8">
            <CardContent className="p-6 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </CardContent>
          </Card>
        ) : project && (
          <Card className="mb-8 gradient-primary text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{project.name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="opacity-80">Start Date:</span>
                      <div className="font-semibold">{formatDate(project.start_date)}</div>
                    </div>
                    <div>
                      <span className="opacity-80">Estimated Completion:</span>
                      <div className="font-semibold">{formatDate(project.estimated_completion)}</div>
                    </div>
                    <div>
                      <span className="opacity-80">Status:</span>
                      <div className="font-semibold capitalize">{project.status}</div>
                    </div>
                  </div>
                  {project.address && (
                    <div className="mt-2 text-sm">
                      <span className="opacity-80">Location:</span> {project.address}
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{project.progress}%</div>
                  <Progress value={project.progress} className="w-32 h-2 bg-white/20" />
                  <div className="text-sm opacity-80 mt-1">Overall Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="updates">Daily Updates</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="camera">Site View</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalCost)}</div>
                  <p className="text-xs text-muted-foreground">
                    Total project cost
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Amount Paid</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalPaid)}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalCost > 0 ? ((totalPaid / totalCost) * 100).toFixed(0) : 0}% of total
                  </p>
                </CardContent>
              </Card>

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
                    Your attention required
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Site Updates</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {updatesLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : allDailyUpdates.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total updates
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Pending Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Actions</CardTitle>
                <CardDescription>
                  Tasks requiring your attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tasksLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : pendingTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-muted-foreground">No pending tasks! You're all caught up.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                          <div>
                            <div className="font-medium">{task.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {task.due_date ? `Due: ${formatDate(task.due_date)}` : 'No due date'} • Priority: {task.priority}
                            </div>
                            {task.description && (
                              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                            )}
                          </div>
                        </div>
                        <Badge variant={task.priority === 'high' ? 'destructive' : 'outline'}>
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Updates Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Updates</CardTitle>
                <CardDescription>
                  Latest updates from your construction site
                </CardDescription>
              </CardHeader>
              <CardContent>
                {updatesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : allDailyUpdates.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No updates yet. Check back soon!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allDailyUpdates.slice(0, 3).map((update) => (
                      <div key={update.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                        <div className="flex-1">
                          <div className="font-medium">{update.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(update.created_at)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{update.description}</p>
                        </div>
                      </div>
                    ))}
                    {allDailyUpdates.length > 3 && (
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab("updates")}>
                        View All Updates
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Daily Updates Tab */}
          <TabsContent value="updates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Progress Updates</CardTitle>
                <CardDescription>
                  Latest updates from your construction site
                </CardDescription>
              </CardHeader>
              <CardContent>
                {updatesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : allDailyUpdates.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Updates Yet</h3>
                    <p className="text-muted-foreground">
                      Your construction team will post updates here as work progresses.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {allDailyUpdates.map((update) => (
                      <div key={update.id} className="border rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{update.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(update.created_at)}
                            </p>
                          </div>
                          <Badge variant="outline">{formatDate(update.created_at)}</Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-4">{update.description}</p>
                        
                        {update.images && update.images.length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                            {update.images.map((image, index) => (
                              <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                                <img 
                                  src={image} 
                                  alt={`Update ${update.id} - Image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Ask Question
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Schedule</CardTitle>
                <CardDescription>
                  Track your instalments and payment status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
                        <div className="text-sm text-muted-foreground">Total Paid</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-orange-600">{formatCurrency(totalPending)}</div>
                        <div className="text-sm text-muted-foreground">Pending Payment</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">{formatCurrency(totalCost)}</div>
                        <div className="text-sm text-muted-foreground">Total Project Cost</div>
                      </CardContent>
                    </Card>
                  </div>

                  {instalmentsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : allInstalments.length === 0 ? (
                    <div className="text-center py-12">
                      <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Instalments Yet</h3>
                      <p className="text-muted-foreground">
                        Payment instalments will appear here once your project payment schedule is set up.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {allInstalments.map((instalment) => (
                        <div key={instalment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            {instalment.status === 'paid' ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : instalment.status === 'overdue' ? (
                              <XCircle className="h-5 w-5 text-red-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-orange-600" />
                            )}
                            <div>
                              <div className="font-medium">Instalment #{instalment.instalment_number}</div>
                              <div className="text-sm text-muted-foreground">
                                Due: {formatDate(instalment.due_date)} • {formatCurrency(instalment.amount)}
                                {instalment.paid_date && ` • Paid on: ${formatDate(instalment.paid_date)}`}
                              </div>
                              {instalment.notes && (
                                <p className="text-xs text-muted-foreground mt-1">{instalment.notes}</p>
                              )}
                            </div>
                          </div>
                          <Badge variant={
                            instalment.status === 'paid' ? 'default' : 
                            instalment.status === 'overdue' ? 'destructive' : 
                            'outline'
                          }>
                            {instalment.status === 'paid' ? 'Paid' : instalment.status === 'overdue' ? 'Overdue' : 'Pending'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Camera/Site View Tab */}
          <TabsContent value="camera" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Site View</CardTitle>
                <CardDescription>
                  Monitor your construction site in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Live Camera Feed Placeholder */}
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Live Camera Feed</h3>
                      <p className="text-muted-foreground mb-4">
                        Real-time view of your construction site
                      </p>
                      <Button>
                        <Eye className="h-4 w-4 mr-2" />
                        View Live Feed
                      </Button>
                    </div>
                  </div>

                  {/* Camera Locations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Front View Camera</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-video bg-muted rounded mb-3 flex items-center justify-center">
                          <Camera className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="text-xs text-muted-foreground">Main entrance and facade progress</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Back View Camera</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-video bg-muted rounded mb-3 flex items-center justify-center">
                          <Camera className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="text-xs text-muted-foreground">Backyard and service area</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerDashboard;
