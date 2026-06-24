// js/personal.js
// savePersonal is now defined centrally in storage.js (calls saveAll which syncs to Sheets too)
function loadPersonal(){try{
  const h=localStorage.getItem('pa_handel');if(h)handelList=JSON.parse(h);
  const hj=localStorage.getItem('pa_hjem');if(hj)hjemList=JSON.parse(hj);
  const v=localStorage.getItem('pa_vaner');if(v)vaner=JSON.parse(v);
  const tr=localStorage.getItem('pa_trening');if(tr)treningLog=JSON.parse(tr);
  const mi=localStorage.getItem('pa_matideas');if(mi)window.matIdeas=JSON.parse(mi);
  const s=localStorage.getItem('pa_sosialt');if(s)sosialtList=JSON.parse(s);
  const ok=localStorage.getItem('pa_ok');if(ok)okonomiList=JSON.parse(ok);
  const m=localStorage.getItem('pa_mal');if(m)malList=JSON.parse(m);
  const db=localStorage.getItem('pa_dagbok');if(db)dagbok=JSON.parse(db);
  const fr=localStorage.getItem('pa_fritid');if(fr)fritidList=JSON.parse(fr);const nb=localStorage.getItem('pa_notebooks');if(nb)notebooks=JSON.parse(nb);
}catch(e){}}

// helper: generic checklist renderer
function renderChecklist(arr,elId,onToggle,onDelete){
  const el=document.getElementById(elId);if(!el)return;
  if(!arr.length){el.innerHTML='<div class="empty-entries">Tomt!</div>';return;}
  el.innerHTML='';
  arr.forEach((item,i)=>{
    const div=document.createElement('div');div.className='task-item'+(item.done?' done':'');
    div.innerHTML='<div class="check" onclick="'+onToggle+'('+i+')">'+(item.done?'\u2713':'')+'</div><span class="task-text">'+item.text+'</span><button class="entry-del" onclick="'+onDelete+'('+i+')">&#128465;&#65039;</button>';
    el.appendChild(div);
  });
}

// HANDLELISTE
function renderHandel(){
  const el=document.getElementById('handel-list');if(!el)return;
  const undone=handelList.filter(x=>!x.done);const done=handelList.filter(x=>x.done);
  el.innerHTML='';
  [...undone,...done].forEach((item,ri)=>{
    const i=handelList.indexOf(item);
    const div=document.createElement('div');div.className='task-item'+(item.done?' done':'');
    div.innerHTML='<div class="check" onclick="toggleHandel('+i+')">'+(item.done?'\u2713':'')+'</div><span class="task-text">'+item.text+'</span>'+(item.qty?'<span style="font-size:11px;color:var(--muted);flex-shrink:0">'+item.qty+'</span>':'')+' <button class="entry-del" onclick="deleteHandel('+i+')">&#128465;&#65039;</button>';
    el.appendChild(div);
  });
  const ar=document.createElement('div');ar.className='add-row';
  ar.innerHTML='<input id="handel-input" placeholder="Legg til vare\u2026" onkeydown="if(event.key===\'Enter\')addHandel()"><input id="handel-qty" placeholder="Antall" style="width:70px;border:none;outline:none;font-size:13px;color:var(--muted);background:transparent;font-family:var(--font)"><button class="add-btn" onclick="addHandel()">+</button>';
  el.appendChild(ar);
}
function addHandel(){const i=document.getElementById('handel-input');const q=document.getElementById('handel-qty');if(!i||!i.value.trim())return;handelList.push({text:i.value.trim(),qty:q?q.value.trim():'',done:false});i.value='';if(q)q.value='';savePersonal();renderHandel();}
function toggleHandel(i){if(handelList[i])handelList[i].done=!handelList[i].done;savePersonal();renderHandel();}
function deleteHandel(i){handelList.splice(i,1);savePersonal();renderHandel();}

