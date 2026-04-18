# Manual de Usuario: El Otro Rollo POS (v4)

*Generado automáticamente mediante skill: `app-module-documenter`*

---

## 1. Introducción
El Otro Rollo POS es un sistema de Punto de Venta local avanzado, diseñado con una estética "Dark Neumorphism". Permite operar un restaurante, club de playa o bar desde una sola terminal, enviando automáticamente pedidos a la cocina, manejando cuentas abiertas de huéspedes, gestionando el inventario y realizando cierres (cortes) de caja de manera intuitiva y rápida.

---

## 2. Descripción de Módulos

### 2.1 Punto de Venta (POS)

**Propósito:** Es el corazón del sistema donde los meseros o cajeros cobran directamente o toman los pedidos de los comensales.

**Elementos de la Interfaz:**
- **Barra de Búsqueda y Categorías:** Permite filtrar instantáneamente el inventario por nombre o departamento (Bebidas, Cocina, etc.).
- **Catálogo de Productos:** Tarjetas extruídas que muestran el nombre, ícono/imagen y precio.
- **Carrito Neumórfico (Derecha):** Muestra los productos apilados con acceso rápido para sumar (+), restar (-) o eliminar productos.
- **Botón Confirmar Pedido:** Envía todo el contenido de la orden directamente a la pantalla de la Cocina (KDS) y registra la venta.

**Guía de Operación (Paso a Paso):**
1. Selecciona o busca los productos requeridos haciendo clic sobre sus tarjetas.
2. Revisa el Total y Subtotal en el panel lateral. Ajusta cantidades si es necesario.
3. Haz clic en **"Confirmar"**. La orden desaparecerá del punto de venta y viajará a la cocina.

---

### 2.2 Cocina (KDS)

**Propósito:** Pantalla diseñada exclusivamente para los chefs y preparadores. Visualiza los tickets entrantes sin gastar papel impreso.

**Elementos de la Interfaz:**
- **Tarjetas de Orden:** Cada bloque representa un pedido con su estatus de color (Amarillo, Azul, Verde).
- **Reloj de Vida:** Muestra hace cuántos minutos llegó el pedido.
- **Botones de Flujo:** "En Preparación", "Listo", "Entregado".

**Guía de Operación (Paso a Paso):**
1. Cuando llega una orden nueva (Amarilla), el cocinero oprime **"Preparar"**. El fondo se vuelve ámbar/azul indicando que está en proceso.
2. Al terminar los platillos, se oprime **"Listo"**. El marco se vuelve verde vibrante para avisarle a los meseros que pueden recogerlo.
3. Tras entregarlo al cliente, se presiona **"Entregar"** para liberar espacio en pantalla.

---

### 2.3 Huéspedes (Cuentas Abiertas)

**Propósito:** Lleva el control de "Tabs" o cuentas sin cerrar de personas hospedadas, mesas que aún no piden la cuenta, o clientes con manillas RFID.

**Elementos de la Interfaz:**
- **Botón + Nuevo Registro:** Lanza el modal para registrar un nombre y número de manilla.
- **Tablero de Estado:** Muestra cuántos clientes activos y totales has tenido hoy.
- **Botones de Fichas (+ Cargo y Pagar):** Acciones directas sobre un cliente.

**Guía de Operación (Paso a Paso):**
1. Regístra a alguien al llegar oprimiendo **"Nuevo Registro"**.
2. Cuando el cliente pida algo a lo largo del día, oprimes **"+ Cargo"** en su ficha e ingresas el valor a cargar.
3. Al marcharse, das clic en **"Pagar"**; esto generará un ticket final de consumo y abonará el dinero directamente al **Historial / Corte de Caja**.

---

### 2.4 Inventario

**Propósito:** Control vital del menú. Te permite crear, poner precio y stock (existencias limitadas o infinitas) a tus productos.

**Elementos de la Interfaz:**
- **Matriz de Cajas Físicas:** Cada ítem se visualiza con su estado analítico.
- **Botón Verde de "+" (Añadir Nuevo Producto):** Despliega el gestor interno de creación.

**Guía de Operación (Paso a Paso):**
1. Oprime el botón "+" para ingresar un nuevo artículo, ponle un nombre claro, precio en pesos/dólares, y su categoría real de cocina.
2. Si omites el Stock, el producto nunca se acabará. Si le pones "5", cada venta en el POS restará 1 hasta deshabilitarlo.

---

### 2.5 Historial (Corte de Caja)

**Propósito:** Bóveda de transacciones del día para controlar exactamente cuánto dinero hay en la gaveta o cuenta bancaria.

**Elementos de la Interfaz:**
- **Métricas Superiores:** Resume de forma limpia lo recaudado en el POS mediante Efectivo y los cobros de Huéspedes mediante Tarjetas.
- **Lista Cronológica de Tracks:** Visualiza a qué hora entró el dinero.
- **Botón Rojo Gigante de Corte:** Acciona el fin del turno.

**Guía de Operación (Paso a Paso):**
1. Ingresa a la pestaña y navega la tabla para revisar cualquier fuga de transacciones.
2. Al finalizar tu guardia, extrae el dinero físico, oprime **"Corte de Caja"** y confirma en un clic para devolver todos los contadores a 0 para el siguiente turno.

---

### 2.6 Códigos QR y Configuración

**Propósito:** Exportación y ajuste de entorno base del software. Permite emitir QRs directos por mesa, así como oscurecer o iluminar toda la App.

**Guía de Operación:**
- **QR:** Para crear un "Menú de Mesa 5", sencillamente escribe "Mesa 5" e imprime la hoja renderizada renderizada.
- **Theme Master Switch:** Presiona en Configuración el interruptor nocturno para transformar instantáneamente tus pantallas al clásico Modo Diurno si tienes mucho reflejo de luz.

---

## 3. Resolución de Problemas (Troubleshooting)
- **Problema común:** Al entrar no veo el punto de venta actualizado.
- **Solución:** Oprime F5 para refrescar la carga local. Como todo corre local-first, tus datos jamás se eliminan a menos que limpies tu caché.

*Nota: La extracción de capturas de pantalla desde el navegador fue pausada en esta ejecución debido al tráfico de red del servidor subagente, pueden integrase las imágenes manualmente.*
