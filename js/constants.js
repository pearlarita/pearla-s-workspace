// Constants and global variables

const DAYS_NO=['S\u00f8ndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','L\u00f8rdag'];
const MONTHS_NO=['januar','februar','mars','april','mai','juni','juli','august','september','oktober','november','desember'];
const DAYS_SHORT=['Ma','Ti','On','To','Fr','L\u00f8','S\u00f8'];
const TIME_SLOTS=['08\u201310','10\u201312','12\u201314','14\u201316','16\u201318'];
const MOODS=[{e:'\ud83d\ude3f',l:'Sliten'},{e:'\ud83d\ude3c',l:'Ok'},{e:'\ud83d\ude3a',l:'Bra'},{e:'\ud83d\ude38',l:'Super'},{e:'\ud83d\ude3e',l:'Stresset'}];
const TASK_COLORS=['#e0dae0','#f7c5d5','#fdeea3','#b8e8c8','#b8d4f8','#e2b8f8'];
const PROJECT_COLORS=['#e0dae0','#f7c5d5','#fdeea3','#b8e8c8','#b8d4f8','#e2b8f8','#ffc8a2','#c8f0d8'];
const RECUR_LABELS={daily:'Daglig',weekly:'Ukentlig',workdays:'Hverdager'};
const now=new Date();
const todayY=now.getFullYear(),todayM=now.getMonth(),todayD=now.getDate();
document.getElementById('day-label').textContent=DAYS_NO[now.getDay()]+' '+todayD+'. '+MONTHS_NO[todayM];
