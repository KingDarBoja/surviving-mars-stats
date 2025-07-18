import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs';
import Papa from 'papaparse';

import { UiTableComponent, ColDef, ColGroupDef } from '../ui-table/ui-table.component';
import { GameIcons, ResourceIconRenderer } from './icons-renderer.component';
import { CustomSetFilterComponent } from '../ui-table/custom-set-filter.component';

interface LandingLocationSchemaColumn {
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
  named_location: string;
  /* --------- ALL BREAKTHROUGHS --------- */
  breakthrough_1: string;
  breakthrough_2: string;
  breakthrough_3: string;
  breakthrough_4: string;
  breakthrough_5: string;
  breakthrough_6: string;
  breakthrough_7: string;
  breakthrough_8: string;
  breakthrough_9: string;
  breakthrough_10: string;
  breakthrough_11: string;
  breakthrough_12: string;
  breakthrough_13: string;
}

/** The original csv column names. */
interface LandingLocationSchema {
  Coordinates: string;
  'Latitude °': number;
  Latitude: 'N' | 'S';
  'Longitude °': number;
  Longitude: 'W' | 'E';
  Topography: 'Relatively Flat' | 'Steep' | 'Rough' | 'Mountanious';
  'Difficulty Challenge': number;
  Altitude: number;
  Temperature: number;
  Metals: number;
  'Rare Metals': number;
  Concrete: number;
  Water: number;
  'Dust Devils': number;
  'Dust Storms': number;
  Meteors: number;
  'Cold Waves': number;
  'Map Name': string;
  'Named Location': null;
  'Breakthrough 1': string;
  'Breakthrough 2': string;
  'Breakthrough 3': string;
  'Breakthrough 4': string;
  'Breakthrough 5': string;
  'Breakthrough 6': string;
  'Breakthrough 7': string;
  'Breakthrough 8': string;
  'Breakthrough 9': string;
  'Breakthrough 10': string;
  'Breakthrough 11': string;
  'Breakthrough 12': string;
  'Breakthrough 13': string;
}

type LandingLocationColDef =
  | ColDef<LandingLocationSchemaColumn>
  | ColGroupDef<LandingLocationSchemaColumn>;

@Component({
  standalone: true,
  selector: 'sms-landing-location',
  imports: [UiTableComponent, CustomSetFilterComponent],
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

  gridReady() {
    this.http
      .get('./data/MapData Breakthroughs.csv', { responseType: 'text' })
      .pipe(
        map((csvData: string) => {
          const csv = Papa.parse<LandingLocationSchema>(csvData, {
            skipEmptyLines: true,
            header: true,
            dynamicTyping: true, // Automatically convert numbers and booleans
          });
          return csv.data;
        }),
        tap((jsonRows) => {
          this.rowData.set(this.formatRows(jsonRows));
        }),
      )
      .subscribe();
  }

  private formatRows(jsonRows: LandingLocationSchema[]) {
    return jsonRows.map<LandingLocationSchemaColumn>((jr) => {
      const formattedLat = jr['Latitude °'].toString().padStart(2, '0');
      const formattedLong = jr['Longitude °'].toString().padStart(3, '0');
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
        breakthrough_1: jr['Breakthrough 1'],
        breakthrough_2: jr['Breakthrough 2'],
        breakthrough_3: jr['Breakthrough 3'],
        breakthrough_4: jr['Breakthrough 4'],
        breakthrough_5: jr['Breakthrough 5'],
        breakthrough_6: jr['Breakthrough 6'],
        breakthrough_7: jr['Breakthrough 7'],
        breakthrough_8: jr['Breakthrough 8'],
        breakthrough_9: jr['Breakthrough 9'],
        breakthrough_10: jr['Breakthrough 10'],
        breakthrough_11: jr['Breakthrough 11'],
        breakthrough_12: jr['Breakthrough 12'],
        breakthrough_13: jr['Breakthrough 13'],
        /* Additional fields. */
        sum_disasters:
          jr['Dust Storms'] + jr['Dust Devils'] + jr.Meteors + jr['Cold Waves'],
        sum_resources: jr.Metals + jr.Concrete + jr.Water + jr['Rare Metals'],
      };
    });
  }
}
