export const spriteHalf = [
  ".......C", ".......M", ".......M", "...LLLLL", "..LLLLLL",
  "..LDDDDD", ".ALDDEED", ".ALDDEED", ".ALDDEED", "..LDDDDD",
  "..SSSSSS", "......MM", "...LLLLL", ".AALLLLL", ".AALLLCC",
  ".AALLLLL", "...SSSSS", "....LL..", "...LLL..",
];

export function mirrorSprite(half = spriteHalf) {
  return half.map(row => row + [...row].reverse().join(''));
}

const paletteTokens = {
  C: '--robot-antenna', E: '--robot-eye', L: '--robot-body',
  S: '--robot-shade', M: '--robot-metal', A: '--robot-accent', D: '--robot-visor',
};

export function readRobotPalette(root = document.documentElement) {
  const styles = getComputedStyle(root);
  return Object.fromEntries(Object.entries(paletteTokens).map(([key, token]) => [
    key, styles.getPropertyValue(token).trim(),
  ]));
}

export const sprite = mirrorSprite();
const pixelCount = sprite.reduce((count, row) => count + [...row].filter(symbol => symbol !== '.').length, 0);

export function drawRobot(ctx, opts = {}) {
  const { canvas } = ctx;
  if (!canvas) return;
  const palette = opts.palette || readRobotPalette();
  const visiblePixels = opts.visiblePixels;
  const eyesOffset = opts.eyesOffset || { x: 0, y: 0 };
  const pixelSize = Math.max(1, Math.floor(Math.min(canvas.width / 16, canvas.height / 19)));
  const offsetX = Math.floor((canvas.width - pixelSize * 16) / 2);
  const offsetY = Math.floor((canvas.height - pixelSize * 19) / 2);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;

  for (let pass = 0; pass < 2; pass += 1) {
    for (let y = 0; y < sprite.length; y += 1) {
      for (let x = 0; x < sprite[y].length; x += 1) {
      const original = sprite[y][x];
      if (original === '.') continue;
      const index = y * 16 + x;
      if (visiblePixels && !visiblePixels[index]) continue;
      const isEye = original === 'E';
      if ((pass === 0 && isEye) || (pass === 1 && !isEye)) continue;
      const isBlinkingEye = opts.eyesBlinking && isEye && (y === 6 || y === 7);
      let symbol = original;
      if (y === 0 && original === 'C' && opts.antennaLit === false) symbol = 'M';
      const drawX = x + (isEye ? eyesOffset.x : 0);
      const drawY = y + (isEye ? eyesOffset.y : 0);
      ctx.fillStyle = isEye && (!opts.visorOn || isBlinkingEye) ? palette.D : palette[symbol];
      ctx.fillRect(offsetX + drawX * pixelSize, offsetY + drawY * pixelSize, pixelSize, pixelSize);
      }
    }
  }
}

function shuffledPixels() {
  const order = new Uint16Array(pixelCount);
  let index = 0;
  for (let y = 0; y < sprite.length; y += 1) {
    for (let x = 0; x < sprite[y].length; x += 1) {
      if (sprite[y][x] !== '.') order[index++] = y * 16 + x;
    }
  }
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const value = order[i]; order[i] = order[j]; order[j] = value;
  }
  return order;
}

