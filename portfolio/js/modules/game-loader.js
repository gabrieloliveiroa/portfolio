const section = document.getElementById('snake-section');
let loaded = false;

function loadGame() {
  if (loaded) return;
  loaded = true;
  import('./game.js').catch(error => {
    loaded = false;
    console.error('Unable to load the challenge module.', error);
  });
}

if (section) {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      loadGame();
      observer.disconnect();
    }, { rootMargin: '500px 0px' });
    observer.observe(section);
  } else {
    loadGame();
  }
}
