// /assets/js/footer-extra.js
document.addEventListener('footer:loaded', () => {
  const tabel = document.getElementById('openingstijden');
  if (!tabel || !tabel.rows || tabel.rows.length <= 1) return;

  const dagen = ["Zondag","Maandag","Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag"];
  const vandaag = new Date().getDay();

  for (let i = 1; i < tabel.rows.length; i++) { // sla header over
    const row = tabel.rows[i];
    const dagCel = row.cells[1];
    if (!dagCel) continue;

    const dagNaam = dagCel.textContent.trim();
    if (dagNaam === dagen[vandaag]) {
      row.classList.add('highlight');

      const iconCel = row.cells[0];
      if (iconCel && !iconCel.querySelector('.day-icon')) {
        const icon = document.createElement('img');
        icon.src = '/assets/images/Vlinder_flap_recolored.gif'; // vanaf root
        icon.alt = 'Vandaag';
        icon.className = 'day-icon';
        icon.loading = 'lazy';
        iconCel.appendChild(icon);
      }
    }
  }
});
// Zorg dat deze script pas draait als de footer geladen is