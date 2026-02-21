// --- Card Animation Script ---
const mainContainer = document.querySelector('.main-container');
const cards = document.querySelectorAll('.card:not(.clone)');
let activeCard = null;
let activeClone = null;
let allCards = Array.from(cards);

mainContainer.addEventListener('click', function(e) {
    // --- Part A: Handle clicks when NO card is expanded ---
    if (!activeCard) {
        const clickedCard = e.target.closest('.card:not(.clone)');
        if (clickedCard) {
            if (e.target.closest('a')) return;
            expandCard(clickedCard); 
        }
        return; 
    }

    // --- Part B: Handle clicks when a card IS expanded (activeClone exists) ---
    if (activeClone) {
        const eventLink = e.target.closest('.event-link');
        if (eventLink && activeClone.contains(eventLink)) {
            e.preventDefault();
            e.stopPropagation(); 

            if (eventLink.id === 'jazz-event-link') {
                const initialHeight = mainContainer.dataset.initialHeight;

                if (!initialHeight) {
                    const currentHeight = mainContainer.offsetHeight;
                    mainContainer.dataset.initialHeight = currentHeight; 
                    mainContainer.style.height = `${currentHeight}px`; 
                    requestAnimationFrame(() => {
                        mainContainer.style.height = `${currentHeight * 2.5}px`; 
                    });
                    showEventDetailContent(); 
                } else {
                    const initialHeightNum = parseFloat(initialHeight);
                    mainContainer.style.height = `${initialHeightNum}px`; 
                    delete mainContainer.dataset.initialHeight; 
                    showEventListContent(); 
                }
            } else {
                showEventDetailContent();
            }
            return; 
        }

        if (!activeClone.contains(e.target)) {
            collapseCard(activeClone, activeCard); 
        }
    }
});


function createButtons(card) {
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.className = 'close-btn';
    closeBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        collapseCard(activeClone, activeCard); 
    });

    const navLeft = document.createElement('button');
    navLeft.innerHTML = '&#8592;';
    navLeft.className = 'nav-btn nav-btn-left';
    navLeft.addEventListener('click', (e) => {
        e.stopPropagation();
        navigate('prev');
    });

    const navRight = document.createElement('button');
    navRight.innerHTML = '&#8594;';
    navRight.className = 'nav-btn nav-btn-right';
    navRight.addEventListener('click', (e) => {
        e.stopPropagation();
        navigate('next');
    });
    
    if (card.classList.contains('card-yellow') || card.classList.contains('card-gray')) {
         [closeBtn, navLeft, navRight].forEach(btn => {
            btn.style.color = '#121212';
            btn.style.borderColor = '#121212';
         });
    }
    
    return [closeBtn, navLeft, navRight];
}

function expandCard(card) {
    activeCard = card;
    const cardRect = card.getBoundingClientRect();
    const containerRect = mainContainer.getBoundingClientRect();
    const targetId = card.dataset.target;
    const contentSource = document.querySelector(targetId);

    if (!contentSource) { 
        console.error("Content source not found:", targetId);
        return; 
    }

    const clone = document.createElement('div');
    activeClone = clone;
    clone.className = card.className + ' clone';
    
    clone.innerHTML = contentSource.innerHTML;

    const buttons = createButtons(card);
    buttons.forEach(btn => clone.appendChild(btn));
    
    clone.style.top = `${cardRect.top - containerRect.top}px`;
    clone.style.left = `${cardRect.left - containerRect.left}px`;
    clone.style.width = `${cardRect.width}px`;
    clone.style.height = `${cardRect.height}px`;
    
    mainContainer.appendChild(clone);
    card.classList.add('ghost');
    
    const onExpansionEnd = (event) => {
        if (event.target === clone && event.propertyName === 'width') {
            clone.classList.add('is-expanded');
            
            // [Animation Fade In]
            requestAnimationFrame(() => {
                clone.querySelector('.clone-content')?.classList.add('content-visible');
            });
            
            addEventDetailListeners(clone); 
            clone.removeEventListener('transitionend', onExpansionEnd);
        }
    };
    clone.addEventListener('transitionend', onExpansionEnd);
    
    requestAnimationFrame(() => {
        clone.style.top = '0px';
        clone.style.left = '0px';
        clone.style.width = '100%';
        clone.style.height = '100%';
    });
}

