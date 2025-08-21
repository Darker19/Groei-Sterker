// /assets/js/include-footer.js
document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('site-footer');
  if (!mount) return;

  const version = 'v1';
  const url = `/partials/footer.html?${version}`;

  fetch(url, { cache: 'no-cache' })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    })
    .then(html => {
      mount.innerHTML = html;
      // 🔔 Laat aan de rest weten dat de footer er staat
      document.dispatchEvent(new Event('footer:loaded'));
    })
    .catch(err => {
      console.error('Footer laden mislukt:', err);
      mount.innerHTML = '<p style="text-align:center;opacity:.7">Footer kon niet geladen worden.</p>';
    });
});
// Zorg dat deze script pas draait als de DOM klaar is