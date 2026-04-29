export const printKitchenTicket = (saleData) => {
  const { cart, date, clientName, method } = saleData;

  // Filtrar solo los productos que van a cocina
  // Puedes ajustar las categorías según las que realmente vayan a cocina
  const kitchenItems = cart.filter(item => 
    item.category === 'Cocina' || item.category === 'Bebidas'
  );

  if (kitchenItems.length === 0) return; // No hay nada para la cocina

  const printWindow = window.open('', '_blank', 'width=400,height=600');
  
  const itemsHtml = kitchenItems.map(item => `
    <tr>
      <td style="padding: 8px 0; font-size: 16px; font-weight: bold;">[ ${item.qty} ]</td>
      <td style="padding: 8px 0; font-size: 16px;">${item.name}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Ticket Cocina</title>
      <style>
        @page { size: 80mm auto; margin: 0; }
        body { 
          font-family: 'Courier New', Courier, monospace; 
          width: 80mm; 
          padding: 5mm; 
          margin: 0; 
          font-size: 14px;
          line-height: 1.2;
          box-sizing: border-box;
          color: #000;
        }
        .text-center { text-align: center; }
        .bold { font-weight: bold; }
        .divider { border-top: 2px dashed #000; margin: 15px 0; }
        table { width: 100%; border-collapse: collapse; }
        .header { margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="header text-center">
        <div class="bold" style="font-size: 24px; border: 2px solid #000; padding: 5px; margin-bottom: 10px;">
          PEDIDO COCINA
        </div>
        <div style="font-size: 16px;">
          Cliente: <span class="bold">${clientName || 'Público General'}</span>
        </div>
        <div>Fecha: ${new Date(date).toLocaleString()}</div>
        <div>Origen: ${method === 'cash' ? 'Caja' : method === 'room_charge' ? 'Cabaña' : 'Tarjeta'}</div>
      </div>

      <div class="divider"></div>
      
      <table>
        <thead>
          <tr>
            <th style="text-align: left; width: 30%;">CANT</th>
            <th style="text-align: left; width: 70%;">PRODUCTO</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="divider"></div>
      
      <div class="text-center" style="margin-top: 20px; font-size: 12px;">
        *** Fin del Pedido ***
      </div>

      <script>
        window.onload = function() {
          setTimeout(() => {
            window.print();
            window.onafterprint = function() { window.close(); };
          }, 300);
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
