const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const weakDevice = Number(navigator.hardwareConcurrency || 0) > 0 && navigator.hardwareConcurrency <= 4 ||
  Number(navigator.deviceMemory || 0) > 0 && navigator.deviceMemory <= 4;
const stored = (() => {
  try { return localStorage.getItem('portfolio-effects'); } catch { return null; }
})();
let enabled = !reducedMotion && (stored === 'on' || (stored !== 'off' && !weakDevice));
const toggle = document.getElementById('effects-toggle');

function applyEffects(next, persist = true) {
  enabled = Boolean(next) && !reducedMotion;
  root.dataset.effects = enabled ? 'on' : 'off';
  if (persist) {
    try { localStorage.setItem('portfolio-effects', enabled ? 'on' : 'off'); } catch {}
  }
  updateToggle();
  window.dispatchEvent(new CustomEvent('portfolio:effectschange', { detail: { enabled } }));
}

applyEffects(enabled, false);
function updateToggle() {
  if (!toggle) return;
  toggle.setAttribute('aria-pressed', String(enabled));
  const english = document.documentElement.lang === 'en';
  toggle.setAttribute('aria-label', enabled
    ? (english ? 'Disable effects' : 'Desativar efeitos')
    : (english ? 'Enable effects' : 'Ativar efeitos'));
}
toggle?.addEventListener('click', () => applyEffects(!enabled));
window.addEventListener('portfolio:languagechange', updateToggle);
updateToggle();
window.portfolioEffects = {
  isOn: () => enabled,
  set: applyEffects,
  toggle: () => applyEffects(!enabled)
};