function collapseCard(clone, originalCard) {
    if (!clone || !originalCard) return;

    if (mainContainer.dataset.initialHeight) {
        mainContainer.style.height = `${mainContainer.dataset.initialHeight}px`;
        delete mainContainer.dataset.initialHeight; 
    }

    clone.classList.remove('is-expanded');
    
    // [Animation Fade Out]
    clone.querySelector('.clone-content, .event-detail-content')?.classList.remove('content-visible');

    const cardRect = originalCard.getBoundingClientRect();
    const containerRect = mainContainer.getBoundingClientRect();

    const onCollapseEnd = (event) => {
        if (event.target === clone && event.propertyName === 'width') {
            if (clone.parentElement) { clone.remove(); }
            if(originalCard) originalCard.classList.remove('ghost'); 
            activeCard = null;
            activeClone = null;
            clone.removeEventListener('transitionend', onCollapseEnd);
        }
    };
    clone.addEventListener('transitionend', onCollapseEnd);

    if (cardRect && containerRect) {
        clone.style.top = `${cardRect.top - containerRect.top}px`;
        clone.style.left = `${cardRect.left - containerRect.left}px`;
        clone.style.width = `${cardRect.width}px`;
        clone.style.height = `${cardRect.height}px`;
    } else {
         if (clone.parentElement) { clone.remove(); }
         if(originalCard) originalCard.classList.remove('ghost');
         activeCard = null;
         activeClone = null;
    }
}


function navigate(direction) {
    if (!activeCard) return;

    if (mainContainer.dataset.initialHeight) {
        mainContainer.style.height = `${mainContainer.dataset.initialHeight}px`;
        delete mainContainer.dataset.initialHeight;
    }

    const currentIndex = allCards.indexOf(activeCard);
    let nextIndex;

    if (direction === 'next') {
        nextIndex = (currentIndex + 1) % allCards.length;
    } else {
        nextIndex = (currentIndex - 1 + allCards.length) % allCards.length;
    }
    const nextCard = allCards[nextIndex];
    
    activeClone.classList.remove('is-expanded');
    
    // [Animation Fade Out]
    activeClone.querySelector('.clone-content, .event-detail-content')?.classList.remove('content-visible');
    
    setTimeout(() => { 
        const nextContentSource = document.querySelector(nextCard.dataset.target);
        if (!nextContentSource) return;

        activeClone.className = nextCard.className + ' clone is-expanded';
        activeClone.innerHTML = nextContentSource.innerHTML; 
        
        // [Animation Fade In]
        requestAnimationFrame(() => {
            activeClone.querySelector('.clone-content')?.classList.add('content-visible');
        });
        
        const buttons = createButtons(nextCard);
        buttons.forEach(btn => activeClone.appendChild(btn));
        
        if(activeCard) activeCard.classList.remove('ghost'); 
        nextCard.classList.add('ghost');
        activeCard = nextCard;
        // Re-add event listeners for the new content
        addEventDetailListeners(activeClone);
    }, 300); 
}