function createRobotController(canvas) {
  const ctx = canvas.getContext('2d');
  const portrait = canvas.closest('.portrait');
  const palette = readRobotPalette();
  const mask = new Uint8Array(16 * 19);
  const order = shuffledPixels();
  const state = {
    active: true, mounted: false, mountStart: 0, mountDuration: 1200,
    revealed: 0,
    eyesX: 0, eyesY: 0, targetEyesX: 0, targetEyesY: 0,
    visorOn: true,
    antennaLit: true, blinking: false, lastBlink: 0, nextBlink: 3200,
    lastAntenna: 0, scan: 0, bob: 0, flash: 0, dirty: true, lastTime: 0,
  };
  const finePointer = window.matchMedia('(pointer: fine)');
  const motionOff = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
    || document.documentElement.dataset.effects === 'off';

  function render() {
    drawRobot(ctx, {
      palette, visiblePixels: mask, eyesOffset: { x: state.eyesX, y: state.eyesY },
      antennaLit: state.antennaLit, eyesBlinking: state.blinking, visorOn: state.visorOn,
    });
    state.dirty = false;
  }

  function showAll() {
    mask.fill(1);
    state.mounted = true;
    state.dirty = true;
    render();
  }

  function startMount() {
    if (motionOff()) { showAll(); return; }
    state.mountStart = performance.now();
    state.mountDuration = finePointer.matches ? 1200 : 720;
    state.mounted = false;
    state.revealed = 0;
    state.lastBlink = state.mountStart;
    state.lastAntenna = state.mountStart;
    mask.fill(0);
    state.dirty = true;
  }

  function startScan() {
    state.scan = performance.now();
    const scan = document.createElement('span');
    scan.className = 'robot-scan';
    portrait.append(scan);
    window.setTimeout(() => scan.remove(), 620);
  }

  function tick() {
    const time = performance.now();
    if (!state.active || document.hidden) return;
    state.lastTime = time;
    if (motionOff()) {
      if (!state.mounted) showAll();
      return;
    }
    if (!state.mounted) {
      const progress = Math.min(1, (time - state.mountStart) / state.mountDuration);
      const count = Math.floor(progress * order.length);
      for (let i = state.revealed; i < count; i += 1) mask[order[i]] = 1;
      state.revealed = count;
      state.dirty = true;
      if (progress === 1) {
        state.mounted = true;
        state.flash = time;
        canvas.classList.add('robot-flash');
        window.setTimeout(() => canvas.classList.remove('robot-flash'), 220);
        startScan();
      }
    } else {
      const previousEyesX = state.eyesX;
      const previousEyesY = state.eyesY;
      state.eyesX += Math.sign(state.targetEyesX - state.eyesX) * Math.min(1, Math.abs(state.targetEyesX - state.eyesX));
      state.eyesY += Math.sign(state.targetEyesY - state.eyesY) * Math.min(1, Math.abs(state.targetEyesY - state.eyesY));
      if (state.eyesX !== previousEyesX || state.eyesY !== previousEyesY) state.dirty = true;
      state.bob = Math.sin(time * 0.0011) * 1.5;
      if (Math.abs(state.bob) > 0.02 || state.eyesX !== 0 || state.eyesY !== 0) {
        canvas.style.transform = `translateY(${state.bob.toFixed(2)}px)`;
      }
      if (time - state.lastBlink > state.nextBlink) {
        state.blinking = true; state.lastBlink = time; state.nextBlink = 2000 + Math.random() * 3000; state.dirty = true;
      } else if (state.blinking && time - state.lastBlink > 120) {
        state.blinking = false; state.dirty = true;
      }
      if (time - state.lastAntenna > 2600) {
        state.antennaLit = !state.antennaLit; state.lastAntenna = time; state.dirty = true;
      }
    }
    if (state.dirty) render();
    if (state.flash && time - state.flash > 180) state.flash = 0;
  }

  function pointerMove(event) {
    if (!finePointer.matches || !state.mounted || motionOff()) return;
    const rect = canvas.getBoundingClientRect();
    state.targetEyesX = Math.max(-2, Math.min(2, Math.round(((event.clientX - rect.left) / rect.width - 0.5) * 4)));
    state.targetEyesY = Math.max(-1, Math.min(1, Math.round(((event.clientY - rect.top) / rect.height - 0.5) * 2)));
    state.dirty = true;
  }
  function pointerLeave() {
    state.targetEyesX = 0;
    state.targetEyesY = 0;
    state.dirty = true;
  }
  function toggleVisor(event) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * 16);
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * 19);
    if (x < 3 || x > 12 || y < 5 || y > 9) return;
    state.visorOn = !state.visorOn;
    state.dirty = true;
  }

  window.addEventListener('pointermove', pointerMove, { passive: true });
  canvas.addEventListener('click', toggleVisor);
  window.addEventListener('blur', pointerLeave);
  document.addEventListener('visibilitychange', () => { state.active = !document.hidden; });
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    state.active = entry.isIntersecting && !document.hidden;
  }, { threshold: 0.01 });
  visibilityObserver.observe(portrait);
  window.gsap?.ticker.add(tick);
  window.addEventListener('resize', () => { state.dirty = true; }, { passive: true });
  return { startMount, showAll, resize: () => { state.dirty = true; } };
}

let controller;
function initRobot() {
  const canvas = document.querySelector('.robot-canvas');
  if (!canvas) return;
  let resizeTimer;
  const renderSize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.max(16, Math.floor(rect.width * dpr));
    canvas.height = Math.max(19, Math.floor(rect.height * dpr));
    controller?.resize();
  };
  controller = createRobotController(canvas);
  window.setTimeout(renderSize, 0);
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(renderSize, 100);
  }, { passive: true });
}

export function getRobotController() { return controller; }
initRobot();
