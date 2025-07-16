import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { extend, NgtArgs } from 'angular-three';
import { NgtsEnvironment } from 'angular-three-soba/staging';

import {
  Color,
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

    <sms-mars-mesh />

    <sms-atmosphere-mesh />
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
}
