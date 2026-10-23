/* =========================================
   AMAN IMAGE HOST  |  API 1 : ImgBB
   Key kahan se laye: https://api.imgbb.com  ->  "Get API key"
   ========================================= */
window.AmanAPI = window.AmanAPI || {};

window.AmanAPI.imgbb = {
  name: 'ImgBB',

  // >>> YAHAN APNI IMGBB API KEY DAALO <<<
  config: { key: '3b8e43acc33e78a2fcb1fbe5641d2302' },

  async upload(file){
    const fd = new FormData();
    fd.append('image', file);

    const res = await fetch(
      'https://api.imgbb.com/1/upload?key=' + encodeURIComponent(this.config.key),
      { method: 'POST', body: fd }
    );
    const json = await res.json();
    if(!res.ok || !json.success) throw new Error(json.error?.message || 'ImgBB upload failed');
    return json.data.url;
  }
};
