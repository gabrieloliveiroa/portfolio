const card = document.querySelector('[data-neofetch]');
if (card) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lines = card.querySelectorAll('.neofetch-info > div');
  const reveal = () => {
    if (reducedMotion || document.documentElement.dataset.effects === 'off') {
      card.classList.add('is-visible');
      return;
    }
    card.classList.add('is-visible');
    lines.forEach((line, index) => {
      line.style.setProperty('--neofetch-delay', `${index * 55}ms`);
    });
  };
  window.addEventListener('portfolio:neofetch', () => {
    card.classList.remove('is-visible');
    window.requestAnimationFrame(reveal);
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        reveal();
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(card);
  } else reveal();
}
