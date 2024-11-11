import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


// Scene, Camera, Renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, -1, 3);


// Create Object with geometry and material
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshStandardMaterial({
    color: 0x808080,
    metalness: 0.5,
    roughness: 0.5
});
const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);


// Renderer setup
const canvas = document.querySelector('#draw');
const renderer = new THREE.WebGLRenderer({ 
    canvas,
    antialias: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// PMREMGenerator setup
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileCubemapShader();
 

// =============== 3D MODEL SETUP ===============

// --------------- GLTFLoader setup ---------------
// It is used to load 3D models
const loader = new GLTFLoader();
loader.load('./burning_dragon.glb', function(gltf) {
    scene.add(gltf.scene);
}, undefined, function(error) {
    console.log('Error loading model: ' + error);
});


// --------------- HDRI(High-Dynamic-Range Image) lighting setup ---------------
// It is used to simulate the environment of the scene 
// HDRI is a high-dynamic-range image that contains lighting information
// RGBELoader is used to load HDR environment maps 
const rgbeLoader = new RGBELoader();
rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/zwartkops_curve_afternoon_1k.hdr', function(texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping; // sets the mapping for the texture
    // scene.background = texture;
    scene.environment = texture;

    // ##### OR #####

    // Convert the equirectangular HDR image to a cubemap texture
    // const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        
    // // Apply the environment map to both background and lighting
    // scene.background = envMap;  // Sets the scene's background
    // scene.environment = envMap; // Sets the scene's environmental lighting
});

// ================= ************** =================


// Orbit controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
