import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, useAnimations } from "@react-three/drei";
import Loader from "../Loader";


const Character = ({ isMobile }) => {
  const group = useRef();
  const { scene, animations } = useGLTF("/ace/Avcve.glb"); // Animated GLB
  const { actions } = useAnimations(animations, group);

  // Rotate character (optional, works with animation)
  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * (isMobile ? 0.3 : 0.5);
    }
  });

  // Play first animation automatically
  useEffect(() => {
    if (actions && animations.length > 0) {
      actions[animations[0].name].play();
    }
  }, [actions, animations]);

  return (
    <group
      ref={group}
      scale={isMobile ? 2.0 : 1.5}
      position={isMobile ? [0, -3.0, 0] : [0, -2.5, 0]}
    >
      <primitive object={scene} />

      {/* Lighting */}
      <ambientLight intensity={1.6} />
      <hemisphereLight intensity={0.6} groundColor="black" />
      {!isMobile && (
        <>
          <pointLight intensity={5} position={[0, 3, 0]} />
          <pointLight intensity={5} position={[0, 1, 5]} />
        </>
      )}
    </group>
  );
};

const CharacterCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Canvas
        dpr={[1, isMobile ? 1 : 2]}
        shadows={!isMobile}
        camera={{
          position: isMobile ? [0, 0.5, 6.0] : [0, 0.5, 5.5],
          fov: isMobile ? 40 : 30,
        }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true,
        }}
      >
        <Suspense fallback={<Loader />}>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={isMobile ? 1.2 : 2}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={0}
            target={isMobile ? [0, -1.3, 0] : [0, -0.9, 0]}
          />

          <Character isMobile={isMobile} />
        </Suspense>

        <Preload all />
      </Canvas>
    </div>
  );
};

export default CharacterCanvas;
