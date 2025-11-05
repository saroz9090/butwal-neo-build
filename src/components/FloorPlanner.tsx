// src/components/FloorPlanner.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
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
  TrendingUp,
  TreePine,
  MessageCircle,
  RotateCcw,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Plus,
  Minus,
  Grip
} from 'lucide-react';

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
  rotation: number;
}

interface Wall {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const FloorPlanner = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [furniture, setFurniture] = useState<Furniture[]>([]);
  const [walls, setWalls] = useState<Wall[]>([]);
  const [selectedTool, setSelectedTool] = useState('select');
  const [gridSize, setGridSize] = useState(20);
  const [showGrid, setShowGrid] = useState(true);
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState('living');
  const [projectName, setProjectName] = useState('');
  const [selectedElement, setSelectedElement] = useState<{ type: 'room' | 'furniture' | 'wall', id: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDrawingWall, setIsDrawingWall] = useState(false);
  const [tempWall, setTempWall] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);

  const roomTypes = {
    living: { name: 'Living Room', color: '#FFB6C1', icon: Sofa },
    bedroom: { name: 'Bedroom', color: '#87CEEB', icon: Bed },
    kitchen: { name: 'Kitchen', color: '#FFD700', icon: Utensils },
    bathroom: { name: 'Bathroom', color: '#98FB98', icon: Bath },
    dining: { name: 'Dining Room', color: '#DDA0DD', icon: Square },
    study: { name: 'Study Room', color: '#F0E68C', icon: Ruler },
    balcony: { name: 'Balcony', color: '#B0E0E6', icon: TreePine }
  };

  const furnitureItems = [
    { type: 'sofa', name: 'Sofa', width: 300, height: 100, icon: Sofa, color: '#8B4513' },
    { type: 'bed', name: 'Bed', width: 200, height: 250, icon: Bed, color: '#4682B4' },
    { type: 'table', name: 'Table', width: 150, height: 150, icon: Square, color: '#D2691E' },
    { type: 'chair', name: 'Chair', width: 80, height: 80, icon: Square, color: '#8B4513' },
    { type: 'door', name: 'Door', width: 60, height: 120, icon: DoorClosed, color: '#8B4513' },
    { type: 'window', name: 'Window', width: 200, height: 60, icon: Square, color: '#87CEEB' }
  ];

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Snap to grid
    return { 
      x: Math.round(x / gridSize) * gridSize, 
      y: Math.round(y / gridSize) * gridSize 
    };
  };

  const findElementAt = (x: number, y: number) => {
    // Check furniture first (they're on top)
    for (let i = furniture.length - 1; i >= 0; i--) {
      const item = furniture[i];
      if (x >= item.x && x <= item.x + item.width &&
          y >= item.y && y <= item.y + item.height) {
        return { type: 'furniture' as const, id: item.id };
      }
    }
    
    // Check rooms
    for (let i = rooms.length - 1; i >= 0; i--) {
      const room = rooms[i];
      if (x >= room.x && x <= room.x + room.width &&
          y >= room.y && y <= room.y + room.height) {
        return { type: 'room' as const, id: room.id };
      }
    }

    return null;
  };

  const getResizeHandleAt = (x: number, y: number, element: Room | Furniture) => {
    const handleSize = 8;
    const handles = [
      { name: 'nw', x: element.x, y: element.y },
      { name: 'ne', x: element.x + element.width, y: element.y },
      { name: 'sw', x: element.x, y: element.y + element.height },
      { name: 'se', x: element.x + element.width, y: element.y + element.height }
    ];

    for (const handle of handles) {
      if (Math.abs(x - handle.x) < handleSize && Math.abs(y - handle.y) < handleSize) {
        return handle.name;
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getMousePos(e);
    
    if (selectedTool === 'wall') {
      if (!isDrawingWall) {
        setIsDrawingWall(true);
        setTempWall({ x1: x, y1: y, x2: x, y2: y });
      } else {
        setIsDrawingWall(false);
        const newWall: Wall = {
          id: Date.now(),
          x1: tempWall!.x1,
          y1: tempWall!.y1,
          x2: x,
          y2: y
        };
        setWalls([...walls, newWall]);
        setTempWall(null);
      }
      return;
    }

    // Check for resize handles first
    if (selectedElement && (selectedElement.type === 'room' || selectedElement.type === 'furniture')) {
      let element: Room | Furniture | undefined;
      if (selectedElement.type === 'room') {
        element = rooms.find(r => r.id === selectedElement.id);
      } else {
        element = furniture.find(f => f.id === selectedElement.id);
      }
      
      if (element) {
        const handle = getResizeHandleAt(x, y, element);
        if (handle) {
          setIsResizing(true);
          setResizeHandle(handle);
          setDragOffset({ x, y });
          return;
        }
      }
    }

    const element = findElementAt(x, y);
    
    if (element) {
      setSelectedElement(element);
      setIsDragging(true);
      
      // Calculate offset from element corner
      let elementX, elementY;
      if (element.type === 'room') {
        const room = rooms.find(r => r.id === element.id);
        elementX = room?.x || 0;
        elementY = room?.y || 0;
      } else {
        const item = furniture.find(f => f.id === element.id);
        elementX = item?.x || 0;
        elementY = item?.y || 0;
      }
      
      setDragOffset({ 
        x: x - elementX, 
        y: y - elementY 
      });
    } else {
      setSelectedElement(null);
      
      // Create new element if a tool is selected
      if (selectedTool === 'room') {
        const newRoom: Room = {
          id: Date.now(),
          x: x,
          y: y,
          width: 400,
          height: 400,
          type: roomType,
          name: roomName || roomTypes[roomType as keyof typeof roomTypes].name
        };
        setRooms([...rooms, newRoom]);
      } else if (selectedTool.startsWith('furniture-')) {
        const furnitureType = selectedTool.replace('furniture-', '');
        const furnitureConfig = furnitureItems.find(f => f.type === furnitureType);
        if (furnitureConfig) {
          const newFurniture: Furniture = {
            id: Date.now(),
            type: furnitureType,
            x: x,
            y: y,
            width: furnitureConfig.width,
            height: furnitureConfig.height,
            rotation: 0
          };
          setFurniture([...furniture, newFurniture]);
        }
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getMousePos(e);
    
    if (isDrawingWall && tempWall) {
      setTempWall({ ...tempWall, x2: x, y2: y });
      return;
    }
    
    if (isResizing && selectedElement && resizeHandle) {
      let element: Room | Furniture | undefined;
      let setFunction: Function;
      
      if (selectedElement.type === 'room') {
        element = rooms.find(r => r.id === selectedElement.id);
        setFunction = setRooms;
      } else {
        element = furniture.find(f => f.id === selectedElement.id);
        setFunction = setFurniture;
      }
      
      if (element) {
        const dx = x - dragOffset.x;
        const dy = y - dragOffset.y;
        
        let newX = element.x;
        let newY = element.y;
        let newWidth = element.width;
        let newHeight = element.height;

        switch (resizeHandle) {
          case 'nw':
            newX = element.x + dx;
            newY = element.y + dy;
            newWidth = Math.max(100, element.width - dx);
            newHeight = Math.max(100, element.height - dy);
            break;
          case 'ne':
            newY = element.y + dy;
            newWidth = Math.max(100, element.width + dx);
            newHeight = Math.max(100, element.height - dy);
            break;
          case 'sw':
            newX = element.x + dx;
            newWidth = Math.max(100, element.width - dx);
            newHeight = Math.max(100, element.height + dy);
            break;
          case 'se':
            newWidth = Math.max(100, element.width + dx);
            newHeight = Math.max(100, element.height + dy);
            break;
        }

        const updatedElement = { ...element, x: newX, y: newY, width: newWidth, height: newHeight };
        
        if (selectedElement.type === 'room') {
          setFunction(rooms.map(r => r.id === selectedElement.id ? updatedElement as Room : r));
        } else {
          setFunction(furniture.map(f => f.id === selectedElement.id ? updatedElement as Furniture : f));
        }
        
        setDragOffset({ x, y });
      }
      return;
    }
    
    if (isDragging && selectedElement) {
      const newX = x - dragOffset.x;
      const newY = y - dragOffset.y;
      
      if (selectedElement.type === 'room') {
        setRooms(rooms.map(room => 
          room.id === selectedElement.id 
            ? { ...room, x: newX, y: newY }
            : room
        ));
      } else if (selectedElement.type === 'furniture') {
        setFurniture(furniture.map(item => 
          item.id === selectedElement.id 
            ? { ...item, x: newX, y: newY }
            : item
        ));
      }
      
      setDragOffset({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  const resizeSelected = (widthChange: number, heightChange: number) => {
    if (!selectedElement) return;

    if (selectedElement.type === 'room') {
      setRooms(rooms.map(room => 
        room.id === selectedElement.id 
          ? { 
              ...room, 
              width: Math.max(100, room.width + widthChange),
              height: Math.max(100, room.height + heightChange)
            }
          : room
      ));
    } else if (selectedElement.type === 'furniture') {
      setFurniture(furniture.map(item => 
        item.id === selectedElement.id 
          ? { 
              ...item, 
              width: Math.max(20, item.width + widthChange),
              height: Math.max(20, item.height + heightChange)
            }
          : item
      ));
    }
  };

  const rotateSelected = () => {
    if (selectedElement && selectedElement.type === 'furniture') {
      setFurniture(furniture.map(item => {
        if (item.id === selectedElement.id) {
          return { 
            ...item, 
            rotation: (item.rotation + 90) % 360,
            width: item.height,
            height: item.width
          };
        }
        return item;
      }));
    }
  };

  const deleteSelected = () => {
    if (selectedElement) {
      if (selectedElement.type === 'room') {
        setRooms(rooms.filter(room => room.id !== selectedElement.id));
      } else if (selectedElement.type === 'furniture') {
        setFurniture(furniture.filter(item => item.id !== selectedElement.id));
      } else if (selectedElement.type === 'wall') {
        setWalls(walls.filter(wall => wall.id !== selectedElement.id));
      }
      setSelectedElement(null);
    }
  };

  const drawResizeHandles = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    ctx.fillStyle = '#0000FF';
    const handleSize = 8;
    
    // Corner handles
    ctx.fillRect(x - handleSize/2, y - handleSize/2, handleSize, handleSize); // top-left
    ctx.fillRect(x + width - handleSize/2, y - handleSize/2, handleSize, handleSize); // top-right
    ctx.fillRect(x - handleSize/2, y + height - handleSize/2, handleSize, handleSize); // bottom-left
    ctx.fillRect(x + width - handleSize/2, y + height - handleSize/2, handleSize, handleSize); // bottom-right
  };

  const drawFurniture = (ctx: CanvasRenderingContext2D, item: Furniture) => {
    const furnitureConfig = furnitureItems.find(f => f.type === item.type);
    if (!furnitureConfig) return;

    const isSelected = selectedElement?.type === 'furniture' && selectedElement.id === item.id;
    
    ctx.save();
    ctx.translate(item.x + item.width / 2, item.y + item.height / 2);
    ctx.rotate((item.rotation * Math.PI) / 180);
    
    ctx.fillStyle = furnitureConfig.color + (isSelected ? 'FF' : 'CC');
    ctx.strokeStyle = isSelected ? '#0000FF' : furnitureConfig.color;
    ctx.lineWidth = isSelected ? 3 : 2;
    
    // Draw realistic furniture shapes
    switch (item.type) {
      case 'sofa':
        ctx.fillRect(-item.width / 2, -item.height / 2, item.width, item.height);
        ctx.strokeRect(-item.width / 2, -item.height / 2, item.width, item.height);
        ctx.fillStyle = furnitureConfig.color;
        ctx.fillRect(-item.width / 2, -item.height / 2, item.width, 20);
        break;
      case 'bed':
        ctx.fillRect(-item.width / 2, -item.height / 2, item.width, item.height);
        ctx.strokeRect(-item.width / 2, -item.height / 2, item.width, item.height);
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(-item.width / 2 + 5, -item.height / 2 + 5, item.width - 10, item.height - 10);
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(-item.width / 2 + 15, -item.height / 2 + 15, 40, 25);
        ctx.fillRect(-item.width / 2 + 65, -item.height / 2 + 15, 40, 25);
        break;
      case 'table':
        ctx.fillRect(-item.width / 2, -item.height / 2, item.width, item.height);
        ctx.strokeRect(-item.width / 2, -item.height / 2, item.width, item.height);
        break;
      case 'door':
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-item.width / 2, -item.height / 2, item.width, item.height);
        ctx.strokeRect(-item.width / 2, -item.height / 2, item.width, item.height);
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(item.width / 2 - 15, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'window':
        ctx.fillStyle = '#87CEEB88';
        ctx.fillRect(-item.width / 2, -item.height / 2, item.width, item.height);
        ctx.strokeRect(-item.width / 2, -item.height / 2, item.width, item.height);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-item.width / 2, -item.height / 2 + item.height / 2);
        ctx.lineTo(item.width / 2, -item.height / 2 + item.height / 2);
        ctx.moveTo(-item.width / 2 + item.width / 2, -item.height / 2);
        ctx.lineTo(-item.width / 2 + item.width / 2, item.height / 2);
        ctx.stroke();
        break;
      default:
        ctx.fillRect(-item.width / 2, -item.height / 2, item.width, item.height);
        ctx.strokeRect(-item.width / 2, -item.height / 2, item.width, item.height);
    }
    
    ctx.restore();

    // Label
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(furnitureConfig.name, item.x + item.width / 2, item.y + item.height + 20);

    // Draw resize handles if selected
    if (isSelected) {
      drawResizeHandles(ctx, item.x, item.y, item.width, item.height);
    }
  };

  const drawRoom = (ctx: CanvasRenderingContext2D, room: Room) => {
    const roomConfig = roomTypes[room.type as keyof typeof roomTypes];
    const isSelected = selectedElement?.type === 'room' && selectedElement.id === room.id;
    
    ctx.fillStyle = roomConfig.color + (isSelected ? 'CC' : '80');
    ctx.strokeStyle = isSelected ? '#0000FF' : roomConfig.color;
    ctx.lineWidth = isSelected ? 3 : 2;
    
    ctx.fillRect(room.x, room.y, room.width, room.height);
    ctx.strokeRect(room.x, room.y, room.width, room.height);

    // Room label
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(room.name, room.x + room.width / 2, room.y + room.height / 2);

    // Dimensions
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.fillText(`${Math.round(room.width / gridSize)}ft`, room.x + room.width / 2, room.y - 10);
    ctx.fillText(`${Math.round(room.height / gridSize)}ft`, room.x - 30, room.y + room.height / 2);

    // Draw resize handles if selected
    if (isSelected) {
      drawResizeHandles(ctx, room.x, room.y, room.width, room.height);
    }
  };

  const drawWall = (ctx: CanvasRenderingContext2D, wall: Wall) => {
    const isSelected = selectedElement?.type === 'wall' && selectedElement.id === wall.id;
    
    ctx.strokeStyle = isSelected ? '#0000FF' : '#333';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(wall.x1, wall.y1);
    ctx.lineTo(wall.x2, wall.y2);
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawCanvas(ctx);
      }
    }
  }, [rooms, furniture, walls, gridSize, showGrid, selectedElement, tempWall]);

  const drawCanvas = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 0.5;
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
    }

    // Draw rooms first
    rooms.forEach(room => drawRoom(ctx, room));

    // Draw walls
    walls.forEach(wall => drawWall(ctx, wall));

    // Draw temporary wall
    if (tempWall) {
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(tempWall.x1, tempWall.y1);
      ctx.lineTo(tempWall.x2, tempWall.y2);
      ctx.stroke();
    }

    // Draw furniture on top
    furniture.forEach(item => drawFurniture(ctx, item));
  };

  const exportFloorPlan = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `floor-plan-${projectName || 'design'}.png`;
    link.href = dataURL;
    link.click();
  };

  const shareOnWhatsApp = () => {
    const message = `🏠 Floor Plan Design\n\n` +
                   `Project: ${projectName || 'My Home Design'}\n` +
                   `Rooms: ${rooms.length}\n` +
                   `Total Area: ${calculateTotalArea().toFixed(1)} sq.ft\n\n` +
                   `I've designed this floor plan and would like to discuss construction!`;
    
    window.open(`https://wa.me/9779845323733?text=${encodeURIComponent(message)}`, '_blank');
  };

  const resetFloorPlan = () => {
    setRooms([]);
    setFurniture([]);
    setWalls([]);
    setProjectName('');
    setSelectedElement(null);
  };

  const calculateTotalArea = () => {
    return rooms.reduce((total, room) => {
      const area = (room.width / gridSize) * (room.height / gridSize);
      return total + area;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-20 px-4" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
            2D Floor <span className="text-primary">Planner</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Design your dream home layout with our easy-to-use tools
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Tools */}
          <div className="lg:col-span-1 space-y-6">
            {/* Project Info */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Home className="w-5 h-5" />
                  Project Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm">Project Name</Label>
                  <Input
                    placeholder="e.g., My Dream Home"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Area: <span className="font-bold text-primary">{calculateTotalArea().toFixed(1)} sq.ft</span>
                </div>
              </CardContent>
            </Card>

            {/* Tools */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Ruler className="w-5 h-5" />
                  Design Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={selectedTool === 'select' ? 'default' : 'outline'}
                    onClick={() => setSelectedTool('select')}
                    className="h-12 text-sm"
                  >
                    <Move className="w-4 h-4 mr-2" />
                    Select
                  </Button>
                  <Button
                    variant={selectedTool === 'room' ? 'default' : 'outline'}
                    onClick={() => setSelectedTool('room')}
                    className="h-12 text-sm"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Room
                  </Button>
                  <Button
                    variant={selectedTool === 'wall' ? 'default' : 'outline'}
                    onClick={() => setSelectedTool('wall')}
                    className="h-12 text-sm"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Wall
                  </Button>
                </div>

                {selectedTool === 'room' && (
                  <>
                    <div className="space-y-3">
                      <Label className="text-sm">Room Type</Label>
                      <Select value={roomType} onValueChange={setRoomType}>
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(roomTypes).map(([key, room]) => (
                            <SelectItem key={key} value={key} className="text-sm">
                              <div className="flex items-center gap-2">
                                <room.icon className="w-4 h-4" />
                                {room.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm">Room Name (Optional)</Label>
                      <Input
                        placeholder="e.g., Master Bedroom"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Furniture */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sofa className="w-5 h-5" />
                  Furniture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {furnitureItems.map((item) => (
                    <Button
                      key={item.type}
                      variant={selectedTool === `furniture-${item.type}` ? 'default' : 'outline'}
                      onClick={() => setSelectedTool(`furniture-${item.type}`)}
                      className="h-16 flex-col text-xs"
                    >
                      <item.icon className="w-4 h-4 mb-1" />
                      {item.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Canvas Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle className="text-lg">Design Canvas</CardTitle>
                  <div className="text-lg font-semibold text-primary">
                    Total Area: {calculateTotalArea().toFixed(1)} sq.ft
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-border rounded-lg bg-white relative overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className="w-full h-auto cursor-crosshair"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  />
                </div>

                {/* Selected Element Controls */}
                {selectedElement && (
                  <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-semibold mb-3 text-sm">Edit Selected Element</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={rotateSelected} variant="outline" size="sm" className="text-xs h-8">
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Rotate
                      </Button>
                      <Button onClick={() => resizeSelected(20, 20)} variant="outline" size="sm" className="text-xs h-8">
                        <Plus className="w-3 h-3 mr-1" />
                        Enlarge
                      </Button>
                      <Button onClick={() => resizeSelected(-20, -20)} variant="outline" size="sm" className="text-xs h-8">
                        <Minus className="w-3 h-3 mr-1" />
                        Shrink
                      </Button>
                      <Button onClick={deleteSelected} variant="outline" size="sm" className="text-xs h-8 text-red-600">
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Or drag the blue handles to resize directly on canvas
                    </p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button onClick={exportFloorPlan} variant="outline" size="sm" className="text-xs h-8">
                    <Download className="w-3 h-3 mr-1" />
                    Export as Image
                  </Button>
                  <Button onClick={shareOnWhatsApp} className="bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs h-8">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Share on WhatsApp
                  </Button>
                  <Button onClick={resetFloorPlan} variant="outline" size="sm" className="text-xs h-8">
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reset All
                  </Button>
                </div>

                {/* Instructions */}
                <div className="mt-4 text-sm text-muted-foreground space-y-1">
                  <p>• <strong>Select tool:</strong> Click and drag elements. Use blue handles to resize.</p>
                  <p>• <strong>Room tool:</strong> Click to add rooms. Rooms are 20x20ft by default.</p>
                  <p>• <strong>Wall tool:</strong> Click start point, then end point to draw walls.</p>
                  <p>• <strong>Furniture:</strong> Click to place furniture items.</p>
                </div>
              </CardContent>
            </Card>

            {/* Elements List */}
            <Tabs defaultValue="rooms" className="w-full mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="rooms" className="text-sm">Rooms ({rooms.length})</TabsTrigger>
                <TabsTrigger value="furniture" className="text-sm">Furniture ({furniture.length})</TabsTrigger>
                <TabsTrigger value="walls" className="text-sm">Walls ({walls.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="rooms">
                <Card>
                  <CardContent className="pt-4 max-h-60 overflow-y-auto">
                    {rooms.length === 0 ? (
                      <p className="text-muted-foreground text-sm text-center py-4">No rooms added yet</p>
                    ) : (
                      <div className="space-y-2">
                        {rooms.map((room) => {
                          const roomConfig = roomTypes[room.type as keyof typeof roomTypes];
                          const IconComponent = roomConfig.icon;
                          const isSelected = selectedElement?.type === 'room' && selectedElement.id === room.id;
                          
                          return (
                            <div
                              key={room.id}
                              className={`flex items-center justify-between p-2 rounded-lg border ${
                                isSelected 
                                  ? 'border-blue-500 bg-blue-50' 
                                  : 'border-gray-200 bg-white hover:bg-gray-50'
                              } transition-colors duration-200 cursor-pointer text-sm`}
                              onClick={() => setSelectedElement({ type: 'room', id: room.id })}
                            >
                              <div className="flex items-center gap-2">
                                <IconComponent className="w-3 h-3 text-gray-600" />
                                <div>
                                  <div className="font-medium">{room.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {Math.round(room.width / gridSize)}ft × {Math.round(room.height / gridSize)}ft
                                  </div>
                                </div>
                              </div>
                              <div 
                                className="px-2 py-1 rounded text-xs font-medium text-white"
                                style={{ backgroundColor: roomConfig.color }}
                              >
                                {roomConfig.name}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="furniture">
                <Card>
                  <CardContent className="pt-4 max-h-60 overflow-y-auto">
                    {furniture.length === 0 ? (
                      <p className="text-muted-foreground text-sm text-center py-4">No furniture added yet</p>
                    ) : (
                      <div className="space-y-2">
                        {furniture.map((item) => {
                          const furnitureConfig = furnitureItems.find(f => f.type === item.type);
                          const isSelected = selectedElement?.type === 'furniture' && selectedElement.id === item.id;
                          
                          return (
                            <div
                              key={item.id}
                              className={`flex items-center justify-between p-2 rounded-lg border ${
                                isSelected 
                                  ? 'border-blue-500 bg-blue-50' 
                                  : 'border-gray-200 bg-white hover:bg-gray-50'
                              } transition-colors duration-200 cursor-pointer text-sm`}
                              onClick={() => setSelectedElement({ type: 'furniture', id: item.id })}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded"
                                  style={{ backgroundColor: furnitureConfig?.color }}
                                />
                                <div>
                                  <div className="font-medium">{furnitureConfig?.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {Math.round(item.width / gridSize)}ft × {Math.round(item.height / gridSize)}ft
                                    {item.rotation > 0 && ` • ${item.rotation}°`}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="walls">
                <Card>
                  <CardContent className="pt-4 max-h-60 overflow-y-auto">
                    {walls.length === 0 ? (
                      <p className="text-muted-foreground text-sm text-center py-4">No walls added yet</p>
                    ) : (
                      <div className="space-y-2">
                        {walls.map((wall) => {
                          const isSelected = selectedElement?.type === 'wall' && selectedElement.id === wall.id;
                          const length = Math.round(Math.sqrt(Math.pow(wall.x2 - wall.x1, 2) + Math.pow(wall.y2 - wall.y1, 2)) / gridSize);
                          
                          return (
                            <div
                              key={wall.id}
                              className={`flex items-center justify-between p-2 rounded-lg border ${
                                isSelected 
                                  ? 'border-blue-500 bg-blue-50' 
                                  : 'border-gray-200 bg-white hover:bg-gray-50'
                              } transition-colors duration-200 cursor-pointer text-sm`}
                              onClick={() => setSelectedElement({ type: 'wall', id: wall.id })}
                            >
                              <div className="flex items-center gap-2">
                                <Square className="w-3 h-3 text-gray-600" />
                                <div>
                                  <div className="font-medium">Wall</div>
                                  <div className="text-xs text-gray-500">
                                    Length: {length}ft
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Settings */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Canvas Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm">Grid Size: {gridSize}px ({gridSize/20}ft)</Label>
                  <Slider
                    value={[gridSize]}
                    onValueChange={([value]) => setGridSize(value)}
                    min={10}
                    max={50}
                    step={5}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showGrid"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="showGrid" className="text-sm">Show Grid</Label>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Project Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rooms:</span>
                  <span className="font-medium">{rooms.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Furniture:</span>
                  <span className="font-medium">{furniture.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Walls:</span>
                  <span className="font-medium">{walls.length}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-muted-foreground">Total Area:</span>
                  <span className="font-medium text-primary">{calculateTotalArea().toFixed(1)} sq.ft</span>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Start with rooms, then add walls and furniture</p>
                <p>• Use Select tool and drag blue handles to resize</p>
                <p>• All elements snap to grid for perfect alignment</p>
                <p>• Export your design when finished</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanner;