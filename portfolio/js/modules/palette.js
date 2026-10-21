import { tr } from '../i18n.js';

const palette = document.getElementById('command-palette');
const input = document.getElementById('command-palette-input');
const list = document.getElementById('command-palette-list');
const toggle = document.getElementById('command-palette-toggle');
let previousFocus = null;
let selected = 0;

const commands = [
  { id: 'about', label: () => tr('cd sobre', 'cd about'), target: '#sobre' },
  { id: 'experience', label: () => tr('cd experiência', 'cd experience'), target: '#experiencia' },
  { id: 'skills', label: () => tr('ls habilidades', 'ls skills'), target: '#habilidades' },
  { id: 'projects', label: () => tr('cd projetos', 'cd projects'), target: '#projetos' },
  { id: 'contact', label: () => tr('cd contato', 'cd contact'), target: '#contato' },
  { id: 'game', label: () => tr('play challenge', 'play challenge'), target: '#snake-section' },
  { id: 'neofetch', label: () => 'neofetch', target: '#sobre', action: () => window.dispatchEvent(new CustomEvent('portfolio:neofetch')) },
  { id: 'whoami', label: () => 'whoami', keepOpen: true, action: () => showMessage(tr('Gabriel Oliveira — estudante de Engenharia de Computação.', 'Gabriel Oliveira — Computer Engineering student.')) },
  { id: 'hire', label: () => 'sudo hire gabriel', keepOpen: true, action: runRecruiter },
  { id: 'effects-off', label: () => 'effects off', action: () => window.portfolioEffects?.set(false) },
  { id: 'effects-on', label: () => 'effects on', action: () => window.portfolioEffects?.set(true) },
  { id: 'robot', label: () => tr('robot', 'robot'), keepOpen: true, action: () => window.robotAssistant?.toggle() },
  { id: 'language', label: () => tr('alternar idioma', 'toggle language'), action: () => document.getElementById('language-toggle').click() },
  { id: 'github', label: () => 'open github', url: 'https://github.com/gabrieloliveiroa' },
  { id: 'linkedin', label: () => 'open linkedin', url: 'https://www.linkedin.com/in/gabrieloliveiroa/' }
];

function showMessage(message) {
  let feedback = palette.querySelector('.command-palette-feedback');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.className = 'command-palette-feedback';
    palette.querySelector('.command-palette-panel').append(feedback);
  }
  feedback.textContent = message;
}

function runRecruiter() {
  showMessage('[sudo] password for recruiter: ****');
  window.setTimeout(() => {
    showMessage(tr('Permission granted — abrindo contato.', 'Permission granted — opening contact.'));
    window.setTimeout(() => {
      close();
      window.portfolioScrollTo?.('#contato');
    }, 650);
  }, 500);
}

function visibleCommands() {
  const query = input.value.trim().toLowerCase();
  return commands.filter(command => command.label().toLowerCase().includes(query));
}

function updateInterfaceText() {
  document.getElementById('command-palette-title').textContent = tr('Paleta de comandos', 'Command palette');
  document.querySelector('.command-palette-close').setAttribute('aria-label', tr('Fechar comandos', 'Close commands'));
  input.placeholder = tr('Digite um comando...', 'Type a command...');
  list.setAttribute('aria-label', tr('Comandos disponíveis', 'Available commands'));
}

function render() {
  const items = visibleCommands();
  selected = Math.min(selected, Math.max(0, items.length - 1));
  list.replaceChildren();
  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'command-empty';
    empty.textContent = tr('Nenhum comando encontrado.', 'No command found.');
    list.append(empty);
    return;
  }
  items.forEach((command, index) => {
    const item = document.createElement('button');
    item.className = 'command-item';
    item.type = 'button';
    item.setAttribute('role', 'option');
    item.setAttribute('aria-selected', String(index === selected));
    item.innerHTML = `<span class="command-item-label"><span class="command-item-prefix">$</span><span></span></span><span class="command-item-hint">Enter</span>`;
    item.querySelector('.command-item-label span:last-child').textContent = command.label();
    item.addEventListener('click', () => execute(command));
    list.append(item);
  });
}

function execute(command) {
  if (command.keepOpen) {
    command.action?.();
    return;
  }
  close();
  if (command.target) window.portfolioScrollTo?.(command.target);
  if (command.action) command.action();
  else if (command.url) window.open(command.url, '_blank', 'noopener,noreferrer');
}

function open() {
  if (!palette) return;
  previousFocus = document.activeElement;
  palette.classList.add('active');
  palette.setAttribute('aria-hidden', 'false');
  input.value = '';
  selected = 0;
  render();
  window.dispatchEvent(new CustomEvent('portfolio:overlay', { detail: { open: true } }));
  input.focus();
}

function close() {
  if (!palette) return;
  palette.classList.remove('active');
  palette.setAttribute('aria-hidden', 'true');
  window.dispatchEvent(new CustomEvent('portfolio:overlay', { detail: { open: false } }));
  previousFocus?.focus();
}

toggle?.addEventListener('click', open);
palette?.querySelectorAll('[data-palette-close]').forEach(element => element.addEventListener('click', close));
input?.addEventListener('input', () => { selected = 0; render(); });
input?.addEventListener('keydown', event => {
  const items = visibleCommands();
  if (event.key === 'ArrowDown') { event.preventDefault(); selected = Math.min(selected + 1, items.length - 1); render(); }
  if (event.key === 'ArrowUp') { event.preventDefault(); selected = Math.max(selected - 1, 0); render(); }
  if (event.key === 'Enter' && items[selected]) { event.preventDefault(); execute(items[selected]); }
});
document.addEventListener('keydown', event => {
  const target = event.target;
  const inField = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
  const inGame = target.closest?.('#snake-section');
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !inField && !inGame) { event.preventDefault(); open(); }
  if (event.key === 'Escape' && palette?.classList.contains('active')) { event.preventDefault(); close(); }
  if (event.key === 'Tab' && palette?.classList.contains('active')) {
    const focusables = [input, ...palette.querySelectorAll('button')];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
window.addEventListener('portfolio:languagechange', render);
window.addEventListener('portfolio:languagechange', updateInterfaceText);
updateInterfaceText();
