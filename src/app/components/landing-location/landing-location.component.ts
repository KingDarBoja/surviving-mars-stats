import { Component } from '@angular/core';
import { NgtCameraParameters, NgtVector3 } from 'angular-three';
import { NgtCanvas } from 'angular-three/dom';

import { LandingLocationTableComponent } from './landing-location-table.component';
import { MarsScene } from '../mars-scene/mars-scene.component';

@Component({
  standalone: true,
  imports: [NgtCanvas, LandingLocationTableComponent, MarsScene],
  selector: 'sms-landing-location',
  template: `
    <section class="flex flex-col gap-8">
      <!-- <div id="canvas-container">
        <ngt-canvas
          [camera]="canvasCamera"
          [lookAt]="canvasLookAt"
          (created)="$event.gl.setClearColor('black')"
          shadows
        >
          <sms-mars-scene *canvasContent />
        </ngt-canvas>
      </div> -->

      <sms-landing-location-table />
    </section>
  `,
  styles: [
    `
      #canvas-container {
        width: 100%;
        height: 420px;
      }
    `,
  ],
})
export class LandingLocationComponent {
  protected canvasCamera: NgtCameraParameters = {
    position: [0, 0, 20],
  };
  protected canvasLookAt: NgtVector3 = [0, 0, 0];
}
