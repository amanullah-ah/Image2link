/* =========================================
   AMAN IMAGE HOST  |  API 2 : Catbox
   Catbox ko API key ki zaroorat nahi (anonymous upload).
   Optional: catbox.moe par account bana kar userhash daalo
   to uploads aapke account me save hongi.
   ========================================= */
window.AmanAPI = window.AmanAPI || {};

window.AmanAPI.catbox = {
  name: 'Catbox',

  // userhash optional hai, khali chhod do to bhi chalega
  // Demo value — real userhash Catbox account settings se milega
  config: { userhash: 'bf2a5f246e867741e510e5a38' },

  async upload(file){
    const fd = new FormData();
    fd.append('reqtype', 'fileupload');
    if(this.config.userhash) fd.append('userhash', this.config.userhash);
    fd.append('fileToUpload', file);

    const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: fd });
    const text = (await res.text()).trim();
    if(!res.ok || !/^https?:\/\//.test(text)) throw new Error(text || 'Catbox upload failed');
    return text;
  }
};
