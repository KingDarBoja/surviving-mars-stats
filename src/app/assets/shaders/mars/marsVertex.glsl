// Variables to pass to the fragment shader.
out vec2 vertexUV;
out vec3 vertexNormal;

/*
  - position, uv and normal are default vertex attributes provided by
  BufferGeometry from threejs. In GLSL3, 'attribute' is replaced by 'in'.
  - projectionMatrix, normalMatrix and modelViewMatrix are built-in uniforms
  provided by threejs.
*/

void main() {
  vertexUV = uv;
  vertexNormal = normalize(normalMatrix * normal);
  /* Respect the coordinates given by converting from "world space" to "screen
  space". */
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}