// HJEM
function renderHjem(){
  const el=document.getElementById('hjem-list');if(!el)return;
  if(!hjemList.length){el.innerHTML='<div class="empty-entries">Ingen gj\u00f8rem\u00e5l!</div>';}
  else{el.innerHTML='';hjemList.forEach((item,i)=>{const div=document.createElement('div');div.className='task-item'+(item.done?' done':'');div.innerHTML='<div class="check" onclick="toggleHjem('+i+')">'+(item.done?'\u2713':'')+'</div><span class="task-text">'+item.text+'</span><button class="entry-del" onclick="deleteHjem('+i+')">&#128465;&#65039;</button>';el.appendChild(div);});}
  const ar=document.createElement('div');ar.className='add-row';ar.innerHTML='<input id="hjem-input" placeholder="F.eks. St\u00f8vsuge, vaske" onkeydown="if(event.key===\'Enter\')addHjem()"><button class="add-btn" onclick="addHjem()">+</button>';el.appendChild(ar);
}
function addHjem(){const i=document.getElementById('hjem-input');if(!i||!i.value.trim())return;hjemList.push({text:i.value.trim(),done:false});i.value='';savePersonal();renderHjem();}
function toggleHjem(i){if(hjemList[i])hjemList[i].done=!hjemList[i].done;savePersonal();renderHjem();}
function deleteHjem(i){hjemList.splice(i,1);savePersonal();renderHjem();}

// VANER
function renderVaner(){
  const el=document.getElementById('vaner-grid');if(!el)return;
  if(!vaner.length){el.innerHTML='<div style="font-size:13px;color:var(--muted)">Ingen vaner enda \u2013 legg til under!</div>';return;}
  const today=todayKey();
  el.innerHTML=vaner.map((v,i)=>{
    const done=(v.log||[]).includes(today);
    return '<div style="display:flex;align-items:center;gap:12px;padding:.75rem 0;border-bottom:1px solid var(--border)">'
      +'<div onclick="toggleVane('+i+')" style="width:28px;height:28px;border-radius:50%;border:2px solid '+(done?'var(--green-text)':'var(--border)')+';background:'+(done?'var(--green)':'transparent')+';display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px">'+(done?'\u2713':'')+'</div>'
      +'<span style="font-size:20px">'+v.icon+'</span>'
      +'<span style="flex:1;font-size:15px;color:var(--text);font-family:var(--font)">'+v.name+'</span>'
      +'<span style="font-size:11px;color:var(--muted)">'+(v.streak||0)+' dager</span>'
      +'<button class="entry-del" onclick="deleteVane('+i+')">&#128465;&#65039;</button>'
      +'</div>';
  }).join('');
}
function addVane(){const n=document.getElementById('vane-name');const ic=document.getElementById('vane-icon');if(!n||!n.value.trim())return;vaner.push({name:n.value.trim(),icon:ic&&ic.value.trim()?ic.value.trim():'\u2b50',log:[],streak:0});n.value='';if(ic)ic.value='';savePersonal();renderVaner();}
function toggleVane(i){const today=todayKey();const v=vaner[i];if(!v)return;if((v.log||[]).includes(today)){v.log=v.log.filter(d=>d!==today);v.streak=Math.max(0,(v.streak||1)-1);}else{v.log=[...(v.log||[]),today];v.streak=(v.streak||0)+1;}savePersonal();renderVaner();}
function deleteVane(i){vaner.splice(i,1);savePersonal();renderVaner();}

// TRENING
function renderTrening(){
  const el=document.getElementById('trening-history');if(!el)return;
  if(!treningLog.length){el.innerHTML='<div class="empty-entries">Ingen \u00f8kter logget enda</div>';return;}
  el.innerHTML='';
  treningLog.slice().reverse().slice(0,10).forEach(t=>{
    const div=document.createElement('div');div.className='entry-item';
    div.innerHTML='<div class="entry-info"><div class="entry-proj">'+t.type+'</div>'+(t.note?'<div class="entry-desc">'+t.note+'</div>':'')+'<div class="entry-date">'+t.date+(t.min?' \u00b7 '+t.min+' min':'')+'</div></div>';
    el.appendChild(div);
  });
}
function addTrening(){const type=document.getElementById('trening-type').value.trim();if(!type)return;const date=document.getElementById('trening-date').value||todayKey();const min=document.getElementById('trening-min').value;const note=document.getElementById('trening-note').value.trim();treningLog.push({type,date,min,note});['trening-type','trening-min','trening-note'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});savePersonal();renderTrening();showSavedToast('\u00d8kt logget!');}
const UKEDAGER=['Man','Tir','Ons','Tor','Fre','L\u00f8r','S\u00f8n'];

