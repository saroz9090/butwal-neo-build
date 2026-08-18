import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Users, Trash2, Edit2, Shield, UserCog, Key, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface UserData {
  id: string;
  email: string;
  fullName: string;
  password?: string;
  phone?: string;
  address?: string;
  role: string;
  createdAt: string;
}

const AdminUserManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isTopAdmin, loading: authLoading } = useAuth();
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [processing, setProcessing] = useState(false);

  // Form state for creating user
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    address: "",
    role: "normal" as "top" | "normal",
  });

  // Form state for editing user
  const [editForm, setEditForm] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    address: "",
    role: "normal" as "top" | "normal",
  });

  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{ open: boolean; id: string; email: string }>({
    open: false,
    id: "",
    email: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }
    
    if (!authLoading && user && !isTopAdmin) {
      toast({
        title: "Access Denied",
        description: "Only top-level administrators can access user management.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    if (user && isTopAdmin) {
      fetchUsers();
    }
  }, [user, isTopAdmin, authLoading, navigate, toast]);

  const fetchUsers = async () => {
    try {
      const snap = await getDocs(collection(db, "users"));
      const list: UserData[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          email: data.email || "",
          fullName: data.full_name || data.fullName || "User",
          password: data.password || "",
          phone: data.phone || undefined,
          address: data.address || undefined,
          role: data.role || "normal",
          createdAt: data.created_at || new Date().toISOString()
        });
      });
      setUsers(list);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const id = `user-${Date.now()}`;
      const newUserDoc = {
        id,
        user_id: id,
        email: newUser.email.trim().toLowerCase(),
        password: newUser.password,
        full_name: newUser.fullName,
        phone: newUser.phone || null,
        address: newUser.address || null,
        role: newUser.role, // 'top' or 'normal'
        created_at: new Date().toISOString()
      };

      await setDoc(doc(db, "users", id), newUserDoc);

      toast({
        title: "User Created",
        description: `Successfully created account for ${newUser.fullName}`,
      });

      setNewUser({
        email: "",
        password: "",
        fullName: "",
        phone: "",
        address: "",
        role: "normal",
      });

      setIsCreateDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const openEditModal = (u: UserData) => {
    setSelectedUser(u);
    setEditForm({
      email: u.email,
      password: u.password || "",
      fullName: u.fullName,
      phone: u.phone || "",
      address: u.address || "",
      role: (u.role === 'top' ? 'top' : 'normal'),
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setProcessing(true);

    try {
      const updatedDoc = {
        email: editForm.email.trim().toLowerCase(),
        password: editForm.password,
        full_name: editForm.fullName,
        phone: editForm.phone || null,
        address: editForm.address || null,
        role: editForm.role,
      };

      await setDoc(doc(db, "users", selectedUser.id), updatedDoc, { merge: true });

      toast({
        title: "User Updated",
        description: `Successfully updated account for ${editForm.fullName}`,
      });

      setIsEditDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteUser = (id: string, email: string) => {
    if (user?.email === email) {
      toast({
        title: "Action Prohibited",
        description: "You cannot delete your own currently logged-in top admin account.",
        variant: "destructive",
      });
      return;
    }

    setDeleteConfirmDialog({ open: true, id, email });
  };

  const executeDeleteUser = async () => {
    const { id } = deleteConfirmDialog;
    if (!id) return;
    setProcessing(true);

    try {
      await deleteDoc(doc(db, "users", id));
      toast({
        title: "User Deleted",
        description: "User account has been removed successfully.",
      });
      setDeleteConfirmDialog({ open: false, id: "", email: "" });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user account",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const getRoleIcon = (role: string) => {
    return role === 'top' ? <Shield className="h-4 w-4 text-primary" /> : <UserIcon className="h-4 w-4 text-blue-500" />;
  };

  const getRoleBadgeColor = (role: string) => {
    return role === 'top' 
      ? 'bg-primary/20 text-primary border-primary/30 font-bold' 
      : 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/staff/dashboard")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Top Admin User Management</h1>
                <p className="text-muted-foreground">Create, check, and edit staff and admin accounts (Top role only)</p>
              </div>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New User Account</DialogTitle>
                  <DialogDescription>
                    Create a new user with Top or Normal access privileges.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreateUser} className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name *</label>
                    <Input
                      value={newUser.fullName}
                      onChange={(e) => setNewUser(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="e.g. Ramesh Sharma"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Username / Email *</label>
                    <Input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="user@butwalconstruction.com.np"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password *</label>
                    <Input
                      type="text"
                      value={newUser.password}
                      onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Secure password"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <Input
                        value={newUser.phone}
                        onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+977 98XXXXXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Role *</label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value as 'top' | 'normal' }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Top (Full Manage)</SelectItem>
                          <SelectItem value="normal">Normal (Post & Edit)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Address</label>
                    <Input
                      value={newUser.address}
                      onChange={(e) => setNewUser(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Butwal / Dang, Nepal"
                    />
                  </div>

                  <Button type="submit" className="w-full gradient-primary mt-4" disabled={processing}>
                    {processing ? "Creating..." : "Create User Account"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Role Description Card */}
          <Card className="glass mb-8 border-primary/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/20 text-primary mt-1">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Top Role (Top Administrator)</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Full access rights. Can view, create, edit usernames/passwords, and manage all user accounts in the system.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 mt-1">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Normal Role (Staff / Editor)</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Standard staff access. Can post updates, edit content, manage projects, and handle customer requests without user management privileges.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                System Users ({users.length})
              </CardTitle>
              <CardDescription>
                Check all registered users, usernames, passwords, and assigned roles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No users found in database.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((u) => (
                    <div
                      key={u.id}
                      className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl bg-card border border-border/60 hover:border-primary/50 transition-all gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-background border border-border">
                          {getRoleIcon(u.role)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-foreground text-lg">{u.fullName}</h4>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getRoleBadgeColor(u.role)}`}>
                              {u.role === 'top' ? 'Top Admin' : 'Normal Staff'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground font-mono mt-0.5">{u.email}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Phone: {u.phone || 'N/A'}</span>
                            <span>Address: {u.address || 'N/A'}</span>
                            <span className="flex items-center gap-1 text-primary">
                              <Key size={12} /> Password: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">{u.password || '••••••'}</code>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(u)}
                          className="gap-1.5"
                        >
                          <Edit2 size={14} />
                          Edit User
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(u.id, u.email)}
                          className="gap-1.5"
                        >
                          <Trash2 size={14} />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User Account</DialogTitle>
            <DialogDescription>
              Update username, password, full name, or access role.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateUser} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name *</label>
              <Input
                value={editForm.fullName}
                onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Username / Email *</label>
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password *</label>
              <Input
                type="text"
                value={editForm.password}
                onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role *</label>
                <Select
                  value={editForm.role}
                  onValueChange={(value) => setEditForm(prev => ({ ...prev, role: value as 'top' | 'normal' }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top (Full Manage)</SelectItem>
                    <SelectItem value="normal">Normal (Post & Edit)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                value={editForm.address}
                onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>

            <Button type="submit" className="w-full gradient-primary mt-4" disabled={processing}>
              {processing ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmDialog.open} onOpenChange={(open) => setDeleteConfirmDialog(prev => ({ ...prev, open }))}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" /> Confirm Account Deletion
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete user <strong className="text-foreground">{deleteConfirmDialog.email}</strong>? This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmDialog({ open: false, id: "", email: "" })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={executeDeleteUser}
              disabled={processing}
            >
              {processing ? "Deleting..." : "Yes, Delete User"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminUserManagement;
