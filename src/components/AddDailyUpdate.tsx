import { useState, useRef } from "react";
import { Plus, X, Upload, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCreateDailyUpdate, useProjects } from "@/hooks/useProjectData";
import { uploadImageToFreeCloud } from "@/lib/imageUpload";

interface AddDailyUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  projects?: { id: string; name: string }[];
}

const AddDailyUpdate = ({ isOpen, onClose, onSuccess }: AddDailyUpdateProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: projects = [] } = useProjects();
  const createUpdate = useCreateDailyUpdate();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + previews.length > 5) {
      toast({ title: "Limit", description: "Max 5 images allowed", variant: "destructive" });
      return;
    }

    setIsUploadingPhotos(true);
    try {
      const newUrls: string[] = [];
      for (const file of files) {
        const result = await uploadImageToFreeCloud(file);
        newUrls.push(result.url);
      }
      setPreviews(prev => [...prev, ...newUrls]);
      toast({
        title: "Photos Processed",
        description: `${newUrls.length} photo(s) compressed & prepared for update.`,
      });
    } catch (err) {
      console.error(err);
      toast({ title: "Upload Error", description: "Failed to process photo", variant: "destructive" });
    } finally {
      setIsUploadingPhotos(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Error", description: "You must be logged in", variant: "destructive" });
      return;
    }
    if (!projectId || !title || !description) {
      toast({ title: "Missing Fields", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    try {
      await createUpdate.mutateAsync({
        project_id: projectId,
        title,
        description,
        created_by: user.id,
        images: previews,
      });
      setTitle("");
      setDescription("");
      setProjectId("");
      setPreviews([]);
      onSuccess?.();
      onClose();
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl sm:max-w-3xl max-h-[88vh] overflow-y-auto px-6 py-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Plus className="h-5 w-5 text-primary" />
            Add Daily Progress Update
          </DialogTitle>
          <DialogDescription>Post a progress update for a construction project with site photos.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Project *</label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name} ({project.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Title *</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Foundation Work Completed" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description *</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe today's progress..." rows={4} required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Images (max 5)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-video rounded-lg overflow-hidden border">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {previews.length < 5 && (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                disabled={isUploadingPhotos}
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploadingPhotos ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin text-primary" />
                    Compressing & Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Add Progress Photos
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1" disabled={createUpdate.isPending}>
              {createUpdate.isPending ? "Posting..." : "Post Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDailyUpdate;
