import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs';
import Papa from 'papaparse';

import {
  UiTableComponent,
  ColDef,
  ColGroupDef,
} from '../ui-table/ui-table.component';
import { GameIcons, ResourceIconRenderer } from './icons-renderer.component';
import {
  CustomArrayFilterComponent,
  CustomSetFilterComponent,
} from '../ui-table';
import type {
  BreakthroughLocaleSchema,
  BreakthroughName,
  LandingLocationSchema,
} from '../schemas';
import { LocaleService } from '../services/locale.service';
import {
  SurvivingMarsMapId,
  SurvivingMarsMapName,
} from '../schemas/map-name-schemas';

/** @TODO Implement transloco. */
const SurvivingMarsMapNameI18N = {
  [SurvivingMarsMapName.BlankBig_01]: 'Big 01',
  [SurvivingMarsMapName.BlankBig_02]: 'Big 02',
  [SurvivingMarsMapName.BlankBig_03]: 'Big 03',
  [SurvivingMarsMapName.BlankBig_04]: 'Big 04',
  [SurvivingMarsMapName.BlankBigCanyonCMix_01]: 'Big Canyon Mix 01',
  [SurvivingMarsMapName.BlankBigCanyonCMix_02]: 'Big Canyon Mix 02',
  [SurvivingMarsMapName.BlankBigCanyonCMix_03]: 'Big Canyon Mix 03',
  [SurvivingMarsMapName.BlankBigCanyonCMix_04]: 'Big Canyon Mix 04',
  [SurvivingMarsMapName.BlankBigCanyonCMix_05]: 'Big Canyon Mix 05',
  [SurvivingMarsMapName.BlankBigCanyonCMix_06]: 'Big Canyon Mix 06',
  [SurvivingMarsMapName.BlankBigCanyonCMix_07]: 'Big Canyon Mix 07',
  [SurvivingMarsMapName.BlankBigCanyonCMix_08]: 'Big Canyon Mix 08',
  [SurvivingMarsMapName.BlankBigCanyonCMix_09]: 'Big Canyon Mix 09',
  [SurvivingMarsMapName.BlankBigCanyonCMix_10]: 'Big Canyon Mix 10',
  [SurvivingMarsMapName.BlankBigCliffsCMix_01]: 'Big Cliffs Mix 01',
  [SurvivingMarsMapName.BlankBigCliffsCMix_02]: 'Big Cliffs Mix 02',
  [SurvivingMarsMapName.BlankBigCrater_01]: 'Big Crater 01',
  [SurvivingMarsMapName.BlankBigCraterCMix_01]: 'Big Crater Mix 01',
  [SurvivingMarsMapName.BlankBigCraterCMix_02]: 'Big Crater Mix 02',
  [SurvivingMarsMapName.BlankBigHeartCMix_03]: 'Big Hear Mix 03',
  [SurvivingMarsMapName.BlankBigTerraceCMix_01]: 'Big Terrace Mix 01',
  [SurvivingMarsMapName.BlankBigTerraceCMix_02]: 'Big Terrace Mix 02',
  [SurvivingMarsMapName.BlankBigTerraceCMix_03]: 'Big Terrace Mix 03',
  [SurvivingMarsMapName.BlankBigTerraceCMix_04]: 'Big Terrace Mix 04',
  [SurvivingMarsMapName.BlankBigTerraceCMix_05]: 'Big Terrace Mix 05',
  [SurvivingMarsMapName.BlankBigTerraceCMix_06]: 'Big Terrace Mix 06',
  [SurvivingMarsMapName.BlankBigTerraceCMix_07]: 'Big Terrace Mix 07',
  [SurvivingMarsMapName.BlankBigTerraceCMix_08]: 'Big Terrace Mix 08',
  [SurvivingMarsMapName.BlankBigTerraceCMix_09]: 'Big Terrace Mix 09',
  [SurvivingMarsMapName.BlankBigTerraceCMix_10]: 'Big Terrace Mix 10',
  [SurvivingMarsMapName.BlankBigTerraceCMix_11]: 'Big Terrace Mix 11',
  [SurvivingMarsMapName.BlankBigTerraceCMix_12]: 'Big Terrace Mix 12',
  [SurvivingMarsMapName.BlankBigTerraceCMix_13]: 'Big Terrace Mix 13',
  [SurvivingMarsMapName.BlankBigTerraceCMix_14]: 'Big Terrace Mix 14',
  [SurvivingMarsMapName.BlankBigTerraceCMix_15]: 'Big Terrace Mix 15',
  [SurvivingMarsMapName.BlankBigTerraceCMix_16]: 'Big Terrace Mix 16',
  [SurvivingMarsMapName.BlankBigTerraceCMix_17]: 'Big Terrace Mix 17',
  [SurvivingMarsMapName.BlankBigTerraceCMix_18]: 'Big Terrace Mix 18',
  [SurvivingMarsMapName.BlankBigTerraceCMix_19]: 'Big Terrace Mix 19',
  [SurvivingMarsMapName.BlankBigTerraceCMix_20]: 'Big Terrace Mix 20',
  [SurvivingMarsMapName.BlankTerraceBig_05]: 'Big Terrace 05',
  [SurvivingMarsMapName.BlankUnderground_01]: 'Underground 01',
  [SurvivingMarsMapName.BlankUnderground_02]: 'Underground 02',
  [SurvivingMarsMapName.BlankUnderground_03]: 'Underground 03',
  [SurvivingMarsMapName.BlankUnderground_04]: 'Underground 04',
} as const;

