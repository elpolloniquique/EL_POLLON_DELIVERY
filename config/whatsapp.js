/**
 * Configuración de WhatsApp — Números y plantillas de mensajes.
 */
window.POLLON_CONFIG = window.POLLON_CONFIG || {};

window.POLLON_CONFIG.whatsapp = {
  /** Número principal para pedidos delivery (sin +) */
  ordersNumber: '56986925310',

  /** Mensaje predefinido para retiro en local */
  pickupMessage: 'Solicito realizar mi pedido con retiro y confirmo que el monto mínimo de mi compra será igual o mayor a $100.000.',

  /** Plantilla cabecera del pedido */
  orderHeader: '◆ DELIVERY - POLLERÍA EL POLLÓN ◆',

  /** Nota de delivery al final del mensaje */
  deliveryNote: '◆ Delivery tiene costo adicional\n◆ segun la distancia $2.500 a $4.000',

  /** Mensaje admin al contactar cliente */
  adminContactTemplate: 'Hola {name}, te escribimos de Pollería El Pollón respecto a tu pedido {id} ({status}).',

  checkout: {
    cartBtn: '💬 Realizar Pedido por WhatsApp',
    submitBtn: '📤 Enviar Mi Pedido',
    successBackend: '✅ ¡Pedido enviado a WhatsApp y guardado en la base de datos!',
    successLocal: '✅ ¡Pedido enviado a WhatsApp y registrado!',
    successFallback: '⚠️ Pedido enviado a WhatsApp. Guardado localmente (revisa Supabase en js/supabase/config.js).'
  }
};
