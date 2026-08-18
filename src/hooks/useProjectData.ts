import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';

export interface Project {
  id: string;
  code: string;
  name: string;
  client_id: string | null;
  manager_id: string | null;
  status: string;
  progress: number;
  start_date: string | null;
  estimated_completion: string | null;
  total_cost: number;
  description: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface Instalment {
  id: string;
  project_id: string;
  instalment_number: number;
  amount: number;
  due_date: string;
  status: string;
  paid_date: string | null;
  payment_method: string | null;
  notes: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  assigned_to: string | null;
  assigned_type: string;
  status: string;
  due_date: string | null;
  completed_date: string | null;
  priority: string;
  created_at: string;
}

export interface DailyUpdate {
  id: string;
  project_id: string;
  title: string;
  description: string;
  created_by: string;
  images: string[];
  created_at: string;
}

const SEED_PROJECTS: Project[] = [
  {
    id: "proj-chaudhary",
    code: "BUT-RES-2025-01",
    name: "Chaudhary Residential Complex",
    client_id: "user-client",
    manager_id: "user-manager",
    status: "Ongoing",
    progress: 65,
    start_date: "2025-01-15",
    estimated_completion: "2026-06-30",
    total_cost: 22000000,
    description: "A state-of-the-art residential complex featuring modern amenities, sustainable construction, and earthquake-resistant framing.",
    address: "Butwal-11, Naharpur",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "proj-sharma",
    code: "BUT-RES-2025-02",
    name: "Sharma Residence Project",
    client_id: "user-client",
    manager_id: "user-manager",
    status: "Ongoing",
    progress: 50,
    start_date: "2025-02-01",
    estimated_completion: "2026-04-15",
    total_cost: 17500000,
    description: "Modern 2.5-story residential house designed with a dual-purpose layout for rental income and premium owner living.",
    address: "Butwal-13, Jitgadi",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "proj-pandey",
    code: "BUT-RES-2024-03",
    name: "Pandey Residence",
    client_id: "user-client",
    manager_id: "user-manager",
    status: "Completed",
    progress: 100,
    start_date: "2024-02-10",
    estimated_completion: "2024-12-20",
    total_cost: 14500000,
    description: "An elite 1.5-story box-type modern residence, standing out as the benchmark for contemporary architecture.",
    address: "Ghodha, Rupandehi",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "proj-amarpath",
    code: "BUT-COM-2025-04",
    name: "Amarpath Commercial Project",
    client_id: "user-client",
    manager_id: "user-manager",
    status: "Completed",
    progress: 100,
    start_date: "2024-05-01",
    estimated_completion: "2025-09-30",
    total_cost: 38000000,
    description: "A striking 4-story semi-commercial landmark combining premium retail spaces with luxury urban living.",
    address: "Butwal-4, Amarpath",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "proj-dang-complex",
    code: "DANG-COM-2025-05",
    name: "Dang Commercial Shopping Complex",
    client_id: "user-client",
    manager_id: "user-manager",
    status: "Ongoing",
    progress: 72,
    start_date: "2025-01-10",
    estimated_completion: "2026-10-30",
    total_cost: 45000000,
    description: "Multi-level commercial complex with basement parking, glass curtain facade, and modern central fire safety systems.",
    address: "Ghorahi Main Road, Dang",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "proj-health-tech",
    code: "BUT-HOS-2025-06",
    name: "Health Tech Multi-Specialty Clinic",
    client_id: "user-client",
    manager_id: "user-manager",
    status: "Ongoing",
    progress: 45,
    start_date: "2025-06-01",
    estimated_completion: "2026-08-30",
    total_cost: 29000000,
    description: "Turnkey medical facility construction featuring lead-lined radiation rooms, sterile flooring, and emergency power generator rooms.",
    address: "Hospital Line, Butwal",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "proj-luxury-duplex",
    code: "BUT-RES-2025-07",
    name: "Modern Luxury Duplex Residence",
    client_id: "user-client",
    manager_id: "user-manager",
    status: "Completed",
    progress: 100,
    start_date: "2024-03-01",
    estimated_completion: "2025-11-15",
    total_cost: 18500000,
    description: "4-Story modern earthquake-resistant residence with cantilever balconies, solar integration, and high-end interior woodwork.",
    address: "Kalikanagar, Butwal-11",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const SEED_INSTALMENTS: Instalment[] = [
  {
    id: "inst-1",
    project_id: "proj-1",
    instalment_number: 1,
    amount: 500000,
    due_date: "2025-04-01",
    status: "Paid",
    paid_date: "2025-04-01",
    payment_method: "Bank Transfer",
    notes: "Advance booking deposit",
    created_at: new Date().toISOString()
  },
  {
    id: "inst-2",
    project_id: "proj-1",
    instalment_number: 2,
    amount: 400000,
    due_date: "2025-08-01",
    status: "Paid",
    paid_date: "2025-07-28",
    payment_method: "Cheque",
    notes: "Plinth beam foundation completion level",
    created_at: new Date().toISOString()
  },
  {
    id: "inst-3",
    project_id: "proj-1",
    instalment_number: 3,
    amount: 300000,
    due_date: "2025-12-15",
    status: "Unpaid",
    paid_date: null,
    payment_method: null,
    notes: "First-floor slab casting level",
    created_at: new Date().toISOString()
  },
  {
    id: "inst-4",
    project_id: "proj-1",
    instalment_number: 4,
    amount: 650000,
    due_date: "2026-06-15",
    status: "Unpaid",
    paid_date: null,
    payment_method: null,
    notes: "Final finishing and keys handover stage",
    created_at: new Date().toISOString()
  }
];

const SEED_TASKS: Task[] = [
  {
    id: "task-1",
    project_id: "proj-1",
    title: "Foundation Excavation",
    description: "Excavating earth to proper depths as per soil bearing capacity report and structural drawings.",
    assigned_to: "Binod Site Staff",
    assigned_type: "Staff",
    status: "Completed",
    due_date: "2024-04-15",
    completed_date: "2024-04-12",
    priority: "High",
    created_at: new Date().toISOString()
  },
  {
    id: "task-2",
    project_id: "proj-1",
    title: "Raft Slab Casting",
    description: "Pouring concrete mix M25 for the basement/plinth foundation raft structure.",
    assigned_to: "Binod Site Staff",
    assigned_type: "Staff",
    status: "Completed",
    due_date: "2024-06-30",
    completed_date: "2024-06-28",
    priority: "High",
    created_at: new Date().toISOString()
  },
  {
    id: "task-3",
    project_id: "proj-1",
    title: "Brickwork & Plastering (Ground Floor)",
    description: "Constructing internal partitions and external walls with high-grade fly ash bricks.",
    assigned_to: "Binod Site Staff",
    assigned_type: "Staff",
    status: "Completed",
    due_date: "2024-11-20",
    completed_date: "2024-11-18",
    priority: "Medium",
    created_at: new Date().toISOString()
  },
  {
    id: "task-4",
    project_id: "proj-1",
    title: "First Floor Framing & Slab",
    description: "Preparing shuttering and placing rebar for casting the first floor slab.",
    assigned_to: "Binod Site Staff",
    assigned_type: "Staff",
    status: "Ongoing",
    due_date: "2025-10-15",
    completed_date: null,
    priority: "High",
    created_at: new Date().toISOString()
  },
  {
    id: "task-5",
    project_id: "proj-1",
    title: "Electrical Piping & Plumbing",
    description: "Embedding heavy-duty PVC conduits in the brick walls and running plumbing water/waste lines.",
    assigned_to: "Binod Site Staff",
    assigned_type: "Staff",
    status: "Pending",
    due_date: "2026-02-10",
    completed_date: null,
    priority: "Medium",
    created_at: new Date().toISOString()
  },
  {
    id: "task-6",
    project_id: "proj-1",
    title: "Final Paint & Interior Woodwork",
    description: "Applying premium exterior grade emulsion paint and installing modular kitchen cabinets.",
    assigned_to: "Binod Site Staff",
    assigned_type: "Staff",
    status: "Pending",
    due_date: "2026-06-01",
    completed_date: null,
    priority: "Low",
    created_at: new Date().toISOString()
  }
];

const SEED_DAILY_UPDATES: DailyUpdate[] = [
  {
    id: "update-1",
    project_id: "proj-1",
    title: "Pillar Reinforcement Complete",
    description: "Satyawati Devi structural engineers approved the Fe 500D steel frame reinforcement for the first-floor columns. Concrete mix M25 ready.",
    created_by: "Binod Site Staff",
    images: ["https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800"],
    created_at: new Date().toISOString()
  },
  {
    id: "update-2",
    project_id: "proj-1",
    title: "Excavation Completed & Anti-Termite Treatment Done",
    description: "Excavation reached the design level. Anti-termite chemical spray applied to safeguard the entire structure foundation.",
    created_by: "Binod Site Staff",
    images: ["https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800"],
    created_at: new Date().toISOString()
  }
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cleanUndefined = (obj: any): any => {
  if (obj === null || obj === undefined) return null;
  const cleaned = { ...obj };
  Object.keys(cleaned).forEach((key) => {
    if (cleaned[key] === undefined) {
      delete cleaned[key];
    } else if (cleaned[key] && typeof cleaned[key] === "object" && !Array.isArray(cleaned[key])) {
      cleaned[key] = cleanUndefined(cleaned[key]);
    }
  });
  return cleaned;
};

// Helper to seed Firestore if empty
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function checkAndSeed(collectionName: string, seedData: any[]) {
  // Bypassed: Only show real data stored inside Firebase Firestore as requested
  return;
}

// Projects hooks
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      await checkAndSeed('projects', SEED_PROJECTS);
      const snap = await getDocs(collection(db, 'projects'));
      const list: Project[] = [];
      snap.forEach((doc) => {
        list.push(doc.data() as Project);
      });
      return list.sort((a, b) => b.created_at.localeCompare(a.created_at));
    },
  });
};

