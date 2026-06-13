/**
 * Cargador de configuración — Aplica POLLON_CONFIG al DOM y al tema visual.
 * Todo el contenido editable se inyecta desde los archivos config/*.js
 */
(function () {
  'use strict';

  function cfg() {
    return window.POLLON_CONFIG || {};
  }

  function getBusiness() { return cfg().business || {}; }
  function getTheme() { return cfg().theme || {}; }
  function getCategories() { return cfg().categories || []; }
  function getPromos() { return cfg().promotions || {}; }
  function getTexts() { return cfg().texts || {}; }
  function getOptions() { return cfg().options || {}; }
  function getDelivery() { return cfg().delivery || {}; }
  function getWhatsapp() { return cfg().whatsapp || {}; }
  function getAdmin() { return cfg().admin || {}; }

  /** Aplica variables CSS del tema */
  function applyTheme() {
    const t = getTheme();
    const c = t.colors || {};
    const root = document.documentElement;
    const map = {
      '--pollon-red': c.red,
      '--pollon-red-dark': c.redDark,
      '--pollon-red-hover': c.redHover,
      '--pollon-black': c.black,
      '--pollon-white': c.white,
      '--pollon-gray-bg': c.grayBg,
      '--pollon-gray-muted': c.grayMuted,
      '--pollon-gray-dark': c.grayDark,
      '--pollon-orange': c.orange,
      '--pollon-gold': c.gold,
      '--color-red': c.red,
      '--color-red-soft': c.redSoft || c.redHover,
      '--color-orange': c.orange,
      '--color-gray-bg': c.grayBg,
      '--color-footer': c.footer || c.black,
      '--font-family': t.fonts?.ui,
      '--font-logo': t.fonts?.logo,
      '--header-h-mobile': t.header?.mobileHeight,
      '--header-h-desktop': t.header?.desktopHeight
    };
    Object.entries(map).forEach(([k, v]) => {
      if (v) root.style.setProperty(k, v);
    });
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme && c.red) metaTheme.setAttribute('content', c.red);
  }

  /** Actualiza textos e imágenes del negocio en header, sidebar y footer */
  function applyBusinessInfo() {
    const b = getBusiness();
    const t = getTexts();

    document.title = t.seo?.title || document.title;

    document.querySelectorAll('[data-config="business-name"]').forEach(el => {
      el.textContent = b.name || '';
    });
    document.querySelectorAll('[data-config="business-short"]').forEach(el => {
      el.textContent = b.shortName || b.name || '';
    });
    document.querySelectorAll('[data-config="business-tagline"]').forEach(el => {
      el.textContent = b.tagline || '';
    });
    document.querySelectorAll('[data-config="business-phone"]').forEach(el => {
      el.textContent = b.phone || '';
    });
    document.querySelectorAll('[data-config="business-phone-link"]').forEach(el => {
      el.href = b.phoneLink || '#';
      if (el.tagName === 'A') el.textContent = b.phone || el.textContent;
    });
    document.querySelectorAll('[data-config="business-schedule"]').forEach(el => {
      el.textContent = b.schedule || '';
    });
    document.querySelectorAll('[data-config="business-address"]').forEach(el => {
      el.textContent = b.addressFull || b.address || '';
    });
    document.querySelectorAll('[data-config="business-logo"]').forEach(el => {
      if (el.tagName === 'IMG') el.src = b.logo || el.src;
    });
    document.querySelectorAll('[data-config="login-url"]').forEach(el => {
      el.href = b.loginUrl || 'login.html';
    });

    const loaderText = document.querySelector('.app-loader-text');
    if (loaderText) loaderText.textContent = t.loader?.text || b.name || '';
    const loaderLogo = document.querySelector('.app-loader-logo');
    if (loaderLogo && b.logo) loaderLogo.src = b.logo;
  }

  /** Construye carrusel hero desde config */
  function buildHeroCarousel() {
    const slides = getPromos().heroSlides || [];
    const container = document.getElementById('carousel-container');
    const indicators = document.getElementById('carousel-indicators');
    if (!container || !slides.length) return;

    const slidesHtml = slides.map(s =>
      `<img class="carousel-slide min-w-full h-full object-cover" src="${s.src}" alt="${s.alt || ''}">`
    ).join('');
    const clone = slides[0];
    container.innerHTML = slidesHtml +
      (clone ? `<img class="carousel-slide min-w-full h-full object-cover" src="${clone.src}" alt="${clone.alt || ''}" aria-hidden="true">` : '');

    if (indicators) {
      indicators.innerHTML = slides.map((_, i) =>
        `<button type="button" class="carousel-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Slide ${i + 1}" aria-selected="${i === 0}"></button>`
      ).join('');
    }

    const hero = getPromos().hero || {};
    const scriptEl = document.querySelector('.hero-script');
    const titleEl = document.querySelector('.hero-premium-title');
    const subEl = document.querySelector('.hero-premium-sub');
    const ctaEl = document.querySelector('.hero-premium-cta');
    if (scriptEl) scriptEl.textContent = hero.script || '';
    if (titleEl) titleEl.textContent = hero.title || '';
    if (subEl) subEl.textContent = hero.subtitle || '';
    if (ctaEl) ctaEl.textContent = hero.cta || '';

    window.POLLON_CAROUSEL_SLIDES = slides.length;
  }

  /** Genera HTML de botón de categoría */
  function categoryCardHtml(cat, isActive) {
    return `
      <article class="category-card" role="listitem">
        <button type="button" class="category-btn catbtn category-card__btn${isActive ? ' is-active' : ''}" data-category="${cat.id}">
          <span class="category-card__img-wrap">
            <img src="${cat.image || ''}" alt="${cat.label}" class="category-card__img" loading="lazy">
          </span>
          <span class="category-card__label">${cat.shortLabel || cat.label}</span>
        </button>
      </article>`;
  }

  function categoryNavBtnHtml(cat) {
    return `
      <button class="sidebar-category sidebar-category-pro sidebar-nav-item w-full text-left" data-category="${cat.id}" type="button">
        <span class="sidebar-nav-icon" aria-hidden="true">${cat.emoji || ''}</span>
        <span>${cat.label}</span>
      </button>`;
  }

  function menuDdItemHtml(cat) {
    return `<button class="menu-dd-item" data-category="${cat.id}" type="button">${cat.emoji || ''} ${cat.label}</button>`;
  }

  function desktopMenuLinkHtml(cat) {
    return `<button class="desktop-menu-link-btn" data-category="${cat.id}" type="button">${cat.label}</button>`;
  }

  function desktopMenuCardHtml(cat) {
    const img = cat.galleryImage || cat.image || '';
    return `
      <button class="desktop-menu-card" data-category="${cat.id}" type="button">
        <img src="${img}" alt="${cat.label}" loading="lazy">
      </button>`;
  }

  /** Reconstruye navegación de categorías en todos los puntos del sitio */
  function buildCategories() {
    const cats = getCategories().filter(c => c.showInNav !== false);
    const productCats = cats.filter(c => !c.isAllMenu);

    const carousel = document.getElementById('categories-carousel');
    if (carousel) {
      carousel.innerHTML = cats.map((c, i) => categoryCardHtml(c, i === 0)).join('');
    }

    const sidebarSection = document.querySelector('.sidebar-section--categories');
    if (sidebarSection) {
      sidebarSection.innerHTML = productCats.map(categoryNavBtnHtml).join('');
    }

    const menuDdPanel = document.getElementById('menu-dd-panel-mobile');
    if (menuDdPanel) {
      menuDdPanel.querySelectorAll('.menu-dd-item').forEach(el => el.remove());
      const divider = menuDdPanel.querySelector('.menu-dd-divider');
      productCats.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'menu-dd-item';
        btn.dataset.category = cat.id;
        btn.type = 'button';
        btn.textContent = `${cat.emoji || ''} ${cat.label}`;
        if (divider) menuDdPanel.insertBefore(btn, divider);
        else menuDdPanel.appendChild(btn);
      });
    }

    const desktopLinks = document.querySelector('.desktop-menu-links');
    if (desktopLinks) {
      desktopLinks.innerHTML = productCats.map(desktopMenuLinkHtml).join('');
    }

    const desktopGrid = document.querySelector('.desktop-menu-grid');
    if (desktopGrid) {
      desktopGrid.innerHTML = productCats.map(desktopMenuCardHtml).join('');
    }
  }

  /** Sección de combos promocionales */
  function buildPromoCombos() {
    const cards = getPromos().comboCards || [];
    const wrap = document.querySelector('.pollon-combos .combo-wrap');
    if (!wrap || !cards.length) return;

    wrap.innerHTML = cards.map(card => `
      <article class="combo-card">
        <div class="combo-media">
          <img class="combo-img" src="${card.image}" alt="${card.stickerBig?.replace(/<[^>]+>/g, ' ') || ''}" loading="lazy">
          <div class="combo-sticker">
            <div class="sticker-top">${card.stickerTop || ''}</div>
            <div class="sticker-big">${card.stickerBig || ''}</div>
          </div>
        </div>
        <div class="combo-content">
          <h3>${card.title || ''}</h3>
          <p>${card.description || ''}</p>
          <a class="combo-btn" href="${card.href || '#menu'}"${card.category ? ` data-category="${card.category}"` : ''}>${card.cta || 'Ver más'}</a>
        </div>
      </article>
    `).join('');
  }

  /** Opciones de bebida en modal de personalización */
  function buildDrinkOptions() {
    const drinks = getOptions().drinks || [];
    const grid = document.querySelector('#drink-section .grid');
    if (!grid) return;

    grid.innerHTML = drinks.map(d => `
      <label class="flex items-center gap-3 p-3 border-2 border-gray-300 rounded-lg hover:border-red-500 cursor-pointer drink-option-label${d.fullWidth ? ' col-span-2' : ''}">
        <input type="radio" name="drink" class="drink-radio" value="${d.value}">
        <span class="font-semibold text-gray-800">${d.label}</span>
      </label>
    `).join('');

    const m = getOptions().modal || {};
    const drinkSection = document.getElementById('drink-section');
    if (drinkSection) {
      const label = drinkSection.querySelector('label');
      if (label) {
        label.innerHTML = `${m.drinkTitle || 'BEBIDAS —'} <span class="text-gray-600 font-normal">${m.drinkSubtitle || ''}</span>`;
      }
      const badge = drinkSection.querySelector('.rounded-full');
      if (badge) badge.textContent = m.drinkRequired || 'Obligatorio';
    }
  }

  /** Textos de modales, formularios y secciones */
  function applyTexts() {
    const t = getTexts();
    const b = getBusiness();
    const d = getDelivery();
    const w = getWhatsapp();
    const nav = t.nav || {};

    document.querySelectorAll('[data-config="nav-delivery"]').forEach(el => { el.textContent = nav.delivery || ''; });
    document.querySelectorAll('[data-config="nav-orders"]').forEach(el => { el.textContent = nav.orders || ''; });
    document.querySelectorAll('[data-config="nav-reservations"]').forEach(el => { el.textContent = nav.reservations || ''; });
    document.querySelectorAll('[data-config="nav-promos"]').forEach(el => { el.textContent = nav.promos || ''; });
    document.querySelectorAll('[data-config="nav-view-cart"]').forEach(el => { el.textContent = nav.viewCart || ''; });

    const aviso = document.querySelector('.aviso h2');
    if (aviso) aviso.textContent = getPromos().menuBanner?.title || aviso.textContent;

    const menuTitle = document.querySelector('#menu > div > h2');
    if (menuTitle) menuTitle.textContent = getPromos().menuSection?.title || menuTitle.textContent;

    const searchInput = document.getElementById('menu-search');
    if (searchInput) searchInput.placeholder = getPromos().menuSection?.searchPlaceholder || searchInput.placeholder;

    const fcLabel = document.querySelector('.floating-cart-label');
    if (fcLabel) fcLabel.textContent = t.floatingCart?.label || fcLabel.textContent;

    applyModalText('modal-delivery', t.modals?.delivery, d);
    applyModalText('modal-reservas', t.modals?.reservations, d);
    applyModalText('modal-retiros', t.modals?.pickup, d);

    setModalContent('cart-modal', 'h3', t.modals?.cart?.title);
    setModalContent('checkout-modal', 'h3', t.modals?.checkout?.title);
    setModalContent('options-modal', 'h3', getOptions().modal?.title);

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) checkoutBtn.textContent = w.checkout?.cartBtn || checkoutBtn.textContent;

    applyLocationSection();
    applyFooter(b);
    applyAdminTexts();
  }

  function applyModalText(modalId, modalCfg, deliveryCfg) {
    if (!modalCfg) return;
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const h3 = modal.querySelector('h3');
    if (h3) h3.innerHTML = modalCfg.title || h3.innerHTML;

    const intro = modal.querySelector('p.text-sm.text-gray-700.mb-3');
    if (intro && modalCfg.intro) intro.innerHTML = modalCfg.intro;

    const howTitle = modal.querySelector('p.font-semibold');
    if (howTitle && modalCfg.howTitle) howTitle.textContent = modalCfg.howTitle;

    const ul = modal.querySelector('ul.list-disc');
    if (ul && modalCfg.steps) {
      ul.innerHTML = modalCfg.steps.map(s => `<li>${s}</li>`).join('');
    }
    if (ul && modalCfg.requirements) {
      ul.innerHTML = modalCfg.requirements.map(s => `<li>${s}</li>`).join('');
    }

    const footnotes = modal.querySelectorAll('p.text-xs.text-gray-500');
    const footnote = footnotes.length ? footnotes[footnotes.length - 1] : null;
    if (footnote && modalId === 'modal-delivery' && deliveryCfg?.costNote) {
      footnote.textContent = `* Recuerda que el delivery tiene un costo adicional según tu zona (${deliveryCfg.costNote}).`;
    } else if (footnote && modalId === 'modal-reservas' && deliveryCfg?.reservations?.note) {
      footnote.textContent = '* ' + deliveryCfg.reservations.note;
    } else if (footnote && modalId === 'modal-retiros' && deliveryCfg?.pickup?.note) {
      footnote.textContent = '* ' + deliveryCfg.pickup.note;
    }

    const ctaGo = modal.querySelector('#modal-reserva-go, #modal-retiro-go');
    if (ctaGo && modalCfg.cta) ctaGo.textContent = modalCfg.cta;
  }

  function setModalContent(modalId, selector, text) {
    if (!text) return;
    const el = document.querySelector(`#${modalId} ${selector}`);
    if (el) el.textContent = text;
  }

  function applyLocationSection() {
    const loc = getPromos().location || {};
    const b = getBusiness();
    const header = document.querySelector('.location-header');
    if (header) {
      const h2 = header.querySelector('h2');
      const p = header.querySelector('p');
      if (h2) h2.textContent = loc.title || h2.textContent;
      if (p) p.textContent = loc.subtitle || p.textContent;
    }
    const info = document.querySelector('.location-info');
    if (info) {
      const h3 = info.querySelector('h3');
      if (h3) h3.textContent = loc.storeTitle || h3.textContent;
      const items = info.querySelectorAll('li');
      if (items[0]) items[0].innerHTML = `<span>📍</span> ${b.addressFull || b.address || ''}`;
      if (items[1]) items[1].innerHTML = `<span>📞</span> <a href="${b.phoneLink || '#'}">${b.phone || ''}</a>`;
      if (items[2]) items[2].innerHTML = `<span>🕐</span> ${b.scheduleLong || b.schedule || ''}`;
    }
    const iframe = document.querySelector('.location-map iframe');
    if (iframe && b.mapEmbed) iframe.src = b.mapEmbed;
  }

  function applyFooter(b) {
    const footer = b.footer || {};
    const social = b.social || {};

    const title = document.querySelector('.footer-title');
    if (title) title.textContent = b.shortName || b.name || '';
    const sub = document.querySelector('.footer-subtitle');
    if (sub) sub.textContent = footer.subtitle || sub.textContent;
    const logo = document.querySelector('.footer-logo img');
    if (logo && b.logo) logo.src = b.logo;

    const socialCol = document.querySelector('.footer-formal-col:nth-child(3) .footer-formal-list');
    if (socialCol) {
      socialCol.innerHTML = Object.values(social).map(s =>
        `<li><a class="footer-formal-link" href="${s.url}" target="_blank" rel="noopener noreferrer">${s.label}</a></li>`
      ).join('');
    }

    const bottom = document.querySelector('.footer-bottom');
    if (bottom) {
      const ps = bottom.querySelectorAll('p');
      if (ps[0]) ps[0].textContent = footer.copyright || ps[0].textContent;
      if (ps[1]) ps[1].textContent = footer.credit || ps[1].textContent;
    }
  }

  function applyAdminTexts() {
    const a = getAdmin();
    const panel = a.panel || {};
    const h3 = document.querySelector('#admin-panel-modal h3');
    if (h3) h3.innerHTML = `<span>📊</span><span>${panel.title || 'Panel de Administración'}</span>`;
    const sub = document.querySelector('#admin-panel-modal > div > div > p.text-sm');
    if (sub) sub.textContent = panel.subtitle || sub.textContent;
  }

  /** Helpers para app.js */
  function getCategoryMeta() {
    const meta = {};
    getCategories().forEach(c => {
      if (!c.isAllMenu) meta[c.id] = { title: `${c.emoji || ''} ${c.label}`.trim() };
    });
    return meta;
  }

  function init() {
    applyTheme();
    applyBusinessInfo();
    buildHeroCarousel();
    buildCategories();
    buildPromoCombos();
    buildDrinkOptions();
    applyTexts();
  }

  window.PollonConfig = {
    init,
    get: cfg,
    getCategoryMeta,
    getCategoryOrder: () => cfg().categoryOrder || [],
    getBusiness,
    getTheme,
    getOptions,
    getWhatsapp,
    getDelivery,
    getTexts,
    getAdmin
  };

  window.PollonConfigLoader = window.PollonConfig;
})();
