const supabaseUrl = 'https://mpcjnyuczjukfazplqjc.supabase.co';
const supabaseKey = 'sb_publishable_S8r-c688VW112n85RRZ7Vw_e5p7W6Fr';
const db = window.supabase.createClient(supabaseUrl, supabaseKey);

const stealthBtn = document.getElementById('stealth-btn');
const adminIndicator = document.getElementById('admin-indicator');

const projectBox = document.getElementById('project-container');
const projectFiltersBox = document.getElementById('project-filters');
const certBox = document.getElementById('cert-container');
const hobbyBox = document.getElementById('hobby-container');
const socialBox = document.getElementById('social-container');

const projectWrapper = document.getElementById('project-wrapper');
const certWrapper = document.getElementById('cert-wrapper');
const hobbyWrapper = document.getElementById('hobby-wrapper');
const socialWrapper = document.getElementById('social-wrapper');

const viewAllProjectsBtn = document.getElementById('view-all-projects-btn');
const viewAllCertBtn = document.getElementById('view-all-cert-btn');
const viewAllHobbyBtn = document.getElementById('view-all-hobby-btn');
const viewAllSocialBtn = document.getElementById('view-all-social-btn');

const addProjectBtn = document.getElementById('add-project-btn');
const addCertBtn = document.getElementById('add-cert-btn');
const addHobbyBtn = document.getElementById('add-hobby-btn');
const addSocialBtn = document.getElementById('add-social-btn');

// Profile elements
const profileTagline = document.getElementById('profile-tagline');
const profileBio = document.getElementById('profile-bio');
const profileTechStack = document.getElementById('profile-tech-stack');
const profileStatus = document.getElementById('profile-status');
const profileLocation = document.getElementById('profile-location');
const editProfileBtn = document.getElementById('edit-profile-btn');
const profileModal = document.getElementById('profile-modal');
const profileForm = document.getElementById('profile-form');

// Quote elements
const quoteText = document.getElementById('quote-text');
const editQuoteBtn = document.getElementById('edit-quote-btn');
const quoteModal = document.getElementById('quote-modal');
const quoteForm = document.getElementById('quote-form');

// Music elements
const musicContainer = document.getElementById('music-container');
const addMusicBtn = document.getElementById('add-music-btn');
const musicModal = document.getElementById('music-modal');
const musicForm = document.getElementById('music-form');

// Styx Helix Mode elements
const styxAudio = document.getElementById('styx-audio');
const emiliaSilhouette = document.getElementById('emilia-silhouette');
const discoLights = document.getElementById('disco-lights');
const lyricsContainer = document.getElementById('lyrics-container');
const lyricsText = document.getElementById('lyrics-text');
const beatFlash = document.getElementById('beat-flash');
const musicPlayerBar = document.getElementById('music-player-bar');
const musicPlayPause = document.getElementById('music-play-pause');
const playIcon = document.getElementById('play-icon');
const musicStop = document.getElementById('music-stop');
const musicTitle = document.getElementById('music-title');
const musicCurrentTime = document.getElementById('music-current-time');
const musicDurationEl = document.getElementById('music-duration');
const musicProgress = document.getElementById('music-progress');
const musicProgressFill = document.getElementById('music-progress-fill');

// Wisdom slider elements
const wisdomTrack = document.getElementById('wisdom-track');
const wisdomDots = document.getElementById('wisdom-dots');
const wisdomPrev = document.getElementById('wisdom-prev');
const wisdomNext = document.getElementById('wisdom-next');
const editWisdomBtn = document.getElementById('edit-wisdom-btn');
const wisdomModal = document.getElementById('wisdom-modal');
const wisdomForm = document.getElementById('wisdom-form');

let isAdmin = false;
let profileData = null;
let siteSettings = null;
let wisdomSlides = [];
let currentWisdomSlide = 0;
let currentHobbyId = null;
let allProjects = [];
let allCerts = [];
let activeFilters = new Set();
let allMusic = [];
let currentPlayingMusic = null;
let isStyxHelixMode = false;
let lyricsAnimationFrame = null;
let lastLyricIndex = -1;
let hasAutoPlayedStyx = false;

// STYX HELIX Lyrics with timestamps (in seconds)
// Format: { time: seconds, text: "lyrics", isChorus: boolean }
const STYX_HELIX_LYRICS = [
    { time: 0.00, text: "", isChorus: false },

    // Intro (+2.5s total offset)
    { time: 18.96, text: "Oh, please don't let me die", isChorus: true },
    { time: 20.71, text: "Waiting for your touch", isChorus: true },
    { time: 26.70, text: "No, don't give up on life", isChorus: true },
    { time: 28.73, text: "This endless dead end", isChorus: true },

    // Verse 1
    { time: 36.72, text: "Kurutta tokei kizamu inochi", isChorus: false },
    { time: 40.46, text: "Koboreteku kioku no suna", isChorus: false },
    { time: 44.23, text: "Mebaeta omoi made", isChorus: false },
    { time: 48.20, text: "Nee konna ni akkenaku", isChorus: false },
    { time: 55.23, text: "Kiete shimau no", isChorus: false },
    { time: 60.22, text: "I wish I was there", isChorus: false },

    // Chorus 1
    { time: 61.98, text: "Oh, please don't let me die", isChorus: true },
    { time: 63.97, text: "Waiting for your touch", isChorus: true },
    { time: 66.21, text: "Nidoto nanimo nakusanu you ni", isChorus: true },
    { time: 71.07, text: "Watashi wo wasurete hajimete \"Restart\"", isChorus: true },
    { time: 77.47, text: "No, don't give up on life", isChorus: true },
    { time: 79.72, text: "This endless dead end", isChorus: true },
    { time: 81.72, text: "Kimi wo kudaku kono kanashimi ga", isChorus: true },
    { time: 86.22, text: "Itsuka owarimasu you ni", isChorus: true },
    { time: 91.71, text: "For now I'll see you off", isChorus: true },

    // Verse 2
    { time: 95.72, text: "My time is spinning around", isChorus: false },
    { time: 99.72, text: "Your deep black eyes", isChorus: false },
    { time: 103.47, text: "I forgot what time it is", isChorus: false },
    { time: 107.22, text: "And all our memories are gone?", isChorus: false },
    { time: 112.71, text: "Amai kaori hanatsu", isChorus: false },
    { time: 116.70, text: "Tsuioku to iu na no wana", isChorus: false },
    { time: 120.70, text: "Sasoware toraware", isChorus: false },
    { time: 124.22, text: "Naze aragae mo sezu mata", isChorus: false },
    { time: 131.22, text: "Oborete shimau no", isChorus: false },
    { time: 136.24, text: "I wish you were here", isChorus: false },

    // Chorus 2
    { time: 137.98, text: "Oh, never close your eyes", isChorus: true },
    { time: 139.97, text: "Searching for a true fate", isChorus: true },
    { time: 143.21, text: "Dokoka kieta ano nukumori wo", isChorus: true },
    { time: 147.07, text: "Oikake tsuzukete miushinau \"Restart\"", isChorus: true },
    { time: 153.47, text: "So, let us try again", isChorus: true },
    { time: 155.72, text: "From the very first time", isChorus: true },
    { time: 158.48, text: "\"Kitto kitto\" sou yatte ima mo", isChorus: true },
    { time: 162.46, text: "Munashii wa wo egaiteru", isChorus: true },
    { time: 167.95, text: "For now, see you again", isChorus: true },

    // Bridge
    { time: 171.56, text: "Fading in, fading out", isChorus: false },
    { time: 175.50, text: "Fading in, fading out", isChorus: false },
    { time: 198.67, text: "I wish we were there", isChorus: false },
    { time: 200.72, text: "Ano hibi ni wa modorenai", isChorus: false },
    { time: 204.47, text: "Toki wa tsuyoku kanashiku tsuyoku", isChorus: false },
    { time: 208.71, text: "Tada tada susunde yuku dake \"Restart\"", isChorus: false },

    // Final Chorus
    { time: 215.97, text: "No, don't give up on life", isChorus: true },
    { time: 218.23, text: "This endless dead end", isChorus: true },
    { time: 220.22, text: "Furikaeranai sonna tsuyosa wo", isChorus: true },
    { time: 224.47, text: "Dare mo mina enjiteru", isChorus: true },
    { time: 229.96, text: "For now I'll see you off", isChorus: true },
    
    // Outro
    { time: 235.32, text: "And we'll die", isChorus: true },
    { time: 237.44, text: "Waiting for a new day", isChorus: true },
    { time: 239.70, text: "Nidoto...", isChorus: true },
    { time: 243.36, text: "And we'll start", isChorus: true },
    { time: 244.97, text: "Waiting for a new day", isChorus: true },
    { time: 247.00, text: "Kimi to...", isChorus: true },
    { time: 250.50, text: "Oh, please don't let me die", isChorus: true },
    { time: 254.50, text: "Kienai de... ah...", isChorus: true },

    { time: 260.50, text: "", isChorus: false }
];


const systemOverlay = document.getElementById('system-overlay');
const systemBox = document.getElementById('system-box');
const notifYes = document.getElementById('notif-yes');
const notifNo = document.getElementById('notif-no');
const notifActions = document.getElementById('notif-actions');
const notifAuth = document.getElementById('notif-auth');
const notifTitle = document.getElementById('notif-title');
const notifPinInput = document.getElementById('notif-pin-input');
const notifSubmit = document.getElementById('notif-submit');
const notifMessage = document.getElementById('notif-message');

