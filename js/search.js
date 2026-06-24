// js/search.js
function toggleGlobalSearch(){
  const ov=document.getElementById('global-search-overlay');
  if(!ov)return;
  const visible=ov.style.display==='flex';
  ov.style.display=visible?'none':'flex';
  if(!visible){document.getElementById('global-search-results').innerHTML='';document.getElementById('global-search-input').value='';setTimeout(()=>document.getElementById('global-search-input').focus(),50);}
}
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();toggleGlobalSearch();}if(e.key==='Escape'){const ov=document.getElementById('global-search-overlay');if(ov)ov.style.display='none';}});

function globalSearch(q){
  if(!q.trim()){document.getElementById('global-search-results').innerHTML='';return;}
  const results=[];const ql=q.toLowerCase();
  // Tasks
  tasks.forEach(t=>{if(t.text.toLowerCase().includes(ql))results.push({icon:'\u2b50',label:t.text,sub:'Oppgave',action:()=>{showPage('dag',null,'sb-dag');toggleGlobalSearch();}});});
  // Backlog
  taskBacklog.forEach(t=>{if(t.text.toLowerCase().includes(ql))results.push({icon:'\u26a0\ufe0f',label:t.text,sub:'Backlog',action:()=>{showPage('dag',null,'sb-dag');toggleGlobalSearch();}});});
  // Meetings
  meetings.forEach(m=>{if(m.title.toLowerCase().includes(ql)||m.decisions?.toLowerCase().includes(ql)||m.actions?.toLowerCase().includes(ql))results.push({icon:'\ud83d\udc65',label:m.title,sub:'M\u00f8tenotat \u00b7 '+m.date,action:()=>{showPage('mote',null,'sb-mote');toggleGlobalSearch();}});});
  // Projects
  projects.forEach(p=>{if(p.name.toLowerCase().includes(ql))results.push({icon:'\ud83d\udcca',label:p.name,sub:'Prosjekt \u00b7 '+p.pct+'%',action:()=>{showPage('prosjekt',null,'sb-prosjekt');toggleGlobalSearch();}});});
  // Notebooks
  notebooks.forEach(nb=>{(nb.sections||[]).forEach(s=>{if(s.name.toLowerCase().includes(ql))results.push({icon:'\ud83d\udccb',label:s.name,sub:'Seksjon i '+nb.name,action:()=>{showPage('notater',null,'sb-notater');toggleGlobalSearch();}});});if(nb.fri&&nb.fri.toLowerCase().includes(ql))results.push({icon:'\ud83d\udcdd',label:nb.name,sub:'Notat inneholder s\u00f8keordet',action:()=>{showPage('notater',null,'sb-notater');toggleGlobalSearch();}});});
  // Events
  Object.entries(events).forEach(([date,evs])=>evs.forEach(ev=>{if(ev.name.toLowerCase().includes(ql))results.push({icon:'\ud83d\udcc5',label:ev.name,sub:'Hendelse \u00b7 '+date,action:()=>{showPage('dag',null,'sb-dag');toggleGlobalSearch();}});}));
  // Matrise
  Object.entries(matriseItems).forEach(([q2,items])=>items.forEach(item=>{if(item.toLowerCase().includes(ql))results.push({icon:'\ud83c\udfaf',label:item,sub:'Prioriteringsmatrise',action:()=>{showPage('matrise',null,'sb-matrise');toggleGlobalSearch();}});}));

  const el=document.getElementById('global-search-results');
  if(!results.length){el.innerHTML='<div style="padding:1.25rem;font-size:14px;color:var(--muted);text-align:center">Ingen resultater for \"'+q+'\"</div>';return;}
  el.innerHTML='';
  results.slice(0,12).forEach(r=>{
    const div=document.createElement('div');
    div.style.cssText='display:flex;align-items:center;gap:12px;padding:.75rem 1rem;cursor:pointer;border-bottom:1px solid var(--border);transition:background .12s';
    div.innerHTML='<span style="font-size:18px;flex-shrink:0">'+r.icon+'</span><div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+r.label+'</div><div style="font-size:11px;color:var(--muted)">'+r.sub+'</div></div>';
    div.onmouseenter=()=>div.style.background='var(--surface2)';
    div.onmouseleave=()=>div.style.background='';
    div.onclick=r.action;
    el.appendChild(div);
  });
}

document.getElementById('global-search-overlay')?.addEventListener('click',function(e){if(e.target===this)toggleGlobalSearch();});
document.getElementById('global-search-input')?.addEventListener('input',e=>globalSearch(e.target.value));
