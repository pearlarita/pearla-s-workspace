// js/pomodoro.js
function setMode(mode){pomoMode=mode;clearInterval(pomoInt);pomoRunning=false;pomoSec=POMO_TIMES[mode];document.getElementById('pomo-toggle').textContent='Start';const ft=document.getElementById('focus-toggle');if(ft)ft.textContent='\u25b6 Start';document.getElementById('pomo-label').textContent=POMO_LABELS[mode];['focus','short','long'].forEach(m=>{document.getElementById('pm-'+m).classList.toggle('active',m===mode);});updatePomoDisplay();updatePomoSlider();}

function updatePomoSlider(){
  document.querySelectorAll('.pomo-mode-row').forEach(wrap=>{
    let slider=wrap.querySelector('.pomo-mode-slider');
    if(!slider){slider=document.createElement('div');slider.className='pomo-mode-slider';wrap.insertBefore(slider,wrap.firstChild);}
    const active=wrap.querySelector('.pomo-mode.active');if(!active)return;
    const wRect=wrap.getBoundingClientRect();const aRect=active.getBoundingClientRect();
    slider.style.left=(aRect.left-wRect.left-3)+'px';
    slider.style.width=aRect.width+'px';
  });
}
function updatePomoDisplay(){const m=Math.floor(pomoSec/60),s=pomoSec%60;const str=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');document.getElementById('pomo-display').textContent=str;const fd=document.getElementById('focus-timer-display');if(fd)fd.textContent=str;}
function togglePomo(fromFocus){const tid=fromFocus?'focus-toggle':'pomo-toggle';if(pomoRunning){clearInterval(pomoInt);pomoRunning=false;document.getElementById(tid).textContent=fromFocus?'\u25b6 Fortsett':'Fortsett';}else{pomoRunning=true;document.getElementById(tid).textContent=fromFocus?'\u23f8 Pause':'Pause';pomoInt=setInterval(()=>{if(pomoSec<=0){clearInterval(pomoInt);pomoRunning=false;document.getElementById(tid).textContent=fromFocus?'\u25b6 Start':'Start';if(pomoMode==='focus'){pomoSessions=Math.min(4,pomoSessions+1);renderPomoDots();try{const tot=parseInt(localStorage.getItem('adhd_pomo_total')||0)+1;localStorage.setItem('adhd_pomo_total',tot);}catch(e){}}return;}pomoSec--;updatePomoDisplay();},1000);}}
function resetPomo(){pomoSec=POMO_TIMES[pomoMode];clearInterval(pomoInt);pomoRunning=false;document.getElementById('pomo-toggle').textContent='Start';const ft=document.getElementById('focus-toggle');if(ft)ft.textContent='\u25b6 Start';updatePomoDisplay();}
function renderPomoDots(){const el=document.getElementById('pomo-dots');el.innerHTML='';for(let i=0;i<4;i++){const d=document.createElement('div');d.className='pomo-dot'+(i<pomoSessions?' done':'');el.appendChild(d);}}

// FOCUS
function enterFocus(id){const t=tasks.find(x=>x.id===id)||tasks.find(x=>!x.done);if(!t)return;focusTaskId=t.id;document.getElementById('focus-task-name').textContent=t.text;document.getElementById('focus-overlay').classList.add('show');resetPomo();}
function exitFocus(){document.getElementById('focus-overlay').classList.remove('show');clearInterval(pomoInt);pomoRunning=false;document.getElementById('pomo-toggle').textContent='Start';}
function markFocusDone(){if(focusTaskId){const t=tasks.find(x=>x.id===focusTaskId);if(t)t.done=true;saveAll();renderTasks();renderStreak();}exitFocus();}

// MOOD
