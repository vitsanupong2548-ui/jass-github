window.homepageData = {};
window.frontendMusicians = []; // เพิ่มตัวแปรเก็บข้อมูลศิลปินไว้ใช้ตอนกดดูรายละเอียด

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
    if (typeof loadCoursesFromDB === 'function') loadCoursesFromDB();
}

async function loadCoursesFromDB() {
    try {
        const res = await fetch('backend.php?action=get_all_courses&t=' + new Date().getTime());
        if (!res || !res.ok) return;
        const result = await res.json();
        
        // ล็อคเป้าให้ตรงกับกล่อง Courses โดยเฉพาะ
        const courseTitle = document.getElementById('dyn-course_main_title');
        if (!courseTitle) return; 

        const container = courseTitle.closest('.clone-content').querySelector('.clone-main-content');
        if (!container) return; 

        if (result.status === 'success' && result.data.length > 0) {
            container.innerHTML = ''; 
            const courses = result.data;
            
            // 1. สร้างพื้นที่ซ่อนสำหรับเก็บเนื้อหา Detail ของแต่ละคอร์ส (เพื่อให้ script.js ดึงไปแสดงตอนเปลี่ยนหน้า)
            let hiddenContainer = document.getElementById('hidden-course-data-container');
            if (!hiddenContainer) {
                hiddenContainer = document.createElement('div');
                hiddenContainer.id = 'hidden-course-data-container';
                hiddenContainer.className = 'hidden';
                document.body.appendChild(hiddenContainer);
            }
            hiddenContainer.innerHTML = ''; // เคลียร์ของเก่า

            let visibleHTML = '';
            
            // ==========================================
            // ส่วนที่ 1: สร้างการ์ดใหญ่สำหรับคอร์สแรก (Featured)
            // ==========================================
            const featured = courses[0];
            const featuredImg = featured.banner_image || 'https://placehold.co/800x450/333/fff?text=Featured+Course';
            
            visibleHTML += `
                <div data-course-index="${featured.id}" class="course-link relative rounded-2xl overflow-hidden mb-8 cursor-pointer group shadow-xl bg-black">
                    <div class="aspect-[21/9] md:aspect-[16/7] w-full">
                        <img src="${featuredImg}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100">
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
                    <div class="absolute bottom-6 left-6 right-6 z-10 pointer-events-none">
                        <h3 class="text-3xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-md leading-tight">${featured.title || 'Untitled Course'}</h3>
                        <p class="text-white/80 font-medium text-lg drop-shadow-md">By ${featured.creator || 'Unknown'}</p>
                    </div>
                </div>
            `;

            // ==========================================
            // ส่วนที่ 2: สร้าง Grid สำหรับคอร์สที่เหลือ
            // ==========================================
            if (courses.length > 1) {
                visibleHTML += `<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">`;
                for (let i = 1; i < courses.length; i++) {
                    const c = courses[i];
                    const img = c.banner_image || `https://placehold.co/400x250/444/fff?text=Course+${i+1}`;
                    visibleHTML += `
                        <div data-course-index="${c.id}" class="course-link cursor-pointer group relative rounded-xl overflow-hidden aspect-video shadow-lg bg-black">
                            <img src="${img}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-colors pointer-events-none"></div>
                            <div class="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
                                <h4 class="text-lg md:text-xl font-bold text-white leading-tight drop-shadow-md mb-1">${c.title || 'Untitled'}</h4>
                                <p class="text-xs text-white/70">By ${c.creator || 'Unknown'}</p>
                            </div>
                        </div>
                    `;
                }
                visibleHTML += `</div>`;
            }

            // นำโค้ด HTML ที่ปั้นเสร็จแล้วไปใส่ในหน้าเว็บ
            container.innerHTML = visibleHTML;

            // ==========================================
            // ส่วนที่ 3: เตรียมเนื้อหาสำหรับหน้า Detail
            // ==========================================
            courses.forEach(course => {
                let detailsHtml = '';
                if(course.details) {
                    try {
                        let detailsArray = typeof course.details === 'string' ? JSON.parse(course.details) : course.details;
                        if(Array.isArray(detailsArray)) {
                            detailsArray.forEach(item => {
                                if (item.type === 'text') {
                                    detailsHtml += `<p class="mb-4 text-gray-800">${item.value.replace(/\n/g, '<br>')}</p>`;
                                } else if (item.type === 'image') {
                                    detailsHtml += `<img src="${item.value}" class="w-full rounded-xl my-4 shadow-md object-contain bg-gray-100">`;
                                } else if (item.type === 'video') {
                                    let vidSrc = item.value;
                                    if(vidSrc.includes('youtube.com/watch?v=')) vidSrc = vidSrc.replace('watch?v=', 'embed/');
                                    else if(vidSrc.includes('youtu.be/')) vidSrc = vidSrc.replace('youtu.be/', 'youtube.com/embed/');
                                    detailsHtml += `<iframe src="${vidSrc}" class="w-full aspect-video rounded-xl my-4 shadow-md" frameborder="0" allowfullscreen></iframe>`;
                                }
                            });
                        }
                    } catch(e) {}
                }
                if (!detailsHtml) detailsHtml = '<p class="text-gray-500">ยังไม่มีรายละเอียดคอร์ส</p>';

                const detailDiv = document.createElement('div');
                detailDiv.id = `course-detail-content-${course.id}`; // กำหนด ID ให้ script.js หาเจอ
                detailDiv.className = "hidden";
                
                const imgUrl = course.banner_image || 'https://placehold.co/600x800/10a349/fff?text=Cover';
                
                detailDiv.innerHTML = `
                    <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start w-full">
                        <div class="w-full lg:w-2/5 shrink-0">
                            <div class="w-full aspect-[4/3] lg:aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden shadow-lg relative border border-gray-200">
                                <img src="${imgUrl}" class="absolute inset-0 w-full h-full object-cover">
                            </div>
                        </div>
                        <div class="w-full lg:w-3/5 flex flex-col text-black">
                            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-header font-bold text-[#050505] mb-2 leading-tight">${course.title || 'Untitled Course'}</h1>
                            <p class="text-lg text-[#10a349] font-bold mb-6">Instructor: ${course.creator || 'Unknown'}</p>
                            <hr class="border-gray-300 border-t-2 mb-6 w-full">
                            <div class="prose prose-sm sm:prose-base max-w-none text-gray-800 font-medium leading-relaxed">
                                ${detailsHtml}
                            </div>
                            <div class="mt-8">
                                <button class="bg-[#10a349] text-white font-bold py-4 px-10 rounded-full hover:bg-green-700 transition shadow-lg text-sm tracking-wider uppercase">START LEARNING</button>
                            </div>
                        </div>
                    </div>
                `;
                hiddenContainer.appendChild(detailDiv);
            });

            // 4. ผูก Event Click ให้ทำหน้าที่สไลด์เปลี่ยนหน้า แบบเดียวกับ Event
            if (typeof addEventDetailListeners === 'function') {
                addEventDetailListeners(container);
            }
            
        } else {
             container.innerHTML = '<p class="text-gray-500 font-medium">ยังไม่มีข้อมูลคอร์สเรียน</p>';
        }
    } catch (err) { console.error("Error loading courses:", err); }
}
async function loadFrontendMusicians() {
    try {
        const res = await fetch('backend.php?action=get_all_musicians');
        if (!res.ok) return;
        const result = await res.json();
        
        if (result.status === 'success') {
            const musicians = result.data;
            window.frontendMusicians = musicians; // บันทึกข้อมูลไว้ใช้
            
            const artistLibrary = musicians.filter(m => m.network_type === 'artist_library');
            const jazzNetwork = musicians.filter(m => m.network_type === 'jazz_network');
            
            const artistContainer = document.querySelector('#artists-library-grid-template .clone-main-content');
            if (artistContainer) {
                artistContainer.innerHTML = ''; 
                artistLibrary.forEach((artist, index) => {
                    const imgUrl = artist.profile_image || './png/Chiangmai Blue.png';
                    const titleParts = artist.title ? artist.title.split(' ') : ['Artist'];
                    const displayTitle = titleParts.length > 1 ? `${titleParts[0]}<br>${titleParts.slice(1).join(' ')}` : titleParts[0];

                    artistContainer.innerHTML += `
                        <a href="#" data-musician-id="${artist.id}" class="artist-link block group relative rounded-[1.5rem] overflow-hidden aspect-square cursor-pointer shadow-lg bg-black/10">
                            <img id="dyn-artist${index+1}_img" src="${imgUrl}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent"></div>
                            <div class="absolute bottom-0 left-0 w-full p-4 flex justify-between items-end">
                                <h3 id="dyn-artist${index+1}_name" class="text-base sm:text-lg lg:text-xl font-header font-bold text-white leading-[1.1] text-left">${displayTitle}</h3>
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white transition-transform duration-300 group-hover:translate-x-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
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
                    const titleParts = jazz.title ? jazz.title.split(' ') : ['Network'];
                    const displayTitle = titleParts.length > 1 ? `${titleParts[0]}<br>${titleParts.slice(1).join(' ')}` : titleParts[0];

                    jazzContainer.innerHTML += `
                        <a href="#" data-musician-id="${jazz.id}" class="artist-link block group relative rounded-[1.5rem] overflow-hidden aspect-square cursor-pointer shadow-lg bg-black/10">
                            <img id="dyn-partner${index+1}_img" src="${imgUrl}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent"></div>
                            <div class="absolute bottom-0 left-0 w-full p-4 flex justify-between items-end">
                                <h3 id="dyn-partner${index+1}_name" class="text-base sm:text-lg lg:text-xl font-header font-bold text-white leading-[1.1] text-left">${displayTitle}</h3>
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white transition-transform duration-300 group-hover:translate-x-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </div>
                        </a>
                    `;
                });
            }
        }
    } catch (err) {}
}

document.addEventListener('DOMContentLoaded', () => {
    initFrontend();
    loadFrontendMusicians();

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

// ----------------------------------------------------------------------
// ระบบดึงข้อมูลจาก Database มาหยอดลง DOM
// ----------------------------------------------------------------------
window.frontendEvents = []; 

window.applyDataToDOM = async function(container) {
    // 1. เช็คว่ามีหัวข้อของ Festival อยู่ใน Container นี้หรือไม่ (ใช้ ID ที่ไม่โดนเคลียร์ทิ้ง)
    const isFestival = container.querySelector('#dyn-fest_main_title');
    
    if (isFestival) {
        // หาจุดที่จะใส่เนื้อหาให้แม่นยำขึ้น
        const festivalContainer = container.querySelector('#festival-content .clone-main-content') || container.querySelector('.clone-main-content');
        
        if (!festivalContainer) return;

        try {
            // 2. ป้องกันข้อมูลค้างจาก Cache
            const response = await fetch('backend.php?action=get_front_events&t=' + new Date().getTime());
            const result = await response.json();
            
            if (result.status === 'success' && result.data.length > 0) {
                festivalContainer.innerHTML = ''; // เคลียร์ของเก่า
                const events = result.data;
                window.frontendEvents = events; 
                
                const hiddenContainer = document.getElementById('hidden-card-content');
                
                events.forEach((event) => {
                    if (!event.title || event.title.trim() === '') return; 
                    
                    // 3. แก้บั๊กเรื่องวันที่ใน Safari/iOS (เปลี่ยน - เป็น /)
                    const safeStartDate = event.start_date.replace(/-/g, "/");
                    const startD = new Date(safeStartDate);
                    
                    const endStr = event.end_date && event.end_date !== '0000-00-00 00:00:00' ? event.end_date : event.start_date;
                    const safeEndDate = endStr.replace(/-/g, "/");
                    const endD = new Date(safeEndDate);
                    
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
                                    const dObj = new Date(dateStr.replace(/-/g, "/"));
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
        } catch (error) { 
            console.error('Error fetching events:', error); 
        }
    }
};