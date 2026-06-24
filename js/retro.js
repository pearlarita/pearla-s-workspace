// js/retro.js
function switchRetroTab(tab){currentRetroTab=tab;['daily','weekly','monthly'].forEach(t=>{document.getElementById('retro-panel-'+t).style.display=t===tab?'block':'none';document.getElementById('rtab-'+t).classList.toggle('active',t===tab);});updateRetroSlider();renderRetro();}

function updateRetroSlider(){
  const tabs=document.querySelectorAll('.retro-tab');
  const wrap=document.querySelector('.retro-tabs');
  if(!wrap)return;
  let slider=wrap.querySelector('.retro-tab-slider');
  if(!slider){slider=document.createElement('div');slider.className='retro-tab-slider';wrap.insertBefore(slider,wrap.firstChild);}
  const active=wrap.querySelector('.retro-tab.active');
  if(!active)return;
  const wRect=wrap.getBoundingClientRect();const aRect=active.getBoundingClientRect();
  slider.style.left=(aRect.left-wRect.left-4)+'px';
  slider.style.width=aRect.width+'px';
}
function renderRetro(){if(currentRetroTab==='daily')renderRetroDaily();else if(currentRetroTab==='weekly')renderRetroWeekly();else renderRetroMonthly();}
function renderRetroDaily(){
  const key=todayKey();document.getElementById('retro-daily-lbl').textContent=DAYS_NO[now.getDay()]+' '+todayD+'. '+MONTHS_NO[todayM];
  const ex=retroDaily.find(r=>r.key===key);
  document.getElementById('rd-good').value=ex?ex.good:'';document.getElementById('rd-block').value=ex?ex.block:'';document.getElementById('rd-next').value=ex?ex.next:'';
  retroDailyEnergy=ex?ex.energy:3;renderEnergyStars();
  const hist=document.getElementById('retro-daily-history');hist.innerHTML='';
  retroDaily.slice().reverse().slice(0,5).forEach(r=>{const div=document.createElement('div');div.className='retro-entry';div.innerHTML='<strong>'+r.dateLabel+'</strong>Fikk til: '+(r.good||'\u2013')+'<br>Stoppet: '+(r.block||'\u2013')+'<br>I morgen: '+(r.next||'\u2013')+'<br>Energi: '+'\u2605'.repeat(r.energy||0)+'\u2606'.repeat(5-(r.energy||0));hist.appendChild(div);});
}
