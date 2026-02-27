<?php
session_start();
// ตรวจสอบสิทธิ์ว่าล็อกอินเป็น admin หรือไม่ ถ้าไม่ใช่ให้เด้งกลับหน้าแรก
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    header("Location: index2.html");
    exit();
}
?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - Music & Event Management</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Kanit', sans-serif; background-color: #f3f4f6; }
        .hidden { display: none !important; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }
        .upload-box { background-color: #d1d5db; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; font-weight: 600; cursor: pointer; transition: background-color 0.2s; }
        .upload-box:hover { background-color: #9ca3af; }
        .input-style { width: 100%; border: 1px solid #d1d5db; border-radius: 9999px; padding: 0.5rem 1rem; outline: none; transition: border-color 0.2s; }
        .input-style:focus { border-color: #3b82f6; }
        .textarea-style { width: 100%; border: 1px solid #d1d5db; border-radius: 1rem; padding: 0.75rem 1rem; outline: none; min-height: 120px; }
        #toast-container { position: fixed; bottom: 20px; right: 20px; z-index: 50; }
        .toast { background: #333; color: white; padding: 12px 24px; border-radius: 8px; margin-top: 10px; opacity: 0; transition: opacity 0.3s; }
        .toast.show { opacity: 1; }
    </style>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
</head>
<body class="h-screen flex overflow-hidden">

   <aside class="w-64 bg-white border-r border-gray-200 flex flex-col h-full z-10" id="sidebar">
        <div class="p-6"><h1 class="text-2xl font-bold">Admin Panel</h1></div>
        <nav class="flex-1 overflow-y-auto">
            <ul class="space-y-1">
                <li><a href="#" data-target="section-admin" class="nav-link block px-6 py-3 font-semibold bg-gray-100 text-gray-800">Admin (User Mgt.)</a></li>
                <li><a href="#" data-target="section-festival" class="nav-link block px-6 py-3 font-semibold hover:bg-blue-100 text-gray-800">Festival & Event</a></li>
                <li>
                    <a href="#" data-target="section-musician" class="nav-link block px-6 py-3 font-semibold hover:bg-yellow-100 text-gray-800 flex justify-between items-center">Musician Network</a>
                    <ul class="pl-10 space-y-1 mt-1 text-sm text-gray-600">
                        <li><a href="#" onclick="switchMusicianTab('artist'); document.querySelector('[data-target=section-musician]').click();" class="block py-1 hover:text-black">Artist Library</a></li>
                        <li><a href="#" onclick="switchMusicianTab('jazz'); document.querySelector('[data-target=section-musician]').click();" class="block py-1 hover:text-black">Jazz Network</a></li>
                    </ul>
                </li>
                <li><a href="#" data-target="section-courses" class="nav-link block px-6 py-3 font-semibold hover:bg-green-100 text-gray-800">Courses Library</a></li>
                <li><a href="#" data-target="section-cmbigband" class="nav-link block px-6 py-3 font-semibold hover:bg-gray-200 text-gray-800">CMBigband</a></li>
                
                <li><a href="#" data-target="section-forum" class="nav-link block px-6 py-3 font-semibold hover:bg-orange-100 text-gray-800">Forum Q&A</a></li>
                <li><a href="#" data-target="section-store" class="nav-link block px-6 py-3 font-semibold hover:bg-pink-100 text-gray-800">Store & Merch</a></li>
            </ul>
        </nav>
        <div class="p-4 border-t border-gray-200">
            <button id="logout-btn" type="button" class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded font-semibold">ออกจากระบบ</button>
        </div>
    </aside>

    <main class="flex-1 h-full overflow-y-auto bg-white relative" id="main-content">
        
        <section id="section-admin" class="content-section p-8 max-w-6xl mx-auto">
            <h2 class="text-3xl font-bold mb-6 text-gray-800">จัดการสมาชิก (User Management)</h2>
            <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div class="relative w-full md:w-1/3">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </div>
                    <input type="text" id="user-search-input" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-medium" placeholder="ค้นหาชื่อผู้ใช้ หรือ อีเมล...">
                </div>
                <div class="flex gap-3 w-full md:w-auto">
                    <button id="btn-action-password" disabled class="bg-blue-500 text-white px-6 py-2 rounded-lg font-bold shadow-sm opacity-50 cursor-not-allowed hover:bg-blue-600 transition flex items-center gap-2">🔑 เปลี่ยนรหัสผ่าน</button>
                    <button id="btn-action-delete" disabled class="bg-red-500 text-white px-6 py-2 rounded-lg font-bold shadow-sm opacity-50 cursor-not-allowed hover:bg-red-600 transition flex items-center gap-2">🗑️ ลบผู้ใช้</button>
                </div>
            </div>
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table class="w-full text-left border-collapse cursor-pointer">
                    <thead><tr class="bg-gray-50 text-gray-700 text-sm uppercase tracking-wider border-b border-gray-200"><th class="p-4 font-bold w-16 text-center">ID</th><th class="p-4 font-bold">ชื่อผู้ใช้ (Username / Email)</th><th class="p-4 font-bold w-32 text-center">บทบาท (Role)</th></tr></thead>
                    <tbody id="user-table-body" class="text-gray-800"></tbody>
                </table>
            </div>
            <p id="user-selection-status" class="text-sm font-medium text-gray-500 mt-4 text-right">ยังไม่ได้เลือกผู้ใช้งาน</p>
        </section>

        <section id="section-festival" class="content-section hidden">
            <div class="bg-blue-600 text-white p-6 flex justify-between items-center sticky top-0 z-10 shadow-md">
                <h2 class="text-3xl font-bold">Festival & Event</h2>
                <button class="bg-blue-500 hover:bg-blue-700 px-6 py-2 rounded-full border border-white font-semibold shadow" onclick="saveEvent()">+ Save Event</button>
            </div>
            
            <div class="p-8 max-w-4xl mx-auto space-y-8">
                <div class="mb-10 bg-white border rounded-2xl shadow-sm p-6">
                    <h3 class="text-2xl font-bold mb-4 border-b pb-2 text-gray-800">รายการ Event ทั้งหมดในระบบ</h3>
                    <div class="overflow-hidden rounded-xl border">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-gray-100 border-b">
                                    <th class="p-4 font-semibold text-gray-600">ID</th>
                                    <th class="p-4 font-semibold text-gray-600">ชื่องาน (Title)</th>
                                    <th class="p-4 font-semibold text-gray-600">เริ่มวันที่</th>
                                    <th class="p-4 font-semibold text-gray-600">สถานะ</th>
                                </tr>
                            </thead>
                            <tbody id="event-table-body"><tr><td colspan="4" class="p-4 text-center">กำลังโหลดข้อมูล...</td></tr></tbody>
                        </table>
                    </div>
                    <div class="mt-4 flex justify-end gap-3 h-10">
                        <button id="external-edit-btn" onclick="editSelectedEvent()" class="hidden bg-blue-500 text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-blue-600">✏️ แก้ไขข้อมูล</button>
                        <button id="external-delete-btn" onclick="deleteSelectedEvent()" class="hidden bg-red-500 text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-red-600">🗑️ ลบข้อมูล</button>
                    </div>
                </div>
                
                <div class="flex justify-between items-end mb-4 border-b pb-2">
                    <h3 id="form-section-title" class="text-2xl font-bold text-gray-800">เพิ่มข้อมูล Event ใหม่</h3>
                    <div class="flex items-center gap-3 text-sm font-bold bg-white px-4 py-1.5 rounded-full border border-gray-200 shadow-sm">
                        <button type="button" class="admin-lang-btn text-red-500 border-b-2 border-red-500 pb-0.5" data-form="event" onclick="switchAdminLang(this, 'en', 'event')">GB English</button>
                        <span class="text-gray-300">|</span>
                        <button type="button" class="admin-lang-btn text-gray-400 hover:text-gray-800 transition pb-0.5" data-form="event" onclick="switchAdminLang(this, 'th', 'event')">TH ไทย</button>
                    </div>
                </div>
                
                <input type="hidden" id="edit-event-id" value="">

                <div class="grid grid-cols-2 gap-4 h-48 mb-6">
                    <div class="relative rounded-xl overflow-hidden border border-gray-300 bg-gray-100 group">
                        <img id="event-banner-img" src="https://placehold.co/1200x400/e5e7eb/a3a3a3?text=Add+Banner" class="w-full h-full object-cover">
                        <label for="event-banner" class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span class="bg-white/90 text-gray-800 px-4 py-2 rounded-full font-bold shadow-sm">📷 เปลี่ยน Banner</span>
                            <input type="file" id="event-banner" class="hidden" accept="image/*" onchange="previewImage(this, 'event-banner-img')">
                        </label>
                    </div>
                    <div class="relative rounded-xl overflow-hidden border border-gray-300 bg-gray-100 group">
                        <img id="event-poster-img" src="https://placehold.co/600x800/e5e7eb/a3a3a3?text=Add+Poster" class="w-full h-full object-cover">
                        <label for="event-poster" class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span class="bg-white/90 text-gray-800 px-4 py-2 rounded-full font-bold shadow-sm">📷 เปลี่ยน Poster</span>
                            <input type="file" id="event-poster" class="hidden" accept="image/*" onchange="previewImage(this, 'event-poster-img')">
                        </label>
                    </div>
                </div>

                <div class="space-y-4">
                    <input type="text" id="ev-title" class="input-style lang-en" placeholder="Title (EN)">
                    <input type="text" id="ev-title-th" class="input-style lang-th hidden" placeholder="ชื่องาน (TH)">
                    
                    <input type="text" id="ev-short-desc" class="input-style lang-en" placeholder="Short Description (EN)">
                    <input type="text" id="ev-short-desc-th" class="input-style lang-th hidden" placeholder="คำอธิบายแบบย่อ (TH)">
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div><label class="block text-xs text-gray-500 ml-2 mb-1">Start Date</label><div class="flex gap-2"><input type="date" id="ev-start-date" class="input-style"><input type="time" id="ev-start-time" class="input-style w-32" value="12:00"></div></div>
                        <div><label class="block text-xs text-gray-500 ml-2 mb-1">End Date</label><div class="flex gap-2"><input type="date" id="ev-end-date" class="input-style"><input type="time" id="ev-end-time" class="input-style w-32" value="15:00"></div></div>
                    </div>
                    <input type="text" id="ev-location" class="input-style" placeholder="Location (Map Search)">
                    
                    <textarea id="ev-details" class="textarea-style lang-en" placeholder="Details (EN) ...."></textarea>
                    <textarea id="ev-details-th" class="textarea-style lang-th hidden" placeholder="รายละเอียดแบบเต็ม (TH) ...."></textarea>
                </div>
                
                <div>
                    <h3 class="text-xl font-bold mb-4 mt-8">Ticket</h3>
                    <div class="border p-4 rounded-xl relative bg-gray-50/50">
                        <div class="flex gap-4 mb-4">
                            <label class="flex items-center gap-2"><input type="radio" name="temp_ticket_status" value="1" checked> Sale Open</label>
                            <label class="flex items-center gap-2"><input type="radio" name="temp_ticket_status" value="0"> Sale Close</label>
                        </div>
                        <div class="space-y-4">
                            <input type="text" id="temp_ticket_title" class="input-style" placeholder="Ticket Title">
                            <textarea id="temp_ticket_details" class="textarea-style min-h-[80px]" placeholder="Details"></textarea>
                            <div class="grid grid-cols-2 gap-4">
                                <input type="number" id="temp_ticket_price" class="input-style" placeholder="Price (THB)">
                                <input type="number" id="temp_ticket_amount" class="input-style" placeholder="Sale Amount">
                            </div>
                        </div>
                        <button type="button" onclick="addTicketToList()" class="absolute -bottom-4 right-4 bg-blue-600 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg hover:bg-blue-700">+ Add Ticket</button>
                    </div>
                    <div id="added-tickets-list" class="mt-8 space-y-2"></div>
                </div>

                <div>
                    <h3 class="text-xl font-bold mb-4 mt-8">Line Up</h3>
                    <div class="border p-4 rounded-xl relative bg-gray-50/50">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div><label class="block text-xs text-gray-500 ml-2 mb-1">Date</label><input type="date" id="temp_lineup_date" class="input-style"></div>
                            <div><label class="block text-xs text-gray-500 ml-2 mb-1">Time</label><input type="time" id="temp_lineup_time" class="input-style"></div>
                        </div>
                        <div class="space-y-4">
                            <input type="text" id="temp_lineup_stage" class="input-style" placeholder="Stage / Venue">
                            <input type="text" id="temp_lineup_name" class="input-style" placeholder="Artist / Band Name">
                        </div>
                        <button type="button" onclick="addLineUpToList()" class="absolute -bottom-4 right-4 bg-blue-600 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg hover:bg-blue-700">+ Add Line Up</button>
                    </div>
                    <div id="added-lineups-list" class="mt-8 space-y-2"></div>
                </div>

                <div><h3 class="text-xl font-bold mb-4 mt-8">Venue</h3>
                    <div class="flex gap-4 items-stretch">
                        <div class="w-1/3 min-h-[200px] relative rounded-xl overflow-hidden border border-gray-300 bg-gray-100 group shrink-0">
                            <img id="venue-photo-img" src="https://placehold.co/800x450/e5e7eb/a3a3a3?text=Add+Venue+Photo" class="absolute inset-0 w-full h-full object-cover">
                            <label for="venue-photo" class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10">
                                <span class="bg-white/90 text-gray-800 px-4 py-2 rounded-full font-bold shadow-sm text-sm">📷 เปลี่ยนรูป</span>
                                <input type="file" id="venue-photo" class="hidden" accept="image/*" onchange="previewImage(this, 'venue-photo-img')">
                            </label>
                        </div>
                        <div class="flex-1 flex flex-col space-y-3">
                            <input type="text" id="venue-title" class="input-style lang-en" placeholder="Venue Title (EN)">
                            <input type="text" id="venue-title-th" class="input-style lang-th hidden" placeholder="ชื่อสถานที่จัดงาน (TH)">
                            <textarea id="venue-details" class="textarea-style flex-1 lang-en" placeholder="Venue Details (EN)"></textarea>
                            <textarea id="venue-details-th" class="textarea-style flex-1 lang-th hidden" placeholder="รายละเอียดสถานที่ (TH)"></textarea>
                            <input type="text" id="venue-map" class="input-style" placeholder="วางโค้ด <iframe src=...> จาก Google Maps" oninput="previewMap(this.value)">
                            <div id="map-preview-container" class="w-full mt-2 rounded-xl overflow-hidden hidden border border-gray-300"></div>
                        </div>
                    </div>
                </div>
                
                <div><h3 class="text-xl font-bold mb-4 mt-8">Gallery</h3>
                    <div id="gallery-container" class="flex flex-wrap gap-4 items-start">
                        <label class="upload-box w-32 h-32 relative overflow-hidden group shrink-0 shadow-sm border border-dashed border-gray-400">
                            <span class="relative z-10 font-bold drop-shadow-md group-hover:text-gray-200 text-center">+ Add<br>Photos</span>
                            <input type="file" id="gallery-photo" class="absolute inset-0 opacity-0 cursor-pointer z-20" accept="image/*" multiple onchange="previewGalleryImages(this)">
                        </label>
                        <div id="gallery-previews-wrapper" class="flex flex-wrap gap-4"></div>
                    </div>
                </div>
                
                <div class="pb-20 text-center mt-12 flex justify-center gap-4">
                    <button type="button" id="cancel-edit-btn" class="hidden bg-gray-500 text-white px-8 py-3 rounded-full font-bold text-xl shadow-lg hover:bg-gray-600 transition" onclick="cancelEditEvent()">ยกเลิกการแก้ไข</button>
                    <button class="bg-green-500 text-white px-12 py-3 rounded-full font-bold text-xl shadow-lg hover:bg-green-600 transition" onclick="saveEvent()">บันทึกข้อมูล (Save Event)</button>
                </div>
            </div>
        </section>
        
        <section id="section-musician" class="content-section hidden">
            <div class="bg-[#ffc107] text-black p-6 sticky top-0 z-10 shadow-sm flex flex-col gap-4">
                <h2 class="text-3xl font-extrabold">Musician Network</h2>
                <div class="flex bg-[#e5e7eb] rounded-full p-1 max-w-md w-full">
                    <button id="tab-btn-artist" onclick="switchMusicianTab('artist')" class="flex-1 bg-[#ffc107] text-black font-bold py-2 rounded-full shadow text-center transition">Artist Library</button>
                    <button id="tab-btn-jazz" onclick="switchMusicianTab('jazz')" class="flex-1 text-gray-500 font-bold py-2 rounded-full text-center hover:bg-gray-300 transition">Jazz Network</button>
                </div>
            </div>

            <div class="p-8 max-w-5xl mx-auto">
                <div class="mb-10 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                    <h3 class="text-xl font-extrabold mb-4 border-b border-gray-200 pb-3 text-gray-900">ตารางรายชื่อศิลปินและเครือข่ายทั้งหมด</h3>
                    <div class="overflow-hidden rounded-xl border border-gray-200">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-gray-100 border-b border-gray-200 text-sm">
                                    <th class="p-4 font-bold text-gray-700">ID / ช่อง</th>
                                    <th class="p-4 font-bold text-gray-700">ชื่อวง / ศิลปิน</th>
                                    <th class="p-4 font-bold text-gray-700">หมวดหมู่ (Genre)</th>
                                    <th class="p-4 font-bold text-gray-700">เครือข่าย</th>
                                </tr>
                            </thead>
                            <tbody id="musician-table-body">
                                <tr><td colspan="4" class="p-4 text-center text-gray-500 font-medium">กำลังโหลดข้อมูล...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <input type="hidden" id="edit-musician-id" value="">

                <div id="musician-artist-content" class="block space-y-4">
                    <h3 class="text-xl font-extrabold mb-4 border-b border-gray-200 pb-2">Artist Library (จัดเรียงไร้ขีดจำกัด)</h3>
                    <div id="artist-grid-container" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6"></div>

                    <div id="artist-form-container" class="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hidden">
                        <div class="flex justify-between items-end mb-4 border-b pb-2">
                            <div>
                                <h4 id="artist-form-title" class="text-xl font-extrabold text-black">เพิ่มข้อมูล Artist</h4>
                                <input type="hidden" id="edit-artist-slot" value="">
                            </div>
                            <div class="flex items-center gap-3 text-sm font-bold bg-gray-50 px-4 py-1.5 rounded-full border border-gray-200">
                                <button type="button" class="admin-lang-btn text-red-500 border-b-2 border-red-500 pb-0.5" data-form="artist" onclick="switchAdminLang(this, 'en', 'artist')">GB English</button>
                                <span class="text-gray-300">|</span>
                                <button type="button" class="admin-lang-btn text-gray-400 hover:text-gray-800 transition pb-0.5" data-form="artist" onclick="switchAdminLang(this, 'th', 'artist')">TH ไทย</button>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4 h-36 md:h-44 mb-6">
                            <div class="relative rounded-xl overflow-hidden border border-gray-300 bg-gray-100 group">
                                <img id="artist-banner-img" src="https://placehold.co/1200x400/e5e7eb/a3a3a3?text=No+Banner" class="w-full h-full object-cover">
                                <label for="artist-banner" class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <span class="bg-white/90 text-gray-800 px-4 py-2 rounded-full font-bold shadow-sm hover:bg-white transition flex items-center gap-2">📷 เปลี่ยน Banner / Crop</span>
                                    <input type="file" id="artist-banner" class="hidden" accept="image/*" onchange="previewImage(this, 'artist-banner-img')">
                                </label>
                            </div>
                            <div class="relative rounded-xl overflow-hidden border border-gray-300 bg-gray-100 group">
                                <img id="artist-profile-img" src="https://placehold.co/600x600/e5e7eb/a3a3a3?text=No+Profile" class="w-full h-full object-contain bg-gray-200">
                                <label for="artist-profile" class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <span class="bg-white/90 text-gray-800 px-4 py-2 rounded-full font-bold shadow-sm hover:bg-white transition flex items-center gap-2">👤 เปลี่ยน Profile / Crop</span>
                                    <input type="file" id="artist-profile" class="hidden" accept="image/*" onchange="previewImage(this, 'artist-profile-img', NaN)">
                                </label>
                            </div>
                        </div>

                        <div class="space-y-3">
                            <input type="text" id="art-title" class="w-full border border-gray-400 rounded-full px-5 py-2.5 outline-none focus:border-yellow-500 placeholder-gray-400 font-semibold text-sm lang-en" placeholder="Band / Institution Title (EN)">
                            <input type="text" id="art-title-th" class="w-full border border-gray-400 rounded-full px-5 py-2.5 outline-none focus:border-yellow-500 placeholder-gray-400 font-semibold text-sm lang-th hidden" placeholder="ชื่อศิลปิน (TH)">
                            
                            <input type="text" id="art-genre" class="w-full border border-gray-400 rounded-full px-5 py-2.5 outline-none focus:border-yellow-500 placeholder-gray-400 font-semibold text-sm lang-en" placeholder="Category/Genre (EN)">
                            <input type="text" id="art-genre-th" class="w-full border border-gray-400 rounded-full px-5 py-2.5 outline-none focus:border-yellow-500 placeholder-gray-400 font-semibold text-sm lang-th hidden" placeholder="หมวดหมู่/แนวเพลง (TH)">
                            
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 pt-2">
                                <div class="flex items-center gap-3"><svg class="w-7 h-7 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg><input type="text" id="art-fb" class="w-full border border-gray-400 rounded-full px-4 py-1.5 outline-none focus:border-yellow-500"></div>
                                <div class="flex items-center gap-3"><svg class="w-7 h-7 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.653.863 5.14 2.378 7.182L.632 24l4.908-1.745c1.977 1.306 4.28 2.012 6.666 2.012 6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm4.587 17.207c-.207.585-1.189 1.12-1.637 1.157-.449.037-1.042.13-2.955-.662-2.315-.96-3.804-3.328-3.92-3.483-.116-.156-.937-1.246-.937-2.376 0-1.13.585-1.688.788-1.916.203-.228.444-.284.593-.284.148 0 .297 0 .428.006.136.006.315-.052.493.376.18.435.617 1.503.673 1.618.056.115.093.251.018.402-.074.151-.112.245-.223.375-.112.131-.238.283-.339.395-.112.113-.23.235-.1.459.13.224.58 1.054 1.332 1.734.97.882 1.782 1.154 2.007 1.267.225.113.355.094.486-.054.131-.149.563-.655.713-.881.149-.226.297-.188.503-.112.206.075 1.302.614 1.527.727.225.113.375.169.431.264.056.094.056.547-.151 1.132z"/></svg><input type="text" id="art-wa" class="w-full border border-gray-400 rounded-full px-4 py-1.5 outline-none focus:border-yellow-500"></div>
                                <div class="flex items-center gap-3"><div class="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FFDC80] via-[#F77737] to-[#C13584] flex items-center justify-center text-white"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></div><input type="text" id="art-ig" class="w-full border border-gray-400 rounded-full px-4 py-1.5 outline-none focus:border-yellow-500"></div>
                                <div class="flex items-center gap-3"><svg class="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"/></svg><input type="text" id="art-web" class="w-full border border-gray-400 rounded-full px-4 py-1.5 outline-none focus:border-yellow-500"></div>
                                <div class="flex items-center gap-3"><svg class="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z"/></svg><input type="text" id="art-tk" class="w-full border border-gray-400 rounded-full px-4 py-1.5 outline-none focus:border-yellow-500"></div>
                                <div class="flex items-center gap-3"><svg class="w-7 h-7 text-[#EA4335]" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg><input type="text" id="art-email" class="w-full border border-gray-400 rounded-full px-4 py-1.5 outline-none focus:border-yellow-500"></div>
                            </div>
                            <textarea id="art-details" class="w-full border border-gray-400 rounded-xl px-5 py-4 outline-none focus:border-yellow-500 h-32 placeholder-gray-400 font-semibold text-sm mt-3 lang-en" placeholder="Details (EN) ...."></textarea>
                            <textarea id="art-details-th" class="w-full border border-gray-400 rounded-xl px-5 py-4 outline-none focus:border-yellow-500 h-32 placeholder-gray-400 font-semibold text-sm mt-3 lang-th hidden" placeholder="รายละเอียดศิลปิน (TH) ...."></textarea>
                        </div>

                        <div class="mt-6">
                            <div class="flex items-center gap-4 mb-4">
                                <h3 class="text-2xl font-extrabold text-black">Video</h3>
                                <hr class="flex-grow border-gray-300">
                            </div>
                            <div id="art-video-container" class="space-y-3">
                                <div class="flex gap-3 items-center">
                                    <input type="text" class="w-full border border-gray-400 rounded-full px-5 py-2 outline-none focus:border-yellow-500 placeholder-gray-400 font-semibold text-sm art-video" placeholder="Link to your Video / Youtube / Vimeo">
                                    <button type="button" onclick="addVideoRow('art-video-container', 'art-video')" class="bg-[#ffc107] text-black px-6 py-2 rounded-full font-extrabold hover:bg-yellow-500 transition shadow-sm">Add</button>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                            <button type="button" onclick="deleteTargetMusician(document.getElementById('edit-musician-id').value)" class="text-red-500 font-bold hover:underline">🗑️ ลบข้อมูล</button>
                            <div class="flex gap-3">
                                <button type="button" class="bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-bold shadow-sm hover:bg-gray-300 transition" onclick="closeArtistForm()">ยกเลิก</button>
                                <button type="button" class="bg-green-500 text-white px-8 py-2 rounded-full font-bold shadow-md hover:bg-green-600 transition" onclick="saveMusician('artist_library')">บันทึกข้อมูล (Save)</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="musician-jazz-content" class="hidden space-y-4">
                    <h3 class="text-xl font-extrabold mb-4 border-b border-gray-200 pb-2">Jazz Network (จัดเรียงไร้ขีดจำกัด)</h3>
                    <div id="jazz-grid-container" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6"></div>

                    <div id="jazz-form-container" class="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hidden">
                        <div class="flex justify-between items-end mb-4 border-b pb-2">
                            <div>
                                <h4 id="jazz-form-title" class="text-xl font-extrabold text-black">เพิ่มข้อมูล Jazz Network</h4>
                                <input type="hidden" id="edit-jazz-slot" value="">
                            </div>
                            <div class="flex items-center gap-3 text-sm font-bold bg-gray-50 px-4 py-1.5 rounded-full border border-gray-200">
                                <button type="button" class="admin-lang-btn text-red-500 border-b-2 border-red-500 pb-0.5" data-form="jazz" onclick="switchAdminLang(this, 'en', 'jazz')">GB English</button>
                                <span class="text-gray-300">|</span>
                                <button type="button" class="admin-lang-btn text-gray-400 hover:text-gray-800 transition pb-0.5" data-form="jazz" onclick="switchAdminLang(this, 'th', 'jazz')">TH ไทย</button>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4 h-36 md:h-44 mb-6">
                            <div class="relative rounded-xl overflow-hidden border border-gray-300 bg-gray-100 group">
                                <img id="jazz-banner-img" src="https://placehold.co/1200x400/e5e7eb/a3a3a3?text=No+Banner" class="w-full h-full object-cover">
                                <label for="jazz-banner" class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <span class="bg-white/90 text-gray-800 px-4 py-2 rounded-full font-bold shadow-sm hover:bg-white transition flex items-center gap-2">📷 เปลี่ยน Banner / Crop</span>
                                    <input type="file" id="jazz-banner" class="hidden" accept="image/*" onchange="previewImage(this, 'jazz-banner-img')">
                                </label>
                            </div>
                            <div class="relative rounded-xl overflow-hidden border border-gray-300 bg-gray-100 group">
                                <img id="jazz-profile-img" src="https://placehold.co/600x600/e5e7eb/a3a3a3?text=No+Profile" class="w-full h-full object-contain bg-gray-200">
                                <label for="jazz-profile" class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <span class="bg-white/90 text-gray-800 px-4 py-2 rounded-full font-bold shadow-sm hover:bg-white transition flex items-center gap-2">👤 เปลี่ยน Profile / Crop</span>
                                    <input type="file" id="jazz-profile" class="hidden" accept="image/*" onchange="previewImage(this, 'jazz-profile-img', NaN)">
                                </label>
                            </div>
                        </div>

                        <div class="space-y-3">
                            <input type="text" id="jazz-title" class="w-full border border-gray-400 rounded-full px-5 py-2.5 outline-none focus:border-yellow-500 placeholder-gray-400 font-semibold text-sm lang-en" placeholder="Band / Institution Title (EN)">
                            <input type="text" id="jazz-title-th" class="w-full border border-gray-400 rounded-full px-5 py-2.5 outline-none focus:border-yellow-500 placeholder-gray-400 font-semibold text-sm lang-th hidden" placeholder="ชื่อวง/สถานที่ (TH)">
                            
                            <input type="text" id="jazz-genre" class="w-full border border-gray-400 rounded-full px-5 py-2.5 outline-none focus:border-yellow-500 placeholder-gray-400 font-semibold text-sm lang-en" placeholder="Category (EN)">
                            <input type="text" id="jazz-genre-th" class="w-full border border-gray-400 rounded-full px-5 py-2.5 outline-none focus:border-yellow-500 placeholder-gray-400 font-semibold text-sm lang-th hidden" placeholder="หมวดหมู่ (TH)">
                            
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 pt-2">
                                <div class="flex items-center gap-3"><svg class="w-7 h-7 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg><input type="text" id="jazz-fb" class="w-full border border-gray-400 rounded-full px-4 py-1.5 outline-none focus:border-yellow-500"></div>
                                <div class="flex items-center gap-3"><svg class="w-7 h-7 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.653.863 5.14 2.378 7.182L.632 24l4.908-1.745c1.977 1.306 4.28 2.012 6.666 2.012 6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm4.587 17.207c-.207.585-1.189 1.12-1.637 1.157-.449.037-1.042.13-2.955-.662-2.315-.96-3.804-3.328-3.92-3.483-.116-.156-.937-1.246-.937-2.376 0-1.13.585-1.688.788-1.916.203-.228.444-.284.593-.284.148 0 .297 0 .428.006.136.006.315-.052.493.376.18.435.617 1.503.673 1.618.056.115.093.251.018.402-.074.151-.112.245-.223.375-.112.131-.238.283-.339.395-.112.113-.23.235-.1.459.13.224.58 1.054 1.332 1.734.97.882 1.782 1.154 2.007 1.267.225.113.355.094.486-.054.131-.149.563-.655.713-.881.149-.226.297-.188.503-.112.206.075 1.302.614 1.527.727.225.113.375.169.431.264.056.094.056.547-.151 1.132z"/></svg><input type="text" id="jazz-wa" class="w-full border border-gray-400 rounded-full px-4 py-1.5 outline-none focus:border-yellow-500"></div>
                                <div class="flex items-center gap-3"><div class="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FFDC80] via-[#F77737] to-[#C13584] flex items-center justify-center text-white"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></div><input type="text" id="jazz-ig" class="w-full border border-gray-400 rounded-full px-4 py-1.5 outline-none focus:border-yellow-500"></div>
                                <div class="flex items-center gap-3"><svg class="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"/></svg><input type="text" id="jazz-web" class="w-full border border-gray-400 rounded-full px-4 py-1.5 outline-none focus:border-yellow-500"></div>
                                <div class="flex items-center gap-3"><svg class="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z"/></svg><input type="text" id="jazz-tk" class="w-full border border-gray-400 rounded-full px-4 py-1.5 outline-none focus:border-yellow-500"></div>
                                <div class="flex items-center gap-3"><svg class="w-7 h-7 text-[#EA4335]" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg><input type="text" id="jazz-email" class="w-full border border-gray-400 rounded-full px-4 py-1.5 outline-none focus:border-yellow-500"></div>
                            </div>
                            
                            <textarea id="jazz-details" class="w-full border border-gray-400 rounded-xl px-5 py-4 outline-none focus:border-yellow-500 h-32 placeholder-gray-400 font-semibold text-sm mt-3 lang-en" placeholder="Details (EN) ...."></textarea>
                            <textarea id="jazz-details-th" class="w-full border border-gray-400 rounded-xl px-5 py-4 outline-none focus:border-yellow-500 h-32 placeholder-gray-400 font-semibold text-sm mt-3 lang-th hidden" placeholder="รายละเอียด (TH) ...."></textarea>
                        </div>

                        <div class="mt-6">
                            <div class="flex items-center gap-4 mb-4">
                                <h3 class="text-2xl font-extrabold text-black">Video</h3>
                                <hr class="flex-grow border-gray-300">
                            </div>
                            <div id="jazz-video-container" class="space-y-3">
                                <div class="flex gap-3 items-center">
                                    <input type="text" class="w-full border border-gray-400 rounded-full px-5 py-2 outline-none focus:border-yellow-500 placeholder-gray-400 font-semibold text-sm jazz-video" placeholder="Link to your Video / Youtube / Vimeo">
                                    <button type="button" onclick="addVideoRow('jazz-video-container', 'jazz-video')" class="bg-[#ffc107] text-black px-6 py-2 rounded-full font-extrabold hover:bg-yellow-500 transition shadow-sm">Add</button>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                            <button type="button" onclick="deleteTargetMusician(document.getElementById('edit-musician-id').value)" class="text-red-500 font-bold hover:underline">🗑️ ลบข้อมูล</button>
                            <div class="flex gap-3">
                                <button type="button" class="bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-bold shadow-sm hover:bg-gray-300 transition" onclick="closeJazzForm()">ยกเลิก</button>
                                <button type="button" class="bg-green-500 text-white px-8 py-2 rounded-full font-bold shadow-md hover:bg-green-600 transition" onclick="saveMusician('jazz_network')">บันทึกข้อมูล (Save)</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="section-courses" class="content-section hidden">
            <div class="bg-[#10a349] text-white p-6 sticky top-0 z-10 shadow-sm flex flex-col gap-4">
                <h2 class="text-3xl font-extrabold">Courses Library</h2>
            </div>
            
            <div class="p-8 max-w-5xl mx-auto">
                <div class="mb-10 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                    <h3 class="text-xl font-extrabold mb-4 border-b border-gray-200 pb-3 text-gray-900">ตารางรายชื่อคอร์สเรียนทั้งหมด</h3>
                    <div class="overflow-hidden rounded-xl border border-gray-200">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-gray-100 border-b border-gray-200 text-sm">
                                    <th class="p-4 font-bold text-gray-700">ID / ช่อง</th>
                                    <th class="p-4 font-bold text-gray-700">ชื่อคอร์สเรียน</th>
                                    <th class="p-4 font-bold text-gray-700">ผู้สอน (Creator)</th>
                                </tr>
                            </thead>
                            <tbody id="course-table-body">
                                <tr><td colspan="3" class="p-4 text-center text-gray-500 font-medium">กำลังโหลดข้อมูล...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="space-y-4">
                    <h3 class="text-xl font-extrabold mb-4 border-b border-gray-200 pb-2">Courses Library (จัดเรียงกล่องไดนามิก)</h3>
                    
                    <div id="course-grid-container" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6"></div>

                    <div id="course-form-container" class="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hidden">
                        <div class="flex justify-between items-end mb-4 border-b pb-2">
                            <div>
                                <h4 id="course-form-title" class="text-xl font-extrabold text-[#10a349]">เพิ่มข้อมูล Course</h4>
                                <input type="hidden" id="edit-course-slot" value="">
                                <input type="hidden" id="edit-course-id" value="">
                            </div>
                            <div class="flex items-center gap-3 text-sm font-bold bg-gray-50 px-4 py-1.5 rounded-full border border-gray-200">
                                <button type="button" class="admin-lang-btn text-red-500 border-b-2 border-red-500 pb-0.5" data-form="course" onclick="switchAdminLang(this, 'en', 'course')">GB English</button>
                                <span class="text-gray-300">|</span>
                                <button type="button" class="admin-lang-btn text-gray-400 hover:text-gray-800 transition pb-0.5" data-form="course" onclick="switchAdminLang(this, 'th', 'course')">TH ไทย</button>
                            </div>
                        </div>
                        
                        <div class="w-full h-40 md:h-56 mb-5">
                            <div class="relative rounded-xl overflow-hidden border border-gray-300 bg-[#b2b2b2] group h-full flex items-center justify-center">
                                <img id="course-banner-img" src="https://placehold.co/1200x400/b2b2b2/000?text=No+Banner" class="w-full h-full object-cover">
                                <label for="course-banner" class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <span class="bg-white/90 text-gray-800 px-4 py-2 rounded-full font-bold shadow-sm hover:bg-white transition flex items-center gap-2">📷 เปลี่ยน Banner / Crop</span>
                                    <input type="file" id="course-banner" class="hidden" accept="image/*" onchange="previewImage(this, 'course-banner-img')">
                                </label>
                            </div>
                        </div>
                        
                        <div class="space-y-3 mb-5">
                            <input type="text" id="course-title" class="w-full border border-gray-400 rounded-full px-5 py-2.5 outline-none focus:border-[#10a349] placeholder-gray-400 font-semibold text-sm lang-en" placeholder="Course Title (EN)">
                            <input type="text" id="course-title-th" class="w-full border border-gray-400 rounded-full px-5 py-2.5 outline-none focus:border-[#10a349] placeholder-gray-400 font-semibold text-sm lang-th hidden" placeholder="ชื่อคอร์สเรียน (TH)">
                            
                            <input type="text" id="course-creator" class="w-full border border-gray-400 rounded-full px-5 py-2.5 outline-none focus:border-[#10a349] placeholder-gray-400 font-semibold text-sm lang-en" placeholder="Creator (EN)">
                            <input type="text" id="course-creator-th" class="w-full border border-gray-400 rounded-full px-5 py-2.5 outline-none focus:border-[#10a349] placeholder-gray-400 font-semibold text-sm lang-th hidden" placeholder="ผู้จัดทำ/ผู้สอน (TH)">
                        </div>

                        <div class="flex gap-3 mb-4">
                            <button type="button" onclick="addCourseContent('text')" class="border border-black text-black rounded-full px-5 py-1.5 text-xs font-bold hover:bg-black hover:text-white transition">Add Text</button>
                            <button type="button" onclick="addCourseContent('image')" class="border border-black text-black rounded-full px-5 py-1.5 text-xs font-bold hover:bg-black hover:text-white transition">Add Image</button>
                            <button type="button" onclick="addCourseContent('video')" class="border border-black text-black rounded-full px-5 py-1.5 text-xs font-bold hover:bg-black hover:text-white transition">Add Video</button>
                        </div>
                        
                        <div id="course-content-container" class="space-y-4"></div>

                        <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                            <button type="button" onclick="deleteTargetCourse(document.getElementById('edit-course-id').value)" class="text-red-500 font-bold hover:underline">🗑️ ลบข้อมูล</button>
                            <div class="flex gap-3">
                                <button type="button" class="bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-bold shadow-sm hover:bg-gray-300 transition" onclick="closeCourseForm()">ยกเลิก</button>
                                <button type="button" class="bg-[#10a349] text-white px-8 py-2 rounded-full font-bold shadow-md hover:bg-green-700 transition" onclick="saveCourse()">บันทึกคอร์ส (Save)</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

       <section id="section-cmbigband" class="content-section hidden">
            <div class="bg-gray-400 text-black p-6 sticky top-0 z-10 shadow-md flex justify-between items-center">
                <h2 class="text-3xl font-bold">CMSJ Bigband</h2>
            </div>
            
            <div class="p-8 max-w-5xl mx-auto space-y-6">
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    
                    <div class="grid grid-cols-2 gap-4 h-44 mb-4">
                        <div class="relative rounded-xl overflow-hidden border border-gray-300 bg-gray-100 group">
                            <img id="cmbigband-banner-img" src="https://placehold.co/1200x400/e5e7eb/a3a3a3?text=No+Banner" class="w-full h-full object-cover">
                            <label for="cmb-banner" class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <span class="bg-white/90 text-gray-800 px-4 py-2 rounded-full font-bold shadow-sm hover:bg-white transition flex items-center gap-2">📷 เปลี่ยน Banner</span>
                                <input type="file" id="cmb-banner" class="hidden" accept="image/*" onchange="previewImage(this, 'cmbigband-banner-img')">
                            </label>
                        </div>
                        <div class="relative rounded-xl overflow-hidden border border-gray-300 bg-gray-100 group">
                            <img id="cmbigband-profile-img" src="https://placehold.co/600x600/e5e7eb/a3a3a3?text=No+Profile" class="w-full h-full object-contain bg-gray-200">
                            <label for="cmb-profile" class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <span class="bg-white/90 text-gray-800 px-4 py-2 rounded-full font-bold shadow-sm hover:bg-white transition flex items-center gap-2">👤 เปลี่ยน Profile</span>
                                <input type="file" id="cmb-profile" class="hidden" accept="image/*" onchange="previewImage(this, 'cmbigband-profile-img', NaN)">
                            </label>
                        </div>
                    </div>
                    
                    <div class="flex justify-end mb-4">
                        <div class="flex items-center gap-3 text-sm font-bold bg-gray-50 px-5 py-2 rounded-full border border-gray-200 shadow-sm w-fit">
                            <button type="button" class="admin-lang-btn text-red-500 border-b-2 border-red-500 pb-0.5" data-form="cmb" onclick="switchAdminLang(this, 'en', 'cmb')">GB English</button>
                            <span class="text-gray-300">|</span>
                            <button type="button" class="admin-lang-btn text-gray-400 hover:text-gray-800 transition pb-0.5" data-form="cmb" onclick="switchAdminLang(this, 'th', 'cmb')">TH ไทย</button>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <input type="text" id="cmb-title" class="input-style font-bold text-lg lang-en w-full" placeholder="Band Title (EN)">
                        <input type="text" id="cmb-title-th" class="input-style font-bold text-lg lang-th hidden w-full" placeholder="ชื่อวง (TH)">
                        
                        <input type="text" id="cmb-genre" class="input-style lang-en" placeholder="Genre (EN)">
                        <input type="text" id="cmb-genre-th" class="input-style lang-th hidden" placeholder="แนวเพลง (TH)">
                        
                        <div class="grid grid-cols-2 gap-4 pt-2">
                            <div class="flex items-center gap-2"><div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">f</div><input type="text" id="cmb-fb" class="input-style" placeholder="Facebook URL"></div>
                            <div class="flex items-center gap-2"><div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">WA</div><input type="text" id="cmb-wa" class="input-style" placeholder="WhatsApp"></div>
                            <div class="flex items-center gap-2"><div class="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">IG</div><input type="text" id="cmb-ig" class="input-style" placeholder="Instagram URL"></div>
                            <div class="flex items-center gap-2"><div class="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold">W</div><input type="text" id="cmb-web" class="input-style" placeholder="Website URL"></div>
                            <div class="flex items-center gap-2"><div class="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">TK</div><input type="text" id="cmb-tk" class="input-style" placeholder="TikTok URL"></div>
                            <div class="flex items-center gap-2"><div class="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">@</div><input type="text" id="cmb-email" class="input-style" placeholder="Email"></div>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <div class="flex flex-col sm:flex-row items-center justify-between mb-4 border-b pb-4 gap-4">
                        <h3 class="text-xl font-bold">รายละเอียด (Page Builder)</h3>
                        <div class="flex gap-3">
                            <button type="button" onclick="addCmbContent('text')" class="border border-black text-black rounded-full px-5 py-1.5 text-xs font-bold hover:bg-black hover:text-white transition shadow-sm">Add Text</button>
                            <button type="button" onclick="addCmbContent('image')" class="border border-black text-black rounded-full px-5 py-1.5 text-xs font-bold hover:bg-black hover:text-white transition shadow-sm">Add Image</button>
                            <button type="button" onclick="addCmbContent('video')" class="border border-black text-black rounded-full px-5 py-1.5 text-xs font-bold hover:bg-black hover:text-white transition shadow-sm">Add Video</button>
                        </div>
                    </div>
                    
                    <div id="cmb-content-container" class="flex flex-wrap -mx-2 items-stretch"></div>
                </div>

                <div class="pb-10 text-center mt-8">
                    <button type="button" class="bg-green-500 text-white px-12 py-4 rounded-full font-bold text-xl shadow-xl hover:bg-green-600 transition transform hover:-translate-y-1" onclick="saveCMBigband()">บันทึกข้อมูล CMBigband (Save)</button>
                </div>
            </div>
        </section>

    <section id="section-forum" class="content-section hidden p-8 max-w-6xl mx-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-3xl font-bold text-gray-800">จัดการ Forum Q&A</h2>
                <button id="btn-delete-forum" disabled class="bg-red-500 text-white px-6 py-2 rounded-lg font-bold shadow-sm opacity-50 cursor-not-allowed hover:bg-red-600 transition flex items-center gap-2">
                    🗑️ ลบที่เลือก
                </button>
            </div>
            
            <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <table class="w-full text-left border-collapse cursor-pointer">
                    <thead>
                        <tr class="bg-orange-100 border-b border-orange-200 text-sm">
                            <th class="p-4 font-bold text-gray-800 w-24 text-center">เลือก</th>
                            <th class="p-4 font-bold text-gray-800">หัวข้อคำถาม (Topic Title)</th>
                            <th class="p-4 font-bold text-gray-800">ผู้ตั้งคำถาม</th>
                            <th class="p-4 font-bold text-gray-800">วันที่ตั้งกระทู้</th>
                            <th class="p-4 font-bold text-gray-800 text-center">สถิติ</th>
                        </tr>
                    </thead>
                    <tbody id="admin-forum-table-body">
                        <tr><td colspan="5" class="p-8 text-center text-gray-500 font-medium">กำลังโหลดข้อมูล...</td></tr>
                    </tbody>
                </table>
            </div>
            <p id="forum-selection-status" class="text-sm font-medium text-gray-500 mt-4 text-right">ยังไม่ได้เลือกกระทู้</p>
        </section>

        <section id="section-store" class="content-section hidden p-8 max-w-6xl mx-auto">
            <h2 class="text-3xl font-bold mb-6 text-gray-800">Store & Merch</h2>
            <div class="bg-white border rounded-xl shadow-sm p-16 text-center text-gray-500"><p class="text-xl font-semibold mb-2">ระบบจัดการ Store & Merch</p><p>อยู่ระหว่างการพัฒนา...</p></div>
        </section>
    </main>

    <div id="confirm-modal" class="fixed inset-0 bg-black/50 items-center justify-center z-50 hidden backdrop-blur-sm flex">
        <div class="bg-white p-8 rounded-3xl shadow-2xl w-96 text-center transform transition-all">
            <h3 class="text-2xl font-bold mb-2 text-gray-800">ยืนยันการลบ</h3>
            <div class="flex justify-center gap-3 mt-6">
                <button onclick="closeConfirmModal()" class="px-6 py-2.5 bg-gray-200 font-bold rounded-full w-full">ยกเลิก</button>
                <button id="confirm-delete-btn" class="px-6 py-2.5 bg-red-600 text-white font-bold rounded-full w-full">ลบข้อมูล</button>
            </div>
        </div>
    </div>

    <div id="password-modal" class="fixed inset-0 bg-black/50 items-center justify-center z-50 hidden backdrop-blur-sm flex">
        <div class="bg-white p-8 rounded-3xl shadow-2xl w-96 transform transition-all">
            <h3 class="text-2xl font-bold mb-1 text-gray-800">เปลี่ยนรหัสผ่าน</h3>
            <input type="password" id="new-password-input" class="w-full border rounded-xl px-4 py-3 mb-6" placeholder="รหัสผ่านใหม่">
            <div class="flex justify-end gap-3">
                <button onclick="closePasswordModal()" class="px-5 py-2.5 bg-gray-200 font-bold rounded-full">ยกเลิก</button>
                <button id="save-password-btn" class="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-full">บันทึกรหัสผ่าน</button>
            </div>
        </div>
    </div>

    <div id="cropper-modal" class="fixed inset-0 bg-black/90 items-center justify-center z-[200] hidden backdrop-blur-sm flex">
        <div class="bg-white p-6 rounded-3xl shadow-2xl w-[90%] max-w-4xl flex flex-col h-[85vh]">
            <h3 class="text-2xl font-bold mb-4 text-gray-800">ครอบตัดรูปภาพ (Crop Image)</h3>
            <div class="flex-1 bg-gray-200 overflow-hidden relative rounded-xl flex items-center justify-center">
                <img id="cropper-image" src="" class="max-w-full max-h-full block">
            </div>
            <div class="flex justify-end gap-3 mt-6">
                <button onclick="closeCropperModal()" class="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-full hover:bg-gray-300 transition">ยกเลิก</button>
                <button onclick="applyCrop()" class="px-8 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition">✂️ ยืนยันการตัดรูป</button>
            </div>
        </div>
    </div>

    <div id="toast-container"></div>
    
   <script src="admin_master.js?v=2"></script>
    
<script>
window.changeLayout = (selectEl) => {
        const item = selectEl.closest('.course-item, .cmb-item');
        item.classList.remove('w-full', 'w-1/2', 'w-1/3', 'w-1/4'); 
        const val = selectEl.value;
        if(val === 'col-1') item.classList.add('w-full');
        if(val === 'col-2') item.classList.add('w-1/2');
        if(val === 'col-3') item.classList.add('w-1/3');
        if(val === 'col-4') item.classList.add('w-1/4');
    };

    window.addCourseContent = (type, valEn = '', valTh = '', layout = 'col-1') => {
        const container = document.getElementById('course-content-container');
        if(container.classList.contains('space-y-4')) {
            container.classList.remove('space-y-4'); container.className = 'flex flex-wrap -mx-2 items-stretch';
        } else if(!container.classList.contains('flex')) { container.className = 'flex flex-wrap -mx-2 items-stretch'; }

        const itemDiv = document.createElement('div');
        let widthClass = 'w-full';
        if(layout === 'col-2') widthClass = 'w-1/2'; else if(layout === 'col-3') widthClass = 'w-1/3'; else if(layout === 'col-4') widthClass = 'w-1/4';
        itemDiv.className = `course-item px-2 mb-4 transition-all duration-300 ${widthClass}`;
        itemDiv.setAttribute('data-type', type);
        
        const controls = `
            <div class="absolute -top-3 -right-1 flex flex-col gap-1 z-50 items-center">
                <button type="button" onclick="this.closest('.course-item').remove()" class="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow hover:bg-red-600 transition text-sm">✕</button>
                <div class="relative"><select class="course-layout-select w-8 h-8 rounded-full bg-blue-600 text-white text-center font-bold shadow hover:bg-blue-700 cursor-pointer appearance-none outline-none text-sm text-center" style="text-align-last:center;" onchange="changeLayout(this)"><option value="col-1" ${layout === 'col-1'?'selected':''}>1</option><option value="col-2" ${layout === 'col-2'?'selected':''}>2</option><option value="col-3" ${layout === 'col-3'?'selected':''}>3</option><option value="col-4" ${layout === 'col-4'?'selected':''}>4</option></select></div>
            </div>`;

        let innerContent = '';
        if (type === 'text') {
            innerContent = `<textarea class="w-full border-none px-4 py-3 outline-none focus:ring-0 rounded-xl min-h-[150px] course-text-input text-sm font-semibold placeholder-gray-400 h-full bg-gray-50 lang-en" placeholder="Details (EN)...">${valEn}</textarea><textarea class="w-full border-none px-4 py-3 outline-none focus:ring-0 rounded-xl min-h-[150px] course-text-input-th text-sm font-semibold placeholder-gray-400 h-full bg-gray-50 lang-th hidden" placeholder="รายละเอียด (TH)...">${valTh}</textarea>`;
        } else if (type === 'image') {
            courseImgCounter++; 
            const previewId = `course-img-preview-${courseImgCounter}`; const inputId = `course-img-input-${courseImgCounter}`; const imgDisplay = valEn ? valEn : 'https://placehold.co/800x400/e5e7eb/a3a3a3?text=Click+to+Add+Image';
            innerContent = `<div class="relative rounded-xl overflow-hidden bg-gray-200 h-full min-h-[150px] group flex items-center justify-center"><img id="${previewId}" src="${imgDisplay}" class="w-full h-full object-cover relative z-0"><label class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10 m-0"><span class="bg-white/90 text-gray-800 px-4 py-2 rounded-full font-bold shadow-md hover:bg-white transition text-sm">📷 อัปโหลดรูป</span><input type="file" id="${inputId}" class="hidden course-img-input" accept="image/*" onchange="previewImage(this, '${previewId}', NaN)"><input type="hidden" class="course-img-old" value="${valEn}"></label></div>`;
        } else if (type === 'video') { innerContent = `<input type="text" class="w-full border-none px-4 py-3 outline-none focus:ring-0 rounded-xl course-video-input text-sm font-semibold placeholder-gray-400 bg-gray-50" placeholder="วางลิงก์ Youtube / Vimeo" value="${valEn}">`; }

        itemDiv.innerHTML = `<div class="border-2 border-gray-200 p-2 rounded-2xl bg-white shadow-sm relative h-full flex flex-col hover:border-blue-400 transition-colors">${controls}${innerContent}</div>`;
        container.appendChild(itemDiv);
        
        if (window.currentAdminLang === 'th') { itemDiv.querySelectorAll('.lang-en').forEach(el => el.classList.add('hidden')); itemDiv.querySelectorAll('.lang-th').forEach(el => el.classList.remove('hidden')); }
    };

    window.addCmbContent = (type, valEn = '', valTh = '', layout = 'col-1') => {
        const container = document.getElementById('cmb-content-container');
        const itemDiv = document.createElement('div');
        let widthClass = 'w-full';
        if(layout === 'col-2') widthClass = 'w-1/2'; else if(layout === 'col-3') widthClass = 'w-1/3'; else if(layout === 'col-4') widthClass = 'w-1/4';
        itemDiv.className = `cmb-item px-2 mb-4 transition-all duration-300 ${widthClass}`;
        itemDiv.setAttribute('data-type', type);
        
        const controls = `<div class="absolute -top-3 -right-1 flex flex-col gap-1 z-50 items-center"><button type="button" onclick="this.closest('.cmb-item').remove()" class="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow hover:bg-red-600 transition text-sm">✕</button><div class="relative"><select class="cmb-layout-select w-8 h-8 rounded-full bg-blue-600 text-white text-center font-bold shadow hover:bg-blue-700 cursor-pointer appearance-none outline-none text-sm text-center" style="text-align-last:center;" onchange="changeLayout(this)"><option value="col-1" ${layout === 'col-1'?'selected':''}>1</option><option value="col-2" ${layout === 'col-2'?'selected':''}>2</option><option value="col-3" ${layout === 'col-3'?'selected':''}>3</option><option value="col-4" ${layout === 'col-4'?'selected':''}>4</option></select></div></div>`;

        let innerContent = '';
        if (type === 'text') {
            innerContent = `<textarea class="w-full border-none px-4 py-3 outline-none focus:ring-0 rounded-xl min-h-[150px] cmb-text-input text-sm font-semibold placeholder-gray-400 h-full bg-gray-50 lang-en" placeholder="Details (EN)...">${valEn}</textarea><textarea class="w-full border-none px-4 py-3 outline-none focus:ring-0 rounded-xl min-h-[150px] cmb-text-input-th text-sm font-semibold placeholder-gray-400 h-full bg-gray-50 lang-th hidden" placeholder="รายละเอียด (TH)...">${valTh}</textarea>`;
        } else if (type === 'image') {
            window.cmbImgCounter++; 
            const previewId = `cmb-img-preview-${window.cmbImgCounter}`; const inputId = `cmb-img-input-${window.cmbImgCounter}`; const imgDisplay = valEn ? valEn : 'https://placehold.co/800x400/e5e7eb/a3a3a3?text=Click+to+Add+Image';
            innerContent = `<div class="relative rounded-xl overflow-hidden bg-gray-200 h-full min-h-[150px] group flex items-center justify-center"><img id="${previewId}" src="${imgDisplay}" class="w-full h-full object-cover relative z-0"><label class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10 m-0"><span class="bg-white/90 text-gray-800 px-4 py-2 rounded-full font-bold shadow-md hover:bg-white transition text-sm">📷 อัปโหลดรูป</span><input type="file" id="${inputId}" class="hidden cmb-img-input" accept="image/*" onchange="previewImage(this, '${previewId}', NaN)"><input type="hidden" class="cmb-img-old" value="${valEn}"></label></div>`;
        } else if (type === 'video') { innerContent = `<input type="text" class="w-full border-none px-4 py-3 outline-none focus:ring-0 rounded-xl cmb-video-input text-sm font-semibold placeholder-gray-400 bg-gray-50" placeholder="วางลิงก์ Youtube / Vimeo" value="${valEn}">`; }

        itemDiv.innerHTML = `<div class="border-2 border-gray-200 p-2 rounded-2xl bg-white shadow-sm relative h-full flex flex-col hover:border-blue-400 transition-colors">${controls}${innerContent}</div>`;
        container.appendChild(itemDiv);

        if (window.currentAdminLang === 'th') { itemDiv.querySelectorAll('.lang-en').forEach(el => el.classList.add('hidden')); itemDiv.querySelectorAll('.lang-th').forEach(el => el.classList.remove('hidden')); }
    };

</script>

</body>
</html>