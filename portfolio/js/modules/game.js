import { tr } from '../i18n.js';

const section = document.querySelector('[data-challenge]');
if (!section) throw new Error('Challenge container was not found.');

const windowEl = section.querySelector('[data-challenge-window]');
const log = section.querySelector('[data-challenge-log]');
const form = section.querySelector('[data-challenge-form]');
const input = section.querySelector('[data-challenge-input]');
const progress = section.querySelector('[data-challenge-progress]');
const timerEl = section.querySelector('[data-challenge-timer]');
const shortcuts = section.querySelector('[data-challenge-shortcuts]');
const restartButton = section.querySelector('[data-challenge-restart]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const history = [];
let historyIndex = 0;
let game = null;
let timerId = null;
let startedAt = 0;
let penalty = 0;

try { localStorage.removeItem('portfolio-snake-hi'); } catch {}

const decodeWord = values => values.map(value => String.fromCharCode(value)).join('');
const scenarios = [
  { seed: [78,69,79,78], files: ['notes.txt', 'logs.txt', 'readme.md', 'archive.txt'], order: ['word', 'format', 'number'] },
  { seed: [76,73,78,85,88], files: ['readme.md', 'audit.txt', 'notes.txt', 'brief.txt'], order: ['number', 'word', 'format'] },
  { seed: [80,85,76,83,69], files: ['brief.txt', 'notes.txt', 'trace.txt', 'readme.md'], order: ['format', 'number', 'word'] },
  { seed: [86,69,67,84,79,82], files: ['audit.txt', 'readme.md', 'notes.txt', 'memo.txt'], order: ['word', 'number', 'format'] }
];

function randomNumber() {
  return Math.floor(Math.random() * 90) + 10;
}

function buildFiles(scenario, clueFiles, word, number) {
  const clueText = {
    word: tr(`pista: a palavra-chave é ${word}.`, `clue: the keyword is ${word}.`),
    number: tr(`pista: o sufixo numérico é ${number}.`, `clue: the numeric suffix is ${number}.`),
    format: tr('pista: o código final usa PALAVRA-NN, com hífen entre as partes.', 'clue: the final code uses WORD-NN, with a hyphen between the parts.')
  };
  const files = {};
  scenario.files.forEach(file => {
    const clue = clueFiles[file];
    files[file] = clue
      ? `${tr('arquivo de treinamento', 'training file')}\n${clueText[clue]}`
      : tr('sem dados relevantes. tente outro arquivo.', 'no relevant data. try another file.');
  });
  return files;
}

function createGame() {
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  const word = decodeWord(scenario.seed);
  const number = randomNumber();
  const code = `${word}-${number}`;
  const clueFiles = {};
  scenario.order.forEach((clue, index) => {
    clueFiles[scenario.files[index]] = clue;
  });
  const files = buildFiles(scenario, clueFiles, word, number);
  return { files, code, clueFiles, clues: new Set(), hintIndex: 0, started: false, finished: false, elapsed: 0 };
}

function addLine(text, kind = '') {
  const line = document.createElement('div');
  line.className = `challenge-line${kind ? ` ${kind}` : ''}`;
  line.textContent = text;
  log.append(line);
  log.scrollTop = log.scrollHeight;
}

function updateStatus() {
  progress.textContent = `[${game.clues.size}/3 ${tr('pistas encontradas', 'clues found')}]`;
  timerEl.textContent = formatTime(game.elapsed + penalty);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
}

function startTimer() {
  if (game.started || game.finished) return;
  game.started = true;
  startedAt = Date.now();
  timerId = window.setInterval(() => {
    game.elapsed = Math.floor((Date.now() - startedAt) / 1000);
    updateStatus();
  }, 1000);
}

function stopTimer() {
  if (timerId !== null) window.clearInterval(timerId);
  timerId = null;
}

function feedback(kind) {
  if (reducedMotion.matches) return;
  section.classList.remove('is-feedback', 'is-error', 'is-success');
  void section.offsetWidth;
  section.classList.add('is-feedback', kind === 'error' ? 'is-error' : kind === 'success' ? 'is-success' : '');
  window.setTimeout(() => section.classList.remove('is-feedback', 'is-error'), 280);
}

function markClue(file) {
  const clue = game.clueFiles[file];
  if (clue) game.clues.add(clue);
  updateStatus();
}

function renderShortcuts() {
  shortcuts.replaceChildren();
  const addShortcut = (label, command, ariaLabel) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btng';
    button.textContent = label;
    button.setAttribute('aria-label', ariaLabel);
    button.addEventListener('click', () => execute(command));
    shortcuts.append(button);
  };
  addShortcut('ls', 'ls', tr('Listar arquivos', 'List files'));
  Object.keys(game.files).forEach(file => addShortcut(`cat ${file}`, `cat ${file}`, tr(`Ler ${file}`, `Read ${file}`)));
  addShortcut('hint', 'hint', tr('Pedir dica', 'Ask for a hint'));
  addShortcut('help', 'help', tr('Ver instruções', 'Show instructions'));
}

function help() {
  addLine(tr('Comandos: ls | cat <arquivo> | grep <termo> <arquivo> | submit <código>', 'Commands: ls | cat <file> | grep <term> <file> | submit <code>'));
  addLine(tr('Meta: hint, clear, restart, exit. Encontre 3 pistas e envie o código.', 'Meta: hint, clear, restart, exit. Find 3 clues and submit the code.'));
}

function findFile(value) {
  const normalized = value.toLowerCase().replace(/\.txt$/i, '');
  return Object.keys(game.files).find(file => file.toLowerCase() === normalized || file.toLowerCase().replace(/\.[^.]+$/, '') === normalized);
}

