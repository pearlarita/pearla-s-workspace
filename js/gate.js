
// js/gate.js — enkel tilgangssperre (friksjon, ikke ekte sikkerhet)
// Passordet er SHA-256-hashet slik at det ikke ligger i klartekst i kildekoden.
// Bytt PASSWORD_HASH ved å kjøre i nettleserkonsollen:
//   crypto.subtle.digest('SHA-256', new TextEncoder().encode('dittPassord')).then(b=>console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))

const PASSWORD_HASH = 'REPLACE_WITH_YOUR_HASH';
const GATE_SESSION_KEY = 'pearla_gate_unlocked';

async function sha256(text){
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,'0')).join('');
}

function showGate(){
  const gate = document.createElement('div');
  gate.id = 'access-gate';
  gate.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#FFF7FA;z-index:99999;display:flex;align-items:center;justify-content:center;font-family:Manjari,system-ui,sans-serif';
  gate.innerHTML = `
    <div style="background:#FFFCE8;border:1.5px solid #D4B896;border-radius:16px;padding:2rem;width:88%;max-width:340px;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,.08)">
      <div style="font-size:32px;margin-bottom:.5rem">&#11088;</div>
      <div style="font-size:18px;font-weight:700;color:#2C1F1A;margin-bottom:1.25rem">Pearla's Workspace</div>
      <input id="gate-input" type="password" placeholder="Passord" autocomplete="off"
        style="width:100%;box-sizing:border-box;border:1.5px solid #D4B896;border-radius:10px;padding:.75rem .875rem;font-size:15px;font-family:Manjari,sans-serif;color:#2C1F1A;background:#fff;outline:none;margin-bottom:.75rem">
      <button id="gate-submit"
        style="width:100%;padding:.75rem;border-radius:10px;border:1.5px solid #e89ab5;background:#f7c5d5;color:#7a1f48;font-size:15px;font-weight:700;font-family:Manjari,sans-serif;cursor:pointer">
        Lås opp
      </button>
      <div id="gate-error" style="color:#b84d7a;font-size:12px;margin-top:.75rem;min-height:16px"></div>
    </div>
  `;
  document.documentElement.appendChild(gate);

  const input = gate.querySelector('#gate-input');
  const btn = gate.querySelector('#gate-submit');
  const errEl = gate.querySelector('#gate-error');

  async function tryUnlock(){
    const val = input.value;
    const hash = await sha256(val);
    if(hash === PASSWORD_HASH){
      sessionStorage.setItem(GATE_SESSION_KEY, '1');
      gate.remove();
      document.documentElement.style.visibility = 'visible';
    } else {
      errEl.textContent = 'Feil passord';
      input.value = '';
      input.focus();
    }
  }
  btn.onclick = tryUnlock;
  input.onkeydown = e => { if(e.key === 'Enter') tryUnlock(); };
  setTimeout(() => input.focus(), 100);
}

(function checkGate(){
  document.documentElement.style.visibility = 'hidden';
  if(sessionStorage.getItem(GATE_SESSION_KEY) === '1'){
    document.documentElement.style.visibility = 'visible';
    return;
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', showGate);
  } else {
    showGate();
  }
})();
