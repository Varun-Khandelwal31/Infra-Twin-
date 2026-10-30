'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { motion } from 'framer-motion';
import {
  RotateCcw,
  Layers,
  Eye,
  Maximize2,
  Sparkles,
  Compass,
  Sliders,
  Play,
  Pause,
} from 'lucide-react';
import { InspectionData } from '@/lib/mockInference';

interface Pothole3DViewerProps {
  sample: InspectionData;
  depthScale?: number;
  flightAltitudeM?: number;
  className?: string;
}

export default function Pothole3DViewer({
  sample,
  depthScale = 1.0,
  flightAltitudeM = 12.4,
  className = '',
}: Pothole3DViewerProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [renderMode, setRenderMode] = useState<'solid' | 'wireframe' | 'points'>('solid');
  const [autoRotate, setAutoRotate] = useState(true);
  const [showLaser, setShowLaser] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const laserRef = useRef<THREE.Line | null>(null);
  const animFrameId = useRef<number | null>(null);

  const maxDepthCm = sample.metrics.maxDepthCm * depthScale;
  const areaSqm = sample.metrics.areaSqm;
  const volumeCum = sample.metrics.volumeCum * depthScale;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 420;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f1f5f9');
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(5.5, 4.2, 5.5);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera going below ground
    controls.minDistance = 2.5;
    controls.maxDistance = 15;
    controls.target.set(0, -0.4, 0);
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x0284c7, 1.4);
    dirLight.position.set(6, 8, 4);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0xf43f5e, 0.6);
    rimLight.position.set(-6, -2, -4);
    scene.add(rimLight);

    // 6. Base Ground Grid Floor
    const gridHelper = new THREE.GridHelper(8, 20, 0x0284c7, 0xcbd5e1);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // 7. Generate 3D Road Cavity Geometry from sample.depthGrid or procedural contour
    const gridSize = 40;
    const planeGeo = new THREE.PlaneGeometry(5, 5, gridSize - 1, gridSize - 1);
    planeGeo.rotateX(-Math.PI / 2);

    const posAttr = planeGeo.attributes.position;
    const vertexCount = posAttr.count;
    const colors = new Float32Array(vertexCount * 3);

    // Build elevation depression
    const depthMatrix = sample.depthGrid && sample.depthGrid.length > 0
      ? sample.depthGrid
      : Array.from({ length: 20 }, (_, r) =>
          Array.from({ length: 20 }, (_, c) => {
            const dx = (c - 10) / 7;
            const dz = (r - 10) / 7;
            const dist = Math.sqrt(dx * dx + dz * dz);
            return dist < 1.0 ? (1 - dist) * 15 : 0;
          })
        );

    const dRows = depthMatrix.length;
    const dCols = depthMatrix[0]?.length || 20;

    const maxCavityDepthM = (maxDepthCm / 100) * 1.8; // Scaled visual depth

    for (let i = 0; i < vertexCount; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);

      // Map (vx, vz) from [-2.5, 2.5] to depthGrid [0, dCols-1], [0, dRows-1]
      const col = Math.round(((vx + 2.5) / 5) * (dCols - 1));
      const row = Math.round(((vz + 2.5) / 5) * (dRows - 1));

      let depthVal = 0;
      if (row >= 0 && row < dRows && col >= 0 && col < dCols) {
        depthVal = depthMatrix[row][col] || 0;
      }

      // Smooth cavity depression
      const normDepth = Math.min(1, depthVal / Math.max(1, sample.metrics.maxDepthCm));
      const vy = -normDepth * maxCavityDepthM;
      posAttr.setY(i, vy);

      // Vertex color gradient: from dark slate road surface -> cyan -> amber -> deep crimson void
      if (normDepth < 0.05) {
        // Flat asphalt road surface
        colors[i * 3 + 0] = 0.09; // R
        colors[i * 3 + 1] = 0.12; // G
        colors[i * 3 + 2] = 0.18; // B
      } else if (normDepth < 0.35) {
        // Upper crater rim (cyan gradient)
        colors[i * 3 + 0] = 0.02 + normDepth * 0.2;
        colors[i * 3 + 1] = 0.65;
        colors[i * 3 + 2] = 0.85;
      } else if (normDepth < 0.7) {
        // Mid cavity (amber distress)
        colors[i * 3 + 0] = 0.95;
        colors[i * 3 + 1] = 0.65;
        colors[i * 3 + 2] = 0.1;
      } else {
        // Deepest crater bottom (critical crimson)
        colors[i * 3 + 0] = 0.95;
        colors[i * 3 + 1] = 0.15;
        colors[i * 3 + 2] = 0.25;
      }
    }

    planeGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    planeGeo.computeVertexNormals();

    // 8. Solid Surface Mesh
    const solidMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.65,
      metalness: 0.2,
      wireframe: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, solidMat);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);
    meshRef.current = mesh;

    // 9. Point Cloud Alternative
    const pointsMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });
    const points = new THREE.Points(planeGeo, pointsMat);
    points.visible = false;
    scene.add(points);
    pointsRef.current = points;

    // 10. Depth Measurement Laser Indicator
    const laserMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.85 });
    const laserGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.05, -2.5),
      new THREE.Vector3(0, 0.05, 2.5),
    ]);
    const laserLine = new THREE.Line(laserGeo, laserMat);
    scene.add(laserLine);
    laserRef.current = laserLine;

    // 11. Deepest Point Caliper Pin
    const pinGroup = new THREE.Group();
    const pinStemGeo = new THREE.CylinderGeometry(0.015, 0.015, maxCavityDepthM + 0.5, 8);
    const pinStemMat = new THREE.MeshBasicMaterial({ color: 0xff3366 });
    const pinStem = new THREE.Mesh(pinStemGeo, pinStemMat);
    pinStem.position.y = -(maxCavityDepthM / 2);
    pinGroup.add(pinStem);

    const pinHeadGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const pinHeadMat = new THREE.MeshBasicMaterial({ color: 0xff3366 });
    const pinHead = new THREE.Mesh(pinHeadGeo, pinHeadMat);
    pinHead.position.y = 0.25;
    pinGroup.add(pinHead);

    scene.add(pinGroup);

    // 12. Animation Loop
    let laserZ = -2.5;
    let laserDir = 1;

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      if (autoRotate && controlsRef.current) {
        scene.rotation.y += 0.003;
      }

      // Animate LiDAR scanning laser
      if (laserRef.current && showLaser) {
        laserZ += 0.04 * laserDir;
        if (laserZ > 2.4) laserDir = -1;
        if (laserZ < -2.4) laserDir = 1;
        laserRef.current.position.x = laserZ;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      renderer.dispose();
      planeGeo.dispose();
      solidMat.dispose();
      pointsMat.dispose();
      laserMat.dispose();
    };
  }, [sample, depthScale, autoRotate, showLaser]);

  // Update render mode (solid, wireframe, points)
  useEffect(() => {
    if (!meshRef.current || !pointsRef.current) return;
    if (renderMode === 'points') {
      meshRef.current.visible = false;
      pointsRef.current.visible = true;
    } else {
      pointsRef.current.visible = false;
      meshRef.current.visible = true;
      (meshRef.current.material as THREE.MeshStandardMaterial).wireframe = renderMode === 'wireframe';
    }
  }, [renderMode]);

  const handleResetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(5.5, 4.2, 5.5);
    controlsRef.current.target.set(0, -0.4, 0);
  };

  const handleSetTopView = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(0.01, 7.5, 0.01);
    controlsRef.current.target.set(0, 0, 0);
  };

  const handleSetSideView = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(6.5, 0.4, 0);
    controlsRef.current.target.set(0, -0.3, 0);
  };

  return (
    <div className={`relative w-full rounded-2xl bg-[#f1f5f9] border border-slate-200/90 shadow-sm overflow-hidden ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-[380px] sm:h-[440px] cursor-grab active:cursor-grabbing"
        title="Click and drag to rotate in 3D space • Scroll to zoom"
      />

      {/* Top Floating Glass HUD */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 text-xs font-mono pointer-events-auto shadow-xs">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="font-bold text-slate-800">LiDAR Digital Twin (3D WebGL)</span>
          <span className="text-slate-400">•</span>
          <span className="text-cyan-700">GSD 0.19 cm/px</span>
        </div>

        {/* View Angle & Reset Shortcuts */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={handleResetCamera}
            className="p-1.5 rounded-lg bg-white/90 border border-slate-200 text-slate-700 hover:text-cyan-600 transition-colors text-xs font-mono flex items-center gap-1 shadow-xs"
            title="Reset Perspective View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">3D</span>
          </button>
          <button
            onClick={handleSetTopView}
            className="px-2 py-1.5 rounded-lg bg-white/90 border border-slate-200 text-slate-700 hover:text-cyan-600 transition-colors text-[11px] font-mono shadow-xs"
            title="Top Elevation Plan"
          >
            Top
          </button>
          <button
            onClick={handleSetSideView}
            className="px-2 py-1.5 rounded-lg bg-white/90 border border-slate-200 text-slate-700 hover:text-cyan-600 transition-colors text-[11px] font-mono shadow-xs"
            title="Cross-Section Profile"
          >
            Profile
          </button>
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-10">
        {/* Render Mode Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 pointer-events-auto shadow-xs">
          {(['solid', 'wireframe', 'points'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setRenderMode(mode)}
              className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-all ${
                renderMode === mode
                  ? 'bg-cyan-50 text-cyan-800 font-bold border border-cyan-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {mode === 'points' ? 'LiDAR Cloud' : mode}
            </button>
          ))}
        </div>

        {/* Rotation & Laser Toggles */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 shadow-xs ${
              autoRotate
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-white/90 text-slate-600 border-slate-200'
            }`}
          >
            {autoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span className="hidden sm:inline">Rotate</span>
          </button>

          {/* Quick Metrics Badge */}
          <div className="px-3 py-1 rounded-xl bg-white/90 border border-slate-200 text-xs font-mono text-slate-700 shadow-xs">
            Depth: <span className="text-rose-600 font-bold">{maxDepthCm.toFixed(1)} cm</span> • Vol: <span className="text-emerald-600 font-bold">{volumeCum.toFixed(3)} m³</span>
          </div>
        </div>
      </div>
    </div>
  );
}