const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
let currentLightboxImages = [];
let currentLightboxIndex = 0;

async function loadProfileInfo() {
    const { data } = await db.from('profile_info').select('*').eq('id', 1).single();
    if (data) {
        profileData = data;
        renderProfileInfo(data);
    }
}

function renderProfileInfo(data) {
    if (profileTagline) profileTagline.textContent = data.tagline || 'Unemployed Final Boss';
    if (profileBio) profileBio.textContent = data.bio || '';
    if (profileStatus) profileStatus.textContent = `Status: ${data.status || 'Training Arc'}`;
    if (profileLocation) profileLocation.textContent = data.location || 'Gingoog City, PH';
    
    if (profileTechStack && data.tech_stack) {
        profileTechStack.innerHTML = data.tech_stack.map(tech => 
            `<span class="px-3 py-1 bg-sky-100 rounded-lg text-xs tracking-widest uppercase shadow-sm border border-white font-bold text-sky-800">${tech}</span>`
        ).join('');
    }
}

async function loadSiteSettings() {
    const { data } = await db.from('site_settings').select('*').eq('id', 1).single();
    if (data) {
        siteSettings = data;
        if (quoteText && data.life_quote) {
            quoteText.textContent = data.life_quote;
        }
    }
}

async function loadWisdomSlides() {
    const { data } = await db.from('wisdom_slides').select('*').order('display_order', { ascending: true });
    wisdomSlides = data || [
        { id: 1, text: "If you're going through hell", display_order: 1 },
        { id: 2, text: "Keep going", display_order: 2 },
        { id: 3, text: "Why would you stop in hell", display_order: 3 }
    ];
    renderWisdomSlider();
}

function renderWisdomSlider() {
    if (!wisdomTrack || !wisdomDots) return;
    
    wisdomTrack.innerHTML = wisdomSlides.map((slide, index) => `
        <div class="tiktok-slide">
            <p class="text-3xl md:text-5xl font-black text-white text-center leading-tight max-w-2xl" style="text-shadow: 0 0 40px rgba(244,114,182,0.5);">
                ${slide.text}
            </p>
        </div>
    `).join('');
    
    wisdomDots.innerHTML = wisdomSlides.map((_, index) => `
        <div class="tiktok-dot ${index === 0 ? 'active' : ''}" onclick="goToWisdomSlide(${index})"></div>
    `).join('');
    
    updateWisdomSlider();
}

function updateWisdomSlider() {
    if (!wisdomTrack) return;
    wisdomTrack.style.transform = `translateX(-${currentWisdomSlide * 100}%)`;
    
    const dots = document.querySelectorAll('.tiktok-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentWisdomSlide);
    });
}

window.goToWisdomSlide = function(index) {
    currentWisdomSlide = index;
    updateWisdomSlider();
}

if (wisdomPrev) {
    wisdomPrev.addEventListener('click', () => {
        currentWisdomSlide = (currentWisdomSlide - 1 + wisdomSlides.length) % wisdomSlides.length;
        updateWisdomSlider();
    });
}

if (wisdomNext) {
    wisdomNext.addEventListener('click', () => {
        currentWisdomSlide = (currentWisdomSlide + 1) % wisdomSlides.length;
        updateWisdomSlider();
    });
}

// Auto-advance wisdom slider
setInterval(() => {
    if (wisdomSlides.length > 0) {
        currentWisdomSlide = (currentWisdomSlide + 1) % wisdomSlides.length;
        updateWisdomSlider();
    }
}, 5000);

async function loadMusic() {
    const { data } = await db.from('music').select('*').order('created_at', { ascending: false });
    allMusic = data || [];
    renderMusic(allMusic);
    
    // Auto-play Styx Helix if found and not already played this session
    if (!hasAutoPlayedStyx && allMusic.length > 0) {
        const styxTrack = allMusic.find(t => 
            t.title.toLowerCase().includes('styx') || t.title.toLowerCase().includes('helix')
        );
        if (styxTrack) {
            // Wait a moment then prompt user to enable music
            setTimeout(() => {
                showMusicPrompt(styxTrack);
            }, 1500);
        }
    }
}

// Show a subtle prompt to enable background music
function showMusicPrompt(track) {
    const prompt = document.createElement('div');
    prompt.id = 'music-prompt';
    prompt.innerHTML = `
        <div class="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-violet-500/30 flex items-center gap-4 animate-fade-in">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-lg">&#9835;</div>
            <div class="flex flex-col">
                <span class="text-xs text-violet-300 font-medium">Background Music</span>
                <span class="text-sm font-bold">${track.title}</span>
            </div>
            <button onclick="acceptMusicPrompt('${track.id}', '${track.audio_url}', '${track.title}')" class="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full text-xs font-bold hover:opacity-90 transition-opacity">Play</button>
            <button onclick="dismissMusicPrompt()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs">&#x2715;</button>
        </div>
    `;
    // Add fade-in animation style
    const style = document.createElement('style');
    style.textContent = `@keyframes fade-in { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } } .animate-fade-in { animation: fade-in 0.4s ease-out; }`;
    document.head.appendChild(style);
    document.body.appendChild(prompt);
}

window.acceptMusicPrompt = function(id, audioUrl, title) {
    hasAutoPlayedStyx = true;
    document.getElementById('music-prompt')?.remove();
    playMusic(id, audioUrl, title);
}

window.dismissMusicPrompt = function() {
    hasAutoPlayedStyx = true;
    document.getElementById('music-prompt')?.remove();
}

