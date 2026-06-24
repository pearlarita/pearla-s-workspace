// js/tasks.js
function renderStreak(){const row=document.getElementById('streak-row');row.innerHTML='';const s=parseInt(localStorage.getItem('adhd_s9')||0);for(let i=0;i<7;i++){const d=document.createElement('div');d.className='streak-dot'+(i<s?' done':'');row.appendChild(d);}}

// TASKS
function renderTasks(){
  const el=document.getElementById('task-list');el.innerHTML='';
  const shown=tasks.slice(0,3);
  if(!shown.length){
    const empty=document.createElement('div');empty.style.cssText='padding:1rem;font-size:13px;color:var(--muted);text-align:center;font-family:var(--font)';
    empty.textContent='Ingen oppgaver enda \u2013 legg til under!';el.appendChild(empty);
  }
  shown.forEach((t,i)=>{
    const div=document.createElement('div');div.className='task-item'+(t.done?' done':'');
    const rb=t.recur?'<span class="recur-badge">'+RECUR_LABELS[t.recur]+'</span>':'';
    div.innerHTML='<div class="task-color c'+(t.color||0)+'" onclick="cycleColor('+t.id+')" title="Farge"></div><span class="task-num">'+(i+1)+'</span><div class="check" onclick="toggleTask('+t.id+')">'+(t.done?'\u2713':'')+'</div><span class="task-text">'+t.text+'</span>'+rb+'<button class="focus-play" onclick="enterFocus('+t.id+')">&#9654;</button>';
    el.appendChild(div);
  });
  const ar=document.createElement('div');ar.className='add-row';
  ar.innerHTML='<input id="nt" placeholder="Legg til oppgave\u2026" maxlength="60" onkeydown="if(event.key===\'Enter\')addTask()"><button class="add-btn" onclick="addTask()">+</button>';
  el.appendChild(ar);

  // Backlog
  renderBacklog();
  renderArchive();
}

function renderBacklog(){
  let wrap=document.getElementById('backlog-wrap');
  if(!wrap)return;
  if(!taskBacklog.length){wrap.innerHTML='';return;}
  wrap.innerHTML='<div class="section-label" style="margin-top:1rem"><span style="color:var(--red-text)">\u26a0\ufe0f Backlog</span></div>';
  const card=document.createElement('div');card.className='card';card.style.cssText='border-color:#e89ab5;margin-bottom:1rem';
  taskBacklog.forEach((t,i)=>{
    const div=document.createElement('div');div.className='task-item';div.style.cssText='background:#fff5f5;border-bottom:1px solid #ffd5d5';
    div.innerHTML='<span style="font-size:16px;flex-shrink:0">\u2757</span>'
      +'<div style="flex:1;min-width:0"><div style="font-size:14px;color:#8c2d2d;font-weight:700;font-family:var(--font)">'+t.text+'</div>'
      +'<div style="font-size:10px;color:var(--muted);margin-top:1px">Ikke fullf\u00f8rt '+t.missedDate+'</div>'
      +(t.comment?'<div style="font-size:11px;color:#c4608a;margin-top:2px;font-style:italic">\u201c'+t.comment+'\u201d</div>':'')
      +'</div>'
      +(t.needsComment&&!t.comment
        ?'<button onclick="addBacklogComment('+i+')" style="background:var(--red,#ffd5d5);border:1px solid #e89ab5;border-radius:8px;padding:4px 8px;font-size:11px;color:#8c2d2d;cursor:pointer;font-family:var(--font);flex-shrink:0;white-space:nowrap">+ Kommentar</button>'
        :'<button onclick="rescheduleBacklog('+i+')" style="background:var(--yellow);border:1px solid var(--yellow-mid);border-radius:8px;padding:4px 8px;font-size:11px;color:var(--yellow-text);cursor:pointer;font-family:var(--font);flex-shrink:0;white-space:nowrap">Legg til i dag</button>');
    div.innerHTML+='<button onclick="deleteBacklog('+i+')" style="background:none;border:none;cursor:pointer;font-size:15px;color:var(--muted);padding:4px;flex-shrink:0">&#128465;&#65039;</button>';
    card.appendChild(div);
  });
  wrap.appendChild(card);
}

