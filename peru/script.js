/* ==========================================================================
   JGN Asesoría Inmobiliaria · Perú — /peru
   JavaScript vanilla, sin dependencias externas.

   Orden del archivo:
     1. Configuración editable (contacto, redes, endpoint, flags)
     2. Inventario de propiedades (ZONA EDITABLE)
     3. Zonas
     4. Capa de tracking
     5. Utilidades
     6. WhatsApp contextual
     7. Render de propiedades
     8. Buscador y filtros
     9. Ficha de propiedad (modal)
    10. UI: header, menú, sticky CTA, reveal
   ========================================================================== */

(function () {
  'use strict';

  /* ========================================================================
     1. CONFIGURACIÓN EDITABLE
     ======================================================================== */
  const JGN_CONFIG = {
    whatsappNumber: '51998332017',
    whatsappDisplay: '+51 998 332 017',
    email: 'contacto@jgnrealestate.com',
    baseUrl: 'https://jgnrealestate.com/peru',

    // TODO: completar con las URLs oficiales validadas por JGN.
    // Un valor vacío deja el botón visible pero desactivado (no se inventan URLs).
    social: {
      instagram: '',
      facebook: '',
      linkedin: '',
      tiktok: '',
      googleBusiness: ''
    },

    // Interruptor maestro de inventario.
    // false = no se publican precios ni características hasta validación de JGN.
    // Al validar: poner en true (o activar property.priceValidated / specsValidated).
    inventoryValidated: false,

    // Las fichas /peru/propiedad/[slug] aún no existen.
    // Mientras sea false, "Ver propiedad" abre la ficha rápida en modal.
    // Al publicar las fichas: poner en true y los enlaces pasan a ser navegables.
    propertyPagesEnabled: false,
    propertyPathPrefix: '/peru/propiedad/',

    // Cantidad de propiedades visibles antes de "Ver más propiedades".
    initialGridCount: 9
  };

  /* ========================================================================
     2. INVENTARIO DE PROPIEDADES — ZONA EDITABLE
     ------------------------------------------------------------------------
     Fuente: propiedades publicadas por JGN en jgnrealestate.com
     (consultadas el 17/08/2026). Ningún dato ha sido inventado.

     ESTADO: PENDIENTE DE VALIDACIÓN COMERCIAL POR JGN.
     Mientras JGN_CONFIG.inventoryValidated sea false, precio, metraje,
     dormitorios, baños y cocheras NO se muestran al visitante.

     Para publicar un dato ya validado:
       - todo el inventario  -> JGN_CONFIG.inventoryValidated = true
       - una sola propiedad  -> priceValidated: true / specsValidated: true

     Campo `available`:
       true  = disponible confirmado
       false = no disponible
       null  = pendiente de validar (no se afirma disponibilidad)
     ======================================================================== */
  const PROPERTIES = [
    {
      id: 'jgn-pe-001',
      slug: 'el-velero-las-lagunas-la-molina',
      name: 'El Velero · Las Lagunas',
      eyebrow: 'Residencial premium',
      operation: 'venta',
      location: 'La Molina',
      district: 'Las Lagunas, La Molina',
      type: 'casa',
      typeLabel: 'Casa en condominio',
      price: 1999000,
      currency: 'USD',
      priceValidated: false,
      area: { land: 1025, built: 650 },
      bedrooms: 4,
      bathrooms: null,        // Pendiente de validar
      parking: 5,
      specsValidated: false,
      description: 'Residencia en Calle El Velero, dentro de una zona residencial de La Molina, en urbanización cerrada con tranqueras.',
      image: 'assets/images/properties/el-velero-las-lagunas.jpg',
      imageW: 1100,
      imageH: 599,
      gallery: [],
      featured: true,
      available: null
    },
    {
      id: 'jgn-pe-002',
      slug: 'los-gavilanes-san-isidro',
      name: 'Los Gavilanes',
      eyebrow: 'Activo corporativo / inversión',
      operation: 'venta',
      location: 'San Isidro',
      district: 'San Isidro',
      type: 'comercial',
      typeLabel: 'Propiedad comercial',
      price: 850000,
      currency: 'USD',
      priceValidated: false,
      area: { land: null, built: null },
      bedrooms: null,
      bathrooms: null,
      parking: null,
      specsValidated: false,
      description: '',
      image: 'assets/images/properties/los-gavilanes-san-isidro.jpg',
      imageW: 1100,
      imageH: 599,
      gallery: [],
      featured: true,
      available: null
    },
    {
      id: 'jgn-pe-003',
      slug: 'casa-de-playa-cocoa-asia',
      name: 'Casa de playa · Cocoa',
      eyebrow: 'Segunda vivienda / uso familiar',
      operation: 'venta',
      location: 'Asia / Playas del Sur',
      district: 'Playas del Sur',
      type: 'casa-playa',
      typeLabel: 'Casa de playa',
      price: 395000,
      currency: 'USD',
      priceValidated: false,
      area: { land: null, built: null },
      bedrooms: null,
      bathrooms: null,
      parking: null,
      specsValidated: false,
      description: '',
      image: 'assets/images/properties/casa-playa-cocoa.jpg',
      imageW: 1100,
      imageH: 587,
      gallery: [],
      featured: true,
      available: null
    },
    {
      id: 'jgn-pe-004',
      slug: 'condominio-miraflores',
      name: 'Condominio Miraflores',
      eyebrow: 'Vida urbana y privacidad',
      operation: 'venta',
      location: 'Miraflores',
      district: 'Enrique del Horme 218, Miraflores',
      type: 'casa',
      typeLabel: 'Casa en condominio',
      price: 542000,
      currency: 'USD',
      priceValidated: false,
      area: { land: null, built: null },
      bedrooms: null,
      bathrooms: null,
      parking: null,
      specsValidated: false,
      description: '',
      image: 'assets/images/properties/condominio-miraflores.jpg',
      imageW: 1100,
      imageH: 619,
      gallery: [],
      featured: false,
      available: null
    },
    {
      id: 'jgn-pe-005',
      slug: 'castilla-la-vieja-surco',
      name: 'Castilla la Vieja',
      eyebrow: 'Opción funcional',
      operation: 'venta',
      location: 'Surco',
      district: 'Surco',
      type: 'departamento',
      typeLabel: 'Departamento',
      price: 209000,
      currency: 'USD',
      priceValidated: false,
      area: { land: null, built: null },
      bedrooms: null,
      bathrooms: null,
      parking: null,
      specsValidated: false,
      description: '',
      image: 'assets/images/properties/castilla-la-vieja-surco.jpg',
      imageW: 1100,
      imageH: 513,
      gallery: [],
      featured: false,
      available: null
    },
    {
      id: 'jgn-pe-006',
      slug: 'oficina-av-benavides-768',
      name: 'Oficina Av. Benavides 768',
      eyebrow: 'Uso corporativo / inversión',
      operation: 'venta',
      location: 'Lima',
      district: 'Av. Benavides 768',
      type: 'oficina',
      typeLabel: 'Oficina',
      price: 470000,
      currency: 'USD',
      priceValidated: false,
      area: { land: null, built: null },
      bedrooms: null,
      bathrooms: null,
      parking: null,
      specsValidated: false,
      description: '',
      image: 'assets/images/properties/oficina-benavides-768.jpg',
      imageW: 1100,
      imageH: 619,
      gallery: [],
      featured: false,
      available: null
    }
  ];

  /* ========================================================================
     3. ZONAS
     Solo se renderiza una zona si tiene inventario asociado.
     `slug` deja preparada la arquitectura de /peru/[zona].
     ======================================================================== */
  const ZONES = [
    { name: 'La Molina',            slug: 'la-molina',  image: 'assets/images/properties/el-velero-las-lagunas.jpg',    w: 1100, h: 599 },
    { name: 'San Isidro',           slug: 'san-isidro', image: 'assets/images/properties/los-gavilanes-san-isidro.jpg', w: 1100, h: 599 },
    { name: 'Miraflores',           slug: 'miraflores', image: 'assets/images/properties/condominio-miraflores.jpg',    w: 1100, h: 619 },
    { name: 'Surco',                slug: 'surco',      image: 'assets/images/properties/castilla-la-vieja-surco.jpg',  w: 1100, h: 513 },
    { name: 'Asia / Playas del Sur', slug: 'asia',      image: 'assets/images/properties/casa-playa-cocoa.jpg',         w: 1100, h: 587 }
  ];

  /* Etiqueta del estado de la propiedad (badge de la card y parámetros de tracking) */
  const OPERATION_LABELS = { venta: 'Venta', alquiler: 'Alquiler' };

  /* Opciones fijas del selector de operación, definidas por JGN.
     No se derivan del inventario: "Vender" no es un estado de propiedad sino
     una intención de propietario y deriva al bloque de captación. */
  const OPERATION_OPTIONS = [
    { value: 'venta',    label: 'Comprar' },
    { value: 'alquiler', label: 'Alquilar' },
    { value: 'vender',   label: 'Vender' }
  ];

  function operationOptionLabel(value) {
    const found = OPERATION_OPTIONS.find(o => o.value === value);
    return found ? found.label : (OPERATION_LABELS[value] || value);
  }

  const TYPE_LABELS = {
    'casa': 'Casa',
    'departamento': 'Departamento',
    'oficina': 'Oficina',
    'comercial': 'Comercial',
    'casa-playa': 'Casa de playa',
    'terreno': 'Terreno',
    'otros': 'Otros'
  };

  /* ========================================================================
     4. CAPA DE TRACKING
     Desacoplada de plataformas: todo pasa por dataLayer.
     GTM/GA4/Meta Pixel se conectan después sin tocar este archivo.
     ======================================================================== */
  function trackEvent(eventName, parameters = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...parameters
    });
  }
  window.trackEvent = trackEvent;

  function propertyParams(p) {
    return {
      property_id: p.id,
      property_name: p.name,
      property_location: p.location,
      property_type: p.typeLabel,
      operation: OPERATION_LABELS[p.operation] || p.operation
    };
  }

  /* ========================================================================
     5. UTILIDADES
     ======================================================================== */
  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatPrice(p) {
    if (typeof p.price !== 'number') return null;
    return p.currency + ' ' + p.price.toLocaleString('es-PE');
  }

  function isPriceVisible(p) {
    return (JGN_CONFIG.inventoryValidated || p.priceValidated) && typeof p.price === 'number';
  }

  function areSpecsVisible(p) {
    return JGN_CONFIG.inventoryValidated || p.specsValidated;
  }

  const ICONS = {
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 21s-7-5.6-7-11a7 7 0 1 1 14 0c0 5.4-7 11-7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>',
    whatsapp: '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.4 1.9.8 2.6.9 3.5.7.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z"/><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>'
  };

  /* ========================================================================
     6. WHATSAPP CONTEXTUAL
     El mensaje por propiedad se genera automáticamente desde el nombre.
     Nunca se escribe un mensaje distinto a mano en cada card.
     ======================================================================== */
  function waUrl(message) {
    return 'https://wa.me/' + JGN_CONFIG.whatsappNumber + '?text=' + encodeURIComponent(message);
  }

  function waPropertyUrl(p) {
    return waUrl('Hola Natalie, vi la propiedad ' + p.name + ' en JGN y quisiera recibir más información.');
  }

  function openWhatsApp(url) {
    window.open(url, '_blank', 'noopener');
  }

  /* Enlaces WhatsApp genéricos declarados en el HTML con data-wa-message */
  function initGenericWhatsAppLinks() {
    $$('[data-wa-message]').forEach(el => {
      const message = el.getAttribute('data-wa-message');
      el.setAttribute('href', waUrl(message));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');

      el.addEventListener('click', () => {
        const eventName = el.getAttribute('data-wa-event') || 'WhatsAppClick';
        trackEvent(eventName, {
          cta_location: el.getAttribute('data-wa-location') || 'no-especificado'
        });
      });
    });
  }

  /* ========================================================================
     7. RENDER DE PROPIEDADES
     ======================================================================== */
  function propertyHref(p) {
    return JGN_CONFIG.propertyPathPrefix + p.slug;
  }

  function priceMarkup(p) {
    if (isPriceVisible(p)) {
      return '<p class="property-price">' + escapeHtml(formatPrice(p)) + '</p>';
    }
    return '<p class="property-price property-price--muted">Precio e información comercial bajo consulta</p>';
  }

  /* Cada card muestra un único CTA.
       variant 'featured' -> "Ver propiedad" (abre la ficha)
       variant 'grid'     -> "Contactar" (WhatsApp contextual)
     En el grid, el nombre de la propiedad sigue abriendo la ficha: es un
     control accesible por teclado y no añade un segundo botón visible. */
  function propertyCardHTML(p, variant) {
    const isFeatured = variant === 'featured';
    const id = escapeHtml(p.id);

    const viewTag  = JGN_CONFIG.propertyPagesEnabled ? 'a' : 'button';
    const viewAttr = JGN_CONFIG.propertyPagesEnabled
      ? 'href="' + escapeHtml(propertyHref(p)) + '"'
      : 'type="button"';

    const cta = isFeatured
      ? '<' + viewTag + ' class="btn btn--gold btn--block js-view-property" ' + viewAttr +
          ' data-property-id="' + id + '">Ver propiedad</' + viewTag + '>'
      : '<a class="btn btn--dark btn--block js-wa-property" href="' + escapeHtml(waPropertyUrl(p)) + '"' +
          ' target="_blank" rel="noopener" data-property-id="' + id + '"' +
          ' aria-label="Contactar por WhatsApp sobre ' + escapeHtml(p.name) + '">' +
          ICONS.whatsapp + '<span>Contactar</span></a>';

    const nameMarkup = isFeatured
      ? '<h3 class="property-name">' + escapeHtml(p.name) + '</h3>'
      : '<h3 class="property-name">' +
          '<' + viewTag + ' class="property-name-btn js-view-property" ' + viewAttr +
            ' data-property-id="' + id + '">' + escapeHtml(p.name) + '</' + viewTag + '>' +
        '</h3>';

    return '' +
      '<article class="property-card reveal" data-property-id="' + id + '">' +
        '<div class="property-media">' +
          '<img src="' + escapeHtml(p.image) + '" alt="' + escapeHtml(p.name + ' — ' + p.typeLabel + ' en ' + p.location) + '"' +
            ' width="' + p.imageW + '" height="' + p.imageH + '" loading="lazy" decoding="async">' +
          '<div class="property-badges">' +
            '<span class="badge badge--operation">' + escapeHtml(OPERATION_LABELS[p.operation] || p.operation) + '</span>' +
            '<span class="badge badge--type">' + escapeHtml(p.typeLabel) + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="property-body">' +
          (p.eyebrow ? '<p class="property-eyebrow">' + escapeHtml(p.eyebrow) + '</p>' : '') +
          nameMarkup +
          '<p class="property-location">' + ICONS.pin + '<span>' + escapeHtml(p.district) + '</span></p>' +
          priceMarkup(p) +
          '<div class="property-actions">' + cta + '</div>' +
        '</div>' +
      '</article>';
  }

  function getPropertyById(id) {
    return PROPERTIES.find(p => p.id === id) || null;
  }

  function bindPropertyCardEvents(container) {
    $$('.js-view-property', container).forEach(el => {
      el.addEventListener('click', (ev) => {
        const p = getPropertyById(el.getAttribute('data-property-id'));
        if (!p) return;
        trackEvent('ViewProperty', propertyParams(p));
        if (!JGN_CONFIG.propertyPagesEnabled) {
          ev.preventDefault();
          openPropertyModal(p);
        }
      });
    });

    $$('.js-wa-property', container).forEach(el => {
      el.addEventListener('click', () => {
        const p = getPropertyById(el.getAttribute('data-property-id'));
        if (!p) return;
        trackEvent('WhatsAppPropertyClick', propertyParams(p));
      });
    });
  }

  function renderFeatured() {
    const container = $('#featured-grid');
    if (!container) return;
    const featured = PROPERTIES.filter(p => p.featured);
    container.innerHTML = featured.map(p => propertyCardHTML(p, 'featured')).join('');
    bindPropertyCardEvents(container);
    observeReveals(container);
  }

  /* ========================================================================
     8. BUSCADOR Y FILTROS
     ======================================================================== */
  const filterState = { operation: '', location: '', type: '' };
  let visibleCount = JGN_CONFIG.initialGridCount;

  function uniqueValues(key) {
    return Array.from(new Set(PROPERTIES.map(p => p[key]))).filter(Boolean).sort();
  }

  /* Solo se muestran filtros que tienen inventario asociado */
  function buildSelectOptions() {
    const opSelect   = $('#filter-operation');
    const locSelect  = $('#filter-location');
    const typeSelect = $('#filter-type');

    if (opSelect) {
      OPERATION_OPTIONS.forEach(op => {
        opSelect.appendChild(new Option(op.label, op.value));
      });
    }
    if (locSelect) {
      uniqueValues('location').forEach(loc => {
        locSelect.appendChild(new Option(loc, loc));
      });
    }
    if (typeSelect) {
      uniqueValues('type').forEach(t => {
        typeSelect.appendChild(new Option(TYPE_LABELS[t] || t, t));
      });
    }
  }

  function filteredProperties() {
    return PROPERTIES.filter(p =>
      (!filterState.operation || p.operation === filterState.operation) &&
      (!filterState.location  || p.location  === filterState.location) &&
      (!filterState.type      || p.type      === filterState.type)
    );
  }

  function chipHTML(key, label) {
    return '<button type="button" class="chip js-clear-filter" data-filter-key="' + key + '"' +
      ' aria-label="Quitar filtro ' + escapeHtml(label) + '">' +
      '<span>' + escapeHtml(label) + '</span>' + ICONS.close + '</button>';
  }

  function renderFilterBar(results) {
    const bar = $('#filter-bar');
    if (!bar) return;

    const chips = [];
    if (filterState.operation) chips.push(chipHTML('operation', operationOptionLabel(filterState.operation)));
    if (filterState.location)  chips.push(chipHTML('location', filterState.location));
    if (filterState.type)      chips.push(chipHTML('type', TYPE_LABELS[filterState.type] || filterState.type));

    const count = results.length === 1 ? '1 propiedad' : results.length + ' propiedades';
    bar.innerHTML = '<span class="filter-count">' + count + '</span>' + chips.join('');

    $$('.js-clear-filter', bar).forEach(chip => {
      chip.addEventListener('click', () => {
        const key = chip.getAttribute('data-filter-key');
        filterState[key] = '';
        syncSelectsFromState();
        renderGrid();
      });
    });
  }

  function renderGrid(options = {}) {
    const container = $('#portfolio-grid');
    if (!container) return;

    const results = filteredProperties();
    renderFilterBar(results);

    if (!results.length) {
      container.innerHTML =
        '<div class="empty-state">' +
          '<h3>No hay propiedades publicadas con esa combinación</h3>' +
          '<p>El inventario se actualiza de forma constante y no todas las propiedades se publican. ' +
          'Cuéntale a Natalie qué estás buscando y revisa opciones disponibles.</p>' +
          '<a class="btn btn--gold" href="' + escapeHtml(waUrl('Hola Natalie, busco una propiedad en Perú y no encontré opciones en la web. Quisiera contarte qué estoy buscando.')) + '"' +
          ' target="_blank" rel="noopener" data-empty-wa>' + ICONS.whatsapp + '<span>Hablar con Natalie</span></a>' +
        '</div>';
      const emptyCta = $('[data-empty-wa]', container);
      if (emptyCta) {
        emptyCta.addEventListener('click', () => trackEvent('WhatsAppClick', { cta_location: 'grid-sin-resultados' }));
      }
      toggleLoadMore(0, 0);
      return;
    }

    const shown = results.slice(0, visibleCount);
    container.innerHTML = shown.map(p => propertyCardHTML(p, 'grid')).join('');
    bindPropertyCardEvents(container);
    observeReveals(container);
    toggleLoadMore(shown.length, results.length);

    if (options.scroll) {
      const target = $('#portafolio');
      if (target) target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    }
  }

  function toggleLoadMore(shownCount, totalCount) {
    const btn = $('#load-more');
    if (!btn) return;
    btn.hidden = shownCount >= totalCount;
  }

  function syncSelectsFromState() {
    const map = {
      '#filter-operation': 'operation',
      '#filter-location': 'location',
      '#filter-type': 'type'
    };
    Object.keys(map).forEach(sel => {
      const el = $(sel);
      if (el) el.value = filterState[map[sel]];
    });
  }

  function initSearch() {
    buildSelectOptions();
    readFiltersFromUrl();
    syncSelectsFromState();

    const form = $('#search-form');
    if (form) {
      form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const opValue = $('#filter-operation') ? $('#filter-operation').value : '';

        /* "Vender" es una intención de propietario, no un estado del inventario:
           lleva al bloque de captación en lugar de devolver cero resultados. */
        if (opValue === 'vender') {
          trackEvent('OwnerContactClick', { cta_location: 'buscador-vender' });
          const owners = $('#propietarios');
          if (owners) {
            owners.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
          }
          return;
        }

        filterState.operation = opValue;
        filterState.location  = $('#filter-location') ? $('#filter-location').value : '';
        filterState.type      = $('#filter-type')     ? $('#filter-type').value     : '';
        visibleCount = JGN_CONFIG.initialGridCount;

        trackEvent('SearchProperty', {
          operation: filterState.operation ? operationOptionLabel(filterState.operation) : 'todas',
          property_location: filterState.location || 'todas',
          property_type: filterState.type ? (TYPE_LABELS[filterState.type] || filterState.type) : 'todos',
          results_count: filteredProperties().length
        });

        renderGrid({ scroll: true });
      });
    }

    /* Eventos granulares por filtro (para audiencias de remarketing) */
    const granular = [
      { sel: '#filter-operation', event: 'FilterOperation',    param: 'operation',         format: operationOptionLabel },
      { sel: '#filter-location',  event: 'FilterLocation',     param: 'property_location', format: v => v },
      { sel: '#filter-type',      event: 'FilterPropertyType', param: 'property_type',     format: v => TYPE_LABELS[v] || v }
    ];
    granular.forEach(cfg => {
      const el = $(cfg.sel);
      if (!el) return;
      el.addEventListener('change', () => {
        if (!el.value) return;
        trackEvent(cfg.event, { [cfg.param]: cfg.format(el.value) });
      });
    });

    const loadMore = $('#load-more');
    if (loadMore) {
      loadMore.addEventListener('click', () => {
        visibleCount += JGN_CONFIG.initialGridCount;
        renderGrid();
        trackEvent('LoadMoreProperties', { visible_count: visibleCount });
      });
    }
  }

  /* Deep links desde Meta Ads / Google Ads:
     /peru?operacion=venta&zona=La%20Molina&tipo=casa */
  function readFiltersFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const op   = params.get('operacion');
    const zona = params.get('zona');
    const tipo = params.get('tipo');

    if (op   && ['venta', 'alquiler'].includes(op))      filterState.operation = op;
    if (zona && uniqueValues('location').includes(zona)) filterState.location = zona;
    if (tipo && uniqueValues('type').includes(tipo))    filterState.type = tipo;
  }

  function applyFilter(key, value, label) {
    filterState[key] = value;
    visibleCount = JGN_CONFIG.initialGridCount;
    syncSelectsFromState();
    renderGrid({ scroll: true });

    if (key === 'location')  trackEvent('FilterLocation', { property_location: label || value });
    if (key === 'operation') trackEvent('FilterOperation', { operation: label || value });
    if (key === 'type')      trackEvent('FilterPropertyType', { property_type: label || value });
  }

  /* ========================================================================
     ZONAS — solo se pintan las que tienen inventario
     ======================================================================== */
  function renderZones() {
    const container = $('#zones-grid');
    if (!container) return;

    const withInventory = ZONES
      .map(z => ({ zone: z, count: PROPERTIES.filter(p => p.location === z.name).length }))
      .filter(item => item.count > 0);

    if (!withInventory.length) {
      const section = $('#zonas');
      if (section) section.hidden = true;
      return;
    }

    container.innerHTML = withInventory.map(({ zone, count }) =>
      '<button type="button" class="zone-card reveal" data-zone="' + escapeHtml(zone.name) + '"' +
        ' data-zone-slug="' + escapeHtml(zone.slug) + '"' +
        ' aria-label="Ver propiedades en ' + escapeHtml(zone.name) + '">' +
        '<img src="' + escapeHtml(zone.image) + '" alt="Propiedad de JGN en ' + escapeHtml(zone.name) + '"' +
          ' width="' + zone.w + '" height="' + zone.h + '" loading="lazy" decoding="async">' +
        '<span class="zone-card-body">' +
          '<span class="zone-card-name">' + escapeHtml(zone.name) + '</span>' +
          '<span class="zone-card-count">' + count + (count === 1 ? ' propiedad' : ' propiedades') + '</span>' +
        '</span>' +
      '</button>'
    ).join('');

    $$('.zone-card', container).forEach(card => {
      card.addEventListener('click', () => {
        applyFilter('location', card.getAttribute('data-zone'), card.getAttribute('data-zone'));
      });
    });

    observeReveals(container);
  }

  /* ========================================================================
     9. FICHA DE PROPIEDAD (MODAL)
     Arquitectura equivalente a la futura página /peru/propiedad/[slug]:
     consume exactamente el mismo objeto de datos.
     ======================================================================== */
  let lastFocusedElement = null;

  function specsMarkup(p) {
    if (!areSpecsVisible(p)) return '';
    const rows = [];
    if (p.area && p.area.land)  rows.push(['Terreno', p.area.land + ' m²']);
    if (p.area && p.area.built) rows.push(['Construcción', p.area.built + ' m²']);
    if (p.bedrooms)  rows.push(['Dormitorios', String(p.bedrooms)]);
    if (p.bathrooms) rows.push(['Baños', String(p.bathrooms)]);
    if (p.parking)   rows.push(['Cocheras', String(p.parking)]);
    if (!rows.length) return '';

    return '<ul class="modal-specs">' + rows.map(r =>
      '<li><span>' + escapeHtml(r[0]) + '</span><strong>' + escapeHtml(r[1]) + '</strong></li>'
    ).join('') + '</ul>';
  }

  function openPropertyModal(p) {
    const modal = $('#property-modal');
    const body  = $('#property-modal-body');
    if (!modal || !body) return;

    lastFocusedElement = document.activeElement;

    body.innerHTML = '' +
      '<div class="modal-media">' +
        '<img src="' + escapeHtml(p.image) + '" alt="' + escapeHtml(p.name + ' — ' + p.typeLabel + ' en ' + p.location) + '"' +
          ' width="' + p.imageW + '" height="' + p.imageH + '" decoding="async">' +
        '<div class="property-badges">' +
          '<span class="badge badge--operation">' + escapeHtml(OPERATION_LABELS[p.operation] || p.operation) + '</span>' +
          '<span class="badge badge--type">' + escapeHtml(p.typeLabel) + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="modal-info">' +
        (p.eyebrow ? '<p class="property-eyebrow">' + escapeHtml(p.eyebrow) + '</p>' : '') +
        '<h2 class="section-title section-title--md" id="property-modal-title">' + escapeHtml(p.name) + '</h2>' +
        '<p class="property-location">' + ICONS.pin + '<span>' + escapeHtml(p.district) + '</span></p>' +
        priceMarkup(p) +
        specsMarkup(p) +
        (p.description ? '<p class="modal-description">' + escapeHtml(p.description) + '</p>' : '') +
        '<p class="modal-note">Ficha completa, disponibilidad y condiciones comerciales se confirman directamente con Natalie antes de avanzar.</p>' +
        '<a class="btn btn--gold btn--block js-modal-wa" href="' + escapeHtml(waPropertyUrl(p)) + '" target="_blank" rel="noopener">' +
          ICONS.whatsapp + '<span>Consultar por WhatsApp</span></a>' +
      '</div>';

    const waBtn = $('.js-modal-wa', body);
    if (waBtn) {
      waBtn.addEventListener('click', () => trackEvent('WhatsAppPropertyClick', {
        ...propertyParams(p),
        cta_location: 'ficha-propiedad'
      }));
    }

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (history.replaceState) {
      history.replaceState(null, '', '#propiedad/' + p.slug);
    }

    const closeBtn = $('.modal-close', modal);
    if (closeBtn) closeBtn.focus();
  }

  function closePropertyModal() {
    const modal = $('#property-modal');
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (history.replaceState) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function initModal() {
    const modal = $('#property-modal');
    if (!modal) return;

    modal.addEventListener('click', (ev) => {
      if (ev.target.hasAttribute('data-modal-close') || ev.target.closest('[data-modal-close]')) {
        closePropertyModal();
      }
    });

    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') closePropertyModal();
      if (ev.key === 'Tab' && !modal.hidden) trapFocus(ev, modal);
    });

    /* Apertura directa por hash: útil para remarketing y enlaces compartidos */
    const hash = window.location.hash;
    if (hash.startsWith('#propiedad/')) {
      const slug = hash.replace('#propiedad/', '');
      const p = PROPERTIES.find(item => item.slug === slug);
      if (p) {
        trackEvent('ViewProperty', { ...propertyParams(p), entry: 'deep-link' });
        openPropertyModal(p);
      }
    }
  }

  function trapFocus(ev, container) {
    const focusables = $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', container)
      .filter(el => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last  = focusables[focusables.length - 1];

    if (ev.shiftKey && document.activeElement === first) {
      ev.preventDefault();
      last.focus();
    } else if (!ev.shiftKey && document.activeElement === last) {
      ev.preventDefault();
      first.focus();
    }
  }

  /* ========================================================================
     REDES SOCIALES
     Los botones sin URL configurada quedan desactivados (no se inventan).
     ======================================================================== */
  function initSocial() {
    $$('[data-social]').forEach(el => {
      const key = el.getAttribute('data-social');

      /* La URL puede definirse en dos sitios, lo que resulte más cómodo:
           1. JGN_CONFIG.social  (arriba de este archivo)
           2. el atributo href directamente en index.html
         La configuración manda; si está vacía, se respeta el href del HTML. */
      const htmlHref = el.getAttribute('href');
      const url = JGN_CONFIG.social[key] ||
                  (htmlHref && htmlHref !== '#' ? htmlHref : '');

      /* Los botones se muestran siempre activos y accionables.
         Quedan operativos en cuanto exista una URL. */
      el.removeAttribute('aria-disabled');
      el.removeAttribute('tabindex');

      if (!url) {
        el.removeAttribute('href');
        return;
      }

      el.setAttribute('href', url);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');

      el.addEventListener('click', () => {
        trackEvent(key === 'linkedin' ? 'LinkedInClick' : 'SocialClick', { network: key });
      });
    });
  }

  /* ========================================================================
     11. UI: header, menú, sticky CTA, reveal
     ======================================================================== */
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function initHeader() {
    const header = $('#header');
    if (!header) return;
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initMobileNav() {
    const toggle = $('#menu-toggle');
    const nav = $('#mobile-nav');
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      toggle.classList.toggle('is-active', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = open ? 'hidden' : '';
    };

    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    $$('a', nav).forEach(link => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && nav.classList.contains('is-open')) setOpen(false);
    });
  }

  /* Barra sticky: aparece después del hero y reserva espacio al pie
     para no tapar el footer ni el formulario. */
  function initStickyCta() {
    const bar = $('#sticky-cta');
    const hero = $('#hero');
    if (!bar || !hero) return;

    let isVisible = null;

    const update = () => {
      const show = window.scrollY > hero.offsetHeight * 0.6;
      if (show === isVisible) return;
      isVisible = show;
      bar.classList.toggle('is-visible', show);
      document.documentElement.style.setProperty('--stickybar-h', show ? bar.offsetHeight + 'px' : '0px');
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  }

  let revealObserver = null;

  function observeReveals(scope) {
    const items = $$('.reveal:not(.is-visible)', scope || document);
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('is-visible'));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    }
    items.forEach(el => revealObserver.observe(el));
  }

  /* Red de seguridad: si el observer nunca reporta (entornos sin composición,
     bloqueos de terceros), el contenido se muestra igual. Una landing con
     tráfico de pago nunca debe quedarse en blanco por un efecto visual. */
  function ensureContentVisible() {
    window.setTimeout(() => {
      if (document.querySelector('.reveal.is-visible')) return;
      $$('.reveal').forEach(el => el.classList.add('is-visible'));
    }, 1200);
  }

  /* CTAs de intención (Comprar / Alquilar / Vender / Invertir) */
  function initIntentActions() {
    $$('[data-intent-filter]').forEach(el => {
      el.addEventListener('click', (ev) => {
        ev.preventDefault();
        const key   = el.getAttribute('data-intent-filter');
        const value = el.getAttribute('data-intent-value');
        trackEvent('IntentClick', { intent: el.getAttribute('data-intent') || key });
        applyFilter(key, value, value);
      });
    });
  }

  /* ========================================================================
     ARRANQUE
     ======================================================================== */
  function init() {
    trackEvent('PageView', {
      page_path: '/peru',
      page_market: 'Peru',
      inventory_count: PROPERTIES.length
    });

    initHeader();
    initMobileNav();
    initGenericWhatsAppLinks();
    initSocial();

    renderFeatured();
    renderZones();
    initSearch();
    renderGrid();
    initIntentActions();
    initModal();

    initStickyCta();
    observeReveals(document);
    ensureContentVisible();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
