// /assets/js/footer-extra.js
(function attach() {
  const run = () => {
    // ============================
    // Openingstijden highlight
    // ============================
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

    // ============================
    // Footer ticker (GSAP)
    // Vereist HTML:
    // <div id="gsFooterTicker" class="footer-ticker"><div class="rail"></div></div>
    // ============================
    try {
      if (window.gsap && typeof horizontalLoop === "function") {
        const tickerRoot = document.getElementById("gsFooterTicker");
        if (tickerRoot && !tickerRoot.dataset.ready) {
          const rail = tickerRoot.querySelector(".rail");
          if (rail) {
            const items = [
              "VGZ",
              "VGZ Bewust",
              "UMC",
              "IZZ",
              "Univé",
              "IZA",
              "Zekur",
              "United Consumers",
              "Achmea",
              "Zilveren Kruis",
              "Interpolis",
              "De Christelijke",
              "FBTO",
              "De Friesland",
              "Zilveren Kruis ZieZo",
              "Zorg en Zekerheid",
              "AZVZ",
              "ZEM"
            ];

            // voorkom dubbel vullen (als er nog HTML in staat)
            rail.innerHTML = "";

            // voeg items toe (maak het wat langer voor mooiere flow)
            const loops = 3;
            for (let i = 0; i < loops; i++) {
              for (const text of items) {
                const span = document.createElement("span");
                span.textContent = text; // separator
                rail.appendChild(span);
              }
            }

            const spans = gsap.utils.toArray("#gsFooterTicker .rail span");
            const tl = horizontalLoop(spans, {
              repeat: -1,
              speed: 0.7,      // lager = rustiger
              paddingRight: 40
            });

            // pauze op hover (smooth)
            tickerRoot.addEventListener("mouseenter", () => {
              gsap.to(tl, { timeScale: 0, duration: 0.25, overwrite: true });
            });
            tickerRoot.addEventListener("mouseleave", () => {
              gsap.to(tl, { timeScale: 1, duration: 0.6, overwrite: true });
            });

            tickerRoot.dataset.ready = "1";
          }
        }
      }
    } catch (e) {
      console.warn("[footer-ticker] init failed:", e);
    }
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


// ===============================
// GSAP horizontalLoop helper
// (moet in dit bestand staan)
// ===============================
function horizontalLoop(items, config) {
  items = gsap.utils.toArray(items);
  config = config || {};

  let tl = gsap.timeline({
    repeat: config.repeat,
    paused: config.paused,
    defaults: { ease: "none" },
    onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)
  }),
    length = items.length,
    startX = items[0].offsetLeft,
    widths = [],
    xPercents = [],
    pixelsPerSecond = (config.speed || 1) * 100,
    snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1),
    totalWidth, curX, distanceToStart, distanceToLoop, item, i;

  gsap.set(items, {
    xPercent: (i, el) => {
      let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
      xPercents[i] =
        snap((parseFloat(gsap.getProperty(el, "x", "px")) / w) * 100 +
          gsap.getProperty(el, "xPercent"));
      return xPercents[i];
    }
  });

  gsap.set(items, { x: 0 });

  totalWidth =
    items[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    items[length - 1].offsetWidth *
    gsap.getProperty(items[length - 1], "scaleX") +
    (parseFloat(config.paddingRight) || 0);

  for (i = 0; i < length; i++) {
    item = items[i];
    curX = (xPercents[i] / 100) * widths[i];
    distanceToStart = item.offsetLeft + curX - startX;
    distanceToLoop =
      distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");

    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond
      },
      0
    ).fromTo(
      item,
      { xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100) },
      {
        xPercent: xPercents[i],
        duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
        immediateRender: false
      },
      distanceToLoop / pixelsPerSecond
    );
  }

  tl.progress(1, true).progress(0, true);
  return tl;
}
