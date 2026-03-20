

## Plan: Enhance Daily Updates & Provide User Management Guide

### What needs to be done

**1. Add image upload to Daily Updates (storage bucket + UI)**
- Create a storage bucket for update images
- Update AddDailyUpdate component to support image upload (select multiple images, preview, upload to storage)
- Display uploaded images in both Staff and Customer dashboards

**2. Add edit/delete functionality for daily updates in Staff Dashboard**
- Add edit and delete buttons on each daily update card
- Create an EditDailyUpdate dialog component
- Add `useUpdateDailyUpdate` hook in useProjectData.ts

**3. Enhance Customer Dashboard daily updates view**
- Show who posted the update (fetch creator profile name)
- Add image gallery view for update images
- Better timeline-style layout for updates

**4. Add a "Daily Updates" dedicated section in Staff Dashboard overview**
- Show recent updates in the overview tab with quick-post button
- Show update count in stats cards

### Technical Details

**Storage bucket migration:**
```sql
-- Create storage bucket for daily update images
INSERT INTO storage.buckets (id, name, public) VALUES ('daily-updates', 'daily-updates', true);
-- RLS policies for authenticated users to upload/view
```

**New hook - useUpdateDailyUpdate:**
- Mutation to update title, description of existing daily updates
- Only admin/manager or the creator can edit

**Files to modify:**
- `src/hooks/useProjectData.ts` - Add useUpdateDailyUpdate hook
- `src/components/AddDailyUpdate.tsx` - Add image upload with drag-drop, preview thumbnails
- `src/pages/dashboards/StaffDashboard.tsx` - Add edit/delete buttons on updates, show updates in overview
- `src/pages/dashboards/CustomerDashboard.tsx` - Enhance update display with creator info and image gallery

**Files to create:**
- `src/components/EditDailyUpdateDialog.tsx` - Edit dialog for existing updates

---

### How to Add Users and Updates (Guide)

**Adding Users (Admin only):**
1. Go to `/admin/setup` to create your first admin account
2. Login at `/login` with admin credentials
3. Navigate to Staff Dashboard → Team tab → "Add Staff" button, or go directly to `/admin/users`
4. Click "Create User" → fill in name, email, password, select role (customer/manager/site_staff) → Create
5. Share the email and password with the user - they can only sign in, not sign up

**Posting Daily Updates (Admin/Manager/Site Staff):**
1. Login → Staff Dashboard
2. Click the "Post Update" button in the header
3. Select project, add title and description → Post Update
4. Updates appear in both staff and customer dashboards

