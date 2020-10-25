export interface HeadCell {
  disablePadding: boolean;
  id: any;
  label: string;
  numeric?: boolean;
  align?: string;
  cellRender?: (any) => any;
  cellActionRender?: (any) => any;
}

export interface DataGridProps {
  data: any[];
  headCells: HeadCell[];
  title: string;
  customToolBar?: any;
  rowsPerPage: number;
  page: number;
  total: number;
  loading: boolean;
  onRowPageChange?: (any) => any;
  onPageChange?: (any) => any;
}

export interface DataGridHeaderProps {
  classes?: any;
  rowCount: number;
  headCells: HeadCell[];
}

export interface DataGridToolBarProps {
  classes?: any;
  title: string;
  customToolBar?: any;
}