type LandingLocationSchemaColumn = {
  /** */
  coordinates: string;
  /** */
  latitude_deg: number;
  /** */
  latitude: 'N' | 'S';
  /** */
  longitude_deg: number;
  /** */
  longitude: 'W' | 'E';
  /** */
  topography: 'Relatively Flat' | 'Steep' | 'Rough' | 'Mountanious';
  /** */
  difficulty: number;
  /** */
  altitude: number;
  /** In degrees */
  temperature: number;
  /* These are summaries that is displayed when the group is closed. */
  sum_resources: number;
  sum_disasters: number;
  /** */
  metals: number;
  rare_metals: number;
  concrete: number;
  water: number;
  dust_devils: number;
  dust_storm: number;
  meteors: number;
  cold_waves: number;
  /** These are fixed enum string. */
  map_name: SurvivingMarsMapId;
  /**
   * English map name.
   *
   * @TODO implement transloco for switching languages.
   */
  map_name_view: string;
  /** These can be empty or a fixed enum string. */
  named_location: string | null;
  /* --------- ALL BREAKTHROUGHS --------- */
  breakthroughs: BreakthroughLocaleSchema[];
  breakthroughs_view: string[];
  // breakthroughs_group: {
  //   breakthrough_1: BreakthroughLocaleSchema;
  //   breakthrough_2: BreakthroughLocaleSchema;
  //   breakthrough_3: BreakthroughLocaleSchema;
  //   breakthrough_4: BreakthroughLocaleSchema;
  //   breakthrough_5: BreakthroughLocaleSchema;
  //   breakthrough_6: BreakthroughLocaleSchema;
  //   breakthrough_7: BreakthroughLocaleSchema;
  //   breakthrough_8: BreakthroughLocaleSchema;
  //   breakthrough_9: BreakthroughLocaleSchema;
  //   breakthrough_10: BreakthroughLocaleSchema;
  //   breakthrough_11: BreakthroughLocaleSchema;
  //   breakthrough_12: BreakthroughLocaleSchema;
  //   breakthrough_13: BreakthroughLocaleSchema;
  // };
};

type LandingLocationColDef =
  | ColDef<LandingLocationSchemaColumn>
  | ColGroupDef<LandingLocationSchemaColumn>;