function renderMusic(music) {
    if (!musicContainer) return;
    if (!music || music.length === 0) {
        musicContainer.innerHTML = "<p class='text-violet-700/60 font-bold ml-4 col-span-full'>No music tracks yet. Add some in admin mode!</p>";
        return;
    }
    
    musicContainer.innerHTML = music.map(track => {
        const isStyxHelix = track.title.toLowerCase().includes('styx') || track.title.toLowerCase().includes('helix');
        return `
            <div class="glass-card p-5 cursor-pointer group hover:scale-105 transition-all duration-300 relative overflow-hidden ${isStyxHelix ? 'border-2 border-violet-400/50' : ''}" onclick="playMusic('${track.id}', '${track.audio_url}', '${track.title}')">
                <div class="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/60 to-transparent pointer-events-none"></div>
                ${isStyxHelix ? '<div class="absolute top-2 right-2 bg-gradient-to-r from-violet-500 to-pink-500 text-white text-[9px] px-2 py-1 rounded-full font-black uppercase tracking-wider z-10">Special</div>' : ''}
                <div class="relative mb-4 rounded-xl overflow-hidden shadow-md border border-white aspect-square">
                    <img src="${track.image_url}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div class="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-2xl shadow-lg">&#9654;</div>
                    </div>
                </div>
                <h3 class="font-extrabold text-slate-800 text-lg truncate">${track.title}</h3>
                <p class="text-sm text-violet-600/70 font-medium truncate">${track.artist || 'Unknown Artist'}</p>
                ${isAdmin ? `<button onclick="event.stopPropagation(); deleteItem('music', '${track.id}')" class="absolute top-2 left-2 bg-red-500/90 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-md border border-red-400 font-bold z-10 hover:bg-red-600 backdrop-blur-sm">&#x2715;</button>` : ''}
            </div>
        `;
    }).join('');
}

async function loadPortfolio() {
    await loadProfileInfo();
    await loadSiteSettings();
    await loadWisdomSlides();
    await loadMusic();
    
    // Projects sorted by display_order (custom order)
    const { data: projects } = await db.from('projects').select('*').order('display_order', { ascending: true });
    allProjects = projects || [];
    renderProjects(allProjects);

    const { data: certs } = await db.from('certificates').select('*');
    allCerts = certs || [];
    renderCertificates(allCerts);

    const { data: hobbies } = await db.from('hobbies').select('*').order('rank', { ascending: true });
    renderHobbies(hobbies || []);

    const { data: socials } = await db.from('socials').select('*');
    renderSocials(socials || []);
}

async function toggleVisibility(tableName, categoryValue, currentStatus, colName) {
    const { error } = await db.from(tableName).update({ is_visible: !currentStatus }).eq(colName, categoryValue);
    if (error) alert("Error: " + error.message);
    else loadPortfolio();
}

function renderProjects(projects) {
    if (!projectBox) return;
    if (!projects || projects.length === 0) {
        projectBox.innerHTML = "<p class='text-sky-700/60 font-bold ml-4 col-span-full'>No projects found.</p>";
        projectFiltersBox.innerHTML = "<p class='text-sm text-sky-700/60 font-medium italic'>No filters active...</p>";
        return;
    }

    let allLangs = new Set();
    projects.forEach(p => {
        if (p.languages) p.languages.split(',').forEach(l => allLangs.add(l.trim()));
    });

    projectFiltersBox.innerHTML = Array.from(allLangs).sort().map(lang => `
        <label class="flex items-center gap-2 bg-white/60 hover:bg-white px-5 py-2 rounded-full border border-white/50 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md ${activeFilters.has(lang) ? 'bg-sky-100 border-sky-300' : ''}">
            <input type="checkbox" value="${lang}" class="hidden" ${activeFilters.has(lang) ? 'checked' : ''} onchange="toggleFilter('${lang}')">
            <span class="text-xs font-bold text-sky-900 uppercase tracking-widest">${lang}</span>
        </label>
    `).join('');

    const filteredProjects = activeFilters.size === 0
        ? projects
        : projects.filter(p => {
            if (!p.languages) return false;
            const pLangs = p.languages.split(',').map(l => l.trim());
            return Array.from(activeFilters).some(f => pLangs.includes(f));
        });

    if (filteredProjects.length === 0) {
        projectBox.innerHTML = "<p class='text-sky-700/60 font-bold ml-4 col-span-full'>No projects match the selected stack.</p>";
        return;
    }

    // Sort by display_order but don't show the number
    projectBox.innerHTML = filteredProjects.map(p => {
        const langsHtml = p.languages
            ? p.languages.split(',').map(l => `<span class="bg-white/80 text-sky-900 text-[10px] px-3 py-1.5 rounded-md font-bold border border-white shadow-sm tracking-widest uppercase">${l.trim()}</span>`).join('')
            : '';
        return `
            <div class="glass-card p-6 md:p-8 flex flex-col group relative overflow-hidden bg-white/40">
                <div class="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/70 to-transparent pointer-events-none"></div>
                <div class="relative mb-6 rounded-2xl overflow-hidden shadow-md border border-white">
                    <img src="${p.image_url}" class="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105">
                    <div class="absolute inset-0 bg-gradient-to-t from-sky-900/40 to-transparent pointer-events-none"></div>
                    ${isAdmin ? `
                        <div class="absolute top-3 right-3 flex gap-2 z-20">
                            <button onclick="editProjectOrder('${p.id}', ${p.display_order || 0})" class="bg-sky-500/90 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-lg border border-sky-400 font-bold hover:bg-sky-600 transition-colors backdrop-blur-sm" title="Edit Order">&#9650;</button>
                            <button onclick="deleteItem('projects', '${p.id}')" class="bg-red-500/90 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-lg border border-red-400 font-bold hover:bg-red-600 transition-colors backdrop-blur-sm">&#x2715;</button>
                        </div>
                    ` : ''}
                </div>
                <h3 class="text-2xl font-extrabold text-sky-950 mb-4 relative z-10 tracking-tight aero-title">${p.title}</h3>
                <div class="flex flex-wrap gap-2 mb-4 relative z-10">${langsHtml}</div>
                <p class="text-sm text-slate-600 font-medium mb-8 flex-1 relative z-10 leading-relaxed">${p.description || ''}</p>
                ${p.link ? `<a href="${p.link}" target="_blank" class="glossy-btn text-center text-xs py-3.5 font-bold relative z-10 tracking-[0.2em] uppercase">View Project</a>` : ''}
            </div>
        `;
    }).join('');
}

window.editProjectOrder = async function(projectId, currentOrder) {
    const newOrder = prompt("Enter new display order (lower numbers appear first):", currentOrder || 0);
    if (newOrder !== null) {
        const { error } = await db.from('projects').update({ display_order: parseInt(newOrder) || 0 }).eq('id', projectId);
        if (error) alert("Error: " + error.message);
        else loadPortfolio();
    }
}

window.toggleFilter = function(lang) {
    if (activeFilters.has(lang)) activeFilters.delete(lang);
    else activeFilters.add(lang);
    renderProjects(allProjects);
}

const certSearchInput = document.getElementById('cert-search');
if (certSearchInput) {
    certSearchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        if (term === '') renderCertificates(allCerts);
        else {
            const filtered = allCerts.filter(c => c.category_name?.toLowerCase().includes(term) || c.title?.toLowerCase().includes(term));
            renderCertificates(filtered);
        }
    });
}

function renderCertificates(certs) {
    if (!certBox) return;
    if (!certs || certs.length === 0) return certBox.innerHTML = "<p class='text-sky-700/60 font-bold ml-4'>No certifications found.</p>";

    const groups = {};
    certs.forEach(c => {
        if (!groups[c.category_name]) groups[c.category_name] = [];
        groups[c.category_name].push(c);
    });

    certBox.innerHTML = '';
    for (const category in groups) {
        const desc = groups[category][0].description || "Description pending.";
        const isVisible = groups[category][0].is_visible !== false;

        if (!isVisible && !isAdmin) continue;

        certBox.innerHTML += `
            <div class="glass-card p-8 transition-all relative overflow-hidden bg-white/50 ${!isVisible ? 'opacity-50 grayscale' : ''}">
                <div class="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/60 to-transparent pointer-events-none"></div>
                <div class="flex flex-wrap items-center gap-4 mb-3 relative z-10">
                    <h3 class="text-2xl font-extrabold text-sky-950">${category}</h3>
                    ${isAdmin ? `
                        <button onclick="editContainerDesc('${category}', 'certificates', 'category_name')" class="text-[10px] bg-white hover:bg-slate-50 border border-slate-200 shadow-sm px-3 py-1.5 rounded-md text-slate-700 font-bold uppercase tracking-widest transition-colors">Edit</button>
                        <button onclick="toggleVisibility('certificates', '${category}', ${isVisible}, 'category_name')" class="text-[10px] ${isVisible ? 'bg-sky-100 text-sky-800' : 'bg-red-100 text-red-800'} border border-white shadow-sm px-3 py-1.5 rounded-md font-bold uppercase tracking-widest">
                            ${isVisible ? 'Public' : 'Hidden'}
                        </button>
                    ` : ''}
                </div>
                <p class="text-slate-600 text-sm mb-8 font-medium relative z-10 max-w-3xl">${desc}</p>
                <div class="flex flex-wrap gap-6 relative z-10">
                    ${groups[category].map(cert => `
                        <div class="relative group cursor-pointer">
                            <img src="${cert.image_url}" onclick="openLightbox('${cert.image_url}')" class="cert-img-target h-40 w-56 object-cover rounded-xl border-2 border-white shadow-lg shadow-sky-900/10 cursor-zoom-in transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                            <div class="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-xl pointer-events-none"></div>
                            ${isAdmin ? `<button onclick="deleteItem('certificates', '${cert.id}')" class="absolute -top-3 -right-3 bg-red-500/90 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-lg border border-red-400 font-bold hover:bg-red-600 transition-colors backdrop-blur-sm z-20">&#x2715;</button>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

function renderHobbies(hobbies) {
    if (!hobbyBox) return;
    if (!hobbies || hobbies.length === 0) return hobbyBox.innerHTML = "<p class='text-emerald-700/60 font-bold ml-4'>No interests found.</p>";

    const groups = {};
    hobbies.forEach(h => {
        if (!groups[h.category]) groups[h.category] = [];
        groups[h.category].push(h);
    });

    hobbyBox.innerHTML = '';
    for (const category in groups) {
        const desc = groups[category][0].description || "Description pending.";
        const isVisible = groups[category][0].is_visible !== false;

        if (!isVisible && !isAdmin) continue;

        hobbyBox.innerHTML += `
            <div class="glass-card p-8 transition-all relative overflow-hidden bg-white/50 ${!isVisible ? 'opacity-50 grayscale' : ''}">
                <div class="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/60 to-transparent pointer-events-none"></div>
                <div class="flex flex-wrap items-center gap-4 mb-3 relative z-10">
                    <h3 class="text-2xl font-extrabold text-emerald-950">${category}</h3>
                    ${isAdmin ? `
                        <button onclick="editContainerDesc('${category}', 'hobbies', 'category')" class="text-[10px] bg-white hover:bg-slate-50 border border-slate-200 shadow-sm px-3 py-1.5 rounded-md text-slate-700 font-bold uppercase tracking-widest transition-colors">Edit</button>
                        <button onclick="toggleVisibility('hobbies', '${category}', ${isVisible}, 'category')" class="text-[10px] ${isVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'} border border-white shadow-sm px-3 py-1.5 rounded-md font-bold uppercase tracking-widest">
                            ${isVisible ? 'Public' : 'Hidden'}
                        </button>
                    ` : ''}
                </div>
                <p class="text-slate-600 text-sm mb-8 font-medium relative z-10 max-w-3xl">${desc}</p>
                <div class="flex flex-wrap gap-6 relative z-10">
                    ${groups[category].map(h => `
                        <div class="relative flex flex-col bg-white/80 p-4 rounded-2xl border border-white shadow-lg shadow-emerald-900/5 hover:-translate-y-2 transition-all duration-300 w-52 group">
                            <div class="relative overflow-hidden rounded-xl border border-white shadow-sm">
                                <img src="${h.cover_image}" class="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-110">
                                <div class="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                                <span class="absolute top-2 left-2 bg-white/95 text-emerald-800 text-[10px] px-3 py-1 rounded-md font-black shadow-sm backdrop-blur-md border border-white uppercase tracking-widest">RANK #${h.rank}</span>
                                ${isAdmin ? `<button onclick="deleteItem('hobbies', '${h.id}')" class="absolute top-2 right-2 bg-red-500/90 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-md border border-red-400 font-bold z-10 hover:bg-red-600 backdrop-blur-sm">&#x2715;</button>` : ''}
                            </div>
                            <div class="flex flex-col mt-5 gap-3">
                                <h4 class="font-extrabold text-[15px] text-slate-800 truncate tracking-tight text-center" title="${h.title}">${h.title}</h4>
                                <div class="flex gap-2">
                                    ${h.show_info !== false ? `<button onclick="openInfo('${h.tags || ''}')" class="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10px] py-2 rounded-lg font-bold tracking-widest uppercase shadow-sm transition-all hover:shadow">INFO</button>` : ''}
                                    ${h.show_view !== false ? `<button onclick="openGallery('${h.id}', '${h.title}', '${h.cover_image}')" class="flex-1 glossy-btn-green text-[10px] py-2 font-bold tracking-widest uppercase">VIEW</button>` : ''}
                                </div>
                            </div>
                            ${isAdmin ? `
                                <button onclick="editTags('${h.id}', '${h.tags || ''}')" class="mt-4 w-full text-[10px] bg-slate-100 hover:bg-slate-200 py-2 rounded-lg text-slate-700 font-bold border border-slate-200 shadow-sm transition-colors uppercase tracking-widest">
                                    Update Tags
                                </button>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

function renderSocials(socials) {
    if (!socialBox) return;
    if (!socials || socials.length === 0) return socialBox.innerHTML = "<p class='text-sky-700/60 font-bold ml-4'>No links found.</p>";

    socialBox.innerHTML = socials.map(s => `
        <div class="relative w-full sm:w-[340px] group">
            <a href="${s.link}" target="_blank" class="flex items-center gap-5 glass-card p-5 rounded-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden bg-white/70">
                <div class="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/90 to-transparent pointer-events-none"></div>
                <div class="relative w-14 h-14 rounded-xl overflow-hidden shadow-md border border-white flex-shrink-0 bg-white">
                    <img src="${s.image_url}" class="w-full h-full object-cover">
                </div>
                <div class="flex flex-col overflow-hidden relative z-10">
                    <span class="font-extrabold text-slate-800 truncate text-lg tracking-tight">${s.platform}</span>
                    <span class="text-xs text-sky-600 font-bold truncate tracking-wider uppercase opacity-80">${s.link.replace(/^https?:\/\//, '')}</span>
                </div>
            </a>
            ${isAdmin ? `<button onclick="deleteItem('socials', '${s.id}')" class="absolute -top-3 -right-3 bg-red-500/90 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs shadow-lg border border-red-400 font-bold z-20 hover:bg-red-600 backdrop-blur-sm">&#x2715;</button>` : ''}
        </div>
    `).join('');
}

function toggleViewAll(btn, wrapper, defaultLabel) {
    if (!wrapper || !btn) return;
    wrapper.classList.toggle('section-expanded');
    btn.innerText = wrapper.classList.contains('section-expanded') ? 'Collapse' : defaultLabel;
}

if (viewAllProjectsBtn) viewAllProjectsBtn.addEventListener('click', () => toggleViewAll(viewAllProjectsBtn, projectWrapper, 'View All Projects'));
if (viewAllCertBtn) viewAllCertBtn.addEventListener('click', () => toggleViewAll(viewAllCertBtn, certWrapper, 'View All Certifications'));
if (viewAllHobbyBtn) viewAllHobbyBtn.addEventListener('click', () => toggleViewAll(viewAllHobbyBtn, hobbyWrapper, 'View All Interests'));
if (viewAllSocialBtn) viewAllSocialBtn.addEventListener('click', () => toggleViewAll(viewAllSocialBtn, socialWrapper, 'View All'));

window.openLightbox = function(clickedUrl) {
    const images = Array.from(document.querySelectorAll('.cert-img-target'));
    currentLightboxImages = images.map(img => img.src);
    currentLightboxIndex = currentLightboxImages.indexOf(clickedUrl);
    if (currentLightboxIndex === -1) currentLightboxIndex = 0;
    updateLightboxImage();
    lightboxModal.classList.remove('hidden');
}

function updateLightboxImage() {
    if (currentLightboxImages.length > 0) lightboxImg.src = currentLightboxImages[currentLightboxIndex];
}

if (lightboxClose) lightboxClose.addEventListener('click', () => lightboxModal.classList.add('hidden'));
if (lightboxPrev) lightboxPrev.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
    updateLightboxImage();
});
if (lightboxNext) lightboxNext.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;
    updateLightboxImage();
});

window.openInfo = function(tags) {
    const container = document.getElementById('info-tags-container');
    if (!tags || tags === 'null' || tags.trim() === '') {
        container.innerHTML = '<p class="text-slate-500 font-medium italic text-sm">No tags added yet.</p>';
    } else {
        const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);
        container.innerHTML = tagArray.map(t => `<span class="bg-sky-50 text-sky-800 px-4 py-2 rounded-lg text-[10px] font-black border border-sky-100 shadow-sm tracking-widest uppercase">${t}</span>`).join('');
    }
    document.getElementById('info-modal').classList.remove('hidden');
}

window.closeInfo = function() { document.getElementById('info-modal').classList.add('hidden'); }

window.editTags = async function(hobbyId, currentTags) {
    const safeTags = currentTags === 'null' ? '' : currentTags;
    const newTags = prompt("Update tags (comma separated):", safeTags);
    if (newTags !== null) {
        const { error } = await db.from('hobbies').update({ tags: newTags }).eq('id', hobbyId);
        if (error) alert("Error: " + error.message);
        else loadPortfolio();
    }
}

window.editContainerDesc = async function(categoryValue, tableName, columnName) {
    const newDesc = prompt(`Update description for ${categoryValue}:`);
    if (newDesc !== null) {
        const { error } = await db.from(tableName).update({ description: newDesc }).eq(columnName, categoryValue);
        if (error) alert("Error: " + error.message);
        else loadPortfolio();
    }
}

stealthBtn.addEventListener('click', () => {
    resetSystemNotif();
    showSystemNotif();
});

function showSystemNotif() {
    systemOverlay.classList.remove('hidden');
    setTimeout(() => {
        systemBox.classList.remove('scale-90', 'opacity-0');
        systemBox.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function resetSystemNotif() {
    systemBox.className = "relative w-[90%] max-w-md p-[2px] transition-all duration-500 ease-out scale-90 opacity-0 bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_30px_rgba(0,180,255,0.5)] rounded-xl";
    notifTitle.innerText = "SYSTEM NOTIFICATION";
    notifTitle.className = "text-cyan-400 font-black tracking-[0.2em] text-2xl mb-2 italic";
    notifMessage.innerHTML = "Identity verification required.<br><span class='text-sm opacity-70'>Are you the System Administrator?</span>";
    notifActions.classList.remove('hidden');
    notifAuth.classList.add('hidden');
    notifPinInput.value = "";
}

function initSystemNotif() {
    const isDismissed = localStorage.getItem('systemNotifDismissed');
    if (!isDismissed) showSystemNotif();
}

notifNo.addEventListener('click', () => {
    localStorage.setItem('systemNotifDismissed', 'true');
    closeSystemNotif();
});

notifYes.addEventListener('click', () => {
    // Solo Leveling violet style
    systemBox.className = "relative w-[90%] max-w-md p-[2px] transition-all duration-500 ease-out scale-100 opacity-100 bg-gradient-to-br from-violet-500 via-purple-600 to-violet-900 shadow-[0_0_40px_rgba(139,92,246,0.7),0_0_80px_rgba(139,92,246,0.4)] rounded-xl animate-pulse-glow";
    notifTitle.innerText = "ADMINISTRATOR ACCESS";
    notifTitle.className = "text-violet-400 font-black tracking-[0.2em] text-2xl mb-2 italic";
    notifMessage.innerHTML = "Authorization required.<br><span class='text-sm opacity-70'>Please provide your access code.</span>";
    notifActions.classList.add('hidden');
    notifAuth.classList.remove('hidden');
    // Update auth input and button to violet theme
    notifPinInput.className = "w-full bg-black border-b-2 border-violet-500 text-center text-2xl text-violet-400 font-black outline-none py-2 placeholder:text-violet-900/50";
    notifSubmit.className = "w-full py-3 border border-violet-500/50 bg-violet-900/20 text-violet-400 font-black hover:bg-violet-500 hover:text-white transition-all duration-300 tracking-widest uppercase rounded-lg";
    notifPinInput.focus();
});

notifSubmit.addEventListener('click', () => {
    if (notifPinInput.value === "2026") {
        isAdmin = true;
        adminIndicator.classList.remove('hidden');
        [addProjectBtn, addCertBtn, addHobbyBtn, addSocialBtn, editProfileBtn, editQuoteBtn, editWisdomBtn, addMusicBtn].forEach(btn => btn?.classList.remove('hidden'));
        loadPortfolio();
        closeSystemNotif();
    } else {
        notifPinInput.value = "";
        notifPinInput.placeholder = "ACCESS DENIED";
        notifPinInput.classList.add('animate-pulse', 'border-red-500', 'text-red-500');
        setTimeout(() => notifPinInput.classList.remove('animate-pulse', 'border-red-500', 'text-red-500'), 500);
    }
});

function closeSystemNotif() {
    systemBox.classList.remove('scale-100', 'opacity-100');
    systemBox.classList.add('scale-110', 'opacity-0');
    setTimeout(() => {
        systemOverlay.classList.add('hidden');
        systemBox.classList.remove('scale-110');
    }, 500);
}

const adminModal = document.getElementById('admin-modal');
const adminForm = document.getElementById('admin-form');

function openModal(type) {
    document.getElementById('form-type').value = type;
    document.getElementById('modal-title').innerText = `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    const catContainer = document.getElementById('category-field');
    const catLabel = document.getElementById('category-label');
    const inputCat = document.getElementById('input-category');
    const titleLabel = document.getElementById('title-label');
    const descField = document.getElementById('description-field');
    const urlField = document.getElementById('url-field');
    const hobbyFields = document.getElementById('hobby-only-fields');
    const socialFields = document.getElementById('social-only-fields');
    const orderField = document.getElementById('order-field');

    catContainer.classList.remove('hidden');
    inputCat.setAttribute('required', 'true');
    descField.classList.add('hidden');
    urlField.classList.add('hidden');
    hobbyFields.classList.add('hidden');
    socialFields.classList.add('hidden');
    orderField.classList.add('hidden');

    if (type === 'project') {
        catLabel.innerText = "Languages (Comma Separated)";
        titleLabel.innerText = "Project Title";
        descField.classList.remove('hidden');
        urlField.classList.remove('hidden');
        orderField.classList.remove('hidden');
    } else if (type === 'social') {
        catContainer.classList.add('hidden');
        inputCat.removeAttribute('required');
        socialFields.classList.remove('hidden');
        titleLabel.innerText = "Platform Name";
    } else if (type === 'hobby') {
        catLabel.innerText = "Category";
        titleLabel.innerText = "Title";
        hobbyFields.classList.remove('hidden');
    } else if (type === 'cert') {
        catLabel.innerText = "Category";
        titleLabel.innerText = "Title";
    }
    adminModal.classList.remove('hidden');
    adminModal.classList.add('flex');
}

window.closeModal = function() {
    adminModal.classList.add('hidden');
    adminModal.classList.remove('flex');
    adminForm.reset();
}

if (addProjectBtn) addProjectBtn.addEventListener('click', () => openModal('project'));
if (addCertBtn) addCertBtn.addEventListener('click', () => openModal('cert'));
if (addHobbyBtn) addHobbyBtn.addEventListener('click', () => openModal('hobby'));
if (addSocialBtn) addSocialBtn.addEventListener('click', () => openModal('social'));

adminForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = document.getElementById('form-type').value;
    const category = document.getElementById('input-category').value;
    const title = document.getElementById('input-title').value;
    const description = document.getElementById('input-description')?.value;
    const url = document.getElementById('input-url')?.value;
    const rank = document.getElementById('input-rank')?.value;
    const socialLink = document.getElementById('input-social-link')?.value;
    const showInfo = document.getElementById('input-show-info')?.checked;
    const showView = document.getElementById('input-show-view')?.checked;
    const displayOrder = document.getElementById('input-order')?.value;
    const file = document.getElementById('input-file').files[0];

    if (!file) return alert("Please select an image.");
    const fileName = `${type}s/${Date.now()}-${file.name}`;
    await db.storage.from('portfolio-assets').upload(fileName, file);
    const { data: urlData } = db.storage.from('portfolio-assets').getPublicUrl(fileName);
    const publicUrl = urlData.publicUrl;

    let dbError;
    if (type === 'project') {
        const { error } = await db.from('projects').insert([{ 
            languages: category, 
            title, 
            description, 
            link: url, 
            image_url: publicUrl,
            display_order: parseInt(displayOrder) || 0
        }]);
        dbError = error;
    } else if (type === 'cert') {
        const { error } = await db.from('certificates').insert([{ category_name: category, title, image_url: publicUrl }]);
        dbError = error;
    } else if (type === 'hobby') {
        const { error } = await db.from('hobbies').insert([{ category, title, cover_image: publicUrl, rank: parseInt(rank) || 0, show_info: showInfo, show_view: showView }]);
        dbError = error;
    } else if (type === 'social') {
        const { error } = await db.from('socials').insert([{ platform: title, link: socialLink, image_url: publicUrl }]);
        dbError = error;
    }

    if (dbError) alert("Database Error: " + dbError.message);
    else { closeModal(); loadPortfolio(); }
});

window.deleteItem = async function(table, id) {
    if (confirm('Remove this item?')) {
        await db.from(table).delete().eq('id', id);
        loadPortfolio();
    }
}

window.openGallery = async function(hobbyId, title, coverImgUrl) {
    currentHobbyId = hobbyId;
    document.getElementById('gallery-title').innerText = title;
    const imgContainer = document.getElementById('gallery-images');
    const addBtn = document.getElementById('gallery-add-btn');

    if (addBtn) isAdmin ? addBtn.classList.remove('hidden') : addBtn.classList.add('hidden');

    imgContainer.innerHTML = `<div class="relative group cursor-pointer hover:scale-105 transition-transform duration-300"><img src="${coverImgUrl}" class="max-h-96 w-auto rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/20"></div>`;

    document.getElementById('gallery-modal').classList.remove('hidden');
    document.getElementById('gallery-modal').classList.add('flex');

    const { data: extraImages } = await db.from('hobby_gallery').select('image_url').eq('hobby_id', hobbyId);
    if (extraImages) extraImages.forEach(img => {
        const url = img.image_url || '';
        const isVideo = /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url);
        const media = isVideo
            ? `<video src="${url}" controls playsinline class="max-h-96 w-auto rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/20 bg-black"></video>`
            : `<img src="${url}" class="max-h-96 w-auto rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/20">`;
        imgContainer.innerHTML += `<div class="relative group cursor-pointer hover:scale-105 transition-transform duration-300">${media}</div>`;
    });
}

const galleryInput = document.getElementById('gallery-upload-input');
const galleryAddBtn = document.getElementById('gallery-add-btn');

if (galleryAddBtn) galleryAddBtn.onclick = () => galleryInput.click();
if (galleryInput) {
    galleryInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file || !currentHobbyId) return;
        const safeName = file.name.replace(/\s+/g, '-');
        const fileName = `gallery/${Date.now()}-${safeName}`;
        await db.storage.from('portfolio-assets').upload(fileName, file, { contentType: file.type });
        const { data: urlData } = db.storage.from('portfolio-assets').getPublicUrl(fileName);
        await db.from('hobby_gallery').insert([{ hobby_id: currentHobbyId, image_url: urlData.publicUrl }]);
        loadPortfolio();
        closeGallery();
    };
}

window.closeGallery = function() {
    document.getElementById('gallery-modal').classList.add('hidden');
    document.getElementById('gallery-modal').classList.remove('flex');
    currentHobbyId = null;
}

// Profile Edit Functions
if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
        if (profileData) {
            document.getElementById('input-profile-tagline').value = profileData.tagline || '';
            document.getElementById('input-profile-bio').value = profileData.bio || '';
            document.getElementById('input-profile-tech').value = (profileData.tech_stack || []).join(', ');
            document.getElementById('input-profile-status').value = profileData.status || '';
            document.getElementById('input-profile-location').value = profileData.location || '';
        }
        profileModal.classList.remove('hidden');
        profileModal.classList.add('flex');
    });
}

window.closeProfileModal = function() {
    profileModal.classList.add('hidden');
    profileModal.classList.remove('flex');
}

if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const tagline = document.getElementById('input-profile-tagline').value;
        const bio = document.getElementById('input-profile-bio').value;
        const techStackStr = document.getElementById('input-profile-tech').value;
        const status = document.getElementById('input-profile-status').value;
        const location = document.getElementById('input-profile-location').value;
        
        const techStack = techStackStr.split(',').map(t => t.trim()).filter(t => t);
        
        const { error } = await db.from('profile_info').update({
            tagline,
            bio,
            tech_stack: techStack,
            status,
            location,
            updated_at: new Date().toISOString()
        }).eq('id', 1);
        
        if (error) {
            alert("Error: " + error.message);
        } else {
            closeProfileModal();
            loadPortfolio();
        }
    });
}

