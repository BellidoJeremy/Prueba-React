## Características

- Formulario de configuración inicial con validaciones
- Visualización de cuotas en una línea de tiempo
- Modificación de fechas de pago mediante un slider interactivo
- Ajuste de montos de cuotas
- Adición y eliminación de cuotas con redistribución automática

## Tecnologías utilizadas

- React con TypeScript
- Material UI para la interfaz de usuario
- Zustand para la gestión del estado
- date-fns para el manejo de fechas


## Instalación

1. Clona este repositorio
2. Instala las dependencias:

```bash
npm install
```

3. Inicia el servidor de desarrollo:

```bash
npm run dev
```

## Uso

1. Completa el formulario inicial con:
   - Monto referencial a pagar
   - Número inicial de cuotas (máximo 8)
   - Fecha de inicio del período de pago
   - Fecha de fin del período de pago

2. Haz clic en "Generar Cronograma" para ver el cronograma de pagos

3. Interactúa con el cronograma:
   - Selecciona una cuota para modificar su fecha usando el slider
   - Edita los montos directamente en la tabla
   - Agrega o elimina cuotas con los botones correspondientes

## Lógica de negocio

- **Generación inicial**: Distribuye el monto y las fechas equitativamente entre las cuotas
- **Añadir/eliminar cuotas**: Reequilibra automáticamente los montos manteniendo la suma total
- **Ajuste de montos**: Permite edición libre sin reequilibrio automático
- **Modificación de fechas**: Permite cambiar fechas respetando el orden cronológico
