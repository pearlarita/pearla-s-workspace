// js/energy.js
function renderEnergyStars(){const el=document.getElementById('rd-energy-stars');if(!el)return;el.innerHTML='';for(let i=1;i<=5;i++){const s=document.createElement('span');s.className='energy-star'+(i<=retroDailyEnergy?' active':'');s.textContent='\u2605';s.onclick=()=>{retroDailyEnergy=i;renderEnergyStars();};el.appendChild(s);}}
function saveRetroDaily(){const key=todayKey();const entry={key,good:document.getElementById('rd-good').value.trim(),block:document.getElementById('rd-block').value.trim(),next:document.getElementById('rd-next').value.trim(),energy:retroDailyEnergy,dateLabel:DAYS_NO[now.getDay()]+' '+todayD+'. '+MONTHS_NO[todayM]};const idx=retroDaily.findIndex(r=>r.key===key);if(idx>=0)retroDaily[idx]=entry;else retroDaily.push(entry);if(retroDaily.length>30)retroDaily.shift();saveAll();renderRetroDaily();showSavedToast('Daglig retro lagret!');}
function renderRetroWeekly(){
  const wk=weekKey();const d=new Date(now);d.setDate(d.getDate()-(d.getDay()===0?6:d.getDay()-1));
  document.getElementById('retro-weekly-lbl').textContent='Uke fra '+d.getDate()+'. '+MONTHS_NO[d.getMonth()];
  const ex=retros.find(r=>r.wk===wk);
  document.getElementById('rw-good').value=ex?ex.good:'';document.getElementById('rw-hard').value=ex?ex.hard:'';document.getElementById('rw-next').value=ex?ex.next:'';document.getElementById('rw-proud').value=ex?ex.proud||'':'';
  const hist=document.getElementById('retro-weekly-history');hist.innerHTML='';
  retros.slice().reverse().slice(0,4).forEach(r=>{const div=document.createElement('div');div.className='retro-entry';div.innerHTML='<strong>'+r.dateLabel+'</strong>Bra: '+(r.good||'\u2013')+'<br>Vanskelig: '+(r.hard||'\u2013')+'<br>Neste: '+(r.next||'\u2013')+(r.proud?'<br>Stolt: '+r.proud:'');hist.appendChild(div);});
}
function saveRetroWeekly(){const wk=weekKey();const d=new Date(now);d.setDate(d.getDate()-(d.getDay()===0?6:d.getDay()-1));const entry={wk,good:document.getElementById('rw-good').value.trim(),hard:document.getElementById('rw-hard').value.trim(),next:document.getElementById('rw-next').value.trim(),proud:document.getElementById('rw-proud').value.trim(),dateLabel:d.getDate()+'. '+MONTHS_NO[d.getMonth()]};const idx=retros.findIndex(r=>r.wk===wk);if(idx>=0)retros[idx]=entry;else retros.push(entry);if(retros.length>12)retros.shift();saveAll();renderRetroWeekly();showSavedToast('Ukentlig retro lagret!');}
function renderRetroMonthly(){
  document.getElementById('retro-monthly-lbl').textContent=MONTHS_NO[todayM].charAt(0).toUpperCase()+MONTHS_NO[todayM].slice(1)+' '+todayY;
  const mk=monthKey();const ex=retroMonthly.find(r=>r.mk===mk);
  document.getElementById('rm-win').value=ex?ex.win:'';document.getElementById('rm-learn').value=ex?ex.learn:'';document.getElementById('rm-change').value=ex?ex.change:'';document.getElementById('rm-words').value=ex?ex.words:'';document.getElementById('rm-goal').value=ex?ex.goal:'';
  const hist=document.getElementById('retro-monthly-history');hist.innerHTML='';
  retroMonthly.slice().reverse().slice(0,4).forEach(r=>{const div=document.createElement('div');div.className='retro-entry';div.innerHTML='<strong>'+r.monthLabel+'</strong>Seier: '+(r.win||'\u2013')+'<br>L\u00e6rte: '+(r.learn||'\u2013')+'<br>Ord: '+(r.words||'\u2013')+'<br>M\u00e5l: '+(r.goal||'\u2013');hist.appendChild(div);});
}
function saveRetroMonthly(){const mk=monthKey();const entry={mk,win:document.getElementById('rm-win').value.trim(),learn:document.getElementById('rm-learn').value.trim(),change:document.getElementById('rm-change').value.trim(),words:document.getElementById('rm-words').value.trim(),goal:document.getElementById('rm-goal').value.trim(),monthLabel:MONTHS_NO[todayM].charAt(0).toUpperCase()+MONTHS_NO[todayM].slice(1)+' '+todayY};const idx=retroMonthly.findIndex(r=>r.mk===mk);if(idx>=0)retroMonthly[idx]=entry;else retroMonthly.push(entry);if(retroMonthly.length>12)retroMonthly.shift();saveAll();renderRetroMonthly();showSavedToast('M\u00e5nedlig retro lagret!');}

// ENERGY
function renderEnergy(){
  const grid=document.getElementById('energy-grid');grid.innerHTML='';
  const dow=now.getDay();const monday=new Date(now);monday.setDate(now.getDate()-(dow===0?6:dow-1));
  for(let i=0;i<7;i++){const day=new Date(monday);day.setDate(monday.getDate()+i);const key=fmtKey(day.getFullYear(),day.getMonth(),day.getDate());const col=document.createElement('div');col.className='energy-col';const lbl=document.createElement('div');lbl.className='energy-day-lbl';lbl.textContent=DAYS_SHORT[i];col.appendChild(lbl);const slots=document.createElement('div');slots.className='energy-slots';TIME_SLOTS.forEach((slot,si)=>{const s=document.createElement('div');const lvl=(energyLog[key]||[])[si]||0;s.className='energy-slot'+(lvl?' e'+lvl:'');s.title=slot;s.onclick=()=>cycleEnergy(key,si);const slbl=document.createElement('div');slbl.className='energy-slot-lbl';slbl.textContent=slot.split('\u2013')[0];s.appendChild(slbl);slots.appendChild(s);});col.appendChild(slots);grid.appendChild(col);}
  updateEnergyInsight();
}
function cycleEnergy(key,si){if(!energyLog[key])energyLog[key]=Array(5).fill(0);const cur=energyLog[key][si]||0;energyLog[key][si]=cur>=3?0:cur+1;saveAll();renderEnergy();}
function updateEnergyInsight(){const ins=document.getElementById('energy-insight');const totals=Array(5).fill(0);const count=Array(5).fill(0);Object.values(energyLog).forEach(day=>{(day||[]).forEach((v,i)=>{if(v>0){totals[i]+=v;count[i]++;}});});const avgs=totals.map((t,i)=>count[i]>0?t/count[i]:0);if(avgs.every(v=>v===0)){ins.textContent='Ingen data enda \u2013 trykk p\u00e5 tidsblokkene for \u00e5 registrere energiniv\u00e5.';return;}const maxI=avgs.indexOf(Math.max(...avgs));ins.innerHTML='\ud83d\udca1 <b>H\u00f8yest energi:</b> '+TIME_SLOTS[maxI]+' \u2013 legg tunge oppgaver her!';}

// TIMEF&#216;RING
