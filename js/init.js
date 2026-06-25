// js/init.js — kjøres sist, etter alle andre script-filer er lastet
loadPersonal();
loadMeetingCats();
loadMatrise();
localLoad();
checkRecurring();
renderAll();
setTimeout(function(){updateRetroSlider();updatePomoSlider();},50);
if(sheetsUrl){setSyncStatus('connected');loadFromSheets();}else{setSyncStatus('disconnected');}
const _manDateEl=document.getElementById('man-date');if(_manDateEl)_manDateEl.value=todayKey();
