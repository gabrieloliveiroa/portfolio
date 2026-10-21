const CHARS = '01<>/{}[]#$';

function scramble(element, finalText, options = {}) {
  if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.effects === 'off') {
    if (element) element.textContent = finalText;
    return;
  }
  const duration = options.duration || 420;
  const start = performance.now();
  element.setAttribute('aria-hidden', 'true');
  const tick = now => {
    const progress = Math.min(1, (now - start) / duration);
    const settled = Math.floor(progress * finalText.length);
    element.textContent = finalText.split('').map((char, index) => {
      if (index < settled || char === ' ') return char;
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }).join('');
    if (progress < 1) requestAnimationFrame(tick);
    else {
      element.textContent = finalText;
      element.removeAttribute('aria-hidden');
    }
  };
  requestAnimationFrame(tick);
}

export { scramble };
