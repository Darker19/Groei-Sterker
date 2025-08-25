// /assets/js/footer-extra.js
document.addEventListener('footer:loaded', () => {
  const tabelIds = ['openingstijden', 'openingstijdencontact'];
  const DAGEN = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];
  const VANDAAG = DAGEN[new Date().getDay()];
  const DAYS_NORM = DAGEN.map(norm);

  tabelIds.forEach(id => {
    const t = document.getElementById(id);
    if (!t || !t.rows) return;

    const rows = t.tBodies && t.tBodies.length ? t.tBodies[0].rows : t.rows;

    // reset oude highlight / icon
    for (const r of rows) {
      if (r.closest && r.closest('thead')) continue; // echte kop overslaan
      r.classList?.remove('highlight');
      r.querySelector?.('.day-icon')?.remove();
    }

    // loop ALLE body-rijen (niet meer i=1)
    for (const r of rows) {
      if (r.closest && r.closest('thead')) continue; // echte kop overslaan

      // zoek dagcel in de eerste 3 kolommen (0=th icoon, 1=dag, 2=tijd)
      let dayCol = -1, cellTxt = '';
      const maxCols = Math.min(r.cells?.length || 0, 3);
      for (let c = 0; c < maxCols; c++) {
        const txt = norm(r.cells[c].innerText).replace(/:$/, ''); // "Maandag:" → "maandag"
        if (DAYS_NORM.includes(txt)) { dayCol = c; cellTxt = txt; break; }
      }
      if (dayCol === -1) continue;

      if (cellTxt === norm(VANDAAG)) {
        r.classList.add('highlight');

        // icoon in eerste kolom (maak cel als nodig)
        const iconCell = r.cells[0] || r.insertCell(0);
        if (!iconCell.querySelector('.day-icon')) {
          const img = document.createElement('img');
          img.src = 'assets/images/Vlinder_flap_recolored.gif'; // relatieve path
          img.alt = 'Vandaag';
          img.className = 'day-icon';
          img.loading = 'lazy';
          iconCell.prepend(img);
        }
        break; // één match is genoeg
      }
    }
  });

  function norm(s) {
    return (s || '')
      .replace(/\u00A0/g, ' ')          // NBSP → spatie
      .normalize('NFKD')                // diacritics afvlakken
      .replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }
});
