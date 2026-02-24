// =====================================================================
// --- 0. API Config ---
// =====================================================================
const getApiUrl = (action) => {
    if (window.location.protocol === 'blob:' || window.location.protocol === 'file:' || window.location.protocol === 'data:') {
        return 'http://localhost/backend.php?action=' + action;
    }
    return 'backend.php?action=' + action;
};

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

// =====================================================================
// --- 1. Login / Register ---
// =====================================================================
const loginScreen = document.getElementById('login-screen');
const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');

document.getElementById('show-register')?.addEventListener('click', () => {
    loginContainer.classList.add('hidden'); registerContainer.classList.remove('hidden');
});
document.getElementById('show-login')?.addEventListener('click', () => {
    registerContainer.classList.add('hidden'); loginContainer.classList.remove('hidden');
});

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

document.getElementById('logout-btn')?.addEventListener('click', () => {
    loginScreen.classList.remove('hidden'); sidebar.classList.add('hidden'); mainContent.classList.add('hidden');
    document.getElementById('password').value = ''; 
});

// =====================================================================
// --- 2. Sidebar Navigation ---
// =====================================================================
const navLinks = document.querySelectorAll('.nav-link');
function switchTab(targetId) {
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.add('hidden'));
    const target = document.getElementById(targetId);
    if(target) target.classList.remove('hidden');
    
    navLinks.forEach(link => {
        link.classList.remove('bg-gray-100', 'bg-blue-100', 'bg-yellow-100', 'bg-green-100', 'bg-gray-200');
        if(link.getAttribute('data-target') === targetId) {
            if(targetId.includes('festival')) link.classList.add('bg-blue-100');
            else if(targetId.includes('admin')) link.classList.add('bg-gray-100');
            else if(targetId.includes('musician')) link.classList.add('bg-yellow-100');
            else if(targetId.includes('courses')) link.classList.add('bg-green-100');
            else if(targetId.includes('cmbigband')) link.classList.add('bg-gray-200');
            else link.classList.add('bg-gray-100');
        }
    });
}

navLinks.forEach(link => { 
    link.addEventListener('click', (e) => { 
        e.preventDefault(); 
        const target = link.getAttribute('data-target');
        switchTab(target); 
        if(target === 'section-admin') fetchUsers(); 
        if(target === 'section-festival') fetchEvents();
        if(target === 'section-musician') fetchMusicians();
    }); 
});

// =====================================================================
// --- 3. User Management ---
// =====================================================================
let users = [];
async function fetchUsers() {
    try {
        const response = await fetch(getApiUrl('get_users'), fetchOptions('GET'));
        const result = await response.json();
        if (result.status === 'success') { users = result.data; renderUsers(); }
    } catch (error) {}
}