function showEventDetailContent() {
    const template = document.getElementById('event-detail-template');
    if (!activeClone || !template) return;

    // [Animation Fade Out]
    activeClone.querySelector('.clone-content')?.classList.remove('content-visible');
    
    setTimeout(() => {
        activeClone.innerHTML = template.innerHTML;
        toggleCardNavButtons(false); 

        const contentArea = activeClone.querySelector('#event-detail-content-area');
        const defaultContent = document.getElementById('default-detail-content'); 

        if (contentArea && defaultContent) { 
            contentArea.innerHTML = defaultContent.innerHTML; 
        }

        // [Animation Fade In]
        requestAnimationFrame(() => {
            activeClone.querySelector('.event-detail-content')?.classList.add('content-visible');
            contentArea.querySelector(':first-child')?.classList.add('content-visible');
        });

        if (!activeClone.querySelector('.close-btn')) { 
            const backButton = document.createElement('button');
            backButton.innerHTML = '&#8592;';
            backButton.className = 'nav-btn nav-btn-left';
            backButton.style.opacity = 1;
            backButton.addEventListener('click', (e) => {
                e.stopPropagation();
                if (mainContainer.dataset.initialHeight && activeCard.classList.contains('card-blue')) {
                     mainContainer.style.height = `${mainContainer.dataset.initialHeight}px`;
                     delete mainContainer.dataset.initialHeight; 
                }
                showEventListContent();
            });

            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '&times;';
            closeBtn.className = 'close-btn';
            closeBtn.style.opacity = 1;
            closeBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                collapseCard(activeClone, activeCard); 
            });

            activeClone.appendChild(backButton);
            activeClone.appendChild(closeBtn);
        }

        const navButtons = activeClone.querySelectorAll('.nav-button');
        // We use cloneNode trick to remove old listeners from the template
        const newNavButtons = Array.from(navButtons).map(button => {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            return newButton;
        });

        newNavButtons.forEach(button => {
            button.addEventListener('click', (e) => { 
                e.stopPropagation(); 
                const currentContentArea = activeClone.querySelector('#event-detail-content-area');
                
                // [Animation Fade Out]
                currentContentArea.querySelector(':first-child')?.classList.remove('content-visible');

                if (button.classList.contains('active')) {
                    const defaultContentTemplate = document.getElementById('default-detail-content');
                    
                    setTimeout(() => {
                        if (currentContentArea && defaultContentTemplate) {
                            button.classList.remove('active');
                            currentContentArea.innerHTML = defaultContentTemplate.innerHTML;
                            // [Animation Fade In]
                            requestAnimationFrame(() => {
                                currentContentArea.querySelector(':first-child')?.classList.add('content-visible');
                            });
                        }
                    }, 300);

                } else {
                    const sectionId = button.dataset.section;
                    if (!sectionId) return;
                    const contentTemplate = document.getElementById(`${sectionId}-content`);
                    
                    setTimeout(() => {
                        if (currentContentArea && contentTemplate) {
                            newNavButtons.forEach(btn => btn.classList.remove('active'));
                            button.classList.add('active');
                            currentContentArea.innerHTML = contentTemplate.innerHTML;
                            // [Animation Fade In]
                            requestAnimationFrame(() => {
                                currentContentArea.querySelector(':first-child')?.classList.add('content-visible');
                            });
                        }
                    }, 300);
                }
            });
        });
    }, 300); 
}


function showEventListContent() {
    if (!activeClone || !activeCard) return; 

    // [Animation Fade Out]
    activeClone.querySelector('.event-detail-content')?.classList.remove('content-visible');

    const festivalContent = document.getElementById('festival-content');
    if (!festivalContent) return;
    
    setTimeout(() => {
        activeClone.innerHTML = festivalContent.innerHTML;
        
        // [Animation Fade In]
        requestAnimationFrame(() => {
            activeClone.querySelector('.clone-content')?.classList.add('content-visible');
        });

        const buttons = createButtons(activeCard);
        buttons.forEach(btn => activeClone.appendChild(btn));
        
        toggleCardNavButtons(true); 
        // Re-add listeners for the event list view
        addEventDetailListeners(activeClone);
    }, 300);
}

function toggleCardNavButtons(show) {
    if (activeClone) {
       const navLeft = activeClone.querySelector('.nav-btn-left');
       const navRight = activeClone.querySelector('.nav-btn-right');
       if(navLeft && !navLeft.innerHTML.includes('&times;')) { 
            navLeft.style.display = show ? 'flex' : 'none';
       }
        if(navRight) {
            navRight.style.display = show ? 'flex' : 'none';
       }
    }
}

// ===== This function is crucial for the event list to work =====
function addEventDetailListeners(container) {
    const eventLinks = container.querySelectorAll('.event-link');
    eventLinks.forEach(link => {
        // Use cloneNode trick to remove any old listeners
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);

        newLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (newLink.id === 'jazz-event-link') {
                const initialHeight = mainContainer.dataset.initialHeight;
                if (!initialHeight) {
                    const currentHeight = mainContainer.offsetHeight;
                    mainContainer.dataset.initialHeight = currentHeight;
                    mainContainer.style.height = `${currentHeight}px`;
                    requestAnimationFrame(() => {
                        mainContainer.style.height = `${currentHeight * 2.5}px`;
                    });
                    showEventDetailContent();
                } else {
                    const initialHeightNum = parseFloat(initialHeight);
                    mainContainer.style.height = `${initialHeightNum}px`;
                    delete mainContainer.dataset.initialHeight;
                    showEventListContent();
                }
            } else {
                showEventDetailContent();
            }
        });
    });
}

