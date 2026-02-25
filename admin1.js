// =====================================================================
// --- 8. Courses Library Logic ---
// =====================================================================
window.croppedImagesData = window.croppedImagesData || {}; 
let allCourses = [];

async function fetchCourses() {
    try {
        const res = await fetch(getApiUrl('get_all_courses'));
        const result = await res.json();
        allCourses = Array.isArray(result.data) ? result.data : [];
    } catch(e) { allCourses = []; }
    
    renderCourseTable(); 
    renderCourseGrid();
}

function renderCourseTable() {
    const tbody = document.getElementById('course-table-body');
    if(!tbody) return;
    tbody.innerHTML = '';
    
    if(allCourses.length === 0) { 
        tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-gray-500 font-medium">ยังไม่มีข้อมูลคอร์สเรียน</td></tr>'; 
        return; 
    }

    let items = [...allCourses];
    items.sort((a, b) => (parseInt(a.slot_number) || parseInt(a.id)) - (parseInt(b.slot_number) || parseInt(b.id)));

    items.forEach((c, index) => {
        const slotNum = c.slot_number || (index + 1);
        tbody.innerHTML += `
            <tr class="border-b hover:bg-gray-50 transition-colors">
                <td class="p-4 font-bold text-[#10a349]">ช่องที่ ${slotNum}</td>
                <td class="p-4 font-bold text-gray-800">${c.title || 'Untitled'}</td>
                <td class="p-4 text-sm text-gray-600">${c.creator || '-'}</td>
                <td class="p-4 text-right">
                    <button type="button" onclick="clickCourseSlot(${slotNum}, ${c.id})" class="bg-black text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-gray-800 transition shadow-sm">
                        ✏️ แก้ไขข้อมูล
                    </button>
                </td>
            </tr>
        `;
    });
}

window.renderCourseGrid = function() {
    const container = document.getElementById('course-grid-container');
    if(!container) return;
    container.innerHTML = '';
    
    let items = [...allCourses];
    items.sort((a, b) => (parseInt(a.slot_number) || parseInt(a.id)) - (parseInt(b.slot_number) || parseInt(b.id)));

    items.forEach((item, index) => {
        const slotNum = item.slot_number || (index + 1); 
        const imgUrl = item.banner_image || `https://placehold.co/1200x400/10a349/fff?text=Course`;
        const displayTitle = item.title || 'Untitled Course';

        // 🌟 ตั้งค่าให้ "ช่องที่ 1" หรือกล่องแรก มีขนาดใหญ่พาดเต็มแถว
        const isMainSlot = (slotNum == 1 || index === 0);
        const gridClass = isMainSlot ? 'col-span-1 sm:col-span-2 md:col-span-3 md:aspect-[21/9]' : 'aspect-video';
        const titleSize = isMainSlot ? 'text-3xl md:text-5xl' : 'text-xl';
        const badgeText = isMainSlot ? `⭐ ช่องที่ ${slotNum} (คอร์สหลัก)` : `ช่องที่ ${slotNum}`;

        container.innerHTML += `
            <div data-id="${item.id}" class="course-card ${gridClass} group relative rounded-[1.5rem] overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition bg-black flex flex-col justify-end">
                <div class="drag-handle absolute top-3 left-3 bg-black/50 backdrop-blur-md p-2 rounded-full cursor-grab hover:bg-[#10a349] z-30 transition" title="กดค้างเพื่อลากสลับตำแหน่ง">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" /></svg>
                </div>
                <span class="slot-badge absolute top-3 right-3 bg-white/20 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md border border-white/30 z-20 pointer-events-none">${badgeText}</span>
                <div onclick="clickCourseSlot(${slotNum}, ${item.id})" class="absolute inset-0 z-10 cursor-pointer"></div>
                <img src="${imgUrl}" class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
                <div class="relative z-10 p-5 w-full pr-10 pointer-events-none">
                    <h3 class="font-extrabold ${titleSize} leading-[1.2] text-white break-words w-full whitespace-normal line-clamp-2">${displayTitle}</h3>
                    <p class="text-white/80 text-sm mt-1 truncate">By ${item.creator || '-'}</p>
                </div>
            </div>
        `;
    });

    const nextSlot = items.length > 0 ? (Math.max(...items.map(i => parseInt(i.slot_number) || 0)) + 1) : 1;
    const isNextMain = (nextSlot === 1);
    const nextGridClass = isNextMain ? 'col-span-1 sm:col-span-2 md:col-span-3 md:aspect-[21/9]' : 'aspect-video';

    container.innerHTML += `
        <div onclick="clickCourseSlot(${nextSlot}, null)" class="ignore-drag cursor-pointer ${nextGridClass} rounded-[1.5rem] border-2 border-dashed border-green-400 text-green-600 bg-green-50 hover:bg-green-100 flex flex-col items-center justify-center transition shadow-sm">
            <span class="text-5xl font-light mb-1">+</span>
            <span class="font-bold text-sm">เพิ่มคอร์สใหม่</span>
        </div>
    `;

    if (typeof Sortable !== 'undefined') {
        if (window.courseSortable) window.courseSortable.destroy();
        window.courseSortable = new Sortable(container, {
            animation: 200,
            handle: '.drag-handle',
            ghostClass: 'opacity-40',
            filter: '.ignore-drag',
            onEnd: function () { updateCourseOrderUI(); }
        });
    }
};

