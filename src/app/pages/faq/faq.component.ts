import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  selector: 'sms-faq',
  templateUrl: 'faq.component.html',
})

export class FaqComponent {
  readonly sourceDataRepo = 'https://github.com/ChoGGi/SurvivingMars_Mods/tree/a2fdae7bc128150174d1c3e059e064000f87fb05/Map%20Locations';
  readonly githubRepo = 'https://github.com/KingDarBoja/surviving-mars-stats/issues';
}