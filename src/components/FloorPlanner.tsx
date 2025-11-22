// src/components/FloorPlanner.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Square, 
  Move, 
  Download, 
  Trash2, 
  Ruler, 
  Home, 
  Sofa,
  MessageCircle,
  RotateCcw,
  Plus,
  Minus
} from 'lucide-react';
import { toast } from 'sonner';

interface Room {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  name: string;
}

interface Furniture {
  id: number;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Wall {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface Stair {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  direction: 'horizontal' | 'vertical';
}

const FloorPlanner = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [furniture, setFurniture] = useState<Furniture[]>([]);
  const [walls, setWalls] = useState<Wall[]>([]);
  const [stairs, setStairs] = useState<Stair[]>([]);
  const [selectedTool, setSelectedTool] = useState('select');
  const [gridSize] = useState(20);
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState('living');
  const [projectName, setProjectName] = useState('My Home Design');
  const [selectedElement, setSelectedElement] = useState<{ type: 'room' | 'furniture' | 'wall' | 'stair', id: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [wallStart, setWallStart] = useState<{ x: number, y: number } | null>(null);

  const roomTypes = {
    living: { name: 'Living Room', color: '#FFB6C1' },
    bedroom: { name: 'Bedroom', color: '#87CEEB' },
    kitchen: { name: 'Kitchen', color: '#FFD700' },
    bathroom: { name: 'Bathroom', color: '#98FB98' },
    dining: { name: 'Dining Room', color: '#DDA0DD' }
  };

  const furnitureItems = [
    { type: 'sofa', name: 'Sofa', width: 80, height: 40, color: '#8B4513' },
    { type: 'bed', name: 'Bed', width: 80, height: 100, color: '#4682B4' },
    { type: 'table', name: 'Table', width: 60, height: 60, color: '#D2691E' },
    { type: 'chair', name: 'Chair', width: 30, height: 30, color: '#CD853F' },
    { type: 'desk', name: 'Desk', width: 100, height: 50, color: '#8B4513' },
    { type: 'wardrobe', name: 'Wardrobe', width: 60, height: 120, color: '#654321' }
  ];

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    return { 
      x: Math.round(x / gridSize) * gridSize, 
      y: Math.round(y / gridSize) * gridSize 
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getMousePos(e);
    
    // Wall tool
    if (selectedTool === 'wall') {
      if (!wallStart) {
        setWallStart({ x, y });
        toast.info('Click again to complete wall');
      } else {
        const newWall: Wall = {
          id: Date.now(),
          x1: wallStart.x,
          y1: wallStart.y,
          x2: x,
          y2: y
        };
        setWalls([...walls, newWall]);
        setWallStart(null);
        toast.success('Wall added');
      }
      return;
    }
    
    // Find clicked element
    const clickedFurniture = furniture.find(f => 
      x >= f.x && x <= f.x + f.width && y >= f.y && y <= f.y + f.height
    );
    
    if (clickedFurniture) {
      setSelectedElement({ type: 'furniture', id: clickedFurniture.id });
      setIsDragging(true);
      setDragOffset({ x: x - clickedFurniture.x, y: y - clickedFurniture.y });
      return;
    }

    const clickedStair = stairs.find(s => 
      x >= s.x && x <= s.x + s.width && y >= s.y && y <= s.y + s.height
    );
    
    if (clickedStair) {
      setSelectedElement({ type: 'stair', id: clickedStair.id });
      setIsDragging(true);
      setDragOffset({ x: x - clickedStair.x, y: y - clickedStair.y });
      return;
    }
    
    const clickedRoom = rooms.find(r => 
      x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height
    );
    
    if (clickedRoom) {
      setSelectedElement({ type: 'room', id: clickedRoom.id });
      setIsDragging(true);
      setDragOffset({ x: x - clickedRoom.x, y: y - clickedRoom.y });
      return;
    }

    // Add new elements
    if (selectedTool === 'room') {
      const newRoom: Room = {
        id: Date.now(),
        x, y,
        width: 240,
        height: 240,
        type: roomType,
        name: roomName || roomTypes[roomType as keyof typeof roomTypes].name
      };
      setRooms([...rooms, newRoom]);
      toast.success('Room added');
    } else if (selectedTool === 'stair') {
      const newStair: Stair = {
        id: Date.now(),
        x, y,
        width: 80,
        height: 120,
        direction: 'vertical'
      };
      setStairs([...stairs, newStair]);
      toast.success('Stairs added');
    } else if (selectedTool.startsWith('furniture-')) {
      const type = selectedTool.replace('furniture-', '');
      const config = furnitureItems.find(f => f.type === type);
      if (config) {
        const newFurniture: Furniture = {
          id: Date.now(),
          type,
          x, y,
          width: config.width,
          height: config.height
        };
        setFurniture([...furniture, newFurniture]);
        toast.success('Furniture added');
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedElement) return;
    
    const { x, y } = getMousePos(e);
    
    if (selectedElement.type === 'room') {
      setRooms(rooms.map(r => 
        r.id === selectedElement.id 
          ? { ...r, x: x - dragOffset.x, y: y - dragOffset.y }
          : r
      ));
    } else if (selectedElement.type === 'stair') {
      setStairs(stairs.map(s => 
        s.id === selectedElement.id 
          ? { ...s, x: x - dragOffset.x, y: y - dragOffset.y }
          : s
      ));
    } else {
      setFurniture(furniture.map(f => 
        f.id === selectedElement.id 
          ? { ...f, x: x - dragOffset.x, y: y - dragOffset.y }
          : f
      ));
    }
  };

  const deleteSelected = () => {
    if (!selectedElement) return;
    
    if (selectedElement.type === 'room') {
      setRooms(rooms.filter(r => r.id !== selectedElement.id));
    } else if (selectedElement.type === 'wall') {
      setWalls(walls.filter(w => w.id !== selectedElement.id));
    } else if (selectedElement.type === 'stair') {
      setStairs(stairs.filter(s => s.id !== selectedElement.id));
    } else {
      setFurniture(furniture.filter(f => f.id !== selectedElement.id));
    }
    setSelectedElement(null);
    toast.success('Deleted');
  };

  const resizeWidth = (change: number) => {
    if (!selectedElement) return;

    if (selectedElement.type === 'room') {
      setRooms(rooms.map(r => 
        r.id === selectedElement.id 
          ? { ...r, width: Math.max(100, r.width + change) }
          : r
      ));
    } else if (selectedElement.type === 'stair') {
      setStairs(stairs.map(s => 
        s.id === selectedElement.id 
          ? { ...s, width: Math.max(40, s.width + change) }
          : s
      ));
    } else {
      setFurniture(furniture.map(f => 
        f.id === selectedElement.id 
          ? { ...f, width: Math.max(20, f.width + change) }
          : f
      ));
    }
  };

  const resizeHeight = (change: number) => {
    if (!selectedElement) return;

    if (selectedElement.type === 'room') {
      setRooms(rooms.map(r => 
        r.id === selectedElement.id 
          ? { ...r, height: Math.max(100, r.height + change) }
          : r
      ));
    } else if (selectedElement.type === 'stair') {
      setStairs(stairs.map(s => 
        s.id === selectedElement.id 
          ? { ...s, height: Math.max(40, s.height + change) }
          : s
      ));
    } else {
      setFurniture(furniture.map(f => 
        f.id === selectedElement.id 
          ? { ...f, height: Math.max(20, f.height + change) }
          : f
      ));
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw rooms
    rooms.forEach(room => {
      const config = roomTypes[room.type as keyof typeof roomTypes];
      const isSelected = selectedElement?.type === 'room' && selectedElement.id === room.id;
      
      ctx.fillStyle = config.color + '80';
      ctx.strokeStyle = isSelected ? '#0000FF' : config.color;
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.fillRect(room.x, room.y, room.width, room.height);
      ctx.strokeRect(room.x, room.y, room.width, room.height);
      
      ctx.fillStyle = '#000000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(room.name, room.x + room.width / 2, room.y + room.height / 2);
    });

    // Draw walls
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    walls.forEach(wall => {
      ctx.beginPath();
      ctx.moveTo(wall.x1, wall.y1);
      ctx.lineTo(wall.x2, wall.y2);
      ctx.stroke();
    });

    // Draw furniture
    furniture.forEach(item => {
      const config = furnitureItems.find(f => f.type === item.type);
      if (!config) return;
      
      const isSelected = selectedElement?.type === 'furniture' && selectedElement.id === item.id;
      
      ctx.fillStyle = config.color;
      ctx.strokeStyle = isSelected ? '#0000FF' : '#333333';
      ctx.lineWidth = isSelected ? 3 : 1;
      ctx.fillRect(item.x, item.y, item.width, item.height);
      ctx.strokeRect(item.x, item.y, item.width, item.height);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(config.name, item.x + item.width / 2, item.y + item.height / 2 + 3);
    });

    // Draw stairs
    stairs.forEach(stair => {
      const isSelected = selectedElement?.type === 'stair' && selectedElement.id === stair.id;
      
      ctx.fillStyle = '#C0C0C0';
      ctx.strokeStyle = isSelected ? '#0000FF' : '#000000';
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.fillRect(stair.x, stair.y, stair.width, stair.height);
      ctx.strokeRect(stair.x, stair.y, stair.width, stair.height);
      
      // Draw stair steps
      ctx.strokeStyle = '#808080';
      ctx.lineWidth = 1;
      const stepCount = stair.direction === 'vertical' ? 8 : 6;
      const stepSize = stair.direction === 'vertical' ? stair.height / stepCount : stair.width / stepCount;
      
      for (let i = 1; i < stepCount; i++) {
        if (stair.direction === 'vertical') {
          const y = stair.y + i * stepSize;
          ctx.beginPath();
          ctx.moveTo(stair.x, y);
          ctx.lineTo(stair.x + stair.width, y);
          ctx.stroke();
        } else {
          const x = stair.x + i * stepSize;
          ctx.beginPath();
          ctx.moveTo(x, stair.y);
          ctx.lineTo(x, stair.y + stair.height);
          ctx.stroke();
        }
      }
      
      ctx.fillStyle = '#000000';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('STAIRS', stair.x + stair.width / 2, stair.y + stair.height / 2);
    });

    // Draw wall preview
    if (wallStart && selectedTool === 'wall') {
      const canvas = canvasRef.current;
      if (canvas) {
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 4;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(wallStart.x, wallStart.y);
        ctx.lineTo(wallStart.x + 100, wallStart.y); // Preview line
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }, [rooms, furniture, walls, stairs, selectedElement, gridSize, wallStart, selectedTool]);

  const calculateTotalArea = () => {
    return rooms.reduce((total, room) => {
      const area = (room.width / gridSize) * (room.height / gridSize);
      return total + area;
    }, 0);
  };

  const exportFloorPlan = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `${projectName.replace(/\s+/g, '-')}-floor-plan.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('Exported');
  };

  const shareOnWhatsApp = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      // Create file from blob
      const file = new File([blob], `${projectName.replace(/\s+/g, '-')}-floor-plan.png`, { type: 'image/png' });
      
      // Check if Web Share API with files is supported
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          files: [file],
          title: projectName,
          text: `Floor Plan: ${projectName}\nArea: ${calculateTotalArea().toFixed(1)} sq.ft`
        }).catch(err => {
          console.error('Error sharing:', err);
          // Fallback to text-only WhatsApp
          fallbackWhatsAppShare();
        });
      } else {
        // Fallback for devices that don't support file sharing
        fallbackWhatsAppShare();
      }
    }, 'image/png');
  };

  const fallbackWhatsAppShare = () => {
    const message = `Floor Plan: ${projectName}\nArea: ${calculateTotalArea().toFixed(1)} sq.ft\n\nPlease check your floor plan design.`;
    window.open(`https://wa.me/9779763653181?text=${encodeURIComponent(message)}`, '_blank');
    toast.info('Export the image separately to share it');
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
            2D Floor <span className="text-gradient">Planner</span>
          </h1>
          <p className="text-lg text-muted-foreground">Design your dream home layout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card className="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="h-9"
                />
                <div className="text-sm p-3 glass rounded-lg">
                  <span className="text-muted-foreground">Area: </span>
                  <span className="font-bold text-primary">{calculateTotalArea().toFixed(1)} sq.ft</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={selectedTool === 'select' ? 'default' : 'outline'}
                    onClick={() => { setSelectedTool('select'); setWallStart(null); }}
                    size="sm"
                    className="flex items-center justify-center"
                  >
                    <Move className="w-4 h-4 mr-1" />
                    <span className="text-xs">Move</span>
                  </Button>
                  <Button
                    variant={selectedTool === 'room' ? 'default' : 'outline'}
                    onClick={() => { setSelectedTool('room'); setWallStart(null); }}
                    size="sm"
                    className="flex items-center justify-center"
                  >
                    <Square className="w-4 h-4 mr-1" />
                    <span className="text-xs">Room</span>
                  </Button>
                  <Button
                    variant={selectedTool === 'wall' ? 'default' : 'outline'}
                    onClick={() => { setSelectedTool('wall'); setSelectedElement(null); }}
                    size="sm"
                    className="flex items-center justify-center"
                  >
                    <Ruler className="w-4 h-4 mr-1" />
                    <span className="text-xs">Wall</span>
                  </Button>
                  <Button
                    variant={selectedTool === 'stair' ? 'default' : 'outline'}
                    onClick={() => { setSelectedTool('stair'); setWallStart(null); }}
                    size="sm"
                    className="flex items-center justify-center"
                  >
                    <Home className="w-4 h-4 mr-1" />
                    <span className="text-xs">Stairs</span>
                  </Button>
                </div>

                {selectedTool === 'room' && (
                  <div className="space-y-3 pt-2 border-t">
                    <Select value={roomType} onValueChange={setRoomType}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(roomTypes).map(([key, room]) => (
                          <SelectItem key={key} value={key}>{room.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Room Name (Optional)"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      className="h-9"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Furniture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {furnitureItems.map((item) => (
                    <Button
                      key={item.type}
                      variant={selectedTool === `furniture-${item.type}` ? 'default' : 'outline'}
                      onClick={() => setSelectedTool(`furniture-${item.type}`)}
                      size="sm"
                      className="h-16"
                    >
                      <Sofa className="w-4 h-4 mb-1" />
                      <div className="text-xs">{item.name}</div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Canvas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-border rounded-lg bg-white">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className="w-full h-auto cursor-crosshair"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                  />
                </div>

                {selectedElement && selectedElement.type !== 'wall' && (
                  <div className="mt-4 p-4 glass rounded-lg space-y-3">
                    <div className="text-sm font-semibold text-foreground">Resize Width</div>
                    <div className="flex gap-2">
                      <Button onClick={() => resizeWidth(20)} variant="outline" size="sm">
                        <Plus className="w-3 h-3 mr-1" />Width
                      </Button>
                      <Button onClick={() => resizeWidth(-20)} variant="outline" size="sm">
                        <Minus className="w-3 h-3 mr-1" />Width
                      </Button>
                    </div>
                    <div className="text-sm font-semibold text-foreground">Resize Height</div>
                    <div className="flex gap-2">
                      <Button onClick={() => resizeHeight(20)} variant="outline" size="sm">
                        <Plus className="w-3 h-3 mr-1" />Height
                      </Button>
                      <Button onClick={() => resizeHeight(-20)} variant="outline" size="sm">
                        <Minus className="w-3 h-3 mr-1" />Height
                      </Button>
                    </div>
                    <Button onClick={deleteSelected} variant="destructive" size="sm" className="w-full">
                      <Trash2 className="w-3 h-3 mr-1" />Delete
                    </Button>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  <Button onClick={exportFloorPlan} variant="outline" size="sm">
                    <Download className="w-3 h-3 mr-2" />Export
                  </Button>
                  <Button 
                    onClick={shareOnWhatsApp}
                    className="bg-[#25D366] hover:bg-[#20BA5A] text-white"
                    size="sm"
                  >
                    <MessageCircle className="w-3 h-3 mr-2" />Share
                  </Button>
                  <Button onClick={() => { setRooms([]); setFurniture([]); setWalls([]); setStairs([]); setSelectedElement(null); setWallStart(null); }} variant="outline" size="sm">
                    <RotateCcw className="w-3 h-3 mr-2" />Clear
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
