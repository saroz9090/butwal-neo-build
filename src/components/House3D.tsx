import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

export interface House3DProps {
  area: number;
  floors: number;
  materialType?: string;
  cameraAngle?: "isometric" | "front" | "top" | "side";
  timeOfDay?: "day" | "sunset" | "night";
  customWallColor?: string;
  customRoofColor?: string;
  includeCar?: boolean;
  includeSolar?: boolean;
  includeCompound?: boolean;
  includePool?: boolean;
  roofStyle?: "terrace" | "slope";
  landLength?: number;
  landWidth?: number;
  frontSetback?: number;
  houseLength?: number;
  houseWidth?: number;
  architecturalStyle?: "modern_box" | "neoclassical" | "traditional" | "standard";
}

function HouseModel({ 
  area, 
  floors, 
  materialType = "standard", 
  customWallColor, 
  customRoofColor,
  includeCar = true,
  includeSolar = true,
  includeCompound = true,
  includePool = true,
  roofStyle = "terrace",
  landLength = 50,
  landWidth = 40,
  frontSetback = 12,
  houseLength = 35,
  houseWidth = 28,
  architecturalStyle = "modern_box"
}: House3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const scaleFactor = 0.22;
  const width = Math.max(8, houseWidth * scaleFactor);
  const depth = Math.max(8, houseLength * scaleFactor);
  const lWidth = Math.max(15, landWidth * scaleFactor);
  const lLength = Math.max(15, landLength * scaleFactor);
  const setback = Math.max(2, frontSetback * scaleFactor * 0.5);

  const floorHeight = 4; 
  const totalHeight = floors * floorHeight;
  const groundSize = Math.max(70, Math.max(lWidth, lLength) * 1.5);

  // Slow ambient rotation for showcase presentation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0012;
    }
  });

  // Modern stylized Sedan / SUV
  const Car = ({ position, color, rotationY = 0 }: { position: [number, number, number], color: string, rotationY?: number }) => (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Car chassis / lower body */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.45, 1.25]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Car cabin / upper body */}
      <mesh position={[-0.1, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.45, 1.15]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Windshield & Windows */}
      <mesh position={[0.66, 0.75, 0]} rotation={[0, 0, -0.4]} castShadow>
        <boxGeometry args={[0.1, 0.4, 1.0]} />
        <meshStandardMaterial color="#111111" transparent opacity={0.8} roughness={0.1} />
      </mesh>
      <mesh position={[-0.1, 0.75, 0.58]} castShadow>
        <boxGeometry args={[1.2, 0.35, 0.02]} />
        <meshStandardMaterial color="#111111" transparent opacity={0.8} roughness={0.1} />
      </mesh>
      <mesh position={[-0.1, 0.75, -0.58]} castShadow>
        <boxGeometry args={[1.2, 0.35, 0.02]} />
        <meshStandardMaterial color="#111111" transparent opacity={0.8} roughness={0.1} />
      </mesh>

      {/* Glowing Headlights */}
      {[-0.45, 0.45].map((z, i) => (
        <group key={`light-${i}`} position={[1.3, 0.35, z]}>
          <mesh>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#FFFFDD" />
          </mesh>
          <pointLight color="#FFFFEE" intensity={1.5} distance={8} decay={1.5} />
        </group>
      ))}

      {/* Wheels */}
      {(
        [
          [-0.75, 0.2, 0.6] as [number, number, number],
          [0.75, 0.2, 0.6] as [number, number, number],
          [-0.75, 0.2, -0.6] as [number, number, number],
          [0.75, 0.2, -0.6] as [number, number, number]
        ]
      ).map((pos, i) => (
        <mesh key={`wheel-${i}`} position={pos} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.24, 0.2, 16]} />
          <meshStandardMaterial color="#111111" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );

  const Motorcycle = ({ position, color, rotationY = 0 }: { position: [number, number, number], color: string, rotationY?: number }) => (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Frame */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.18, 0.2, 1.8]} />
        <meshStandardMaterial color="#222222" roughness={0.5} />
      </mesh>
      {/* Gas Tank */}
      <mesh position={[0, 0.6, -0.2]} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.6]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Engine seat */}
      <mesh position={[0, 0.5, 0.3]} castShadow>
        <boxGeometry args={[0.26, 0.1, 0.5]} />
        <meshStandardMaterial color="#111111" roughness={0.8} />
      </mesh>
      {/* Front Fork */}
      <mesh position={[0, 0.65, -0.7]} rotation={[0.2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.9, 8]} />
        <meshStandardMaterial color="#CCCCCC" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Handlebars */}
      <mesh position={[0, 1.0, -0.65]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.7, 8]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      {/* Wheels */}
      {(
        [
          [0, 0.22, 0.7] as [number, number, number],
          [0, 0.22, -0.7] as [number, number, number]
        ]
      ).map((pos, i) => (
        <mesh key={`bike-wheel-${i}`} position={pos} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.12, 16]} />
          <meshStandardMaterial color="#111111" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );

  // Architectural & Material Color Palette
  const getHouseColors = () => {
    let base = (() => {
      switch(materialType) {
        case "premium":
          return {
            wall: "#FAF7F2",
            foundation: "#4E443C",
            roof: "#1D2228",
            door: "#52321C",
            window: "#EBF3F9",
            balcony: "#3A3A3A",
            parapet: "#EFEAE4"
          };
        case "luxury":
          return {
            wall: "#FFFFFF",
            foundation: "#363636",
            roof: "#151515",
            door: "#2E1C14",
            window: "#D9EAF7",
            balcony: "#D4AF37",
            parapet: "#F8F8F8"
          };
        default:
          return {
            wall: "#F2EFEB",
            foundation: "#5C564E",
            roof: "#2A2F35",
            door: "#783F27",
            window: "#E5ECEF",
            balcony: "#4D4D4D",
            parapet: "#EAE6E2"
          };
      }
    })();

    if (architecturalStyle === "neoclassical") {
      base = {
        ...base,
        wall: "#F4EEDC", // Classic Cream Stone
        foundation: "#5A4D41",
        roof: "#2D2621",
        door: "#4A2E1B",
        balcony: "#C5A059" // Antique Gold / Bronze
      };
    } else if (architecturalStyle === "traditional") {
      base = {
        ...base,
        wall: "#EFE3D5", // Warm Terracotta Tone
        foundation: "#6E5344",
        roof: "#8B3A2B", // Classic Clay Tile Red
        door: "#5C3A21"
      };
    } else if (architecturalStyle === "modern_box") {
      base = {
        ...base,
        wall: "#FFFFFF",
        foundation: "#222222",
        roof: "#111111",
        balcony: "#1A1A1A"
      };
    }

    return {
      ...base,
      wall: customWallColor || base.wall,
      roof: customRoofColor || base.roof,
    };
  };

  const colors = getHouseColors();
  const hasCompound = materialType === "premium" || materialType === "luxury" || architecturalStyle === "neoclassical";
  const hasPool = materialType === "luxury";

  return (
    <group ref={groupRef}>
      {/* Ground plane with subtle texture Grid and shadow receiver */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[groundSize, groundSize]} />
        <meshStandardMaterial color="#4A6E4A" roughness={1.0} />
      </mesh>

      {/* Modern interlocked path walkway around building */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[width + 4.5, depth + 4.5]} />
        <meshStandardMaterial color="#333333" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[width + 4.0, depth + 4.0]} />
        <meshStandardMaterial color="#D0D0D0" roughness={0.8} />
      </mesh>

      {/* Massive polished foundation for the estate */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 1.2, 0.7, depth + 1.2]} />
        <meshStandardMaterial color={colors.foundation} roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Main architectural house structure */}
      <group position={[0, 0.7, 0]}>
        {/* Exterior Walls */}
        <mesh position={[0, totalHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width, totalHeight, depth]} />
          <meshStandardMaterial color={colors.wall} roughness={0.65} metalness={0.02} />
        </mesh>

        {/* Style-specific Architectural Accents */}
        {architecturalStyle === "neoclassical" && (
          <>
            {/* Grand Entrance Porch Columns */}
            {[-1.2, 1.2].map((x, i) => (
              <mesh key={`neo-col-${i}`} position={[x, totalHeight / 2, depth / 2 + 0.6]} castShadow receiveShadow>
                <cylinderGeometry args={[0.3, 0.3, totalHeight, 18]} />
                <meshStandardMaterial color="#FAF5EB" roughness={0.3} />
              </mesh>
            ))}
            {/* Classical Pediment Header over entrance */}
            <mesh position={[0, totalHeight * 0.85, depth / 2 + 0.4]} castShadow>
              <boxGeometry args={[width * 0.5, 0.5, 0.8]} />
              <meshStandardMaterial color={colors.foundation} roughness={0.5} />
            </mesh>
          </>
        )}

        {architecturalStyle === "modern_box" && (
          <>
            {/* Bold Cantilever Upper Overhang Box */}
            <mesh position={[0, totalHeight * 0.75, depth / 2 + 0.3]} castShadow receiveShadow>
              <boxGeometry args={[width * 1.05, 0.8, 1.2]} />
              <meshStandardMaterial color={colors.roof} roughness={0.3} />
            </mesh>
          </>
        )}

        {/* Vertical Wooden Accent Panels for modern aesthetic */}
        {architecturalStyle !== "neoclassical" && [-width / 2 + 0.5, width / 2 - 0.5].map((x, i) => (
          <mesh key={`accent-${i}`} position={[x, totalHeight / 2, depth / 2 + 0.04]} castShadow receiveShadow>
            <boxGeometry args={[0.8, totalHeight * 0.9, 0.08]} />
            <meshStandardMaterial color={colors.door} roughness={0.4} />
          </mesh>
        ))}

        {/* Decorative architectural pillars for premium/luxury */}
        {(materialType === "premium" || materialType === "luxury") && architecturalStyle !== "neoclassical" && (
          <>
            {[-width / 2 - 0.25, width / 2 + 0.25].map((x, i) => (
              <mesh key={`pillar-${i}`} position={[x, totalHeight / 2, depth / 2 + 0.4]} castShadow receiveShadow>
                <cylinderGeometry args={[0.22, 0.22, totalHeight, 16]} />
                <meshStandardMaterial color={colors.foundation} roughness={0.3} metalness={0.4} />
              </mesh>
            ))}
          </>
        )}

        {/* Floor separating slabs with modern overhangs */}
        {Array.from({ length: floors - 1 }).map((_, index) => (
          <mesh key={`floor-${index}`} position={[0, (index + 1) * floorHeight, 0]} castShadow receiveShadow>
            <boxGeometry args={[width + 0.6, 0.25, depth + 0.6]} />
            <meshStandardMaterial color={colors.parapet} roughness={0.5} />
          </mesh>
        ))}

        {/* Large 3D Windows with frames & reflection effect */}
        {Array.from({ length: floors }).map((_, floorIndex) => {
          const windowCount = Math.max(3, Math.floor(width / 4.5));
          return (
            <group key={`floor-${floorIndex}`}>
              {/* Front Windows with Depth Frame */}
              {[...Array(windowCount)].map((_, i) => {
                const posX = -width / 2 + (i + 1) * (width / (windowCount + 1));
                const posY = floorIndex * floorHeight + 2.1;
                const posZ = depth / 2 + 0.01;
                return (
                  <group key={`front-win-${i}`}>
                    {/* Glass Pane */}
                    <mesh position={[posX, posY, posZ + 0.02]} castShadow>
                      <boxGeometry args={[1.7, 1.9, 0.04]} />
                      <meshStandardMaterial color={colors.window} transparent opacity={0.8} roughness={0.05} metalness={0.9} />
                    </mesh>
                    {/* Premium Outer Window Frame */}
                    <mesh position={[posX, posY, posZ + 0.01]} castShadow>
                      <boxGeometry args={[1.85, 2.05, 0.08]} />
                      <meshStandardMaterial color="#1A1A1A" roughness={0.3} />
                    </mesh>
                  </group>
                );
              })}
            </group>
          );
        })}

        {/* Sophisticated Dual-Wing Main Entrance Door with Frame */}
        <group position={[0, 1.5, depth / 2 + 0.01]}>
          {/* Main Frame */}
          <mesh position={[0, 0, 0.04]} castShadow>
            <boxGeometry args={[2.3, 3.1, 0.12]} />
            <meshStandardMaterial color="#222222" roughness={0.5} />
          </mesh>
          {/* Timber Doors */}
          <mesh position={[0, 0, 0.06]} castShadow receiveShadow>
            <boxGeometry args={[2.1, 2.9, 0.08]} />
            <meshStandardMaterial color={colors.door} roughness={0.3} />
          </mesh>
          {/* Polished Metal Handles */}
          {[-0.15, 0.15].map((x, i) => (
            <mesh key={`handle-${i}`} position={[x, 0, 0.11]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.7, 8]} />
              <meshStandardMaterial color={materialType === "luxury" ? "#D4AF37" : "#EEEEEE"} metalness={0.9} roughness={0.1} />
            </mesh>
          ))}
        </group>

        {/* Premium Balconies with Steel-Glass Railings */}
        {Array.from({ length: floors - 1 }).map((_, index) => {
          const balconyY = (index + 1) * floorHeight + 0.1;
          const balconyZ = depth / 2 + 0.5;
          return (
            <group key={`balcony-${index}`} position={[0, balconyY, balconyZ]}>
              {/* Balcony Concrete Slab Base */}
              <mesh castShadow receiveShadow>
                <boxGeometry args={[width * 0.85, 0.2, 1.1]} />
                <meshStandardMaterial color={colors.parapet} roughness={0.6} />
              </mesh>
              {/* Semi-Transparent Glass Railing Panel */}
              <mesh position={[0, 0.6, 0.52]} castShadow>
                <boxGeometry args={[width * 0.83, 1.0, 0.05]} />
                <meshStandardMaterial color="#87CEEB" transparent opacity={0.5} roughness={0.1} />
              </mesh>
              {/* Top Guard Rail Post */}
              <mesh position={[0, 1.1, 0.52]} castShadow>
                <boxGeometry args={[width * 0.85, 0.06, 0.08]} />
                <meshStandardMaterial color={colors.balcony} metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Vertical Metal support posts */}
              {[-width * 0.4, -width * 0.2, 0, width * 0.2, width * 0.4].map((x, i) => (
                <mesh key={`post-${i}`} position={[x, 0.5, 0.52]} castShadow>
                  <cylinderGeometry args={[0.04, 0.04, 1.0, 8]} />
                  <meshStandardMaterial color={colors.balcony} metalness={0.8} roughness={0.2} />
                </mesh>
              ))}
            </group>
          );
        })}
      </group>

      {/* Main Roof Trim Base with wide eaves / overhangs */}
      <mesh position={[0, totalHeight + 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.9, 0.35, depth + 0.9]} />
        <meshStandardMaterial color={colors.roof} roughness={0.5} />
      </mesh>

      {/* Roof Architecture: Flat Terrace vs Robust Sloped Gable */}
      {roofStyle === "slope" ? (
        <group position={[0, totalHeight + 0.9, 0]}>
          {/* Left slope plane */}
          <mesh position={[-width * 0.25, 0.8, 0]} rotation={[0, 0, Math.PI / 6]} castShadow receiveShadow>
            <boxGeometry args={[width * 0.62, 0.25, depth + 0.6]} />
            <meshStandardMaterial color={colors.roof} roughness={0.4} />
          </mesh>
          {/* Right slope plane */}
          <mesh position={[width * 0.25, 0.8, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow receiveShadow>
            <boxGeometry args={[width * 0.62, 0.25, depth + 0.6]} />
            <meshStandardMaterial color={colors.roof} roughness={0.4} />
          </mesh>
          {/* Ridge cap */}
          <mesh position={[0, 1.5, 0]} castShadow>
            <boxGeometry args={[0.3, 0.15, depth + 0.7]} />
            <meshStandardMaterial color={colors.parapet} roughness={0.3} />
          </mesh>
          {includeSolar && (
            <mesh position={[width * 0.25, 0.95, 0]} rotation={[0, 0, -Math.PI / 6]}>
              <boxGeometry args={[width * 0.35, 0.04, depth * 0.35]} />
              <meshStandardMaterial color="#102540" roughness={0.1} metalness={0.8} />
            </mesh>
          )}
        </group>
      ) : (
        <group position={[0, totalHeight + 0.9, 0]}>
          {/* Penthouse structure */}
          <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
            <boxGeometry args={[width * 0.65, 1.6, depth * 0.65]} />
            <meshStandardMaterial color={colors.wall} roughness={0.7} />
          </mesh>
          
          {/* Slanted architectural roof top */}
          <mesh position={[0, 1.7, 0]} rotation={[0.06, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[width * 0.72, 0.25, depth * 0.72]} />
            <meshStandardMaterial color={colors.roof} roughness={0.4} />
          </mesh>

          {/* Solar Panels on the roof block */}
          {includeSolar && (
            <mesh position={[0, 1.84, 0]} rotation={[-0.03, 0, 0]}>
              <boxGeometry args={[width * 0.5, 0.04, depth * 0.4]} />
              <meshStandardMaterial color="#102540" roughness={0.1} metalness={0.8} />
            </mesh>
          )}

          {/* Brick chimney */}
          <mesh position={[width * 0.22, 1.6, -depth * 0.18]} castShadow>
            <boxGeometry args={[0.75, 2.5, 0.75]} />
            <meshStandardMaterial color="#A0522D" roughness={0.85} />
          </mesh>
          {/* Metal Cap of Chimney */}
          <mesh position={[width * 0.22, 2.85, -depth * 0.18]} castShadow>
            <boxGeometry args={[0.85, 0.08, 0.85]} />
            <meshStandardMaterial color="#222222" metalness={0.9} />
          </mesh>
        </group>
      )}

      {/* Rooftop Parapet wall protection */}
      <mesh position={[0, totalHeight + 1.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.8, 0.4, depth + 0.8]} />
        <meshStandardMaterial color={colors.parapet} roughness={0.7} />
      </mesh>

      {/* Spacious Dedicated Parking with high quality driveway */}
      {includeCar && (
        <group position={[width / 2 + 7.5, 0, -depth / 2 + 1]}>
          {/* Paving block driveway */}
          <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[13, 9]} />
            <meshStandardMaterial color="#444444" roughness={0.95} />
          </mesh>

          {/* Minimal White grid divider border lines */}
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[12.6, 8.6]} />
            <meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[12.4, 8.4]} />
            <meshStandardMaterial color="#3A3A3A" roughness={0.95} />
          </mesh>

          {/* Modern low-poly stylized cars and bikes */}
          <Car position={[-2.4, 0, 0.5]} color="#D32F2F" rotationY={Math.PI / 18} />
          <Car position={[2.4, 0, 1.8]} color="#1565C0" rotationY={-Math.PI / 12} />
          <Motorcycle position={[2.8, 0, -2.4]} color="#FBC02D" rotationY={Math.PI / 6} />
          <Motorcycle position={[-2.8, 0, -2.4]} color="#388E3C" rotationY={-Math.PI / 8} />
        </group>
      )}

      {/* Compound Boundary Wall */}
      {includeCompound && (
        <>
          <group position={[0, 0, 0]}>
            {/* Left Gate Wall */}
            <mesh position={[-groundSize / 3.8, 1.2, depth + 6]} castShadow receiveShadow>
              <boxGeometry args={[groundSize / 2.6, 2.4, 0.35]} />
              <meshStandardMaterial color={colors.foundation} roughness={0.7} />
            </mesh>
            {/* Right Gate Wall */}
            <mesh position={[groundSize / 3.8, 1.2, depth + 6]} castShadow receiveShadow>
              <boxGeometry args={[groundSize / 2.6, 2.4, 0.35]} />
              <meshStandardMaterial color={colors.foundation} roughness={0.7} />
            </mesh>
            {/* Premium Pillars flanking the Entry gate */}
            {[-3.2, 3.2].map((x, i) => (
              <mesh key={`gate-pil-${i}`} position={[x, 1.5, depth + 6]} castShadow receiveShadow>
                <boxGeometry args={[0.7, 3.0, 0.7]} />
                <meshStandardMaterial color={colors.foundation} roughness={0.4} metalness={0.2} />
              </mesh>
            ))}
          </group>
          {/* Side boundary walls */}
          <mesh position={[-groundSize / 2.3, 1.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.35, 2.4, groundSize * 0.75]} />
            <meshStandardMaterial color={colors.foundation} roughness={0.7} />
          </mesh>
          <mesh position={[groundSize / 2.3, 1.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.35, 2.4, groundSize * 0.75]} />
            <meshStandardMaterial color={colors.foundation} roughness={0.7} />
          </mesh>
        </>
      )}

      {/* Luxury Swimming Pool with water refraction & wooden sun-deck */}
      {includePool && (
        <group position={[-width - 7, 0, 1]}>
          {/* Wooden deck */}
          <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[11, 7]} />
            <meshStandardMaterial color="#8B5A2B" roughness={0.5} />
          </mesh>
          {/* Blue pool base basin */}
          <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[9, 0.8, 5]} />
            <meshStandardMaterial color="#005A9C" roughness={0.4} />
          </mesh>
          {/* Water reflection layer */}
          <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[8.4, 4.4]} />
            <meshStandardMaterial color="#40E0D0" transparent opacity={0.65} roughness={0.01} metalness={0.9} />
          </mesh>
        </group>
      )}

      {/* Fully Landscaped Garden with dynamic organic greenery */}
      <group>
        {/* Premium stylized tall palm / pine trees */}
        {(
          [
            [-width - 8, 0, -depth - 6] as [number, number, number],
            [width + 9, 0, depth + 8] as [number, number, number],
            [-width - 7, 0, depth + 9] as [number, number, number],
            [width + 8, 0, -depth - 9] as [number, number, number],
            [-groundSize / 3.4, 0, -groundSize / 3.4] as [number, number, number],
            [groundSize / 3.4, 0, groundSize / 3.4] as [number, number, number]
          ]
        ).map((pos, i) => (
          <group key={`land-tree-${i}`} position={pos}>
            {/* Trunk */}
            <mesh position={[0, 2.5, 0]} castShadow>
              <cylinderGeometry args={[0.24, 0.38, 5, 8]} />
              <meshStandardMaterial color="#4A2F13" roughness={0.9} />
            </mesh>
            {/* Top Foliage: Multi-layered pine tree style */}
            {[5, 6.2, 7.4].map((y, l) => (
              <mesh key={`foliage-${l}`} position={[0, y, 0]} castShadow>
                <coneGeometry args={[1.8 - l * 0.4, 2.0, 10]} />
                <meshStandardMaterial color={l % 2 === 0 ? "#1C542D" : "#246B3A"} roughness={0.9} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Beautiful vibrant flower beds surrounding the pathway */}
        {(
          [
            [-width - 1.5, 0, -depth - 2] as [number, number, number],
            [width + 1.5, 0, depth + 2] as [number, number, number],
            [-width - 1.5, 0, depth + 2] as [number, number, number],
            [width + 1.5, 0, -depth - 2] as [number, number, number],
            [-width - 2.5, 0, 1] as [number, number, number],
            [width + 2.5, 0, -1] as [number, number, number]
          ]
        ).map((pos, i) => (
          <group key={`land-flower-${i}`} position={pos}>
            {/* Dark organic soil base */}
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <circleGeometry args={[1.3, 16]} />
              <meshStandardMaterial color="#3D2B1F" roughness={0.9} />
            </mesh>
            {/* Lush vibrant flowers */}
            {[...Array(6)].map((_, j) => {
              const angle = (j / 6) * Math.PI * 2;
              const fx = Math.cos(angle) * 0.8;
              const fz = Math.sin(angle) * 0.8;
              return (
                <group key={`fl-${j}`} position={[fx, 0.1, fz]}>
                  <mesh position={[0, 0.25, 0]} castShadow>
                    <cylinderGeometry args={[0.03, 0.03, 0.5, 6]} />
                    <meshStandardMaterial color="#2E7D32" />
                  </mesh>
                  <mesh position={[0, 0.55, 0]} castShadow>
                    <sphereGeometry args={[0.24, 8, 8]} />
                    <meshStandardMaterial color={i % 3 === 0 ? "#E91E63" : i % 3 === 1 ? "#FFEB3B" : "#9C27B0"} roughness={0.3} />
                  </mesh>
                </group>
              );
            })}
          </group>
        ))}

        {/* Manicured round boxwood shrubs */}
        {(
          [
            [-width - 3.5, 0, -depth - 4] as [number, number, number],
            [width + 3.5, 0, depth + 4] as [number, number, number],
            [-width - 4, 0, depth + 4] as [number, number, number],
            [width + 4, 0, -depth - 4] as [number, number, number],
            [0, 0, -depth - 4] as [number, number, number],
            [0, 0, depth + 4.5] as [number, number, number]
          ]
        ).map((pos, i) => (
          <mesh key={`land-bush-${i}`} position={pos} castShadow>
            <sphereGeometry args={[0.9, 12, 12]} />
            <meshStandardMaterial color="#2E7D32" roughness={0.9} />
          </mesh>
        ))}

        {/* Glowing Garden Lamp Posts */}
        {(
          [
            [-3.5, 0, depth + 4.5] as [number, number, number],
            [3.5, 0, depth + 4.5] as [number, number, number],
            [-width / 2 - 3, 0, 0] as [number, number, number],
            [width / 2 + 3, 0, 0] as [number, number, number]
          ]
        ).map((pos, i) => (
          <group key={`lamp-${i}`} position={pos}>
            {/* Metallic black post */}
            <mesh position={[0, 1.1, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.08, 2.2, 8]} />
              <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Glass lantern bulb */}
            <mesh position={[0, 2.3, 0]} castShadow>
              <sphereGeometry args={[0.22, 12, 12]} />
              <meshBasicMaterial color="#FFFFDD" />
            </mesh>
            {/* Dynamic light emission */}
            <pointLight position={[0, 2.3, 0]} color="#FFEECC" intensity={1.5} distance={15} decay={2.0} castShadow />
          </group>
        ))}

        {/* Polished stone pathway leading to entrance */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, depth / 2 + 3.2]} receiveShadow>
          <planeGeometry args={[2.5, 6.4]} />
          <meshStandardMaterial color={materialType === "luxury" ? "#BCAAA4" : "#9E9E9E"} roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

export default function House3D({ 
  area, 
  floors, 
  materialType = "standard", 
  cameraAngle = "isometric", 
  timeOfDay = "day",
  customWallColor,
  customRoofColor,
  includeCar = true,
  includeSolar = true,
  includeCompound = true,
  includePool = true,
  roofStyle = "terrace"
}: House3DProps) {
  const getCameraPosition = (): [number, number, number] => {
    switch(cameraAngle) {
      case "front": return [0, 6, 28];
      case "top": return [0, 38, 0.1];
      case "side": return [28, 6, 0];
      default: return [22, 13, 22]; // isometric
    }
  };

  const getLighting = () => {
    switch(timeOfDay) {
      case "sunset":
        return {
          ambient: 0.45,
          sunPos: [35, 10, 20] as [number, number, number],
          sunIntensity: 1.2,
          sunColor: "#FFB07A",
          skyColor: "#FF7F50",
          groundColor: "#4A3525"
        };
      case "night":
        return {
          ambient: 0.15,
          sunPos: [15, 25, 15] as [number, number, number],
          sunIntensity: 0.3,
          sunColor: "#A0C4FF",
          skyColor: "#0B132B",
          groundColor: "#1C2541"
        };
      default: // day
        return {
          ambient: 0.6,
          sunPos: [24, 30, 24] as [number, number, number],
          sunIntensity: 1.4,
          sunColor: "#FFFFFF",
          skyColor: "#87CEEB",
          groundColor: "#3D5334"
        };
    }
  };

  const lighting = getLighting();
  const camPos = getCameraPosition();

  return (
    <div className="w-full h-full min-h-[500px] rounded-2xl overflow-hidden glass relative group/canvas border border-white/10 shadow-2xl">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={camPos} fov={38} />
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          minDistance={8}
          maxDistance={70} 
          target={[0, 4, 0]}
          maxPolarAngle={Math.PI / 2 - 0.02} 
        />
        
        <ambientLight intensity={lighting.ambient} />
        
        <directionalLight 
          position={lighting.sunPos} 
          intensity={lighting.sunIntensity} 
          color={lighting.sunColor}
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={100}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
          shadow-bias={-0.0005}
        />
        
        <pointLight position={[-15, 12, -15]} intensity={0.4} />
        
        <hemisphereLight intensity={0.4} color={lighting.skyColor} groundColor={lighting.groundColor} />
        
        <HouseModel 
          area={area} 
          floors={floors} 
          materialType={materialType} 
          customWallColor={customWallColor}
          customRoofColor={customRoofColor}
          includeCar={includeCar}
          includeSolar={includeSolar}
          includeCompound={includeCompound}
          includePool={includePool}
          roofStyle={roofStyle}
        />
      </Canvas>
    </div>
  );
}
