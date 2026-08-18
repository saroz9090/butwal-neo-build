import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  doc, 
  getDocs,
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot
} from "firebase/firestore";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import chaudhary1_img1 from "@/assets/chaudhary-1.jpeg";
import chaudhary1_img2 from "@/assets/chaudhary-2.jpeg";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  image: string;
  images?: string[];
  readTime: string;
  content?: string;
  isPublished: boolean;
}

export interface WebsiteProject {
  id: string;
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

export interface HouseDesign {
  id: string;
  title: string;
  style: string;
  description: string;
  images: string[];
  tags: string[];
  features: string[];
  baseViews: number;
  growthRate: number;
  currentViews?: number;
}

export interface WebsiteContentSettings {
  companyName: string;
  tagline: string;
  phone1: string;
  phone2: string;
  email: string;
  butwalAddress: string;
  dangAddress: string;
  announcementText: string;
  announcementLink: string;
  announcementEnabled: boolean;
  facebookUrl: string;
  tiktokUrl: string;
  whatsappNumber: string;
  aboutStory: string;
  heroHeading: string;
  heroSubheading: string;
}

interface WebsiteContentContextType {
  // Blog
  blogPosts: BlogPost[];
  addBlogPost: (post: Omit<BlogPost, "id">) => void;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  seedSampleBlogs: () => Promise<{ success: boolean; count: number }>;

  // Projects
  projects: WebsiteProject[];
  addProject: (project: Omit<WebsiteProject, "id">) => void;
  updateProject: (id: string, project: Partial<WebsiteProject>) => void;
  deleteProject: (id: string) => void;
  migrateProjectsToFirebase: (force?: boolean) => Promise<{ success: boolean; count?: number; error?: unknown }>;
  seedSampleProjects: () => Promise<{ success: boolean; count: number }>;

  // Designs
  designs: HouseDesign[];
  addDesign: (design: Omit<HouseDesign, "id">) => void;
  updateDesign: (id: string, design: Partial<HouseDesign>) => void;
  deleteDesign: (id: string) => void;
  seedSampleDesigns: () => Promise<{ success: boolean; count: number }>;

  // Website Settings
  settings: WebsiteContentSettings;
  updateSettings: (newSettings: Partial<WebsiteContentSettings>) => void;
  resetToDefaults: () => void;
  loading: boolean;
}

const DEFAULT_SETTINGS: WebsiteContentSettings = {
  companyName: "Butwal Construction and Builders",
  tagline: "Professional Construction Services in Dang, Butwal & Surrounding Areas",
  phone1: "+977 9857076965",
  phone2: "+977 9869472803",
  email: "info@butwalconstruction.com.np",
  butwalAddress: "Butwal-11, Kalikanagar, Horizonchowk, Annapurna Path, Rupandehi, Nepal",
  dangAddress: "Ghorahi-15, Main Road, Dang, Nepal",
  announcementText: "Dang Regional Branch Open! Serving Ghorahi, Tulsipur & Lamahi with turnkey house construction & 3D designs.",
  announcementLink: "/dang",
  announcementEnabled: true,
  facebookUrl: "https://facebook.com/butwalconstruction",
  tiktokUrl: "https://tiktok.com/@butwalconstruction",
  whatsappNumber: "9779763653181",
  aboutStory: "Butwal Construction & Builders Pvt. Ltd., together with its dedicated Dang branch (Dang Construction & Builders), delivers end-to-end turnkey residential, commercial & municipal infrastructure backed by experienced certified civil engineers and modern construction technology.",
  heroHeading: "Professional Construction Services in Butwal & Dang",
  heroSubheading: "From house construction and planning to complete project execution, Butwal Construction & Builders provides reliable, earthquake-resistant construction solutions with our established headquarters in Butwal and regional branch in Dang.",
};

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: "blog-1",
    title: "Modern Construction Techniques for 2026 in Nepal",
    excerpt: "Explore the latest innovations in earthquake-resistant building design, M25 concrete mixes, and sustainable construction in Rupandehi & Dang.",
    category: "Technology",
    date: "2026-02-01",
    author: "Er. Prem Prasad Kandel",
    image: project1,
    readTime: "5 min read",
    content: "Building in Nepal requires careful attention to earthquake safety codes (NBC 105:2020), high-grade rebar (Fe 500D), and proper soil testing prior to raft or isolated footing construction. Our engineering team shares essential guidelines for prospective home builders.",
    isPublished: true,
  },
  {
    id: "blog-2",
    title: "Choosing the Right TMT Steel & Cement for Your House in Rupandehi",
    excerpt: "A comprehensive guide to selecting IS certified rebar and OPC 53 Grade cement to guarantee structural longevity.",
    category: "Tips & Guides",
    date: "2026-01-20",
    author: "Satyawati Devi Hardware Expert",
    image: project2,
    readTime: "7 min read",
    content: "Selecting quality materials like Jagdamba/Panchakanya TMT steel and Palpa/Argakhanchi Cement ensures your house resists thermal contraction and ground tremors effectively.",
    isPublished: true,
  },
  {
    id: "blog-3",
    title: "How Municipal Building Map Approvals (Naksha Pass) Work in Butwal & Ghorahi",
    excerpt: "Step-by-step procedure for getting your architectural floor plan approved by local sub-metropolitan city offices.",
    category: "Guide",
    date: "2026-01-10",
    author: "Architectural Planning Desk",
    image: project1,
    readTime: "6 min read",
    content: "From soil test reporting to structural analysis and municipal digital system filing (DIMS), we handle the entire building map approval process seamlessly.",
    isPublished: true,
  },
];