// Quote Edit Functions
if (editQuoteBtn) {
    editQuoteBtn.addEventListener('click', () => {
        document.getElementById('input-quote-text').value = siteSettings?.life_quote || "Don't let life fuck you, you fuck life";
        quoteModal.classList.remove('hidden');
        quoteModal.classList.add('flex');
    });
}

window.closeQuoteModal = function() {
    quoteModal.classList.add('hidden');
    quoteModal.classList.remove('flex');
}

if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newQuote = document.getElementById('input-quote-text').value;
        
        const { error } = await db.from('site_settings').upsert({
            id: 1,
            life_quote: newQuote,
            updated_at: new Date().toISOString()
        });
        
        if (error) {
            alert("Error: " + error.message);
        } else {
            closeQuoteModal();
            loadPortfolio();
        }
    });
}

// Wisdom Slides Edit Functions
if (editWisdomBtn) {
    editWisdomBtn.addEventListener('click', () => {
        renderWisdomInputs();
        wisdomModal.classList.remove('hidden');
        wisdomModal.classList.add('flex');
    });
}

function renderWisdomInputs() {
    const container = document.getElementById('wisdom-slides-inputs');
    container.innerHTML = wisdomSlides.map((slide, index) => `
        <div class="flex gap-2 items-center wisdom-slide-input" data-id="${slide.id || ''}">
            <input type="text" value="${slide.text}" class="flex-1 bg-white border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-sky-400 font-medium wisdom-text-input" required>
            <input type="number" value="${slide.display_order || index + 1}" class="w-20 bg-white border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-sky-400 font-medium wisdom-order-input" placeholder="#">
            <button type="button" onclick="removeWisdomSlideInput(this)" class="w-10 h-10 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center font-bold">×</button>
        </div>
    `).join('');
}

