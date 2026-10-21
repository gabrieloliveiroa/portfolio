import { tr } from './i18n.js';

// CONTACT
async function sendForm(ev){
  if(ev&&typeof ev.preventDefault==='function')ev.preventDefault();
  const n=document.getElementById('cn').value.trim();
  const e=document.getElementById('ce').value.trim();
  const m=document.getElementById('cm').value.trim();
  const s=document.getElementById('fst');
  if(!n||!e||!m){s.textContent=tr('⚠ Preencha todos os campos.','⚠ Please fill in all fields.');s.style.color='var(--plt)';return;}
  const validEmail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  if(!validEmail){s.textContent=tr('⚠ E-mail inválido.','⚠ Invalid email.');s.style.color='var(--plt)';return;}

  s.textContent=tr('Enviando mensagem...','Sending message...');
  s.style.color='var(--muted)';

  try{
    const res=await fetch('https://formsubmit.co/ajax/gabrieloliveiraban@gmail.com',{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({
        name:n,
        email:e,
        message:m,
        _subject:tr('Contato via portfólio','Portfolio contact'),
        _captcha:'false'
      })
    });
    if(!res.ok)throw 0;
    s.textContent=tr('✓ Mensagem enviada com sucesso!','✓ Message sent successfully!');
    s.style.color='var(--plt)';
    document.getElementById('cn').value='';
    document.getElementById('ce').value='';
    document.getElementById('cm').value='';
  }catch{
    window.location.href=`mailto:gabrieloliveiraban@gmail.com?subject=${encodeURIComponent(tr('Contato via portfólio','Portfolio contact'))} - ${encodeURIComponent(n)}&body=${encodeURIComponent(tr('De: ','From: ')+n+' <'+e+'>\n\n'+m)}`;
    s.textContent=tr('✓ Abrindo seu cliente de e-mail...','✓ Opening your email client...');
    s.style.color='var(--plt)';
  }
}

const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', sendForm);
