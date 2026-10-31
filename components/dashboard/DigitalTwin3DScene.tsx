'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Navigation, Battery, Radio, ArrowUpRight, ShieldCheck, Activity } from 'lucide-react';
import Link from 'next/link';
import VengenceCard from '@/components/ui/VengenceCard';

const DRONES_STATUS = [
  { id: 'DR-904', operator: 'Rajesh Kumar (Delhi - CP)', battery: '88%', status: 'Scanning Sector 4', lat: 28.6315, lng: 77.2167 },
  { id: 'DR-812', operator: 'Pooja Iyer (Mumbai - WEH)', battery: '76%', status: 'Milling Audit Km 12', lat: 19.0760, lng: 72.8777 },
  { id: 'DR-701', operator: 'Karthik Rao (Bengaluru - ORR)', battery: '92%', status: 'Cavity Profiling Live', lat: 12.9716, lng: 77.5946 },
];

export default function DigitalTwin3DScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activeDroneIdx, setActiveDroneIdx] = useState(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 240;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090d16');
    scene.fog = new THREE.FogExp2('#090d16', 0.05);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 3.2, 5.8);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambient);

    const cyanLight = new THREE.PointLight(0x0284c7, 2.5, 10);
    cyanLight.position.set(0, 2, 0);
    scene.add(cyanLight);

    // 3. 3D Highway Road Surface
    const roadWidth = 4.2;
    const roadLength = 20;
    const roadGeo = new THREE.PlaneGeometry(roadWidth, roadLength, 1, 30);
    roadGeo.rotateX(-Math.PI / 2);

    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
      metalness: 0.1,
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    scene.add(road);

    // Road lane dashed markings
    const laneLinesGroup = new THREE.Group();
    for (let i = -8; i < 8; i += 1.8) {
      const lineGeo = new THREE.PlaneGeometry(0.12, 1.0);
      lineGeo.rotateX(-Math.PI / 2);
      const lineMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.position.set(0, 0.02, i);
      laneLinesGroup.add(line);
    }
    scene.add(laneLinesGroup);

    // Side curbs
    const curbLeftGeo = new THREE.BoxGeometry(0.2, 0.1, roadLength);
    const curbMat = new THREE.MeshBasicMaterial({ color: 0xcbd5e1 });
    const curbLeft = new THREE.Mesh(curbLeftGeo, curbMat);
    curbLeft.position.set(-roadWidth / 2 - 0.1, 0.05, 0);
    scene.add(curbLeft);

    const curbRight = curbLeft.clone();
    curbRight.position.set(roadWidth / 2 + 0.1, 0.05, 0);
    scene.add(curbRight);

    // 4. Autonomous 3D Drone Model
    const droneGroup = new THREE.Group();

    // Drone central body
    const bodyGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.15, 6);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    droneGroup.add(body);

    // Camera Sensor Pod
    const camPodGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const camPodMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const camPod = new THREE.Mesh(camPodGeo, camPodMat);
    camPod.position.set(0, -0.12, 0.15);
    droneGroup.add(camPod);

    // 4 Quadcopter Arms & Propellers
    const armMat = new THREE.MeshBasicMaterial({ color: 0x334155 });
    const propMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 });
    const propMeshes: THREE.Mesh[] = [];

    const armOffsets = [
      { x: 0.6, z: 0.6 },
      { x: -0.6, z: 0.6 },
      { x: 0.6, z: -0.6 },
      { x: -0.6, z: -0.6 },
    ];

    armOffsets.forEach((offset) => {
      const armGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 6);
      armGeo.rotateZ(Math.PI / 4);
      const arm = new THREE.Mesh(armGeo, armMat);
      arm.position.set(offset.x / 2, 0, offset.z / 2);
      droneGroup.add(arm);

      // Motor & Rotor ring
      const rotorGeo = new THREE.RingGeometry(0.18, 0.22, 16);
      rotorGeo.rotateX(-Math.PI / 2);
      const rotor = new THREE.Mesh(rotorGeo, propMat);
      rotor.position.set(offset.x, 0.08, offset.z);
      droneGroup.add(rotor);
      propMeshes.push(rotor);
    });

    droneGroup.position.set(0, 1.8, 0);
    scene.add(droneGroup);

    // 5. Sweeping 3D LiDAR Cone
    const coneGeo = new THREE.ConeGeometry(1.6, 1.8, 16, 1, true);
    coneGeo.rotateX(Math.PI);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const lidarCone = new THREE.Mesh(coneGeo, coneMat);
    lidarCone.position.set(0, 0.9, 0);
    droneGroup.add(lidarCone);

    // 6. Distress Void Marker on Road
    const voidMarkerGeo = new THREE.RingGeometry(0.3, 0.45, 24);
    voidMarkerGeo.rotateX(-Math.PI / 2);
    const voidMarkerMat = new THREE.MeshBasicMaterial({ color: 0xff3366, side: THREE.DoubleSide });
    const voidMarker = new THREE.Mesh(voidMarkerGeo, voidMarkerMat);
    voidMarker.position.set(0.6, 0.03, 0.4);
    scene.add(voidMarker);

    // 7. Animation Loop
    let clock = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      clock += 0.03;

      // Hover bobbing motion
      droneGroup.position.y = 1.7 + Math.sin(clock * 1.5) * 0.12;
      droneGroup.rotation.y = Math.sin(clock * 0.8) * 0.15;
      droneGroup.rotation.z = Math.sin(clock * 1.2) * 0.05;

      // Spin propellers
      propMeshes.forEach((p, idx) => {
        p.rotation.z += (idx % 2 === 0 ? 0.35 : -0.35);
      });

      // Pulse LiDAR cone
      coneMat.opacity = 0.15 + Math.sin(clock * 3) * 0.1;

      // Pulse void marker
      const pulseScale = 1 + Math.sin(clock * 4) * 0.15;
      voidMarker.scale.set(pulseScale, pulseScale, pulseScale);

      // Slow scroll road markings to simulate forward flight
      laneLinesGroup.children.forEach((line) => {
        line.position.z += 0.04;
        if (line.position.z > 8) line.position.z = -8;
      });

      renderer.render(scene, camera);
    };

    animate();

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
      cancelAnimationFrame(animId);
      renderer.dispose();
      roadGeo.dispose();
      roadMat.dispose();
      bodyGeo.dispose();
      bodyMat.dispose();
    };
  }, []);

  return (
    <VengenceCard glowColor="cyan" className="p-6 flex flex-col justify-between h-full bg-white/95 border border-slate-200/90 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping" />
            <h3 className="text-sm font-bold text-slate-900 font-display">Autonomous Drone Digital Twin</h3>
          </div>
          <p className="text-[11px] text-slate-500">Live 3D Telemetry &amp; LiDAR Surface Scanner</p>
        </div>
        <Link
          href="/audit"
          className="text-xs text-cyan-700 hover:text-cyan-800 font-semibold flex items-center gap-1 group bg-cyan-50 hover:bg-cyan-100 px-3 py-1.5 rounded-lg border border-cyan-200 transition-colors"
        >
          <span>Open 3D Studio</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* 3D WebGL Viewport */}
      <div className="relative w-full h-72 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
        <div ref={mountRef} className="w-full h-full" />

        {/* 3D Viewport HUD Overlay */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-slate-200 text-[10px] font-mono text-cyan-700 shadow-xs">
          <Activity className="w-3 h-3 text-cyan-600 animate-pulse" />
          <span>LiDAR: 120,000 pts/sec</span>
        </div>

        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-slate-200 text-[10px] font-mono text-emerald-700 shadow-xs">
          <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
          <span>RTK Centimeter Lock</span>
        </div>
      </div>

      {/* Quick Drone Switcher & Telemetry List */}
      <div className="mt-3 space-y-1.5">
        {DRONES_STATUS.map((drone, idx) => {
          const isActive = activeDroneIdx === idx;
          return (
            <div
              key={drone.id}
              onClick={() => setActiveDroneIdx(idx)}
              className={`flex items-center justify-between text-xs p-2 rounded-lg cursor-pointer transition-all border ${
                isActive
                  ? 'bg-cyan-50 border-cyan-200 text-cyan-900 font-medium'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-cyan-700 text-[11px]">{drone.id}</span>
                <span className="truncate max-w-[170px] text-[11px] text-slate-800">{drone.operator}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="text-slate-500">{drone.status}</span>
                <Battery className="w-3 h-3 text-emerald-600" />
                <span className="text-slate-700 font-semibold">{drone.battery}</span>
              </div>
            </div>
          );
        })}
      </div>
    </VengenceCard>
  );
}
