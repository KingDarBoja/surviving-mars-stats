varying vec3 vertexNormal;

void main() {

  float intensity = pow(0.6 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.2);
  vec3 colorInnerGlow = vec3(255.0 / 255.0, 157.0 / 255.0, 111.0 / 255.0); // Atomic Tangerine

  gl_FragColor = vec4(colorInnerGlow, 1.0) * intensity;
}