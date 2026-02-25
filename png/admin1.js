// =====================================================================
// --- API & Core JS ---
// =====================================================================
const getApiUrl = (action) => 'backend.php?action=' + action;
const fetchOptions = (method, body = null) => { 
    const opts = { method: method }; 
    if(body) opts.body = body; 
    opts.credentials = 'include'; 
    return opts; 
};

window.showToast = (msg) => { 
    const c = document.getElementById('toast-container'); 
    if(!c) return; 
    const t = document.createElement('div'); 
    t.className = 'toast'; 
    t.textContent = msg; 
    c.appendChild(t); 
    setTimeout(()=>t.classList.add('show'),10); 
    setTimeout(()=>{t.classList.remove('show'); setTimeout(()=>t.remove(),300);},3000); 
};

// ==========================================
// 1. Users Management (ดึงข้อมูลเหมือนเดิม)
// ==========================================
let allUsersData=[]; let selectedUserId=null;
async function fetchUsers(){ 
    const res = await (await fetch(getApiUrl('get_users'))).json(); 
    if(res.status==='success'){ allUsersData=res.data; renderUserTable(allUsersData); } 
}
function renderUserTable(arr){
    const tb = document.getElementById('user-table-body'); tb.innerHTML=''; selectedUserId=null; 
    document.getElementById('btn-action-password').disabled=true; document.getElementById('btn-action-delete').disabled=true;
    arr.forEach(u=>{
        const tr=document.createElement('tr'); tr.className='border-b hover:bg-blue-50 user-row'; tr.onclick=()=>selectUserRow(tr,u);
        tr.innerHTML=`<td class="p-4">${u.id}</td><td class="p-4 font-bold">${u.username}<div class="text-xs text-gray-500">${u.email}</div></td><td class="p-4 text-center">${u.role}</td>`; tb.appendChild(tr);
    });
}
function selectUserRow(el,u){ 
    document.querySelectorAll('.user-row').forEach(r=>r.classList.remove('bg-blue-100')); el.classList.add('bg-blue-100'); 
    selectedUserId=u.id; document.getElementById('btn-action-password').disabled=false; document.getElementById('btn-action-delete').disabled=false; 
}
document.getElementById('user-search-input')?.addEventListener('input', e => { 
    const val=e.target.value.toLowerCase(); 
    renderUserTable(allUsersData.filter(u=>u.username.toLowerCase().includes(val)||u.email.toLowerCase().includes(val))); 
});
document.getElementById('btn-action-delete')?.addEventListener('click', ()=>{ 
    if(selectedUserId && confirm('ยืนยันการลบผู้ใช้?')) { 
        const fd=new FormData(); fd.append('user_id',selectedUserId); 
        fetch(getApiUrl('delete_user'), fetchOptions('POST',fd)).then(()=>fetchUsers()); 
    }
});


// ==========================================
// 2. Events (Festival & Event) - รองรับ 2 ภาษา 🌟
// ==========================================
let selectedEventId = null;

async function fetchEvents() {
    try {
        const res = await (await fetch(getApiUrl('get_all_events'))).json();
        const tb = document.getElementById('event-table-body');
        if(!tb) return;
        tb.innerHTML = '';
        selectedEventId = null;
        document.getElementById('external-edit-btn')?.classList.add('hidden');
        document.getElementById('external-delete-btn')?.classList.add('hidden');
        if (res.status === 'success') {
            res.data.forEach(e => {
                tb.innerHTML += `<tr class="border-b hover:bg-gray-100 event-row cursor-pointer" onclick="selectEventRow(${e.id}, this)">
                    <td class="p-4 text-gray-500">${e.id}</td>
                    <td class="p-4 font-bold">${e.title}</td>
                    <td class="p-4">${e.start_date.split(' ')[0]}</td>
                    <td class="p-4 text-green-600 font-bold">Active</td>
                </tr>`;
            });
        }
    } catch(e) {}
}