// --- Login Modal Script ---
const loginButton = document.getElementById('login-button'); 
const loginModal = document.getElementById('login-modal');
const closeLoginModalButton = document.getElementById('close-login-modal');
const loginBackdrop = document.getElementById('login-backdrop');
const loginForm = document.getElementById('login-form');

function openLoginModal() {
    if (loginModal) {
        const errorMessage = document.getElementById('login-error-message');
        if(errorMessage) errorMessage.textContent = '';
        if(loginForm) loginForm.reset(); 
        loginModal.classList.remove('hidden');
    }
}

function closeLoginModal() {
    if (loginModal) loginModal.classList.add('hidden');
}

if (loginButton) {
    loginButton.addEventListener('click', (e) => {
        e.preventDefault(); 
        openLoginModal();
    });
}
if (closeLoginModalButton) closeLoginModalButton.addEventListener('click', closeLoginModal);
if (loginBackdrop) loginBackdrop.addEventListener('click', closeLoginModal);

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('login-error-message');
        errorMessage.textContent = ''; 

        try {
            // *** NOTE: You need a server.js running at http://localhost:3000 for this to work ***
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            if (response.ok) {
                alert('Login Successful!');
                localStorage.setItem('authToken', data.token); 
                closeLoginModal();
            } else {
                errorMessage.textContent = data.message || 'Login failed. Please try again.';
            }
        } catch (error) {
            console.error('Login Error:', error);
            errorMessage.textContent = 'Could not connect to the server.';
        }
    });
}
// ====== ระบบเปลี่ยนหน้าสำหรับ Artists ======
function showArtistDetailContent() {
    const template = document.getElementById('artist-detail-template');
    if (!activeClone || !template) return;

    // Fade Out ลิสต์ศิลปิน
    activeClone.querySelector('.clone-content')?.classList.remove('content-visible');
    
    setTimeout(() => {
        // เอาพื้นหลังสีเหลืองออกเพื่อให้เข้ากับหน้าสีขาว
        activeClone.style.backgroundColor = 'transparent';
        activeClone.innerHTML = template.innerHTML;
        toggleCardNavButtons(false); 

        // Fade In เนื้อหาศิลปิน
        requestAnimationFrame(() => {
            activeClone.querySelector('.artist-detail-content')?.classList.add('content-visible');
        });

        // สร้างปุ่มย้อนกลับ (Back) และปิด (Close)
        const backButton = document.createElement('button');
        backButton.innerHTML = '&#8592;';
        backButton.className = 'nav-btn nav-btn-left';
        backButton.style.opacity = 1;
        backButton.style.color = '#121212';
        backButton.style.borderColor = '#121212';
        backButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (mainContainer.dataset.initialHeight) {
                 mainContainer.style.height = `${mainContainer.dataset.initialHeight}px`;
                 delete mainContainer.dataset.initialHeight; 
            }
            showArtistListContent();
        });

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.className = 'close-btn';
        closeBtn.style.opacity = 1;
        closeBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            collapseCard(activeClone, activeCard); 
        });

        activeClone.appendChild(backButton);
        activeClone.appendChild(closeBtn);
    }, 300); 
}

function showArtistListContent() {
    if (!activeClone || !activeCard) return; 

    // Fade Out หน้าเนื้อหา
    activeClone.querySelector('.artist-detail-content')?.classList.remove('content-visible');

    const artistsContent = document.getElementById('artists-content');
    if (!artistsContent) return;
    
    setTimeout(() => {
        // คืนสีพื้นหลังสีเหลืองของการ์ด Artist
        activeClone.style.backgroundColor = '';
        activeClone.innerHTML = artistsContent.innerHTML;
        
        // Fade In ลิสต์กลับมา
        requestAnimationFrame(() => {
            activeClone.querySelector('.clone-content')?.classList.add('content-visible');
        });

        const buttons = createButtons(activeCard);
        buttons.forEach(btn => activeClone.appendChild(btn));
        
        toggleCardNavButtons(true); 
        // สั่งให้ปุ่มกลับมาคลิกได้อีกครั้ง
        addEventDetailListeners(activeClone);
    }, 300);
}

