import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const ThreeModel = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });

    renderer.setSize(400, 400);
    camera.aspect = 400 / 400;
    camera.updateProjectionMatrix();
    camera.position.z = 5;
    renderer.setClearColor(0x000000, 0);

    // Enable pixel ratio for sharper rendering on high-DPI displays
    renderer.setPixelRatio(window.devicePixelRatio);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minPolarAngle = Math.PI / 2; 
    controls.maxPolarAngle = Math.PI / 2; 
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = .1;


    // Add lighting
    const pointLight = new THREE.PointLight(0xffffff,0.5)
    scene.add(pointLight)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Load the 3D model
    const loader = new GLTFLoader();
    loader.load(
      '/hirono.glb',
      (gltf) => {
        scene.add(gltf.scene);
        
        // Center the model
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        gltf.scene.position.sub(center);
        
        // Set camera position based on model size
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraZ = Math.abs(maxDim / Math.sin(fov / 2) / 2) * 1.1;
        
        camera.position.set(0, 0, cameraZ);
        camera.lookAt(0, 0, 0);
      },
      undefined,
      (error) => {
        console.error('An error occurred loading the model:', error);
      }
    );
    
    const animate = () => {
      requestAnimationFrame(animate);
      // Add automatic rotation
      if (scene.children.length > 0) {
        scene.rotation.y += -0.009; // Adjust this value to change rotation speed
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full mx-auto" />;
};

export default ThreeModel;