window.selectEventRow = (id, el) => {
    document.querySelectorAll('.event-row').forEach(r => r.classList.remove('bg-blue-50'));
    el.classList.add('bg-blue-50');
    selectedEventId = id;
    document.getElementById('external-edit-btn')?.classList.remove('hidden');
    document.getElementById('external-delete-btn')?.classList.remove('hidden');
};

window.editSelectedEvent = async () => {
    if (!selectedEventId) return;
    document.getElementById('edit-event-id').value = selectedEventId;
    document.getElementById('cancel-edit-btn')?.classList.remove('hidden');
    document.getElementById('form-section-title').innerText = `กำลังแก้ไขข้อมูล Event ID: ${selectedEventId}`;
    document.getElementById('form-section-title').scrollIntoView({ behavior: 'smooth', block: 'center' });

    try {
        const res = await fetch(getApiUrl(`get_event_details&id=${selectedEventId}`));
        const result = await res.json();
        if(result.status === 'success') {
            const ev = result.data;
            // --- 🌟 ดึงข้อมูลทั้ง 2 ภาษา มาใส่ช่องกรอก 🌟 ---
            document.getElementById('ev-title').value = ev.title || '';
            document.getElementById('ev-title-th').value = ev.title_th || '';
            
            document.getElementById('ev-short-desc').value = ev.short_description || '';
            document.getElementById('ev-short-desc-th').value = ev.short_description_th || '';
            
            document.getElementById('ev-details').value = ev.details || '';
            document.getElementById('ev-details-th').value = ev.details_th || '';
            
            document.getElementById('venue-title').value = ev.venue_title || '';
            document.getElementById('venue-title-th').value = ev.venue_title_th || '';
            
            document.getElementById('venue-details').value = ev.venue_details || '';
            document.getElementById('venue-details-th').value = ev.venue_details_th || '';
            
            document.getElementById('venue-map').value = ev.venue_map || '';
            
            if(ev.start_date) {
                const [sd, st] = ev.start_date.split(' ');
                document.getElementById('ev-start-date').value = sd;
                if(st) document.getElementById('ev-start-time').value = st.substring(0,5);
            }
            if(ev.end_date) {
                const [ed, et] = ev.end_date.split(' ');
                document.getElementById('ev-end-date').value = ed;
                if(et) document.getElementById('ev-end-time').value = et.substring(0,5);
            }

            // แสดงรูปภาพ
            if(ev.banner_image) document.getElementById('banner-preview').innerHTML = `<img src="${ev.banner_image}" class="w-full h-full object-cover">`;
            if(ev.poster_image) document.getElementById('poster-preview').innerHTML = `<img src="${ev.poster_image}" class="w-full h-full object-cover">`;
            if(ev.venue_image) document.getElementById('venue-photo-preview').innerHTML = `<img src="${ev.venue_image}" class="w-full h-full object-cover">`;

            // ดึงข้อมูล Tickets
            const tList = document.getElementById('added-tickets-list');
            tList.innerHTML = '';
            if(ev.tickets) {
                ev.tickets.forEach(t => {
                    const div = document.createElement('div');
                    div.className = 'flex justify-between items-center bg-white p-3 rounded-lg border shadow-sm';
                    div.innerHTML = `
                        <div>
                            <h4 class="font-bold text-sm text-gray-800">${t.title} <span class="text-xs font-normal text-gray-500">(${t.amount} ใบ)</span></h4>
                            <p class="text-xs text-gray-500">${t.price} THB | ${t.is_open == 1 ? '<span class="text-green-500">Sale Open</span>' : '<span class="text-red-500">Sale Close</span>'}</p>
                            <input type="hidden" name="ticket_titles[]" value="${t.title}">
                            <input type="hidden" name="ticket_details[]" value="${t.details}">
                            <input type="hidden" name="ticket_prices[]" value="${t.price}">
                            <input type="hidden" name="ticket_amounts[]" value="${t.amount}">
                            <input type="hidden" name="ticket_status[]" value="${t.is_open}">
                        </div>
                        <button type="button" class="text-red-500 hover:bg-red-50 p-2 rounded-full" onclick="this.parentElement.remove()">🗑</button>
                    `;
                    tList.appendChild(div);
                });
            }

            // ดึงข้อมูล Lineups
            const lList = document.getElementById('added-lineups-list');
            lList.innerHTML = '';
            if(ev.lineups) {
                ev.lineups.forEach(l => {
                    const div = document.createElement('div');
                    div.className = 'flex justify-between items-center bg-white p-3 rounded-lg border shadow-sm';
                    div.innerHTML = `
                        <div>
                            <h4 class="font-bold text-sm text-gray-800">${l.band_name}</h4>
                            <p class="text-xs text-gray-500">${l.lineup_date} ${l.lineup_time} | ${l.lineup_stage}</p>
                            <input type="hidden" name="lineup_dates[]" value="${l.lineup_date}">
                            <input type="hidden" name="lineup_times[]" value="${l.lineup_time}">
                            <input type="hidden" name="lineup_stages[]" value="${l.lineup_stage}">
                            <input type="hidden" name="lineup_names[]" value="${l.band_name}">
                        </div>
                        <button type="button" class="text-red-500 hover:bg-red-50 p-2 rounded-full" onclick="this.parentElement.remove()">🗑</button>
                    `;
                    lList.appendChild(div);
                });
            }

            // แสดง Gallery
            const gWrap = document.getElementById('gallery-previews-wrapper');
            gWrap.innerHTML = '';
            if(ev.gallery_images) {
                try {
                    const gImgs = JSON.parse(ev.gallery_images);
                    gImgs.forEach(src => {
                        gWrap.innerHTML += `<div class="relative w-32 h-32 rounded-lg overflow-hidden border shadow-sm"><img src="${src}" class="w-full h-full object-cover"></div>`;
                    });
                } catch(e) {}
            }
        }
    } catch(e) { console.error(e); }
};

