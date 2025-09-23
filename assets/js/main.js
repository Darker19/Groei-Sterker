// ========== Custom JS (starter) ==========
// Alles in één entry file; initialisaties per component.
// Gebruik data-attributes voor gedrag, niet inline JS.

(() => {
  'use strict';

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

    // --- Navigatie: <a href="geo:...q=Adres" data-fallback="https://..."> ---
    const ua = navigator.userAgent;
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);
    const isFirefox = /Firefox/i.test(ua);

    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-fallback][href^="geo:"]');
      if (!a) return;

      const fallbackUrl = a.getAttribute('data-fallback');
      if (!fallbackUrl) return;

      // --- Firefox: altijd direct fallback (geen geo:)
      if (isFirefox) {
        e.preventDefault();
        if (isMobile) {
          window.location.href = fallbackUrl; // zelfde tab
        } else {
          window.open(fallbackUrl, '_blank', 'noopener'); // desktop nieuw tabblad
        }
        return;
      }

      // --- Andere browsers ---
      if (!isMobile) {
        // Desktop/laptop: direct fallback in nieuw tabblad
        e.preventDefault();
        window.open(fallbackUrl, '_blank', 'noopener');
        return;
      }

      // Mobiel (niet-Firefox): probeer geo:, met fallback na 5s
      let timer;
      const cancel = () => { if (timer) clearTimeout(timer); };
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') cancel();
      }, { once: true });
      window.addEventListener('pagehide', cancel, { once: true });

      timer = setTimeout(() => {
        window.location.href = fallbackUrl;
      }, 5000);
      // Belangrijk: geen preventDefault -> laat de geo: link doorgaan
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
