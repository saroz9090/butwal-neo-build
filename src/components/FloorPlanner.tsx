// src/components/FloorPlanner.tsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  Sofa,
  MessageCircle,
  RotateCcw,
  Plus,
  Minus,
  Compass,
  Lightbulb,
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
  Maximize2,
  Settings2,
  HelpCircle,
  Maximize,
  HelpCircle as QuestionIcon,
  Bed,
  Utensils,
  BookOpen
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
  angle?: number; // rotation support
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

export const FloorPlanner = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [furniture, setFurniture] = useState<Furniture[]>([]);
  const [walls, setWalls] = useState<Wall[]>([]);
  const [stairs, setStairs] = useState<Stair[]>([]);
  
  // Controls
  const [selectedTool, setSelectedTool] = useState('select');
  const [gridSize] = useState(16); // 16 pixels = 1 foot (50ft x 40ft = 2000 sq ft workspace)
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState('living');
  const [projectName, setProjectName] = useState('My 2000 Sq. Ft. Dream House Layout');
  const [selectedElement, setSelectedElement] = useState<{ type: 'room' | 'furniture' | 'wall' | 'stair', id: number } | null>(null);
  
  // Dragging states
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [wallStart, setWallStart] = useState<{ x: number, y: number } | null>(null);
  const [canvasTheme, setCanvasTheme] = useState<'neon' | 'sketch'>('neon');

  // Interactive help assistant toggle
  const [showVastuHelp, setShowVastuHelp] = useState(true);

  // Vastu guidelines configuration
  const roomTypes = {
    living: { 
      name: 'Living Room', 
      nepName: 'बैठक कोठा',
      color: '#E0F2FE', 
      border: '#0ea5e9', 
      vastu: 'Recommended in the North-East or North-West corner for positive energy flow.',
      tipNep: 'सकारात्मक ऊर्जा प्रवाहका लागि उत्तर-पूर्व वा उत्तर-पश्चिम कुनामा राख्न सिफारिस गरिन्छ।',
      idealQuadrant: 'NE/NW'
    },
    bedroom: { 
      name: 'Master Bedroom', 
      nepName: 'मुख्य सुत्ने कोठा',
      color: '#FEE2E2', 
      border: '#ef4444', 
      vastu: 'Must be in the South-West corner of the house to bring prosperity and peace.',
      tipNep: 'समृद्धि र शान्तिका लागि घरको दक्षिण-पश्चिम (Nairitya) कुनामा हुनुपर्दछ।',
      idealQuadrant: 'SW'
    },
    kitchen: { 
      name: 'Kitchen', 
      nepName: 'भान्सा कोठा',
      color: '#FEF3C7', 
      border: '#f59e0b', 
      vastu: 'Should ideally be placed in the South-East (Agneya) corner of the plot.',
      tipNep: 'आग्नेय (दक्षिण-पूर्वी) कुनामा भान्सा कोठा राख्नु सबैभन्दा शुभ मानिन्छ।',
      idealQuadrant: 'SE'
    },
    bathroom: { 
      name: 'Bathroom/Toilet', 
      nepName: 'शौचालय/बाथरुम',
      color: '#D1FAE5', 
      border: '#10b981', 
      vastu: 'Recommended in the West or North-West direction. Never in North-East.',
      tipNep: 'पश्चिम वा उत्तर-पश्चिम दिशामा सिफारिस गरिन्छ। उत्तर-पूर्व (ईशान) मा कहिल्यै नराख्नुहोस्।',
      idealQuadrant: 'W/NW'
    },
    dining: { 
      name: 'Dining Room', 
      nepName: 'भोजन कक्ष',
      color: '#F3E8FF', 
      border: '#a855f7', 
      vastu: 'Best placed in the West or East direction, close to the kitchen area.',
      nepVastu: 'पश्चिम वा पूर्व दिशामा, भान्सा कोठाको नजिक राख्नु उत्तम मानिन्छ।',
      idealQuadrant: 'W/E'
    },
    pooja: { 
      name: 'Pooja Room', 
      nepName: 'पूजा कोठा',
      color: '#FEF9C3', 
      border: '#eab308', 
      vastu: 'Highly sacred. Strictly in the North-East (Ishanya) corner, facing East/North.',
      tipNep: 'अत्यन्तै पवित्र। घरको उत्तर-पूर्व (ईशान) कुनामा हुनुपर्दछ, जहाँ पूर्व वा उत्तर फर्केर पूजा गरिन्छ।',
      idealQuadrant: 'NE'
    }
  };

  const furnitureItems = [
    { type: 'bed', name: 'Double Bed (डबल बेड)', width: 80, height: 96, color: '#2B6CB0' },
    { type: 'sofa', name: 'Sofa Set (सोफा सेट)', width: 96, height: 32, color: '#C05621' },
    { type: 'table', name: 'Dining Table (डाइनिङ टेबल)', width: 80, height: 48, color: '#744210' },
    { type: 'chair', name: 'Chair (कुर्सी)', width: 32, height: 32, color: '#718096' },
    { type: 'desk', name: 'Study Desk (पढ्ने टेबल)', width: 80, height: 32, color: '#975A16' },
    { type: 'door', name: 'Main Door (मूल ढोका)', width: 48, height: 16, color: '#A0AEC0' },
    { type: 'window', name: 'Glass Window (झ्याल)', width: 64, height: 16, color: '#3182CE' },
    { type: 'toilet', name: 'Toilet Commode (कमोड)', width: 32, height: 48, color: '#10b981' }
  ];

  // Auto layout templates (Instant 1BHK & 2BHK Vastu scaled to 2000 sq ft)
  const loadTemplate = (layoutType: '1bhk' | '2bhk_vastu') => {
    if (layoutType === '1bhk') {
      setRooms([
        { id: 1, x: 288, y: 224, width: 224, height: 160, type: 'living', name: 'Vastu Living Hall' },
        { id: 2, x: 32, y: 384, width: 256, height: 224, type: 'bedroom', name: 'Master Bedroom (SW)' },
        { id: 3, x: 512, y: 384, width: 256, height: 224, type: 'kitchen', name: 'Kitchen (SE)' },
        { id: 4, x: 32, y: 32, width: 256, height: 192, type: 'bathroom', name: 'Bathroom (NW)' },
        { id: 5, x: 512, y: 32, width: 256, height: 192, type: 'pooja', name: 'Pooja Room (NE)' },
      ]);
      setFurniture([
        { id: 11, type: 'sofa', x: 304, y: 256, width: 96, height: 32 },
        { id: 12, type: 'bed', x: 64, y: 448, width: 80, height: 96 },
        { id: 13, type: 'table', x: 544, y: 448, width: 80, height: 48 },
        { id: 14, type: 'door', x: 352, y: 368, width: 48, height: 16 },
        { id: 15, type: 'window', x: 112, y: 592, width: 64, height: 16 },
        { id: 16, type: 'toilet', x: 64, y: 64, width: 32, height: 48 },
      ]);
      setWalls([
        { id: 21, x1: 32, y1: 32, x2: 768, y2: 32 },
        { id: 22, x1: 32, y1: 608, x2: 768, y2: 608 },
        { id: 23, x1: 32, y1: 32, x2: 32, y2: 608 },
        { id: 24, x1: 768, y1: 32, x2: 768, y2: 608 },
      ]);
      setStairs([
        { id: 31, x: 224, y: 224, width: 64, height: 160, direction: 'vertical' }
      ]);
      setSelectedElement(null);
      setProjectName('Vastu 1BHK Turnkey Plan (100% Compliant)');
      toast.success('Successfully loaded 1BHK Vastu compliant layout!');
    } else if (layoutType === '2bhk_vastu') {
      setRooms([
        { id: 1, x: 288, y: 224, width: 224, height: 160, type: 'living', name: 'Vastu Living Hall' },
        { id: 2, x: 224, y: 32, width: 288, height: 192, type: 'bedroom', name: 'Guest Bedroom (NW/W)' },
        { id: 3, x: 32, y: 384, width: 256, height: 224, type: 'bedroom', name: 'Master Bed (SW)' },
        { id: 4, x: 512, y: 384, width: 256, height: 224, type: 'kitchen', name: 'Kitchen (SE)' },
        { id: 5, x: 32, y: 32, width: 192, height: 192, type: 'bathroom', name: 'Bathroom (NW)' },
        { id: 6, x: 512, y: 224, width: 256, height: 160, type: 'dining', name: 'Dining Room' },
        { id: 7, x: 512, y: 32, width: 256, height: 192, type: 'pooja', name: 'Pooja Room (NE)' },
      ]);
      setFurniture([
        { id: 101, type: 'sofa', x: 304, y: 256, width: 96, height: 32 },
        { id: 102, type: 'bed', x: 64, y: 448, width: 80, height: 96 },
        { id: 103, type: 'bed', x: 256, y: 64, width: 80, height: 96 },
        { id: 104, type: 'table', x: 576, y: 256, width: 80, height: 48 },
        { id: 105, type: 'door', x: 352, y: 368, width: 48, height: 16 },
        { id: 106, type: 'window', x: 112, y: 592, width: 64, height: 16 },
        { id: 107, type: 'toilet', x: 64, y: 64, width: 32, height: 48 },
      ]);
      setWalls([
        { id: 121, x1: 32, y1: 32, x2: 768, y2: 32 },
        { id: 122, x1: 32, y1: 608, x2: 768, y2: 608 },
        { id: 123, x1: 32, y1: 32, x2: 32, y2: 608 },
        { id: 124, x1: 768, y1: 32, x2: 768, y2: 608 },
      ]);
      setStairs([]);
      setSelectedElement(null);
      setProjectName('Vastu-Resilient 2BHK Elite Plan (100% Compliant)');
      toast.success('Successfully loaded 2BHK Vastu compliant layout!');
    }
  };

  // VASTU ANALYZER ENGINE
  // Calculates live Vastu compliance score and requirements list
  const vastuReport = useMemo(() => {
    let score = 0;
    const items = [
      {
        key: 'bedroom',
        title: 'Master Bedroom in South-West (SW)',
        desc: 'दक्षिण-पश्चिम (नैरित्य) कुनामा मुख्य बेडरुम',
        status: false,
        detail: 'Missing'
      },
      {
        key: 'kitchen',
        title: 'Kitchen in South-East (SE)',
        desc: 'दक्षिण-पूर्व (आग्नेय) कुनामा भान्सा कोठा',
        status: false,
        detail: 'Missing'
      },
      {
        key: 'pooja',
        title: 'Pooja Room in North-East (NE)',
        desc: 'उत्तर-पूर्व (ईशान) कुनामा पूजा कोठा',
        status: false,
        detail: 'Missing'
      },
      {
        key: 'toilet',
        title: 'Bathroom in West/North-West (W/NW)',
        desc: 'पश्चिम वा उत्तर-पश्चिममा शौचालय/बाथरुम',
        status: false,
        detail: 'Missing'
      }
    ];

    if (rooms.length === 0) {
      return { score: 0, checklist: items, text: 'Add rooms to begin live Vastu assessment.' };
    }

    // Determine coordinate bounds to find quadrants on our 800x640 canvas (50ft x 40ft)
    // Width: 0 to 800, Height: 0 to 640
    // Midpoint X: 400, Midpoint Y: 320
    rooms.forEach(room => {
      const centerX = room.x + room.width / 2;
      const centerY = room.y + room.height / 2;

      if (room.type === 'bedroom') {
        const item = items.find(i => i.key === 'bedroom');
        if (centerX < 410 && centerY > 300) {
          if (item) {
            item.status = true;
            item.detail = 'Excellent Placement! (उत्कृष्ट स्थिति)';
          }
        } else if (item && !item.status) {
          item.detail = 'Placed, but not in South-West corner.';
        }
      }

      if (room.type === 'kitchen') {
        const item = items.find(i => i.key === 'kitchen');
        if (centerX > 390 && centerY > 300) {
          if (item) {
            item.status = true;
            item.detail = 'Perfect Fire Placement! (शुभ स्थान)';
          }
        } else if (item && !item.status) {
          item.detail = 'Placed, but not in South-East corner.';
        }
      }

      if (room.type === 'pooja') {
        const item = items.find(i => i.key === 'pooja');
        if (centerX > 390 && centerY < 340) {
          if (item) {
            item.status = true;
            item.detail = 'Highly Auspicious! (परम शुभ स्थान)';
          }
        } else if (item && !item.status) {
          item.detail = 'Placed, but not in North-East corner.';
        }
      }

      if (room.type === 'bathroom') {
        const item = items.find(i => i.key === 'toilet');
        if (centerX < 410) {
          if (item) {
            item.status = true;
            item.detail = 'Compliant Direction (सहि दिशा)';
          }
        } else if (item && !item.status) {
          item.detail = 'Avoid placing toilets in North-East/East.';
        }
      }
    });

    // Calculate score
    const passed = items.filter(i => i.status).length;
    const present = items.filter(i => i.detail !== 'Missing').length;
    
    // Weight present and compliant items
    score = Math.round((passed / items.length) * 100);
    if (present === 0) score = 0;

    let adviceText = 'Add essential rooms to calculate Vastu resilient score.';
    if (score >= 75) {
      adviceText = '🏆 Outstanding! Your layout is highly Vastu-compliant and filled with organic energy. Ready for municipal registration.';
    } else if (score >= 50) {
      adviceText = '👍 Great progress! Adjust room placements to SW, SE, or NE corners to secure 100% compliance.';
    } else if (present > 0) {
      adviceText = '⚠️ Attention: Some key components are placed in contradictory directions. Review Vastu rules below.';
    }

    return { score, checklist: items, text: adviceText };
  }, [rooms]);

  // Quick place element to center of canvas (EXTREMELY FRIENDLY for normal users!)
  const handleQuickPlaceRoom = (type: string) => {
    const defaultLabel = roomTypes[type as keyof typeof roomTypes]?.name || 'New Room';
    const newRoom: Room = {
      id: Date.now(),
      x: 320, // centered X (multiple of 16)
      y: 240, // centered Y (multiple of 16)
      width: 160, // 10 ft
      height: 160, // 10 ft
      type,
      name: defaultLabel
    };
    setRooms([...rooms, newRoom]);
    setSelectedElement({ type: 'room', id: newRoom.id });
    setSelectedTool('select');
    toast.success(`Instantly added ${defaultLabel} to center! Drag to move it.`);
  };

  const handleQuickPlaceFurniture = (type: string) => {
    const config = furnitureItems.find(f => f.type === type);
    if (!config) return;

    const newFurniture: Furniture = {
      id: Date.now(),
      type,
      x: 384, // center X (multiple of 16)
      y: 304, // center Y (multiple of 16)
      width: config.width,
      height: config.height
    };
    setFurniture([...furniture, newFurniture]);
    setSelectedElement({ type: 'furniture', id: newFurniture.id });
    setSelectedTool('select');
    toast.success(`Placed ${config.name} in the center! Drag to rotate or fit.`);
  };

  const handleQuickPlaceStair = () => {
    const newStair: Stair = {
      id: Date.now(),
      x: 368,
      y: 288,
      width: 64,
      height: 96,
      direction: 'vertical'
    };
    setStairs([...stairs, newStair]);
    setSelectedElement({ type: 'stair', id: newStair.id });
    setSelectedTool('select');
    toast.success('Staircase placed! Use rotation controls to adjust direction.');
  };

  // Standard Mouse coordinates with snapping
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    // Snaps to the nearest 8-pixel grid point (half of a foot) for elegant layout snapping!
    return { 
      x: Math.round(x / 8) * 8, 
      y: Math.round(y / 8) * 8 
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getMousePos(e);
    
    // Draw Wall tool
    if (selectedTool === 'wall') {
      if (!wallStart) {
        setWallStart({ x, y });
        toast.info('Click next grid point on the canvas to finish the wall line');
      } else {
        if (wallStart.x === x && wallStart.y === y) {
          setWallStart(null);
          return;
        }
        const newWall: Wall = {
          id: Date.now(),
          x1: wallStart.x,
          y1: wallStart.y,
          x2: x,
          y2: y
        };
        setWalls([...walls, newWall]);
        setWallStart(null);
        toast.success('Wall added successfully!');
      }
      return;
    }
    
    // Check if clicked inside a wall
    const clickedWall = walls.find(w => {
      const A = x - w.x1;
      const B = y - w.y1;
      const C = w.x2 - w.x1;
      const D = w.y2 - w.y1;
      const dot = A * C + B * D;
      const lenSq = C * C + D * D;
      let param = -1;
      if (lenSq !== 0) param = dot / lenSq;
      
      let xx, yy;
      if (param < 0) {
        xx = w.x1;
        yy = w.y1;
      } else if (param > 1) {
        xx = w.x2;
        yy = w.y2;
      } else {
        xx = w.x1 + param * C;
        yy = w.y1 + param * D;
      }
      const dx = x - xx;
      const dy = y - yy;
      return Math.sqrt(dx * dx + dy * dy) <= 15;
    });

    if (clickedWall && selectedTool === 'select') {
      setSelectedElement({ type: 'wall', id: clickedWall.id });
      return;
    }

    // Check clicked furniture
    const clickedFurniture = furniture.find(f => 
      x >= f.x && x <= f.x + f.width && y >= f.y && y <= f.y + f.height
    );
    
    if (clickedFurniture) {
      setSelectedElement({ type: 'furniture', id: clickedFurniture.id });
      setIsDragging(true);
      setDragOffset({ x: x - clickedFurniture.x, y: y - clickedFurniture.y });
      return;
    }

    // Check clicked stairs
    const clickedStair = stairs.find(s => 
      x >= s.x && x <= s.x + s.width && y >= s.y && y <= s.y + s.height
    );
    
    if (clickedStair) {
      setSelectedElement({ type: 'stair', id: clickedStair.id });
      setIsDragging(true);
      setDragOffset({ x: x - clickedStair.x, y: y - clickedStair.y });
      return;
    }
    
    // Check clicked room
    const clickedRoom = rooms.find(r => 
      x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height
    );
    
    if (clickedRoom) {
      setSelectedElement({ type: 'room', id: clickedRoom.id });
      setIsDragging(true);
      setDragOffset({ x: x - clickedRoom.x, y: y - clickedRoom.y });
      return;
    }

    // Create room manually on click (if room tool selected)
    if (selectedTool === 'room') {
      const defaultLabel = roomTypes[roomType as keyof typeof roomTypes]?.nepName || 'नयाँ कोठा';
      const newRoom: Room = {
        id: Date.now(),
        x, y,
        width: 160,
        height: 160,
        type: roomType,
        name: roomName || defaultLabel
      };
      setRooms([...rooms, newRoom]);
      setSelectedElement({ type: 'room', id: newRoom.id });
      setSelectedTool('select');
      toast.success(`${newRoom.name} added!`);
    } else if (selectedTool === 'stair') {
      const newStair: Stair = {
        id: Date.now(),
        x, y,
        width: 60,
        height: 100,
        direction: 'vertical'
      };
      setStairs([...stairs, newStair]);
      setSelectedElement({ type: 'stair', id: newStair.id });
      setSelectedTool('select');
      toast.success('Stairs placed');
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
        setSelectedElement({ type: 'furniture', id: newFurniture.id });
        setSelectedTool('select');
        toast.success(`Placed ${config.name}`);
      }
    } else {
      // Clear selection if clicked blank canvas area
      setSelectedElement(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedElement) return;
    const { x, y } = getMousePos(e);
    
    // Apply snap-to-grid grid offset
    const snapX = Math.round((x - dragOffset.x) / 8) * 8;
    const snapY = Math.round((y - dragOffset.y) / 8) * 8;

    // Bounds lock
    const finalX = Math.max(8, Math.min(snapX, 784));
    const finalY = Math.max(8, Math.min(snapY, 624));

    if (selectedElement.type === 'room') {
      setRooms(rooms.map(r => r.id === selectedElement.id ? { ...r, x: finalX, y: finalY } : r));
    } else if (selectedElement.type === 'furniture') {
      setFurniture(furniture.map(f => f.id === selectedElement.id ? { ...f, x: finalX, y: finalY } : f));
    } else if (selectedElement.type === 'stair') {
      setStairs(stairs.map(s => s.id === selectedElement.id ? { ...s, x: finalX, y: finalY } : s));
    }
  };

  // Actions for modifying selected items
  const deleteSelected = () => {
    if (!selectedElement) return;
    
    if (selectedElement.type === 'room') {
      setRooms(rooms.filter(r => r.id !== selectedElement.id));
    } else if (selectedElement.type === 'furniture') {
      setFurniture(furniture.filter(f => f.id !== selectedElement.id));
    } else if (selectedElement.type === 'wall') {
      setWalls(walls.filter(w => w.id !== selectedElement.id));
    } else if (selectedElement.type === 'stair') {
      setStairs(stairs.filter(s => s.id !== selectedElement.id));
    }
    
    setSelectedElement(null);
    toast.success('Deleted element successfully');
  };

  const resizeSelectedWidth = (amount: number) => {
    if (!selectedElement) return;
    if (selectedElement.type === 'room') {
      setRooms(rooms.map(r => {
        if (r.id === selectedElement.id) {
          const newW = Math.max(40, r.width + amount);
          return { ...r, width: newW };
        }
        return r;
      }));
    } else if (selectedElement.type === 'furniture') {
      setFurniture(furniture.map(f => {
        if (f.id === selectedElement.id) {
          const newW = Math.max(20, f.width + amount);
          return { ...f, width: newW };
        }
        return f;
      }));
    } else if (selectedElement.type === 'stair') {
      setStairs(stairs.map(s => {
        if (s.id === selectedElement.id) {
          const newW = Math.max(20, s.width + amount);
          return { ...s, width: newW };
        }
        return s;
      }));
    }
  };

  const resizeSelectedHeight = (amount: number) => {
    if (!selectedElement) return;
    if (selectedElement.type === 'room') {
      setRooms(rooms.map(r => {
        if (r.id === selectedElement.id) {
          const newH = Math.max(40, r.height + amount);
          return { ...r, height: newH };
        }
        return r;
      }));
    } else if (selectedElement.type === 'furniture') {
      setFurniture(furniture.map(f => {
        if (f.id === selectedElement.id) {
          const newH = Math.max(20, f.height + amount);
          return { ...f, height: newH };
        }
        return f;
      }));
    } else if (selectedElement.type === 'stair') {
      setStairs(stairs.map(s => {
        if (s.id === selectedElement.id) {
          const newH = Math.max(20, s.height + amount);
          return { ...s, height: newH };
        }
        return s;
      }));
    }
  };

  const rotateStairDirection = () => {
    if (!selectedElement || selectedElement.type !== 'stair') return;
    setStairs(stairs.map(s => {
      if (s.id === selectedElement.id) {
        const nextDir = s.direction === 'vertical' ? 'horizontal' : 'vertical';
        return { 
          ...s, 
          direction: nextDir,
          // Swap width/height for comfortable rotation
          width: s.height,
          height: s.width
        };
      }
      return s;
    }));
    toast.success('Rotated stairs');
  };

  const rotateFurnitureAngle = () => {
    if (!selectedElement || selectedElement.type !== 'furniture') return;
    setFurniture(furniture.map(f => {
      if (f.id === selectedElement.id) {
        // Swap dimensions for 90 degree rotation
        return {
          ...f,
          width: f.height,
          height: f.width
        };
      }
      return f;
    }));
    toast.success('Rotated furniture by 90°');
  };

  const handleRoomRename = (name: string) => {
    if (!selectedElement || selectedElement.type !== 'room') return;
    setRooms(rooms.map(r => r.id === selectedElement.id ? { ...r, name } : r));
  };

  // Precise sizing presets for normal people
  const applySizePreset = (widthFeet: number, heightFeet: number) => {
    if (!selectedElement) return;
    const widthPx = widthFeet * gridSize;
    const heightPx = heightFeet * gridSize;
    
    if (selectedElement.type === 'room') {
      setRooms(rooms.map(r => r.id === selectedElement.id ? { ...r, width: widthPx, height: heightPx } : r));
      toast.success(`Applied ${widthFeet}' × ${heightFeet}' room dimensions`);
    } else if (selectedElement.type === 'furniture') {
      setFurniture(furniture.map(f => f.id === selectedElement.id ? { ...f, width: widthPx, height: heightPx } : f));
      toast.success(`Applied ${widthFeet}' × ${heightFeet}' furniture size`);
    }
  };

  // Drawing Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const isNeon = canvasTheme === 'neon';
    
    // Clear Stage
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid background
    if (isNeon) {
      ctx.fillStyle = '#0b1120';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw premium grid lines
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.25)';
      ctx.lineWidth = 0.5;
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.8)';
      ctx.lineWidth = 0.5;
    }

    // Grid lines spacing (1 block = 20px = 1 foot)
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

    // DRAW COMPASS DIRECTIONS ON CANVAS (N, S, E, W) for clear spatial awareness!
    ctx.font = '900 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (isNeon) {
      ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
    } else {
      ctx.fillStyle = 'rgba(100, 116, 139, 0.6)';
    }
    
    ctx.fillText('NORTH (उत्तर) ⬆', canvas.width / 2, 18);
    ctx.fillText('SOUTH (दक्षिण) ⬇', canvas.width / 2, canvas.height - 18);
    ctx.fillText('WEST (पश्चिम) ⬅', 50, canvas.height / 2);
    ctx.fillText('EAST (पूर्व) ➡', canvas.width - 50, canvas.height / 2);

    // DRAW CORNER VASTU ZONE LABELS
    ctx.font = '800 10px Inter, sans-serif';
    ctx.fillText('NE (ईशान)', canvas.width - 60, 32);
    ctx.fillText('NW (वायव्य)', 60, 32);
    ctx.fillText('SE (आग्नेय)', canvas.width - 60, canvas.height - 32);
    ctx.fillText('SW (नैरित्य)', 60, canvas.height - 32);

    // Draw Rooms (Fill and border with Vastu theme color cues)
    rooms.forEach(room => {
      const config = roomTypes[room.type as keyof typeof roomTypes];
      const isSelected = selectedElement?.type === 'room' && selectedElement.id === room.id;
      
      // Neon glows vs Blueprint sketching
      if (isNeon) {
        ctx.fillStyle = isSelected ? 'rgba(14, 165, 233, 0.15)' : 'rgba(30, 41, 59, 0.6)';
        ctx.strokeStyle = isSelected ? '#38bdf8' : (config ? config.border : '#475569');
        ctx.lineWidth = isSelected ? 3.5 : 2;
      } else {
        ctx.fillStyle = config ? config.color : '#f1f5f9';
        ctx.strokeStyle = isSelected ? '#2563eb' : (config ? config.border : '#475569');
        ctx.lineWidth = isSelected ? 3 : 1.5;
      }

      // Rounded rect / simple outline
      ctx.fillRect(room.x, room.y, room.width, room.height);
      ctx.strokeRect(room.x, room.y, room.width, room.height);

      // Draw Selected feedback glowing shadows
      if (isSelected) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = isNeon ? '#38bdf8' : '#2563eb';
        ctx.strokeRect(room.x, room.y, room.width, room.height);
        ctx.shadowBlur = 0; // reset
      }

      // Room Title
      if (isNeon) {
        ctx.fillStyle = isSelected ? '#38bdf8' : '#e2e8f0';
      } else {
        ctx.fillStyle = '#0f172a';
      }
      ctx.font = '900 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(room.name, room.x + room.width / 2, room.y + room.height / 2 - 10);

      // Room Dimensions in Feet (20px = 1ft)
      const wFeet = (room.width / gridSize).toFixed(0);
      const hFeet = (room.height / gridSize).toFixed(0);
      
      if (isNeon) {
        ctx.fillStyle = '#64748b';
      } else {
        ctx.fillStyle = '#64748b';
      }
      ctx.font = '600 10px Courier New, monospace';
      ctx.fillText(`${wFeet} ft × ${hFeet} ft`, room.x + room.width / 2, room.y + room.height / 2 + 10);

      // Draw mini symbol for the room to make it look highly intuitive!
      ctx.font = '14px serif';
      let icon = '🏠';
      if (room.type === 'bedroom') icon = '🛌';
      if (room.type === 'kitchen') icon = '🍳';
      if (room.type === 'bathroom') icon = '🛁';
      if (room.type === 'dining') icon = '🍽️';
      if (room.type === 'pooja') icon = '🛕';
      ctx.fillText(icon, room.x + room.width / 2, room.y + room.height / 2 - 28);
    });

    // Draw Stairs
    stairs.forEach(stair => {
      const isSelected = selectedElement?.type === 'stair' && selectedElement.id === stair.id;
      
      if (isNeon) {
        ctx.fillStyle = 'rgba(51, 65, 85, 0.8)';
        ctx.strokeStyle = isSelected ? '#06b6d4' : '#64748b';
        ctx.lineWidth = isSelected ? 3 : 1.5;
      } else {
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = isSelected ? '#2563eb' : '#475569';
        ctx.lineWidth = isSelected ? 2.5 : 1.5;
      }

      ctx.fillRect(stair.x, stair.y, stair.width, stair.height);
      ctx.strokeRect(stair.x, stair.y, stair.width, stair.height);

      // Step lines
      ctx.strokeStyle = isNeon ? '#334155' : '#cbd5e1';
      ctx.lineWidth = 1;
      const stepCount = stair.direction === 'vertical' ? 8 : 6;
      const stepSize = stair.direction === 'vertical' ? stair.height / stepCount : stair.width / stepCount;

      for (let i = 1; i < stepCount; i++) {
        if (stair.direction === 'vertical') {
          ctx.beginPath();
          ctx.moveTo(stair.x, stair.y + i * stepSize);
          ctx.lineTo(stair.x + stair.width, stair.y + i * stepSize);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(stair.x + i * stepSize, stair.y);
          ctx.lineTo(stair.x + i * stepSize, stair.y + stair.height);
          ctx.stroke();
        }
      }

      // Stairs text Label
      ctx.fillStyle = isNeon ? '#06b6d4' : '#1e293b';
      ctx.font = 'bold 9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('STAIRS ⬆', stair.x + stair.width / 2, stair.y + stair.height / 2);
    });

    // Draw Furniture with elegant icons & text overlays
    furniture.forEach(item => {
      const config = furnitureItems.find(f => f.type === item.type);
      if (!config) return;

      const isSelected = selectedElement?.type === 'furniture' && selectedElement.id === item.id;

      if (isNeon) {
        ctx.fillStyle = isSelected ? 'rgba(6, 182, 212, 0.15)' : 'rgba(30, 41, 59, 0.9)';
        ctx.strokeStyle = isSelected ? '#22d3ee' : '#475569';
        ctx.lineWidth = isSelected ? 2.5 : 1.5;
      } else {
        ctx.fillStyle = isSelected ? '#eff6ff' : config.color;
        ctx.strokeStyle = isSelected ? '#2563eb' : '#475569';
        ctx.lineWidth = isSelected ? 2 : 1.2;
      }

      // Draw custom architectural layout graphics for beds, sofas, tables
      ctx.fillRect(item.x, item.y, item.width, item.height);
      ctx.strokeRect(item.x, item.y, item.width, item.height);

      if (item.type === 'bed') {
        // Pillows
        ctx.fillStyle = isNeon ? '#1e293b' : '#ffffff';
        ctx.fillRect(item.x + 8, item.y + 8, (item.width - 24) / 2, 20);
        ctx.strokeRect(item.x + 8, item.y + 8, (item.width - 24) / 2, 20);
        ctx.fillRect(item.x + item.width / 2 + 4, item.y + 8, (item.width - 24) / 2, 20);
        ctx.strokeRect(item.x + item.width / 2 + 4, item.y + 8, (item.width - 24) / 2, 20);

        // Blanket sheet line
        ctx.beginPath();
        ctx.moveTo(item.x, item.y + 40);
        ctx.lineTo(item.x + item.width, item.y + 40);
        ctx.stroke();
      } else if (item.type === 'sofa') {
        // Arms
        ctx.fillStyle = isNeon ? '#1e293b' : '#e2e8f0';
        ctx.fillRect(item.x, item.y, 8, item.height);
        ctx.strokeRect(item.x, item.y, 8, item.height);
        ctx.fillRect(item.x + item.width - 8, item.y, 8, item.height);
        ctx.strokeRect(item.x + item.width - 8, item.y, 8, item.height);
      } else if (item.type === 'door') {
        // Door opening swing radius arc
        ctx.strokeStyle = isNeon ? '#0ea5e9' : '#3182ce';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(item.x, item.y + item.height, item.width, 1.5 * Math.PI, 2 * Math.PI);
        ctx.stroke();

        // Door plank
        ctx.fillStyle = isNeon ? '#0ea5e9' : '#64748b';
        ctx.fillRect(item.x, item.y + item.height - 3, item.width, 6);
      } else if (item.type === 'window') {
        // Glass stripes
        ctx.fillStyle = isNeon ? '#38bdf8' : '#93c5fd';
        ctx.fillRect(item.x + 5, item.y + 2, item.width - 10, item.height - 4);
      } else if (item.type === 'toilet') {
        // Toilet ring / flush box
        ctx.fillStyle = isNeon ? '#1e293b' : '#ffffff';
        ctx.fillRect(item.x + 3, item.y + 3, item.width - 6, 10);
        ctx.strokeRect(item.x + 3, item.y + 3, item.width - 6, 10);

        ctx.beginPath();
        ctx.arc(item.x + item.width / 2, item.y + 25, item.width / 2.8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }

      // Label inside furniture (unless tiny door/window)
      if (item.type !== 'door' && item.type !== 'window') {
        ctx.fillStyle = isNeon ? '#e2e8f0' : '#0f172a';
        ctx.font = 'bold 8px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        let emoji = '🛋️';
        if (item.type === 'bed') emoji = '🛏️';
        if (item.type === 'table') emoji = '🍽️';
        if (item.type === 'chair') emoji = '🪑';
        if (item.type === 'desk') emoji = '📚';
        if (item.type === 'toilet') emoji = '🚽';

        ctx.fillText(`${emoji} ${config.name.split(' ')[0]}`, item.x + item.width / 2, item.y + item.height / 2);
      }
    });

    // Draw Structural Walls
    walls.forEach(wall => {
      const isSelected = selectedElement?.type === 'wall' && selectedElement.id === wall.id;
      
      ctx.strokeStyle = isSelected 
        ? (isNeon ? '#06b6d4' : '#ef4444') 
        : (isNeon ? '#1e293b' : '#1e293b');
      ctx.lineWidth = isSelected ? 8 : 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(wall.x1, wall.y1);
      ctx.lineTo(wall.x2, wall.y2);
      ctx.stroke();

      // White core inside wall for authentic CAD/Architect blueprint drawing lines
      ctx.strokeStyle = isNeon ? '#0ea5e9' : '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(wall.x1, wall.y1);
      ctx.lineTo(wall.x2, wall.y2);
      ctx.stroke();
    });

    // Live preview during wall creation
    if (wallStart && selectedTool === 'wall') {
      ctx.strokeStyle = isNeon ? '#06b6d4' : '#ef4444';
      ctx.lineWidth = 4;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(wallStart.x, wallStart.y);
      ctx.lineTo(wallStart.x + 100, wallStart.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [rooms, furniture, walls, stairs, selectedElement, gridSize, wallStart, selectedTool, canvasTheme]);

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
    link.download = `${projectName.replace(/\s+/g, '-')}-2d-blueprint.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('Successfully downloaded your high-res blueprint!');
  };

  const shareOnWhatsApp = () => {
    const message = `*Custom Butwal Construction & Builders Layout*\n\nProject: ${projectName}\nEstimated Area: ${calculateTotalArea().toFixed(1)} Sq. Ft.\nVastu Compliance Score: ${vastuReport.score}%\n\nPlease review my layout and get me a customized turnkey price quote!`;
    window.open(`https://wa.me/9779763653181?text=${encodeURIComponent(message)}`, '_blank');
    toast.success('Consulting Butwal Engineering Desk on WhatsApp!');
  };

  const getSelectedVastuTip = () => {
    if (selectedElement && selectedElement.type === 'room') {
      const room = rooms.find(r => r.id === selectedElement.id);
      if (room) {
        const config = roomTypes[room.type as keyof typeof roomTypes];
        return { 
          name: room.name, 
          tip: config ? config.vastu : 'Clean energy entry, spacious.',
          nep: config ? config.tipNep : 'घरको वातावरण सकारात्मक राख्न खुला र उज्यालो बनाउनुहोस्।'
        };
      }
    }
    return null;
  };

  const activeVastu = getSelectedVastuTip();

  return (
    <div className="min-h-screen pt-32 pb-20 relative overflow-hidden bg-background">
      {/* Liquid Ambient Iridescent Background Mesh (Apple iOS style) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/6 left-1/10 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/20 to-rose-600/10 blur-[130px] liquid-orb-1" />
        <div className="absolute top-1/2 right-1/10 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-purple-600/20 to-indigo-600/15 blur-[140px] liquid-orb-2" />
        <div className="absolute bottom-1/10 left-1/3 w-[450px] h-[450px] rounded-full bg-gradient-to-r from-pink-500/15 to-amber-500/10 blur-[120px] liquid-orb-3" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-4">
        {/* Page Branded Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-ios-pill border border-white/20 text-rose-300 text-xs sm:text-sm font-bold shadow-lg mb-4 bg-white/5 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span>Interactive 2D Architecture Engine (नक्सा कोर्ने मेशिन)</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 text-foreground tracking-tight leading-tight">
            2D Interactive <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-primary to-pink-400 font-black">Floor Planner</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            आफ्नो घरको नक्सा आफै कोर्नुहोस् र **Vastu Shastra** अनुसार मिल्यो कि मिलेन तुरुन्तै जाँच्नुहोस्। १-क्लिकमै डाउनलोड वा सिधै इन्जिनियरसँग व्हाट्सएप (WhatsApp) मा सुझाव लिनुहोस्।
          </p>
        </div>

        {/* Quick Starter Templates */}
        <div className="mb-8 p-5 glass rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary animate-pulse shrink-0" />
            <div>
              <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                One-Click Quick Templates <span className="text-xs text-rose-400">(तुरुन्तै लोड गर्नुहोस्)</span>
              </h4>
              <p className="text-xs text-muted-foreground">Load ready-made blueprints instantly & drag to modify according to your requirements.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              onClick={() => loadTemplate('1bhk')}
              className="border-primary/20 hover:bg-primary/5 text-xs font-semibold h-9 rounded-xl flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5 text-primary" /> Load standard 1BHK Layout
            </Button>
            <Button 
              variant="outline" 
              onClick={() => loadTemplate('2bhk_vastu')}
              className="border-yellow-500/20 hover:bg-yellow-500/5 text-xs font-semibold h-9 rounded-xl text-yellow-600 dark:text-yellow-400 flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-yellow-500 animate-spin-slow" /> Load Vastu 2BHK Plan
            </Button>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls & Tools Sidebar (Interactive Tabs) */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Project Specs Card */}
            <Card className="glass shadow-sm border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-foreground flex items-center justify-between">
                  <span>Project Specs</span>
                  <Settings2 className="w-4 h-4 text-primary" />
                </CardTitle>
                <CardDescription className="text-xs">Customize title & view live area</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Plan Title</Label>
                  <Input
                    placeholder="e.g. My Sweet Home"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="h-10 text-xs font-semibold border-white/10 bg-background/50 rounded-xl"
                  />
                </div>
                <div className="p-3 bg-gradient-to-r from-primary/10 via-rose-500/5 to-purple-500/5 rounded-xl border border-primary/20 flex justify-between items-center shadow-inner">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Estimated Area:</span>
                  <span className="font-black text-primary text-sm sm:text-base">{calculateTotalArea().toFixed(1)} Sq. Ft.</span>
                </div>
              </CardContent>
            </Card>

            {/* Smart Add Toolbox Tabs */}
            <Card className="glass shadow-sm border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-foreground">Add Elements (सामाग्रीहरू थप्नुहोस्)</CardTitle>
                <CardDescription className="text-xs">Click any element below to instantly place it in the center of the canvas stage.</CardDescription>
              </CardHeader>
              <CardContent className="p-3">
                <Tabs defaultValue="rooms" className="w-full">
                  <TabsList className="grid grid-cols-3 gap-1 h-9 bg-background/50 rounded-lg p-1 border border-white/5 mb-3">
                    <TabsTrigger value="rooms" className="text-[10px] font-bold py-1 px-2 flex items-center justify-center gap-1">
                      <Home className="w-3 h-3 text-primary" /> Rooms
                    </TabsTrigger>
                    <TabsTrigger value="furniture" className="text-[10px] font-bold py-1 px-2 flex items-center justify-center gap-1">
                      <Sofa className="w-3 h-3 text-amber-400" /> Furniture
                    </TabsTrigger>
                    <TabsTrigger value="structural" className="text-[10px] font-bold py-1 px-2 flex items-center justify-center gap-1">
                      <Ruler className="w-3 h-3 text-blue-400" /> Walls
                    </TabsTrigger>
                  </TabsList>

                  {/* ROOMS TAB */}
                  <TabsContent value="rooms" className="space-y-3 focus-visible:outline-none focus-visible:ring-0">
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(roomTypes).map(([key, value]) => (
                        <Button
                          key={key}
                          variant="outline"
                          onClick={() => handleQuickPlaceRoom(key)}
                          className="h-12 flex flex-col items-center justify-center border-white/10 hover:bg-primary/5 rounded-xl gap-0.5 text-xs p-1 animate-fade-in"
                        >
                          <span className="text-sm">
                            {key === 'living' && <Sofa className="w-4 h-4 text-sky-400" />}
                            {key === 'bedroom' && <Bed className="w-4 h-4 text-rose-400" />}
                            {key === 'kitchen' && <Utensils className="w-4 h-4 text-amber-400" />}
                            {key === 'bathroom' && <Info className="w-4 h-4 text-green-400" />}
                            {key === 'dining' && <Utensils className="w-4 h-4 text-purple-400" />}
                            {key === 'pooja' && <Compass className="w-4 h-4 text-yellow-400" />}
                          </span>
                          <span className="text-[10px] font-bold">{value.name}</span>
                        </Button>
                      ))}
                    </div>
                  </TabsContent>

                  {/* FURNITURE TAB */}
                  <TabsContent value="furniture" className="space-y-3 focus-visible:outline-none focus-visible:ring-0">
                    <div className="grid grid-cols-2 gap-2">
                      {furnitureItems.map((item) => (
                        <Button
                          key={item.type}
                          variant="outline"
                          onClick={() => handleQuickPlaceFurniture(item.type)}
                          className="h-12 flex flex-col items-center justify-center border-white/10 hover:bg-primary/5 rounded-xl gap-0.5 text-xs p-1 animate-fade-in"
                        >
                          <span className="text-sm">
                            {item.type === 'bed' && <Bed className="w-4 h-4 text-sky-400" />}
                            {item.type === 'sofa' && <Sofa className="w-4 h-4 text-rose-400" />}
                            {item.type === 'table' && <Square className="w-4 h-4 text-amber-400" />}
                            {item.type === 'chair' && <Move className="w-4 h-4 text-green-400" />}
                            {item.type === 'desk' && <BookOpen className="w-4 h-4 text-purple-400" />}
                            {item.type === 'door' && <Home className="w-4 h-4 text-cyan-400" />}
                            {item.type === 'window' && <Square className="w-4 h-4 text-emerald-400" />}
                            {item.type === 'toilet' && <Info className="w-4 h-4 text-blue-400" />}
                          </span>
                          <span className="text-[10px] font-medium truncate max-w-full">{item.name.split(' ')[0]}</span>
                        </Button>
                      ))}
                    </div>
                  </TabsContent>

                  {/* STRUCTURAL & WALLS TAB */}
                  <TabsContent value="structural" className="space-y-3 focus-visible:outline-none focus-visible:ring-0">
                    <Button
                      variant={selectedTool === 'wall' ? 'default' : 'outline'}
                      onClick={() => setSelectedTool('wall')}
                      className="w-full h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <Ruler className="w-4 h-4" />
                      Draw Custom Wall line
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleQuickPlaceStair}
                      className="w-full h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border-white/10 hover:bg-primary/5"
                    >
                      <Home className="w-4 h-4 text-primary" />
                      Place Staircase (भर्याङ)
                    </Button>
                    
                    <div className="text-[10px] text-muted-foreground p-3 rounded-xl bg-background/40 border border-white/5 space-y-1">
                      <p className="font-bold text-foreground flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                        Custom Wall Pro-Tip:
                      </p>
                      <p>Click "Draw Custom Wall line", click once on canvas to start, and click again to finish the wall. Wall snaps instantly to exact grids.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

          </div>

          {/* Interactive Design Canvas Area */}
          <div className="lg:col-span-6 space-y-4">
            
            <Card className="glass border-white/10 shadow-lg overflow-hidden">
              <CardHeader className="pb-3 bg-card/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <Maximize2 className="w-4 h-4 text-primary" />
                      House Design Stage
                    </CardTitle>
                    <div className="flex items-center gap-1.5 border border-white/10 rounded-xl p-0.5 bg-background shadow-inner">
                      <Button 
                        size="sm" 
                        variant={canvasTheme === 'neon' ? 'default' : 'ghost'} 
                        onClick={() => setCanvasTheme('neon')}
                        className={`h-6 text-[10px] font-bold px-2 rounded-lg transition-all ${canvasTheme === 'neon' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground'}`}
                      >
                        Blueprint
                      </Button>
                      <Button 
                        size="sm" 
                        variant={canvasTheme === 'sketch' ? 'default' : 'ghost'} 
                        onClick={() => setCanvasTheme('sketch')}
                        className={`h-6 text-[10px] font-bold px-2 rounded-lg transition-all ${canvasTheme === 'sketch' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground'}`}
                      >
                        Sketch
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="text-xs">
                    Grid Scale: 1 Block = 1 Foot. Snap enabled. Drag any element to move.
                  </CardDescription>
                </div>
                
                {selectedElement && (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={deleteSelected}
                    className="h-8 text-xs font-bold rounded-lg px-2.5 shrink-0 self-end sm:self-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete Selected
                  </Button>
                )}
              </CardHeader>
              
              <CardContent className="p-0 border-t border-white/10">
                
                {/* Canvas Render Wrapper */}
                <div className={`border-b border-white/10 overflow-auto transition-all duration-300 ${canvasTheme === 'neon' ? 'bg-[#0b1120]' : 'bg-white'} p-4`}>
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={640}
                    className={`block w-full h-auto max-w-[800px] mx-auto cursor-grab active:cursor-grabbing border border-white/10 rounded-xl shadow-xl transition-all duration-300 ${canvasTheme === 'neon' ? 'bg-[#0b1120]' : 'bg-slate-50'}`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                  />
                </div>

                {/* Selected Item Sizer / Custom Sizers (Nepalese Friendly) */}
                {selectedElement && (
                  <div className="p-5 bg-card/60 border-t border-white/10 flex flex-col gap-4 animate-fade-in">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0">
                          <Settings2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
                            Modify Selected Element Dimensions
                          </h4>
                          <p className="text-xs text-muted-foreground">Change the room size, rotate elements or apply fast standard sizing presets.</p>
                        </div>
                      </div>

                      {/* Stair rotation */}
                      <div className="flex flex-wrap gap-2">
                        {selectedElement.type === 'stair' && (
                          <Button onClick={rotateStairDirection} variant="outline" size="sm" className="h-9 text-xs rounded-xl border-white/10 font-semibold">
                            🔄 Rotate Direction
                          </Button>
                        )}
                        {selectedElement.type === 'furniture' && (
                          <Button onClick={rotateFurnitureAngle} variant="outline" size="sm" className="h-9 text-xs rounded-xl border-white/10 font-semibold">
                            🔄 Rotate 90°
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Sizing & Custom Preset Boxes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {/* Pixel incrementers */}
                      {selectedElement.type !== 'wall' && (
                        <div className="flex flex-wrap gap-3">
                          <div className="flex items-center gap-1.5 border border-white/10 rounded-xl p-1 bg-background shadow-inner">
                            <span className="text-[10px] font-black text-muted-foreground px-2 uppercase">Width (चौडाई)</span>
                            <Button onClick={() => resizeSelectedWidth(-16)} variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10">
                              <Minus className="w-3.5 h-3.5" />
                            </Button>
                            <Button onClick={() => resizeSelectedWidth(16)} variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10">
                              <Plus className="w-3.5 h-3.5" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-1.5 border border-white/10 rounded-xl p-1 bg-background shadow-inner">
                            <span className="text-[10px] font-black text-muted-foreground px-2 uppercase">Height (लम्बाई)</span>
                            <Button onClick={() => resizeSelectedHeight(-16)} variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10">
                              <Minus className="w-3.5 h-3.5" />
                            </Button>
                            <Button onClick={() => resizeSelectedHeight(16)} variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10">
                              <Plus className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Quick Standard Preset dimensions for normal people */}
                      {selectedElement.type === 'room' && (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-muted-foreground">Dimensions Presets:</span>
                          <Button onClick={() => applySizePreset(10, 10)} variant="outline" size="sm" className="h-8 text-[10px] font-bold rounded-lg border-white/10">
                            10' × 10' (Compact)
                          </Button>
                          <Button onClick={() => applySizePreset(12, 12)} variant="outline" size="sm" className="h-8 text-[10px] font-bold rounded-lg border-white/10">
                            12' × 12' (Standard)
                          </Button>
                          <Button onClick={() => applySizePreset(14, 16)} variant="outline" size="sm" className="h-8 text-[10px] font-bold rounded-lg border-white/10">
                            14' × 16' (Master Suite)
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Room Renamer */}
                    {selectedElement.type === 'room' && (
                      <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row gap-3 items-center">
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider shrink-0">Rename Selected Room:</Label>
                        <Input
                          placeholder="e.g. Master Bed Room"
                          value={rooms.find(r => r.id === selectedElement.id)?.name || ''}
                          onChange={(e) => handleRoomRename(e.target.value)}
                          className="h-10 text-xs font-semibold border-white/10 bg-background/50 rounded-xl max-w-sm"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Sandbox Action Buttons */}
                <div className="p-4 bg-card/20 flex flex-wrap gap-2.5 items-center justify-between border-t border-white/10">
                  <div className="flex flex-wrap gap-2.5">
                    <Button 
                      onClick={exportFloorPlan} 
                      className="bg-primary text-white hover:bg-primary/90 h-10 px-5 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      Export 2D Blueprint PNG
                    </Button>
                    <Button 
                      onClick={shareOnWhatsApp}
                      className="bg-[#25D366] hover:bg-[#20BA5A] text-white h-10 px-5 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Consult Engineer (व्हाट्सएप)
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    {!showVastuHelp && (
                      <Button 
                        onClick={() => setShowVastuHelp(true)} 
                        variant="outline" 
                        className="border-white/10 h-10 text-xs font-bold rounded-xl"
                      >
                        Show Vastu checklist
                      </Button>
                    )}
                    <Button 
                      onClick={() => { 
                        setRooms([]); 
                        setFurniture([]); 
                        setWalls([]); 
                        setStairs([]); 
                        setSelectedElement(null); 
                        setWallStart(null); 
                      }} 
                      variant="outline" 
                      className="border-white/10 hover:bg-red-500/10 hover:text-red-500 h-10 text-xs font-bold rounded-xl"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" />
                      Clear Stage
                    </Button>
                  </div>
                </div>

              </CardContent>
            </Card>

          </div>

          {/* Column 3: Live Vastu Info & Checklist Sidebar (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Live Vastu Compliance Score Card */}
            <Card className="glass shadow-sm border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-1.5 text-amber-400">
                  <Compass className="w-4 h-4 animate-spin-slow" />
                  Vastu Compliance Meter
                </CardTitle>
                <CardDescription className="text-[10px]">Real-time Vedic Layout check</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">Compliance Score:</span>
                  <span className="font-black text-sm text-amber-400">{vastuReport.score}%</span>
                </div>
                {/* Score Progress Bar */}
                <div className="w-full h-2.5 bg-background rounded-full overflow-hidden border border-white/5 p-0.5">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                    style={{ width: `${vastuReport.score}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground leading-normal italic">
                  {vastuReport.text}
                </p>
              </CardContent>
            </Card>

            {/* Selected Room Vastu Explanation Panel */}
            {activeVastu ? (
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 flex gap-3 animate-fade-in shadow-md">
                <Compass className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h4 className="font-bold text-amber-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    Vedic Vastu Tip for: {activeVastu.name}
                  </h4>
                  <p className="text-xs text-amber-50/90 mt-1 leading-relaxed">
                    {activeVastu.tip}
                  </p>
                  <p className="text-xs text-yellow-300 mt-1.5 font-semibold font-nepali">
                    नेपाली भाषामा: {activeVastu.nep}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-card/40 border border-white/5 flex gap-3 text-muted-foreground animate-fade-in shadow-inner">
                <Compass className="w-5 h-5 text-muted-foreground/50 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">
                    Selected Room Guide
                  </h4>
                  <p className="text-[11px] mt-1 leading-normal italic">
                    Click any room on the canvas stage to instantly view its detailed Vastu rules, orientations, and Nepalese guide tips right here.
                  </p>
                </div>
              </div>
            )}

            {/* Vastu checklist card for Normal People */}
            {showVastuHelp && (
              <Card className="glass shadow-sm border-white/10">
                <CardHeader className="pb-2.5 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Vastu Checklist
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowVastuHelp(false)} 
                    className="h-6 text-[10px] text-muted-foreground hover:bg-white/5 px-2 rounded-lg"
                  >
                    Hide
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3 p-4 border-t border-white/5 max-h-[350px] overflow-y-auto pr-1">
                  {vastuReport.checklist.map((item) => (
                    <div 
                      key={item.key} 
                      className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                        item.status 
                          ? 'bg-green-500/5 border-green-500/20' 
                          : item.detail === 'Missing' 
                            ? 'bg-background/20 border-white/5' 
                            : 'bg-amber-500/5 border-amber-500/20'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {item.status ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className={`w-4 h-4 ${item.detail === 'Missing' ? 'text-muted-foreground/40' : 'text-amber-500'}`} />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-foreground flex flex-col">
                          <span>{item.title}</span>
                          <span className="text-[10px] font-normal text-muted-foreground leading-tight">{item.desc}</span>
                        </p>
                        <span className={`text-[10px] font-semibold mt-1 block ${item.status ? 'text-green-400' : 'text-amber-400'}`}>
                          {item.detail}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default FloorPlanner;
