/**
 * Tema visual — Colores, tipografías y estilos globales.
 * Cambia estos valores para personalizar toda la apariencia del sitio.
 */
window.POLLON_CONFIG = window.POLLON_CONFIG || {};

window.POLLON_CONFIG.theme = {
  colors: {
    red: '#e10600',
    redDark: '#8b0000',
    redHover: '#c00500',
    redSoft: '#D62828',
    black: '#0d0d0d',
    white: '#ffffff',
    grayBg: '#f5f5f5',
    grayMuted: '#6b7280',
    grayDark: '#1c1c1c',
    orange: '#ff9800',
    gold: '#f5c518',
    footer: '#1A1A1A',
    success: '#16a34a',
    granate: '#6b0f1a'
  },
  fonts: {
    ui: "'Montserrat', 'Inter', system-ui, sans-serif",
    logo: "'Bebas Neue', 'Montserrat', sans-serif",
    script: "'Dancing Script', cursive",
    display: "'Bebas Neue', 'Montserrat', sans-serif"
  },
  radius: { sm: '8px', md: '12px', lg: '16px', xl: '20px', full: '9999px' },
  shadows: {
    soft: '0 2px 12px rgba(13, 13, 13, 0.06)',
    card: '0 4px 24px rgba(13, 13, 13, 0.08)',
    float: '0 8px 32px rgba(225, 6, 0, 0.25)',
    header: '0 4px 20px rgba(0, 0, 0, 0.12)'
  },
  header: { mobileHeight: '56px', desktopHeight: '76px' },
  carousel: { intervalMs: 1000 },
  loader: {
    gradient: 'linear-gradient(145deg, #1a1a1a 0%, #3d0a0a 45%, #c1121f 100%)',
    barGradient: 'linear-gradient(90deg, #ff9800, #f5c518)'
  }
};
