const enabled = window.matchMedia('(pointer: fine) and (hover: hover)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  document.documentElement.dataset.effects !== 'off';

if (enabled) {
  document.querySelectorAll('.btnp, .btng, .language-toggle, .command-palette-toggle').forEach(element => {
    element.addEventListener('pointermove', event => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.08;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.08;
      element.style.transform = `translate(${x}px, ${y}px)`;
    });
    element.addEventListener('pointerleave', () => {
      element.style.transform = '';
    });
  });
}
