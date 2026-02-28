// ==========================================
// 🌟 ไฟล์จัดการระบบภาษา (Language Manager) 🌟
// ==========================================

window.currentLang = localStorage.getItem('siteLang') || 'en'; 

const siteTranslations = {
    en: {
        // ... (โค้ดเดิม 1-4) ...
        "nav_book": "Book Now",
        "nav_login": "Log in",
        "search_placeholder": "What are you looking for today?",
        "hero_title": "The Soul of Lanna,<br>The Heart of Jazz",
        "hero_learn_more": "Learn More",
        "hero_subtitle": "Chiang Mai Jazz City: Where ancient melodies meet global rhythms. An innovative project to elevate Lanna and ethnic music to the world stage through the creative language of jazz.",
        "menu_links": ["Festival", "Event", "Booking", "Artists", "Network", "Courses", "CMSJ Big Band", "Forum", "Store"],

        "card1_title": "Festival<br>& Event",
        "card1_desc": "Experience the vibrant energy of Lanna-Jazz fusion live on stage. Discover our seasonal music festivals, see the event calendar, and book your tickets.",
        "card2_title": "Musician<br>Network",
        "card2_desc": "Explore our roster of talented local and international artists. Read their biographies, listen to their music, and discover the faces behind the innovative Lanna-Jazz sound.",
        "card3_title": "Courses<br>Library",
        "card3_desc": "Unlock your potential with our groundbreaking curriculum. Learn to blend traditional Lanna instruments with jazz theory through our modular online courses.",
        "card4_title": "CMSJ<br>Bigband",
        "card4_desc": "Meet Chiang Mai's one-and-only big band. As our flagship ensemble, we fuse the soul of Lanna music with the power of a modern jazz orchestra.",
        "card5_title": "Forum<br>Q&A",
        "card5_desc": "Join the conversation in our online community. This is a space for artists, students, and music lovers to ask questions and share knowledge.",
        "card6_title": "Store<br>& Merch",
        "card6_desc": "Take a piece of the festival home with you. Browse our exclusive collection of apparel, albums, and unique merchandise.",
        
        "fest_main_title": "Festival<br>& Event",
        "fest_main_desc": "Experience the vibrant energy of Lanna-Jazz fusion live on stage. Discover our seasonal music festivals, see the event calendar, and book your tickets to the heart of Chiang Mai's creative music scene.",
        "artist_main_title": "Artists<br>Library",
        "artist_main_desc": "Explore the \"Digital Portfolio\" of musicians in our network. Discover the talented artists shaping the unique sound of Chiang Mai, listen to their work, and connect with collaborators for your next project.",
        "artist_cat1_title": "Artists<br>Library",
        "artist_cat1_desc": "Discover the talented musicians driving Chiang Mai's jazz scene in our digital library.",
        "artist_cat2_title": "Jazz<br>Network",
        "artist_cat2_desc": "Searching our Jazz partner in Chiang Mai and out partners all over the world.",
        "artist_lib_title": "Artists<br>Library",
        "artist_lib_desc": "Explore the \"Digital Portfolio\" of musicians in our network. Discover the talented artists shaping the unique sound of Chiang Mai, listen to their work, and connect with collaborators for your next project.",
        "jazz_net_title": "Jazz<br>Network",
        "jazz_net_desc": "Searching for Jazz partners in Chiang Mai and all over the world. Connect with venues, organizers, and communities.",
        "course_main_title": "Courses<br>Library",
        "course_main_desc": "Unlock your potential with our groundbreaking curriculum. Learn to blend traditional Lanna instruments with jazz theory through our modular online courses.",
        "bigband_main_title": "CMSJ<br>Bigband",
        "bigband_main_desc": "Meet Chiang Mai's flagship ensemble. We fuse the soul of Lanna music with the power of a modern jazz orchestra.",
        "forum_main_title": "Forum<br>Q&A",
        "forum_main_desc": "Join the conversation in our online community. This is a space for artists, students, and music lovers to ask questions, share knowledge, and build connections.",
        "store_main_title": "Store<br>& Merch",
        "store_main_desc": "Take a piece of the festival home with you. Browse our exclusive collection of apparel, albums, and unique merchandise.",

        "bb_name": "CMSJ Bigband",
        "bb_subtitle": "Chiang Mai Jazz City",
        "bb_founded": "Founded: 2024 | Chiang Mai, Thailand",
        "bb_desc1": "The CMSJ Bigband is our flagship ensemble fusing the soul of Lanna music with the power of a modern jazz orchestra.",
        "bb_desc2": "Conceived to be a musical ambassador for the city of Chiang Mai, its core mission is to provide a stage for the incredible local talent of our city and to spark inspiration in the next generation of musicians.",
        "bigband_link_title": "About us<br>Bigband &#8594;",
        "bigband_p1": "While the CMSJ Bigband was officially established in 2024, the vision for this project was born and nurtured for many years prior. The band was conceived to be a musical ambassador for the city of Chiang Mai. Its core mission is to provide a stage for the incredible local talent of our city and to spark inspiration in the next generation of musicians. It stands as a testament to the idea that by working together, we can achieve extraordinary projects and reach new creative heights.",
        "bigband_p2": "As we look to the future, the Bigband plans to expand its repertoire, collaborating with both local artists and international jazz musicians. We believe that music is a universal language, and through our performances, we aim to connect the rich cultural heritage of Northern Thailand with the global jazz community.",
        "store_overlay_title": "Coming<br>Soon",
        "store_overlay_desc": "Our exclusive merchandise is on its way.",
        
        "forum_sub_title": "Community Forum",
        "forum_sub_desc": "Ask questions, share knowledge, and connect with the Lanna-Jazz community.",
        "footer_copy": "&copy; 2026 Chiang Mai Jazz City. All Rights Reserved.",

        // 🌟 เพิ่มหมวดหมู่ 6. Forum UI Translations (EN)
        "forum_input_title": "Topic Title...",
        "forum_input_content": "Write your details here....",
        "forum_btn_post": "Post",
        "forum_btn_photo": "+ Photo",
        "forum_btn_video": "+ Video",
        "forum_btn_back": "Back to Topics",
        "forum_btn_write_comment": "Write a comment",
        "forum_title_comments": "Comments",
        "forum_input_comment": "Type your comment here...",
        "forum_btn_cancel": "Cancel",
        "forum_btn_reply": "Post Reply",
        "forum_no_topics": "No topics yet. Be the first to start a conversation!",
        "forum_no_comments": "No comments yet. Be the first to reply!",
        "forum_posted_by": "by",
        "forum_has_media": "Media",
        "forum_btn_edit": "Edit",
        "forum_btn_delete": "Delete",
        "forum_edit_save": "Save Changes",
        "forum_edit_cancel": "Cancel"
    },
    th: {
        // ... (โค้ดเดิม 1-4) ...
        "nav_book": "จองบัตร",
        "nav_login": "เข้าสู่ระบบ",
        "search_placeholder": "วันนี้คุณกำลังค้นหาอะไรอยู่?",
        "hero_title": "จิตวิญญาณแห่งล้านนา<br>ผสานท่วงทำนองดนตรีแจ๊ส",
        "hero_learn_more": "ทำความรู้จักเรา",
        "hero_subtitle": "เชียงใหม่เมืองแห่งดนตรีแจ๊ส: จุดบรรจบของท่วงทำนองดั้งเดิมและจังหวะระดับสากล โปรเจกต์ที่ตั้งใจพาดนตรีล้านนาและชาติพันธุ์สู่เวทีโลก ผ่านภาษาที่สร้างสรรค์ของดนตรีแจ๊ส",
        "menu_links": ["เทศกาลดนตรี", "ตารางกิจกรรม", "จองบัตร", "ศิลปิน", "คอมมูนิตี้", "คอร์สเรียน", "วงบิ๊กแบนด์", "กระดานพูดคุย", "ร้านค้า"],

        "card1_title": "เทศกาล<br>& อีเวนต์",
        "card1_desc": "สัมผัสพลังของการแสดงสดที่ผสานดนตรีล้านนาและแจ๊สเข้าด้วยกัน อัปเดตเทศกาลดนตรี เช็คตารางงาน และจองบัตรได้เลย",
        "card2_title": "แหล่งรวม<br>ศิลปิน",
        "card2_desc": "ทำความรู้จักกับเหล่าศิลปินและนักดนตรีมากพรสวรรค์ อ่านประวัติ ฟังผลงาน และค้นหาแรงบันดาลใจเบื้องหลังซาวด์ล้านนา-แจ๊สสุดล้ำ",
        "card3_title": "คอร์สเรียน<br>ดนตรี",
        "card3_desc": "อัปสกิลดนตรีของคุณให้สุด! เรียนรู้วิธีจับเครื่องดนตรีพื้นบ้านล้านนามาเล่นคู่กับทฤษฎีแจ๊ส ผ่านคอร์สเรียนออนไลน์ของเรา",
        "card4_title": "CMSJ<br>บิ๊กแบนด์",
        "card4_desc": "พบกับบิ๊กแบนด์หนึ่งเดียวของเชียงใหม่ วงดนตรีหลักของเราที่จับเอาวิญญาณล้านนามาชนกับพลังของแจ๊สออร์เคสตราสมัยใหม่",
        "card5_title": "คอมมูนิตี้<br>พูดคุย",
        "card5_desc": "เข้ามาจอยพื้นที่พูดคุยออนไลน์ของเรา! แหล่งรวมตัวของศิลปิน นักศึกษา และคนรักดนตรี ไว้ถามตอบและแชร์ความรู้กัน",
        "card6_title": "ร้านค้า<br>& สินค้า",
        "card6_desc": "เก็บความทรงจำจากเทศกาลกลับบ้าน แวะช้อปเสื้อผ้า อัลบั้มเพลง และของที่ระลึกสุดเอ็กซ์คลูซีฟของเรา",

        "fest_main_title": "เทศกาล<br>& อีเวนต์",
        "fest_main_desc": "มาสนุกกับพลังของการแสดงสดที่ผสานล้านนากับแจ๊สไว้ด้วยกัน อัปเดตเทศกาลดนตรี เช็คตารางงาน และจองบัตรเข้าสู่ใจกลางซีนดนตรีของเชียงใหม่",
        "artist_main_title": "พอร์ตโฟลิโอ<br>ศิลปิน",
        "artist_main_desc": "เปิดวาร์ปแฟ้มผลงานของเหล่านักดนตรี ทำความรู้จักศิลปินตัวตึงที่ช่วยสร้างซาวด์อันเป็นเอกลักษณ์ให้เชียงใหม่ ลองฟังผลงาน และหาคอนเนคชันสำหรับโปรเจกต์ใหม่ๆ ของคุณได้เลย",
        "artist_cat1_title": "พอร์ตโฟลิโอ<br>ศิลปิน",
        "artist_cat1_desc": "ตามหาศิลปินเจ๋งๆ ที่เป็นกำลังขับเคลื่อนซีนดนตรีแจ๊สของเชียงใหม่ได้ที่นี่",
        "artist_cat2_title": "แจ๊ส<br>คอมมูนิตี้",
        "artist_cat2_desc": "ค้นหาพาร์ทเนอร์สายแจ๊ส ทั้งในเชียงใหม่และแก๊งนักดนตรีจากทั่วทุกมุมโลก",
        "artist_lib_title": "พอร์ตโฟลิโอ<br>ศิลปิน",
        "artist_lib_desc": "เปิดวาร์ปแฟ้มผลงานของเหล่านักดนตรี ทำความรู้จักศิลปินตัวตึงที่ช่วยสร้างซาวด์อันเป็นเอกลักษณ์ให้เชียงใหม่ ลองฟังผลงาน และหาคอนเนคชันสำหรับโปรเจกต์ใหม่ๆ ของคุณได้เลย",
        "jazz_net_title": "แจ๊ส<br>คอมมูนิตี้",
        "jazz_net_desc": "ค้นหาพาร์ทเนอร์สายแจ๊ส ทั้งในเชียงใหม่และแก๊งนักดนตรีจากทั่วทุกมุมโลก เข้ามาคอนเนคกับสถานที่จัดงาน ผู้จัด และกลุ่มคนรักดนตรีได้เลย",
        "course_main_title": "คอร์สเรียน<br>ดนตรี",
        "course_main_desc": "อัปสกิลดนตรีของคุณให้สุด! เรียนรู้วิธีจับเครื่องดนตรีพื้นบ้านล้านนามาเล่นคู่กับทฤษฎีแจ๊ส ผ่านคอร์สเรียนออนไลน์ของเรา",
        "bigband_main_title": "CMSJ<br>บิ๊กแบนด์",
        "bigband_main_desc": "พบกับบิ๊กแบนด์ตัวตึงของเชียงใหม่ วงดนตรีที่จับเอาวิญญาณล้านนามาชนกับความขลังของแจ๊สออร์เคสตรา",
        "forum_main_title": "คอมมูนิตี้<br>พูดคุย",
        "forum_main_desc": "เข้ามาจอยพื้นที่พูดคุยออนไลน์ของเรา! แหล่งรวมตัวของศิลปิน นักศึกษา และคนรักดนตรี ไว้ถามตอบ แชร์ความรู้ และเมคเฟรนด์ไปด้วยกัน",
        "store_main_title": "ร้านค้า<br>& สินค้า",
        "store_main_desc": "เก็บความทรงจำจากเทศกาลกลับบ้าน แวะช้อปเสื้อผ้า อัลบั้มเพลง และของที่ระลึกสุดพิเศษของเรา",

        "bb_name": "เชียงใหม่แจ๊สบิ๊กแบนด์",
        "bb_subtitle": "โปรเจกต์เชียงใหม่เมืองแห่งดนตรีแจ๊ส",
        "bb_founded": "ก่อตั้งเมื่อ: ปี 2024 | เชียงใหม่, ประเทศไทย",
        "bb_desc1": "CMSJ Bigband คือวงดนตรีหลักของเรา ที่นำเอาวิญญาณของล้านนามาผสมผสานกับพลังของวงแจ๊สสมัยใหม่",
        "bb_desc2": "วงนี้ตั้งใจให้เป็นตัวแทนทางดนตรีของชาวเชียงใหม่ เพื่อเปิดเวทีให้คนเก่งๆ ในพื้นที่ได้ปล่อยของ และช่วยจุดประกายแรงบันดาลใจให้นักดนตรีรุ่นใหม่ๆ",
        "bigband_link_title": "ความเป็นมา<br>วงบิ๊กแบนด์ของเรา &#8594;",
        "bigband_p1": "จุดเริ่มต้นของ CMSJ Bigband เกิดขึ้นในปี 2024 ด้วยแพสชันที่อยากให้วงนี้เป็นเหมือนตัวแทนของชาวเชียงใหม่ มิชชันหลักของเราคือการเปิดสเตจให้ศิลปินโลคอลได้มาปล่อยของแบบสุดเหวี่ยง และส่งต่อแรงบันดาลใจให้นักดนตรีรุ่นใหม่ๆ นี่คือโปรเจกต์ที่พรูฟให้เห็นว่า ถ้าพวกเรารวมพลังกัน งานเจ๋งๆ ก็เกิดขึ้นได้เสมอ",
        "bigband_p2": "แพลนในอนาคต บิ๊กแบนด์เราเตรียมขยายเพลย์ลิสต์ให้เดือดขึ้นไปอีก รอดูการคอลแลปส์กับศิลปินทั้งในพื้นที่และระดับอินเตอร์ได้เลย เพราะเราเชื่อว่าดนตรีคือภาษาสากล และเราตั้งใจเต็มที่ที่จะเอาสไตล์ล้านนาคูลๆ ไปทักทายกับคอมมูนิตี้แจ๊สทั่วโลก",
        "store_overlay_title": "เร็วๆ<br>นี้",
        "store_overlay_desc": "สินค้าสุดเอ็กซ์คลูซีฟของเรากำลังเดินทางมา รอติดตามได้เลย!",
        "forum_sub_title": "กระทู้พูดคุย",
        "forum_sub_desc": "มีข้อสงสัย หรืออยากแชร์เรื่องราวดีๆ เชิญตั้งกระทู้ได้เลย!",
        "footer_copy": "&copy; 2026 Chiang Mai Jazz City. สงวนลิขสิทธิ์",

        // 🌟 เพิ่มหมวดหมู่ 6. Forum UI Translations (TH) (สไตล์ชิลๆ)
        "forum_input_title": "หัวข้อกระทู้ / อยากคุยเรื่องอะไร...",
        "forum_input_content": "พิมพ์รายละเอียดตรงนี้เลย...",
        "forum_btn_post": "โพสต์เลย!",
        "forum_btn_photo": "+ รูปภาพ",
        "forum_btn_video": "+ วิดีโอ",
        "forum_btn_back": "กลับหน้าแรก",
        "forum_btn_write_comment": "แสดงความคิดเห็น",
        "forum_title_comments": "คอมเมนต์",
        "forum_input_comment": "พิมพ์คอมเมนต์ของคุณที่นี่...",
        "forum_btn_cancel": "ยกเลิก",
        "forum_btn_reply": "ส่งคอมเมนต์",
        "forum_no_topics": "ยังไม่มีใครตั้งกระทู้เลย มาเริ่มตั้งคนแรกกันเถอะ!",
        "forum_no_comments": "ยังไม่มีคอมเมนต์ มาเมนท์คนแรกกัน!",
        "forum_posted_by": "โพสต์โดย",
        "forum_has_media": "มีรูป/คลิป",
        "forum_btn_edit": "แก้ไข",
        "forum_btn_delete": "ลบทิ้ง",
        "forum_edit_save": "บันทึกการแก้ไข",
        "forum_edit_cancel": "ยกเลิก"
    }
};

