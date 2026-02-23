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
                sourceContent = document.getElementById(sectionId + '-content') || document.getElementById('default-detail-content');
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
// ฟังก์ชันดึงข้อมูลมาแสดงแบบสร้างการ์ดใหม่ตามจำนวนจริง
window.applyDataToDOM = async function(container) {
    
    // หาพื้นที่ที่ใช้แสดงการ์ด Event (Festival)
    const festivalContainer = container.querySelector('.clone-main-content');
    
    // เช็คให้ชัวร์ว่าเป็นหน้า Festival (ที่มี ID dyn-fest_title1 อยู่)
    if (festivalContainer && container.querySelector('#dyn-fest_title1')) {
        try {
            // ดึงข้อมูลล่าสุดจาก Backend
            const response = await fetch('backend.php?action=get_front_events');
            const result = await response.json();
            
            if (result.status === 'success' && result.data.length > 0) {
                
                // 1. ล้างการ์ดจำลองอันเก่าทิ้งให้หมด (เพื่อไม่ให้มันชนกัน)
                festivalContainer.innerHTML = '';
                
                const events = result.data;
                
                // 2. วนลูปสร้างการ์ดใหม่เฉพาะข้อมูลที่ "มีชื่ออีเวนต์จริงๆ"
                events.forEach((event) => {
                    // ถ้าชื่ออีเวนต์ว่างเปล่า (ข้อมูลขยะ) ให้ข้ามไปเลย ไม่ต้องสร้างการ์ด
                    if (!event.title || event.title.trim() === '') return; 
                    
                    const d = new Date(event.start_date);
                    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                    const dateFormatted = `${String(d.getDate()).padStart(2, '0')}<br>${monthNames[d.getMonth()]}<br>${d.getFullYear()}`;
                    
                    // ถ้ารูปแบนเนอร์ไม่มี ให้ใช้รูปสีดำๆ เท่ๆ แทนไปก่อน
                    const imageUrl = event.banner_image ? event.banner_image : 'https://placehold.co/1200x400/1a1a1a/ffffff?text=Jazz+Event';
                    
                    // สร้างโครงสร้าง HTML ของการ์ด 1 ใบ
                    const cardHTML = `
                        <div data-event-index="${event.id}" class="event-link relative rounded-2xl overflow-hidden group cursor-pointer bg-black/40 border border-white/20 min-h-[140px] md:min-h-[160px] flex items-center p-6 lg:p-8 transition-transform duration-300 hover:scale-[1.02] mb-4">
                            <img src="${imageUrl}" class="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen group-hover:opacity-90 transition-opacity duration-300">
                            <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-black/80 pointer-events-none"></div>
                            
                            <div class="relative z-10 w-full flex items-center justify-between text-white">
                                <div class="font-header text-3xl lg:text-4xl font-bold leading-none tracking-tight shrink-0 relative z-20 cursor-pointer hover:text-yellow-400 transition-colors">
                                    ${dateFormatted}
                                </div>
                                <div class="flex flex-col items-end gap-1 text-right">
                                    <div class="flex items-center gap-4">
                                        <h3 class="font-header text-2xl lg:text-3xl font-bold tracking-tight relative z-20 cursor-pointer hover:text-yellow-400 transition-colors">${event.title}</h3>
                                        <div class="w-10 h-10 border border-white/50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-colors hidden sm:flex">
                                            <span class="text-xl leading-none -mt-1">&#8594;</span>
                                        </div>
                                    </div>
                                    <p class="font-body text-sm text-white/80 max-w-[90%] sm:max-w-md relative z-20 cursor-pointer hover:text-yellow-400 transition-colors">${event.short_description || ''}</p>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    // นำการ์ดที่สร้างเสร็จแล้ว ไปยัดใส่ในหน้าเว็บ
                    festivalContainer.innerHTML += cardHTML;
                });
                
                // 3. สำคัญมาก: ผูกระบบให้การ์ดใหม่สามารถกดคลิกเพื่อเข้าไปดู Detail ได้
                if (typeof addEventDetailListeners === 'function') {
                    addEventDetailListeners(container);
                }
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }
};



