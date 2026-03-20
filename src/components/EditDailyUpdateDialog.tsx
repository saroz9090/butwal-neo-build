import { useState, useEffect } from "react";
import { Edit, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useUpdateDailyUpdate, DailyUpdate } from "@/hooks/useProjectData";

interface EditDailyUpdateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  update: DailyUpdate | null;
}

const EditDailyUpdateDialog = ({ isOpen, onClose, update }: EditDailyUpdateDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const editUpdate = useUpdateDailyUpdate();

  useEffect(() => {
    if (update) {
      setTitle(update.title);
      setDescription(update.description);
    }
  }, [update]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!update) return;

    await editUpdate.mutateAsync({ id: update.id, title, description });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Update
          </DialogTitle>
          <DialogDescription>Modify the daily update details</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title *</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description *</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1" disabled={editUpdate.isPending}>
              {editUpdate.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDailyUpdateDialog;