// MAT
function renderMat(){
  const el=document.getElementById('mat-week');if(!el)return;
  const dow=now.getDay();const monday=new Date(now);monday.setDate(now.getDate()-(dow===0?6:dow-1));
  el.innerHTML='<div style="font-size:11px;font-weight:700;color:var(--muted);margin-bottom:.75rem;text-transform:uppercase;letter-spacing:.06em">Ukens m\u00e5ltider</div>';
  for(let i=0;i<7;i++){
    const day=new Date(monday);day.setDate(monday.getDate()+i);const key=fmtKey(day.getFullYear(),day.getMonth(),day.getDate());
    const stored=localStorage.getItem('mat_'+key)||'';
    const isToday=day.getDate()===todayD&&day.getMonth()===todayM;
    el.innerHTML+='<div style="display:flex;align-items:flex-start;gap:10px;padding:.5rem 0;border-bottom:1px solid var(--border)">'
      +'<div style="font-size:12px;font-weight:700;color:'+(isToday?'var(--pink-dark)':'var(--muted)')+';min-width:32px;padding-top:2px">'+UKEDAGER[i]+'</div>'
      +'<input onchange="saveMat(\''+key+'\',this.value)" value="'+stored+'" placeholder="Middag..." style="flex:1;border:none;outline:none;font-size:14px;font-family:var(--font);color:var(--text);background:transparent;border-bottom:1px solid '+(isToday?'var(--pink-mid)':'transparent')+'">'
      +'</div>';
  }
  const ideas=document.getElementById('mat-ideas');if(!ideas)return;
  if(!window.matIdeas.length){ideas.innerHTML='<div class="empty-entries">Ingen ideer enda</div>';return;}
  ideas.innerHTML='';window.matIdeas.forEach((idea,i)=>{const div=document.createElement('div');div.className='entry-item';div.innerHTML='<span class="task-text">'+idea+'</span><button class="entry-del" onclick="deleteMatIdea('+i+')">&#128465;&#65039;</button>';ideas.appendChild(div);});
}
function saveMat(key,val){localStorage.setItem('mat_'+key,val);}
function addMatIdea(){const i=document.getElementById('mat-idea-input');if(!i||!i.value.trim())return;window.matIdeas.push(i.value.trim());i.value='';savePersonal();renderMat();}
function deleteMatIdea(i){window.matIdeas.splice(i,1);savePersonal();renderMat();}

// SOSIALT
function renderSosialt(){
  const el=document.getElementById('sosialt-list');if(!el)return;
  if(!sosialtList.length){el.innerHTML='<div class="empty-entries">Ingen avtaler</div>';return;}
  el.innerHTML='';
  sosialtList.sort((a,b)=>a.date>b.date?1:-1).forEach((item,i)=>{
    const div=document.createElement('div');div.className='entry-item';
    div.innerHTML='<div class="entry-info"><div class="entry-proj">'+item.text+'</div><div class="entry-date">'+item.date+'</div></div><button class="entry-del" onclick="deleteSosialt('+i+')">&#128465;&#65039;</button>';
    el.appendChild(div);
  });
}
function addSosialt(){const t=document.getElementById('sosialt-input');const d=document.getElementById('sosialt-date');if(!t||!t.value.trim())return;sosialtList.push({text:t.value.trim(),date:d?d.value:todayKey()});t.value='';if(d)d.value='';savePersonal();renderSosialt();}
function deleteSosialt(i){sosialtList.splice(i,1);savePersonal();renderSosialt();}