window.updateCourseOrderUI = async function() {
    const cards = document.querySelectorAll('#course-grid-container .course-card');
    const newOrder = [];
    
    cards.forEach((card, index) => {
        const newSlot = index + 1;
        newOrder.push({ id: card.getAttribute('data-id'), slot_number: newSlot });
        const badge = card.querySelector('.slot-badge');
        if(badge) badge.innerText = newSlot === 1 ? `⭐ ช่องที่ 1 (คอร์สหลัก)` : `ช่องที่ ${newSlot}`;
    });

    try {
        const formData = new FormData();
        formData.append('order_data', JSON.stringify(newOrder));
        const res = await fetch(getApiUrl('update_course_order'), fetchOptions('POST', formData));
        const result = await res.json();
        if (result.status === 'success') {
            showToast('สลับตำแหน่งคอร์สเรียบร้อย! 🔄');
            fetchCourses(); 
        }
    } catch(e) {}
};

window.clickCourseSlot = async (slotNum, id) => {
    const formTitle = document.getElementById('course-form-title');
    const formContainer = document.getElementById('course-form-container');
    document.getElementById('edit-course-slot').value = slotNum;
    
    if(formContainer) formContainer.classList.remove('hidden');
    
    if (id) {
        document.getElementById('edit-course-id').value = id;
        if(formTitle) formTitle.textContent = `✏️ แก้ไขคอร์สเรียน ช่องที่ ${slotNum}`;
        await loadCourseData(id);
    } else {
        document.getElementById('edit-course-id').value = '';
        if(formTitle) formTitle.textContent = `✨ เพิ่มคอร์สเรียนใหม่ ช่องที่ ${slotNum}`;
        clearCourseForm();
    }
    if(formContainer) formContainer.scrollIntoView({behavior: 'smooth', block: 'center'});
};

window.clearCourseForm = () => {
    document.getElementById('edit-course-id').value = '';
    document.getElementById('course-title').value = '';
    document.getElementById('course-creator').value = '';
    document.getElementById('course-content-container').innerHTML = '';
    addCourseContent('text');

    const imgEl = document.getElementById('course-banner-img');
    if(imgEl) imgEl.src = 'https://placehold.co/1200x400/b2b2b2/000?text=No+Banner';
    window.croppedImagesData = {};
};

window.closeCourseForm = () => {
    const formContainer = document.getElementById('course-form-container');
    if(formContainer) formContainer.classList.add('hidden');
    clearCourseForm();
};

async function loadCourseData(id) {
    showToast('กำลังดึงข้อมูล...');
    try {
        const res = await fetch(getApiUrl(`get_course_details&id=${id}&t=${new Date().getTime()}`));
        const result = await res.json();
        if(result.status === 'success') {
            const c = result.data;
            document.getElementById('course-title').value = c.title || '';
            document.getElementById('course-creator').value = c.creator || '';
            const imgEl = document.getElementById('course-banner-img');
            if(imgEl) imgEl.src = c.banner_image || 'https://placehold.co/1200x400/b2b2b2/000?text=No+Banner';
            
            const container = document.getElementById('course-content-container');
            container.innerHTML = '';
            
            if(c.details) {
                try {
                    let detailsArray = typeof c.details === 'string' ? JSON.parse(c.details) : c.details;
                    
                  if(Array.isArray(detailsArray) && detailsArray.length > 0) {
                        detailsArray.forEach(item => {
                            addCourseContent(item.type, item.value, item.layout || 'col-1'); // 🌟 แก้บรรทัดนี้
                        });
                    } else {
                        addCourseContent('text');
                    }
                } catch(e) { 
                    console.error('Parse Details Error:', e);
                    addCourseContent('text'); 
                }
            } else {
                addCourseContent('text');
            }
        }
    } catch(e) { showToast('ดึงข้อมูลล้มเหลว'); }
}

let courseImgCounter = 0;

