import { useState, useCallback, useMemo } from 'react';
import { useWebsiteContent, WebsiteProject } from '@/contexts/WebsiteContentContext';
import { useToast } from '@/components/ui/use-toast';

export interface ProjectFormData {
  code: string;
  title: string;
  category: string;
  location: string;
  client: string;
  area: string;
  status: "Completed" | "Ongoing" | "Under Planning";
  progress: number;
  image: string;
  images?: string[];
  description: string;
  cost?: string;
  startDate?: string;
  completionDate?: string;
}

export interface ProjectFilterOptions {
  status?: string;
  category?: string;
  searchQuery?: string;
}

/**
 * Custom hook to handle full CRUD operations for construction projects.
 * Integrates Website Content Context (directly backed by Firestore)
 * with built-in validation, toast notifications, search, filtering, and stats.
 */
export const useAdminProjects = () => {
  const { toast } = useToast();
  
  // Website Content Context (now 100% backed by real-time Firestore)
  const { 
    projects, 
    addProject: cmsAddProject, 
    updateProject: cmsUpdateProject, 
    deleteProject: cmsDeleteProject,
    loading: isLoading
  } = useWebsiteContent();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesStatus = selectedStatus === 'All' || project.status === selectedStatus;
      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
      const matchesSearch = 
        !searchQuery ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [projects, selectedStatus, selectedCategory, searchQuery]);

  // Project statistics
  const stats = useMemo(() => {
    const total = projects.length;
    const completed = projects.filter((p) => p.status === 'Completed').length;
    const ongoing = projects.filter((p) => p.status === 'Ongoing').length;
    const planning = projects.filter((p) => p.status === 'Under Planning').length;
    const avgProgress = total > 0 ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / total) : 0;

    return { total, completed, ongoing, planning, avgProgress };
  }, [projects]);

  // Validate Project Input
  const validateProject = useCallback((data: Partial<ProjectFormData>): string | null => {
    if (!data.title || data.title.trim() === '') {
      return 'Project Title is required.';
    }
    if (data.progress !== undefined && (data.progress < 0 || data.progress > 100)) {
      return 'Progress percentage must be between 0 and 100.';
    }
    return null;
  }, []);

  // ADD PROJECT
  const addProject = useCallback(
    async (formData: ProjectFormData) => {
      const validationError = validateProject(formData);
      if (validationError) {
        toast({ title: 'Validation Error', description: validationError, variant: 'destructive' });
        return { success: false, error: validationError };
      }

      try {
        await cmsAddProject({
          code: formData.code || `PROJ-${Date.now().toString().slice(-4)}`,
          title: formData.title,
          category: formData.category || 'Residential',
          location: formData.location || 'Butwal',
          client: formData.client || 'Private Client',
          area: formData.area || '2,500 Sq. Ft.',
          status: formData.status || 'Ongoing',
          progress: formData.progress ?? 0,
          image: formData.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
          images: formData.images,
          description: formData.description || '',
          cost: formData.cost,
          startDate: formData.startDate,
          completionDate: formData.completionDate,
        });

        toast({
          title: 'Project Added Successfully',
          description: `"${formData.title}" has been added to live Firestore records.`,
        });

        return { success: true };
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to create project.';
        toast({ title: 'Error Adding Project', description: errorMsg, variant: 'destructive' });
        return { success: false, error: errorMsg };
      }
    },
    [cmsAddProject, validateProject, toast]
  );

  // EDIT PROJECT
  const editProject = useCallback(
    async (id: string, formData: Partial<ProjectFormData>) => {
      const validationError = validateProject(formData);
      if (validationError) {
        toast({ title: 'Validation Error', description: validationError, variant: 'destructive' });
        return { success: false, error: validationError };
      }

      try {
        await cmsUpdateProject(id, formData);

        toast({
          title: 'Project Updated',
          description: `Project "${formData.title || id}" changes saved successfully in Firestore.`,
        });

        return { success: true };
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to update project.';
        toast({ title: 'Error Updating Project', description: errorMsg, variant: 'destructive' });
        return { success: false, error: errorMsg };
      }
    },
    [cmsUpdateProject, validateProject, toast]
  );

  // DELETE PROJECT
  const deleteProject = useCallback(
    async (id: string) => {
      try {
        const targetProject = projects.find((p) => p.id === id);
        const title = targetProject ? targetProject.title : 'Project';

        await cmsDeleteProject(id);

        toast({
          title: 'Project Deleted',
          description: `"${title}" was removed from the Firestore database.`,
        });

        return { success: true };
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to delete project.';
        toast({ title: 'Delete Failed', description: errorMsg, variant: 'destructive' });
        return { success: false, error: errorMsg };
      }
    },
    [projects, cmsDeleteProject, toast]
  );

  // GET PROJECT BY ID
  const getProjectById = useCallback(
    (id: string) => {
      return projects.find((p) => p.id === id) || null;
    },
    [projects]
  );

  return {
    projects,
    filteredProjects,
    isLoading,
    error: null,
    stats,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    selectedCategory,
    setSelectedCategory,
    addProject,
    editProject,
    deleteProject,
    getProjectById,
    refetch: async () => {}, // No-op since Firestore handles real-time syncing automatically
  };
};
