import { Component } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { IFilterAngularComp } from 'ag-grid-angular';
import { IFilterParams, IDoesFilterPassParams } from 'ag-grid-community';

@Component({
  selector: 'sms-custom-array-filter',
  imports: [MatButtonModule, MatCheckboxModule, MatListModule, ScrollingModule],
  standalone: true,
  template: `
    <div class="flex flex-col overflow-hidden">
      <mat-list class="custom-array-filter-container" cdkScrollable>
        @for (option of predefinedOptions; track option) {
          <!-- <div class="custom-filter-item"> -->
          <mat-list-item [class.selected-option]="selectedOptions.includes(option)">
            <mat-checkbox
              [id]="option"
              [value]="option"
              [checked]="selectedOptions.includes(option)"
              (change)="onCheckboxChange(option, $event.checked)"
            />
            <label [for]="option">{{ option }}</label>
            <!-- </div> -->
          </mat-list-item>
        }
        <!-- </div> -->
      </mat-list>
      <div class="flex flex-row gap-4 m-2 justify-between">
        <button mat-flat-button (click)="resetFilter()">Reset</button>
        <button mat-flat-button (click)="applyFilter()">Apply</button>
      </div>
    </div>
  `,
  styles: [
    `
      .custom-array-filter-container {
        max-height: 240px;
        overflow-y: auto;
        // border: 1px solid #e0e0e0;
      }

      // .selected-option {
      //   background-color: #ffe6d7;
      // }
    `,
  ],
})
export class CustomArrayFilterComponent implements IFilterAngularComp {
  private params!: IFilterParams;
  predefinedOptions: string[] = []; // This will hold your unique tags
  selectedOptions: string[] = [];

  agInit(params: IFilterParams): void {
    this.params = params;
    // You can pass predefined options via filterParams in colDef
    if (params.colDef?.filterParams && params.colDef.filterParams.options) {
      this.predefinedOptions = params.colDef.filterParams.options as string[];
    } else {
      // Fallback: Infer options from grid data if not provided (more complex for large datasets)
      // For a more robust solution, always provide predefined options via filterParams.
      console.warn(
        'Predefined options not provided. Consider passing them via filterParams.',
      );
      // Example of inferring (only for small datasets, can be slow):
      this.inferPredefinedOptions(this.params);
    }
  }

  isFilterActive(): boolean {
    return this.selectedOptions.length > 0;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    if (this.selectedOptions.length === 0) {
      return true; // No filter selected, all rows pass
    }

    const cellValue: string[] = this.params.getValue(
      params.node,
      this.params.colDef,
    );

    if (!Array.isArray(cellValue)) {
      console.warn(
        `Value for column '${this.params.colDef.field}' is not an array:`,
        cellValue,
      );
      return false; // Or true, depending on how you want to handle non-array values
    }

    // Check if the row's array contains AT LEAST ONE of the selected filter options
    return this.selectedOptions.some((selectedTag) =>
      cellValue.some(
        (item) => String(item).toLowerCase() === selectedTag.toLowerCase(),
      ),
    );
  }

  getModel(): any {
    if (this.isFilterActive()) {
      return { value: this.selectedOptions };
    }
    return null;
  }

  setModel(model: any): void {
    if (model && Array.isArray(model.value)) {
      this.selectedOptions = model.value;
    } else {
      this.selectedOptions = [];
    }
    // No need to call filterChangedCallback here, AG-Grid will trigger filter after setModel
  }

  onCheckboxChange(option: string, checked: boolean): void {
    if (checked) {
      this.selectedOptions.push(option);
    } else {
      this.selectedOptions = this.selectedOptions.filter(
        (item) => item !== option,
      );
    }
    // Note: We are not calling filterChangedCallback() directly here.
    // Instead, we call it on 'Apply' or 'Reset' for a better user experience,
    // as continuous filtering on every checkbox toggle can be slow for large grids.
    // If you prefer instant filtering, uncomment the line below:
    // this.params.filterChangedCallback();
  }

  applyFilter(): void {
    this.params.filterChangedCallback(); // Trigger filter application
  }

  resetFilter(): void {
    this.selectedOptions = [];
    this.params.filterChangedCallback(); // Trigger filter application
  }

  // Optional: Function to infer predefined options from existing data
  // Use with caution for large datasets as it might be performance-intensive.
  private inferPredefinedOptions(params: IFilterParams): void {
    const allTags = new Set<string>();

    params.api.forEachNode((node) => {
      const cellValue: string[] = node.data
        ? params.getValue(node, params.colDef)
        : undefined;

      if (Array.isArray(cellValue)) {
        cellValue.forEach((tag) => allTags.add(String(tag).toLowerCase()));
      }
    });

    this.predefinedOptions = Array.from(allTags).sort();

    // rowData.forEach(row => {
    //   const cellValue: string[] = this.params.getValue(params.node, this.params.colDef)

    //   const cellValue: string[] = this.params.colDef.valueGetter
    //     ? this.params.colDef.valueGetter({
    //         data: row, node: null, colDef: this.params.colDef, column: this.params.column,
    //         api: this.params.api, columnApi: this.params.columnApi, context: this.params.context
    //       })
    //     : row[this.params.colDef.field!];
    //   if (Array.isArray(cellValue)) {
    //     cellValue.forEach(tag => allTags.add(String(tag).toLowerCase()));
    //   }
    // });
    // this.predefinedOptions = Array.from(allTags).sort();
  }
}
