const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch = window.matchMedia('(pointer: coarse)').matches;
const canUseLenis = typeof window.Lenis === 'function' && !reducedMotion && !touch;
let lenis = null;

if (window.gsap && window.ScrollTrigger) {
  window.gsap.registerPlugin(window.ScrollTrigger);
}

if (canUseLenis) {
  lenis = new window.Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false });
  if (window.ScrollTrigger) lenis.on('scroll', window.ScrollTrigger.update);
  if (window.gsap) {
    window.gsap.ticker.add(time => lenis.raf(time * 1000));
    window.gsap.ticker.lagSmoothing(0);
  }
}

function scrollToTarget(target) {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return;
  if (lenis) lenis.scrollTo(element, { offset: -90 });
  else element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    scrollToTarget(target);
  });
});

window.addEventListener('portfolio:overlay', event => {
  if (!lenis) return;
  if (event.detail?.open) lenis.stop();
  else lenis.start();
});

window.portfolioScrollTo = scrollToTarget;
export { scrollToTarget, lenis };
