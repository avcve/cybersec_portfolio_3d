import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { TextureLoader, CanvasTexture, LinearFilter, ClampToEdgeWrapping, MathUtils, Vector3, Color, DoubleSide, Matrix4 } from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// Constants from reference
const NUM_INSTANCES = 20;
const RADIUS = 6.0;
const PLANE_WIDTH = 6.0;
const PLANE_HEIGHT = 2.7;
const PLANE_SEGMENTS_X = 40;
const PLANE_SEGMENTS_Y = 20;
const IMAGES_PER_TURN = 7;
const SPIRAL_STEP = 0.8;

// Shaders
const vertexShader = `
  uniform float uRadius;
  uniform float uScrollOffset;
  uniform float uTotalHeight;
  uniform float uTime;
  uniform float uScale;
  uniform float uCurvature;
  uniform float uRotation;
  uniform float uSqueezeAmount;
  uniform float uSqueezeWidth;

  attribute float aAngleOffset;
  attribute float aPositionY;
  attribute float aTextureIndex;
  attribute float aActive;

  varying vec2 vUv;
  varying float vTextureIndex;
  varying float vDepthFade;
  varying float vWorldY;
  varying float vActive;

  void main() {
    vUv = uv;
    vTextureIndex = aTextureIndex;
    vActive = aActive;

    vec3 scaled = position * uScale;

    float scrolledY = aPositionY + uScrollOffset;
    scrolledY = mod(scrolledY + uTotalHeight * 0.5, uTotalHeight) - uTotalHeight * 0.5;

    float y = scrolledY + scaled.y;

    float squeezeGauss = exp(-(y * y) / (uSqueezeWidth * uSqueezeWidth));
    float squeezedRadius = uRadius * (1.0 - uSqueezeAmount * squeezeGauss);

    float angle = aAngleOffset + uRotation;

    float theta = scaled.x / (squeezedRadius * uCurvature);
    float finalAngle = angle + theta;

    float x = sin(finalAngle) * squeezedRadius;
    float z = cos(finalAngle) * squeezedRadius;

    vDepthFade = smoothstep(-squeezedRadius, squeezedRadius * 0.5, z);
    vWorldY = y;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(x, y, z, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uAtlas;
  uniform float uAtlasCols;
  uniform float uAtlasRows;
  uniform float uUniqueCount;
  uniform float uTime;

  uniform float uChromaticAberration;
  uniform float uOpacity;
  uniform float uSaturation;
  uniform float uBrightness;
  uniform float uEmission;
  uniform float uScanLines;
  uniform float uScanLineSpeed;
  uniform float uScanLineDensity;

  uniform float uDistanceFadeStart;
  uniform float uDistanceFadeEnd;

  uniform float uFlickerIntensity;
  uniform float uFlickerSpeed;

  uniform float uBorderWidth;
  uniform vec3 uBorderColor;
  uniform float uBorderEmission;
  uniform float uBorderRadius;
  uniform float uBorderOffset;

  uniform float uCornerSize;
  uniform float uCornerWidth;
  uniform float uCornerOffset;

  uniform int uDitherEnabled;
  uniform float uDitherCellSize;
  uniform float uDitherGap;
  uniform float uDitherContrast;
  uniform int uDitherMode;
  uniform int uDitherShape;
  uniform float uDitherBaseScale;
  uniform float uDitherIntensity;
  uniform vec3 uDitherBgColor;
  uniform vec3 uDitherFgColor;
  uniform int uDitherUseColor;
  uniform float uDitherAspect;
  uniform int uMode; // 0 = cybersec, 1 = color

  varying vec2 vUv;
  varying float vTextureIndex;
  varying float vDepthFade;
  varying float vWorldY;
  varying float vActive;

  #define PI 3.14159265359

  vec2 getTileUV(vec2 localUV) {
    float idx = floor(vTextureIndex + 0.5);
    float col = mod(idx, uAtlasCols);
    float row = floor(idx / uAtlasCols);
    float tileU = (col + localUV.x) / uAtlasCols;
    float tileV = 1.0 - (row + 1.0 - localUV.y) / uAtlasRows;
    return vec2(tileU, tileV);
  }

  float sdRoundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  float sdCircle(vec2 p, float r) { return length(p) - r; }
  float sdBox(vec2 p, vec2 b) { vec2 d = abs(p) - b; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0); }

  float getLuma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
  mat2 rotate2d(float angle) { return mat2(cos(angle), -sin(angle), sin(angle), cos(angle)); }

  vec3 ditherSampleColor(vec2 cellCenterUV, float cellSize) {
    vec2 d = vec2(1.0 / 64.0) * cellSize * 0.25;
    vec3 c1 = texture2D(uAtlas, getTileUV(cellCenterUV)).rgb;
    vec3 c2 = texture2D(uAtlas, getTileUV(cellCenterUV + vec2(d.x, d.y))).rgb;
    vec3 c3 = texture2D(uAtlas, getTileUV(cellCenterUV + vec2(-d.x, d.y))).rgb;
    vec3 c4 = texture2D(uAtlas, getTileUV(cellCenterUV + vec2(d.x, -d.y))).rgb;
    vec3 c5 = texture2D(uAtlas, getTileUV(cellCenterUV + vec2(-d.x, -d.y))).rgb;
    return (c1 + c2 + c3 + c4 + c5) / 5.0;
  }

  vec4 applyDither(vec2 localUV) {
    float aspect = uDitherAspect;
    vec2 pixelUV = localUV;
    pixelUV.x *= aspect;

    float cellsCountY = 1.0 / (uDitherCellSize / 100.0);
    vec2 currentCellIndex = floor(pixelUV * cellsCountY);

    float globalMinDist = 100.0;
    float maxPriority = -1.0;
    vec3 finalShapeColor = vec3(0.0);
    float aa = 2.0 / (uDitherCellSize / 100.0 * 100.0);

    for (float y = -2.0; y <= 2.0; y++) {
      for (float x = -2.0; x <= 2.0; x++) {
        vec2 neighborIndex = currentCellIndex + vec2(x, y);
        vec2 neighborCenterUV = (neighborIndex + 0.5) / cellsCountY;
        neighborCenterUV.x /= aspect;

        if (neighborCenterUV.x < 0.0 || neighborCenterUV.x > 1.0 ||
            neighborCenterUV.y < 0.0 || neighborCenterUV.y > 1.0) continue;

        vec3 col = ditherSampleColor(neighborCenterUV, uDitherCellSize / 100.0);

        float contrastFactor = (1.015 * (uDitherContrast + 1.0)) / (1.0 * (1.015 - uDitherContrast));
        col = clamp(contrastFactor * (col - 0.5) + 0.5, 0.0, 1.0);

        float luma = getLuma(col);

        float scaleX = uDitherBaseScale;
        float scaleY = uDitherBaseScale;

        if (uDitherMode == 2) {
          scaleX = scaleY = (1.0 - luma) * uDitherBaseScale * 1.5;
        }

        vec2 cellCenter = (neighborIndex + 0.5) / cellsCountY;
        vec2 p = pixelUV - cellCenter;
        p *= cellsCountY;

        float gapFactor = 1.0 - (uDitherGap / uDitherCellSize);
        if (scaleX < 0.001 || scaleY < 0.001) continue;
        float effSize = 0.5 * gapFactor;

        float d = 1.0;
        if (uDitherShape == 0) d = sdCircle(p, effSize * scaleX);
        else if (uDitherShape == 1) d = sdBox(p, vec2(effSize * scaleX, effSize * scaleY));

        globalMinDist = min(globalMinDist, d);

        if (d < aa) {
          if (luma > maxPriority) {
            maxPriority = luma;
            finalShapeColor = (uDitherUseColor == 1) ? col : uDitherFgColor;
          }
        }
      }
    }

    float mask = 1.0 - smoothstep(0.0, aa, globalMinDist);
    vec3 result = mix(uDitherBgColor, finalShapeColor, mask);
    return vec4(result, mask);
  }

  float cornerMask(vec2 uv, float cornerLen, float lineW, float offset) {
    float mask = 0.0;
    float o = offset;

    // Bottom-left
    if (uv.x >= o && uv.x < o + cornerLen && uv.y >= o && uv.y < o + lineW) mask = 1.0;
    if (uv.x >= o && uv.x < o + lineW && uv.y >= o && uv.y < o + cornerLen) mask = 1.0;
    // Bottom-right
    if (uv.x > 1.0 - o - cornerLen && uv.x <= 1.0 - o && uv.y >= o && uv.y < o + lineW) mask = 1.0;
    if (uv.x > 1.0 - o - lineW && uv.x <= 1.0 - o && uv.y >= o && uv.y < o + cornerLen) mask = 1.0;
    // Top-left
    if (uv.x >= o && uv.x < o + cornerLen && uv.y > 1.0 - o - lineW && uv.y <= 1.0 - o) mask = 1.0;
    if (uv.x >= o && uv.x < o + lineW && uv.y > 1.0 - o - cornerLen && uv.y <= 1.0 - o) mask = 1.0;
    // Top-right
    if (uv.x > 1.0 - o - cornerLen && uv.x <= 1.0 - o && uv.y > 1.0 - o - lineW && uv.y <= 1.0 - o) mask = 1.0;
    if (uv.x > 1.0 - o - lineW && uv.x <= 1.0 - o && uv.y > 1.0 - o - cornerLen && uv.y <= 1.0 - o) mask = 1.0;

    return mask;
  }

  void main() {
    vec2 centered = vUv - 0.5;
    vec2 halfSize = vec2(0.5);
    float aa = 0.005;

    float imgDist = sdRoundedBox(centered, halfSize, uBorderRadius);
    float imageMask = 1.0 - smoothstep(-aa, aa, imgDist);

    vec2 borderHalfSize = halfSize - uBorderOffset;
    float borderDist = sdRoundedBox(centered, borderHalfSize, uBorderRadius);
    float outerEdge = 1.0 - smoothstep(-aa, aa, borderDist);
    float innerEdge = 1.0 - smoothstep(-aa, aa, borderDist + uBorderWidth);
    float borderMask = outerEdge - innerEdge;
    borderMask = clamp(borderMask, 0.0, 1.0);

    float caStrength = uChromaticAberration * (0.3 + 0.7 * (1.0 - vDepthFade));
    if (uMode == 0) {
      caStrength *= (1.0 - vActive * 0.85);
    } else {
      caStrength *= 0.35;
    }
    vec2 caOffset = vec2(caStrength, 0.0);

    vec2 uvCenter = getTileUV(vUv);
    vec2 uvR = getTileUV(vUv + caOffset);
    vec2 uvB = getTileUV(vUv - caOffset);

    float r = texture2D(uAtlas, uvR).r;
    float g = texture2D(uAtlas, uvCenter).g;
    float b = texture2D(uAtlas, uvB).b;

    vec3 color = vec3(r, g, b);

    float ditherAlpha = 1.0;
    if (uMode == 0) {
      if (uDitherEnabled == 1) {
        vec4 dithered = applyDither(vUv);
        color = dithered.rgb;
        ditherAlpha = dithered.a;
      }
    }

    float lum = getLuma(color);
    if (uMode == 1) {
      color = mix(vec3(lum), color, uSaturation);
    }
    
    float brightnessFactor = uBrightness;
    if (uMode == 0) {
      brightnessFactor = uBrightness * (1.0 + vActive * 0.25);
    }
    color *= brightnessFactor;

    if (uScanLines > 0.0) {
      float scanLine = sin((vWorldY * uScanLineDensity + uTime * uScanLineSpeed) * 3.14159) * 0.5 + 0.5;
      float scanlineStrength = uScanLines;
      if (uMode == 0) {
        scanlineStrength *= (1.0 - vActive * 0.85);
      } else {
        scanlineStrength *= (1.0 - vActive * 0.45);
      }
      color *= 1.0 - scanlineStrength * (1.0 - scanLine) * 0.3;
    }

    float darkening = smoothstep(0.0, 0.5, vDepthFade);
    color *= mix(0.15, 1.0, darkening);

    color += color * uEmission;

    float imageAlpha = imageMask;
    if (uMode == 0 && uDitherEnabled == 1) {
      imageAlpha *= ditherAlpha;
    }

    vec3 borderGlow = uBorderColor * (1.0 + uBorderEmission);
    color = mix(color, borderGlow, borderMask);

    float corners = cornerMask(vUv, uCornerSize, uCornerWidth, uCornerOffset);
    color = mix(color, borderGlow, corners);

    float distFade = 1.0 - smoothstep(uDistanceFadeStart, uDistanceFadeEnd, abs(vWorldY));

    float flicker = 1.0;
    if (uFlickerIntensity > 0.0) {
      float t = uTime * uFlickerSpeed;
      float f1 = sin(t * 13.0) * 0.5 + 0.5;
      float f2 = sin(t * 37.0 + 1.7) * 0.5 + 0.5;
      float f3 = sin(t * 59.0 + 4.1) * 0.5 + 0.5;
      float combined = f1 * f2 + f3 * 0.3;
      float glitchSeed = fract(sin(floor(t * 8.0)) * 43758.5453);
      float glitch = step(0.92, glitchSeed);
      combined = mix(combined, 0.1, glitch);
      flicker = 1.0 - uFlickerIntensity * (1.0 - clamp(combined, 0.3, 1.0));
    }

    float finalAlpha = max(imageAlpha, max(borderMask, corners));
    gl_FragColor = vec4(color * flicker, finalAlpha * uOpacity * distFade);
  }
`;

