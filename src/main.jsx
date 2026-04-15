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
      letterSpacing: -1.2,
      fontSize: 'clamp(3rem, 8vw, 5.7rem)',
    },
    h2: {
      fontFamily: ['"Fraunces"', '"Iowan Old Style"', 'serif'].join(','),
      fontWeight: 700,
      lineHeight: 1.02,
      letterSpacing: -0.9,
      fontSize: 'clamp(2.4rem, 5vw, 4.35rem)',
    },
    h3: {
      fontFamily: ['"Fraunces"', '"Iowan Old Style"', 'serif'].join(','),
      fontWeight: 700,
      lineHeight: 1.04,
      letterSpacing: -0.65,
      fontSize: 'clamp(2rem, 4vw, 3.15rem)',
    },
    h4: {
      fontFamily: ['"Fraunces"', '"Iowan Old Style"', 'serif'].join(','),
      fontWeight: 700,
      letterSpacing: -0.32,
    },
    h5: {
      fontFamily: ['"Fraunces"', '"Iowan Old Style"', 'serif'].join(','),
      fontWeight: 700,
      letterSpacing: -0.2,
    },
    h6: {
      fontFamily: ['"Fraunces"', '"Iowan Old Style"', 'serif'].join(','),
      fontWeight: 700,
      lineHeight: 1.08,
      letterSpacing: -0.16,
    },
    subtitle1: {
      fontWeight: 600,
    },
    subtitle2: {
      fontWeight: 600,
    },
    overline: {
      fontWeight: 800,
      letterSpacing: 2.4,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      letterSpacing: 0.15,
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
            'radial-gradient(circle at top left, rgba(201, 128, 73, 0.18), transparent 28%), linear-gradient(180deg, #18120f 0rem, #201814 28rem, #efe0cc 28rem, #efe0cc 100%)',
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
          borderRadius: 16,
          border: '1px solid rgba(72, 50, 32, 0.12)',
          boxShadow: '0 18px 40px rgba(35, 22, 12, 0.12)',
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(72, 50, 32, 0.12)',
          boxShadow: '0 18px 34px rgba(34, 20, 12, 0.12)',
          backgroundImage: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: 'rgba(255, 249, 241, 0.9)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          paddingInline: 18,
          minHeight: 44,
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          fontWeight: 700,
          letterSpacing: 0.15,
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
          borderRadius: 14,
          fontWeight: 700,
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: 14,
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
