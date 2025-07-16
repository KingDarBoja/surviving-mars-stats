import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { beforeRender, extend, NgtArgs, NgtVector3 } from 'angular-three';

import atmosphereFragmentShader from '../shaders/atmosphere/atmosphereFragment.glsl';
import atmosphereVertexShader from '../shaders/atmosphere/atmosphereVertex.glsl';
import {
  AdditiveBlending,
  BackSide,
  Mesh,
  ShaderMaterial,
  ShaderMaterialParameters,
  SphereGeometry,
} from 'three';

extend({ Mesh, SphereGeometry, ShaderMaterial });

@Component({
  selector: 'sms-atmosphere-mesh',
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  template: `
    <ngt-mesh #mesh [position]="position()">
      <ngt-sphere-geometry *args="geometryArgs" />
      <ngt-shader-material [parameters]="atmosphereShaderParameters" />
    </ngt-mesh>
  `,
})
export class MarsAtmosphereMeshComponent {
  /**
   * The position of the planet in the scene. By default, positioned at the 3D
   * axis origin.
   */
  position = input<NgtVector3>([0, 0, 0]);

  /**
   * Geometry arguments, in this case: [radius, widthSegments,
   * heightSegments].
   */
  protected geometryArgs: ConstructorParameters<typeof SphereGeometry> = [
    8, 64, 64,
  ];

  /** */
  protected atmosphereShaderParameters: ShaderMaterialParameters = {
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    side: BackSide,
    blending: AdditiveBlending,
  };

  /** Obtain the mesh reference with `viewChild` signal. */
  private meshRef = viewChild.required<ElementRef<Mesh>>('mesh');

  /** Add the animation to the Three-js loop with `beforeRender` */
  constructor() {
    beforeRender(() => {
      this.animate();
    });
  }

  /**
   * Perform all animation related to our sphere here.
   * 
   * - Slighty scale the atmosphere mesh.
   */
  private animate() {
    const atmosphereMeshEl = this.meshRef().nativeElement;
    atmosphereMeshEl.scale.set(1.1, 1.1, 1.1);
  }
}
