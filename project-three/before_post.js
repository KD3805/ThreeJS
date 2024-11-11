// import libraries
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';


// scene
const scene = new THREE.Scene();


// camera
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 4;
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
  scene.add(gltf.scene);
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
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping; 
renderer.toneMappingExposure = 1;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// render
renderer.render(scene, camera);

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


// controls
const controls = new OrbitControls(camera, renderer.domElement); // here, domElement is the canvas
controls.enableDamping = true;  
controls.dampingFactor = 0.05;
// controls.autoRotate = true;


// animate
function animate() {
  window.requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();