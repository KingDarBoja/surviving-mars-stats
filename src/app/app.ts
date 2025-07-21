import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgtCanvas } from 'angular-three/dom';
import { NgtCameraParameters, NgtVector3 } from 'angular-three';

import { MarsScene } from './mars-scene/mars-scene.component';
import { LandingLocationTableComponent } from './landing-location/landing-location-table.component';

/**
 * In order to render your scene graph properly, Angular Three needs to wait
 * until it finishes setting up the context (i.e: store) before rendering. This
 * is where `NgtCanvasContent` directive comes in. It acts purely as an anchor
 * so `NgtCanvas` can render the content when it is ready.
 */
@Component({
  imports: [RouterModule, NgtCanvas, MarsScene, LandingLocationTableComponent],
  standalone: true,
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-root',
  styleUrl: './app.scss',
  template: `
    <div class="container mx-auto py-4">
      <div class="px-2 border border-solid border-orange-200">
        <!-- <router-outlet></router-outlet> -->
        <h1 class="font-bold text-center pb-4">Surviving Mars Stats</h1>

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

          <sms-landing-location />
        </section>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected title = 'surviving-mars-stats';

  protected canvasCamera: NgtCameraParameters = {
    position: [0, 0, 20],
  };
  protected canvasLookAt: NgtVector3 = [0, 0, 0];
}
