/**
 * Textos del sitio — Modales, formularios, navegación y mensajes UI.
 */
window.POLLON_CONFIG = window.POLLON_CONFIG || {};

window.POLLON_CONFIG.texts = {
  loader: { text: 'EL POLLÓN' },

  nav: {
    delivery: 'Delivery Rápido',
    orders: 'Pedidos Online',
    reservations: 'Reservas Fáciles',
    promos: 'Promociones Diarias',
    login: 'Iniciar Sesión',
    loginSub: 'Mi cuenta',
    viewCart: 'Ver Mi Pedido',
    menu: 'MENÚ'
  },

  floatingCart: { label: 'Ver Carrito' },

  modals: {
    delivery: {
      title: '🚚 Pedido con Delivery',
      intro: 'Esta plataforma está diseñada para que realices tu pedido con <strong>entrega a domicilio</strong>.',
      howTitle: '¿Cómo hacer tu pedido por delivery?',
      steps: [
        'Elige tus combos y platos desde el menú.',
        'Agrega los productos al carrito presionando <strong>"Agregar"</strong>.',
        'Cuando termines, abre <strong>"Mi Carrito"</strong> y revisa tu pedido.',
        'Presiona <strong>"Realizar Pedido por WhatsApp"</strong>.',
        'Completa tus datos y confirma el envío del mensaje.'
      ],
      footnote: '* Recuerda que el delivery tiene un costo adicional según tu zona'
    },
    reservations: {
      title: '📅 Reservas',
      intro: 'Para realizar una <strong>reserva</strong> en Pollería El Pollón se requiere:',
      requirements: [
        'Monto mínimo de consumo: <strong>$200.000</strong>.',
        'Reserva sujeta a disponibilidad de horario en el local.',
        'La confirmación se realiza directamente con nuestro equipo.'
      ],
      cta: 'Realizar mi reserva'
    },
    pickup: {
      title: '🛍️ Pedido con Retiro en Local',
      intro: 'Para realizar un <strong>pedido con retiro</strong> en el local:',
      requirements: [
        'Monto mínimo de compra: <strong>$100.000</strong>.',
        'Debes coordinar tu pedido con <strong>mínimo 2 horas de anticipación</strong>.',
        'La hora de retiro se confirma por WhatsApp.'
      ],
      cta: 'Solicitar con retiro'
    },
    cart: {
      title: '🛒 Tu Carrito',
      empty: 'Tu carrito está vacío',
      total: 'Total:'
    },
    checkout: {
      title: '📝 Datos de Entrega',
      nameLabel: 'Nombre Completo:',
      namePlaceholder: 'Ej: Juan Pérez',
      phoneLabel: 'Número de Teléfono:',
      phonePlaceholder: '+56 9 8692 5310',
      addressLabel: 'Dirección de Entrega:',
      addressPlaceholder: 'Ej: Av. Principal 123, Iquique',
      commentsLabel: 'Comentarios (opcional):',
      commentsPlaceholder: 'Ej: mas ají, pollo trosado en 8...',
      cancelBtn: 'Cancelar'
    },
    adminLogin: {
      title: 'Acceso Administración',
      intro: 'Panel privado para gestión de pedidos de <strong> El Pollón</strong>.',
      passwordLabel: 'Contraseña de acceso',
      passwordPlaceholder: 'Ingresa la contraseña',
      error: 'Contraseña incorrecta. Intente nuevamente.',
      cancelBtn: 'Cancelar',
      submitBtn: 'Ingresar'
    }
  },

  toasts: {
    selectDrink: '⚠️ Debes seleccionar un sabor de bebida.',
    selectBag: '⚠️ Debes agregar la bolsa (obligatorio).',
    addedToCart: '¡Producto agregado al carrito!',
    removedFromCart: 'Producto eliminado del carrito',
    emptyCart: 'Tu carrito está vacío',
    adminAccess: '✅ Acceso concedido al panel de administración.',
    adminUpdated: 'Panel actualizado (datos en tiempo real).',
    adminCopied: 'Pedidos copiados. Puedes pegarlos en Excel.',
    adminNoOrders: 'No hay pedidos en el rango seleccionado.',
    adminStatusUpdated: 'Estado actualizado a: {status}',
    adminError: 'Error al actualizar. Intenta de nuevo.'
  },

  seo: {
    title: 'Pollería El Pollón Iquique | Pollo a la brasa delivery y pedidos online',
    description: 'Pollería El Pollón en Iquique: pollo a la brasa, delivery a domicilio, combos familiares y pedidos por WhatsApp. Calle Vivar 1086. Lun-Dom 11:30-23:00.',
    keywords: 'pollería iquique, pollo a la brasa iquique, delivery iquique, comida delivery iquique, el pollón iquique, el pollon iquique, pedir pollo iquique, pollo brasa delivery, combos familiares iquique, comida peruana iquique, restaurante iquique delivery',
    ogTitle: 'Pollería El Pollón — Pollo a la brasa delivery en Iquique',
    ogDescription: 'Pide pollo a la brasa con delivery en Iquique. Menú online, combos y WhatsApp. Calle Vivar 1086.'
  }
};
