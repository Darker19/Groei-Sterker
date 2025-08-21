// ========== Custom JS (starter) ==========
// Alles in één entry file; initialisaties per component.
// Gebruik data-attributes voor gedrag, niet inline JS.

(() => {
  'use strict';

  const onReady = () => {
    // Toggle-component: [data-toggle] + aria-controls="targetId"
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

    // Smooth scroll voor interne links
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

    // Sticky header (.is-scrolled)
    const headers = document.querySelectorAll('header, .navbar');
    if (headers.length) {
      const onScroll = () => {
        const scrolled = window.scrollY > 10;
        headers.forEach(h => h.classList.toggle('is-scrolled', scrolled));
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

   
  };

  // Run after DOM is ready (works whether or not you used `defer`)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
