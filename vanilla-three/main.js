import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

const boxGeometry = new THREE.BoxGeometry( 2, 2, 2, 100, 100 );
const sphereGeometry = new THREE.SphereGeometry( 1, 100, 100 );

const basicMaterial = new THREE.MeshBasicMaterial( { 
    color: "red", 
    wireframe: true, 
    side: THREE.DoubleSide,
} );


const texture = new THREE.TextureLoader()
const colorTexture = texture.load( './textures/myPhoto1.png' );
const roughnessTexture = texture.load( './textures/myLove.png' );
const normalTexture = texture.load( './textures/paper_0025_normal_1k.jpg' );    

const standardMaterial = new THREE.MeshStandardMaterial( { 
    // color: "red", 
    map: colorTexture,
    roughness: 0.5,
    roughnessMap: roughnessTexture,
    // normalMap: normalTexture,
    metalness: 0.5,
    emissive: "black",
    emissiveIntensity: 0.1,
    // wireframe: true,
} );
const mesh = new THREE.Mesh( boxGeometry, standardMaterial );
scene.add( mesh );


// High Intensity Directional Light
const highIntensityLight = new THREE.DirectionalLight(0xffffff, 2.5); // સફેદ રંગ, ઉચ્ચ તીવ્રતા 2.5
highIntensityLight.position.set(10, 15, 10); // ઉપર-જમણી બાજુ થી પ્રકાશ 
scene.add(highIntensityLight);


// Studio Lighting Setup
// ============================

// AmbientLight(color, intensity)
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// DirectionalLight(color, intensity)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 2, 2);
scene.add(directionalLight); 

// DirectionLightHelper(light, size)
const directionalHelper = new THREE.DirectionalLightHelper(directionalLight, 2);
// scene.add(directionalHelper);

// PointLight(color, intensity, distance, decay)
const pointLight = new THREE.PointLight(0xffffff, 1, 10, 2);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// PointLightHelper(light, size)
const pointLightHelper = new THREE.PointLightHelper(pointLight, 2);
// scene.add(pointLightHelper);

// ==========================================


// Renderer setup
const canvas = document.querySelector('#draw');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ACESFilmicToneMapping; 
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;


window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});



// --------------- GUI SETUP ---------------
// GUI setup for material and mesh controls
const gui = new GUI();

// Material controls folder
const materialFolder = gui.addFolder('Material');
materialFolder.add(standardMaterial, 'wireframe');
materialFolder.add(standardMaterial, 'transparent');
materialFolder.add(standardMaterial, 'opacity').min(0).max(1).step(0.01);
materialFolder.add(standardMaterial, 'metalness').min(0).max(1).step(0.01);
materialFolder.add(standardMaterial, 'roughness').min(0).max(1).step(0.01);
materialFolder.addColor(standardMaterial, 'color');
materialFolder.add(standardMaterial, 'emissiveIntensity').min(0).max(1).step(0.01);
materialFolder.addColor(standardMaterial, 'emissive');
materialFolder.close();

// Mesh controls folder
const meshFolder = gui.addFolder('Mesh');
meshFolder.add(mesh.position, 'x').min(-5).max(5).step(0.1).name('position x');
meshFolder.add(mesh.position, 'y').min(-5).max(5).step(0.1).name('position y');
meshFolder.add(mesh.position, 'z').min(-5).max(5).step(0.1).name('position z');
meshFolder.add(mesh.rotation, 'x').min(-Math.PI).max(Math.PI).step(0.01).name('rotation x');
meshFolder.add(mesh.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.01).name('rotation y');
meshFolder.add(mesh.rotation, 'z').min(-Math.PI).max(Math.PI).step(0.01).name('rotation z');
meshFolder.add(mesh.scale, 'x').min(0.1).max(3).step(0.1).name('scale x');
meshFolder.add(mesh.scale, 'y').min(0.1).max(3).step(0.1).name('scale y');
meshFolder.add(mesh.scale, 'z').min(0.1).max(3).step(0.1).name('scale z');
meshFolder.close();

// Lights controls folder
const lightsFolder = gui.addFolder('Lights');

// Ambient Light controls
const ambientFolder = lightsFolder.addFolder('Ambient Light');
ambientFolder.add(ambientLight, 'intensity').min(0).max(1).step(0.01);
ambientFolder.addColor(ambientLight, 'color');
ambientFolder.close();

// Point Light controls
const pointLightFolder = lightsFolder.addFolder('Point Light'); 
pointLightFolder.add(pointLight, 'intensity').min(0).max(1).step(0.01);
pointLightFolder.addColor(pointLight, 'color');
pointLightFolder.add(pointLight.position, 'x').min(-5).max(5).step(0.1);
pointLightFolder.add(pointLight.position, 'y').min(-5).max(5).step(0.1);
pointLightFolder.add(pointLight.position, 'z').min(-5).max(5).step(0.1);
pointLightFolder.close();

lightsFolder.close();
// ==========================================



const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true; 
controls.autoRotate = true; 

function animate() {
    window.requestAnimationFrame(animate);
	renderer.render( scene, camera );
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    controls.update();
}
animate();