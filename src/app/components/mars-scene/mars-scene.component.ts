import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  viewChild,
} from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { beforeRender, extend, is, NgtArgs, NgtVector3 } from 'angular-three';
import { gltfResource } from 'angular-three-soba/loaders';
import { helper } from 'angular-three-soba/abstractions';

import {
  AxesHelper,
  CameraHelper,
  Color,
  ColorRepresentation,
  DirectionalLight,
  DirectionalLightHelper,
  Group,
  HemisphereLight,
  IcosahedronGeometry,
  Mesh,
  MeshStandardMaterial,
  MeshStandardMaterialParameters,
  SphereGeometry,
} from 'three';
import { GLTF } from 'three-stdlib';

import phobosMoonGLB from '../../assets/glb/NASA_Phobos.glb' with { loader: 'file' };
import deimosMoonGLB from '../../assets/glb/NASA_Deimos.glb' with { loader: 'file' };

import { MarsMeshComponent } from './mars-mesh.component';
import { MarsAtmosphereMeshComponent } from './mars-atmosphere-mesh.component';

extend({
  Color,
  Group,
  DirectionalLight,
  DirectionalLightHelper,
  CameraHelper,
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
    KeyValuePipe,
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
      #sunLight
    >
      @for (prop of sunLightShadowCamera | keyvalue; track prop.key) {
        <ngt-value
          [attach]="['shadow', 'camera', prop.key]"
          [rawValue]="prop.value"
        />
      }
    </ngt-directional-light>

    <!-- <ngt-hemisphere-light *args="hemiLightArgs" /> -->

    <!-- <ngt-axes-helper *args="[20]" /> -->
    <ngt-group #marsPlanetGroup>
      <sms-mars-mesh />
      <sms-atmosphere-mesh />
    </ngt-group>

    <ngt-group #marsOrbitGroup>
      <ngt-group #phobosOrbitGroup>
        <ngt-mesh #phobosMesh [position]="phobosPosition">
          <!-- <ngt-axes-helper *args="[5]" /> -->
          <ngt-primitive *args="[gltfPhobos.scene()]" />
        </ngt-mesh>

        <!-- <ngt-mesh #phobosMesh [position]="phobosPosition" receiveShadow>
          <ngt-icosahedron-geometry *args="phobosGeoArgs" />
          <ngt-mesh-standard-material [parameters]="phobosMatParams" />
        </ngt-mesh> -->
      </ngt-group>

      <ngt-group #deimosOrbitGroup>
        <ngt-mesh #deimosMesh [position]="deimosPosition">
          <!-- <ngt-axes-helper *args="[5]" /> -->
          <ngt-primitive *args="[gltfDeimos.scene()]" />
        </ngt-mesh>

        <!-- <ngt-mesh #deimosMesh [position]="deimosPosition" receiveShadow>
          <ngt-sphere-geometry *args="deimosGeoArgs" />
          <ngt-mesh-standard-material [parameters]="deimosMatParams" />
        </ngt-mesh> -->
      </ngt-group>
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

  /** Pass a warm color to both light elements. */
  protected hemiLightArgs: ConstructorParameters<typeof HemisphereLight> = [
    0xffddaa, 0x808080,
  ];
  /** Pass a warm color to both light elements. */
  protected sunLightArgs: ConstructorParameters<typeof DirectionalLight> = [
    0xffddaa, 18,
  ];
  protected sunLightPosition: NgtVector3 = [-16, 0, 10];
  protected sunLightShadowCamera = {
    left: -20,
    right: 20,
    top: 20,
    bottom: -20,
    near: 1,
    far: 60,
  };

  sunLight = viewChild<ElementRef<DirectionalLight>>('sunLight');

  /** Uncomment to display the directional light helper. */
  // sunLightHelper = helper(this.sunLight, () => DirectionalLightHelper, {
  //   args: () => [5, '#FFFFFF'] as [number, ColorRepresentation],
  // });

  /** Uncomment to display the directional light shadow frustum. */
  // sunLightCameraShadowHelper = helper(
  //   () => this.sunLight()?.nativeElement.shadow.camera,
  //   () => CameraHelper,
  //   {},
  // );

  /* -------------------- SATELLITE MESHES CONFIG -------------------- */

  /** 
   * The position is shared with the example geometry and the gltf files. The
   * real distance from Mars surface to Phobos orbit is roughly 6000 km.
   */
  protected phobosPosition: NgtVector3 = [-10, 1, 0];
  protected phobosGeoArgs: ConstructorParameters<typeof IcosahedronGeometry> = [
    0.1, 2,
  ];
  protected phobosMatParams: MeshStandardMaterialParameters = {
    color: 0xff9d6f, // Atomic tangerine
    wireframe: false,
  };

  /** 
   * The position is shared with the example geometry and the gltf files. The
   * real distance from Mars surface to Deimos orbit is roughly 23400 km.
   */
  protected deimosPosition: NgtVector3 = [10, -2, 0];
  protected deimosGeoArgs: ConstructorParameters<typeof SphereGeometry> = [
    0.5, 14, 14,
  ];
  protected deimosMatParams: MeshStandardMaterialParameters = {
    color: 0x107e57, // Green-like
    wireframe: false,
  };

  /* -------------------- GLTF LOADING -------------------- */

  /** 
   * AFAIK, both gltf share the same scale. As mars size in reality is roughly
   * 6800 meters and its satellites are roughly 22 km (Phobos) and 12 km
   * (Deimos), those would look too tiny in the rendered scene. So used the
   * scale of 0.016 for a decent visualization of Mars Moon's. 
   */
  private readonly gltfCommonConfig = { scale: 0.016 };

  /** */
  protected gltfPhobos = gltfResource<GLTF>(() => phobosMoonGLB, {
    onLoad: (node) => {
      const model = node.scene;

      model.scale.setScalar(this.gltfCommonConfig.scale);
      model.traverse((child) => {
        if (is.object3D(child)) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    },
  });

  /** */
  protected gltfDeimos = gltfResource<GLTF>(() => deimosMoonGLB, {
    onLoad: (node) => {
      const model = node.scene;

      model.scale.setScalar(this.gltfCommonConfig.scale);
      model.traverse((child) => {
        if (is.object3D(child)) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    },
  });

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
    /**
     * Add the rotation around the planet orbit. We use a random rotation rate,
     * where the real rotation in radians is commented (If calculations aren't
     * wrong ofc lol).
     */
    phobosOrbitGroupEl.rotateY(0.004);
    deimosOrbitGroupEl.rotateY(0.001);
    // phobosOrbitGroupEl.rotateY(0.000228) // Real orbital rotation in radians.
    // deimosOrbitGroupEl.rotateY(0.0000575) // Real orbital rotation in radians.
    /** We add rotation for Phobos moon. */
    phobosMeshEl.rotateY(0.004);
    phobosMeshEl.rotateX(0.002);
    /** And do the same for Deimos moon. */
    deimosMeshEl.rotateY(0.002);
    deimosMeshEl.rotateX(0.005);
  }
}
