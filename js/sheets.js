// js/sheets.js
function setSyncStatus(s){
  const dot=document.getElementById('sync-dot');
  const mkB=(txt,cls)=>'<div class="banner '+cls+'"><span>'+txt+'</span></div>';
  if(s==='connected'){dot.className='sync-dot ok';document.getElementById('banner-wrap').innerHTML=mkB('Koblet til Google Sheets','connected');document.getElementById('banner-settings').innerHTML=mkB('Koblet til Google Sheets','connected');}
  else if(s==='syncing'){dot.className='sync-dot syncing';}
  else{dot.className='sync-dot off';document.getElementById('banner-wrap').innerHTML=mkB('Ikke koblet til Sheets - lagres lokalt','disconnected');document.getElementById('banner-settings').innerHTML=mkB('Ikke koblet til Sheets','disconnected');}
}

async function saveConfig(){
  const url=document.getElementById('sheets-url').value.trim();if(!url)return;
  sheetsUrl=url;try{localStorage.setItem('adhd_sheets_url',url);}catch(e){}
  setSyncStatus('syncing');
  try{
    const r=await fetch(url+'?action=ping');const d=await r.json();
    if(d.ok){setSyncStatus('connected');await loadFromSheets();}
    else{setSyncStatus('disconnected');}
  }catch(e){setSyncStatus('disconnected');}
}
function clearConfig(){sheetsUrl='';try{localStorage.removeItem('adhd_sheets_url');}catch(e){}setSyncStatus('disconnected');document.getElementById('sheets-url').value='';}

async function sheetsGet(sheet){
  if(!sheetsUrl)return null;
  try{const r=await fetch(sheetsUrl+'?action=get&sheet='+encodeURIComponent(sheet));const d=await r.json();return d.ok?d.rows:null;}
  catch(e){return null;}
}
async function sheetsSave(sheet,data){
  if(!sheetsUrl)return;
  try{await fetch(sheetsUrl,{method:'POST',body:JSON.stringify({action:'save',sheet,data})});}
  catch(e){}
}
async function sheetsGetBlob(sheet){
  if(!sheetsUrl)return null;
  try{const r=await fetch(sheetsUrl+'?action=getBlob&sheet='+encodeURIComponent(sheet));const d=await r.json();return d.ok?d.json:null;}
  catch(e){return null;}
}
async function sheetsSaveBlob(sheet,jsonObj){
  if(!sheetsUrl)return;
  try{await fetch(sheetsUrl,{method:'POST',body:JSON.stringify({action:'saveBlob',sheet,json:jsonObj})});}
  catch(e){}
}