function renderUsers() {
    const tbody = document.getElementById('user-table-body'); if(!tbody) return;
    tbody.innerHTML = '';
    users.forEach(user => {
        const statusColor = user.status === 'approved' ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100';
        const statusText = user.status === 'approved' ? 'อนุมัติแล้ว' : 'รอตรวจสอบ';
        const tr = document.createElement('tr'); tr.className = 'border-b hover:bg-gray-50';
        tr.innerHTML = `
            <td class="p-4 text-gray-500">${user.id}</td>
            <td class="p-4 font-medium">${user.username}<div class="text-sm text-gray-400">${user.email}</div></td>
            <td class="p-4"><span class="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 uppercase font-bold">${user.role}</span></td>
            <td class="p-4"><span class="px-2 py-1 rounded text-xs font-semibold ${statusColor}">${statusText}</span></td>
            <td class="p-4 text-right space-x-2">
                ${user.status === 'pending' ? `<button onclick="updateUserStatus(${user.id}, 'approved')" class="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold">อนุมัติ</button>` : `<button onclick="updateUserStatus(${user.id}, 'pending')" class="bg-yellow-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold">ระงับ</button>`}
                <button onclick="promptChangePassword(${user.id})" class="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold">เปลี่ยนรหัส</button>
                <button onclick="confirmDeleteUser(${user.id})" class="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold">ลบ</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.updateUserStatus = async (id, newStatus) => {
    try {
        const formData = new FormData(); formData.append('user_id', id); formData.append('status', newStatus);
        const response = await fetch(getApiUrl('update_user_status'), fetchOptions('POST', formData));
        const result = await response.json();
        if (result.status === 'success') { showToast('อัปเดตสถานะแล้ว'); fetchUsers(); }
    } catch(error) {}
};

let deleteTargetId = null;
window.confirmDeleteUser = (id) => { deleteTargetId = id; document.getElementById('confirm-modal').classList.remove('hidden'); };
window.closeConfirmModal = () => { deleteTargetId = null; document.getElementById('confirm-modal').classList.add('hidden'); };

document.getElementById('confirm-delete-btn')?.addEventListener('click', async () => {
    if(!deleteTargetId) return;
    try {
        const formData = new FormData(); formData.append('user_id', deleteTargetId);
        const response = await fetch(getApiUrl('delete_user'), fetchOptions('POST', formData));
        const result = await response.json();
        if (result.status === 'success') { showToast(result.message); fetchUsers(); }
    } catch(error) {}
    closeConfirmModal();
});

let passwordTargetId = null;
window.promptChangePassword = (id) => { passwordTargetId = id; document.getElementById('new-password-input').value = ''; document.getElementById('password-modal').classList.remove('hidden'); };
window.closePasswordModal = () => { passwordTargetId = null; document.getElementById('password-modal').classList.add('hidden'); };

document.getElementById('save-password-btn')?.addEventListener('click', async () => {
    const newPass = document.getElementById('new-password-input').value;
    if(!newPass) return showToast('กรุณากรอกรหัสผ่าน');
    try {
        const formData = new FormData(); formData.append('user_id', passwordTargetId); formData.append('new_password', newPass);
        const response = await fetch(getApiUrl('update_password'), fetchOptions('POST', formData));
        const result = await response.json(); showToast(result.message); 
    } catch(error) {}
    closePasswordModal();
});

// =====================================================================
// --- 4. Image Cropper Global Logic ---
// =====================================================================
let cropper = null; let currentCropInputId = null; let currentCropContainerId = null; window.croppedImagesData = {};
window.previewImage = (input, imgId, aspectRatio = NaN) => {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('cropper-modal').classList.remove('hidden');
            const imageEl = document.getElementById('cropper-image'); imageEl.src = e.target.result;
            currentCropInputId = input.id; 
            currentCropContainerId = imgId; 
            if (cropper) cropper.destroy();
            cropper = new Cropper(imageEl, { aspectRatio: aspectRatio, viewMode: 1, autoCropArea: 1 });
        }
        reader.readAsDataURL(input.files[0]);
    }
};

window.closeCropperModal = () => { 
    document.getElementById('cropper-modal').classList.add('hidden'); 
    if (cropper) cropper.destroy(); 
    const input = document.getElementById(currentCropInputId); if (input) input.value = ''; 
};

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
            removeBtn.onclick = (e) => { e.preventDefault(); removeGalleryImage(index); }; previewDiv.appendChild(removeBtn); wrapper.appendChild(previewDiv);
        }
        reader.readAsDataURL(file);
    });
}
window.removeGalleryImage = (idxToRemove) => { const dt = new DataTransfer(); Array.from(globalGalleryFiles.files).forEach((file, idx) => { if (idx !== idxToRemove) dt.items.add(file); }); globalGalleryFiles = dt; renderGalleryPreviews(); };

// =====================================================================
// --- 5. MUSICIAN NETWORK LOGIC ---
// =====================================================================
let allMusicians = [];

window.switchMusicianTab = function(tabName) {
    const btnArtist = document.getElementById('tab-btn-artist');
    const btnJazz = document.getElementById('tab-btn-jazz');
    const contentArtist = document.getElementById('musician-artist-content');
    const contentJazz = document.getElementById('musician-jazz-content');

    if (tabName === 'artist') {
        if (btnArtist) btnArtist.className = 'flex-1 bg-[#ffc107] text-black font-bold py-2 rounded-full shadow text-center transition';
        if (btnJazz) btnJazz.className = 'flex-1 text-gray-500 font-bold py-2 rounded-full text-center hover:bg-gray-300 transition';
        if (contentArtist) { contentArtist.classList.remove('hidden'); contentArtist.classList.add('block'); }
        if (contentJazz) { contentJazz.classList.add('hidden'); contentJazz.classList.remove('block'); }
    } else if (tabName === 'jazz') {
        if (btnJazz) btnJazz.className = 'flex-1 bg-[#ffc107] text-black font-bold py-2 rounded-full shadow text-center transition';
        if (btnArtist) btnArtist.className = 'flex-1 text-gray-500 font-bold py-2 rounded-full text-center hover:bg-gray-300 transition';
        if (contentJazz) { contentJazz.classList.remove('hidden'); contentJazz.classList.add('block'); }
        if (contentArtist) { contentArtist.classList.add('hidden'); contentArtist.classList.remove('block'); }
    }
};

async function fetchMusicians() {
    try {
        const res = await fetch(getApiUrl('get_all_musicians'));
        const result = await res.json();
        if(result.status === 'success') { allMusicians = result.data; } else { allMusicians = []; }
    } catch(e) { allMusicians = []; }
    
    renderMusicianTable(); 
    renderGrid('artist-grid-container', 'artist_library', 'art', 'artist'); 
    renderGrid('jazz-grid-container', 'jazz_network', 'jazz', 'jazz'); 
}

function renderMusicianTable() {
    const tbody = document.getElementById('musician-table-body');
    if(!tbody) return;
    tbody.innerHTML = '';

    if(allMusicians.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-gray-500">ยังไม่มีข้อมูล</td></tr>'; return;
    }

    allMusicians.forEach((m) => {
        const typeText = m.network_type === 'artist_library' ? '<span class="text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs font-bold shadow-sm">Artist Library</span>' : '<span class="text-blue-600 bg-blue-100 px-2 py-1 rounded text-xs font-bold shadow-sm">Jazz Network</span>';
        tbody.innerHTML += `
            <tr class="border-b hover:bg-gray-50 cursor-pointer transition-colors musician-row">
                <td class="p-4 text-gray-500">ID: ${m.id} (ช่อง ${m.slot_number || '-'})</td>
                <td class="p-4 font-bold text-gray-800">${m.title}</td>
                <td class="p-4 text-sm text-gray-600">${m.genre || '-'}</td>
                <td class="p-4">${typeText}</td>
            </tr>
        `;
    });
}

window.renderGrid = function(containerId, networkType, prefix, typeName) {
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = '';
    
    let items = allMusicians.filter(m => m.network_type === networkType);
    items.sort((a, b) => parseInt(a.id) - parseInt(b.id));

    const emptyBoxClass = networkType === 'artist_library' ? 'border-[#ffc107] text-[#ffc107] bg-[#fffde7] hover:bg-[#fff9c4]' : 'border-blue-400 text-blue-500 bg-blue-50 hover:bg-blue-100';

    items.forEach((item, index) => {
        const slotNum = index + 1; 
        const imgUrl = item.profile_image || `https://placehold.co/400x400/222/fff?text=No+Image`;
        const displayTitle = item.title || 'Untitled';
        container.innerHTML += `
            <div onclick="clickSlot(${slotNum}, ${item.id}, '${prefix}', '${typeName}')" class="cursor-pointer group relative rounded-[2rem] overflow-hidden aspect-square shadow-sm border border-gray-200 hover:shadow-lg transition bg-black flex flex-col justify-end">
                <img src="${imgUrl}" class="absolute inset-0 w-full h-full object-contain bg-gray-900 opacity-80 group-hover:opacity-100 transition-opacity">
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div class="relative z-10 p-6 w-full pr-12">
                    <h3 class="font-extrabold text-2xl leading-[1.2] tracking-tight text-white text-left break-words w-full whitespace-normal line-clamp-3">${displayTitle}</h3>
                </div>
            </div>
        `;
    });

    const nextSlot = items.length + 1;
    container.innerHTML += `
        <div onclick="clickSlot(${nextSlot}, null, '${prefix}', '${typeName}')" class="cursor-pointer rounded-[2rem] aspect-square border-2 border-dashed ${emptyBoxClass} flex flex-col items-center justify-center transition shadow-sm">
            <span class="text-5xl font-light mb-1">+</span>
            <span class="font-bold text-sm">เพิ่มข้อมูลช่องที่ ${nextSlot}</span>
        </div>
    `;
};