// ... (ส่วนที่เหลือของไฟล์ปล่อยไว้เหมือนเดิมครับ) ...
window.translateUI = function(root = document) {
    const t = siteTranslations[window.currentLang];
    if(!t) return;
    
    let container = document;
    if (root && typeof root.querySelectorAll === 'function') {
        container = root;
    }

    if (container === document) {
        const btnBook = document.querySelector('nav button:first-child');
        if (btnBook && t.nav_book) btnBook.innerHTML = t.nav_book;
        
        const btnLogin = document.getElementById('header-auth-btn');
        if (btnLogin && !window.isUserLoggedIn && t.nav_login) btnLogin.innerHTML = t.nav_login;

        const searchInput = document.querySelector('header input[type="text"]');
        if (searchInput && t.search_placeholder) searchInput.placeholder = t.search_placeholder;

        const heroLearnMore = document.querySelector('a.inline-flex.items-center.gap-3');
        if (heroLearnMore && t.hero_learn_more) {
            heroLearnMore.innerHTML = `${t.hero_learn_more} <div class="w-8 h-8 rounded-full border border-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></div>`;
        }

        const mobileMenuLinks = document.querySelectorAll('#menu-panel ul li a');
        const footerMenuLinks = document.querySelectorAll('footer nav a');
        if (t.menu_links) {
            mobileMenuLinks.forEach((link, index) => { if (t.menu_links[index]) link.textContent = t.menu_links[index]; });
            footerMenuLinks.forEach((link, index) => { if (t.menu_links[index]) link.textContent = t.menu_links[index]; });
        }

        const copyrightText = document.querySelector('footer .text-center.text-gray-600 p');
        if (copyrightText && t.footer_copy) copyrightText.innerHTML = t.footer_copy;
    }

    const dynamicElements = container.querySelectorAll('[id^="dyn-"]');
    dynamicElements.forEach(el => {
        let rawKey = el.id.replace('dyn-', ''); 
        let key = rawKey;
        
        if (!t[key] && key.includes('_')) {
            key = key.replace(/_[^_]+$/, ''); 
        }

        if (t[key]) {
            // เช็คว่าถ้าเป็น input/textarea ให้เปลี่ยน placeholder แทน
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = t[key];
            } else {
                // สำหรับ div/button อื่นๆ ปกติจะดึงไอคอนเก่ามาแปะด้วย (ถ้ามี)
                const existingIcon = el.querySelector('svg');
                if (existingIcon) {
                    el.innerHTML = '';
                    el.appendChild(existingIcon);
                    el.appendChild(document.createTextNode(' ' + t[key]));
                } else {
                    el.innerHTML = t[key];
                }
            }
        }
    });
};

const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
                if (node.id && node.id.startsWith('dyn-')) {
                    translateUI(node.parentElement || document);
                } else if (node.querySelector && node.querySelector('[id^="dyn-"]')) {
                    translateUI(node);
                }
            }
        });
    });
});
observer.observe(document.body, { childList: true, subtree: true });

window.switchFrontLang = function(btn, lang) {
    if(window.currentLang === lang) return; 
    localStorage.setItem('siteLang', lang); 
    window.location.reload(); 
};

document.addEventListener('DOMContentLoaded', () => {
    const langBtns = document.querySelectorAll('.front-lang-btn');
    langBtns.forEach(b => {
        const btnLang = b.textContent.trim().toLowerCase();
        if (btnLang === window.currentLang) {
            b.classList.remove('text-gray-400');
            b.classList.add('text-[#ef5f4d]', 'border-b-2', 'border-[#ef5f4d]');
        } else {
            b.classList.add('text-gray-400');
            b.classList.remove('text-[#ef5f4d]', 'border-b-2', 'border-[#ef5f4d]');
        }
    });
});