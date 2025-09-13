"use client";
import * as React from 'react';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, IconButton, Tooltip, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 180;
const collapsedWidth = 56;

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const navItems = [
    { label: 'Dashboard', icon: DashboardIcon, route: '/' },
    { label: 'Orders', icon: ShoppingCartIcon, route: '/orders' },
    { label: 'Users', icon: PeopleIcon, route: '/users' },
    { label: 'Products', icon: InventoryIcon, route: '/products' },
    { label: 'Investments', icon: TrendingUpIcon, route: '/investments' },
  ];
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? collapsedWidth : drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? collapsedWidth : drawerWidth,
          boxSizing: 'border-box',
          background: '#13151c',
          color: '#E3F2FD',
          borderRight: '1px solid #23263a',
          transition: 'width 0.2s',
          overflowX: 'hidden',
        },
      }}
    >
      <Toolbar variant="dense" sx={{ minHeight: 44, justifyContent: collapsed ? 'center' : 'flex-end', px: 1 }}>
        <Tooltip title={collapsed ? 'Expand' : 'Collapse'} placement="right">
          <IconButton size="small" onClick={() => setCollapsed((c) => !c)} sx={{ color: '#90caf9' }}>
            {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
      <Divider sx={{ borderColor: '#23263a' }} />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {navItems.map(({ label, icon: Icon, route }) => (
            <ListItem
              component="button"
              key={label}
              onClick={() => router.push(route)}
              sx={{
                py: 0.5,
                minHeight: 36,
                justifyContent: collapsed ? 'center' : 'flex-start',
                background: pathname === route ? '#23263a' : 'none',
                color: pathname === route ? '#4FC3F7' : '#E3F2FD',
                borderRadius: 1,
                mb: 0.5,
                '&:hover': { background: '#23263a', color: '#4FC3F7' },
              }}
            >
              <ListItemIcon sx={{ color: pathname === route ? '#4FC3F7' : '#90caf9', minWidth: 32, justifyContent: 'center' }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              {!collapsed && <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14 }} />}
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
