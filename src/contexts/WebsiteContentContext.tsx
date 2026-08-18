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
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<WebsiteProject[]>([]);
  const [designs, setDesigns] = useState<HouseDesign[]>([]);
  const [settings, setSettings] = useState<WebsiteContentSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Real-time Firestore sync (No auto-reseeding on empty state, respecting user deletions)
  useEffect(() => {
    // 1. Sync Blog Posts
    const unsubBlogs = onSnapshot(collection(db, "blogPosts"), (snapshot) => {
      const list: BlogPost[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as BlogPost);
      });
      setBlogPosts(list);
    });

    // 2. Sync Projects
    const unsubProjects = onSnapshot(collection(db, "projects"), (snapshot) => {
      const list: WebsiteProject[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as WebsiteProject);
      });
      setProjects(list);
    });

    // 3. Sync Designs
    const unsubDesigns = onSnapshot(collection(db, "designs"), (snapshot) => {
      const list: HouseDesign[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as HouseDesign);
      });
      setDesigns(list);
    });

    // 4. Sync Settings
    const unsubSettings = onSnapshot(doc(db, "settings", "global"), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as WebsiteContentSettings);
      } else {
        setDoc(doc(db, "settings", "global"), DEFAULT_SETTINGS);
      }
      setLoading(false);
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
    await setDoc(doc(db, "blogPosts", id), cleanUndefined({ ...post, id }));
  };

  const updateBlogPost = async (id: string, updatedFields: Partial<BlogPost>) => {
    await updateDoc(doc(db, "blogPosts", id), cleanUndefined(updatedFields));
  };

  const deleteBlogPost = async (id: string) => {
    await deleteDoc(doc(db, "blogPosts", id));
  };

  const seedSampleBlogs = async (): Promise<{ success: boolean; count: number }> => {
    try {
      let count = 0;
      for (const blog of INITIAL_BLOGS) {
        await setDoc(doc(db, "blogPosts", blog.id), cleanUndefined(blog));
        count++;
      }
      return { success: true, count };
    } catch (err) {
      console.error("Error seeding sample blogs:", err);
      return { success: false, count: 0 };
    }
  };

  const addProject = async (project: Omit<WebsiteProject, "id">) => {
    const id = `proj-${Date.now()}`;
    await setDoc(doc(db, "projects", id), cleanUndefined({ ...project, id }));
  };

  const updateProject = async (id: string, updatedFields: Partial<WebsiteProject>) => {
    await updateDoc(doc(db, "projects", id), cleanUndefined(updatedFields));
  };

  const deleteProject = async (id: string) => {
    await deleteDoc(doc(db, "projects", id));
  };

  const migrateProjectsToFirebase = async (force: boolean = false): Promise<{ success: boolean; count?: number; error?: unknown }> => {
    try {
      const snap = await getDocs(collection(db, "projects"));
      const existingIds = new Set(snap.docs.map(d => d.id));
      const existingTitles = new Set(snap.docs.map(d => d.data().title?.toLowerCase().trim()));
      
      let count = 0;
      for (const project of INITIAL_PROJECTS) {
        if (force || (!existingIds.has(project.id) && !existingTitles.has(project.title.toLowerCase().trim()))) {
          await setDoc(doc(db, "projects", project.id), cleanUndefined(project));
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
    try {
      let count = 0;
      for (const proj of INITIAL_PROJECTS) {
        await setDoc(doc(db, "projects", proj.id), cleanUndefined(proj));
        count++;
      }
      return { success: true, count };
    } catch (err) {
      console.error("Error seeding sample projects:", err);
      return { success: false, count: 0 };
    }
  };

  const addDesign = async (design: Omit<HouseDesign, "id">) => {
    const id = `design-${Date.now()}`;
    await setDoc(doc(db, "designs", id), cleanUndefined({ ...design, id }));
  };

  const updateDesign = async (id: string, updatedFields: Partial<HouseDesign>) => {
    await updateDoc(doc(db, "designs", id), cleanUndefined(updatedFields));
  };

  const deleteDesign = async (id: string) => {
    await deleteDoc(doc(db, "designs", id));
  };

  const seedSampleDesigns = async (): Promise<{ success: boolean; count: number }> => {
    try {
      let count = 0;
      for (const des of INITIAL_DESIGNS) {
        await setDoc(doc(db, "designs", des.id), cleanUndefined(des));
        count++;
      }
      return { success: true, count };
    } catch (err) {
      console.error("Error seeding sample designs:", err);
      return { success: false, count: 0 };
    }
  };

  const updateSettings = async (newFields: Partial<WebsiteContentSettings>) => {
    await setDoc(doc(db, "settings", "global"), cleanUndefined({ ...settings, ...newFields }));
  };

  const resetToDefaults = async () => {
    await setDoc(doc(db, "settings", "global"), DEFAULT_SETTINGS);
    for (const post of blogPosts) {
      await deleteDoc(doc(db, "blogPosts", post.id));
    }
    for (const b of INITIAL_BLOGS) {
      await setDoc(doc(db, "blogPosts", b.id), cleanUndefined(b));
    }
    for (const proj of projects) {
      await deleteDoc(doc(db, "projects", proj.id));
    }
    for (const p of INITIAL_PROJECTS) {
      await setDoc(doc(db, "projects", p.id), cleanUndefined(p));
    }
    for (const des of designs) {
      await deleteDoc(doc(db, "designs", des.id));
    }
    for (const d of INITIAL_DESIGNS) {
      await setDoc(doc(db, "designs", d.id), cleanUndefined(d));
    }
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