window.cancelEditEvent = () => {
    document.getElementById('edit-event-id').value = '';
    document.getElementById('cancel-edit-btn')?.classList.add('hidden');
    document.getElementById('form-section-title').innerText = 'เพิ่มข้อมูล Event ใหม่';
    
    // เคลียร์ค่า input/textarea ทั้ง EN และ TH
    const inputs = document.querySelectorAll('#section-festival input[type=text], #section-festival input[type=number], #section-festival textarea, #section-festival input[type=date], #section-festival input[type=time]');
    inputs.forEach(el => el.value = '');
    
    document.getElementById('added-tickets-list').innerHTML = '';
    document.getElementById('added-lineups-list').innerHTML = '';
    document.getElementById('gallery-previews-wrapper').innerHTML = '';
    
    document.getElementById('banner-preview').innerHTML = '<span class="relative z-10 font-bold drop-shadow-md">+ Add Banner</span><input type="file" id="event-banner" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onchange="previewImage(this, \'banner-preview\', 3/1)">';
    document.getElementById('poster-preview').innerHTML = '<span class="relative z-10 font-bold drop-shadow-md">+ Add Poster</span><input type="file" id="event-poster" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onchange="previewImage(this, \'poster-preview\', 3/4)">';
    document.getElementById('venue-photo-preview').innerHTML = '<span class="relative z-10 font-bold drop-shadow-md">+ Add Photo</span><input type="file" id="venue-photo" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onchange="previewImage(this, \'venue-photo-preview\', 16/9)">';
    
    window.croppedImagesData = {};
};

window.deleteSelectedEvent = async () => {
    if (!selectedEventId) return;
    if (confirm('คุณต้องการลบข้อมูล Event นี้ใช่หรือไม่?')) {
        try {
            const fd = new FormData(); fd.append('event_id', selectedEventId);
            const res = await fetch(getApiUrl('delete_event'), fetchOptions('POST', fd));
            const result = await res.json();
            if(result.status === 'success') {
                showToast('ลบข้อมูลสำเร็จ');
                fetchEvents();
                cancelEditEvent();
            } else showToast('Error: ' + result.message);
        } catch(e) {}
    }
};

