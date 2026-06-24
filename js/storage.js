// js/storage.js
function localSave(){try{
  localStorage.setItem('adhd_t9',JSON.stringify(tasks));
  localStorage.setItem('adhd_archive',JSON.stringify(taskArchive));
  localStorage.setItem('adhd_backlog',JSON.stringify(taskBacklog));
  localStorage.setItem('adhd_ev9',JSON.stringify(events));
  localStorage.setItem('adhd_proj9',JSON.stringify(projects));
  localStorage.setItem('adhd_meet9',JSON.stringify(meetings));
  localStorage.setItem('adhd_meetcats',JSON.stringify(meetingCategories||[]));
  localStorage.setItem('adhd_ret9',JSON.stringify(retros));
  localStorage.setItem('adhd_retd9',JSON.stringify(retroDaily));
  localStorage.setItem('adhd_retm9',JSON.stringify(retroMonthly));
  localStorage.setItem('adhd_eng9',JSON.stringify(energyLog));
  localStorage.setItem('adhd_mood9',JSON.stringify(moodLog));
  localStorage.setItem('adhd_comp9',JSON.stringify(completionLog));
  localStorage.setItem('adhd_time9',JSON.stringify(timeLog));
  localStorage.setItem('adhd_matrise',JSON.stringify(matriseItems));
  localStorage.setItem('adhd_notebooks',JSON.stringify(notebooks));
  localStorage.setItem('adhd_active_notebook',String(activeNotebook));

  localStorage.setItem('pa_handel',JSON.stringify(handelList));
  localStorage.setItem('pa_hjem',JSON.stringify(hjemList));
  localStorage.setItem('pa_vaner',JSON.stringify(vaner));
  localStorage.setItem('pa_trening',JSON.stringify(treningLog));
  localStorage.setItem('pa_matideas',JSON.stringify(window.matIdeas||[]));
  localStorage.setItem('pa_sosialt',JSON.stringify(sosialtList));
  localStorage.setItem('pa_ok',JSON.stringify(okonomiList));
  localStorage.setItem('pa_mal',JSON.stringify(malList));
  localStorage.setItem('pa_dagbok',JSON.stringify(dagbok));
  localStorage.setItem('pa_fritid',JSON.stringify(fritidList));
}catch(e){}}

function localLoad(){try{
  const t=localStorage.getItem('adhd_t9');if(t)tasks=JSON.parse(t);
  const ta=localStorage.getItem('adhd_archive');if(ta)taskArchive=JSON.parse(ta);
  const tb=localStorage.getItem('adhd_backlog');if(tb)taskBacklog=JSON.parse(tb);
  const e=localStorage.getItem('adhd_ev9');if(e)events=JSON.parse(e);
  const p=localStorage.getItem('adhd_proj9');if(p)projects=JSON.parse(p);
  const m=localStorage.getItem('adhd_meet9');if(m)meetings=JSON.parse(m);
  const mc=localStorage.getItem('adhd_meetcats');if(mc)meetingCategories=JSON.parse(mc);
  const r=localStorage.getItem('adhd_ret9');if(r)retros=JSON.parse(r);
  const rd=localStorage.getItem('adhd_retd9');if(rd)retroDaily=JSON.parse(rd);
  const rm=localStorage.getItem('adhd_retm9');if(rm)retroMonthly=JSON.parse(rm);
  const en=localStorage.getItem('adhd_eng9');if(en)energyLog=JSON.parse(en);
  const mo=localStorage.getItem('adhd_mood9');if(mo)moodLog=JSON.parse(mo);
  const cl=localStorage.getItem('adhd_comp9');if(cl)completionLog=JSON.parse(cl);
  const tl=localStorage.getItem('adhd_time9');if(tl)timeLog=JSON.parse(tl);
  const mat=localStorage.getItem('adhd_matrise');if(mat)matriseItems=JSON.parse(mat);
  const nbk=localStorage.getItem('adhd_notebooks');if(nbk)notebooks=JSON.parse(nbk);
  const an=localStorage.getItem('adhd_active_notebook');if(an)activeNotebook=parseInt(an)||0;

  const ph=localStorage.getItem('pa_handel');if(ph)handelList=JSON.parse(ph);
  const phj=localStorage.getItem('pa_hjem');if(phj)hjemList=JSON.parse(phj);
  const pv=localStorage.getItem('pa_vaner');if(pv)vaner=JSON.parse(pv);
  const ptr=localStorage.getItem('pa_trening');if(ptr)treningLog=JSON.parse(ptr);
  const pmi=localStorage.getItem('pa_matideas');if(pmi)window.matIdeas=JSON.parse(pmi);
  const pso=localStorage.getItem('pa_sosialt');if(pso)sosialtList=JSON.parse(pso);
  const pok=localStorage.getItem('pa_ok');if(pok)okonomiList=JSON.parse(pok);
  const pma=localStorage.getItem('pa_mal');if(pma)malList=JSON.parse(pma);
  const pdb=localStorage.getItem('pa_dagbok');if(pdb)dagbok=JSON.parse(pdb);
  const pfr=localStorage.getItem('pa_fritid');if(pfr)fritidList=JSON.parse(pfr);

  const pk=localStorage.getItem('adhd_p9');if(pk&&document.getElementById('parking-pad'))document.getElementById('parking-pad').value=pk;
  const su=localStorage.getItem('adhd_sheets_url');
  if(su){sheetsUrl=su;if(document.getElementById('sheets-url'))document.getElementById('sheets-url').value=su;}
  else{if(document.getElementById('sheets-url'))document.getElementById('sheets-url').value=sheetsUrl;}
}catch(e){}}

function saveAll(){
  localSave();
  clearTimeout(saveAll._t);
  saveAll._t=setTimeout(function(){
    saveAllToSheets();
  },2000);
}

function savePersonal(){ saveAll(); }
function savematrise(){ saveAll(); }

const PAGE_TITLES={dag:'&#9728;&#65039; Dag',prosjekt:'&#128202; Prosjekter',mote:'&#128101; Møte',retro:'&#128260; Retrospektiv',timer:'&#9200; Timeføring',mer:'&#9889; Energi',stats:'&#128200; Statistikk',matrise:'&#127919; Prioriteringsmatrise',notater:'&#128203; Notater & rutiner',handel:'&#128722; Handleliste',hjem:'&#9994;&#65039; Gjøremål',vaner:'&#127775; Vaner',trening:'&#127947; Trening',mat:'&#127859; Måltider',sosialt:'&#128149; Familie & sosialt',okonomi:'&#128176; Økonomi',mal:'&#127919; Mål',dagbok:'&#128214; Dagbok',fritid:'&#127912; Fritidsprosjekter',dashboard:"Pearla's Workspace"};
