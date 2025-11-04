import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, TrendingUp, Home, DollarSign, Percent, MessageCircle, Compass, Bed, Utensils, BookOpen, Droplets, Stairs, TreePine, DoorOpen, Building, MapPin, ArrowRight, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Calculators = () => {
  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTenure, setLoanTenure] = useState("");
  const [emi, setEmi] = useState<number | null>(null);

  // ROI Calculator State
  const [propertyValue, setPropertyValue] = useState("");
  const [appreciationRate, setAppreciationRate] = useState("");
  const [years, setYears] = useState("");
  const [futureValue, setFutureValue] = useState<number | null>(null);

  // Rental Yield Calculator State
  const [purchasePrice, setPurchasePrice] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [rentalYield, setRentalYield] = useState<number | null>(null);

  // Vastu Section State
  const [selectedVastuSection, setSelectedVastuSection] = useState("overview");
  const [vastuDirection, setVastuDirection] = useState("");
  const [vastuRecommendation, setVastuRecommendation] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [roomRecommendation, setRoomRecommendation] = useState("");
  const [activeVastuTab, setActiveVastuTab] = useState("sections"); // "sections" or "room"

  // EMI Calculation
  const calculateEMI = () => {
    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 12 / 100;
    const n = parseFloat(loanTenure) * 12;

    if (P && r && n) {
      const emiValue = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setEmi(Math.round(emiValue));
    }
  };

  // ROI Calculation
  const calculateROI = () => {
    const P = parseFloat(propertyValue);
    const r = parseFloat(appreciationRate) / 100;
    const t = parseFloat(years);

    if (P && r && t) {
      const future = P * Math.pow(1 + r, t);
      setFutureValue(Math.round(future));
    }
  };

  // Rental Yield Calculation
  const calculateRentalYield = () => {
    const price = parseFloat(purchasePrice);
    const rent = parseFloat(monthlyRent);

    if (price && rent) {
      const annualRent = rent * 12;
      const yield_value = (annualRent / price) * 100;
      setRentalYield(Math.round(yield_value * 100) / 100);
    }
  };

  // Vastu Analysis
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
        color: "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800"
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
        color: "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
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
        color: "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
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
        color: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800"
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
        color: "bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800"
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
        color: "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
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
        color: "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800"
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
        color: "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800"
      }
    };

    setVastuRecommendation(recommendations[vastuDirection] || "Please select a direction for detailed Vastu analysis.");
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

    setRoomRecommendation(roomRecommendations[selectedRoom] || "Please select a room type for Vastu guidance.");
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

  const banks = [
    { name: "Nepal Bank Limited", rate: "9.5-11%", features: "Low interest, flexible tenure" },
    { name: "Rastriya Banijya Bank", rate: "9.75-11.5%", features: "Government bank, subsidized rates" },
    { name: "Nabil Bank", rate: "10-12%", features: "Quick processing, premium service" },
    { name: "NIC Asia Bank", rate: "9.8-11.8%", features: "Competitive rates, digital banking" },
    { name: "Global IME Bank", rate: "10-12.5%", features: "Wide branch network" },
    { name: "Himalayan Bank", rate: "9.9-11.9%", features: "Personalized solutions" }
  ];

  const CurrentVastuSection = vastuData[selectedVastuSection];

  // Handle Vastu section selection
  const handleVastuSectionSelect = (section: string) => {
    setSelectedVastuSection(section);
    setActiveVastuTab("sections");
    setRoomRecommendation("");
  };

  // Handle room selection
  const handleRoomSelect = (room: string) => {
    setSelectedRoom(room);
    setActiveVastuTab("room");
    setVastuRecommendation("");
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Practical <span className="text-primary">Tools</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Financial calculators and Vastu guidance for your construction project
          </p>
        </div>

        {/* Quick Contact */}
        <Card className="bg-card p-6 mb-12 text-center border border-border">
          <h3 className="text-xl font-bold mb-3 text-foreground">Need Personalized Financial Advice?</h3>
          <p className="text-muted-foreground mb-4">Our team can help you plan your construction budget and financing</p>
          <Button 
            size="lg"
            className="bg-[#25D366] hover:bg-[#20BA5A] text-white"
            onClick={() => window.open('https://wa.me/9779845323733?text=Hello! I need help with construction financing and planning.', '_blank')}
          >
            <MessageCircle className="mr-2" size={20} />
            Get Financial Guidance
          </Button>
        </Card>

        {/* Main Calculators */}
        <Tabs defaultValue="emi" className="w-full mb-16">
          <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-2 md:grid-cols-4 mb-12 bg-muted p-1">
            <TabsTrigger value="emi" className="text-foreground data-[state=active]:bg-background">EMI Calculator</TabsTrigger>
            <TabsTrigger value="roi" className="text-foreground data-[state=active]:bg-background">ROI Calculator</TabsTrigger>
            <TabsTrigger value="rental" className="text-foreground data-[state=active]:bg-background">Rental Yield</TabsTrigger>
            <TabsTrigger value="vastu" className="text-foreground data-[state=active]:bg-background">Vastu Guide</TabsTrigger>
          </TabsList>

          {/* EMI Calculator */}
          <TabsContent value="emi">
            <Card className="bg-card p-8 max-w-2xl mx-auto border border-border">
              <div className="flex items-center space-x-3 mb-6">
                <Calculator className="text-primary" size={32} />
                <h2 className="text-2xl font-bold text-foreground">Home Loan EMI Calculator</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="loanAmount" className="text-foreground">Loan Amount (NPR)</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    placeholder="e.g., 5000000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="interestRate" className="text-foreground">Interest Rate (% per annum)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 10.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="loanTenure" className="text-foreground">Loan Tenure (Years)</Label>
                  <Input
                    id="loanTenure"
                    type="number"
                    placeholder="e.g., 15"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <Button onClick={calculateEMI} className="w-full" size="lg">
                  Calculate EMI
                </Button>
                {emi && (
                  <div className="bg-primary/10 p-6 rounded-lg text-center animate-fade-in border border-primary/20">
                    <div className="text-sm text-muted-foreground mb-2">Monthly EMI</div>
                    <div className="text-4xl font-bold text-primary">NPR {emi.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground mt-4">
                      Total Payment: NPR {(emi * parseFloat(loanTenure) * 12).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Interest: NPR {((emi * parseFloat(loanTenure) * 12) - parseFloat(loanAmount)).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* ROI Calculator */}
          <TabsContent value="roi">
            <Card className="bg-card p-8 max-w-2xl mx-auto border border-border">
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="text-primary" size={32} />
                <h2 className="text-2xl font-bold text-foreground">Property Appreciation Calculator</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="propertyValue" className="text-foreground">Current Property Value (NPR)</Label>
                  <Input
                    id="propertyValue"
                    type="number"
                    placeholder="e.g., 10000000"
                    value={propertyValue}
                    onChange={(e) => setPropertyValue(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="appreciationRate" className="text-foreground">Expected Appreciation Rate (% per year)</Label>
                  <Input
                    id="appreciationRate"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 8 (Nepal avg: 6-10%)"
                    value={appreciationRate}
                    onChange={(e) => setAppreciationRate(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="years" className="text-foreground">Investment Period (Years)</Label>
                  <Input
                    id="years"
                    type="number"
                    placeholder="e.g., 10"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <Button onClick={calculateROI} className="w-full" size="lg">
                  Calculate Future Value
                </Button>
                {futureValue && (
                  <div className="bg-primary/10 p-6 rounded-lg text-center animate-fade-in border border-primary/20">
                    <div className="text-sm text-muted-foreground mb-2">Estimated Future Value</div>
                    <div className="text-4xl font-bold text-primary">NPR {futureValue.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground mt-4">
                      Total Appreciation: NPR {(futureValue - parseFloat(propertyValue)).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ROI: {Math.round(((futureValue - parseFloat(propertyValue)) / parseFloat(propertyValue)) * 100)}%
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Rental Yield Calculator */}
          <TabsContent value="rental">
            <Card className="bg-card p-8 max-w-2xl mx-auto border border-border">
              <div className="flex items-center space-x-3 mb-6">
                <Home className="text-primary" size={32} />
                <h2 className="text-2xl font-bold text-foreground">Rental Yield Calculator</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="purchasePrice" className="text-foreground">Property Purchase Price (NPR)</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    placeholder="e.g., 15000000"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyRent" className="text-foreground">Expected Monthly Rent (NPR)</Label>
                  <Input
                    id="monthlyRent"
                    type="number"
                    placeholder="e.g., 50000"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <Button onClick={calculateRentalYield} className="w-full" size="lg">
                  Calculate Rental Yield
                </Button>
                {rentalYield && (
                  <div className="bg-primary/10 p-6 rounded-lg text-center animate-fade-in border border-primary/20">
                    <div className="text-sm text-muted-foreground mb-2">Annual Rental Yield</div>
                    <div className="text-4xl font-bold text-primary">{rentalYield}%</div>
                    <div className="text-sm text-muted-foreground mt-4">
                      Annual Rental Income: NPR {(parseFloat(monthlyRent) * 12).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      {rentalYield > 6 ? "✅ Excellent rental yield for Nepal market!" : 
                       rentalYield > 4 ? "✓ Good rental yield" : 
                       "⚠️ Consider location and property type"}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Enhanced Vastu Guide */}
          <TabsContent value="vastu">
            <Card className="bg-card p-8 max-w-6xl mx-auto border border-border">
              <div className="flex items-center space-x-3 mb-6">
                <Compass className="text-primary" size={32} />
                <h2 className="text-2xl font-bold text-foreground">Complete Vastu Shastra Guide</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <Card className="lg:col-span-1 p-6 h-fit bg-muted/50 border-border">
                  <h3 className="text-lg font-bold mb-4 text-foreground">Vastu Sections</h3>
                  <div className="space-y-3">
                    {Object.entries(vastuData).map(([key, data]) => {
                      const IconComponent = data.icon;
                      return (
                        <Button
                          key={key}
                          variant={selectedVastuSection === key && activeVastuTab === "sections" ? "default" : "outline"}
                          className="w-full justify-start h-auto min-h-[60px] py-3 px-4 whitespace-normal text-left"
                          onClick={() => handleVastuSectionSelect(key)}
                        >
                          <div className="flex items-start space-x-3 w-full">
                            <IconComponent className="flex-shrink-0 mt-0.5" size={18} />
                            <span className="flex-1 text-sm leading-tight">{data.title}</span>
                          </div>
                        </Button>
                      );
                    })}
                  </div>

                  {/* Quick Room Analysis */}
                  <div className="mt-8">
                    <h4 className="font-bold mb-4 text-foreground">Room-specific Vastu</h4>
                    <Select value={selectedRoom} onValueChange={handleRoomSelect}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bedroom">Bedroom</SelectItem>
                        <SelectItem value="kitchen">Kitchen</SelectItem>
                        <SelectItem value="livingroom">Living Room</SelectItem>
                        <SelectItem value="poojaroom">Prayer Room</SelectItem>
                        <SelectItem value="bathroom">Bathroom</SelectItem>
                        <SelectItem value="studyroom">Study Room</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={() => {
                        setActiveVastuTab("room");
                        analyzeRoomVastu();
                      }} 
                      className="w-full mt-3" 
                      size="sm"
                      disabled={!selectedRoom}
                    >
                      Get Room Vastu
                    </Button>
                  </div>
                </Card>

                {/* Content Area */}
                <div className="lg:col-span-3 space-y-8">
                  {/* Vastu Sections Content */}
                  {activeVastuTab === "sections" && (
                    <>
                      {/* Main Content */}
                      <div>
                        <div className="flex items-center space-x-3 mb-6">
                          <CurrentVastuSection.icon className="text-primary" size={24} />
                          <h3 className="text-xl font-bold text-foreground">{CurrentVastuSection.title}</h3>
                        </div>
                        
                        <div className="prose prose-lg max-w-none">
                          {CurrentVastuSection.content.split('\n').map((paragraph, index) => (
                            <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
                              {paragraph.trim()}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Direction Analysis */}
                      <Card className="p-6 bg-muted/30 border-border">
                        <h4 className="font-bold mb-4 flex items-center text-foreground">
                          <Compass className="mr-2" size={20} />
                          Direction Analysis Tool
                        </h4>
                        <div className="space-y-6">
                          <div>
                            <Label htmlFor="vastuDirection" className="text-foreground">Select Direction for Detailed Analysis</Label>
                            <Select value={vastuDirection} onValueChange={setVastuDirection}>
                              <SelectTrigger className="bg-background border-border">
                                <SelectValue placeholder="Choose a direction" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="north">North (उत्तर) - Wealth & Career</SelectItem>
                                <SelectItem value="south">South (दक्षिण) - Stability & Protection</SelectItem>
                                <SelectItem value="east">East (पूर्व) - Health & Spirituality</SelectItem>
                                <SelectItem value="west">West (पश्चिम) - Social & Children</SelectItem>
                                <SelectItem value="northeast">Northeast (ईशान) - Divine & Prosperity</SelectItem>
                                <SelectItem value="northwest">Northwest (वायव्य) - Relationships & Travel</SelectItem>
                                <SelectItem value="southeast">Southeast (आग्नेय) - Fire & Energy</SelectItem>
                                <SelectItem value="southwest">Southwest (नैऋत्य) - Strength & Relationships</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <Button onClick={analyzeVastu} className="w-full" size="lg" disabled={!vastuDirection}>
                              Analyze Direction
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setVastuDirection("");
                                setVastuRecommendation("");
                              }}
                              className="w-full"
                            >
                              Clear Analysis
                            </Button>
                          </div>

                          {vastuRecommendation && typeof vastuRecommendation === 'object' && (
                            <div className={`p-6 rounded-lg border-2 animate-fade-in ${vastuRecommendation.color}`}>
                              <div className="flex items-start space-x-3 mb-4">
                                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                                <div>
                                  <div className="font-semibold text-lg text-foreground mb-2">
                                    {vastuDirection.charAt(0).toUpperCase() + vastuDirection.slice(1)} Direction Analysis
                                  </div>
                                  <p className="text-foreground leading-relaxed">
                                    {vastuRecommendation.description}
                                  </p>
                                </div>
                              </div>

                              <div className="grid md:grid-cols-2 gap-6 mt-6">
                                <div>
                                  <h5 className="font-bold text-green-700 mb-3 flex items-center">
                                    <CheckCircle className="mr-2" size={16} />
                                    Recommended (Do's)
                                  </h5>
                                  <ul className="space-y-2">
                                    {vastuRecommendation.dos.map((item, index) => (
                                      <li key={index} className="flex items-start space-x-2">
                                        <ArrowRight className="text-green-600 flex-shrink-0 mt-1" size={14} />
                                        <span className="text-sm text-foreground">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h5 className="font-bold text-red-700 mb-3 flex items-center">
                                    <XCircle className="mr-2" size={16} />
                                    Avoid (Don'ts)
                                  </h5>
                                  <ul className="space-y-2">
                                    {vastuRecommendation.donts.map((item, index) => (
                                      <li key={index} className="flex items-start space-x-2">
                                        <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={14} />
                                        <span className="text-sm text-foreground">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    </>
                  )}

                  {/* Room-specific Recommendations */}
                  {activeVastuTab === "room" && roomRecommendation && typeof roomRecommendation === 'object' && (
                    <Card className="p-6 bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
                      <h4 className="font-bold mb-4 flex items-center text-blue-800 dark:text-blue-300">
                        <Bed className="mr-2" size={20} />
                        {selectedRoom.charAt(0).toUpperCase() + selectedRoom.slice(1)} Vastu Guide
                      </h4>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Ideal Placement</h5>
                          <p className="text-blue-900 dark:text-blue-300 text-sm mb-4">{roomRecommendation.ideal}</p>
                          
                          <h5 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Facing Direction</h5>
                          <p className="text-blue-900 dark:text-blue-300 text-sm mb-4">{roomRecommendation.direction}</p>
                          
                          <h5 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Vastu Tips</h5>
                          <ul className="space-y-1">
                            {roomRecommendation.tips.map((tip, index) => (
                              <li key={index} className="flex items-start space-x-2 text-sm text-blue-900 dark:text-blue-300">
                                <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={14} />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-semibold text-red-700 dark:text-red-400 mb-2">Things to Avoid</h5>
                          <ul className="space-y-1">
                            {roomRecommendation.avoid.map((item, index) => (
                              <li key={index} className="flex items-start space-x-2 text-sm text-red-900 dark:text-red-300">
                                <XCircle className="text-red-600 flex-shrink-0 mt-0.5" size={14} />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bank Loan Comparison */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
            Nepal Bank <span className="text-primary">Home Loan</span> Comparison
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banks.map((bank, index) => (
              <Card key={index} className="bg-card p-6 hover-lift border border-border">
                <div className="flex items-center space-x-3 mb-4">
                  <DollarSign className="text-primary" size={24} />
                  <h3 className="text-lg font-bold text-foreground">{bank.name}</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Interest Rate</span>
                    <span className="text-lg font-bold text-primary">{bank.rate}</span>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-start space-x-2">
                      <Percent className="text-primary flex-shrink-0 mt-0.5" size={16} />
                      <span className="text-sm text-muted-foreground">{bank.features}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Card className="bg-card p-6 mt-8 text-center border border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Interest rates are approximate and may vary. Contact banks directly for current rates and eligibility.
            </p>
            <Button 
              variant="outline"
              onClick={() => window.open('https://wa.me/9779845323733?text=Hello! I want to compare home loan options for my construction project.', '_blank')}
            >
              <MessageCircle className="mr-2" size={16} />
              Get Loan Assistance
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calculators;