// &#216;KONOMI
function renderOkonomi(){
  const inntekt=okonomiList.filter(x=>x.type==='inntekt').reduce((s,x)=>s+x.amount,0);
  const utgift=okonomiList.filter(x=>x.type==='utgift').reduce((s,x)=>s+x.amount,0);
  const sb=document.getElementById('okonomi-stats');
  if(sb)sb.innerHTML='<div class="stat-box"><div class="stat-num" style="color:var(--green-text)">'+inntekt.toLocaleString('no-NO')+'</div><div class="stat-lbl">Inntekt (kr)</div></div><div class="stat-box"><div class="stat-num" style="color:var(--pink-dark)">'+utgift.toLocaleString('no-NO')+'</div><div class="stat-lbl">Utgifter (kr)</div></div>';
  const el=document.getElementById('okonomi-list');if(!el)return;
  if(!okonomiList.length){el.innerHTML='<div class="empty-entries">Ingen transaksjoner</div>';return;}
  el.innerHTML='';
  okonomiList.slice().reverse().slice(0,20).forEach((item,ri)=>{
    const i=okonomiList.length-1-ri;
    const div=document.createElement('div');div.className='entry-item';
    div.innerHTML='<div style="width:5px;align-self:stretch;border-radius:3px;flex-shrink:0;background:'+(item.type==='inntekt'?'var(--green)':'var(--pink)')+'"></div><div class="entry-info"><div class="entry-proj">'+item.desc+'</div><div class="entry-date">'+item.date+'</div></div><div class="entry-hours" style="color:'+(item.type==='inntekt'?'var(--green-text)':'var(--pink-dark)')+'">'+(item.type==='inntekt'?'+':'-')+item.amount.toLocaleString('no-NO')+'</div><button class="entry-del" onclick="deleteOkonomi('+i+')">&#128465;&#65039;</button>';
    el.appendChild(div);
  });
}
function addOkonomi(){const desc=document.getElementById('ok-desc').value.trim();const amount=parseFloat(document.getElementById('ok-amount').value);const type=document.getElementById('ok-type').value;const date=document.getElementById('ok-date').value||todayKey();if(!desc||!amount)return;okonomiList.push({desc,amount,type,date});['ok-desc','ok-amount'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});savePersonal();renderOkonomi();showSavedToast('Transaksjon lagret!');}
function deleteOkonomi(i){okonomiList.splice(i,1);savePersonal();renderOkonomi();}

// M&#197;L
function renderMal(){
  const el=document.getElementById('mal-list');if(!el)return;
  if(!malList.length){el.innerHTML='<div class="empty-entries">Ingen m\u00e5l enda</div>';return;}
  el.innerHTML='';
  malList.forEach((item,i)=>{
    const div=document.createElement('div');div.className='project-item';
    div.innerHTML='<div class="project-top"><span class="project-name">'+item.text+'</span><div class="pct-controls"><span style="font-size:10px;color:var(--muted);background:var(--surface2);padding:3px 8px;border-radius:20px">'+item.cat+'</span><button class="pct-btn" onclick="toggleMal('+i+')" style="'+(item.done?'background:var(--green);border-color:var(--green-text)':'')+'">'+(item.done?'\u2713':'')+'</button><button class="pct-btn" onclick="deleteMal('+i+')">&#128465;&#65039;</button></div></div>';
    el.appendChild(div);
  });
}
function addMal(){const t=document.getElementById('mal-input');const c=document.getElementById('mal-cat');if(!t||!t.value.trim())return;malList.push({text:t.value.trim(),cat:c?c.value:'Annet',done:false});t.value='';savePersonal();renderMal();}
function toggleMal(i){if(malList[i])malList[i].done=!malList[i].done;savePersonal();renderMal();}
function deleteMal(i){malList.splice(i,1);savePersonal();renderMal();}