function addBacklogComment(i){
  const t=taskBacklog[i];if(!t)return;
  const overlay=document.createElement('div');overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.4);z-index:500;display:flex;align-items:flex-end;justify-content:center';
  overlay.innerHTML='<div style="background:var(--surface);border-radius:20px 20px 0 0;padding:1.25rem;width:100%;max-width:480px">'
    +'<div style="width:40px;height:4px;background:var(--border);border-radius:2px;margin:0 auto .875rem"></div>'
    +'<div style="font-size:15px;font-weight:700;color:#8c2d2d;margin-bottom:.5rem;font-family:var(--font)">\u2757 '+t.text+'</div>'
    +'<div style="font-size:12px;color:var(--muted);margin-bottom:.875rem">Hvorfor ble ikke denne fullf\u00f8rt?</div>'
    +'<textarea id="backlog-comment-input" style="width:100%;border:1.5px solid var(--border);border-radius:10px;padding:.75rem;font-size:14px;font-family:var(--font);color:var(--text);background:var(--bg);outline:none;resize:none;min-height:80px;-webkit-appearance:none" placeholder="Skriv en kort forklaring..."></textarea>'
    +'<div style="display:flex;gap:8px;margin-top:.75rem">'
    +'<button onclick="saveBacklogComment('+i+',this.closest(\'[style*=position]\'))" style="flex:1;padding:.875rem;background:var(--pink);border:1.5px solid var(--pink-mid);border-radius:12px;font-size:14px;font-weight:700;color:var(--pink-text);cursor:pointer;font-family:var(--font)">Lagre</button>'
    +'<button onclick="this.closest(\'[style*=position]\').remove()" style="padding:.875rem 1rem;background:var(--surface2);border:1.5px solid var(--border);border-radius:12px;font-size:14px;color:var(--muted);cursor:pointer;font-family:var(--font)">Avbryt</button>'
    +'</div></div>';
  document.body.appendChild(overlay);
  setTimeout(()=>document.getElementById('backlog-comment-input')?.focus(),300);
}
function saveBacklogComment(i,overlay){
  const inp=document.getElementById('backlog-comment-input');
  if(!inp||!inp.value.trim()){alert('Skriv en kommentar');return;}
  taskBacklog[i].comment=inp.value.trim();taskBacklog[i].needsComment=false;
  if(overlay)overlay.remove();saveAll();renderTasks();
}
function rescheduleBacklog(i){
  const t=taskBacklog[i];if(!t)return;
  if(tasks.length>=3){alert('Du har allerede 3 oppgaver i dag!');return;}
  tasks.push({id:Date.now(),text:t.text,done:false,color:t.color||0,recur:null});
  taskBacklog.splice(i,1);saveAll();renderTasks();showSavedToast('Lagt til i dagens oppgaver!');
}
function deleteBacklog(i){taskBacklog.splice(i,1);saveAll();renderTasks();}

function renderArchive(){
  let wrap=document.getElementById('archive-wrap');
  if(!wrap)return;
  if(!taskArchive.length){wrap.innerHTML='';return;}
  // Group by date
  const byDate={};taskArchive.forEach(t=>{const d=t.completedDate||'Ukjent';if(!byDate[d])byDate[d]=[];byDate[d].push(t);});
  wrap.innerHTML='<div class="section-label" style="margin-top:1rem"><span>\u2705 Fullf\u00f8rt</span> <button onclick="toggleArchive()" style="margin-left:auto;background:none;border:none;font-size:11px;color:var(--muted);cursor:pointer;font-family:var(--font)" id="archive-toggle-btn">Vis</button></div>';
  const inner=document.createElement('div');inner.id='archive-inner';inner.style.display='none';
  Object.entries(byDate).sort((a,b)=>b[0]>a[0]?1:-1).slice(0,5).forEach(([date,items])=>{
    const dateHdr=document.createElement('div');dateHdr.style.cssText='font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;padding:.5rem 1rem .25rem;';dateHdr.textContent=date;inner.appendChild(dateHdr);
    const card=document.createElement('div');card.className='card';card.style.marginBottom='.5rem';
    items.forEach(t=>{const div=document.createElement('div');div.className='task-item done';div.innerHTML='<span style="font-size:14px">\u2705</span><span class="task-text" style="text-decoration:line-through;color:var(--muted)">'+t.text+'</span>';card.appendChild(div);});
    inner.appendChild(card);
  });
  wrap.appendChild(inner);
}
function toggleArchive(){
  const inner=document.getElementById('archive-inner');const btn=document.getElementById('archive-toggle-btn');
  if(!inner)return;const hidden=inner.style.display==='none';inner.style.display=hidden?'block':'none';if(btn)btn.textContent=hidden?'Skjul':'Vis';
}
function cycleColor(id){const t=tasks.find(x=>x.id===id);if(t)t.color=((t.color||0)+1)%TASK_COLORS.length;saveAll();renderTasks();}
function toggleTask(id){
  const t=tasks.find(x=>x.id===id);if(!t)return;t.done=!t.done;
  if(t.done){const k=todayKey();completionLog[k]=(completionLog[k]||0)+1;}
  saveAll();renderTasks();
  if(tasks.slice(0,3).filter(x=>x.done).length===3){try{localStorage.setItem('adhd_s9',Math.min(7,parseInt(localStorage.getItem('adhd_s9')||0)+1));}catch(e){}launchConfetti();showSavedToast('\ud83c\udf89 Alle dagens oppgaver fullf\u00f8rt!');}
  renderStreak();
}
function addTask(){const i=document.getElementById('nt');if(!i||!i.value.trim())return;if(tasks.length>=5)tasks.shift();tasks.push({id:Date.now(),text:i.value.trim(),done:false,color:0,recur:null});i.value='';saveAll();renderTasks();}

