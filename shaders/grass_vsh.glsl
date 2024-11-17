mat3 rotateY(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(c, 0, s),
        vec3(0, 1, 0),
        vec3(-s, 0, c)
    );
}

mat3 rotateX(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(1, 0, 0),
        vec3(0, c, -s),
        vec3(0, s, c)
    );
}

uint murmurHash11(uint src) {
  const uint M = 0x5bd1e995u;
  uint h = 1190494759u;
  src *= M; src ^= src>>24u; src *= M;
  h *= M; h ^= src;
  h ^= h>>13u; h *= M; h ^= h>>15u;
  return h;
}

float hash11(float src) {
  uint h = murmurHash11(floatBitsToUint(src));
  return uintBitsToFloat(h & 0x007fffffu | 0x3f800000u) - 1.0;
}

uint murmurHash12(uvec2 src) {
  const uint M = 0x5bd1e995u;
  uint h = 1190494759u;
  src *= M; src ^= src>>24u; src *= M;
  h *= M; h ^= src.x; h *= M; h ^= src.y;
  h ^= h>>13u; h *= M; h ^= h>>15u;
  return h;
}

float hash12(vec2 src) {
  uint h = murmurHash12(floatBitsToUint(src));
  return uintBitsToFloat(h & 0x007fffffu | 0x3f800000u) - 1.0;
}

float noise12(vec2 p) {
  vec2 i = floor(p);

  vec2 f = fract(p);
  vec2 u = smoothstep(vec2(0.0), vec2(1.0), f);

	float val = mix( mix( hash12( i + vec2(0.0, 0.0) ), 
                        hash12( i + vec2(1.0, 0.0) ), u.x),
                   mix( hash12( i + vec2(0.0, 1.0) ), 
                        hash12( i + vec2(1.0, 1.0) ), u.x), u.y);
  return val * 2.0 - 1.0;
}

float inverseLerp(float minValue, float maxValue, float v) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(inMin, inMax, v);
  return mix(outMin, outMax, t);
}

varying float vHeightPercent;

attribute float vertIndex;

uniform vec3 bladeBasePositions[7];
uniform float time;

void main() {
    
    vec3 basePosition = bladeBasePositions[int(vertIndex)];

    float hashNum = hash11(position.x +  position.z);
    mat3 rotation = rotateY(hashNum * 2.0 * 3.14159);

    float GRASS_SEGMENTS = 3.0;
    float GRASS_VERTICES = 7.0;

    float vertID = mod(float(vertIndex), GRASS_VERTICES);
    float heightPercent = vertID / (GRASS_SEGMENTS * 2.0);
    vHeightPercent = heightPercent;
    

    float windDir = noise12(position.xz * 0.05 + 0.005 * time) * 0.6;
    windDir += noise12(position.xz * 0.01 + 0.005 * time) * 0.6;


    float bendFactor = noise12(vec2(time * 0.01) + position.xz) * 0.1;
    mat3 bend = rotateX(heightPercent * bendFactor);

    bend += windDir;

    vec3 transformed = basePosition * bend * rotation;
    transformed = transformed + position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}