// Helper texture hook
function useTextureAtlas(images) {
  const atlasCanvasRef = useRef(null);
  const uniqueImages = useMemo(() => Array.from(new Set(images)), [images]);
  const indexMap = useMemo(() => {
    return images.map((img) => uniqueImages.indexOf(img));
  }, [images, uniqueImages]);

  const textures = useLoader(TextureLoader, uniqueImages);

  const { atlas, cols, rows } = useMemo(() => {
    const count = uniqueImages.length;
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);

    const tileW = textures[0]?.image?.width || 512;
    const tileH = textures[0]?.image?.height || 512;
    const padding = 2;

    const canvasW = cols * (tileW + padding);
    const canvasH = rows * (tileH + padding);

    const canvas =
      typeof OffscreenCanvas !== "undefined"
        ? new OffscreenCanvas(canvasW, canvasH)
        : document.createElement("canvas");

    if ("width" in canvas) {
      canvas.width = canvasW;
      canvas.height = canvasH;
    }

    const ctx = canvas.getContext("2d");
    if (ctx) {
      for (let i = 0; i < count; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = col * (tileW + padding);
        const y = row * (tileH + padding);
        const img = textures[i]?.image;
        if (img) {
          ctx.drawImage(img, x, y, tileW, tileH);
        }
      }
    }

    const atlasTexture = new CanvasTexture(canvas);
    atlasTexture.minFilter = LinearFilter;
    atlasTexture.magFilter = LinearFilter;
    atlasTexture.wrapS = ClampToEdgeWrapping;
    atlasTexture.wrapT = ClampToEdgeWrapping;
    atlasTexture.needsUpdate = true;

    atlasCanvasRef.current = canvas;

    return { atlas: atlasTexture, cols, rows };
  }, [textures, uniqueImages]);

  return { atlas, cols, rows, uniqueCount: uniqueImages.length, indexMap, atlasCanvasRef };
}

