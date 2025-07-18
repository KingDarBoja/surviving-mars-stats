import { Component, effect, input, output } from '@angular/core';

import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import {
  colorSchemeLight,
  iconSetMaterial,
  themeMaterial,
} from 'ag-grid-community'; // Column Definition Type Interface
import type {
  GridOptions,
  HeaderValueGetterParams,
  DataTypeDefinition,
  GridReadyEvent,
  AbstractColDef,
} from 'ag-grid-community';

export type { ColDef } from 'ag-grid-community';

@Component({
  standalone: true,
  imports: [AgGridAngular],
  selector: 'sms-ui-table',
  template: `
    <ag-grid-angular
      style="width: 100%; height: 550px"
      [gridOptions]="gridOptions"
      [dataTypeDefinitions]="dataTypeDefinitions"
      [rowData]="rowData()"
      [columnDefs]="colDefs()"
      (gridReady)="gridReadyEvent($event)"
    />
  `,
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class UiTableComponent<TData = any> {
  /** */
  readonly gridId = input.required<string>();
  /** */
  readonly rowData = input.required<TData[]>();
  /** */
  readonly colDefs = input.required<AbstractColDef<TData>[]>();

  /** */
  readonly gridReady = output<GridReadyEvent>();

  /** */
  protected gridReadyEvent(params: GridReadyEvent) {
    this.gridReady.emit(params);
  }

  /** Default grid options for this table (global). */
  readonly gridOptions: GridOptions = {
    /** Controls the theme. Quarts is the most similar to material. */
    theme: themeMaterial
      .withPart(iconSetMaterial)
      .withPart(colorSchemeLight)
      // Material icons are designed to look best at 18, 24, 36 or 48px
      .withParams({
        iconSize: 18,
        browserColorScheme: 'light',
        headerFontWeight: 700,
        headerTextColor: '#FFFFFF',
        headerBackgroundColor: '#bd5417',
      }),
    defaultColDef: {
      headerClass: 'ag-custom-header',
      cellClass: 'ag-custom-cell',
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 120,
      // headerValueGetter: (p) => this.localizeHeader(p),
      context: {
        label: '',
      },
    },
    pagination: true,
  };

  constructor() {
    effect(() => {
      /** Allow setting the grid id after view is initialized. */
      this.gridOptions.gridId = this.gridId();
    });
  }

  /** Add other formatting options to data types. Right now we don't need any. */
  readonly dataTypeDefinitions: Record<string, DataTypeDefinition> = {};

  // private localizeHeader(params: HeaderValueGetterParams<TData>): string {
  //   const headerLabelI18N = params.colDef.context?.label;
  //   return this.transloco.translate(headerLabelI18N);
  // }
}
