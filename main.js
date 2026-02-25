window.homepageData = {};
window.frontendMusicians = []; 
window.frontendEvents = []; 
window.frontendCourses = [];

// ==========================================
// 1. โหลดข้อมูลและโครงสร้างเริ่มต้น
// ==========================================
async function initFrontend() {
    try {
        const res = await fetch('api/get_homepage.php').catch(() => null);
        if (res && res.ok) window.homepageData = await res.json();
    } catch (e) {}
    
    const includes = document.querySelectorAll('[data-include]');
    const promises = Array.from(includes).map(async el => {
        const file = el.getAttribute('data-include');
        try {
            const html = await (await fetch(file)).text();
            el.innerHTML = html;
        } catch(err) {}
    });
    
    await Promise.all(promises);
    
    if (typeof window.applyDataToDOM === 'function') window.applyDataToDOM(document);
}

// ==========================================
// 2. ระบบ Musicians (Grid หน้าแรก)
// ==========================================
async function loadFrontendMusicians() {
    try {
        if(window.frontendMusicians.length === 0) {
            const res = await fetch('backend.php?action=get_all_musicians');
            if (!res.ok) return;
            const result = await res.json();
            if (result.status === 'success') window.frontendMusicians = result.data;
        }
        
        const musicians = window.frontendMusicians;
        const artistLibrary = musicians.filter(m => m.network_type === 'artist_library');
        const jazzNetwork = musicians.filter(m => m.network_type === 'jazz_network');
        
        const artistContainer = document.querySelector('#artists-library-grid-template .clone-main-content');
        if (artistContainer) {
            artistContainer.innerHTML = ''; 
            artistLibrary.forEach((artist, index) => {
                const imgUrl = artist.profile_image || './png/Chiangmai Blue.png';
                const displayTitle = (window.currentLang === 'th' && artist.title_th) ? artist.title_th : (artist.title || 'Untitled');

                artistContainer.innerHTML += `
                    <a href="#" data-musician-id="${artist.id}" class="artist-link block group relative rounded-[1.5rem] overflow-hidden aspect-square cursor-pointer shadow-lg bg-black/10">
                        <img id="dyn-artist${index+1}_img" src="${imgUrl}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                        <div class="absolute bottom-0 left-0 w-full p-4 md:p-5 flex justify-between items-end gap-2">
                            <h3 id="dyn-artist${index+1}_name" class="text-base sm:text-lg lg:text-xl font-header font-bold text-white leading-[1.2] text-left break-words w-full whitespace-normal line-clamp-3">${displayTitle}</h3>
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 sm:w-7 sm:h-7 text-white transition-transform duration-300 group-hover:translate-x-1 shrink-0 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </div>
                    </a>
                `;
            });
        }

        const jazzContainer = document.querySelector('#jazz-network-grid-template .clone-main-content');
        if (jazzContainer) {
            jazzContainer.innerHTML = ''; 
            jazzNetwork.forEach((jazz, index) => {
                const imgUrl = jazz.profile_image || './png/Jazz Arabica Vol.3.png';
                const displayTitle = (window.currentLang === 'th' && jazz.title_th) ? jazz.title_th : (jazz.title || 'Untitled');

                jazzContainer.innerHTML += `
                    <a href="#" data-musician-id="${jazz.id}" class="artist-link block group relative rounded-[1.5rem] overflow-hidden aspect-square cursor-pointer shadow-lg bg-black/10">
                        <img id="dyn-partner${index+1}_img" src="${imgUrl}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                        <div class="absolute bottom-0 left-0 w-full p-4 md:p-5 flex justify-between items-end gap-2">
                            <h3 id="dyn-partner${index+1}_name" class="text-base sm:text-lg lg:text-xl font-header font-bold text-white leading-[1.2] text-left break-words w-full whitespace-normal line-clamp-3">${displayTitle}</h3>
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 sm:w-7 sm:h-7 text-white transition-transform duration-300 group-hover:translate-x-1 shrink-0 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </div>
                    </a>
                `;
            });
        }
    } catch (err) {}
}

document.addEventListener('DOMContentLoaded', async () => {
    // รอจนกว่าไฟล์ HTML ย่อยทั้งหมดโหลดเสร็จสมบูรณ์
    await initFrontend();
    loadFrontendMusicians();

    // 🌟 เปลี่ยนสีปุ่มภาษา
    const langBtns = document.querySelectorAll('.front-lang-btn');
    langBtns.forEach(b => {
        const btnLang = b.textContent.trim().toLowerCase();
        if (btnLang === window.currentLang) {
            b.classList.remove('text-gray-400');
            b.classList.add('text-[#ef5f4d]', 'border-b-2', 'border-[#ef5f4d]');
        } else {
            b.classList.add('text-gray-400');
            b.classList.remove('text-[#ef5f4d]', 'border-b-2', 'border-[#ef5f4d]');
        }
    });

    // 🌟 แปลภาษา UI ทันทีที่โหลด (ตอนนี้โหลดหลัง initFrontend เลยจะครอบคลุมไฟล์ย่อยด้วย)
    translateUI(window.currentLang);

    // 🌟 ฟังก์ชันสลับภาษา (กดปุ๊บ จำค่า แล้วโหลดใหม่)
    window.switchFrontLang = function(btn, lang) {
        if(window.currentLang === lang) return; 
        localStorage.setItem('siteLang', lang); 
        window.location.reload(); 
    };

    const menuToggle = document.getElementById('menu-toggle');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenuContainer = document.getElementById('mobile-menu-container');
    const menuBackdrop = document.getElementById('menu-backdrop');
    const menuPanel = document.getElementById('menu-panel');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            mobileMenuContainer.classList.remove('hidden');
            requestAnimationFrame(() => { 
                menuBackdrop.classList.remove('opacity-0'); 
                menuPanel.classList.remove('translate-x-full'); 
            });
        });
    }
    
    const closeMenu = () => {
        menuBackdrop.classList.add('opacity-0'); 
        menuPanel.classList.add('translate-x-full');
        setTimeout(() => mobileMenuContainer.classList.add('hidden'), 300);
    };
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
    if (menuBackdrop) menuBackdrop.addEventListener('click', closeMenu);
});

