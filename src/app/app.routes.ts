import { Route } from '@angular/router';
import { VanillaLandingLocationComponent } from './pages/vanilla/vanilla.component';
import { FaqComponent } from './pages/faq/faq.component';
import { RelaunchedLandingLocationComponent } from './pages/relaunched/relaunched.component';

export const appRoutes: Route[] = [
  {
    path: 'vanilla',
    component: VanillaLandingLocationComponent,
  },
  {
    path: 'relaunched',
    component: RelaunchedLandingLocationComponent,
  },
  {
    path: 'faq',
    component: FaqComponent,
  },
  {
    path: '',
    redirectTo: 'vanilla',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
