/* =========================================
   AMAN IMAGE HOST  |  Main logic
   Teeno API files (aman-*.js) window.AmanAPI me judti hain.
   ========================================= */
(function(){
  const MAX_MB = 10;

  const $ = id => document.getElementById(id);
  const fileInput = $('fileInput'), source = $('source'), srcImg = $('srcImg'), srcInfo = $('srcInfo');
  const linkInput = $('linkInput'), copyBtn = $('copyBtn'), openLink = $('openLink'), toast = $('toast');
  const btns = [...document.querySelectorAll('.prov-btn')];

  let file = null, toastTimer, busy = false;

  function showToast(msg){
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }
  function fmtSize(b){ return b < 1048576 ? Math.round(b/1024) + ' KB' : (b/1048576).toFixed(1) + ' MB'; }

  // Key abhi bhi placeholder (YOUR_...) hai to false
  function isConfigured(api){
    return !Object.values(api.config).some(v => typeof v === 'string' && v.startsWith('YOUR_'));
  }

  function resetResult(){
    source.classList.remove('scanning');
    linkInput.value = '';
    openLink.classList.remove('show');
  }

  /* ---- Image choose ---- */
  source.addEventListener('click', () => fileInput.click());
  source.addEventListener('keydown', e => {
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); fileInput.click(); }
  });

  fileInput.addEventListener('change', () => {
    const f = fileInput.files[0];
    if(!f) return;
    if(!f.type.startsWith('image/')){ showToast('Sirf image file choose karo'); return; }
    if(f.size > MAX_MB * 1048576){ showToast('Image ' + MAX_MB + ' MB se chhoti honi chahiye'); return; }
    file = f;
    const url = URL.createObjectURL(f);
    srcImg.onload = () => URL.revokeObjectURL(url);
    srcImg.src = url;
    srcInfo.textContent = f.name + ' · ' + fmtSize(f.size);
    source.classList.add('has-img');
    resetResult();
  });

  /* ---- Upload (button ke data-p se sahi API file chunti hai) ---- */
  async function upload(p, btn){
    if(busy) return;
    const api = (window.AmanAPI || {})[p];
    if(!api){ showToast('API file load nahi hui: ' + p); return; }
    if(!file){ showToast('Pehle image choose karo'); fileInput.click(); return; }
    if(!isConfigured(api)){ showToast(api.name + ' ki API key apni .js file me daalo'); return; }

    busy = true;
    btns.forEach(b => b.disabled = true);
    btn.classList.add('busy');
    resetResult();
    source.classList.add('scanning');

    try{
      const link = await api.upload(file);
      linkInput.value = link;
      openLink.href = link;
      openLink.classList.add('show');
      srcInfo.textContent = '✓ ' + api.name + ' · ' + fmtSize(file.size);
      source.classList.remove('scanning');
      showToast('Uploaded on ' + api.name);
    }catch(err){
      source.classList.remove('scanning');
      showToast((err && err.message) ? err.message : 'Upload fail ho gaya');
    }
    busy = false;
    btns.forEach(b => b.disabled = false);
    btn.classList.remove('busy');
  }

  btns.forEach(b => b.addEventListener('click', () => upload(b.dataset.p, b)));

  /* ---- Copy ---- */
  copyBtn.addEventListener('click', async () => {
    if(!linkInput.value){ showToast('Pehle image upload karo'); return; }
    try{ await navigator.clipboard.writeText(linkInput.value); }
    catch{ linkInput.select(); document.execCommand('copy'); }
    showToast('Link copied');
  });
})();
