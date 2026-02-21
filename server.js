const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // ใช้สำหรับอนุญาตให้เว็บเราเรียก API ได้

const app = express();
const port = 3000; // พอร์ตสำหรับรันเซิร์ฟเวอร์

app.use(cors()); // อนุญาตการเชื่อมต่อ
app.use(bodyParser.json()); // ให้ Express อ่าน JSON body ได้

// --- นี่คือ "แม่กุญแจ" ที่รอรับข้อมูลที่ /api/login ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    console.log('Login attempt:', username);

    // --- ส่วนตรวจสอบข้อมูลจริง (ต้องไปดึงจาก Database) ---
    // (นี่เป็นแค่ตัวอย่าง ไม่ปลอดภัย ห้ามใช้จริง)
    // ในระบบจริง คุณต้อง:
    // 1. Query หา username จาก Database
    // 2. ใช้ bcrypt.compare(password, user.password_hash) เพื่อเทียบรหัสผ่าน
    
    if (username === 'admin' && password === '1234') {
        // 3. ถ้าสำเร็จ: สร้าง Token (JWT)
        const token = 'fake-jwt-token-for-admin'; // ในระบบจริงต้องสร้าง JWT Token
        
        res.status(200).json({ 
            message: 'Login successful!',
            token: token,
            role: 'admin' 
        });

    } else if (username === 'user' && password === '123') {
         const token = 'fake-jwt-token-for-user';
         res.status(200).json({ 
            message: 'Login successful!',
            token: token,
            role: 'user' 
        });

    } else {
        // 4. ถ้าไม่สำเร็จ: ส่ง Error กลับไป
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});