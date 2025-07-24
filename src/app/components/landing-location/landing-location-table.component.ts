import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BehaviorSubject, map, of, switchMap, tap } from 'rxjs';
import Papa from 'papaparse';

import {
  UiTableComponent,
  ColDef,
  ColGroupDef,
} from '../../shared/ui-table/ui-table.component';
import { GameIcons, ResourceIconRenderer } from './icons-renderer.component';
import {
  CustomArrayFilterComponent,
  CustomSetFilterComponent,
} from '../../shared/ui-table';
import {
  BreakthroughIcon,
  NamedLocation,
  SurvivingMarsBreakthroughVersionValue,
  SurvivingMarsNamedLocationMapping,
  type BreakthroughLocaleSchema,
  type BreakthroughName,
  type LandingLocationSchema,
} from '../../shared/schemas';
import { LocaleService } from '../../shared/services';
import {
  SurvivingMarsBreakthroughVersions,
  SurvivingMarsMapNameI18N,
  type SurvivingMarsMapId,
} from '../../shared/schemas';

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
  named_location: NamedLocation | null;
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
  selector: 'sms-landing-location-table',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    UiTableComponent,
  ],
  template: `
    <section class="grid gap-4 grid-cols-5 pb-8">
      @let selLoc = selectedLocation();

      <div class="col-span-5 md:col-span-2 sms-border">
        <h3 class="m-0 p-2 text-center sms-header">Map Name</h3>
        <div class="flex flex-col gap-1 items-center justify-center p-4">
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
          <span class="text-sm font-bold">{{
            selLoc ? selLoc.map_name_view : '---'
          }}</span>
        </div>
        <div class="flex flex-col gap-1 px-4">
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
        <h3 class="m-0 p-2 text-center sms-header">Breakthroughs</h3>

        <div class="bt-list flex flex-col py-0">
          @if (selLoc) {
            @for (btl of selLoc.breakthroughs; track btl.id; let idx = $index) {
              <div class="flex p-4 gap-4 sms-border-top">
                <img
                  class="bt-icon"
                  [alt]="btl.name_loc.en"
                  [src]="'icons/research/' + breakthroughIcon[btl.id] + '.png'"
                />
                <div class="flex flex-col gap-1">
                  <h4
                    class="m-0"
                    [class]="{
                      'sms-bt-pa': idx < 4,
                    }"
                  >
                    {{ btl.name_loc.en }}
                  </h4>
                  <p class="m-0 text-justify text-sm text">
                    {{ btl.desc_loc.en }}
                  </p>
                </div>
              </div>
            }
          } @else {
            <p class="text-center">No location selected.</p>
          }
        </div>
      </div>
    </section>

    <mat-form-field>
      <mat-label>Select game version</mat-label>
      <mat-select (selectionChange)="selectedGV($event)">
        @for (gameVersion of gameVersions; track gameVersion.id) {
          <mat-option [value]="gameVersion">{{ gameVersion.label }}</mat-option>
        }
      </mat-select>
    </mat-form-field>

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
        height: 380px;
        overflow-y: auto;
      }

      .bt-icon {
        width: 64px;
        object-fit: contain;
      }
    `,
  ],
})
export class LandingLocationTableComponent {
  private readonly http = inject(HttpClient);
  private readonly localeService = inject(LocaleService);

  readonly breakthroughIcon = BreakthroughIcon;
  readonly gameVersions = Object.values(SurvivingMarsBreakthroughVersions);

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
      filterParams: {
        /** @TODO provide translation object. */
        options: Object.keys(SurvivingMarsNamedLocationMapping),
      }
    },
    {
      minWidth: 140,
      field: 'map_name_view',
      headerName: 'Map Name',
      tooltipField: "map_name_view",
      filter: { component: CustomSetFilterComponent },
      filterParams: {
        options: Object.values(SurvivingMarsMapNameI18N),
      },
    },
    {
      minWidth: 200,
      field: 'breakthroughs_view',
      headerName: 'Breakthroughs',
      filter: { component: CustomArrayFilterComponent },
      filterParams: {
        options: Object.values(
          this.localeService.getAllBreakthroughLocales(),
        ).map((x) => x.name_loc.en),
      },
      valueFormatter: (params) => (params.value as string[]).join(', '),
    },
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
  private readonly _selectedGameVersion$ =
    new BehaviorSubject<SurvivingMarsBreakthroughVersionValue>(undefined);

  private readonly _mapLocation$ = this._selectedGameVersion$
    .asObservable()
    .pipe(
      switchMap((gameVersion) => {
        if (gameVersion) {
          return this.http
            .get(gameVersion.path, {
              responseType: 'text',
            })
            .pipe(
              map((csvData) => this.parseCSV<LandingLocationSchema>(csvData)),
            );
        }
        return of([] as LandingLocationSchema[]);
      }),
    );

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

  selectedGV({
    value,
  }: MatSelectChange<SurvivingMarsBreakthroughVersionValue>) {
    this._selectedGameVersion$.next(value);
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
        named_location: jr['Named Location'] ? jr['Named Location'].trim() as NamedLocation : null,
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
