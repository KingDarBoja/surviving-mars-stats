// Variables to pass to the fragment shader.
varying vec3 vertexNormal;

void main() {
  vertexNormal = normalize(normalMatrix * normal);
  /* Respect the coordinates given by converting from "world space" to "screen
  space". */
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 0.9);
}