window.clickSlot = async (slotNum, id, prefix, typeName) => {
    const formTitle = document.getElementById(`${typeName}-form-title`);
    const formContainer = document.getElementById(`${typeName}-form-container`);
    document.getElementById(`edit-${typeName}-slot`).value = slotNum;
    
    if(formContainer) formContainer.classList.remove('hidden');
    
    if (id) {
        document.getElementById('edit-musician-id').value = id;
        if(formTitle) formTitle.textContent = `✏️ แก้ไขข้อมูล ช่องที่ ${slotNum}`;
        await loadMusicianData(id, prefix, typeName);
    } else {
        document.getElementById('edit-musician-id').value = '';
        if(formTitle) formTitle.textContent = `✨ เพิ่มข้อมูลใหม่ ช่องที่ ${slotNum}`;
        clearMusicianForm(prefix, typeName);
    }
    if(formContainer) formContainer.scrollIntoView({behavior: 'smooth', block: 'center'});
};

window.clearMusicianForm = (prefix, typeName) => {
    document.getElementById('edit-musician-id').value = '';
    document.getElementById(`${prefix}-title`).value = '';
    document.getElementById(`${prefix}-genre`).value = '';
    document.getElementById(`${prefix}-fb`).value = '';
    document.getElementById(`${prefix}-wa`).value = '';
    document.getElementById(`${prefix}-ig`).value = '';
    document.getElementById(`${prefix}-web`).value = '';
    document.getElementById(`${prefix}-tk`).value = '';
    document.getElementById(`${prefix}-email`).value = '';
    document.getElementById(`${prefix}-details`).value = '';
    
    const vContainer = document.getElementById(`${prefix}-video-container`);
    if(vContainer) vContainer.innerHTML = `<div class="flex gap-3 items-center mt-2"><input type="text" class="w-full border border-gray-400 rounded-full px-5 py-2 outline-none focus:border-yellow-500 placeholder-gray-400 font-semibold text-sm ${prefix}-video" placeholder="Link to your Video / Youtube / Vimeo"><button type="button" onclick="addVideoRow('${prefix}-video-container', '${prefix}-video')" class="bg-[#ffc107] text-black px-6 py-2 rounded-full font-extrabold shadow-sm hover:bg-yellow-500 transition">Add</button></div>`;
    
    const bannerImg = document.getElementById(`${typeName}-banner-img`);
    const profileImg = document.getElementById(`${typeName}-profile-img`);
    if(bannerImg) bannerImg.src = 'https://placehold.co/1200x400/e5e7eb/a3a3a3?text=No+Banner';
    if(profileImg) profileImg.src = 'https://placehold.co/600x600/e5e7eb/a3a3a3?text=No+Profile';
    window.croppedImagesData = {};
};