window.saveEvent = async () => {
    try {
        const fd = new FormData();
        fd.append('event_id', document.getElementById('edit-event-id').value);
        
        // --- 🌟 รวบรวมข้อมูลแพ็คส่งให้ Backend ทั้ง 2 ภาษา 🌟 ---
        fd.append('title', document.getElementById('ev-title').value);
        fd.append('title_th', document.getElementById('ev-title-th').value);
        
        fd.append('short_description', document.getElementById('ev-short-desc').value);
        fd.append('short_description_th', document.getElementById('ev-short-desc-th').value);
        
        fd.append('details', document.getElementById('ev-details').value);
        fd.append('details_th', document.getElementById('ev-details-th').value);
        
        fd.append('venue_title', document.getElementById('venue-title').value);
        fd.append('venue_title_th', document.getElementById('venue-title-th').value);
        
        fd.append('venue_details', document.getElementById('venue-details').value);
        fd.append('venue_details_th', document.getElementById('venue-details-th').value);
        
        fd.append('venue_map', document.getElementById('venue-map').value);
        
        let sd = document.getElementById('ev-start-date').value; let st = document.getElementById('ev-start-time').value;
        fd.append('start_date', sd ? `${sd} ${st}:00` : '');
        let ed = document.getElementById('ev-end-date').value; let et = document.getElementById('ev-end-time').value;
        fd.append('end_date', ed ? `${ed} ${et}:00` : '');
        
        // จัดการรูปภาพ (ถ้ามีการใช้ Cropper.js)
        if(window.croppedImagesData) {
            if(window.croppedImagesData['event-banner']) fd.append('banner_image', window.croppedImagesData['event-banner'], 'banner.jpg');
            else if(document.getElementById('event-banner')?.files[0]) fd.append('banner_image', document.getElementById('event-banner').files[0]);
            
            if(window.croppedImagesData['event-poster']) fd.append('poster_image', window.croppedImagesData['event-poster'], 'poster.jpg');
            else if(document.getElementById('event-poster')?.files[0]) fd.append('poster_image', document.getElementById('event-poster').files[0]);
            
            if(window.croppedImagesData['venue-photo']) fd.append('venue_image', window.croppedImagesData['venue-photo'], 'venue.jpg');
            else if(document.getElementById('venue-photo')?.files[0]) fd.append('venue_image', document.getElementById('venue-photo').files[0]);
        }

        // จัดการ Gallery หลายรูป
        const galleryFiles = document.getElementById('gallery-photo')?.files;
        if(galleryFiles) {
            for(let i=0; i<galleryFiles.length; i++) {
                fd.append('gallery_images[]', galleryFiles[i]);
            }
        }

        // Ticket & Lineup Arrays
        document.querySelectorAll('input[name="ticket_titles[]"]').forEach(el => fd.append('ticket_titles[]', el.value));
        document.querySelectorAll('input[name="ticket_details[]"]').forEach(el => fd.append('ticket_details[]', el.value));
        document.querySelectorAll('input[name="ticket_prices[]"]').forEach(el => fd.append('ticket_prices[]', el.value));
        document.querySelectorAll('input[name="ticket_amounts[]"]').forEach(el => fd.append('ticket_amounts[]', el.value));
        document.querySelectorAll('input[name="ticket_status[]"]').forEach(el => fd.append('ticket_status[]', el.value));

        document.querySelectorAll('input[name="lineup_dates[]"]').forEach(el => fd.append('lineup_dates[]', el.value));
        document.querySelectorAll('input[name="lineup_times[]"]').forEach(el => fd.append('lineup_times[]', el.value));
        document.querySelectorAll('input[name="lineup_stages[]"]').forEach(el => fd.append('lineup_stages[]', el.value));
        document.querySelectorAll('input[name="lineup_names[]"]').forEach(el => fd.append('lineup_names[]', el.value));

        showToast('กำลังบันทึกข้อมูล Event...');
        const res = await fetch(getApiUrl('save_event'), fetchOptions('POST', fd));
        const result = await res.json();
        
        if (result.status === 'success') {
            showToast('บันทึกข้อมูลสำเร็จ!');
            fetchEvents();
            cancelEditEvent();
        } else showToast('ข้อผิดพลาด: ' + result.message);
    } catch (error) { showToast('การเชื่อมต่อล้มเหลว'); }
};

