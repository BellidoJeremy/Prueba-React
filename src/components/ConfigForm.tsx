import { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Container,
  Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { usePaymentScheduleStore } from '../store/paymentScheduleStore';

const ConfigForm = () => {
  const setInitialConfig = usePaymentScheduleStore(state => state.setInitialConfig);
  
  const [referenceAmount, setReferenceAmount] = useState<number | ''>('');
  const [numberOfPayments, setNumberOfPayments] = useState<number | ''>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!referenceAmount) {
      newErrors.referenceAmount = 'El monto es requerido';
    } else if (Number(referenceAmount) <= 0) {
      newErrors.referenceAmount = 'El monto debe ser mayor a 0';
    }
    
    if (!numberOfPayments) {
      newErrors.numberOfPayments = 'El número de cuotas es requerido';
    } else if (Number(numberOfPayments) <= 0) {
      newErrors.numberOfPayments = 'El número de cuotas debe ser mayor a 0';
    } else if (Number(numberOfPayments) > 8) {
      newErrors.numberOfPayments = 'El número máximo de cuotas es 8';
    }
    
    if (!startDate) {
      newErrors.startDate = 'La fecha de inicio es requerida';
    }
    
    if (!endDate) {
      newErrors.endDate = 'La fecha de fin es requerida';
    } else if (startDate && endDate && endDate <= startDate) {
      newErrors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setInitialConfig({
      referenceAmount: Number(referenceAmount),
      numberOfPayments: Number(numberOfPayments),
      startDate: startDate!,
      endDate: endDate!
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" color="primary" sx={{ fontWeight: 'bold' }}>
              Configuración de Cronograma
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mt: 1 }}>
              Ingresa los datos para generar tu plan de pagos personalizado
            </Typography>
          </Box>
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Monto Referencial a Pagar"
                  type="number"
                  value={referenceAmount}
                  onChange={(e) => setReferenceAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  error={!!errors.referenceAmount}
                  helperText={errors.referenceAmount}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Número Inicial de Cuotas"
                  type="number"
                  value={numberOfPayments}
                  onChange={(e) => setNumberOfPayments(e.target.value === '' ? '' : Number(e.target.value))}
                  error={!!errors.numberOfPayments}
                  helperText={errors.numberOfPayments}
                  InputProps={{ inputProps: { min: 1, max: 8 } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Fecha de Inicio"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.startDate,
                      helperText: errors.startDate
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Fecha de Fin"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.endDate,
                      helperText: errors.endDate
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  size="large"
                  sx={{ 
                    py: 1.5,
                    fontSize: '1rem',
                    boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(46, 125, 50, 0.3)',
                    }
                  }}
                >
                  Generar Cronograma
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default ConfigForm;