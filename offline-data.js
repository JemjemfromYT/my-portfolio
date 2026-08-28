/*
  Public offline backup for my-portfolio.
  Replace the empty arrays with exported public Supabase rows.
  Never put Supabase keys, admin data, or private user data in this file.
*/
window.OFFLINE_PORTFOLIO = {
  profile_info: null,
  site_settings: {
    id: 1,
    life_quote: "If you're going through hell, keep going. Why would you stop in hell?"
  },
  wisdom_slides: [
    { id: "offline-1", text: "If you're going through hell", display_order: 1 },
    { id: "offline-2", text: "Keep going", display_order: 2 },
    { id: "offline-3", text: "Why would you stop in hell", display_order: 3 }
  ],
  projects: [],
  certificates: [],
  hobbies: [],
  music: [],
  socials: [],
  hobby_gallery: []
};
(function () {
  try {
    const saved = JSON.parse(localStorage.getItem('portfolio-offline-backup') || 'null');
    if (saved && typeof saved === 'object') window.OFFLINE_PORTFOLIO = { ...window.OFFLINE_PORTFOLIO, ...saved };
  } catch (_) {}
})();