window.closeArtistForm = () => { document.getElementById('artist-form-container').classList.add('hidden'); clearMusicianForm('art', 'artist'); };
window.closeJazzForm = () => { document.getElementById('jazz-form-container').classList.add('hidden'); clearMusicianForm('jazz', 'jazz'); };

async function loadMusicianData(id, prefix, typeName) {
    showToast('กำลังดึงข้อมูล...');
    try {
        const res = await fetch(getApiUrl(`get_musician_details&id=${id}&t=${new Date().getTime()}`));
        const result = await res.json();
        if(result.status === 'success') {
            const m = result.data;
            document.getElementById(`${prefix}-title`).value = m.title || '';
            document.getElementById(`${prefix}-genre`).value = m.genre || '';
            document.getElementById(`${prefix}-fb`).value = m.facebook || '';
            document.getElementById(`${prefix}-wa`).value = m.whatsapp || '';
            document.getElementById(`${prefix}-ig`).value = m.instagram || '';
            document.getElementById(`${prefix}-web`).value = m.website || '';
            document.getElementById(`${prefix}-tk`).value = m.tiktok || '';
            document.getElementById(`${prefix}-email`).value = m.email || '';
            document.getElementById(`${prefix}-details`).value = m.details || '';

            const videoContainer = document.getElementById(`${prefix}-video-container`);
            if(videoContainer) {
                videoContainer.innerHTML = '';
                if (m.video_link) {
                    try {
                        const vids = JSON.parse(m.video_link);
                        if(vids.length > 0) {
                            vids.forEach(v => {
                                const row = document.createElement('div'); row.className = 'flex gap-3 items-center mt-2';
                                row.innerHTML = `<input type="text" class="w-full border border-gray-400 rounded-full px-5 py-2 outline-none focus:border-yellow-500 font-semibold text-sm ${prefix}-video" value="${v}"><button type="button" onclick="this.parentElement.remove()" class="bg-red-500 text-white px-6 py-2 rounded-full font-bold shadow-sm hover:bg-red-600 transition">Del</button>`;
                                videoContainer.appendChild(row);
                            });
                        } else { addVideoRow(`${prefix}-video-container`, `${prefix}-video`); }
                    } catch(e) { addVideoRow(`${prefix}-video-container`, `${prefix}-video`); }
                } else { addVideoRow(`${prefix}-video-container`, `${prefix}-video`); }
            }

            const bannerImgEl = document.getElementById(`${typeName}-banner-img`);
            const profileImgEl = document.getElementById(`${typeName}-profile-img`);
            if(bannerImgEl) bannerImgEl.src = m.banner_image || 'https://placehold.co/1200x400/e5e7eb/a3a3a3?text=No+Banner';
            if(profileImgEl) profileImgEl.src = m.profile_image || 'https://placehold.co/600x600/e5e7eb/a3a3a3?text=No+Profile';
        }
    } catch(e) { showToast('ดึงข้อมูลล้มเหลว'); }
}

window.saveMusician = async (type) => {
    try {
        const formData = new FormData();
        const prefix = type === 'artist_library' ? 'art' : 'jazz';
        const typeName = type === 'artist_library' ? 'artist' : 'jazz';
        
        const musicianId = document.getElementById('edit-musician-id').value;
        if (musicianId) formData.append('musician_id', musicianId);
        
        formData.append('slot_number', document.getElementById(`edit-${typeName}-slot`).value);
        formData.append('network_type', type);
        formData.append('title', document.getElementById(`${prefix}-title`).value);
        formData.append('genre', document.getElementById(`${prefix}-genre`).value);
        formData.append('facebook', document.getElementById(`${prefix}-fb`).value);
        formData.append('whatsapp', document.getElementById(`${prefix}-wa`).value);
        formData.append('instagram', document.getElementById(`${prefix}-ig`).value);
        formData.append('website', document.getElementById(`${prefix}-web`).value);
        formData.append('tiktok', document.getElementById(`${prefix}-tk`).value);
        formData.append('email', document.getElementById(`${prefix}-email`).value);
        formData.append('details', document.getElementById(`${prefix}-details`).value);

        const videoInputs = document.querySelectorAll(`.${prefix}-video`);
        videoInputs.forEach(input => { if(input.value.trim()) formData.append('video_links[]', input.value.trim()); });

        const bannerFile = window.croppedImagesData[`${typeName}-banner`] || document.getElementById(`${typeName}-banner`).files[0];
        const profileFile = window.croppedImagesData[`${typeName}-profile`] || document.getElementById(`${typeName}-profile`).files[0];
        if(bannerFile) formData.append('banner_image', bannerFile, window.croppedImagesData[`${typeName}-banner`] ? 'banner.jpg' : bannerFile.name);
        if(profileFile) formData.append('profile_image', profileFile, window.croppedImagesData[`${typeName}-profile`] ? 'profile.jpg' : profileFile.name);

        showToast('กำลังบันทึกข้อมูล...');
        const response = await fetch(getApiUrl('save_musician'), fetchOptions('POST', formData));
        const result = await response.json();
        
        if (result.status === 'success') { showToast('บันทึกข้อมูลสำเร็จ!'); fetchMusicians(); if(type === 'artist_library') closeArtistForm(); else closeJazzForm(); } 
        else { showToast('ข้อผิดพลาด: ' + result.message); }
    } catch(e) { showToast('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'); }
};

