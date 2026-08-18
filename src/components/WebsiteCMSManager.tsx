import React, { useState } from "react";
import { 
  Building2, 
  FileText, 
  Globe, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Eye, 
  EyeOff, 
  Save, 
  Sparkles, 
  Phone, 
  MapPin, 
  Mail, 
  Bell, 
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useWebsiteContent, BlogPost, WebsiteContentSettings } from "@/contexts/WebsiteContentContext";
import { useAdminProjects, ProjectFormData } from "@/hooks/useAdminProjects";
import { useAuth } from "@/hooks/useAuth";
import { getKathmanduDateTimeLocal, formatKathmanduDateTime } from "@/lib/utils";
import { ImageUploadDropzone } from "@/components/ImageUploadDropzone";

const WebsiteCMSManager: React.FC = () => {
  const { isTopAdmin } = useAuth();
  const { 
    blogPosts, 
    addBlogPost, 
    updateBlogPost, 
    deleteBlogPost,
    designs,
    addDesign,
    updateDesign,
    deleteDesign,
    seedSampleDesigns,
    settings, 
    updateSettings,
    resetToDefaults,
    migrateProjectsToFirebase,
    seedSampleBlogs,
  } = useWebsiteContent();

  const [isMigrating, setIsMigrating] = useState(false);
  const [isSeedingBlogs, setIsSeedingBlogs] = useState(false);
  const [isSeedingDesigns, setIsSeedingDesigns] = useState(false);

  const handleMigrateProjects = async () => {
    setIsMigrating(true);
    try {
      const res = await migrateProjectsToFirebase(true);
      if (res.success) {
        toast({
          title: "Projects Synchronized",
          description: `Construction projects have been synchronized and stored into Firebase Firestore!`,
        });
      } else {
        toast({
          title: "Synchronization Failed",
          description: "Could not sync projects to Firestore.",
          variant: "destructive",
        });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Sync error";
      toast({
        title: "Sync Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsMigrating(false);
    }
  };

  const handleSeedBlogs = async () => {
    setIsSeedingBlogs(true);
    try {
      const res = await seedSampleBlogs();
      if (res.success) {
        toast({
          title: "Sample Blogs Restored",
          description: `Successfully restored ${res.count} sample articles to Firestore!`,
        });
      }
    } catch {
      toast({
        title: "Error Restoring Blogs",
        description: "Failed to restore sample blogs.",
        variant: "destructive",
      });
    } finally {
      setIsSeedingBlogs(false);
    }
  };

  const handleSeedDesigns = async () => {
    setIsSeedingDesigns(true);
    try {
      const res = await seedSampleDesigns();
      if (res.success) {
        toast({
          title: "Sample Designs Restored",
          description: `Successfully restored ${res.count} house designs to Firestore!`,
        });
      }
    } catch {
      toast({
        title: "Error Restoring Designs",
        description: "Failed to restore sample designs.",
        variant: "destructive",
      });
    } finally {
      setIsSeedingDesigns(false);
    }
  };

  const {
    projects,
    filteredProjects,
    stats,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    addProject,
    editProject,
    deleteProject
  } = useAdminProjects();

  const { toast } = useToast();

  // Blog Dialog State
  const [isBlogDialogOpen, setIsBlogDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Technology",
    author: "Engineering Team",
    image: "",
    imagesString: "",
    readTime: "5 min read",
    date: getKathmanduDateTimeLocal(),
    isPublished: true,
  });

  // Project Dialog State
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<ProjectFormData & { imagesString?: string }>({
    code: "",
    title: "",
    category: "Residential",
    location: "Butwal",
    client: "",
    area: "2,500 Sq. Ft.",
    status: "Ongoing",
    progress: 0,
    image: "",
    imagesString: "",
    description: "",
    cost: "",
  });

  // Design State
  const [isDesignDialogOpen, setIsDesignDialogOpen] = useState(false);
  const [editingDesignId, setEditingDesignId] = useState<string | null>(null);
  const [designForm, setDesignForm] = useState({
    title: "",
    style: "Modern Duplex",
    description: "",
    image: "",
    tags: "3 Bedrooms, 2 Bathrooms, Parking",
    features: "Earthquake Resistant, Solar Ready, Balcony",
    baseViews: 120,
    growthRate: 5,
  });

  const handleDesignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const designPayload = {
      title: designForm.title,
      style: designForm.style,
      description: designForm.description,
      images: [designForm.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"],
      tags: designForm.tags.split(',').map(s => s.trim()).filter(Boolean),
      features: designForm.features.split(',').map(s => s.trim()).filter(Boolean),
      baseViews: Number(designForm.baseViews) || 100,
      growthRate: Number(designForm.growthRate) || 5,
    };

    if (editingDesignId) {
      updateDesign(editingDesignId, designPayload);
      toast({ title: "Design Updated", description: `"${designForm.title}" has been updated.` });
    } else {
      addDesign(designPayload);
      toast({ title: "Design Added", description: `"${designForm.title}" has been added to gallery.` });
    }
    setIsDesignDialogOpen(false);
    setEditingDesignId(null);
    resetDesignForm();
  };

  const resetDesignForm = () => {
    setDesignForm({
      title: "",
      style: "Modern Duplex",
      description: "",
      image: "",
      tags: "3 Bedrooms, 2 Bathrooms, Parking",
      features: "Earthquake Resistant, Solar Ready, Balcony",
      baseViews: 120,
      growthRate: 5,
    });
  };

  const openEditDesign = (design: HouseDesign) => {
    setEditingDesignId(design.id);
    setDesignForm({
      title: design.title,
      style: design.style || "Modern Duplex",
      description: design.description,
      image: design.images?.[0] || "",
      tags: design.tags?.join(", ") || "",
      features: design.features?.join(", ") || "",
      baseViews: design.baseViews || 100,
      growthRate: design.growthRate || 5,
    });
    setIsDesignDialogOpen(true);
  };

  // Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    type: 'project' | 'blog' | 'design';
    id: string;
    title: string;
  }>({
    open: false,
    type: 'project',
    id: '',
    title: '',
  });

  const executeDelete = () => {
    if (deleteConfirm.type === 'project') {
      deleteProject(deleteConfirm.id);
      toast({ title: "Project Deleted", description: `Successfully deleted project "${deleteConfirm.title}"` });
    } else if (deleteConfirm.type === 'blog') {
      deleteBlogPost(deleteConfirm.id);
      toast({ title: "Blog Post Deleted", description: `Successfully deleted blog post "${deleteConfirm.title}"` });
    } else if (deleteConfirm.type === 'design') {
      deleteDesign(deleteConfirm.id);
      toast({ title: "Design Deleted", description: `Successfully deleted design "${deleteConfirm.title}"` });
    }
    setDeleteConfirm({ open: false, type: 'project', id: '', title: '' });
  };

  // Handle Blog Submit
  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const imagesArray = blogForm.imagesString
      ? blogForm.imagesString.split(/[\n,]+/).map(s => s.trim()).filter(Boolean)
      : undefined;
    const { imagesString: _is, ...payload } = {
      ...blogForm,
      images: imagesArray,
    };

    if (editingBlog) {
      updateBlogPost(editingBlog.id, payload);
      toast({ title: "Blog Post Updated", description: `"${blogForm.title}" has been updated.` });
    } else {
      addBlogPost(payload);
      toast({ title: "Blog Post Created", description: `"${blogForm.title}" has been published.` });
    }
    setIsBlogDialogOpen(false);
    setEditingBlog(null);
    resetBlogForm();
  };

  const resetBlogForm = () => {
    setBlogForm({
      title: "",
      excerpt: "",
      content: "",
      category: "Technology",
      author: "Engineering Team",
      image: "",
      imagesString: "",
      readTime: "5 min read",
      date: getKathmanduDateTimeLocal(),
      isPublished: true,
    });
  };

  const openEditBlog = (post: BlogPost) => {
    setEditingBlog(post);
    setBlogForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content || "",
      category: post.category,
      author: post.author,
      image: post.image || "",
      imagesString: post.images ? post.images.join('\n') : "",
      readTime: post.readTime,
      date: post.date,
      isPublished: post.isPublished,
    });
    setIsBlogDialogOpen(true);
  };

  // Handle Project Submit
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const imagesArray = projectForm.imagesString
      ? projectForm.imagesString.split(/[\n,]+/).map(s => s.trim()).filter(Boolean)
      : undefined;
    const { imagesString: _is, ...payload } = {
      ...projectForm,
      images: imagesArray,
      code: projectForm.code || `PROJ-${Date.now().toString().slice(-4)}`,
    };

    if (editingProjectId) {
      await editProject(editingProjectId, payload);
    } else {
      await addProject(payload);
    }
    setIsProjectDialogOpen(false);
    setEditingProjectId(null);
    resetProjectForm();
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjectForm({
      code: "",
      title: "",
      category: "Residential",
      location: "Butwal",
      client: "",
      area: "2,500 Sq. Ft.",
      status: "Ongoing",
      progress: 0,
      image: "",
      imagesString: "",
      description: "",
      cost: "",
    });
  };

  const openEditProject = (proj: {
    id: string;
    code: string;
    title: string;
    category: string;
    location: string;
    client?: string;
    area?: string;
    status: "Completed" | "Ongoing" | "Under Planning";
    progress: number;
    image: string;
    images?: string[];
    description: string;
    cost?: string;
  }) => {
    setEditingProjectId(proj.id);
    setProjectForm({
      code: proj.code,
      title: proj.title,
      category: proj.category,
      location: proj.location,
      client: proj.client || "",
      area: proj.area || "2,500 Sq. Ft.",
      status: proj.status,
      progress: proj.progress,
      image: proj.image || "",
      imagesString: proj.images ? proj.images.join('\n') : "",
      description: proj.description,
      cost: proj.cost || "",
    });
    setIsProjectDialogOpen(true);
  };

  // Handle Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    toast({ title: "Website Content Saved", description: "Changes are live across the website!" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            Website Content & CMS Portal
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage live projects, blog articles, announcement banners, and company contact info
          </p>
        </div>

        {isTopAdmin && (
          <Button variant="outline" size="sm" onClick={() => { resetToDefaults(); toast({ title: "Reset complete" }); }}>
            <RefreshCw className="h-4 w-4 mr-2" /> Restore Factory Defaults
          </Button>
        )}
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="projects" className="flex items-center gap-2 text-xs sm:text-sm">
            <Building2 className="h-4 w-4" /> Projects
          </TabsTrigger>
          <TabsTrigger value="blogs" className="flex items-center gap-2 text-xs sm:text-sm">
            <FileText className="h-4 w-4" /> Blog Articles
          </TabsTrigger>
          <TabsTrigger value="designs" className="flex items-center gap-2 text-xs sm:text-sm">
            <Globe className="h-4 w-4" /> House Designs
          </TabsTrigger>
        </TabsList>

        {/* PROJECTS TAB */}
        <TabsContent value="projects" className="space-y-4">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="p-3 glass text-center">
              <span className="text-xs text-muted-foreground font-medium">Total Projects</span>
              <p className="text-xl font-bold text-primary">{stats.total}</p>
            </Card>
            <Card className="p-3 glass text-center">
              <span className="text-xs text-muted-foreground font-medium">Ongoing</span>
              <p className="text-xl font-bold text-amber-500">{stats.ongoing}</p>
            </Card>
            <Card className="p-3 glass text-center">
              <span className="text-xs text-muted-foreground font-medium">Completed</span>
              <p className="text-xl font-bold text-emerald-500">{stats.completed}</p>
            </Card>
            <Card className="p-3 glass text-center">
              <span className="text-xs text-muted-foreground font-medium">Avg Progress</span>
              <p className="text-xl font-bold text-blue-500">{stats.avgProgress}%</p>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Input 
                placeholder="Search projects..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs text-xs h-9"
              />
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32 text-xs h-9"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Under Planning">Under Planning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="default"
                onClick={handleMigrateProjects}
                disabled={isMigrating}
                className="border-primary/40 hover:bg-primary/10 text-xs sm:text-sm"
              >
                <RefreshCw className={`h-4 w-4 mr-1.5 text-primary ${isMigrating ? "animate-spin" : ""}`} />
                {isMigrating ? "Syncing..." : "Sync / Migrate All to Firebase"}
              </Button>

              <Dialog open={isProjectDialogOpen} onOpenChange={(open) => { setIsProjectDialogOpen(open); if(!open) resetProjectForm(); }}>
                <DialogTrigger asChild>
                  <Button className="gradient-primary">
                    <Plus className="h-4 w-4 mr-2" /> Add New Project
                  </Button>
                </DialogTrigger>
              <DialogContent className="max-w-3xl sm:max-w-4xl max-h-[88vh] overflow-y-auto px-6 py-6">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">{editingProjectId ? "Edit Construction Project" : "Add New Construction Project"}</DialogTitle>
                  <DialogDescription>
                    This project will appear across the public /projects gallery and admin dashboard.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleProjectSubmit} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Project Title *</label>
                      <Input 
                        value={projectForm.title} 
                        onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                        placeholder="e.g. Modern Villa - Dang"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Project Code</label>
                      <Input 
                        value={projectForm.code} 
                        onChange={(e) => setProjectForm({...projectForm, code: e.target.value})}
                        placeholder="e.g. BUT-2026-01" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Input 
                        value={projectForm.category} 
                        onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                        placeholder="Residential / Commercial" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Location</label>
                      <Input 
                        value={projectForm.location} 
                        onChange={(e) => setProjectForm({...projectForm, location: e.target.value})}
                        placeholder="e.g. Ghorahi, Dang" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select 
                        value={projectForm.status} 
                        onValueChange={(val: "Completed" | "Ongoing" | "Under Planning") => setProjectForm({...projectForm, status: val})}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ongoing">Ongoing</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Under Planning">Under Planning</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Progress %</label>
                      <Input 
                        type="number" 
                        min={0} 
                        max={100} 
                        value={projectForm.progress} 
                        onChange={(e) => setProjectForm({...projectForm, progress: Number(e.target.value)})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Est. Cost</label>
                      <Input 
                        value={projectForm.cost || ""} 
                        onChange={(e) => setProjectForm({...projectForm, cost: e.target.value})} 
                        placeholder="e.g. NPR 1.50 Crore"
                      />
                    </div>
                  </div>

                  {/* Main Image Uploader */}
                  <div className="space-y-2 p-3 bg-muted/20 border border-border/60 rounded-xl">
                    <ImageUploadDropzone
                      label="Main Project Photo"
                      helperText="Choose or drop a high quality photo of the project"
                      value={projectForm.image}
                      onChange={(url) => setProjectForm(prev => ({ ...prev, image: url }))}
                    />
                  </div>

                  {/* Additional Gallery Images Uploader */}
                  <div className="space-y-2 p-3 bg-muted/20 border border-border/60 rounded-xl">
                    <ImageUploadDropzone
                      label="Additional Gallery Photos"
                      helperText="Select or drop multiple photos to append to this project's gallery"
                      allowMultiple={true}
                      onMultipleAdd={(newUrls) => {
                        const existing = projectForm.imagesString ? projectForm.imagesString.split(/[\n,]+/).map(s => s.trim()).filter(Boolean) : [];
                        const combined = [...existing, ...newUrls];
                        setProjectForm(prev => ({ ...prev, imagesString: combined.join('\n') }));
                      }}
                      onChange={() => {}}
                    />
                    {Boolean(projectForm.imagesString && projectForm.imagesString.trim()) && (
                      <div className="pt-2">
                        <label className="text-xs font-medium text-muted-foreground">Gallery Image URLs ({projectForm.imagesString.split(/[\n,]+/).filter(Boolean).length} photos attached):</label>
                        <Textarea 
                          rows={2}
                          value={projectForm.imagesString || ""}
                          onChange={(e) => setProjectForm({...projectForm, imagesString: e.target.value})}
                          placeholder="Image URLs..."
                          className="text-xs font-mono mt-1"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea 
                      rows={3} 
                      value={projectForm.description} 
                      onChange={(e) => setProjectForm({...projectForm, description: e.target.value})} 
                      placeholder="Brief details about the project scope, floors, materials..."
                    />
                  </div>

                  <Button type="submit" className="w-full gradient-primary py-6 text-base font-semibold">
                    <Save className="h-4 w-4 mr-2" /> Save Project
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((proj) => (
              <Card key={proj.id} className="glass overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="relative h-40 overflow-hidden">
                    <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                    <Badge className="absolute top-2 right-2 bg-primary">{proj.status}</Badge>
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="text-xs">{proj.category}</Badge>
                      <span className="text-xs text-muted-foreground">{proj.code}</span>
                    </div>
                    <CardTitle className="text-lg font-bold mt-1">{proj.title}</CardTitle>
                    <CardDescription className="text-xs">{proj.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                    <p className="line-clamp-2">{proj.description}</p>
                    <div className="mt-3 flex items-center justify-between text-foreground font-semibold">
                      <span>Progress: {proj.progress}%</span>
                      <span>{proj.cost}</span>
                    </div>
                  </CardContent>
                </div>
                <div className="p-4 border-t flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditProject(proj)}>
                    <Edit3 className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setDeleteConfirm({ open: true, type: 'project', id: proj.id, title: proj.title })}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* BLOGS TAB */}
        <TabsContent value="blogs" className="space-y-4">
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <h3 className="text-lg font-semibold">Live Articles ({blogPosts.length})</h3>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSeedBlogs}
                disabled={isSeedingBlogs}
                className="border-primary/40 hover:bg-primary/10 text-xs"
              >
                <RefreshCw className={`h-3.5 w-3.5 mr-1.5 text-primary ${isSeedingBlogs ? "animate-spin" : ""}`} />
                {isSeedingBlogs ? "Restoring..." : "Restore Sample Articles"}
              </Button>

              <Dialog open={isBlogDialogOpen} onOpenChange={(open) => { setIsBlogDialogOpen(open); if(!open) resetBlogForm(); }}>
                <DialogTrigger asChild>
                  <Button className="gradient-primary">
                    <Plus className="h-4 w-4 mr-2" /> Write New Blog Article
                  </Button>
                </DialogTrigger>
              <DialogContent className="max-w-3xl sm:max-w-4xl max-h-[88vh] overflow-y-auto px-6 py-6">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">{editingBlog ? "Edit Blog Article" : "Write Blog Article"}</DialogTitle>
                  <DialogDescription>
                    Articles published here will be featured on the main /blog page.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleBlogSubmit} className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Article Title *</label>
                    <Input 
                      value={blogForm.title} 
                      onChange={(e) => setBlogForm({...blogForm, title: e.target.value})} 
                      placeholder="e.g. Earthquake Resistant House Construction Guide 2026"
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select 
                        value={blogForm.category} 
                        onValueChange={(val) => setBlogForm({...blogForm, category: val})}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Tips & Guides">Tips & Guides</SelectItem>
                          <SelectItem value="Guide">Guide</SelectItem>
                          <SelectItem value="Sustainability">Sustainability</SelectItem>
                          <SelectItem value="Projects">Projects</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Author</label>
                      <Input 
                        value={blogForm.author} 
                        onChange={(e) => setBlogForm({...blogForm, author: e.target.value})} 
                        placeholder="Author name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Publication Date & Time</label>
                      <Input 
                        type="datetime-local"
                        value={blogForm.date} 
                        onChange={(e) => setBlogForm({...blogForm, date: e.target.value})} 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Estimated Read Time</label>
                      <Input 
                        value={blogForm.readTime} 
                        onChange={(e) => setBlogForm({...blogForm, readTime: e.target.value})} 
                        placeholder="e.g. 5 min read"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Short Summary / Excerpt</label>
                    <Textarea 
                      rows={2} 
                      value={blogForm.excerpt} 
                      onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})} 
                      placeholder="Brief overview summary displayed on card list..."
                    />
                  </div>

                  {/* Main Blog Cover Image Uploader */}
                  <div className="space-y-2 p-3 bg-muted/20 border border-border/60 rounded-xl">
                    <ImageUploadDropzone
                      label="Article Cover Image"
                      helperText="Choose a banner photo for this article from your device"
                      value={blogForm.image}
                      onChange={(url) => setBlogForm(prev => ({ ...prev, image: url }))}
                    />
                  </div>

                  {/* Additional/Inline Images Uploader */}
                  <div className="space-y-2 p-3 bg-muted/20 border border-border/60 rounded-xl">
                    <ImageUploadDropzone
                      label="Extra Article Photos & Markdown Placement"
                      helperText="Upload any photo to generate and copy a markdown tag to paste into your article lines"
                      allowMultiple={true}
                      forMarkdownBlog={true}
                      onMultipleAdd={(newUrls) => {
                        const existing = blogForm.imagesString ? blogForm.imagesString.split(/[\n,]+/).map(s => s.trim()).filter(Boolean) : [];
                        const combined = [...existing, ...newUrls];
                        setBlogForm(prev => ({ ...prev, imagesString: combined.join('\n') }));
                      }}
                      onChange={() => {}}
                    />
                    {Boolean(blogForm.imagesString && blogForm.imagesString.trim()) && (
                      <div className="pt-2">
                        <label className="text-xs font-medium text-muted-foreground">Attached Photos ({blogForm.imagesString.split(/[\n,]+/).filter(Boolean).length} uploaded):</label>
                        <Textarea 
                          rows={2}
                          value={blogForm.imagesString || ""}
                          onChange={(e) => setBlogForm({...blogForm, imagesString: e.target.value})}
                          placeholder="Image URLs..."
                          className="text-xs font-mono mt-1"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Article Content</label>
                    <Textarea 
                      rows={7} 
                      value={blogForm.content} 
                      onChange={(e) => setBlogForm({...blogForm, content: e.target.value})} 
                      placeholder="Write your article paragraphs here..."
                    />
                    <p className="text-xs text-muted-foreground">
                      💡 <strong>How to place an image inside the article:</strong> Use the "Copy Markdown Tag" button above on any uploaded photo and paste it <code className="bg-muted px-1 py-0.5 rounded">![Caption](URL)</code> directly at the exact line or paragraph where you want it!
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Switch 
                      id="publish-switch" 
                      checked={blogForm.isPublished} 
                      onCheckedChange={(val) => setBlogForm({...blogForm, isPublished: val})} 
                    />
                    <label htmlFor="publish-switch" className="text-sm font-medium cursor-pointer">
                      Publish Article Immediately on Website
                    </label>
                  </div>

                  <Button type="submit" className="w-full gradient-primary py-6 text-base font-semibold">
                    <Save className="h-4 w-4 mr-2" /> Save Article
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            </div>
          </div>

          {blogPosts.length === 0 ? (
            <Card className="glass p-8 text-center border-dashed">
              <p className="text-muted-foreground mb-4">No blog articles in Firestore yet. Write your own or restore sample articles.</p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" size="sm" onClick={handleSeedBlogs} disabled={isSeedingBlogs}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isSeedingBlogs ? "animate-spin" : ""}`} />
                  Restore Sample Articles
                </Button>
                <Button size="sm" className="gradient-primary" onClick={() => { resetBlogForm(); setIsBlogDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" /> Write Article
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {blogPosts.map((post) => (
                <Card key={post.id} className="glass p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <img src={post.image} alt={post.title} className="w-16 h-16 rounded object-cover flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{post.category}</Badge>
                        <span className="text-xs text-muted-foreground">{formatKathmanduDateTime(post.date)}</span>
                        {post.isPublished ? (
                          <Badge className="bg-green-600 text-white text-[10px]">Published</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">Draft</Badge>
                        )}
                      </div>
                      <h4 className="font-bold text-base mt-1">{post.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{post.excerpt}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <Button variant="ghost" size="sm" onClick={() => updateBlogPost(post.id, { isPublished: !post.isPublished })}>
                      {post.isPublished ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-primary" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEditBlog(post)}>
                      <Edit3 className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setDeleteConfirm({ open: true, type: 'blog', id: post.id, title: post.title })}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* HOUSE DESIGNS TAB */}
        <TabsContent value="designs">
          <div className="flex flex-wrap gap-2 justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">House Designs Gallery ({designs?.length || 0})</h3>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSeedDesigns}
                disabled={isSeedingDesigns}
                className="border-primary/40 hover:bg-primary/10 text-xs"
              >
                <RefreshCw className={`h-3.5 w-3.5 mr-1.5 text-primary ${isSeedingDesigns ? "animate-spin" : ""}`} />
                {isSeedingDesigns ? "Restoring..." : "Restore Sample Designs"}
              </Button>

              <Button className="gradient-primary" onClick={() => { resetDesignForm(); setEditingDesignId(null); setIsDesignDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" /> Add Design
              </Button>
            </div>
          </div>
          
          {(!designs || designs.length === 0) ? (
            <Card className="glass p-8 text-center border-dashed">
              <p className="text-muted-foreground mb-4">No house designs in Firestore yet. Add a design or restore sample designs.</p>
              <Button variant="outline" size="sm" onClick={handleSeedDesigns} disabled={isSeedingDesigns}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isSeedingDesigns ? "animate-spin" : ""}`} />
                Restore Sample Designs
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {designs.map((design) => (
                <Card key={design.id} className="glass overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="relative h-40 overflow-hidden bg-muted">
                      <img 
                        src={design.images?.[0] || "/placeholder.svg"} 
                        alt={design.title} 
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                      <Badge className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 border-none backdrop-blur-sm">
                        {design.style}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-lg line-clamp-1">{design.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{design.description}</p>
                      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                        <Eye className="h-3.5 w-3.5" /> 
                        {design.baseViews + (design.currentViews || 0)} views
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pt-0 flex gap-2 border-t border-white/10 mt-4">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDesign(design)}>
                      <Edit3 className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setDeleteConfirm({ open: true, type: 'design', id: design.id, title: design.title })}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add / Edit Design Dialog */}
      <Dialog open={isDesignDialogOpen} onOpenChange={setIsDesignDialogOpen}>
        <DialogContent className="max-w-3xl sm:max-w-4xl max-h-[88vh] overflow-y-auto px-6 py-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{editingDesignId ? "Edit House Design" : "Add New House Design"}</DialogTitle>
            <DialogDescription>
              Fill in the architectural design specifications and visual rendering.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleDesignSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Design Title *</label>
              <Input
                value={designForm.title}
                onChange={(e) => setDesignForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Modern Minimalist 3BHK Villa"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Architectural Style</label>
                <Input
                  value={designForm.style}
                  onChange={(e) => setDesignForm(prev => ({ ...prev, style: e.target.value }))}
                  placeholder="e.g. Contemporary Duplex"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Initial Base Views</label>
                <Input
                  type="number"
                  value={designForm.baseViews}
                  onChange={(e) => setDesignForm(prev => ({ ...prev, baseViews: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="space-y-2 p-3 bg-muted/20 border border-border/60 rounded-xl">
              <ImageUploadDropzone
                label="Design Visualization Photo *"
                helperText="Select or drop design 3D rendering photo from your device"
                value={designForm.image}
                onChange={(url) => setDesignForm(prev => ({ ...prev, image: url }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tags (comma separated)</label>
              <Input
                value={designForm.tags}
                onChange={(e) => setDesignForm(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="3 Bedrooms, 2 Bathrooms, Car Parking"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Key Features (comma separated)</label>
              <Input
                value={designForm.features}
                onChange={(e) => setDesignForm(prev => ({ ...prev, features: e.target.value }))}
                placeholder="Earthquake Resistant, Rooftop Garden"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <textarea
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={designForm.description}
                onChange={(e) => setDesignForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of the architectural layout..."
                required
              />
            </div>

            <Button type="submit" className="w-full gradient-primary py-6 text-base font-semibold mt-4">
              {editingDesignId ? "Save Changes" : "Publish House Design"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm.open} onOpenChange={(open) => setDeleteConfirm(prev => ({ ...prev, open }))}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" /> Confirm Deletion
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete this {deleteConfirm.type}: <strong className="text-foreground">"{deleteConfirm.title}"</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm({ open: false, type: 'project', id: '', title: '' })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={executeDelete}
            >
              Yes, Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebsiteCMSManager;