async function loadFromSheets(){
  const results = await Promise.all([
    sheetsGet('Oppgaver'),
    sheetsGet('Oppgaver_Arkiv'),
    sheetsGet('Oppgaver_Backlog'),
    sheetsGet('Prosjekter'),
    sheetsGet('Møtenotater'),
    sheetsGetBlob('Møte_Kategorier'),
    sheetsGet('Retro_Daglig'),
    sheetsGet('Retro_Ukentlig'),
    sheetsGet('Retro_Månedlig'),
    sheetsGet('Energilogg'),
    sheetsGet('Humørlogg'),
    sheetsGet('Kalender'),
    sheetsGet('Timeføring'),
    sheetsGetBlob('Prioriteringsmatrise'),
    sheetsGetBlob('Notater_Mapper'),
    sheetsGetBlob('Personal_Handleliste'),
    sheetsGetBlob('Personal_Gjøremål'),
    sheetsGetBlob('Personal_Vaner'),
    sheetsGetBlob('Personal_Trening'),
    sheetsGetBlob('Personal_Matideer'),
    sheetsGetBlob('Personal_Sosialt'),
    sheetsGetBlob('Personal_Økonomi'),
    sheetsGetBlob('Personal_Mål'),
    sheetsGetBlob('Personal_Dagbok'),
    sheetsGetBlob('Personal_Fritid'),
  ]);
  const [t, archive, backlog, p, m, mCats, rd, rw, rm, en, mo, ev, tl, mat, nb,
    handel, hjem, vanerData, trening, matIdeas, sosialt, okonomi, mal, dagbokData, fritid] = results;

  if(t) tasks=t.map(row=>({id:row['ID']||Date.now(),text:row['Tekst']||'',done:row['Ferdig']==='true'||row['Ferdig']===true,color:parseInt(row['Farge'])||0,recur:row['Recur']||null}));
  if(archive) taskArchive=archive.map(row=>({id:row['ID'],text:row['Tekst'],completedDate:row['FullfortDato']}));
  if(backlog) taskBacklog=backlog.map(row=>({id:row['ID'],text:row['Tekst'],missedDate:row['MissetDato'],comment:row['Kommentar']||'',needsComment:!row['Kommentar'],color:parseInt(row['Farge'])||0}));
  if(p) projects=p.map(row=>({id:row['ID'],name:row['Navn'],pct:parseInt(row['Prosent'])||0}));
  if(m) meetings=m.map(row=>({title:row['Tittel'],cat:row['Kategori']||'',people:row['Deltakere'],decisions:row['Beslutninger'],actions:row['Handlinger'],date:row['Dato']}));
  if(mCats) meetingCategories=mCats.cats||[];

  if(rd) retroDaily=rd.map(row=>({key:row['Dato'],good:row['Bra'],block:row['Stoppet'],next:row['IMorgen'],energy:parseInt(row['Energi'])||0,dateLabel:row['DatoLabel']}));
  if(rw) retros=rw.map(row=>({wk:row['UkeNøkkel'],dateLabel:row['DatoLabel'],good:row['Bra'],hard:row['Vanskelig'],next:row['Neste'],proud:row['Stolt']||''}));
  if(rm) retroMonthly=rm.map(row=>({mk:row['MånedNøkkel'],win:row['Seier'],learn:row['Lærte'],change:row['Vane'],words:row['Ord'],goal:row['Mål'],monthLabel:row['MånedLabel']}));

  if(en) en.forEach(row=>{const k=row['Dato'];if(k)energyLog[k]=[row['Slot0'],row['Slot1'],row['Slot2'],row['Slot3'],row['Slot4']].map(Number);});
  if(mo) moodLog=mo.map(row=>({i:parseInt(row['MoodIndex'])||0,time:row['Tidspunkt'],date:row['Dato']}));
  if(ev) ev.forEach(row=>{const k=row['Dato'];if(k){if(!events[k])events[k]=[];events[k].push({name:row['Navn'],desc:row['Beskrivelse']});}});
  if(tl) timeLog=tl.map(row=>({id:row['ID']||Date.now(),proj:row['Prosjekt'],desc:row['Beskrivelse']||'',date:row['Dato'],inn:row['Inn']||'',ut:row['Ut']||'',hours:parseFloat(row['Timer'])||0}));

  if(mat) matriseItems=mat;
  if(nb && nb.notebooks) { notebooks=nb.notebooks; activeNotebook=nb.activeNotebook||0; }

  if(handel) handelList=handel.items||[];
  if(hjem) hjemList=hjem.items||[];
  if(vanerData) vaner=vanerData.items||[];
  if(trening) treningLog=trening.items||[];
  if(matIdeas) window.matIdeas=matIdeas.items||[];
  if(sosialt) sosialtList=sosialt.items||[];
  if(okonomi) okonomiList=okonomi.items||[];
  if(mal) malList=mal.items||[];
  if(dagbokData) dagbok=dagbokData.items||[];
  if(fritid) fritidList=fritid.items||[];

  renderAll();
}

