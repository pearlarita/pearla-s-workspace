// js/meetings.js
function renderProjects(){
  const el=document.getElementById('project-list');el.innerHTML='';
  if(!projects.length){el.innerHTML='<div style="padding:1.25rem;font-size:14px;color:var(--muted);font-family:var(--font)">Ingen prosjekter enda.</div>';}
  projects.forEach((p,idx)=>{
    const div=document.createElement('div');div.className='project-item';
    div.innerHTML='<div class="project-top"><span class="project-name">'+p.name+'</span><div class="pct-controls"><button class="pct-btn" onclick="adjustPct('+idx+',-10)">\u2013</button><span class="project-pct">'+p.pct+'%</span><button class="pct-btn" onclick="adjustPct('+idx+',10)">+</button><button class="pct-btn" onclick="deleteProject('+idx+')" style="border-color:#e89ab5;color:#c4608a;font-size:14px">&#128465;&#65039;</button></div></div><div class="progress-bg"><div class="progress-fill" style="width:'+p.pct+'%"></div></div>';
    el.appendChild(div);
  });
  const ar=document.createElement('div');ar.className='project-add';
  ar.innerHTML='<input id="np" placeholder="Nytt prosjektnavn\u2026" maxlength="40" onkeydown="if(event.key===\'Enter\')addProject()"><button class="add-btn" onclick="addProject()">+</button>';
  el.appendChild(ar);
}
function addProject(){const i=document.getElementById('np');if(!i||!i.value.trim())return;projects.push({id:Date.now(),name:i.value.trim(),pct:0});i.value='';saveAll();renderProjects();populateProjectSelects();}
function adjustPct(idx,delta){projects[idx].pct=Math.max(0,Math.min(100,projects[idx].pct+delta));saveAll();renderProjects();}

// MEETINGS
function renderMeetings(){
  populateCatSelect();
  const el=document.getElementById('saved-meetings');el.innerHTML='';
  if(!meetings.length){el.innerHTML='<div style="font-size:13px;color:var(--muted);padding:.25rem 0;font-family:var(--font)">Ingen m\u00f8ter enda.</div>';return;}
  // Filter by active category if set
  const filterCat=window._meetingFilter||'';
  // Category filter chips above list
  const cats=[...new Set(meetings.map(m=>m.cat).filter(Boolean))];
  if(cats.length){
    const filterWrap=document.createElement('div');filterWrap.style.cssText='display:flex;gap:6px;flex-wrap:wrap;margin-bottom:.75rem';
    const allBtn=document.createElement('button');allBtn.textContent='Alle';allBtn.style.cssText='padding:4px 12px;border-radius:20px;border:1.5px solid '+(filterCat?'var(--border)':'var(--pink-mid)')+';background:'+(filterCat?'transparent':'var(--pink)')+';color:'+(filterCat?'var(--muted)':'var(--pink-text)')+';font-size:12px;font-weight:700;cursor:pointer;font-family:var(--font)';
    allBtn.onclick=()=>{window._meetingFilter='';renderMeetings();};filterWrap.appendChild(allBtn);
    cats.forEach(cat=>{const btn=document.createElement('button');btn.textContent=cat;btn.style.cssText='padding:4px 12px;border-radius:20px;border:1.5px solid '+(filterCat===cat?'var(--pink-mid)':'var(--border)')+';background:'+(filterCat===cat?'var(--pink)':'transparent')+';color:'+(filterCat===cat?'var(--pink-text)':'var(--muted)')+';font-size:12px;font-weight:700;cursor:pointer;font-family:var(--font)';btn.onclick=()=>{window._meetingFilter=cat;renderMeetings();};filterWrap.appendChild(btn);});
    el.appendChild(filterWrap);
  }
  const shown=filterCat?meetings.filter(m=>m.cat===filterCat):meetings;
  shown.slice().reverse().forEach((m,ri)=>{
    const realIdx=meetings.indexOf(m);
    const div=document.createElement('div');div.className='saved-item';div.style.cssText='position:relative';
    div.innerHTML='<div style="display:flex;align-items:flex-start;gap:8px">'
      +'<div style="flex:1"><div class="si-title">'+m.title+'</div>'
      +'<div class="si-meta">'+m.date+(m.people?' \u00b7 '+m.people:'')+(m.cat?' \u00b7 <span style="background:var(--pink);color:var(--pink-text);border-radius:20px;padding:1px 7px;font-size:10px;font-weight:700">'+m.cat+'</span>':'')+'</div></div>'
      +'<button onclick="confirmDeleteMeeting('+realIdx+',event)" style="background:none;border:none;cursor:pointer;font-size:16px;padding:2px;color:var(--muted);flex-shrink:0">&#128465;&#65039;</button>'
      +'</div>';
    div.onclick=(e)=>{
      if(e.target.closest('button'))return;
      document.getElementById('m-title').value=m.title;
      document.getElementById('m-cat').value=m.cat||'';
      document.getElementById('m-people').value=m.people;
      document.getElementById('m-decisions').value=m.decisions;
      document.getElementById('m-actions').value=m.actions;
      document.getElementById('scroll-area').scrollTop=0;
    };
    el.appendChild(div);
  });
}

