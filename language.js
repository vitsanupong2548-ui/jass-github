// ==========================================
// 🌟 ไฟล์จัดการระบบภาษา (Language Manager) 🌟
// ==========================================

// 1. ดึงค่าภาษาปัจจุบันจากเบราว์เซอร์ (ถ้าไม่มีให้ตั้งค่าเริ่มต้นเป็น en)
window.currentLang = localStorage.getItem('siteLang') || 'en'; 

// 2. พจนานุกรมคำแปลทั้งหมดของหน้าเว็บ
const siteTranslations = {
    en: {
        "nav_book": "Book Now",
        "nav_login": "Log in",
        "hero_title": "The Soul of Lanna,<br>The Heart of Jazz",
        "hero_learn_more": "Learn More",
        "hero_desc": "Chiang Mai Jazz City: Where ancient melodies meet global rhythms. An innovative project to elevate Lanna and ethnic music to the world stage through the creative language of jazz.",
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
        
        // --- คำแปลในหน้าต่าง Popup ย่อย ---
        "fest_main_title": "Festival<br>& Event",
        "fest_main_desc": "Experience the vibrant energy of Lanna-Jazz fusion live on stage. Discover our seasonal music festivals, see the event calendar, and book your tickets to the heart of Chiang Mai's creative music scene.",
        "artist_lib_title": "Artists<br>Library",
        "artist_lib_desc": "Explore the \"Digital Portfolio\" of musicians in our network. Discover the talented artists shaping the unique sound of Chiang Mai, listen to their work, and connect with collaborators for your next project.",
        "jazz_net_title": "Jazz<br>Network",
        "jazz_net_desc": "Searching our Jazz partner in Chiang Mai and out partners all over the world. Connect with venues, organizers, and communities.",

        // --- ส่วนที่เพิ่มใหม่สำหรับเนื้อหา Forum และ Store ---
        "forum_main_title": "Forum<br>Q&A",
        "forum_main_desc": "Join the conversation in our online community. This is a space for artists, students, and music lovers to ask questions, share knowledge, and build connections.",
        "forum_sub_title": "Community Forum",
        "forum_sub_desc": "Ask questions, share knowledge, and connect with the Lanna-Jazz community.",
        
        "store_main_title": "Store<br>&Merch",
        "store_main_desc": "Take a piece of the festival home with you. Browse our exclusive collection of apparel, albums, and unique merchandise.",
        "store_overlay_title": "Coming<br>Soon",
        "store_overlay_desc": "Our exclusive merchandise is on its way."
    },
    th: {
        "nav_book": "ซื้อบัตร",
        "nav_login": "เข้าสู่ระบบ",
        "hero_title": "จิตวิญญาณแห่งล้านนา<br>ในจังหวะของดนตรีแจ๊ส",
        "hero_learn_more": "รายละเอียดเพิ่มเติม",
        "hero_desc": "Chiang Mai Jazz City: ที่ซึ่งท่วงทำนองดั้งเดิมมาบรรจบกับจังหวะดนตรีระดับโลก โครงการสร้างสรรค์ที่จะพาดนตรีล้านนาและกลุ่มชาติพันธุ์ก้าวสู่เวทีสากล ผ่านสุนทรียภาพแห่งภาษาแจ๊ส",
        "card1_title": "เทศกาล<br>และอีเวนต์",
        "card1_desc": "สัมผัสพลังการแสดงสดของดนตรีล้านนาผสมผสานแจ๊ส ค้นพบเทศกาลดนตรีตลอดทั้งปี ติดตามปฏิทินกิจกรรม และจองบัตรเข้าชมได้ที่นี่",
        "card2_title": "เครือข่าย<br>นักดนตรี",
        "card2_desc": "ทำความรู้จักกับศิลปินมากความสามารถทั้งในและต่างประเทศ อ่านประวัติ ฟังผลงาน และค้นพบผู้คนเบื้องหลังการสร้างสรรค์เสียงดนตรีล้านนา-แจ๊ส",
        "card3_title": "คลัง<br>คอร์สเรียน",
        "card3_desc": "ปลดล็อกศักยภาพทางดนตรีของคุณด้วยหลักสูตรสุดพิเศษ เรียนรู้วิธีผสมผสานเครื่องดนตรีล้านนากับทฤษฎีดนตรีแจ๊สผ่านคอร์สออนไลน์ของเรา",
        "card4_title": "CMSJ<br>บิ๊กแบนด์",
        "card4_desc": "พบกับวงบิ๊กแบนด์หนึ่งเดียวในเชียงใหม่ วงดนตรีหลักของเราที่ผสมผสานจิตวิญญาณล้านนาเข้ากับพลังของวงออร์เคสตราแจ๊สสมัยใหม่อย่างลงตัว",
        "card5_title": "ชุมชน<br>ถาม-ตอบ",
        "card5_desc": "ร่วมพูดคุยในชุมชนออนไลน์ของเรา พื้นที่สำหรับศิลปิน นักเรียน และผู้รักเสียงดนตรี ที่จะมาตั้งคำถามและแลกเปลี่ยนความรู้ซึ่งกันและกัน",
        "card6_title": "ร้านค้า<br>ของที่ระลึก",
        "card6_desc": "เก็บความประทับใจจากเทศกาลกลับบ้าน เลือกชมคอลเล็กชันเสื้อผ้า อัลบั้มเพลง และสินค้าที่ระลึกสุดพิเศษจากเรา",

        // --- คำแปลในหน้าต่าง Popup ย่อย ---
        "fest_main_title": "เทศกาล<br>และอีเวนต์",
        "fest_main_desc": "สัมผัสพลังแห่งการแสดงสดที่ผสมผสานดนตรีล้านนาเข้ากับแจ๊สได้อย่างลงตัว ค้นพบเทศกาลดนตรีตลอดฤดูกาลของเรา ตรวจสอบปฏิทินกิจกรรม และจองบัตรเข้าชมใจกลางซีนดนตรีสุดสร้างสรรค์ของเมืองเชียงใหม่",
        "artist_lib_title": "คลัง<br>ศิลปิน",
        "artist_lib_desc": "สำรวจ \"แฟ้มสะสมผลงานดิจิทัล\" ของนักดนตรีในเครือข่ายของเรา ค้นพบศิลปินมากพรสวรรค์ที่ร่วมสร้างสรรค์เสียงดนตรีอันเป็นเอกลักษณ์ของเชียงใหม่ ฟังผลงานของพวกเขา และเชื่อมต่อเพื่อร่วมงานในโปรเจกต์ต่อไปของคุณ",
        "jazz_net_title": "เครือข่าย<br>แจ๊ส",
        "jazz_net_desc": "ค้นหาพาร์ทเนอร์วงการแจ๊สของเราในเชียงใหม่และพาร์ทเนอร์ทั่วโลก เชื่อมต่อกับสถานที่จัดงาน ผู้จัดงาน และคอมมูนิตี้ต่างๆ",

        // --- ส่วนที่เพิ่มใหม่สำหรับเนื้อหา Forum และ Store ---
        "forum_main_title": "ฟอรั่ม<br>ถาม-ตอบ",
        "forum_main_desc": "ร่วมพูดคุยในชุมชนออนไลน์ของเรา พื้นที่สำหรับศิลปิน นักเรียน และผู้รักเสียงดนตรี เพื่อตั้งคำถาม แบ่งปันความรู้ และสร้างเครือข่าย",
        "forum_sub_title": "คอมมูนิตี้ฟอรั่ม",
        "forum_sub_desc": "ตั้งคำถาม แชร์ความรู้ และเชื่อมต่อกับชุมชนล้านนา-แจ๊ส",
        
        "store_main_title": "ร้านค้า<br>ของที่ระลึก",
        "store_main_desc": "เก็บความประทับใจกลับบ้านไปกับคุณ เลือกชมคอลเล็กชันเสื้อผ้า อัลบั้มเพลง และสินค้าที่ระลึกสุดพิเศษจากเรา",
        "store_overlay_title": "เร็วๆ นี้",
        "store_overlay_desc": "สินค้าที่ระลึกสุดพิเศษของเรากำลังเดินทางมา"
    }
};