window.addTicketToList = () => {
    const title = document.getElementById('temp_ticket_title').value;
    const details = document.getElementById('temp_ticket_details').value;
    const price = document.getElementById('temp_ticket_price').value;
    const amount = document.getElementById('temp_ticket_amount').value;
    const status = document.querySelector('input[name="temp_ticket_status"]:checked').value;
    
    if(!title || !price) { alert('กรุณากรอกชื่อบัตรและราคา'); return; }

    const list = document.getElementById('added-tickets-list');
    const div = document.createElement('div');
    div.className = 'flex justify-between items-center bg-white p-3 rounded-lg border shadow-sm';
    div.innerHTML = `
        <div>
            <h4 class="font-bold text-sm text-gray-800">${title} <span class="text-xs font-normal text-gray-500">(${amount} ใบ)</span></h4>
            <p class="text-xs text-gray-500">${price} THB | ${status == 1 ? '<span class="text-green-500">Sale Open</span>' : '<span class="text-red-500">Sale Close</span>'}</p>
            <input type="hidden" name="ticket_titles[]" value="${title}">
            <input type="hidden" name="ticket_details[]" value="${details}">
            <input type="hidden" name="ticket_prices[]" value="${price}">
            <input type="hidden" name="ticket_amounts[]" value="${amount}">
            <input type="hidden" name="ticket_status[]" value="${status}">
        </div>
        <button type="button" class="text-red-500 hover:bg-red-50 p-2 rounded-full transition" onclick="this.parentElement.remove()">🗑</button>
    `;
    list.appendChild(div);
    
    document.getElementById('temp_ticket_title').value = '';
    document.getElementById('temp_ticket_details').value = '';
    document.getElementById('temp_ticket_price').value = '';
    document.getElementById('temp_ticket_amount').value = '';
};

window.addLineUpToList = () => {
    const date = document.getElementById('temp_lineup_date').value;
    const time = document.getElementById('temp_lineup_time').value;
    const stage = document.getElementById('temp_lineup_stage').value;
    const name = document.getElementById('temp_lineup_name').value;
    
    if(!name) { alert('กรุณากรอกชื่อศิลปิน'); return; }

    const list = document.getElementById('added-lineups-list');
    const div = document.createElement('div');
    div.className = 'flex justify-between items-center bg-white p-3 rounded-lg border shadow-sm';
    div.innerHTML = `
        <div>
            <h4 class="font-bold text-sm text-gray-800">${name}</h4>
            <p class="text-xs text-gray-500">${date} ${time} | ${stage}</p>
            <input type="hidden" name="lineup_dates[]" value="${date}">
            <input type="hidden" name="lineup_times[]" value="${time}">
            <input type="hidden" name="lineup_stages[]" value="${stage}">
            <input type="hidden" name="lineup_names[]" value="${name}">
        </div>
        <button type="button" class="text-red-500 hover:bg-red-50 p-2 rounded-full transition" onclick="this.parentElement.remove()">🗑</button>
    `;
    list.appendChild(div);
    
    document.getElementById('temp_lineup_time').value = '';
    document.getElementById('temp_lineup_name').value = '';
};


// ==========================================
// 3. Musicians Network - รองรับ 2 ภาษา 🌟
// ==========================================
window.allMusicians = [];

