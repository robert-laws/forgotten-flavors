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
    fontFamily: ['"Merriweather"', 'Georgia', 'serif'].join(','),
    h2: {
      fontWeight: 800,
      lineHeight: 1.08,
      letterSpacing: -0.4,
    },
    h4: {
      fontWeight: 700,
      letterSpacing: -0.2,
    },
    h5: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 16,
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
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
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
