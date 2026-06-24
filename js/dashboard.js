// js/dashboard.js
function getGreeting(){
  const h=new Date().getHours();
  if(h<5)return'\ud83c\udf19 God natt, Pearla';
  if(h<10)return'\u2600\ufe0f God morgen, Pearla!';
  if(h<12)return'\ud83c\udf1e God formiddag, Pearla!';
  if(h<14)return'\ud83c\udf1d God lunsj, Pearla!';
  if(h<18)return'\ud83c\udf1c God ettermiddag, Pearla!';
  if(h<22)return'\ud83c\udf06 God kveld, Pearla!';
  return'\ud83c\udf19 Sen kveld, Pearla';
}

// ════════════════════
// KONFETTI
// ════════════════════
function launchConfetti(){
  const colors=['#f7c5d5','#fef5c4','#b8e8c8','#b8d4f8','#e2b8f8','#c4608a','#f0d060'];
  for(let i=0;i<60;i++){
    setTimeout(()=>{
      const el=document.createElement('div');el.className='confetti-piece';
      el.style.cssText='left:'+Math.random()*100+'vw;background:'+colors[Math.floor(Math.random()*colors.length)]+';animation-delay:'+Math.random()*0.4+'s;animation-duration:'+(1+Math.random()*0.8)+'s;width:'+(6+Math.random()*8)+'px;height:'+(6+Math.random()*8)+'px;border-radius:'+Math.round(Math.random())+'50%';
      document.body.appendChild(el);setTimeout(()=>el.remove(),2400);
    },i*18);
  }
}

// ════════════════════
// DASHBOARD
// ════════════════════
function renderDashboard(){
  // Greeting
  const gr=document.getElementById('dashboard-greeting');if(gr)gr.textContent=getGreeting();

  // Stats
  const sb=document.getElementById('dashboard-stats');
  const doneTasks=tasks.filter(x=>x.done).length;
  const todayT=timeLog.filter(e=>e.date===todayKey()).reduce((s,e)=>s+e.hours,0);
  const streak=parseInt(localStorage.getItem('adhd_s9')||0);
  const nextEvent=Object.entries(events).filter(([d])=>d>=todayKey()).sort()[0];
  if(sb)sb.innerHTML=
    '<div class="stat-box"><div class="stat-num">'+doneTasks+'/'+Math.min(tasks.length,3)+'</div><div class="stat-lbl">Oppgaver i dag</div></div>'+
    '<div class="stat-box"><div class="stat-num">'+todayT.toFixed(1)+'t</div><div class="stat-lbl">Timer logget</div></div>'+
    '<div class="stat-box"><div class="stat-num">'+streak+'</div><div class="stat-lbl">Dag-streak</div></div>'+
    '<div class="stat-box"><div class="stat-num">'+meetings.length+'</div><div class="stat-lbl">M\u00f8ter</div></div>';

  // Tasks
  const dt=document.getElementById('dash-tasks');
  if(dt){dt.innerHTML='';tasks.slice(0,3).forEach(t=>{const d=document.createElement('div');d.className='task-item'+(t.done?' done':'');d.innerHTML='<div class="check" style="pointer-events:none">'+(t.done?'\u2713':'')+'</div><span class="task-text">'+t.text+'</span>';dt.appendChild(d);});if(!tasks.length)dt.innerHTML='<div class="empty-entries">Ingen oppgaver i dag</div>';}

  // Next events
  const de=document.getElementById('dash-events');
  if(de){
    const upcoming=[];
    Object.entries(events).filter(([d])=>d>=todayKey()).sort().slice(0,4).forEach(([d,evs])=>evs.forEach(ev=>upcoming.push({date:d,name:ev.name})));
    de.innerHTML='';
    if(!upcoming.length){de.innerHTML='<div class="empty-entries">Ingen kommende hendelser</div>';}
    else{upcoming.forEach(ev=>{const d=document.createElement('div');d.className='entry-item';d.innerHTML='<div class="entry-info"><div class="entry-proj">'+ev.name+'</div><div class="entry-date">'+ev.date+'</div></div>';de.appendChild(d);});}
  }

  // Timer today
  const dti=document.getElementById('dash-timer');
  if(dti){
    const te=timeLog.filter(e=>e.date===todayKey());
    if(!te.length){dti.innerHTML='<span style="font-size:13px;color:var(--muted)">Ingen timer logget i dag</span>';}
    else{const byP={};te.forEach(e=>{byP[e.proj]=(byP[e.proj]||0)+e.hours;});dti.innerHTML=Object.entries(byP).map(([p,h])=>'<div style="display:flex;justify-content:space-between;font-size:13px;padding:.25rem 0;border-bottom:1px solid var(--border)"><span>'+p+'</span><b>'+h.toFixed(2)+'t</b></div>').join('');}
  }

  // Mood last 7 days
  const dm=document.getElementById('dash-mood');
  if(dm){
    const last7=[...Array(7)].map((_,i)=>{const d=new Date(now);d.setDate(d.getDate()-6+i);return fmtKey(d.getFullYear(),d.getMonth(),d.getDate());});
    dm.innerHTML='<div style="display:flex;gap:6px;justify-content:space-between">'+last7.map(dk=>{const entry=moodLog.filter(m=>m.date===dk).slice(-1)[0];const dow=DAYS_SHORT[new Date(dk).getDay()];return'<div style="text-align:center;flex:1"><div style="font-size:11px;color:var(--muted)">'+dow+'</div><div style="font-size:20px">'+(entry?MOODS[entry.i].e:'\u2014')+'</div></div>';}).join('')+'</div>';
  }
}

// ════════════════════
// PRIORITERINGSMATRISE
// ════════════════════
let matriseItems={do:[],plan:[],delegate:[],drop:[]};

