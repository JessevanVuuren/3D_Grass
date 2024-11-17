import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { create_grass_tile, grassMaterial } from './grass';
import * as THREE from 'three'
import Stats from 'stats.js';

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const camera_debug = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const controller_debug = new OrbitControls(camera_debug, document.body)
camera_debug.position.set(3, 7, 7)

const plane_body = new THREE.PlaneGeometry(100, 100, 1, 1)
const plane_material = new THREE.MeshLambertMaterial({ color: "#818181" })
const plane = new THREE.Mesh(plane_body, plane_material)
plane.rotateX(-2.5 * Math.PI)
scene.add(plane)

const light = new THREE.DirectionalLight(0xffffff, 1)
const ambient = new THREE.AmbientLight(0xffffff, 0.2)
const helper = new THREE.DirectionalLightHelper(light, 1)
ambient.position.set(0, 0, 5)
light.position.set(0, 30, 30)
light.castShadow = true;
light.lookAt(0, 0, 0)
scene.add(helper)
scene.add(light)
scene.add(ambient)


const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);


const grassGeometry = create_grass_tile();
const bladeMesh = new THREE.Mesh(grassGeometry, grassMaterial);
bladeMesh.receiveShadow = true
bladeMesh.castShadow = false
bladeMesh.frustumCulled = false
scene.add(bladeMesh);

let time = 0;
function animate() {
  stats.begin()

  renderer.render(scene, camera_debug);
  controller_debug.update()

  time++;
  grassMaterial.uniforms.time = { value: time }

  stats.end()
}
