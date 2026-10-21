import { scramble } from './scramble.js';
import { getRobotController } from './robot.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hero = document.getElementById('hero');
const gsap = window.gsap;

function startHeroMotion() {
  if (!hero || !gsap) return;
  const terminal = hero.querySelector('.hero-terminal');
  const title = hero.querySelector('.hn');
  const description = hero.querySelector('.hdesc');
  const ctas = hero.querySelector('.hctas');
  const portrait = hero.querySelector('.hero-portrait');
  const robot = getRobotController();
  const elements = [terminal, title, description, ctas, portrait].filter(Boolean);
  elements.forEach(element => { element.style.animation = 'none'; });

  if (reducedMotion || document.documentElement.dataset.effects === 'off') {
    gsap.set(elements, { clearProps: 'all', opacity: 1, y: 0 });
    robot?.showAll();
  } else {
    gsap.set(elements, { opacity: 0, y: 18 });
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .to(terminal, { opacity: 1, y: 0, duration: 0.45 })
      .to(title, { opacity: 1, y: 0, duration: 0.65 }, '-=0.18')
      .to(description, { opacity: 1, y: 0, duration: 0.5 }, '-=0.25')
      .to(ctas, { opacity: 1, y: 0, duration: 0.45 }, '-=0.2')
      .to(portrait, { opacity: 1, y: 0, duration: 0.55, onStart: () => robot?.startMount() }, '-=0.3');
  }

  if (document.documentElement.dataset.effects === 'off') return;
  const animatedHeroNodes = hero.querySelectorAll('.hmesh-blob, .robot-orbiter, .star');
  const visibilityObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      animatedHeroNodes.forEach(node => {
        node.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      });
    });
  }, { threshold: 0.01 });
  visibilityObserver.observe(hero);

  document.querySelectorAll('.nav-links a').forEach(link => {
    const finalText = link.textContent;
    link.addEventListener('mouseenter', () => scramble(link, finalText, { duration: 260 }));
  });
}

if (window.__portfolioBootComplete) startHeroMotion();
else window.addEventListener('portfolio:boot-complete', startHeroMotion, { once: true });
