import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Slider,
  IconButton,
  Container,
  Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InfoIcon from '@mui/icons-material/Info';
import { format, differenceInDays, addDays } from 'date-fns';
import { usePaymentScheduleStore } from '../store/paymentScheduleStore';

interface SliderMark {
  value: number;
  label: string;
}

const PaymentSchedule = () => {
  const {
    payments,
    startDate,
    endDate,
    addPayment,
    removePayment,
    updatePaymentDate,
    updatePaymentAmount
  } = usePaymentScheduleStore();

  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [sliderMarks, setSliderMarks] = useState<SliderMark[]>([]);
  const [sliderMin, setSliderMin] = useState<number>(0);
  const [sliderMax, setSliderMax] = useState<number>(100);
  const [editingAmount, setEditingAmount] = useState<Record<string, string>>({});

  // Referencia para el contenedor del slider
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Actualizar marcas del slider cuando cambian los pagos
  useEffect(() => {
    if (!startDate || !endDate || payments.length === 0) return;

    const totalDays = differenceInDays(endDate, startDate);
    setSliderMin(0);
    setSliderMax(totalDays);

    // Crear marcas para el slider
    const marks = payments.map(payment => {
      const daysDiff = differenceInDays(payment.date, startDate);
      return {
        value: daysDiff,
        label: format(payment.date, 'dd/MM/yyyy')
      };
    });

    setSliderMarks(marks);

    // Inicializar valores de edición de montos
    const initialAmounts: Record<string, string> = {};
    payments.forEach(payment => {
      initialAmounts[payment.id] = payment.amount.toString();
    });
    setEditingAmount(initialAmounts);

    // Resetear pago seleccionado
    setSelectedPaymentId(null);
    setSliderValue(0);
  }, [payments, startDate, endDate]);

  // Manejar selección de pago para el slider
  const handlePaymentSelect = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    const payment = payments.find(p => p.id === paymentId);
    if (payment && startDate) {
      const daysDiff = differenceInDays(payment.date, startDate);
      setSliderValue(daysDiff);
    }
  };

  // Manejar cambio en el slider
  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    setSliderValue(value);
  };

  // Actualizar fecha cuando se suelta el slider
  const handleSliderChangeCommitted = (_event: React.SyntheticEvent | Event, newValue: number | number[]) => {
    if (!selectedPaymentId || !startDate) return;

    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    const newDate = addDays(startDate, value);
    updatePaymentDate(selectedPaymentId, newDate);
  };

  // Manejar cambio de monto
  const handleAmountChange = (paymentId: string, value: string) => {
    setEditingAmount(prev => ({ ...prev, [paymentId]: value }));
  };

  // Actualizar monto cuando se pierde el foco
  const handleAmountBlur = (paymentId: string) => {
    const amount = parseFloat(editingAmount[paymentId]);
    if (!isNaN(amount) && amount >= 0) {
      updatePaymentAmount(paymentId, amount);
    } else {
      // Restaurar valor anterior si es inválido
      const payment = payments.find(p => p.id === paymentId);
      if (payment) {
        setEditingAmount(prev => ({ ...prev, [paymentId]: payment.amount.toString() }));
      }
    }
  };

  // Calcular total de pagos
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 6, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" gutterBottom align="center" color="primary" sx={{ fontWeight: 'bold' }}>
            Cronograma de Pagos
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Gestiona tus pagos de forma interactiva
          </Typography>
        </Box>

        {/* Slider para modificar fechas */}
        <Paper variant="outlined" sx={{ p: 3, mt: 2, mb: 4, borderRadius: 2, bgcolor: 'rgba(46, 125, 50, 0.03)', borderColor: 'rgba(46, 125, 50, 0.2)' }} ref={sliderContainerRef}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
            {selectedPaymentId 
              ? (
                <>
                  <Box component="span" sx={{ display: 'inline-flex', mr: 1, color: 'primary.main' }}>
                    <CalendarTodayIcon fontSize="small" />
                  </Box>
                  {`Modificar fecha: ${format(addDays(startDate!, sliderValue), 'dd/MM/yyyy')}`}
                </>
              ) 
              : (
                <>
                  <Box component="span" sx={{ display: 'inline-flex', mr: 1, color: 'primary.main' }}>
                    <AccessTimeIcon fontSize="small" />
                  </Box>
                  Seleccione una cuota para modificar su fecha
                </>
              )
            }
          </Typography>
          <Slider
            value={sliderValue}
            min={sliderMin}
            max={sliderMax}
            step={1}
            marks={sliderMarks}
            onChange={handleSliderChange}
            onChangeCommitted={handleSliderChangeCommitted}
            disabled={!selectedPaymentId}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => format(addDays(startDate!, value), 'dd/MM/yyyy')}
            sx={{ 
              mt: 4,
              '& .MuiSlider-thumb': {
                height: 24,
                width: 24,
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 0 0 8px rgba(46, 125, 50, 0.16)'
                }
              },
              '& .MuiSlider-track': {
                height: 8
              },
              '& .MuiSlider-rail': {
                height: 8,
                borderRadius: 4
              }
            }}
          />
        </Paper>

        {/* Tabla de pagos */}
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(46, 125, 50, 0.08)' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Monto</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow 
                  key={payment.id}
                  selected={payment.id === selectedPaymentId}
                  onClick={() => handlePaymentSelect(payment.id)}
                  sx={{ 
                    cursor: 'pointer',
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(46, 125, 50, 0.12)'
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: 'rgba(46, 125, 50, 0.18)'
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    },
                    transition: 'background-color 0.2s'
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box component="span" sx={{ display: 'inline-flex', mr: 1.5, color: 'primary.main' }}>
                        <CalendarTodayIcon fontSize="small" />
                      </Box>
                      {format(payment.date, 'dd/MM/yyyy')}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box component="span" sx={{ display: 'inline-flex', mr: 1.5, color: 'primary.main' }}>
                        <AttachMoneyIcon fontSize="small" />
                      </Box>
                      <TextField
                        type="number"
                        value={editingAmount[payment.id] || ''}
                        onChange={(e) => handleAmountChange(payment.id, e.target.value)}
                        onBlur={() => handleAmountBlur(payment.id)}
                        variant="standard"
                        InputProps={{ 
                          inputProps: { min: 0, step: 0.01 },
                          sx: { fontWeight: 500 }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        sx={{ width: '100px' }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      color="error" 
                      onClick={(e) => {
                        e.stopPropagation();
                        removePayment(payment.id);
                      }}
                      disabled={payments.length <= 1}
                      size="small"
                      sx={{ 
                        bgcolor: payments.length <= 1 ? 'transparent' : 'rgba(211, 47, 47, 0.04)',
                        '&:hover': {
                          bgcolor: 'rgba(211, 47, 47, 0.12)'
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Información y acciones */}
        <Paper variant="outlined" sx={{ p: 3, mt: 4, borderRadius: 2, bgcolor: 'rgba(46, 125, 50, 0.03)', borderColor: 'rgba(46, 125, 50, 0.2)' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box component="span" sx={{ display: 'inline-flex', mr: 1.5, color: 'primary.main' }}>
                  <InfoIcon />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Monto Total
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    ${totalAmount.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={addPayment}
                disabled={payments.length >= 8}
                sx={{ 
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(46, 125, 50, 0.3)'
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'rgba(0, 0, 0, 0.12)'
                  }
                }}
              >
                Agregar Cuota
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Paper>
    </Container>
  );
};

export default PaymentSchedule;