window.deleteTargetMusician = async (id) => {
    if(!id) return showToast('ยังไม่มีข้อมูลในช่องนี้ให้ลบ');
    if(!confirm('แน่ใจหรือไม่ที่จะลบข้อมูลนี้? (ข้อมูลจะหายไปถาวร)')) return;
    const fd = new FormData(); fd.append('musician_id', id);
    try {
        const res = await fetch(getApiUrl('delete_musician'), fetchOptions('POST', fd));
        const result = await res.json();
        showToast(result.message);
        if(result.status === 'success') { fetchMusicians(); closeArtistForm(); closeJazzForm(); }
    } catch(e) {}
};

// =====================================================================
// --- 6. Global Utility Functions ---
// =====================================================================
window.addVideoRow = (containerId, inputClass) => {
    const container = document.getElementById(containerId);
    if(!container) return;
    const row = document.createElement('div'); 
    row.className = 'flex gap-3 items-center mt-2';
    
    let btnHtml = '';
    if(inputClass.includes('art-video') || inputClass.includes('jazz-video')) {
        btnHtml = `<button type="button" onclick="this.parentElement.remove()" class="bg-red-500 text-white px-6 py-2 rounded-full font-bold shadow-sm hover:bg-red-600 transition">Del</button>`;
    } else {
        btnHtml = `<button type="button" onclick="this.parentElement.remove()" class="bg-red-500 text-white px-8 py-2 rounded-full font-bold shadow hover:bg-red-600 transition">Del</button>`;
    }

    row.innerHTML = `
        <input type="text" class="w-full border border-gray-400 rounded-full px-5 py-2 outline-none focus:border-yellow-500 placeholder-gray-400 font-semibold text-sm ${inputClass}" placeholder="Link to your Video / Youtube / Vimeo">
        ${btnHtml}
    `;
    container.appendChild(row);
};

// =====================================================================
// --- 7. Event & Festival Management ---
// =====================================================================
let selectedEventId = null; 

async function fetchEvents() {
    try {
        const response = await fetch(getApiUrl('get_all_events'));
        const result = await response.json();
        if (result.status === 'success') {
            const tbody = document.getElementById('event-table-body');
            tbody.innerHTML = '';
            selectedEventId = null;
            const deleteBtn = document.getElementById('external-delete-btn');
            const editBtn = document.getElementById('external-edit-btn');
            if(deleteBtn) deleteBtn.classList.add('hidden');
            if(editBtn) editBtn.classList.add('hidden');
            
            if(result.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-gray-500">ยังไม่มีข้อมูล Event</td></tr>'; return;
            }
            
            result.data.forEach(ev => {
                const endStr = ev.end_date && ev.end_date !== '0000-00-00 00:00:00' ? ev.end_date : ev.start_date;
                const endDate = new Date(endStr);
                const today = new Date(); today.setHours(0,0,0,0);
                let statusHtml = endDate >= today ? '<span class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">แสดงบนเว็บ</span>' : '<span class="px-2 py-1 bg-gray-200 text-gray-500 rounded text-xs font-bold">หมดเวลา (ซ่อน)</span>';

                tbody.innerHTML += `
                    <tr class="border-b hover:bg-gray-100 cursor-pointer transition-colors event-row" onclick="selectEventRow(${ev.id}, this)">
                        <td class="p-4 text-gray-500">${ev.id}</td>
                        <td class="p-4 font-bold text-gray-800">${ev.title}</td>
                        <td class="p-4 text-sm text-gray-600">${ev.start_date ? ev.start_date.split(' ')[0] : ''}</td>
                        <td class="p-4">${statusHtml}</td>
                    </tr>
                `;
            });
        }
    } catch (error) {}
}

window.selectEventRow = function(id, rowElement) {
    document.querySelectorAll('.event-row').forEach(row => { row.classList.remove('bg-blue-50'); row.classList.add('hover:bg-gray-100'); });
    rowElement.classList.remove('hover:bg-gray-100'); rowElement.classList.add('bg-blue-50');
    selectedEventId = id;
    document.getElementById('external-delete-btn')?.classList.remove('hidden');
    document.getElementById('external-edit-btn')?.classList.remove('hidden');
};

