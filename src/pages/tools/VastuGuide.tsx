import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Compass, Home, MapPin, DoorOpen, Bed, Utensils, BookOpen, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

const VastuGuide = () => {
  const [selectedVastuSection, setSelectedVastuSection] = useState("overview");
  const [vastuDirection, setVastuDirection] = useState("");
  const [vastuRecommendation, setVastuRecommendation] = useState<{
    description: string;
    dos: string[];
    donts: string[];
    color: string;
  } | null>(null);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [roomRecommendation, setRoomRecommendation] = useState<{
    ideal: string;
    direction: string;
    tips: string[];
    avoid: string[];
  } | null>(null);

  // Vastu Directional Analysis
  const analyzeVastu = () => {
    const recommendations: { [key: string]: { description: string, dos: string[], donts: string[], color: string } } = {
      north: {
        description: "North direction is ruled by Kuber, the God of wealth. It brings prosperity, financial growth, and career opportunities.",
        dos: [
          "Ideal for main entrance and living rooms",
          "Excellent for study rooms and home offices",
          "Good for water elements like aquariums",
          "Use light colors like white, blue, green"
        ],
        donts: [
          "Avoid heavy furniture in this direction",
          "No toilets or kitchen in north",
          "Avoid dark colors in this area",
          "Don't block with storage or clutter"
        ],
        color: "bg-card/50 border-primary/20"
      },
      south: {
        description: "South direction is governed by Yama, the God of death. It provides stability and protection when balanced properly.",
        dos: [
          "Best for master bedroom placement",
          "Ideal for heavy furniture and storage",
          "Good for staircase and structural support",
          "Use warm colors like red, orange, brown"
        ],
        donts: [
          "Avoid main entrance in south",
          "No water elements or bathrooms",
          "Don't keep this area empty",
          "Avoid light colors in this zone"
        ],
        color: "bg-card/50 border-destructive/20"
      },
      east: {
        description: "East direction is ruled by Indra, the King of Gods. It brings health, vitality, and spiritual growth.",
        dos: [
          "Perfect for main entrance and prayer room",
          "Ideal for living rooms and balconies",
          "Good for study areas and kitchens",
          "Use light colors, allow morning sunlight"
        ],
        donts: [
          "Avoid toilets in east direction",
          "No heavy construction or blockage",
          "Don't use dark colors",
          "Avoid storing garbage in east"
        ],
        color: "bg-card/50 border-accent/30"
      },
      west: {
        description: "West direction provides social connections and children's happiness when balanced correctly.",
        dos: [
          "Good for children's bedrooms",
          "Ideal for dining areas and study",
          "Suitable for guest rooms",
          "Use white, yellow, or light gray colors"
        ],
        donts: [
          "Avoid main entrance in west",
          "No prayer room in this direction",
          "Don't extend construction westward",
          "Avoid red and black colors"
        ],
        color: "bg-card/50 border-accent/20"
      },
      northeast: {
        description: "Northeast (Ishaan) is the most sacred direction, ruled by Shiva. It brings divine blessings and overall prosperity.",
        dos: [
          "Perfect for prayer and meditation room",
          "Ideal for main entrance if possible",
          "Keep clean, open and elevated",
          "Use white, light blue, saffron colors"
        ],
        donts: [
          "Never place toilets here",
          "No kitchen or fire elements",
          "Avoid heavy furniture or storage",
          "Don't use dark colors"
        ],
        color: "bg-card/50 border-primary/30"
      },
      northwest: {
        description: "Northwest (Vayavya) is ruled by Vayu, the God of wind. It influences relationships and travels.",
        dos: [
          "Good for guest bedrooms",
          "Ideal for storage and parking",
          "Suitable for daughter's bedroom",
          "Use gray, white, or light colors"
        ],
        donts: [
          "Avoid prayer room placement",
          "No heavy construction here",
          "Don't place kitchen in northwest",
          "Avoid red and black colors"
        ],
        color: "bg-card/50 border-muted/30"
      },
      southeast: {
        description: "Southeast (Agneya) is ruled by Agni, the Fire God. It's ideal for fire-related activities.",
        dos: [
          "Perfect for kitchen placement",
          "Good for electrical equipment",
          "Ideal for boilers and generators",
          "Use red, orange, or pink colors"
        ],
        donts: [
          "Avoid prayer room here",
          "No toilets in southeast",
          "Don't place water elements",
          "Avoid blue and black colors"
        ],
        color: "bg-card/50 border-accent/20"
      },
      southwest: {
        description: "Southwest (Nairutya) provides stability, strength, and relationships when balanced properly.",
        dos: [
          "Best for master bedroom",
          "Ideal for heavy furniture",
          "Good for safe and valuables",
          "Use earth tones, red, brown"
        ],
        donts: [
          "Avoid toilets here",
          "No kitchen in southwest",
          "Don't keep this area empty",
          "Avoid light colors"
        ],
        color: "bg-card/50 border-primary/20"
      }
    };

    if (vastuDirection && recommendations[vastuDirection]) {
      setVastuRecommendation(recommendations[vastuDirection]);
    }
  };

  // Room-specific Vastu Analysis
  const analyzeRoomVastu = () => {
    const roomRecommendations: { [key: string]: { ideal: string, direction: string, tips: string[], avoid: string[] } } = {
      bedroom: {
        ideal: "Master bedroom in Southwest, children's rooms in Northwest",
        direction: "Head towards South or East while sleeping",
        tips: [
          "Use calming colors like light blue, green",
          "Keep electronics minimum",
          "Place bed against solid wall",
          "Avoid mirrors facing bed"
        ],
        avoid: [
          "Don't sleep with head towards North",
          "Avoid attached toilet in Northeast",
          "No beams over bed",
          "Don't keep photos of deceased"
        ]
      },
      kitchen: {
        ideal: "Southeast direction is perfect for kitchen",
        direction: "Cook facing East for positive energy",
        tips: [
          "Keep kitchen clean and organized",
          "Store grains in Southwest",
          "Place sink in Northeast",
          "Use fire colors like red, orange"
        ],
        avoid: [
          "Never place kitchen in Northeast",
          "Avoid toilet opposite kitchen",
          "Don't place stove under beam",
          "No mirror in kitchen"
        ]
      },
      livingroom: {
        ideal: "North, East or Northeast directions",
        direction: "Sit facing North or East",
        tips: [
          "Keep Northeast corner light and open",
          "Use bright and welcoming colors",
          "Place heavy furniture in Southwest",
          "Ensure good natural light"
        ],
        avoid: [
          "Avoid living room in Southwest",
          "No toilets adjacent to living room",
          "Don't place TV in Northeast",
          "Avoid dark colors in Northeast"
        ]
      },
      poojaroom: {
        ideal: "Northeast corner is most auspicious",
        direction: "Face East or North while praying",
        tips: [
          "Keep clean and clutter-free",
          "Use white, yellow, or light colors",
          "Place idols in East or West",
          "Maintain silence and purity"
        ],
        avoid: [
          "Never place in Southwest or Southeast",
          "No toilet above or below",
          "Don't keep broken idols",
          "Avoid sleeping in prayer room"
        ]
      },
      bathroom: {
        ideal: "West or Northwest directions",
        direction: "Face East while using toilet",
        tips: [
          "Keep bathroom door closed",
          "Use light colors and good ventilation",
          "Place mirrors on North or East walls",
          "Ensure proper drainage"
        ],
        avoid: [
          "Never in Northeast or Southwest",
          "Avoid bathroom in center of house",
          "Don't face West while using toilet",
          "No bathroom under staircase"
        ]
      },
      studyroom: {
        ideal: "East, North or Northeast directions",
        direction: "Face East or North while studying",
        tips: [
          "Use green or light blue colors",
          "Ensure good natural light",
          "Place bookshelf in Southwest",
          "Keep Northeast corner light"
        ],
        avoid: [
          "Avoid study under beams",
          "No toilet adjacent to study",
          "Don't face South while studying",
          "Avoid clutter on study table"
        ]
      }
    };

    if (selectedRoom && roomRecommendations[selectedRoom]) {
      setRoomRecommendation(roomRecommendations[selectedRoom]);
    }
  };

  const vastuData = {
    overview: {
      title: "Vastu Shastra Overview",
      icon: Compass,
      content: `Vastu Shastra is a refined combination of ancient Hindu traditions developed as an art, analyzed as a science, and interpreted astrologically for healthy living. It teaches how to design homes in harmony with natural forces: Sun, Earth, Sky, Air, and Water.

The objective is to become open to positive elemental influences while being protected from unseen malevolence. Positive vibrations bring happiness through excellence in health and business, while negative vibrations can bring grief and losses.

Vastu Shastra helps achieve the four main goals of human existence: Dharma (religion), Arth (wealth), Kama (desires), and Moksha (salvation).`
    },
    principles: {
      title: "Five Elements & Principles",
      icon: Home,
      content: `Vastu Shastra revolves around five elements from Indian Mythology:

SKY (Space): Endless vacuum holding unimaginable power
AIR: Biologically needed by all living things for subsistence  
WATER: Rainfall that filled Earth's gaps and low-lying areas
EARTH: Formed from molten rocks with great magnetic force
FIRE (Sun): Main source of life, worshipped as personification of God

DIRECTIONAL BENEFITS:
North: Happiness and Calm
East: Abundance of wealth  
South: Shortage of female members or tragedies
West: Stomach and sexual troubles among males
Northwest: Unhealthy rivalry causing trouble
Southwest: Conflict with the son
Southeast: Death will be dreaded
Center: Heavy monetary losses`
    },
    land: {
      title: "Land Selection & Preparation",
      icon: MapPin,
      content: `IDEAL LAND SHAPES:
Square or rectangular lands (most preferred)
Sherdah: Wider in front, narrower at rear
Gaumukhi: Narrower front, wider rear

LAND FACING DIRECTIONS:
Northeast: Best for homes, factories, offices
Northwest: Ideal for trading and business
Southeast: Good for chemical/petro-chemical industries  
Southwest: Good for night-time activities

SOIL QUALITY:
Perfect: Yellowish colored soil
Avoid: Black clay-like soil, rocky soil, soil with worms/humus

EXCAVATION FINDINGS:
Stone: Wealth abundance
Bricks: Future riches
Copper/metals: Affluence 
Coal: Illnesses and losses
Animal bones: Hindrance to development
Snake/scorpion: Construction obstacles
Anthill/termites: Wealth damage, reduced longevity`
    },
    doors: {
      title: "Doors & Main Entrance",
      icon: DoorOpen,
      content: `MAIN DOOR PLACEMENT:
Ideal: East, Northeast, East of Northeast, or North of Northeast
Should have two shutters and be larger than other doors
Recommended material: Teak wood

DOOR SPECIFICATIONS:
Should not face a wall
No shadow should loom on main door
Not at extreme corners or center of house
Should not face road intersections or dead-end roads
No large trees or lamp posts blocking entrance
Even number of steps for entrance stairs
Two houses should not share single main entrance

ADDITIONAL FEATURES:
Place Swastika symbol on door
Heavy decorations as adornment
South-facing doors should have balcony or verandah`
    },
    rooms: {
      title: "Room Placement Guide",
      icon: Bed,
      content: `LIVING ROOM:
Front of house, wide and large
Dwellers should face East or North
Avoid West or South sides
Multiple doors allowed in right locations
For negotiations: Owner faces East, guests face South/West

BEDROOMS:
Males: West or Northwest
Females: South or Southeast  
Master Bedroom: Southwest
Married children: Southwest
Children's rooms: Northwest or East
Avoid East for newly wed couples

BEDROOM NORMS:
Sleep with head facing East or South (never North for guests)
Step out with right foot first
Study on East side for best results
Wardrobes in Northwest/South
TVs/heaters in Southeast
Bathroom within room: West or North
Safes on South wall
Keep Southwest corner occupied
No photos/statues in bedrooms
Keep night bulb lighted
Colors: Light rose, dark blue, dark green (avoid white/light yellow)`
    },
    kitchen: {
      title: "Kitchen & Dining",
      icon: Utensils,
      content: `KITCHEN PLACEMENT:
Ideal: Southeast (fire element)
Alternative: Northwest
Cook should face East
AVOID Northeast (causes family/financial problems)

KITCHEN SPECIFICS:
Sink with tap water in Northeast
Sink not near stove (disrupts peace)
Storage shelves in South and West
Heavy items in South/West

DINING ROOM:
Near kitchen in Southeast, Northwest, or Northeast
West side encourages profitability
Table at center but not towards Southwest
Head of family faces East during meals
Others face East, West, or North (never South)
Square/rectangular tables (no round/egg-shaped)
Water/wash basin in East/North (never Southeast/Southwest)
Colors: Light blue, yellow, saffron, light green`
    }
  };

  const CurrentVastuSection = vastuData[selectedVastuSection as keyof typeof vastuData];

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Vastu Shastra Guide
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ancient Indian architectural science for harmonious living spaces
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 glass hover-lift cursor-pointer" onClick={() => setSelectedVastuSection("overview")}>
            <Compass className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Overview</h3>
            <p className="text-muted-foreground">Introduction to Vastu Shastra</p>
          </Card>
          <Card className="p-6 glass hover-lift cursor-pointer" onClick={() => setSelectedVastuSection("principles")}>
            <Home className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">Five Elements</h3>
            <p className="text-muted-foreground">Core principles & directions</p>
          </Card>
          <Card className="p-6 glass hover-lift cursor-pointer" onClick={() => setSelectedVastuSection("land")}>
            <MapPin className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Land Selection</h3>
            <p className="text-muted-foreground">Choosing the right plot</p>
          </Card>
          <Card className="p-6 glass hover-lift cursor-pointer" onClick={() => setSelectedVastuSection("doors")}>
            <DoorOpen className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">Doors & Entrance</h3>
            <p className="text-muted-foreground">Main door placement</p>
          </Card>
          <Card className="p-6 glass hover-lift cursor-pointer" onClick={() => setSelectedVastuSection("rooms")}>
            <Bed className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Room Placement</h3>
            <p className="text-muted-foreground">Optimal room positions</p>
          </Card>
          <Card className="p-6 glass hover-lift cursor-pointer" onClick={() => setSelectedVastuSection("kitchen")}>
            <Utensils className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">Kitchen & Dining</h3>
            <p className="text-muted-foreground">Food preparation areas</p>
          </Card>
        </div>

        <Card className="p-8 glass mb-8">
          <div className="flex items-center gap-4 mb-6">
            <CurrentVastuSection.icon className="w-10 h-10 text-primary" />
            <h2 className="text-3xl font-bold">{CurrentVastuSection.title}</h2>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-line text-foreground leading-relaxed">
              {CurrentVastuSection.content}
            </p>
          </div>
        </Card>

        {/* Directional Analysis */}
        <Card className="p-8 glass mb-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Compass className="w-8 h-8 text-primary" />
            Directional Analysis
          </h2>
          <div className="space-y-6">
            <div>
              <Label className="text-lg mb-2 block">Select Direction</Label>
              <Select value={vastuDirection} onValueChange={setVastuDirection}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Choose a direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="north">North</SelectItem>
                  <SelectItem value="south">South</SelectItem>
                  <SelectItem value="east">East</SelectItem>
                  <SelectItem value="west">West</SelectItem>
                  <SelectItem value="northeast">Northeast</SelectItem>
                  <SelectItem value="northwest">Northwest</SelectItem>
                  <SelectItem value="southeast">Southeast</SelectItem>
                  <SelectItem value="southwest">Southwest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={analyzeVastu} className="w-full">
              Analyze Direction
            </Button>

            {vastuRecommendation && (
              <Card className={`p-6 border-2 ${vastuRecommendation.color}`}>
                <p className="text-foreground mb-6 text-lg leading-relaxed">{vastuRecommendation.description}</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-accent mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {vastuRecommendation.dos.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-foreground">
                          <span className="text-accent mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-destructive mb-3 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      Things to Avoid
                    </h4>
                    <ul className="space-y-2">
                      {vastuRecommendation.donts.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-foreground">
                          <span className="text-destructive mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </Card>

        {/* Room-Specific Vastu */}
        <Card className="p-8 glass">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Bed className="w-8 h-8 text-primary" />
            Room-Specific Vastu
          </h2>
          <div className="space-y-6">
            <div>
              <Label className="text-lg mb-2 block">Select Room Type</Label>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Choose a room" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bedroom">Bedroom</SelectItem>
                  <SelectItem value="kitchen">Kitchen</SelectItem>
                  <SelectItem value="livingroom">Living Room</SelectItem>
                  <SelectItem value="poojaroom">Pooja/Prayer Room</SelectItem>
                  <SelectItem value="bathroom">Bathroom</SelectItem>
                  <SelectItem value="studyroom">Study Room</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={analyzeRoomVastu} className="w-full">
              Get Room Guidance
            </Button>

            {roomRecommendation && (
              <Card className="p-6 border-2 bg-card/50 border-primary/20">
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Ideal Placement</h4>
                      <p className="text-foreground">{roomRecommendation.ideal}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Compass className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Direction</h4>
                      <p className="text-foreground">{roomRecommendation.direction}</p>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-accent mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Tips
                    </h4>
                    <ul className="space-y-2">
                      {roomRecommendation.tips.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-foreground">
                          <span className="text-accent mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-destructive mb-3 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      Things to Avoid
                    </h4>
                    <ul className="space-y-2">
                      {roomRecommendation.avoid.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-foreground">
                          <span className="text-destructive mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VastuGuide;