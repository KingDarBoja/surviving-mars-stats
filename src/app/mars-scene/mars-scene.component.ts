import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { beforeRender, extend, NgtArgs, NgtVector3 } from 'angular-three';
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
  imports: [NgtArgs],
  template: `
    <ngt-color attach="background" *args="sceneColorArgs" />
    <ngt-hemisphere-light *args="hemiLightArgs" />

    <ngt-mesh #sphereMeshRef [position]="meshPosition">
      <ngt-sphere-geometry
        *args="sphereGeoArgs"
        (attached)="onAttachSphere($event)"
      />

      <ngt-mesh-standard-material [parameters]="meshMatParams" />
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
    color: 0xbd5417, // Orange-redish
    wireframe: false,
    flatShading: false,
  };

  /* -------------------- GEOMETRY RELATED CONFIG -------------------- */
  protected sphereGeoArgs: ConstructorParameters<typeof SphereGeometry> = [
    8, 32, 32,
  ];

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
    sphereMeshEl.rotateY(0.0001);
  }
}