// Camera controller reacting to mouse and scroll velocity
function CameraController({ scrollVelocity }) {
  const { camera } = useThree();
  const mousePosition = useRef({ x: 0, y: 0 });
  const smoothMousePosition = useRef({ x: 0, y: 0 });

  const initialZoom = 10.5;
  const maxZoomOut = 14.0;
  const targetZoom = useRef(initialZoom);
  const currentZoom = useRef(initialZoom);

  useFrame(() => {
    smoothMousePosition.current.x += (mousePosition.current.x - smoothMousePosition.current.x) * 0.05;
    smoothMousePosition.current.y += (mousePosition.current.y - smoothMousePosition.current.y) * 0.05;

    camera.position.x = smoothMousePosition.current.x * 1.5;
    camera.position.y = smoothMousePosition.current.y * 1.5;

    const absVelocity = Math.abs(scrollVelocity.current);
    targetZoom.current += absVelocity * 0.05;
    targetZoom.current = MathUtils.clamp(targetZoom.current, initialZoom, maxZoomOut);

    currentZoom.current += (targetZoom.current - currentZoom.current) * 0.1;
    camera.position.z = currentZoom.current;

    targetZoom.current = MathUtils.lerp(targetZoom.current, initialZoom, 1 - 0.1);
    camera.lookAt(0, 0, 0);
  });

  useEffect(() => {
    const handleMouseMove = (event) => {
      mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return null;
}

// Floating wireframe torus in the center of the cylinder (visible in Cybersec mode)
function CentralTorus({ cylinderRotation }) {
  const torusRef = useRef();

  useFrame((state) => {
    if (!torusRef.current) return;
    const time = state.clock.getElapsedTime();
    torusRef.current.rotation.x = time * 0.25;
    torusRef.current.rotation.z = time * 0.15;
    torusRef.current.rotation.y = time * 0.1 + cylinderRotation.current;
  });

  return (
    <mesh ref={torusRef} position={[0, 0, 0]}>
      <torusGeometry args={[2.3, 0.7, 16, 100]} />
      <meshBasicMaterial
        color="#6df4ce"
        wireframe={true}
        transparent={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// 3D Cylindrical Gallery Mesh
function CylindricalGallery({
  images,
  scrollVelocity,
  scrollOffset,
  rotation,
  onActiveIndexChange,
  mode,
}) {
  const meshRef = useRef(null);

  const { atlas, cols, rows, uniqueCount, indexMap } = useTextureAtlas(images);

  const angleOffsetsRef = useRef(new Float32Array(NUM_INSTANCES));
  const positionYsRef = useRef(new Float32Array(NUM_INSTANCES));
  const activeValues = useMemo(() => new Float32Array(NUM_INSTANCES), []);

  const textureIndices = useMemo(() => {
    const arr = new Float32Array(NUM_INSTANCES);
    for (let i = 0; i < NUM_INSTANCES; i++) {
      arr[i] = indexMap[i] ?? 0;
    }
    return arr;
  }, [indexMap]);

  const totalHeight = NUM_INSTANCES * SPIRAL_STEP;

  useMemo(() => {
    const startY = -(totalHeight / 2);
    for (let i = 0; i < NUM_INSTANCES; i++) {
      angleOffsetsRef.current[i] = i * ((Math.PI * 2) / IMAGES_PER_TURN);
      positionYsRef.current[i] = startY + i * SPIRAL_STEP;
    }
  }, [totalHeight]);

  const uniforms = useMemo(
    () => ({
      uRadius: { value: RADIUS },
      uScrollOffset: { value: 0 },
      uTotalHeight: { value: totalHeight },
      uTime: { value: 0 },
      uScale: { value: 0.83 },
      uCurvature: { value: 1.5 },
      uRotation: { value: 0 },
      uSqueezeAmount: { value: 0 },
      uSqueezeWidth: { value: 7.5 },
      uChromaticAberration: { value: 0.02 },
      uOpacity: { value: 1.0 },
      uEmission: { value: 0.65 },
      uSaturation: { value: 1.50 },
      uBrightness: { value: 1.15 },
      uScanLines: { value: 0.6 },
      uScanLineSpeed: { value: 3.9 },
      uScanLineDensity: { value: 25.0 },
      uDistanceFadeStart: { value: 3.0 },
      uDistanceFadeEnd: { value: 8.0 },
      uFlickerIntensity: { value: 0.18 },
      uFlickerSpeed: { value: 5.0 },
      uAtlas: { value: atlas },
      uAtlasCols: { value: cols },
      uAtlasRows: { value: rows },
      uUniqueCount: { value: uniqueCount },
      // Border: Green Sci-Fi Preset
      uBorderWidth: { value: 0.005 },
      uBorderColor: { value: mode === "cybersec" ? new Color("#6df4ce") : new Color("#cbf5ff") },
      uBorderEmission: { value: mode === "cybersec" ? 1.6 : 1.0 },
      uBorderRadius: { value: 0.0 },
      uBorderOffset: { value: 0.0 },
      // Corners
      uCornerSize: { value: 0.06 },
      uCornerWidth: { value: 0.005 },
      uCornerOffset: { value: 0.03 },
      // Dither: Green Sci-Fi Preset
      uDitherEnabled: { value: mode === "cybersec" ? 1 : 0 },
      uDitherCellSize: { value: 2.0 },
      uDitherGap: { value: 5.5 },
      uDitherContrast: { value: -0.02 },
      uDitherMode: { value: 2 }, // Inv Halftone
      uDitherShape: { value: 0 }, // Circle
      uDitherBaseScale: { value: 0.44 },
      uDitherIntensity: { value: 2.61 },
      uDitherBgColor: { value: new Color("#111111") },
      uDitherFgColor: { value: new Color("#6df4ce") },
      uDitherUseColor: { value: 0 }, // Monochrome Green dither
      uDitherAspect: { value: PLANE_WIDTH / PLANE_HEIGHT },
      uMode: { value: mode === "cybersec" ? 0 : 1 },
    }),
    [atlas, cols, rows, uniqueCount, totalHeight, mode]
  );

  useEffect(() => {
    if (meshRef.current && meshRef.current.material) {
      const uniforms = meshRef.current.material.uniforms;
      if (uniforms) {
        uniforms.uMode.value = mode === "cybersec" ? 0 : 1;
        uniforms.uDitherEnabled.value = mode === "cybersec" ? 1 : 0;
        uniforms.uBorderColor.value = mode === "cybersec" ? new Color("#6df4ce") : new Color("#cbf5ff");
        uniforms.uBorderEmission.value = mode === "cybersec" ? 1.6 : 1.0;
      }
    }
  }, [mode]);

  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new Matrix4();
    for (let i = 0; i < NUM_INSTANCES; i++) {
      dummy.identity();
      meshRef.current.setMatrixAt(i, dummy);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  const smoothSqueeze = useRef(0);
  const activeIndexRef = useRef(-1);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const material = meshRef.current.material;
    const geometry = meshRef.current.geometry;

    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uScrollOffset.value = scrollOffset.current * 0.17;
    material.uniforms.uRotation.value = rotation.current;

    const vel = scrollVelocity.current;
    const targetSqueeze = Math.min(Math.abs(vel) * 3, 1.0) * 0.5;
    smoothSqueeze.current += (targetSqueeze - smoothSqueeze.current) * 0.08;
    material.uniforms.uSqueezeAmount.value = smoothSqueeze.current;

    const angleAttr = geometry.getAttribute("attributes-aAngleOffset");
    const posYAttr = geometry.getAttribute("attributes-aPositionY");
    if (angleAttr && posYAttr) {
      angleAttr.array = angleOffsetsRef.current;
      angleAttr.needsUpdate = true;
      posYAttr.array = positionYsRef.current;
      posYAttr.needsUpdate = true;
    }

    // Determine the closest image to the front center
    const startY = -(totalHeight / 2);
    let minDistance = Infinity;
    let closestIndex = 0;

    for (let i = 0; i < NUM_INSTANCES; i++) {
      let aPositionY = startY + i * SPIRAL_STEP;
      let scrolledY = aPositionY + scrollOffset.current * 0.17;
      let halfH = totalHeight * 0.5;
      scrolledY = ((scrolledY + halfH) % totalHeight);
      if (scrolledY < 0) scrolledY += totalHeight;
      scrolledY -= halfH;

      let aAngleOffset = i * ((Math.PI * 2) / IMAGES_PER_TURN);
      let angle = aAngleOffset + rotation.current;

      let x = Math.sin(angle) * RADIUS;
      let y = scrolledY;
      let z = Math.cos(angle) * RADIUS;

      let dx = x;
      let dy = y;
      let dz = z - RADIUS;
      let distSq = dx * dx + dy * dy * 1.5 + dz * dz;

      if (distSq < minDistance) {
        minDistance = distSq;
        closestIndex = i;
      }
    }

    if (closestIndex !== activeIndexRef.current) {
      activeIndexRef.current = closestIndex;
      onActiveIndexChange(closestIndex);
    }

    // Smooth active state value interpolation per instance
    for (let i = 0; i < NUM_INSTANCES; i++) {
      const target = (i === activeIndexRef.current) ? 1.0 : 0.0;
      activeValues[i] += (target - activeValues[i]) * 0.1;
    }

    const activeAttr = geometry.getAttribute("attributes-aActive");
    if (activeAttr) {
      activeAttr.array = activeValues;
      activeAttr.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, NUM_INSTANCES]}
      frustumCulled={false}
      onClick={(e) => {
        e.stopPropagation();
        if (e.instanceId !== undefined) {
          onActiveIndexChange(e.instanceId, true);
        }
      }}
      onPointerOver={() => {
        document.body.style.cursor = "grab";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      <planeGeometry args={[PLANE_WIDTH, PLANE_HEIGHT, PLANE_SEGMENTS_X, PLANE_SEGMENTS_Y]}>
        <instancedBufferAttribute
          attach="attributes-aAngleOffset"
          args={[angleOffsetsRef.current, 1]}
        />
        <instancedBufferAttribute
          attach="attributes-aPositionY"
          args={[positionYsRef.current, 1]}
        />
        <instancedBufferAttribute
          attach="attributes-aTextureIndex"
          args={[textureIndices, 1]}
        />
        <instancedBufferAttribute
          attach="attributes-aActive"
          args={[activeValues, 1]}
        />
      </planeGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={DoubleSide}
        transparent={true}
      />
    </instancedMesh>
  );
}

// Parent Three.js Canvas Container
export default function CylinderCanvas({ images, onActiveEventChange, mode }) {
  const containerRef = useRef(null);

  const scrollOffset = useRef(0);
  const scrollVelocity = useRef(0);
  const rotation = useRef(0);
  const rotationSpeed = useRef(0.001);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const startRot = useRef(0);
  const startScroll = useRef(0);
  const lastScrollDirection = useRef(1);

  // Map 20 instances back to 4 events (repeating sequence of 6 images)
  const mapImageIndexToEventIndex = (imgIdx) => {
    const modIdx = imgIdx % 6;
    if (modIdx === 0 || modIdx === 1 || modIdx === 2) return 0;
    if (modIdx === 3) return 1;
    if (modIdx === 4) return 2;
    if (modIdx === 5) return 3;
    return 0;
  };

  const handleActiveIndexChange = (index, clickTriggered = false) => {
    const eventIdx = mapImageIndexToEventIndex(index);
    onActiveEventChange(eventIdx);

    // If clicked, snap/rotate the cylinder to put this image in front
    if (clickTriggered) {
      const angleOffset = index * ((Math.PI * 2) / IMAGES_PER_TURN);
      const currentRotNormalized = rotation.current % (Math.PI * 2);
      rotation.current = Math.round((rotation.current - angleOffset) / (Math.PI * 2)) * (Math.PI * 2) - angleOffset;

      const totalHeight = NUM_INSTANCES * SPIRAL_STEP;
      const startY = -(totalHeight / 2);
      const targetPosY = startY + index * SPIRAL_STEP;
      scrollOffset.current = -targetPosY / 0.17;
    }
  };

  // Capture wheel events ONLY when hovering
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY * 0.02;
      scrollVelocity.current += delta;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Mouse / Touch drag handlers
  const handlePointerDown = (e) => {
    e.target.setPointerCapture(e.pointerId);
    isDragging.current = true;
    startX.current = e.clientX;
    startY.current = e.clientY;
    startRot.current = rotation.current;
    startScroll.current = scrollOffset.current;
    scrollVelocity.current = 0;
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - startX.current;
    const deltaY = e.clientY - startY.current;

    rotation.current = startRot.current + deltaX * 0.005;
    scrollOffset.current = startScroll.current + deltaY * 0.05;

    // Track scroll velocity for kinetic scrolling on release
    scrollVelocity.current = deltaY * 0.08;
    if (Math.abs(scrollVelocity.current) > 0.01) {
      lastScrollDirection.current = scrollVelocity.current > 0 ? 1 : -1;
    }
  };

  const handlePointerUp = (e) => {
    if (isDragging.current) {
      e.target.releasePointerCapture(e.pointerId);
      isDragging.current = false;
    }
  };

  // Main interaction / physics Loop
  const SceneContent = () => {
    useFrame((_state, delta) => {
      if (!isDragging.current) {
        // Apply friction
        scrollVelocity.current *= 0.87;
        if (Math.abs(scrollVelocity.current) < 0.0001) {
          scrollVelocity.current = 0;
        }

        // Apply scroll offset
        scrollOffset.current += scrollVelocity.current;

        // Auto-rotation when not interacting
        const vel = scrollVelocity.current;
        const scrollContribution = vel * 1.75;
        const idleSpeed = 0.002 * lastScrollDirection.current;
        const targetSpeed = idleSpeed + scrollContribution;
        const clampedSpeed = MathUtils.clamp(targetSpeed, -0.15, 0.15);

        rotationSpeed.current += (clampedSpeed - rotationSpeed.current) * 0.09;
        rotation.current += rotationSpeed.current * delta * 60;
      }
    });

    return (
      <>
        <CameraController scrollVelocity={scrollVelocity} />
        {mode === "cybersec" && <CentralTorus cylinderRotation={rotation} />}
        <CylindricalGallery
          images={images}
          scrollVelocity={scrollVelocity}
          scrollOffset={scrollOffset}
          rotation={rotation}
          onActiveIndexChange={handleActiveIndexChange}
          mode={mode}
        />
        <EffectComposer disableNormalPass>
          <Bloom
            intensity={1.0}
            luminanceThreshold={0.01}
            luminanceSmoothing={0.45}
            mipmapBlur={true}
            radius={0.65}
          />
        </EffectComposer>
      </>
    );
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <Canvas
        camera={{ fov: 75, position: [0, 0, 10.5] }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <SceneContent />
      </Canvas>
      <div className="absolute bottom-3 right-3 text-secondary text-[11px] pointer-events-none uppercase tracking-wider select-none font-mono bg-black/40 px-2 py-1 rounded border border-white/10 backdrop-blur-sm">
        Drag to Spin • Scroll to Move
      </div>
    </div>
  );
}