export const INITIAL_PROJECTS: WebsiteProject[] = [
  {
    id: "proj-chaudhary",
    code: "BUT-RES-2025-01",
    title: "Chaudhary Residential Complex",
    category: "Residential",
    location: "Butwal-11, Naharpur",
    client: "Chaudhary Family",
    area: "4,200 Sq. Ft.",
    status: "Ongoing",
    progress: 65,
    image: chaudhary1_img1,
    images: [chaudhary1_img1, chaudhary1_img2],
    description: "A state-of-the-art residential complex featuring modern amenities, sustainable construction, and earthquake-resistant framing.",
    cost: "NPR 2.20 Crore",
    startDate: "2025-01-15",
    completionDate: "2026-06-30",
  },
  {
    id: "proj-sharma",
    code: "BUT-RES-2025-02",
    title: "Sharma Residence Project",
    category: "Residential",
    location: "Butwal-13, Jitgadi",
    client: "Dr. R. Sharma",
    area: "3,200 Sq. Ft.",
    status: "Ongoing",
    progress: 50,
    image: project2,
    images: [project2, project1],
    description: "Modern 2.5-story residential house designed with a dual-purpose layout for rental income and premium owner living.",
    cost: "NPR 1.75 Crore",
    startDate: "2025-02-01",
    completionDate: "2026-04-15",
  },
  {
    id: "proj-pandey",
    code: "BUT-RES-2024-03",
    title: "Pandey Residence",
    category: "Residential",
    location: "Ghodha, Rupandehi",
    client: "Pandey Family",
    area: "2,800 Sq. Ft.",
    status: "Completed",
    progress: 100,
    image: project1,
    images: [project1, project2],
    description: "An elite 1.5-story box-type modern residence, standing out as the benchmark for contemporary architecture.",
    cost: "NPR 1.45 Crore",
    startDate: "2024-02-10",
    completionDate: "2024-12-20",
  },
  {
    id: "proj-amarpath",
    code: "BUT-COM-2025-04",
    title: "Amarpath Commercial Project",
    category: "Commercial & Residential",
    location: "Butwal-4, Amarpath",
    client: "Amarpath Commercial Syndicate",
    area: "8,500 Sq. Ft.",
    status: "Completed",
    progress: 100,
    image: project2,
    images: [project2, project1],
    description: "A striking 4-story semi-commercial landmark combining premium retail spaces with luxury urban living.",
    cost: "NPR 3.80 Crore",
    startDate: "2024-05-01",
    completionDate: "2025-09-30",
  },
  {
    id: "proj-dang-complex",
    code: "DANG-COM-2025-05",
    title: "Dang Commercial Shopping Complex",
    category: "Commercial",
    location: "Ghorahi Main Road, Dang",
    client: "Dang Business Syndicate",
    area: "12,500 Sq. Ft.",
    status: "Ongoing",
    progress: 72,
    image: project2,
    images: [project2, project1],
    description: "Multi-level commercial complex with basement parking, glass curtain facade, and modern central fire safety systems.",
    cost: "NPR 4.50 Crore",
    startDate: "2025-01-10",
    completionDate: "2026-10-30",
  },
  {
    id: "proj-health-tech",
    code: "BUT-HOS-2025-06",
    title: "Health Tech Multi-Specialty Clinic",
    category: "Healthcare / Commercial",
    location: "Hospital Line, Butwal",
    client: "Lumbini Health Care Pvt. Ltd.",
    area: "6,200 Sq. Ft.",
    status: "Ongoing",
    progress: 45,
    image: project1,
    images: [project1, project2],
    description: "Turnkey medical facility construction featuring lead-lined radiation rooms, sterile flooring, and emergency power generator rooms.",
    cost: "NPR 2.90 Crore",
    startDate: "2025-06-01",
    completionDate: "2026-08-30",
  },
  {
    id: "proj-luxury-duplex",
    code: "BUT-RES-2025-07",
    title: "Modern Luxury Duplex Residence",
    category: "Residential",
    location: "Kalikanagar, Butwal-11",
    client: "Dr. K. Adhikari",
    area: "3,800 Sq. Ft.",
    status: "Completed",
    progress: 100,
    image: project1,
    images: [project1, project2],
    description: "4-Story modern earthquake-resistant residence with cantilever balconies, solar integration, and high-end interior woodwork.",
    cost: "NPR 1.85 Crore",
    startDate: "2024-03-01",
    completionDate: "2025-11-15",
  },
];

