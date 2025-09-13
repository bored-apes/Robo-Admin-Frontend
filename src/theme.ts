import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2', // Darker blue
      dark: '#0d47a1', // Even darker blue
      light: '#1565c0', // Slightly lighter, but still dark
    },
    background: {
      default: '#101624', // Deep dark background
      paper: '#151a2a', // Slightly lighter but still dark
    },
    text: {
      primary: '#E3F2FD',
      secondary: '#90caf9',
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
          backgroundColor: '#151a2a',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#151a2a',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#151a2a',
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