function tokenize(value) {
  const tokens = [];
  const pattern = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let match;
  while ((match = pattern.exec(value))) tokens.push(match[1] ?? match[2] ?? match[3]);
  return tokens;
}

function commandError(message) {
  addLine(`[error] ${message} ${tr('Digite help para ver o formato.', 'Type help to see the format.')}`, 'error');
  feedback('error');
}

function runCommand(raw) {
  const tokens = tokenize(raw.trim());
  if (!tokens.length) return;
  const command = tokens[0].toLowerCase();
  const args = tokens.slice(1);
  if (command !== 'help' && command !== 'clear' && command !== 'restart' && command !== 'exit') startTimer();

  if (command === 'help') return help();
  if (command === 'clear') return log.replaceChildren();
  if (command === 'restart') return resetGame();
  if (command === 'exit') {
    input.blur();
    addLine(tr('Sessão pausada. Pressione Enter no campo para continuar.', 'Session paused. Press Enter in the field to continue.'), 'ok');
    return;
  }
  if (command === 'ls') {
    if (args.length) return commandError(tr('Use ls sem argumentos.', 'Use ls without arguments.'));
    addLine(Object.keys(game.files).join('  '));
    return;
  }
  if (command === 'cat') {
    if (args.length !== 1) return commandError(tr('Formato: cat <arquivo>.', 'Format: cat <file>.'));
    const file = findFile(args[0]);
    if (!file) return commandError(tr('Arquivo não encontrado.', 'File not found.'));
    markClue(file);
    addLine(game.files[file]);
    return;
  }
  if (command === 'grep') {
    if (args.length !== 2) return commandError(tr('Formato: grep <termo> <arquivo>.', 'Format: grep <term> <file>.'));
    const file = findFile(args[1]);
    if (!file) return commandError(tr('Arquivo não encontrado.', 'File not found.'));
    const term = args[0].toLowerCase();
    const matches = game.files[file].split('\n').filter(line => line.toLowerCase().includes(term));
    if (matches.length) markClue(file);
    addLine(matches.length ? matches.join('\n') : tr('(nenhuma correspondência)', '(no matches)'));
    return;
  }
  if (command === 'hint') return useHint();
  if (command === 'submit') {
    if (args.length !== 1) return commandError(tr('Formato: submit <código>.', 'Format: submit <code>.'));
    if (args[0].toUpperCase() !== game.code) {
      addLine(`[error] ${tr('Código incorreto.', 'Incorrect code.')}`, 'error');
      feedback('error');
      return;
    }
    win();
    return;
  }
  commandError(tr('Comando desconhecido.', 'Unknown command.'));
}

function useHint() {
  startTimer();
  const remaining = Object.keys(game.files).filter(file => !game.clues.has(game.clueFiles[file]));
  const file = remaining[0];
  if (!file) {
    addLine(tr('Todas as pistas já foram encontradas.', 'All clues have already been found.'), 'ok');
    return;
  }
  const clue = game.clueFiles[file];
  game.clues.add(clue);
  game.hintIndex += 1;
  penalty += 15;
  updateStatus();
  addLine(`[hint +15s] ${tr(`Procure em ${file}.`, `Look in ${file}.`)}`, 'ok');
}

function win() {
  stopTimer();
  game.finished = true;
  game.elapsed = Math.floor((Date.now() - startedAt) / 1000);
  const total = game.elapsed + penalty;
  let best = null;
  try {
    best = Number(localStorage.getItem('portfolio-challenge-best'));
    if (!best || total < best) localStorage.setItem('portfolio-challenge-best', String(total));
  } catch {}
  updateStatus();
  addLine(`[ACCESS GRANTED] ${tr(`Desafio concluído em ${formatTime(total)} com ${game.hintIndex} dica(s).`, `Challenge completed in ${formatTime(total)} with ${game.hintIndex} hint(s).`)}`, 'ok');
  windowEl.classList.add('is-success');
  feedback('success');
  input.blur();
  window.ScrollTrigger?.refresh();
}

function execute(command) {
  if (game.finished && command.trim().toLowerCase() !== 'restart') return;
  if (command.trim().toLowerCase() !== 'clear') addLine(`guest@training:~$ ${command}`, 'command');
  runCommand(command);
  input.focus({ preventScroll: true });
}

function resetGame() {
  stopTimer();
  game = createGame();
  penalty = 0;
  history.length = 0;
  historyIndex = 0;
  windowEl.classList.remove('is-success');
  log.replaceChildren();
  updateStatus();
  renderShortcuts();
  addLine(tr('Digite help para começar. O sistema é fictício e seguro.', 'Type help to begin. The system is fictional and safe.'), 'ok');
  input.value = '';
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  history.push(value);
  if (history.length > 30) history.shift();
  historyIndex = history.length;
  input.value = '';
  execute(value);
});
input.addEventListener('keydown', event => {
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    historyIndex = Math.max(0, historyIndex - 1);
    input.value = history[historyIndex] ?? '';
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    historyIndex = Math.min(history.length, historyIndex + 1);
    input.value = history[historyIndex] ?? '';
  } else if (event.key === 'Escape') {
    input.blur();
    section.focus({ preventScroll: true });
  } else if (event.key === 'Tab') {
    return;
  }
});
input.addEventListener('focus', () => input.scrollIntoView({ block: 'nearest' }));
restartButton.addEventListener('click', () => execute('restart'));
window.addEventListener('portfolio:languagechange', () => {
  if (game) {
    const scenario = scenarios.find(candidate => candidate.files.includes(Object.keys(game.files)[0]));
    if (scenario) game.files = buildFiles(scenario, game.clueFiles, game.code.split('-')[0], Number(game.code.split('-')[1]));
  }
  updateStatus();
  renderShortcuts();
});

section.tabIndex = -1;
resetGame();
