import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

interface ConstructionAnimation3DProps {
  stage: number;
  buildingType: 'residential' | 'commercial';
}

// Worker component
function Worker({ position, color = "#FFA500" }: { position: [number, number, number], color?: string }) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.8, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshStandardMaterial color="#FFE4B5" />
      </mesh>
      {/* Helmet */}
      <mesh position={[0, 1.4, 0]}>
        <sphereGeometry args={[0.28, 8, 8]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      {/* Legs */}
      <mesh position={[0.1, 0.2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 8]} />
        <meshStandardMaterial color="#1E90FF" />
      </mesh>
      <mesh position={[-0.1, 0.2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 8]} />
        <meshStandardMaterial color="#1E90FF" />
      </mesh>
    </group>
  );
}

// JCB/Excavator component
function Excavator({ position, rotation = 0 }: { position: [number, number, number], rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Main body */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[2, 1.2, 1.5]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      {/* Cabin */}
      <mesh position={[0.3, 1.8, 0]}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      {/* Windows */}
      <mesh position={[0.9, 1.8, 0]}>
        <boxGeometry args={[0.05, 0.8, 0.8]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.6} />
      </mesh>
      {/* Arm */}
      <mesh position={[-1, 1.2, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[2, 0.3, 0.3]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      {/* Bucket */}
      <mesh position={[-2.5, 0.5, 0]} rotation={[0, 0, 0.8]}>
        <boxGeometry args={[0.8, 0.6, 1]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      {/* Tracks */}
      <mesh position={[0, 0.3, 0.7]}>
        <boxGeometry args={[2.5, 0.5, 0.4]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0, 0.3, -0.7]}>
        <boxGeometry args={[2.5, 0.5, 0.4]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
}

// Concrete Mixer
function ConcreteMixer({ position }: { position: [number, number, number] }) {
  const mixerRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (mixerRef.current) {
      mixerRef.current.rotation.z += 0.02;
    }
  });

  return (
    <group position={position}>
      {/* Base truck */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3, 0.8, 1.5]} />
        <meshStandardMaterial color="#FF6B6B" />
      </mesh>
      {/* Wheels */}
      {[-1, 0, 1].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0.2, 0.8]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          <mesh position={[x, 0.2, -0.8]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        </group>
      ))}
      {/* Mixer drum */}
      <mesh ref={mixerRef} position={[0, 1.5, 0]} rotation={[0, 0, Math.PI/4]}>
        <cylinderGeometry args={[0.8, 0.6, 2, 16]} />
        <meshStandardMaterial color="#CCCCCC" />
      </mesh>
    </group>
  );
}