// ==========================================
// 3. ระบบแสดงรายละเอียดศิลปิน (Artist Detail)
// ==========================================
window.showArtistDetailContent = function(artistType, artistNum, linkElement = null) {
    const template = document.getElementById('artist-detail-template');
    if (!activeClone || !template) return;
    activeClone.querySelector('.content-visible')?.classList.remove('content-visible');

    let musicianId = null;
    if (linkElement && linkElement.hasAttribute('data-musician-id')) {
        musicianId = linkElement.getAttribute('data-musician-id');
    }

    setTimeout(() => {
        activeClone.style.backgroundColor = 'transparent'; 
        activeClone.style.padding = '0';
        
        if (musicianId && window.frontendMusicians) {
            const musician = window.frontendMusicians.find(m => m.id == musicianId);
            if (musician) {
                const bannerImg = musician.banner_image || 'https://placehold.co/1200x400/333/ccc?text=No+Banner';
                const profileImg = musician.profile_image || 'https://placehold.co/600x800/222/ddd?text=No+Profile';
                
                const title = (window.currentLang === 'th' && musician.title_th) ? musician.title_th : (musician.title || 'Untitled');
                const rawGenre = (window.currentLang === 'th' && musician.genre_th) ? musician.genre_th : musician.genre;
                const rawDetails = (window.currentLang === 'th' && musician.details_th) ? musician.details_th : musician.details;

                const genre = rawGenre ? `<p class="italic text-gray-700 font-medium mb-3 break-words break-all whitespace-normal">${rawGenre}</p>` : '';
                const detailsHtml = rawDetails ? `<div class="break-words break-all whitespace-normal">${rawDetails.replace(/\n/g, '<br>')}</div>` : '';
                
                let socialsHTML = '';
                if(musician.facebook) socialsHTML += `<a href="${musician.facebook}" target="_blank" class="text-[#1877F2] hover:opacity-80 transition"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>`;
                if(musician.tiktok) socialsHTML += `<a href="${musician.tiktok}" target="_blank" class="text-black hover:opacity-80 transition"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z"/></svg></a>`;
                if(musician.instagram) socialsHTML += `<a href="${musician.instagram}" target="_blank" class="text-[#E1306C] hover:opacity-80 transition"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>`;
                
                let contactLine = '';
                if (musician.whatsapp) contactLine = `Contact : ${musician.whatsapp}`;
                else if (musician.email) contactLine = `Contact : ${musician.email}`;

                let videoHtml = '';
                try { 
                    const vids = JSON.parse(musician.video_link || '[]'); 
                    if (vids.length > 0) {
                        videoHtml = `
                            <div class="flex items-center gap-4 mb-4 mt-8">
                                <h3 class="text-2xl font-extrabold text-black">Video</h3>
                                <hr class="flex-grow border-gray-400">
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        `;
                        vids.forEach(v => {
                            let embedUrl = v;
                            if(v.includes('youtube.com/watch?v=')) embedUrl = v.replace('watch?v=', 'embed/');
                            else if(v.includes('youtu.be/')) embedUrl = v.replace('youtu.be/', 'youtube.com/embed/');

                            if(embedUrl.includes('embed/')) {
                                videoHtml += `<div class="w-full aspect-video rounded-xl overflow-hidden shadow-sm border border-gray-200"><iframe width="100%" height="100%" src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
                            } else {
                                videoHtml += `<a href="${v}" target="_blank" class="bg-[#ffc107] text-black font-bold p-4 rounded-xl flex items-center justify-center hover:bg-black hover:text-white transition shadow-sm h-full min-h-[100px] text-center break-all text-sm px-4">▶ Play Video</a>`;
                            }
                        });
                        videoHtml += `</div>`;
                    }
                } catch(e){}

                activeClone.innerHTML = `
                    <div class="artist-detail-content hide-scrollbar h-full overflow-y-auto bg-[#f8f9fa] text-black rounded-2xl pb-12">
                        <div class="w-full h-48 md:h-64 overflow-hidden rounded-t-2xl relative border-b border-gray-200">
                            <img src="${bannerImg}" class="w-full h-full object-cover object-center">
                        </div>
                        <div class="p-6 md:p-12 max-w-6xl mx-auto">
                            <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                               <div class="md:col-span-5 lg:col-span-4 flex items-start">
                                    <img src="${profileImg}" class="w-full h-auto rounded-2xl shadow-lg border border-gray-200">
                               </div>
                               <div class="md:col-span-7 lg:col-span-8 min-w-0">
                                    <h1 class="text-4xl md:text-5xl font-extrabold text-black tracking-tight mb-1 break-words break-all w-full whitespace-normal">${title}</h1>
                                    ${genre}
                                    <div class="flex items-center gap-3 mb-3">
                                        ${socialsHTML}
                                    </div>
                                    ${contactLine ? `<p class="font-bold text-sm text-black mb-4">${contactLine}</p>` : ''}
                                    <hr class="border-gray-300 my-4">
                                    <div class="text-sm sm:text-base leading-relaxed text-black font-medium space-y-4">
                                        ${detailsHtml}
                                    </div>
                                    ${videoHtml}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
        
        requestAnimationFrame(() => activeClone.querySelector('.artist-detail-content')?.classList.add('content-visible'));

        const backButton = document.createElement('button'); backButton.innerHTML = '&#8592;'; backButton.className = 'nav-btn nav-btn-left'; backButton.style.left = '20px'; backButton.style.color = '#121212'; backButton.style.borderColor = '#121212';
        backButton.addEventListener('click', (e) => { 
            e.stopPropagation(); 
            if (mainContainer.dataset.initialHeight) { mainContainer.style.height = `${mainContainer.dataset.initialHeight}px`; delete mainContainer.dataset.initialHeight; }
            showMainCategoryContent(); 
        });
        const closeBtn = document.createElement('button'); closeBtn.innerHTML = '&times;'; closeBtn.className = 'close-btn'; closeBtn.style.top = '20px'; closeBtn.style.right = '20px';
        closeBtn.addEventListener('click', (e) => { e.stopPropagation(); collapseCard(activeClone, activeCard); });
        activeClone.appendChild(backButton); activeClone.appendChild(closeBtn);
        
        if(window.applyDataToDOM) window.applyDataToDOM(activeClone);
    }, 300);
}

// ==========================================
// 4. ระบบจัดการหน้าต่างแบบ Dynamic (Festival, Courses, Bigband)
// ==========================================
window.applyDataToDOM = async function(container) {
    
    // --------------------------------------------------
    // A. ส่วนของ Festival & Event
    // --------------------------------------------------
    const isFestival = container.querySelector('#dyn-fest_main_title');
    if (isFestival) {
        const festivalContainer = container.querySelector('#festival-content .clone-main-content') || container.querySelector('.clone-main-content');
        if (festivalContainer) {
            try {
                if(window.frontendEvents.length === 0) {
                    const response = await fetch('backend.php?action=get_front_events&t=' + new Date().getTime());
                    const result = await response.json();
                    if (result.status === 'success' && result.data.length > 0) window.frontendEvents = result.data;
                }
                
                festivalContainer.innerHTML = ''; 
                const hiddenContainer = document.getElementById('hidden-card-content');
                
                window.frontendEvents.forEach((event) => {
                    const title = (window.currentLang === 'th' && event.title_th) ? event.title_th : event.title;
                    if (!title || title.trim() === '') return; 
                    
                    const short_desc = (window.currentLang === 'th' && event.short_description_th) ? event.short_description_th : event.short_description;
                    const detailsText = (window.currentLang === 'th' && event.details_th) ? event.details_th : event.details;
                    const venue_title = (window.currentLang === 'th' && event.venue_title_th) ? event.venue_title_th : event.venue_title;
                    const venue_details = (window.currentLang === 'th' && event.venue_details_th) ? event.venue_details_th : event.venue_details;
                    
                    const safeStartDate = event.start_date.replace(/-/g, "/");
                    const startD = new Date(safeStartDate);
                    const endStr = event.end_date && event.end_date !== '0000-00-00 00:00:00' ? event.end_date : event.start_date;
                    const safeEndDate = endStr.replace(/-/g, "/");
                    const endD = new Date(safeEndDate);
                    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                    
                    let dateCard = '';
                    if (startD.getTime() !== endD.getTime() && startD.getMonth() === endD.getMonth()) {
                        dateCard = `${String(startD.getDate()).padStart(2, '0')}-${String(endD.getDate()).padStart(2, '0')}<br>${monthNames[startD.getMonth()]}<br>${startD.getFullYear()}`;
                    } else {
                        dateCard = `${String(startD.getDate()).padStart(2, '0')}<br>${monthNames[startD.getMonth()]}<br>${startD.getFullYear()}`;
                    }

                    const imageUrl = event.banner_image ? event.banner_image : 'https://placehold.co/1200x400/1a1a1a/ffffff?text=Jazz+Event';
                    
                    const cardHTML = `
                        <div data-event-index="${event.id}" class="event-link relative rounded-2xl overflow-hidden group cursor-pointer bg-black/40 border border-white/20 min-h-[160px] md:min-h-[180px] flex items-end p-5 lg:p-6 transition-transform duration-300 hover:scale-[1.02] mb-4">
                            <img src="${imageUrl}" class="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen group-hover:opacity-90 transition-opacity duration-300">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 pointer-events-none"></div>
                            <div class="relative z-10 w-full flex items-end justify-between gap-4 text-white">
                                <div class="font-header text-2xl lg:text-3xl font-bold leading-none tracking-tight shrink-0 text-left">${dateCard}</div>
                                <div class="flex flex-col items-end text-right flex-1 min-w-0">
                                    <div class="flex items-center justify-end gap-3 w-full mb-1">
                                        <h3 class="font-header text-xl lg:text-2xl font-bold tracking-tight leading-tight break-words text-right line-clamp-2">${title}</h3>
                                        <div class="w-8 h-8 border border-white/50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-colors hidden sm:flex">
                                            <span class="text-sm leading-none -mt-0.5">&#8594;</span>
                                        </div>
                                    </div>
                                    <p class="font-body text-xs sm:text-sm text-white/80 leading-relaxed break-words line-clamp-2 max-w-[90%] text-right">${short_desc || ''}</p>
                                </div>
                            </div>
                        </div>
                    `;
                    festivalContainer.innerHTML += cardHTML;
                    
                    if(hiddenContainer) {
                        const posterImg = event.poster_image ? event.poster_image : 'https://placehold.co/600x800/222/fff?text=Poster';
                        const leftCol = `<div class="lg:col-span-4 flex flex-col gap-6"><img src="${posterImg}" class="w-full rounded-lg shadow-md border border-gray-200"><button class="flex items-center gap-2 text-lg font-bold hover:text-gray-500 transition-colors w-fit" onclick="document.querySelector('.close-btn').click()"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>Go Back</button></div>`;

                        let detailDiv = document.getElementById('event-detail-content-' + event.id);
                        if(!detailDiv) { detailDiv = document.createElement('div'); detailDiv.id = 'event-detail-content-' + event.id; detailDiv.className = 'hidden'; hiddenContainer.appendChild(detailDiv); }
                        const dateFormatted = `${String(startD.getDate()).padStart(2, '0')} ${monthNames[startD.getMonth()]} ${startD.getFullYear()}`;
                        detailDiv.innerHTML = `<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">${leftCol}<div class="lg:col-span-8"><h1 class="text-3xl sm:text-4xl lg:text-5xl font-header font-bold mb-1 tracking-tight break-words">${title}</h1><h2 class="text-2xl sm:text-3xl lg:text-4xl font-header font-bold mb-6 tracking-tight text-gray-700">${event.location || 'Chiangmai Jazz City'}</h2><p class="text-sm sm:text-base font-medium mb-4 text-black">${dateFormatted}</p><hr class="border-gray-300 border-t-2 mb-6"><div class="prose prose-sm sm:prose-base max-w-none text-black font-medium leading-relaxed text-sm whitespace-pre-line break-words">${detailsText ? detailsText.replace(/\n/g, '<br>') : 'ไม่มีรายละเอียด...'}</div></div></div>`;

                        let bookDiv = document.getElementById('book-now-content-' + event.id);
                        if(!bookDiv) { bookDiv = document.createElement('div'); bookDiv.id = 'book-now-content-' + event.id; bookDiv.className = 'hidden'; hiddenContainer.appendChild(bookDiv); }
                        let ticketsHTML = '';
                        if(event.tickets && event.tickets.length > 0) {
                            event.tickets.forEach(t => {
                                ticketsHTML += `<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-300 pb-4 pt-2"><div class="mb-4 sm:mb-0 max-w-sm pr-4"><h3 class="text-xl font-bold text-black mb-1 break-words">${t.title}</h3><p class="text-xs text-gray-600 font-medium leading-snug break-words whitespace-pre-line">${t.details || ''}</p></div><div class="flex items-center justify-between w-full sm:w-auto gap-6 shrink-0"><span class="text-xl font-bold text-black">${Number(t.price).toLocaleString('en-US')} THB</span><div class="flex items-center border border-black rounded bg-white"><button class="w-8 h-8 flex items-center justify-center text-xl font-bold bg-black text-white hover:bg-gray-800 transition">-</button><span class="w-10 text-center font-bold">0</span><button class="w-8 h-8 flex items-center justify-center text-xl font-bold bg-black text-white hover:bg-gray-800 transition">+</button></div></div></div>`;
                            });
                            ticketsHTML += `<div class="mt-6 flex flex-col gap-6"><label class="flex items-start gap-3 cursor-pointer"><input type="checkbox" class="mt-1 w-4 h-4 rounded border-gray-300 text-black focus:ring-black"><span class="text-[10px] sm:text-xs text-black font-medium leading-relaxed">By checking this box, I hereby agree that my information will be shared to our Event Organizers</span></label><button class="w-full bg-black text-white font-header font-bold text-xl py-4 rounded-full tracking-wider hover:bg-gray-800 transition-colors uppercase shadow-lg">BUY TICKET</button></div>`;
                        } else { ticketsHTML = '<p class="text-gray-500 font-medium mt-4">ไม่มีข้อมูลบัตรเข้าชมสำหรับงานนี้</p>'; }
                        bookDiv.innerHTML = `<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">${leftCol}<div class="lg:col-span-8 flex flex-col gap-4">${ticketsHTML}</div></div>`;

                        let lineDiv = document.getElementById('line-up-content-' + event.id);
                        if(!lineDiv) { lineDiv = document.createElement('div'); lineDiv.id = 'line-up-content-' + event.id; lineDiv.className = 'hidden'; hiddenContainer.appendChild(lineDiv); }
                        let lineupHTML = '';
                        if(event.lineups && event.lineups.length > 0) {
                            const groupedByDate = {};
                            event.lineups.forEach(l => { const d = l.lineup_date || 'TBA'; if(!groupedByDate[d]) groupedByDate[d] = []; groupedByDate[d].push(l); });
                            lineupHTML = '<div class="grid grid-cols-1 sm:grid-cols-2 gap-8">'; 
                            for (const [dateStr, items] of Object.entries(groupedByDate)) {
                                let dateHeader = dateStr;
                                if(dateStr !== 'TBA') { const dObj = new Date(dateStr.replace(/-/g, "/")); dateHeader = `${String(dObj.getDate()).padStart(2, '0')} ${monthNames[dObj.getMonth()]} ${dObj.getFullYear()}`; }
                                lineupHTML += `<div><h3 class="text-2xl font-header font-bold mb-4 border-b-2 border-gray-300 pb-2 uppercase">${dateHeader}</h3>`;
                                const groupedByStage = {};
                                items.forEach(l => { const s = l.lineup_stage || 'Main Stage'; if(!groupedByStage[s]) groupedByStage[s] = []; groupedByStage[s].push(l); });
                                for (const [stageName, stageItems] of Object.entries(groupedByStage)) {
                                    lineupHTML += `<div class="mb-6"><h4 class="font-bold text-sm mb-2 uppercase text-black tracking-wider">${stageName}</h4><ul class="text-sm text-gray-700 space-y-1">`;
                                    stageItems.forEach(item => { lineupHTML += `<li><span class="font-bold mr-2">${item.lineup_time ? item.lineup_time.substring(0,5) : ''}</span> ${item.band_name}</li>`; });
                                    lineupHTML += `</ul></div>`;
                                }
                                lineupHTML += `</div>`;
                            }
                            lineupHTML += '</div>';
                        } else { lineupHTML = '<div class="p-8 text-center text-gray-500">ไม่มีตารางเวลาศิลปินสำหรับงานนี้</div>'; }
                        lineDiv.innerHTML = `<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">${leftCol}<div class="lg:col-span-8">${lineupHTML}</div></div>`;

                        let venueDiv = document.getElementById('venue-content-' + event.id);
                        if(!venueDiv) { venueDiv = document.createElement('div'); venueDiv.id = 'venue-content-' + event.id; venueDiv.className = 'hidden'; hiddenContainer.appendChild(venueDiv); }
                        let venueHTML = '';
                        if (event.venue_image) venueHTML += `<img src="${event.venue_image}" class="w-full aspect-[16/9] object-cover rounded-xl shadow-md border border-gray-200 mb-6">`;
                        venueHTML += `<h2 class="text-3xl sm:text-4xl font-header font-bold mb-4 text-black tracking-tight">${venue_title || 'Venue Location'}</h2>`;
                        if (venue_details) venueHTML += `<div class="prose prose-sm sm:prose-base max-w-none text-gray-700 font-medium leading-relaxed mb-6 whitespace-pre-line">${venue_details}</div>`;
                        if (event.venue_map) {
                            if (event.venue_map.includes('<iframe')) venueHTML += `<div class="w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm">${event.venue_map.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="450"')}</div>`;
                            else venueHTML += `<a href="${event.venue_map}" target="_blank" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow hover:bg-blue-700 transition">📌 Open in Google Maps</a>`;
                        }
                        venueDiv.innerHTML = `<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">${leftCol}<div class="lg:col-span-8 flex flex-col">${venueHTML}</div></div>`;

                        let galDiv = document.getElementById('gallery-content-' + event.id);
                        if(!galDiv) { galDiv = document.createElement('div'); galDiv.id = 'gallery-content-' + event.id; galDiv.className = 'hidden'; hiddenContainer.appendChild(galDiv); }
                        let galleryHTML = '<div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">';
                        if(event.gallery_images) {
                            try {
                                const images = JSON.parse(event.gallery_images);
                                if(images.length > 0) { images.forEach(img => { galleryHTML += `<img src="${img}" class="w-full aspect-square object-cover rounded-lg shadow-sm hover:opacity-80 transition cursor-pointer">`; }); } 
                                else { galleryHTML += '<p class="col-span-3 text-gray-500 font-medium">ยังไม่มีรูปภาพแกลลอรี่สำหรับงานนี้</p>'; }
                            } catch(e){ galleryHTML += '<p class="col-span-3 text-gray-500 font-medium">ยังไม่มีรูปภาพแกลลอรี่สำหรับงานนี้</p>'; }
                        } else { galleryHTML += '<p class="col-span-3 text-gray-500 font-medium">ยังไม่มีรูปภาพแกลลอรี่สำหรับงานนี้</p>'; }
                        galleryHTML += '</div>';
                        galDiv.innerHTML = `<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">${leftCol}<div class="lg:col-span-8"><h2 class="text-3xl font-header font-bold mb-2">Event Gallery</h2>${galleryHTML}</div></div>`;
                    }
                });
                if (typeof addEventDetailListeners === 'function') addEventDetailListeners(container);
            } catch (error) { console.error('Error fetching events:', error); }
        }
    }

    // --------------------------------------------------
    // B. ส่วนของ Courses Library 
    // --------------------------------------------------
    const isCourse = container.querySelector('#dyn-course_main_title');
    if (isCourse) {
        const leftPane = isCourse.closest('.md\\:col-span-1'); 
        const rightPane = isCourse.closest('.grid').querySelector('.clone-main-content');

        if (rightPane) {
            try {
                if(window.frontendCourses.length === 0) {
                    const response = await fetch('backend.php?action=get_all_courses&t=' + new Date().getTime());
                    const result = await response.json();
                    if (result.status === 'success' && result.data.length > 0) window.frontendCourses = result.data;
                }
                const courses = window.frontendCourses;

                if (courses[0]) {
                    const bigImg = rightPane.querySelector('#dyn-course_vid_img');
                    const bigTitle = rightPane.querySelector('#dyn-course_sub_title');
                    const bigCreator = rightPane.querySelector('#dyn-course_main_creator'); 
                    const bigLink = bigImg ? bigImg.closest('.course-link') : null;
                    
                    if (bigImg) bigImg.src = courses[0].banner_image || 'https://placehold.co/800x450/333/fff?text=No+Image';
                    if (bigTitle) bigTitle.textContent = (window.currentLang === 'th' && courses[0].title_th) ? courses[0].title_th : (courses[0].title || 'Untitled Course');
                    if (bigCreator) bigCreator.textContent = `By ` + ((window.currentLang === 'th' && courses[0].creator_th) ? courses[0].creator_th : (courses[0].creator || 'Unknown')); 
                    if (bigLink) bigLink.setAttribute('data-course-index', courses[0].id); 
                }

                const listContainer = rightPane.querySelector('#course-list-container');
                if (listContainer) {
                    listContainer.className = 'flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar flex-grow scroll-smooth';
                    listContainer.innerHTML = ''; 

                    const smallCourses = courses.slice(1);
                    smallCourses.forEach((c) => {
                        const imgUrl = c.banner_image || 'https://placehold.co/250x150/444/fff?text=Course';
                        const title = (window.currentLang === 'th' && c.title_th) ? c.title_th : (c.title || 'Untitled Course');
                        const creator = (window.currentLang === 'th' && c.creator_th) ? c.creator_th : (c.creator || 'Unknown');

                        listContainer.innerHTML += `
                            <div data-course-index="${c.id}" class="course-link cursor-pointer group relative rounded-lg overflow-hidden aspect-video shadow-md shrink-0 w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.6rem)] snap-start">
                                <img src="${imgUrl}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent group-hover:from-black/70 transition-colors duration-500"></div>
                                <div class="absolute bottom-0 left-0 p-3 w-full z-10 pointer-events-none">
                                    <h3 class="text-white font-bold text-sm sm:text-base leading-tight truncate">${title}</h3>
                                    <p class="text-white/80 text-[10px] sm:text-xs truncate">By ${creator}</p>
                                </div>
                            </div>
                        `;
                    });

                    const prevBtn = listContainer.previousElementSibling; 
                    const nextBtn = listContainer.nextElementSibling;     

                    if (prevBtn && nextBtn) {
                        const getScrollAmount = () => {
                            const firstItem = listContainer.querySelector('.course-link');
                            return firstItem ? firstItem.offsetWidth + 16 : 300; 
                        };

                        prevBtn.onclick = () => listContainer.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
                        nextBtn.onclick = () => listContainer.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
                    }
                }

                let gridView = rightPane.querySelector('#course-grid-view');
                if (!gridView) {
                    gridView = document.createElement('div');
                    gridView.id = 'course-grid-view';
                    gridView.className = 'w-full h-full transition-opacity duration-300';
                    while (rightPane.firstChild) {
                        gridView.appendChild(rightPane.firstChild);
                    }
                    rightPane.appendChild(gridView);
                }

                let detailView = rightPane.querySelector('#course-detail-view');
                if (!detailView) {
                    detailView = document.createElement('div');
                    detailView.id = 'course-detail-view';
                    detailView.className = 'w-full h-full hidden transition-opacity duration-300';
                    rightPane.appendChild(detailView);
                }

                const links = gridView.querySelectorAll('.course-link');
                links.forEach(link => {
                    const newLink = link.cloneNode(true);
                    link.parentNode.replaceChild(newLink, link);

                    newLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        if (!window.isUserLoggedIn) {
                            document.getElementById('login-form-container')?.classList.remove('hidden');
                            document.getElementById('register-form-container')?.classList.add('hidden');
                            document.getElementById('auth-modal')?.classList.remove('hidden');
                            return; 
                        }

                        const mainContainer = document.querySelector('.main-container');
                        if (mainContainer && !mainContainer.dataset.initialHeight) {
                            mainContainer.dataset.initialHeight = mainContainer.offsetHeight;
                            mainContainer.style.height = `${mainContainer.offsetHeight * 2.5}px`; 
                        }

                        const courseId = newLink.getAttribute('data-course-index');
                        const course = courses.find(c => c.id == courseId);
                        if (!course) return;

                        let detailsHtml = '<div class="w-full flex flex-wrap -mx-2 items-stretch">';
                        const targetDetails = window.currentLang === 'th' ? course.details_th : course.details;
                        
                        if(targetDetails) {
                            try {
                                let detailsArray = typeof targetDetails === 'string' ? JSON.parse(targetDetails) : targetDetails;
                                if(Array.isArray(detailsArray)) {
                                    detailsArray.forEach(item => {
                                        let widthClass = 'w-full'; 
                                        if (item.layout === 'col-2') widthClass = 'w-1/2'; 
                                        else if (item.layout === 'col-3') widthClass = 'w-1/3'; 
                                        else if (item.layout === 'col-4') widthClass = 'w-1/4';

                                        detailsHtml += `<div class="${widthClass} px-2 mb-6 flex flex-col justify-start">`;

                                        if (item.type === 'text') {
                                            detailsHtml += `<div class="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-[#050505] font-medium leading-relaxed w-full break-words">${item.value.replace(/\n/g, '<br>')}</div>`;
                                        } else if (item.type === 'image') {
                                            detailsHtml += `<img src="${item.value}" class="w-full h-auto object-cover rounded-2xl shadow-sm border border-gray-200">`;
                                        } else if (item.type === 'video') {
                                            let vidSrc = item.value;
                                            if(vidSrc.includes('youtube.com/watch?v=')) vidSrc = vidSrc.replace('watch?v=', 'embed/');
                                            else if(vidSrc.includes('youtu.be/')) vidSrc = vidSrc.replace('youtu.be/', 'youtube.com/embed/');
                                            detailsHtml += `<iframe src="${vidSrc}" class="w-full aspect-video rounded-2xl shadow-sm" frameborder="0" allowfullscreen></iframe>`;
                                        }
                                        
                                        detailsHtml += `</div>`; 
                                    });
                                }
                            } catch(e) {}
                        }
                        detailsHtml += '</div>';

                        const imgUrl = course.banner_image || 'https://placehold.co/1200x400/10a349/fff?text=Course+Banner';
                        const title = (window.currentLang === 'th' && course.title_th) ? course.title_th : (course.title || 'Untitled Course');
                        const creator = (window.currentLang === 'th' && course.creator_th) ? course.creator_th : (course.creator || 'Unknown');

                        detailView.innerHTML = `
                            <div class="w-full h-full overflow-y-auto hide-scrollbar bg-white text-[#050505] rounded-2xl relative shadow-2xl transition-opacity duration-500 opacity-0" id="course-detail-inner"> 
                                <button id="course-back-btn" class="absolute top-4 left-4 md:top-6 md:left-6 z-50 bg-black/60 hover:bg-black text-white px-5 py-2.5 rounded-full font-bold flex items-center gap-2 transition-colors shadow-lg border border-white/20 backdrop-blur-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                    Go Back
                                </button>
                                <div class="w-full h-[30vh] md:h-[40vh] min-h-[300px] overflow-hidden rounded-t-2xl relative bg-black">
                                    <img src="${imgUrl}" class="absolute inset-0 w-full h-full object-cover object-center opacity-80">
                                </div>
                                <main class="p-6 md:p-10 lg:p-12 pb-32 max-w-5xl mx-auto">
                                    <div id="course-detail-content-area">
                                        <div class="flex flex-col gap-4 content-visible">
                                            <div class="mb-4 mt-4">
                                                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-header font-bold text-[#050505] mb-4 tracking-tight leading-tight">${title}</h1>
                                                ${creator !== 'Unknown' ? `<p class="text-gray-600 font-medium mb-4 text-base sm:text-lg">เรียบเรียงโดย: ${creator}</p>` : ''}
                                                <hr class="border-gray-300 border-t-2 my-6 w-full">
                                            </div>
                                            <div class="w-full">${detailsHtml}</div>
                                        </div>
                                    </div>
                                </main>
                            </div>
                        `;

                        gridView.classList.add('hidden');
                        detailView.classList.remove('hidden');
                        
                        setTimeout(() => {
                            const innerDetail = document.getElementById('course-detail-inner');
                            if(innerDetail) innerDetail.classList.remove('opacity-0');
                        }, 50);

                        const leftPane = mainContainer.querySelector('.md\\:col-span-1');
                        if (leftPane) leftPane.classList.add('hidden');
                        if (rightPane) {
                            rightPane.classList.remove('md:col-span-3');
                            rightPane.classList.add('md:col-span-4');
                        }

                        detailView.querySelector('#course-back-btn').addEventListener('click', (e2) => {
                            e2.preventDefault();
                            e2.stopPropagation();
                            
                            if (mainContainer && mainContainer.dataset.initialHeight) {
                                mainContainer.style.height = `${mainContainer.dataset.initialHeight}px`;
                                delete mainContainer.dataset.initialHeight;
                            }

                            const innerDetail = document.getElementById('course-detail-inner');
                            if(innerDetail) innerDetail.classList.add('opacity-0');

                            setTimeout(() => {
                                detailView.classList.add('hidden');
                                gridView.classList.remove('hidden');
                                detailView.innerHTML = ''; 
                                
                                if (leftPane) leftPane.classList.remove('hidden');
                                if (rightPane) {
                                    rightPane.classList.remove('md:col-span-4');
                                    rightPane.classList.add('md:col-span-3');
                                }
                            }, 300);
                        });
                    });
                });
            } catch (error) { console.error('Error fetching courses:', error); }
        }
    }

    // --------------------------------------------------
    // C. ส่วนของ CMSJ Bigband (ระบบ Page Builder)
    // --------------------------------------------------
    const isBigband = container.querySelector('#dyn-bigband_main_title');
    if (isBigband) {
        const gridView = container.querySelector('#bigband-grid-view');
        const detailView = container.querySelector('#bigband-detail-view');
        const bigbandLink = container.querySelector('.bigband-link');
        const bigbandImg = container.querySelector('#dyn-bigband_img1');

        if (gridView && detailView && bigbandLink) {
            try {
                const response = await fetch('backend.php?action=get_cmbigband&t=' + new Date().getTime());
                const result = await response.json();
                
                if (result.status === 'success' && result.data) {
                    const bbData = result.data;
                    
                    if (bbData.banner_image && bigbandImg) {
                        bigbandImg.src = bbData.banner_image;
                    }

                    const newLink = bigbandLink.cloneNode(true);
                    bigbandLink.parentNode.replaceChild(newLink, bigbandLink);

                    newLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        let detailsHtml = '<div class="w-full flex flex-wrap -mx-2 items-stretch">';
                        const targetDetails = window.currentLang === 'th' ? bbData.details_th : bbData.details;
                        
                        if (targetDetails) {
                            try {
                                let detailsArray = typeof targetDetails === 'string' ? JSON.parse(targetDetails) : targetDetails;
                                if (Array.isArray(detailsArray)) {
                                    detailsArray.forEach(item => {
                                        let widthClass = 'w-full'; 
                                        if (item.layout === 'col-2') widthClass = 'w-1/2'; 
                                        else if (item.layout === 'col-3') widthClass = 'w-1/3'; 
                                        else if (item.layout === 'col-4') widthClass = 'w-1/4';

                                        detailsHtml += `<div class="${widthClass} px-2 mb-6 flex flex-col justify-start">`;
                                        if (item.type === 'text') {
                                            detailsHtml += `<div class="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-[#050505] font-medium leading-relaxed w-full break-words">${item.value.replace(/\n/g, '<br>')}</div>`;
                                        } else if (item.type === 'image') {
                                            detailsHtml += `<img src="${item.value}" class="w-full h-auto object-cover rounded-2xl shadow-sm border border-gray-200">`;
                                        } else if (item.type === 'video') {
                                            let vidSrc = item.value;
                                            if(vidSrc.includes('youtube.com/watch?v=')) vidSrc = vidSrc.replace('watch?v=', 'embed/');
                                            else if(vidSrc.includes('youtu.be/')) vidSrc = vidSrc.replace('youtu.be/', 'youtube.com/embed/');
                                            detailsHtml += `<iframe src="${vidSrc}" class="w-full aspect-video rounded-2xl shadow-sm" frameborder="0" allowfullscreen></iframe>`;
                                        }
                                        detailsHtml += `</div>`; 
                                    });
                                }
                            } catch(e) {}
                        }
                        detailsHtml += '</div>';

                        const title = (window.currentLang === 'th' && bbData.title_th) ? bbData.title_th : (bbData.title || 'CMSJ Bigband');
                        const genre = (window.currentLang === 'th' && bbData.genre_th) ? bbData.genre_th : (bbData.genre || '');
                        const bannerImgUrl = bbData.banner_image || 'https://placehold.co/1200x400/333/ccc?text=Bigband';

                        detailView.innerHTML = `
                            <div class="w-full h-full overflow-y-auto hide-scrollbar bg-white text-[#050505] rounded-2xl relative shadow-2xl transition-opacity duration-500 opacity-0" id="bigband-detail-inner"> 
                                <button id="bb-back-btn" class="absolute top-4 left-4 md:top-6 md:left-6 z-50 bg-black/60 hover:bg-black text-white px-5 py-2.5 rounded-full font-bold flex items-center gap-2 transition-colors shadow-lg border border-white/20 backdrop-blur-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                    Go Back
                                </button>
                                <div class="w-full h-[30vh] md:h-[40vh] min-h-[300px] overflow-hidden rounded-t-2xl relative bg-black">
                                    <img src="${bannerImgUrl}" class="absolute inset-0 w-full h-full object-cover object-center opacity-80">
                                </div>
                                <main class="p-6 md:p-10 lg:p-12 pb-32 max-w-5xl mx-auto">
                                    <div class="flex flex-col gap-4 content-visible">
                                        <div class="mb-4 mt-4">
                                            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-header font-bold text-[#050505] mb-4 tracking-tight leading-tight break-words">${title}</h1>
                                            ${genre ? `<p class="text-gray-600 font-medium mb-4 text-base sm:text-lg break-words">${genre}</p>` : ''}
                                            <hr class="border-gray-300 border-t-2 my-6 w-full">
                                        </div>
                                        <div class="w-full">${detailsHtml}</div>
                                    </div>
                                </main>
                            </div>
                        `;

                        gridView.classList.add('hidden');
                        detailView.classList.remove('hidden');
                        
                        setTimeout(() => {
                            const innerDetail = document.getElementById('bigband-detail-inner');
                            if(innerDetail) innerDetail.classList.remove('opacity-0');
                        }, 50);

                        const leftPane = mainContainer.querySelector('.md\\:col-span-1');
                        if (leftPane) leftPane.classList.add('hidden');
                        const rightPane = container.querySelector('.clone-main-content').parentElement;
                        if (rightPane && rightPane.classList.contains('md:col-span-3')) {
                            rightPane.classList.remove('md:col-span-3');
                            rightPane.classList.add('md:col-span-4');
                        }

                        detailView.querySelector('#bb-back-btn').addEventListener('click', (e2) => {
                            e2.preventDefault();
                            e2.stopPropagation();
                            
                            if (mainContainer && mainContainer.dataset.initialHeight) {
                                mainContainer.style.height = `${mainContainer.dataset.initialHeight}px`;
                                delete mainContainer.dataset.initialHeight;
                            }

                            const innerDetail = document.getElementById('bigband-detail-inner');
                            if(innerDetail) innerDetail.classList.add('opacity-0');

                            setTimeout(() => {
                                detailView.classList.add('hidden');
                                gridView.classList.remove('hidden');
                                detailView.innerHTML = ''; 
                                
                                if (leftPane) leftPane.classList.remove('hidden');
                                if (rightPane && rightPane.classList.contains('md:col-span-4')) {
                                    rightPane.classList.remove('md:col-span-4');
                                    rightPane.classList.add('md:col-span-3');
                                }
                            }, 300);
                        });
                    });
                }
            } catch (error) {}
        }
    }
};

// ==========================================
// 5. ระบบ Authentication (Login / Register) Frontend
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    const authModal = document.getElementById('auth-modal');
    const authBackdrop = document.getElementById('auth-backdrop');
    const closeAuthBtn = document.getElementById('close-auth-btn');
    const loginContainer = document.getElementById('login-form-container');
    const registerContainer = document.getElementById('register-form-container');
    const showRegisterBtn = document.getElementById('show-register-btn');
    const showLoginBtn = document.getElementById('show-login-btn');
    const headerAuthBtn = document.getElementById('header-auth-btn'); 

    // 1. เช็คสถานะการล็อกอินตอนเปิดเว็บ
    try {
        const res = await fetch('backend.php?action=check_auth');
        const result = await res.json();
        if (result.status === 'success' && result.logged_in) {
            window.isUserLoggedIn = true;
            if(headerAuthBtn) {
                headerAuthBtn.textContent = 'Log out';
                headerAuthBtn.classList.add('text-red-500');
            }
        } else {
            window.isUserLoggedIn = false;
        }
    } catch(e) {}

    // 2. การควบคุมการเปิดปิด Modal
    const closeAuthModal = () => { if(authModal) authModal.classList.add('hidden'); };
    if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeAuthModal);
    if (authBackdrop) authBackdrop.addEventListener('click', closeAuthModal);
    if (showRegisterBtn) showRegisterBtn.addEventListener('click', () => { loginContainer.classList.add('hidden'); registerContainer.classList.remove('hidden'); });
    if (showLoginBtn) showLoginBtn.addEventListener('click', () => { registerContainer.classList.add('hidden'); loginContainer.classList.remove('hidden'); });

    // 3. กดปุ่ม Login มุมขวาบน
    if(headerAuthBtn) {
        headerAuthBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (window.isUserLoggedIn) {
                await fetch('backend.php?action=logout');
                window.isUserLoggedIn = false;
                window.location.reload(); 
            } else {
                if(loginContainer) loginContainer.classList.remove('hidden');
                if(registerContainer) registerContainer.classList.add('hidden');
                if(authModal) authModal.classList.remove('hidden');
            }
        });
    }

    // 4. ส่งฟอร์ม Login
    const loginForm = document.getElementById('front-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const errorMsg = document.getElementById('login-error');
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            
            errorMsg.classList.add('hidden');
            submitBtn.textContent = 'Logging in...'; 
            submitBtn.disabled = true;
            
            const formData = new FormData();
            formData.append('username', document.getElementById('login-username').value);
            formData.append('password', document.getElementById('login-password').value);

            try {
                const res = await fetch('backend.php?action=login', { method: 'POST', body: formData });
                const result = await res.json();
                
                if (result.status === 'success') {
                    if (result.role === 'admin') {
                        window.location.href = 'admin.php'; 
                    } else {
                        window.isUserLoggedIn = true;
                        if(headerAuthBtn) {
                            headerAuthBtn.textContent = 'Log out';
                            headerAuthBtn.classList.add('text-red-500');
                        }
                        closeAuthModal();
                    }
                } else {
                    errorMsg.textContent = result.message;
                    errorMsg.classList.remove('hidden');
                }
            } catch(err) {
                errorMsg.textContent = "Cannot connect to server.";
                errorMsg.classList.remove('hidden');
            } finally {
                submitBtn.textContent = 'Log In';
                submitBtn.disabled = false;
            }
        });
    }

    // 5. ส่งฟอร์ม Register
    const regForm = document.getElementById('front-register-form');
    if (regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const msgEl = document.getElementById('reg-msg');
            const submitBtn = regForm.querySelector('button[type="submit"]');
            
            msgEl.classList.remove('hidden', 'text-red-500', 'text-green-500');
            submitBtn.textContent = 'Signing up...';
            submitBtn.disabled = true;
            
            const formData = new FormData();
            formData.append('username', document.getElementById('reg-username').value);
            formData.append('email', document.getElementById('reg-email').value);
            formData.append('password', document.getElementById('reg-password').value);

            try {
                const res = await fetch('backend.php?action=register', { method: 'POST', body: formData });
                const result = await res.json();
                
                if (result.status === 'success') {
                    msgEl.textContent = "Registration successful! Please wait for admin approval.";
                    msgEl.classList.add('text-green-500');
                    regForm.reset();
                    setTimeout(() => showLoginBtn.click(), 2000);
                } else {
                    msgEl.textContent = result.message;
                    msgEl.classList.add('text-red-500');
                }
            } catch(err) {
                msgEl.textContent = "Cannot connect to server.";
                msgEl.classList.add('text-red-500');
            } finally {
                submitBtn.textContent = 'Sign Up';
                submitBtn.disabled = false;
            }
        });
    }
});

