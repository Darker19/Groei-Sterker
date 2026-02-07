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
    // werkt ook als browser closest() niet heeft
    return !!(row && row.parentElement && row.parentElement.tagName === "THEAD");
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

      // loop body-rijen
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
            // inline fallback als CSS nog niet klaar is
            img.style.height = "1.25em";
            img.style.width = "auto";
            iconCell.prepend(img);
          }
          break; // één match per tabel is genoeg
        }
      }
    });
  }

  // ============================
  // 2) Horizontal text scroll fillers (★)
  // Vereist HTML: <div class="text-scroll"></div>
  // ============================
  function initTextScrolls() {
    const horizontalTextScroll = document.querySelectorAll(".text-scroll");
    if (!horizontalTextScroll.length) return;

    // reset
    horizontalTextScroll.forEach((el) => (el.innerHTML = ""));

    // build
    SCROLL_ITEMS.forEach((text) => {
      horizontalTextScroll.forEach((scrollItem) => {
        const textItem = document.createElement("span");
        textItem.classList.add("text-item");
        textItem.textContent = text;
        scrollItem.appendChild(textItem);

        const star = document.createElement("span");
        star.classList.add("star");
        star.textContent = "★";
        scrollItem.appendChild(star);
      });
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
