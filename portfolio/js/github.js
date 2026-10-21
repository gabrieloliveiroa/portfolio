import { tr } from './i18n.js';

// REPOS
const LC={Python:'#3572A5',JavaScript:'#f1e05a',C:'#555','C++':'#f34b7d',Java:'#b07219',HTML:'#e34c26',CSS:'#563d7c',TypeScript:'#3178c6',Shell:'#89e051',Assembly:'#6E4C13',default:'#8b949e'};
(async()=>{
  const g=document.getElementById('rgrid');
  const CACHE_KEY='portfolio-github-repos-cache-v1';
  const CACHE_TTL=1000*60*60*2;
  function announceState(text,withCursor=false){
    g.replaceChildren();
    const state=document.createElement('div');
    state.className='rph';
    state.append(document.createTextNode(text));
    if(withCursor){
      const cursor=document.createElement('span');
      cursor.className='repo-cursor';
      cursor.setAttribute('aria-hidden','true');
      state.append(cursor);
    }
    g.append(state);
  }

  function renderRepos(repos,fromCache=false){
    if(!repos.length){
      const empty=document.createElement('div');
      empty.className='rph';
      empty.textContent=tr('Nenhum repositório público.','No public repositories.');
      g.replaceChildren(empty);
      window.dispatchEvent(new CustomEvent('portfolio:repos-rendered'));
      return;
    }
    const cards=repos.map(r=>{
      const lang=r.language||'—';const col=LC[lang]||LC.default;
      const descPt='Sem descrição.';
      const desc=r.description?r.description.slice(0,92)+(r.description.length>92?'…':''):tr(descPt,'No description.');
      const card=document.createElement('a');
      card.href=isSafeRepositoryUrl(r.html_url)?r.html_url:'https://github.com/gabrieloliveiroa';
      card.target='_blank';
      card.rel='noopener noreferrer';
      card.className='rcard';

      const heading=document.createElement('div');
      heading.className='rhd';
      const icon=document.createElement('span');
      icon.className='rico';
      icon.textContent='⊞';
      const name=document.createElement('span');
      name.className='rnm';
      name.textContent=r.name||'';
      heading.append(icon,name);

      const description=document.createElement('div');
      description.className='rds';
      description.textContent=desc;

      const metadata=document.createElement('div');
      metadata.className='rmeta';
      const language=document.createElement('span');
      const languageDot=document.createElement('span');
      languageDot.className='ld';
      languageDot.style.backgroundColor=col;
      language.append(languageDot,document.createTextNode(lang));
      metadata.append(language);
      if(r.stargazers_count>0)metadata.append(createMetadataItem(`★ ${r.stargazers_count}`));
      if(r.forks_count>0)metadata.append(createMetadataItem(`⑂ ${r.forks_count}`));
      if(fromCache)metadata.append(createMetadataItem(tr('cache','cache')));
      card.append(heading,description,metadata);
      return card;
    });
    g.replaceChildren(...cards);
    window.dispatchEvent(new CustomEvent('portfolio:repos-rendered'));
  }

  function createMetadataItem(value){
    const item=document.createElement('span');
    item.textContent=value;
    return item;
  }

  function isSafeRepositoryUrl(value){
    try{
      const url=new URL(value);
      return url.protocol==='https:'&&url.hostname==='github.com';
    }catch{
      return false;
    }
  }

  let cached=null;
  announceState('$ fetching repos... ',true);
  try{
    const raw=localStorage.getItem(CACHE_KEY);
    if(raw){
      const parsed=JSON.parse(raw);
      if(parsed&&Array.isArray(parsed.repos)&&Date.now()-parsed.timestamp<CACHE_TTL){
        cached=parsed.repos;
        renderRepos(cached,true);
      }
    }
  }catch{}

  try{
    const r=await fetch('https://api.github.com/users/gabrieloliveiroa/repos?sort=updated&per_page=6');
    if(!r.ok)throw 0;
    const repos=await r.json();
    renderRepos(repos,false);
    try{localStorage.setItem(CACHE_KEY,JSON.stringify({timestamp:Date.now(),repos}));}catch{}
  }catch{
    if(cached&&cached.length)return;
    const state=document.createElement('div');
    state.className='rph';
    state.append(
      document.createTextNode(tr('Não foi possível carregar agora.','Unable to load right now.')+' '),
      Object.assign(document.createElement('a'),{
        href:'https://github.com/gabrieloliveiroa',
        target:'_blank',
        rel:'noopener noreferrer',
        textContent:tr('Ver no GitHub →','View on GitHub →')
      })
    );
    g.replaceChildren(state);
    window.dispatchEvent(new CustomEvent('portfolio:repos-rendered'));
  }
})();
