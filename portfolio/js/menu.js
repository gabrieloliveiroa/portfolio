// HAMBURGER MENU
const hamburgerBtn=document.getElementById('hamburger-menu');
const mobileMenu=document.getElementById('mobile-menu');
const closeBtn=document.getElementById('close-menu');
const mobileLinks=document.querySelectorAll('.mobile-nav-links a');
let lastFocusedElement=null;

function getFocusableInMenu(){
  return mobileMenu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
}

function setMobileMenuState(isOpen){
  hamburgerBtn.classList.toggle('active',isOpen);
  mobileMenu.classList.toggle('active',isOpen);
  hamburgerBtn.setAttribute('aria-expanded',isOpen?'true':'false');
  mobileMenu.setAttribute('aria-hidden',isOpen?'false':'true');
  document.body.style.overflow=isOpen?'hidden':'';
  window.dispatchEvent(new CustomEvent('portfolio:overlay',{detail:{open:isOpen}}));
  if(isOpen){
    lastFocusedElement=document.activeElement;
    const f=getFocusableInMenu();
    if(f.length)f[0].focus();
  }else if(lastFocusedElement&&typeof lastFocusedElement.focus==='function'){
    lastFocusedElement.focus();
  }
}

hamburgerBtn.addEventListener('click',()=>{
  const nextState=!mobileMenu.classList.contains('active');
  setMobileMenuState(nextState);
});

closeBtn.addEventListener('click',()=>{
  setMobileMenuState(false);
});

mobileLinks.forEach(link=>{
  link.addEventListener('click',()=>{
    setMobileMenuState(false);
  });
});

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&mobileMenu.classList.contains('active')){
    e.preventDefault();
    setMobileMenuState(false);
    return;
  }
  if(e.key==='Tab'&&mobileMenu.classList.contains('active')){
    const f=Array.from(getFocusableInMenu());
    if(!f.length)return;
    const first=f[0];
    const last=f[f.length-1];
    if(e.shiftKey&&document.activeElement===first){
      e.preventDefault();
      last.focus();
    }else if(!e.shiftKey&&document.activeElement===last){
      e.preventDefault();
      first.focus();
    }
  }
});

window.addEventListener('resize',()=>{
  if(window.innerWidth>768&&mobileMenu.classList.contains('active'))setMobileMenuState(false);
});
