import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Target, Eye, Award, ArrowRight, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

const About = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Liquid Ambient Iridescent Background Mesh (Apple iOS style) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/6 left-1/10 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/20 to-rose-600/10 blur-[130px] liquid-orb-1" />
        <div className="absolute top-1/2 right-1/10 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-purple-600/20 to-indigo-600/15 blur-[140px] liquid-orb-2" />
        <div className="absolute bottom-1/10 left-1/3 w-[450px] h-[450px] rounded-full bg-gradient-to-r from-pink-500/15 to-amber-500/10 blur-[120px] liquid-orb-3" />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-ios-pill border border-white/20 text-rose-300 text-xs sm:text-sm font-bold shadow-lg mb-4">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span>Over 25 Years of Solid Foundation</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 tracking-tight text-foreground">
            About <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-primary to-pink-400">Our Company</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Building excellence, engineering trust, and leading the future of earthquake-resistant construction across Nepal.
          </p>
        </motion.div>

        {/* Company Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="glass-ios p-8 md:p-12 mb-12 border-white/15 shadow-2xl backdrop-blur-2xl rounded-[28px] overflow-hidden">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-rose-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/25">
                <Building2 size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                  Butwal Construction and Builders
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                  A sister company of Satyawati Devi Hardware, we bring years of specialized experience in the construction 
                  industry combined with modern innovation and technology. Our commitment to excellence has made us 
                  one of the most trusted construction companies in Nepal.
                </p>
                <p className="text-muted-foreground leading-relaxed text-base">
                  We specialize in residential, commercial, and industrial construction projects, offering comprehensive 
                  solutions from design to completion. Our team of experienced engineers, architects, and craftsmen work 
                  together to deliver projects that exceed expectations.
                </p>
                
                <div className="pt-4">
                  <Link to="/group-companies">
                    <Button className="bg-gradient-to-r from-primary to-rose-600 hover:opacity-90 text-white font-bold px-6 py-5 rounded-xl text-base shadow-xl transition-all duration-300">
                      View All Group Companies & Ventures
                      <ArrowRight className="ml-2" size={18} />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass-ios p-8 border-white/15 shadow-2xl backdrop-blur-2xl rounded-[28px] h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 border border-primary/20">
                  <Target size={24} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  To deliver exceptional construction services that combine quality, innovation, and sustainability. 
                  We strive to build lasting relationships with our clients by consistently exceeding their expectations 
                  and contributing to the development of Nepal's infrastructure.
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass-ios p-8 border-white/15 shadow-2xl backdrop-blur-2xl rounded-[28px] h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 border border-purple-500/20">
                  <Eye size={24} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  To be the leading construction company in Nepal, recognized for our commitment to quality, innovation, 
                  and customer satisfaction. We envision a future where our projects set new standards in construction 
                  excellence and contribute to building a modern Nepal.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-extrabold text-center mb-10 tracking-tight text-foreground">
            Our Core <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-primary to-pink-400">Values</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Quality First",
                description: "We never compromise on quality, using only the best materials and techniques"
              },
              {
                title: "Innovation",
                description: "Embracing modern technology and construction methods for better results"
              },
              {
                title: "Integrity",
                description: "Transparent communication and honest business practices in all our dealings"
              },
              {
                title: "Safety",
                description: "Maintaining the highest safety standards for our workers and clients"
              },
              {
                title: "Sustainability",
                description: "Environmentally responsible construction practices for a better future"
              },
              {
                title: "Customer Focus",
                description: "Dedicated to understanding and exceeding our clients' expectations"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="transition-all duration-300"
              >
                <Card className="glass-ios p-6 border-white/15 shadow-lg backdrop-blur-2xl rounded-[22px] h-full">
                  <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-primary mb-4">
                    <Award size={20} />
                  </div>
                  <h4 className="text-lg font-bold mb-2 text-foreground">{value.title}</h4>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="glass-ios p-8 md:p-12 border-white/15 shadow-2xl backdrop-blur-2xl rounded-[28px]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "100%", label: "NBC Code Compliant" },
                { number: "500+", label: "Projects Completed" },
                { number: "200+", label: "Happy Clients" },
                { number: "50+", label: "Expert Engineers" }
              ].map((stat, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-3xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-primary to-pink-400 mb-1">{stat.number}</div>
                  <div className="text-muted-foreground text-xs sm:text-sm font-semibold uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
