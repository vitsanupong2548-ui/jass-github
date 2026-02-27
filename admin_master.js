// =====================================================================
// --- 0. API Config, Utility & Lang Switcher ---
// =====================================================================
const getApiUrl = (action) => 'backend.php?action=' + action;
const fetchOptions = (method, body = null) => {
    const opts = { method: method };
    if (body) opts.body = body;
    opts.credentials = 'include'; 
    return opts;
};

window.showToast = (message) => {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div'); 
    toast.className = 'toast'; 
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
};

// 🌟 ระบบสลับภาษาหน้าแอดมิน
window.currentAdminLang = 'en'; 
window.switchAdminLang = function(btn, lang, formType) {
    const container = btn.closest('.content-section');
    const btns = container.querySelectorAll(`.admin-lang-btn[data-form="${formType}"]`);
    btns.forEach(b => {
        b.classList.remove('text-red-500', 'border-b-2', 'border-red-500');
        b.classList.add('text-gray-400');
    });
    btn.classList.remove('text-gray-400');
    btn.classList.add('text-red-500', 'border-b-2', 'border-red-500');
    
    window.currentAdminLang = lang;
    
    if (lang === 'th') {
        container.querySelectorAll('.lang-en').forEach(el => el.classList.add('hidden'));
        container.querySelectorAll('.lang-th').forEach(el => el.classList.remove('hidden'));
    } else {
        container.querySelectorAll('.lang-th').forEach(el => el.classList.add('hidden'));
        container.querySelectorAll('.lang-en').forEach(el => el.classList.remove('hidden'));
    }
};

// =====================================================================
// --- 1. Login / Register & Nav ---
// =====================================================================
const loginScreen = document.getElementById('login-screen');
const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');

document.getElementById('show-register')?.addEventListener('click', () => { loginContainer.classList.add('hidden'); registerContainer.classList.remove('hidden'); });
document.getElementById('show-login')?.addEventListener('click', () => { registerContainer.classList.add('hidden'); loginContainer.classList.remove('hidden'); });

document.getElementById('register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', document.getElementById('reg-username').value);
    formData.append('email', document.getElementById('reg-email').value);
    formData.append('password', document.getElementById('reg-password').value);
    try {
        const response = await fetch(getApiUrl('register'), fetchOptions('POST', formData));
        const result = await response.json();
        showToast(result.message);
        if (result.status === 'success') { document.getElementById('register-form').reset(); document.getElementById('show-login').click(); }
    } catch (error) { showToast('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'); }
});

document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', document.getElementById('username').value);
    formData.append('password', document.getElementById('password').value);
    try {
        const response = await fetch(getApiUrl('login'), fetchOptions('POST', formData));
        const result = await response.json();
        if (result.status === 'success') {
            loginScreen.classList.add('hidden'); sidebar.classList.remove('hidden'); mainContent.classList.remove('hidden');
            showToast('เข้าสู่ระบบสำเร็จ'); switchTab('section-admin'); fetchUsers(); 
        } else { showToast('ข้อผิดพลาด: ' + result.message); }
    } catch (error) { showToast('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'); }
});

// --- โค้ดปุ่มออกจากระบบ (แบบใหม่ เคลียร์ Session แล้วเด้งกลับหน้าแรก) ---
document.getElementById('logout-btn')?.addEventListener('click', async () => {
    try {
        await fetch(getApiUrl('logout')); // สั่งให้ Backend ยกเลิกการล็อกอิน
        window.location.href = 'index2.html'; // เด้งกลับหน้าเว็บหลัก
    } catch(e) {
        window.location.href = 'index2.html';
    }
});

// --- สั่งให้โหลดตารางข้อมูลผู้ใช้งานทันทีที่เปิดหน้า Admin ---
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
});

const navLinks = document.querySelectorAll('.nav-link');
function switchTab(targetId) {
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.add('hidden'));
    const target = document.getElementById(targetId);
    if(target) target.classList.remove('hidden');
    navLinks.forEach(link => {
        link.classList.remove('bg-gray-100', 'bg-blue-100', 'bg-yellow-100', 'bg-green-100', 'bg-gray-200', 'bg-orange-100', 'bg-pink-100'); // <--- เพิ่มสีใหม่ตรงนี้
        if(link.getAttribute('data-target') === targetId) {
            if(targetId.includes('festival')) link.classList.add('bg-blue-100');
            else if(targetId.includes('admin')) link.classList.add('bg-gray-100');
            else if(targetId.includes('musician')) link.classList.add('bg-yellow-100');
            else if(targetId.includes('courses')) link.classList.add('bg-green-100');
            else if(targetId.includes('cmbigband')) link.classList.add('bg-gray-200');
            else if(targetId.includes('forum')) link.classList.add('bg-orange-100'); // 🌟 เพิ่มสีสำหรับ Forum
            else if(targetId.includes('store')) link.classList.add('bg-pink-100');   // 🌟 เพิ่มสีสำหรับ Store
            else link.classList.add('bg-gray-100');
        }
    });
}
navLinks.forEach(link => { 
    link.addEventListener('click', (e) => { 
        e.preventDefault(); const target = link.getAttribute('data-target'); switchTab(target); 
        if(target === 'section-admin') fetchUsers(); 
        if(target === 'section-festival') fetchEvents();
        if(target === 'section-musician') fetchMusicians();
        if(target === 'section-courses') fetchCourses();
        if(target === 'section-cmbigband') loadCmbData();
        if(target === 'section-forum') fetchAdminForumTopics();
    }); 
});

// =====================================================================
// --- 2. Image Cropper Global Logic ---
// =====================================================================
let cropper = null; let currentCropInputId = null; let currentCropContainerId = null; window.croppedImagesData = {};
window.previewImage = (input, imgId, aspectRatio = NaN) => {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('cropper-modal').classList.remove('hidden');
            const imageEl = document.getElementById('cropper-image'); imageEl.src = e.target.result;
            currentCropInputId = input.id; currentCropContainerId = imgId; 
            if (cropper) cropper.destroy();
            cropper = new Cropper(imageEl, { aspectRatio: aspectRatio, viewMode: 1, autoCropArea: 1 });
        }
        reader.readAsDataURL(input.files[0]);
    }
};

window.closeCropperModal = () => { document.getElementById('cropper-modal').classList.add('hidden'); if (cropper) cropper.destroy(); const input = document.getElementById(currentCropInputId); if (input) input.value = ''; };

window.applyCrop = () => {
    if (!cropper) return;
    cropper.getCroppedCanvas({ maxWidth: 1920, maxHeight: 1920 }).toBlob((blob) => {
        window.croppedImagesData[currentCropInputId] = blob;
        const previewUrl = URL.createObjectURL(blob); 
        const imgEl = document.getElementById(currentCropContainerId);
        if(imgEl && imgEl.tagName === 'IMG') { imgEl.src = previewUrl; }
        document.getElementById('cropper-modal').classList.add('hidden'); cropper.destroy(); cropper = null;
    }, 'image/jpeg', 0.90); 
};

let globalGalleryFiles = new DataTransfer(); 
window.previewGalleryImages = (input) => {
    if (input.files && input.files.length > 0) { 
        Array.from(input.files).forEach(file => { if (globalGalleryFiles.files.length < 10) globalGalleryFiles.items.add(file); }); 
        input.value = ''; renderGalleryPreviews(); 
    }
};

