// js/notater.js
function getDefaultNotebook(){
  return {id:Date.now(),name:'Generelt',sections:[],notislapper:[],fri:''};
}

function ensureNotebooks(){
  if(!notebooks.length){notebooks.push(getDefaultNotebook());savePersonal();}
  if(activeNotebook>=notebooks.length)activeNotebook=0;
}

function addNotebook(){
  const overlay=document.createElement('div');overlay.id='nb-name-overlay';
  overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.4);z-index:600;display:flex;align-items:flex-end;justify-content:center';
  const box=document.createElement('div');box.style.cssText='background:var(--surface);border-radius:20px 20px 0 0;padding:1.25rem;width:100%;max-width:480px;font-family:var(--font)';
  const handle=document.createElement('div');handle.style.cssText='width:40px;height:4px;background:var(--border);border-radius:2px;margin:0 auto .875rem';
  const title=document.createElement('div');title.style.cssText='font-size:15px;font-weight:700;color:var(--text);margin-bottom:.875rem';title.textContent='Ny mappe';
  const inp=document.createElement('input');inp.id='nb-name-input';inp.placeholder='Navn p\u00e5 mappe...';
  inp.style.cssText='width:100%;border:1.5px solid var(--pink-mid);border-radius:10px;padding:.75rem .875rem;font-size:15px;font-family:var(--font);color:var(--text);background:var(--bg);outline:none;margin-bottom:.875rem;-webkit-appearance:none;box-sizing:border-box';
  inp.onkeydown=e=>{if(e.key==='Enter')saveNewNotebook();};
  const btns=document.createElement('div');btns.style.cssText='display:flex;gap:8px';
  const saveBtn=document.createElement('button');saveBtn.textContent='Lagre';
  saveBtn.style.cssText='flex:1;padding:.875rem;background:var(--pink);border:1.5px solid var(--pink-mid);border-radius:12px;font-size:14px;font-weight:700;color:var(--pink-text);cursor:pointer;font-family:var(--font)';
  saveBtn.onclick=saveNewNotebook;
  const cancelBtn=document.createElement('button');cancelBtn.textContent='Avbryt';
  cancelBtn.style.cssText='padding:.875rem 1rem;background:var(--surface2);border:1.5px solid var(--border);border-radius:12px;font-size:14px;color:var(--muted);cursor:pointer;font-family:var(--font)';
  cancelBtn.onclick=()=>overlay.remove();
  btns.appendChild(saveBtn);btns.appendChild(cancelBtn);
  box.appendChild(handle);box.appendChild(title);box.appendChild(inp);box.appendChild(btns);
  overlay.appendChild(box);overlay.onclick=e=>{if(e.target===overlay)overlay.remove();};
  document.body.appendChild(overlay);setTimeout(()=>inp.focus(),300);
}

function saveNewNotebook(){
  const inp=document.getElementById('nb-name-input');
  const overlay=document.getElementById('nb-name-overlay');
  if(!inp||!inp.value.trim())return;
  notebooks.push({id:Date.now(),name:inp.value.trim(),sections:[],notislapper:[],fri:''});
  activeNotebook=notebooks.length-1;
  if(overlay)overlay.remove();savePersonal();renderNotater();
}

function deleteNotebook(i){
  if(notebooks.length<=1){showSavedToast('Du m\u00e5 ha minst \u00e9n mappe!');return;}
  const existing=document.getElementById('del-nb-confirm');if(existing)existing.remove();
  const toast=document.createElement('div');toast.id='del-nb-confirm';
  toast.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--text);color:#fff;border-radius:14px;padding:1rem 1.25rem;z-index:600;width:88%;max-width:320px;box-shadow:0 8px 24px rgba(0,0,0,.25);font-family:var(--font)';
  toast.innerHTML='<div style="font-size:14px;font-weight:700;margin-bottom:.75rem">Slette \"'+notebooks[i].name+'\"?</div><div style="display:flex;gap:8px"><button onclick="doDeleteNotebook('+i+')" style="flex:1;padding:.7rem;background:#c4608a;border:none;border-radius:10px;color:#fff;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font)">Slett</button><button onclick="document.getElementById(\'del-nb-confirm\').remove()" style="flex:1;padding:.7rem;background:rgba(255,255,255,.15);border:none;border-radius:10px;color:#fff;font-size:14px;cursor:pointer;font-family:var(--font)">Avbryt</button></div>';
  document.body.appendChild(toast);setTimeout(()=>{const t=document.getElementById('del-nb-confirm');if(t)t.remove();},4000);
}
function doDeleteNotebook(i){
  const t=document.getElementById('del-nb-confirm');if(t)t.remove();
  notebooks.splice(i,1);if(activeNotebook>=notebooks.length)activeNotebook=notebooks.length-1;
  savePersonal();renderNotater();
}

