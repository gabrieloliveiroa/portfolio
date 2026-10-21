// HERO PORTRAIT — interações 3D, parallax e ripple
(function(){
  const p = document.getElementById('heroPortrait');
  if(!p) return;
  p.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
  const finePointer = window.matchMedia('(pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(!finePointer.matches || reducedMotion.matches || document.documentElement.dataset.effects === 'off') return;
  p.addEventListener('pointermove', e=>{
    const r = p.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width - 0.5;
    const y = (e.clientY - r.top)/r.height - 0.5;
    const rotY = x * 12; // degrees
    const rotX = -y * 12;
    p.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
  });
  p.addEventListener('pointerleave', ()=>{
    p.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
  });
  p.addEventListener('click', e=>{ createPortraitRipple(e,p); });

  function createPortraitRipple(e, el){
    const rr = document.createElement('span');
    rr.className = 'pp-ripple';
    const rect = el.getBoundingClientRect();
    const s = Math.max(rect.width, rect.height);
    rr.style.width = rr.style.height = s + 'px';
    rr.style.left = (e.clientX - rect.left - s/2) + 'px';
    rr.style.top = (e.clientY - rect.top - s/2) + 'px';
    el.appendChild(rr);
    setTimeout(()=> rr.remove(), 900);
  }
})();

// STARFIELD — pontos brancos com pulso suave
(function(){
  const starsLayer = document.querySelector('.starfield .stars');
  if(!starsLayer) return;

  // generate slow-moving point stars
  const STAR_COUNT = 42;
  for(let i=0;i<STAR_COUNT;i++){
    const st = document.createElement('div');
    st.className = 'star';
    const size = Math.random()*2 + 0.6; // 0.6 - 2.6px
    const left = Math.random()*100;
    const top = Math.random()*100;
    const op = 0.45 + Math.random()*0.55;
    const tx = (Math.random()*10-5).toFixed(2) + 'px';
    const ty = (Math.random()*6-3).toFixed(2) + 'px';
    const dur = (14 + Math.random()*18).toFixed(2) + 's';
    const twd = (2.5 + Math.random()*5).toFixed(2) + 's';
    const tdelay = (Math.random()*6).toFixed(2) + 's';
    const pulseDur = (2.8 + Math.random()*3.8).toFixed(2) + 's';
    const pulseDelay = (Math.random()*4).toFixed(2) + 's';
    st.style.width = st.style.height = size + 'px';
    st.style.left = left + '%';
    st.style.top = top + '%';
    st.style.opacity = op;
    st.style.setProperty('--tx', tx);
    st.style.setProperty('--ty', ty);
    st.style.setProperty('--dur', dur);
    st.style.setProperty('--twinkDur', twd);
    st.style.setProperty('--twinkDelay', tdelay+'');
    st.style.setProperty('--pulseDur', pulseDur);
    st.style.setProperty('--pulseDelay', pulseDelay);
    st.style.setProperty('--op', op);
    starsLayer.appendChild(st);
  }
})();
