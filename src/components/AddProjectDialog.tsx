import { useState } from "react";
import { X, Plus, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateProject } from "@/hooks/useProjectData";

interface AddProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProjectDialog = ({ isOpen, onClose }: AddProjectDialogProps) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    status: "planning",
    description: "",
    address: "",
    start_date: "",
    estimated_completion: "",
    total_cost: "",
  });
  
  const createProject = useCreateProject();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createProject.mutateAsync({
      code: formData.code,
      name: formData.name,
      status: formData.status,
      description: formData.description || null,
      address: formData.address || null,
      start_date: formData.start_date || null,
      estimated_completion: formData.estimated_completion || null,
      total_cost: formData.total_cost ? parseFloat(formData.total_cost) : 0,
      progress: 0,
    });

    setFormData({
      code: "",
      name: "",
      status: "planning",
      description: "",
      address: "",
      start_date: "",
      estimated_completion: "",
      total_cost: "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Create New Project
          </DialogTitle>
          <DialogDescription>
            Add a new construction project to the system
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Code *</label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="e.g., RES-2024-001"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Modern Residence"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Estimated Completion</label>
              <Input
                type="date"
                value={formData.estimated_completion}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_completion: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Total Cost (NPR)</label>
            <Input
              type="number"
              value={formData.total_cost}
              onChange={(e) => setFormData(prev => ({ ...prev, total_cost: e.target.value }))}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Project location"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Project details..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 gradient-primary"
              disabled={createProject.isPending}
            >
              {createProject.isPending ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectDialog;