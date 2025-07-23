import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NavigationComponent } from './components/navigation/navigation.component';

/**
 * In order to render your scene graph properly, Angular Three needs to wait
 * until it finishes setting up the context (i.e: store) before rendering. This
 * is where `NgtCanvasContent` directive comes in. It acts purely as an anchor
 * so `NgtCanvas` can render the content when it is ready.
 */
@Component({
  imports: [RouterModule, NavigationComponent],
  standalone: true,
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-root',
  styleUrl: './app.scss',
  template: `
    <sms-navigation-bar />

    <div class="container mx-auto py-4">
      <div class="p-4 mx-4 sms-border">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected title = 'surviving-mars-stats';
}