@Component({
  standalone: true,
  selector: 'sms-landing-location',
  imports: [UiTableComponent],
  template: `

    <section class="grid gap-4 grid-cols-5 pb-8">
      @let selLoc = selectedLocation();

      <div class="col-span-5 md:col-span-2 p-4 sms-border">
        <div class="flex flex-col gap-1 items-center justify-center pb-4">
          <h3 class="m-0">Map Name</h3>

          <!-- Image goes here -->
          <div class="landing-map">
            @if (selLoc) {
              <img
                class="sms-image"
                [alt]="selLoc.map_name_view"
                [src]="'images/maps/' + selLoc.map_name + '.png'"
              />
            } @else {
              <!-- Placeholder image -->
              <img
                class="sms-image"
                [alt]="'placeholder map'"
                [src]="'https://placehold.co/240x160'"
              />
            }
          </div>
          <span class="text-sm font-bold">{{ selLoc ? selLoc.map_name_view : '---' }}</span>
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex flex-col sm:flex-row sm:justify-between">
            <h5 class="w-28 m-0">Location</h5>
            <p class="m-0 sm:text-right text-sm">
              {{ selLoc ? selLoc.coordinates : '---' }}
            </p>
          </div>

          <div class="flex flex-col sm:flex-row sm:justify-between">
            <h5 class="w-28 m-0">Topography</h5>
            <p class="m-0 sm:text-right text-sm">
              {{ selLoc ? selLoc.topography : '---' }}
            </p>
          </div>

          <div class="flex flex-col sm:flex-row sm:justify-between">
            <h5 class="w-28 m-0">Altitude</h5>
            <p class="m-0 sm:text-right text-sm">
              {{ selLoc ? selLoc.altitude : '---' }} m.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row sm:justify-between">
            <h5 class="w-28 m-0">Temperature</h5>
            <p class="m-0 sm:text-right text-sm">
              {{ selLoc ? selLoc.temperature : '---' }} ℃
            </p>
          </div>

          <div class="flex flex-col sm:flex-row sm:justify-between">
            <h5 class="w-28 m-0">Location</h5>
            <p class="m-0 sm:text-right text-sm">
              {{ selLoc ? selLoc.named_location : '---' }}
            </p>
          </div>
        </div>
      </div>

      <div class="col-span-5 md:col-span-3 sms-border">
        <h3 class="text-center">Breakthroughs</h3>

        <div class="bt-list flex flex-col gap-4 px-4 py-0">
          @if (selLoc) {
            @for (btl of selLoc.breakthroughs; track btl.id; let idx = $index) {
              <div class="flex flex-col gap-1">
                <h4 class="m-0">{{ btl.name_loc.en }}</h4>
                <p class="m-0 text-justify text-sm">{{ btl.desc_loc.en }}</p>
              </div>
            }
          }
        </div>
      </div>
    </section>

    <sms-ui-table
      gridId="landing-location-table"
      [rowData]="rowData()"
      [colDefs]="colDefs"
      (gridReady)="gridReady()"
      (rowSelected)="locationSelected($event)"
    />
  `,
  styles: [
    `
      .bt-list {
        max-height: 380px;
        overflow-y: auto;
      }
    `,
  ],
})
export class LandingLocationTableComponent {
  private readonly http = inject(HttpClient);
  private readonly localeService = inject(LocaleService);

  rowData = signal<LandingLocationSchemaColumn[]>([]);
  readonly colDefs: LandingLocationColDef[] = [
    {
      minWidth: 140,
      field: 'coordinates',
      headerName: 'Coordinates',
      sortable: false,
      filter: true,
    },
    {
      minWidth: 120,
      field: 'named_location',
      headerName: 'Named Location',
      filter: { component: CustomSetFilterComponent },
    },
    {
      minWidth: 120,
      field: 'breakthroughs_view',
      headerName: 'Breakthroughs',
      filter: { component: CustomArrayFilterComponent },
      valueFormatter: (params) => (params.value as string[]).join(', '),
    },
    // {
    //   headerName: 'Breakthroughs',
    //   children: [
    //     {
    //       field: 'breakthroughs_group.breakthrough_1.name_loc.en',
    //       headerName: '1',
    //       filter: { component: CustomSetFilterComponent },
    //     },
    //   ],
    // },
    {
      headerName: 'Geography',
      children: [
        {
          field: 'topography',
          headerName: 'Topography',
          filter: { component: CustomSetFilterComponent },
        },
        {
          columnGroupShow: 'open',
          field: 'altitude',
          headerName: 'Altitude',
          filter: 'agNumberColumnFilter',
        },
        {
          columnGroupShow: 'open',
          field: 'temperature',
          headerName: 'Temperature',
          filter: 'agNumberColumnFilter',
        },
        {
          columnGroupShow: 'open',
          field: 'difficulty',
          headerName: 'Difficulty',
          filter: 'agNumberColumnFilter',
        },
      ],
    },
    {
      headerName: 'Disasters',
      openByDefault: true,
      children: [
        {
          columnGroupShow: 'closed',
          field: 'sum_disasters',
          headerName: 'Total disasters',
          filter: 'agNumberColumnFilter',
        },
        {
          columnGroupShow: 'open',
          field: 'dust_devils',
          headerName: 'Dust Devils',
          filter: 'agNumberColumnFilter',
          cellRenderer: ResourceIconRenderer,
          context: {
            iconName: GameIcons.DUST_DEVIL,
          },
        },
        {
          columnGroupShow: 'open',
          field: 'dust_storm',
          headerName: 'Dust Storms',
          filter: 'agNumberColumnFilter',
          cellRenderer: ResourceIconRenderer,
          context: {
            iconName: GameIcons.DUST_STORM,
          },
        },
        {
          columnGroupShow: 'open',
          field: 'meteors',
          headerName: 'Meteors',
          filter: 'agNumberColumnFilter',
          cellRenderer: ResourceIconRenderer,
          context: {
            iconName: GameIcons.METEOR_SHOWER,
          },
        },
        {
          columnGroupShow: 'open',
          field: 'cold_waves',
          headerName: 'Cold Waves',
          filter: 'agNumberColumnFilter',
          cellRenderer: ResourceIconRenderer,
          context: {
            iconName: GameIcons.COLD_WAVE,
          },
        },
      ],
    },
    {
      headerName: 'Resources',
      openByDefault: true,
      children: [
        {
          columnGroupShow: 'closed',
          field: 'sum_resources',
          headerName: 'Total resources',
          filter: 'agNumberColumnFilter',
        },
        {
          columnGroupShow: 'open',
          field: 'concrete',
          headerName: 'Concrete',
          filter: 'agNumberColumnFilter',
        },
        {
          columnGroupShow: 'open',
          field: 'water',
          headerName: 'Water',
          filter: 'agNumberColumnFilter',
        },
        {
          columnGroupShow: 'open',
          field: 'metals',
          headerName: 'Metals',
          filter: 'agNumberColumnFilter',
        },
        {
          columnGroupShow: 'open',
          field: 'rare_metals',
          headerName: 'Rare Metals',
          filter: 'agNumberColumnFilter',
        },
      ],
    },
  ];

