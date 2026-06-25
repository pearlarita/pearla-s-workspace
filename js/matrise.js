// js/matrise.js
// savematrise is now defined centrally in storage.js (calls saveAll which syncs to Sheets too)
function loadMatrise(){try{const m=localStorage.getItem('adhd_matrise');if(m)matriseItems=JSON.parse(m);}catch(e){}}

function renderMatrise(){
  ['do','plan','delegate','drop'].forEach(q=>{
    const el=document.getElementById('mqi-'+q);if(!el)return;
    el.innerHTML='';
    (matriseItems[q]||[]).forEach((item,i)=>{
      const div=document.createElement('div');div.className='mq-item';div.draggable=true;
      div.innerHTML='<span style="flex:1">'+item+'</span><button onclick="deleteMatriseItem(\''+q+'\','+i+')" style="background:none;border:none;cursor:pointer;font-size:12px;color:var(--muted);padding:0;line-height:1">\u00d7</button>';
      div.ondragstart=e=>{e.dataTransfer.setData('text',JSON.stringify({q,i}));};
      el.appendChild(div);
    });
  });
  // Setup drop zones
  ['do','plan','delegate','drop'].forEach(q=>{
    const quad=document.getElementById('mq-'+q);if(!quad)return;
    quad.ondragover=e=>{e.preventDefault();quad.classList.add('drag-target');};
    quad.ondragleave=()=>quad.classList.remove('drag-target');
    quad.ondrop=e=>{
      e.preventDefault();quad.classList.remove('drag-target');
      try{const {q:fromQ,i:fromI}=JSON.parse(e.dataTransfer.getData('text'));
      if(fromQ===q)return;
      const item=matriseItems[fromQ].splice(fromI,1)[0];
      matriseItems[q].push(item);savematrise();renderMatrise();}catch(err){}
    };
    quad.ondblclick=e=>{
      if(e.target.closest('.mq-item'))return;
      const name=window._matInput||null;
      const inp=document.createElement('input');inp.placeholder='Ny oppgave...';inp.style.cssText='width:100%;border:1px solid var(--pink-mid);border-radius:6px;padding:4px 6px;font-size:12px;font-family:var(--font);outline:none;background:var(--bg);color:var(--text);margin-top:2px';
      const itemsEl=document.getElementById('mqi-'+q);itemsEl.appendChild(inp);inp.focus();
      inp.onkeydown=ev=>{if(ev.key==='Enter'&&inp.value.trim()){matriseItems[q].push(inp.value.trim());savematrise();renderMatrise();}if(ev.key==='Enter'||ev.key==='Escape')inp.remove();};
      inp.onblur=()=>setTimeout(()=>inp.remove(),150);
    };
  });
}
function deleteMatriseItem(q,i){matriseItems[q].splice(i,1);savematrise();renderMatrise();}
