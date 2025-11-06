// src/components/FloorPlanner.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Canvas as FabricCanvas, Rect, Circle, Path, TextboxProps, Textbox } from 'fabric';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Square, 
  Move, 
  Download, 
  Trash2, 
  Ruler, 
  Home, 
  Bed, 
  Sofa,
  Utensils,
  Bath,
  DoorClosed,
  MessageCircle,
  RotateCcw,
  Maximize2,
  Eye,
  Grid3x3
} from 'lucide-react';
import House3D from './House3D';
import { toast } from 'sonner';

const FloorPlanner = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [selectedTool, setSelectedTool] = useState<'select' | 'room' | 'furniture'>('select');
  const [showGrid, setShowGrid] = useState(true);
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState('living');
  const [furnitureType, setFurnitureType] = useState('sofa');
  const [projectName, setProjectName] = useState('My Home Design');
  const [totalArea, setTotalArea] = useState(0);
  const [showViewToggle, setShowViewToggle] = useState(false);
  const [view3D, setView3D] = useState(false);

  const roomTypes = {
    living: { name: 'Living Room', color: '#FFB6C1' },
    bedroom: { name: 'Bedroom', color: '#87CEEB' },
    kitchen: { name: 'Kitchen', color: '#FFD700' },
    bathroom: { name: 'Bathroom', color: '#98FB98' },
    dining: { name: 'Dining Room', color: '#DDA0DD' },
    study: { name: 'Study Room', color: '#F0E68C' },
    balcony: { name: 'Balcony', color: '#B0E0E6' }
  };

  const furnitureItems = {
    sofa: { name: 'Sofa', width: 120, height: 60, color: '#8B4513' },
    bed: { name: 'Bed', width: 100, height: 140, color: '#4682B4' },
    table: { name: 'Table', width: 80, height: 80, color: '#D2691E' },
    chair: { name: 'Chair', width: 40, height: 40, color: '#8B4513' },
    door: { name: 'Door', width: 40, height: 80, color: '#8B4513' },
    window: { name: 'Window', width: 100, height: 30, color: '#87CEEB' }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      selection: selectedTool === 'select'
    });

    setFabricCanvas(canvas);
    toast.success('Floor Planner Ready!');

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;
    fabricCanvas.selection = selectedTool === 'select';
    fabricCanvas.defaultCursor = selectedTool === 'select' ? 'default' : 'crosshair';
  }, [selectedTool, fabricCanvas]);

  // Calculate total area whenever objects change
  useEffect(() => {
    if (!fabricCanvas) return;

    const handleObjectModified = () => {
      calculateTotalArea();
    };

    fabricCanvas.on('object:modified', handleObjectModified);
    fabricCanvas.on('object:added', handleObjectModified);
    fabricCanvas.on('object:removed', handleObjectModified);

    return () => {
      fabricCanvas.off('object:modified', handleObjectModified);
      fabricCanvas.off('object:added', handleObjectModified);
      fabricCanvas.off('object:removed', handleObjectModified);
    };
  }, [fabricCanvas]);

  const calculateTotalArea = () => {
    if (!fabricCanvas) return;

    let area = 0;
    fabricCanvas.getObjects().forEach((obj: any) => {
      if (obj.roomType) {
        // Convert pixels to square feet (1 grid = 1ft, 20px = 1ft)
        const width = (obj.width * obj.scaleX) / 20;
        const height = (obj.height * obj.scaleY) / 20;
        area += width * height;
      }
    });
    setTotalArea(area);
  };

  const addRoom = () => {
    if (!fabricCanvas) return;

    const roomConfig = roomTypes[roomType as keyof typeof roomTypes];
    const rect = new Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 200,
      fill: roomConfig.color + '80',
      stroke: roomConfig.color,
      strokeWidth: 2,
      selectable: true,
      hasControls: true
    });

    // Add custom property to identify as room
    (rect as any).roomType = roomType;
    (rect as any).roomName = roomName || roomConfig.name;

    // Add text label
    const text = new Textbox((roomName || roomConfig.name), {
      left: rect.left! + rect.width! / 2,
      top: rect.top! + rect.height! / 2,
      fontSize: 14,
      fill: '#000000',
      textAlign: 'center',
      selectable: false,
      evented: false,
      originX: 'center',
      originY: 'center'
    } as TextboxProps);

    fabricCanvas.add(rect);
    fabricCanvas.add(text);
    fabricCanvas.renderAll();

    // Update text position when room is moved
    rect.on('moving', () => {
      text.set({
        left: (rect.left || 0) + (rect.width! * (rect.scaleX || 1)) / 2,
        top: (rect.top || 0) + (rect.height! * (rect.scaleY || 1)) / 2
      });
      fabricCanvas.renderAll();
    });

    rect.on('scaling', () => {
      text.set({
        left: (rect.left || 0) + (rect.width! * (rect.scaleX || 1)) / 2,
        top: (rect.top || 0) + (rect.height! * (rect.scaleY || 1)) / 2
      });
      fabricCanvas.renderAll();
    });

    toast.success(`${roomConfig.name} added!`);
    setRoomName('');
    calculateTotalArea();
  };

  const addFurniture = () => {
    if (!fabricCanvas) return;

    const furnitureConfig = furnitureItems[furnitureType as keyof typeof furnitureItems];
    
    let furnitureObj: any;

    switch (furnitureType) {
      case 'sofa':
        // Sofa shape
        furnitureObj = new Rect({
          left: 300,
          top: 300,
          width: furnitureConfig.width,
          height: furnitureConfig.height,
          fill: furnitureConfig.color,
          stroke: '#654321',
          strokeWidth: 2
        });
        break;

      case 'bed':
        // Bed shape
        const bedGroup: any = [];
        const bedBase = new Rect({
          left: 300,
          top: 300,
          width: furnitureConfig.width,
          height: furnitureConfig.height,
          fill: furnitureConfig.color,
          stroke: '#003366',
          strokeWidth: 2
        });
        bedGroup.push(bedBase);

        const pillow1 = new Rect({
          left: 310,
          top: 310,
          width: 30,
          height: 20,
          fill: '#E0E0E0',
          stroke: '#CCCCCC',
          strokeWidth: 1
        });
        bedGroup.push(pillow1);

        const pillow2 = new Rect({
          left: 350,
          top: 310,
          width: 30,
          height: 20,
          fill: '#E0E0E0',
          stroke: '#CCCCCC',
          strokeWidth: 1
        });
        bedGroup.push(pillow2);

        furnitureObj = bedBase;
        bedGroup.forEach((obj: any) => fabricCanvas.add(obj));
        break;

      case 'table':
        furnitureObj = new Rect({
          left: 300,
          top: 300,
          width: furnitureConfig.width,
          height: furnitureConfig.height,
          fill: furnitureConfig.color,
          stroke: '#A0522D',
          strokeWidth: 2,
          rx: 5,
          ry: 5
        });
        break;

      case 'chair':
        furnitureObj = new Circle({
          left: 300,
          top: 300,
          radius: furnitureConfig.width / 2,
          fill: furnitureConfig.color,
          stroke: '#654321',
          strokeWidth: 2
        });
        break;

      case 'door':
        // Door with arc
        furnitureObj = new Rect({
          left: 300,
          top: 300,
          width: furnitureConfig.width,
          height: furnitureConfig.height,
          fill: furnitureConfig.color,
          stroke: '#654321',
          strokeWidth: 2
        });
        break;

      case 'window':
        furnitureObj = new Rect({
          left: 300,
          top: 300,
          width: furnitureConfig.width,
          height: furnitureConfig.height,
          fill: furnitureConfig.color + '80',
          stroke: '#4682B4',
          strokeWidth: 3
        });
        break;

      default:
        furnitureObj = new Rect({
          left: 300,
          top: 300,
          width: furnitureConfig.width,
          height: furnitureConfig.height,
          fill: furnitureConfig.color,
          stroke: '#000000',
          strokeWidth: 1
        });
    }

    (furnitureObj as any).furnitureType = furnitureType;
    (furnitureObj as any).furnitureName = furnitureConfig.name;

    fabricCanvas.add(furnitureObj);

    // Add label
    const label = new Textbox(furnitureConfig.name, {
      left: furnitureObj.left! + furnitureObj.width! / 2,
      top: furnitureObj.top! + furnitureObj.height! + 10,
      fontSize: 10,
      fill: '#000000',
      textAlign: 'center',
      selectable: false,
      evented: false,
      originX: 'center'
    } as TextboxProps);

    fabricCanvas.add(label);
    fabricCanvas.renderAll();

    toast.success(`${furnitureConfig.name} added!`);
  };

  const deleteSelected = () => {
    if (!fabricCanvas) return;

    const activeObjects = fabricCanvas.getActiveObjects();
    if (activeObjects.length === 0) {
      toast.error('Please select an object to delete');
      return;
    }

    activeObjects.forEach((obj) => {
      fabricCanvas.remove(obj);
    });
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();
    calculateTotalArea();
    toast.success('Object(s) deleted');
  };

  const clearAll = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = '#ffffff';
    fabricCanvas.renderAll();
    setTotalArea(0);
    toast.success('Canvas cleared');
  };

  const exportFloorPlan = () => {
    if (!fabricCanvas) return;

    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });

    const link = document.createElement('a');
    link.download = `${projectName.replace(/\s+/g, '-')}-floor-plan.png`;
    link.href = dataURL;
    link.click();

    toast.success('Floor plan exported!');
  };

  const shareOnWhatsApp = () => {
    const message = `🏠 Floor Plan Design\n\n` +
                   `Project: ${projectName}\n` +
                   `Total Area: ${totalArea.toFixed(1)} sq.ft\n\n` +
                   `I've designed this floor plan and would like to discuss construction!`;
    
    window.open(`https://wa.me/9779845323733?text=${encodeURIComponent(message)}`, '_blank');
  };

  const toggleView = () => {
    if (totalArea < 100) {
      toast.error('Please add rooms to see 3D view (minimum 100 sq.ft)');
      return;
    }
    setView3D(!view3D);
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
            2D Floor <span className="text-gradient">Planner</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Design your dream home layout with drag-and-drop tools • View in 3D
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Tools */}
          <div className="lg:col-span-1 space-y-4">
            {/* Project Info */}
            <Card className="glass">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Home className="w-4 h-4" />
                  Project Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Project Name</Label>
                  <Input
                    placeholder="e.g., My Dream Home"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="text-sm h-9"
                  />
                </div>
                <div className="text-sm p-3 glass rounded-lg border border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Area:</span>
                    <span className="font-bold text-primary text-lg">{totalArea.toFixed(1)} sq.ft</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tools */}
            <Card className="glass">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Ruler className="w-4 h-4" />
                  Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={selectedTool === 'select' ? 'default' : 'outline'}
                    onClick={() => setSelectedTool('select')}
                    className="h-10 text-xs"
                    size="sm"
                  >
                    <Move className="w-3 h-3" />
                  </Button>
                  <Button
                    variant={selectedTool === 'room' ? 'default' : 'outline'}
                    onClick={() => setSelectedTool('room')}
                    className="h-10 text-xs"
                    size="sm"
                  >
                    <Square className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowGrid(!showGrid)}
                    className="h-10 text-xs"
                    size="sm"
                  >
                    <Grid3x3 className="w-3 h-3" />
                  </Button>
                </div>

                {selectedTool === 'room' && (
                  <div className="space-y-3 pt-2 border-t border-border">
                    <div className="space-y-2">
                      <Label className="text-xs">Room Type</Label>
                      <Select value={roomType} onValueChange={setRoomType}>
                        <SelectTrigger className="text-xs h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(roomTypes).map(([key, room]) => (
                            <SelectItem key={key} value={key} className="text-xs">
                              {room.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Room Name (Optional)</Label>
                      <Input
                        placeholder="e.g., Master Bedroom"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        className="text-xs h-9"
                      />
                    </div>

                    <Button onClick={addRoom} className="w-full h-9 text-xs" size="sm">
                      Add Room
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Furniture */}
            <Card className="glass">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sofa className="w-4 h-4" />
                  Furniture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Furniture Type</Label>
                  <Select value={furnitureType} onValueChange={setFurnitureType}>
                    <SelectTrigger className="text-xs h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(furnitureItems).map(([key, item]) => (
                        <SelectItem key={key} value={key} className="text-xs">
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addFurniture} className="w-full h-9 text-xs" size="sm">
                  Add Furniture
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Maximize2 className="w-4 h-4" />
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={deleteSelected} variant="outline" size="sm" className="w-full h-9 text-xs">
                  <Trash2 className="w-3 h-3 mr-2" />
                  Delete Selected
                </Button>
                <Button onClick={clearAll} variant="outline" size="sm" className="w-full h-9 text-xs">
                  <RotateCcw className="w-3 h-3 mr-2" />
                  Clear All
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Canvas Area */}
          <div className="lg:col-span-3">
            <Card className="glass">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <CardTitle className="text-base">Design Canvas</CardTitle>
                  <div className="flex gap-2">
                    {totalArea >= 100 && (
                      <Button
                        variant={view3D ? 'default' : 'outline'}
                        onClick={toggleView}
                        size="sm"
                        className="h-9 text-xs"
                      >
                        <Eye className="w-3 h-3 mr-2" />
                        {view3D ? '2D View' : '3D View'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!view3D ? (
                  <div className="relative">
                    <div className="border-2 border-border rounded-lg overflow-hidden bg-white">
                      <canvas
                        ref={canvasRef}
                        className="w-full h-auto"
                      />
                    </div>

                    {/* Instructions */}
                    <div className="mt-4 p-4 glass rounded-lg border border-border">
                      <h3 className="font-semibold text-sm mb-2 text-foreground">Quick Guide:</h3>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Use <strong>Select tool</strong> to move and resize objects</li>
                        <li>• Add rooms first, then place furniture inside</li>
                        <li>• Drag corners to resize, drag objects to move</li>
                        <li>• Furniture scales proportionally - rooms are larger</li>
                        <li>• Add at least 100 sq.ft to unlock 3D view</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <House3D 
                      area={totalArea} 
                      floors={1} 
                      materialType="standard"
                    />
                    <div className="p-4 glass rounded-lg border border-border text-center">
                      <p className="text-sm text-muted-foreground">
                        3D View is for visualization only. Switch back to 2D to edit your design.
                      </p>
                    </div>
                  </div>
                )}

                {/* Export Actions */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button onClick={exportFloorPlan} variant="outline" size="sm" className="text-xs h-9">
                    <Download className="w-3 h-3 mr-2" />
                    Export PNG
                  </Button>
                  <Button 
                    onClick={shareOnWhatsApp} 
                    className="bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs h-9"
                    size="sm"
                  >
                    <MessageCircle className="w-3 h-3 mr-2" />
                    Share on WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanner;
