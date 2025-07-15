import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  viewChild,
} from '@angular/core';
import {
  beforeRender,
  extend,
  NgtArgs,
  NgtVector3,
} from 'angular-three';
import { textureResource } from 'angular-three-soba/loaders';
import { NgtsEnvironment } from 'angular-three-soba/staging';

import {
  Color,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  MeshStandardMaterialParameters,
  SphereGeometry,
} from 'three';

extend({ Color, Mesh, SphereGeometry, MeshStandardMaterial });

/**
 * - `CUSTOM_ELEMENTS_SCHEMA` is required to use Angular Three elements in the
 *   template.
 */
@Component({
  selector: 'sms-mars-scene',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  //   standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtArgs, NgtsEnvironment],
  template: `
    <ngt-color attach="background" *args="sceneColorArgs" />
    <!-- <ngt-hemisphere-light *args="hemiLightArgs" /> -->

    <ngt-mesh #sphereMeshRef [position]="meshPosition">
      <ngt-sphere-geometry
        *args="sphereGeoArgs"
        (attached)="onAttachSphere($event)"
      />

      @let _textures = marsTextures.value();
      @let map = _textures?.map;
      @let normalMap = _textures?.normalMap;
      @let bumpMap = _textures?.bumpMap;

      <ngt-mesh-standard-material
        [map]="map"
        [normalMap]="normalMap"
        [bumpMap]="bumpMap"
        [parameters]="meshMatParams"
      />

      <ngts-environment [options]="{ preset: 'sunset' }" />
    </ngt-mesh>
  `,
})
export class MarsScene {
  /* -------------------- SCENE RELATED CONFIG -------------------- */

  /** Convert from Hex to RGB to avoid typing errors. */
  protected sceneColor = new Color().setHex(0x303030);
  /** NgtArgs accepts an array of Constructor Arguments that the entity accepts.
   * In this case, it requires a triplet. */
  protected sceneColorArgs: ConstructorParameters<typeof Color> = [
    this.sceneColor.r,
    this.sceneColor.g,
    this.sceneColor.b,
  ];

  protected hemiLightArgs: ConstructorParameters<typeof HemisphereLight> = [
    0xffffff, 0x808080,
  ];

  /* -------------------- MESH RELATED CONFIG -------------------- */
  protected meshPosition: NgtVector3 = [0, 0, 0];
  protected meshMatParams: MeshStandardMaterialParameters = {
    // color: 0xbd5417, // Orange-redish
    wireframe: false,
    flatShading: false,
  };

  /* -------------------- GEOMETRY RELATED CONFIG -------------------- */
  protected sphereGeoArgs: ConstructorParameters<typeof SphereGeometry> = [
    8, 64, 64,
  ];

  protected marsTextures = textureResource(() => ({
    // map: './textures/8k_mars.jpg',
    // bumpMap: './textures/mars_4k_topo.jpg',
    map: './textures/mars_4k_color.jpg',
    bumpMap: './textures/mars_4k_topo.jpg',
    normalMap: './textures/mars_4k_normal.jpg'
  }));

  /* -------------------- ANIMATION RELATED CONFIG -------------------- */

  /** Obtain the mesh reference with `viewChild` signal. */
  sphereMeshRef = viewChild.required<ElementRef<Mesh>>('sphereMeshRef');

  onAttachSphere({ node, parent }: { node: SphereGeometry; parent: Mesh }) {
    console.log('Sphere node: ', node);
    console.log('Parent: ', parent);
  }

  /** Mars axis tilt angle in radians. */
  private readonly _marsTiltAngle = -(25.2 * Math.PI) / 180;

  /** Add the animation to the Three-js loop with `beforeRender` */
  constructor() {
    beforeRender(() => {
      this.animateSphere();
    });
  }

  /**
   * Perform all animation related to our sphere here.
   */
  private animateSphere() {
    const sphereMeshEl = this.sphereMeshRef().nativeElement;
    /** The tilt angle. */
    sphereMeshEl.rotation.z = this._marsTiltAngle;
    /** 
     * A bit of rotation as every planet does. In this case, small rotation in
     * the Y axis.
     */
    sphereMeshEl.rotateY(0.0001);
  }
}
