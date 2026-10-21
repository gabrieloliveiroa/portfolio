// LANGUAGE TOGGLE
const LANGUAGE_KEY='portfolio-language';
const languageBtn=document.getElementById('language-toggle');
let currentLang=localStorage.getItem(LANGUAGE_KEY)==='en'?'en':'pt';
const tr=(pt,en)=>currentLang==='en'?en:pt;

function setLanguageText(selector, pt, en){
  document.querySelectorAll(selector).forEach((el,index)=>{
    const ptValue=Array.isArray(pt)?pt[index%pt.length]:pt;
    const enValue=Array.isArray(en)?en[index%en.length]:en;
    el.textContent=currentLang==='en'?enValue:ptValue;
  });
}

function setLanguageHTML(selector, pt, en){
  document.querySelectorAll(selector).forEach((el,index)=>{
    const ptValue=Array.isArray(pt)?pt[index%pt.length]:pt;
    const enValue=Array.isArray(en)?en[index%en.length]:en;
    el.innerHTML=currentLang==='en'?enValue:ptValue;
  });
}

function applyLanguage(){
  document.documentElement.lang=currentLang==='en'?'en':'pt-BR';
  document.title=tr('Gabriel Oliveira — Engenharia de Computação','Gabriel Oliveira — Computer Engineering');
  languageBtn.textContent='EN/PT';
  languageBtn.setAttribute('aria-label',tr('Mudar para inglês','Mudar para português'));
  document.getElementById('hamburger-menu').setAttribute('aria-label',tr('Abrir menu','Open menu'));
  document.getElementById('close-menu').setAttribute('aria-label',tr('Fechar menu','Close menu'));
  document.getElementById('effects-toggle')?.setAttribute('aria-label',tr('Desativar efeitos','Disable effects'));
  document.querySelectorAll('[alt="Gabriel Oliveira"]').forEach(img=>{img.alt=tr('Gabriel Oliveira','Gabriel Oliveira');});
  setLanguageText('.nav-links a,.mobile-nav-links a',['Sobre','Experiência','Stack','Projetos','Contato','Desafio'],['About','Experience','Stack','Projects','Contact','Challenge']);
  setLanguageText('.nav-logo-sub','eng. computação','computer engineering');
  setLanguageText('.hdesc','Estudante de Engenharia de Computação no CEFET-MG, com interesse em algoritmos e sistemas. Monitor de programação e membro do COMPET.','Computer Engineering student at CEFET-MG, interested in algorithms and systems. Programming mentor and COMPET member.');
  setLanguageText('.hctas a',['Ver projetos ↓','Entre em contato'],['View projects ↓','Get in touch']);
  setLanguageText('[data-neofetch-label="user"]','usuário@host:','user@host:');
  setLanguageText('[data-neofetch-label="course"]','curso:','course:');
  setLanguageText('[data-neofetch-label="institution"]','instituição:','institution:');
  setLanguageText('[data-neofetch-label="languages"]','linguagens:','languages:');
  setLanguageText('[data-neofetch-label="tools"]','ferramentas:','tools:');
  setLanguageText('[data-neofetch-value="course"]','Engenharia de Computação','Computer Engineering');
  setLanguageText('#sobre .slbl','Sobre mim','About me');
  setLanguageText('#sobre .stit','Quem sou eu','Who I am');
  setLanguageHTML('#sobre .sbody p',[
    'Olá! Sou <strong>Gabriel Oliveira</strong>, estudante de <strong>Engenharia de Computação no CEFET-MG</strong>. Tenho interesse genuíno por entender como os sistemas funcionam — do hardware ao software — e por compartilhar esse conhecimento.',
    'Atuei como <strong>Monitor de Programação no projeto Python Para Todos</strong>, auxiliando iniciantes a dar seus primeiros passos na programação de forma acessível e prática.',
    'Também atuei como <strong>Scrum Master</strong> no projeto, coordenando sprints e facilitando a comunicação da equipe.',
    'Faço parte do <strong>COMPET</strong> (Programa de Educação Tutorial de Computação), grupo voltado ao aprofundamento acadêmico, pesquisa e extensão em Computação no CEFET-MG.'
  ],[
    'Hello! I am <strong>Gabriel Oliveira</strong>, a <strong>Computer Engineering student at CEFET-MG</strong>. I am genuinely interested in understanding how systems work — from hardware to software — and sharing that knowledge.',
    'I worked as a <strong>Programming Mentor for the Python Para Todos project</strong>, helping beginners take their first steps in programming in an accessible and practical way.',
    'I also worked as the project <strong>Scrum Master</strong>, coordinating sprints and facilitating team communication.',
    'I am part of <strong>COMPET</strong> (Computer Tutorial Education Program), a group focused on academic development, research, and outreach in Computer Science at CEFET-MG.'
  ]);
  setLanguageText('#sobre .tag',['Algoritmos','Sistemas','Python','C / C++','Educação Tech','Open Source'],['Algorithms','Systems','Python','C / C++','Tech Education','Open Source']);
  setLanguageText('#experiencia .slbl','Trajetória','Journey');
  setLanguageText('#experiencia .stit','Experiência','Experience');
  setLanguageText('#experiencia .erole',['Membro do COMPET','Monitor de Programação / Scrum Master','Estudante de Engenharia de Computação'],['COMPET Member','Programming Mentor / Scrum Master','Computer Engineering Student']);
  setLanguageText('#experiencia .eco',['CEFET-MG — Programa de Educação Tutorial','Python Para Todos — CEFET-MG','CEFET-MG'],['CEFET-MG — Tutorial Education Program','Python Para Todos — CEFET-MG','CEFET-MG']);
  setLanguageText('#experiencia .epper',['2026 — atual','2025 — 2026','2024 — atual'],['2026 — present','2025 — 2026','2024 — present']);
  setLanguageText('#experiencia .edesc',[
    'Participação no grupo de educação tutorial de Computação, com foco em desenvolvimento acadêmico, pesquisa aplicada e projetos de extensão. Estudo aprofundado de algoritmos, estruturas de dados e sistemas computacionais.',
    'Atuei no projeto de extensão "Python Para Todos" como monitor e Scrum Master, auxiliando estudantes iniciantes, conduzindo aulas práticas, resolvendo dúvidas e elaborando materiais didáticos acessíveis.',
    'Graduação com disciplinas de algoritmos, arquitetura de computadores, sistemas operacionais, física, cálculo e desenvolvimento de software.'
  ],[
    'Participation in the Computer Science tutorial education group, focusing on academic development, applied research, and outreach projects. In-depth study of algorithms, data structures, and computer systems.',
    'I worked on the "Python Para Todos" outreach project as a mentor and Scrum Master, helping beginner students, leading practical classes, answering questions, and creating accessible learning materials.',
    'Degree program covering algorithms, computer architecture, operating systems, physics, calculus, and software development.'
  ]);
  setLanguageText('#habilidades .slbl','Tecnologias','Technologies');
  setLanguageText('#habilidades .stit','Stack & Habilidades','Stack & Skills');
  setLanguageText('#habilidades .scat',['Linguagens','Ciência da Computação','Ferramentas & Outros'],['Languages','Computer Science','Tools & Other']);
  setLanguageText('#habilidades .skillcard:nth-child(2) .chip',['Algoritmos','Estruturas de Dados','Análise de Complexidade','Arquitetura de Computadores','Sistemas Operacionais'],['Algorithms','Data Structures','Complexity Analysis','Computer Architecture','Operating Systems']);
  setLanguageText('#projetos .slbl','Trabalhos','Work');
  setLanguageText('#projetos .stit','Projetos em destaque','Featured projects');
  setLanguageText('.pintro','Projetos e iniciativas que desenvolvi ao longo da graduação e em paralelo a ela.','Projects and initiatives I developed during and alongside my degree.');
  setLanguageText('.pname',['Python Para Todos','COMPET — Computação'],['Python Para Todos','COMPET — Computing']);
  setLanguageText('.pdesc',[
    'Projeto de extensão do CEFET-MG que democratiza o ensino de programação. Atuei como monitor e Scrum Master, desenvolvendo materiais, conduzindo aulas práticas e coordenando a equipe.',
    'Participação no Programa de Educação Tutorial: pesquisa aplicada, estudo aprofundado de algoritmos, eventos acadêmicos e projetos de extensão.'
  ],[
    'CEFET-MG outreach project that makes programming education more accessible. I worked as a mentor and Scrum Master, creating materials, leading practical classes, and coordinating the team.',
    'Participation in the Tutorial Education Program: applied research, in-depth algorithm study, academic events, and outreach projects.'
  ]);
  setLanguageText('.pcard:first-child .ptag',['Python','Educação','Extensão','CEFET-MG'],['Python','Education','Outreach','CEFET-MG']);
  setLanguageText('.pcard:nth-child(2) .ptag',['PET','Pesquisa','Algoritmos','CEFET-MG'],['PET','Research','Algorithms','CEFET-MG']);
  setLanguageText('.rbar .slbl','Repositórios do GitHub','GitHub repositories');
  setLanguageText('.rbar .btng','Ver todos →','View all →');
  setLanguageText('.rph','⟳ Carregando repositórios...','⟳ Loading repositories...');
  setLanguageText('#contato .slbl','Fale comigo','Get in touch');
  setLanguageHTML('#contato .stit','Vamos<br>conversar?','Let\'s<br>talk?');
  setLanguageText('.cttag','Estou aberto a oportunidades, colaborações e trocas de ideias. Me chame em qualquer uma das plataformas abaixo.','I am open to opportunities, collaborations, and exchanging ideas. Reach me on any of the platforms below.');
  setLanguageText('.fl',['Nome','E-mail','Mensagem'],['Name','Email','Message']);
  document.getElementById('cn').placeholder=tr('Seu nome','Your name');
  document.getElementById('cm').placeholder=tr('Olá Gabriel, quero conversar sobre...','Hi Gabriel, I would like to talk about...');
  setLanguageText('.cform .btnp','Enviar mensagem ↗','Send message ↗');
  setLanguageText('#snake-section .slbl','Desafio','Challenge');
  setLanguageText('#snake-section .stit','Terminal challenge','Terminal challenge');
  setLanguageText('.challenge-intro','Encontre as três pistas no sistema fictício e envie o código final. Comandos seguros, desafio rápido.','Find the three clues in the fictional system and submit the final code. Safe commands, quick challenge.');
  setLanguageText('[data-challenge-help]','help','help');
  setLanguageText('[data-challenge-hint]','hint','hint');
  setLanguageText('[data-challenge-restart]','restart','restart');
  document.querySelector('[data-challenge-input]')?.setAttribute('aria-label',tr('Digite um comando','Type a command'));
  setLanguageHTML('.ft','© 2026 <span>Gabriel Oliveira</span> · Engenharia de Computação · CEFET-MG','© 2026 <span>Gabriel Oliveira</span> · Computer Engineering · CEFET-MG');
  window.dispatchEvent(new CustomEvent('portfolio:languagechange'));
}

applyLanguage();
languageBtn.addEventListener('click',()=>{
  currentLang=currentLang==='pt'?'en':'pt';
  localStorage.setItem(LANGUAGE_KEY,currentLang);
  applyLanguage();
});

export { tr, applyLanguage };
