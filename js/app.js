// js/app.js
function showPage(id,el,sbId){
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.sidebar-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p=>{p.classList.remove('active');p.style.opacity='';p.style.transform='';});
  const pageEl=document.getElementById('page-'+id);if(pageEl)pageEl.classList.add('active');
  const titleEl=document.getElementById('header-title');if(titleEl)titleEl.innerHTML=PAGE_TITLES[id]||"Pearla's Workspace";
  if(id==='dashboard')renderDashboard();
  if(el)el.classList.add('active');
  const sb=document.getElementById(sbId||'sb-'+id);if(sb)sb.classList.add('active');
  const nb=document.getElementById('nav-'+id);if(nb)nb.classList.add('active');
  const sa=document.getElementById('scroll-area');if(sa)sa.scrollTop=0;
  if(id==='retro'){renderRetro();setTimeout(updateRetroSlider,30);}
  if(id==='mer')renderEnergy();
  if(id==='prosjekt')renderProjects();
  if(id==='mote')renderMeetings();
  if(id==='stats')renderStats();if(id==='dashboard')renderDashboard();if(id==='matrise')renderMatrise();
  if(id==='timer'){populateProjectSelects();renderTimerPage();}setTimeout(updatePomoSlider,30);
  if(id==='handel')renderHandel();
  if(id==='hjem')renderHjem();
  if(id==='vaner')renderVaner();
  if(id==='trening'){renderTrening();const td=document.getElementById('trening-date');if(td&&!td.value)td.value=todayKey();}
  if(id==='mat')renderMat();
  if(id==='sosialt'){renderSosialt();const sd=document.getElementById('sosialt-date');if(sd&&!sd.value)sd.value=todayKey();}
  if(id==='okonomi'){renderOkonomi();const od=document.getElementById('ok-date');if(od&&!od.value)od.value=todayKey();}
  if(id==='mal')renderMal();
  if(id==='dagbok')renderDagbok();
  if(id==='fritid')renderFritid();if(id==='notater'){const sh=document.getElementById('nb-subheader');if(sh)sh.style.display='flex';renderNotater();}else{const sh=document.getElementById('nb-subheader');if(sh)sh.style.display='none';}
}

function showSavedToast(msg){
  const t=document.createElement('div');
  t.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#2d6e50;color:#fff;border-radius:12px;padding:.75rem 1.25rem;font-size:14px;font-weight:700;z-index:600;font-family:var(--font);white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,.2);animation:slideUp .25s ease';
  t.textContent='\u2705 '+msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2200);
}

// STREAK
