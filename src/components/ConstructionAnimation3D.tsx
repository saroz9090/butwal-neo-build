import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  OrbitControls, 
  PerspectiveCamera, 
  ContactShadows, 
  Float, 
  Sparkles
} from "@react-three/drei";
import * as THREE from "three";
import { Sun, Sunset, Moon, Eye, RotateCw } from "lucide-react";

export interface ConstructionAnimation3DProps {
  stage: number;
  storey: number; // 1, 1.5, 2, 2.5, 3, 3.5, 4
  buildingType?: 'residential' | 'commercial';
}

type LightingMode = "daylight" | "sunset" | "night";

// ==========================================
// 1. MODERN ULTRA-REALISTIC WORKERS & ENGINEERS
// ==========================================
function ModernWorker({ 
  position, 
  role = "mason", 
  rotationY = 0 
}: { 
  position: [number, number, number]; 
  role?: "engineer" | "mason" | "surveyor" | "welder";
  rotationY?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 2.5 + position[0]) * 0.015;
    }
  });

  const vestColor = role === "engineer" ? "#F8FAFC" : role === "surveyor" ? "#EA580C" : "#F59E0B";
  const helmetColor = role === "engineer" ? "#FFFFFF" : role === "surveyor" ? "#EF4444" : "#FBBF24";

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]}>
      {/* Heavy Steel-Toe Safety Boots */}
      <mesh position={[-0.12, 0.1, 0.02]} castShadow>
        <boxGeometry args={[0.13, 0.18, 0.26]} />
        <meshStandardMaterial color="#1C1917" roughness={0.9} />
      </mesh>
      <mesh position={[0.12, 0.1, 0.02]} castShadow>
        <boxGeometry args={[0.13, 0.18, 0.26]} />
        <meshStandardMaterial color="#1C1917" roughness={0.9} />
      </mesh>

      {/* Industrial Work Denim */}
      <mesh position={[-0.12, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.085, 0.55, 12]} />
        <meshStandardMaterial color="#1E293B" roughness={0.8} />
      </mesh>
      <mesh position={[0.12, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.085, 0.55, 12]} />
        <meshStandardMaterial color="#1E293B" roughness={0.8} />
      </mesh>

      {/* Hi-Vis Safety Vest & Torso */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[0.4, 0.54, 0.22]} />
        <meshStandardMaterial color={vestColor} roughness={0.4} />
      </mesh>

      {/* Neon 3M Reflective Safety Strips */}
      <mesh position={[0, 0.96, 0.115]}>
        <boxGeometry args={[0.36, 0.05, 0.01]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.1} metalness={0.9} emissive="#94A3B8" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 1.08, 0.115]}>
        <boxGeometry args={[0.36, 0.035, 0.01]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.1} metalness={0.9} emissive="#94A3B8" emissiveIntensity={0.2} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.36, 0]} castShadow>
        <sphereGeometry args={[0.14, 20, 20]} />
        <meshStandardMaterial color="#D4A373" roughness={0.5} />
      </mesh>

      {/* Safety Hard Hat */}
      <group position={[0, 1.46, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.17, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={helmetColor} roughness={0.25} metalness={0.2} />
        </mesh>
        <mesh position={[0, -0.02, 0.03]}>
          <cylinderGeometry args={[0.2, 0.2, 0.025, 20]} />
          <meshStandardMaterial color={helmetColor} roughness={0.25} metalness={0.2} />
        </mesh>
      </group>

      {/* Engineer Digital Tablet with Glow Screen */}
      {role === "engineer" ? (
        <group position={[0.22, 0.95, 0.18]} rotation={[0.4, 0.2, -0.2]}>
          <mesh castShadow>
            <boxGeometry args={[0.22, 0.3, 0.015]} />
            <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.009]}>
            <planeGeometry args={[0.19, 0.26]} />
            <meshBasicMaterial color="#38BDF8" />
          </mesh>
        </group>
      ) : null}
    </group>
  );
}