window.switchMusicianTab = (tab) => {
    document.getElementById('musician-artist-content').classList.toggle('hidden', tab !== 'artist');
    document.getElementById('musician-jazz-content').classList.toggle('hidden', tab !== 'jazz');
    
    document.getElementById('tab-btn-artist').className = tab === 'artist' 
        ? 'flex-1 bg-[#ffc107] text-black font-bold py-2 rounded-full shadow text-center transition' 
        : 'flex-1 text-gray-500 font-bold py-2 rounded-full text-center hover:bg-gray-300 transition';
        
    document.getElementById('tab-btn-jazz').className = tab === 'jazz' 
        ? 'flex-1 bg-[#ffc107] text-black font-bold py-2 rounded-full shadow text-center transition' 
        : 'flex-1 text-gray-500 font-bold py-2 rounded-full text-center hover:bg-gray-300 transition';
};

window.fetchMusicians = async () => {
    try {
        const res = await (await fetch(getApiUrl('get_all_musicians'))).json();
        if(res.status === 'success') {
            window.allMusicians = res.data;
            renderMusicianGrid('artist-grid-container', 'artist_library', 'art', 'artist');
            renderMusicianGrid('jazz-grid-container', 'jazz_network', 'jazz', 'jazz');
        }
    } catch(e) {}
};

window.renderMusicianGrid = (containerId, type, prefix, typeName) => {
    const c = document.getElementById(containerId);
    if(!c) return;
    c.innerHTML = ''; 
    const items = window.allMusicians.filter(m => m.network_type === type);
    
    items.forEach((item, index) => {
        const slotNum = item.slot_number || (index + 1);
        const img = item.profile_image || 'https://placehold.co/400x400/222/fff?text=No+Img';
        c.innerHTML += `
            <div onclick="clickMusicianSlot(${slotNum}, ${item.id}, '${prefix}', '${typeName}')" class="aspect-square bg-gray-100 rounded-2xl p-2 cursor-pointer relative overflow-hidden group shadow-sm hover:shadow-md transition border border-gray-200">
                <img src="${img}" class="w-full h-full object-cover rounded-xl group-hover:scale-105 transition duration-500">
                <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex flex-col justify-end p-4">
                    <h3 class="font-bold text-white text-lg leading-tight drop-shadow-md">${item.title}</h3>
                    <p class="text-white/80 text-xs mt-1">Slot: ${slotNum}</p>
                </div>
            </div>
        `;
    });
    
    c.innerHTML += `
        <div onclick="clickMusicianSlot(${items.length + 1}, null, '${prefix}', '${typeName}')" class="aspect-square border-2 border-dashed border-gray-300 flex flex-col items-center justify-center rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition text-gray-500 group">
            <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold group-hover:bg-blue-100 group-hover:text-blue-600 transition mb-2">+</div>
            <span class="font-semibold text-sm">Add Slot ${items.length + 1}</span>
        </div>
    `;
};