window.addWisdomSlideInput = function() {
    const container = document.getElementById('wisdom-slides-inputs');
    const newIndex = container.children.length + 1;
    const div = document.createElement('div');
    div.className = 'flex gap-2 items-center wisdom-slide-input';
    div.dataset.id = '';
    div.innerHTML = `
        <input type="text" value="" class="flex-1 bg-white border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-sky-400 font-medium wisdom-text-input" required placeholder="Enter wisdom text...">
        <input type="number" value="${newIndex}" class="w-20 bg-white border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-sky-400 font-medium wisdom-order-input" placeholder="#">
        <button type="button" onclick="removeWisdomSlideInput(this)" class="w-10 h-10 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center font-bold">×</button>
    `;
    container.appendChild(div);
}

window.removeWisdomSlideInput = function(btn) {
    btn.closest('.wisdom-slide-input').remove();
}

window.closeWisdomModal = function() {
    wisdomModal.classList.add('hidden');
    wisdomModal.classList.remove('flex');
}

if (wisdomForm) {
    wisdomForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Delete all existing slides
        await db.from('wisdom_slides').delete().neq('id', 0);
        
        // Get all slide inputs
        const slideInputs = document.querySelectorAll('.wisdom-slide-input');
        const newSlides = [];
        
        slideInputs.forEach(input => {
            const text = input.querySelector('.wisdom-text-input').value;
            const order = parseInt(input.querySelector('.wisdom-order-input').value) || 1;
            if (text.trim()) {
                newSlides.push({ text, display_order: order });
            }
        });
        
        if (newSlides.length > 0) {
            const { error } = await db.from('wisdom_slides').insert(newSlides);
            if (error) {
                alert("Error: " + error.message);
                return;
            }
        }
        
        closeWisdomModal();
        loadPortfolio();
    });
}

