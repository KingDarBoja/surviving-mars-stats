import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import {
  beforeRender,
  extend,
  NgtAfterAttach,
  NgtArgs,
  NgtVector3,
} from 'angular-three';
import { textureResource } from 'angular-three-soba/loaders';
import {
  DoubleSide,
  Mesh,
  ShaderMaterial,
  ShaderMaterialParameters,
  SphereGeometry,
} from 'three';

import marsFragmentShader from '../shaders/mars/marsFragment.glsl';
import marsVertexShader from '../shaders/mars/marsVertex.glsl';

extend({ Mesh, SphereGeometry, ShaderMaterial });

@Component({
  selector: 'sms-mars-mesh',
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  template: `
    <ngt-mesh #mesh [position]="position()">
      <ngt-sphere-geometry
        *args="geometryArgs"
        (attached)="onAttachSphere($event)"
      />

      @let _textures = marsTextures.value();
      <!-- @let map = _textures?.map;
      @let normalMap = _textures?.normalMap;
      @let bumpMap = _textures?.bumpMap; -->

      <!-- <ngt-mesh-standard-material
        [map]="map"
        [normalMap]="normalMap"
        [bumpMap]="bumpMap"
        [parameters]="meshMatParams"
      /> -->

      @if (_textures) {
        <ngt-shader-material [parameters]="marsShaderParameters">
          <ngt-value
            attach="uniforms"
            [rawValue]="{
              diffuseTexture: { value: _textures.map },
              normalTexture: { value: _textures.normalMap },
              bumpTexture: { value: _textures.bumpMap },
            }"
          />
        </ngt-shader-material>
      }
    </ngt-mesh>
  `,
})
export class MarsMeshComponent {
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
  private meshRef = viewChild.required<ElementRef<Mesh>>('mesh');

  /** */
  protected marsTextures = textureResource(() => ({
    // map: './textures/8k_mars.jpg',
    // bumpMap: './textures/8k_topo.jpg',
    map: './textures/mars_4k_color.jpg',
    bumpMap: './textures/mars_4k_topo.jpg',
    normalMap: './textures/mars_4k_normal.jpg',
  }));

  /** */
  protected marsShaderParameters: ShaderMaterialParameters = {
    vertexShader: marsVertexShader,
    fragmentShader: marsFragmentShader,
    side: DoubleSide,
    uniforms: {
      /**
       * The fragment shader has defined `diffuseTexture` as an "Uniform"
       * qualifier. Initially we set as `null` as the `textureResource` is
       * async, then use either `effect()` or conditional `@if` at the template.
       */
      diffuseTexture: {
        value: null,
        // value: this.marsTextures.value()?.map,
      },
      normalTexture: {
        value: null,
      },
      bumpTexture: {
        value: null,
      },
    },
  };

  /** Add the animation to the Three-js loop with `beforeRender` */
  constructor() {
    beforeRender(() => {
      this.animate();
    });
  }

  /**
   * Perform all animation related to our sphere here.
   *
   * - A bit of rotation as every planet does. In this case, small rotation in
   *   the Y axis.
   */
  private animate() {
    const sphereMeshEl = this.meshRef().nativeElement;
    sphereMeshEl.rotateY(0.0001);
  }

  /**
   * This event is emitted when the element is attached or added to the
   * parent. We can log the node (geometry) and the parent (mesh) for
   * debbuging purposes.
   * @param param0
   */
  onAttachSphere(event: NgtAfterAttach<SphereGeometry, Mesh>) {
    const { parent, node } = event;
    console.log('Sphere node: ', node);
    console.log('Parent: ', parent);
  }
}