window.clickMusicianSlot = async (slotNum, id, prefix, typeName) => {
    document.getElementById(`edit-${typeName}-slot`).value = slotNum; 
    document.getElementById(`${typeName}-form-container`).classList.remove('hidden');
    document.getElementById(`${typeName}-form-title`).innerText = id ? `แก้ไขข้อมูล Slot: ${slotNum}` : `เพิ่มข้อมูล Slot: ${slotNum}`;
    document.getElementById(`${typeName}-form-title`).scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (id) { 
        document.getElementById('edit-musician-id').value = id; 
        try {
            const m = (await(await fetch(getApiUrl(`get_musician_details&id=${id}`))).json()).data;
            // --- 🌟 ดึงข้อมูล 2 ภาษามาใส่ช่องกรอก 🌟 ---
            document.getElementById(`${prefix}-title`).value = m.title || '';
            document.getElementById(`${prefix}-title-th`).value = m.title_th || '';
            
            document.getElementById(`${prefix}-genre`).value = m.genre || '';
            document.getElementById(`${prefix}-genre-th`).value = m.genre_th || '';
            
            document.getElementById(`${prefix}-details`).value = m.details || '';
            document.getElementById(`${prefix}-details-th`).value = m.details_th || '';
            
            document.getElementById(`${prefix}-fb`).value = m.facebook || '';
            document.getElementById(`${prefix}-wa`).value = m.whatsapp || '';
            document.getElementById(`${prefix}-ig`).value = m.instagram || '';
            document.getElementById(`${prefix}-web`).value = m.website || '';
            document.getElementById(`${prefix}-tk`).value = m.tiktok || '';
            document.getElementById(`${prefix}-email`).value = m.email || '';

            if(m.banner_image) document.getElementById(`${typeName}-banner-img`).src = m.banner_image;
            else document.getElementById(`${typeName}-banner-img`).src = 'https://placehold.co/1200x400/e5e7eb/a3a3a3';
            
            if(m.profile_image) document.getElementById(`${typeName}-profile-img`).src = m.profile_image;
            else document.getElementById(`${typeName}-profile-img`).src = 'https://placehold.co/600x600/e5e7eb/a3a3a3';

            const vCont = document.getElementById(`${prefix}-video-container`);
            vCont.innerHTML = '';
            let vids = [];
            try { vids = JSON.parse(m.video_link || '[]'); } catch(e){}
            if(vids.length === 0) {
                vCont.innerHTML = `<div class="flex gap-3 items-center"><input type="text" class="w-full border border-gray-400 rounded-full px-5 py-2 outline-none focus:border-yellow-500 font-semibold text-sm ${prefix}-video" placeholder="Link to your Video / Youtube / Vimeo"><button type="button" onclick="addVideoRow('${prefix}-video-container', '${prefix}-video')" class="bg-[#ffc107] text-black px-6 py-2 rounded-full font-extrabold shadow-sm hover:bg-yellow-500">Add</button></div>`;
            } else {
                vids.forEach((v, i) => {
                    vCont.innerHTML += `
                        <div class="flex gap-3 items-center mt-3">
                            <input type="text" class="w-full border border-gray-400 rounded-full px-5 py-2 outline-none focus:border-yellow-500 font-semibold text-sm ${prefix}-video" value="${v}">
                            ${i===0 
                                ? `<button type="button" onclick="addVideoRow('${prefix}-video-container', '${prefix}-video')" class="bg-[#ffc107] text-black px-6 py-2 rounded-full font-extrabold shadow-sm hover:bg-yellow-500">Add</button>` 
                                : `<button type="button" onclick="this.parentElement.remove()" class="bg-red-500 text-white px-6 py-2 rounded-full font-extrabold shadow-sm hover:bg-red-600">Del</button>`}
                        </div>
                    `;
                });
            }
        } catch(e) {}
    } else { 
        document.getElementById('edit-musician-id').value = ''; 
        document.querySelectorAll(`#${typeName}-form-container input[type="text"], #${typeName}-form-container textarea`).forEach(e => e.value = ''); 
        document.getElementById(`${typeName}-banner-img`).src = 'https://placehold.co/1200x400/e5e7eb/a3a3a3';
        document.getElementById(`${typeName}-profile-img`).src = 'https://placehold.co/600x600/e5e7eb/a3a3a3';
        document.getElementById(`${prefix}-video-container`).innerHTML = `<div class="flex gap-3 items-center"><input type="text" class="w-full border border-gray-400 rounded-full px-5 py-2 outline-none focus:border-yellow-500 font-semibold text-sm ${prefix}-video" placeholder="Link to your Video / Youtube / Vimeo"><button type="button" onclick="addVideoRow('${prefix}-video-container', '${prefix}-video')" class="bg-[#ffc107] text-black px-6 py-2 rounded-full font-extrabold shadow-sm hover:bg-yellow-500">Add</button></div>`;
    }
    window.croppedImagesData = {};
};

window.closeArtistForm = () => document.getElementById('artist-form-container').classList.add('hidden');
window.closeJazzForm = () => document.getElementById('jazz-form-container').classList.add('hidden');

