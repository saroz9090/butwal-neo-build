import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";

const Blog = () => {
  const posts = [
    {
      title: "Modern Construction Techniques for 2024",
      excerpt: "Explore the latest innovations in construction technology and sustainable building practices that are shaping the future of Nepal's infrastructure.",
      category: "Technology",
      date: "2024-01-15",
      author: "Engineering Team",
      image: project1,
      readTime: "5 min read"
    },
    {
      title: "Choosing the Right Materials for Your Dream Home",
      excerpt: "A comprehensive guide to selecting quality construction materials that balance durability, aesthetics, and budget considerations.",
      category: "Tips & Guides",
      date: "2024-01-10",
      author: "Materials Expert",
      image: project2,
      readTime: "7 min read"
    },
    {
      title: "Sustainable Building Practices in Nepal",
      excerpt: "How we're incorporating eco-friendly methods and materials to create buildings that are both beautiful and environmentally responsible.",
      category: "Sustainability",
      date: "2024-01-05",
      author: "Sustainability Team",
      image: project1,
      readTime: "6 min read"
    },
    {
      title: "Project Spotlight: Butwal Commercial Hub",
      excerpt: "Take a behind-the-scenes look at our latest commercial project, from initial planning through final completion.",
      category: "Projects",
      date: "2023-12-28",
      author: "Project Manager",
      image: project2,
      readTime: "8 min read"
    },
    {
      title: "Understanding Construction Cost Estimates",
      excerpt: "Learn how to interpret construction estimates and what factors influence the final cost of your building project.",
      category: "Finance",
      date: "2023-12-20",
      author: "Finance Team",
      image: project1,
      readTime: "5 min read"
    },
    {
      title: "Safety First: Modern Construction Site Standards",
      excerpt: "Our commitment to maintaining the highest safety standards while delivering exceptional construction quality.",
      category: "Safety",
      date: "2023-12-15",
      author: "Safety Officer",
      image: project2,
      readTime: "6 min read"
    }
  ];

  const categories = ["All", "Technology", "Tips & Guides", "Sustainability", "Projects", "Finance", "Safety"];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Construction <span className="text-primary">Insights</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Expert tips, industry updates, and project stories from Butwal Construction
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 justify-center mb-12 animate-slide-up">
          {categories.map((cat, idx) => (
            <Badge
              key={idx}
              variant={cat === "All" ? "default" : "outline"}
              className={`cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105 ${
                cat === "All" 
                  ? "bg-primary text-foreground" 
                  : "border-primary/50 hover:bg-primary/10"
              }`}
            >
              {cat}
            </Badge>
          ))}
        </div>

        {/* Featured Post */}
        <Card className="glass overflow-hidden hover-lift mb-12 animate-fade-in group">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-80 md:h-auto overflow-hidden">
              <img
                src={posts[0].image}
                alt={posts[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary text-foreground">Featured</Badge>
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <Badge variant="outline" className="border-primary/50 text-primary w-fit mb-4">
                {posts[0].category}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                {posts[0].title}
              </h2>
              <p className="text-muted-foreground mb-6 text-lg">
                {posts[0].excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {new Date(posts[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                  <User size={16} />
                  {posts[0].author}
                </span>
                <span>• {posts[0].readTime}</span>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-foreground w-fit glow">
                Read Full Article
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </div>
          </div>
        </Card>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(1).map((post, index) => (
            <Card
              key={index}
              className="glass overflow-hidden hover-lift group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
              </div>
              
              <div className="p-6">
                <Badge variant="outline" className="border-primary/50 text-primary mb-3">
                  {post.category}
                </Badge>
                
                <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span>• {post.readTime}</span>
                </div>

                <Button variant="outline" className="w-full glass border-primary/50 hover:bg-primary/10 group">
                  Read More
                  <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="glass border-primary/50 hover:bg-primary/10">
            Load More Articles
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
