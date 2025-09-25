'use client';

import React, { useState } from 'react';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import {
  Add as AddIcon,
  UploadFile,
  FileDownload,
  MoreVert,
  KeyboardArrowDown,
} from '@mui/icons-material';

interface ProductActionsDropdownProps {
  onAddProduct: () => void;
  onBulkImport: () => void;
  onExport: () => void;
}

const ProductActionsDropdown: React.FC<ProductActionsDropdownProps> = ({
  onAddProduct,
  onBulkImport,
  onExport,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    handleClose();
  };

  return (
    <>
      <Button
        variant="contained"
        endIcon={<KeyboardArrowDown />}
        onClick={handleClick}
        size="large"
        aria-controls={open ? 'actions-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        Actions
      </Button>

      <Menu
        id="actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'actions-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleMenuItemClick(onAddProduct)}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add Product</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleMenuItemClick(onBulkImport)}>
          <ListItemIcon>
            <UploadFile fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add Bulk Products</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={() => handleMenuItemClick(onExport)}>
          <ListItemIcon>
            <FileDownload fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export Products</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProductActionsDropdown;
