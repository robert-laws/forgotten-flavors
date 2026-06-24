import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import './index.css'
import App from './App.jsx'
import RecipeDetailPage from './pages/RecipeDetailPage.jsx'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#9b5631',
      dark: '#6e371b',
      light: '#cb8959',
      contrastText: '#fff8ef',
    },
    secondary: {
      main: '#3f6b62',
      dark: '#27453f',
      light: '#7d9c93',
      contrastText: '#f6f0e8',
    },
    background: {
      default: '#efe0cc',
      paper: '#fbf4e8',
    },
    text: {
      primary: '#1f1812',
      secondary: '#67564a',
    },
  },
  typography: {
    fontFamily: ['"Manrope"', '"Segoe UI"', 'sans-serif'].join(','),
    h1: {
      fontFamily: ['"Fraunces"', '"Iowan Old Style"', 'serif'].join(','),
      fontWeight: 800,
      lineHeight: 0.98,
      letterSpacing: 0,
      fontSize: '2.75rem',
      '@media (min-width:900px)': {
        fontSize: '5.15rem',
      },
    },
    h2: {
      fontFamily: ['"Fraunces"', '"Iowan Old Style"', 'serif'].join(','),
      fontWeight: 700,
      lineHeight: 1.02,
      letterSpacing: 0,
      fontSize: '2.35rem',
      '@media (min-width:900px)': {
        fontSize: '4.1rem',
      },
    },
    h3: {
      fontFamily: ['"Fraunces"', '"Iowan Old Style"', 'serif'].join(','),
      fontWeight: 700,
      lineHeight: 1.04,
      letterSpacing: 0,
      fontSize: '2rem',
      '@media (min-width:900px)': {
        fontSize: '3rem',
      },
    },
    h4: {
      fontFamily: ['"Fraunces"', '"Iowan Old Style"', 'serif'].join(','),
      fontWeight: 700,
      letterSpacing: 0,
    },
    h5: {
      fontFamily: ['"Fraunces"', '"Iowan Old Style"', 'serif'].join(','),
      fontWeight: 700,
      letterSpacing: 0,
    },
    h6: {
      fontFamily: ['"Fraunces"', '"Iowan Old Style"', 'serif'].join(','),
      fontWeight: 700,
      lineHeight: 1.08,
      letterSpacing: 0,
    },
    subtitle1: {
      fontWeight: 600,
    },
    subtitle2: {
      fontWeight: 600,
    },
    overline: {
      fontWeight: 800,
      letterSpacing: 0,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      letterSpacing: 0,
    },
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--ff-ink': '#1f1812',
          '--ff-copper': '#9b5631',
          '--ff-sage': '#3f6b62',
          '--ff-parchment': '#efe0cc',
          '--ff-paper': '#fbf4e8',
          '--ff-night': '#18120f',
        },
        html: {
          scrollBehavior: 'smooth',
        },
        body: {
          background:
            'linear-gradient(180deg, #151917 0rem, #1f2723 27rem, #efe0cc 27rem, #efe0cc 100%)',
          color: '#1f1812',
        },
        '::selection': {
          background: '#cb8959',
          color: '#1f1812',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid rgba(72, 50, 32, 0.12)',
          boxShadow: '0 18px 40px rgba(35, 22, 12, 0.12)',
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid rgba(72, 50, 32, 0.12)',
          boxShadow: '0 18px 34px rgba(34, 20, 12, 0.12)',
          backgroundImage: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: 'rgba(255, 249, 241, 0.9)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingInline: 18,
          minHeight: 44,
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 700,
          letterSpacing: 0,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, #1b1511 0%, #261c16 100%)',
          color: '#f7efe6',
          borderColor: 'rgba(255, 236, 220, 0.08)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 42,
          borderRadius: 8,
          fontWeight: 700,
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 700,
        },
      },
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/recipe/:id" element={<RecipeDetailPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
