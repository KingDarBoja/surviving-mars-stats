import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, viewChild } from '@angular/core';
import { beforeRender, extend, NgtArgs, NgtVector3 } from 'angular-three';

import {
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
} from 'three';
import { MarsMeshComponent } from './mars-mesh.component';
import { MarsAtmosphereMeshComponent } from './mars-atmosphere-mesh.component';

extend({ Color, Group, Mesh, SphereGeometry, MeshStandardMaterial });

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
    <ngt-directional-light *args="sunLightArgs" [position]="sunLightPosition" />
    <!-- <ngt-hemisphere-light *args="hemiLightArgs" /> -->

    <ngt-group #marsMeshGroup>
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
  protected sunLightArgs: ConstructorParameters<typeof DirectionalLight> = [0xffffff, 12];
  protected sunLightPosition: NgtVector3 = [-1.4, 0, 0.8];

  /* -------------------- ANIMATION CONFIG -------------------- */

  /** Select the group element to perform some animation changes. */
  private meshGroupRef = viewChild.required<ElementRef<Group>>('marsMeshGroup');

  /** Mars axis tilt angle in radians. */
  private readonly _marsTiltAngle = -(25.2 * Math.PI) / 180;

  constructor() {
    beforeRender(() => {
      this.animate();
    })
  }

  /**
   * We want to avoid putting the tilt angle at the mars child mesh as the
   * rotation speed can mess up the alignment of the geometry.
   */
  private animate() {
    const meshGroupEl = this.meshGroupRef().nativeElement;
    /** The tilt angle. */
    meshGroupEl.rotation.z = this._marsTiltAngle;
  }
}
