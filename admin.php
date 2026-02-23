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
</head>
<body class="h-screen flex overflow-hidden">

    <!-- Login & Register Screen -->
    <div id="login-screen" class="fixed inset-0 flex items-center justify-center z-50 bg-cover bg-center bg-no-repeat" style="background-image: url('https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2000&auto=format&fit=crop');">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        
        <!-- Login Form -->
        <div id="login-container" class="relative bg-gray-900/80 border border-yellow-600/30 p-10 rounded-3xl shadow-[0_0_50px_rgba(202,138,4,0.15)] w-full max-w-md transition-all duration-500 backdrop-blur-md">
            <div class="text-center mb-8">
                <h2 class="text-4xl font-bold text-yellow-500 tracking-wider mb-1">JAZZ <span class="text-white font-light">ADMIN</span></h2>
                <p class="text-gray-400 text-sm tracking-widest uppercase">Music & Event Management</p>
            </div>
            <form id="login-form" class="space-y-5">
                <div>
                    <label class="block text-gray-400 mb-2 text-sm tracking-wide">ชื่อผู้ใช้ / Username</label>
                    <input type="text" id="username" class="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl px-4 py-3 outline-none focus:border-yellow-500 transition-all placeholder-gray-600" placeholder="admin" required value="admin">
                </div>
                <div>
                    <label class="block text-gray-400 mb-2 text-sm tracking-wide">รหัสผ่าน / Password</label>
                    <input type="password" id="password" class="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl px-4 py-3 outline-none focus:border-yellow-500 transition-all placeholder-gray-600" placeholder="••••••••" required value="1234">
                </div>
                <button type="submit" class="w-full mt-2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-gray-900 font-bold py-3 rounded-xl hover:from-yellow-500 hover:to-yellow-400 transition-all transform hover:-translate-y-1 shadow-lg text-lg">เข้าสู่ระบบ</button>
            </form>
            <div class="mt-8 text-center border-t border-gray-700/50 pt-6">
                <span class="text-sm text-gray-400">ยังไม่มีบัญชีใช่ไหม?</span>
                <button id="show-register" type="button" class="text-sm text-yellow-500 font-bold hover:underline ml-1 transition-colors">สมัครสมาชิก</button>
            </div>
        </div>

        <!-- Register Form -->
        <div id="register-container" class="relative bg-gray-900/80 border border-yellow-600/30 p-10 rounded-3xl shadow-[0_0_50px_rgba(202,138,4,0.15)] w-full max-w-md hidden transition-all duration-500 backdrop-blur-md">
            <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-white tracking-wide mb-1">JOIN THE <span class="text-yellow-500">BAND</span></h2>
            </div>
            <form id="register-form" class="space-y-4">
                <input type="text" id="reg-username" class="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl px-4 py-3" placeholder="Username" required>
                <input type="email" id="reg-email" class="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl px-4 py-3" placeholder="Email" required>
                <input type="password" id="reg-password" class="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl px-4 py-3" placeholder="Password" required>
                <button type="submit" class="w-full mt-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-gray-900 font-bold py-3 rounded-xl text-lg">ลงทะเบียน</button>
            </form>
            <div class="mt-8 text-center border-t border-gray-700/50 pt-6">
                <button id="show-login" type="button" class="text-sm text-yellow-500 font-bold hover:underline">กลับไปเข้าสู่ระบบ</button>
            </div>
        </div>
    </div>

    <!-- Sidebar Navigation -->
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col h-full z-10 hidden" id="sidebar">
        <div class="p-6"><h1 class="text-2xl font-bold">Admin Panel</h1></div>
        <nav class="flex-1 overflow-y-auto">
            <ul class="space-y-1">
                <li><a href="#" data-target="section-admin" class="nav-link block px-6 py-3 font-semibold hover:bg-gray-100 text-gray-800">Admin (User Mgt.)</a></li>
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
                <li><a href="#" data-target="section-forum" class="nav-link block px-6 py-3 font-semibold hover:bg-gray-100 text-gray-800">Forum Q&A</a></li>
                <li><a href="#" data-target="section-store" class="nav-link block px-6 py-3 font-semibold hover:bg-gray-100 text-gray-800">Store & Merch</a></li>
            </ul>
        </nav>
        <div class="p-4 border-t border-gray-200">
            <button id="logout-btn" type="button" class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded font-semibold">ออกจากระบบ</button>
        </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 h-full overflow-y-auto bg-white hidden relative" id="main-content">
        <!-- 1. Admin (User Management) Section -->
        <section id="section-admin" class="content-section p-8 max-w-6xl mx-auto">
            <h2 class="text-3xl font-bold mb-6 text-gray-800">จัดการสมาชิก (User Management)</h2>
            <div class="bg-white border rounded-xl shadow-sm overflow-hidden">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-100 border-b">
                            <th class="p-4 font-semibold text-gray-600">ID</th>
                            <th class="p-4 font-semibold text-gray-600">ชื่อผู้ใช้ (Username)</th>
                            <th class="p-4 font-semibold text-gray-600">บทบาท (Role)</th>
                            <th class="p-4 font-semibold text-gray-600">สถานะ (Status)</th>
                            <th class="p-4 font-semibold text-gray-600 text-right">การจัดการ</th>
                        </tr>
                    </thead>
                    <tbody id="user-table-body"></tbody>
                </table>
            </div>
        </section>

        <!-- 2. Festival & Event Section -->
        <section id="section-festival" class="content-section hidden">
            <div class="bg-blue-600 text-white p-6 flex justify-between items-center sticky top-0 z-10 shadow-md">
                <h2 class="text-3xl font-bold">Festival & Event</h2>
                <button class="bg-blue-500 hover:bg-blue-700 px-6 py-2 rounded-full border border-white font-semibold shadow" onclick="saveEvent()">+ Save Event</button>
            </div>
            
            <div class="p-8 max-w-4xl mx-auto space-y-8">
                <!-- Banners -->
                <div class="grid grid-cols-2 gap-4 h-48">
                    <label class="upload-box relative overflow-hidden group" id="banner-preview">
                        <span class="relative z-10 font-bold drop-shadow-md group-hover:text-gray-200">+ Add Banner</span>
                        <input type="file" id="event-banner" class="absolute inset-0 opacity-0 cursor-pointer z-20" accept="image/*" onchange="previewImage(this, 'banner-preview')">
                    </label>
                    <label class="upload-box relative overflow-hidden group" id="poster-preview">
                        <span class="relative z-10 font-bold drop-shadow-md group-hover:text-gray-200">+ Add Poster</span>
                        <input type="file" id="event-poster" class="absolute inset-0 opacity-0 cursor-pointer z-20" accept="image/*" onchange="previewImage(this, 'poster-preview')">
                    </label>
                </div>

                <!-- Basic Info -->
                <div class="space-y-4">
                    <input type="text" id="ev-title" class="input-style" placeholder="Title">
                    <input type="text" id="ev-short-desc" class="input-style" placeholder="Short Description">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs text-gray-500 ml-2 mb-1">Start Date</label>
                            <div class="flex gap-2">
                                <input type="date" id="ev-start-date" class="input-style">
                                <input type="time" id="ev-start-time" class="input-style w-32" value="12:00">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs text-gray-500 ml-2 mb-1">End Date</label>
                            <div class="flex gap-2">
                                <input type="date" id="ev-end-date" class="input-style">
                                <input type="time" id="ev-end-time" class="input-style w-32" value="15:00">
                            </div>
                        </div>
                    </div>
                    <div class="relative">
                        <input type="text" id="ev-location" class="input-style pr-10" placeholder="Location">
                    </div>
                    <textarea id="ev-details" class="textarea-style" placeholder="Details ...."></textarea>
                </div>

                <hr>

                <!-- Ticket -->
                <div>
                    <h3 class="text-xl font-bold mb-4">Ticket</h3>
                    <!-- ฟอร์มกรอกข้อมูลตั๋ว -->
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
                        <button type="button" onclick="addTicketToList()" class="absolute -bottom-4 right-4 bg-blue-600 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg hover:bg-blue-700 transition">+ Add Ticket</button>
                    </div>

                    <!-- พื้นที่แสดงรายการตั๋วที่เตรียมบันทึก -->
                    <div id="added-tickets-list" class="mt-8 space-y-2"></div>
                </div>

                <hr>

                <!-- Line Up -->
                <div>
                    <h3 class="text-xl font-bold mb-4">Line Up</h3>
                    <div id="lineup-container" class="space-y-2">
                        <div class="flex gap-2 items-center lineup-row">
                            <input type="date" class="input-style w-1/3 lineup-date">
                            <input type="time" class="input-style w-1/4 lineup-time">
                            <input type="text" class="input-style flex-1 lineup-name" placeholder="Details / Band Name">
                            <button type="button" onclick="addLineUpRow()" class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-blue-700 shrink-0 shadow">+</button>
                        </div>
                    </div>
                </div>

                <hr>

                <!-- Venue & Gallery -->
                <div><h3 class="text-xl font-bold mb-4">Venue</h3>
                    <div class="flex gap-4 items-stretch">
                        <label class="upload-box w-1/3 min-h-[200px] relative overflow-hidden group shrink-0" id="venue-photo-preview">
                            <span class="relative z-10 font-bold drop-shadow-md group-hover:text-gray-200">+ Add Photo</span>
                            <input type="file" id="venue-photo" class="absolute inset-0 opacity-0 cursor-pointer z-20" accept="image/*" onchange="previewImage(this, 'venue-photo-preview')">
                        </label>
                        <div class="flex-1 flex flex-col space-y-3">
                            <input type="text" id="venue-title" class="input-style" placeholder="Title">
                            <textarea id="venue-details" class="textarea-style flex-1" placeholder="Details"></textarea>
                            <input type="text" id="venue-map" class="input-style" placeholder="Google Map Link">
                            <div class="text-right mt-2">
                                <button type="button" onclick="showToast('บันทึกข้อมูล Venue ชั่วคราว (จะถูกบันทึกเมื่อกด Save Event)')" class="bg-blue-600 text-white px-8 py-2 rounded-full font-bold shadow hover:bg-blue-700 transition">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
                <div><h3 class="text-xl font-bold mb-4">Gallery</h3>
                    <div id="gallery-container" class="flex flex-wrap gap-4 items-start">
                        <label class="upload-box w-32 h-32 relative overflow-hidden group shrink-0 shadow-sm border border-dashed border-gray-400">
                            <span class="relative z-10 font-bold drop-shadow-md group-hover:text-gray-200 text-center">+ Add<br>Photos<br><span class="text-xs font-normal">(Max 10)</span></span>
                            <input type="file" id="gallery-photo" class="absolute inset-0 opacity-0 cursor-pointer z-20" accept="image/*" multiple onchange="previewGalleryImages(this)">
                        </label>
                        <div id="gallery-previews-wrapper" class="flex flex-wrap gap-4"></div>
                    </div>
                </div>
                
                <div class="pb-20 text-center mt-12">
                    <button class="bg-green-500 text-white px-12 py-3 rounded-full font-bold text-xl shadow-lg hover:bg-green-600 transition" onclick="saveEvent()">บันทึกข้อมูลทั้งหมด (Save Event)</button>
                </div>
            </div>
        </section>
        
        <!-- 3. Musician Network Section -->
        <section id="section-musician" class="content-section hidden">
            <div class="bg-yellow-500 text-black p-6 sticky top-0 z-10 shadow-md">
                <h2 class="text-3xl font-bold mb-4">Musician Network</h2>
                <div class="flex bg-gray-200 rounded-full p-1 max-w-md">
                    <button id="tab-btn-artist" onclick="switchMusicianTab('artist')" class="flex-1 bg-yellow-500 text-black font-bold py-1 rounded-full shadow-sm text-center transition">Artist Library</button>
                    <button id="tab-btn-jazz" onclick="switchMusicianTab('jazz')" class="flex-1 text-gray-500 font-semibold py-1 rounded-full text-center hover:bg-gray-300 transition">Jazz Network</button>
                </div>
            </div>

            <div class="p-8 max-w-4xl mx-auto">
                <!-- ARTIST LIBRARY CONTENT -->
                <div id="musician-artist-content" class="space-y-6 block">
                    <div class="grid grid-cols-2 gap-4 h-40">
                        <label class="upload-box relative overflow-hidden group" id="artist-banner-preview">
                            <span class="relative z-10 font-bold drop-shadow-md group-hover:text-gray-200">+ Add Banner</span>
                            <input type="file" id="artist-banner" class="absolute inset-0 opacity-0 cursor-pointer z-20" accept="image/*" onchange="previewImage(this, 'artist-banner-preview')">
                        </label>
                        <label class="upload-box relative overflow-hidden group" id="artist-profile-preview">
                            <span class="relative z-10 font-bold drop-shadow-md group-hover:text-gray-200">+ Add Profile</span>
                            <input type="file" id="artist-profile" class="absolute inset-0 opacity-0 cursor-pointer z-20" accept="image/*" onchange="previewImage(this, 'artist-profile-preview')">
                        </label>
                    </div>
                    <div class="space-y-4">
                        <input type="text" id="art-title" class="input-style" placeholder="Band Title">
                        <input type="text" id="art-genre" class="input-style" placeholder="Genre">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="flex items-center gap-2"><div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">f</div><input type="text" id="art-fb" class="input-style" placeholder="Facebook"></div>
                            <div class="flex items-center gap-2"><div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">WA</div><input type="text" id="art-wa" class="input-style" placeholder="WhatsApp"></div>
                            <div class="flex items-center gap-2"><div class="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">IG</div><input type="text" id="art-ig" class="input-style" placeholder="Instagram"></div>
                            <div class="flex items-center gap-2"><div class="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold">W</div><input type="text" id="art-web" class="input-style" placeholder="Website"></div>
                            <div class="flex items-center gap-2"><div class="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">TK</div><input type="text" id="art-tk" class="input-style" placeholder="TikTok"></div>
                            <div class="flex items-center gap-2"><div class="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">@</div><input type="text" id="art-email" class="input-style" placeholder="Email"></div>
                        </div>
                        <textarea id="art-details" class="textarea-style min-h-[150px]" placeholder="Details ...."></textarea>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold mb-4">Video</h3>
                        <div id="art-video-container" class="space-y-2">
                            <div class="flex gap-4">
                                <input type="text" class="input-style flex-1 art-video" placeholder="Link to your Video / Youtube / Vimeo">
                                <button type="button" onclick="addVideoRow('art-video-container', 'art-video')" class="bg-yellow-500 text-black px-8 py-2 rounded-full font-bold shadow hover:bg-yellow-600">Add</button>
                            </div>
                        </div>
                    </div>
                    <div class="pb-10 text-center mt-8">
                        <button type="button" class="bg-green-500 text-white px-12 py-3 rounded-full font-bold text-xl shadow-lg hover:bg-green-600" onclick="saveMusician('artist_library')">บันทึกข้อมูล Artist (Save)</button>
                    </div>
                </div>

                <!-- JAZZ NETWORK CONTENT -->
                <div id="musician-jazz-content" class="space-y-6 hidden">
                    <div class="grid grid-cols-2 gap-4 h-40">
                        <label class="upload-box relative overflow-hidden group" id="jazz-banner-preview">
                            <span class="relative z-10 font-bold drop-shadow-md group-hover:text-gray-200">+ Add Banner</span>
                            <input type="file" id="jazz-banner" class="absolute inset-0 opacity-0 cursor-pointer z-20" accept="image/*" onchange="previewImage(this, 'jazz-banner-preview')">
                        </label>
                        <label class="upload-box relative overflow-hidden group" id="jazz-profile-preview">
                            <span class="relative z-10 font-bold drop-shadow-md group-hover:text-gray-200">+ Add Profile</span>
                            <input type="file" id="jazz-profile" class="absolute inset-0 opacity-0 cursor-pointer z-20" accept="image/*" onchange="previewImage(this, 'jazz-profile-preview')">
                        </label>
                    </div>
                    <div class="space-y-4">
                        <input type="text" id="jazz-title" class="input-style" placeholder="Band / Institution Title">
                        <input type="text" id="jazz-genre" class="input-style" placeholder="Category">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="flex items-center gap-2"><div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">f</div><input type="text" id="jazz-fb" class="input-style" placeholder="Facebook"></div>
                            <div class="flex items-center gap-2"><div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">WA</div><input type="text" id="jazz-wa" class="input-style" placeholder="WhatsApp"></div>
                            <div class="flex items-center gap-2"><div class="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">IG</div><input type="text" id="jazz-ig" class="input-style" placeholder="Instagram"></div>
                            <div class="flex items-center gap-2"><div class="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold">W</div><input type="text" id="jazz-web" class="input-style" placeholder="Website"></div>
                            <div class="flex items-center gap-2"><div class="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">TK</div><input type="text" id="jazz-tk" class="input-style" placeholder="TikTok"></div>
                            <div class="flex items-center gap-2"><div class="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">@</div><input type="text" id="jazz-email" class="input-style" placeholder="Email"></div>
                        </div>
                        <textarea id="jazz-details" class="textarea-style min-h-[150px]" placeholder="Details ...."></textarea>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold mb-4">Video</h3>
                        <div id="jazz-video-container" class="space-y-2">
                            <div class="flex gap-4">
                                <input type="text" class="input-style flex-1 jazz-video" placeholder="Link to your Video / Youtube / Vimeo">
                                <button type="button" onclick="addVideoRow('jazz-video-container', 'jazz-video')" class="bg-yellow-500 text-black px-8 py-2 rounded-full font-bold shadow hover:bg-yellow-600">Add</button>
                            </div>
                        </div>
                    </div>
                    <div class="pb-10 text-center mt-8">
                        <button type="button" class="bg-green-500 text-white px-12 py-3 rounded-full font-bold text-xl shadow-lg hover:bg-green-600" onclick="saveMusician('jazz_network')">บันทึกข้อมูล Jazz Network (Save)</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- 4. Courses Library Section -->
        <section id="section-courses" class="content-section hidden">
            <div class="bg-green-600 text-white p-6 flex justify-between items-center sticky top-0 z-10 shadow-md">
                <h2 class="text-3xl font-bold">Courses Library</h2>
                <button class="bg-green-500 hover:bg-green-700 px-6 py-2 rounded-full border border-white font-semibold shadow transition" onclick="saveCourse()">+ Save Course</button>
            </div>
            
            <div class="p-8 max-w-4xl mx-auto space-y-6">
                <!-- Course Banner -->
                <label class="upload-box h-40 w-full relative overflow-hidden group shadow-sm border border-gray-300" id="course-banner-preview">
                    <span class="relative z-10 font-bold drop-shadow-md group-hover:text-gray-200">+ Add Banner</span>
                    <input type="file" id="course-banner" class="absolute inset-0 opacity-0 cursor-pointer z-20" accept="image/*" onchange="previewImage(this, 'course-banner-preview')">
                </label>
                
                <!-- Course Info -->
                <input type="text" id="course-title" class="input-style" placeholder="Course Title">
                <input type="text" id="course-creator" class="input-style" placeholder="Creator">
                
                <!-- เครื่องมือสำหรับเพิ่มเนื้อหาลงใน Course -->
                <div class="flex gap-4 border-b pb-4 mb-4">
                    <button type="button" onclick="addCourseContent('text')" class="border-2 border-green-500 text-green-700 rounded-full px-5 py-1.5 text-sm font-bold hover:bg-green-50 transition">+ Add Text</button>
                    <button type="button" onclick="addCourseContent('image')" class="border-2 border-blue-500 text-blue-700 rounded-full px-5 py-1.5 text-sm font-bold hover:bg-blue-50 transition">+ Add Image</button>
                    <button type="button" onclick="addCourseContent('video')" class="border-2 border-red-500 text-red-700 rounded-full px-5 py-1.5 text-sm font-bold hover:bg-red-50 transition">+ Add Video</button>
                </div>
                
                <!-- คอนเทนเนอร์สำหรับใส่เนื้อหาแบบอิสระ -->
                <div id="course-content-container" class="space-y-4">
                    <!-- กล่องข้อความเริ่มต้น 1 กล่อง -->
                    <div class="relative course-item border border-gray-200 p-4 rounded-xl bg-gray-50 shadow-sm" data-type="text">
                        <button type="button" onclick="this.parentElement.remove()" class="absolute -top-3 -right-3 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold shadow hover:bg-red-600 transition z-10 text-xs">✕</button>
                        <textarea class="textarea-style min-h-[120px] course-text-input border-white" placeholder="พิมพ์ข้อความ / Details ที่นี่...."></textarea>
                    </div>
                </div>
                
                <div class="pb-10 text-center mt-8">
                    <button type="button" class="bg-green-500 text-white px-12 py-3 rounded-full font-bold text-xl shadow-lg hover:bg-green-600 transition" onclick="saveCourse()">บันทึกคอร์สเรียน (Save Course)</button>
                </div>
            </div>
        </section>

        <!-- 5. CMBigband Section -->
        <section id="section-cmbigband" class="content-section hidden">
            <div class="bg-gray-400 text-black p-6 sticky top-0 z-10 shadow-md">
                <h2 class="text-3xl font-bold">CMBigband</h2>
            </div>
            <div class="p-8 max-w-4xl mx-auto space-y-6">
                <div class="grid grid-cols-2 gap-4 h-40">
                    <label class="upload-box relative overflow-hidden group" id="cmbigband-banner-preview">
                        <span class="relative z-10 font-bold drop-shadow-md group-hover:text-gray-200">+ Add Banner</span>
                        <input type="file" id="cmb-banner" class="absolute inset-0 opacity-0 cursor-pointer z-20" accept="image/*" onchange="previewImage(this, 'cmbigband-banner-preview')">
                    </label>
                    <label class="upload-box relative overflow-hidden group" id="cmbigband-profile-preview">
                        <span class="relative z-10 font-bold drop-shadow-md group-hover:text-gray-200">+ Add Profile</span>
                        <input type="file" id="cmb-profile" class="absolute inset-0 opacity-0 cursor-pointer z-20" accept="image/*" onchange="previewImage(this, 'cmbigband-profile-preview')">
                    </label>
                </div>
                <div class="space-y-4">
                    <input type="text" id="cmb-title" class="input-style" placeholder="Band Title">
                    <input type="text" id="cmb-genre" class="input-style" placeholder="Genre">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex items-center gap-2"><div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">f</div><input type="text" id="cmb-fb" class="input-style" placeholder="Facebook"></div>
                        <div class="flex items-center gap-2"><div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">WA</div><input type="text" id="cmb-wa" class="input-style" placeholder="WhatsApp"></div>
                        <div class="flex items-center gap-2"><div class="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">IG</div><input type="text" id="cmb-ig" class="input-style" placeholder="Instagram"></div>
                        <div class="flex items-center gap-2"><div class="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold">W</div><input type="text" id="cmb-web" class="input-style" placeholder="Website"></div>
                        <div class="flex items-center gap-2"><div class="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">TK</div><input type="text" id="cmb-tk" class="input-style" placeholder="TikTok"></div>
                        <div class="flex items-center gap-2"><div class="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">@</div><input type="text" id="cmb-email" class="input-style" placeholder="Email"></div>
                    </div>
                    <textarea id="cmb-details" class="textarea-style min-h-[150px]" placeholder="Details ...."></textarea>
                </div>
                <div>
                    <h3 class="text-xl font-bold mb-4">Video</h3>
                    <div id="cmb-video-container" class="space-y-2">
                        <div class="flex gap-4">
                            <input type="text" class="input-style flex-1 cmb-video" placeholder="Link to your Video / Youtube / Vimeo">
                            <button type="button" onclick="addVideoRow('cmb-video-container', 'cmb-video')" class="bg-yellow-500 text-black px-8 py-2 rounded-full font-bold shadow hover:bg-yellow-600">Add</button>
                        </div>
                    </div>
                </div>
                <div class="pb-10 text-center mt-8">
                    <button type="button" class="bg-green-500 text-white px-12 py-3 rounded-full font-bold text-xl shadow-lg hover:bg-green-600" onclick="saveCMBigband()">บันทึกข้อมูล CMBigband (Save)</button>
                </div>
            </div>
        </section>

        <!-- 6. Forum Q&A Section -->
        <section id="section-forum" class="content-section hidden p-8 max-w-6xl mx-auto">
            <h2 class="text-3xl font-bold mb-6 text-gray-800">Forum Q&A</h2>
            <div class="bg-white border rounded-xl shadow-sm p-16 text-center text-gray-500">
                <p class="text-xl font-semibold mb-2">ระบบจัดการ Forum Q&A</p>
                <p>อยู่ระหว่างการพัฒนา...</p>
            </div>
        </section>

        <!-- 7. Store & Merch Section -->
        <section id="section-store" class="content-section hidden p-8 max-w-6xl mx-auto">
            <h2 class="text-3xl font-bold mb-6 text-gray-800">Store & Merch</h2>
            <div class="bg-white border rounded-xl shadow-sm p-16 text-center text-gray-500">
                <p class="text-xl font-semibold mb-2">ระบบจัดการ Store & Merch</p>
                <p>อยู่ระหว่างการพัฒนา...</p>
            </div>
        </section>
    </main>

    <!-- Confirm Delete Modal -->
    <div id="confirm-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 hidden backdrop-blur-sm transition-opacity">
        <div class="bg-white p-8 rounded-3xl shadow-2xl w-96 text-center transform transition-all">
            <h3 class="text-2xl font-bold mb-2 text-gray-800">ยืนยันการลบ</h3>
            <div class="flex justify-center gap-3 mt-6">
                <button onclick="closeConfirmModal()" class="px-6 py-2.5 bg-gray-200 font-bold rounded-full w-full">ยกเลิก</button>
                <button id="confirm-delete-btn" class="px-6 py-2.5 bg-red-600 text-white font-bold rounded-full w-full">ลบข้อมูล</button>
            </div>
        </div>
    </div>

    <!-- Change Password Modal -->
    <div id="password-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 hidden backdrop-blur-sm transition-opacity">
        <div class="bg-white p-8 rounded-3xl shadow-2xl w-96 transform transition-all">
            <h3 class="text-2xl font-bold mb-1 text-gray-800">เปลี่ยนรหัสผ่าน</h3>
            <input type="password" id="new-password-input" class="w-full border rounded-xl px-4 py-3 mb-6" placeholder="รหัสผ่านใหม่">
            <div class="flex justify-end gap-3">
                <button onclick="closePasswordModal()" class="px-5 py-2.5 bg-gray-200 font-bold rounded-full">ยกเลิก</button>
                <button id="save-password-btn" class="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-full">บันทึกรหัสผ่าน</button>
            </div>
        </div>
    </div>

    <div id="toast-container"></div>

    <script>
        // --- 0. API Config (รองรับการทดสอบบน Canvas) ---
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

        // --- 1. DOM Elements ที่ต้องใช้ ---
        const loginScreen = document.getElementById('login-screen');
        const loginContainer = document.getElementById('login-container');
        const registerContainer = document.getElementById('register-container');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const showRegisterBtn = document.getElementById('show-register');
        const showLoginBtn = document.getElementById('show-login');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        const logoutBtn = document.getElementById('logout-btn');

        // --- 2. สลับหน้า Login / Register ---
        showRegisterBtn.addEventListener('click', () => {
            loginContainer.classList.add('hidden'); 
            registerContainer.classList.remove('hidden');
        });

        showLoginBtn.addEventListener('click', () => {
            registerContainer.classList.add('hidden'); 
            loginContainer.classList.remove('hidden');
        });

        // --- 3. ระบบ Register ---
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append('username', document.getElementById('reg-username').value);
            formData.append('email', document.getElementById('reg-email').value);
            formData.append('password', document.getElementById('reg-password').value);
            try {
                const response = await fetch(getApiUrl('register'), fetchOptions('POST', formData));
                const result = await response.json();
                showToast(result.message);
                if (result.status === 'success') { 
                    registerForm.reset(); 
                    showLoginBtn.click(); 
                }
            } catch (error) { showToast('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ (ทดสอบใน Preview Mode)'); }
        });

        // --- 4. ระบบ Login ---
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append('username', document.getElementById('username').value);
            formData.append('password', document.getElementById('password').value);
            try {
                const response = await fetch(getApiUrl('login'), fetchOptions('POST', formData));
                const result = await response.json();
                if (result.status === 'success') {
                    loginScreen.classList.add('hidden'); 
                    sidebar.classList.remove('hidden'); 
                    mainContent.classList.remove('hidden');
                    showToast('เข้าสู่ระบบสำเร็จ'); 
                    switchTab('section-admin'); 
                    fetchUsers(); 
                } else {
                    showToast('ข้อผิดพลาด: ' + result.message); 
                }
            } catch (error) { showToast('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ (ทดสอบใน Preview Mode)'); }
        });

        // --- 5. ระบบ Logout ---
        logoutBtn.addEventListener('click', () => {
            loginScreen.classList.remove('hidden'); 
            sidebar.classList.add('hidden'); 
            mainContent.classList.add('hidden');
            document.getElementById('password').value = ''; 
        });

        // --- 6. ระบบ Tabs ---
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
            }); 
        });

        // ฟังก์ชันสลับเมนูย่อยของ Musician Network
        window.switchMusicianTab = function(tabName) {
            const btnArtist = document.getElementById('tab-btn-artist');
            const btnJazz = document.getElementById('tab-btn-jazz');
            const contentArtist = document.getElementById('musician-artist-content');
            const contentJazz = document.getElementById('musician-jazz-content');

            if (tabName === 'artist') {
                btnArtist.className = 'flex-1 bg-yellow-500 text-black font-bold py-1 rounded-full shadow-sm text-center transition';
                btnJazz.className = 'flex-1 text-gray-500 font-semibold py-1 rounded-full text-center hover:bg-gray-300 transition';
                contentArtist.classList.remove('hidden'); contentArtist.classList.add('block');
                contentJazz.classList.add('hidden'); contentJazz.classList.remove('block');
            } else if (tabName === 'jazz') {
                btnJazz.className = 'flex-1 bg-yellow-500 text-black font-bold py-1 rounded-full shadow-sm text-center transition';
                btnArtist.className = 'flex-1 text-gray-500 font-semibold py-1 rounded-full text-center hover:bg-gray-300 transition';
                contentJazz.classList.remove('hidden'); contentJazz.classList.add('block');
                contentArtist.classList.add('hidden'); contentArtist.classList.remove('block');
            }
        };

        window.showToast = (message) => {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div'); toast.className = 'toast'; toast.textContent = message;
            container.appendChild(toast);
            setTimeout(() => toast.classList.add('show'), 10);
            setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
        };

        // --- 7. User Management ---
        let users = [];
        async function fetchUsers() {
            try {
                const response = await fetch(getApiUrl('get_users'), fetchOptions('GET'));
                const result = await response.json();
                if (result.status === 'success') { users = result.data; renderUsers(); }
            } catch (error) {}
        }
        
        function renderUsers() {
            const tbody = document.getElementById('user-table-body'); tbody.innerHTML = '';
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
        
        document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
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
        
        document.getElementById('save-password-btn').addEventListener('click', async () => {
            const newPass = document.getElementById('new-password-input').value;
            if(!newPass) return showToast('กรุณากรอกรหัสผ่าน');
            try {
                const formData = new FormData(); formData.append('user_id', passwordTargetId); formData.append('new_password', newPass);
                const response = await fetch(getApiUrl('update_password'), fetchOptions('POST', formData));
                const result = await response.json(); showToast(result.message); 
            } catch(error) {}
            closePasswordModal();
        });

        // --- 8. Ticket Logic ---
        let pendingTickets = [];
        window.addTicketToList = () => {
            const title = document.getElementById('temp_ticket_title').value.trim();
            if (!title) { showToast('กรุณากรอกชื่อตั๋ว (Ticket Title)'); return; }
            const details = document.getElementById('temp_ticket_details').value;
            const price = document.getElementById('temp_ticket_price').value || 0;
            const amount = document.getElementById('temp_ticket_amount').value || 0;
            const status = document.querySelector('input[name="temp_ticket_status"]:checked').value;

            pendingTickets.push({ title, details, price, amount, status });
            
            document.getElementById('temp_ticket_title').value = '';
            document.getElementById('temp_ticket_details').value = '';
            document.getElementById('temp_ticket_price').value = '';
            document.getElementById('temp_ticket_amount').value = '';
            document.querySelector('input[name="temp_ticket_status"][value="1"]').checked = true;

            renderPendingTickets();
        };

        function renderPendingTickets() {
            const container = document.getElementById('added-tickets-list');
            container.innerHTML = '';
            if(pendingTickets.length > 0) container.innerHTML = `<h4 class="text-sm font-bold text-gray-600 mb-2">รายการตั๋วที่เตรียมบันทึก:</h4>`;
            pendingTickets.forEach((ticket, index) => {
                container.innerHTML += `
                    <div class="bg-white border border-gray-200 p-3 rounded-lg shadow-sm flex justify-between items-center">
                        <div>
                            <span class="font-bold text-blue-600">${ticket.title}</span> 
                            <span class="text-sm text-gray-500 ml-2">(${ticket.price} THB / ${ticket.amount} ใบ)</span>
                        </div>
                        <button type="button" onclick="removePendingTicket(${index})" class="text-red-500 hover:text-red-700 font-bold bg-red-50 px-2 py-1 rounded">ลบ</button>
                    </div>
                `;
            });
        }
        window.removePendingTicket = (index) => { pendingTickets.splice(index, 1); renderPendingTickets(); };

        // --- 9. Lineup Logic ---
        window.addLineUpRow = () => {
            const container = document.getElementById('lineup-container');
            const row = document.createElement('div');
            row.className = 'flex gap-2 items-center lineup-row';
            row.innerHTML = `
                <input type="date" class="input-style w-1/3 lineup-date">
                <input type="time" class="input-style w-1/4 lineup-time">
                <input type="text" class="input-style flex-1 lineup-name" placeholder="Details / Band Name">
                <button type="button" onclick="this.parentElement.remove()" class="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-red-600 shrink-0 shadow">-</button>
            `;
            container.appendChild(row);
        };

        // --- 10. Image Preview Logic ---
        window.previewImage = (input, containerId) => {
            const container = document.getElementById(containerId);
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    container.style.backgroundImage = `url('${e.target.result}')`; container.style.backgroundSize = 'cover'; container.style.backgroundPosition = 'center';
                    const span = container.querySelector('span'); if (span) span.classList.add('bg-black/60', 'text-white', 'px-4', 'py-2', 'rounded-full');
                }
                reader.readAsDataURL(input.files[0]);
            }
        };

        let globalGalleryFiles = new DataTransfer(); 
        window.previewGalleryImages = (input) => {
            if (input.files && input.files.length > 0) {
                Array.from(input.files).forEach(file => { if (globalGalleryFiles.files.length < 10) globalGalleryFiles.items.add(file); });
                input.value = ''; renderGalleryPreviews();
            }
        };
        function renderGalleryPreviews() {
            const wrapper = document.getElementById('gallery-previews-wrapper'); wrapper.innerHTML = ''; 
            Array.from(globalGalleryFiles.files).forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const previewDiv = document.createElement('div');
                    previewDiv.className = 'w-32 h-32 rounded-lg bg-cover bg-center shrink-0 shadow-sm border border-gray-200 relative group';
                    previewDiv.style.backgroundImage = `url('${e.target.result}')`;
                    const removeBtn = document.createElement('button'); removeBtn.innerHTML = '✕';
                    removeBtn.className = 'absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow hover:bg-red-700';
                    removeBtn.onclick = (e) => { e.preventDefault(); removeGalleryImage(index); };
                    previewDiv.appendChild(removeBtn); wrapper.appendChild(previewDiv);
                }
                reader.readAsDataURL(file);
            });
        }
        window.removeGalleryImage = (idxToRemove) => {
            const dt = new DataTransfer();
            Array.from(globalGalleryFiles.files).forEach((file, idx) => { if (idx !== idxToRemove) dt.items.add(file); });
            globalGalleryFiles = dt; renderGalleryPreviews(); 
        };

        // --- 11. Save Event ---
        window.saveEvent = async () => {
            try {
                const formData = new FormData();
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
                        formData.append('ticket_titles[]', ticket.title);
                        formData.append('ticket_details[]', ticket.details);
                        formData.append('ticket_prices[]', ticket.price);
                        formData.append('ticket_amounts[]', ticket.amount);
                        formData.append('ticket_status[]', ticket.status);
                    });
                } else {
                    const tempTitle = document.getElementById('temp_ticket_title').value.trim();
                    if(tempTitle) {
                        formData.append('ticket_titles[]', tempTitle);
                        formData.append('ticket_details[]', document.getElementById('temp_ticket_details').value);
                        formData.append('ticket_prices[]', document.getElementById('temp_ticket_price').value || 0);
                        formData.append('ticket_amounts[]', document.getElementById('temp_ticket_amount').value || 0);
                        formData.append('ticket_status[]', document.querySelector('input[name="temp_ticket_status"]:checked').value);
                    }
                }

                const lineupDates = document.querySelectorAll('.lineup-date');
                const lineupTimes = document.querySelectorAll('.lineup-time');
                document.querySelectorAll('.lineup-name').forEach((input, index) => {
                    const nameVal = input.value.trim();
                    if(nameVal) { 
                        formData.append('lineup_dates[]', lineupDates[index].value);
                        let timeVal = lineupTimes[index].value;
                        if (timeVal && timeVal.length === 5) timeVal += ':00';
                        formData.append('lineup_times[]', timeVal);
                        formData.append('lineup_names[]', nameVal);
                    }
                });

                const bannerFile = document.getElementById('event-banner').files[0];
                const posterFile = document.getElementById('event-poster').files[0];
                const venueFile = document.getElementById('venue-photo') ? document.getElementById('venue-photo').files[0] : null;
                if(bannerFile) formData.append('banner_image', bannerFile);
                if(posterFile) formData.append('poster_image', posterFile);
                if(venueFile) formData.append('venue_image', venueFile);

                Array.from(globalGalleryFiles.files).forEach(file => { formData.append('gallery_images[]', file); });

                showToast('กำลังบันทึกข้อมูล Event...');
                const response = await fetch(getApiUrl('save_event'), fetchOptions('POST', formData));
                const result = await response.json();
                
                if (result.status === 'success') {
                    showToast('บันทึกสำเร็จ!');
                    
                    const section = document.getElementById('section-festival');
                    section.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), textarea').forEach(el => el.value = '');
                    section.querySelectorAll('.upload-box').forEach(el => {
                        el.style.backgroundImage = '';
                        const span = el.querySelector('span');
                        if(span) span.classList.remove('bg-black/60', 'text-white', 'px-4', 'py-2', 'rounded-full');
                    });
                    
                    document.getElementById('lineup-container').innerHTML = `
                        <div class="flex gap-2 items-center lineup-row">
                            <input type="date" class="input-style w-1/3 lineup-date">
                            <input type="time" class="input-style w-1/4 lineup-time">
                            <input type="text" class="input-style flex-1 lineup-name" placeholder="Details / Band Name">
                            <button type="button" onclick="addLineUpRow()" class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-blue-700 shrink-0 shadow">+</button>
                        </div>
                    `;
                    
                    pendingTickets = []; renderPendingTickets();
                    globalGalleryFiles = new DataTransfer(); renderGalleryPreviews();
                    
                    document.getElementById('main-content').scrollTop = 0; 
                } else showToast('ข้อผิดพลาด: ' + result.message);
            } catch (error) { showToast('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'); }
        };

        // --- 12. Musician Network Logic ---
        window.addVideoRow = (containerId, inputClass) => {
            const container = document.getElementById(containerId);
            const row = document.createElement('div');
            row.className = 'flex gap-4 mt-2';
            row.innerHTML = `
                <input type="text" class="input-style flex-1 ${inputClass}" placeholder="Link to your Video / Youtube / Vimeo">
                <button type="button" onclick="this.parentElement.remove()" class="bg-red-500 text-white px-8 py-2 rounded-full font-bold shadow hover:bg-red-600 transition">Del</button>
            `;
            container.appendChild(row);
        };

        window.saveMusician = async (type) => {
            try {
                const formData = new FormData();
                const prefix = type === 'artist_library' ? 'art' : 'jazz';
                
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
                videoInputs.forEach(input => {
                    if(input.value.trim()) formData.append('video_links[]', input.value.trim());
                });

                const bannerType = type === 'artist_library' ? 'artist' : 'jazz';
                const bannerFile = document.getElementById(`${bannerType}-banner`).files[0];
                const profileFile = document.getElementById(`${bannerType}-profile`).files[0];
                
                if(bannerFile) formData.append('banner_image', bannerFile);
                if(profileFile) formData.append('profile_image', profileFile);

                showToast('กำลังบันทึกข้อมูล...');
                const response = await fetch(getApiUrl('save_musician'), fetchOptions('POST', formData));
                const result = await response.json();
                
                if (result.status === 'success') {
                    showToast('บันทึกข้อมูลสำเร็จ!');
                    
                    const section = document.getElementById(type === 'artist_library' ? 'musician-artist-content' : 'musician-jazz-content');
                    section.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), textarea').forEach(el => el.value = '');
                    section.querySelectorAll('.upload-box').forEach(el => {
                        el.style.backgroundImage = '';
                        const span = el.querySelector('span');
                        if(span) span.classList.remove('bg-black/60', 'text-white', 'px-4', 'py-2', 'rounded-full');
                    });
                    
                    const videoContainerId = type === 'artist_library' ? 'art-video-container' : 'jazz-video-container';
                    const videoClass = type === 'artist_library' ? 'art-video' : 'jazz-video';
                    document.getElementById(videoContainerId).innerHTML = `
                        <div class="flex gap-4">
                            <input type="text" class="input-style flex-1 ${videoClass}" placeholder="Link to your Video / Youtube / Vimeo">
                            <button type="button" onclick="addVideoRow('${videoContainerId}', '${videoClass}')" class="bg-yellow-500 text-black px-8 py-2 rounded-full font-bold shadow hover:bg-yellow-600">Add</button>
                        </div>
                    `;
                    
                    document.getElementById('main-content').scrollTop = 0; 
                } else {
                    showToast('ข้อผิดพลาด: ' + result.message);
                }
            } catch(e) {
                showToast('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
            }
        };

        // --- 13. Courses Library Logic ---
        let courseImgCounter = 0;
        window.addCourseContent = (type) => {
            const container = document.getElementById('course-content-container');
            const itemDiv = document.createElement('div');
            itemDiv.className = 'relative course-item border border-gray-200 p-4 rounded-xl bg-gray-50 shadow-sm';
            itemDiv.setAttribute('data-type', type);
            const deleteBtn = `<button type="button" onclick="this.parentElement.remove()" class="absolute -top-3 -right-3 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold shadow hover:bg-red-600 transition z-10 text-xs">✕</button>`;

            if (type === 'text') {
                itemDiv.innerHTML = deleteBtn + `<textarea class="textarea-style min-h-[120px] course-text-input border-white" placeholder="พิมพ์ข้อความ / Details ที่นี่...."></textarea>`;
            } else if (type === 'image') {
                courseImgCounter++;
                const previewId = `course-img-preview-${courseImgCounter}`;
                itemDiv.innerHTML = deleteBtn + `
                    <label class="upload-box h-48 w-full relative overflow-hidden group shadow-sm border border-dashed border-gray-400 bg-white" id="${previewId}">
                        <span class="relative z-10 font-bold drop-shadow-md group-hover:text-gray-200">+ Add Image</span>
                        <input type="file" class="absolute inset-0 opacity-0 cursor-pointer z-20 course-img-input" accept="image/*" onchange="previewImage(this, '${previewId}')">
                    </label>
                `;
            } else if (type === 'video') {
                itemDiv.innerHTML = deleteBtn + `<input type="text" class="input-style course-video-input bg-white" placeholder="Link to Video (Youtube / Vimeo / etc.)">`;
            }
            container.appendChild(itemDiv);
        };

        window.saveCourse = async () => {
            try {
                const formData = new FormData();
                formData.append('title', document.getElementById('course-title').value);
                formData.append('creator', document.getElementById('course-creator').value);
                
                const bannerFile = document.getElementById('course-banner').files[0];
                if(bannerFile) formData.append('banner_image', bannerFile);

                // ดึงข้อมูล Content ที่ถูกเพิ่มเข้ามาแบบอิสระ
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
                        if (fileInput && fileInput.files[0]) {
                            formData.append(`content_images_${index}`, fileInput.files[0]);
                            formData.append('content_values[]', `has_image`);
                        } else {
                            formData.append('content_values[]', '');
                        }
                    }
                });

                showToast('กำลังบันทึกข้อมูล Course...');
                const response = await fetch(getApiUrl('save_course'), fetchOptions('POST', formData));
                const result = await response.json();
                
                if (result.status === 'success') {
                    showToast('บันทึกคอร์สเรียนสำเร็จ!');
                    
                    // เคลียร์ฟอร์ม
                    document.getElementById('course-title').value = '';
                    document.getElementById('course-creator').value = '';
                    
                    const bannerPreview = document.getElementById('course-banner-preview');
                    bannerPreview.style.backgroundImage = '';
                    const span = bannerPreview.querySelector('span');
                    if(span) span.classList.remove('bg-black/60', 'text-white', 'px-4', 'py-2', 'rounded-full');
                    document.getElementById('course-banner').value = ''; 
                    
                    // ล้างเนื้อหาเดิม และใส่กล่องข้อความกลับมาให้ 1 อันเหมือนตอนเริ่มต้น
                    document.getElementById('course-content-container').innerHTML = '';
                    addCourseContent('text'); 
                    
                    document.getElementById('main-content').scrollTop = 0;
                } else {
                    showToast('ข้อผิดพลาด: ' + result.message);
                }
            } catch (error) {
                showToast('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
            }
        };

        // --- 14. CMBigband Logic ---
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
                videoInputs.forEach(input => {
                    if(input.value.trim()) formData.append('video_links[]', input.value.trim());
                });

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
                    section.querySelectorAll('.upload-box').forEach(el => {
                        el.style.backgroundImage = '';
                        const span = el.querySelector('span');
                        if(span) span.classList.remove('bg-black/60', 'text-white', 'px-4', 'py-2', 'rounded-full');
                    });
                    
                    document.getElementById('cmb-video-container').innerHTML = `
                        <div class="flex gap-4">
                            <input type="text" class="input-style flex-1 cmb-video" placeholder="Link to your Video / Youtube / Vimeo">
                            <button type="button" onclick="addVideoRow('cmb-video-container', 'cmb-video')" class="bg-yellow-500 text-black px-8 py-2 rounded-full font-bold shadow hover:bg-yellow-600">Add</button>
                        </div>
                    `;
                    
                    document.getElementById('main-content').scrollTop = 0;
                } else {
                    showToast('ข้อผิดพลาด: ' + result.message);
                }
            } catch(e) {
                showToast('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
            }
        };

    </script>
</body>
</html>