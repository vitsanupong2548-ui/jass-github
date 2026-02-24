const mainContainer = document.querySelector('.main-container');
const cards = document.querySelectorAll('.card:not(.clone)');
let activeCard = null;
let activeClone = null;
let allCards = Array.from(cards);

if (mainContainer) {
    mainContainer.addEventListener('click', function(e) {
        if (!activeCard) {
            const clickedCard = e.target.closest('.card:not(.clone)');
            if (clickedCard) { if (e.target.closest('a')) return; expandCard(clickedCard); }
            return; 
        }
        if (activeClone) {
            const link = e.target.closest('.event-link, .course-link, .forum-link, .store-link, .bigband-link');
            if (link && activeClone.contains(link)) return; 
            if (!activeClone.contains(e.target)) collapseCard(activeClone, activeCard); 
        }
    });
}

function createButtons(card) {
    const closeBtn = document.createElement('button'); closeBtn.innerHTML = '&times;'; closeBtn.className = 'close-btn';
    closeBtn.addEventListener('click', (e) => { e.stopPropagation(); collapseCard(activeClone, activeCard); });
    const navLeft = document.createElement('button'); navLeft.innerHTML = '&#8592;'; navLeft.className = 'nav-btn nav-btn-left';
    navLeft.addEventListener('click', (e) => { e.stopPropagation(); navigate('prev'); });
    const navRight = document.createElement('button'); navRight.innerHTML = '&#8594;'; navRight.className = 'nav-btn nav-btn-right';
    navRight.addEventListener('click', (e) => { e.stopPropagation(); navigate('next'); });
    
    if (card.classList.contains('card-yellow') || card.classList.contains('card-gray') || card.classList.contains('card-pink')) {
         [closeBtn, navLeft, navRight].forEach(btn => { btn.style.color = '#121212'; btn.style.borderColor = '#121212'; });
    }
    return [closeBtn, navLeft, navRight];
}

function expandCard(card) {
    activeCard = card; const cardRect = card.getBoundingClientRect(); const containerRect = mainContainer.getBoundingClientRect();
    const targetId = card.dataset.target; const contentSource = document.querySelector(targetId);
    if (!contentSource) return; 

    activeClone = document.createElement('div'); activeClone.className = card.className + ' clone'; activeClone.innerHTML = contentSource.innerHTML;
    createButtons(card).forEach(btn => activeClone.appendChild(btn));
    activeClone.style.top = `${cardRect.top - containerRect.top}px`; activeClone.style.left = `${cardRect.left - containerRect.left}px`;
    activeClone.style.width = `${cardRect.width}px`; activeClone.style.height = `${cardRect.height}px`;
    mainContainer.appendChild(activeClone); card.classList.add('ghost');
    
    const onExpansionEnd = (e) => {
        if (e.target === activeClone && e.propertyName === 'width') {
            activeClone.classList.add('is-expanded'); 
            requestAnimationFrame(() => activeClone.querySelector('.clone-content')?.classList.add('content-visible'));
            addEventDetailListeners(activeClone); activeClone.removeEventListener('transitionend', onExpansionEnd);
            
            // ดึงข้อมูลตอนการ์ดขยายเสร็จ
            if (window.applyDataToDOM) window.applyDataToDOM(activeClone);
        }
    };
    activeClone.addEventListener('transitionend', onExpansionEnd);
    requestAnimationFrame(() => { activeClone.style.top = '0px'; activeClone.style.left = '0px'; activeClone.style.width = '100%'; activeClone.style.height = '100%'; });
}

function collapseCard(clone, originalCard) {
    if (!clone || !originalCard) return;
    if (mainContainer.dataset.initialHeight) { 
        mainContainer.style.height = `${mainContainer.dataset.initialHeight}px`; 
        delete mainContainer.dataset.initialHeight; 
    }
    
    clone.style.backgroundColor = '';
    clone.style.padding = '';

    clone.classList.remove('is-expanded'); 
    clone.querySelector('.clone-content, .event-detail-content, .bigband-detail-content, .artist-detail-content, .course-detail-content, .forum-detail-content, .store-detail-content')?.classList.remove('content-visible');
    
    const onCollapseEnd = (e) => {
        if (e.target === clone && e.propertyName === 'width') {
            if (clone.parentElement) clone.remove();
            if(originalCard) originalCard.classList.remove('ghost'); 
            activeCard = null; activeClone = null; clone.removeEventListener('transitionend', onCollapseEnd);
        }
    };
    clone.addEventListener('transitionend', onCollapseEnd);
    
    const cardRect = originalCard.getBoundingClientRect(); 
    const containerRect = mainContainer.getBoundingClientRect();
    if (cardRect && containerRect) {
        clone.style.top = `${cardRect.top - containerRect.top}px`; 
        clone.style.left = `${cardRect.left - containerRect.left}px`;
        clone.style.width = `${cardRect.width}px`; 
        clone.style.height = `${cardRect.height}px`;
    }
}

