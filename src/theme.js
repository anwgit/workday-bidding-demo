// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary:   { main: '#0052CC' },   // deep blue
    secondary: { main: '#FF5630' },   // vibrant orange
    background:{ default: '#F4F6F8' }, // light grey
  },
  typography: {
    h4:   { fontWeight: 600 },
    subtitle1: { fontWeight: 500 }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #0052CC 0%, #0065FF 100%)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
        }
      }
    }
  }
});

export default theme;
