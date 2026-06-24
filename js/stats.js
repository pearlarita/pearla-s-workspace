// js/stats.js
function renderStats(){
  const sb=document.getElementById('stats-boxes');if(sb)sb.innerHTML='<div class="stat-box"><div class="stat-num">'+tasks.slice(0,3).filter(x=>x.done).length+'/3</div><div class="stat-lbl">Dagens oppg.</div></div><div class="stat-box"><div class="stat-num">'+parseInt(localStorage.getItem('adhd_s9')||0)+'</div><div class="stat-lbl">Dag-streak</div></div><div class="stat-box"><div class="stat-num">'+meetings.length+'</div><div class="stat-lbl">M\u00f8ter</div></div><div class="stat-box"><div class="stat-num">'+parseInt(localStorage.getItem('adhd_pomo_total')||0)+'</div><div class="stat-lbl">Pomodoros</div></div>';
  const dl=document.getElementById('hm-day-labels');const hg=document.getElementById('hm-grid');if(!dl||!hg)return;
  dl.innerHTML=DAYS_SHORT.map(d=>'<div class="hm-dlbl">'+d+'</div>').join('');hg.innerHTML='';
  for(let i=27;i>=0;i--){const d=new Date(now);d.setDate(now.getDate()-i);const key=fmtKey(d.getFullYear(),d.getMonth(),d.getDate());const cnt=completionLog[key]||0;const cell=document.createElement('div');cell.className='hm-cell'+(cnt>=3?' h3':cnt===2?' h2':cnt===1?' h1':'');cell.textContent=cnt||'';hg.appendChild(cell);}
  const mt=document.getElementById('mood-trend-wrap');if(!mt)return;const counts=[0,0,0,0,0];moodLog.forEach(m=>{if(m.i>=0&&m.i<5)counts[m.i]++;});const total=counts.reduce((a,b)=>a+b,0)||1;if(!moodLog.length){mt.innerHTML='<div style="font-size:13px;color:var(--muted)">Ingen hum\u00f8rdata enda.</div>';return;}mt.innerHTML=counts.map((c,i)=>'<div class="mood-bar-row"><div class="mood-bar-lbl">'+MOODS[i].e+'</div><div class="mood-bar-bg"><div class="mood-bar-fill" style="width:'+Math.round(c/total*100)+'%"></div></div><div class="mood-bar-count">'+c+'</div></div>').join('');
  const ps=document.getElementById('pomo-stats-wrap');if(ps){const tot=parseInt(localStorage.getItem('adhd_pomo_total')||0);ps.innerHTML='<div style="font-size:28px;font-weight:700;color:var(--pink-dark);margin-bottom:4px">'+tot+'</div><div style="font-size:12px;color:var(--muted)">fokus\u00f8kter totalt \u00b7 '+Math.round(tot*25/60*10)/10+' timer</div>';}
}

// PARKING
document.getElementById('parking-pad')?.addEventListener('input',()=>{try{localStorage.setItem('adhd_p9',document.getElementById('parking-pad').value);}catch(e){}});