// ==========================================
// 2. PRECISION CONSTRUCTION MACHINERY & HEAVY ASSETS
// ==========================================
function HeavyExcavator({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  const boomRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 1.5;
    if (boomRef.current) {
      boomRef.current.rotation.z = -0.35 + Math.sin(t) * 0.18;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Heavy Steel Continuous Crawler Tracks */}
      {[-0.85, 0.85].map((z, i) => (
        <group key={i} position={[0, 0.35, z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.2, 0.65, 0.45]} />
            <meshStandardMaterial color="#1C1917" roughness={0.9} metalness={0.4} />
          </mesh>
          {/* Track Rollers */}
          {[-1.1, -0.5, 0, 0.5, 1.1].map((rx, j) => (
            <mesh key={j} position={[rx, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.16, 0.16, 0.48, 16]} />
              <meshStandardMaterial color="#44403C" metalness={0.8} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Main Track Chassis */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[2.4, 0.3, 1.3]} />
        <meshStandardMaterial color="#292524" metalness={0.6} />
      </mesh>

      {/* Slewing Upper Carriage (Caterpillar Industrial Yellow) */}
      <group position={[0, 1.35, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.3, 1.1, 1.9]} />
          <meshStandardMaterial color="#EAB308" roughness={0.35} metalness={0.3} />
        </mesh>

        {/* Operator Tinted Glass Cabin */}
        <mesh position={[0.5, 0.25, 0.55]} castShadow>
          <boxGeometry args={[1.1, 1.0, 0.75]} />
          <meshStandardMaterial color="#0284C7" transparent opacity={0.65} roughness={0.05} metalness={0.9} />
        </mesh>

        {/* Counterweight & Engine Hood */}
        <mesh position={[-0.9, 0.15, 0]} castShadow>
          <boxGeometry args={[0.7, 0.9, 1.85]} />
          <meshStandardMaterial color="#1C1917" roughness={0.8} />
        </mesh>

        {/* Articulated Hydraulic Boom & Dipper Arm */}
        <group ref={boomRef} position={[0.9, 0.2, -0.3]}>
          {/* Main Boom Segment */}
          <mesh position={[1.4, 0.9, 0]} rotation={[0, 0, 0.55]} castShadow>
            <boxGeometry args={[2.8, 0.32, 0.24]} />
            <meshStandardMaterial color="#EAB308" roughness={0.35} metalness={0.3} />
          </mesh>

          {/* Chrome Dual Hydraulic Cylinder */}
          <mesh position={[0.9, 0.4, 0]} rotation={[0, 0, 0.55]}>
            <cylinderGeometry args={[0.07, 0.07, 1.8, 12]} />
            <meshStandardMaterial color="#F8FAFC" metalness={0.98} roughness={0.05} />
          </mesh>

          {/* Dipper Arm */}
          <group position={[2.6, 1.7, 0]} rotation={[0, 0, -1.2]}>
            <mesh position={[1.1, 0, 0]} castShadow>
              <boxGeometry args={[2.2, 0.24, 0.2]} />
              <meshStandardMaterial color="#EAB308" roughness={0.35} metalness={0.3} />
            </mesh>

            {/* Heavy Reinforced Steel Digging Bucket */}
            <group position={[2.2, 0, 0]} rotation={[0, 0, 0.7]}>
              <mesh castShadow>
                <boxGeometry args={[0.75, 0.65, 0.75]} />
                <meshStandardMaterial color="#292524" metalness={0.9} roughness={0.6} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

function DumpTruck({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* 6 Heavy Truck Wheels */}
      {[
        [-1.6, 0.45, 0.85],
        [0.4, 0.45, 0.85],
        [1.6, 0.45, 0.85],
        [-1.6, 0.45, -0.85],
        [0.4, 0.45, -0.85],
        [1.6, 0.45, -0.85],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.32, 20]} />
            <meshStandardMaterial color="#1C1917" roughness={0.95} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.34, 12]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}

      {/* Main Steel Frame Chassis */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[4.4, 0.3, 1.4]} />
        <meshStandardMaterial color="#1E293B" metalness={0.7} />
      </mesh>

      {/* Modern Driver Cabin */}
      <mesh position={[1.4, 1.45, 0]} castShadow>
        <boxGeometry args={[1.3, 1.25, 1.7]} />
        <meshStandardMaterial color="#DC2626" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Windshield */}
      <mesh position={[1.85, 1.6, 0]}>
        <boxGeometry args={[0.45, 0.65, 1.55]} />
        <meshStandardMaterial color="#38BDF8" transparent opacity={0.7} roughness={0.05} />
      </mesh>

      {/* Heavy Tilted Tipper Dump Bed */}
      <group position={[-0.7, 1.2, 0]} rotation={[0, 0, -0.22]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.7, 1.0, 1.75]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.5} metalness={0.4} />
        </mesh>
        {/* Excavated Mountain Soil Bed in Dump */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[2.5, 0.6, 1.6]} />
          <meshStandardMaterial color="#451A03" roughness={1.0} />
        </mesh>
      </group>
    </group>
  );
}

function ConcreteMixerTruck({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  const drumRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (drumRef.current) {
      drumRef.current.rotation.y += 0.04;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Wheels */}
      {[
        [-1.6, 0.45, 0.85],
        [0.4, 0.45, 0.85],
        [1.6, 0.45, 0.85],
        [-1.6, 0.45, -0.85],
        [0.4, 0.45, -0.85],
        [1.6, 0.45, -0.85],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.32, 20]} />
            <meshStandardMaterial color="#1C1917" roughness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Cabin */}
      <mesh position={[1.4, 1.45, 0]} castShadow>
        <boxGeometry args={[1.3, 1.25, 1.7]} />
        <meshStandardMaterial color="#0284C7" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Rotating Concrete Mixing Barrel */}
      <group position={[-0.5, 1.65, 0]} rotation={[0, 0, 0.28]}>
        <group ref={drumRef}>
          <mesh castShadow>
            <cylinderGeometry args={[0.95, 0.6, 2.7, 24]} />
            <meshStandardMaterial color="#F1F5F9" roughness={0.3} metalness={0.5} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.97, 0.62, 0.5, 24]} />
            <meshStandardMaterial color="#0284C7" />
          </mesh>
        </group>
      </group>

      {/* Concrete Chute */}
      <mesh position={[-2.1, 1.15, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[1.1, 0.25, 0.4]} />
        <meshStandardMaterial color="#64748B" metalness={0.8} />
      </mesh>
    </group>
  );
}

