/**
 * Utilidad para impresión de ticket térmico (80mm / 58mm)
 */
export const printTicket = (saleData, config) => {
  const { businessName, businessAddress, businessPhone, ticketHeader, ticketFooter, showLogoInTicket } = config;
  const { cart, subtotal, tax, total, received, change, method, date } = saleData;

  const printWindow = window.open('', '_blank', 'width=400,height=600');
  
  const itemsHtml = cart.map(item => `
    <tr>
      <td style="padding: 5px 0;">${item.qty}x ${item.name}</td>
      <td style="text-align: right; padding: 5px 0;">$${(item.price * item.qty).toFixed(2)}</td>
    </tr>
  `).join('');

  const serviceValidationsHtml = (saleData.validations || []).map(v => `
    <div style="margin-top: 20px; border: 1px solid #000; padding: 10px; border-radius: 5px;" class="text-center">
      <div class="bold">${v.serviceName}</div>
      <div style="font-size: 10px; margin-bottom: 5px;">Huésped: ${v.guestName}</div>
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${v.id}" style="width: 40mm; height: 40mm; margin: 5px 0;" />
      <div class="bold" style="font-size: 14px; letter-spacing: 2px;">${v.id}</div>
      <div style="font-size: 8px; margin-top: 5px;">Válido para un solo uso. Presentar en entrada.</div>
    </div>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Ticket - ${businessName}</title>
      <style>
        @page { size: 80mm auto; margin: 0; }
        body { 
          font-family: 'Courier New', Courier, monospace; 
          width: 80mm; 
          padding: 5mm; 
          margin: 0; 
          font-size: 12px;
          line-height: 1.2;
          box-sizing: border-box;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .bold { font-weight: bold; }
        .divider { border-top: 1px dashed #000; margin: 10px 0; }
        table { width: 100%; border-collapse: collapse; }
        .header { margin-bottom: 15px; }
        .footer { margin-top: 15px; font-size: 10px; }
        .logo { max-width: 50mm; height: auto; margin: 0 auto 10px; display: block; filter: grayscale(1); }
        .underline { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="header text-center">
        ${showLogoInTicket ? `<img src="/logo.png" class="logo" />` : ''}
        <div class="bold" style="font-size: 16px;">${businessName}</div>
        <div>${businessAddress}</div>
        <div>Tel: ${businessPhone}</div>
        <div class="divider"></div>
        <div class="bold underline">${ticketHeader}</div>
      </div>

      <div style="margin-bottom: 10px;">
        <div>Fecha: ${new Date(date).toLocaleString()}</div>
        <div>Método: ${method === 'cash' ? 'EFECTIVO' : method === 'room_charge' ? 'CARGO HAB' : 'TARJETA'}</div>
      </div>

      <div class="divider"></div>
      
      <table>
        <thead>
          <tr>
            <th style="text-align: left;">DESCRIPCIÓN</th>
            <th style="text-align: right;">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="divider"></div>

      <div class="text-right">
        <div>Subtotal: $${subtotal.toFixed(2)}</div>
        <div>IVA: $${tax.toFixed(2)}</div>
        <div class="bold" style="font-size: 14px;">TOTAL: $${total.toFixed(2)}</div>
      </div>

      <div class="divider"></div>

      ${method === 'cash' ? `
        <div class="text-right">
          <div>Recibido: $${received.toFixed(2)}</div>
          <div class="bold">Cambio: $${change.toFixed(2)}</div>
        </div>
        <div class="divider"></div>
      ` : ''}

      ${serviceValidationsHtml}

      <div class="footer text-center">
        <p>${ticketFooter}</p>
        <p>*** Gracias por su preferencia ***</p>
      </div>

      <script>
        window.onload = function() {
          // Esperar un breve momento adicional para asegurar renderizado de fuentes e imágenes
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