// 3. ฟังก์ชันกวาดหา ID ในหน้าเว็บแล้วเปลี่ยนคำ
window.translateUI = function() {
    const t = siteTranslations[window.currentLang];
    if(!t) return;
    
    // แปลปุ่ม Navbar
    const btnBook = document.querySelector('nav button:first-child');
    if (btnBook && t.nav_book) btnBook.innerHTML = t.nav_book;
    
    const btnLogin = document.getElementById('header-auth-btn');
    if (btnLogin && !window.isUserLoggedIn && t.nav_login) btnLogin.innerHTML = t.nav_login;

    // แปล Hero Section (ตรงนี้เราเอา .innerHTML ยัดใส่ไอคอนไปเลย เพราะในตัวแปรมี tag HTML อยู่)
    const heroLearnMore = document.querySelector('a.inline-flex.items-center.gap-3');
    if (heroLearnMore && t.hero_learn_more) {
        heroLearnMore.innerHTML = `${t.hero_learn_more} <div class="w-8 h-8 rounded-full border border-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></div>`;
    }

    // 🌟 กวาดหาทุกๆ tag ที่มี ID ขึ้นต้นด้วยคำว่า "dyn-" บนหน้าเว็บ แล้วแปลภาษา 🌟
    const dynamicElements = document.querySelectorAll('[id^="dyn-"]');
    
    dynamicElements.forEach(el => {
        // ตัดคำว่า 'dyn-' ออกจาก id จะได้เหลือแค่ชื่อ key เช่น 'dyn-forum_main_title' -> 'forum_main_title'
        const key = el.id.replace('dyn-', ''); 
        
        // ถ้าคีย์นี้มีอยู่ใน dictionary ของ siteTranslations ให้เอาไปแทนที่
        if (t[key]) {
            el.innerHTML = t[key];
        }
    });
};

// 4. ฟังก์ชันเมื่อกดปุ่มสลับภาษา
window.switchFrontLang = function(btn, lang) {
    if(window.currentLang === lang) return; 
    localStorage.setItem('siteLang', lang); 
    window.location.reload(); 
};

// 5. ตั้งค่าปุ่มภาษาเมื่อโหลดหน้าเว็บ
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