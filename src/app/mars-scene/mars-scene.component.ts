import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  viewChild,
} from '@angular/core';
import { beforeRender, extend, NgtArgs, NgtVector3 } from 'angular-three';
import { gltfResource } from 'angular-three-soba/loaders';

import {
  AxesHelper,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  IcosahedronGeometry,
  Mesh,
  MeshStandardMaterial,
  MeshStandardMaterialParameters,
  SphereGeometry,
} from 'three';
import { MarsMeshComponent } from './mars-mesh.component';
import { MarsAtmosphereMeshComponent } from './mars-atmosphere-mesh.component';

import phobosMoon from '../assets/glb/NASA_Phobos.glb' with { loader: 'file' };

extend({
  Color,
  Group,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  IcosahedronGeometry,
  SphereGeometry,
  MeshStandardMaterial,
  AxesHelper,
});

/**
 * - `CUSTOM_ELEMENTS_SCHEMA` is required to use Angular Three elements in the
 *   template.
 */
@Component({
  selector: 'sms-mars-scene',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [
    NgtArgs,
    MarsMeshComponent,
    MarsAtmosphereMeshComponent,
  ],
  template: `
    <ngt-color attach="background" *args="sceneColorArgs" />
    <ngt-directional-light
      *args="sunLightArgs"
      [position]="sunLightPosition"
      castShadow
    />
    <!-- <ngt-hemisphere-light *args="hemiLightArgs" /> -->

    <!-- <ngt-axes-helper *args="[20]" /> -->

    <ngt-group #marsOrbitGroup>
      <ngt-group #phobosOrbitGroup>
        <ngt-primitive
          *args="[gltfPhobos.scene()]"
          [parameters]="{ scale: 0.08 }"
          [position]="phobosPosition"
          receiveShadow
        />

        <ngt-mesh #phobosMesh [position]="phobosPosition" receiveShadow>
          <ngt-icosahedron-geometry *args="phobosGeoArgs" />
          <ngt-mesh-standard-material [parameters]="phobosMatParams" />
        </ngt-mesh>
      </ngt-group>

      <ngt-group #deimosOrbitGroup>
        <ngt-mesh #deimosMesh [position]="deimosPosition" receiveShadow>
          <ngt-sphere-geometry *args="deimosGeoArgs" />
          <ngt-mesh-standard-material [parameters]="deimosMatParams" />
        </ngt-mesh>
      </ngt-group>
    </ngt-group>

    <ngt-group #marsPlanetGroup>
      <sms-mars-mesh />
      <sms-atmosphere-mesh />
    </ngt-group>
  `,
})
export class MarsScene {
  /* -------------------- SCENE COLOR CONFIG -------------------- */

  /** Convert from Hex to RGB to avoid typing errors. */
  protected sceneColor = new Color().setHex(0x303030);
  /** NgtArgs accepts an array of Constructor Arguments that the entity accepts.
   * In this case, it requires a triplet. */
  protected sceneColorArgs: ConstructorParameters<typeof Color> = [
    this.sceneColor.r,
    this.sceneColor.g,
    this.sceneColor.b,
  ];

  /* -------------------- LIGHTING CONFIG -------------------- */

  protected hemiLightArgs: ConstructorParameters<typeof HemisphereLight> = [
    0xffffff, 0x808080,
  ];
  protected sunLightArgs: ConstructorParameters<typeof DirectionalLight> = [
    0xffffff, 18,
  ];
  protected sunLightPosition: NgtVector3 = [-22, 0, 22];

  /* -------------------- OTHER MESHES CONFIG -------------------- */
  protected gltfPhobos = gltfResource(() => phobosMoon);

  protected phobosGeoArgs: ConstructorParameters<typeof IcosahedronGeometry> = [
    0.5, 5,
  ];
  protected phobosPosition: NgtVector3 = [12, 4, 0];
  protected phobosMatParams: MeshStandardMaterialParameters = {
    color: 0xff9d6f, // Atomic tangerine
    wireframe: false,
  };

  protected deimosGeoArgs: ConstructorParameters<typeof SphereGeometry> = [
    0.2, 8, 8,
  ];
  protected deimosPosition: NgtVector3 = [10, -2, 0];
  protected deimosMatParams: MeshStandardMaterialParameters = {
    color: 0x107e57, // Green-like
    wireframe: false,
  };

  /* -------------------- ANIMATION CONFIG -------------------- */

  /** Select the group element to perform some animation changes. */
  private _marsPlanetGroupRef =
    viewChild.required<ElementRef<Group>>('marsPlanetGroup');

  private _phobosOrbitGroupRef =
    viewChild.required<ElementRef<Group>>('phobosOrbitGroup');
  private _deimosOrbitGroupRef =
    viewChild.required<ElementRef<Group>>('deimosOrbitGroup');

  private _phobosMeshRef = viewChild.required<ElementRef<Mesh>>('phobosMesh');
  private _deimosMeshRef = viewChild.required<ElementRef<Mesh>>('deimosMesh');

  /** Mars axis tilt angle in radians. */
  private readonly _marsTiltAngle = -(25.2 * Math.PI) / 180;

  constructor() {
    beforeRender(() => {
      this.animate();
    });
  }

  /**
   * We want to avoid putting the tilt angle at the mars child mesh as the
   * rotation speed can mess up the alignment of the geometry.
   */
  private animate() {
    const marsPlanetGroupEl = this._marsPlanetGroupRef().nativeElement;

    const phobosOrbitGroupEl = this._phobosOrbitGroupRef().nativeElement;
    const deimosOrbitGroupEl = this._deimosOrbitGroupRef().nativeElement;

    const phobosMeshEl = this._phobosMeshRef().nativeElement;
    const deimosMeshEl = this._deimosMeshRef().nativeElement;

    /** The tilt angle. */
    marsPlanetGroupEl.rotation.z = this._marsTiltAngle;
    /** Add the rotation around the planet orbit. */
    phobosOrbitGroupEl.rotateY(0.004);
    deimosOrbitGroupEl.rotateY(0.007);
    /** We add rotation for Phobos moon. */
    phobosMeshEl.rotateY(0.004);
    /** And do the same for Deimos moon. */
    deimosMeshEl.rotateY(0.002);
  }
}
