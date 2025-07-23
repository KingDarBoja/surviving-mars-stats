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
  MeshStandardMaterial,
  MeshStandardMaterialParameters,
  MultiplyBlending,
  ShaderMaterial,
  ShaderMaterialParameters,
  SphereGeometry,
} from 'three';

import marsFragmentShader from '../../assets/shaders/mars/marsFragment.glsl';
import marsVertexShader from '../../assets/shaders/mars/marsVertex.glsl';

extend({ Mesh, SphereGeometry, MeshStandardMaterial, ShaderMaterial });

@Component({
  selector: 'sms-mars-mesh',
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  template: `
    <!-- This mesh allows shadows from the directional light. -->
    <ngt-mesh [position]="[0, 0, 0]" castShadow>
      <ngt-sphere-geometry *args="overlayGeoArgs" />
      <ngt-mesh-standard-material [parameters]="overlayMatParams" />
    </ngt-mesh>

    <ngt-mesh #mesh [position]="position()" castShadow>
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

  /** Height and width segments. */
  private readonly sphereSegments = 64;
  private readonly sphereRadius = 8;

  /**
   * Geometry arguments, in this case: [radius, widthSegments,
   * heightSegments].
   */
  protected geometryArgs: ConstructorParameters<typeof SphereGeometry> = [
    this.sphereRadius,
    this.sphereSegments,
    this.sphereSegments,
  ];

  /**
   * This geometry is almost the same as the base sphere, but slighty bigger
   * radius to overlay.
   */
  protected overlayGeoArgs: ConstructorParameters<typeof SphereGeometry> = [
    this.sphereRadius + 0.05,
    this.sphereSegments,
    this.sphereSegments,
  ];

  /** 
   * The overlay to properly cast a shadow from the lightings.This also applies
   * an overlay colour.
   */
  protected overlayMatParams: MeshStandardMaterialParameters = {
    color: 0xbd5417, // Orange-redish
    wireframe: false,
    flatShading: false,
    transparent: true,
    opacity: 0.5,
    premultipliedAlpha: true,
    blending: MultiplyBlending,
  };

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
    sphereMeshEl.rotateY(0.0002);
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
