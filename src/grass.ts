import * as THREE from 'three'
import { shaders } from './shaders'

const GRASS_BLADE_VERTICES = 7

const GRASS_BLADE_OFFSET = [-0.05, 0.0, 0.0, 0.05, 0.0, 0.0, -0.05, 0.5, 0.0, 0.05, 0.5, 0.0, -0.05, 1.0, 0.0, 0.05, 1.0, 0.0, 0.0, 1.5, 0.0]
const GRASS_BLADE_INDICES = [0, 1, 2, 2, 1, 3, 2, 3, 4, 3, 4, 5, 4, 5, 6,]

const GRASS_DENSITY = 200000
const GRASS_TILE_SIZE = 100

export const grassMaterial = new THREE.ShaderMaterial({
  vertexShader: shaders.get("grass")?.vertex_shader,
  fragmentShader: shaders.get("grass")?.fragment_shader,
  side: THREE.DoubleSide,
  uniforms: {
    segments: { value: GRASS_BLADE_VERTICES },
    time: { value: 0.0 },
    bladeBasePositions: { value: GRASS_BLADE_OFFSET },
  },
});

const rand_range = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

class InstancedFloat16BufferAttribute extends THREE.InstancedBufferAttribute {
  isFloat16BufferAttribute

  constructor(array: number[], itemSize: number, normalized = false, meshPerAttribute = 1) {
    super(new Uint16Array(array), itemSize, normalized, meshPerAttribute);
    this.isFloat16BufferAttribute = true;
  }
};

export const create_grass_tile = (): THREE.InstancedBufferGeometry => {

  const bladePositions: number[] = [];
  for (let i = 0; i < GRASS_DENSITY; i++) {
    const pos_x = rand_range(0, GRASS_TILE_SIZE)
    const pos_y = rand_range(0, GRASS_TILE_SIZE)

    bladePositions.push(pos_x - GRASS_TILE_SIZE / 2)
    bladePositions.push(0)
    bladePositions.push(pos_y - GRASS_TILE_SIZE / 2)
  }

  const offsetsData = bladePositions.map(THREE.DataUtils.toHalfFloat);

  const vertID = new Float32Array(GRASS_BLADE_VERTICES);
  for (let i = 0; i < GRASS_BLADE_VERTICES; i++) vertID[i] = i;

  const geo = new THREE.InstancedBufferGeometry();
  geo.setAttribute('vertIndex', new THREE.Float32BufferAttribute(vertID, 1));
  geo.setAttribute("position", new InstancedFloat16BufferAttribute(offsetsData, 3));
  geo.setIndex(GRASS_BLADE_INDICES);
  geo.instanceCount = GRASS_DENSITY;
  return geo
}