// ==========================================
// 6. ระบบเชื่อมโยงเมนูลิงก์ (Navigation Triggers)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const navTriggers = document.querySelectorAll('.nav-trigger');
    const closeMenuBtn = document.getElementById('close-menu-btn');

    navTriggers.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-trigger');
            
            // 1. ปิดเมนูมือถือ (ถ้าเปิดอยู่)
            if (closeMenuBtn && !document.getElementById('mobile-menu-container').classList.contains('hidden')) {
                closeMenuBtn.click();
            }
            
            // 2. ถ้ามีการเปิดหน้าการ์ดอื่นค้างไว้ ให้จำลองการกดปุ่มปิดก่อน (✕)
            const activeCloseBtn = document.querySelector('.close-btn');
            if (activeCloseBtn) {
                activeCloseBtn.click();
            }
            
            // 3. ค้นหากล่องการ์ดที่ตรงกับลิงก์
            const targetCard = document.querySelector(`.card[data-target="${targetId}"]`);
            
            if (targetCard) {
                // เลื่อนหน้าจอกลับไปด้านบนสุด
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                // หน่วงเวลาเล็กน้อยให้เมนูหรือการ์ดเก่าปิดเสร็จก่อน แล้วค่อยสั่งคลิกการ์ดใหม่
                setTimeout(() => {
                    targetCard.click(); // สั่งให้จำลองการคลิกการ์ด (ระบบจะเช็ค Login ให้อัตโนมัติ)
                }, 300);
            }
        });
    });
});