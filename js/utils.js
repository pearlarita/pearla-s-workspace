// js/utils.js
function updateClock(){const n=new Date();document.getElementById('clock-label').textContent=String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0')+':'+String(n.getSeconds()).padStart(2,'0');}
updateClock();setInterval(updateClock,1000);

let tasks=[];let taskArchive=[],taskBacklog=[];
let events={},projects=[],meetings=[],retros=[],retroDaily=[],retroMonthly=[],energyLog={},moodLog=[],completionLog={},timeLog=[];
let calYear=todayY,calMonth=todayM,modalDate=null;
let pomoSec=1500,pomoRunning=false,pomoInt=null,pomoSessions=0,pomoMode='focus';
const POMO_TIMES={focus:1500,short:300,long:900};
const POMO_LABELS={focus:'Fokus\u00f8kt',short:'Kort pause',long:'Lang pause'};
let focusTaskId=null,sheetsUrl='https://script.google.com/macros/s/AKfycbzr3dp0Dc4LSXKWkrt2KYc30F2SModVOcZJjxibyirrip5cex88OYZRIKAqun5Uh5_h/exec';
let liveTimerStart=null,liveTimerInt=null,liveTimerRunning=false;
let currentRetroTab='daily',retroDailyEnergy=3;

function fmtKey(y,m,d){return y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0')}
function todayKey(){return fmtKey(todayY,todayM,todayD)}
function weekKey(){const d=new Date(now);d.setDate(d.getDate()-(d.getDay()===0?6:d.getDay()-1));return fmtKey(d.getFullYear(),d.getMonth(),d.getDate())}
function monthKey(){return todayY+'-'+String(todayM+1).padStart(2,'0')}


