import * as React from 'react';
import type { Investment } from '@/types/investmentTypes';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/material';

export interface DataTableProps {
  columns: GridColDef[];
  rows: object[];
  pageSizeOptions?: number[];
  height?: number;
  onEdit?: (row: Investment) => void;
  onDelete?: (id: number) => void;
  deleting?: number | null;
}

const defaultPageSizeOptions = [5, 10, 25, 50, 100];

export default function DataTable({
  columns,
  rows,
  pageSizeOptions = defaultPageSizeOptions,
  onEdit,
  onDelete,
  deleting,
}: DataTableProps) {
  const actionsColumn: GridColDef = {
    field: 'actions',
    headerName: 'Actions',
    width: 120,
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      const row = params.row;

      return (
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          {onEdit && (
            <IconButton size="small" onClick={() => onEdit(row)} aria-label="Edit">
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          {onDelete && (
            <IconButton
              size="small"
              onClick={() => (typeof row.id === 'number' ? onDelete(row.id) : undefined)}
              aria-label="Delete"
              disabled={deleting === row.id}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      );
    },
  };

  const columnsWithActions = onEdit || onDelete ? [...columns, actionsColumn] : columns;

  return (
    <Paper sx={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columnsWithActions}
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
