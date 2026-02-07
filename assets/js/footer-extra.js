// /assets/js/footer-extra.js
(function footerExtras() {
  "use strict";

  // ============================
  // Config
  // ============================
  const OPENING_TABLE_IDS = ["openingstijden", "openingstijdencontact"];
  const DAGEN = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];
  const iconUrl = new URL("assets/images/Vlinder_flap_recolored.gif", document.baseURI).href;

  const SCROLL_ITEMS = [
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

  // ============================
  // Helpers
  // ============================
  function norm(s) {
    return (s || "")
      .replace(/\u00A0/g, " ")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function isInThead(row) {
    return !!(row && row.parentElement && row.parentElement.tagName === "THEAD");
  }

  function raf(fn) {
    requestAnimationFrame(() => requestAnimationFrame(fn));
  }

  // ============================
  // 1) Openingstijden highlight
  // ============================
  function highlightOpeningTimes() {
    const VANDAAG = DAGEN[new Date().getDay()];
    const DAYS_NORM = DAGEN.map(norm);

    OPENING_TABLE_IDS.forEach((id) => {
      const t = document.getElementById(id);
      if (!t || !t.rows) return;

      const rows = (t.tBodies && t.tBodies.length ? t.tBodies[0].rows : t.rows);
      if (!rows || !rows.length) return;

      // reset oude highlight / icon
      for (const r of rows) {
        if (isInThead(r) || (r.closest && r.closest("thead"))) continue;
        r.classList?.remove("highlight");
        r.querySelector?.(".day-icon")?.remove();
      }

      for (const r of rows) {
        if (isInThead(r) || (r.closest && r.closest("thead"))) continue;

        // zoek dagcel in eerste 3 kolommen
        let dayCol = -1, cellTxt = "";
        const maxCols = Math.min(r.cells?.length || 0, 3);

        for (let c = 0; c < maxCols; c++) {
          const txt = norm(r.cells[c].innerText).replace(/:$/, "");
          if (DAYS_NORM.includes(txt)) {
            dayCol = c;
            cellTxt = txt;
            break;
          }
        }
        if (dayCol === -1) continue;

        if (cellTxt === norm(VANDAAG)) {
          r.classList.add("highlight");

          // icoon in eerste kolom (maak cel als nodig)
          const iconCell = r.cells[0] || r.insertCell(0);
          if (!iconCell.querySelector(".day-icon")) {
            const img = document.createElement("img");
            img.src = iconUrl;
            img.alt = "Vandaag";
            img.className = "day-icon";
            img.loading = "lazy";
            img.style.height = "1.25em";
            img.style.width = "auto";
            iconCell.prepend(img);
          }
          break;
        }
      }
    });
  }

  // ============================
  // 2) Horizontal text scroll (naadloos)
  // Vereist HTML:
  // <div class="infinite-scroll">
  //   <div class="text-scroll"></div>
  //   <div class="text-scroll clone" aria-hidden="true"></div>
  // </div>
  //
  // CSS keyframes moeten eindigen op:
  // transform: translateX(calc(-1 * var(--loop-width, 0px)));
  // ============================
  function initTextScrolls() {
    const originals = document.querySelectorAll(".text-scroll:not(.clone)");
    if (!originals.length) return;

    const iconSrc = new URL("assets/images/Vlinder.png", document.baseURI).href;

    originals.forEach((orig) => {
      const rail = orig.closest(".infinite-scroll");
      const clone = rail ? rail.querySelector(".text-scroll.clone") : null;

      // reset
      orig.innerHTML = "";
      if (clone) clone.innerHTML = "";

      // bouw 1 set (icoon alleen TUSSEN items)
      SCROLL_ITEMS.forEach((text, i) => {
        const textItem = document.createElement("span");
        textItem.className = "text-item";
        textItem.textContent = text;
        orig.appendChild(textItem);

        if (i < SCROLL_ITEMS.length - 1) {
          const icon = document.createElement("img");
          icon.src = iconSrc;
          icon.alt = "";
          icon.className = "scroll-icon";
          icon.loading = "lazy";
          orig.appendChild(icon);
        }
      });

      // clone exact dezelfde inhoud
      if (clone) clone.innerHTML = orig.innerHTML;

      // breedte meten + zetten op rail als CSS var
      if (rail) {
        const measure = () => {
          const w = orig.getBoundingClientRect().width;
          rail.style.setProperty("--loop-width", `${w}px`);
        };

        // wacht tot images geladen zijn (kan invloed hebben op breedte)
        const imgs = orig.querySelectorAll("img.scroll-icon");
        let pending = imgs.length;

        if (!pending) {
          raf(measure);
        } else {
          const done = () => {
            pending--;
            if (pending <= 0) raf(measure);
          };
          imgs.forEach((img) => {
            if (img.complete) done();
            else {
              img.addEventListener("load", done, { once: true });
              img.addEventListener("error", done, { once: true });
            }
          });
        }

        // herberekenen bij resize (fonts/layout changes)
        const onResize = () => raf(measure);
        window.addEventListener("resize", onResize);
      }
    });
  }

  // ============================
  // Run on footer:loaded + fallback
  // ============================
  function runAll() {
    try { highlightOpeningTimes(); } catch (e) { console.warn("[openingstijden] failed:", e); }
    try { initTextScrolls(); } catch (e) { console.warn("[text-scroll] failed:", e); }
  }

  document.addEventListener("footer:loaded", runAll, { once: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runAll, { once: true });
  } else {
    runAll();
  }
})();
