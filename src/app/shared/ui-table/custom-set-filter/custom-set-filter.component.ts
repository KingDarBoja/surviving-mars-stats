// my-custom-set-filter.component.ts
import { Component } from '@angular/core';
import { IFilterAngularComp } from 'ag-grid-angular';
import { IFilterParams, IDoesFilterPassParams } from 'ag-grid-community';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'sms-custom-set-filter',
  imports: [MatCheckboxModule, MatListModule],
  standalone: true,
  template: `
    <!-- <div class="custom-filter-container"> -->
    <mat-list class="custom-set-filter-container">
      @for (value of sortedUniqueValues; track value) {
        <!-- <div class="custom-filter-item"> -->
        <mat-list-item [class.selected-option]="selectedValues.has(value)">
          <mat-checkbox
            [id]="value"
            [checked]="selectedValues.has(value)"
            (change)="onCheckboxChange(value, $event.checked)"
          />
          <label [for]="value">{{ value }}</label>
          <!-- </div> -->
        </mat-list-item>
      }
      <!-- </div> -->
    </mat-list>
  `,
  styleUrl: './custom-set-filter.component.scss',
})
export class CustomSetFilterComponent implements IFilterAngularComp {
  private params!: IFilterParams;
  uniqueValues: Set<string> = new Set();
  sortedUniqueValues: string[] = []; // New property to hold the sorted array
  selectedValues: Set<string> = new Set();

  agInit(params: IFilterParams): void {
    this.params = params;
    // Extract unique values from the column data
    // In a real application, you'd likely fetch this from your data source
    this.extractUniqueValues(params);
  }

  isFilterActive(): boolean {
    return (
      this.selectedValues.size > 0 &&
      this.selectedValues.size !== this.uniqueValues.size
    );
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    // Get the value of the column for the current row
    // const field = this.params.colDef.field;
    // const cellValue = params.data[field];
    const cellValue = this.params.getValue(params.node, this.params.colDef)
    return this.selectedValues.has(String(cellValue));
  }

  getModel(): any {
    return this.selectedValues.size > 0
      ? Array.from(this.selectedValues)
      : null;
  }

  setModel(model: any): void {
    if (model) {
      this.selectedValues = new Set(model);
    } else {
      this.selectedValues.clear();
    }
  }

  private extractUniqueValues(params: IFilterParams): void {
    // const field = params.colDef.field;
    params.api.forEachNode((node) => {
      const value = node.data
        ? params.getValue(node, params.colDef)
        : undefined;
      if (value !== undefined && value !== null) {
        this.uniqueValues.add(String(value));
      }
    });

    // Convert Set to Array and sort it
    this.sortedUniqueValues = Array.from(this.uniqueValues).sort((a, b) => {
      // Basic string comparison for ascending order
      return a.localeCompare(b);
    });
    // Initially, select all unique values to show all data
    this.selectedValues = new Set(this.uniqueValues);
  }

  onCheckboxChange(value: string, isChecked: boolean): void {
    if (isChecked) {
      this.selectedValues.add(value);
    } else {
      this.selectedValues.delete(value);
    }
    // Notify ag-Grid that the filter state has changed
    this.params.filterChangedCallback();
  }
}