export const INITIAL_DESIGNS: HouseDesign[] = [
  {
    id: "design-1",
    title: "Neoclassical Villa",
    style: "Neoclassical",
    description: "Elegant neoclassical villa with symmetrical design, grand columns, and classical details. Perfect for modern luxury living.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", 
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
    ],
    tags: ["neoclassical", "villa", "luxury", "classical", "columns"],
    features: ["Grand Entrance", "Symmetrical Design", "Classical Columns", "Luxury Finishes"],
    baseViews: 150,
    growthRate: 0.0002
  },
  {
    id: "design-2",
    title: "Modern Minimalist House",
    style: "Modern",
    description: "Clean lines and minimalist design with focus on functionality and natural light.",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"],
    tags: ["modern", "minimalist", "contemporary", "clean"],
    features: ["Open Floor Plan", "Large Windows", "Minimalist Design"],
    baseViews: 120,
    growthRate: 0.0001
  },
  {
    id: "design-3",
    title: "Traditional Nepali House",
    style: "Traditional",
    description: "Authentic Nepali architecture with wooden carvings and traditional elements.",
    images: ["https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=800"],
    tags: ["traditional", "nepali", "wooden", "cultural"],
    features: ["Wooden Carvings", "Traditional Roof", "Cultural Elements"],
    baseViews: 80,
    growthRate: 0.0003
  },
  {
    id: "design-4",
    title: "Contemporary Bungalow", 
    style: "Contemporary",
    description: "Modern bungalow design with spacious interiors and elegant exteriors.",
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"],
    tags: ["contemporary", "bungalow", "modern", "spacious"],
    features: ["Spacious Interiors", "Modern Kitchen", "Elegant Exteriors"],
    baseViews: 95,
    growthRate: 0.00015
  },
  {
    id: "design-5",
    title: "Luxury Mountain Retreat",
    style: "Modern",
    description: "Stunning mountain retreat with panoramic views and luxury amenities.",
    images: ["https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800"],
    tags: ["luxury", "mountain", "retreat", "panoramic"],
    features: ["Panoramic Views", "Luxury Amenities", "Mountain Design"],
    baseViews: 200,
    growthRate: 0.0004
  }
];

