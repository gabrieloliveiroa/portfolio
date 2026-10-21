import { scramble } from './scramble.js';

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const effectsOff = root.dataset.effects === 'off';

const prefixes = {
  sobre: '~/about',
  experiencia: '~/experience',
  habilidades: '~/skills',
  projetos: '~/projects',
  contato: '~/contact',
  'snake-section': '~/game'
};
const parallaxSections = ['sobre', 'experiencia', 'habilidades', 'projetos', 'contato'];

function addSectionPrefixes() {
  document.querySelectorAll('section[id] .stit').forEach(title => {
    const section = title.closest('section');
    const prefix = prefixes[section?.id];
    if (!prefix || title.querySelector('.section-prefix')) return;
    const label = document.createElement('span');
    label.className = 'section-prefix';
    label.setAttribute('aria-hidden', 'true');
    label.textContent = prefix;
    title.prepend(label);
    const titleText = document.createElement('span');
    titleText.className = 'section-title-text';
    Array.from(title.childNodes)
      .filter(node => node !== label)
      .forEach(node => titleText.append(node));
    title.append(titleText);
  });
}

addSectionPrefixes();
window.addEventListener('portfolio:languagechange', addSectionPrefixes);

parallaxSections.forEach(id => {
  const section = document.getElementById(id);
  if (!section || section.querySelector('.section-parallax')) return;
  const decoration = document.createElement('span');
  decoration.className = 'section-parallax';
  decoration.setAttribute('aria-hidden', 'true');
  section.append(decoration);
});

if (!gsap || !ScrollTrigger || reducedMotion || effectsOff) {
  root.classList.remove('js-reveal');
} else {
  root.classList.add('js-reveal');
  let mobile = window.matchMedia('(max-width: 768px)').matches;
  const media = gsap.matchMedia();
  media.add('(max-width: 768px)', () => { mobile = true; });
  media.add('(min-width: 769px)', () => { mobile = false; });
  const distance = mobile ? 12 : 24;
  root.style.setProperty('--section-reveal-distance', `${distance}px`);
    const revealTargets = document.querySelectorAll('section:not(#hero):not(#snake-section) .reveal, section:not(#hero):not(#snake-section) .stagger');
  const revealOnce = target => {
    if (target.classList.contains('is-visible')) return;
    target.classList.add('is-visible');
    const children = target.classList.contains('stagger') ? Array.from(target.children) : [target];
    gsap.fromTo(children, { opacity: 0, y: distance }, {
      opacity: 1, y: 0, duration: mobile ? .4 : .55,
      stagger: mobile ? .04 : .08, ease: 'power3.out',
      clearProps: 'willChange', onStart: () => children.forEach(child => { child.style.willChange = 'opacity, transform'; }),
      onComplete: () => children.forEach(child => { child.style.willChange = 'auto'; })
    });
    target.querySelectorAll('.slbl').forEach(element => {
      const text = element.textContent;
      if (!element.dataset.scrambled) {
        element.dataset.scrambled = 'true';
        scramble(element, text, { duration: mobile ? 220 : 360 });
      }
    });
    target.querySelectorAll('.section-title-text').forEach(element => {
      if (element.dataset.scrambled) return;
      element.dataset.scrambled = 'true';
      element.childNodes.forEach(node => {
        if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) return;
        const text = node.textContent;
        const textElement = document.createElement('span');
        textElement.className = 'title-scramble-text';
        node.replaceWith(textElement);
        scramble(textElement, text, { duration: mobile ? 220 : 360 });
      });
    });
  };

  revealTargets.forEach(target => {
    ScrollTrigger.create({ trigger: target, start: 'top 88%', once: true, onEnter: () => revealOnce(target) });
  });

  const experience = document.querySelector('#experiencia .explist');
  if (experience) {
    const track = document.createElement('div');
    track.className = 'timeline-track';
    track.setAttribute('aria-hidden', 'true');
    track.innerHTML = '<span class="timeline-progress"></span>';
    experience.prepend(track);
    gsap.to(track.firstElementChild, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: experience, start: 'top 75%', end: 'bottom 70%', scrub: true }
    });
  }

  document.querySelectorAll('.expitem').forEach(item => {
    ScrollTrigger.create({ trigger: item, start: 'top 82%', once: true, onEnter: () => item.classList.add('is-visible') });
  });

  document.querySelectorAll('.section-parallax').forEach((decor, index) => {
    const section = decor.closest('section');
    gsap.to(decor, {
      y: index % 2 ? -18 : 18, ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  window.addEventListener('portfolio:languagechange', () => window.ScrollTrigger.refresh());
  function setupRepositoryReveals() {
    document.querySelectorAll('#rgrid .rcard:not([data-reveal-bound])').forEach(card => {
      card.dataset.revealBound = 'true';
      card.style.opacity = '0';
      card.style.transform = `translateY(${distance}px)`;
      ScrollTrigger.create({
        trigger: card,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(card, {
            opacity: 1, y: 0, duration: mobile ? .35 : .5,
            ease: 'power3.out',
            onStart: () => { card.style.willChange = 'opacity, transform'; },
            onComplete: () => { card.style.willChange = 'auto'; }
          });
        }
      });
    });
  }
  window.addEventListener('portfolio:repos-rendered', () => {
    setupRepositoryReveals();
    window.ScrollTrigger.refresh();
  });
  setupRepositoryReveals();
}