function navigate(direction) {
    if (!activeCard) return;
    if (mainContainer.dataset.initialHeight) { mainContainer.style.height = `${mainContainer.dataset.initialHeight}px`; delete mainContainer.dataset.initialHeight; }
    const currentIndex = allCards.indexOf(activeCard);
    let nextIndex = direction === 'next' ? (currentIndex + 1) % allCards.length : (currentIndex - 1 + allCards.length) % allCards.length;
    const nextCard = allCards[nextIndex];
    activeClone.classList.remove('is-expanded'); activeClone.querySelector('.content-visible')?.classList.remove('content-visible');
    
    setTimeout(() => { 
        const nextContentSource = document.querySelector(nextCard.dataset.target); if (!nextContentSource) return;
        activeClone.className = nextCard.className + ' clone is-expanded'; activeClone.innerHTML = nextContentSource.innerHTML; 
        requestAnimationFrame(() => activeClone.querySelector('.clone-content')?.classList.add('content-visible'));
        createButtons(nextCard).forEach(btn => activeClone.appendChild(btn));
        activeCard.classList.remove('ghost'); nextCard.classList.add('ghost'); activeCard = nextCard;
        addEventDetailListeners(activeClone);
        
        if (window.applyDataToDOM) window.applyDataToDOM(activeClone);
    }, 300); 
}

function showMainCategoryContent() {
    if (!activeClone || !activeCard) return; 
    activeClone.querySelector('.content-visible')?.classList.remove('content-visible');
    const targetId = activeCard.getAttribute('data-target').substring(1); const mainContent = document.getElementById(targetId);
    setTimeout(() => {
        activeClone.style.backgroundColor = ''; activeClone.style.padding = ''; activeClone.innerHTML = mainContent.innerHTML;
        requestAnimationFrame(() => activeClone.querySelector('.clone-content')?.classList.add('content-visible'));
        createButtons(activeCard).forEach(btn => activeClone.appendChild(btn));
        addEventDetailListeners(activeClone);
        
        if (window.applyDataToDOM) window.applyDataToDOM(activeClone);
    }, 300);
}

// ----------------------------------------------------------------------
// ระบบเจาะดูข้อมูล (Detail) สำหรับหน้าต่างๆ 
// ----------------------------------------------------------------------

function loadTemplateWithSuffix(templateId, suffix, isWhiteBg = false) {
    const template = document.getElementById(templateId);
    if (!activeClone || !template) return;
    activeClone.querySelector('.content-visible')?.classList.remove('content-visible');
    
    setTimeout(() => {
        activeClone.style.backgroundColor = 'transparent'; activeClone.style.padding = '0';
        const tempDiv = document.createElement('div'); tempDiv.innerHTML = template.innerHTML;
        
        tempDiv.querySelectorAll('[id^="dyn-"]').forEach(el => {
            if(!el.id.endsWith(suffix)) el.id += suffix;
        });
        activeClone.innerHTML = tempDiv.innerHTML; 
        
        requestAnimationFrame(() => { 
            let contentDiv = activeClone.querySelector(`.${templateId.replace('-template', '-content')}`);
            if (!contentDiv) contentDiv = activeClone.querySelector('.clone-content');
            if (!contentDiv && activeClone.firstElementChild) contentDiv = activeClone.firstElementChild;
            if (contentDiv) contentDiv.classList.add('content-visible'); 
        });
        
        const backButton = document.createElement('button'); backButton.innerHTML = '&#8592;'; backButton.className = 'nav-btn nav-btn-left'; backButton.style.left = '20px';
        if (isWhiteBg) { backButton.style.color = '#121212'; backButton.style.borderColor = '#121212'; }
        backButton.addEventListener('click', (e) => { e.stopPropagation(); if (mainContainer.dataset.initialHeight) { mainContainer.style.height = `${mainContainer.dataset.initialHeight}px`; delete mainContainer.dataset.initialHeight; } showMainCategoryContent(); });
        
        const closeBtn = document.createElement('button'); closeBtn.innerHTML = '&times;'; closeBtn.className = 'close-btn'; closeBtn.style.top = '20px'; closeBtn.style.right = '20px';
        closeBtn.addEventListener('click', (e) => { e.stopPropagation(); collapseCard(activeClone, activeCard); });
        
        activeClone.appendChild(backButton); activeClone.appendChild(closeBtn);
        
        addEventDetailListeners(activeClone);

        if(window.applyDataToDOM) window.applyDataToDOM(activeClone);
    }, 300);
}

