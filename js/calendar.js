// js/calendar.js
function renderWeek(){
  const el=document.getElementById('week-timeline');el.innerHTML='';
  const dow=now.getDay();const monday=new Date(now);monday.setDate(now.getDate()-(dow===0?6:dow-1));
  const grid=document.createElement('div');grid.className='week-days';
  for(let i=0;i<7;i++){
    const day=new Date(monday);day.setDate(monday.getDate()+i);
    const isToday=day.getDate()===todayD&&day.getMonth()===todayM&&day.getFullYear()===todayY;
    const key=fmtKey(day.getFullYear(),day.getMonth(),day.getDate());
    const dayEvs=events[key]||[];
    const wd=document.createElement('div');wd.className='week-day'+(isToday?' today':'');
    const lbl=document.createElement('div');lbl.className='week-day-lbl';lbl.textContent=DAYS_SHORT[i];
    const col=document.createElement('div');col.className='week-day-col';col.onclick=()=>openModal(day.getFullYear(),day.getMonth(),day.getDate());
    const num=document.createElement('div');num.className='week-date-n';num.textContent=day.getDate();col.appendChild(num);
    dayEvs.forEach(ev=>{const evDiv=document.createElement('div');evDiv.className='week-ev';evDiv.textContent=ev.name;evDiv.onclick=e=>{e.stopPropagation();showEvPopup(ev.name,ev.desc);};col.appendChild(evDiv);});
    wd.appendChild(lbl);wd.appendChild(col);grid.appendChild(wd);
  }
  el.appendChild(grid);
}

// CALENDAR
function renderCal(){
  document.getElementById('cal-month-label').textContent=MONTHS_NO[calMonth].charAt(0).toUpperCase()+MONTHS_NO[calMonth].slice(1)+' '+calYear;
  const grid=document.getElementById('cal-grid');grid.innerHTML='';
  DAYS_SHORT.forEach(d=>{const dn=document.createElement('div');dn.className='cal-dname';dn.textContent=d;grid.appendChild(dn);});
  const first=new Date(calYear,calMonth,1);let startDow=first.getDay();startDow=startDow===0?6:startDow-1;
  const dim=new Date(calYear,calMonth+1,0).getDate();const prev=new Date(calYear,calMonth,0).getDate();
  for(let i=0;i<startDow;i++){const dd=document.createElement('div');dd.className='cal-day empty';dd.textContent=prev-startDow+1+i;grid.appendChild(dd);}
  for(let d=1;d<=dim;d++){
    const key=fmtKey(calYear,calMonth,d);const dayEvs=events[key]||[];
    const isToday=d===todayD&&calMonth===todayM&&calYear===todayY;
    const dd=document.createElement('div');dd.className='cal-day'+(isToday?' today':'')+(dayEvs.length?' has-event':'');dd.textContent=d;
    if(dayEvs.length){dd.onclick=()=>showEvPopup(dayEvs.map(e=>e.name).join(', '),dayEvs.map(e=>e.desc).filter(Boolean).join(' | '));}
    else{dd.onclick=()=>openModal(calYear,calMonth,d);}
    grid.appendChild(dd);
  }
  const total=startDow+dim;const rem=total%7===0?0:7-(total%7);for(let i=1;i<=rem;i++){const dd=document.createElement('div');dd.className='cal-day empty';dd.textContent=i;grid.appendChild(dd);}
}
function changeMonth(d){calMonth+=d;if(calMonth<0){calMonth=11;calYear--;}if(calMonth>11){calMonth=0;calYear++;}renderCal();}
function openModal(y,m,d){modalDate={y,m,d};document.getElementById('modal-date-label').textContent=DAYS_NO[new Date(y,m,d).getDay()]+' '+d+'. '+MONTHS_NO[m]+' '+y;document.getElementById('event-name').value='';document.getElementById('event-desc').value='';document.getElementById('event-modal').classList.add('show');setTimeout(()=>document.getElementById('event-name').focus(),350);}
function closeModal(){document.getElementById('event-modal').classList.remove('show');modalDate=null;}
function saveEvent(){const name=document.getElementById('event-name').value.trim();if(!name||!modalDate)return;const desc=document.getElementById('event-desc').value.trim();const key=fmtKey(modalDate.y,modalDate.m,modalDate.d);if(!events[key])events[key]=[];events[key].push({name,desc});saveAll();closeModal();renderCal();renderWeek();renderTodayMeetings();}
document.getElementById('event-modal')?.addEventListener('click',function(e){if(e.target===this)closeModal();});
function showEvPopup(name,desc){document.getElementById('ev-popup-title').textContent=name;document.getElementById('ev-popup-desc').textContent=desc||'Ingen beskrivelse.';document.getElementById('ev-popup').classList.add('show');document.getElementById('ev-popup-bg').style.display='block';}
function closeEvPopup(){document.getElementById('ev-popup').classList.remove('show');document.getElementById('ev-popup-bg').style.display='none';}

// TODAY MEETINGS
function renderTodayMeetings(){
  const wrap=document.getElementById('today-meetings-wrap');if(!wrap)return;
  const todayEvs=events[todayKey()]||[];
  if(!todayEvs.length){wrap.innerHTML='';return;}
  wrap.innerHTML='<div class="today-meetings"><div class="today-meetings-hdr">&#128197; Dagens hendelser</div>'+todayEvs.map(ev=>'<div class="today-m-item"><span class="today-m-name">'+ev.name+'</span></div>').join('')+'</div>';
}

// POMODORO
