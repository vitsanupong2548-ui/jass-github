window.homepageData = {};

// 1. โหลดข้อมูลและหน้าต่างย่อย (HTML Includes)
async function initFrontend() {
    try {
        const res = await fetch('api_homepage.php');
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
}

// 2. ฟังก์ชันหยอดข้อมูลลงหน้าเว็บ
window.applyDataToDOM = function(container) {
    if(!container) return;
    container.querySelectorAll('[id^="dyn-"]').forEach(el => {
        if (el.closest('#hidden-card-content')) return; // ข้ามแม่พิมพ์ต้นฉบับ
        const key = el.id.replace('dyn-', '');
        if(window.homepageData[key]) {
            if (el.tagName === 'IMG') el.src = window.homepageData[key];
            else el.innerHTML = window.homepageData[key];
        }
    });
};

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

    // ================= Auth Modal =================
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

    // Login Form Submit
    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        try {
            const res = await fetch('login.php', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({email, password}) });
            const data = await res.json();
            if(res.ok) { localStorage.setItem('authToken', data.token); window.location.href = 'Dataadmin.php'; }
            else document.getElementById('login-error-message').textContent = data.message;
        } catch(err) { document.getElementById('login-error-message').textContent = 'Server Error'; }
    });
});