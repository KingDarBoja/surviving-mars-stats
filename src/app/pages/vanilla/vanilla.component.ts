import { Component } from '@angular/core';
import { LandingLocationComponent } from "../../components/landing-location/landing-location.component";

@Component({
  standalone: true,
  imports: [LandingLocationComponent],
  selector: 'sms-vanilla-landing-location',
  template: `
    <sms-landing-location />
  `
})

export class VanillaLandingLocationComponent {
}