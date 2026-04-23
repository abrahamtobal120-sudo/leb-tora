// ================================================
// Leb Torá — Header & Footer compartidos
// ================================================

// Detectar qué página estamos
const pagePath = window.location.pathname.replace(/\/$/, '') || '/';
const isActive = (href) => {
  if (href === '/' || href === '/index.html') {
    return pagePath === '' || pagePath === '/' || pagePath.endsWith('/index.html');
  }
  return pagePath.includes(href.replace(/^\//, '').replace(/\.html$/, ''));
};

const navItems = [
  { href: 'index.html', label: 'Inicio' },
  { href: 'paraguas.html', label: 'Paraguas' },
  { href: 'utiles.html', label: 'Útiles' },
  { href: 'medicinas.html', label: 'Medicinas' },
  { href: 'quienes-somos.html', label: 'Quiénes somos' },
  { href: 'contacto.html', label: 'Contacto' }
];

// ================================================
// HEADER
// ================================================

const headerEl = document.getElementById('site-header');
if (headerEl) {
  headerEl.innerHTML = `
    <div class="header-inner">
      <a href="index.html" class="brand" aria-label="Leb Torá - Inicio">
        <img src="images/logo-leb-tora.png" alt="Leb Torá" class="brand-logo">
      </a>

      <nav class="nav" id="main-nav">
        ${navItems.map(item => `
          <a href="${item.href}" class="${isActive(item.href) ? 'active' : ''}">${item.label}</a>
        `).join('')}
      </nav>

      <div class="header-cta">
        <a href="apoyar.html" class="btn-primary">Donar</a>
        <button class="menu-toggle" id="menu-toggle" aria-label="Abrir menú">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M3 6h18M3 12h18M3 18h18"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  // Toggle mobile menu
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  toggle?.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  // Cerrar menú al hacer click en un link
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => nav.classList.remove('open'));
  });
}

// ================================================
// FOOTER
// ================================================

const footerEl = document.getElementById('site-footer');
if (footerEl) {
  const year = new Date().getFullYear();
  footerEl.innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <img src="images/logo-leb-tora.png" alt="Leb Torá" class="footer-logo">
        <div class="footer-tagline">Un gmaj que acompaña el estudio</div>
      </div>

      <div class="footer-col">
        <h4>Servicios</h4>
        <ul>
          <li><a href="paraguas.html">Paraguas comunitarios</a></li>
          <li><a href="utiles.html">Útiles escolares</a></li>
          <li><a href="medicinas.html">Medicinas</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Organización</h4>
        <ul>
          <li><a href="quienes-somos.html">Quiénes somos</a></li>
          <li><a href="apoyar.html">Sostén este gmaj</a></li>
          <li><a href="contacto.html">Contacto</a></li>
          <li><a href="mailto:gmajbetdavid@gmail.com">gmajbetdavid@gmail.com</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <div>© ${year} Leb Torá · Polanco, Ciudad de México</div>
      <div>Hecho con ❤️ para la comunidad</div>
    </div>
  `;
}
