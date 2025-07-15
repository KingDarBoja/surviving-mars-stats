//FRAGMENT SHADER
uniform sampler2D diffuseTexture;
uniform sampler2D normalTexture; // New uniform for the normal map
uniform sampler2D bumpTexture;   // New uniform for the bump map

/* Variables shared from a vertex shader to a fragment shader. */
varying vec2 vertexUV;
varying vec3 vertexNormal;

/* The `gl_FragColor` has been deprecated in 450. So now we switch to an output
variable called `diffuseColor`. However this approach does not work with ThreeJS
by default. */

// layout(location = 0) out vec4 diffuseColor;

/* 
  - gl_FragColor: Reserved global built-in fragment variable that controls the color. It requires a vec4 type.
  - vec4: Reserved type that means a vector of four simple precision float numbers.
  - texture2D: Retrieves texels from a texture.
*/
void main() {
  /* Sample the normal map. Normal maps typically store normals in tangent space. */
  vec3 normalMapColor = texture2D(normalTexture, vertexUV).rgb;
  // Convert normal from [0, 1] range to [-1, 1] range.
  vec3 normalFromMap = normalize(normalMapColor * 2.0 - 1.0);

  /* Sample the bump map (grayscale image, typically). */
  float bumpValue = texture2D(bumpTexture, vertexUV).r; // Assuming grayscale, take red channel.

  /* Apply bump mapping (simple perturbation of normal, or displacement).
     For a true bump effect, you'd usually perturb the vertexNormal based on the
     bump value and its derivatives (which is more complex). A simpler approach
     for visual effect might be to just scale the normal based on bump. However,
     for proper bump mapping, you typically need to compute derivatives or use a
     more sophisticated approach. For this example, let's focus on combining the
     normal map with the base normal.
  */
  
  // For proper bump mapping, you'd typically calculate a modified normal based on bump.
  // This often involves calculating tangents and bitangents, and then perturbing the normal.
  // For a visual bump effect without true displacement, you can adjust the normal directly.
  // A common approach for normal maps is to work in tangent space, but if you don't have
  // tangent attributes, you'd transform the sampled normal map normal to object/world space.

  /* Simple integration of bumpValue: perturb the normal. */
  // We'll scale the normalMap influence slightly based on the bump value.
  // A higher bumpValue (lighter areas in the bump map) will make the normalMap influence stronger,
  // and a lower bumpValue (darker areas) will make it weaker.
  // You can also add a small offset directly to the normal.
  
  // Method 1: Scale normal map influence (subtle)
  // vec3 finalNormal = normalize(vertexNormal + normalFromMap * (0.8 + bumpValue * 0.2)); // Adjust factors as needed

  // Method 2: Directly perturb the normal based on bump (more noticeable)
  // This approach is more of a "fake" bump effect, but simple.
  // We'll assume the bump map indicates "height." If it's positive, we slightly push the normal outwards.
  // If it's negative (or darker areas), we pull it inwards.
  // For a simple grayscale bump map where 0.5 is flat, values above 0.5 are raised, below 0.5 are lowered.
  float bumpFactor = (bumpValue - 0.5) * 0.5; // Remap [0,1] to [-0.25, 0.25] for perturbation strength
  
  // Combine vertexNormal and normalFromMap, then add bump influence
  vec3 intermediateNormal = normalize(vertexNormal + normalFromMap * 0.8); // Combine base and normal map
  vec3 finalNormal = normalize(intermediateNormal + intermediateNormal * bumpFactor);

  /* Compute the intensity using the "dot product" function between two vectors (vertexNormal and local z coordinates). */
  // Use `finalNormal` instead of `vertexNormal` for lighting calculations
  float intensity = 1.05 - dot(finalNormal, vec3(0.0, 0.0, 1.0));
  intensity = clamp(intensity + 0.1, 0.0, 1.0); // Add a small offset, then clamp
  /* Red-ish color. Increase the color intensity based on the normal computed intensity. */
  vec3 colorInnerGlow = vec3(255.0 / 255.0, 157.0 / 255.0, 111.0 / 255.0) * pow(intensity, 0.9); // Atomic Tangerine
  // vec3 colorInnerGlow = vec3(226.0 / 255.0, 123.0 / 255.0, 88.0 / 255.0) * pow(intensity, 0.9); // Terra Cotta

  /* Base texture map as vec4. */
  vec4 textureUV = texture2D(diffuseTexture, vertexUV);
  vec4 onlyTextureUV = vec4(textureUV.xyz, 1.0);
  vec4 combinedUV = vec4(colorInnerGlow + textureUV.xyz, 1.0);

  /* Combine the base texture with the inner glow effect. */
  // gl_FragColor = vec4(colorInnerGlow, 1.0);
  // gl_FragColor = onlyTextureUV;
  gl_FragColor = combinedUV;
}