function switchNotebook(i){activeNotebook=i;renderNotater();}

function renderNotater(){
  ensureNotebooks();
  const nb=notebooks[activeNotebook];

  // Render tabs
  const tabsEl=document.getElementById('nb-tabs');if(!tabsEl)return;
  tabsEl.innerHTML='';
  notebooks.forEach((n,i)=>{
    const tab=document.createElement('button');tab.className='nb-tab'+(i===activeNotebook?' active':'');
    const nameSpan=document.createElement('span');nameSpan.textContent=n.name;
    nameSpan.ondblclick=e=>{e.stopPropagation();e.preventDefault();startRenameTab(i,nameSpan);};
    nameSpan.style.cssText='pointer-events:auto;cursor:text';
    tab.appendChild(nameSpan);
    if(notebooks.length>1){
      const del=document.createElement('button');del.className='nb-tab-del';del.textContent='\u00d7';del.title='Slett mappe';
      del.onclick=e=>{e.stopPropagation();deleteNotebook(i);};tab.appendChild(del);
    }
    tab.onclick=e=>{if(e.target===nameSpan&&nameSpan.contentEditable==='true')return;switchNotebook(i);};tabsEl.appendChild(tab);
  });

  // Render panel
  const panel=document.getElementById('nb-content');if(!panel)return;
  panel.innerHTML='';
  const wrap=document.createElement('div');wrap.className='nb-panel';

  // ── NOTISLAPPER ──
  const lappHdr=document.createElement('div');lappHdr.className='section-label';lappHdr.style.marginBottom='.75rem';
  const lappTitle=document.createElement('span');lappTitle.textContent='\ud83d\udccc Notislapper';
  const lappBtn=document.createElement('button');lappBtn.textContent='+ Ny lapp';
  lappBtn.style.cssText='margin-left:auto;background:var(--pink);border:1px solid var(--pink-mid);border-radius:8px;padding:4px 12px;font-size:12px;color:var(--pink-text);cursor:pointer;font-weight:700;font-family:var(--font)';
  lappBtn.onclick=()=>addNotislapp(activeNotebook);
  lappHdr.appendChild(lappTitle);lappHdr.appendChild(lappBtn);wrap.appendChild(lappHdr);

  const lappGrid=document.createElement('div');lappGrid.id='notislapp-grid';
  lappGrid.style.cssText='display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px;margin-bottom:1.25rem';
  if(!(nb.notislapper||[]).length){
    const empty=document.createElement('div');empty.style.cssText='font-size:13px;color:var(--muted);grid-column:1/-1';
    empty.textContent='Ingen lapper enda';lappGrid.appendChild(empty);
  }
  (nb.notislapper||[]).forEach((l,li)=>{
    const card=document.createElement('div');card.className='notislapp';card.style.background=l.color;
    const colorRow=document.createElement('div');colorRow.className='notislapp-color-row';
    LAPP_COLORS.forEach(c=>{
      const dot=document.createElement('div');dot.className='notislapp-color-dot'+(l.color===c.bg?' sel':'');
      dot.style.cssText='width:14px;height:14px;border-radius:50%;cursor:pointer;flex-shrink:0;background:'+c.bg+';border:2px solid '+(l.color===c.bg?'rgba(0,0,0,.35)':'rgba(0,0,0,.1)');
      dot.title=c.name;dot.onclick=()=>setLappColor(activeNotebook,li,c.bg);colorRow.appendChild(dot);
    });
    card.appendChild(colorRow);
    const ta=document.createElement('textarea');ta.value=l.text;ta.placeholder='Skriv notat\u2026';
    ta.style.cssText='background:transparent;border:none;outline:none;resize:none;font-size:13px;font-family:var(--font);line-height:1.6;flex:1;color:var(--text);min-height:70px;width:100%';
    ta.oninput=e=>{notebooks[activeNotebook].notislapper[li].text=e.target.value;savePersonal();};
    card.appendChild(ta);
    const del=document.createElement('button');del.className='notislapp-del';del.textContent='\u00d7';del.title='Slett lapp';
    del.onclick=()=>{notebooks[activeNotebook].notislapper.splice(li,1);savePersonal();renderNotater();};
    card.appendChild(del);lappGrid.appendChild(card);
  });
  wrap.appendChild(lappGrid);

  // ── SEKSJONER ──
  const secHdr=document.createElement('div');secHdr.className='section-label';secHdr.style.cssText='margin-bottom:.75rem;border-top:1px solid var(--border);padding-top:.875rem';
  secHdr.innerHTML='&#128203; Seksjoner &amp; rutiner';wrap.appendChild(secHdr);

  const secWrap=document.createElement('div');secWrap.id='notater-sections-wrap';
  (nb.sections||[]).forEach((sec,si)=>{
    const card=document.createElement('div');card.className='card';card.style.marginBottom='1rem';
    const hdr=document.createElement('div');hdr.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:.75rem 1rem;border-bottom:1px solid var(--border);background:var(--surface2);border-radius:12px 12px 0 0';
    const tn=document.createElement('div');tn.style.cssText='font-size:13px;font-weight:700;color:var(--text);font-family:var(--font)';tn.textContent=sec.name;
    const db=document.createElement('div');db.style.cssText='display:flex;gap:8px;align-items:center';
    const resetBtn=document.createElement('button');resetBtn.style.cssText='background:none;border:none;font-size:11px;color:var(--muted);cursor:pointer;font-family:var(--font)';resetBtn.textContent='\u21ba';resetBtn.title='Nullstill';resetBtn.onclick=()=>{sec.items.forEach(it=>it.done=false);savePersonal();renderNotater();};
    const delBtn=document.createElement('button');delBtn.style.cssText='background:none;border:none;font-size:16px;color:var(--muted);cursor:pointer;line-height:1;padding:0';delBtn.textContent='\u00d7';delBtn.onclick=()=>{notebooks[activeNotebook].sections.splice(si,1);savePersonal();renderNotater();};
    db.appendChild(resetBtn);db.appendChild(delBtn);hdr.appendChild(tn);hdr.appendChild(db);card.appendChild(hdr);
    (sec.items||[]).forEach((item,ii)=>{
      const row=document.createElement('div');row.className='task-item'+(item.done?' done':'');
      const chk=document.createElement('div');chk.className='check';chk.textContent=item.done?'\u2713':'';
      chk.onclick=()=>{notebooks[activeNotebook].sections[si].items[ii].done=!item.done;savePersonal();renderNotater();};
      const txt=document.createElement('span');txt.className='task-text';txt.textContent=item.text;
      const xb=document.createElement('button');xb.style.cssText='background:none;border:none;cursor:pointer;font-size:14px;color:var(--muted);padding:4px';xb.textContent='\u00d7';
      xb.onclick=()=>{notebooks[activeNotebook].sections[si].items.splice(ii,1);savePersonal();renderNotater();};
      row.appendChild(chk);row.appendChild(txt);row.appendChild(xb);card.appendChild(row);
    });
    const addRow=document.createElement('div');addRow.className='add-row';
    const ni=document.createElement('input');ni.placeholder='Legg til punkt\u2026';ni.style.cssText='flex:1;background:transparent;border:none;outline:none;font-size:14px;color:var(--text);font-family:var(--font)';
    ni.onkeydown=e=>{if(e.key==='Enter'&&ni.value.trim()){notebooks[activeNotebook].sections[si].items.push({text:ni.value.trim(),done:false});ni.value='';savePersonal();renderNotater();}};
    const nb2=document.createElement('button');nb2.className='add-btn';nb2.textContent='+';nb2.onclick=()=>{if(ni.value.trim()){notebooks[activeNotebook].sections[si].items.push({text:ni.value.trim(),done:false});ni.value='';savePersonal();renderNotater();}};
    addRow.appendChild(ni);addRow.appendChild(nb2);card.appendChild(addRow);
    secWrap.appendChild(card);
  });
  wrap.appendChild(secWrap);

  // Add section input
  const addSecRow=document.createElement('div');addSecRow.className='card-pad';addSecRow.style.marginBottom='1rem';
  const addSecInner=document.createElement('div');addSecInner.style.cssText='display:flex;gap:8px';
  const secInp=document.createElement('input');secInp.id='notater-new-section';secInp.placeholder='Ny seksjon (f.eks. Morgenrutine, Kveldsrutine\u2026)';
  secInp.style.cssText='flex:1;border:1.5px solid var(--border);border-radius:10px;padding:.65rem .875rem;font-size:14px;font-family:var(--font);color:var(--text);background:var(--bg);outline:none;-webkit-appearance:none';
  secInp.onkeydown=e=>{if(e.key==='Enter')addNotaterSection();};
  const secBtn=document.createElement('button');secBtn.className='add-btn';secBtn.textContent='+';secBtn.onclick=addNotaterSection;
  addSecInner.appendChild(secInp);addSecInner.appendChild(secBtn);addSecRow.appendChild(addSecInner);wrap.appendChild(addSecRow);

  // ── FRI TEKST (RICH EDITOR) ──
  const friHdr=document.createElement('div');friHdr.className='section-label';friHdr.style.cssText='margin-bottom:.5rem;border-top:1px solid var(--border);padding-top:.875rem';
  friHdr.innerHTML='&#128221; Fri notatblokk';wrap.appendChild(friHdr);
  try{wrap.appendChild(buildRichEditor(nb));}catch(err){console.error('Rich editor error:',err);const fb=document.createElement('textarea');fb.style.cssText='width:100%;min-height:200px;padding:1rem;border:1.5px solid var(--border);border-radius:12px;font-size:14px;font-family:var(--font);outline:none;resize:none';fb.value=nb.fri||'';fb.oninput=e=>{notebooks[activeNotebook].fri=e.target.value;savePersonal();};wrap.appendChild(fb);}

  panel.appendChild(wrap);
}

