/* Variables shared from a vertex shader to a fragment shader. */
varying vec3 vertexNormal;

/* Declare an output variable for the fragment color.
   This replaces the deprecated 'gl_FragColor' in GLSL ES 3.0.
*/
out vec4 FragColor;

void main() {
  float intensity = pow(0.6 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.2);
  
  /* Create a custom variable to configure our atmosphere color. Remember to
  divide by 255 as the rgb values must be normalized. */
  vec3 colorInnerGlow = vec3(255.0, 157.0, 111.0) / 255.0;  // Atomic Tangerine

  FragColor = vec4(colorInnerGlow, 1.0) * intensity;
}