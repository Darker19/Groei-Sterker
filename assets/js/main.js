// ========== Custom JS (starter) ==========
// Alles in één entry file; initialisaties per component.
// Gebruik data-attributes voor gedrag, niet inline JS.

(() => {
  'use strict';

  // --- Navigatie openen (PC -> short URL in nieuw tabblad; Mobiel -> geo: + fallback) ---
  const openNav = ({ shortUrl, address = '' }) => {
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    // Voor geo: gebruiken we de adresstring (betere matching voor Android/iOS)
    const encodedAddress = encodeURIComponent(address);
    const geoUrl = `geo:0,0?q=${encodedAddress}`;

    if (!isMobile) {
      // Desktop/laptop → altijd short URL in nieuw tabblad
      window.open(shortUrl, '_blank');
      return;
    }

    // Mobiel → probeer eerst geo: (Android keuze, iOS Apple Maps)
    // Fallback naar short URL (nieuw tabblad) als er geen app reageert
    let fallbackTimer;
    const cancelFallback = () => { if (fallbackTimer) clearTimeout(fallbackTimer); };

    // Als de pagina "verdwijnt" (app geopend), cancel fallback
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') cancelFallback();
    }, { once: true });
    window.addEventListener('pagehide', cancelFallback, { once: true });

    fallbackTimer = setTimeout(() => {
      // Let op: window.open in een timeout kan door pop-up blockers geblokkeerd worden.
      // Als dat gebeurt, kun je eventueel switchen naar window.location.href
      window.open(shortUrl, '_blank');
    }, 1500);

    // Start poging om een app te openen
    window.location.href = geoUrl; // geo: opent in app (geen nieuw tabblad)
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
      const shortUrl = btn.getAttribute('data-url');        // bv. https://maps.app.goo.gl/iQJnAUbncyWkuH3T9
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