// js/mood.js
function renderMood(){
  const row=document.getElementById('mood-row');row.innerHTML='';
  MOODS.forEach(({e,l},i)=>{const btn=document.createElement('button');btn.className='mood-btn';btn.textContent=e;btn.title=l;btn.setAttribute('aria-label',l);btn.onclick=()=>logMood(i);row.appendChild(btn);});
  const hist=document.getElementById('mood-history');hist.innerHTML='';
  moodLog.slice(-5).reverse().forEach(m=>{const chip=document.createElement('div');chip.className='mood-chip';chip.textContent=(MOODS[m.i]?.e||'?')+' '+m.time;hist.appendChild(chip);});
}
function logMood(i){moodLog.push({i,time:new Date().toLocaleTimeString('no-NO',{hour:'2-digit',minute:'2-digit'}),date:todayKey()});if(moodLog.length>30)moodLog.shift();saveAll();renderMood();}

// PROJECTS
