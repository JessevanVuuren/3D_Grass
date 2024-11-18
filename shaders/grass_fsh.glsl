float inverseLerp(float minValue, float maxValue, float v) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(inMin, inMax, v);
  return mix(outMin, outMax, t);
}

float easeIn(float x, float t) {
	return pow(x, t);
}

varying vec4 vGrassParams;

void main() {

    vec3 baseColor = vec3(0.05, 0.2, 0.01);
    
    vec3 tipColor1 = vec3(0.5, 0.5, 0.1);
    vec3 tipColor2 = vec3(0.4, 0.33, 0.02);
    
    vec3 tipColor = mix(tipColor1, tipColor2, step(0.5, vGrassParams.w));
    vec3 diffuseColor = mix(baseColor, tipColor, easeIn(vGrassParams.y, 2.0));

    float aoForDensity = mix(1.0, 0.25, 0.7);
    float ao = mix(aoForDensity, 1.0, easeIn(vGrassParams.y, 2.0));

    diffuseColor *= ao;

    gl_FragColor = vec4(diffuseColor, 1.0);
}