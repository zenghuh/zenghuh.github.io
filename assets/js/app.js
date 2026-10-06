document.documentElement.classList.add('js');

const nav = document.querySelector('#primary-nav');
const menu = document.querySelector('.menu-toggle');
function closeMenu(returnFocus=false) {
  if(!nav || !menu) return;
  nav.dataset.open = 'false';
  menu.setAttribute('aria-expanded','false');
  menu.setAttribute('aria-label','Open navigation');
  menu.textContent = 'Menu';
  if(returnFocus) menu.focus();
}
if(nav && menu) {
  menu.hidden = false;
  menu.addEventListener('click',()=>{
    const open = menu.getAttribute('aria-expanded') !== 'true';
    nav.dataset.open = String(open);
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    menu.textContent = open?'Close':'Menu';
  });
  nav.addEventListener('click',event=>{if(event.target.closest('a')) closeMenu();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape' && menu.getAttribute('aria-expanded')==='true')closeMenu(true);});
  const desktop = matchMedia('(min-width: 801px)');
  desktop.addEventListener('change',()=>closeMenu());
}

const progress = document.querySelector('.scroll-progress');
let scrollQueued=false;
function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  if(progress) progress.style.width = `${max>0?Math.min(100,Math.max(0,scrollY/max*100)):0}%`;
  if(scrollY<80) nav?.querySelectorAll('[aria-current]').forEach(link=>link.removeAttribute('aria-current'));
  scrollQueued=false;
}
addEventListener('scroll',()=>{if(!scrollQueued){requestAnimationFrame(updateProgress);scrollQueued=true;}},{passive:true});
addEventListener('resize',updateProgress);
updateProgress();
document.querySelectorAll('a[href="#home"]').forEach(link=>link.addEventListener('click',event=>{
  event.preventDefault();
  closeMenu();
  history.replaceState(null,'','#home');
  scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}));

const controls = document.querySelector('.publication-controls');
const search = document.querySelector('#publication-search');
const cards = [...document.querySelectorAll('.publication-card')];
const count = document.querySelector('#publication-count');
const empty = document.querySelector('.empty-state');
let selectedYear='all';
function filterPublications() {
  const terms=(search?.value || '').trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  let visible=0;
  for(const card of cards) {
    const text=card.dataset.search.toLocaleLowerCase();
    const matches=(selectedYear==='all' || card.dataset.year===selectedYear) && terms.every(term=>text.includes(term));
    card.hidden=!matches;
    if(matches) visible++;
  }
  if(count) count.textContent=visible===cards.length?`Showing all ${cards.length} publications`:`Showing ${visible} of ${cards.length} publications`;
  if(empty) empty.hidden=visible!==0;
  document.querySelectorAll('[data-year-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.yearFilter===selectedYear)));
  updateProgress();
}
if(controls && search) {
  controls.hidden=false;
  search.addEventListener('input',filterPublications);
  document.querySelectorAll('[data-year-filter]').forEach(button=>button.addEventListener('click',()=>{selectedYear=button.dataset.yearFilter;filterPublications();}));
  document.querySelectorAll('.reset-button').forEach(button=>button.addEventListener('click',()=>{selectedYear='all';search.value='';filterPublications();search.focus();}));
  filterPublications();
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href^="#paper-"]');
    const card=link && document.querySelector(link.getAttribute('href'));
    if(card?.hidden){selectedYear='all';search.value='';filterPublications();}
  });
}

const toast = document.querySelector('.toast');
let toastTimer;
function announce(message) {
  if(!toast) return;
  clearTimeout(toastTimer);
  toast.textContent=message;
  toast.hidden=false;
  toastTimer=setTimeout(()=>{toast.hidden=true;},4200);
}
document.querySelectorAll('.bibtex-button').forEach(button=>{
  button.hidden=false;
  button.addEventListener('click',async()=>{
    const citation=document.querySelector(`#bib-${button.dataset.bibtexId}`);
    if(!citation) return;
    try {
      if(!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(citation.textContent);
      announce('BibTeX copied to clipboard.');
    } catch {
      citation.closest('details').open=true;
      citation.focus();
      const selection=getSelection();
      if(selection){const range=document.createRange();range.selectNodeContents(citation);selection.removeAllRanges();selection.addRange(range);}
      announce('Copy the selected BibTeX text below.');
    }
  });
});

document.querySelectorAll('.print-button').forEach(button=>{button.hidden=false;button.addEventListener('click',()=>print());});
if('IntersectionObserver' in window && document.querySelector('#about')) {
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries) if(entry.isIntersecting){
      nav?.querySelectorAll('a').forEach(link=>{if(link.getAttribute('href')===`#${entry.target.id}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
    }
  },{rootMargin:'-15% 0px -65% 0px'});
  document.querySelectorAll('main>section[id]').forEach(section=>observer.observe(section));
}
