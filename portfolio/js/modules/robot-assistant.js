import { drawRobot, readRobotPalette } from './robot.js';
import { tr } from '../i18n.js';

const bubble = document.querySelector('[data-robot-bubble]');
const bubbleText = document.querySelector('[data-robot-bubble-text]');
const bubbleClose = document.querySelector('[data-robot-bubble-close]');
const hero = document.getElementById('hero');
const sections = new Set();
let currentSection = 'hero';
const dismissedKey = 'portfolio-robot-dismissed';
const companionKey = 'portfolio-robot-companion';
const messages = {
  hero: ['> sistema online.', '> explore o portfólio.'],
  sobre: ['> conheça o perfil.', '> uma visão geral do percurso.'],
  experiencia: ['> trajetória em foco.', '> experiências e aprendizados.'],
  habilidades: ['> stack carregada.', '> tecnologias em destaque.'],
  projetos: ['> projetos encontrados.', '> veja o que foi construído.'],
  contato: ['> canal aberto.', '> vamos conversar.'],
  'snake-section': ['> desafio detectado.', '> tente o desafio.'],
};
let bubbleTimer = 0;
let companion = null;
let companionCtx = null;
let companionVisible = false;
let companionBlinkAt = performance.now() + 2600;
let companionBlinking = false;

function storageGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function storageSet(key, value) {
  try { localStorage.setItem(key, value); } catch {}
}

function sessionGet(key) {
  try { return sessionStorage.getItem(key); } catch { return null; }
}

function sessionSet(key, value) {
  try { sessionStorage.setItem(key, value); } catch {}
}

function currentMessage(id) {
  const values = messages[id] || messages.hero;
  return tr(values[0], values[1]);
}

function showBubble(id = 'hero') {
  if (!bubble || sessionGet(dismissedKey) === '1') return;
  window.clearTimeout(bubbleTimer);
  bubbleText.textContent = currentMessage(id);
  bubble.hidden = false;
  bubble.classList.add('is-visible');
  bubbleTimer = window.setTimeout(hideBubble, 4200);
}

function hideBubble() {
  if (!bubble) return;
  bubble.classList.remove('is-visible');
  window.setTimeout(() => { bubble.hidden = true; }, 180);
}

function dismissBubble() {
  sessionSet(dismissedKey, '1');
  hideBubble();
}

function effectsUnavailable() {
  return matchMedia('(prefers-reduced-motion: reduce)').matches
    || document.documentElement.dataset.effects === 'off';
}

function narrowViewport() {
  return matchMedia('(max-width: 640px)').matches;
}

function blockedByInput() {
  const active = document.activeElement;
  return active instanceof HTMLInputElement
    || active instanceof HTMLTextAreaElement
    || active instanceof HTMLSelectElement
    || Boolean(window.visualViewport && window.visualViewport.height < window.innerHeight * 0.75);
}

function canShowCompanion() {
  return !effectsUnavailable() && !narrowViewport() && !blockedByInput();
}

function createCompanion() {
  companion = document.createElement('button');
  companion.className = 'robot-companion';
  companion.type = 'button';
  companion.setAttribute('aria-label', tr('Robô assistente', 'Assistant robot'));
  companion.innerHTML = '<canvas width="16" height="19" aria-hidden="true"></canvas><span class="robot-tip" hidden></span>';
  document.body.append(companion);
  companionCtx = companion.querySelector('canvas').getContext('2d');
  companion.addEventListener('click', () => {
    companion.classList.remove('is-bounce');
    void companion.offsetWidth;
    companion.classList.add('is-bounce');
    const tip = companion.querySelector('.robot-tip');
    tip.textContent = tr('Dica: use Ctrl+K para abrir os comandos.', 'Tip: use Ctrl+K to open commands.');
    tip.hidden = false;
    window.setTimeout(() => { tip.hidden = true; }, 3000);
  });
}

function renderCompanion() {
  if (!companionCtx) return;
  const blinking = companionBlinking;
  drawRobot(companionCtx, {
    palette: readRobotPalette(),
    antennaLit: !blinking,
    eyesBlinking: blinking,
    visorOn: true,
    visiblePixels: new Uint8Array(16 * 19).fill(1),
  });
}

function setCompanionVisible(visible) {
  if (!companion) createCompanion();
  const shouldShow = visible && canShowCompanion();
  companionVisible = shouldShow;
  companion.classList.toggle('is-visible', shouldShow);
  if (shouldShow) renderCompanion();
}

function updateCompanion() {
  if (!companionVisible) return;
  if (!canShowCompanion()) {
    setCompanionVisible(false);
    return;
  }
  const now = performance.now();
  if (now >= companionBlinkAt) {
    companionBlinking = true;
    companionBlinkAt = now + 140;
    renderCompanion();
    window.setTimeout(() => {
      companionBlinking = false;
      companionBlinkAt = performance.now() + 2400 + Math.random() * 2600;
      renderCompanion();
    }, 140);
  }
}

function toggleCompanion() {
  const next = !companionVisible;
  storageSet(companionKey, next ? '1' : '0');
  setCompanionVisible(next);
  if (next) showBubble('hero');
  else hideBubble();
}

function onSectionChange(event) {
  const id = event.detail?.id;
  if (!id || sections.has(id)) return;
  currentSection = id;
  sections.add(id);
  showBubble(id);
  if (id === 'hero') setCompanionVisible(false);
  else if (storageGet(companionKey) !== '0') setCompanionVisible(true);
}

function updateLanguage() {
  if (bubble && !bubble.hidden) {
    bubbleText.textContent = currentMessage(currentSection);
  }
  companion?.setAttribute('aria-label', tr('Robô assistente', 'Assistant robot'));
}

bubbleClose?.addEventListener('click', dismissBubble);
window.addEventListener('portfolio:sectionchange', onSectionChange);
window.addEventListener('portfolio:languagechange', updateLanguage);
window.addEventListener('portfolio:effectschange', () => {
  if (effectsUnavailable()) setCompanionVisible(false);
});
document.addEventListener('focusin', () => { if (blockedByInput()) setCompanionVisible(false); });
document.addEventListener('focusout', () => {
  if (!blockedByInput() && !hero?.matches(':hover') && storageGet(companionKey) !== '0') setCompanionVisible(true);
});
window.addEventListener('resize', () => { if (!canShowCompanion()) setCompanionVisible(false); });
window.setInterval(updateCompanion, 100);
window.robotAssistant = { toggle: toggleCompanion, showBubble, hideBubble };

sections.add('hero');
if (sessionGet(dismissedKey) !== '1') window.setTimeout(() => showBubble('hero'), 0);
