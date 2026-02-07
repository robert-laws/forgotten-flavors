import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import './index.css'
import App from './App.jsx'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6d3f1f',
    },
    secondary: {
      main: '#2f5b54',
    },
    background: {
      default: '#f4ede2',
      paper: '#fff9f1',
    },
  },
  typography: {
    fontFamily: ['"Merriweather"', 'Georgia', 'serif'].join(','),
    h3: {
      letterSpacing: 0.2,
    },
  },
  shape: {
    borderRadius: 16,
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
