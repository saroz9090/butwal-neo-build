import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

interface House3DProps {
  area: number;
  floors: number;
  materialType?: string;
}

function HouseModel({ area, floors, materialType = "standard" }: House3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Much larger scaling for proper size - 1000 sq ft should look substantial
  const baseScale = 0.25; // Increased from 0.15
  const width = Math.sqrt(area) * baseScale;
  const depth = width * 0.8;
  const floorHeight = 4; // Taller floors
  const totalHeight = floors * floorHeight;

  // Much larger ground to accommodate big house
  const groundSize = Math.max(60, width * 4);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  // Better car model
  const Car = ({ position, color }: { position: [number, number, number], color: string }) => (
    <group position={position}>
      {/* Car body */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[2.5, 0.4, 1.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[2.2, 0.4, 1.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 1.0, 0.3]}>
        <boxGeometry args={[1.8, 0.3, 0.5]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} />
      </mesh>
      {/* Wheels */}
      {(
        [
          [-0.8, 0.2, 0.6] as [number, number, number],
          [0.8, 0.2, 0.6] as [number, number, number],
          [-0.8, 0.2, -0.6] as [number, number, number],
          [0.8, 0.2, -0.6] as [number, number, number]
        ]
      ).map((pos, i) => (
        <mesh key={`wheel-${i}`} position={pos} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.15, 12]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      ))}
    </group>
  );

  // Better motorcycle model
  const Motorcycle = ({ position, color }: { position: [number, number, number], color: string }) => (
    <group position={position}>
      {/* Main body */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.2, 0.15, 2.0]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      {/* Seat */}
      <mesh position={[0, 0.4, 0.3]}>
        <boxGeometry args={[0.4, 0.1, 0.6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Fuel tank */}
      <mesh position={[0, 0.5, -0.3]}>
        <boxGeometry args={[0.3, 0.25, 0.4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Handlebars */}
      <mesh position={[0, 0.6, 0.8]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      {/* Wheels */}
      {(
        [
          [0, 0.15, 0.8] as [number, number, number],
          [0, 0.15, -0.8] as [number, number, number]
        ]
      ).map((pos, i) => (
        <mesh key={`bike-wheel-${i}`} position={pos} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.08, 12]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      ))}
    </group>
  );

  // Material-based styling
  const getHouseColors = () => {
    switch(materialType) {
      case "premium":
        return {
          wall: "#FFF8F0",
          foundation: "#8B7355",
          roof: "#2C2C2C",
          door: "#654321",
          window: "#ADD8E6",
          balcony: "#999999",
          parapet: "#E5E5E5"
        };
      case "luxury":
        return {
          wall: "#FFFAF0",
          foundation: "#A0826D",
          roof: "#1A1A1A",
          door: "#3E2723",
          window: "#B0E0E6",
          balcony: "#BDBDBD",
          parapet: "#F5F5F5"
        };
      default: // standard
        return {
          wall: "#F8F8F8",
          foundation: "#7A6C5D",
          roof: "#2C2C2C",
          door: "#8B4513",
          window: "#87CEEB",
          balcony: "#666666",
          parapet: "#E8E8E8"
        };
    }
  };

  const colors = getHouseColors();
  const hasCompound = materialType === "premium" || materialType === "luxury";
  const hasPool = materialType === "luxury";

  return (
    <group ref={groupRef}>
      {/* Massive foundation for big house */}
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[width + 1.5, 0.8, depth + 1.5]} />
        <meshStandardMaterial color={colors.foundation} roughness={0.9} />
      </mesh>

      {/* Main house structure - much larger */}
      <group position={[0, 0.4, 0]}>
        {/* Building walls */}
        <mesh position={[0, totalHeight / 2, 0]}>
          <boxGeometry args={[width, totalHeight, depth]} />
          <meshStandardMaterial color={colors.wall} roughness={0.6} metalness={materialType === "luxury" ? 0.1 : 0} />
        </mesh>

        {/* Decorative pillars for premium & luxury */}
        {(materialType === "premium" || materialType === "luxury") && (
          <>
            {[-width/2 - 0.3, width/2 + 0.3].map((x, i) => (
              <mesh key={`pillar-${i}`} position={[x, totalHeight / 2, depth/2 + 0.3]}>
                <cylinderGeometry args={[0.25, 0.25, totalHeight, 12]} />
                <meshStandardMaterial color={colors.foundation} roughness={0.4} metalness={0.3} />
              </mesh>
            ))}
          </>
        )}

        {/* Floor separations */}
        {Array.from({ length: floors - 1 }).map((_, index) => (
          <mesh key={`floor-${index}`} position={[0, (index + 1) * floorHeight, 0]}>
            <boxGeometry args={[width + 0.2, 0.2, depth + 0.2]} />
            <meshStandardMaterial color="#CCCCCC" />
          </mesh>
        ))}

        {/* Large windows for big house */}
        {Array.from({ length: floors }).map((_, floorIndex) => {
          const windowCount = Math.max(3, Math.floor(width / 4));
          return (
            <group key={`floor-${floorIndex}`}>
              {/* Front windows */}
              {[...Array(windowCount)].map((_, i) => (
                <group key={`front-${i}`}>
                  <mesh 
                    position={[
                      -width/2 + (i + 1) * (width / (windowCount + 1)),
                      floorIndex * floorHeight + 2.0,
                      depth/2 + 0.02
                    ]}
                  >
                    <boxGeometry args={[1.8, 2.0, 0.05]} />
                    <meshStandardMaterial color={colors.window} transparent opacity={0.8} />
                  </mesh>
                  <mesh 
                    position={[
                      -width/2 + (i + 1) * (width / (windowCount + 1)),
                      floorIndex * floorHeight + 2.0,
                      depth/2 + 0.035
                    ]}
                  >
                    <boxGeometry args={[1.9, 2.1, 0.03]} />
                    <meshStandardMaterial color="#333333" />
                  </mesh>
                </group>
              ))}
            </group>
          );
        })}

        {/* Large main entrance */}
        <mesh position={[0, 2.0, depth/2 + 0.02]}>
          <boxGeometry args={[2.0, 3.0, 0.1]} />
          <meshStandardMaterial color={colors.door} roughness={0.8} />
        </mesh>

        {/* Big balconies for upper floors */}
        {Array.from({ length: floors - 1 }).map((_, index) => (
          <group key={`balcony-${index}`} position={[0, (index + 1) * floorHeight + 0.1, depth/2 + 0.5]}>
            <mesh>
              <boxGeometry args={[width * 0.8, 0.15, 1.0]} />
              <meshStandardMaterial color="#666666" />
            </mesh>
            <mesh position={[0, 0.8, -0.4]}>
              <boxGeometry args={[width * 0.8, 1.5, 0.08]} />
              <meshStandardMaterial color={colors.balcony} metalness={0.3} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Large roof */}
      <mesh position={[0, totalHeight + 0.2, 0]}>
        <boxGeometry args={[width + 0.8, 0.3, depth + 0.8]} />
        <meshStandardMaterial color={colors.roof} roughness={0.7} />
      </mesh>

      {/* Rooftop parapet */}
      <mesh position={[0, totalHeight + 0.5, 0]}>
        <boxGeometry args={[width + 1.0, 0.4, depth + 1.0]} />
        <meshStandardMaterial color={colors.parapet} />
      </mesh>

      {/* Large parking area positioned properly */}
      <group position={[width/2 + 6, 0, -depth/2]}>
        {/* Parking surface */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 8]} />
          <meshStandardMaterial color="#555555" roughness={0.8} />
        </mesh>

        {/* Parking lines */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[11.5, 7.5]} />
          <meshStandardMaterial color="#FFFFFF" transparent opacity={0.8} />
        </mesh>

        {/* Vehicles */}
        <Car position={[-2, 0, 0]} color="#FF4444" />
        <Car position={[2, 0, 2.5]} color="#3366CC" />
        <Motorcycle position={[3, 0, -2]} color="#FF3366" />
        <Motorcycle position={[-3, 0, -2]} color="#33CC33" />
      </group>

      {/* Very large ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <planeGeometry args={[groundSize, groundSize]} />
        <meshStandardMaterial color="#5A7D5A" roughness={1} />
      </mesh>

      {/* Compound wall for premium & luxury */}
      {hasCompound && (
        <>
          {/* Front compound wall with gate */}
          <group>
            {/* Left wall section */}
            <mesh position={[-groundSize/4, 1.5, depth + 8]}>
              <boxGeometry args={[groundSize/2.5, 3, 0.3]} />
              <meshStandardMaterial color={colors.foundation} roughness={0.7} />
            </mesh>
            {/* Right wall section */}
            <mesh position={[groundSize/4, 1.5, depth + 8]}>
              <boxGeometry args={[groundSize/2.5, 3, 0.3]} />
              <meshStandardMaterial color={colors.foundation} roughness={0.7} />
            </mesh>
            {/* Gate pillars */}
            {[-2.5, 2.5].map((x, i) => (
              <mesh key={`gate-pillar-${i}`} position={[x, 2, depth + 8]}>
                <boxGeometry args={[0.6, 4, 0.6]} />
                <meshStandardMaterial color={colors.foundation} roughness={0.5} />
              </mesh>
            ))}
          </group>
          {/* Side walls */}
          <mesh position={[-groundSize/3, 1.5, 0]}>
            <boxGeometry args={[0.3, 3, groundSize * 0.6]} />
            <meshStandardMaterial color={colors.foundation} roughness={0.7} />
          </mesh>
          <mesh position={[groundSize/3, 1.5, 0]}>
            <boxGeometry args={[0.3, 3, groundSize * 0.6]} />
            <meshStandardMaterial color={colors.foundation} roughness={0.7} />
          </mesh>
        </>
      )}

      {/* Swimming pool for luxury */}
      {hasPool && (
        <group position={[-width - 8, 0, 0]}>
          {/* Pool base */}
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[8, 1, 4]} />
            <meshStandardMaterial color="#1E90FF" transparent opacity={0.8} roughness={0.1} metalness={0.3} />
          </mesh>
          {/* Pool deck */}
          <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 6]} />
            <meshStandardMaterial color="#D2B48C" roughness={0.6} />
          </mesh>
        </group>
      )}

      {/* Extensive garden with flowers and vegetation */}
      <group>
        {/* Large trees around property */}
        {(
          [
            [-width - 8, 0, -depth - 6] as [number, number, number],
            [width + 8, 0, depth + 6] as [number, number, number],
            [-width - 6, 0, depth + 8] as [number, number, number],
            [width + 6, 0, -depth - 8] as [number, number, number],
            [-groundSize/4, 0, -groundSize/4] as [number, number, number],
            [groundSize/4, 0, groundSize/4] as [number, number, number]
          ]
        ).map((pos, i) => (
          <group key={`tree-${i}`} position={pos}>
            <mesh position={[0, 2.5, 0]}>
              <cylinderGeometry args={[0.5, 0.6, 5, 10]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            <mesh position={[0, 5.5, 0]}>
              <sphereGeometry args={[2.5, 12, 8]} />
              <meshStandardMaterial color="#2E8B57" roughness={0.9} />
            </mesh>
          </group>
        ))}

        {/* Flower beds around house */}
        {(
          [
            [-width - 1, 0, -depth - 1] as [number, number, number],
            [width + 1, 0, depth + 1] as [number, number, number],
            [-width - 1, 0, depth + 1] as [number, number, number],
            [width + 1, 0, -depth - 1] as [number, number, number],
            [-width - 2, 0, 0] as [number, number, number],
            [width + 2, 0, 0] as [number, number, number]
          ]
        ).map((pos, i) => (
          <group key={`flowerbed-${i}`} position={pos}>
            {/* Flower bed base */}
            <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[1.2, 8]} />
              <meshStandardMaterial color="#8B7355" />
            </mesh>
            {/* Flowers */}
            {[...Array(6)].map((_, j) => (
              <group key={`flower-${j}`} position={[
                Math.cos((j / 6) * Math.PI * 2) * 0.8,
                0.2,
                Math.sin((j / 6) * Math.PI * 2) * 0.8
              ]}>
                <mesh position={[0, 0.3, 0]}>
                  <cylinderGeometry args={[0.05, 0.05, 0.6, 6]} />
                  <meshStandardMaterial color="#228B22" />
                </mesh>
                <mesh position={[0, 0.7, 0]}>
                  <sphereGeometry args={[0.3, 6, 4]} />
                  <meshStandardMaterial color={i % 2 === 0 ? "#FF69B4" : "#FFD700"} />
                </mesh>
              </group>
            ))}
          </group>
        ))}

        {/* Bushes and shrubs */}
        {(
          [
            [-width - 4, 0, -depth - 3] as [number, number, number],
            [width + 4, 0, depth + 3] as [number, number, number],
            [-width - 3, 0, depth + 4] as [number, number, number],
            [width + 3, 0, -depth - 4] as [number, number, number],
            [0, 0, -depth - 5] as [number, number, number],
            [0, 0, depth + 5] as [number, number, number]
          ]
        ).map((pos, i) => (
          <mesh key={`bush-${i}`} position={pos}>
            <sphereGeometry args={[1.2, 8, 6]} />
            <meshStandardMaterial color="#3CB371" roughness={0.9} />
          </mesh>
        ))}

        {/* Small plants scattered around */}
        {(
          [
            [-width - 5, 0, -2] as [number, number, number],
            [width + 5, 0, 2] as [number, number, number],
            [-3, 0, depth + 3] as [number, number, number],
            [3, 0, -depth - 3] as [number, number, number],
            [-6, 0, 4] as [number, number, number],
            [6, 0, -4] as [number, number, number]
          ]
        ).map((pos, i) => (
          <group key={`plant-${i}`} position={pos}>
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.1, 0.15, 0.4, 6]} />
              <meshStandardMaterial color="#32CD32" />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <sphereGeometry args={[0.4, 5, 3]} />
              <meshStandardMaterial color="#90EE90" />
            </mesh>
          </group>
        ))}

        {/* Garden pathway */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, depth/2 + 3]}>
          <planeGeometry args={[2.5, 8]} />
          <meshStandardMaterial color={materialType === "luxury" ? "#B8956A" : "#A8A8A8"} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

export default function House3D({ area, floors, materialType = "standard" }: House3DProps) {
  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden glass">
      <Canvas>
        <PerspectiveCamera makeDefault position={[25, 15, 25]} fov={35} />
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          minDistance={12}
          maxDistance={80} // Much larger max distance for big houses
          target={[0, 8, 0]}
        />
        
        <ambientLight intensity={0.6} />
        <directionalLight position={[20, 25, 20]} intensity={1.2} castShadow />
        <pointLight position={[0, 15, 0]} intensity={0.4} />
        <hemisphereLight intensity={0.3} color="#87CEEB" groundColor="#4A5D3F" />
        
        <HouseModel area={area} floors={floors} materialType={materialType} />
      </Canvas>
    </div>
  );
}