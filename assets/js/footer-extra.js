// /assets/js/footer-extra.js
(function attach() {
  const run = () => {
    const tabelIds = ['openingstijden', 'openingstijdencontact'];
    const DAGEN = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];
    const VANDAAG = DAGEN[new Date().getDay()];
    const DAYS_NORM = DAGEN.map(norm);
    const iconUrl = new URL('assets/images/Vlinder_flap_recolored.gif', document.baseURI).href;

    tabelIds.forEach(id => {
      const t = document.getElementById(id);
      if (!t || !t.rows) return;

      const rows = (t.tBodies && t.tBodies.length ? t.tBodies[0].rows : t.rows);

      // reset oude highlight / icon
      for (const r of rows) {
        if (r.closest && r.closest('thead')) continue;
        r.classList?.remove('highlight');
        r.querySelector?.('.day-icon')?.remove();
      }

      // loop body-rijen
      for (const r of rows) {
        if (r.closest && r.closest('thead')) continue;

        // zoek dagcel in de eerste 3 kolommen (0=icoon/th, 1=dag, 2=tijd)
        let dayCol = -1, cellTxt = '';
        const maxCols = Math.min(r.cells?.length || 0, 3);
        for (let c = 0; c < maxCols; c++) {
          const txt = norm(r.cells[c].innerText).replace(/:$/, '');
          if (DAYS_NORM.includes(txt)) { dayCol = c; cellTxt = txt; break; }
        }
        if (dayCol === -1) continue;

        if (cellTxt === norm(VANDAAG)) {
          r.classList.add('highlight');

          // icoon in eerste kolom (maak cel als nodig)
          const iconCell = r.cells[0] || r.insertCell(0);
          if (!iconCell.querySelector('.day-icon')) {
            const img = document.createElement('img');
            img.src = iconUrl;
            img.alt = 'Vandaag';
            img.className = 'day-icon';
            img.loading = 'lazy';
            // inline fallback if CSS not loaded yet
            img.style.height = '1.25em';
            img.style.width = 'auto';
            iconCell.prepend(img);
          }
          break; // één match per tabel is genoeg
        }
      }
    });
  };

  // normaliseren van tekst (accenten weg, spaties opschonen, lower)
  function norm(s) {
    return (s || '')
      .replace(/\u00A0/g, ' ')
      .normalize('NFD')                 // split diacritics
      .replace(/[\u0300-\u036f]/g, '') // strip diacritics (broad support)
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  // luisteren op footer:loaded + fallback
  document.addEventListener('footer:loaded', run, { once: true });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    // DOM al klaar? direct draaien
    run();
  }
})();
