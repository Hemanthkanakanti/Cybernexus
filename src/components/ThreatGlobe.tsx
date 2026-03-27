import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Sphere, Html } from "@react-three/drei";
import * as THREE from "three";
import type { ThreatEvent } from "@/lib/mockData";

const levelColors: Record<string, string> = {
  critical: "#ff1744",
  high: "#ff6d00",
  medium: "#ffab00",
  low: "#00e676",
};

const EARTH_TEXTURE = "https://unpkg.com/three-globe@2.41.12/example/img/earth-night.jpg";
const EARTH_TOPO = "https://unpkg.com/three-globe@2.41.12/example/img/earth-topology.png";

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

// Attack arc between two points on the globe
function AttackArc({ from, to, color, globeRef }: {
  from: THREE.Vector3; to: THREE.Vector3; color: string;
  globeRef: React.RefObject<THREE.Mesh | null>;
}) {
  const lineRef = useRef<THREE.Line>(null);
  const progressRef = useRef(0);

  const curve = useMemo(() => {
    const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(2.8); // arc height
    return new THREE.QuadraticBezierCurve3(from, mid, to);
  }, [from, to]);

  useFrame((_, delta) => {
    if (!lineRef.current || !globeRef.current) return;
    progressRef.current = (progressRef.current + delta * 0.4) % 1;
    lineRef.current.rotation.y = globeRef.current.rotation.y;

    const geo = lineRef.current.geometry as THREE.BufferGeometry;
    const points = curve.getPoints(40);
    const visibleCount = Math.floor(progressRef.current * 40);
    const positions = new Float32Array(visibleCount * 3);
    for (let i = 0; i < visibleCount; i++) {
      positions[i * 3] = points[i].x;
      positions[i * 3 + 1] = points[i].y;
      positions[i * 3 + 2] = points[i].z;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <line ref={lineRef as any}>
      <bufferGeometry />
      <lineBasicMaterial color={color} transparent opacity={0.6} linewidth={1} />
    </line>
  );
}

function EarthGlobe({ globeRef }: { globeRef: React.RefObject<THREE.Mesh | null> }) {
  const colorMap = useLoader(THREE.TextureLoader, EARTH_TEXTURE);
  const bumpMap = useLoader(THREE.TextureLoader, EARTH_TOPO);

  useFrame((_, delta) => {
    if (globeRef.current) globeRef.current.rotation.y += delta * 0.04;
  });

  return (
    <Sphere ref={globeRef} args={[2, 64, 64]}>
      <meshPhongMaterial
        map={colorMap}
        bumpMap={bumpMap}
        bumpScale={0.04}
        specular={new THREE.Color("#0d47a1")}
        shininess={12}
        emissive={new THREE.Color("#001529")}
        emissiveIntensity={0.15}
      />
    </Sphere>
  );
}

function Atmosphere() {
  return (
    <Sphere args={[2.08, 64, 64]}>
      <shaderMaterial
        transparent
        side={THREE.BackSide}
        vertexShader={`
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 5.0);
            gl_FragColor = vec4(0.15, 0.65, 1.0, intensity * 0.5);
          }
        `}
      />
    </Sphere>
  );
}

function ThreatMarker({ threat, globeRef }: { threat: ThreatEvent; globeRef: React.RefObject<THREE.Mesh | null> }) {
  const pos = latLngToVector3(threat.lat, threat.lng, 2.04);
  const color = levelColors[threat.level];
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || !globeRef.current) return;
    const rot = globeRef.current.rotation.y;
    const rotatedPos = pos.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), rot);
    meshRef.current.position.copy(rotatedPos);
    meshRef.current.lookAt(0, 0, 0);

    if (ringRef.current) {
      ringRef.current.position.copy(rotatedPos);
      ringRef.current.lookAt(0, 0, 0);
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2.5 + threat.lat) * 0.5;
      ringRef.current.scale.setScalar(scale);
    }
    if (glowRef.current) {
      glowRef.current.position.copy(rotatedPos);
      glowRef.current.lookAt(0, 0, 0);
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 4 + threat.lng) * 0.3;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  const markerSize = threat.level === "critical" ? 0.05 : threat.level === "high" ? 0.04 : 0.03;

  return (
    <group>
      {/* Outer glow */}
      <mesh ref={glowRef} position={pos}>
        <sphereGeometry args={[markerSize * 2.5, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>

      {/* Pulsing ring */}
      <mesh ref={ringRef} position={pos}>
        <ringGeometry args={[markerSize * 1.5, markerSize * 2, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Core marker */}
      <mesh ref={meshRef} position={pos}
        onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <sphereGeometry args={[markerSize, 16, 16]} />
        <meshBasicMaterial color={color} />
        {hovered && (
          <Html distanceFactor={7} style={{ pointerEvents: "none" }}>
            <div className="bg-card/95 backdrop-blur-md border border-primary/40 rounded-lg px-3 py-2 min-w-[180px] shadow-xl shadow-primary/20">
              <p className="text-xs font-mono font-bold text-foreground">{threat.name}</p>
              <p className="text-[10px] font-mono text-muted-foreground">{threat.country}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: color, color: "#fff" }}>
                  {threat.level.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">{threat.type}</span>
              </div>
              <p className="text-[11px] font-mono mt-1" style={{ color }}>
                {threat.attacks.toLocaleString()} attacks
              </p>
            </div>
          </Html>
        )}
      </mesh>
    </group>
  );
}

function GlobeScene({ threats }: { threats: ThreatEvent[] }) {
  const globeRef = useRef<THREE.Mesh>(null);

  // Generate attack arcs between random threat pairs
  const arcs = useMemo(() => {
    const result: { from: THREE.Vector3; to: THREE.Vector3; color: string }[] = [];
    const criticalThreats = threats.filter((t) => t.level === "critical" || t.level === "high");
    for (let i = 0; i < Math.min(criticalThreats.length, 6); i++) {
      const fromT = criticalThreats[i];
      const toT = threats[(i + 3) % threats.length];
      if (fromT && toT && fromT.id !== toT.id) {
        result.push({
          from: latLngToVector3(fromT.lat, fromT.lng, 2.04),
          to: latLngToVector3(toT.lat, toT.lng, 2.04),
          color: levelColors[fromT.level],
        });
      }
    }
    return result;
  }, [threats]);

  return (
    <>
      <ambientLight intensity={0.12} />
      <directionalLight position={[5, 3, 5]} intensity={1.4} color="#b3d4fc" />
      <pointLight position={[-6, -3, -5]} intensity={0.4} color="#ff1744" />
      <pointLight position={[3, 5, -3]} intensity={0.2} color="#00bcd4" />

      <Atmosphere />
      <EarthGlobe globeRef={globeRef} />

      {threats.map((t) => (
        <ThreatMarker key={t.id} threat={t} globeRef={globeRef} />
      ))}

      {arcs.map((arc, i) => (
        <AttackArc key={i} from={arc.from} to={arc.to} color={arc.color} globeRef={globeRef} />
      ))}

      <OrbitControls enableZoom enablePan={false} minDistance={3} maxDistance={8} autoRotate autoRotateSpeed={0.3} enableDamping dampingFactor={0.1} rotateSpeed={0.8} />
    </>
  );
}

export default function ThreatGlobe({ threats }: { threats: ThreatEvent[] }) {
  return (
    <div className="w-full h-[520px] rounded-xl overflow-hidden relative">
      <Canvas camera={{ position: [0, 0.8, 4.5], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <GlobeScene threats={threats} />
      </Canvas>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex gap-3 bg-card/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50">
        {(["critical", "high", "medium", "low"] as const).map((level) => (
          <div key={level} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ backgroundColor: levelColors[level], boxShadow: `0 0 8px ${levelColors[level]}` }} />
            <span className="text-[10px] font-mono text-muted-foreground uppercase">{level}</span>
          </div>
        ))}
      </div>

      {/* Attack count overlay */}
      <div className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50">
        <p className="text-[10px] font-mono text-muted-foreground">TRACKING</p>
        <p className="text-lg font-mono font-bold text-primary">{threats.length} <span className="text-xs text-muted-foreground">sources</span></p>
      </div>
    </div>
  );
}
