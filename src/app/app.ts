import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgtCanvas } from 'angular-three/dom';
import { NgtCameraParameters, NgtVector3 } from 'angular-three';

import { MarsScene } from './mars-scene/mars-scene.component';

/**
 * In order to render your scene graph properly, Angular Three needs to wait
 * until it finishes setting up the context (i.e: store) before rendering. This
 * is where `NgtCanvasContent` directive comes in. It acts purely as an anchor
 * so `NgtCanvas` can render the content when it is ready.
 */
@Component({
  imports: [RouterModule, NgtCanvas, MarsScene],
  standalone: true,
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-root',
  styleUrl: './app.scss',
  template: `
    <!-- <router-outlet></router-outlet> -->
    <h1>Surviving Mars Landing</h1>

    <div id="canvas-container">
      <ngt-canvas
        [camera]="canvasCamera"
        [lookAt]="canvasLookAt"
        (created)="$event.gl.setClearColor('black')"
      >
        <sms-mars-scene *canvasContent />
      </ngt-canvas>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected title = 'surviving-mars-stats';

  protected canvasCamera: NgtCameraParameters = {
    position: [0, 0, 18],
  };
  protected canvasLookAt: NgtVector3 = [0, 0, 0];
}