export const useProject = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!projectId) return null;
      const docRef = doc(db, 'projects', projectId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as Project;
      }
      return null;
    },
    enabled: !!projectId,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (project: { code: string; name: string; status?: string; progress?: number; description?: string | null; address?: string | null; start_date?: string | null; estimated_completion?: string | null; total_cost?: number; client_id?: string | null; manager_id?: string | null }) => {
      const id = `proj-${Date.now()}`;
      const newProj: Project = {
        ...project,
        id,
        status: project.status || 'Ongoing',
        progress: project.progress || 0,
        description: project.description || null,
        address: project.address || null,
        start_date: project.start_date || null,
        estimated_completion: project.estimated_completion || null,
        total_cost: project.total_cost || 0,
        client_id: project.client_id || null,
        manager_id: project.manager_id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await setDoc(doc(db, 'projects', id), cleanUndefined(newProj));
      return newProj;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Success', description: 'Project created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Project> & { id: string }) => {
      const docRef = doc(db, 'projects', id);
      await setDoc(docRef, cleanUndefined({ ...updates, updated_at: new Date().toISOString() }), { merge: true });
      const updatedSnap = await getDoc(docRef);
      return updatedSnap.data() as Project;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.id] });
      toast({ title: 'Success', description: 'Project updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, 'projects', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Success', description: 'Project deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

// Instalments hooks
export const useInstalments = (projectId?: string) => {
  return useQuery({
    queryKey: ['instalments', projectId],
    queryFn: async () => {
      await checkAndSeed('instalments', SEED_INSTALMENTS);
      const snap = await getDocs(collection(db, 'instalments'));
      const list: Instalment[] = [];
      snap.forEach((doc) => {
        const item = doc.data() as Instalment;
        if (!projectId || item.project_id === projectId) {
          list.push(item);
        }
      });
      return list.sort((a, b) => a.instalment_number - b.instalment_number);
    },
  });
};

export const useCreateInstalment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (instalment: { project_id: string; instalment_number: number; amount: number; due_date: string; status?: string; paid_date?: string | null; payment_method?: string | null; notes?: string | null }) => {
      const id = `inst-${Date.now()}`;
      const newInst: Instalment = {
        ...instalment,
        id,
        status: instalment.status || 'Unpaid',
        paid_date: instalment.paid_date || null,
        payment_method: instalment.payment_method || null,
        notes: instalment.notes || null,
        created_at: new Date().toISOString(),
      };
      await setDoc(doc(db, 'instalments', id), cleanUndefined(newInst));
      return newInst;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instalments'] });
      toast({ title: 'Success', description: 'Instalment created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateInstalment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Instalment> & { id: string }) => {
      const docRef = doc(db, 'instalments', id);
      await setDoc(docRef, cleanUndefined(updates), { merge: true });
      const docSnap = await getDoc(docRef);
      return docSnap.data() as Instalment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instalments'] });
      toast({ title: 'Success', description: 'Instalment updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useDeleteInstalment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, 'instalments', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instalments'] });
      toast({ title: 'Success', description: 'Instalment deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

// Tasks hooks
export const useTasks = (projectId?: string) => {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      await checkAndSeed('tasks', SEED_TASKS);
      const snap = await getDocs(collection(db, 'tasks'));
      const list: Task[] = [];
      snap.forEach((doc) => {
        const item = doc.data() as Task;
        if (!projectId || item.project_id === projectId) {
          list.push(item);
        }
      });
      return list.sort((a, b) => b.created_at.localeCompare(a.created_at));
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (task: { project_id: string; title: string; description?: string | null; assigned_to?: string | null; assigned_type?: string; status?: string; priority?: string; due_date?: string | null; completed_date?: string | null }) => {
      const id = `task-${Date.now()}`;
      const newT: Task = {
        ...task,
        id,
        description: task.description || null,
        assigned_to: task.assigned_to || null,
        assigned_type: task.assigned_type || 'Staff',
        status: task.status || 'Pending',
        priority: task.priority || 'Medium',
        due_date: task.due_date || null,
        completed_date: task.completed_date || null,
        created_at: new Date().toISOString(),
      };
      await setDoc(doc(db, 'tasks', id), cleanUndefined(newT));
      return newT;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({ title: 'Success', description: 'Task created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
      const docRef = doc(db, 'tasks', id);
      await setDoc(docRef, cleanUndefined(updates), { merge: true });
      const docSnap = await getDoc(docRef);
      return docSnap.data() as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({ title: 'Success', description: 'Task updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, 'tasks', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({ title: 'Success', description: 'Task deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

// Daily Updates hooks
export const useDailyUpdates = (projectId?: string) => {
  return useQuery({
    queryKey: ['daily_updates', projectId],
    queryFn: async () => {
      await checkAndSeed('daily_updates', SEED_DAILY_UPDATES);
      const snap = await getDocs(collection(db, 'daily_updates'));
      const list: DailyUpdate[] = [];
      snap.forEach((doc) => {
        const item = doc.data() as DailyUpdate;
        if (!projectId || item.project_id === projectId) {
          list.push(item);
        }
      });
      return list.sort((a, b) => b.created_at.localeCompare(a.created_at));
    },
  });
};

export const useCreateDailyUpdate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (update: { project_id: string; title: string; description: string; created_by: string; images?: string[] }) => {
      const id = `update-${Date.now()}`;
      const newU: DailyUpdate = {
        ...update,
        id,
        images: update.images || [],
        created_at: new Date().toISOString(),
      };
      await setDoc(doc(db, 'daily_updates', id), cleanUndefined(newU));
      return newU;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily_updates'] });
      toast({ title: 'Success', description: 'Update posted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateDailyUpdate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; title?: string; description?: string; images?: string[] }) => {
      const docRef = doc(db, 'daily_updates', id);
      await setDoc(docRef, cleanUndefined(updates), { merge: true });
      const docSnap = await getDoc(docRef);
      return docSnap.data() as DailyUpdate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily_updates'] });
      toast({ title: 'Success', description: 'Update edited successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useDeleteDailyUpdate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, 'daily_updates', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily_updates'] });
      toast({ title: 'Success', description: 'Update deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

// Customer project hook
export const useCustomerProject = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['customer_project', user?.id],
    queryFn: async () => {
      if (!user) return null;
      // Get all projects and return the one matching this client_id
      await checkAndSeed('projects', SEED_PROJECTS);
      const snap = await getDocs(collection(db, 'projects'));
      let clientProj: Project | null = null;
      snap.forEach((doc) => {
        const p = doc.data() as Project;
        if (p.client_id === user.id) {
          clientProj = p;
        }
      });
      return clientProj;
    },
    enabled: !!user,
  });
};
