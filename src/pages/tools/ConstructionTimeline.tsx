import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, Play, Pause } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import ConstructionAnimation3D from '@/components/ConstructionAnimation3D';

interface Stage {
  name: string;
  duration: number;
  color: string;
  description: string;
}

const ConstructionTimeline = () => {
  const [buildingType, setBuildingType] = useState<'residential' | 'commercial'>('residential');
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const residentialStages: Stage[] = [
    { name: 'Planning & Design', duration: 2, color: 'hsl(349 96% 30%)', description: 'Architectural plans, structural design, approvals' },
    { name: 'Site Preparation', duration: 1, color: 'hsl(40 95% 53%)', description: 'Land clearing, excavation, leveling' },
    { name: 'Foundation', duration: 2, color: 'hsl(300 5% 42%)', description: 'Footing, plinth beam, basement construction' },
    { name: 'Structure (RCC)', duration: 4, color: 'hsl(349 96% 40%)', description: 'Columns, beams, slabs for all floors' },
    { name: 'Brickwork & Masonry', duration: 3, color: 'hsl(40 85% 48%)', description: 'Walls, partitions, compound walls' },
    { name: 'Plumbing & Electrical', duration: 2, color: 'hsl(200 80% 50%)', description: 'Pipe laying, wiring, fixture installation' },
    { name: 'Plastering & Finishing', duration: 2, color: 'hsl(300 5% 50%)', description: 'Internal/external plastering, paint prep' },
    { name: 'Flooring & Tiling', duration: 2, color: 'hsl(349 86% 35%)', description: 'Floor tiles, bathroom tiles, kitchen tiles' },
    { name: 'Woodwork & Fittings', duration: 2, color: 'hsl(30 60% 40%)', description: 'Doors, windows, cupboards, railings' },
    { name: 'Painting', duration: 1.5, color: 'hsl(200 70% 55%)', description: 'Primer, putty, final paint application' },
    { name: 'Final Fixtures', duration: 1, color: 'hsl(40 95% 53%)', description: 'Switches, lights, taps, accessories' },
    { name: 'Cleanup & Handover', duration: 0.5, color: 'hsl(120 60% 50%)', description: 'Final cleaning, inspection, documentation' }
  ];

  const commercialStages: Stage[] = [
    { name: 'Planning & Permits', duration: 3, color: 'hsl(349 96% 30%)', description: 'Detailed plans, NOC, building permits' },
    { name: 'Site Preparation', duration: 1.5, color: 'hsl(40 95% 53%)', description: 'Demolition, excavation, soil testing' },
    { name: 'Foundation & Basement', duration: 3, color: 'hsl(300 5% 42%)', description: 'Deep foundation, basement slabs, parking' },
    { name: 'Structural Framework', duration: 6, color: 'hsl(349 96% 40%)', description: 'Multi-story RCC structure, lift shafts' },
    { name: 'Envelope & Masonry', duration: 4, color: 'hsl(40 85% 48%)', description: 'External walls, fire-rated partitions' },
    { name: 'MEP Systems', duration: 4, color: 'hsl(200 80% 50%)', description: 'HVAC, electrical, plumbing, fire safety' },
    { name: 'Interior Work', duration: 3, color: 'hsl(300 5% 50%)', description: 'False ceiling, flooring, partitions' },
    { name: 'Specialized Systems', duration: 2, color: 'hsl(260 70% 50%)', description: 'Security, IT infrastructure, lifts' },
    { name: 'Finishing', duration: 2, color: 'hsl(349 86% 35%)', description: 'Painting, fixtures, signage' },
    { name: 'Testing & Commissioning', duration: 1, color: 'hsl(120 60% 50%)', description: 'System testing, safety checks' }
  ];

  const stages = buildingType === 'residential' ? residentialStages : commercialStages;
  const totalDuration = stages.reduce((sum, stage) => sum + stage.duration, 0);
  const progress = ((currentStage + 1) / stages.length) * 100;

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStage((prev) => {
          if (prev >= stages.length - 1) {
            setIsPlaying(false);
            return stages.length - 1;
          }
          return prev + 1;
        });
      }, 1800);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, stages.length]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
            Construction <span className="text-gradient">Timeline</span>
          </h1>
          <p className="text-lg text-muted-foreground">Visualize your construction journey step-by-step</p>
          <Button 
            onClick={() => window.open('https://wa.me/9779845323733?text=I need help planning my construction timeline', '_blank')}
            className="mt-4 bg-[#25D366] hover:bg-[#20BA5A] text-white"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Get Timeline Consultation
          </Button>
        </div>

        {/* 3D Construction Animation */}
        <div className="mb-8">
          <ConstructionAnimation3D stage={currentStage} buildingType={buildingType} />
        </div>

        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>Construction Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={buildingType} onValueChange={(v) => { setBuildingType(v as any); setCurrentStage(0); setIsPlaying(false); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential Building</SelectItem>
                <SelectItem value="commercial">Commercial Building</SelectItem>
              </SelectContent>
            </Select>

            <div className="p-4 glass rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Total Duration</div>
              <div className="text-2xl font-bold text-foreground">{totalDuration} Months</div>
            </div>

            <div className="flex gap-4">
              <Button onClick={handlePlayPause} className="flex-1">
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlaying ? 'Pause' : 'Play'} Animation
              </Button>
              <Button onClick={() => { setCurrentStage(0); setIsPlaying(false); }} variant="outline">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <Progress value={progress} className="h-3" />
          <div className="text-center mt-2 text-sm text-muted-foreground">
            Stage {currentStage + 1} of {stages.length}
          </div>
        </div>

        <div className="space-y-4">
          {stages.map((stage, index) => (
            <Card 
              key={index}
              className={`glass transition-all duration-500 ${
                index === currentStage 
                  ? 'glow border-2 border-primary scale-105' 
                  : index < currentStage 
                    ? 'opacity-60' 
                    : 'opacity-40'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                    style={{ backgroundColor: stage.color }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-foreground">{stage.name}</h3>
                      <span className="text-sm font-semibold text-primary">{stage.duration} months</span>
                    </div>
                    <p className="text-muted-foreground">{stage.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="glass mt-8">
          <CardHeader>
            <CardTitle>Important Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>Timelines may vary based on weather, labor availability, and material supply</li>
              <li>Proper planning and timely approvals can reduce delays</li>
              <li>Quality should never be compromised for speed</li>
              <li>Regular site supervision ensures adherence to schedule</li>
              <li>Buffer time of 10-15% recommended for unforeseen delays</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConstructionTimeline;
