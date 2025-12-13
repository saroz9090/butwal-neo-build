-- Drop ALL existing policies on daily_updates
DROP POLICY IF EXISTS "Admins can manage all updates" ON public.daily_updates;
DROP POLICY IF EXISTS "Managers can view all updates" ON public.daily_updates;
DROP POLICY IF EXISTS "Managers can create updates" ON public.daily_updates;
DROP POLICY IF EXISTS "Staff can view assigned project updates" ON public.daily_updates;
DROP POLICY IF EXISTS "Staff can create updates for assigned projects" ON public.daily_updates;
DROP POLICY IF EXISTS "Customers can view their project updates" ON public.daily_updates;

-- Now we can drop and recreate the column
ALTER TABLE public.daily_updates DROP COLUMN project_id CASCADE;
ALTER TABLE public.daily_updates ADD COLUMN project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;

-- Drop profiles project_id
ALTER TABLE public.profiles DROP COLUMN project_id CASCADE;
ALTER TABLE public.profiles ADD COLUMN project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL;

-- Drop staff_assigned_projects project_id  
ALTER TABLE public.staff_assigned_projects DROP COLUMN project_id CASCADE;
ALTER TABLE public.staff_assigned_projects ADD COLUMN project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;

-- Recreate all daily_updates policies
CREATE POLICY "Admins can manage all updates" ON public.daily_updates
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Managers can view all updates" ON public.daily_updates
FOR SELECT USING (has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Managers can create updates" ON public.daily_updates
FOR INSERT WITH CHECK (has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Staff can view assigned project updates" ON public.daily_updates
FOR SELECT USING (
  has_role(auth.uid(), 'site_staff'::app_role) AND
  project_id IN (SELECT sap.project_id FROM public.staff_assigned_projects sap WHERE sap.user_id = auth.uid())
);

CREATE POLICY "Staff can create updates for assigned projects" ON public.daily_updates
FOR INSERT WITH CHECK (
  has_role(auth.uid(), 'site_staff'::app_role) AND
  project_id IN (SELECT sap.project_id FROM public.staff_assigned_projects sap WHERE sap.user_id = auth.uid())
);

CREATE POLICY "Customers can view their project updates" ON public.daily_updates
FOR SELECT USING (
  has_role(auth.uid(), 'customer'::app_role) AND
  project_id IN (SELECT id FROM public.projects WHERE client_id = auth.uid())
);

-- Recreate staff policies for projects
DROP POLICY IF EXISTS "Staff can view assigned projects v2" ON public.projects;
CREATE POLICY "Staff can view assigned projects" ON public.projects
FOR SELECT USING (
  has_role(auth.uid(), 'site_staff'::app_role) AND
  id IN (SELECT sap.project_id FROM public.staff_assigned_projects sap WHERE sap.user_id = auth.uid())
);

-- Recreate staff policies for tasks
DROP POLICY IF EXISTS "Staff can view assigned project tasks" ON public.tasks;
CREATE POLICY "Staff can view assigned project tasks" ON public.tasks
FOR SELECT USING (
  has_role(auth.uid(), 'site_staff'::app_role) AND
  project_id IN (SELECT sap.project_id FROM public.staff_assigned_projects sap WHERE sap.user_id = auth.uid())
);