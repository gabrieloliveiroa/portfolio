const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let seen = false;
try { seen = sessionStorage.getItem('portfolio-boot-seen') === '1'; } catch {}

function complete() {
  if (window.__portfolioBootComplete) return;
  window.__portfolioBootComplete = true;
  document.querySelectorAll('[data-boot-inert]').forEach(element => {
    element.removeAttribute('inert');
    element.removeAttribute('data-boot-inert');
  });
  document.querySelector('[data-boot-overlay]')?.remove();
  window.dispatchEvent(new CustomEvent('portfolio:boot-complete'));
}

if (reducedMotion || root.dataset.effects === 'off' || seen) {
  window.__portfolioBootComplete = true;
  window.setTimeout(() => window.dispatchEvent(new CustomEvent('portfolio:boot-complete')), 0);
} else {
  try { sessionStorage.setItem('portfolio-boot-seen', '1'); } catch {}
  const overlay = document.createElement('div');
  overlay.className = 'boot-overlay';
  overlay.setAttribute('data-boot-overlay', '');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = '<div class="boot-panel"><div class="boot-log"></div><button class="boot-skip" type="button">Skip</button></div>';
  document.body.append(overlay);
  document.querySelectorAll('body > *:not([data-boot-overlay])').forEach(element => {
    element.setAttribute('inert', '');
    element.setAttribute('data-boot-inert', '');
  });
  const log = overlay.querySelector('.boot-log');
  const language = (() => { try { return localStorage.getItem('portfolio-language'); } catch { return null; } })();
  const lines = language === 'en'
    ? ['loading fonts', 'loading design tokens', 'loading modules', 'loading projects', 'Welcome, visitor.']
    : ['carregando fontes', 'carregando tokens', 'carregando módulos', 'carregando projetos', 'Welcome, visitor.'];
  let index = 0;
  let timer = 0;
  const append = () => {
    const line = document.createElement('div');
    line.textContent = `[  OK  ] ${lines[index++]}`;
    log.append(line);
    if (index < lines.length) timer = window.setTimeout(append, 280);
    else timer = window.setTimeout(complete, 360);
  };
  const skip = overlay.querySelector('.boot-skip');
  skip.textContent = language === 'en' ? 'Skip' : 'Pular';
  skip.addEventListener('click', complete);
  overlay.addEventListener('click', event => { if (event.target === overlay) complete(); });
  document.addEventListener('keydown', complete, { once: true });
  append();
  window.setTimeout(complete, 2500);
}