  selectedLocation = signal<LandingLocationSchemaColumn>(undefined);

  private readonly _mapLocation$ = this.http
    .get('./data/MapData-Breakthroughs_GP-BB_20.csv', { responseType: 'text' })
    .pipe(map((csvData) => this.parseCSV<LandingLocationSchema>(csvData)));

  private readonly parseCSV = <T>(csvData: string): T[] => {
    const csv = Papa.parse<T>(csvData, {
      skipEmptyLines: true,
      header: true,
      dynamicTyping: true, // Automatically convert numbers and booleans
    });
    return csv.data;
  };

  gridReady() {
    return this._mapLocation$
      .pipe(
        tap((locationRows) => {
          this.rowData.set(this.formatRows(locationRows));
        }),
      )
      .subscribe();
  }

  locationSelected(data: LandingLocationSchemaColumn | undefined) {
    this.selectedLocation.set(data);
  }

  private formatRows(jsonRows: LandingLocationSchema[]) {
    return jsonRows.map<LandingLocationSchemaColumn>((jr) => {
      const formattedLat = jr['Latitude °'].toString().padStart(2, '0');
      const formattedLong = jr['Longitude °'].toString().padStart(3, '0');
      const btNames: BreakthroughName[] = [];
      for (let index = 1; index <= 20; index++) {
        const br = jr[`Breakthrough ${index}`] as BreakthroughName | undefined;
        /** Make sure we push only existing breakthrough columns. */
        if (br) {
          btNames.push(br);
        }
      }
      /** Map the breakthrough name into the id + locales. */
      const btLocales = btNames.map((btName) =>
        this.localeService.getBreakthroughLocale(btName),
      );
      return {
        // coordinates: jr.Coordinates,
        coordinates: `${formattedLat}${jr.Latitude}:${formattedLong}${jr.Longitude}`,
        latitude_deg: jr['Latitude °'],
        latitude: jr.Latitude,
        longitude_deg: jr['Longitude °'],
        longitude: jr.Longitude,
        topography: jr.Topography,
        difficulty: jr['Difficulty Challenge'],
        altitude: jr.Altitude,
        temperature: jr.Temperature,
        metals: jr.Metals,
        rare_metals: jr['Rare Metals'],
        concrete: jr.Concrete,
        water: jr.Water,
        dust_devils: jr['Dust Devils'],
        dust_storm: jr['Dust Storms'],
        meteors: jr.Meteors,
        cold_waves: jr['Cold Waves'],
        map_name: jr['Map Name'],
        map_name_view: SurvivingMarsMapNameI18N[jr['Map Name']],
        named_location: jr['Named Location'],
        /* Additional fields. */
        breakthroughs: btLocales,
        breakthroughs_view: btLocales.map((x) => x.name_loc.en),
        // breakthroughs_group: btLocales.reduce(
        //   (dict, locale, index) => {
        //     dict[`breakthrough_${index + 1}`] = locale;
        //     return dict;
        //   },
        //   {} as LandingLocationSchemaColumn['breakthroughs_group'],
        // ),
        sum_disasters:
          jr['Dust Storms'] + jr['Dust Devils'] + jr.Meteors + jr['Cold Waves'],
        sum_resources: jr.Metals + jr.Concrete + jr.Water + jr['Rare Metals'],
      };
    });
  }
}