// ============================================
// MUSIC PLAYBACK & STYX HELIX MODE (OPTIMIZED)
// ============================================

// Play music function
window.playMusic = function(id, audioUrl, title) {
    currentPlayingMusic = { id, audioUrl, title };
    
    // Check if it's Styx Helix
    const isStyxHelix = title.toLowerCase().includes('styx') || title.toLowerCase().includes('helix');
    
    // Set audio source
    styxAudio.src = audioUrl;
    styxAudio.load();
    
    // Update player bar
    musicTitle.textContent = title;
    musicPlayerBar.classList.add('active');
    
    // Start playback
    styxAudio.play().then(() => {
        playIcon.innerHTML = '&#10074;&#10074;'; // Pause icon
        
        if (isStyxHelix) {
            activateStyxHelixMode();
        }
    }).catch(err => {
        console.log('Playback error:', err);
    });
}

// Activate the special Styx Helix mode - OPTIMIZED for background play
function activateStyxHelixMode() {
    isStyxHelixMode = true;
    lastLyricIndex = -1;
    lastCharId = null;
    
    // Add ambient class to body
    document.body.classList.add('styx-playing');
    
    // Activate background visual elements (behind content)
    emiliaSilhouette?.classList.add('active');
    discoLights?.classList.add('active');
    
    // Reset all character stages and show a default character immediately
    document.querySelectorAll('.char-stage').forEach(resetStage);
    showInitialCharacter();
    lyricsContainer?.classList.add('active');
    
    // Start optimized lyrics sync using requestAnimationFrame
    startOptimizedLyricsSync();
}

// Deactivate Styx Helix mode
function deactivateStyxHelixMode() {
    isStyxHelixMode = false;
    lastLyricIndex = -1;
    lastCharId = null;
    
    document.body.classList.remove('styx-playing');
    
    emiliaSilhouette?.classList.remove('active', 'reveal', 'chorus-moment', 'front', 'left', 'center');
    discoLights?.classList.remove('active', 'chorus-moment');
    document.querySelectorAll('.char-stage').forEach(resetStage);
    lyricsContainer?.classList.remove('active');
    
    // Cancel animation frame
    if (lyricsAnimationFrame) {
        cancelAnimationFrame(lyricsAnimationFrame);
        lyricsAnimationFrame = null;
    }
    
    // Clear lyrics
    if (lyricsText) {
        lyricsText.textContent = '';
        lyricsText.className = 'lyrics-text lyrics-verse';
    }
}

// ===== Character cast rotation for Styx Helix =====
// Narrative-driven: each lyric line picks a character that matches the
// emotional/canonical meaning of that moment in Re:Zero.
const CHAR_POSITIONS = ['right','left','center','far-right','far-left'];
const CHAR_ENTERS = ['enter-right','enter-left','enter-up','enter-zoom'];
const CHAR_ENTERS_NEW = ['enter-sil-drop','enter-shatter','enter-ink-bleed','enter-lightning'];

// Filenames match the user's `characters/` folder (case-sensitive).
// Every real character ALSO has a silhouette twin under the `<id>-sil` key,
// pointing to `silhouette/silhouette-<name>.png` — same naming, paired 1:1.
const CHAR_IMAGE_PATHS = {
    // === MAIN ===
    subaru:    'characters/subaru.gif',

    // === ROYAL CANDIDATES ===
    emilia:    'characters/emilia.gif',
    crusch:    'characters/crusch.gif',
    anastasia: 'characters/anastasia.gif',
    priscilla: 'characters/priscilla.gif',
    felt:      'characters/felt.gif',

    // === KNIGHTS / SUPPORTERS ===
    otto:      'characters/otto.gif',
    garfiel:   'characters/garfiel.png',
    roswaal:   'characters/roswaal.gif',
    frederica: 'characters/frederica.png',
    petra:     'characters/petra.png',
    felix:     'characters/felix.gif',
    wilhelm:   'characters/wilhelm.gif',
    julius:    'characters/julius.gif',
    reinhard:  'characters/reinhard.gif',
    rom:       'characters/rom.png',
    al:        'characters/al.png',

    // === MANSION ALLIES ===
    rem:       'characters/rem.gif',
    ram:       'characters/ram.gif',
    beatrice:  'characters/Beatrice.gif',

    // === WITCHES OF SIN ===
    satella:   'characters/satella.png',
    echidna:   'characters/echidna.png',
    minerva:   'characters/minerva.png',
    sekhmet:   'characters/sekhmet.png',
    daphne:    'characters/daphne.png',
    typhon:    'characters/typhon.png',
    carmilla:  'characters/carmilla.png',

    // === ENEMIES (Sin Archbishops) ===
    petelgeuse:'characters/petelgeuse.gif',
    regulus:   'characters/regulus.png',
    lye:       'characters/lye.png',

    // === OTHER ENEMIES ===
    elsa:      'characters/elsa.gif',
    meili:     'characters/meili.png',
    whitewhale:'characters/whitewhale.png',
    greatrabbit:'characters/greatrabbit.png',

    // === SPIRITS ===
    puck:      'characters/puck.gif',

    // === DEMI-HUMANS / SANCTUARY ===
    ryuzu:        'characters/ryuzu.png',
    ryuzu_shima:  'characters/ryuzu_shima.png',
    ryuzu_bilma:  'characters/ryuzu_bilma.png',
    ryuzu_arma:   'characters/ryuzu_arma.png',

    // === IMPORTANT FIGURES ===
    volcanica: 'characters/volcanica.png',
};

// Auto-generate silhouette pairs for every real character.
// Convention: `<id>-sil` → `silhouette/silhouette-<filename-stem>.png`
Object.keys(CHAR_IMAGE_PATHS).forEach(id => {
    if (id.endsWith('-sil')) return;
    const real = CHAR_IMAGE_PATHS[id];
    const stem = real.split('/').pop().replace(/\.(gif|png|jpg|jpeg|webp)$/i, '');
    CHAR_IMAGE_PATHS[id + '-sil'] = `silhouette/silhouette-${stem.toLowerCase()}.png`;
});

// Canon-aligned narrative groups (matches user's Re:Zero roster).
const CHAR_GROUPS = {
    main:        ['subaru'],
    royal:       ['emilia','crusch','anastasia','priscilla','felt'],
    knight:      ['otto','garfiel','roswaal','frederica','petra','felix','wilhelm','julius','reinhard','rom','al'],
    mansion:     ['rem','ram','beatrice','petra'],
    witch:       ['satella','echidna','minerva','sekhmet','daphne','typhon','carmilla'],
    enemy:       ['petelgeuse','regulus','lye'],
    other_enemy: ['elsa','meili','whitewhale','greatrabbit'],
    spirit:      ['beatrice','puck'],
    demi:        ['garfiel','frederica','ryuzu','ryuzu_shima','ryuzu_bilma','ryuzu_arma'],
    figure:      ['volcanica'],
};

