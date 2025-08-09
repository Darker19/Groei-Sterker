// ========== Custom JS (starter) ==========
// Alles in één entry file; initialisaties per component.
// Gebruik data-attributes voor gedrag, niet inline JS.

(function(){
  document.addEventListener('DOMContentLoaded', () => {

    // Toggle-component: [data-toggle] + aria-controls="targetId"
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-toggle]');
      if(!btn) return;
      const id = btn.getAttribute('aria-controls');
      const el = document.getElementById(id);
      if(!el) return;
      const willOpen = el.hasAttribute('hidden');
      el.toggleAttribute('hidden', !willOpen);
      btn.setAttribute('aria-expanded', String(willOpen));
    });

    // Smooth scroll voor interne links
    const supportsSmooth = 'scrollBehavior' in document.documentElement.style;
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        if(!id) return;
        const target = document.getElementById(id);
        if(!target) return;
        e.preventDefault();
        if (supportsSmooth) {
          target.scrollIntoView({behavior: 'smooth', block: 'start'});
        } else {
          target.scrollIntoView();
        }
      });
    });

    // Sticky header voorbeeld (voeg .is-scrolled toe)
    const header = document.querySelector('header, .navbar');
    if(header){
      const onScroll = () => {
        if(window.scrollY > 10) header.classList.add('is-scrolled');
        else header.classList.remove('is-scrolled');
      };
      onScroll();
      window.addEventListener('scroll', onScroll, {passive:true});
    }

  });
})();
