import {
  CellStyleModule,
  ClientSideRowModelModule,
  CustomFilterModule,
  ModuleRegistry,
  NumberFilterModule,
  PaginationModule,
  PinnedRowModule,
  QuickFilterModule,
  RowApiModule,
  RowSelectionModule,
  RowStyleModule,
  TextFilterModule,
} from 'ag-grid-community';

export const registerAgGridModules = () => {
  ModuleRegistry.registerModules([
    CellStyleModule,
    ClientSideRowModelModule,
    CustomFilterModule,
    NumberFilterModule,
    PaginationModule,
    PinnedRowModule,
    QuickFilterModule,
    RowApiModule,
    RowSelectionModule,
    RowStyleModule,
    TextFilterModule,
  ]);
};
