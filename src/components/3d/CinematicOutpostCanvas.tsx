// High-Performance Cinematic 3D Lunar/Martian Outpost - Three.js WebGL Engine
import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Camera, Orbit, Compass, Eye, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export type CameraPreset = 'cinematic' | 'habitat' | 'rover' | 'earth';

interface CinematicOutpostCanvasProps {
  planet?: 'moon' | 'mars';
  interactive?: boolean;
  activePreset?: CameraPreset;
  onPresetChange?: (preset: CameraPreset) => void;
  showControls?: boolean;
}

export const CinematicOutpostCanvas: React.FC<CinematicOutpostCanvasProps> = ({
  planet = 'moon',
  interactive = true,
  activePreset = 'cinematic',
  onPresetChange,
  showControls = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const [currentPreset, setCurrentPreset] = useState<CameraPreset>(activePreset);
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);

  // References for animation loop and interaction
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameId = useRef<number | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());

  // Dynamic animated objects
  const roverGroupRef = useRef<THREE.Group | null>(null);
  const solarArraysRef = useRef<THREE.Group[]>([]);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const commDishRef = useRef<THREE.Group | null>(null);
  const astronautRef = useRef<THREE.Group | null>(null);

  // Camera animation target values
  const cameraTargetPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 18, 55));
  const cameraLookAtTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 4, 0));
  const cameraCurrentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 4, 0));

  // Mouse drag & parallax state
  const isDragging = useRef<boolean>(false);
  const previousMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const orbitAngle = useRef<{ theta: number; phi: number }>({ theta: 0, phi: 0.3 });

  // Camera presets coordinates
  const applyPreset = useCallback((preset: CameraPreset) => {
    setCurrentPreset(preset);
    if (onPresetChange) onPresetChange(preset);

    switch (preset) {
      case 'cinematic':
        cameraTargetPos.current.set(0, 22, 65);
        cameraLookAtTarget.current.set(0, 4, 0);
        break;
      case 'habitat':
        cameraTargetPos.current.set(-10, 8, 22);
        cameraLookAtTarget.current.set(0, 4, 0);
        break;
      case 'rover':
        cameraTargetPos.current.set(22, 5, 18);
        cameraLookAtTarget.current.set(16, 2, 8);
        break;
      case 'earth':
        cameraTargetPos.current.set(8, 2, 28);
        cameraLookAtTarget.current.set(15, 35, -45);
        break;
    }
  }, [onPresetChange]);

  useEffect(() => {
    applyPreset(activePreset);
  }, [activePreset, applyPreset]);

  // Three.js Scene Setup & Lifecycle
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch {
      setWebGLSupported(false);
      return;
    }

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = planet === 'moon' 
      ? new THREE.FogExp2(0x02040a, 0.005) 
      : new THREE.FogExp2(0x280e07, 0.008);

    // 2. Camera
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    camera.position.set(0, 25, 70);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing and shadow mapping
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: false,
      powerPreference: 'high-performance' 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // Clear and attach DOM element
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting (Scientifically Inspired Lunar/Martian Direct Contrast)
    const isMoon = planet === 'moon';

    // Ambient Earthshine / Sky Bounce
    const hemiLight = new THREE.HemisphereLight(
      isMoon ? 0x1a2638 : 0x5a2d1d,
      isMoon ? 0x05070c : 0x180905,
      isMoon ? 0.35 : 0.45
    );
    scene.add(hemiLight);

    // Primary Sun Light (Hard directional light casting dramatic long shadows)
    const sunLight = new THREE.DirectionalLight(
      isMoon ? 0xffffff : 0xffe2b8,
      isMoon ? 2.4 : 1.9
    );
    sunLight.position.set(50, 40, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 200;
    const d = 50;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Subtle blue Earthshine directional accent
    if (isMoon) {
      const earthshine = new THREE.DirectionalLight(0x4299e1, 0.4);
      earthshine.position.set(-30, 25, -20);
      scene.add(earthshine);
    }

    // 5. Procedural Starfield with astronomical depth
    const starCount = 1800;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 350 + Math.random() * 200;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = Math.abs(radius * Math.cos(phi)) + 15; // Above horizon
      starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      // Star color temperatures: blue-white, pure white, subtle yellow
      const colorType = Math.random();
      if (colorType > 0.8) {
        starColors[i * 3] = 0.7; starColors[i * 3 + 1] = 0.85; starColors[i * 3 + 2] = 1.0;
      } else if (colorType > 0.3) {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 1.0; starColors[i * 3 + 2] = 1.0;
      } else {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 0.85; starColors[i * 3 + 2] = 0.7;
      }
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMaterial = new THREE.PointsMaterial({
      size: 1.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.95
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 6. Earth Mesh (Visible in Lunar sky) or Phobos (Visible in Mars sky)
    if (isMoon) {
      const earthRadius = 9;
      const earthGeom = new THREE.SphereGeometry(earthRadius, 48, 48);
      // Create Earth appearance using canvas procedural procedural texture
      const earthCanvas = document.createElement('canvas');
      earthCanvas.width = 1024;
      earthCanvas.height = 512;
      const ctx = earthCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#081a3a';
        ctx.fillRect(0, 0, 1024, 512);
        // Continents and swirling clouds
        ctx.fillStyle = '#2b6cb0';
        ctx.beginPath();
        ctx.arc(300, 240, 140, 0, Math.PI * 2);
        ctx.arc(700, 260, 180, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#38a169';
        ctx.beginPath();
        ctx.arc(320, 220, 90, 0, Math.PI * 2);
        ctx.arc(680, 240, 100, 0, Math.PI * 2);
        ctx.fill();
        // White cloud swirls
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        for (let c = 0; c < 24; c++) {
          ctx.beginPath();
          ctx.ellipse(
            (c * 47) % 1024,
            100 + ((c * 31) % 300),
            60 + (c % 5) * 15,
            15 + (c % 4) * 6,
            (c * 0.4),
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
      const earthTexture = new THREE.CanvasTexture(earthCanvas);
      const earthMat = new THREE.MeshStandardMaterial({
        map: earthTexture,
        roughness: 0.7,
        metalness: 0.1,
        emissive: 0x07152d,
        emissiveIntensity: 0.15
      });
      const earthMesh = new THREE.Mesh(earthGeom, earthMat);
      earthMesh.position.set(35, 48, -120);
      earthMesh.rotation.z = 0.41; // 23.5 degree axial tilt
      scene.add(earthMesh);
      earthMeshRef.current = earthMesh;

      // Atmospheric limb glow halo
      const atmosphereGeom = new THREE.SphereGeometry(earthRadius * 1.04, 32, 32);
      const atmosphereMat = new THREE.MeshBasicMaterial({
        color: 0x52d6ff,
        transparent: true,
        opacity: 0.22,
        side: THREE.BackSide
      });
      const atmosphere = new THREE.Mesh(atmosphereGeom, atmosphereMat);
      earthMesh.add(atmosphere);
    }

    // 7. Planetary Terrain (Lunar or Martian)
    const terrainWidth = 240;
    const terrainDepth = 240;
    const terrainSubdiv = 110;
    const terrainGeom = new THREE.PlaneGeometry(terrainWidth, terrainDepth, terrainSubdiv, terrainSubdiv);
    terrainGeom.rotateX(-Math.PI / 2);

    // Procedural Craters & Undulations on terrain height map
    const posAttr = terrainGeom.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);

      // Low frequency rolling hills
      let y = Math.sin(x * 0.03) * Math.cos(z * 0.03) * 3.5;
      y += Math.sin(x * 0.08 + 1.2) * Math.sin(z * 0.07) * 1.2;

      // Crater depressions
      const d1 = Math.sqrt((x - 25) * (x - 25) + (z - 20) * (z - 20));
      if (d1 < 18) {
        y -= Math.cos((d1 / 18) * (Math.PI / 2)) * 4.2;
      }
      const d2 = Math.sqrt((x + 35) * (x + 35) + (z + 25) * (z + 25));
      if (d2 < 24) {
        y -= Math.cos((d2 / 24) * (Math.PI / 2)) * 6.5;
      }

      // Base area flattening (smooth pad for habitat modules)
      const distFromCenter = Math.sqrt(x * x + z * z);
      if (distFromCenter < 28) {
        const blend = distFromCenter / 28;
        y = y * blend;
      }

      posAttr.setY(i, y);
    }
    terrainGeom.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: isMoon ? 0x585d68 : 0x8a3c22,
      roughness: 0.92,
      metalness: 0.08,
      flatShading: false
    });
    const terrainMesh = new THREE.Mesh(terrainGeom, terrainMat);
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);

    // Scatter realistic rocks across terrain
    const rockGeom = new THREE.DodecahedronGeometry(0.7, 1);
    const rockMat = new THREE.MeshStandardMaterial({
      color: isMoon ? 0x414650 : 0x6e2e1a,
      roughness: 0.95
    });
    const rockInstanced = new THREE.InstancedMesh(rockGeom, rockMat, 120);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 120; i++) {
      const rx = (Math.random() - 0.5) * 180;
      const rz = (Math.random() - 0.5) * 180;
      // Skip center habitat area
      if (Math.sqrt(rx * rx + rz * rz) < 22) continue;
      const s = 0.4 + Math.random() * 1.6;
      dummy.position.set(rx, s * 0.4, rz);
      dummy.scale.set(s, s * (0.6 + Math.random() * 0.6), s);
      dummy.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      dummy.updateMatrix();
      rockInstanced.setMatrixAt(i, dummy.matrix);
    }
    rockInstanced.castShadow = true;
    rockInstanced.receiveShadow = true;
    scene.add(rockInstanced);

    // 8. Modular Lunar/Martian Outpost Architecture
    const outpostGroup = new THREE.Group();
    scene.add(outpostGroup);

    // Standard materials
    const habHullMat = new THREE.MeshStandardMaterial({
      color: 0xecf0f5,
      metalness: 0.35,
      roughness: 0.45
    });
    const goldFoilMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.25
    });
    const darkFrameMat = new THREE.MeshStandardMaterial({
      color: 0x1e2638,
      metalness: 0.6,
      roughness: 0.5
    });
    const glowWindowMat = new THREE.MeshBasicMaterial({
      color: 0x52d6ff,
      transparent: true,
      opacity: 0.95
    });

    // Central Command Geodesic Dome
    const domeGeom = new THREE.SphereGeometry(6.5, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const domeMesh = new THREE.Mesh(domeGeom, habHullMat);
    domeMesh.position.set(0, 0, 0);
    domeMesh.castShadow = true;
    domeMesh.receiveShadow = true;
    outpostGroup.add(domeMesh);

    // Dome Observation Cupola
    const cupolaGeom = new THREE.CylinderGeometry(2.2, 2.8, 1.2, 8);
    const cupolaMesh = new THREE.Mesh(cupolaGeom, glowWindowMat);
    cupolaMesh.position.set(0, 5.8, 0);
    outpostGroup.add(cupolaMesh);

    // Cupola top roof
    const cupolaRoofGeom = new THREE.ConeGeometry(2.4, 0.8, 8);
    const cupolaRoof = new THREE.Mesh(cupolaRoofGeom, darkFrameMat);
    cupolaRoof.position.set(0, 6.7, 0);
    outpostGroup.add(cupolaRoof);

    // Hab Module 1 (Living Quarters - Cylinder with Airlock)
    const cylGeom = new THREE.CylinderGeometry(3.2, 3.2, 9, 24);
    cylGeom.rotateZ(Math.PI / 2);
    const hab1 = new THREE.Mesh(cylGeom, habHullMat);
    hab1.position.set(-8, 3, 0);
    hab1.castShadow = true;
    hab1.receiveShadow = true;
    outpostGroup.add(hab1);

    // Thermal gold insulation wrapping on Hab 1
    const foilRingGeom = new THREE.CylinderGeometry(3.28, 3.28, 3.5, 24);
    foilRingGeom.rotateZ(Math.PI / 2);
    const foilRing = new THREE.Mesh(foilRingGeom, goldFoilMat);
    foilRing.position.set(-8, 3, 0);
    outpostGroup.add(foilRing);

    // Windows on Hab 1
    for (let w = -1; w <= 1; w += 2) {
      const windowMesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.1), glowWindowMat);
      windowMesh.position.set(-8 + w * 2.5, 3.8, 3.22);
      outpostGroup.add(windowMesh);
    }

    // Hab Module 2 (ECLSS & Life Support System)
    const hab2 = new THREE.Mesh(cylGeom, habHullMat);
    hab2.position.set(8, 3, -2);
    hab2.rotation.y = 0.4;
    hab2.castShadow = true;
    hab2.receiveShadow = true;
    outpostGroup.add(hab2);

    // Transparent Hydroponics Greenhouse Dome
    const greenhouseGeom = new THREE.SphereGeometry(4.2, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const greenhouseMat = new THREE.MeshStandardMaterial({
      color: 0x38ef7d,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.65,
      emissive: 0x11998e,
      emissiveIntensity: 0.35
    });
    const greenhouse = new THREE.Mesh(greenhouseGeom, greenhouseMat);
    greenhouse.position.set(-5, 0, 9);
    greenhouse.castShadow = true;
    outpostGroup.add(greenhouse);

    // Connecting Pressurized Tunnels
    const tunnelGeom = new THREE.CylinderGeometry(1.4, 1.4, 6, 16);
    tunnelGeom.rotateZ(Math.PI / 2);
    const tunnel1 = new THREE.Mesh(tunnelGeom, darkFrameMat);
    tunnel1.position.set(-4, 1.4, 0);
    outpostGroup.add(tunnel1);

    const tunnel2 = new THREE.Mesh(tunnelGeom, darkFrameMat);
    tunnel2.position.set(4, 1.4, -1);
    tunnel2.rotation.y = 0.4;
    outpostGroup.add(tunnel2);

    // Air-lock Hatch Entryway
    const airlockGeom = new THREE.BoxGeometry(2.4, 3, 3);
    const airlock = new THREE.Mesh(airlockGeom, habHullMat);
    airlock.position.set(0, 1.5, 6.8);
    airlock.castShadow = true;
    outpostGroup.add(airlock);

    const doorLight = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshBasicMaterial({ color: 0x34d399 }));
    doorLight.position.set(0, 3.2, 8.3);
    outpostGroup.add(doorLight);

    // 9. High-Gain Communications Dish Antenna
    const dishGroup = new THREE.Group();
    dishGroup.position.set(-2, 7.2, -4);
    
    // Mast
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 4.5, 8), darkFrameMat);
    mast.position.y = 2.25;
    dishGroup.add(mast);

    // Parabolic Dish
    const dishGeom = new THREE.SphereGeometry(2.6, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.35);
    const dishMesh = new THREE.Mesh(dishGeom, goldFoilMat);
    dishMesh.position.set(0, 4.5, 0);
    dishMesh.rotation.x = -0.65;
    dishMesh.rotation.y = 0.5;
    dishGroup.add(dishMesh);

    // Feed horn
    const horn = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8), darkFrameMat);
    horn.position.set(0, 4.5, 0.8);
    dishGroup.add(horn);

    outpostGroup.add(dishGroup);
    commDishRef.current = dishGroup;

    // 10. Articulated Solar Array Farm
    const solarFarmGroup = new THREE.Group();
    scene.add(solarFarmGroup);

    const panelTextureCanvas = document.createElement('canvas');
    panelTextureCanvas.width = 256;
    panelTextureCanvas.height = 256;
    const pctx = panelTextureCanvas.getContext('2d');
    if (pctx) {
      pctx.fillStyle = '#061633';
      pctx.fillRect(0, 0, 256, 256);
      pctx.strokeStyle = '#2b6cb0';
      pctx.lineWidth = 4;
      pctx.strokeRect(4, 4, 248, 248);
      // Solar cell grid
      pctx.strokeStyle = '#1a365d';
      pctx.lineWidth = 2;
      for (let g = 32; g < 256; g += 32) {
        pctx.beginPath(); pctx.moveTo(g, 0); pctx.lineTo(g, 256); pctx.stroke();
        pctx.beginPath(); pctx.moveTo(0, g); pctx.lineTo(256, g); pctx.stroke();
      }
    }
    const solarTex = new THREE.CanvasTexture(panelTextureCanvas);
    const solarCellMat = new THREE.MeshStandardMaterial({
      map: solarTex,
      roughness: 0.2,
      metalness: 0.8,
      color: 0x4299e1
    });

    const createSolarArray = (x: number, z: number, rotY: number) => {
      const array = new THREE.Group();
      array.position.set(x, 0, z);

      // Support Pylon
      const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 5.5, 8), darkFrameMat);
      pylon.position.y = 2.75;
      pylon.castShadow = true;
      array.add(pylon);

      // Rotating Solar Wing Panel
      const wing = new THREE.Group();
      wing.position.y = 5.2;

      const wingPanel1 = new THREE.Mesh(new THREE.BoxGeometry(4.8, 2.2, 0.15), solarCellMat);
      wingPanel1.position.x = -2.8;
      wingPanel1.castShadow = true;
      wing.add(wingPanel1);

      const wingPanel2 = new THREE.Mesh(new THREE.BoxGeometry(4.8, 2.2, 0.15), solarCellMat);
      wingPanel2.position.x = 2.8;
      wingPanel2.castShadow = true;
      wing.add(wingPanel2);

      array.add(wing);
      array.rotation.y = rotY;
      solarArraysRef.current.push(wing);
      return array;
    };

    solarFarmGroup.add(createSolarArray(-18, -12, 0.4));
    solarFarmGroup.add(createSolarArray(-12, -18, 0.4));
    solarFarmGroup.add(createSolarArray(-22, -20, 0.4));

    // 11. Lunar Exploration Rover
    const roverGroup = new THREE.Group();
    roverGroup.position.set(16, 1.2, 10);
    scene.add(roverGroup);
    roverGroupRef.current = roverGroup;

    // Chassis
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.2, 2.4), goldFoilMat);
    chassis.position.y = 0.8;
    chassis.castShadow = true;
    roverGroup.add(chassis);

    // Cockpit / Equipment bay
    const bay = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.0, 2.0), habHullMat);
    bay.position.set(0.4, 1.8, 0);
    bay.castShadow = true;
    roverGroup.add(bay);

    // Rover Headlights
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const h1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), headlightMat);
    h1.position.set(1.85, 0.9, 0.7);
    roverGroup.add(h1);
    const h2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), headlightMat);
    h2.position.set(1.85, 0.9, -0.7);
    roverGroup.add(h2);

    // 4 Rover Mesh Wire-Wheels
    const wheelGeom = new THREE.CylinderGeometry(0.65, 0.65, 0.5, 12);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.4 });
    const wheelPositions = [
      { x: 1.4, z: 1.4 },
      { x: -1.4, z: 1.4 },
      { x: 1.4, z: -1.4 },
      { x: -1.4, z: -1.4 }
    ];
    wheelPositions.forEach(wp => {
      const wheel = new THREE.Mesh(wheelGeom, wheelMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(wp.x, 0.35, wp.z);
      wheel.castShadow = true;
      roverGroup.add(wheel);
    });

    // 12. Astronaut on EVA Activity
    const astronautGroup = new THREE.Group();
    astronautGroup.position.set(7, 0, 7);
    scene.add(astronautGroup);
    astronautRef.current = astronautGroup;

    const suitMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
    // Torso & Life Support Backpack
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.1, 0.6), suitMat);
    torso.position.y = 1.35;
    torso.castShadow = true;
    astronautGroup.add(torso);

    const plss = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.9, 0.4), darkFrameMat);
    plss.position.set(0, 1.4, -0.45);
    astronautGroup.add(plss);

    // Helmet & Gold Visor
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 16), suitMat);
    helmet.position.y = 2.15;
    astronautGroup.add(helmet);

    const visor = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16, 0, Math.PI, 0, Math.PI * 0.5), goldFoilMat);
    visor.rotation.x = -Math.PI / 2;
    visor.position.set(0, 2.15, 0.15);
    astronautGroup.add(visor);

    // Legs
    const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.9, 8), suitMat);
    leg1.position.set(-0.25, 0.5, 0);
    astronautGroup.add(leg1);
    const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.9, 8), suitMat);
    leg2.position.set(0.25, 0.5, 0);
    astronautGroup.add(leg2);

    // 13. Event Listeners for Interaction & Drag Parallax
    const handleMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !interactive) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      orbitAngle.current.theta += deltaX * 0.005;
      orbitAngle.current.phi = Math.max(0.1, Math.min(1.2, orbitAngle.current.phi + deltaY * 0.005));

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 14. 60 FPS Render & Simulation Loop
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      const elapsed = clockRef.current.getElapsedTime();

      // Earth rotation in lunar sky
      if (earthMeshRef.current) {
        earthMeshRef.current.rotation.y = elapsed * 0.02;
      }

      // Dish subtle tracking calibration
      if (commDishRef.current) {
        commDishRef.current.rotation.y = 0.5 + Math.sin(elapsed * 0.25) * 0.15;
      }

      // Solar arrays gentle sun tracking
      solarArraysRef.current.forEach((wing, index) => {
        wing.rotation.x = -0.35 + Math.sin(elapsed * 0.2 + index) * 0.05;
      });

      // Rover gentle exploration patrol on patrol curve
      if (roverGroupRef.current) {
        const roverTime = elapsed * 0.35;
        const roverX = 16 + Math.sin(roverTime) * 6;
        const roverZ = 12 + Math.cos(roverTime) * 7;
        roverGroupRef.current.position.x = roverX;
        roverGroupRef.current.position.z = roverZ;
        roverGroupRef.current.rotation.y = -roverTime + Math.PI / 2;
      }

      // Astronaut subtle motion / telemetry inspection
      if (astronautRef.current) {
        astronautRef.current.rotation.y = Math.sin(elapsed * 0.4) * 0.25;
      }

      // Smooth Camera Interpolation towards Target
      if (cameraRef.current) {
        // If user is dragging orbit, compute spherical offset
        if (isDragging.current) {
          const radius = 55;
          const targetX = radius * Math.sin(orbitAngle.current.theta) * Math.cos(orbitAngle.current.phi);
          const targetY = radius * Math.sin(orbitAngle.current.phi);
          const targetZ = radius * Math.cos(orbitAngle.current.theta) * Math.cos(orbitAngle.current.phi);
          cameraTargetPos.current.set(targetX, Math.max(6, targetY), targetZ);
        }

        // Smooth camera position damping (Lerp)
        cameraRef.current.position.lerp(cameraTargetPos.current, 0.04);

        // Smooth camera look-at damping
        cameraCurrentLookAt.current.lerp(cameraLookAtTarget.current, 0.05);
        cameraRef.current.lookAt(cameraCurrentLookAt.current);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);

      // Dispose Geometries and Materials
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else if (obj.material) {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, [planet, interactive]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#02050E]">
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* WebGL Fallback if device does not support WebGL */}
      {!webGLSupported && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#070D1E] text-slate-200">
          <img 
            src="/assets/hero_lunar.jpg" 
            alt="Lunar Outpost Fallback" 
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="relative z-10 max-w-md bg-[#0F172A]/90 p-6 rounded-2xl border border-sky-500/30 backdrop-blur-md">
            <h3 className="text-lg font-bold font-display text-white mb-2">
              {language === 'bn' ? 'সিমুলেশন ভিজ্যুয়ালাইজার' : 'HIGH-FIDELITY OUTPOST SIMULATOR'}
            </h3>
            <p className="text-xs text-slate-300">
              {language === 'bn' 
                ? 'আপনার ডিভাইসে ফুল-রেজোলিউশন টুডি মোডে মিশন পরিচালনা করুন।' 
                : 'Operating in 2D optimized mission profile for device efficiency.'}
            </p>
          </div>
        </div>
      )}

      {/* Cinematic Camera Preset Switcher (Overlay pills) */}
      {showControls && webGLSupported && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 p-1.5 rounded-xl bg-[#090F20]/80 backdrop-blur-md border border-slate-700/80 shadow-xl">
          <button
            type="button"
            onClick={() => applyPreset('cinematic')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentPreset === 'cinematic'
                ? 'bg-[#52D6FF] text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Cinematic Establishing View"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'bn' ? 'সিনেমা' : 'CINEMATIC'}</span>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('habitat')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentPreset === 'habitat'
                ? 'bg-[#52D6FF] text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Focus on Base Modules"
          >
            <Orbit className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'bn' ? 'ঘাঁটি' : 'HABITAT'}</span>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('rover')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentPreset === 'rover'
                ? 'bg-[#52D6FF] text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Track Surface Rover"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'bn' ? 'রোভার' : 'ROVER'}</span>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('earth')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentPreset === 'earth'
                ? 'bg-[#52D6FF] text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Look at Earth Horizon"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'bn' ? 'পৃথিবী' : 'EARTH'}</span>
          </button>
        </div>
      )}

      {/* Interaction Hint */}
      {interactive && webGLSupported && (
        <div className="absolute bottom-4 left-4 z-10 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-slate-800 text-[11px] font-mono text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-[#52D6FF]" />
          <span>{language === 'bn' ? 'ক্যামেরা ঘোরাতে ড্র্যাগ করুন' : 'DRAG TO ORBIT CAMERA'}</span>
        </div>
      )}
    </div>
  );
};
