import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

interface ConstructionAnimation3DProps {
  stage: number;
  buildingType: 'residential' | 'commercial';
}

function BuildingModel({ stage, buildingType }: ConstructionAnimation3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const width = buildingType === 'residential' ? 12 : 18;
  const depth = buildingType === 'residential' ? 10 : 15;
  const floors = buildingType === 'residential' ? 2 : 4;
  const floorHeight = 4;
  const totalHeight = floors * floorHeight;

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  // Residential stages: 12 total
  // Commercial stages: 10 total
  const maxStages = buildingType === 'residential' ? 12 : 10;
  const progress = Math.min(stage / maxStages, 1);

  return (
    <group ref={groupRef}>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#5A7D5A" roughness={1} />
      </mesh>

      {/* Stage 0-1: Site Preparation & Foundation */}
      {stage >= 1 && (
        <>
          {/* Excavated ground */}
          <mesh position={[0, -1, 0]}>
            <boxGeometry args={[width + 2, 1.5, depth + 2]} />
            <meshStandardMaterial color="#8B7355" roughness={0.9} />
          </mesh>
        </>
      )}

      {/* Stage 2-3: Foundation complete */}
      {stage >= 2 && (
        <>
          <mesh position={[0, -0.4, 0]}>
            <boxGeometry args={[width + 1, 0.8, depth + 1]} />
            <meshStandardMaterial color="#7A6C5D" roughness={0.9} />
          </mesh>
        </>
      )}

      {/* Stage 3-4: Structure (walls and floors) */}
      {stage >= 3 && (
        <group position={[0, 0.4, 0]}>
          {/* Build walls progressively */}
          <mesh position={[0, (totalHeight * Math.min(progress * 3, 1)) / 2, 0]}>
            <boxGeometry args={[width, totalHeight * Math.min(progress * 3, 1), depth]} />
            <meshStandardMaterial color="#CCCCCC" roughness={0.8} />
          </mesh>

          {/* Floor slabs */}
          {stage >= 4 && Array.from({ length: floors - 1 }).map((_, index) => (
            <mesh key={`floor-${index}`} position={[0, (index + 1) * floorHeight, 0]}>
              <boxGeometry args={[width + 0.2, 0.2, depth + 0.2]} />
              <meshStandardMaterial color="#888888" />
            </mesh>
          ))}
        </group>
      )}

      {/* Stage 5: Brickwork/Masonry - walls get painted */}
      {stage >= 5 && (
        <group position={[0, 0.4, 0]}>
          <mesh position={[0, totalHeight / 2, 0]}>
            <boxGeometry args={[width, totalHeight, depth]} />
            <meshStandardMaterial color="#F8F8F8" roughness={0.6} />
          </mesh>
        </group>
      )}

      {/* Stage 6: Windows and doors */}
      {stage >= 6 && (
        <group>
          {/* Windows */}
          {Array.from({ length: floors }).map((_, floorIndex) => {
            const windowCount = buildingType === 'residential' ? 3 : 5;
            return (
              <group key={`floor-${floorIndex}`}>
                {[...Array(windowCount)].map((_, i) => (
                  <group key={`window-${i}`}>
                    <mesh 
                      position={[
                        -width/2 + (i + 1) * (width / (windowCount + 1)),
                        0.4 + floorIndex * floorHeight + 2.0,
                        depth/2 + 0.02
                      ]}
                    >
                      <boxGeometry args={[1.5, 1.8, 0.05]} />
                      <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} />
                    </mesh>
                    <mesh 
                      position={[
                        -width/2 + (i + 1) * (width / (windowCount + 1)),
                        0.4 + floorIndex * floorHeight + 2.0,
                        depth/2 + 0.035
                      ]}
                    >
                      <boxGeometry args={[1.6, 1.9, 0.03]} />
                      <meshStandardMaterial color="#333333" />
                    </mesh>
                  </group>
                ))}
              </group>
            );
          })}

          {/* Main door */}
          <mesh position={[0, 1.9, depth/2 + 0.02]}>
            <boxGeometry args={[1.8, 2.8, 0.1]} />
            <meshStandardMaterial color="#8B4513" roughness={0.8} />
          </mesh>
        </group>
      )}

      {/* Stage 7: Roof */}
      {stage >= 7 && (
        <>
          <mesh position={[0, totalHeight + 0.6, 0]}>
            <boxGeometry args={[width + 0.8, 0.3, depth + 0.8]} />
            <meshStandardMaterial color="#2C2C2C" roughness={0.7} />
          </mesh>
          <mesh position={[0, totalHeight + 0.9, 0]}>
            <boxGeometry args={[width + 1.0, 0.4, depth + 1.0]} />
            <meshStandardMaterial color="#E8E8E8" />
          </mesh>
        </>
      )}

      {/* Stage 8: Balconies and fixtures */}
      {stage >= 8 && buildingType === 'residential' && (
        <>
          {Array.from({ length: floors - 1 }).map((_, index) => (
            <group key={`balcony-${index}`} position={[0, 0.4 + (index + 1) * floorHeight + 0.1, depth/2 + 0.5]}>
              <mesh>
                <boxGeometry args={[width * 0.6, 0.15, 0.8]} />
                <meshStandardMaterial color="#666666" />
              </mesh>
              <mesh position={[0, 0.6, -0.3]}>
                <boxGeometry args={[width * 0.6, 1.2, 0.08]} />
                <meshStandardMaterial color="#999999" metalness={0.3} />
              </mesh>
            </group>
          ))}
        </>
      )}

      {/* Stage 9-10: Painting complete (brighter walls) */}
      {stage >= 9 && (
        <group position={[0, 0.4, 0]}>
          <mesh position={[0, totalHeight / 2, 0]}>
            <boxGeometry args={[width, totalHeight, depth]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
          </mesh>
        </group>
      )}

      {/* Stage 11-12: Landscaping */}
      {stage >= 10 && (
        <group>
          {/* Trees */}
          {[
            [-width - 4, 0, -depth - 3] as [number, number, number],
            [width + 4, 0, depth + 3] as [number, number, number],
            [-width - 3, 0, depth + 4] as [number, number, number],
            [width + 3, 0, -depth - 4] as [number, number, number]
          ].map((pos, i) => (
            <group key={`tree-${i}`} position={pos}>
              <mesh position={[0, 1.5, 0]}>
                <cylinderGeometry args={[0.3, 0.4, 3, 8]} />
                <meshStandardMaterial color="#8B4513" />
              </mesh>
              <mesh position={[0, 3.5, 0]}>
                <sphereGeometry args={[1.5, 8, 6]} />
                <meshStandardMaterial color="#2E8B57" />
              </mesh>
            </group>
          ))}

          {/* Pathway */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, depth/2 + 3]}>
            <planeGeometry args={[2, 6]} />
            <meshStandardMaterial color="#A8A8A8" roughness={0.6} />
          </mesh>

          {/* Garden beds */}
          {[
            [-width - 1, 0, 0] as [number, number, number],
            [width + 1, 0, 0] as [number, number, number]
          ].map((pos, i) => (
            <group key={`garden-${i}`} position={pos}>
              <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[1, 8]} />
                <meshStandardMaterial color="#8B7355" />
              </mesh>
              {[...Array(4)].map((_, j) => (
                <mesh key={`flower-${j}`} position={[
                  Math.cos((j / 4) * Math.PI * 2) * 0.6,
                  0.3,
                  Math.sin((j / 4) * Math.PI * 2) * 0.6
                ]}>
                  <sphereGeometry args={[0.2, 6, 4]} />
                  <meshStandardMaterial color={j % 2 === 0 ? "#FF69B4" : "#FFD700"} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      )}

      {/* Final stage: Parking and vehicles (residential only) */}
      {stage >= 11 && buildingType === 'residential' && (
        <group position={[width/2 + 5, 0, -depth/2]}>
          <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[8, 6]} />
            <meshStandardMaterial color="#555555" />
          </mesh>
          {/* Simple car */}
          <group position={[0, 0.5, 0]}>
            <mesh>
              <boxGeometry args={[2, 0.8, 1]} />
              <meshStandardMaterial color="#FF4444" />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[1.5, 0.4, 1]} />
              <meshStandardMaterial color="#FF4444" />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
}

export default function ConstructionAnimation3D({ stage, buildingType }: ConstructionAnimation3DProps) {
  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden glass">
      <Canvas>
        <PerspectiveCamera makeDefault position={[30, 20, 30]} fov={40} />
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          minDistance={15}
          maxDistance={60}
          target={[0, 5, 0]}
        />
        
        <ambientLight intensity={0.6} />
        <directionalLight position={[20, 30, 20]} intensity={1.3} castShadow />
        <pointLight position={[0, 20, 0]} intensity={0.4} />
        <hemisphereLight intensity={0.4} color="#87CEEB" groundColor="#4A5D3F" />
        
        <BuildingModel stage={stage} buildingType={buildingType} />
      </Canvas>
    </div>
  );
}
