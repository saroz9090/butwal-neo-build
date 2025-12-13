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
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { user, profile, signOut, loading: authLoading, isCustomer, role } = useAuth();

  // Mock data - in real app, this would come from API
  const projectData = {
    projectName: "Modern Residence - Butwal",
    projectCode: "RES-2024-001",
    startDate: "2024-01-15",
    estimatedCompletion: "2024-08-30",
    progress: 65,
    manager: "Rajesh Kumar",
    managerContact: "rajesh@butwalconstruction.com"
  };

  const instalments = [
    { id: 1, dueDate: "2024-01-20", amount: 500000, status: "paid", paidDate: "2024-01-18" },
    { id: 2, dueDate: "2024-02-20", amount: 750000, status: "paid", paidDate: "2024-02-15" },
    { id: 3, dueDate: "2024-03-20", amount: 1000000, status: "paid", paidDate: "2024-03-18" },
    { id: 4, dueDate: "2024-04-20", amount: 1250000, status: "pending" },
    { id: 5, dueDate: "2024-05-20", amount: 1500000, status: "pending" },
    { id: 6, dueDate: "2024-06-20", amount: 1750000, status: "pending" },
  ];

  const dailyUpdates = [
    {
      id: 1,
      date: "2024-03-20",
      title: "Foundation Work Completed",
      description: "Concrete pouring for foundation completed successfully. All quality checks passed.",
      images: ["/placeholder.svg", "/placeholder.svg"],
      manager: "Rajesh Kumar"
    },
    {
      id: 2,
      date: "2024-03-19",
      title: "Electrical Wiring Started",
      description: "Initial electrical wiring and conduit placement in progress.",
      images: ["/placeholder.svg"],
      manager: "Rajesh Kumar"
    },
    {
      id: 3,
      date: "2024-03-18",
      title: "Plumbing Work",
      description: "Underground plumbing installation completed for ground floor.",
      images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
      manager: "Rajesh Kumar"
    }
  ];

  const tasks = [
    { id: 1, title: "Material Approval - Tiles", status: "pending", assignedTo: "Client", dueDate: "2024-03-25" },
    { id: 2, title: "Electrical Fixture Selection", status: "completed", assignedTo: "Client", completedDate: "2024-03-18" },
    { id: 3, title: "Sanitary Ware Finalization", status: "pending", assignedTo: "Client", dueDate: "2024-04-01" },
  ];

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

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const userName = profile?.full_name || user.email || 'Customer';

  const totalPaid = instalments.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0);
  const totalPending = instalments.filter(i => i.status === "pending").reduce((sum, i) => sum + i.amount, 0);

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
            <Badge variant="secondary" className="text-sm">
              Project: {projectData.projectCode}
            </Badge>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Project Overview Card */}
        <Card className="mb-8 gradient-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">{projectData.projectName}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="opacity-80">Start Date:</span>
                    <div className="font-semibold">{projectData.startDate}</div>
                  </div>
                  <div>
                    <span className="opacity-80">Estimated Completion:</span>
                    <div className="font-semibold">{projectData.estimatedCompletion}</div>
                  </div>
                  <div>
                    <span className="opacity-80">Project Manager:</span>
                    <div className="font-semibold">{projectData.manager}</div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{projectData.progress}%</div>
                <Progress value={projectData.progress} className="w-32 h-2 bg-white/20" />
                <div className="text-sm opacity-80 mt-1">Overall Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                  <div className="text-2xl font-bold">₹{((totalPaid + totalPending) / 100000).toFixed(1)}L</div>
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
                  <div className="text-2xl font-bold">₹{(totalPaid / 100000).toFixed(1)}L</div>
                  <p className="text-xs text-muted-foreground">
                    {((totalPaid / (totalPaid + totalPending)) * 100).toFixed(0)}% of total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tasks.filter(t => t.status === "pending").length}</div>
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
                  <div className="text-2xl font-bold">{dailyUpdates.length}</div>
                  <p className="text-xs text-muted-foreground">
                    This month
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
                <div className="space-y-4">
                  {tasks.filter(task => task.status === "pending").map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Due: {task.dueDate} • Assigned to: {task.assignedTo}
                          </div>
                        </div>
                      </div>
                      <Button size="sm">Take Action</Button>
                    </div>
                  ))}
                </div>
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
                <div className="space-y-6">
                  {dailyUpdates.map((update) => (
                    <div key={update.id} className="border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{update.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {update.date} • By {update.manager}
                          </p>
                        </div>
                        <Badge variant="outline">{update.date}</Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{update.description}</p>
                      
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
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download Images
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Ask Question
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
                        <div className="text-2xl font-bold text-green-600">₹{(totalPaid / 100000).toFixed(1)}L</div>
                        <div className="text-sm text-muted-foreground">Total Paid</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-orange-600">₹{(totalPending / 100000).toFixed(1)}L</div>
                        <div className="text-sm text-muted-foreground">Pending Payment</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">₹{((totalPaid + totalPending) / 100000).toFixed(1)}L</div>
                        <div className="text-sm text-muted-foreground">Total Project Cost</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    {instalments.map((instalment) => (
                      <div key={instalment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          {instalment.status === 'paid' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-orange-600" />
                          )}
                          <div>
                            <div className="font-medium">Instalment #{instalment.id}</div>
                            <div className="text-sm text-muted-foreground">
                              Due: {instalment.dueDate} • ₹{(instalment.amount / 100000).toFixed(1)}L
                              {instalment.paidDate && ` • Paid on: ${instalment.paidDate}`}
                            </div>
                          </div>
                        </div>
                        <Badge variant={instalment.status === 'paid' ? 'default' : 'outline'}>
                          {instalment.status === 'paid' ? 'Paid' : 'Pending'}
                        </Badge>
                      </div>
                    ))}
                  </div>
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
                        <div className="aspect-video bg-muted rounded mb-3"></div>
                        <div className="text-xs text-muted-foreground">Main entrance and facade progress</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Back View Camera</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-video bg-muted rounded mb-3"></div>
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