// js/timer.js
function populateProjectSelects(){
  const opts='<option value="">Velg prosjekt\u2026</option>'+projects.map(p=>'<option value="'+p.name+'">'+p.name+'</option>').join('');
  const s1=document.getElementById('timer-project-sel');if(s1)s1.innerHTML=opts;
  const s2=document.getElementById('man-project');if(s2)s2.innerHTML=opts;
}

function fmtTime(date){return String(date.getHours()).padStart(2,'0')+':'+String(date.getMinutes()).padStart(2,'0');}
function timeStrToMins(str){if(!str)return null;const[h,m]=str.split(':').map(Number);return h*60+m;}
function minsToHours(mins){return Math.round(mins/60*100)/100;}
function minsToStr(mins){const h=Math.floor(mins/60);const m=mins%60;return h+'t'+(m?(' '+m+'min'):'');}

let stempelInnTid=null;
function stempelInn(){
  const proj=document.getElementById('timer-project-sel').value;
  stempelInnTid=new Date();
  document.getElementById('timer-start-btn').style.display='none';
  document.getElementById('timer-out-btn').style.display='block';
  document.getElementById('timer-stamp-info').textContent='Stemplet inn '+fmtTime(stempelInnTid)+(proj?' \u00b7 '+proj:'');
  liveTimerStart=Date.now();liveTimerRunning=true;
  liveTimerInt=setInterval(updateLiveDisplay,1000);
  try{localStorage.setItem('adhd_inn',JSON.stringify({time:stempelInnTid.toISOString(),proj,desc:document.getElementById('timer-task-desc').value.trim()}));}catch(e){}
}
function stempelUt(){
  if(!stempelInnTid){alert('Stemple inn f\u00f8rst!');return;}
  clearInterval(liveTimerInt);liveTimerRunning=false;
  const ut=new Date();
  const proj=document.getElementById('timer-project-sel').value||'Ukjent';
  const desc=document.getElementById('timer-task-desc').value.trim()||'';
  const innStr=fmtTime(stempelInnTid);
  const utStr=fmtTime(ut);
  const mins=(ut-stempelInnTid)/1000/60;
  const hours=minsToHours(mins);
  timeLog.push({id:Date.now(),proj,desc,date:todayKey(),inn:innStr,ut:utStr,hours});
  saveAll();
  // Reset
  stempelInnTid=null;liveTimerStart=null;
  document.getElementById('timer-live').textContent='00:00:00';
  document.getElementById('timer-live').className='timer-live-display';
  document.getElementById('timer-start-btn').style.display='block';
  document.getElementById('timer-out-btn').style.display='none';
  document.getElementById('timer-stamp-info').textContent='';
  document.getElementById('timer-task-desc').value='';
  try{localStorage.removeItem('adhd_inn');}catch(e){}
  renderTimerPage();
  showSavedToast(innStr+' \u2013 '+utStr+' ('+minsToStr(Math.round(mins))+') logget!');
}
function updateLiveDisplay(){
  if(!liveTimerStart)return;
  const elapsed=Math.floor((Date.now()-liveTimerStart)/1000);
  const h=Math.floor(elapsed/3600),m=Math.floor((elapsed%3600)/60),s=elapsed%60;
  const el=document.getElementById('timer-live');
  if(el){el.textContent=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');el.className='timer-live-display running';}
}

function addManualEntry(){
  const proj=document.getElementById('man-project').value;
  const desc=document.getElementById('man-desc').value.trim();
  const date=document.getElementById('man-date').value||todayKey();
  const inn=document.getElementById('man-inn').value;
  const ut=document.getElementById('man-ut').value;
  if(!proj){alert('Velg prosjekt');return;}
  if(!inn||!ut){alert('Angi inn- og ut-tid');return;}
  const innMins=timeStrToMins(inn);const utMins=timeStrToMins(ut);
  if(utMins<=innMins){alert('Ut-tid m\u00e5 v\u00e6re etter inn-tid');return;}
  const mins=utMins-innMins;
  const hours=minsToHours(mins);
  timeLog.push({id:Date.now(),proj,desc,date,inn,ut,hours});
  document.getElementById('man-desc').value='';
  document.getElementById('man-inn').value='';
  document.getElementById('man-ut').value='';
  saveAll();renderTimerPage();
  showSavedToast(inn+' \u2013 '+ut+' ('+minsToStr(mins)+') lagt til!');
}

function deleteTimeEntry(id){const idx=timeLog.findIndex(e=>e.id===id);if(idx<0)return;timeLog.splice(idx,1);saveAll();renderTimerPage();}

function renderTimerPage(){
  // Restore stemplet-inn state from localStorage
  try{
    const saved=localStorage.getItem('adhd_inn');
    if(saved){
      const s=JSON.parse(saved);stempelInnTid=new Date(s.time);
      liveTimerStart=stempelInnTid.getTime();
      document.getElementById('timer-start-btn').style.display='none';
      document.getElementById('timer-out-btn').style.display='block';
      document.getElementById('timer-stamp-info').textContent='Stemplet inn '+fmtTime(stempelInnTid)+(s.proj?' \u00b7 '+s.proj:'');
      if(document.getElementById('timer-project-sel'))document.getElementById('timer-project-sel').value=s.proj||'';
      if(document.getElementById('timer-task-desc'))document.getElementById('timer-task-desc').value=s.desc||'';
      if(!liveTimerRunning){liveTimerRunning=true;liveTimerInt=setInterval(updateLiveDisplay,1000);}
    }
  }catch(e){}

  const today=todayKey();
  const dow=now.getDay();const monday=new Date(now);monday.setDate(now.getDate()-(dow===0?6:dow-1));
  const weekStart=fmtKey(monday.getFullYear(),monday.getMonth(),monday.getDate());

  const todayEntries=timeLog.filter(e=>e.date===today);
  const todayTotal=todayEntries.reduce((s,e)=>s+e.hours,0);
  const ttEl=document.getElementById('today-hours-total');
  if(ttEl)ttEl.textContent=todayTotal.toFixed(2)+'t ('+minsToStr(Math.round(todayTotal*60))+')';

  const todayEl=document.getElementById('today-entries');
  if(todayEl){
    if(!todayEntries.length){todayEl.innerHTML='<div class="empty-entries">Ingen oppf\u00f8ringer i dag</div>';}
    else{todayEl.innerHTML='';todayEntries.slice().reverse().forEach(e=>todayEl.appendChild(makeEntryEl(e)));}
  }

  const weekEntries=timeLog.filter(e=>e.date>=weekStart);
  const weekTotal=weekEntries.reduce((s,e)=>s+e.hours,0);
  const wtEl=document.getElementById('week-hours-total');
  if(wtEl)wtEl.textContent=weekTotal.toFixed(2)+'t denne uken';

  const weekEl=document.getElementById('week-summary');
  if(weekEl){
    if(!weekEntries.length){weekEl.innerHTML='<div style="font-size:13px;color:var(--muted)">Ingen timer logget denne uken</div>';}
    else{
      const byProj={};weekEntries.forEach(e=>{byProj[e.proj]=(byProj[e.proj]||0)+e.hours;});
      const maxH=Math.max(...Object.values(byProj));
      weekEl.innerHTML=Object.entries(byProj).sort((a,b)=>b[1]-a[1]).map(([proj,h],i)=>{
        const color=PROJECT_COLORS[i%PROJECT_COLORS.length];
        return '<div class="week-proj-row"><div style="width:10px;height:10px;border-radius:50%;background:'+color+';flex-shrink:0"></div><span class="week-proj-name">'+proj+'</span><div class="week-proj-bar-bg"><div class="week-proj-bar-fill" style="width:'+Math.round(h/maxH*100)+'%;background:'+color+'"></div></div><span class="week-proj-hours">'+h.toFixed(2)+'t</span></div>';
      }).join('');
    }
  }

  const allEl=document.getElementById('all-entries');
  if(allEl){
    if(!timeLog.length){allEl.innerHTML='<div class="empty-entries">Ingen timer logget enda</div>';}
    else{allEl.innerHTML='';timeLog.slice().reverse().slice(0,30).forEach(e=>allEl.appendChild(makeEntryEl(e)));}
  }
}

function makeEntryEl(e){
  const projIdx=projects.findIndex(p=>p.name===e.proj);
  const color=PROJECT_COLORS[projIdx>=0?projIdx%PROJECT_COLORS.length:0];
  const div=document.createElement('div');div.className='entry-item';
  const timeStr=e.inn&&e.ut?e.inn+' \u2013 '+e.ut:e.hours.toFixed(2)+'t';
  const dur=e.inn&&e.ut?'<span style="font-size:11px;color:var(--muted);margin-left:4px">('+minsToStr(Math.round(e.hours*60))+')</span>':'';
  div.innerHTML='<div class="entry-color" style="background:'+color+'"></div>'
    +'<div class="entry-info">'
    +'<div class="entry-proj">'+e.proj+'</div>'
    +(e.desc?'<div class="entry-desc">'+e.desc+'</div>':'')
    +'<div class="entry-date">'+e.date+'</div>'
    +'</div>'
    +'<div class="entry-hours" style="text-align:right"><div style="font-size:14px;font-weight:700;color:var(--text)">'+timeStr+'</div>'+dur+'</div>'
    +'<button class="entry-del" onclick="deleteTimeEntry('+e.id+')" title="Slett">&#128465;&#65039;</button>';
  return div;
}

function exportTimeCSV(){
  if(!timeLog.length){alert('Ingen timer \u00e5 eksportere');return;}
  const rows=[['Dato','Prosjekt','Beskrivelse','Inn','Ut','Timer'],...timeLog.map(e=>[e.date,e.proj,e.desc||'',e.inn||'',e.ut||'',e.hours.toFixed(2)])];
  const csv=rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download='timef\u00f8ring_'+todayKey()+'.csv';a.click();
}

// STATS