function confirmDeleteMeeting(idx,e){
  e.stopPropagation();
  const m=meetings[idx];if(!m)return;
  const existing=document.getElementById('del-meeting-confirm');if(existing)existing.remove();
  const toast=document.createElement('div');toast.id='del-meeting-confirm';
  toast.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--text);color:#fff;border-radius:14px;padding:1rem 1.25rem;z-index:600;width:88%;max-width:320px;box-shadow:0 8px 24px rgba(0,0,0,.25);font-family:var(--font)';
  toast.innerHTML='<div style="font-size:14px;font-weight:700;margin-bottom:.75rem">Slette \"'+m.title+'\"?</div><div style="font-size:12px;color:rgba(255,255,255,.7);margin-bottom:.875rem">Dette kan ikke angres.</div><div style="display:flex;gap:8px"><button onclick="doDeleteMeeting('+idx+')" style="flex:1;padding:.7rem;background:#c4608a;border:none;border-radius:10px;color:#fff;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font)">Slett</button><button onclick="document.getElementById(\'del-meeting-confirm\').remove()" style="flex:1;padding:.7rem;background:rgba(255,255,255,.15);border:none;border-radius:10px;color:#fff;font-size:14px;cursor:pointer;font-family:var(--font)">Avbryt</button></div>';
  document.body.appendChild(toast);
  setTimeout(()=>{const t=document.getElementById('del-meeting-confirm');if(t)t.remove();},5000);
}
function doDeleteMeeting(idx){
  const t=document.getElementById('del-meeting-confirm');if(t)t.remove();
  meetings.splice(idx,1);saveAll();renderMeetings();showSavedToast('M\u00f8tenotat slettet');
}
function saveMeeting(){
  const title=document.getElementById('m-title').value.trim();if(!title)return;
  const cat=(document.getElementById('m-cat')&&document.getElementById('m-cat').value)||'';
  const d=new Date();
  meetings.push({title,cat,people:document.getElementById('m-people').value.trim(),decisions:document.getElementById('m-decisions').value.trim(),actions:document.getElementById('m-actions').value.trim(),date:d.getDate()+'. '+MONTHS_NO[d.getMonth()]});
  ['m-title','m-people','m-decisions','m-actions'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  const mcat=document.getElementById('m-cat');if(mcat)mcat.value='';
  saveAll();renderMeetings();showSavedToast('M\u00f8tenotat lagret!');
}

let meetingCategories=[];
function loadMeetingCats(){try{const c=localStorage.getItem('adhd_meetcats');if(c)meetingCategories=JSON.parse(c);}catch(e){}}
function saveMeetingCats(){try{localStorage.setItem('adhd_meetcats',JSON.stringify(meetingCategories));}catch(e){}}

function populateCatSelect(){
  const fromMeetings=[...new Set(meetings.map(m=>m.cat).filter(Boolean))];
  const allCats=[...new Set([...meetingCategories,...fromMeetings])];
  const sel=document.getElementById('m-cat');if(!sel)return;
  const cur=sel.value;
  sel.innerHTML='<option value="">Ingen kategori</option>'+allCats.map(c=>'<option value="'+c+'">'+c+'</option>').join('')+'<option value="__new__">+ Ny kategori\u2026</option>';
  if(cur&&cur!=='__new__')sel.value=cur;
  const chips=document.getElementById('cat-chips');if(!chips)return;
  chips.innerHTML=allCats.length?allCats.map((c,i)=>'<span style="display:inline-flex;align-items:center;gap:4px;background:var(--pink);color:var(--pink-text);border-radius:20px;padding:3px 10px;font-size:11px;font-weight:700">'+c+' <button onclick="deleteMeetingCat('+i+')" style="background:none;border:none;cursor:pointer;font-size:13px;color:var(--pink-text);padding:0;line-height:1">&times;</button></span>').join(''):'<span style="font-size:11px;color:var(--muted)">Ingen kategorier enda \u2013 velg \"+ Ny kategori\" over</span>';
}

function checkNewCat(sel){
  if(sel.value!=='__new__')return;
  sel.value='';
  const overlay=document.createElement('div');
  overlay.id='new-cat-overlay';
  overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.4);z-index:600;display:flex;align-items:flex-end;justify-content:center';
  const box=document.createElement('div');
  box.style.cssText='background:var(--surface);border-radius:20px 20px 0 0;padding:1.25rem;width:100%;max-width:480px;font-family:var(--font)';
  const handle=document.createElement('div');handle.style.cssText='width:40px;height:4px;background:var(--border);border-radius:2px;margin:0 auto .875rem';
  const title=document.createElement('div');title.style.cssText='font-size:15px;font-weight:700;color:var(--text);margin-bottom:.875rem';title.textContent='Ny kategori';
  const inp=document.createElement('input');inp.id='new-cat-input';inp.placeholder='F.eks. Klient, Intern, 1-1...';
  inp.style.cssText='width:100%;border:1.5px solid var(--pink-mid);border-radius:10px;padding:.75rem .875rem;font-size:15px;font-family:var(--font);color:var(--text);background:var(--bg);outline:none;margin-bottom:.875rem;-webkit-appearance:none;box-sizing:border-box';
  inp.onkeydown=e=>{if(e.key==='Enter')saveNewCat();};
  const btns=document.createElement('div');btns.style.cssText='display:flex;gap:8px';
  const saveBtn=document.createElement('button');saveBtn.textContent='Lagre';
  saveBtn.style.cssText='flex:1;padding:.875rem;background:var(--pink);border:1.5px solid var(--pink-mid);border-radius:12px;font-size:14px;font-weight:700;color:var(--pink-text);cursor:pointer;font-family:var(--font)';
  saveBtn.onclick=saveNewCat;
  const cancelBtn=document.createElement('button');cancelBtn.textContent='Avbryt';
  cancelBtn.style.cssText='padding:.875rem 1rem;background:var(--surface2);border:1.5px solid var(--border);border-radius:12px;font-size:14px;color:var(--muted);cursor:pointer;font-family:var(--font)';
  cancelBtn.onclick=()=>overlay.remove();
  btns.appendChild(saveBtn);btns.appendChild(cancelBtn);
  box.appendChild(handle);box.appendChild(title);box.appendChild(inp);box.appendChild(btns);
  overlay.appendChild(box);
  overlay.onclick=e=>{if(e.target===overlay)overlay.remove();};
  document.body.appendChild(overlay);
  setTimeout(()=>inp.focus(),300);
}
function saveNewCat(){
  const inp=document.getElementById('new-cat-input');
  const overlay=document.getElementById('new-cat-overlay');
  if(!inp||!inp.value.trim())return;
  const name=inp.value.trim();
  if(!meetingCategories.includes(name)){meetingCategories.push(name);saveMeetingCats();}
  if(overlay)overlay.remove();
  populateCatSelect();
  const sel=document.getElementById('m-cat');if(sel)sel.value=name;
}
function deleteMeetingCat(i){meetingCategories.splice(i,1);saveMeetingCats();populateCatSelect();}

// RETRO
