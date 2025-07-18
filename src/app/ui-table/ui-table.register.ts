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
    CustomFilterModule,
    RowApiModule,
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
