/*
 * THREE.JS CORE CONCEPTS & IMPLEMENTATION
 * =====================================
 * 
 * Key Terminology:
 * ---------------
 * • Scene: 3D space container that holds all objects
 * • Camera: Virtual eye that determines view perspective
 * • Mesh: 3D object made of geometry (shape) and material (appearance)
 * • Renderer: System that draws 3D scene onto 2D screen
 * • RequestAnimationFrame: Browser API for smooth animations
 * • WebGL: Low-level 3D graphics API that Three.js builds upon
 */


// --------------- 0. import THREE and OrbitControls from CDN ---------------
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import GUI from 'lil-gui';
// ================================================



// --------------- 1. SCENE SETUP ---------------
// Scene acts as a container for all 3D objects
const scene = new THREE.Scene();
// ================================================



// --------------- 2. CAMERA SETUP ---------------
// PerspectiveCamera parameters:
// - FOV (Field of View): Extent of scene visible (in degrees)
// - Aspect Ratio: Width/height of viewing window
// - Near/Far Clipping Plane: Bounds of visible space
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 100);
scene.add(camera);
camera.position.z = 8; // Move camera back to view scene
// ================================================



// --------------- 3.1. MESH CREATION ---------------
// Mesh combines geometry (shape) with material (appearance)

let box = new THREE.BoxGeometry(3, 3, 3, 100, 100); // BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments )
const sphere = new THREE.SphereGeometry( 1, 10, 10 ); // SphereGeometry(radius, widthSegments, heightSegments)
const cylinder = new THREE.CylinderGeometry( 2, 2, 3, 10 ); // CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded)

let material = new THREE.MeshBasicMaterial({ 
    color: "red", 
    wireframe: true, /* renders the edges of the cube only */
    side: THREE.DoubleSide, /* renders both sides of the cube */
}); // MeshBasicMaterial: Simplest material, not affected by lights

let material2 = new THREE.MeshStandardMaterial({
    color: "white", 
    roughness: 0.5, /* 0 = shiny, 1 = matte */ 
    metalness: 0.5, /* 0 = non-metal, 1 = metal */
    reflectivity: 0.5, /* 0 = non-reflective, 1 = reflective (how much light is reflected) */
    emissive: "black", /* emits light from the inside of the object (ઉત્સર્જક રંગ) */
    emissiveIntensity: 0.5, /* intensity of emissive color */
    transparent: true, /* allows transparency */
    // opacity: 0.5, /* opacity of the object */
    side: THREE.DoubleSide, /* renders both sides of the cube */
    toneMapped: true, /* ensures correct lighting */
    depthWrite: false, /* prevents depth writing */
    alphaTest: 0.05, /* controls transparency */        
    visible: true, /* ensures object is visible */
    needsUpdate: true, /* ensures material is updated */
    depthPacking: THREE.RGBADepthPacking, /* depth packing */    
    // wireframe: true, /* renders the edges of the cube only */
}); // MeshStandardMaterial: More realistic, affected by lights

let mesh = new THREE.Mesh(box, material2);
scene.add(mesh);
// ================================================



// --------------- 3.2. TEXTURE SETUP ---------------
// TextureLoader loads image files as textures
const textureLoader = new THREE.TextureLoader();

// Load different texture maps
const colorTexture = textureLoader.load('./textures/luffy.png'); // Base color/diffuse map
const roughnessTexture = textureLoader.load('./textures/5794.png'); // Controls roughness
const normalTexture = textureLoader.load('./textures/paper_0025_normal_1k.jpg'); // Adds surface detail

// Update material to use textures
material2.map = colorTexture; // Base color texture
material2.roughnessMap = roughnessTexture; // Roughness mapping
material2.normalMap = normalTexture; // Normal mapping for surface detail
material2.needsUpdate = true; // Required after changing material properties
// ================================================



// --------------- 4. RENDERER SETUP ---------------
// WebGLRenderer is the painter that draws the 3D scene onto a 2D canvas
const canvas = document.querySelector("#draw");
const renderer = new THREE.WebGLRenderer({ 
    canvas,
    antialias: true // Smooths jagged edges
});

renderer.setSize(window.innerWidth, window.innerHeight);

// pixel ratio is the ratio of the physical pixels to the logical pixels  
// here, setPixelRatio is used because if the pixel ratio is too high, it will degrade the performance of rendering
// so, we set the pixel ratio to the minimum of the window's device pixel ratio and 2
// to get great performance without sacrificing resources
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// tone mapping is used to adjust the brightness of the scene
renderer.toneMapping = THREE.ACESFilmicToneMapping; 

// controls the brightness of the scene
renderer.toneMappingExposure = 3.0; 

// output color space is used to encode the output in sRGB format
// sRGB is a standard color space for digital images
renderer.outputColorSpace = THREE.SRGBColorSpace;

