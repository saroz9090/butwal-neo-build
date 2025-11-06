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

const FloorPlanner = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [furniture, setFurniture] = useState<Furniture[]>([]);
  const [selectedTool, setSelectedTool] = useState('select');
  const [gridSize] = useState(20);
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState('living');
  const [projectName, setProjectName] = useState('My Home Design');
  const [selectedElement, setSelectedElement] = useState<{ type: 'room' | 'furniture', id: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const roomTypes = {
    living: { name: 'Living Room', color: '#FFB6C1' },
    bedroom: { name: 'Bedroom', color: '#87CEEB' },
    kitchen: { name: 'Kitchen', color: '#FFD700' },
    bathroom: { name: 'Bathroom', color: '#98FB98' },
    dining: { name: 'Dining Room', color: '#DDA0DD' }
  };

  const furnitureItems = [
    { type: 'sofa', name: 'Sofa', width: 120, height: 60, color: '#8B4513' },
    { type: 'bed', name: 'Bed', width: 100, height: 140, color: '#4682B4' },
    { type: 'table', name: 'Table', width: 80, height: 80, color: '#D2691E' },
    { type: 'chair', name: 'Chair', width: 40, height: 40, color: '#8B4513' }
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
        width: 200,
        height: 200,
        type: roomType,
        name: roomName || roomTypes[roomType as keyof typeof roomTypes].name
      };
      setRooms([...rooms, newRoom]);
      toast.success('Room added');
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
    } else {
      setFurniture(furniture.filter(f => f.id !== selectedElement.id));
    }
    setSelectedElement(null);
    toast.success('Deleted');
  };

  const resizeSelected = (widthChange: number, heightChange: number) => {
    if (!selectedElement) return;

    if (selectedElement.type === 'room') {
      setRooms(rooms.map(r => 
        r.id === selectedElement.id 
          ? { ...r, width: Math.max(100, r.width + widthChange), height: Math.max(100, r.height + heightChange) }
          : r
      ));
    } else {
      setFurniture(furniture.map(f => 
        f.id === selectedElement.id 
          ? { ...f, width: Math.max(20, f.width + widthChange), height: Math.max(20, f.height + heightChange) }
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

    // Draw furniture
    furniture.forEach(item => {
      const config = furnitureItems.find(f => f.type === item.type);
      if (!config) return;
      
      const isSelected = selectedElement?.type === 'furniture' && selectedElement.id === item.id;
      
      ctx.fillStyle = config.color;
      ctx.strokeStyle = isSelected ? '#0000FF' : '#000000';
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.fillRect(item.x, item.y, item.width, item.height);
      ctx.strokeRect(item.x, item.y, item.width, item.height);
      
      ctx.fillStyle = '#000000';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(config.name, item.x + item.width / 2, item.y + item.height + 15);
    });
  }, [rooms, furniture, selectedElement, gridSize]);

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
                    onClick={() => setSelectedTool('select')}
                    size="sm"
                  >
                    <Move className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={selectedTool === 'room' ? 'default' : 'outline'}
                    onClick={() => setSelectedTool('room')}
                    size="sm"
                  >
                    <Square className="w-4 h-4" />
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

                {selectedElement && (
                  <div className="mt-4 p-4 glass rounded-lg">
                    <div className="flex gap-2">
                      <Button onClick={() => resizeSelected(20, 20)} variant="outline" size="sm">
                        <Plus className="w-3 h-3 mr-1" />Bigger
                      </Button>
                      <Button onClick={() => resizeSelected(-20, -20)} variant="outline" size="sm">
                        <Minus className="w-3 h-3 mr-1" />Smaller
                      </Button>
                      <Button onClick={deleteSelected} variant="outline" size="sm">
                        <Trash2 className="w-3 h-3 mr-1" />Delete
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button onClick={exportFloorPlan} variant="outline" size="sm">
                    <Download className="w-3 h-3 mr-2" />Export
                  </Button>
                  <Button 
                    onClick={() => window.open(`https://wa.me/9779845323733?text=${encodeURIComponent(`Floor Plan: ${projectName}\nArea: ${calculateTotalArea().toFixed(1)} sq.ft`)}`, '_blank')}
                    className="bg-[#25D366] hover:bg-[#20BA5A] text-white"
                    size="sm"
                  >
                    <MessageCircle className="w-3 h-3 mr-2" />WhatsApp
                  </Button>
                  <Button onClick={() => { setRooms([]); setFurniture([]); }} variant="outline" size="sm">
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
