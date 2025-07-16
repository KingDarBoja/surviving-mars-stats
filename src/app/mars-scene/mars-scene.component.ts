import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, viewChild } from '@angular/core';
import { beforeRender, extend, NgtArgs } from 'angular-three';
import { NgtsEnvironment } from 'angular-three-soba/staging';

import {
  Color,
  Group,
  HemisphereLight,
  Mesh,
  ShaderMaterial,
  SphereGeometry,
} from 'three';
import { MarsMeshComponent } from './mars-mesh.component';
import { MarsAtmosphereMeshComponent } from './mars-atmosphere-mesh.component';

extend({ Color, Mesh, SphereGeometry, ShaderMaterial });

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
    NgtsEnvironment,
    MarsMeshComponent,
    MarsAtmosphereMeshComponent,
  ],
  template: `
    <ngt-color attach="background" *args="sceneColorArgs" />
    <ngt-hemisphere-light *args="hemiLightArgs" />
    <!-- <ngts-environment [options]="{ preset: 'sunset' }" /> -->

    <ngt-group #marsMeshGroup>
      <sms-mars-mesh />
      <sms-atmosphere-mesh />
    </ngt-group>
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

  /** */
  private meshGroupRef = viewChild.required<ElementRef<Group>>('marsMeshGroup');

  /** Mars axis tilt angle in radians. @TPDO apply to parent group instead. */
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
