float easeIn(float x, float t) {
	return pow(x, t);
}

varying float vHeightPercent;


void main() {

    vec3 baseColor = vec3(0.05, 0.2, 0.01);
    vec3 tipColor = vec3(0.5, 0.5, 0.1);

    vec3 diffuseColor = mix(baseColor, tipColor, easeIn(vHeightPercent, 4.0));

    float aoForDensity = mix(1.0, 0.25, 0.7);
    float ao = mix(aoForDensity, 1.0, easeIn(vHeightPercent, 2.0));

    diffuseColor *= ao;

    gl_FragColor = vec4(diffuseColor, 1.0); // Green color for grass
}