window.deleteSelectedEvent = async () => {
    if(!selectedEventId) return;
    if(!confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูล Event นี้? (ข้อมูลทั้งหมดจะหายไปถาวร)')) return;
    try {
        const fd = new FormData(); fd.append('event_id', selectedEventId);
        const response = await fetch(getApiUrl('delete_event'), fetchOptions('POST', fd));
        const result = await response.json();
        showToast(result.message);
        if(result.status === 'success') { fetchEvents(); cancelEditEvent(); }
    } catch(e) { showToast('เกิดข้อผิดพลาดในการลบข้อมูล'); }
};

let pendingTickets = [];
window.addTicketToList = () => {
    const title = document.getElementById('temp_ticket_title').value.trim();
    if (!title) { showToast('กรุณากรอกชื่อตั๋ว (Ticket Title)'); return; }
    const details = document.getElementById('temp_ticket_details').value;
    const price = document.getElementById('temp_ticket_price').value || 0;
    const amount = document.getElementById('temp_ticket_amount').value || 0;
    const status = document.querySelector('input[name="temp_ticket_status"]:checked').value;

    pendingTickets.push({ title, details, price, amount, status });
    document.getElementById('temp_ticket_title').value = ''; document.getElementById('temp_ticket_details').value = '';
    document.getElementById('temp_ticket_price').value = ''; document.getElementById('temp_ticket_amount').value = '';
    document.querySelector('input[name="temp_ticket_status"][value="1"]').checked = true;
    renderPendingTickets();
};

function renderPendingTickets() {
    const container = document.getElementById('added-tickets-list'); container.innerHTML = '';
    if(pendingTickets.length > 0) container.innerHTML = `<h4 class="text-sm font-bold text-gray-600 mb-2">รายการตั๋วที่เตรียมบันทึก:</h4>`;
    pendingTickets.forEach((ticket, index) => {
        container.innerHTML += `
            <div class="bg-white border border-gray-200 p-3 rounded-lg shadow-sm flex justify-between items-center">
                <div><span class="font-bold text-blue-600">${ticket.title}</span> <span class="text-sm text-gray-500 ml-2">(${ticket.price} THB / ${ticket.amount} ใบ)</span></div>
                <button type="button" onclick="removePendingTicket(${index})" class="text-red-500 hover:text-red-700 font-bold bg-red-50 px-2 py-1 rounded">ลบ</button>
            </div>
        `;
    });
}
window.removePendingTicket = (index) => { pendingTickets.splice(index, 1); renderPendingTickets(); };

let pendingLineups = []; 
window.addLineUpToList = () => {
    const date = document.getElementById('temp_lineup_date').value;
    const time = document.getElementById('temp_lineup_time').value;
    const stage = document.getElementById('temp_lineup_stage').value.trim();
    const name = document.getElementById('temp_lineup_name').value.trim();
    if (!date || !name) { showToast('กรุณาระบุ วันที่ และ ชื่อศิลปิน'); return; }
    pendingLineups.push({ date, time, stage, name });
    document.getElementById('temp_lineup_time').value = ''; document.getElementById('temp_lineup_name').value = '';
    renderPendingLineups();
};

function renderPendingLineups() {
    const container = document.getElementById('added-lineups-list'); container.innerHTML = '';
    if(pendingLineups.length > 0) container.innerHTML = `<h4 class="text-sm font-bold text-gray-600 mb-2">รายการ Line Up ที่เตรียมบันทึก:</h4>`;
    pendingLineups.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    pendingLineups.forEach((item, index) => {
        const displayTime = item.time ? item.time : '??:??';
        const displayStage = item.stage ? `<span class="bg-gray-200 text-xs px-2 py-0.5 rounded ml-2">${item.stage}</span>` : '';
        container.innerHTML += `
            <div class="bg-white border border-gray-200 p-3 rounded-lg shadow-sm flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <div class="bg-black text-white text-xs px-2 py-1 rounded text-center min-w-[50px]"><div>${item.date}</div><div class="font-bold text-yellow-400">${displayTime}</div></div>
                    <div><span class="font-bold text-blue-900">${item.name}</span>${displayStage}</div>
                </div>
                <button type="button" onclick="removePendingLineup(${index})" class="text-red-500 hover:text-red-700 font-bold bg-red-50 px-2 py-1 rounded">ลบ</button>
            </div>
        `;
    });
}
window.removePendingLineup = (index) => { pendingLineups.splice(index, 1); renderPendingLineups(); };

window.previewMap = (val) => {
    const container = document.getElementById('map-preview-container');
    if(!container) return;
    if (val && val.includes('<iframe')) {
        let mapEmbed = val.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="200"');
        container.innerHTML = mapEmbed; container.classList.remove('hidden');
    } else { container.innerHTML = ''; container.classList.add('hidden'); }
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
        const response = await fetch(url);
        const result = await response.json();
        if (result.status === 'success') {
            const ev = result.data;
            document.getElementById('ev-title').value = ev.title || '';
            document.getElementById('ev-short-desc').value = ev.short_description || '';
            document.getElementById('ev-location').value = ev.location || '';
            document.getElementById('ev-details').value = ev.details || '';
            document.getElementById('venue-title').value = ev.venue_title || '';
            document.getElementById('venue-details').value = ev.venue_details || '';
            document.getElementById('venue-map').value = ev.venue_map || '';
            if(window.previewMap) window.previewMap(ev.venue_map || '');

            if (ev.start_date && ev.start_date !== '0000-00-00 00:00:00') {
                const parts = ev.start_date.split(' ');
                document.getElementById('ev-start-date').value = parts[0] || ''; document.getElementById('ev-start-time').value = parts[1] ? parts[1].substring(0, 5) : '';
            }
            if (ev.end_date && ev.end_date !== '0000-00-00 00:00:00') {
                const parts = ev.end_date.split(' ');
                document.getElementById('ev-end-date').value = parts[0] || ''; document.getElementById('ev-end-time').value = parts[1] ? parts[1].substring(0, 5) : '';
            }

            pendingTickets = [];
            if (ev.tickets && ev.tickets.length > 0) { ev.tickets.forEach(t => pendingTickets.push({ title: t.title || '', details: t.details || '', price: t.price || 0, amount: t.amount || 0, status: t.is_open })); }
            renderPendingTickets();

            pendingLineups = [];
            if (ev.lineups && ev.lineups.length > 0) { ev.lineups.forEach(l => { pendingLineups.push({ date: l.lineup_date || '', time: l.lineup_time ? l.lineup_time.substring(0,5) : '', stage: l.lineup_stage || '', name: l.band_name || '' }); }); }
            renderPendingLineups();

            const setPreview = (containerId, imageUrl) => {
                const container = document.getElementById(containerId);
                if (container) {
                    if (imageUrl) {
                        container.style.backgroundImage = `url('${imageUrl}')`; container.style.backgroundSize = 'cover'; container.style.backgroundPosition = 'center';
                        const span = container.querySelector('span'); if (span) span.classList.add('bg-black/60', 'text-white', 'px-4', 'py-2', 'rounded-full');
                    } else {
                        container.style.backgroundImage = ''; const span = container.querySelector('span'); if (span) span.classList.remove('bg-black/60', 'text-white', 'px-4', 'py-2', 'rounded-full');
                    }
                }
            };
            setPreview('banner-preview', ev.banner_image);
            setPreview('poster-preview', ev.poster_image);
            setPreview('venue-photo-preview', ev.venue_image);

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
    section.querySelectorAll('.upload-box').forEach(el => { el.style.backgroundImage = ''; const span = el.querySelector('span'); if(span) span.classList.remove('bg-black/60', 'text-white', 'px-4', 'py-2', 'rounded-full'); });
    pendingTickets = []; renderPendingTickets(); pendingLineups = []; renderPendingLineups(); 
    globalGalleryFiles = new DataTransfer(); renderGalleryPreviews(); window.croppedImagesData = {};
    if(window.previewMap) window.previewMap('');
    showToast('ยกเลิกการแก้ไข โหมดเพิ่มข้อมูลใหม่');
};

window.saveEvent = async () => {
    try {
        const formData = new FormData();
        const eventId = document.getElementById('edit-event-id').value;
        if (eventId) formData.append('event_id', eventId);
        
        let sd = document.getElementById('ev-start-date').value; let st = document.getElementById('ev-start-time').value;
        formData.append('start_date', sd ? `${sd} ${st}:00` : '');
        let ed = document.getElementById('ev-end-date').value; let et = document.getElementById('ev-end-time').value;
        formData.append('end_date', ed ? `${ed} ${et}:00` : '');

        formData.append('title', document.getElementById('ev-title').value);
        formData.append('short_description', document.getElementById('ev-short-desc').value);
        formData.append('location', document.getElementById('ev-location').value);
        formData.append('details', document.getElementById('ev-details').value);
        formData.append('venue_title', document.getElementById('venue-title') ? document.getElementById('venue-title').value : '');
        formData.append('venue_details', document.getElementById('venue-details') ? document.getElementById('venue-details').value : '');
        formData.append('venue_map', document.getElementById('venue-map') ? document.getElementById('venue-map').value : '');

        if(pendingTickets.length > 0) {
            pendingTickets.forEach(ticket => {
                formData.append('ticket_titles[]', ticket.title); formData.append('ticket_details[]', ticket.details);
                formData.append('ticket_prices[]', ticket.price); formData.append('ticket_amounts[]', ticket.amount); formData.append('ticket_status[]', ticket.status);
            });
        } else {
            const tempTitle = document.getElementById('temp_ticket_title').value.trim();
            if(tempTitle) {
                formData.append('ticket_titles[]', tempTitle); formData.append('ticket_details[]', document.getElementById('temp_ticket_details').value);
                formData.append('ticket_prices[]', document.getElementById('temp_ticket_price').value || 0); formData.append('ticket_amounts[]', document.getElementById('temp_ticket_amount').value || 0);
                formData.append('ticket_status[]', document.querySelector('input[name="temp_ticket_status"]:checked').value);
            }
        }

        if(pendingLineups.length > 0) {
            pendingLineups.forEach(l => {
                formData.append('lineup_dates[]', l.date); formData.append('lineup_times[]', l.time); formData.append('lineup_stages[]', l.stage); formData.append('lineup_names[]', l.name);
            });
        }

        const bannerFile = (window.croppedImagesData && window.croppedImagesData['event-banner']) || document.getElementById('event-banner').files[0];
        const posterFile = (window.croppedImagesData && window.croppedImagesData['event-poster']) || document.getElementById('event-poster').files[0];
        const venueFile = (window.croppedImagesData && window.croppedImagesData['venue-photo']) || (document.getElementById('venue-photo') ? document.getElementById('venue-photo').files[0] : null);
        if(bannerFile) formData.append('banner_image', bannerFile, window.croppedImagesData && window.croppedImagesData['event-banner'] ? 'banner.jpg' : bannerFile.name);
        if(posterFile) formData.append('poster_image', posterFile, window.croppedImagesData && window.croppedImagesData['event-poster'] ? 'poster.jpg' : posterFile.name);
        if(venueFile) formData.append('venue_image', venueFile, window.croppedImagesData && window.croppedImagesData['venue-photo'] ? 'venue.jpg' : venueFile.name);

        Array.from(globalGalleryFiles.files).forEach(file => { formData.append('gallery_images[]', file); });

        showToast('กำลังบันทึกข้อมูล Event...');
        const response = await fetch(getApiUrl('save_event'), fetchOptions('POST', formData));
        const result = await response.json();
        
        if (result.status === 'success') {
            showToast('บันทึกสำเร็จ!');
            fetchEvents(); 
            if(document.getElementById('edit-event-id').value) { cancelEditEvent(); } else {
                const section = document.getElementById('section-festival');
                section.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), textarea').forEach(el => el.value = '');
                section.querySelectorAll('.upload-box').forEach(el => { el.style.backgroundImage = ''; const span = el.querySelector('span'); if(span) span.classList.remove('bg-black/60', 'text-white', 'px-4', 'py-2', 'rounded-full'); });
                pendingTickets = []; renderPendingTickets(); pendingLineups = []; renderPendingLineups(); globalGalleryFiles = new DataTransfer(); renderGalleryPreviews(); window.croppedImagesData = {}; if(window.previewMap) window.previewMap('');
            }
            document.getElementById('main-content').scrollTop = 0; 
        } else showToast('ข้อผิดพลาด: ' + result.message);
    } catch (error) { showToast('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'); }
};

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

        // 🌟 ตั้งค่าให้ "ช่องที่ 1" หรือกล่องแรก มีขนาดใหญ่พาดเต็มแถว (คอร์สหลัก)
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
        if(badge) badge.innerText = `ช่องที่ ${newSlot}`;
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
                    // 🌟 แปลง JSON ให้รองรับรูปแบบข้อมูลได้อย่างถูกต้อง
                    let detailsArray = typeof c.details === 'string' ? JSON.parse(c.details) : c.details;
                    
                    if(Array.isArray(detailsArray) && detailsArray.length > 0) {
                        detailsArray.forEach(item => {
                            addCourseContent(item.type, item.value);
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

window.addCourseContent = (type, value = '') => {
    const container = document.getElementById('course-content-container');
    const itemDiv = document.createElement('div');
    itemDiv.className = 'relative course-item border border-gray-400 p-1 rounded-[1.2rem] bg-white shadow-sm mb-4';
    itemDiv.setAttribute('data-type', type);
    
    const deleteBtn = `<button type="button" onclick="this.parentElement.remove()" class="absolute -top-3 -right-3 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold shadow hover:bg-red-600 transition z-10 text-xs">✕</button>`;

    if (type === 'text') {
        itemDiv.innerHTML = deleteBtn + `<textarea class="w-full border-none px-4 py-3 outline-none focus:ring-0 rounded-[1.2rem] min-h-[120px] course-text-input text-sm font-semibold placeholder-gray-400" placeholder="Details ....">${value}</textarea>`;
    } else if (type === 'image') {
        courseImgCounter++;
        const previewId = `course-img-preview-${courseImgCounter}`;
        const inputId = `course-img-input-${courseImgCounter}`;
        const imgDisplay = value ? value : 'https://placehold.co/800x400/e5e7eb/a3a3a3?text=Click+to+Add+Image';
        itemDiv.innerHTML = deleteBtn + `
            <div class="relative rounded-xl overflow-hidden bg-[#b2b2b2] h-48 group flex items-center justify-center m-1">
                <img id="${previewId}" src="${imgDisplay}" class="w-full h-full object-contain">
                <label class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span class="bg-white/90 text-gray-800 px-4 py-2 rounded-full font-bold shadow-sm hover:bg-white transition">📷 เลือกรูปภาพ / Crop</span>
                    <input type="file" id="${inputId}" class="hidden course-img-input" accept="image/*" onchange="previewImage(this, '${previewId}', NaN)">
                    <input type="hidden" class="course-img-old" value="${value}">
                </label>
            </div>
        `;
    } else if (type === 'video') {
        itemDiv.innerHTML = deleteBtn + `<input type="text" class="w-full border-none px-4 py-3 outline-none focus:ring-0 rounded-[1.2rem] course-video-input text-sm font-semibold placeholder-gray-400" placeholder="Link to your Video / Youtube / Vimeo" value="${value}">`;
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
    fetchCourses();
});