// โค้ดแสดงหน้ารายละเอียดของศิลปิน (ดีไซน์ใหม่ ตามแบบรูปภาพ 100%)
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
                // 1. จัดเตรียมข้อมูลพื้นฐาน
                const bannerImg = musician.banner_image || 'https://placehold.co/1200x400/333/ccc?text=No+Banner';
                const profileImg = musician.profile_image || 'https://placehold.co/600x800/222/ddd?text=No+Profile';
                const title = musician.title || 'Untitled';
                const genre = musician.genre ? `<p class="italic text-gray-700 font-medium mb-3">${musician.genre}</p>` : '';
                
                // 2. จัดเตรียมไอคอนโซเชียล (แบบกลมๆ เรียงติดกันตามรูป)
                let socialsHTML = '';
                if(musician.facebook) socialsHTML += `<a href="${musician.facebook}" target="_blank" class="text-[#1877F2] hover:opacity-80 transition"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>`;
                if(musician.tiktok) socialsHTML += `<a href="${musician.tiktok}" target="_blank" class="text-black hover:opacity-80 transition"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z"/></svg></a>`;
                if(musician.instagram) socialsHTML += `<a href="${musician.instagram}" target="_blank" class="text-[#E1306C] hover:opacity-80 transition"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>`;
                if(musician.email) socialsHTML += `<a href="mailto:${musician.email}" class="text-[#EA4335] hover:opacity-80 transition"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></a>`;
                if(musician.website) socialsHTML += `<a href="${musician.website}" target="_blank" class="text-gray-600 hover:opacity-80 transition"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg></a>`;

                // 3. จัดการ Contact และ Details
                let contactLine = '';
                if (musician.whatsapp) contactLine = `Contact : ${musician.whatsapp}`;
                else if (musician.email) contactLine = `Contact : ${musician.email}`;

                const detailsHtml = musician.details ? musician.details.replace(/\n/g, '<br>') : '';

                // 4. จัดการ Video Link (โหลด Youtube ให้อัตโนมัติแบบในรูป)
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

                // 5. ปั้น HTML โครงสร้างใหม่ทั้งหมดให้เหมือนรูปภาพ
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

                                    <div class="md:col-span-7 lg:col-span-8">
                                    <h1 class="text-4xl md:text-5xl font-extrabold text-black tracking-tight mb-1 break-words w-full whitespace-normal">${title}</h1>
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

        // ปุ่มย้อนกลับและปิด
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
function showEventDetailContent(eventIndex) {
    const template = document.getElementById('event-detail-template');
    if (!activeClone || !template) return;
    activeClone.querySelector('.content-visible')?.classList.remove('content-visible');
    
    setTimeout(() => {
        const tempDiv = document.createElement('div'); tempDiv.innerHTML = template.innerHTML;
        const suffix = `_event${eventIndex}`;
        tempDiv.querySelectorAll('[id^="dyn-"]').forEach(el => { if(!el.id.endsWith(suffix)) el.id += suffix; });
        activeClone.innerHTML = tempDiv.innerHTML; 
        
        // --- ดึงรูป Banner มาใส่หน้า Detail ---
        if (window.frontendEvents) {
            const eventData = window.frontendEvents.find(e => e.id == eventIndex);
            if (eventData && eventData.banner_image) {
                const bannerImg = activeClone.querySelector('img[id^="dyn-festival_banner"]');
                if(bannerImg) bannerImg.src = eventData.banner_image;
            }
        }
        
        const contentArea = activeClone.querySelector('#event-detail-content-area'); 
        let sourceContent = document.getElementById('event-detail-content-' + eventIndex) || document.getElementById('default-detail-content'); 
        
        if (contentArea && sourceContent) { 
            const tabDiv = document.createElement('div'); tabDiv.innerHTML = sourceContent.innerHTML;
            tabDiv.querySelectorAll('[id^="dyn-"]').forEach(el => { if(!el.id.endsWith(suffix)) el.id += suffix; });
            contentArea.innerHTML = tabDiv.innerHTML; 
        }

        requestAnimationFrame(() => { activeClone.querySelector('.event-detail-content')?.classList.add('content-visible'); contentArea.querySelector(':first-child')?.classList.add('content-visible'); });
        
        const backButton = document.createElement('button'); backButton.innerHTML = '&#8592;'; backButton.className = 'nav-btn nav-btn-left';
        backButton.addEventListener('click', (e) => { e.stopPropagation(); if (mainContainer.dataset.initialHeight) { mainContainer.style.height = `${mainContainer.dataset.initialHeight}px`; delete mainContainer.dataset.initialHeight; } showMainCategoryContent(); });
        const closeBtn = document.createElement('button'); closeBtn.innerHTML = '&times;'; closeBtn.className = 'close-btn';
        closeBtn.addEventListener('click', (e) => { e.stopPropagation(); collapseCard(activeClone, activeCard); });
        activeClone.appendChild(backButton); activeClone.appendChild(closeBtn);
        
        setupInnerTabs(activeClone, 'event-detail-content-area', eventIndex);
        if(window.applyDataToDOM) window.applyDataToDOM(activeClone);
    }, 300);
}

