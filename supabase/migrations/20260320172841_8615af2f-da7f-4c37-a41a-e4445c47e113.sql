
-- Create storage bucket for daily update images
INSERT INTO storage.buckets (id, name, public) VALUES ('daily-updates', 'daily-updates', true);

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'daily-updates');

-- Allow public read access
CREATE POLICY "Public can view daily update images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'daily-updates');

-- Allow creators and admins to delete images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'daily-updates' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin')));
