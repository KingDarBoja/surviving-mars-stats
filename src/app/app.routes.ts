import { Route } from '@angular/router';
import { LandingLocationComponent } from './components/landing-location/landing-location.component';

export const appRoutes: Route[] = [
  {
    path: '**',
    component: LandingLocationComponent,
  },
];