window.showForumDetailContent = function(index) { loadTemplateWithSuffix('forum-detail-template', `_forum${index}`); }
window.showStoreDetailContent = function(index) { loadTemplateWithSuffix('store-detail-template', `_store${index}`, true); }

window.showCourseDetailContent = function(courseIndex) {
    const template = document.getElementById('course-detail-template');
    if (!activeClone || !template) return;
    activeClone.querySelector('.content-visible')?.classList.remove('content-visible');
    
    setTimeout(() => {
        activeClone.style.backgroundColor = 'transparent'; activeClone.style.padding = '0';
        const tempDiv = document.createElement('div'); tempDiv.innerHTML = template.innerHTML;
        const suffix = `_course${courseIndex}`;
        tempDiv.querySelectorAll('[id^="dyn-"]').forEach(el => { if(!el.id.endsWith(suffix)) el.id += suffix; });
        activeClone.innerHTML = tempDiv.innerHTML; 
        
        const contentArea = activeClone.querySelector('#course-detail-content-area'); 
        let sourceContent = document.getElementById('course-detail-content-' + courseIndex) || document.getElementById('default-course-content'); 
        
        if (contentArea && sourceContent) { 
            const tabDiv = document.createElement('div'); tabDiv.innerHTML = sourceContent.innerHTML;
            tabDiv.querySelectorAll('[id^="dyn-"]').forEach(el => { if(!el.id.endsWith(suffix)) el.id += suffix; });
            contentArea.innerHTML = tabDiv.innerHTML; 
        }

        requestAnimationFrame(() => { activeClone.querySelector('.course-detail-content')?.classList.add('content-visible'); contentArea.querySelector(':first-child')?.classList.add('content-visible'); });
        
        const backButton = document.createElement('button'); backButton.innerHTML = '&#8592;'; backButton.className = 'nav-btn nav-btn-left'; backButton.style.left = '20px'; backButton.style.color = '#fff'; backButton.style.borderColor = '#fff';
        backButton.addEventListener('click', (e) => { e.stopPropagation(); if (mainContainer.dataset.initialHeight) { mainContainer.style.height = `${mainContainer.dataset.initialHeight}px`; delete mainContainer.dataset.initialHeight; } showMainCategoryContent(); });
        
        const closeBtn = document.createElement('button'); closeBtn.innerHTML = '&times;'; closeBtn.className = 'close-btn'; closeBtn.style.top = '20px'; closeBtn.style.right = '20px';
        closeBtn.addEventListener('click', (e) => { e.stopPropagation(); collapseCard(activeClone, activeCard); });
        activeClone.appendChild(backButton); activeClone.appendChild(closeBtn);
        
        setupCourseTabs(activeClone, 'course-detail-content-area', courseIndex);
        if(window.applyDataToDOM) window.applyDataToDOM(activeClone);
    }, 300);
}

function setupCourseTabs(container, targetAreaId, courseIndex) {
    const buttons = container.querySelectorAll('.nav-button'); const contentArea = container.querySelector('#' + targetAreaId);
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            buttons.forEach(b => { b.classList.remove('bg-white', 'text-black'); b.classList.add('bg-transparent', 'text-white', 'hover:bg-white', 'hover:text-black'); });
            btn.classList.remove('bg-transparent', 'text-white', 'hover:bg-white', 'hover:text-black'); btn.classList.add('bg-white', 'text-black');
            
            const sectionId = btn.getAttribute('data-section'); 
            let sourceContent;
            if (sectionId === 'default') {
                sourceContent = document.getElementById('course-detail-content-' + courseIndex) || document.getElementById('default-course-content');
            } else {
                sourceContent = document.getElementById(sectionId + '-content') || document.getElementById('default-course-content');
            }
            
            if(contentArea && sourceContent) {
                contentArea.style.opacity = '0';
                setTimeout(() => {
                    const tempDiv = document.createElement('div'); tempDiv.innerHTML = sourceContent.innerHTML;
                    const suffix = `_course${courseIndex}`;
                    tempDiv.querySelectorAll('[id^="dyn-"]').forEach(el => { if(!el.id.endsWith(suffix)) el.id += suffix; });
                    contentArea.innerHTML = tempDiv.innerHTML; 
                    contentArea.style.opacity = '1';
                    if(window.applyDataToDOM) window.applyDataToDOM(contentArea);
                }, 200);
            }
        });
    });
}

