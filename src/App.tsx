import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Container } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ConfigForm from './components/ConfigForm';
import PaymentSchedule from './components/PaymentSchedule';
import { usePaymentScheduleStore } from './store/paymentScheduleStore';

// Crear tema personalizado
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2e7d32', // Verde más profesional
    },
    secondary: {
      main: '#f57c00', // Naranja para contraste
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 16px',
        },
      },
    },
  },
});

function App() {
  const isConfigured = usePaymentScheduleStore(state => state.isConfigured);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', py: 6, bgcolor: 'background.default' }}>
          <Container>
            {!isConfigured ? (
              <ConfigForm />
            ) : (
              <PaymentSchedule />
            )}
          </Container>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
