import './modules/effects.js';
import './modules/boot.js';
import './i18n.js';
import './github.js';
import './form.js';
import './menu.js';
import './hero.js';
import './modules/terminal.js';
import './modules/scroll.js';
import './modules/palette.js';
import './modules/magnetic.js';
import './modules/hero-motion.js';
import './modules/reveal.js';
import './modules/progress.js';
import './modules/game-loader.js';
import './modules/statusbar.js';
import './modules/neofetch.js';
import './modules/robot.js';
import './modules/robot-assistant.js';

// CURSOR GLOW
const cg=document.getElementById('cg');
let mx=0,my=0,cx=0,cy=0;
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer=window.matchMedia('(pointer: fine)');
if(!reducedMotion.matches&&finePointer.matches&&document.documentElement.dataset.effects !== 'off'){
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
  (function loop(){
    cx+=(mx-cx)*.09;cy+=(my-cy)*.09;
    cg.style.left=cx+'px';cg.style.top=cy+'px';
    requestAnimationFrame(loop);
  })();
}

// REVEAL
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('visible');io.unobserve(e.target)})},{threshold:0.1});
document.querySelectorAll('.reveal,.stagger').forEach(el=>io.observe(el));

// NAV ACTIVE
const navAs=document.querySelectorAll('.nav-links a');
const sio=new IntersectionObserver(es=>{es.forEach(e=>{if(!e.isIntersecting)return;navAs.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));window.dispatchEvent(new CustomEvent('portfolio:sectionchange',{detail:{id:e.target.id}}));})},{threshold:0.35});
document.querySelectorAll('section[id]').forEach(s=>sio.observe(s));
