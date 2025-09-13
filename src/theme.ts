import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2', // Darker blue
      dark: '#0d47a1', // Even darker blue
      light: '#1565c0', // Slightly lighter, but still dark
    },
    secondary: {
      main: '#9c27b0', // Dark purple
      dark: '#6a0080', // Deeper purple
      light: '#ba68c8',
    },
    background: {
      default: '#0b111d', // Deeper dark (almost black with blue tint)
      paper: '#141922', // Very dark gray-blue
    },
    text: {
      primary: '#E3F2FD', // Soft light blue
      secondary: '#90caf9', // Muted blue
      disabled: '#6d7a8c', // Dimmed text for disabled
    },
    divider: '#222b3a', // Dark divider
    grey: {
      50: '#f9f9f9',
      100: '#e0e0e0',
      200: '#c2c2c2',
      300: '#a3a3a3',
      400: '#858585',
      500: '#666666',
      600: '#4d4d4d',
      700: '#333333',
      800: '#1a1a1a',
      900: '#0d0d0d', // Deepest grey
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#141922',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#141922',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#141922',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          background: 'transparent',
        },
      },
    },
  },
});

export default theme;