const WebsiteContentContext = createContext<WebsiteContentContextType | undefined>(undefined);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cleanUndefined = (obj: any): any => {
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

export const WebsiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    try {
      const cached = localStorage.getItem("bc_cached_blogs");
      if (cached !== null) return JSON.parse(cached);
      return [];
    } catch {
      return [];
    }
  });

  const [projects, setProjects] = useState<WebsiteProject[]>(() => {
    try {
      const cached = localStorage.getItem("bc_cached_projects");
      if (cached !== null) return JSON.parse(cached);
      return [];
    } catch {
      return [];
    }
  });

  const [designs, setDesigns] = useState<HouseDesign[]>(() => {
    try {
      const cached = localStorage.getItem("bc_cached_designs");
      if (cached !== null) return JSON.parse(cached);
      return [];
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<WebsiteContentSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Real-time Firestore sync with resilient auto-seeding & schema normalization
  useEffect(() => {
    // 1. Sync Blog Posts
    const unsubBlogs = onSnapshot(collection(db, "blogPosts"), (snapshot) => {
      const list: BlogPost[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          title: data.title || "Construction Insight",
          excerpt: data.excerpt || "",
          category: data.category || "General",
          date: data.date || new Date().toISOString().split("T")[0],
          author: data.author || "Engineering Team",
          image: data.image || project1,
          images: data.images && data.images.length > 0 ? data.images : [data.image || project1],
          readTime: data.readTime || "5 min read",
          content: data.content || "",
          isPublished: data.isPublished !== false,
        });
      });
      setBlogPosts(list);
      try { localStorage.setItem("bc_cached_blogs", JSON.stringify(list)); } catch { /* ignore */ }
    });

    // 2. Sync Projects
    const unsubProjects = onSnapshot(collection(db, "projects"), (snapshot) => {
      const list: WebsiteProject[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          code: data.code || `PROJ-${d.id.slice(-4)}`,
          title: data.title || data.name || "Construction Project",
          category: data.category || "Residential",
          location: data.location || data.address || "Butwal",
          client: data.client || (data.client_id ? "Client" : "Private Client"),
          area: data.area || "3,000 Sq. Ft.",
          status: (data.status === "completed" || data.status === "Completed") 
            ? "Completed" 
            : (data.status === "planning" || data.status === "Under Planning") 
            ? "Under Planning" 
            : "Ongoing",
          progress: typeof data.progress === "number" ? data.progress : 0,
          image: data.image || (data.images && data.images[0]) || project1,
          images: data.images && data.images.length > 0 ? data.images : [data.image || (data.images && data.images[0]) || project1],
          description: data.description || "",
          cost: data.cost || (data.total_cost ? `NPR ${(Number(data.total_cost) / 10000000).toFixed(2)} Crore` : "NPR 1.50 Crore"),
          startDate: data.startDate || data.start_date || "2025-01-01",
          completionDate: data.completionDate || data.estimated_completion || "2026-12-31"
        });
      });
      setProjects(list);
      try { localStorage.setItem("bc_cached_projects", JSON.stringify(list)); } catch { /* ignore */ }
    });

    // 3. Sync Designs
    const unsubDesigns = onSnapshot(collection(db, "designs"), (snapshot) => {
      const list: HouseDesign[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          title: data.title || "House Model",
          style: data.style || "Modern",
          description: data.description || "",
          images: data.images && data.images.length > 0 ? data.images : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"],
          tags: data.tags || ["modern", "residential"],
          features: data.features || ["Earthquake-resistant", "Reinforced frame"],
          baseViews: data.baseViews || 100,
          growthRate: data.growthRate || 5,
          currentViews: data.currentViews,
        });
      });
      setDesigns(list);
      try { localStorage.setItem("bc_cached_designs", JSON.stringify(list)); } catch { /* ignore */ }
    });

    // 4. Sync Settings (Never re-seed mock data in background)
    const unsubSettings = onSnapshot(doc(db, "settings", "global"), async (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as WebsiteContentSettings);
        setLoading(false);
      } else {
        const initialSettingsPayload = {
          ...DEFAULT_SETTINGS,
          isSeeded: true,
          created_at: new Date().toISOString()
        };
        try {
          await setDoc(doc(db, "settings", "global"), initialSettingsPayload);
        } catch (e) {
          console.error("Error setting default settings:", e);
        }
        setSettings(initialSettingsPayload);
        setLoading(false);
      }
    });

    return () => {
      unsubBlogs();
      unsubProjects();
      unsubDesigns();
      unsubSettings();
    };
  }, []);

  const addBlogPost = async (post: Omit<BlogPost, "id">) => {
    const id = `blog-${Date.now()}`;
    const newPost: BlogPost = {
      ...post,
      id,
      image: post.image || project1,
      images: post.images && post.images.length > 0 ? post.images : [post.image || project1],
    };
    setBlogPosts(prev => [newPost, ...prev.filter(b => b.id !== id)]);
    await setDoc(doc(db, "blogPosts", id), cleanUndefined(newPost));
  };

  const updateBlogPost = async (id: string, updatedFields: Partial<BlogPost>) => {
    setBlogPosts(prev => prev.map(b => b.id === id ? { ...b, ...updatedFields } : b));
    await updateDoc(doc(db, "blogPosts", id), cleanUndefined(updatedFields));
  };

  const deleteBlogPost = async (id: string) => {
    setBlogPosts(prev => {
      const filtered = prev.filter(b => b.id !== id);
      try { localStorage.setItem("bc_cached_blogs", JSON.stringify(filtered)); } catch { /* ignore */ }
      return filtered;
    });
    try {
      await deleteDoc(doc(db, "blogPosts", id));
    } catch (err) {
      console.error("Failed to delete blog post from Firestore:", err);
    }
  };

  const seedSampleBlogs = async (): Promise<{ success: boolean; count: number }> => {
    return { success: true, count: 0 };
  };

  const addProject = async (project: Omit<WebsiteProject, "id">) => {
    const id = `proj-${Date.now()}`;
    const newProj: WebsiteProject = {
      ...project,
      id,
      code: project.code || `PROJ-${Date.now().toString().slice(-4)}`,
      category: project.category || "Residential",
      location: project.location || "Butwal",
      client: project.client || "Private Client",
      area: project.area || "2,500 Sq. Ft.",
      status: project.status || "Ongoing",
      progress: project.progress ?? 0,
      image: project.image || project1,
      images: project.images && project.images.length > 0 ? project.images : [project.image || project1],
    };

    // Optimistically update local state immediately
    setProjects(prev => [newProj, ...prev.filter(p => p.id !== id)]);
    try {
      const updated = [newProj, ...projects.filter(p => p.id !== id)];
      localStorage.setItem("bc_cached_projects", JSON.stringify(updated));
    } catch { /* ignore */ }

    // Save to Firestore with dual schema compatibility
    await setDoc(doc(db, "projects", id), cleanUndefined({
      ...newProj,
      name: newProj.title,
      address: newProj.location,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  };

  const updateProject = async (id: string, updatedFields: Partial<WebsiteProject>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    const payload = cleanUndefined({
      ...updatedFields,
      ...(updatedFields.title ? { name: updatedFields.title } : {}),
      ...(updatedFields.location ? { address: updatedFields.location } : {}),
      updated_at: new Date().toISOString(),
    });
    await updateDoc(doc(db, "projects", id), payload);
  };

  const deleteProject = async (id: string) => {
    setProjects(prev => {
      const filtered = prev.filter(p => p.id !== id);
      try { localStorage.setItem("bc_cached_projects", JSON.stringify(filtered)); } catch { /* ignore */ }
      return filtered;
    });
    try {
      await deleteDoc(doc(db, "projects", id));
    } catch (err) {
      console.error("Failed to delete project from Firestore:", err);
    }
  };

  const migrateProjectsToFirebase = async (force: boolean = false): Promise<{ success: boolean; count?: number; error?: unknown }> => {
    try {
      const snap = await getDocs(collection(db, "projects"));
      const existingIds = new Set(snap.docs.map(d => d.id));
      const existingTitles = new Set(snap.docs.map(d => (d.data().title || d.data().name)?.toLowerCase().trim()));
      
      let count = 0;
      for (const project of INITIAL_PROJECTS) {
        if (force || (!existingIds.has(project.id) && !existingTitles.has(project.title.toLowerCase().trim()))) {
          await setDoc(doc(db, "projects", project.id), cleanUndefined({
            ...project,
            name: project.title,
            address: project.location,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }));
          count++;
        }
      }
      return { success: true, count };
    } catch (err) {
      console.error("Migration error:", err);
      return { success: false, error: err };
    }
  };

  const seedSampleProjects = async (): Promise<{ success: boolean; count: number }> => {
    return { success: true, count: 0 };
  };

  const addDesign = async (design: Omit<HouseDesign, "id">) => {
    const id = `design-${Date.now()}`;
    const newDesign: HouseDesign = { ...design, id };
    setDesigns(prev => [newDesign, ...prev.filter(d => d.id !== id)]);
    await setDoc(doc(db, "designs", id), cleanUndefined(newDesign));
  };

  const updateDesign = async (id: string, updatedFields: Partial<HouseDesign>) => {
    setDesigns(prev => prev.map(d => d.id === id ? { ...d, ...updatedFields } : d));
    await updateDoc(doc(db, "designs", id), cleanUndefined(updatedFields));
  };

  const deleteDesign = async (id: string) => {
    setDesigns(prev => {
      const filtered = prev.filter(d => d.id !== id);
      try { localStorage.setItem("bc_cached_designs", JSON.stringify(filtered)); } catch { /* ignore */ }
      return filtered;
    });
    try {
      await deleteDoc(doc(db, "designs", id));
    } catch (err) {
      console.error("Failed to delete design from Firestore:", err);
    }
  };

  const seedSampleDesigns = async (): Promise<{ success: boolean; count: number }> => {
    return { success: true, count: 0 };
  };

  const updateSettings = async (newFields: Partial<WebsiteContentSettings>) => {
    await setDoc(doc(db, "settings", "global"), cleanUndefined({ ...settings, ...newFields }));
  };

  const resetToDefaults = async () => {
    // DISABLED
  };

  return (
    <WebsiteContentContext.Provider
      value={{
        blogPosts,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        seedSampleBlogs,
        projects,
        addProject,
        updateProject,
        deleteProject,
        migrateProjectsToFirebase,
        seedSampleProjects,
        designs,
        addDesign,
        updateDesign,
        deleteDesign,
        seedSampleDesigns,
        settings,
        updateSettings,
        resetToDefaults,
        loading
      }}
    >
      {children}
    </WebsiteContentContext.Provider>
  );
};

export const useWebsiteContent = () => {
  const context = useContext(WebsiteContentContext);
  if (!context) {
    throw new Error("useWebsiteContent must be used within a WebsiteContentProvider");
  }
  return context;
};