// DAGBOK
let dagbokMood=2;
function renderDagbok(){
  const lbl=document.getElementById('dagbok-date-lbl');if(lbl)lbl.textContent=DAYS_NO[now.getDay()]+' '+todayD+'. '+MONTHS_NO[todayM];
  const moodRow=document.getElementById('dagbok-mood-row');
  if(moodRow){moodRow.innerHTML='';MOODS.forEach(({e,l},i)=>{const btn=document.createElement('button');btn.className='mood-btn'+(i===dagbokMood?' selected':'');btn.style.cssText='flex:1;padding:.5rem;border:1.5px solid var(--border);border-radius:10px;font-size:20px;cursor:pointer;background:'+(i===dagbokMood?'var(--pink)':'var(--surface)')+';border-color:'+(i===dagbokMood?'var(--pink-dark)':'var(--border)');btn.textContent=e;btn.onclick=()=>{dagbokMood=i;renderDagbok();};moodRow.appendChild(btn);});}
  const today=todayKey();const ex=dagbok.find(d=>d.date===today);
  const ta=document.getElementById('dagbok-text');if(ta&&ex&&!ta.value)ta.value=ex.text||'';
  const hist=document.getElementById('dagbok-history');if(!hist)return;
  hist.innerHTML='';
  dagbok.slice().reverse().slice(0,7).forEach(d=>{
    const div=document.createElement('div');div.className='retro-entry';
    div.innerHTML='<strong>'+d.dateLabel+'</strong>'+(d.mood!==undefined?MOODS[d.mood]?.e+' ':'')+d.text.slice(0,120)+(d.text.length>120?'\u2026':'');
    hist.appendChild(div);
  });
}
function saveDagbok(){const ta=document.getElementById('dagbok-text');if(!ta||!ta.value.trim())return;const today=todayKey();const entry={date:today,dateLabel:DAYS_NO[now.getDay()]+' '+todayD+'. '+MONTHS_NO[todayM],text:ta.value.trim(),mood:dagbokMood};const idx=dagbok.findIndex(d=>d.date===today);if(idx>=0)dagbok[idx]=entry;else dagbok.push(entry);if(dagbok.length>90)dagbok.shift();savePersonal();renderDagbok();showSavedToast('Dagbokinnlegg lagret!');}

// FRITID
function renderFritid(){
  const el=document.getElementById('fritid-list');if(!el)return;
  if(!fritidList.length){el.innerHTML='<div class="empty-entries">Ingen prosjekter enda</div>';return;}
  el.innerHTML='';
  fritidList.forEach((item,i)=>{
    const div=document.createElement('div');div.className='project-item';
    div.innerHTML='<div class="project-top"><span class="project-name">'+item.name+'</span><div class="pct-controls"><button class="pct-btn" onclick="adjustFritidPct('+i+',-10)">\u2013</button><span class="project-pct">'+item.pct+'%</span><button class="pct-btn" onclick="adjustFritidPct('+i+',10)">+</button><button class="pct-btn" onclick="deleteFritid('+i+')" style="border-color:#e89ab5;color:#c4608a;font-size:14px">&#128465;&#65039;</button></div></div>'+(item.desc?'<div style="font-size:12px;color:var(--muted);margin-bottom:.5rem">'+item.desc+'</div>':'')+'<div class="progress-bg"><div class="progress-fill" style="width:'+item.pct+'%"></div></div>';
    el.appendChild(div);
  });
}
function addFritid(){const n=document.getElementById('fritid-input');const d=document.getElementById('fritid-desc');if(!n||!n.value.trim())return;fritidList.push({name:n.value.trim(),desc:d?d.value.trim():'',pct:0});n.value='';if(d)d.value='';savePersonal();renderFritid();}
function adjustFritidPct(i,delta){if(fritidList[i])fritidList[i].pct=Math.max(0,Math.min(100,fritidList[i].pct+delta));savePersonal();renderFritid();}
function deleteFritid(i){fritidList.splice(i,1);savePersonal();renderFritid();}

// Update showPage to render personal pages
const _origShowPage=showPage;



// ════════════════════
// NOTEBOOKS (OneNote-stil)
// ════════════════════
const LAPP_COLORS=[
  {bg:'#fdeea3',name:'Gul'},{bg:'#f7c5d5',name:'Rosa'},{bg:'#b8e8c8',name:'Gr\u00f8nn'},
  {bg:'#b8d4f8',name:'Bl\u00e5'},{bg:'#e2b8f8',name:'Lilla'},{bg:'#ffc8a2',name:'Oransje'},
  {bg:'#ffffff',name:'Hvit'},{bg:'#ede9ed',name:'Gr\u00e5'}
];