function renderGalleryPreviews() {
    const wrapper = document.getElementById('gallery-previews-wrapper'); if(!wrapper) return;
    wrapper.innerHTML = ''; 
    Array.from(globalGalleryFiles.files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewDiv = document.createElement('div'); previewDiv.className = 'w-32 h-32 rounded-lg bg-cover bg-center shrink-0 shadow-sm border border-gray-200 relative group'; previewDiv.style.backgroundImage = `url('${e.target.result}')`;
            const removeBtn = document.createElement('button'); removeBtn.innerHTML = '✕'; removeBtn.className = 'absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow hover:bg-red-700';
            removeBtn.onclick = (e) => { e.preventDefault(); window.removeGalleryImage(index); }; previewDiv.appendChild(removeBtn); wrapper.appendChild(previewDiv);
        }
        reader.readAsDataURL(file);
    });
}
window.removeGalleryImage = (idxToRemove) => { const dt = new DataTransfer(); Array.from(globalGalleryFiles.files).forEach((file, idx) => { if (idx !== idxToRemove) dt.items.add(file); }); globalGalleryFiles = dt; renderGalleryPreviews(); };


// =====================================================================
// --- 3. User Management ---
// =====================================================================
let allUsersData = []; let selectedUserId = null; 
async function fetchUsers() {
    try { const res = await fetch(getApiUrl('get_users')); const result = await res.json(); if (result.status === 'success') { allUsersData = result.data; renderUserTable(allUsersData); } } catch (e) {}
}
function renderUserTable(usersArray) {
    const tbody = document.getElementById('user-table-body'); if (!tbody) return; tbody.innerHTML = ''; selectedUserId = null; updateActionButtons(null);
    if (usersArray.length === 0) { tbody.innerHTML = `<tr><td colspan="3" class="p-8 text-center text-gray-500 font-medium">ไม่พบข้อมูล</td></tr>`; return; }
    usersArray.forEach(user => {
        const tr = document.createElement('tr'); tr.className = 'border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200 user-row cursor-pointer'; tr.setAttribute('data-id', user.id);
        tr.addEventListener('click', function() { selectUserRow(this, user); });
        let roleBadge = user.role === 'admin' ? `<span class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Admin</span>` : `<span class="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">User</span>`;
        tr.innerHTML = `<td class="p-4 text-center font-bold text-gray-500">${user.id}</td><td class="p-4"><div class="font-extrabold text-base text-black">${user.username}</div><div class="text-xs text-gray-500 font-medium mt-0.5">${user.email}</div></td><td class="p-4 text-center">${roleBadge}</td>`;
        tbody.appendChild(tr);
    });
}
function selectUserRow(rowElement, userData) {
    document.querySelectorAll('.user-row').forEach(row => { row.classList.remove('bg-blue-100', 'border-l-4', 'border-blue-500'); });
    rowElement.classList.add('bg-blue-100', 'border-l-4', 'border-blue-500'); selectedUserId = userData.id; updateActionButtons(userData);
}
function updateActionButtons(userData) {
    const btnPwd = document.getElementById('btn-action-password'); const btnDel = document.getElementById('btn-action-delete'); const statusEl = document.getElementById('user-selection-status');
    if(btnPwd && btnDel && statusEl) {
        if (selectedUserId && userData) { btnPwd.disabled = false; btnPwd.classList.remove('opacity-50', 'cursor-not-allowed'); btnDel.disabled = false; btnDel.classList.remove('opacity-50', 'cursor-not-allowed'); statusEl.innerHTML = `เลือกผู้ใช้งาน: <span class="text-blue-600 font-bold">${userData.username}</span> (ID: ${userData.id})`; } 
        else { btnPwd.disabled = true; btnPwd.classList.add('opacity-50', 'cursor-not-allowed'); btnDel.disabled = true; btnDel.classList.add('opacity-50', 'cursor-not-allowed'); statusEl.innerHTML = 'ยังไม่ได้เลือกผู้ใช้งาน'; }
    }
}
document.getElementById('user-search-input')?.addEventListener('input', (e) => { const searchTerm = e.target.value.toLowerCase().trim(); renderUserTable(allUsersData.filter(user => (user.username && user.username.toLowerCase().includes(searchTerm)) || (user.email && user.email.toLowerCase().includes(searchTerm)))); });
document.getElementById('btn-action-password')?.addEventListener('click', () => { if (selectedUserId) { passwordTargetId = selectedUserId; document.getElementById('new-password-input').value = ''; document.getElementById('password-modal').classList.remove('hidden'); } });
document.getElementById('btn-action-delete')?.addEventListener('click', () => { if (selectedUserId) { deleteTargetId = selectedUserId; document.getElementById('confirm-modal').classList.remove('hidden'); } });

let deleteTargetId = null;
window.closeConfirmModal = () => { deleteTargetId = null; document.getElementById('confirm-modal').classList.add('hidden'); };
document.getElementById('confirm-delete-btn')?.addEventListener('click', async () => {
    if(!deleteTargetId) return;
    try { const fd = new FormData(); fd.append('user_id', deleteTargetId); const res = await fetch(getApiUrl('delete_user'), fetchOptions('POST', fd)); const result = await res.json(); if (result.status === 'success') { showToast(result.message); fetchUsers(); } } catch(error) {}
    window.closeConfirmModal();
});
let passwordTargetId = null;
window.closePasswordModal = () => { passwordTargetId = null; document.getElementById('password-modal').classList.add('hidden'); };
document.getElementById('save-password-btn')?.addEventListener('click', async () => {
    const newPass = document.getElementById('new-password-input').value; if(!newPass) return showToast('กรุณากรอกรหัสผ่าน');
    try { const fd = new FormData(); fd.append('user_id', passwordTargetId); fd.append('new_password', newPass); const res = await fetch(getApiUrl('update_password'), fetchOptions('POST', fd)); const result = await res.json(); showToast(result.message); } catch(error) {}
    window.closePasswordModal();
});


// =====================================================================
// --- 4. Event & Festival (Bilingual) ---
// =====================================================================
let selectedEventId = null; let pendingTickets = []; let pendingLineups = [];

