import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RotateCw, Layers, Sparkles, Eye, Move } from 'lucide-react';

interface Phone3DCanvasProps {
  onExploreCatalog?: () => void;
}

export function Phone3DCanvas({ onExploreCatalog }: Phone3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isExploded, setIsExploded] = useState(false);
  const [selectedColorHex, setSelectedColorHex] = useState('#8e8b85'); // Natural Titanium default

  // Refs for three.js state so React re-renders don't tear down canvas
  const sceneRef = useRef<{
    phoneGroup: THREE.Group;
    backGlassMat: THREE.MeshPhysicalMaterial;
    frameMat: THREE.MeshStandardMaterial;
    cameraBumpMat: THREE.MeshStandardMaterial;
    parts: {
      screenMesh: THREE.Mesh;
      chassisMesh: THREE.Mesh;
      motherboardMesh: THREE.Mesh;
      cameraBumpGroup: THREE.Group;
      backGlassMesh: THREE.Mesh;
    };
    targetRotation: { x: number; y: number };
    isDragging: boolean;
    prevMousePos: { x: number; y: number };
    autoRotateRef: boolean;
    isExplodedRef: boolean;
    requestRender: () => void;
  } | null>(null);

  // Sync state to refs
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.autoRotateRef = autoRotate;
      sceneRef.current.isExplodedRef = isExploded;
      sceneRef.current.requestRender();
    }
  }, [autoRotate, isExploded]);

  useEffect(() => {
    if (sceneRef.current) {
      const col = new THREE.Color(selectedColorHex);
      sceneRef.current.backGlassMat.color.copy(col);
      sceneRef.current.frameMat.color.copy(col);
      sceneRef.current.cameraBumpMat.color.copy(col);
      sceneRef.current.requestRender();
    }
  }, [selectedColorHex]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Dimensions
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 480;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 2. Studio Environment Map via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    pmremGenerator.dispose();

    // 3. Studio Lights
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.8); // Cyan rim light
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    const fillLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(fillLight);

    // 4. Procedural OLED Screen Texture
    const createScreenTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;

      // Wallpaper Gradient (Deep Obsidian with vibrant cyan & violet aurora)
      const grad = ctx.createLinearGradient(0, 0, 512, 1024);
      grad.addColorStop(0, '#090d16');
      grad.addColorStop(0.3, '#0e2338');
      grad.addColorStop(0.6, '#1e1b4b');
      grad.addColorStop(1, '#05070a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 1024);

      // Aurora glow
      ctx.beginPath();
      ctx.arc(256, 400, 180, 0, Math.PI * 2);
      const radGrad = ctx.createRadialGradient(256, 400, 10, 256, 400, 180);
      radGrad.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
      radGrad.addColorStop(0.5, 'rgba(124, 58, 237, 0.25)');
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radGrad;
      ctx.fill();

      // Top Status Bar: Clock
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 88px Cairo, system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('10:09', 256, 230);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 24px Cairo, system-ui';
      ctx.fillText('ممدوح فون · 5G متصل', 256, 290);

      // Dynamic Island / Pill Cutout at top
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.roundRect(196, 40, 120, 36, 18);
      ctx.fill();
      // Little camera dot in island
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(285, 58, 8, 0, Math.PI * 2);
      ctx.fill();

      // App grid preview at bottom
      const startY = 680;
      const colors = ['#0284c7', '#10b981', '#f59e0b', '#8b5cf6'];
      for (let i = 0; i < 4; i++) {
        const x = 70 + i * 105;
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.roundRect(x, startY, 68, 68, 16);
        ctx.fill();
      }

      // Home indicator bar at bottom
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.roundRect(176, 980, 160, 6, 3);
      ctx.fill();

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return texture;
    };

    // 5. Build Procedural 3D Phone Model (Composite 3–12 parts in THREE.Group)
    const phoneGroup = new THREE.Group();

    const phoneWidth = 1.6;
    const phoneHeight = 3.2;
    const phoneDepth = 0.16;

    // Materials
    const initialColor = new THREE.Color(selectedColorHex);

    const frameMat = new THREE.MeshStandardMaterial({
      color: initialColor,
      metalness: 0.92,
      roughness: 0.22,
    });

    const backGlassMat = new THREE.MeshPhysicalMaterial({
      color: initialColor,
      metalness: 0.1,
      roughness: 0.25,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
    });

    const screenTexture = createScreenTexture();
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
    });

    const bezelMat = new THREE.MeshBasicMaterial({
      color: 0x05070a,
    });

    const lensRimMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.95,
      roughness: 0.15,
    });

    const lensGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      metalness: 0.2,
      roughness: 0.05,
      transmission: isSoftwareGl ? 0 : 0.85,
      transparent: true,
      opacity: 0.9,
    });

    const cameraBumpMat = new THREE.MeshStandardMaterial({
      color: initialColor,
      metalness: 0.85,
      roughness: 0.3,
    });

    const motherboardMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b, // Dark tech PCB green with gold chips
      metalness: 0.4,
      roughness: 0.5,
    });

    // Part A: Main Frame / Chassis
    const chassisGeo = new THREE.BoxGeometry(phoneWidth, phoneHeight, phoneDepth * 0.9);
    const chassisMesh = new THREE.Mesh(chassisGeo, frameMat);
    chassisMesh.castShadow = true;
    phoneGroup.add(chassisMesh);

    // Part B: Front Screen Assembly (Bezel + Screen)
    const screenGroup = new THREE.Group();
    const bezelGeo = new THREE.PlaneGeometry(phoneWidth * 0.96, phoneHeight * 0.96);
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    bezelMesh.position.z = phoneDepth / 2 + 0.001;
    screenGroup.add(bezelMesh);

    const screenGeo = new THREE.PlaneGeometry(phoneWidth * 0.92, phoneHeight * 0.93);
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = phoneDepth / 2 + 0.003;
    screenGroup.add(screenMesh);
    phoneGroup.add(screenGroup);

    // Part C: Back Glass Plate
    const backGlassGeo = new THREE.PlaneGeometry(phoneWidth * 0.96, phoneHeight * 0.96);
    const backGlassMesh = new THREE.Mesh(backGlassGeo, backGlassMat);
    backGlassMesh.rotation.y = Math.PI;
    backGlassMesh.position.z = -(phoneDepth / 2 + 0.002);
    phoneGroup.add(backGlassMesh);

    // Part D: Camera Bump & Lenses (Top Left on back)
    const cameraBumpGroup = new THREE.Group();
    const bumpWidth = 0.65;
    const bumpHeight = 0.65;
    const bumpDepth = 0.05;
    const bumpGeo = new THREE.BoxGeometry(bumpWidth, bumpHeight, bumpDepth);
    const bumpMesh = new THREE.Mesh(bumpGeo, cameraBumpMat);
    cameraBumpGroup.add(bumpMesh);

    // 3 Triple Camera Lenses
    const lensPositions = [
      [-0.15, 0.15],
      [-0.15, -0.15],
      [0.15, 0.0],
    ];

    lensPositions.forEach(([lx, ly]) => {
      // Metallic Outer Ring
      const ringGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.04, 24);
      ringGeo.rotateX(Math.PI / 2);
      const ringMesh = new THREE.Mesh(ringGeo, lensRimMat);
      ringMesh.position.set(lx, ly, -bumpDepth / 2 - 0.015);
      cameraBumpGroup.add(ringMesh);

      // Inner Lens Element
      const lensGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.03, 20);
      lensGeo.rotateX(Math.PI / 2);
      const lensMesh = new THREE.Mesh(lensGeo, lensGlassMat);
      lensMesh.position.set(lx, ly, -bumpDepth / 2 - 0.02);
      cameraBumpGroup.add(lensMesh);
    });

    // Flash dot
    const flashGeo = new THREE.CircleGeometry(0.045, 16);
    const flashMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const flashMesh = new THREE.Mesh(flashGeo, flashMat);
    flashMesh.rotation.y = Math.PI;
    flashMesh.position.set(0.15, 0.18, -bumpDepth / 2 - 0.005);
    cameraBumpGroup.add(flashMesh);

    cameraBumpGroup.position.set(-0.35, 1.0, -(phoneDepth / 2 + bumpDepth / 2 + 0.002));
    phoneGroup.add(cameraBumpGroup);

    // Part E: Simulated Internal Motherboard (Visible during Exploded View)
    const mbGeo = new THREE.PlaneGeometry(phoneWidth * 0.85, phoneHeight * 0.85);
    const motherboardMesh = new THREE.Mesh(mbGeo, motherboardMat);
    motherboardMesh.position.z = 0;
    motherboardMesh.visible = false;
    phoneGroup.add(motherboardMesh);

    // Part F: Side buttons
    const powerBtnGeo = new THREE.BoxGeometry(0.03, 0.28, 0.03);
    const powerBtn = new THREE.Mesh(powerBtnGeo, frameMat);
    powerBtn.position.set(phoneWidth / 2 + 0.015, 0.5, 0);
    phoneGroup.add(powerBtn);

    const volUpBtn = new THREE.Mesh(powerBtnGeo, frameMat);
    volUpBtn.position.set(-phoneWidth / 2 - 0.015, 0.6, 0);
    phoneGroup.add(volUpBtn);

    const volDownBtn = new THREE.Mesh(powerBtnGeo, frameMat);
    volDownBtn.position.set(-phoneWidth / 2 - 0.015, 0.25, 0);
    phoneGroup.add(volDownBtn);

    // Initial slight angled presentation
    phoneGroup.rotation.y = -0.35;
    phoneGroup.rotation.x = 0.1;
    scene.add(phoneGroup);

    // 6. Holographic Ground Shadow / Platform
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d')!;
    const sGrad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    sGrad.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
    sGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0.6)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.8;
    scene.add(shadowMesh);

    // Mouse / Touch Interaction for Free 3D Drag
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = phoneGroup.rotation.y;
    let targetRotX = phoneGroup.rotation.x;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      targetRotY += deltaX * 0.012;
      targetRotX += deltaY * 0.008;
      // Clamp vertical tilt
      targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    dom.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    dom.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Save references
    const stateObj = {
      phoneGroup,
      backGlassMat,
      frameMat,
      cameraBumpMat,
      parts: {
        screenMesh: screenGroup as any,
        chassisMesh,
        motherboardMesh,
        cameraBumpGroup,
        backGlassMesh,
      },
      targetRotation: { x: targetRotX, y: targetRotY },
      isDragging: false,
      prevMousePos: { x: 0, y: 0 },
      autoRotateRef: autoRotate,
      isExplodedRef: isExploded,
      requestRender: () => {},
    };
    sceneRef.current = stateObj;

    // Animation & Render Loop
    let animId = 0;
    let explodedZ = 0;

    function renderLoop() {
      // Auto rotation when enabled and not dragging
      if (stateObj.autoRotateRef && !isDragging) {
        targetRotY += 0.008;
      }

      // Smooth damping interpolation
      phoneGroup.rotation.y += (targetRotY - phoneGroup.rotation.y) * 0.08;
      phoneGroup.rotation.x += (targetRotX - phoneGroup.rotation.x) * 0.08;

      // Handle 3D Exploded View Smooth Transition
      const targetExploded = stateObj.isExplodedRef ? 1.0 : 0.0;
      explodedZ += (targetExploded - explodedZ) * 0.08;

      if (explodedZ > 0.02) {
        motherboardMesh.visible = true;
        screenGroup.position.z = explodedZ * 0.6;
        backGlassMesh.position.z = -(phoneDepth / 2 + 0.002) - explodedZ * 0.6;
        cameraBumpGroup.position.z = -(phoneDepth / 2 + bumpDepth / 2 + 0.002) - explodedZ * 0.9;
        motherboardMesh.position.z = explodedZ * 0.15;
      } else {
        motherboardMesh.visible = false;
        screenGroup.position.z = 0;
        backGlassMesh.position.z = -(phoneDepth / 2 + 0.002);
        cameraBumpGroup.position.z = -(phoneDepth / 2 + bumpDepth / 2 + 0.002);
        motherboardMesh.position.z = 0;
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        // Pace CPU draw on software WebGL
        animId = window.setTimeout(renderLoop, 60);
      } else {
        animId = requestAnimationFrame(renderLoop);
      }
    }

    renderLoop();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (isSoftwareGl) clearTimeout(animId);
      else cancelAnimationFrame(animId);

      dom.removeEventListener('mousedown', onPointerDown);
      dom.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      dom.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', handleResize);

      if (container.contains(dom)) {
        container.removeChild(dom);
      }

      // Dispose Three.js resources
      renderer.dispose();
      screenTexture.dispose();
      shadowTex.dispose();
      chassisGeo.dispose();
      screenGeo.dispose();
      bezelGeo.dispose();
      backGlassGeo.dispose();
      bumpGeo.dispose();
      shadowGeo.dispose();
      frameMat.dispose();
      backGlassMat.dispose();
      screenMat.dispose();
      bezelMat.dispose();
      lensRimMat.dispose();
      lensGlassMat.dispose();
      cameraBumpMat.dispose();
      motherboardMat.dispose();
      sceneRef.current = null;
    };
  }, []);

  return (
    <div className="relative w-full h-[440px] sm:h-[480px] rounded-2xl bg-gradient-to-b from-[#111622] to-[#0a0d14] border border-slate-750 shadow-2xl overflow-hidden flex flex-col justify-between select-none">
      
      {/* 3D Top Badge & Controls Header */}
      <div className="relative z-10 p-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 px-3 py-1.5 rounded-lg pointer-events-auto">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-bold text-white">معاينة ثلاثية الأبعاد 3D تفاعلية</span>
          <span className="text-[10px] text-cyan-300 font-mono bg-cyan-950 px-1.5 py-0.5 rounded">REALTIME</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-750 p-1 rounded-lg pointer-events-auto">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              autoRotate ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
            title="تبديل الدوران التلقائي"
            aria-label="تبديل الدوران التلقائي 3D"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">{autoRotate ? 'إيقاف الدوران' : 'دوران 3D'}</span>
          </button>

          <button
            onClick={() => setIsExploded(!isExploded)}
            className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              isExploded ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="تفكيك أجزاء الهاتف ثلاثية الأبعاد"
            aria-label="تفكيك الأجزاء 3D"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="text-[11px]">{isExploded ? 'تجميع الأجزاء' : 'تفكيك 3D'}</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Mount Container */}
      <div
        ref={mountRef}
        className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing flex items-center justify-center"
        title="اسحب بالماوس أو اللمس لتدوير الهاتف 360 درجة"
      />

      {/* Drag Hint overlay */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10 pointer-events-none hidden sm:flex flex-col items-center gap-1 text-[10px] text-slate-500 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
        <Move className="w-4 h-4 text-cyan-400" />
        <span>اسحب للتدوير</span>
      </div>

      {/* Bottom Interactive Dock (Color swatches & Model spec) */}
      <div className="relative z-10 p-4 bg-slate-900/80 backdrop-blur-md border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300 font-semibold">تغيير لون التيتانيوم 3D:</span>
          <div className="flex items-center gap-2">
            {[
              { name: 'تيتانيوم طبيعي', hex: '#8e8b85' },
              { name: 'تيتانيوم صحراوي', hex: '#c5b49e' },
              { name: 'تيتانيوم أسود', hex: '#262729' },
              { name: 'أزرق ياقوتي', hex: '#1e3a5f' },
            ].map((col) => (
              <button
                key={col.hex}
                type="button"
                onClick={() => setSelectedColorHex(col.hex)}
                className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                  selectedColorHex === col.hex ? 'scale-120 border-cyan-400 ring-2 ring-cyan-500/30' : 'border-slate-700'
                }`}
                style={{ backgroundColor: col.hex }}
                title={col.name}
                aria-label={`تغيير اللون إلى ${col.name}`}
              />
            ))}
          </div>
        </div>

        {onExploreCatalog && (
          <button
            onClick={onExploreCatalog}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>عرض في المتجر</span>
          </button>
        )}
      </div>

    </div>
  );
}
