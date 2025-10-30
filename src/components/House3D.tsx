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
  
  // Calculate dimensions based on area
  const width = Math.sqrt(area / floors) * 0.05;
  const depth = width;
  const floorHeight = 2;
  const totalHeight = floors * floorHeight;

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Base/Foundation */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[width + 0.5, 0.3, depth + 0.5]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Building floors */}
      {Array.from({ length: floors }).map((_, index) => (
        <group key={index} position={[0, index * floorHeight, 0]}>
          {/* Floor structure */}
          <mesh position={[0, floorHeight / 2, 0]}>
            <boxGeometry args={[width, floorHeight, depth]} />
            <meshStandardMaterial 
              color="#2a2a2a" 
              metalness={0.3} 
              roughness={0.7}
              emissive="#8B0000"
              emissiveIntensity={0.1}
            />
          </mesh>

          {/* Windows - front */}
          {[...Array(Math.max(1, Math.floor(width / 1.5)))].map((_, i) => (
            <mesh 
              key={`front-${i}`} 
              position={[
                -width/2 + (i + 1) * (width / (Math.floor(width / 1.5) + 1)), 
                floorHeight / 2, 
                depth/2 + 0.05
              ]}
            >
              <boxGeometry args={[0.6, 1, 0.1]} />
              <meshStandardMaterial 
                color="#87CEEB" 
                metalness={0.9} 
                roughness={0.1}
                emissive="#4682B4"
                emissiveIntensity={0.3}
              />
            </mesh>
          ))}

          {/* Windows - sides */}
          {[...Array(Math.max(1, Math.floor(depth / 1.5)))].map((_, i) => (
            <mesh 
              key={`side-${i}`} 
              position={[
                width/2 + 0.05,
                floorHeight / 2, 
                -depth/2 + (i + 1) * (depth / (Math.floor(depth / 1.5) + 1))
              ]}
            >
              <boxGeometry args={[0.1, 1, 0.6]} />
              <meshStandardMaterial 
                color="#87CEEB" 
                metalness={0.9} 
                roughness={0.1}
                emissive="#4682B4"
                emissiveIntensity={0.3}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Roof */}
      <mesh position={[0, totalHeight + 0.5, 0]}>
        <coneGeometry args={[width * 0.8, 1.5, 4]} />
        <meshStandardMaterial 
          color="#8B0000" 
          metalness={0.4} 
          roughness={0.6}
          emissive="#8B0000"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          metalness={0.2} 
          roughness={0.8}
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
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-10, 10, -5]} intensity={0.5} color="#8B0000" />
        <pointLight position={[0, 10, 0]} intensity={0.8} color="#ff4444" />
        
        <HouseModel area={area} floors={floors} />
      </Canvas>
    </div>
  );
}