window.showBigbandDetailContent = function() {
    const template = document.getElementById('bigband-detail-template');
    if (!activeClone || !template) return;
    activeClone.querySelector('.content-visible')?.classList.remove('content-visible');
    
    setTimeout(() => {
        activeClone.style.backgroundColor = 'transparent'; activeClone.style.padding = '0';
        const tempDiv = document.createElement('div'); 
        tempDiv.innerHTML = template.innerHTML;
        activeClone.innerHTML = tempDiv.innerHTML; 
        
        const contentArea = activeClone.querySelector('#bigband-detail-content-area'); 
        const defaultContent = document.getElementById('bb-about-content'); 
        if (contentArea && defaultContent) { 
            contentArea.innerHTML = defaultContent.innerHTML; 
        }

        requestAnimationFrame(() => { 
            activeClone.querySelector('.bigband-detail-content')?.classList.add('content-visible'); 
        });
        
        const backButton = document.createElement('button'); backButton.innerHTML = '&#8592;'; backButton.className = 'nav-btn nav-btn-left'; backButton.style.left = '20px'; backButton.style.color = '#121212'; backButton.style.borderColor = '#121212';
        backButton.addEventListener('click', (e) => { e.stopPropagation(); if (mainContainer.dataset.initialHeight) { mainContainer.style.height = `${mainContainer.dataset.initialHeight}px`; delete mainContainer.dataset.initialHeight; } showMainCategoryContent(); });
        
        const closeBtn = document.createElement('button'); closeBtn.innerHTML = '&times;'; closeBtn.className = 'close-btn'; closeBtn.style.top = '20px'; closeBtn.style.right = '20px';
        closeBtn.addEventListener('click', (e) => { e.stopPropagation(); collapseCard(activeClone, activeCard); });
        
        activeClone.appendChild(backButton); activeClone.appendChild(closeBtn);
        
        setupInnerTabs(activeClone, 'bigband-detail-content-area');
        if(window.applyDataToDOM) window.applyDataToDOM(activeClone);
    }, 300);
}

function setupInnerTabs(container, targetAreaId, eventIndex = null) {
    const buttons = container.querySelectorAll('.nav-button'); const contentArea = container.querySelector('#' + targetAreaId);
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            buttons.forEach(b => { b.classList.remove('bg-black', 'text-white'); b.classList.add('bg-transparent', 'text-black', 'hover:bg-black', 'hover:text-white'); });
            btn.classList.remove('bg-transparent', 'text-black', 'hover:bg-black', 'hover:text-white'); btn.classList.add('bg-black', 'text-white');
            
            const sectionId = btn.getAttribute('data-section'); 
            
            let sourceContent;
            if (sectionId === 'default') {
                sourceContent = document.getElementById('event-detail-content-' + eventIndex) || document.getElementById('default-detail-content');
            } else {
                sourceContent = document.getElementById(sectionId + '-content-' + eventIndex) || document.getElementById(sectionId + '-content') || document.getElementById('default-detail-content');
            }
            
            if(contentArea && sourceContent) {
                contentArea.style.opacity = '0';
                setTimeout(() => {
                    const tempDiv = document.createElement('div'); tempDiv.innerHTML = sourceContent.innerHTML;
                    if (eventIndex) {
                        const suffix = `_event${eventIndex}`;
                        tempDiv.querySelectorAll('[id^="dyn-"]').forEach(el => { if(!el.id.endsWith(suffix)) el.id += suffix; });
                    }
                    contentArea.innerHTML = tempDiv.innerHTML; 
                    contentArea.style.opacity = '1';
                    if(window.applyDataToDOM) window.applyDataToDOM(contentArea);
                }, 200);
            }
        });
    });
}

function addEventDetailListeners(container) {
    const artistLibCat = container.querySelector('#category-artists-library');
    if (artistLibCat) {
        artistLibCat.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            if (!mainContainer.dataset.initialHeight) { 
                mainContainer.dataset.initialHeight = mainContainer.offsetHeight; 
                mainContainer.style.height = `${mainContainer.offsetHeight * 2.5}px`; 
            }
            loadTemplateWithSuffix('artists-library-grid-template', '_lib', true);
        });
    }

    const jazzNetCat = container.querySelector('#category-jazz-network');
    if (jazzNetCat) {
        jazzNetCat.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            if (!mainContainer.dataset.initialHeight) { 
                mainContainer.dataset.initialHeight = mainContainer.offsetHeight; 
                mainContainer.style.height = `${mainContainer.offsetHeight * 2.5}px`; 
            }
            loadTemplateWithSuffix('jazz-network-grid-template', '_net', true);
        });
    }

    container.querySelectorAll('.artist-link, .event-link, .course-link, .forum-link, .store-link, .bigband-link').forEach(link => {
        const newLink = link.cloneNode(true); 
        link.parentNode.replaceChild(newLink, link);
        
        newLink.addEventListener('click', (e) => {
            e.preventDefault(); 
            e.stopPropagation();
            
            if (!mainContainer.dataset.initialHeight) { 
                mainContainer.dataset.initialHeight = mainContainer.offsetHeight; 
                mainContainer.style.height = `${mainContainer.offsetHeight * 2.5}px`; 
            }
            
            if (newLink.classList.contains('event-link')) {
                showEventDetailContent(newLink.getAttribute('data-event-index') || '1');
            } else if (newLink.classList.contains('course-link')) {
                window.showCourseDetailContent(newLink.getAttribute('data-course-index') || '1');
            } else if (newLink.classList.contains('forum-link')) {
                window.showForumDetailContent(newLink.getAttribute('data-forum-index') || '1');
            } else if (newLink.classList.contains('store-link')) {
                window.showStoreDetailContent(newLink.getAttribute('data-store-index') || '1');
            } else if (newLink.classList.contains('bigband-link')) {
                window.showBigbandDetailContent();
            } else if (newLink.classList.contains('artist-link')) {
                const match = newLink.querySelector('img[id^="dyn-"]')?.id.match(/dyn-(artist|partner)(\d+)/);
                if(match) {
                    // ส่ง newLink ไปด้วยเพื่อใช้ดึง data-musician-id
                    showArtistDetailContent(match[1], match[2], newLink);
                }
            }
        });
    });
}

