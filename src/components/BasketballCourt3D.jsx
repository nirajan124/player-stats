import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Text } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

function Court() {
  return (
    <group>
      {/* Court Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[94, 50]} />
        <meshStandardMaterial color="#ff6b35" />
      </mesh>

      {/* Court Lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[94, 50]} />
        <meshStandardMaterial color="#1a1a1a" transparent opacity={0.1} />
      </mesh>

      {/* Center Circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0, 6, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Free Throw Line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -19]}>
        <planeGeometry args={[12, 0.2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Three Point Arc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[23.75, 24, 64, 1, 0, Math.PI]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>

      {/* Hoop */}
      <mesh position={[0, 10, -47]}>
        <cylinderGeometry args={[0.75, 0.75, 0.1]} />
        <meshStandardMaterial color="#ff6b35" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Backboard */}
      <mesh position={[0, 10, -47.5]} rotation={[0, 0, 0]}>
        <boxGeometry args={[6, 3.5, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function PerformanceZone({ position, intensity, label }) {
  const color = useMemo(() => {
    if (intensity > 0.7) return "#00ff00";
    if (intensity > 0.4) return "#ffff00";
    return "#ff0000";
  }, [intensity]);

  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={intensity * 0.6}
          emissive={color}
          emissiveIntensity={intensity}
        />
      </mesh>
      {label && (
        <Text
          position={[0, 0.1, 0]}
          fontSize={1}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  );
}

export default function BasketballCourt3D({ player }) {
  if (!player) return null;

  // Generate performance zones based on player stats
  const zones = useMemo(() => {
    const ppg = player.pointsPerGame / 35; // Normalize
    const fg = player.fieldGoalPercentage / 100;
    const threeP = player.threePointPercentage / 100;

    return [
      { position: [-15, 0.1, -20], intensity: ppg, label: "Paint" },
      { position: [15, 0.1, -20], intensity: ppg, label: "Paint" },
      { position: [-25, 0.1, -15], intensity: fg, label: "Mid" },
      { position: [25, 0.1, -15], intensity: fg, label: "Mid" },
      { position: [-30, 0.1, 0], intensity: threeP, label: "3PT" },
      { position: [30, 0.1, 0], intensity: threeP, label: "3PT" },
      { position: [0, 0.1, -25], intensity: (ppg + fg) / 2, label: "Key" },
    ];
  }, [player]);

  return (
    <div className="bg-gray-900 rounded-xl shadow-2xl p-4" style={{ height: "600px" }}>
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        🏀 3D Performance Court - {player.name}
      </h3>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 60, 80]} fov={50} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[0, 20, 0]} intensity={0.5} />
        <Court />
        {zones.map((zone, idx) => (
          <PerformanceZone key={idx} {...zone} />
        ))}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={50}
          maxDistance={150}
        />
      </Canvas>
      <div className="mt-4 flex justify-center gap-4 text-white text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span>High Performance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <span>Medium Performance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span>Low Performance</span>
        </div>
      </div>
    </div>
  );
}

