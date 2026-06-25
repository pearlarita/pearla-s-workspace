// js/projects.js
function deleteProject(idx){
  const p=projects[idx];if(!p)return;
  const existing=document.getElementById('del-confirm');if(existing)existing.remove();
  const toast=document.createElement('div');toast.id='del-confirm';
  toast.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--text);color:#fff;border-radius:14px;padding:1rem 1.25rem;z-index:600;width:88%;max-width:320px;box-shadow:0 8px 24px rgba(0,0,0,.25);font-family:var(--font)';
  toast.innerHTML='<div style="font-size:14px;font-weight:700;margin-bottom:.75rem">Slette \"'+p.name+'\"?</div><div style="display:flex;gap:8px"><button onclick="confirmDelete('+idx+')" style="flex:1;padding:.7rem;background:#c4608a;border:none;border-radius:10px;color:#fff;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font)">Slett</button><button onclick="document.getElementById(\'del-confirm\').remove()" style="flex:1;padding:.7rem;background:rgba(255,255,255,.15);border:none;border-radius:10px;color:#fff;font-size:14px;cursor:pointer;font-family:var(--font)">Avbryt</button></div>';
  document.body.appendChild(toast);setTimeout(()=>{const t=document.getElementById('del-confirm');if(t)t.remove();},4000);
}
function confirmDelete(idx){const t=document.getElementById('del-confirm');if(t)t.remove();projects.splice(idx,1);saveAll();renderProjects();}

// WEEK