function addNotislapp(nbIdx){
  notebooks[nbIdx].notislapper.push({id:Date.now(),text:'',color:LAPP_COLORS[0].bg});
  savePersonal();renderNotater();
  setTimeout(()=>{const grids=document.querySelectorAll('.notislapp textarea');if(grids.length)grids[grids.length-1].focus();},50);
}
function setLappColor(nbIdx,li,color){notebooks[nbIdx].notislapper[li].color=color;savePersonal();renderNotater();}

function addNotaterSection(){
  const inp=document.getElementById('notater-new-section');if(!inp||!inp.value.trim())return;
  notebooks[activeNotebook].sections.push({name:inp.value.trim(),items:[]});
  inp.value='';savePersonal();renderNotater();
}

// ════════════════════
// RICH EDITOR
// ════════════════════
function buildRichEditor(nb){
  const wrap=document.createElement('div');wrap.className='rich-editor-wrap';
  let showSearch=false;

  // Search bar
  const searchBar=document.createElement('div');searchBar.className='search-bar';searchBar.style.display='none';
  const searchInp=document.createElement('input');searchInp.placeholder='S\u00f8k i notat\u2026';
  const searchCount=document.createElement('span');searchCount.style.cssText='font-size:12px;color:var(--muted);white-space:nowrap';
  const searchClose=document.createElement('button');searchClose.className='rtb';searchClose.textContent='\u00d7';
  searchClose.onclick=()=>{searchBar.style.display='none';showSearch=false;clearHighlights(editor);};
  searchBar.appendChild(searchInp);searchBar.appendChild(searchCount);searchBar.appendChild(searchClose);

  // Toolbar
  const tb=document.createElement('div');tb.className='rich-toolbar';
  function rtb(label,title,fn){const b=document.createElement('button');b.className='rtb';b.innerHTML=label;b.title=title;b.type='button';b.onmousedown=e=>{e.preventDefault();fn();};return b;}
  function sep(){const s=document.createElement('div');s.className='rtb-sep';return s;}

  // Color picker
  const colors=['#e24b4b','#f5a623','#27ae60','#2980b9','#8e44ad','#e91e8c'];
  const hlColors=['#fef5c4','#f7c5d5','#b8e8c8','#b8d4f8','#e2b8f8'];

  tb.appendChild(rtb('<b>B</b>','Fet',()=>exec('bold')));
  tb.appendChild(rtb('<i>I</i>','Kursiv',()=>exec('italic')));
  tb.appendChild(rtb('<u>U</u>','Understrek',()=>exec('underline')));
  tb.appendChild(sep());
  tb.appendChild(rtb('&#8226; Liste','Punktliste',()=>exec('insertUnorderedList')));
  tb.appendChild(rtb('1. Liste','Nummerert',()=>exec('insertOrderedList')));
  tb.appendChild(sep());

  // Text color btn
  const tcBtn=document.createElement('button');tcBtn.className='rtb';tcBtn.title='Tekstfarge';
  tcBtn.innerHTML='A&#9660;';tcBtn.style.position='relative';
  const tcPicker=document.createElement('div');tcPicker.style.cssText='position:absolute;top:100%;left:0;background:var(--surface);border:1.5px solid var(--border);border-radius:8px;padding:6px;display:none;z-index:50;flex-wrap:wrap;gap:4px;width:120px';
  colors.forEach(c=>{const dot=document.createElement('div');dot.style.cssText='width:18px;height:18px;border-radius:50%;background:'+c+';cursor:pointer;border:2px solid transparent';dot.onmousedown=e=>{e.preventDefault();exec('foreColor',c);tcPicker.style.display='none';};tcPicker.appendChild(dot);});
  tcBtn.appendChild(tcPicker);
  tcBtn.onmousedown=e=>{e.preventDefault();tcPicker.style.display=tcPicker.style.display==='none'?'flex':'none';};
  tb.appendChild(tcBtn);

  // Highlight color btn
  const hlBtn=document.createElement('button');hlBtn.className='rtb';hlBtn.title='Marker tekst';
  hlBtn.innerHTML='&#127800;&#9660;';hlBtn.style.position='relative';
  const hlPicker=document.createElement('div');hlPicker.style.cssText='position:absolute;top:100%;left:0;background:var(--surface);border:1.5px solid var(--border);border-radius:8px;padding:6px;display:none;z-index:50;flex-wrap:wrap;gap:4px;width:100px';
  hlColors.forEach(c=>{const dot=document.createElement('div');dot.style.cssText='width:18px;height:18px;border-radius:50%;background:'+c+';cursor:pointer;border:2px solid rgba(0,0,0,.1)';dot.onmousedown=e=>{e.preventDefault();exec('hiliteColor',c);hlPicker.style.display='none';};hlPicker.appendChild(dot);});
  hlBtn.appendChild(hlPicker);
  hlBtn.onmousedown=e=>{e.preventDefault();hlPicker.style.display=hlPicker.style.display==='none'?'flex':'none';};
  tb.appendChild(hlBtn);
  tb.appendChild(sep());

  // Image upload
  const imgInput=document.createElement('input');imgInput.type='file';imgInput.accept='image/*';imgInput.style.display='none';imgInput.onchange=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{exec('insertHTML','<img src="'+ev.target.result+'" style="max-width:100%;border-radius:8px;margin:.5rem 0">');saveEditor();};reader.readAsDataURL(file);};
  tb.appendChild(imgInput);
  tb.appendChild(rtb('&#128247; Bilde','Last opp bilde',()=>imgInput.click()));
  tb.appendChild(sep());

  // Search
  tb.appendChild(rtb('&#128269; S\u00f8k','S\u00f8k i notat',()=>{showSearch=!showSearch;searchBar.style.display=showSearch?'flex':'none';if(showSearch)setTimeout(()=>searchInp.focus(),50);}));

  // Export
  const expBtn=document.createElement('button');expBtn.className='rtb';expBtn.innerHTML='&#8681; Eksport';expBtn.title='Eksporter notat';expBtn.style.position='relative';
  const expMenu=document.createElement('div');expMenu.style.cssText='position:absolute;top:100%;right:0;background:var(--surface);border:1.5px solid var(--border);border-radius:8px;padding:4px;display:none;z-index:50;min-width:100px';
  [['TXT',exportTxt],['PDF',exportPdf]].forEach(([label,fn])=>{const item=document.createElement('button');item.className='rtb';item.style.cssText='display:block;width:100%;text-align:left;padding:6px 10px;font-size:13px';item.textContent=label;item.onmousedown=e=>{e.preventDefault();fn();expMenu.style.display='none';};expMenu.appendChild(item);});
  expBtn.appendChild(expMenu);expBtn.onmousedown=e=>{e.preventDefault();expMenu.style.display=expMenu.style.display==='none'?'block':'none';};
  tb.appendChild(expBtn);

  // Editor area
  const editor=document.createElement('div');editor.className='rich-editor';editor.contentEditable='true';
  editor.setAttribute('data-placeholder','Tanker, ideer, notater uten struktur\u2026');
  if(nb.friHtml){editor.innerHTML=nb.friHtml;}else if(nb.fri){editor.innerText=nb.fri;}

  function exec(cmd,val){document.execCommand(cmd,false,val||null);}
  function saveEditor(){notebooks[activeNotebook].friHtml=editor.innerHTML;notebooks[activeNotebook].fri=editor.innerText;savePersonal();updateStats();}
  editor.oninput=saveEditor;

  // Drag & drop images
  editor.addEventListener('dragover',e=>{e.preventDefault();editor.classList.add('rich-dragover');});
  editor.addEventListener('dragleave',()=>editor.classList.remove('rich-dragover'));
  editor.addEventListener('drop',e=>{
    e.preventDefault();editor.classList.remove('rich-dragover');
    const files=[...e.dataTransfer.files];
    files.forEach(file=>{
      if(file.type.startsWith('image/')){
        const reader=new FileReader();reader.onload=ev=>{exec('insertHTML','<img src="'+ev.target.result+'" style="max-width:100%;border-radius:8px;margin:.5rem 0">');saveEditor();};reader.readAsDataURL(file);
      }
    });
  });

  // Close color pickers on outside click
  document.addEventListener('mousedown',e=>{try{if(tcPicker&&!tcBtn.contains(e.target))tcPicker.style.display='none';if(hlPicker&&!hlBtn.contains(e.target))hlPicker.style.display='none';if(expMenu&&!expBtn.contains(e.target))expMenu.style.display='none';}catch(err){}},{passive:true});

  // Stats bar
  const stats=document.createElement('div');stats.className='rich-stats';
  function updateStats(){
    const txt=editor.innerText||'';
    const words=txt.trim()?txt.trim().split(/\s+/).length:0;
    const chars=txt.length;
    stats.textContent=words+' ord \u00b7 '+chars+' tegn';
  }
  editor.addEventListener('input',updateStats);

  // Search logic
  function clearHighlights(el){el.innerHTML=el.innerHTML.replace(/<mark[^>]*>(.*?)<\/mark>/gi,'$1');}
  searchInp.oninput=()=>{
    clearHighlights(editor);
    const q=searchInp.value.trim();if(!q){searchCount.textContent='';return;}
    const regex=new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi');
    editor.innerHTML=editor.innerHTML.replace(regex,'<mark>$1</mark>');
    const hits=editor.querySelectorAll('mark').length;
    searchCount.textContent=hits?hits+' treff':'Ingen treff';
    saveEditor();
  };

  // Export functions
  function exportTxt(){const a=document.createElement('a');a.href='data:text/plain;charset=utf-8,'+encodeURIComponent(editor.innerText);a.download=(notebooks[activeNotebook].name||'notat')+'.txt';a.click();}
  function exportPdf(){const w=window.open('','_blank');const ttl=notebooks[activeNotebook].name;const css='body{font-family:Georgia,serif;max-width:700px;margin:2rem auto;line-height:1.7;color:#333}img{max-width:100%}';const body=editor.innerHTML;w.document.open();w.document.write('<!DOCTYPE html><html><head><title>'+ttl+'</title><style>'+css+'</style></head><body>'+body+'</body></html>');w.document.close();setTimeout(()=>{w.print();},500);}

  // Word count init
  setTimeout(updateStats,50);

  wrap.appendChild(tb);wrap.appendChild(searchBar);wrap.appendChild(editor);wrap.appendChild(stats);
  return wrap;
}

// ════════════════════
// RENAME NOTEBOOK TAB
// ════════════════════
function startRenameTab(i,span){
  span.contentEditable='true';span.focus();
  const range=document.createRange();range.selectNodeContents(span);
  const sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);
  function finish(){
    span.contentEditable='false';
    const name=span.textContent.trim();
    if(name){notebooks[i].name=name;savePersonal();}
    else{span.textContent=notebooks[i].name;}
  }
  span.onblur=finish;
  span.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();span.blur();}if(e.key==='Escape'){span.textContent=notebooks[i].name;span.blur();}};
}

// ════════════════════
// VELKOMST-MELDING
// ════════════════════
