-- Create daily_updates table for project updates
CREATE TABLE public.daily_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_by UUID NOT NULL,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.daily_updates ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage all updates"
ON public.daily_updates
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Managers can view and create updates
CREATE POLICY "Managers can view all updates"
ON public.daily_updates
FOR SELECT
USING (has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Managers can create updates"
ON public.daily_updates
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Site staff can view and create updates for their assigned projects
CREATE POLICY "Staff can view assigned project updates"
ON public.daily_updates
FOR SELECT
USING (
  has_role(auth.uid(), 'site_staff'::app_role) AND
  project_id IN (
    SELECT sap.project_id FROM public.staff_assigned_projects sap WHERE sap.user_id = auth.uid()
  )
);

CREATE POLICY "Staff can create updates for assigned projects"
ON public.daily_updates
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'site_staff'::app_role) AND
  project_id IN (
    SELECT sap.project_id FROM public.staff_assigned_projects sap WHERE sap.user_id = auth.uid()
  )
);

-- Customers can view updates for their project
CREATE POLICY "Customers can view their project updates"
ON public.daily_updates
FOR SELECT
USING (
  has_role(auth.uid(), 'customer'::app_role) AND
  project_id IN (
    SELECT p.project_id FROM public.profiles p WHERE p.user_id = auth.uid()
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_daily_updates_updated_at
BEFORE UPDATE ON public.daily_updates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();