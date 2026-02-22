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
            const eventLink = e.target.closest('.event-link');
            if (eventLink && activeClone.contains(eventLink)) return; 
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
    if (mainContainer.dataset.initialHeight) { mainContainer.style.height = `${mainContainer.dataset.initialHeight}px`; delete mainContainer.dataset.initialHeight; }
    clone.classList.remove('is-expanded'); clone.querySelector('.clone-content, .event-detail-content, .bigband-detail-content, .artist-detail-content')?.classList.remove('content-visible');
    const onCollapseEnd = (e) => {
        if (e.target === clone && e.propertyName === 'width') {
            if (clone.parentElement) clone.remove();
            if(originalCard) originalCard.classList.remove('ghost'); 
            activeCard = null; activeClone = null; clone.removeEventListener('transitionend', onCollapseEnd);
        }
    };
    clone.addEventListener('transitionend', onCollapseEnd);
    const cardRect = originalCard.getBoundingClientRect(); const containerRect = mainContainer.getBoundingClientRect();
    if (cardRect && containerRect) {
        clone.style.top = `${cardRect.top - containerRect.top}px`; clone.style.left = `${cardRect.left - containerRect.left}px`;
        clone.style.width = `${cardRect.width}px`; clone.style.height = `${cardRect.height}px`;
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
// ระบบเจาะดูข้อมูลศิลปินและงานต่างๆ (ดึงข้อมูลถูกต้อง 100%)
// ----------------------------------------------------------------------

function showArtistDetailContent(type, num) {
    const template = document.getElementById('artist-detail-template');
    if (!activeClone || !template) return;
    activeClone.querySelector('.content-visible')?.classList.remove('content-visible');
    
    setTimeout(() => {
        activeClone.style.backgroundColor = 'transparent'; activeClone.style.padding = '0';
        const tempDiv = document.createElement('div'); tempDiv.innerHTML = template.innerHTML;
        
        // เติมรหัส _artist1 ให้ตรงกับฐานข้อมูล
        const suffix = `_${type}${num}`;
        tempDiv.querySelectorAll('[id^="dyn-"]').forEach(el => el.id += suffix);
        activeClone.innerHTML = tempDiv.innerHTML;
        
        requestAnimationFrame(() => activeClone.querySelector('.artist-detail-content')?.classList.add('content-visible'));

        const backButton = document.createElement('button'); backButton.innerHTML = '&#8592;'; backButton.className = 'nav-btn nav-btn-left'; backButton.style.left = '20px';
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
        const defaultContent = document.getElementById('default-detail-content'); 
        if (contentArea && defaultContent) { 
            const tabDiv = document.createElement('div'); tabDiv.innerHTML = defaultContent.innerHTML;
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

function setupInnerTabs(container, targetAreaId, eventIndex = null) {
    const buttons = container.querySelectorAll('.nav-button'); const contentArea = container.querySelector('#' + targetAreaId);
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            buttons.forEach(b => { b.classList.remove('bg-black', 'text-white'); b.classList.add('bg-transparent', 'text-black', 'hover:bg-black', 'hover:text-white'); });
            btn.classList.remove('bg-transparent', 'text-black', 'hover:bg-black', 'hover:text-white'); btn.classList.add('bg-black', 'text-white');
            
            const sectionId = btn.getAttribute('data-section'); 
            let sourceContent = document.getElementById(sectionId + '-content') || document.getElementById('default-detail-content');
            
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
    // ซ่อน Categories หลักไปเลย เมื่อคลิกเจาะเข้าไป
    container.querySelectorAll('#category-artists-library, #category-jazz-network').forEach(link => {
        const newLink = link.cloneNode(true); link.parentNode.replaceChild(newLink, link);
        newLink.addEventListener('click', (e) => { 
            e.preventDefault(); e.stopPropagation(); 
            const templateId = newLink.id === 'category-artists-library' ? 'artists-library-grid-template' : 'jazz-network-grid-template';
            const template = document.getElementById(templateId);
            if (!template) return;
            activeClone.querySelector('.content-visible')?.classList.remove('content-visible');
            setTimeout(() => {
                activeClone.innerHTML = template.innerHTML;
                requestAnimationFrame(() => activeClone.querySelector('.clone-content')?.classList.add('content-visible'));
                const backButton = document.createElement('button'); backButton.innerHTML = '&#8592;'; backButton.className = 'nav-btn nav-btn-left'; backButton.style.color = '#121212'; backButton.style.borderColor = '#121212';
                backButton.addEventListener('click', (e) => { e.stopPropagation(); showMainCategoryContent(); });
                const closeBtn = document.createElement('button'); closeBtn.innerHTML = '&times;'; closeBtn.className = 'close-btn';
                closeBtn.addEventListener('click', (e) => { e.stopPropagation(); collapseCard(activeClone, activeCard); });
                activeClone.appendChild(backButton); activeClone.appendChild(closeBtn);
                addEventDetailListeners(activeClone);
                if(window.applyDataToDOM) window.applyDataToDOM(activeClone);
            }, 300);
        });
    });

    container.querySelectorAll('.artist-link, .event-link').forEach(link => {
        const newLink = link.cloneNode(true); link.parentNode.replaceChild(newLink, link);
        newLink.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            if (!mainContainer.dataset.initialHeight) { 
                mainContainer.dataset.initialHeight = mainContainer.offsetHeight; 
                mainContainer.style.height = `${mainContainer.offsetHeight * 2.5}px`; 
            }
            if (newLink.classList.contains('event-link')) {
                showEventDetailContent(newLink.getAttribute('data-event-index') || '1');
            } else if (newLink.classList.contains('artist-link')) {
                const match = newLink.querySelector('img[id^="dyn-"]')?.id.match(/dyn-(artist|partner)(\d+)/);
                if(match) showArtistDetailContent(match[1], match[2]);
            }
        });
    });
}