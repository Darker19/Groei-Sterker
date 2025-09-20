// ========== Custom JS (starter) ==========
// Alles in één entry file; initialisaties per component.
// Gebruik data-attributes voor gedrag, niet inline JS.

(() => {
  'use strict';

  const openNav = (address = '') => {
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    const encodedAddress = encodeURIComponent(address);
    const gmapsWeb = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    const geoUrl = `geo:0,0?q=${encodedAddress}`;

    if (!isMobile) {
      // Desktop: altijd naar Google Maps in de browser
      window.location.href = gmapsWeb;
      return;
    }

    // Mobiel: eerst geo: proberen (Android → keuze, iOS → Apple Maps)
    let fallbackTimer;
    const cancelFallback = () => { if (fallbackTimer) clearTimeout(fallbackTimer); };
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') cancelFallback();
    }, { once: true });
    window.addEventListener('pagehide', cancelFallback, { once: true });

    fallbackTimer = setTimeout(() => {
      window.location.href = gmapsWeb;
    }, 1500);

    window.location.href = geoUrl;
  };

  const onReady = () => {
    // Toggle-component
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

    // Smooth scroll
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

    // Sticky header
    const headers = document.querySelectorAll('header, .navbar');
    if (headers.length) {
      const onScroll = () => {
        const scrolled = window.scrollY > 10;
        headers.forEach(h => h.classList.toggle('is-scrolled', scrolled));
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    (() => {
      'use strict';

      const openNav = (address = '') => {
        const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
        const encodedAddress = encodeURIComponent(address);
        const gmapsWeb = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
        const geoUrl = `geo:0,0?q=${encodedAddress}`;

        if (!isMobile) {
          // Desktop → open Google Maps in nieuwe tab
          window.open(gmapsWeb, '_blank');
          return;
        }

        // Mobiel → probeer eerst geo: (Android = keuzemenu, iOS = Apple Maps)
        let fallbackTimer;
        const cancelFallback = () => { if (fallbackTimer) clearTimeout(fallbackTimer); };
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden') cancelFallback();
        }, { once: true });
        window.addEventListener('pagehide', cancelFallback, { once: true });

        fallbackTimer = setTimeout(() => {
          window.open(gmapsWeb, '_blank');
        }, 1500);

        window.location.href = geoUrl; // geo: opent niet in nieuwe tab, alleen in apps
      };

      const onReady = () => {
        document.addEventListener('click', (e) => {
          const btn = e.target.closest('[data-nav]');
          if (!btn) return;
          const address = btn.getAttribute('data-address');
          if (address) {
            openNav(address);
          }
        });
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onReady);
      } else {
        onReady();
      }
    })();
    // Navigatie naar kaart-app
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