async function fetchEvents() {
    try {
        const res = await fetch(getApiUrl('get_all_events')); const result = await res.json();
        const tbody = document.getElementById('event-table-body'); tbody.innerHTML = ''; selectedEventId = null;
        document.getElementById('external-delete-btn')?.classList.add('hidden'); document.getElementById('external-edit-btn')?.classList.add('hidden');
        if(result.status === 'success') {
            if(result.data.length === 0) { tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-gray-500">ไม่มีข้อมูล Event</td></tr>'; return; }
            result.data.forEach(ev => {
                const endStr = ev.end_date && ev.end_date !== '0000-00-00 00:00:00' ? ev.end_date : ev.start_date;
                const endDate = new Date(endStr); const today = new Date(); today.setHours(0,0,0,0);
                let statusHtml = endDate >= today ? '<span class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Active</span>' : '<span class="px-2 py-1 bg-gray-200 text-gray-500 rounded text-xs font-bold">Ended</span>';
                tbody.innerHTML += `<tr class="border-b hover:bg-gray-100 cursor-pointer transition-colors event-row" onclick="selectEventRow(${ev.id}, this)"><td class="p-4 text-gray-500">${ev.id}</td><td class="p-4 font-bold text-gray-800">${ev.title}</td><td class="p-4 text-sm text-gray-600">${ev.start_date ? ev.start_date.split(' ')[0] : ''}</td><td class="p-4">${statusHtml}</td></tr>`;
            });
        }
    } catch (error) {}
}

window.selectEventRow = function(id, rowElement) {
    document.querySelectorAll('.event-row').forEach(row => { row.classList.remove('bg-blue-50'); row.classList.add('hover:bg-gray-100'); });
    rowElement.classList.remove('hover:bg-gray-100'); rowElement.classList.add('bg-blue-50');
    selectedEventId = id; document.getElementById('external-delete-btn')?.classList.remove('hidden'); document.getElementById('external-edit-btn')?.classList.remove('hidden');
};

window.editSelectedEvent = async () => {
    if(!selectedEventId) return;
    document.getElementById('form-section-title').textContent = 'กำลังแก้ไขข้อมูล Event ID: ' + selectedEventId;
    document.getElementById('form-section-title').classList.add('text-blue-600');
    document.getElementById('cancel-edit-btn').classList.remove('hidden');
    document.getElementById('edit-event-id').value = selectedEventId;
    showToast('กำลังดึงข้อมูล...');
    try {
        const url = getApiUrl(`get_event_details&id=${selectedEventId}&t=${new Date().getTime()}`);
        const response = await fetch(url); const result = await response.json();
        if (result.status === 'success') {
            const ev = result.data;
            document.getElementById('ev-title').value = ev.title || ''; document.getElementById('ev-title-th').value = ev.title_th || '';
            document.getElementById('ev-short-desc').value = ev.short_description || ''; document.getElementById('ev-short-desc-th').value = ev.short_description_th || '';
            document.getElementById('ev-details').value = ev.details || ''; document.getElementById('ev-details-th').value = ev.details_th || '';
            document.getElementById('venue-title').value = ev.venue_title || ''; document.getElementById('venue-title-th').value = ev.venue_title_th || '';
            document.getElementById('venue-details').value = ev.venue_details || ''; document.getElementById('venue-details-th').value = ev.venue_details_th || '';
            document.getElementById('ev-location').value = ev.location || ''; document.getElementById('venue-map').value = ev.venue_map || '';
            if(window.previewMap) window.previewMap(ev.venue_map || '');

            if (ev.start_date && ev.start_date !== '0000-00-00 00:00:00') { const parts = ev.start_date.split(' '); document.getElementById('ev-start-date').value = parts[0] || ''; document.getElementById('ev-start-time').value = parts[1] ? parts[1].substring(0, 5) : ''; }
            if (ev.end_date && ev.end_date !== '0000-00-00 00:00:00') { const parts = ev.end_date.split(' '); document.getElementById('ev-end-date').value = parts[0] || ''; document.getElementById('ev-end-time').value = parts[1] ? parts[1].substring(0, 5) : ''; }

            document.getElementById('event-banner-img').src = ev.banner_image || 'https://placehold.co/1200x400/e5e7eb/a3a3a3?text=Add+Banner';
            document.getElementById('event-poster-img').src = ev.poster_image || 'https://placehold.co/600x800/e5e7eb/a3a3a3?text=Add+Poster';
            document.getElementById('venue-photo-img').src = ev.venue_image || 'https://placehold.co/800x450/e5e7eb/a3a3a3?text=Add+Venue+Photo';

            pendingTickets = []; if (ev.tickets) { ev.tickets.forEach(t => pendingTickets.push({ title: t.title || '', details: t.details || '', price: t.price || 0, amount: t.amount || 0, status: t.is_open })); } renderPendingTickets();
            pendingLineups = []; if (ev.lineups) { ev.lineups.forEach(l => { pendingLineups.push({ date: l.lineup_date || '', time: l.lineup_time ? l.lineup_time.substring(0,5) : '', stage: l.lineup_stage || '', name: l.band_name || '' }); }); } renderPendingLineups();

            const galleryWrapper = document.getElementById('gallery-previews-wrapper'); galleryWrapper.innerHTML = ''; globalGalleryFiles = new DataTransfer(); 
            if (ev.gallery_images) {
                try {
                    const images = JSON.parse(ev.gallery_images);
                    if (Array.isArray(images)) {
                        images.forEach(imgUrl => {
                            const previewDiv = document.createElement('div'); previewDiv.className = 'w-32 h-32 rounded-lg bg-cover bg-center shrink-0 shadow-sm border border-gray-200 relative';
                            previewDiv.style.backgroundImage = `url('${imgUrl}')`; previewDiv.innerHTML = '<span class="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-2 py-0.5 rounded">รูปเดิม</span>';
                            galleryWrapper.appendChild(previewDiv);
                        });
                    }
                } catch(e) {}
            }
            document.getElementById('form-section-title').scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) { showToast('ไม่สามารถดึงข้อมูลได้'); }
};

window.cancelEditEvent = () => {
    document.getElementById('form-section-title').textContent = 'เพิ่มข้อมูล Event ใหม่';
    document.getElementById('form-section-title').classList.remove('text-blue-600');
    document.getElementById('edit-event-id').value = '';
    document.getElementById('cancel-edit-btn').classList.add('hidden');
    const section = document.getElementById('section-festival');
    section.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), textarea').forEach(el => el.value = '');
    
    document.getElementById('event-banner-img').src = 'https://placehold.co/1200x400/e5e7eb/a3a3a3?text=Add+Banner';
    document.getElementById('event-poster-img').src = 'https://placehold.co/600x800/e5e7eb/a3a3a3?text=Add+Poster';
    document.getElementById('venue-photo-img').src = 'https://placehold.co/800x450/e5e7eb/a3a3a3?text=Add+Venue+Photo';

    pendingTickets = []; renderPendingTickets(); pendingLineups = []; renderPendingLineups(); 
    globalGalleryFiles = new DataTransfer(); renderGalleryPreviews(); window.croppedImagesData = {};
    if(window.previewMap) window.previewMap('');
    showToast('ยกเลิกการแก้ไข');
};

window.deleteSelectedEvent = async () => {
    if(!selectedEventId) return;
    if(!confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูล Event นี้?')) return;
    try { const fd = new FormData(); fd.append('event_id', selectedEventId); const res = await fetch(getApiUrl('delete_event'), fetchOptions('POST', fd)); const result = await res.json(); showToast(result.message); if(result.status === 'success') { fetchEvents(); cancelEditEvent(); } } catch(e) { }
};

window.saveEvent = async () => {
    try {
        const formData = new FormData();
        formData.append('event_id', document.getElementById('edit-event-id').value);
        formData.append('title', document.getElementById('ev-title').value); formData.append('title_th', document.getElementById('ev-title-th').value);
        formData.append('short_description', document.getElementById('ev-short-desc').value); formData.append('short_description_th', document.getElementById('ev-short-desc-th').value);
        formData.append('details', document.getElementById('ev-details').value); formData.append('details_th', document.getElementById('ev-details-th').value);
        formData.append('venue_title', document.getElementById('venue-title').value); formData.append('venue_title_th', document.getElementById('venue-title-th').value);
        formData.append('venue_details', document.getElementById('venue-details').value); formData.append('venue_details_th', document.getElementById('venue-details-th').value);
        formData.append('location', document.getElementById('ev-location').value); formData.append('venue_map', document.getElementById('venue-map').value);

        let sd = document.getElementById('ev-start-date').value; let st = document.getElementById('ev-start-time').value; formData.append('start_date', sd ? `${sd} ${st}:00` : '');
        let ed = document.getElementById('ev-end-date').value; let et = document.getElementById('ev-end-time').value; formData.append('end_date', ed ? `${ed} ${et}:00` : '');

        if(pendingTickets.length > 0) { pendingTickets.forEach(t => { formData.append('ticket_titles[]', t.title); formData.append('ticket_details[]', t.details); formData.append('ticket_prices[]', t.price); formData.append('ticket_amounts[]', t.amount); formData.append('ticket_status[]', t.status); }); } 
        else { const tempTitle = document.getElementById('temp_ticket_title').value.trim(); if(tempTitle) { formData.append('ticket_titles[]', tempTitle); formData.append('ticket_details[]', document.getElementById('temp_ticket_details').value); formData.append('ticket_prices[]', document.getElementById('temp_ticket_price').value || 0); formData.append('ticket_amounts[]', document.getElementById('temp_ticket_amount').value || 0); formData.append('ticket_status[]', document.querySelector('input[name="temp_ticket_status"]:checked').value); } }
        
        if(pendingLineups.length > 0) { pendingLineups.forEach(l => { formData.append('lineup_dates[]', l.date); formData.append('lineup_times[]', l.time); formData.append('lineup_stages[]', l.stage); formData.append('lineup_names[]', l.name); }); }

        const bannerFile = (window.croppedImagesData && window.croppedImagesData['event-banner']) || document.getElementById('event-banner').files[0];
        const posterFile = (window.croppedImagesData && window.croppedImagesData['event-poster']) || document.getElementById('event-poster').files[0];
        const venueFile = (window.croppedImagesData && window.croppedImagesData['venue-photo']) || document.getElementById('venue-photo').files[0];
        if(bannerFile) formData.append('banner_image', bannerFile, window.croppedImagesData && window.croppedImagesData['event-banner'] ? 'banner.jpg' : bannerFile.name);
        if(posterFile) formData.append('poster_image', posterFile, window.croppedImagesData && window.croppedImagesData['event-poster'] ? 'poster.jpg' : posterFile.name);
        if(venueFile) formData.append('venue_image', venueFile, window.croppedImagesData && window.croppedImagesData['venue-photo'] ? 'venue.jpg' : venueFile.name);

        Array.from(globalGalleryFiles.files).forEach(file => { formData.append('gallery_images[]', file); });

        showToast('กำลังบันทึกข้อมูล Event...');
        const response = await fetch(getApiUrl('save_event'), fetchOptions('POST', formData));
        const result = await response.json();
        if (result.status === 'success') { showToast('บันทึกสำเร็จ!'); fetchEvents(); cancelEditEvent(); document.getElementById('main-content').scrollTop = 0; } else showToast('ข้อผิดพลาด: ' + result.message);
    } catch (error) { showToast('การเชื่อมต่อล้มเหลว'); }
};

window.addTicketToList = () => {
    const title = document.getElementById('temp_ticket_title').value.trim(); if (!title) { showToast('กรุณากรอกชื่อตั๋ว'); return; }
    pendingTickets.push({ title, details: document.getElementById('temp_ticket_details').value, price: document.getElementById('temp_ticket_price').value || 0, amount: document.getElementById('temp_ticket_amount').value || 0, status: document.querySelector('input[name="temp_ticket_status"]:checked').value });
    document.getElementById('temp_ticket_title').value = ''; document.getElementById('temp_ticket_details').value = ''; document.getElementById('temp_ticket_price').value = ''; document.getElementById('temp_ticket_amount').value = ''; document.querySelector('input[name="temp_ticket_status"][value="1"]').checked = true;
    renderPendingTickets();
};
function renderPendingTickets() {
    const c = document.getElementById('added-tickets-list'); c.innerHTML = '';
    if(pendingTickets.length > 0) c.innerHTML = `<h4 class="text-sm font-bold text-gray-600 mb-2">รายการตั๋วที่เตรียมบันทึก:</h4>`;
    pendingTickets.forEach((t, i) => { c.innerHTML += `<div class="bg-white border p-3 rounded flex justify-between items-center"><div><span class="font-bold text-blue-600">${t.title}</span> <span class="text-sm text-gray-500">(${t.price} THB / ${t.amount} ใบ)</span></div><button type="button" onclick="removePendingTicket(${i})" class="text-red-500 hover:text-red-700 bg-red-50 px-2 py-1 rounded font-bold">ลบ</button></div>`; });
}
window.removePendingTicket = (i) => { pendingTickets.splice(i, 1); renderPendingTickets(); };

window.addLineUpToList = () => {
    const date = document.getElementById('temp_lineup_date').value; const time = document.getElementById('temp_lineup_time').value; const stage = document.getElementById('temp_lineup_stage').value.trim(); const name = document.getElementById('temp_lineup_name').value.trim();
    if (!name) { showToast('กรุณาระบุชื่อศิลปิน'); return; }
    pendingLineups.push({ date, time, stage, name });
    document.getElementById('temp_lineup_time').value = ''; document.getElementById('temp_lineup_name').value = ''; renderPendingLineups();
};
function renderPendingLineups() {
    const c = document.getElementById('added-lineups-list'); c.innerHTML = '';
    if(pendingLineups.length > 0) c.innerHTML = `<h4 class="text-sm font-bold text-gray-600 mb-2">รายการ Line Up ที่เตรียมบันทึก:</h4>`;
    pendingLineups.forEach((l, i) => { c.innerHTML += `<div class="bg-white border p-3 rounded flex justify-between items-center"><div class="flex items-center gap-3"><div class="bg-black text-white text-xs px-2 py-1 rounded text-center"><div>${l.date}</div><div class="text-yellow-400 font-bold">${l.time||'??:??'}</div></div><div><span class="font-bold text-blue-900">${l.name}</span> <span class="bg-gray-200 text-xs px-2 rounded ml-2">${l.stage}</span></div></div><button type="button" onclick="removePendingLineup(${i})" class="text-red-500 hover:text-red-700 font-bold bg-red-50 px-2 py-1 rounded">ลบ</button></div>`; });
}
window.removePendingLineup = (i) => { pendingLineups.splice(i, 1); renderPendingLineups(); };
window.previewMap = (val) => { const c = document.getElementById('map-preview-container'); if(!c) return; if (val && val.includes('<iframe')) { c.innerHTML = val.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="200"'); c.classList.remove('hidden'); } else { c.innerHTML = ''; c.classList.add('hidden'); } };

// =====================================================================
// --- 5. Musicians Network (Bilingual) ---
// =====================================================================
let allMusicians = [];

window.switchMusicianTab = function(tabName) {
    document.getElementById('musician-artist-content').classList.toggle('hidden', tabName !== 'artist');
    document.getElementById('musician-jazz-content').classList.toggle('hidden', tabName !== 'jazz');
    document.getElementById('tab-btn-artist').className = tabName === 'artist' ? 'flex-1 bg-[#ffc107] text-black font-bold py-2 rounded-full shadow text-center transition' : 'flex-1 text-gray-500 font-bold py-2 rounded-full text-center hover:bg-gray-300 transition';
    document.getElementById('tab-btn-jazz').className = tabName === 'jazz' ? 'flex-1 bg-[#ffc107] text-black font-bold py-2 rounded-full shadow text-center transition' : 'flex-1 text-gray-500 font-bold py-2 rounded-full text-center hover:bg-gray-300 transition';
};

async function fetchMusicians() {
    try { const res = await fetch(getApiUrl('get_all_musicians')); const result = await res.json(); if(result.status === 'success') { allMusicians = result.data; } else { allMusicians = []; } } catch(e) { allMusicians = []; }
    renderMusicianTable(); renderGrid('artist-grid-container', 'artist_library', 'art', 'artist'); renderGrid('jazz-grid-container', 'jazz_network', 'jazz', 'jazz'); 
}

function renderMusicianTable() {
    const tbody = document.getElementById('musician-table-body'); if(!tbody) return; tbody.innerHTML = '';
    if(allMusicians.length === 0) { tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-gray-500">ยังไม่มีข้อมูล</td></tr>'; return; }
    allMusicians.forEach((m) => {
        const typeText = m.network_type === 'artist_library' ? '<span class="text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs font-bold shadow-sm">Artist Library</span>' : '<span class="text-blue-600 bg-blue-100 px-2 py-1 rounded text-xs font-bold shadow-sm">Jazz Network</span>';
        tbody.innerHTML += `<tr class="border-b hover:bg-gray-50 transition-colors musician-row"><td class="p-4 text-gray-500">ID: ${m.id} (ช่อง ${m.slot_number || '-'})</td><td class="p-4 font-bold text-gray-800">${m.title}</td><td class="p-4 text-sm text-gray-600">${m.genre || '-'}</td><td class="p-4">${typeText}</td></tr>`;
    });
}

window.renderGrid = function(containerId, networkType, prefix, typeName) {
    const container = document.getElementById(containerId); if(!container) return; container.innerHTML = '';
    let items = allMusicians.filter(m => m.network_type === networkType); items.sort((a, b) => parseInt(a.slot_number) - parseInt(b.slot_number));
    const emptyBoxClass = networkType === 'artist_library' ? 'border-[#ffc107] text-[#ffc107] bg-[#fffde7] hover:bg-[#fff9c4]' : 'border-blue-400 text-blue-500 bg-blue-50 hover:bg-blue-100';

    items.forEach((item, index) => {
        const slotNum = item.slot_number || (index + 1); const imgUrl = item.profile_image || `https://placehold.co/400x400/222/fff?text=No+Image`;
        container.innerHTML += `<div onclick="clickSlot(${slotNum}, ${item.id}, '${prefix}', '${typeName}')" class="cursor-pointer group relative rounded-[2rem] overflow-hidden aspect-square shadow-sm border hover:shadow-lg transition bg-black flex flex-col justify-end"><img src="${imgUrl}" class="absolute inset-0 w-full h-full object-cover bg-gray-900 opacity-80 group-hover:opacity-100 transition-opacity"><div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div><div class="relative z-10 p-6 w-full pr-12"><h3 class="font-extrabold text-2xl leading-[1.2] text-white line-clamp-3">${item.title || 'Untitled'}</h3><p class="text-white/80 text-xs mt-1">Slot: ${slotNum}</p></div></div>`;
    });
    const nextSlot = items.length > 0 ? Math.max(...items.map(i=>i.slot_number||0)) + 1 : 1;
    container.innerHTML += `<div onclick="clickSlot(${nextSlot}, null, '${prefix}', '${typeName}')" class="cursor-pointer rounded-[2rem] aspect-square border-2 border-dashed ${emptyBoxClass} flex flex-col items-center justify-center transition shadow-sm"><span class="text-5xl font-light mb-1">+</span><span class="font-bold text-sm">เพิ่มข้อมูลช่องที่ ${nextSlot}</span></div>`;
};

window.clickSlot = async (slotNum, id, prefix, typeName) => {
    const formTitle = document.getElementById(`${typeName}-form-title`); const formContainer = document.getElementById(`${typeName}-form-container`);
    document.getElementById(`edit-${typeName}-slot`).value = slotNum; if(formContainer) formContainer.classList.remove('hidden');
    
    if (id) {
        document.getElementById('edit-musician-id').value = id; if(formTitle) formTitle.textContent = `✏️ แก้ไขข้อมูล ช่องที่ ${slotNum}`;
        showToast('กำลังดึงข้อมูล...');
        try {
            const m = (await(await fetch(getApiUrl(`get_musician_details&id=${id}&t=${new Date().getTime()}`))).json()).data;
            document.getElementById(`${prefix}-title`).value = m.title || ''; document.getElementById(`${prefix}-title-th`).value = m.title_th || '';
            document.getElementById(`${prefix}-genre`).value = m.genre || ''; document.getElementById(`${prefix}-genre-th`).value = m.genre_th || '';
            document.getElementById(`${prefix}-details`).value = m.details || ''; document.getElementById(`${prefix}-details-th`).value = m.details_th || '';
            document.getElementById(`${prefix}-fb`).value = m.facebook || ''; document.getElementById(`${prefix}-wa`).value = m.whatsapp || '';
            document.getElementById(`${prefix}-ig`).value = m.instagram || ''; document.getElementById(`${prefix}-web`).value = m.website || '';
            document.getElementById(`${prefix}-tk`).value = m.tiktok || ''; document.getElementById(`${prefix}-email`).value = m.email || '';

            const bImg = document.getElementById(`${typeName}-banner-img`); const pImg = document.getElementById(`${typeName}-profile-img`);
            if(bImg) bImg.src = m.banner_image || 'https://placehold.co/1200x400/e5e7eb/a3a3a3?text=No+Banner';
            if(pImg) pImg.src = m.profile_image || 'https://placehold.co/600x600/e5e7eb/a3a3a3?text=No+Profile';

            const vCont = document.getElementById(`${prefix}-video-container`); vCont.innerHTML = '';
            let vids = []; try { vids = JSON.parse(m.video_link || '[]'); } catch(e){}
            if(vids.length === 0) vCont.innerHTML = `<div class="flex gap-3 items-center mt-2"><input type="text" class="w-full border border-gray-400 rounded-full px-5 py-2 outline-none focus:border-yellow-500 font-semibold text-sm ${prefix}-video" placeholder="Video Link"><button type="button" onclick="addVideoRow('${prefix}-video-container', '${prefix}-video')" class="bg-[#ffc107] px-6 py-2 rounded-full font-extrabold shadow-sm">Add</button></div>`;
            else { vids.forEach((v, i) => { vCont.innerHTML += `<div class="flex gap-3 items-center mt-2"><input type="text" class="w-full border border-gray-400 rounded-full px-5 py-2 outline-none focus:border-yellow-500 font-semibold text-sm ${prefix}-video" value="${v}">${i===0 ? `<button type="button" onclick="addVideoRow('${prefix}-video-container', '${prefix}-video')" class="bg-[#ffc107] px-6 py-2 rounded-full font-extrabold shadow-sm">Add</button>` : `<button type="button" onclick="this.parentElement.remove()" class="bg-red-500 text-white px-6 py-2 rounded-full font-bold shadow-sm">Del</button>`}</div>`; }); }
        } catch(e) {}
    } else { 
        document.getElementById('edit-musician-id').value = ''; if(formTitle) formTitle.textContent = `✨ เพิ่มข้อมูลใหม่ ช่องที่ ${slotNum}`;
        document.querySelectorAll(`#${typeName}-form-container input[type="text"], #${typeName}-form-container textarea`).forEach(e => e.value = ''); 
        const bImg = document.getElementById(`${typeName}-banner-img`); const pImg = document.getElementById(`${typeName}-profile-img`);
        if(bImg) bImg.src = 'https://placehold.co/1200x400/e5e7eb/a3a3a3?text=No+Banner';
        if(pImg) pImg.src = 'https://placehold.co/600x600/e5e7eb/a3a3a3?text=No+Profile';
        const vCont = document.getElementById(`${prefix}-video-container`);
        if(vCont) vCont.innerHTML = `<div class="flex gap-3 items-center mt-2"><input type="text" class="w-full border border-gray-400 rounded-full px-5 py-2 outline-none focus:border-yellow-500 font-semibold text-sm ${prefix}-video" placeholder="Video Link"><button type="button" onclick="addVideoRow('${prefix}-video-container', '${prefix}-video')" class="bg-[#ffc107] px-6 py-2 rounded-full font-extrabold shadow-sm">Add</button></div>`;
    }
    window.croppedImagesData = {};
    if(formContainer) formContainer.scrollIntoView({behavior: 'smooth', block: 'center'});
};

window.closeArtistForm = () => { document.getElementById('artist-form-container')?.classList.add('hidden'); };
window.closeJazzForm = () => { document.getElementById('jazz-form-container')?.classList.add('hidden'); };

window.saveMusician = async (type) => {
    const p = type === 'artist_library' ? 'art' : 'jazz'; const tName = type === 'artist_library' ? 'artist' : 'jazz';
    try {
        const fd = new FormData(); fd.append('musician_id', document.getElementById('edit-musician-id').value); fd.append('network_type', type); fd.append('slot_number', document.getElementById(`edit-${tName}-slot`).value);
        fd.append('title', document.getElementById(`${p}-title`).value); fd.append('title_th', document.getElementById(`${p}-title-th`).value);
        fd.append('genre', document.getElementById(`${p}-genre`).value); fd.append('genre_th', document.getElementById(`${p}-genre-th`).value);
        fd.append('details', document.getElementById(`${p}-details`).value); fd.append('details_th', document.getElementById(`${p}-details-th`).value);
        fd.append('facebook', document.getElementById(`${p}-fb`).value); fd.append('whatsapp', document.getElementById(`${p}-wa`).value);
        fd.append('instagram', document.getElementById(`${p}-ig`).value); fd.append('website', document.getElementById(`${p}-web`).value);
        fd.append('tiktok', document.getElementById(`${p}-tk`).value); fd.append('email', document.getElementById(`${p}-email`).value);

        let vids = []; document.querySelectorAll(`.${p}-video`).forEach(inp => { if(inp.value.trim()) vids.push(inp.value.trim()); });
        vids.forEach(v => fd.append('video_links[]', v));

        const bFile = window.croppedImagesData[`${tName}-banner`] || document.getElementById(`${tName}-banner`)?.files[0];
        const pFile = window.croppedImagesData[`${tName}-profile`] || document.getElementById(`${tName}-profile`)?.files[0];
        if(bFile) fd.append('banner_image', bFile, window.croppedImagesData[`${tName}-banner`] ? 'banner.jpg' : bFile.name);
        if(pFile) fd.append('profile_image', pFile, window.croppedImagesData[`${tName}-profile`] ? 'profile.jpg' : pFile.name);

        showToast('กำลังบันทึกข้อมูล...');
        const res = await fetch(getApiUrl('save_musician'), fetchOptions('POST', fd)); const result = await res.json();
        if (result.status === 'success') { showToast(result.message); fetchMusicians(); if(type === 'artist_library') closeArtistForm(); else closeJazzForm(); } 
        else showToast('Error: ' + result.message);
    } catch(e) { showToast('Connection Error'); }
};

window.deleteTargetMusician = async (id) => {
    if(!id) return; if(!confirm('ลบข้อมูลนี้ถาวร?')) return;
    const fd = new FormData(); fd.append('musician_id', id);
    try {
        const res = await fetch(getApiUrl('delete_musician'), fetchOptions('POST', fd)); const result = await res.json();
        showToast(result.message); if(result.status === 'success') { fetchMusicians(); closeArtistForm(); closeJazzForm(); }
    } catch(e) {}
};

window.addVideoRow = (cId, iClass) => {
    const c = document.getElementById(cId); if(!c) return;
    const row = document.createElement('div'); row.className = 'flex gap-3 items-center mt-2';
    row.innerHTML = `<input type="text" class="w-full border border-gray-400 rounded-full px-5 py-2 outline-none focus:border-yellow-500 font-semibold text-sm ${iClass}" placeholder="Video Link"><button type="button" onclick="this.parentElement.remove()" class="bg-red-500 text-white px-6 py-2 rounded-full font-bold shadow-sm hover:bg-red-600 transition">Del</button>`;
    c.appendChild(row);
};

// =====================================================================
// --- 6. Courses Library (Sortable + Builder + Bilingual) ---
// =====================================================================
let allCourses = [];
window.courseImgCounter = 0;

async function fetchCourses() {
    try { const res = await fetch(getApiUrl('get_all_courses')); const result = await res.json(); allCourses = Array.isArray(result.data) ? result.data : []; } catch(e) { allCourses = []; }
    renderCourseTable(); renderCourseGrid();
}

function renderCourseTable() {
    const tbody = document.getElementById('course-table-body'); if(!tbody) return; tbody.innerHTML = '';
    if(allCourses.length === 0) { tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-gray-500">ไม่มีข้อมูลคอร์สเรียน</td></tr>'; return; }
    let items = [...allCourses]; items.sort((a, b) => (parseInt(a.slot_number) || parseInt(a.id)) - (parseInt(b.slot_number) || parseInt(b.id)));
    items.forEach((c, index) => {
        const slotNum = c.slot_number || (index + 1);
        tbody.innerHTML += `<tr class="border-b hover:bg-gray-50"><td class="p-4 font-bold text-[#10a349]">ช่องที่ ${slotNum}</td><td class="p-4 font-bold text-gray-800">${c.title || 'Untitled'}</td><td class="p-4 text-sm text-gray-600">${c.creator || '-'}</td><td class="p-4 text-right"><button type="button" onclick="clickCourseSlot(${slotNum}, ${c.id})" class="bg-black text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-gray-800 shadow-sm">✏️ แก้ไข</button></td></tr>`;
    });
}

window.renderCourseGrid = function() {
    const container = document.getElementById('course-grid-container'); if(!container) return; container.innerHTML = '';
    let items = [...allCourses]; items.sort((a, b) => (parseInt(a.slot_number) || parseInt(a.id)) - (parseInt(b.slot_number) || parseInt(b.id)));

    items.forEach((item, index) => {
        const slotNum = item.slot_number || (index + 1); const imgUrl = item.banner_image || `https://placehold.co/1200x400/10a349/fff?text=Course`;
        const isMain = (slotNum == 1 || index === 0);
        const gridClass = isMain ? 'col-span-1 sm:col-span-2 md:col-span-3 md:aspect-[21/9]' : 'aspect-video';
        container.innerHTML += `<div data-id="${item.id}" class="course-card ${gridClass} group relative rounded-[1.5rem] overflow-hidden shadow-sm border bg-black flex flex-col justify-end"><div class="drag-handle absolute top-3 left-3 bg-black/50 backdrop-blur-md p-2 rounded-full cursor-grab z-30 hover:bg-[#10a349] text-white">✋</div><span class="slot-badge absolute top-3 right-3 bg-white/20 text-white text-xs px-3 py-1 rounded-full z-20">ช่องที่ ${slotNum}</span><div onclick="clickCourseSlot(${slotNum}, ${item.id})" class="absolute inset-0 z-10 cursor-pointer"></div><img src="${imgUrl}" class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"><div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div><div class="relative z-10 p-5 pr-10 pointer-events-none"><h3 class="font-extrabold ${isMain?'text-3xl':'text-xl'} text-white line-clamp-2">${item.title||'Untitled'}</h3><p class="text-white/80 text-sm mt-1">By ${item.creator||'-'}</p></div></div>`;
    });

    const nextSlot = items.length > 0 ? (Math.max(...items.map(i => parseInt(i.slot_number) || 0)) + 1) : 1;
    container.innerHTML += `<div onclick="clickCourseSlot(${nextSlot}, null)" class="ignore-drag cursor-pointer ${nextSlot===1?'col-span-1 sm:col-span-2 md:col-span-3 md:aspect-[21/9]':'aspect-video'} rounded-[1.5rem] border-2 border-dashed border-green-400 text-green-600 bg-green-50 hover:bg-green-100 flex flex-col items-center justify-center transition shadow-sm"><span class="text-5xl">+</span><span class="font-bold">เพิ่มคอร์สใหม่</span></div>`;

    if (typeof Sortable !== 'undefined') {
        if (window.courseSortable) window.courseSortable.destroy();
        window.courseSortable = new Sortable(container, { animation: 200, handle: '.drag-handle', filter: '.ignore-drag', onEnd: function () { updateCourseOrderUI(); } });
    }
};

window.updateCourseOrderUI = async function() {
    const cards = document.querySelectorAll('#course-grid-container .course-card'); const newOrder = [];
    cards.forEach((card, index) => { const newSlot = index + 1; newOrder.push({ id: card.getAttribute('data-id'), slot_number: newSlot }); const badge = card.querySelector('.slot-badge'); if(badge) badge.innerText = `ช่องที่ ${newSlot}`; });
    try { const fd = new FormData(); fd.append('order_data', JSON.stringify(newOrder)); const res = await fetch(getApiUrl('update_course_order'), fetchOptions('POST', fd)); const result = await res.json(); if (result.status === 'success') { showToast('สลับตำแหน่งเรียบร้อย!'); fetchCourses(); } } catch(e) {}
};

window.clickCourseSlot = async (slotNum, id) => {
    const formTitle = document.getElementById('course-form-title'); const formContainer = document.getElementById('course-form-container');
    document.getElementById('edit-course-slot').value = slotNum; if(formContainer) formContainer.classList.remove('hidden');
    if (id) {
        document.getElementById('edit-course-id').value = id; if(formTitle) formTitle.textContent = `✏️ แก้ไขคอร์สเรียน ช่องที่ ${slotNum}`;
        showToast('กำลังดึงข้อมูล...');
        try {
            const c = (await(await fetch(getApiUrl(`get_course_details&id=${id}&t=${new Date().getTime()}`))).json()).data;
            document.getElementById('course-title').value = c.title || ''; document.getElementById('course-title-th').value = c.title_th || '';
            document.getElementById('course-creator').value = c.creator || ''; document.getElementById('course-creator-th').value = c.creator_th || '';
            const imgEl = document.getElementById('course-banner-img'); if(imgEl) imgEl.src = c.banner_image || 'https://placehold.co/1200x400/b2b2b2/000?text=No+Banner';
            
            const contentContainer = document.getElementById('course-content-container'); contentContainer.innerHTML = '';
            if(c.details) {
                try {
                    let dArrEn = typeof c.details === 'string' ? JSON.parse(c.details) : c.details;
                    let dArrTh = typeof c.details_th === 'string' ? JSON.parse(c.details_th) : [];
                    if(Array.isArray(dArrEn) && dArrEn.length > 0) {
                        dArrEn.forEach((item, i) => { window.addCourseContent(item.type, item.value, dArrTh[i] ? dArrTh[i].value : '', item.layout); });
                    } else window.addCourseContent('text');
                } catch(e) { window.addCourseContent('text'); }
            } else window.addCourseContent('text');
        } catch(e) {}
    } else {
        document.getElementById('edit-course-id').value = ''; if(formTitle) formTitle.textContent = `✨ เพิ่มคอร์สเรียนใหม่ ช่องที่ ${slotNum}`;
        document.getElementById('course-title').value = ''; document.getElementById('course-title-th').value = '';
        document.getElementById('course-creator').value = ''; document.getElementById('course-creator-th').value = '';
        document.getElementById('course-content-container').innerHTML = ''; window.addCourseContent('text');
        const imgEl = document.getElementById('course-banner-img'); if(imgEl) imgEl.src = 'https://placehold.co/1200x400/b2b2b2/000?text=No+Banner';
    }
    window.croppedImagesData = {};
    if(formContainer) formContainer.scrollIntoView({behavior: 'smooth', block: 'center'});
};

window.closeCourseForm = () => { document.getElementById('course-form-container')?.classList.add('hidden'); };
window.deleteTargetCourse = async (id) => { if(!id) return; if(confirm('แน่ใจหรือไม่ที่จะลบคอร์สนี้?')) { const fd = new FormData(); fd.append('course_id', id); const res = await fetch(getApiUrl('delete_course'), fetchOptions('POST', fd)); const result = await res.json(); showToast(result.message); if(result.status === 'success') { fetchCourses(); closeCourseForm(); } } };

window.saveCourse = async () => {
    try {
        const fd = new FormData();
        fd.append('course_id', document.getElementById('edit-course-id').value);
        fd.append('slot_number', document.getElementById('edit-course-slot').value);
        fd.append('title', document.getElementById('course-title').value); fd.append('title_th', document.getElementById('course-title-th').value);
        fd.append('creator', document.getElementById('course-creator').value); fd.append('creator_th', document.getElementById('course-creator-th').value);
        
        const bFile = window.croppedImagesData['course-banner'] || document.getElementById('course-banner')?.files[0];
        if(bFile) fd.append('banner_image', bFile, window.croppedImagesData['course-banner'] ? 'banner.jpg' : bFile.name);

        document.querySelectorAll('.course-item').forEach((item, index) => {
            const type = item.getAttribute('data-type'); fd.append('content_types[]', type);
            fd.append('content_layouts[]', item.querySelector('.course-layout-select').value);
            if (type === 'text') { fd.append('content_values[]', item.querySelector('.course-text-input').value); fd.append('content_values_th[]', item.querySelector('.course-text-input-th').value); } 
            else if (type === 'video') { fd.append('content_values[]', item.querySelector('.course-video-input').value); fd.append('content_values_th[]', item.querySelector('.course-video-input').value); } 
            else if (type === 'image') {
                const fInput = item.querySelector('.course-img-input'); const oldInput = item.querySelector('.course-img-old');
                if (fInput && fInput.id && window.croppedImagesData[fInput.id]) { fd.append(`content_images_${index}`, window.croppedImagesData[fInput.id], 'img.jpg'); fd.append('content_values[]', `has_image`); fd.append('content_values_th[]', `has_image`); } 
                else if (fInput && fInput.files[0]) { fd.append(`content_images_${index}`, fInput.files[0]); fd.append('content_values[]', `has_image`); fd.append('content_values_th[]', `has_image`); } 
                else { fd.append('content_values[]', oldInput ? oldInput.value : ''); fd.append('content_values_th[]', oldInput ? oldInput.value : ''); }
            }
        });

        showToast('กำลังบันทึกข้อมูล Course...');
        const res = await fetch(getApiUrl('save_course'), fetchOptions('POST', fd)); const result = await res.json();
        if (result.status === 'success') { showToast('บันทึกคอร์สเรียนสำเร็จ!'); fetchCourses(); closeCourseForm(); } else { showToast('ข้อผิดพลาด: ' + result.message); }
    } catch (e) {}
};

// =====================================================================
// --- 7. CMBigband Logic ---
// =====================================================================
window.cmbImgCounter = 0;

window.loadCmbData = async () => {
    try {
        const result = await (await fetch(getApiUrl('get_cmbigband'))).json();
        if (result.status === 'success' && result.data) {
            const c = result.data;
            document.getElementById('cmb-title').value = c.title || ''; document.getElementById('cmb-title-th').value = c.title_th || '';
            document.getElementById('cmb-genre').value = c.genre || ''; document.getElementById('cmb-genre-th').value = c.genre_th || '';
            document.getElementById('cmb-fb').value = c.facebook || ''; document.getElementById('cmb-wa').value = c.whatsapp || '';
            document.getElementById('cmb-ig').value = c.instagram || ''; document.getElementById('cmb-web').value = c.website || '';
            document.getElementById('cmb-tk').value = c.tiktok || ''; document.getElementById('cmb-email').value = c.email || '';
            
            const bImg = document.getElementById('cmbigband-banner-img'); if(bImg) bImg.src = c.banner_image || 'https://placehold.co/1200x400/e5e7eb/a3a3a3';
            const pImg = document.getElementById('cmbigband-profile-img'); if(pImg) pImg.src = c.profile_image || 'https://placehold.co/600x600/e5e7eb/a3a3a3';

            const container = document.getElementById('cmb-content-container'); container.innerHTML = '';
            if(c.details) {
                try {
                    let dArrEn = JSON.parse(c.details); let dArrTh = JSON.parse(c.details_th || '[]');
                    if(Array.isArray(dArrEn)) { dArrEn.forEach((item, i) => window.addCmbContent(item.type, item.value, dArrTh[i]?dArrTh[i].value:'', item.layout)); }
                } catch(e) {}
            }
        }
    } catch(e) {}
};

window.saveCMBigband = async () => {
    try {
        const fd = new FormData();
        fd.append('title', document.getElementById('cmb-title').value); fd.append('title_th', document.getElementById('cmb-title-th').value);
        fd.append('genre', document.getElementById('cmb-genre').value); fd.append('genre_th', document.getElementById('cmb-genre-th').value);
        fd.append('facebook', document.getElementById('cmb-fb').value); fd.append('whatsapp', document.getElementById('cmb-wa').value);
        fd.append('instagram', document.getElementById('cmb-ig').value); fd.append('website', document.getElementById('cmb-web').value);
        fd.append('tiktok', document.getElementById('cmb-tk').value); fd.append('email', document.getElementById('cmb-email').value);

        const bFile = window.croppedImagesData['cmb-banner'] || document.getElementById('cmb-banner')?.files[0];
        const pFile = window.croppedImagesData['cmb-profile'] || document.getElementById('cmb-profile')?.files[0];
        if(bFile) fd.append('banner_image', bFile, window.croppedImagesData['cmb-banner'] ? 'banner.jpg' : bFile.name);
        if(pFile) fd.append('profile_image', pFile, window.croppedImagesData['cmb-profile'] ? 'profile.jpg' : pFile.name);

        document.querySelectorAll('.cmb-item').forEach((item, index) => {
            const type = item.getAttribute('data-type'); fd.append('content_types[]', type);
            fd.append('content_layouts[]', item.querySelector('.cmb-layout-select').value);
            if (type === 'text') { fd.append('content_values[]', item.querySelector('.cmb-text-input').value); fd.append('content_values_th[]', item.querySelector('.cmb-text-input-th').value); } 
            else if (type === 'video') { fd.append('content_values[]', item.querySelector('.cmb-video-input').value); fd.append('content_values_th[]', item.querySelector('.cmb-video-input').value); } 
            else if (type === 'image') {
                const fInput = item.querySelector('.cmb-img-input'); const oldInput = item.querySelector('.cmb-img-old');
                if (fInput && fInput.id && window.croppedImagesData[fInput.id]) { fd.append(`content_images_${index}`, window.croppedImagesData[fInput.id], 'img.jpg'); fd.append('content_values[]', `has_image`); fd.append('content_values_th[]', `has_image`); } 
                else if (fInput && fInput.files[0]) { fd.append(`content_images_${index}`, fInput.files[0]); fd.append('content_values[]', `has_image`); fd.append('content_values_th[]', `has_image`); } 
                else { fd.append('content_values[]', oldInput ? oldInput.value : ''); fd.append('content_values_th[]', oldInput ? oldInput.value : ''); }
            }
        });

        showToast('กำลังบันทึกข้อมูล...');
        const res = await fetch(getApiUrl('save_cmbigband'), fetchOptions('POST', fd)); const result = await res.json();
        if (result.status === 'success') { showToast('บันทึกข้อมูลสำเร็จ!'); window.croppedImagesData = {}; } else showToast('ข้อผิดพลาด: ' + result.message);
    } catch(e) {}
};
// =====================================================================
// --- 8. Forum Q&A Management (Bulk Delete) ---
// =====================================================================
let selectedForumTopics = [];

async function fetchAdminForumTopics() {
    try {
        const res = await fetch(getApiUrl('get_admin_forum_topics'));
        const result = await res.json();
        const tbody = document.getElementById('admin-forum-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        selectedForumTopics = []; // รีเซ็ตการเลือกทุกครั้งที่โหลดตารางใหม่
        updateForumActionButtons();
        
        if(result.status === 'success') {
            if(result.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-gray-500 font-medium">ยังไม่มีกระทู้ในระบบ</td></tr>';
                return;
            }
            result.data.forEach(topic => {
                const d = new Date(topic.created_at);
                const dateStr = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                
                const tr = document.createElement('tr');
                tr.className = 'border-b hover:bg-orange-50 transition-colors select-none';
                tr.setAttribute('data-id', topic.id);
                
                tr.innerHTML = `
                    <td class="p-4 text-center font-bold">
                        <div class="flex items-center justify-center gap-2">
                            <input type="checkbox" class="w-4 h-4 text-orange-600 border-gray-300 rounded pointer-events-none" data-id="${topic.id}">
                            <span class="text-gray-500">${topic.id}</span>
                        </div>
                    </td>
                    <td class="p-4 font-bold text-gray-800 break-words max-w-xs">${topic.title}</td>
                    <td class="p-4 text-sm text-gray-600 font-semibold">${topic.username}</td>
                    <td class="p-4 text-sm text-gray-600">${dateStr}</td>
                    <td class="p-4 text-center text-sm font-medium">
                        <span class="bg-gray-200 px-2 py-1 rounded text-gray-700 shadow-sm">👁️ ${topic.views}</span> 
                        <span class="bg-blue-100 px-2 py-1 rounded text-blue-700 ml-1 shadow-sm">💬 ${topic.comment_count}</span>
                    </td>
                `;
                
                // ดักจับการคลิกที่แถวเพื่อเลือก
                tr.addEventListener('click', () => toggleForumRow(tr, topic.id));
                tbody.appendChild(tr);
            });
        }
    } catch (e) {
        console.error(e);
    }
}

function toggleForumRow(row, id) {
    const checkbox = row.querySelector('input[type="checkbox"]');
    const index = selectedForumTopics.indexOf(id);
    
    // ถ้าเลือกอยู่แล้ว ให้เอาออก
    if (index > -1) {
        selectedForumTopics.splice(index, 1);
        row.classList.remove('bg-orange-100', 'border-l-4', 'border-orange-500');
        checkbox.checked = false;
    } else {
        // ถ้ายังไม่ได้เลือก ให้เพิ่มเข้าไป
        selectedForumTopics.push(id);
        row.classList.add('bg-orange-100', 'border-l-4', 'border-orange-500');
        checkbox.checked = true;
    }
    updateForumActionButtons();
}

function updateForumActionButtons() {
    const btnDel = document.getElementById('btn-delete-forum');
    const statusEl = document.getElementById('forum-selection-status');
    
    if (btnDel && statusEl) {
        if (selectedForumTopics.length > 0) {
            // ปลดล็อคปุ่มลบ
            btnDel.disabled = false;
            btnDel.classList.remove('opacity-50', 'cursor-not-allowed');
            statusEl.innerHTML = `เลือกกระทู้แล้ว: <span class="text-red-600 font-bold">${selectedForumTopics.length}</span> รายการ`;
        } else {
            // ล็อคปุ่มลบ
            btnDel.disabled = true;
            btnDel.classList.add('opacity-50', 'cursor-not-allowed');
            statusEl.innerHTML = 'ยังไม่ได้เลือกกระทู้';
        }
    }
}

// สั่งการปุ่ม "ลบที่เลือก" ด้านบน
document.getElementById('btn-delete-forum')?.addEventListener('click', async () => {
    if(selectedForumTopics.length === 0) return;
    
    if(!confirm(`🚨 คุณแน่ใจหรือไม่ที่จะลบกระทู้ที่เลือกจำนวน ${selectedForumTopics.length} รายการ? \n(คอมเมนต์ทั้งหมดในกระทู้จะถูกลบถาวร!)`)) return;
    
    try {
        const fd = new FormData();
        // ส่งข้อมูลเป็น String ของ JSON
        fd.append('topic_ids', JSON.stringify(selectedForumTopics)); 
        
        showToast('กำลังลบข้อมูล...');
        const res = await fetch(getApiUrl('delete_forum_topic'), fetchOptions('POST', fd));
        const result = await res.json();
        
        if(result.status === 'success') {
            showToast(result.message);
            fetchAdminForumTopics(); // โหลดตารางใหม่
        } else {
            showToast('เกิดข้อผิดพลาด: ' + result.message);
        }
    } catch(e) {
        showToast('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
});
// --- 8. Forum Q&A Management (END) ---