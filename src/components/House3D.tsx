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
      {[[-0.8, 0.2, 0.6], [0.8, 0.2, 0.6], [-0.8, 0.2, -0.6], [0.8, 0.2, -0.6]].map((pos, i) => (
        <mesh key={`wheel-${i}`} position={pos}>
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
      {[[0, 0.15, 0.8], [0, 0.15, -0.8]].map((pos, i) => (
        <mesh key={`bike-wheel-${i}`} position={pos}>
          <cylinderGeometry args={[0.2, 0.2, 0.08, 12]} rotation={[Math.PI/2, 0, 0]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      ))}
    </group>
  );

  return (
    <group ref={groupRef}>
      {/* Massive foundation for big house */}
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[width + 1.5, 0.8, depth + 1.5]} />
        <meshStandardMaterial color="#7A6C5D" roughness={0.9} />
      </mesh>

      {/* Main house structure - much larger */}
      <group position={[0, 0.4, 0]}>
        {/* Building walls */}
        <mesh position={[0, totalHeight / 2, 0]}>
          <boxGeometry args={[width, totalHeight, depth]} />
          <meshStandardMaterial color="#F8F8F8" roughness={0.6} />
        </mesh>

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
                    <meshStandardMaterial color="#87CEEB" transparent opacity={0.8} />
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
          <meshStandardMaterial color="#8B4513" />
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
              <meshStandardMaterial color="#CCCCCC" metalness={0.3} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Large roof */}
      <mesh position={[0, totalHeight + 0.2, 0]}>
        <boxGeometry args={[width + 0.8, 0.3, depth + 0.8]} />
        <meshStandardMaterial color="#2C2C2C" />
      </mesh>

      {/* Rooftop parapet */}
      <mesh position={[0, totalHeight + 0.5, 0]}>
        <boxGeometry args={[width + 1.0, 0.4, depth + 1.0]} />
        <meshStandardMaterial color="#E8E8E8" />
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

      {/* Extensive garden with flowers and vegetation */}
      <group>
        {/* Large trees around property */}
        {[
          [-width - 8, 0, -depth - 6],
          [width + 8, 0, depth + 6],
          [-width - 6, 0, depth + 8],
          [width + 6, 0, -depth - 8],
          [-groundSize/4, 0, -groundSize/4],
          [groundSize/4, 0, groundSize/4]
        ].map((pos, i) => (
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
        {[
          [-width - 1, 0, -depth - 1], [width + 1, 0, depth + 1],
          [-width - 1, 0, depth + 1], [width + 1, 0, -depth - 1],
          [-width - 2, 0, 0], [width + 2, 0, 0]
        ].map((pos, i) => (
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
        {[
          [-width - 4, 0, -depth - 3], [width + 4, 0, depth + 3],
          [-width - 3, 0, depth + 4], [width + 3, 0, -depth - 4],
          [0, 0, -depth - 5], [0, 0, depth + 5]
        ].map((pos, i) => (
          <mesh key={`bush-${i}`} position={pos}>
            <sphereGeometry args={[1.2, 8, 6]} />
            <meshStandardMaterial color="#3CB371" roughness={0.9} />
          </mesh>
        ))}

        {/* Small plants scattered around */}
        {[
          [-width - 5, 0, -2], [width + 5, 0, 2], [-3, 0, depth + 3],
          [3, 0, -depth - 3], [-6, 0, 4], [6, 0, -4]
        ].map((pos, i) => (
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
          <meshStandardMaterial color="#A8A8A8" roughness={0.6} />
        </mesh>

        {/* Fence around property */}
        <mesh position={[0, 1.0, -depth - 12]}>
          <boxGeometry args={[groundSize * 0.8, 2.0, 0.1]} />
          <meshStandardMaterial color="#8B4513" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

export default function House3D({ area, floors }: House3DProps) {
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
        
        <HouseModel area={area} floors={floors} />
      </Canvas>
    </div>
  );
}