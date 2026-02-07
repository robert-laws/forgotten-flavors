import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import './index.css'
import App from './App.jsx'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7a4122',
      dark: '#52250f',
      light: '#b07147',
    },
    secondary: {
      main: '#2d5f58',
      dark: '#1b403a',
      light: '#6f968f',
    },
    background: {
      default: '#efe4d4',
      paper: '#fffaf2',
    },
    text: {
      primary: '#27190f',
      secondary: '#5d4a3b',
    },
  },
  typography: {
    fontFamily: ['"Plus Jakarta Sans"', '"Segoe UI"', 'sans-serif'].join(','),
    h2: {
      fontFamily: ['"Sora"', '"Plus Jakarta Sans"', 'sans-serif'].join(','),
      fontWeight: 700,
      lineHeight: 1.04,
      letterSpacing: -0.7,
      fontSize: 'clamp(2.3rem, 6vw, 4.4rem)',
    },
    h4: {
      fontFamily: ['"Sora"', '"Plus Jakarta Sans"', 'sans-serif'].join(','),
      fontWeight: 600,
      letterSpacing: -0.3,
    },
    h5: {
      fontFamily: ['"Sora"', '"Plus Jakarta Sans"', 'sans-serif'].join(','),
      fontWeight: 600,
      letterSpacing: -0.2,
    },
    h6: {
      fontWeight: 600,
      letterSpacing: -0.15,
    },
    subtitle1: {
      fontWeight: 600,
    },
    subtitle2: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: 0,
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(45, 29, 16, 0.1)',
          boxShadow: '0 10px 28px rgba(40, 25, 12, 0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(45, 29, 16, 0.1)',
          boxShadow: '0 10px 24px rgba(40, 25, 12, 0.07)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
        },
      },
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