// 🌟 เปลี่ยนบรรทัดแรกให้รับค่า layout
window.addCourseContent = (type, value = '', layout = 'col-1') => {
    const container = document.getElementById('course-content-container');
    const itemDiv = document.createElement('div');
    itemDiv.className = 'relative course-item border border-gray-400 p-1 rounded-[1.2rem] bg-white shadow-sm mb-4';
    itemDiv.setAttribute('data-type', type);
    
    const deleteBtn = `<button type="button" onclick="this.parentElement.remove()" class="absolute -top-3 -right-3 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold shadow hover:bg-red-600 transition z-50 text-xs">✕</button>`;

    if (type === 'text') {
        itemDiv.innerHTML = deleteBtn + `<textarea class="w-full border-none px-4 py-3 outline-none focus:ring-0 rounded-[1.2rem] min-h-[120px] course-text-input text-sm font-semibold placeholder-gray-400" placeholder="รายละเอียดคอร์ส...."></textarea>`;
        itemDiv.querySelector('.course-text-input').value = value;
        
    } else if (type === 'image') {
        courseImgCounter++;
        const previewId = `course-img-preview-${courseImgCounter}`;
        const inputId = `course-img-input-${courseImgCounter}`;
        const imgDisplay = value ? value : 'https://placehold.co/800x400/e5e7eb/a3a3a3?text=Click+to+Add+Image';
        
        // 🌟 แก้ไข: จัดให้ Dropdown และปุ่มเลือกรูป อยู่ข้างกันตรงกลาง (เป็นทรงแคปซูลคู่กัน)
        itemDiv.innerHTML = deleteBtn + `
            <div class="relative rounded-xl overflow-hidden bg-[#b2b2b2] h-56 group flex items-center justify-center m-1 border border-gray-300">
                <img id="${previewId}" src="${imgDisplay}" class="w-full h-full object-contain relative z-0">
                
                <div class="absolute inset-0 bg-black/40 flex flex-row items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    
                    <select class="course-img-layout bg-white/90 text-gray-800 text-sm font-bold px-4 py-2.5 rounded-full shadow-md outline-none cursor-pointer hover:bg-white transition text-center text-center appearance-none">
                        <option value="col-1" ${layout === 'col-1' ? 'selected' : ''}>เต็มหน้า (1 รูป)</option>
                        <option value="col-2" ${layout === 'col-2' ? 'selected' : ''}>ครึ่งหน้า (2 รูป/แถว)</option>
                        <option value="col-3" ${layout === 'col-3' ? 'selected' : ''}>1/3 หน้า (3 รูป/แถว)</option>
                        <option value="col-4" ${layout === 'col-4' ? 'selected' : ''}>1/4 หน้า (4 รูป/แถว)</option>
                    </select>

                    <label class="bg-white/90 text-gray-800 text-sm font-bold px-4 py-2.5 rounded-full shadow-md hover:bg-white transition cursor-pointer m-0 flex items-center">
                        📷 เลือกรูปภาพ / Crop
                        <input type="file" id="${inputId}" class="hidden course-img-input" accept="image/*" onchange="previewImage(this, '${previewId}', NaN)">
                        <input type="hidden" class="course-img-old" value="${value}">
                    </label>

                </div>
            </div>
        `;
        
    } else if (type === 'video') {
        itemDiv.innerHTML = deleteBtn + `<input type="text" class="w-full border-none px-4 py-3 outline-none focus:ring-0 rounded-[1.2rem] course-video-input text-sm font-semibold placeholder-gray-400" placeholder="Link to your Video / Youtube / Vimeo">`;
        itemDiv.querySelector('.course-video-input').value = value;
    }
    container.appendChild(itemDiv);
};

