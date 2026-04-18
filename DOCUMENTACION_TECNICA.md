# 📔 Documentación Técnica: El Otro Rollo POS v4.0 PRO

## 1. Introducción
**El Otro Rollo POS** es una solución "Local-First" de grado empresarial diseñada para la gestión operativa en tiempo real de negocios gastronómicos. El sistema prioriza la velocidad, la estética moderna (Neo-Glassmorphism) y la independencia de la nube.

---

## 2. Arquitectura del Sistema
- **Core**: React 19 (Estabilidad y concurrencia).
- **Tooling**: Vite 6 (HMR instantáneo).
- **Estado Global**: Zustand 5 + Middleware de Persistencia (LocalStorage).
- **Estilos**: TailwindCSS 3.4 (Diseño responsivo y custom utilities).
- **Motor de IA**: ONNX Runtime Web + @imgly/background-removal.
- **Visualización**: Recharts (Analítica en tiempo real).

---

## 3. Módulos Implementados

### A. Dashboard Analítico (Business Intelligence)
- Visualización de KPIs (Ingresos, Transacciones, Ticket Promedio).
- Gráfica de rendimiento semanal (Ventas por día).
- Ranking automático de "Productos más pedidos".
- Panel de Alertas de Stock Crítico.

### B. Punto de Venta (POS)
- Gestión de carrito con stock dinámico.
- Selector de personal (Meseros/Staff) obligatorio para trazabilidad.
- Procesador de pagos multi-método (Efectivo/Tarjeta).
- Generador de tickets térmicos con logotipos y QR.

### C. Sistema de Cocina (KDS)
- Gestión de órdenes con estados (Recibido, Cocinando, Listo).
- **Temporizadores Vivos**: Conteo de tiempo transcurrido por orden con alertas de color por urgencia (<5min, 5-10min, >10min).
- Visualización del mesero origen para entregas rápidas.

### D. Inventario con IA
- ABM completo de productos y categorías.
- **Remover Fondo (IA)**: Integración de redes neuronales para limpiar imágenes de productos en el navegador.
- Alertas visuales de stock bajo y reabastecimiento manual.
- Soporte para imágenes locales y URLs.

### E. Seguridad y Personal
- Sistema de usuarios con roles (Administrador/Staff).
- Acceso por PIN de 4 dígitos.
- Personalización de perfiles con colores identificadores.

---

## 4. Exportación y Reportes
- **Formato Excel (CSV)**: Utilidad propia para descarga de Historial de Ventas e Inventario.
- **Corte de Caja**: Reporte detallado de ingresos por método de pago y arqueo.
- **Thermal Print**: Driver ESM para comunicación con impresoras POS estándar.

---

## 5. Próximos Pasos (Hoja de Ruta)
1.  **Multi-caja**: Sincronización P2P entre varios dispositivos en la misma red.
2.  **Integración de Gastos**: Módulo para registrar compras a proveedores y merma.
3.  **Reservaciones**: Calendario interactivo para gestión de mesas.
4.  **Cloud Sync**: Respaldo opcional cifrado en la nube.

---
**Fecha de Actualización**: Abril 2026
**Versión**: 4.0.0-PRO
