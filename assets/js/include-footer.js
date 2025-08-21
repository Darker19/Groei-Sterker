// /assets/js/include-footer.js
document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('site-footer');
  if (!mount) return;

  const version = 'v=1'; // beter geschreven querystring

  // Detecteer base path ("/repo" bij project pages, "" bij user pages)
  const parts = location.pathname.split('/').filter(Boolean);
  const repoBase = (location.hostname.endsWith('.github.io') && parts.length > 0)
    ? `/${parts[0]}`   // bijv. "/mijnrepo"
    : '';

  const url = `${repoBase}/partials/footer.html?${version}`;

  fetch(url, { cache: 'no-cache' })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    })
    .then(html => {
      mount.innerHTML = html;
      document.dispatchEvent(new Event('footer:loaded'));
    })
    .catch(err => {
      console.error('Footer laden mislukt:', err);
      mount.innerHTML = '<p style="text-align:center;opacity:.7">Footer kon niet geladen worden.</p>';
    });
});
