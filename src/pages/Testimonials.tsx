import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Rajesh Sharma',
      location: 'Kathmandu',
      project: '3-Story Modern Home',
      rating: 5,
      text: 'Excellent work! They completed our dream home on time and within budget. The attention to detail and quality of construction exceeded our expectations. Highly recommend!',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
    },
    {
      name: 'Sita Poudel',
      location: 'Pokhara',
      project: 'Vastu-Compliant Villa',
      rating: 5,
      text: 'Very professional team. They helped us design a beautiful home following Vastu principles. Their consultants were knowledgeable and patient with all our questions.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
    },
    {
      name: 'Kamal Thapa',
      location: 'Lalitpur',
      project: 'Commercial Complex',
      rating: 5,
      text: 'Outstanding service from start to finish. The project management was excellent, and they handled all permits and legal work efficiently. Very satisfied with the quality.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
    },
    {
      name: 'Maya Gurung',
      location: 'Bhaktapur',
      project: 'Traditional Newari House',
      rating: 5,
      text: 'They beautifully preserved traditional architecture while adding modern amenities. The craftsmanship is superb, and they respected our cultural requirements perfectly.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
    },
    {
      name: 'Bikash Rai',
      location: 'Dharan',
      project: 'Eco-Friendly Home',
      rating: 5,
      text: 'Very impressed with their green building approach. Solar panels, rainwater harvesting - everything works perfectly. Great team, great results!',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
    },
    {
      name: 'Anita Shrestha',
      location: 'Biratnagar',
      project: 'Luxury Apartment Complex',
      rating: 5,
      text: 'Professional, transparent, and delivered exactly what was promised. The quality of materials and finishing is top-notch. Would definitely work with them again.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
            Client <span className="text-gradient">Testimonials</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Hear what our satisfied clients have to say about their experience
          </p>
          <Button 
            onClick={() => window.open('https://wa.me/9779845323733?text=I want to share my experience', '_blank')}
            className="bg-[#25D366] hover:bg-[#20BA5A] text-white"
            size="lg"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Share Your Story
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="glass hover-lift">
              <CardContent className="p-6">
                <Quote className="w-10 h-10 text-primary mb-4 opacity-50" />
                
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-foreground">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>

                <p className="text-sm text-muted-foreground mb-3 italic">
                  "{testimonial.text}"
                </p>

                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-primary font-semibold">
                    Project: {testimonial.project}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="glass mt-12">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Ready to Start Your Dream Project?
            </h2>
            <p className="text-muted-foreground mb-6">
              Join hundreds of satisfied homeowners who trusted us with their construction needs
            </p>
            <Button 
              onClick={() => window.open('https://wa.me/9779845323733?text=I want to start my construction project', '_blank')}
              className="bg-primary hover:bg-primary/90"
              size="lg"
            >
              Get Started Today
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Testimonials;