// Silhouette-mode pools — used during the most haunting chorus moments.
const CHAR_GROUPS_SIL = {
    witch:    ['satella-sil','echidna-sil','minerva-sil','sekhmet-sil','daphne-sil','typhon-sil','carmilla-sil'],
    enemy:    ['petelgeuse-sil','regulus-sil','lye-sil'],
    mansion:  ['rem-sil','ram-sil','beatrice-sil'],
    spirit:   ['beatrice-sil','puck-sil'],
    main:     ['subaru-sil'],
    royal:    ['emilia-sil','crusch-sil','anastasia-sil','priscilla-sil','felt-sil'],
    other_enemy: ['elsa-sil','meili-sil','whitewhale-sil','greatrabbit-sil'],
};

// Lyric hooks — each entry maps a Styx Helix lyric pattern to the canon
// character/scene it actually refers to in Re:Zero.
//   sil:true  → use the silhouette twin (shadow form) for this moment.
const LYRIC_HOOKS = [
    // "Don't let me die / waiting for your touch" — Emilia, Subaru's promise
    { match: /don'?t let me die|waiting for your touch/i, char: 'emilia', effect: 'enter-sil-drop' },

    // "Restart" — Subaru's Return by Death
    { match: /restart/i,                       char: 'subaru',   effect: 'enter-lightning', flash: true },

    // "Endless dead end" — the Witch of Envy's curse
    { match: /endless dead end/i,              char: 'satella',  effect: 'enter-shatter', flash: true, sil: true },

    // "Memories / sand / kioku / time spinning" — Beatrice (lost contract, library)
    { match: /memor|kioku|sand|spinning|time is/i, char: 'beatrice', effect: 'enter-ink-bleed' },

    // "Kanashimi / kudaku" — grief that breaks; Petelgeuse embodies broken devotion
    { match: /kanashimi|kudaku|grief/i,        char: 'petelgeuse', effect: 'enter-ink-bleed', sil: true },

    // "Wish / negai / touch / I wish I was there" — Rem, her undying wish
    { match: /wish|negai/i,                    char: 'rem',      effect: 'enter-sil-drop' },

    // "Black eyes / kuroi / deep" — Satella's shadow
    { match: /black eyes|deep black|kuroi/i,   char: 'satella',  effect: 'enter-ink-bleed', sil: true },

    // "Fading in, fading out" — Witches fading from the Sanctuary
    { match: /fading/i,                        group: 'witch',   effect: 'enter-ink-bleed', sil: true },

    // "See you off / sayonara / see you again" — Royal Selection farewells
    { match: /see you|sayonara|farewell/i,     group: 'royal',   effect: 'enter-sil-drop' },

    // "Try again / from the very first time" — Subaru looping back
    { match: /try again|first time|hajimete/i, char: 'subaru',   effect: 'enter-zoom' },

    // "Searching / oikake / never close your eyes" — Puck/Beatrice (spirits guiding)
    { match: /searching|oikake|never close/i,  group: 'spirit',  effect: 'enter-up' },

    // "Owarimasu / itsuka / dead end / kudaku" — Sin Archbishops looming
    { match: /owari|dead end/i,                group: 'enemy',   effect: 'enter-shatter', sil: true },

    // "Forgot / wasurete" — Echidna (Trial of memory)
    { match: /wasurete|forgot/i,               char: 'echidna',  effect: 'enter-ink-bleed' },

    // "Hibi / modorenai / ano days" — past Subaru couldn't return to
    { match: /hibi|modorenai|days are gone/i,  char: 'subaru',   effect: 'enter-up', sil: true },

    // "Tsuyoku / strong / enjiteru" — Reinhard (the strongest knight)
    { match: /tsuyoku|enjiteru|strongest/i,    char: 'reinhard', effect: 'enter-lightning', flash: true },

    // "Kimi to / with you / waiting for a new day" — Emilia
    { match: /kimi to|with you|new day/i,      char: 'emilia',   effect: 'enter-sil-drop' },

    // "Kienai / don't disappear / nidoto" — Rem's fading existence
    { match: /kienai|nidoto/i,                 char: 'rem',      effect: 'enter-ink-bleed', sil: true },

    // "Tsuioku / wana / amai kaori" — Echidna's tea party trap
    { match: /tsuioku|wana|kaori/i,            char: 'echidna',  effect: 'enter-ink-bleed' },

    // "Sasoware / toraware / oborete" — drowning in temptation; witches
    { match: /sasoware|toraware|oborete/i,     group: 'witch',   effect: 'enter-ink-bleed', sil: true },
];

// Verse-cycle: a narrative arc Subaru → allies → witches → return.
// When no lyric hook matches, walk this sequence so it tells a story
// instead of feeling random.
const VERSE_NARRATIVE = [
    'subaru','emilia','rem','beatrice','puck',
    'subaru','otto','ram','garfiel','frederica',
    'crusch','wilhelm','felix','julius','reinhard',
    'subaru','echidna','minerva','sekhmet','daphne',
    'petelgeuse','regulus','elsa','meili',
    'subaru','emilia','rem','beatrice',
];
const CHORUS_NARRATIVE = [
    'satella-sil','emilia','subaru','rem-sil','beatrice',
    'echidna','satella','reinhard','petelgeuse-sil','satella-sil',
    'emilia','subaru','rem','puck-sil',
];
let lastCharId = null;
const STAGE_STATE_CLASSES = ['active','reveal','chorus','front','flip','enter-right','enter-left','enter-up','enter-zoom','enter-sil-drop','enter-shatter','enter-ink-bleed','enter-lightning','lingering','exiting'];
const stageTimers = new WeakMap();

// On image error: surface the broken path as alt text so you can identify
// which file is missing/wrong. No fallback — fail loud, not silent.
function installCharacterImageFallback() {
    document.addEventListener('error', (e) => {
        const t = e.target;
        if (t && t.tagName === 'IMG' && t.classList && t.classList.contains('char-real')) {
            const broken = t.getAttribute('src') || t.dataset.charSrc || '(unknown)';
            t.alt = `⚠ Missing image: ${broken}`;
            t.dataset.loadError = '1';
            console.warn('[char-image] failed to load:', broken);
        }
    }, true);
}

function preloadCharacterImages() {
    Object.values(CHAR_IMAGE_PATHS).forEach(src => {
        const img = new Image();
        img.decoding = 'async';
        img.loading = 'eager';
        img.src = src;
    });
    installCharacterImageFallback();
}

function clearStageTimers(stage) {
    const timers = stageTimers.get(stage);
    if (!timers) return;
    Object.values(timers).forEach(timerId => clearTimeout(timerId));
    stageTimers.delete(stage);
}

function resetStage(stage) {
    if (!stage) return;
    clearStageTimers(stage);
    stage.classList.remove(...STAGE_STATE_CLASSES);
}

function queueStageFade(stage, isChorus) {
    if (!stage) return;

    clearStageTimers(stage);
    stage.classList.remove('front', 'chorus', 'exiting');
    stage.classList.add('lingering', 'reveal');

    const holdMs = isChorus ? 4200 : 3200;
    const fadeMs = isChorus ? 3400 : 2800;

    const exitTimer = setTimeout(() => {
        if (!isStyxHelixMode) return;
        stage.classList.remove('active', 'front', 'chorus');
        stage.classList.add('lingering', 'exiting', 'reveal');
    }, holdMs);

    const cleanupTimer = setTimeout(() => {
        stage.classList.remove(...STAGE_STATE_CLASSES);
        stageTimers.delete(stage);
    }, holdMs + fadeMs + 120);

    stageTimers.set(stage, { exitTimer, cleanupTimer });
}

function showStage(stage, pos, enter, isChorus = false) {
    if (!stage) return;

    stage.setAttribute('data-pos', pos);
    resetStage(stage);

    if (pos === 'left' || pos === 'far-left') {
        stage.classList.add('flip');
    }

    void stage.offsetWidth;
    stage.classList.add('active', 'reveal', 'front', enter);

    if (isChorus) {
        stage.classList.add('chorus');
    }
}

function showInitialCharacter() {
    const initialStage = document.getElementById('char-emilia');
    if (!initialStage) return;

    lastCharId = 'emilia';
    showStage(initialStage, 'right', 'enter-right', false);
}

function swapCharacter(lyricIndex, lyric) {
    const text = lyric.text || '';
    let charId = null;
    let effect = null;
    let flash = false;
    let useSil = false;

    // 1) Try lyric-keyword hooks first (canon Re:Zero moments)
    for (const hook of LYRIC_HOOKS) {
        if (hook.match.test(text)) {
            if (hook.char) {
                charId = hook.char;
            } else if (hook.group && CHAR_GROUPS[hook.group]) {
                const pool = (hook.sil && CHAR_GROUPS_SIL[hook.group])
                    ? CHAR_GROUPS_SIL[hook.group]
                    : CHAR_GROUPS[hook.group];
                charId = pool[lyricIndex % pool.length];
            }
            effect = hook.effect;
            flash = !!hook.flash;
            useSil = !!hook.sil;
            break;
        }
    }

    // 2) Otherwise walk a narrative arc instead of random group picks.
    //    Choruses use the haunting silhouette-heavy arc; verses tell the
    //    Subaru → allies → opposition story.
    if (!charId) {
        const arc = lyric.isChorus ? CHORUS_NARRATIVE : VERSE_NARRATIVE;
        charId = arc[lyricIndex % arc.length];
    }

    // 3) Resolve silhouette suffix → real stage id (sil chars live as `<id>-sil`)
    //    The hook may have asked for the silhouette form via `useSil`.
    if (useSil && !charId.endsWith('-sil')) {
        charId = charId + '-sil';
    }

    // 4) Avoid same character twice in a row — fall back to a curated rotation
    if (charId === lastCharId) {
        const fallback = lyric.isChorus
            ? ['satella-sil','emilia','rem-sil','beatrice','subaru','echidna']
            : ['subaru','emilia','rem','beatrice','otto','crusch','reinhard'];
        charId = fallback[lyricIndex % fallback.length];
    }
    lastCharId = charId;

    // 5) Pick effect — keyword hook wins, otherwise blend old + new pools
    if (!effect) {
        const allEnters = lyric.isChorus
            ? [...CHAR_ENTERS, ...CHAR_ENTERS_NEW, 'enter-shatter', 'enter-lightning']
            : [...CHAR_ENTERS, 'enter-sil-drop', 'enter-ink-bleed'];
        effect = allEnters[lyricIndex % allEnters.length];
    }

    const stage = document.getElementById('char-' + charId);
    if (!stage) {
        console.warn('[styx-helix] missing char stage:', 'char-' + charId);
        return;
    }

    const stages = Array.from(document.querySelectorAll('.char-stage'));
    stages.forEach(prevStage => {
        if (prevStage !== stage && (prevStage.classList.contains('active') || prevStage.classList.contains('lingering'))) {
            queueStageFade(prevStage, prevStage.classList.contains('chorus'));
        }
    });

    const pos = CHAR_POSITIONS[lyricIndex % CHAR_POSITIONS.length];
    showStage(stage, pos, effect, lyric.isChorus);

    if (flash || effect === 'enter-lightning') triggerLightningFlash();
}

// Optimized lyrics sync using requestAnimationFrame (smoother, less CPU)
function startOptimizedLyricsSync() {
    function syncLyrics() {
        if (!isStyxHelixMode || !styxAudio) return;
        
        if (!styxAudio.paused) {
            const currentTime = styxAudio.currentTime;
            
            // Find current lyric
            let lyricIndex = 0;
            for (let i = STYX_HELIX_LYRICS.length - 1; i >= 0; i--) {
                if (currentTime >= STYX_HELIX_LYRICS[i].time) {
                    lyricIndex = i;
                    break;
                }
            }
            
            if (lyricIndex !== lastLyricIndex) {
                lastLyricIndex = lyricIndex;
                const currentLyric = STYX_HELIX_LYRICS[lyricIndex];
                
                if (lyricsText) {
                    lyricsText.textContent = currentLyric.text;
                    
                    if (currentLyric.isChorus && currentLyric.text) {
                        lyricsText.className = 'lyrics-text lyrics-chorus';
                        triggerBeatFlash();
                    } else {
                        lyricsText.className = 'lyrics-text lyrics-verse';
                    }
                }

                if (currentLyric.text) {
                    swapCharacter(lyricIndex, currentLyric);
                }
            }
        }
        
        lyricsAnimationFrame = requestAnimationFrame(syncLyrics);
    }
    
    lyricsAnimationFrame = requestAnimationFrame(syncLyrics);
}

// Trigger a beat flash
function triggerBeatFlash() {
    if (!beatFlash) return;
    beatFlash.classList.add('flash');
    setTimeout(() => {
        beatFlash.classList.remove('flash');
    }, 100);
}

// Trigger full-screen lightning flash (paired with enter-lightning effect)
function triggerLightningFlash() {
    const overlay = document.getElementById('lightning-overlay');
    if (!overlay) return;
    overlay.classList.remove('flash');
    void overlay.offsetWidth;
    overlay.classList.add('flash');
    setTimeout(() => overlay.classList.remove('flash'), 750);
}

// Format time for display
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Audio event listeners
if (styxAudio) {
    styxAudio.addEventListener('timeupdate', () => {
        const current = styxAudio.currentTime;
        const duration = styxAudio.duration || 0;
        
        if (musicCurrentTime) musicCurrentTime.textContent = formatTime(current);
        if (musicDurationEl && duration) musicDurationEl.textContent = formatTime(duration);
        if (musicProgressFill && duration) {
            musicProgressFill.style.width = (current / duration * 100) + '%';
        }
    });
    
    styxAudio.addEventListener('ended', () => {
        playIcon.innerHTML = '&#9654;';
        if (isStyxHelixMode) {
            deactivateStyxHelixMode();
        }
        // Loop the music for continuous background play
        if (currentPlayingMusic) {
            styxAudio.currentTime = 0;
            styxAudio.play().then(() => {
                playIcon.innerHTML = '&#10074;&#10074;';
                if (currentPlayingMusic.title.toLowerCase().includes('styx') || 
                    currentPlayingMusic.title.toLowerCase().includes('helix')) {
                    activateStyxHelixMode();
                }
            }).catch(() => {});
        }
    });
    
    styxAudio.addEventListener('loadedmetadata', () => {
        if (musicDurationEl) {
            musicDurationEl.textContent = formatTime(styxAudio.duration);
        }
    });
}

// Play/Pause button
if (musicPlayPause) {
    musicPlayPause.addEventListener('click', () => {
        if (styxAudio.paused) {
            styxAudio.play();
            playIcon.innerHTML = '&#10074;&#10074;';
        } else {
            styxAudio.pause();
            playIcon.innerHTML = '&#9654;';
        }
    });
}

// Stop button
if (musicStop) {
    musicStop.addEventListener('click', () => {
        currentPlayingMusic = null;
        styxAudio.pause();
        styxAudio.currentTime = 0;
        playIcon.innerHTML = '&#9654;';
        musicPlayerBar.classList.remove('active');
        if (isStyxHelixMode) deactivateStyxHelixMode();
    });
}

// Close X button on music bar - stops and hides
const musicCloseX = document.getElementById('music-close-x');
if (musicCloseX) {
    musicCloseX.addEventListener('click', () => {
        currentPlayingMusic = null;
        styxAudio.pause();
        styxAudio.currentTime = 0;
        playIcon.innerHTML = '&#9654;';
        musicPlayerBar.classList.remove('active');
        if (isStyxHelixMode) deactivateStyxHelixMode();
    });
}

// Close X button on admin auth screen
const notifCloseX = document.getElementById('notif-close-x');
if (notifCloseX) {
    notifCloseX.addEventListener('click', () => {
        closeSystemNotif();
    });
}

// Progress bar click to seek
if (musicProgress) {
    musicProgress.addEventListener('click', (e) => {
        const rect = musicProgress.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        styxAudio.currentTime = percent * styxAudio.duration;
    });
}

// Music modal functions
if (addMusicBtn) {
    addMusicBtn.addEventListener('click', () => {
        musicModal.classList.remove('hidden');
        musicModal.classList.add('flex');
    });
}

window.closeMusicModal = function() {
    musicModal.classList.add('hidden');
    musicModal.classList.remove('flex');
    musicForm.reset();
}

if (musicForm) {
    musicForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('input-music-title').value;
        const artist = document.getElementById('input-music-artist').value;
        const imageFile = document.getElementById('input-music-image').files[0];
        const audioFile = document.getElementById('input-music-file').files[0];
        
        if (!imageFile || !audioFile) {
            alert('Please select both an image and an MP3 file.');
            return;
        }
        
        // Upload image
        const imageName = `music/${Date.now()}-${imageFile.name}`;
        await db.storage.from('portfolio-assets').upload(imageName, imageFile);
        const { data: imageUrlData } = db.storage.from('portfolio-assets').getPublicUrl(imageName);
        
        // Upload audio
        const audioName = `music/${Date.now()}-${audioFile.name}`;
        await db.storage.from('portfolio-assets').upload(audioName, audioFile);
        const { data: audioUrlData } = db.storage.from('portfolio-assets').getPublicUrl(audioName);
        
        // Insert into database
        const { error } = await db.from('music').insert([{
            title,
            artist,
            image_url: imageUrlData.publicUrl,
            audio_url: audioUrlData.publicUrl
        }]);
        
        if (error) {
            alert('Error: ' + error.message);
        } else {
            closeMusicModal();
            loadPortfolio();
        }
    });
}

// Keyboard shortcuts - work anytime music is playing
document.addEventListener('keydown', (e) => {
    // Only handle if music player is active
    if (!musicPlayerBar.classList.contains('active')) return;
    
    // ESC to stop music
    if (e.key === 'Escape') {
        currentPlayingMusic = null;
        styxAudio.pause();
        styxAudio.currentTime = 0;
        playIcon.innerHTML = '&#9654;';
        musicPlayerBar.classList.remove('active');
        if (isStyxHelixMode) deactivateStyxHelixMode();
    }
    // Space to play/pause (when not in input)
    if (e.key === ' ' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        if (styxAudio.paused) {
            styxAudio.play();
            playIcon.innerHTML = '&#10074;&#10074;';
        } else {
            styxAudio.pause();
            playIcon.innerHTML = '&#9654;';
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    preloadCharacterImages();
    initSystemNotif();
    loadPortfolio();
});
