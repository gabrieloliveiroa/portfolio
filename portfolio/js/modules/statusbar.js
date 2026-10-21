import { tr } from '../i18n.js';

const bar = document.getElementById('statusbar');
if (bar) {
  const paths = { hero: '~/home', sobre: '~/about', experiencia: '~/experience', habilidades: '~/skills', projetos: '~/projects', contato: '~/contact', 'snake-section': '~/game' };
  bar.innerHTML = '<span data-status-site>gabriel@portfolio</span><span class="status-separator">:</span><span data-status-section>~/home</span><span class="status-progress" data-status-progress>0%</span><span class="status-clock" data-status-clock></span><span class="status-language" data-status-language></span>';
  const sectionEl = bar.querySelector('[data-status-section]');
  const progressEl = bar.querySelector('[data-status-progress]');
  const clockEl = bar.querySelector('[data-status-clock]');
  const languageEl = bar.querySelector('[data-status-language]');
  let frame = 0;
  function updateProgress() {
    frame = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressEl.textContent = `${max > 0 ? Math.round((window.scrollY / max) * 100) : 0}%`;
  }
  function updateClock() {
    clockEl.textContent = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
  }
  function updateLanguage() {
    languageEl.textContent = `${document.documentElement.lang === 'en' ? 'EN' : 'PT'} · Ctrl+K`;
  }
  window.addEventListener('scroll', () => { if (!frame) frame = window.requestAnimationFrame(updateProgress); }, { passive: true });
  window.addEventListener('portfolio:sectionchange', event => { sectionEl.textContent = paths[event.detail?.id] || '~/home'; });
  window.addEventListener('portfolio:languagechange', updateLanguage);
  document.addEventListener('focusin', event => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      document.body.classList.add('statusbar-input-focused');
    }
  });
  document.addEventListener('focusout', event => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      document.body.classList.remove('statusbar-input-focused');
    }
  });
  updateProgress();
  updateClock();
  updateLanguage();
  window.setInterval(updateClock, 1000);
}
