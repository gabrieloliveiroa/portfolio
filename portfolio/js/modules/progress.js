const bar = document.getElementById('scroll-progress');
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

if (bar && gsap && ScrollTrigger) {
  gsap.to(bar, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'max', scrub: true }
  });
}
