import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

const SEO_ROUTE_MAP: Record<string, { title: string; description: string; keywords?: string }> = {
  "/": {
    title: "Butwal Construction & Builders | #1 Construction Company in Butwal & Dang",
    description: "Butwal Construction & Builders and Dang Construction & Builders. Leading turnkey house construction, 3D floor plans, building permit assistance in Nepal.",
    keywords: "Butwal Construction and Builders, Dang Construction and Builders, Best construction company in Butwal, Turnkey house construction Nepal"
  },
  "/about": {
    title: "About Us | Butwal Construction & Builders Group",
    description: "Learn about Butwal Construction and Builders, Dang Construction, Satyawati Devi Hardware, Navdurga Furniture, and Malika Hardware across Nepal.",
    keywords: "About Butwal Construction, Group companies, Satyawati Devi Hardware history, Construction engineering team Nepal"
  },
  "/group-companies": {
    title: "Our Group Companies | Butwal & Dang Construction Ecosystem",
    description: "Discover our group network: Butwal Construction, Dang Construction, Satyawati Devi Hardware (10+ Yrs), Navdurga Furniture, and Malika Hardware.",
    keywords: "Dang Construction and Builders, Satyawati Devi Hardware, Navdurga Furniture, Malika Hardware, Butwal Construction group"
  },
  "/projects": {
    title: "Construction Projects Portfolio | Butwal & Dang Construction",
    description: "Explore ongoing & completed residential villas, commercial complexes, and structural projects built by Butwal Construction & Dang Construction.",
    keywords: "House projects Nepal, Residential villa design Butwal, Commercial building construction Dang, Turnkey portfolio Nepal"
  },
  "/designs": {
    title: "3D House Designs Gallery & Floor Plans | Nepal Architect",
    description: "Browse 100+ modern Nepalese 3D house front elevations, Vastu floor plans, 2.5 Aana to 1 Bigha house designs, and exterior architectural ideas.",
    keywords: "3D House designs Nepal, Modern elevation Butwal, Vastu house plans, Naksa pass designs Nepal"
  },
  "/estimate": {
    title: "Construction Cost Calculator Nepal | Butwal & Dang Construction",
    description: "Calculate exact home construction costs in Nepal based on current market rates for TMT steel, OPC cement, bricks, labor, and finishing level.",
    keywords: "Construction cost calculator Nepal, Cost per sq ft house Nepal, Building estimate Rupandehi Dang"
  },
  "/tools": {
    title: "Construction & Engineering Tools Hub | Butwal Construction",
    description: "Free digital engineering tools: Municipal Permit Assistant, Vastu Guide, Cost Calculator, Buy vs Build Analyzer, Green Build Calculator.",
    keywords: "Building permit assistant Nepal, Naksa pass tool, Vastu compass Nepal, Construction cost calculator"
  },
  "/tools/permits": {
    title: "Nepal Municipal Building Permit Assistant | Naksa Pass Guide",
    description: "Step-by-step guidance for municipal building permits (Naksa Pass) in Butwal, Ghorahi, Tulsipur, Tilottama, and municipalities across Nepal.",
    keywords: "Naksa pass process Nepal, Building permit Butwal, Municipal drawing requirement Nepal"
  },
  "/tools/calculators": {
    title: "Material & Labor Estimator Calculator | Nepal Building Tools",
    description: "Calculate concrete bags, TMT steel rebar weight, brick count, sand & aggregate volumes for residential and commercial builds in Nepal.",
    keywords: "Rebar weight calculator Nepal, Cement sand calculation, Brick count calculator Nepal"
  },
  "/tools/vastu": {
    title: "Vastu Shastra Home Guide & Floor Plan Layouts | Nepal Architecture",
    description: "Complete Vastu principles for main entrance, kitchen, bedroom, water tank, and septic tank positions in Nepalese home design.",
    keywords: "Vastu house layout Nepal, Vastu directional guide, Vastu entrance placement"
  },
  "/tools/buy-or-build": {
    title: "Buy Land & Build vs Buy Ready House Comparison | Nepal Real Estate",
    description: "Detailed financial and structural breakdown comparing building your own home vs buying a readymade property in Butwal and Dang Valley.",
    keywords: "Buy vs build home Nepal, Real estate investment Butwal Dang, Cost comparison building house"
  },
  "/tools/timeline": {
    title: "Construction Timeline & Milestone Planner | Turnkey House Nepal",
    description: "Interactive timeline tracker from land preparation and foundation casting to brickwork, plastering, interior woodwork, and key handover.",
    keywords: "House construction schedule Nepal, Building milestones, Turnkey timeline Butwal"
  },
  "/tools/green-calculator": {
    title: "Green & Solar Eco Building Calculator | Sustainable Homes Nepal",
    description: "Estimate solar PV capacity, rainwater harvesting potential, and energy savings for eco-friendly homes in Nepal.",
    keywords: "Solar calculator Nepal, Rainwater harvesting house design, Eco building Nepal"
  },
  "/contact": {
    title: "Contact Us | Butwal Construction & Dang Construction",
    description: "Get in touch with senior structural engineers, architects, and project managers at Butwal Construction and Builders or Dang Construction.",
    keywords: "Contact Butwal Construction, Construction office phone number Butwal Dang, Consultation appointment"
  },
  "/blog": {
    title: "Construction & Architectural Blog Nepal | Tips & Guides",
    description: "Expert articles on Nepal building codes, earthquake resistant RCC frame structure tips, material selection, and interior design trends.",
    keywords: "Nepal construction blog, Building tips Nepal, Earthquake resistant house Nepal"
  },
  "/floor-planner": {
    title: "Interactive 2D/3D Floor Planner & Room Layout Tool",
    description: "Design custom room layouts, drag furniture, and test floor plans tailored for Nepalese residential plot sizes.",
    keywords: "Online floor planner Nepal, Draw house plan 2D 3D, Room layout tool"
  },
  "/sitemap": {
    title: "Sitemap | Butwal Construction & Builders",
    description: "Directory of all pages, tools, house designs, group companies, and services offered by Butwal Construction.",
    keywords: "Sitemap Butwal Construction"
  }
};

export const SEOHead = ({ title, description, keywords }: SEOProps) => {
  const location = useLocation();

  useEffect(() => {
    const routeInfo = SEO_ROUTE_MAP[location.pathname] || {
      title: "Butwal Construction & Builders | Modern Engineering & Construction Nepal",
      description: "Turnkey architectural design, 3D house plans, municipal building permits, and quality construction in Butwal, Dang, and Western Nepal."
    };

    const finalTitle = title || routeInfo.title;
    const finalDescription = description || routeInfo.description;
    const finalKeywords = keywords || routeInfo.keywords || "Butwal Construction, Dang Construction, Nepal construction company";

    // Update document title
    document.title = finalTitle;

    // Helper to update meta tag content
    const updateMetaTag = (nameAttr: string, valueAttr: string, content: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${valueAttr}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(nameAttr, valueAttr);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Helper to update canonical link tag
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `https://butwalconstruction.com.np${location.pathname}`);

    updateMetaTag("name", "description", finalDescription);
    updateMetaTag("name", "keywords", finalKeywords);
    updateMetaTag("property", "og:title", finalTitle);
    updateMetaTag("property", "og:description", finalDescription);
    updateMetaTag("property", "og:url", `https://butwalconstruction.com.np${location.pathname}`);
    updateMetaTag("name", "twitter:title", finalTitle);
    updateMetaTag("name", "twitter:description", finalDescription);

  }, [location, title, description, keywords]);

  return null;
};

export default SEOHead;
