-- Create projects table first
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  client_id UUID REFERENCES auth.users(id),
  manager_id UUID,
  status TEXT NOT NULL DEFAULT 'planning',
  progress INTEGER NOT NULL DEFAULT 0,
  start_date DATE,
  estimated_completion DATE,
  total_cost DECIMAL(12,2) DEFAULT 0,
  description TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create instalments table
CREATE TABLE public.instalments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  instalment_number INTEGER NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  paid_date DATE,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID,
  assigned_type TEXT NOT NULL DEFAULT 'staff',
  status TEXT NOT NULL DEFAULT 'pending',
  due_date DATE,
  completed_date DATE,
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instalments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Projects RLS Policies
CREATE POLICY "Admins can manage all projects" ON public.projects
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Managers can view all projects" ON public.projects
FOR SELECT USING (has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Managers can update projects" ON public.projects
FOR UPDATE USING (has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Staff can view assigned projects v2" ON public.projects
FOR SELECT USING (
  has_role(auth.uid(), 'site_staff'::app_role) AND
  EXISTS (SELECT 1 FROM public.staff_assigned_projects sap WHERE sap.user_id = auth.uid() AND sap.project_id::text = id::text)
);

CREATE POLICY "Customers can view their project" ON public.projects
FOR SELECT USING (
  has_role(auth.uid(), 'customer'::app_role) AND client_id = auth.uid()
);

-- Instalments RLS Policies
CREATE POLICY "Admins can manage all instalments" ON public.instalments
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Managers can view all instalments" ON public.instalments
FOR SELECT USING (has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Managers can update instalments" ON public.instalments
FOR UPDATE USING (has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Customers can view their instalments" ON public.instalments
FOR SELECT USING (
  has_role(auth.uid(), 'customer'::app_role) AND
  project_id IN (SELECT id FROM public.projects WHERE client_id = auth.uid())
);

-- Tasks RLS Policies
CREATE POLICY "Admins can manage all tasks" ON public.tasks
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Managers can manage all tasks" ON public.tasks
FOR ALL USING (has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Staff can view assigned project tasks" ON public.tasks
FOR SELECT USING (
  has_role(auth.uid(), 'site_staff'::app_role) AND
  EXISTS (SELECT 1 FROM public.staff_assigned_projects sap WHERE sap.user_id = auth.uid() AND sap.project_id::text = project_id::text)
);

CREATE POLICY "Staff can update their assigned tasks" ON public.tasks
FOR UPDATE USING (
  has_role(auth.uid(), 'site_staff'::app_role) AND assigned_to = auth.uid()
);

CREATE POLICY "Customers can view their tasks" ON public.tasks
FOR SELECT USING (
  has_role(auth.uid(), 'customer'::app_role) AND
  project_id IN (SELECT id FROM public.projects WHERE client_id = auth.uid())
);

CREATE POLICY "Customers can update their assigned tasks" ON public.tasks
FOR UPDATE USING (
  has_role(auth.uid(), 'customer'::app_role) AND
  assigned_to = auth.uid() AND assigned_type = 'client'
);

-- Add triggers for updated_at
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_instalments_updated_at
BEFORE UPDATE ON public.instalments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();