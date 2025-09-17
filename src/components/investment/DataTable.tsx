import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

export interface DataTableProps {
  columns: GridColDef[];
  rows: object[];
  pageSizeOptions?: number[];
  height?: number;
}

const defaultPageSizeOptions = [5, 10, 25, 50, 100];

export default function DataTable({
  columns,
  rows,
  pageSizeOptions = defaultPageSizeOptions,
}: DataTableProps) {
  return (
    <Paper sx={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: pageSizeOptions[0] } },
        }}
        pageSizeOptions={pageSizeOptions}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