function checkRecurring(){
  const todayStr=todayKey();
  // Daily task reset: move undone tasks to backlog, done tasks to archive
  const lastDate=localStorage.getItem('adhd_last_date');
  if(lastDate && lastDate !== todayStr){
    // Move done tasks to archive
    tasks.filter(t=>t.done).forEach(t=>{
      taskArchive.push({...t, completedDate:lastDate});
    });
    // Move undone tasks to backlog (they didn't get done!)
    tasks.filter(t=>!t.done).forEach(t=>{
      taskBacklog.push({...t, missedDate:lastDate, needsComment:true, comment:'', urgent:true});
    });
    // Clear today's tasks
    tasks=[];
    saveAll();
  }
  localStorage.setItem('adhd_last_date', todayStr);

  // Handle recurring tasks
  tasks.forEach(t=>{
    if(!t.recur)return;if(t.lastReset===todayStr)return;
    if(t.recur==='daily'){t.done=false;t.lastReset=todayStr;}
    else if(t.recur==='weekly'){const mon=new Date(now);mon.setDate(now.getDate()-(now.getDay()===0?6:now.getDay()-1));if(!t.lastReset||t.lastReset<fmtKey(mon.getFullYear(),mon.getMonth(),mon.getDate())){t.done=false;t.lastReset=todayStr;}}
    else if(t.recur==='workdays'&&now.getDay()>=1&&now.getDay()<=5){t.done=false;t.lastReset=todayStr;}
  });saveAll();
}

function startLongPress(id){window._lp=setTimeout(()=>showRecurPicker(id),600);}
function cancelLongPress(){clearTimeout(window._lp);}
function showRecurPicker(id){
  const t=tasks.find(x=>x.id===id);if(!t)return;
  const opts=[{v:null,l:'Ingen gjentakelse'},{v:'daily',l:'Daglig'},{v:'workdays',l:'Hverdager (man-fre)'},{v:'weekly',l:'Ukentlig'}];
  const modal=document.createElement('div');modal.id='recur-modal-overlay';
  modal.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.4);z-index:500;display:flex;align-items:center;justify-content:center;';
  const inner=document.createElement('div');inner.style.cssText='background:var(--surface);border-radius:16px;padding:1.25rem;width:88%;max-width:300px';
  const title=document.createElement('div');title.style.cssText='font-size:15px;font-weight:700;color:var(--text);margin-bottom:1rem;font-family:var(--font)';title.textContent='Gjentakelse';inner.appendChild(title);
  opts.forEach(o=>{const opt=document.createElement('div');opt.style.cssText='padding:.75rem;border-radius:10px;font-size:14px;color:var(--text);cursor:pointer;background:'+(t.recur===o.v?'var(--pink)':'transparent')+';margin-bottom:4px;font-family:var(--font)';opt.textContent=o.l;opt.onclick=()=>setRecur(id,o.v);inner.appendChild(opt);});
  const cb=document.createElement('button');cb.style.cssText='margin-top:.5rem;width:100%;padding:.75rem;border-radius:10px;background:var(--surface2);border:1.5px solid var(--border);font-size:14px;color:var(--muted);cursor:pointer;font-family:var(--font)';cb.textContent='Avbryt';cb.onclick=closeRecurModal;inner.appendChild(cb);
  modal.appendChild(inner);modal.onclick=e=>{if(e.target===modal)closeRecurModal();};document.body.appendChild(modal);
}
function setRecur(id,val){const t=tasks.find(x=>x.id===id);if(t){t.recur=val;t.lastReset=null;}saveAll();renderTasks();closeRecurModal();}
function closeRecurModal(){const m=document.getElementById('recur-modal-overlay');if(m)m.remove();}

// DELETE PROJECT
