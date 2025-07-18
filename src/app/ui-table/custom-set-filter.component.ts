// my-custom-set-filter.component.ts
import { Component } from '@angular/core';
import { IFilterAngularComp } from 'ag-grid-angular';
import { IFilterParams, IDoesFilterPassParams } from 'ag-grid-community';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'sms-custom-set-filter',
  imports: [MatCheckboxModule],
  template: `
    <div class="custom-filter-container">
      @for (value of uniqueValues; track value) {
        <div class="custom-filter-item">
          <mat-checkbox
            [id]="value"
            [checked]="selectedValues.has(value)"
            (change)="onCheckboxChange(value, $event.checked)"
          />
          <label [for]="value">{{ value }}</label>
        </div>
      }
    </div>
  `,
  styleUrl: './custom-set-filter.component.scss',
})
export class CustomSetFilterComponent implements IFilterAngularComp {
  private params!: IFilterParams;
  public uniqueValues: Set<string> = new Set();
  public selectedValues: Set<string> = new Set();

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
    const field = this.params.colDef.field;
    const cellValue = params.data[field];
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
    const field = params.colDef.field;
    params.api.forEachNode((node) => {
      const value = node.data ? node.data[field] : undefined;
      if (value !== undefined && value !== null) {
        this.uniqueValues.add(String(value));
      }
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