window.saveCourse = async () => {
    try {
        const formData = new FormData();
        const courseId = document.getElementById('edit-course-id').value;
        if (courseId) formData.append('course_id', courseId);
        
        formData.append('slot_number', document.getElementById('edit-course-slot').value);
        formData.append('title', document.getElementById('course-title').value);
        formData.append('creator', document.getElementById('course-creator').value);
        
        window.croppedImagesData = window.croppedImagesData || {};
        const bannerFile = window.croppedImagesData['course-banner'] || document.getElementById('course-banner').files[0];
        if(bannerFile) formData.append('banner_image', bannerFile, window.croppedImagesData['course-banner'] ? 'banner.jpg' : bannerFile.name);

        const contentItems = document.querySelectorAll('.course-item');
        contentItems.forEach((item, index) => {
            const type = item.getAttribute('data-type');
            formData.append('content_types[]', type);
            
            // 🌟 เพิ่มการดึงค่าจาก Dropdown
            const layoutSelect = item.querySelector('.course-img-layout');
            formData.append('content_layouts[]', layoutSelect ? layoutSelect.value : 'col-1');
            
            if (type === 'text') {
                formData.append('content_values[]', item.querySelector('.course-text-input').value);
            } else if (type === 'video') {
                formData.append('content_values[]', item.querySelector('.course-video-input').value);
            } else if (type === 'image') {
                const fileInput = item.querySelector('.course-img-input');
                const oldInput = item.querySelector('.course-img-old');
                
                if (fileInput && fileInput.id && window.croppedImagesData[fileInput.id]) {
                    formData.append(`content_images_${index}`, window.croppedImagesData[fileInput.id], 'course_img.jpg');
                    formData.append('content_values[]', `has_image`);
                } else if (fileInput && fileInput.files[0]) {
                    formData.append(`content_images_${index}`, fileInput.files[0]);
                    formData.append('content_values[]', `has_image`);
                } else {
                    formData.append('content_values[]', oldInput ? oldInput.value : '');
                }
            }
        });

        showToast('กำลังบันทึกข้อมูล Course...');
        const response = await fetch(getApiUrl('save_course'), fetchOptions('POST', formData));
        const result = await response.json();
        
        if (result.status === 'success') {
            showToast('บันทึกคอร์สเรียนสำเร็จ!');
            fetchCourses();
            closeCourseForm();
        } else { showToast('ข้อผิดพลาด: ' + result.message); }
    } catch (error) { showToast('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'); }
};

window.deleteTargetCourse = async (id) => {
    if(!id) return showToast('ยังไม่มีข้อมูลให้ลบ');
    if(!confirm('แน่ใจหรือไม่ที่จะลบคอร์สนี้?')) return;
    const fd = new FormData(); fd.append('course_id', id);
    try {
        const res = await fetch(getApiUrl('delete_course'), fetchOptions('POST', fd));
        const result = await res.json();
        showToast(result.message);
        if(result.status === 'success') { fetchCourses(); closeCourseForm(); }
    } catch(e) {}
};

// =====================================================================
// --- 9. CMBigband Logic ---
// =====================================================================
window.saveCMBigband = async () => {
    try {
        const formData = new FormData();
        formData.append('title', document.getElementById('cmb-title').value);
        formData.append('genre', document.getElementById('cmb-genre').value);
        formData.append('facebook', document.getElementById('cmb-fb').value);
        formData.append('whatsapp', document.getElementById('cmb-wa').value);
        formData.append('instagram', document.getElementById('cmb-ig').value);
        formData.append('website', document.getElementById('cmb-web').value);
        formData.append('tiktok', document.getElementById('cmb-tk').value);
        formData.append('email', document.getElementById('cmb-email').value);
        formData.append('details', document.getElementById('cmb-details').value);

        const videoInputs = document.querySelectorAll('.cmb-video');
        videoInputs.forEach(input => { if(input.value.trim()) formData.append('video_links[]', input.value.trim()); });

        const bannerFile = document.getElementById('cmb-banner').files[0];
        const profileFile = document.getElementById('cmb-profile').files[0];
        
        if(bannerFile) formData.append('banner_image', bannerFile);
        if(profileFile) formData.append('profile_image', profileFile);

        showToast('กำลังบันทึกข้อมูล CMBigband...');
        const response = await fetch(getApiUrl('save_cmbigband'), fetchOptions('POST', formData));
        const result = await response.json();
        
        if (result.status === 'success') {
            showToast('บันทึกข้อมูลสำเร็จ!');
            const section = document.getElementById('section-cmbigband');
            section.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), textarea').forEach(el => el.value = '');
            section.querySelectorAll('.upload-box').forEach(el => { el.style.backgroundImage = ''; const span = el.querySelector('span'); if(span) span.classList.remove('bg-black/60', 'text-white', 'px-4', 'py-2', 'rounded-full'); });
            
            document.getElementById('cmb-video-container').innerHTML = `<div class="flex gap-4"><input type="text" class="input-style flex-1 cmb-video" placeholder="Link to your Video / Youtube / Vimeo"><button type="button" onclick="addVideoRow('cmb-video-container', 'cmb-video')" class="bg-yellow-500 text-black px-8 py-2 rounded-full font-bold shadow hover:bg-yellow-600">Add</button></div>`;
            document.getElementById('main-content').scrollTop = 0;
        } else { showToast('ข้อผิดพลาด: ' + result.message); }
    } catch(e) { showToast('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'); }
};

// =====================================================================
// --- INITIALIZE SCRIPT ---
// =====================================================================
document.addEventListener("DOMContentLoaded", () => {
    // โหลดข้อมูลเมื่อเปิดหน้าเว็บ
    fetchCourses();
});