// ----------------------------------------------------------------------
// ระบบดึงข้อมูลจาก Database มาหยอดลง DOM (เฉพาะหน้า Event)
// ----------------------------------------------------------------------
window.frontendEvents = []; 

window.applyDataToDOM = async function(container) {
    const festivalContainer = container.querySelector('.clone-main-content');
    
    if (festivalContainer && container.querySelector('#dyn-fest_title1')) {
        try {
            const response = await fetch('backend.php?action=get_front_events');
            const result = await response.json();
            
            if (result.status === 'success' && result.data.length > 0) {
                festivalContainer.innerHTML = ''; 
                const events = result.data;
                window.frontendEvents = events; 
                
                const hiddenContainer = document.getElementById('hidden-card-content');
                
                events.forEach((event) => {
                    if (!event.title || event.title.trim() === '') return; 
                    
                    const startD = new Date(event.start_date);
                    const endStr = event.end_date && event.end_date !== '0000-00-00 00:00:00' ? event.end_date : event.start_date;
                    const endD = new Date(endStr);
                    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                    
                    const dateFormatted = `${String(startD.getDate()).padStart(2, '0')} ${monthNames[startD.getMonth()]} ${startD.getFullYear()}`;
                    let dateCard = '';
                    
                    if (startD.getTime() !== endD.getTime() && startD.getMonth() === endD.getMonth()) {
                        dateCard = `${String(startD.getDate()).padStart(2, '0')}-${String(endD.getDate()).padStart(2, '0')}<br>${monthNames[startD.getMonth()]}<br>${startD.getFullYear()}`;
                    } else {
                        dateCard = `${String(startD.getDate()).padStart(2, '0')}<br>${monthNames[startD.getMonth()]}<br>${startD.getFullYear()}`;
                    }

                    const imageUrl = event.banner_image ? event.banner_image : 'https://placehold.co/1200x400/1a1a1a/ffffff?text=Jazz+Event';
                    
                    // --- 1. โครงสร้างการ์ดด้านนอก ---
                    const cardHTML = `
                        <div data-event-index="${event.id}" class="event-link relative rounded-2xl overflow-hidden group cursor-pointer bg-black/40 border border-white/20 min-h-[160px] md:min-h-[180px] flex items-end p-5 lg:p-6 transition-transform duration-300 hover:scale-[1.02] mb-4">
                            <img src="${imageUrl}" class="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen group-hover:opacity-90 transition-opacity duration-300">
                            
                            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 pointer-events-none"></div>
                            
                            <div class="relative z-10 w-full flex items-end justify-between gap-4 text-white">
                                <div class="font-header text-2xl lg:text-3xl font-bold leading-none tracking-tight shrink-0 text-left">
                                    ${dateCard}
                                </div>
                                
                                <div class="flex flex-col items-end text-right flex-1 min-w-0">
                                    <div class="flex items-center justify-end gap-3 w-full mb-1">
                                        <h3 class="font-header text-xl lg:text-2xl font-bold tracking-tight leading-tight break-words text-right line-clamp-2">${event.title}</h3>
                                        <div class="w-8 h-8 border border-white/50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-colors hidden sm:flex">
                                            <span class="text-sm leading-none -mt-0.5">&#8594;</span>
                                        </div>
                                    </div>
                                    <p class="font-body text-xs sm:text-sm text-white/80 leading-relaxed break-words line-clamp-2 max-w-[90%] text-right">${event.short_description || ''}</p>
                                </div>
                            </div>
                        </div>
                    `;
                    festivalContainer.innerHTML += cardHTML;
                    
                    // --- 2. เนื้อหา Detail ด้านใน ---
                    if(hiddenContainer) {
                        const posterImg = event.poster_image ? event.poster_image : 'https://placehold.co/600x800/222/fff?text=Poster';
                        const leftCol = `
                            <div class="lg:col-span-4 flex flex-col gap-6">
                                <img src="${posterImg}" class="w-full rounded-lg shadow-md border border-gray-200">
                                <button class="flex items-center gap-2 text-lg font-bold hover:text-gray-500 transition-colors w-fit" onclick="document.querySelector('.close-btn').click()">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                    Go Back
                                </button>
                            </div>
                        `;

                        // 2.1 DETAILS
                        let detailDiv = document.getElementById('event-detail-content-' + event.id);
                        if(!detailDiv) { detailDiv = document.createElement('div'); detailDiv.id = 'event-detail-content-' + event.id; detailDiv.className = 'hidden'; hiddenContainer.appendChild(detailDiv); }
                        const detailsText = event.details ? event.details.replace(/\n/g, '<br>') : 'ไม่มีรายละเอียด...';
                        detailDiv.innerHTML = `<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">${leftCol}<div class="lg:col-span-8"><h1 class="text-3xl sm:text-4xl lg:text-5xl font-header font-bold mb-1 tracking-tight break-words">${event.title}</h1><h2 class="text-2xl sm:text-3xl lg:text-4xl font-header font-bold mb-6 tracking-tight text-gray-700">${event.location || 'Chiangmai Jazz City'}</h2><p class="text-sm sm:text-base font-medium mb-4 text-black">${dateFormatted}</p><hr class="border-gray-300 border-t-2 mb-6"><div class="prose prose-sm sm:prose-base max-w-none text-black font-medium leading-relaxed text-sm whitespace-pre-line break-words">${detailsText}</div></div></div>`;

                        // 2.2 BOOK NOW
                        let bookDiv = document.getElementById('book-now-content-' + event.id);
                        if(!bookDiv) { bookDiv = document.createElement('div'); bookDiv.id = 'book-now-content-' + event.id; bookDiv.className = 'hidden'; hiddenContainer.appendChild(bookDiv); }
                        let ticketsHTML = '';
                        if(event.tickets && event.tickets.length > 0) {
                            event.tickets.forEach(t => {
                                const formattedPrice = Number(t.price).toLocaleString('en-US');
                                ticketsHTML += `
                                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-300 pb-4 pt-2">
                                    <div class="mb-4 sm:mb-0 max-w-sm pr-4">
                                        <h3 class="text-xl font-bold text-black mb-1 break-words">${t.title}</h3>
                                        <p class="text-xs text-gray-600 font-medium leading-snug break-words whitespace-pre-line">${t.details || ''}</p>
                                    </div>
                                    <div class="flex items-center justify-between w-full sm:w-auto gap-6 shrink-0">
                                        <span class="text-xl font-bold text-black">${formattedPrice} THB</span>
                                        <div class="flex items-center border border-black rounded bg-white">
                                            <button class="w-8 h-8 flex items-center justify-center text-xl font-bold bg-black text-white hover:bg-gray-800 transition">-</button>
                                            <span class="w-10 text-center font-bold">0</span>
                                            <button class="w-8 h-8 flex items-center justify-center text-xl font-bold bg-black text-white hover:bg-gray-800 transition">+</button>
                                        </div>
                                    </div>
                                </div>`;
                            });
                            ticketsHTML += `
                            <div class="mt-6 flex flex-col gap-6">
                                <label class="flex items-start gap-3 cursor-pointer">
                                    <input type="checkbox" class="mt-1 w-4 h-4 rounded border-gray-300 text-black focus:ring-black">
                                    <span class="text-[10px] sm:text-xs text-black font-medium leading-relaxed">
                                        By checking this box, I hereby agree that my information will be shared to our Event Organizers
                                    </span>
                                </label>
                                <button class="w-full bg-black text-white font-header font-bold text-xl py-4 rounded-full tracking-wider hover:bg-gray-800 transition-colors uppercase shadow-lg">
                                    BUY TICKET
                                </button>
                            </div>`;
                        } else { 
                            ticketsHTML = '<p class="text-gray-500 font-medium mt-4">ไม่มีข้อมูลบัตรเข้าชมสำหรับงานนี้</p>'; 
                        }
                        bookDiv.innerHTML = `<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">${leftCol}<div class="lg:col-span-8 flex flex-col gap-4">${ticketsHTML}</div></div>`;

                        // 2.3 LINE UP
                        let lineDiv = document.getElementById('line-up-content-' + event.id);
                        if(!lineDiv) { lineDiv = document.createElement('div'); lineDiv.id = 'line-up-content-' + event.id; lineDiv.className = 'hidden'; hiddenContainer.appendChild(lineDiv); }
                        
                        let lineupHTML = '';
                        if(event.lineups && event.lineups.length > 0) {
                            const groupedByDate = {};
                            event.lineups.forEach(l => {
                                const d = l.lineup_date || 'TBA';
                                if(!groupedByDate[d]) groupedByDate[d] = [];
                                groupedByDate[d].push(l);
                            });

                            lineupHTML = '<div class="grid grid-cols-1 sm:grid-cols-2 gap-8">'; 
                            
                            for (const [dateStr, items] of Object.entries(groupedByDate)) {
                                let dateHeader = dateStr;
                                if(dateStr !== 'TBA') {
                                    const dObj = new Date(dateStr);
                                    const mNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
                                    dateHeader = `${String(dObj.getDate()).padStart(2, '0')} ${mNames[dObj.getMonth()]} ${dObj.getFullYear()}`;
                                }

                                lineupHTML += `<div><h3 class="text-2xl font-header font-bold mb-4 border-b-2 border-gray-300 pb-2 uppercase">${dateHeader}</h3>`;
                                
                                const groupedByStage = {};
                                items.forEach(l => {
                                    const s = l.lineup_stage || 'Main Stage';
                                    if(!groupedByStage[s]) groupedByStage[s] = [];
                                    groupedByStage[s].push(l);
                                });

                                for (const [stageName, stageItems] of Object.entries(groupedByStage)) {
                                    lineupHTML += `<div class="mb-6"><h4 class="font-bold text-sm mb-2 uppercase text-black tracking-wider">${stageName}</h4><ul class="text-sm text-gray-700 space-y-1">`;
                                    stageItems.forEach(item => {
                                        const timeDisplay = item.lineup_time ? item.lineup_time.substring(0,5) : '';
                                        lineupHTML += `<li><span class="font-bold mr-2">${timeDisplay}</span> ${item.band_name}</li>`;
                                    });
                                    lineupHTML += `</ul></div>`;
                                }
                                lineupHTML += `</div>`;
                            }
                            lineupHTML += '</div>';
                        } else { 
                            lineupHTML = '<div class="p-8 text-center text-gray-500">ไม่มีตารางเวลาศิลปินสำหรับงานนี้</div>'; 
                        }
                        
                        lineDiv.innerHTML = `<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">${leftCol}<div class="lg:col-span-8">${lineupHTML}</div></div>`;

                        // 2.4 VENUE
                        let venueDiv = document.getElementById('venue-content-' + event.id);
                        if(!venueDiv) { venueDiv = document.createElement('div'); venueDiv.id = 'venue-content-' + event.id; venueDiv.className = 'hidden'; hiddenContainer.appendChild(venueDiv); }
                        
                        let venueHTML = '';
                        if (event.venue_image) {
                            venueHTML += `<img src="${event.venue_image}" class="w-full aspect-[16/9] object-cover rounded-xl shadow-md border border-gray-200 mb-6">`;
                        }
                        venueHTML += `<h2 class="text-3xl sm:text-4xl font-header font-bold mb-4 text-black tracking-tight">${event.venue_title || 'Venue Location'}</h2>`;
                        if (event.venue_details) {
                            venueHTML += `<div class="prose prose-sm sm:prose-base max-w-none text-gray-700 font-medium leading-relaxed mb-6 whitespace-pre-line">${event.venue_details}</div>`;
                        }
                        if (event.venue_map) {
                            if (event.venue_map.includes('<iframe')) {
                                let mapEmbed = event.venue_map.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="450"');
                                venueHTML += `<div class="w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm">${mapEmbed}</div>`;
                            } else {
                                venueHTML += `<a href="${event.venue_map}" target="_blank" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow hover:bg-blue-700 transition">📌 Open in Google Maps</a>`;
                            }
                        }
                        venueDiv.innerHTML = `<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">${leftCol}<div class="lg:col-span-8 flex flex-col">${venueHTML}</div></div>`;

                        // 2.5 GALLERY
                        let galDiv = document.getElementById('gallery-content-' + event.id);
                        if(!galDiv) { galDiv = document.createElement('div'); galDiv.id = 'gallery-content-' + event.id; galDiv.className = 'hidden'; hiddenContainer.appendChild(galDiv); }
                        let galleryHTML = '<div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">';
                        if(event.gallery_images) {
                            try {
                                const images = JSON.parse(event.gallery_images);
                                if(images.length > 0) {
                                    images.forEach(img => { galleryHTML += `<img src="${img}" class="w-full aspect-square object-cover rounded-lg shadow-sm hover:opacity-80 transition cursor-pointer">`; });
                                } else { galleryHTML += '<p class="col-span-3 text-gray-500 font-medium">ยังไม่มีรูปภาพแกลลอรี่สำหรับงานนี้</p>'; }
                            } catch(e){ galleryHTML += '<p class="col-span-3 text-gray-500 font-medium">ยังไม่มีรูปภาพแกลลอรี่สำหรับงานนี้</p>'; }
                        } else { galleryHTML += '<p class="col-span-3 text-gray-500 font-medium">ยังไม่มีรูปภาพแกลลอรี่สำหรับงานนี้</p>'; }
                        galleryHTML += '</div>';
                        galDiv.innerHTML = `<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">${leftCol}<div class="lg:col-span-8"><h2 class="text-3xl font-header font-bold mb-2">Event Gallery</h2>${galleryHTML}</div></div>`;
                    }
                });
                
                if (typeof addEventDetailListeners === 'function') addEventDetailListeners(container);
            }
        } catch (error) { console.error('Error fetching events:', error); }
    }
};