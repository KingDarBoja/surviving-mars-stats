import {
  CellStyleModule,
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberFilterModule,
  PaginationModule,
  PinnedRowModule,
  QuickFilterModule,
  RowSelectionModule,
  RowStyleModule,
  TextFilterModule,
} from 'ag-grid-community';

export const registerAgGridModules = () => {
  ModuleRegistry.registerModules([
    CellStyleModule,
    ClientSideRowModelModule,
    NumberFilterModule,
    PaginationModule,
    PinnedRowModule,
    QuickFilterModule,
    RowSelectionModule,
    RowStyleModule,
    TextFilterModule,
  ]);
};
