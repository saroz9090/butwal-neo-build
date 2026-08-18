import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useWebsiteContent } from "@/contexts/WebsiteContentContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LazyImage from "@/components/LazyImage";
import { useToast } from "@/components/ui/use-toast";
import { formatKathmanduDateTime } from "@/lib/utils";

const BlogPostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { blogPosts, loading } = useWebsiteContent();
  const { toast } = useToast();

  const post = blogPosts.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(post?.title + " - " + url)}`, '_blank');
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied",
        description: "Article link copied to clipboard!",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4">
        <Navigation />
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold mb-4">Article Not Found</h2>
          <p className="text-muted-foreground mb-6">The blog post you are looking for does not exist or has been removed.</p>
          <Button onClick={() => navigate("/blog")} className="gradient-primary">
            <ArrowLeft className="mr-2" size={16} /> Back to Blog
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedPosts = blogPosts.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-28 pb-20 px-4">
        <article className="max-w-4xl mx-auto">
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/blog")}
            className="mb-8 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} /> Back to All Articles
          </Button>

          {/* Header Metadata */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/50 text-primary font-semibold">
                {post.category}
              </Badge>
              <span className="text-sm text-muted-foreground">• {post.readTime}</span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-muted-foreground border-b border-border pb-6">
              <span className="flex items-center gap-2">
                <User size={16} className="text-primary" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                {formatKathmanduDateTime(post.date)}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                {post.readTime} read
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-square max-w-2xl mx-auto rounded-2xl overflow-hidden mb-10 shadow-2xl bg-muted/20 border border-white/10">
            <LazyImage src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>

          {/* Content Body */}
          <div className="space-y-6 text-foreground/90 text-lg leading-relaxed font-normal">
            <p className="text-xl font-medium text-primary leading-relaxed bg-primary/5 p-6 rounded-xl border-l-4 border-primary">
              {post.excerpt}
            </p>

            <div className="space-y-6 pt-4">
              {(() => {
                const textContent = post.content || post.excerpt;
                const parts = textContent.split(/(!\[.*?\]\(.*?\))/g);
                return parts.map((part, index) => {
                  const match = part.match(/!\[(.*?)\]\((.*?)\)/);
                  if (match) {
                    const [, alt, url] = match;
                    return (
                      <div key={index} className="my-8 relative h-[300px] md:h-[450px] rounded-2xl overflow-hidden shadow-xl border border-border">
                        <LazyImage src={url} alt={alt || post.title} className="w-full h-full object-cover" />
                        {alt && <p className="text-center text-sm text-muted-foreground mt-2 italic">{alt}</p>}
                      </div>
                    );
                  }
                  return <p key={index} className="mb-4 whitespace-pre-line leading-relaxed">{part}</p>;
                });
              })()}
            </div>

            {post.images && post.images.length > 0 && (
              <div className="space-y-8 pt-6">
                <h4 className="text-xl font-bold text-foreground">Project & Article Gallery</h4>
                {post.images.map((imgUrl, idx) => (
                  <div key={idx} className="relative h-[300px] md:h-[450px] rounded-2xl overflow-hidden shadow-xl">
                    <LazyImage src={imgUrl} alt={`${post.title} - Image ${idx + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Social Share Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-y border-border my-12 py-6">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Share2 size={18} className="text-primary" /> Share this article:
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('whatsapp')}
                className="gap-2 bg-[#25D366]/10 border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/20"
              >
                <MessageCircle size={16} /> WhatsApp
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('copy')}
                className="gap-2"
              >
                Copy Link
              </Button>
            </div>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rel) => (
                  <Card
                    key={rel.id}
                    className="glass overflow-hidden hover-lift cursor-pointer group flex flex-col justify-between"
                    onClick={() => navigate(`/blog/${rel.id}`)}
                  >
                    <div>
                      <div className="h-40 overflow-hidden relative">
                        <LazyImage src={rel.image} alt={rel.title} className="group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="p-4">
                        <Badge variant="outline" className="border-primary/50 text-primary text-xs mb-2">{rel.category}</Badge>
                        <h4 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">{rel.title}</h4>
                      </div>
                    </div>
                    <div className="p-4 pt-0 text-xs text-muted-foreground flex justify-between">
                      <span>{rel.readTime}</span>
                      <span>Read More →</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostDetail;