function TotalStationSurveyor({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Aluminum Tripod Legs */}
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((ang, i) => (
        <group key={i} rotation={[0, ang, 0]}>
          <mesh position={[0.25, 0.65, 0]} rotation={[0, 0, -0.32]} castShadow>
            <cylinderGeometry args={[0.02, 0.025, 1.4, 12]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}
      {/* Precision Instrument Body (Leica Orange) */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <boxGeometry args={[0.22, 0.32, 0.22]} />
        <meshStandardMaterial color="#EA580C" metalness={0.5} roughness={0.25} />
      </mesh>
      {/* Optical Telescope */}
      <mesh position={[0, 1.42, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.22, 16]} />
        <meshStandardMaterial color="#0F172A" metalness={0.9} />
      </mesh>
      {/* Green Laser Alignment Beam with Subtle Glow */}
      <mesh position={[0, 1.42, 4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 8, 8]} />
        <meshBasicMaterial color="#22C55E" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function HeavyScaffolding({ position, height, width }: { position: [number, number, number]; height: number; width: number }) {
  const tiers = Math.max(1, Math.floor(height / 2));
  
  return (
    <group position={position}>
      {/* Safety Netting */}
      <mesh position={[0, height / 2, 0.65]}>
        <planeGeometry args={[width + 0.4, height]} />
        <meshStandardMaterial color="#15803D" transparent opacity={0.35} side={THREE.DoubleSide} roughness={0.9} />
      </mesh>

      {/* Structural Framework & Planks */}
      {Array.from({ length: tiers }).map((_, t) => (
        <group key={t} position={[0, (t + 1) * 2, 0]}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[width, 0.08, 1.1]} />
            <meshStandardMaterial color="#92400E" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.8, 0.55]}>
            <cylinderGeometry args={[0.025, 0.025, width, 12]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Vertical Scaffold Legs */}
      {[-width / 2, -width / 4, 0, width / 4, width / 2].map((x, i) => (
        <group key={i} position={[x, height / 2, 0]}>
          <mesh position={[0, 0, 0.55]}>
            <cylinderGeometry args={[0.03, 0.03, height, 12]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, -0.55]}>
            <cylinderGeometry args={[0.03, 0.03, height, 12]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function LuxuryCar({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Sleek Metallic Body */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[3.2, 0.55, 1.6]} />
        <meshStandardMaterial color="#0284C7" metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[-0.1, 0.95, 0]} castShadow>
        <boxGeometry args={[2.0, 0.55, 1.45]} />
        <meshStandardMaterial color="#0284C7" metalness={0.95} roughness={0.15} />
      </mesh>
      {/* Tinted Panoramic Glass */}
      <mesh position={[-0.1, 0.98, 0]}>
        <boxGeometry args={[1.85, 0.48, 1.48]} />
        <meshStandardMaterial color="#0F172A" transparent opacity={0.8} roughness={0.05} metalness={0.95} />
      </mesh>
      {/* Alloy Wheels */}
      {[
        [-0.95, 0.35, 0.82],
        [0.95, 0.35, 0.82],
        [-0.95, 0.35, -0.82],
        [0.95, 0.35, -0.82],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.22, 24]} />
            <meshStandardMaterial color="#1E293B" roughness={0.9} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.23, 16]} />
            <meshStandardMaterial color="#F8FAFC" metalness={0.98} roughness={0.05} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ==========================================
// 3. ARCHITECTURAL 3D SCENE MODEL
// ==========================================
function BuildingScene({ stage, storey, buildingType = 'residential' }: ConstructionAnimation3DProps) {
  const sceneRef = useRef<THREE.Group>(null);

  // Realistic Proportions
  const width = buildingType === 'residential' ? 12 : 15;
  const depth = buildingType === 'residential' ? 10 : 13;
  const floorHeight = 3.6;

  const fullFloors = Math.floor(storey);
  const hasHalfFloor = storey % 1 !== 0;
  const totalHeight = (fullFloors + (hasHalfFloor ? 0.75 : 0)) * floorHeight;

  // Ultra-smooth architectural slow orbital presentation
  useFrame(() => {
    if (sceneRef.current) {
      sceneRef.current.rotation.y += 0.0006;
    }
  });

  return (
    <group ref={sceneRef}>
      {/* High-End Architectural Ground Mirror & Landscape Bed */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial color="#0B0F19" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Property Plot Perimeter with Grass / Earth Bed */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]} receiveShadow>
        <planeGeometry args={[width + 10, depth + 10]} />
        <meshStandardMaterial color={stage >= 12 ? "#15803D" : "#2E1A0E"} roughness={0.9} />
      </mesh>

      {/* ========================================================================= */}
      {/* STAGE 0: Planning, 3D Architectural Hologram, Blueprint Table */}
      {/* ========================================================================= */}
      {stage === 0 && (
        <group>
          {/* Modern Architectural Design Studio Desk */}
          <group position={[0, 0, 0]}>
            <mesh position={[0, 0.9, 0]} castShadow>
              <boxGeometry args={[4.2, 0.12, 2.8]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.15} metalness={0.1} />
            </mesh>
            <mesh position={[-1.8, 0.45, 0]} castShadow>
              <boxGeometry args={[0.18, 0.9, 2.4]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>
            <mesh position={[1.8, 0.45, 0]} castShadow>
              <boxGeometry args={[0.18, 0.9, 2.4]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>

            {/* Glowing Blueprint Plan */}
            <mesh position={[0, 0.97, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[3.8, 2.4]} />
              <meshStandardMaterial color="#0284C7" roughness={0.2} emissive="#0284C7" emissiveIntensity={0.4} />
            </mesh>
          </group>

          {/* 3D Holographic Projected Model with Float Animation */}
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
            <group position={[0, totalHeight / 2 + 1.2, 0]}>
              <mesh>
                <boxGeometry args={[width * 0.75, totalHeight * 0.75, depth * 0.75]} />
                <meshStandardMaterial 
                  color="#38BDF8" 
                  wireframe 
                  transparent 
                  opacity={0.5} 
                  emissive="#38BDF8" 
                  emissiveIntensity={0.8} 
                />
              </mesh>
              <pointLight position={[0, 0, 0]} color="#38BDF8" intensity={3} distance={15} />
            </group>
          </Float>

          {/* Architects with Digital Tablets */}
          <ModernWorker position={[-2.6, 0, 0.4]} role="engineer" rotationY={0.8} />
          <ModernWorker position={[2.6, 0, -0.4]} role="engineer" rotationY={-2.2} />
          <TotalStationSurveyor position={[5, 0, -3]} />
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 1: Site Survey, Total Station, Centerlines & Soil Boring */}
      {/* ========================================================================= */}
      {stage === 1 && (
        <group>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <planeGeometry args={[width + 2, depth + 2]} />
            <meshBasicMaterial color="#FEF08A" wireframe />
          </mesh>

          {/* Red Cadastral Steel Pegs */}
          {[
            [-(width + 2) / 2, -(depth + 2) / 2],
            [(width + 2) / 2, -(depth + 2) / 2],
            [-(width + 2) / 2, (depth + 2) / 2],
            [(width + 2) / 2, (depth + 2) / 2],
          ].map(([px, pz], i) => (
            <group key={i} position={[px, 0.45, pz]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.035, 0.035, 1.0, 12]} />
                <meshStandardMaterial color="#EF4444" metalness={0.7} />
              </mesh>
            </group>
          ))}

          {/* Soil Boring Rig Machine */}
          <group position={[width / 3, 0, -depth / 3]}>
            <mesh position={[0, 1.8, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.15, 3.6, 12]} />
              <meshStandardMaterial color="#EAB308" metalness={0.7} />
            </mesh>
            <mesh position={[0, 0.4, 0]}>
              <boxGeometry args={[1.4, 0.8, 1.4]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>
          </group>

          <TotalStationSurveyor position={[-width / 2 - 2, 0, -depth / 2 - 1]} />
          <ModernWorker position={[-width / 2 - 1, 0, -depth / 2 - 1.8]} role="surveyor" rotationY={0.6} />
          <ModernWorker position={[0, 0, 0]} role="surveyor" rotationY={-1.5} />
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 2: Excavation, Caterpillar JCB Excavator & Dump Truck */}
      {/* ========================================================================= */}
      {stage >= 2 && (
        <group>
          {/* Stepped Excavation Trench Pit */}
          <mesh position={[0, -0.7, 0]} receiveShadow>
            <boxGeometry args={[width + 1.8, 1.4, depth + 1.8]} />
            <meshStandardMaterial color="#2E1A0E" roughness={1.0} />
          </mesh>

          {stage === 2 && (
            <>
              <HeavyExcavator position={[-width / 2 - 2, 0, 1.5]} rotationY={0.5} />
              <DumpTruck position={[width / 2 + 3.5, 0, -2]} rotationY={-2.4} />
              <ModernWorker position={[1, -0.7, 2]} role="mason" rotationY={0.4} />
              <ModernWorker position={[-2, -0.7, -1]} role="mason" rotationY={-1.8} />
            </>
          )}
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 3: PCC Bed & Rebar Footing Pads */}
      {/* ========================================================================= */}
      {stage >= 3 && (
        <group>
          <mesh position={[0, -0.15, 0]} receiveShadow>
            <boxGeometry args={[width + 0.6, 0.3, depth + 0.6]} />
            <meshStandardMaterial color="#64748B" roughness={0.7} />
          </mesh>

          {[-width / 3, 0, width / 3].map((x) =>
            [-depth / 3, depth / 3].map((z) => (
              <group key={`footing-${x}-${z}`} position={[x, 0.2, z]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[2.0, 0.4, 2.0]} />
                  <meshStandardMaterial color="#475569" roughness={0.6} />
                </mesh>
                <mesh position={[0, 0.35, 0]} castShadow>
                  <cylinderGeometry args={[0.5, 0.9, 0.4, 4]} rotation={[0, Math.PI / 4, 0]} />
                  <meshStandardMaterial color="#475569" roughness={0.6} />
                </mesh>

                {stage === 3 && (
                  <group position={[0, 0.9, 0]}>
                    <mesh>
                      <boxGeometry args={[0.45, 1.4, 0.45]} />
                      <meshStandardMaterial color="#1E293B" metalness={0.95} wireframe />
                    </mesh>
                  </group>
                )}
              </group>
            ))
          )}

          {stage === 3 && (
            <>
              <ConcreteMixerTruck position={[-width / 2 - 3.5, 0, -3]} rotationY={0.8} />
              <ModernWorker position={[1, 0, 1.5]} role="mason" rotationY={1.2} />
              <ModernWorker position={[-width / 3, 0, depth / 3 + 1.2]} role="engineer" rotationY={-0.6} />
            </>
          )}
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 4: Plinth Tie Beams & DPC */}
      {/* ========================================================================= */}
      {stage >= 4 && (
        <group position={[0, 0.45, 0]}>
          <mesh position={[0, 0, -depth / 2]} castShadow>
            <boxGeometry args={[width, 0.65, 0.45]} />
            <meshStandardMaterial color="#64748B" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, depth / 2]} castShadow>
            <boxGeometry args={[width, 0.65, 0.45]} />
            <meshStandardMaterial color="#64748B" roughness={0.5} />
          </mesh>
          <mesh position={[-width / 2, 0, 0]} castShadow>
            <boxGeometry args={[0.45, 0.65, depth]} />
            <meshStandardMaterial color="#64748B" roughness={0.5} />
          </mesh>
          <mesh position={[width / 2, 0, 0]} castShadow>
            <boxGeometry args={[0.45, 0.65, depth]} />
            <meshStandardMaterial color="#64748B" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[width, 0.65, 0.45]} />
            <meshStandardMaterial color="#64748B" roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.05, 0]} receiveShadow>
            <boxGeometry args={[width - 0.4, 0.55, depth - 0.4]} />
            <meshStandardMaterial color="#94A3B8" roughness={0.9} />
          </mesh>

          {stage === 4 && (
            <>
              <ModernWorker position={[2, 0.45, 0]} role="mason" rotationY={-1.5} />
              <ModernWorker position={[-2, 0.45, 1.5]} role="engineer" rotationY={0.8} />
            </>
          )}
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 5: RCC Columns / Pillars */}
      {/* ========================================================================= */}
      {stage >= 5 && (
        <group position={[0, 0.75, 0]}>
          {Array.from({ length: fullFloors }).map((_, fIdx) => {
            const fBaseY = fIdx * floorHeight;
            return (
              <group key={`col-floor-${fIdx}`}>
                {[-width / 3, 0, width / 3].map((x) =>
                  [-depth / 3, depth / 3].map((z) => (
                    <mesh key={`col-${fIdx}-${x}-${z}`} position={[x, fBaseY + floorHeight / 2, z]} castShadow>
                      <boxGeometry args={[0.55, floorHeight, 0.55]} />
                      <meshStandardMaterial color="#64748B" roughness={0.4} />
                    </mesh>
                  ))
                )}
              </group>
            );
          })}

          {hasHalfFloor && (
            <group position={[0, fullFloors * floorHeight, 0]}>
              {[-width / 4, width / 4].map((x) =>
                [-depth / 4, depth / 4].map((z) => (
                  <mesh key={`half-col-${x}-${z}`} position={[x, floorHeight * 0.45, z]} castShadow>
                    <boxGeometry args={[0.5, floorHeight * 0.9, 0.5]} />
                    <meshStandardMaterial color="#64748B" roughness={0.4} />
                  </mesh>
                ))
              )}
            </group>
          )}

          {stage === 5 && (
            <>
              <HeavyScaffolding position={[-width / 2 - 1, 0, 0]} height={totalHeight} width={6} />
              <HeavyScaffolding position={[width / 2 + 1, 0, 0]} height={totalHeight} width={6} />
              <ModernWorker position={[-1.5, fullFloors > 1 ? floorHeight : 0.75, 1]} role="mason" rotationY={1.2} />
              <ConcreteMixerTruck position={[-width / 2 - 4, 0, -2]} rotationY={0.5} />
            </>
          )}
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 6: RCC Slabs & Beams */}
      {/* ========================================================================= */}
      {stage >= 6 && (
        <group position={[0, 0.75, 0]}>
          {Array.from({ length: fullFloors }).map((_, fIdx) => (
            <group key={`slab-${fIdx}`} position={[0, (fIdx + 1) * floorHeight, 0]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[width + 0.4, 0.35, depth + 1.4]} />
                <meshStandardMaterial color="#475569" roughness={0.5} />
              </mesh>
            </group>
          ))}

          {hasHalfFloor && (
            <mesh position={[0, fullFloors * floorHeight + floorHeight * 0.9, 0]} castShadow>
              <boxGeometry args={[width * 0.65, 0.3, depth * 0.65]} />
              <meshStandardMaterial color="#475569" roughness={0.5} />
            </mesh>
          )}

          {stage === 6 && (
            <>
              <HeavyScaffolding position={[0, 0, depth / 2 + 1.4]} height={totalHeight} width={width} />
              <ModernWorker position={[0, floorHeight + 0.3, 0]} role="mason" rotationY={0.8} />
            </>
          )}
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 7: Brickwork & Walls */}
      {/* ========================================================================= */}
      {stage >= 7 && (
        <group position={[0, 0.75, 0]}>
          {Array.from({ length: fullFloors }).map((_, fIdx) => {
            const isFinishedPlaster = stage >= 9;
            const wallColor = isFinishedPlaster ? "#F8FAFC" : "#C2410C";

            return (
              <group key={`brick-floor-${fIdx}`} position={[0, fIdx * floorHeight, 0]}>
                <mesh position={[0, floorHeight / 2, -depth / 2 + 0.18]} castShadow receiveShadow>
                  <boxGeometry args={[width - 0.4, floorHeight - 0.35, 0.35]} />
                  <meshStandardMaterial color={wallColor} roughness={isFinishedPlaster ? 0.25 : 0.9} />
                </mesh>
                <mesh position={[-width / 2 + 0.18, floorHeight / 2, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.35, floorHeight - 0.35, depth - 0.4]} />
                  <meshStandardMaterial color={wallColor} roughness={isFinishedPlaster ? 0.25 : 0.9} />
                </mesh>
                <mesh position={[width / 2 - 0.18, floorHeight / 2, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.35, floorHeight - 0.35, depth - 0.4]} />
                  <meshStandardMaterial color={wallColor} roughness={isFinishedPlaster ? 0.25 : 0.9} />
                </mesh>
                <mesh position={[-width / 3, floorHeight / 2, depth / 2 - 0.18]} castShadow receiveShadow>
                  <boxGeometry args={[width / 3.2, floorHeight - 0.35, 0.35]} />
                  <meshStandardMaterial color={wallColor} roughness={isFinishedPlaster ? 0.25 : 0.9} />
                </mesh>
                <mesh position={[width / 3, floorHeight / 2, depth / 2 - 0.18]} castShadow receiveShadow>
                  <boxGeometry args={[width / 3.2, floorHeight - 0.35, 0.35]} />
                  <meshStandardMaterial color={wallColor} roughness={isFinishedPlaster ? 0.25 : 0.9} />
                </mesh>
              </group>
            );
          })}

          {hasHalfFloor && (
            <group position={[0, fullFloors * floorHeight, 0]}>
              <mesh position={[0, floorHeight * 0.45, 0]} castShadow receiveShadow>
                <boxGeometry args={[width * 0.6, floorHeight * 0.85, depth * 0.6]} />
                <meshStandardMaterial color={stage >= 9 ? "#F8FAFC" : "#C2410C"} roughness={0.7} />
              </mesh>
            </group>
          )}

          {stage === 7 && (
            <>
              <ModernWorker position={[-width / 3, 0.75, depth / 2 + 0.8]} role="mason" rotationY={0.4} />
              <ModernWorker position={[width / 3, 0.75, depth / 2 + 0.8]} role="mason" rotationY={-0.8} />
            </>
          )}
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 8: Concealed MEP Plumbing & Electrical */}
      {/* ========================================================================= */}
      {stage === 8 && (
        <group position={[0, 0.75, 0]}>
          {Array.from({ length: fullFloors }).map((_, fIdx) => (
            <group key={`mep-${fIdx}`} position={[0, fIdx * floorHeight, 0]}>
              <mesh position={[-width / 2 - 0.22, floorHeight / 2, -depth / 4]}>
                <cylinderGeometry args={[0.07, 0.07, floorHeight, 12]} />
                <meshStandardMaterial color="#0284C7" metalness={0.7} />
              </mesh>
              <mesh position={[-width / 2 - 0.22, floorHeight / 2, -depth / 4 + 0.3]}>
                <cylinderGeometry args={[0.07, 0.07, floorHeight, 12]} />
                <meshStandardMaterial color="#EF4444" metalness={0.7} />
              </mesh>
              <mesh position={[width / 2 + 0.22, floorHeight / 2, depth / 4]}>
                <cylinderGeometry args={[0.05, 0.05, floorHeight, 12]} />
                <meshStandardMaterial color="#EAB308" metalness={0.6} />
              </mesh>
              <mesh position={[-width / 2 - 0.22, floorHeight / 2, depth / 3]}>
                <cylinderGeometry args={[0.12, 0.12, floorHeight, 12]} />
                <meshStandardMaterial color="#64748B" />
              </mesh>
            </group>
          ))}
          <ModernWorker position={[-2, 0.75, depth / 2 + 0.5]} role="engineer" rotationY={1.2} />
          <ModernWorker position={[2, 0.75, -depth / 2 - 0.5]} role="mason" rotationY={-0.8} />
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 9: Plastering with Scaffolding */}
      {/* ========================================================================= */}
      {stage === 9 && (
        <group position={[0, 0.75, 0]}>
          <HeavyScaffolding position={[-width / 2 - 1.2, 0, 0]} height={totalHeight} width={depth} />
          <HeavyScaffolding position={[width / 2 + 1.2, 0, 0]} height={totalHeight} width={depth} />
          <ModernWorker position={[-width / 2 - 1.2, totalHeight * 0.4, 0]} role="mason" rotationY={1.5} />
          <ModernWorker position={[width / 2 + 1.2, 1.2, 0]} role="mason" rotationY={-1.5} />
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 10: Teakwood Doors & Double Glazed Windows */}
      {/* ========================================================================= */}
      {stage >= 10 && (
        <group position={[0, 0.75, 0]}>
          {/* Teakwood Entrance Door */}
          <group position={[0, 1.35, depth / 2 + 0.05]}>
            <mesh castShadow>
              <boxGeometry args={[1.6, 2.7, 0.14]} />
              <meshStandardMaterial color="#78350F" roughness={0.25} metalness={0.1} />
            </mesh>
            <mesh position={[0.6, 0, 0.1]}>
              <cylinderGeometry args={[0.02, 0.02, 0.6, 12]} />
              <meshStandardMaterial color="#F59E0B" metalness={0.95} roughness={0.05} />
            </mesh>
          </group>

          {/* UPVC Double-Glazed Soundproof Windows */}
          {Array.from({ length: fullFloors }).map((_, fIdx) => (
            <group key={`windows-${fIdx}`} position={[0, fIdx * floorHeight, 0]}>
              <group position={[-width / 3.2, floorHeight / 2, depth / 2 + 0.05]}>
                <mesh>
                  <boxGeometry args={[1.9, 1.9, 0.08]} />
                  <meshStandardMaterial color="#38BDF8" transparent opacity={0.65} roughness={0.05} metalness={0.95} />
                </mesh>
                <mesh>
                  <boxGeometry args={[2.0, 2.0, 0.05]} />
                  <meshStandardMaterial color="#0F172A" metalness={0.9} />
                </mesh>
              </group>
              <group position={[width / 3.2, floorHeight / 2, depth / 2 + 0.05]}>
                <mesh>
                  <boxGeometry args={[1.9, 1.9, 0.08]} />
                  <meshStandardMaterial color="#38BDF8" transparent opacity={0.65} roughness={0.05} metalness={0.95} />
                </mesh>
                <mesh>
                  <boxGeometry args={[2.0, 2.0, 0.05]} />
                  <meshStandardMaterial color="#0F172A" metalness={0.9} />
                </mesh>
              </group>
            </group>
          ))}
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 11: Cedar Wood Architectural Slats & SS Glass Balconies */}
      {/* ========================================================================= */}
      {stage >= 11 && (
        <group position={[0, 0.75, 0]}>
          {/* Vertical Warm Cedar Slats */}
          {Array.from({ length: fullFloors }).map((_, fIdx) => (
            <group key={`slats-${fIdx}`} position={[-width / 2 + 0.8, fIdx * floorHeight + floorHeight / 2, depth / 2 + 0.15]}>
              {[-0.4, -0.2, 0, 0.2, 0.4].map((sx, sIdx) => (
                <mesh key={sIdx} position={[sx, 0, 0]} castShadow>
                  <boxGeometry args={[0.08, floorHeight - 0.4, 0.15]} />
                  <meshStandardMaterial color="#B45309" roughness={0.3} />
                </mesh>
              ))}
            </group>
          ))}

          {/* Stainless Steel Frameless Balcony Railings */}
          {Array.from({ length: fullFloors }).map((_, fIdx) => {
            if (fIdx === 0 && fullFloors === 1 && !hasHalfFloor) return null;
            return (
              <group key={`balcony-${fIdx}`} position={[0, (fIdx + 1) * floorHeight + 0.55, depth / 2 + 0.7]}>
                <mesh>
                  <boxGeometry args={[width * 0.8, 0.95, 0.04]} />
                  <meshStandardMaterial color="#0284C7" transparent opacity={0.55} roughness={0.05} metalness={0.8} />
                </mesh>
                <mesh position={[0, 0.48, 0]}>
                  <cylinderGeometry args={[0.035, 0.035, width * 0.8, 12]} rotation={[0, 0, Math.PI / 2]} />
                  <meshStandardMaterial color="#F8FAFC" metalness={0.95} roughness={0.05} />
                </mesh>
              </group>
            );
          })}

          {/* Parapet Wall */}
          <group position={[0, fullFloors * floorHeight + 0.5, 0]}>
            <mesh position={[0, 0, -depth / 2]} castShadow>
              <boxGeometry args={[width, 1.0, 0.25]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.25} />
            </mesh>
            <mesh position={[-width / 2, 0, 0]} castShadow>
              <boxGeometry args={[0.25, 1.0, depth]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.25} />
            </mesh>
            <mesh position={[width / 2, 0, 0]} castShadow>
              <boxGeometry args={[0.25, 1.0, depth]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.25} />
            </mesh>
          </group>
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 12: Rooftop Solar PV, Pergola, Compound Gate & Griha Pravesh */}
      {/* ========================================================================= */}
      {stage >= 12 && (
        <group>
          {/* Water Tank */}
          <group position={[-width / 3.5, totalHeight + 1.4, -depth / 3]}>
            <mesh position={[0, 0.65, 0]} castShadow>
              <cylinderGeometry args={[0.65, 0.65, 1.3, 24]} />
              <meshStandardMaterial color="#0F172A" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[1.6, 0.3, 1.6]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
          </group>

          {/* Solar Water Heater */}
          <group position={[width / 4, totalHeight + 1.2, -depth / 3]} rotation={[-Math.PI / 6, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[3.4, 0.1, 2.2]} />
              <meshStandardMaterial color="#1E3A8A" metalness={0.95} roughness={0.1} />
            </mesh>
            <mesh position={[0, 1.1, -0.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.22, 0.22, 3.4, 20]} />
              <meshStandardMaterial color="#F8FAFC" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>

          {/* Rooftop Timber Pergola */}
          <group position={[0, totalHeight + 0.8, depth / 4]}>
            {[-1.8, 1.8].map((px, i) => (
              <mesh key={i} position={[px, 1.2, 0]} castShadow>
                <boxGeometry args={[0.18, 2.4, 0.18]} />
                <meshStandardMaterial color="#78350F" roughness={0.35} />
              </mesh>
            ))}
            {[-0.8, -0.4, 0, 0.4, 0.8].map((rz, j) => (
              <mesh key={j} position={[0, 2.4, rz]} castShadow>
                <boxGeometry args={[4.2, 0.14, 0.14]} />
                <meshStandardMaterial color="#78350F" roughness={0.35} />
              </mesh>
            ))}
          </group>

          {/* Perimeter Compound Wall */}
          <group position={[0, 0.6, 0]}>
            <mesh position={[0, 0, -depth / 2 - 3]} castShadow receiveShadow>
              <boxGeometry args={[width + 6, 1.3, 0.25]} />
              <meshStandardMaterial color="#F1F5F9" roughness={0.3} />
            </mesh>
            <mesh position={[-width / 2 - 3, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.25, 1.3, depth + 6]} />
              <meshStandardMaterial color="#F1F5F9" roughness={0.3} />
            </mesh>
            <mesh position={[width / 2 + 3, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.25, 1.3, depth + 6]} />
              <meshStandardMaterial color="#F1F5F9" roughness={0.3} />
            </mesh>
            <mesh position={[-width / 3, 0, depth / 2 + 3]} castShadow receiveShadow>
              <boxGeometry args={[width / 2, 1.3, 0.25]} />
              <meshStandardMaterial color="#F1F5F9" roughness={0.3} />
            </mesh>
            <mesh position={[width / 4, 0, depth / 2 + 3]} castShadow>
              <boxGeometry args={[3.4, 1.5, 0.08]} />
              <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>

          {/* Paver Driveway */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[width / 4, 0.01, depth / 2 + 1.5]} receiveShadow>
            <planeGeometry args={[3.6, 3.8]} />
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </mesh>

          {/* Parked Luxury SUV */}
          <LuxuryCar position={[width / 4, 0.05, depth / 2 + 1.4]} rotationY={0} />

          {/* Ornamental Green Trees */}
          {[
            [-width / 2 - 1.8, 0, depth / 2 + 1.8],
            [width / 2 + 1.8, 0, -depth / 2 - 1.8],
            [-width / 2 - 1.8, 0, -depth / 2 - 1.8],
          ].map(([tx, ty, tz], i) => (
            <group key={`tree-${i}`} position={[tx, ty, tz]}>
              <mesh position={[0, 1.4, 0]} castShadow>
                <cylinderGeometry args={[0.18, 0.26, 2.8, 12]} />
                <meshStandardMaterial color="#78350F" roughness={0.9} />
              </mesh>
              <mesh position={[0, 3.2, 0]} castShadow>
                <sphereGeometry args={[1.4, 20, 20]} />
                <meshStandardMaterial color="#15803D" roughness={0.6} />
              </mesh>
            </group>
          ))}

          {/* Celebratory Sparkle Particles for Griha Pravesh Handover */}
          <Sparkles count={40} scale={[width + 4, totalHeight + 4, depth + 4]} size={4} speed={0.4} color="#FBBF24" />

          {/* Homeowners celebrating Handover */}
          <ModernWorker position={[0, 0.75, depth / 2 + 1.6]} role="engineer" rotationY={-0.2} />
          <ModernWorker position={[0.9, 0.75, depth / 2 + 1.6]} role="surveyor" rotationY={0.3} />
        </group>
      )}
    </group>
  );
}

// ==========================================
// 4. MAIN EXPORTED COMPONENT WITH ADVANCED CAMERA HUD
// ==========================================
export default function ConstructionAnimation3D({ stage, storey = 2.5, buildingType = 'residential' }: ConstructionAnimation3DProps) {
  const [lighting, setLighting] = useState<LightingMode>("daylight");
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // Dynamic Lighting Configurations
  const lightingConfigs = {
    daylight: {
      sunColor: "#FFFDF5",
      sunIntensity: 1.8,
      sunPos: [26, 42, 22] as [number, number, number],
      ambientIntensity: 0.7,
      skyColor: "#BAE6FD",
      groundColor: "#0F172A",
      bgGradient: "from-sky-950/90 via-slate-950 to-slate-900",
    },
    sunset: {
      sunColor: "#F97316",
      sunIntensity: 2.2,
      sunPos: [38, 14, 18] as [number, number, number],
      ambientIntensity: 0.5,
      skyColor: "#FED7AA",
      groundColor: "#451A03",
      bgGradient: "from-amber-950/90 via-slate-950 to-purple-950",
    },
    night: {
      sunColor: "#60A5FA",
      sunIntensity: 0.7,
      sunPos: [20, 30, 20] as [number, number, number],
      ambientIntensity: 0.25,
      skyColor: "#1E3A8A",
      groundColor: "#020617",
      bgGradient: "from-slate-950 via-blue-950 to-slate-950",
    },
  };

  const currentLight = lightingConfigs[lighting];

  return (
    <div className={`w-full h-[520px] md:h-[620px] rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl bg-gradient-to-b ${currentLight.bgGradient} transition-colors duration-700`}>
      <Canvas shadows camera={{ position: [24, 18, 24], fov: 36 }}>
        <PerspectiveCamera makeDefault position={[24, 18, 24]} fov={36} />
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          autoRotate={autoRotate}
          autoRotateSpeed={0.8}
          minDistance={10}
          maxDistance={70}
          maxPolarAngle={Math.PI / 2 - 0.03}
          target={[0, storey * 1.6, 0]}
        />
        
        {/* Ambient & Atmosphere Lights */}
        <ambientLight intensity={currentLight.ambientIntensity} />
        <hemisphereLight 
          intensity={0.5} 
          color={currentLight.skyColor} 
          groundColor={currentLight.groundColor} 
        />
        
        {/* Primary Sun Light with High-Resolution Soft Shadows */}
        <directionalLight 
          position={currentLight.sunPos} 
          intensity={currentLight.sunIntensity} 
          color={currentLight.sunColor}
          castShadow 
          shadow-mapSize-width={2048} 
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={120}
          shadow-camera-left={-28}
          shadow-camera-right={28}
          shadow-camera-top={28}
          shadow-camera-bottom={-28}
          shadow-bias={-0.0002}
        />

        {/* Soft Ambient Rim Light */}
        <pointLight position={[-20, 25, -20]} intensity={0.4} color="#38BDF8" />
        
        {/* Night Site Work Floodlights */}
        {lighting === "night" && (
          <>
            <spotLight position={[0, 20, 15]} intensity={5.0} color="#FEF08A" distance={40} angle={0.65} penumbra={0.8} castShadow />
            <pointLight position={[0, storey * 3.6, 0]} intensity={2.5} color="#FEF08A" distance={25} />
          </>
        )}

        {/* Ground Contact Shadows */}
        <ContactShadows 
          position={[0, -0.04, 0]} 
          opacity={0.75} 
          scale={55} 
          blur={2.2} 
          far={12} 
          resolution={1024} 
          color="#000000" 
        />

        {/* 3D Scene Model */}
        <BuildingScene stage={stage} storey={storey} buildingType={buildingType} />
      </Canvas>

      {/* Floating HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        {/* Active Stage & Storey Badge */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 text-xs text-white shadow-2xl">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-time Simulation: <strong className="text-primary">{storey} Storey Building</strong></span>
        </div>

        {/* Lighting & Camera Toggles */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-full border border-white/15 shadow-2xl">
          <button
            onClick={() => setLighting("daylight")}
            title="Daylight Lighting"
            className={`p-2 rounded-full transition-all ${
              lighting === "daylight" 
                ? "bg-amber-400 text-slate-950 font-bold shadow-md scale-105" 
                : "text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <Sun className="w-4 h-4" />
          </button>

          <button
            onClick={() => setLighting("sunset")}
            title="Golden Hour Sunset"
            className={`p-2 rounded-full transition-all ${
              lighting === "sunset" 
                ? "bg-orange-500 text-white font-bold shadow-md scale-105" 
                : "text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <Sunset className="w-4 h-4" />
          </button>

          <button
            onClick={() => setLighting("night")}
            title="Night Site Work"
            className={`p-2 rounded-full transition-all ${
              lighting === "night" 
                ? "bg-blue-600 text-white font-bold shadow-md scale-105" 
                : "text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <Moon className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-white/20 mx-1" />

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? "Pause 360° Auto-Orbit" : "Enable 360° Auto-Orbit"}
            className={`p-2 rounded-full transition-all ${
              autoRotate 
                ? "bg-primary text-primary-foreground font-bold" 
                : "text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <RotateCw className={`w-4 h-4 ${autoRotate ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Bottom Controls Info Guide */}
      <div className="absolute bottom-4 right-4 pointer-events-none text-[11px] text-slate-300 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 shadow-lg">
        <Eye className="w-3.5 h-3.5 text-primary" />
        <span>Left Click: Rotate • Scroll: Zoom • Right Click: Pan</span>
      </div>
    </div>
  );
}