// --------------- PMREMGenerator setup ---------------
// It is used to generate prefiltered environment maps for lighting
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileCubemapShader(); // compiles the cubemap shader

// ================================================



// --------------- 5.1. ANIMATION SYSTEM ---------------
// Clock tracks time for smooth animations
let clock = new THREE.Clock();

// --------------- 5.2. ORBIT CONTROLS ---------------
// orbit controls: allows for mouse interaction with the camera and should be updated in the animate function
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true; // enables smooth damping(slowing down) effect
controls.autoRotate = true; // enables auto rotation
controls.enableZoom = false; // disables zooming
controls.dampingFactor = 0.05; // controls the speed of the damping effect

function animate() {
    // RequestAnimationFrame syncs with screen refresh rate
    requestAnimationFrame(animate);
    
    // Rotate cube based on elapsed time
    // getElapsedTime() returns the time between frames and provides smooth time-based animation
    mesh.rotation.x = clock.getElapsedTime() * 0.1;
    mesh.rotation.y = clock.getElapsedTime() * 0.1;
    
    renderer.render(scene, camera); // Render the current frame

    controls.update(); // updates the camera and renderer
}
animate();
// ================================================



// --------------- GUI SETUP ---------------
// GUI setup for material and mesh controls
// const gui = new GUI();

// // Material controls folder
// const materialFolder = gui.addFolder('Material');
// materialFolder.add(material2, 'wireframe');
// materialFolder.add(material2, 'transparent');
// materialFolder.add(material2, 'opacity').min(0).max(1).step(0.01);
// materialFolder.add(material2, 'metalness').min(0).max(1).step(0.01);
// materialFolder.add(material2, 'roughness').min(0).max(1).step(0.01);
// materialFolder.addColor(material2, 'color');
// materialFolder.add(material2, 'emissiveIntensity').min(0).max(1).step(0.01);
// materialFolder.addColor(material2, 'emissive');

// // Mesh controls folder
// const meshFolder = gui.addFolder('Mesh');
// meshFolder.add(mesh.position, 'x').min(-5).max(5).step(0.1).name('position x');
// meshFolder.add(mesh.position, 'y').min(-5).max(5).step(0.1).name('position y');
// meshFolder.add(mesh.position, 'z').min(-5).max(5).step(0.1).name('position z');
// meshFolder.add(mesh.rotation, 'x').min(-Math.PI).max(Math.PI).step(0.01).name('rotation x');
// meshFolder.add(mesh.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.01).name('rotation y');
// meshFolder.add(mesh.rotation, 'z').min(-Math.PI).max(Math.PI).step(0.01).name('rotation z');
// meshFolder.add(mesh.scale, 'x').min(0.1).max(3).step(0.1).name('scale x');
// meshFolder.add(mesh.scale, 'y').min(0.1).max(3).step(0.1).name('scale y');
// meshFolder.add(mesh.scale, 'z').min(0.1).max(3).step(0.1).name('scale z');
// ================================================



// --------------- STUDIO LIGHTING SETUP ---------------

// 1. AmbientLight(color, intensity): Provides soft, overall illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// 2. DirectionalLight(color, intensity): Main directional light (simulates primary light source)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 2, 2);
scene.add(directionalLight); 

// 2.h. DirectionLightHelper(light, size): helps to visualize the direction of the light
const directionalHelper = new THREE.DirectionalLightHelper(directionalLight, 2);
// scene.add(directionalHelper);

// 3. PointLight(color, intensity, distance, decay): Simulates a point source of light
const pointLight = new THREE.PointLight(0xffffff, 1, 10, 2);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// 3.h. PointLightHelper(light, size): helps to visualize the point light
const pointLightHelper = new THREE.PointLightHelper(pointLight, 2);
// scene.add(pointLightHelper);

// ==========================================



// --------------- 6. RESPONSIVE DESIGN ---------------
// Handle window resizing for responsive display
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight; // Update camera aspect ratio
    camera.updateProjectionMatrix(); // Updates the camera view when window size changes and prevents distortion
    renderer.setSize(window.innerWidth, window.innerHeight); // Resize renderer to match window
});
// ================================================



/*
 * ADDITIONAL CONCEPTS:
 * ------------------
 * • Transformations: Position, rotation, and scale modify object properties
 * • Animation Loop: Continuous rendering cycle for smooth motion
 * • Aspect Ratio: Maintains proper display proportions (width/height)
 * • Anti-aliasing: Smooths edges for better visual quality
 * • Pixel Ratio: Ratio of physical pixels to logical pixels 
 * • requestAnimationFrame: used to create smooth animations by calling the animate function at the end of each frame
 * • OrbitControls: allows for mouse interaction with the camera and should be updated in the animate function
 * • Responsive Design: Adapts to viewport changes
 * 
 * This implementation creates a responsive 3D scene with a rotating cube,
 * demonstrating core Three.js concepts in a practical application.
 */