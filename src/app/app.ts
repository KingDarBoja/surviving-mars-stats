import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgtCanvas } from 'angular-three/dom';
import { NgtCameraParameters } from 'angular-three';

import { MarsScene } from './mars-scene/mars-scene.component';

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
        [camera]="canvasCamera()"
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

  canvasCamera = input<NgtCameraParameters>({
    position: [0, 0, 20],
  });
}