// Construction materials pile
function MaterialPile({ position, color }: { position: [number, number, number], color: string }) {
  return (
    <group position={position}>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 1.5,
          i * 0.3,
          (Math.random() - 0.5) * 1.5
        ]}>
          <boxGeometry args={[0.6, 0.3, 0.8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

// Scaffolding
function Scaffolding({ position, height }: { position: [number, number, number], height: number }) {
  return (
    <group position={position}>
      {/* Vertical poles */}
      {[-1, 1].map((x) => 
        [[-1], [1]].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, height/2, z[0]]}>
            <cylinderGeometry args={[0.05, 0.05, height, 8]} />
            <meshStandardMaterial color="#888888" />
          </mesh>
        ))
      )}
      {/* Horizontal bars */}
      {[...Array(Math.floor(height / 2))].map((_, i) => (
        <group key={i}>
          <mesh position={[0, (i + 1) * 2, 1]}>
            <cylinderGeometry args={[0.04, 0.04, 2, 8]} />
            <meshStandardMaterial color="#888888" />
          </mesh>
          <mesh position={[0, (i + 1) * 2, -1]} rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.04, 0.04, 2, 8]} />
            <meshStandardMaterial color="#888888" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Floor plan blueprint
function Blueprint({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial color="#E8F4F8" />
      </mesh>
      {/* Blueprint lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[3, 2]} />
        <meshStandardMaterial color="#0066CC" transparent opacity={0.8} />
      </mesh>
    </group>
  );
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
      groupRef.current.rotation.y += 0.001;
    }
  });

  const maxStages = buildingType === 'residential' ? 12 : 10;

  return (
    <group ref={groupRef}>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#5A7D5A" roughness={1} />
      </mesh>

      {/* Stage 0: Planning & Design - Show blueprints and planning */}
      {stage === 0 && (
        <group>
          <Blueprint position={[0, 0.5, 0]} />
          <Worker position={[-2, 0, -2]} color="#4169E1" />
          <Worker position={[2, 0, -2]} color="#4169E1" />
          {/* Small table/desk */}
          <mesh position={[0, 0.6, -3]}>
            <boxGeometry args={[2, 0.1, 1]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        </group>
      )}

      {/* Stage 1: Site Preparation - Excavation with JCB */}
      {stage >= 1 && (
        <>
          {/* Cleared site */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[width + 4, depth + 4]} />
            <meshStandardMaterial color="#A0826D" roughness={0.9} />
          </mesh>
          
          {stage === 1 && (
            <>
              <Excavator position={[-5, 0, -3]} rotation={0.5} />
              <Worker position={[4, 0, -2]} color="#FFA500" />
              <Worker position={[6, 0, 2]} color="#FFA500" />
              <Worker position={[-3, 0, 4]} color="#FFA500" />
              {/* Dirt piles */}
              <MaterialPile position={[-8, 0, 5]} color="#8B7355" />
              <MaterialPile position={[8, 0, -5]} color="#8B7355" />
            </>
          )}

          {/* Excavated foundation pit */}
          {stage >= 1 && (
            <mesh position={[0, -1, 0]}>
              <boxGeometry args={[width + 2, 1.5, depth + 2]} />
              <meshStandardMaterial color="#654321" roughness={0.9} />
            </mesh>
          )}
        </>
      )}

      {/* Stage 2: Foundation work - Concrete pouring */}
      {stage >= 2 && (
        <>
          <mesh position={[0, -0.4, 0]}>
            <boxGeometry args={[width + 1, 0.8, depth + 1]} />
            <meshStandardMaterial color="#7A6C5D" roughness={0.9} />
          </mesh>

          {stage === 2 && (
            <>
              <ConcreteMixer position={[-8, 0, -4]} />
              <Worker position={[-2, -0.4, 2]} color="#FFA500" />
              <Worker position={[2, -0.4, -2]} color="#FFA500" />
              <Worker position={[0, -0.4, 3]} color="#FFA500" />
              <Worker position={[4, 0, 4]} color="#FFA500" />
              {/* Steel rods */}
              <MaterialPile position={[7, 0, 3]} color="#888888" />
            </>
          )}
        </>
      )}

      {/* Stage 3: RCC Columns - Pillars going up */}
      {stage >= 3 && (
        <group position={[0, 0.4, 0]}>
          {/* Columns */}
          {[
            [-width/3, -depth/3], [width/3, -depth/3],
            [-width/3, depth/3], [width/3, depth/3]
          ].map((pos, i) => (
            <mesh key={`column-${i}`} position={[pos[0], (totalHeight * (stage >= 4 ? 1 : 0.5)) / 2, pos[1]]}>
              <boxGeometry args={[0.6, totalHeight * (stage >= 4 ? 1 : 0.5), 0.6]} />
              <meshStandardMaterial color="#888888" />
            </mesh>
          ))}

          {stage === 3 && (
            <>
              <Scaffolding position={[-width/2 - 1, 0.4, 0]} height={8} />
              <Scaffolding position={[width/2 + 1, 0, 0]} height={8} />
              <Worker position={[-3, 0.4, 2]} color="#FFA500" />
              <Worker position={[3, 0.4, -2]} color="#FFA500" />
              <Worker position={[0, 4, 3]} color="#FFA500" />
              <ConcreteMixer position={[-10, 0, 0]} />
            </>
          )}
        </group>
      )}

      {/* Stage 4: RCC Beams and Slabs */}
      {stage >= 4 && (
        <group position={[0, 0.4, 0]}>
          {/* Floor slabs */}
          {Array.from({ length: floors }).map((_, index) => (
            <mesh key={`floor-${index}`} position={[0, (index + 1) * floorHeight, 0]}>
              <boxGeometry args={[width + 0.2, 0.3, depth + 0.2]} />
              <meshStandardMaterial color="#888888" />
            </mesh>
          ))}

          {/* Beams */}
          {Array.from({ length: floors }).map((_, floorIdx) => (
            <group key={`beams-${floorIdx}`}>
              {[-width/3, 0, width/3].map((x, i) => (
                <mesh key={`beam-x-${i}`} position={[x, (floorIdx + 1) * floorHeight - 0.3, 0]}>
                  <boxGeometry args={[0.4, 0.5, depth + 0.4]} />
                  <meshStandardMaterial color="#888888" />
                </mesh>
              ))}
            </group>
          ))}

          {stage === 4 && (
            <>
              <Worker position={[-4, 0.4, 0]} color="#FFA500" />
              <Worker position={[4, 0.4, 0]} color="#FFA500" />
              <Worker position={[0, floorHeight + 0.4, 2]} color="#FFA500" />
              <Worker position={[2, floorHeight + 0.4, -2]} color="#FFA500" />
            </>
          )}
        </group>
      )}

      {/* Stage 5: Brickwork & Masonry - Walls being built */}
      {stage >= 5 && (
        <group position={[0, 0.4, 0]}>
          {/* Brick walls */}
          <mesh position={[0, totalHeight / 2, 0]}>
            <boxGeometry args={[width, totalHeight, depth]} />
            <meshStandardMaterial color="#D2691E" roughness={0.8} />
          </mesh>

          {stage === 5 && (
            <>
              <Worker position={[-width/2 - 1, 0.4, 0]} color="#FFA500" />
              <Worker position={[width/2 + 1, 0.4, 0]} color="#FFA500" />
              <Worker position={[0, floorHeight + 0.4, depth/2 + 1]} color="#FFA500" />
              <Worker position={[3, 0.4, -depth/2 - 1]} color="#FFA500" />
              {/* Brick piles */}
              <MaterialPile position={[-width - 3, 0, 3]} color="#CD5C5C" />
              <MaterialPile position={[width + 3, 0, -3]} color="#CD5C5C" />
              <Scaffolding position={[-width/2 - 1, 0.4, 0]} height={totalHeight} />
              <Scaffolding position={[width/2 + 1, 0.4, 0]} height={totalHeight} />
            </>
          )}
        </group>
      )}

      {/* Stage 6: Plumbing & Electrical */}
      {stage >= 6 && (
        <group>
          {stage === 6 && (
            <>
              {/* Pipes visible */}
              {Array.from({ length: floors }).map((_, floorIdx) => (
                <group key={`pipes-${floorIdx}`}>
                  {/* Vertical pipes */}
                  <mesh position={[-width/3, 0.4 + (floorIdx + 0.5) * floorHeight, -depth/2 - 0.5]}>
                    <cylinderGeometry args={[0.1, 0.1, floorHeight * 0.8, 8]} />
                    <meshStandardMaterial color="#4682B4" />
                  </mesh>
                  <mesh position={[width/3, 0.4 + (floorIdx + 0.5) * floorHeight, -depth/2 - 0.5]}>
                    <cylinderGeometry args={[0.1, 0.1, floorHeight * 0.8, 8]} />
                    <meshStandardMaterial color="#FF4500" />
                  </mesh>
                  {/* Electrical conduits */}
                  <mesh position={[0, 0.4 + (floorIdx + 1) * floorHeight - 0.5, depth/2 + 0.5]}>
                    <boxGeometry args={[width * 0.8, 0.05, 0.05]} />
                    <meshStandardMaterial color="#FFD700" />
                  </mesh>
                </group>
              ))}
              <Worker position={[-3, 0.4, -depth/2 - 1]} color="#4169E1" />
              <Worker position={[3, floorHeight + 0.4, depth/2 + 1]} color="#4169E1" />
              <Worker position={[0, 0.4, 0]} color="#4169E1" />
              {/* Material boxes */}
              <MaterialPile position={[-width - 2, 0, -2]} color="#4682B4" />
            </>
          )}
        </group>
      )}

      {/* Stage 7: Plastering - Smooth walls */}
      {stage >= 7 && (
        <group position={[0, 0.4, 0]}>
          <mesh position={[0, totalHeight / 2, 0]}>
            <boxGeometry args={[width, totalHeight, depth]} />
            <meshStandardMaterial color="#F5F5DC" roughness={0.5} />
          </mesh>

          {stage === 7 && (
            <>
              <Worker position={[-width/2 - 1, floorHeight + 0.4, 0]} color="#FFFFFF" />
              <Worker position={[width/2 + 1, 0.4, 0]} color="#FFFFFF" />
              <Worker position={[0, 0.4, depth/2 + 1]} color="#FFFFFF" />
              <Scaffolding position={[-width/2 - 1, 0.4, depth/3]} height={totalHeight} />
              <Scaffolding position={[width/2 + 1, 0.4, -depth/3]} height={totalHeight} />
              {/* Cement bags */}
              <MaterialPile position={[-width - 2, 0, 2]} color="#D3D3D3" />
            </>
          )}
        </group>
      )}

      {/* Stage 8: Flooring & Tiling */}
      {stage >= 8 && (
        <group>
          {/* Windows and doors now installed */}
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

          {stage === 8 && (
            <>
              <Worker position={[-2, 0.4, 2]} color="#87CEEB" />
              <Worker position={[2, floorHeight + 0.4, -2]} color="#87CEEB" />
              {/* Tile boxes */}
              <MaterialPile position={[width + 2, 0, 0]} color="#E6E6FA" />
            </>
          )}
        </group>
      )}

      {/* Stage 9: Woodwork & Fittings / Interior Work */}
      {stage >= 9 && buildingType === 'residential' && (
        <>
          {/* Balconies */}
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

          {stage === 9 && (
            <>
              <Worker position={[-3, 0.4, 0]} color="#8B4513" />
              <Worker position={[2, floorHeight + 0.4, 2]} color="#8B4513" />
              {/* Wood planks */}
              <MaterialPile position={[-width - 2, 0, -3]} color="#D2691E" />
            </>
          )}
        </>
      )}

      {/* Stage 10: Painting */}
      {stage >= 10 && (
        <group position={[0, 0.4, 0]}>
          <mesh position={[0, totalHeight / 2, 0]}>
            <boxGeometry args={[width, totalHeight, depth]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>

          {/* Roof */}
          <mesh position={[0, totalHeight + 0.2, 0]}>
            <boxGeometry args={[width + 0.8, 0.3, depth + 0.8]} />
            <meshStandardMaterial color="#2C2C2C" roughness={0.7} />
          </mesh>
          <mesh position={[0, totalHeight + 0.5, 0]}>
            <boxGeometry args={[width + 1.0, 0.4, depth + 1.0]} />
            <meshStandardMaterial color="#E8E8E8" />
          </mesh>

          {stage === 10 && (
            <>
              <Worker position={[-width/2 - 1, 0.4, depth/2 + 1]} color="#FFFFFF" />
              <Worker position={[width/2 + 1, floorHeight + 0.4, 0]} color="#FFFFFF" />
              <Scaffolding position={[width/2 + 1, 0.4, -depth/3]} height={totalHeight} />
              {/* Paint buckets */}
              <MaterialPile position={[-width - 2, 0, 0]} color="#FF6347" />
            </>
          )}
        </group>
      )}

      {/* Stage 11: Final Fixtures & Cleanup */}
      {stage >= 11 && (
        <>
          {stage === 11 && (
            <>
              <Worker position={[-2, 0.4, depth/2 + 1]} color="#4169E1" />
              <Worker position={[2, 0.4, -depth/2 - 1]} color="#32CD32" />
              <Worker position={[4, 0, 4]} color="#32CD32" />
            </>
          )}
        </>
      )}

      {/* Stage 12: Final Landscaping & Handover */}
      {stage >= 11 && (
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
