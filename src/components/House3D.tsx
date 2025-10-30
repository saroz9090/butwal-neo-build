import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

interface House3DProps {
  area: number;
  floors: number;
}

function HouseModel({ area, floors }: House3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Calculate dimensions based on area (area is total, divided by floors)
  // Using more realistic proportions for Nepal construction
  const width = Math.sqrt(area / floors) * 0.08; // Increased from 0.05 for thicker appearance
  const depth = width * 0.85; // Slightly adjusted ratio
  const floorHeight = 2.5; // Increased floor height
  const totalHeight = floors * floorHeight;
  const wallThickness = 0.3; // Thicker walls for more realistic look

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Foundation - Concrete base */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[width + 0.6, 0.6, depth + 0.6]} />
        <meshStandardMaterial color="#8B7355" roughness={0.9} />
      </mesh>

      {/* Building floors */}
      {Array.from({ length: floors }).map((_, index) => (
        <group key={index} position={[0, index * floorHeight, 0]}>
          {/* Main structure - walls */}
          <mesh position={[0, floorHeight / 2, 0]}>
            <boxGeometry args={[width, floorHeight, depth]} />
            <meshStandardMaterial 
              color="#D4C4B0" 
              roughness={0.8}
            />
          </mesh>

      {/* Floor slab */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[width, 0.25, depth]} />
            <meshStandardMaterial color="#8B7355" roughness={0.7} />
          </mesh>

          {/* Windows - front */}
          {[...Array(Math.max(2, Math.floor(width / 1.2)))].map((_, i) => (
            <mesh 
              key={`front-${i}`} 
              position={[
                -width/2 + (i + 1) * (width / (Math.floor(width / 1.2) + 1)), 
                floorHeight / 2 + 0.2, 
                depth/2 + 0.02
              ]}
            >
              <boxGeometry args={[0.5, 1.2, 0.05]} />
              <meshStandardMaterial 
                color="#87CEEB" 
                metalness={0.6} 
                roughness={0.1}
                transparent
                opacity={0.7}
              />
            </mesh>
          ))}

          {/* Windows - back */}
          {[...Array(Math.max(2, Math.floor(width / 1.2)))].map((_, i) => (
            <mesh 
              key={`back-${i}`} 
              position={[
                -width/2 + (i + 1) * (width / (Math.floor(width / 1.2) + 1)), 
                floorHeight / 2 + 0.2, 
                -depth/2 - 0.02
              ]}
            >
              <boxGeometry args={[0.5, 1.2, 0.05]} />
              <meshStandardMaterial 
                color="#87CEEB" 
                metalness={0.6} 
                roughness={0.1}
                transparent
                opacity={0.7}
              />
            </mesh>
          ))}

          {/* Columns/Pillars at corners */}
          {[[width/2, depth/2], [-width/2, depth/2], [width/2, -depth/2], [-width/2, -depth/2]].map((pos, i) => (
            <mesh key={`pillar-${i}`} position={[pos[0], floorHeight / 2, pos[1]]}>
              <boxGeometry args={[0.35, floorHeight, 0.35]} />
              <meshStandardMaterial color="#5A4A3A" roughness={0.8} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Roof structure */}
      <mesh position={[0, totalHeight + 0.15, 0]}>
        <boxGeometry args={[width + 0.2, 0.2, depth + 0.2]} />
        <meshStandardMaterial color="#8B4513" roughness={0.7} />
      </mesh>

      {/* Roof top - slanted */}
      <mesh position={[0, totalHeight + 0.7, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[width * 0.75, 1.2, 4]} />
        <meshStandardMaterial 
          color="#A0522D" 
          roughness={0.6}
        />
      </mesh>

      {/* Ground plane - grass/earth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.41, 0]}>
        <planeGeometry args={[25, 25]} />
        <meshStandardMaterial 
          color="#4A5D3F" 
          roughness={1}
        />
      </mesh>
    </group>
  );
}

export default function House3D({ area, floors }: House3DProps) {
  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden glass">
      <Canvas>
        <PerspectiveCamera makeDefault position={[10, 8, 10]} />
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minDistance={8}
          maxDistance={20}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 15, 10]} intensity={1.2} color="#FFF8E7" castShadow />
        <directionalLight position={[-5, 10, -5]} intensity={0.4} color="#B0C4DE" />
        <pointLight position={[0, 15, 0]} intensity={0.5} color="#FFE4B5" />
        
        <HouseModel area={area} floors={floors} />
      </Canvas>
    </div>
  );
}