window.saveMusician = async (type) => {
    const p = type === 'artist_library' ? 'art' : 'jazz'; 
    const tName = type === 'artist_library' ? 'artist' : 'jazz';
    
    try {
        const fd = new FormData(); 
        fd.append('musician_id', document.getElementById('edit-musician-id').value); 
        fd.append('network_type', type); 
        fd.append('slot_number', document.getElementById(`edit-${tName}-slot`).value);
        
        // --- 🌟 รวบรวมข้อมูล 2 ภาษา 🌟 ---
        fd.append('title', document.getElementById(`${p}-title`).value); 
        fd.append('title_th', document.getElementById(`${p}-title-th`).value); 
        
        fd.append('genre', document.getElementById(`${p}-genre`).value); 
        fd.append('genre_th', document.getElementById(`${p}-genre-th`).value); 
        
        fd.append('details', document.getElementById(`${p}-details`).value); 
        fd.append('details_th', document.getElementById(`${p}-details-th`).value); 
        
        fd.append('facebook', document.getElementById(`${p}-fb`).value);
        fd.append('whatsapp', document.getElementById(`${p}-wa`).value);
        fd.append('instagram', document.getElementById(`${p}-ig`).value);
        fd.append('website', document.getElementById(`${p}-web`).value);
        fd.append('tiktok', document.getElementById(`${p}-tk`).value);
        fd.append('email', document.getElementById(`${p}-email`).value);

        let vids = [];
        document.querySelectorAll(`.${p}-video`).forEach(inp => { if(inp.value.trim()) vids.push(inp.value.trim()); });
        vids.forEach(v => fd.append('video_links[]', v));

        if(window.croppedImagesData) {
            if(window.croppedImagesData[`${tName}-banner`]) fd.append('banner_image', window.croppedImagesData[`${tName}-banner`], 'banner.jpg');
            else if(document.getElementById(`${tName}-banner`)?.files[0]) fd.append('banner_image', document.getElementById(`${tName}-banner`).files[0]);
            
            if(window.croppedImagesData[`${tName}-profile`]) fd.append('profile_image', window.croppedImagesData[`${tName}-profile`], 'profile.jpg');
            else if(document.getElementById(`${tName}-profile`)?.files[0]) fd.append('profile_image', document.getElementById(`${tName}-profile`).files[0]);
        }

        showToast('กำลังบันทึกข้อมูล...');
        const res = await fetch(getApiUrl('save_musician'), fetchOptions('POST', fd));
        const result = await res.json();
        
        if (result.status === 'success') {
            showToast(result.message);
            fetchMusicians(); 
            document.getElementById(`${tName}-form-container`).classList.add('hidden');
        } else {
            showToast('Error: ' + result.message);
        }
    } catch(e) { showToast('Connection Error'); }
};

window.deleteTargetMusician = async (id) => {
    if(!id) return;
    if(confirm('ลบข้อมูลนี้ใช่หรือไม่?')) {
        const fd = new FormData(); fd.append('musician_id', id);
        const res = await (await fetch(getApiUrl('delete_musician'), fetchOptions('POST', fd))).json();
        showToast(res.message);
        if(res.status==='success') { 
            fetchMusicians(); 
            document.getElementById('artist-form-container').classList.add('hidden'); 
            document.getElementById('jazz-form-container').classList.add('hidden'); 
        }
    }
}

window.addVideoRow = (containerId, inputClass) => {
    const c = document.getElementById(containerId);
    const div = document.createElement('div');
    div.className = 'flex gap-3 items-center mt-3';
    div.innerHTML = `<input type="text" class="w-full border border-gray-400 rounded-full px-5 py-2 outline-none focus:border-yellow-500 placeholder-gray-400 font-semibold text-sm ${inputClass}" placeholder="Video Link"><button type="button" onclick="this.parentElement.remove()" class="bg-red-500 text-white px-6 py-2 rounded-full font-extrabold shadow-sm hover:bg-red-600 transition">Del</button>`;
    c.appendChild(div);
};