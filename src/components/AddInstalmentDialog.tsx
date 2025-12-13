import { useState } from "react";
import { CreditCard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateInstalment, Project } from "@/hooks/useProjectData";

interface AddInstalmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  defaultProjectId?: string;
}

const AddInstalmentDialog = ({ isOpen, onClose, projects, defaultProjectId }: AddInstalmentDialogProps) => {
  const [formData, setFormData] = useState({
    project_id: defaultProjectId || "",
    instalment_number: "",
    amount: "",
    due_date: "",
    status: "pending",
  });
  
  const createInstalment = useCreateInstalment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createInstalment.mutateAsync({
      project_id: formData.project_id,
      instalment_number: parseInt(formData.instalment_number),
      amount: parseFloat(formData.amount),
      due_date: formData.due_date,
      status: formData.status,
    });

    setFormData({
      project_id: defaultProjectId || "",
      instalment_number: "",
      amount: "",
      due_date: "",
      status: "pending",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Add Instalment
          </DialogTitle>
          <DialogDescription>
            Create a new payment instalment for a project
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Project *</label>
            <Select
              value={formData.project_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, project_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name} ({project.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Instalment # *</label>
              <Input
                type="number"
                value={formData.instalment_number}
                onChange={(e) => setFormData(prev => ({ ...prev, instalment_number: e.target.value }))}
                placeholder="1"
                min="1"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount (NPR) *</label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="500000"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date *</label>
              <Input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 gradient-primary"
              disabled={createInstalment.isPending}
            >
              {createInstalment.isPending ? "Adding..." : "Add Instalment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInstalmentDialog;