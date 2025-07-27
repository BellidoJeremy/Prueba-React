import { create } from 'zustand';
import { addDays, differenceInDays, format } from 'date-fns';

interface Payment {
  id: string;
  date: Date;
  amount: number;
}

interface PaymentScheduleState {
  referenceAmount: number;
  numberOfPayments: number;
  startDate: Date | null;
  endDate: Date | null;
  payments: Payment[];
  isConfigured: boolean;
  
  // Acciones
  setInitialConfig: (config: {
    referenceAmount: number;
    numberOfPayments: number;
    startDate: Date;
    endDate: Date;
  }) => void;
  addPayment: () => void;
  removePayment: (id: string) => void;
  updatePaymentDate: (id: string, newDate: Date) => void;
  updatePaymentAmount: (id: string, newAmount: number) => void;
}

// Función para generar un ID único
const generateId = () => Math.random().toString(36).substring(2, 9);

// Función para distribuir fechas equitativamente
const distributeDatesEvenly = (startDate: Date, endDate: Date, count: number): Date[] => {
  const totalDays = differenceInDays(endDate, startDate);
  const interval = totalDays / (count - 1);
  
  return Array.from({ length: count }, (_, index) => {
    if (index === 0) return startDate;
    if (index === count - 1) return endDate;
    return addDays(startDate, Math.round(interval * index));
  });
};

export const usePaymentScheduleStore = create<PaymentScheduleState>((set, get) => ({
  referenceAmount: 0,
  numberOfPayments: 0,
  startDate: null,
  endDate: null,
  payments: [],
  isConfigured: false,
  
  setInitialConfig: (config) => {
    const { referenceAmount, numberOfPayments, startDate, endDate } = config;
    
    // Distribuir fechas equitativamente
    const dates = distributeDatesEvenly(startDate, endDate, numberOfPayments);
    
    // Calcular monto por cuota (distribución equitativa)
    const amountPerPayment = referenceAmount / numberOfPayments;
    
    // Crear pagos
    const payments = dates.map((date, index) => ({
      id: generateId(),
      date,
      amount: Number(amountPerPayment.toFixed(2))
    }));
    
    set({
      referenceAmount,
      numberOfPayments,
      startDate,
      endDate,
      payments,
      isConfigured: true
    });
  },
  
  addPayment: () => {
    const { payments, referenceAmount, startDate, endDate } = get();
    
    // Verificar límite de cuotas
    if (payments.length >= 8) return;
    
    // Crear nuevos pagos con fechas redistribuidas
    const newPaymentCount = payments.length + 1;
    const dates = distributeDatesEvenly(startDate!, endDate!, newPaymentCount);
    
    // Recalcular monto por cuota
    const amountPerPayment = referenceAmount / newPaymentCount;
    
    // Crear nuevos pagos
    const newPayments = dates.map((date, index) => ({
      id: index < payments.length ? payments[index].id : generateId(),
      date,
      amount: Number(amountPerPayment.toFixed(2))
    }));
    
    set({ payments: newPayments, numberOfPayments: newPaymentCount });
  },
  
  removePayment: (id) => {
    const { payments, referenceAmount, startDate, endDate } = get();
    
    // Verificar que haya más de una cuota
    if (payments.length <= 1) return;
    
    // Eliminar pago
    const filteredPayments = payments.filter(payment => payment.id !== id);
    const newPaymentCount = filteredPayments.length;
    
    // Redistribuir fechas
    const dates = distributeDatesEvenly(startDate!, endDate!, newPaymentCount);
    
    // Recalcular monto por cuota
    const amountPerPayment = referenceAmount / newPaymentCount;
    
    // Actualizar pagos
    const newPayments = dates.map((date, index) => ({
      id: filteredPayments[index].id,
      date,
      amount: Number(amountPerPayment.toFixed(2))
    }));
    
    set({ payments: newPayments, numberOfPayments: newPaymentCount });
  },
  
  updatePaymentDate: (id, newDate) => {
    const { payments } = get();
    
    // Encontrar índice del pago a actualizar
    const paymentIndex = payments.findIndex(payment => payment.id === id);
    if (paymentIndex === -1) return;
    
    // Verificar que la nueva fecha esté dentro del rango permitido
    const prevDate = paymentIndex > 0 ? payments[paymentIndex - 1].date : null;
    const nextDate = paymentIndex < payments.length - 1 ? payments[paymentIndex + 1].date : null;
    
    if (prevDate && newDate < prevDate) return;
    if (nextDate && newDate > nextDate) return;
    
    // Actualizar fecha
    const updatedPayments = [...payments];
    updatedPayments[paymentIndex] = {
      ...updatedPayments[paymentIndex],
      date: newDate
    };
    
    set({ payments: updatedPayments });
  },
  
  updatePaymentAmount: (id, newAmount) => {
    const { payments } = get();
    
    // Encontrar índice del pago a actualizar
    const paymentIndex = payments.findIndex(payment => payment.id === id);
    if (paymentIndex === -1) return;
    
    // Actualizar monto
    const updatedPayments = [...payments];
    updatedPayments[paymentIndex] = {
      ...updatedPayments[paymentIndex],
      amount: newAmount
    };
    
    set({ payments: updatedPayments });
  }
}));