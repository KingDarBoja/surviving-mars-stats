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
  RowSelectionOptions,
  GridState,
  RowSelectedEvent,
  GridApi,
} from 'ag-grid-community';

export type { ColDef, ColGroupDef } from 'ag-grid-community';

@Component({
  standalone: true,
  imports: [AgGridAngular],
  selector: 'sms-ui-table',
  template: `
    <ag-grid-angular
      style="width: 100%; height: 550px"
      [gridOptions]="gridOptions"
      [dataTypeDefinitions]="dataTypeDefinitions"
      [rowSelection]="rowSelection()"
      [initialState]="initialState()"
      [rowData]="rowData()"
      [columnDefs]="colDefs()"
      (gridReady)="gridReadyEvent($event)"
      (rowSelected)="rowSelectedEvent($event)"
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
  readonly rowSelected = output<TData | undefined>();

  readonly initialState = input<GridState | undefined>();

  readonly rowSelection = input<RowSelectionOptions | 'single' | 'multiple'>({
    mode: 'singleRow',
    // checkboxes: false,
    enableClickSelection: true,
  });

  /** */
  protected gridReadyEvent(params: GridReadyEvent) {
    this._gridApi = params.api; // Store the grid API
    this.gridReady.emit(params);
  }

  private _gridApi!: GridApi;

  /**
   * Emit the row selected data.
   *
   * When `isSelected()` is true, the row was selected, otherwise deselected.
   *
   * https://www.ag-grid.com/angular-data-grid/row-selection-api-reference/#reference-selection-rowSelected
   */
  protected rowSelectedEvent({ node, data }: RowSelectedEvent<TData>) {
    /* Ensure gridApi is available. */
    if (!this._gridApi) {
      return;
    }

    /* Get all currently selected row nodes. */
    const selectedNodes = this._gridApi.getSelectedNodes();

    if (node.isSelected()) {
      this.rowSelected.emit(data);
    } else {
      /* Row was deselected. If no other rows are selected, emit undefined. */
      if (selectedNodes.length === 0) {
        this.rowSelected.emit(undefined);
      }
    }
  }

  /** Default grid options for this table (global). */
  readonly gridOptions: GridOptions = {
    /** Controls the theme. Quarts is the most similar to material. */
    theme: themeMaterial
      .withPart(iconSetMaterial)
      // .withPart(colorSchemeLight)
      // Material icons are designed to look best at 18, 24, 36 or 48px
      .withParams(
        {
          iconSize: 18,
          fontSize: 12,
          browserColorScheme: 'light',
          headerFontWeight: 500,
          // headerTextColor: '#FFFFFF',
          // headerBackgroundColor: '#bd5417',
        },
        'light-mode',
      )
      .withParams(
        {
          iconSize: 18,
          fontSize: 12,
          browserColorScheme: 'dark',
          headerFontWeight: 500,
          // headerTextColor: '#FFFFFF',
          // headerBackgroundColor: '#bd5417',
        },
        'dark-mode',
      ),
    tooltipShowMode: 'whenTruncated',
    tooltipShowDelay: 500,
    tooltipHideDelay: 5000,
    defaultColDef: {
      headerClass: 'ag-custom-header',
      cellClass: 'ag-custom-cell',
      wrapHeaderText: true,
      autoHeaderHeight: true,
      filterParams: {
        maxNumConditions: 1,
        buttons: ['apply', 'clear', 'reset', 'cancel'],
      },
      flex: 1,
      minWidth: 140,
      // headerValueGetter: (p) => this.localizeHeader(p),
      context: {
        label: '',
      },
    },
    pagination: true,
    suppressCellFocus: false,
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
