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
    
    // 🌟 จุดที่เพิ่มเพื่อแก้บั๊ก: คืนค่าสีพื้นหลัง (เช่นสีเหลือง #ffc107) และ Padding กลับมาทันทีตอนกดกากบาท
    clone.style.backgroundColor = '';
    clone.style.padding = '';

    // ซ่อนเนื้อหา
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
        
        // ผูก Event Listener ให้พวกการ์ดใน Artists
        addEventDetailListeners(activeClone);

        if(window.applyDataToDOM) window.applyDataToDOM(activeClone);
    }, 300);
}

function showArtistDetailContent(type, num) {
    const template = document.getElementById('artist-detail-template');
    if (!activeClone || !template) return;
    activeClone.querySelector('.content-visible')?.classList.remove('content-visible');
    
    setTimeout(() => {
        activeClone.style.backgroundColor = 'transparent'; activeClone.style.padding = '0';
        const tempDiv = document.createElement('div'); tempDiv.innerHTML = template.innerHTML;
        
        const suffix = `_${type}${num}`;
        tempDiv.querySelectorAll('[id^="dyn-"]').forEach(el => el.id += suffix);
        activeClone.innerHTML = tempDiv.innerHTML;
        
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

function showEventDetailContent(eventIndex) {
    const template = document.getElementById('event-detail-template');
    if (!activeClone || !template) return;
    activeClone.querySelector('.content-visible')?.classList.remove('content-visible');
    
    setTimeout(() => {
        const tempDiv = document.createElement('div'); tempDiv.innerHTML = template.innerHTML;
        const suffix = `_event${eventIndex}`;
        tempDiv.querySelectorAll('[id^="dyn-"]').forEach(el => { if(!el.id.endsWith(suffix)) el.id += suffix; });
        activeClone.innerHTML = tempDiv.innerHTML; 
        // --- ส่วนที่ดึงรูป Banner มาใส่ ---
if (window.frontendEvents) {
    const eventData = window.frontendEvents.find(e => e.id == eventIndex);
    if (eventData && eventData.banner_image) {
        const bannerImg = activeClone.querySelector('img[id^="dyn-festival_banner"]');
        if(bannerImg) bannerImg.src = eventData.banner_image;
    }
}
// ------------------------------
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
                // เปลี่ยนให้หา ID ที่มี -เลขEvent ต่อท้ายก่อนเสมอ เพื่อโชว์ข้อมูลแต่ละงานไม่ซ้ำกัน
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
                if(match) showArtistDetailContent(match[1], match[2]);
            }
        });
    });
}
// ฟังก์ชันนี้จะถูกเรียกอัตโนมัติเมื่อมีการกดเปิดการ์ดต่างๆ (ใน script.js ตั้งค่าไว้แล้ว)
window.frontendEvents = []; // สร้างตัวแปรเก็บข้อมูลไว้ใช้ตอนเปิด Detail

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
                    
                    const d = new Date(event.start_date);
                    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                    const dateFormatted = `${String(d.getDate()).padStart(2, '0')} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
                    const dateCard = `${String(d.getDate()).padStart(2, '0')}<br>${monthNames[d.getMonth()]}<br>${d.getFullYear()}`;
                    const imageUrl = event.banner_image ? event.banner_image : 'https://placehold.co/1200x400/1a1a1a/ffffff?text=Jazz+Event';
                    
                    // --- 1. สร้างการ์ดด้านนอก ---
                    const cardHTML = `
                        <div data-event-index="${event.id}" class="event-link relative rounded-2xl overflow-hidden group cursor-pointer bg-black/40 border border-white/20 min-h-[140px] md:min-h-[160px] flex items-center p-6 lg:p-8 transition-transform duration-300 hover:scale-[1.02] mb-4">
                            <img src="${imageUrl}" class="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen group-hover:opacity-90 transition-opacity duration-300">
                            <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-black/80 pointer-events-none"></div>
                            <div class="relative z-10 w-full flex items-center justify-between text-white">
                                <div class="font-header text-3xl lg:text-4xl font-bold leading-none tracking-tight shrink-0 relative z-20 cursor-pointer hover:text-yellow-400 transition-colors">${dateCard}</div>
                                <div class="flex flex-col items-end gap-1 text-right">
                                    <div class="flex items-center gap-4">
                                        <h3 class="font-header text-2xl lg:text-3xl font-bold tracking-tight relative z-20 cursor-pointer hover:text-yellow-400 transition-colors">${event.title}</h3>
                                        <div class="w-10 h-10 border border-white/50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-colors hidden sm:flex"><span class="text-xl leading-none -mt-1">&#8594;</span></div>
                                    </div>
                                    <p class="font-body text-sm text-white/80 max-w-[90%] sm:max-w-md relative z-20 cursor-pointer hover:text-yellow-400 transition-colors">${event.short_description || ''}</p>
                                </div>
                            </div>
                        </div>
                    `;
                    festivalContainer.innerHTML += cardHTML;
                    
                    // --- 2. แอบสร้างเนื้อหาทั้ง 5 หน้า Detail เตรียมไว้ ---
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

                        // 2.1 Tab: DETAILS
                        let detailDiv = document.getElementById('event-detail-content-' + event.id);
                        if(!detailDiv) { detailDiv = document.createElement('div'); detailDiv.id = 'event-detail-content-' + event.id; detailDiv.className = 'hidden'; hiddenContainer.appendChild(detailDiv); }
                        const detailsText = event.details ? event.details.replace(/\n/g, '<br>') : 'ไม่มีรายละเอียด...';
                        detailDiv.innerHTML = `<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">${leftCol}<div class="lg:col-span-8"><h1 class="text-3xl sm:text-4xl lg:text-5xl font-header font-bold mb-1 tracking-tight">${event.title}</h1><h2 class="text-2xl sm:text-3xl lg:text-4xl font-header font-bold mb-6 tracking-tight">${event.location || 'Chiangmai Jazz City'}</h2><p class="text-sm sm:text-base font-medium mb-4 text-black">${dateFormatted}</p><hr class="border-gray-300 border-t-2 mb-6"><div class="prose prose-sm sm:prose-base max-w-none text-black font-medium leading-relaxed text-sm">${detailsText}</div></div></div>`;

                        // 2.2 Tab: BOOK NOW
                        let bookDiv = document.getElementById('book-now-content-' + event.id);
                        if(!bookDiv) { bookDiv = document.createElement('div'); bookDiv.id = 'book-now-content-' + event.id; bookDiv.className = 'hidden'; hiddenContainer.appendChild(bookDiv); }
                        let ticketsHTML = '';
                        if(event.tickets && event.tickets.length > 0) {
                            event.tickets.forEach(t => {
                                ticketsHTML += `<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-300 pb-4 pt-4"><div class="mb-4 sm:mb-0"><h3 class="text-xl font-bold text-black mb-1">${t.title}</h3><p class="text-xs text-gray-600 font-medium">${t.details || ''}</p></div><div class="flex items-center justify-between w-full sm:w-auto gap-6"><span class="text-xl font-bold text-black shrink-0">${t.price} THB</span><button class="bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 text-sm shadow-md transition-transform active:scale-95">Buy Ticket</button></div></div>`;
                            });
                        } else { ticketsHTML = '<p class="text-gray-500 font-medium mt-4">ไม่มีข้อมูลบัตรเข้าชมสำหรับงานนี้</p>'; }
                        bookDiv.innerHTML = `<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">${leftCol}<div class="lg:col-span-8 flex flex-col gap-4"><h3 class="text-3xl font-header font-bold mb-2">Buy Tickets</h3>${ticketsHTML}</div></div>`;

                        // 2.3 Tab: LINE UP
                        let lineDiv = document.getElementById('line-up-content-' + event.id);
                        if(!lineDiv) { lineDiv = document.createElement('div'); lineDiv.id = 'line-up-content-' + event.id; lineDiv.className = 'hidden'; hiddenContainer.appendChild(lineDiv); }
                        let lineupHTML = '<ul class="text-sm text-gray-700 space-y-4 mt-4">';
                        if(event.lineups && event.lineups.length > 0) {
                            event.lineups.forEach(l => {
                                const timeStr = l.lineup_time ? l.lineup_time.substring(0,5) : '';
                                const dateStr = l.lineup_date ? `(${l.lineup_date})` : '';
                                lineupHTML += `<li class="flex items-start gap-4 border-l-4 border-yellow-400 pl-4 py-1"><div class="shrink-0"><span class="font-bold text-black text-lg">${timeStr}</span><br><span class="text-xs text-gray-500">${dateStr}</span></div><div class="flex items-center h-full pt-1"><span class="text-lg font-bold text-gray-800">${l.band_name}</span></div></li>`;
                            });
                        } else { lineupHTML += '<li>ไม่มีตารางเวลาศิลปินสำหรับงานนี้</li>'; }
                        lineupHTML += '</ul>';
                        lineDiv.innerHTML = `<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">${leftCol}<div class="lg:col-span-8"><h3 class="text-3xl font-header font-bold mb-4 border-b-2 border-gray-300 pb-2">Event Line Up</h3>${lineupHTML}</div></div>`;

                        // 2.4 Tab: VENUE
                        let venueDiv = document.getElementById('venue-content-' + event.id);
                        if(!venueDiv) { venueDiv = document.createElement('div'); venueDiv.id = 'venue-content-' + event.id; venueDiv.className = 'hidden'; hiddenContainer.appendChild(venueDiv); }
                        const venueImg = event.venue_image ? event.venue_image : 'https://placehold.co/800x400/e2e8f0/64748b?text=No+Map';
                        venueDiv.innerHTML = `<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">${leftCol}<div class="lg:col-span-8"><h2 class="text-3xl font-header font-bold mb-4">Venue Location</h2><img src="${venueImg}" class="w-full h-auto rounded-lg shadow-md border border-gray-200"></div></div>`;

                        // 2.5 Tab: GALLERY
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