function saveAllToSheets(){
  if(!sheetsUrl)return;
  setSyncStatus('syncing');
  const ds=todayKey();

  sheetsSave('Oppgaver', tasks.map(t=>({'ID':t.id,'Tekst':t.text,'Ferdig':String(t.done),'Farge':t.color||0,'Recur':t.recur||'','Dato':ds})));
  sheetsSave('Oppgaver_Arkiv', taskArchive.map(t=>({'ID':t.id,'Tekst':t.text,'FullfortDato':t.completedDate||''})));
  sheetsSave('Oppgaver_Backlog', taskBacklog.map(t=>({'ID':t.id,'Tekst':t.text,'MissetDato':t.missedDate||'','Kommentar':t.comment||'','Farge':t.color||0})));
  sheetsSave('Prosjekter', projects.map(p=>({'ID':p.id,'Navn':p.name,'Prosent':p.pct,'Oppdatert':ds})));

  const evR=[];Object.entries(events).forEach(([dt,evs])=>evs.forEach(ev=>evR.push({'Dato':dt,'Navn':ev.name,'Beskrivelse':ev.desc||''})));
  sheetsSave('Kalender', evR);

  const enR=Object.entries(energyLog).map(([dt,s])=>({'Dato':dt,'Slot0':s[0]||0,'Slot1':s[1]||0,'Slot2':s[2]||0,'Slot3':s[3]||0,'Slot4':s[4]||0}));
  sheetsSave('Energilogg', enR);

  sheetsSave('Humørlogg', moodLog.map(m=>({'Tidspunkt':m.time,'Dato':m.date,'MoodIndex':m.i,'MoodLabel':(MOODS[m.i]&&MOODS[m.i].l)||''})));
  sheetsSave('Møtenotater', meetings.map((m,i)=>({'ID':i+1,'Tittel':m.title,'Kategori':m.cat||'','Deltakere':m.people,'Beslutninger':m.decisions,'Handlinger':m.actions,'Dato':m.date})));

  sheetsSave('Retro_Daglig', retroDaily.map(r=>({'Dato':r.key,'Bra':r.good,'Stoppet':r.block,'IMorgen':r.next,'Energi':r.energy,'DatoLabel':r.dateLabel})));
  sheetsSave('Retro_Ukentlig', retros.map(r=>({'UkeNøkkel':r.wk,'DatoLabel':r.dateLabel,'Bra':r.good,'Vanskelig':r.hard,'Neste':r.next,'Stolt':r.proud||''})));
  sheetsSave('Retro_Månedlig', retroMonthly.map(r=>({'MånedNøkkel':r.mk,'Seier':r.win,'Lærte':r.learn,'Vane':r.change,'Ord':r.words,'Mål':r.goal,'MånedLabel':r.monthLabel})));

  sheetsSave('Timeføring', timeLog.map(e=>({'ID':e.id,'Prosjekt':e.proj,'Beskrivelse':e.desc||'','Dato':e.date,'Inn':e.inn||'','Ut':e.ut||'','Timer':e.hours})));

  sheetsSaveBlob('Møte_Kategorier', {cats: meetingCategories||[]});
  sheetsSaveBlob('Prioriteringsmatrise', matriseItems);
  sheetsSaveBlob('Notater_Mapper', {notebooks: notebooks, activeNotebook: activeNotebook});

  sheetsSaveBlob('Personal_Handleliste', {items: handelList});
  sheetsSaveBlob('Personal_Gjøremål', {items: hjemList});
  sheetsSaveBlob('Personal_Vaner', {items: vaner});
  sheetsSaveBlob('Personal_Trening', {items: treningLog});
  sheetsSaveBlob('Personal_Matideer', {items: window.matIdeas||[]});
  sheetsSaveBlob('Personal_Sosialt', {items: sosialtList});
  sheetsSaveBlob('Personal_Økonomi', {items: okonomiList});
  sheetsSaveBlob('Personal_Mål', {items: malList});
  sheetsSaveBlob('Personal_Dagbok', {items: dagbok});
  sheetsSaveBlob('Personal_Fritid', {items: fritidList});

  setTimeout(function(){setSyncStatus('connected');}, 600);
}
