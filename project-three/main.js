// import libraries
import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import gsap from 'gsap';


// scene
const scene = new THREE.Scene();
let model;

// camera
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 3.5;
scene.add(camera);


// objects
const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
const stdMaterial = new THREE.MeshStandardMaterial({
  color: 'lightblue',
  roughness: 0.3,
  metalness: 0.8,
  emissive: 'blue',
  emissiveIntensity: 0.3,
})
const cube = new THREE.Mesh(boxGeometry, stdMaterial);
// scene.add(cube);


// gltf loader
const loader = new GLTFLoader();
loader.load('./DamagedHelmet.gltf', function(gltf) {
  model = gltf.scene;
  scene.add(model);
}, undefined, function(xhr) {
  console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
});


// lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);


// renderer
const canvas = document.querySelector('#canvas') ;
const renderer = new THREE.WebGLRenderer({ 
  canvas,
  antialias: true,
  alpha: true, // transparent background
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping; 
renderer.toneMappingExposure = 3;
renderer.outputColorSpace = THREE.SRGBColorSpace;
// renderer.render(scene, camera);


// #########################################

// Post-processing refers to applying visual effects to a rendered image after the initial render is complete, similar to applying filters on Instagram. (ref: vanilla-three/explaination.yaml)

// Post Processing Setup
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms['amount'].value = 0.0030;
composer.addPass(rgbShiftPass);

// #########################################


// PMREMGenerator setup
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileCubemapShader(); 


// HDRI setup
const rgbeLoader = new RGBELoader();
rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/pond_bridge_night_1k.hdr', function(texture) {
  const envMap = pmremGenerator.fromEquirectangular(texture).texture;
  // scene.background = envMap;
  scene.environment = envMap;
});


// responsive
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});


// controls [ref: model_rotation_control.txt]
window.addEventListener('mousemove', (e) => {
  if (model) {
    const rotationX = (e.clientX / window.innerWidth - 0.5) * (Math.PI * .15);
    const rotationY = (e.clientY / window.innerHeight - 0.5) * (Math.PI * .15);
    gsap.to(model.rotation, {
      x: rotationY,
      y: rotationX,
      duration: 0.9,
      ease: "power2.out"
    });
  }
})


// animate
function animate() {
  window.requestAnimationFrame(animate);
  // renderer.render(scene, camera);
  composer.render(); // Use composer instead of renderer
}
animate();