// อัปเดตฟังก์ชันดักการคลิกเดิม ให้รองรับ .artist-link ด้วย
const originalAddEventDetailListeners = addEventDetailListeners;
addEventDetailListeners = function(container) {
    // เรียกฟังก์ชันเดิมเพื่อให้ event ฝั่ง Festival ยังทำงานได้
    originalAddEventDetailListeners(container);

    // เพิ่ม Event สำหรับ Artist Link
    const artistLinks = container.querySelectorAll('.artist-link');
    artistLinks.forEach(link => {
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);

        newLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const initialHeight = mainContainer.dataset.initialHeight;
            if (!initialHeight) {
                const currentHeight = mainContainer.offsetHeight;
                mainContainer.dataset.initialHeight = currentHeight;
                mainContainer.style.height = `${currentHeight}px`;
                requestAnimationFrame(() => {
                    mainContainer.style.height = `${currentHeight * 2.5}px`; // ขยายกล่องลงมา
                });
                showArtistDetailContent();
            }
        });
    });
};// ====== ระบบเปลี่ยนหน้าสำหรับ Artists ======
function showArtistDetailContent() {
    const template = document.getElementById('artist-detail-template');
    if (!activeClone || !template) return;

    // Fade Out ลิสต์ศิลปิน
    activeClone.querySelector('.clone-content')?.classList.remove('content-visible');
    
    setTimeout(() => {
        // เอาพื้นหลังสีเหลืองออก และ **เอา Padding ออก** เพื่อให้กล่องขาวขยายสุดขอบบังการ์ดด้านหลังมิด
        activeClone.style.backgroundColor = 'transparent';
        activeClone.style.padding = '0'; 
        activeClone.innerHTML = template.innerHTML;
        toggleCardNavButtons(false); 

        // Fade In เนื้อหาศิลปิน
        requestAnimationFrame(() => {
            activeClone.querySelector('.artist-detail-content')?.classList.add('content-visible');
        });

        // สร้างปุ่มย้อนกลับ (Back) และปิด (Close)
        const backButton = document.createElement('button');
        backButton.innerHTML = '&#8592;';
        backButton.className = 'nav-btn nav-btn-left';
        backButton.style.opacity = 1;
        backButton.style.color = '#121212';
        backButton.style.borderColor = '#121212';
        backButton.style.left = '20px'; // ขยับปุ่ม Back ให้พอดีกับขอบใหม่
        
        backButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (mainContainer.dataset.initialHeight) {
                 mainContainer.style.height = `${mainContainer.dataset.initialHeight}px`;
                 delete mainContainer.dataset.initialHeight; 
            }
            showArtistListContent();
        });

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.className = 'close-btn';
        closeBtn.style.opacity = 1;
        closeBtn.style.top = '20px'; // ขยับปุ่ม Close ให้พอดีกับขอบใหม่
        closeBtn.style.right = '20px';
        
        closeBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            collapseCard(activeClone, activeCard); 
        });

        activeClone.appendChild(backButton);
        activeClone.appendChild(closeBtn);
    }, 300); 
}

function showArtistListContent() {
    if (!activeClone || !activeCard) return; 

    // Fade Out หน้าเนื้อหา
    activeClone.querySelector('.artist-detail-content')?.classList.remove('content-visible');

    const artistsContent = document.getElementById('artists-content');
    if (!artistsContent) return;
    
    setTimeout(() => {
        // คืนสีพื้นหลังสีเหลือง และ **คืนค่า Padding กลับมา** เพื่อให้หน้า Grid แสดงผลปกติ
        activeClone.style.backgroundColor = '';
        activeClone.style.padding = ''; 
        activeClone.innerHTML = artistsContent.innerHTML;
        
        // Fade In ลิสต์กลับมา
        requestAnimationFrame(() => {
            activeClone.querySelector('.clone-content')?.classList.add('content-visible');
        });

        const buttons = createButtons(activeCard);
        buttons.forEach(btn => activeClone.appendChild(btn));
        
        toggleCardNavButtons(true); 
        // สั่งให้ปุ่มกลับมาคลิกได้อีกครั้ง
        addEventDetailListeners(activeClone);
    }, 300);
}