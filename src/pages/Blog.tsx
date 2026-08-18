import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWebsiteContent } from "@/contexts/WebsiteContentContext";
import LazyImage from "@/components/LazyImage";
import { formatKathmanduDateTime } from "@/lib/utils";

const Blog = () => {
  const { blogPosts } = useWebsiteContent();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const publishedPosts = blogPosts.filter((p) => p.isPublished !== false);

  const categories = ["All", ...Array.from(new Set(publishedPosts.map((p) => p.category)))];

  const filteredPosts = selectedCategory === "All"
    ? publishedPosts
    : publishedPosts.filter((p) => p.category === selectedCategory);

  const featuredPost = filteredPosts[0] || publishedPosts[0];
  const gridPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  return (
    <div className="min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Liquid Ambient Iridescent Background Mesh (Apple iOS style) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/6 left-1/10 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/20 to-rose-600/10 blur-[130px] liquid-orb-1" />
        <div className="absolute top-1/2 right-1/10 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-purple-600/20 to-indigo-600/15 blur-[140px] liquid-orb-2" />
        <div className="absolute bottom-1/10 left-1/3 w-[450px] h-[450px] rounded-full bg-gradient-to-r from-pink-500/15 to-amber-500/10 blur-[120px] liquid-orb-3" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Construction <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-primary to-pink-400">Insights & Blogs</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Expert tips, engineering guides, and project stories from Butwal Construction & Builders
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 justify-center mb-12 animate-slide-up">
          {categories.map((cat, idx) => (
            <Badge
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              variant={selectedCategory === cat ? "default" : "outline"}
              className={`cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105 ${
                selectedCategory === cat 
                  ? "bg-primary text-foreground" 
                  : "border-primary/50 hover:bg-primary/10"
              }`}
            >
              {cat}
            </Badge>
          ))}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl p-8 max-w-xl mx-auto border-dashed">
            <p className="text-muted-foreground text-lg mb-2">No articles found in this category.</p>
            <p className="text-xs text-muted-foreground">Articles added or published in the Admin CMS will appear here live.</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <Card 
                className="glass overflow-hidden hover-lift mb-12 animate-fade-in group cursor-pointer"
                onClick={() => navigate(`/blog/${featuredPost.id}`)}
              >
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-80 md:h-auto overflow-hidden">
                    <LazyImage
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <Badge className="bg-primary text-foreground font-bold">Featured Article</Badge>
                    </div>
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <Badge variant="outline" className="border-primary/50 text-primary w-fit mb-4">
                      {featuredPost.category}
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-muted-foreground mb-6 text-lg">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        {formatKathmanduDateTime(featuredPost.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={16} />
                        {featuredPost.author}
                      </span>
                      <span>• {featuredPost.readTime}</span>
                    </div>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/blog/${featuredPost.id}`);
                      }}
                      className="bg-primary hover:bg-primary/90 text-foreground w-fit glow"
                    >
                      Read Full Article
                      <ArrowRight className="ml-2" size={18} />
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Blog Grid */}
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gridPosts.map((post, index) => (
                  <Card
                    key={post.id || index}
                    className="glass overflow-hidden hover-lift group flex flex-col justify-between cursor-pointer"
                    onClick={() => navigate(`/blog/${post.id}`)}
                  >
                    <div>
                      <div className="relative aspect-square overflow-hidden bg-muted/25">
                        <LazyImage
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent z-10" />
                      </div>
                      
                      <div className="p-6">
                        <Badge variant="outline" className="border-primary/50 text-primary mb-3">
                          {post.category}
                        </Badge>
                        
                        <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatKathmanduDateTime(post.date)}
                          </span>
                          <span>• {post.readTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/blog/${post.id}`);
                        }}
                        variant="outline" 
                        className="w-full glass border-primary/50 hover:bg-primary/10 group"
                      >
                        Read Article
                        <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={16} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
