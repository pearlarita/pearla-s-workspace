// js/nav.js
function renderAll(){renderTasks();renderStreak();renderWeek();renderCal();renderPomoDots();updatePomoDisplay();renderMood();renderTodayMeetings();populateProjectSelects();}


// ════════════════════
// MOBILE SECTION SWITCHER
// ════════════════════
function toggleJobbDropdown(){
  const children=document.getElementById('sb-jobb-children');
  const chevron=document.getElementById('sb-chevron');
  if(!children)return;
  children.classList.toggle('collapsed');
  if(chevron)chevron.classList.toggle('open');
}
function openJobbDropdown(){
  const children=document.getElementById('sb-jobb-children');
  const chevron=document.getElementById('sb-chevron');
  if(!children)return;
  children.classList.remove('collapsed');
  if(chevron)chevron.classList.add('open');
}

function switchMobileSection(section){
  const _msj=document.getElementById('mobile-section-jobb');if(_msj)_msj.style.display=section==='jobb'?'flex':'none';
  const _msp=document.getElementById('mobile-section-personal');if(_msp)_msp.style.display=section==='personal'?'flex':'none';
  document.getElementById('ssb-jobb')?.classList.toggle('active',section==='jobb');
  document.getElementById('ssb-personal')?.classList.toggle('active',section==='personal');
  // Show first page of section
  if(section==='personal'){showPage('handel',null,'sb-handel');document.getElementById('nav-handel')?.classList.add('active');}
  else{showPage('dag',null,'sb-dag');document.getElementById('nav-dag')&&document.getElementById('nav-dag').classList.add('active');}
}

// ════════════════════
// PERSONAL DATA
// ════════════════════
let handelList=[],handelDone=[],hjemList=[],vaner=[],treningLog=[],sosialtList=[],okonomiList=[],malList=[],dagbok=[],fritidList=[],notebooks=[],activeNotebook=0;
window.matIdeas=window.matIdeas||[];

