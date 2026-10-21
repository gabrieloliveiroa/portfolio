const output = document.querySelector('.terminal-output');
const terminal = document.querySelector('.hero-terminal');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let typingTimer = 0;

function getLines() {
  return ["init gabriel's portfolio"];
}

function renderTerminal(animate = true) {
  if (!output || !terminal) return;
  window.clearTimeout(typingTimer);
  const lines = getLines();
  const value = lines[0];
  terminal.setAttribute('aria-label', value);
  if (!animate || reducedMotion.matches || document.documentElement.dataset.effects === 'off' || !window.matchMedia('(pointer: fine)').matches) {
    output.textContent = value;
    return;
  }
  output.textContent = '';
  let index = 0;
  const type = () => {
    output.textContent = value.slice(0, index++);
    if (index <= value.length) typingTimer = window.setTimeout(type, 38);
  };
  type();
}

renderTerminal(true);
window.addEventListener('portfolio:languagechange', () => renderTerminal(false));

export { renderTerminal };
