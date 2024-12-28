import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const Cinamoroll = () => {
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

  
    renderer.setPixelRatio(window.devicePixelRatio);

    const pointLight = new THREE.PointLight(0xffffff,0.5)
    scene.add(pointLight)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load(
      '/cinnamoroll.glb',
      (gltf) => {
        scene.add(gltf.scene);
        
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        gltf.scene.position.sub(center);
        
        gltf.scene.position.y += 1;

        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraZ = Math.abs(maxDim / Math.sin(fov / 2) / 2) * 1.1;
        
        camera.position.set(0, 4, cameraZ * .9);
        camera.lookAt(0, 0, 0);
      },
      undefined,
      (error) => {
        console.error('An error occurred loading the model:', error);
      }
    );
    
    const animate = () => {
      requestAnimationFrame(animate);
      if (scene.children.length > 0) {
        scene.rotation.y += 0.009; 
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full mx-auto" style={{ zIndex: -1 }} />;
};

export default Cinamoroll;