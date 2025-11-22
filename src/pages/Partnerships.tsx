import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Building2, Star, Hammer, Users } from 'lucide-react';

const Partnerships = () => {
  const partners = [
    {
      category: 'Financial Partners',
      icon: Building2,
      description: 'Exclusive home loan partnerships with leading banks',
      partners: [
        { name: 'Nabil Bank', benefit: 'Up to 10.5% interest rate for our clients' },
        { name: 'NIC Asia Bank', benefit: 'Fast-track loan approval process' },
        { name: 'Standard Chartered', benefit: 'Premium banking services' },
        { name: 'Global IME Bank', benefit: 'Flexible EMI options' }
      ]
    },
    {
      category: 'Vastu & Astrology Consultants',
      icon: Star,
      description: 'Certified experts for auspicious home design',
      partners: [
        { name: 'Pandit Ram Kumar Sharma', benefit: '25+ years Vastu expertise' },
        { name: 'Astrologer Sita Devi', benefit: 'Muhurta selection specialist' },
        { name: 'Vastu Consulting Nepal', benefit: 'Complete home Vastu analysis' }
      ]
    },
    {
      category: 'Material Suppliers',
      icon: Hammer,
      description: 'Quality materials at competitive prices',
      partners: [
        { name: 'Asian Paints Nepal', benefit: '15% discount for our clients' },
        { name: 'Shivam Cement', benefit: 'Bulk purchase benefits' },
        { name: 'Century Ply', benefit: 'Premium quality plywood' },
        { name: 'Jagdamba Steel', benefit: 'Best market rates' }
      ]
    },
    {
      category: 'Technology Partners',
      icon: Users,
      description: 'Smart home and automation solutions',
      partners: [
        { name: 'SmartHome Nepal', benefit: 'Complete home automation' },
        { name: 'Solar Solutions Pvt. Ltd.', benefit: 'Solar power installation' },
        { name: 'Security Systems Nepal', benefit: 'Advanced security solutions' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
            Our <span className="text-gradient">Partnerships</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Collaborating with industry leaders to provide you with the best services
          </p>
          <Button 
            onClick={() => window.open('https://wa.me/9779763653181?text=I want to know more about your partnerships', '_blank')}
            className="bg-[#25D366] hover:bg-[#20BA5A] text-white"
            size="lg"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Become a Partner
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {partners.map((category, idx) => (
            <Card key={idx} className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <category.icon className="w-8 h-8 text-primary" />
                  {category.category}
                </CardTitle>
                <p className="text-muted-foreground">{category.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.partners.map((partner, pidx) => (
                    <div key={pidx} className="p-4 glass rounded-lg hover-lift">
                      <h3 className="font-bold text-foreground mb-2">{partner.name}</h3>
                      <p className="text-sm text-muted-foreground">{partner.benefit}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="glass mt-12">
          <CardHeader>
            <CardTitle>Why Partner With Us?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Completed Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">15+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </div>
            <div className="pt-6 space-y-2 text-sm text-muted-foreground">
              <p>✓ Access to high-quality clients actively building their dream homes</p>
              <p>✓ Co-marketing opportunities and brand visibility</p>
              <p>✓ Streamlined processes for better customer satisfaction</p>
              <p>✓ Mutual growth through trusted recommendations</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Partnerships;
