import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, switchMap, tap } from 'rxjs';
import Papa from 'papaparse';

import {
  UiTableComponent,
  ColDef,
  ColGroupDef,
} from '../ui-table/ui-table.component';
import { GameIcons, ResourceIconRenderer } from './icons-renderer.component';
import { CustomSetFilterComponent } from '../ui-table/custom-set-filter.component';
import {
  BreakthroughMapping,
  BreakthroughSourceLocaleSchema,
  type BreakthroughLocaleSchema,
  type BreakthroughName,
  type LandingLocationSchema,
} from '../schemas/schemas';
import { LocaleService } from '../services/locale.service';

export type LandingLocationSchemaColumn = {
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
  map_name: string;
  /** These can be empty or a fixed enum string. */
  named_location: string | null;
  /* --------- ALL BREAKTHROUGHS --------- */
  // breakthroughs: BreakthroughLocaleSchema[];
  breakthroughs_group: {
    breakthrough_1: BreakthroughLocaleSchema;
    breakthrough_2: BreakthroughLocaleSchema;
    breakthrough_3: BreakthroughLocaleSchema;
    breakthrough_4: BreakthroughLocaleSchema;
    breakthrough_5: BreakthroughLocaleSchema;
    breakthrough_6: BreakthroughLocaleSchema;
    breakthrough_7: BreakthroughLocaleSchema;
    breakthrough_8: BreakthroughLocaleSchema;
    breakthrough_9: BreakthroughLocaleSchema;
    breakthrough_10: BreakthroughLocaleSchema;
    breakthrough_11: BreakthroughLocaleSchema;
    breakthrough_12: BreakthroughLocaleSchema;
    breakthrough_13: BreakthroughLocaleSchema;
  };
};

type LandingLocationColDef =
  | ColDef<LandingLocationSchemaColumn>
  | ColGroupDef<LandingLocationSchemaColumn>;

@Component({
  standalone: true,
  selector: 'sms-landing-location',
  imports: [UiTableComponent],
  template: `
    <sms-ui-table
      gridId="landing-location-table"
      [rowData]="rowData()"
      [colDefs]="colDefs"
      (gridReady)="gridReady()"
    />
  `,
})
export class LandingLocationTableComponent {
  private readonly http = inject(HttpClient);
  private readonly localeService = inject(LocaleService);

  rowData = signal<LandingLocationSchemaColumn[]>([]);
  readonly colDefs: LandingLocationColDef[] = [
    {
      minWidth: 120,
      field: 'coordinates',
      headerName: 'Coordinates',
      sortable: false,
      filter: false,
    },
    {
      headerName: 'Breakthroughs',
      children: [
        {
          field: 'breakthroughs_group.breakthrough_1.name_loc.en',
          headerName: '1',
          filter: { component: CustomSetFilterComponent },
        },
      ],
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

  private readonly _mapLocation$ = this.http
    .get('./data/MapData Breakthroughs.csv', { responseType: 'text' })
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

  private formatRows(jsonRows: LandingLocationSchema[]) {
    return jsonRows.map<LandingLocationSchemaColumn>((jr) => {
      const formattedLat = jr['Latitude °'].toString().padStart(2, '0');
      const formattedLong = jr['Longitude °'].toString().padStart(3, '0');
      const btNames: BreakthroughName[] = [];
      for (let index = 1; index <= 13; index++) {
        const br = jr[`Breakthrough ${index}`] as BreakthroughName;
        btNames.push(br);
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
        named_location: jr['Named Location'],
        breakthroughs_group: btLocales.reduce(
          (dict, locale, index) => {
            dict[`breakthrough_${index + 1}`] = locale;
            return dict;
          },
          {} as LandingLocationSchemaColumn['breakthroughs_group'],
        ),
        /* Additional fields. */
        // breakthroughs: btLocales,
        sum_disasters:
          jr['Dust Storms'] + jr['Dust Devils'] + jr.Meteors + jr['Cold Waves'],
        sum_resources: jr.Metals + jr.Concrete + jr.Water + jr['Rare Metals'],
      };
    });
  }
}
