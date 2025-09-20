// ========== Custom JS (starter) ==========
// Alles in één entry file; initialisaties per component.
// Gebruik data-attributes voor gedrag, niet inline JS.

(() => {
  'use strict';

  // --- Navigatie openen (PC -> short URL nieuw tab; Mobiel -> geo: + fallback (zelfde tab)) ---
  const openNav = ({ shortUrl, address = '' }) => {
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    // Voor geo: gebruiken we de adresstring (Android keuzemenu / iOS Apple Maps)
    const encodedAddress = encodeURIComponent(address);
    const geoUrl = encodedAddress ? `geo:0,0?q=${encodedAddress}` : null;

    if (!isMobile) {
      // Desktop/laptop → altijd short URL in nieuw tabblad (direct in click-handler = niet geblokkeerd)
      window.open(shortUrl, '_blank');
      return;
    }

    // Mobiel → probeer eerst geo:, anders fallback naar short URL (zelfde tab)
    let fallbackTimer;
    const cancelFallback = () => { if (fallbackTimer) clearTimeout(fallbackTimer); };

    // Als de pagina "verdwijnt" (app geopend), cancel de fallback
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') cancelFallback();
    }, { once: true });
    window.addEventListener('pagehide', cancelFallback, { once: true });

    // Fallback na 5s — gebruik location.href i.p.v. window.open om popup blockers te vermijden
    fallbackTimer = setTimeout(() => {
      window.location.href = shortUrl;
    }, 5000);

    // Start poging om een app te openen via geo: (als er een adres is)
    if (geoUrl) {
      window.location.href = geoUrl; // opent app (geen nieuw tabblad)
    } else {
      // Geen adres mee? Ga direct naar short URL (zelfde tab op mobiel)
      window.location.href = shortUrl;
    }
  };

  const onReady = () => {
    // --- Toggle-component: [data-toggle] + aria-controls="targetId" ---
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-toggle]');
      if (!btn) return;
      const id = btn.getAttribute('aria-controls');
      const el = document.getElementById(id);
      if (!el) return;
      const willOpen = el.hasAttribute('hidden');
      el.toggleAttribute('hidden', !willOpen);
      btn.setAttribute('aria-expanded', String(willOpen));
    });

    // --- Smooth scroll voor interne links ---
    const supportsSmooth = 'scrollBehavior' in document.documentElement.style;
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView(supportsSmooth ? { behavior: 'smooth', block: 'start' } : undefined);
      });
    });

    // --- Sticky header (.is-scrolled) ---
    const headers = document.querySelectorAll('header, .navbar');
    if (headers.length) {
      const onScroll = () => {
        const scrolled = window.scrollY > 10;
        headers.forEach(h => h.classList.toggle('is-scrolled', scrolled));
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // --- Navigation button: <button data-nav data-url="..." data-address="..."> ---
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-nav]');
      if (!btn) return;
      const shortUrl = btn.getAttribute('data-url');          // bv. https://maps.app.goo.gl/iQJnAUbncyWkuH3T9
      const address = btn.getAttribute('data-address') || ''; // bv. Diamantlaan 1, 2132 WV Hoofddorp
      if (shortUrl) {
        openNav({ shortUrl, address });
      }
    });
  };

  // Run after DOM is ready (works whether or not you used `defer`)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
// ========== End of custom JS ==========
