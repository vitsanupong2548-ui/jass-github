window.homepageData = {};

// 1. โหลดข้อมูลและหน้าต่างย่อย (HTML Includes)
async function initFrontend() {
    try {
        const res = await fetch('api/get_homepage.php');
        window.homepageData = await res.json();
    } catch (e) {
        console.error("Error fetching data:", e);
    }
    
    const includes = document.querySelectorAll('[data-include]');
    const promises = Array.from(includes).map(async el => {
        const file = el.getAttribute('data-include');
        try {
            const html = await (await fetch(file)).text();
            el.innerHTML = html;
        } catch(err) { console.error("Error loading template:", file); }
    });
    
    await Promise.all(promises);
    window.applyDataToDOM(document);
    
    // พอโหลดหน้าเว็บเสร็จปุ๊บ ให้ไปดึงข้อมูลคอร์สเรียนมาโชว์ทันที
    loadCoursesFromDB();
}



// 3. ฟังก์ชันดึงคอร์สจากฐานข้อมูลมาโชว์แบบสวยๆ
async function loadCoursesFromDB() {
    try {
        const res = await fetch('api/get_courses.php');
        const courses = await res.json();
        
        const container = document.getElementById('course-list-container');
        if (!container) return; // ถ้าไม่ได้อยู่หน้าคอร์ส ให้ข้ามไป

        container.innerHTML = ''; // ล้างการ์ดจำลองอันเก่าทิ้งให้หมด

        // วนลูปเอาคอร์สที่ได้จากฐานข้อมูลมาสร้างเป็นการ์ด
        courses.forEach((course) => {
            // สร้างรูปภาพจำลอง โดยเอาชื่อคอร์สไปแปะบนรูปเลย
            const placeholderImg = `https://placehold.co/400x250/10a349/fff?text=${encodeURIComponent(course.title)}`;
            
            container.innerHTML += `
                <div data-course-index="${course.id}" class="course-link cursor-pointer group relative rounded-lg overflow-hidden aspect-video shadow-md">
                    <img src="${placeholderImg}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/60 transition-colors flex flex-col justify-end p-3">
                        <h4 class="text-white font-bold text-sm truncate leading-tight">${course.title}</h4>
                        <p class="text-white/80 text-[10px] truncate mt-0.5">By ${course.creator}</p>
                    </div>
                </div>
            `;
        });
        
        // สั่งให้การ์ดใหม่ที่เพิ่งสร้าง สามารถคลิกเข้าดู Detail ได้
        if(typeof addEventDetailListeners === 'function') {
            addEventDetailListeners(document);
        }

    } catch (err) {
        console.error('Error loading courses:', err);
    }
}

// 4. ระบบการทำงานหลักเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', () => {
    initFrontend();

    // ================= Mobile Menu =================
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenuContainer = document.getElementById('mobile-menu-container');
    const menuBackdrop = document.getElementById('menu-backdrop');
    const menuPanel = document.getElementById('menu-panel');

    if (menuToggle) menuToggle.addEventListener('click', () => {
        mobileMenuContainer.classList.remove('hidden');
        requestAnimationFrame(() => { menuBackdrop.classList.remove('opacity-0'); menuPanel.classList.remove('translate-x-full'); });
    });
    
    const closeMenu = () => {
        menuBackdrop.classList.add('opacity-0'); menuPanel.classList.add('translate-x-full');
        setTimeout(() => mobileMenuContainer.classList.add('hidden'), 300);
    };
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
    if (menuBackdrop) menuBackdrop.addEventListener('click', closeMenu);

    // ================= Auth Modal (ป๊อปอัป Login) =================
    const authModal = document.getElementById('auth-modal');
    const loginBtn = document.getElementById('login-button');
    if (loginBtn) loginBtn.addEventListener('click', (e) => { e.preventDefault(); if(authModal) authModal.classList.remove('hidden'); });
    document.getElementById('close-auth-modal')?.addEventListener('click', () => authModal.classList.add('hidden'));
    document.getElementById('auth-backdrop')?.addEventListener('click', () => authModal.classList.add('hidden'));

    document.getElementById('show-register')?.addEventListener('click', () => {
        document.getElementById('login-view').classList.add('hidden');
        document.getElementById('register-view').classList.remove('hidden');
    });
    document.getElementById('show-login')?.addEventListener('click', () => {
        document.getElementById('register-view').classList.add('hidden');
        document.getElementById('login-view').classList.remove('hidden');
    });

    // ================= ระบบสมัครสมาชิก (Register) =================
    document.getElementById('register-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;

        if (password !== confirmPassword) {
            document.getElementById('register-error-message').textContent = 'รหัสผ่านไม่ตรงกัน!';
            return;
        }

        try {
            const res = await fetch('api/api_register.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, email, password})
            });
            const data = await res.json();
            
            if(data.status === "success") {
                alert('สมัครสมาชิกสำเร็จ กรุณาล็อกอิน!');
                document.getElementById('show-login').click(); 
            } else {
                document.getElementById('register-error-message').textContent = data.message;
            }
        } catch(err) { console.error('Error:', err); }
    });

    // ================= ระบบล็อกอินแยกสิทธิ์ (Login) =================
    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            const res = await fetch('api/api_login.php', { 
                method: 'POST', 
                headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify({email, password}) 
            });
            const data = await res.json();
            
            if(data.status === "success") {
                alert('เข้าสู่ระบบสำเร็จ!');
                if(data.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    document.getElementById('auth-modal').classList.add('hidden');
                    document.getElementById('login-button').innerText = 'My Account';
                }
            } else { 
                document.getElementById('login-error-message').textContent = data.message; 
            }
        } catch(err) { document.getElementById('login-error-message').textContent = 'Server Error (ตรวจสอบไฟล์ฐานข้อมูล)'; }
    });
});