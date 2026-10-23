/* =========================================
   AMAN IMAGE HOST  |  API 3 : Cloudinary
   Cloud name: Cloudinary Dashboard par dikhta hai
   Preset: Settings > Upload > Upload presets > Add > Signing mode = "Unsigned"
   ========================================= */
window.AmanAPI = window.AmanAPI || {};

window.AmanAPI.cloudinary = {
  name: 'Cloudinary',

  // >>> YAHAN APNA CLOUD NAME AUR UNSIGNED PRESET DAALO <<<
  config: {
    cloudName: 'cbxwtmhl',
    uploadPreset: 'aman_unsigned'
  },

  async upload(file){
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', this.config.uploadPreset);

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/' + encodeURIComponent(this.config.cloudName) + '/image/upload',
      { method: 'POST', body: fd }
    );
    const json = await res.json();
    if(!res.ok || !json.secure_url) throw new Error(json.error?.message || 'Cloudinary upload failed');
    return json.secure_url;
  }
};
