# 🏋️ FitAI Admin Dashboard

ระบบ Dashboard สำหรับจัดการ FitAI Health Coach - ดูข้อมูลผู้ใช้, การออกกำลัง, แชท AI, และรายได้ได้แบบ Real-time!

---

## 📋 มีฟีเจอร์อะไรบ้าง?

### 📊 Dashboard (หน้าหลัก)
- 📈 จำนวนผู้ใช้ทั้งหมด
- 💎 จำนวนผู้ใช้แบบ Pro
- 🆕 ผู้ใช้ใหม่วันนี้
- 💰 รายได้รายเดือน (MRR)
- 📉 กราฟการสมัครสมาชิก 7 วันที่ผ่านมา
- 🎯 การแบ่งเป้าหมายออกกำลัง (เสริมกล้าม/ลดน้ำหนัก/อื่นๆ)
- 👥 ผู้ใช้ใหม่ 5 คนล่าสุด

### 📈 Analytics (สถิติ)
- 🏃 จำนวนออกกำลังทั้งหมด
- ✅ ออกกำลังเสร็จแล้ว
- 💬 จำนวนข้อความ AI ทั้งหมด
- 📊 กราฟการออกกำลังแต่ละวัน
- 🏆 TOP 5 การออกกำลังที่นิยมสุด

### 👥 Users (ผู้ใช้)
- 📝 ตารางผู้ใช้ทั้งหมด (ชื่อ, อีเมล, เป้าหมาย, น้ำหนัก, แผน, วันที่สมัคร)
- 🔍 ค้นหาจากชื่อ
- 🏷️ กรองตามแผน (Free/Pro)

### 📝 Content (เนื้อหา)
- 🎥 ตารางการออกกำลังทั้งหมด
- ⏱️ ระยะเวลา, สถานะเสร็จ, ผู้ใช้
- 🔘 กรองตามสถานะ (เสร็จ/ยังไม่เสร็จ)

### 🤖 AI Coach (แชท AI)
- 💭 แสดงการสนทนาทั้งหมด (ข้อความผู้ใช้ + คำตอบ AI)
- 👤 ชื่อผู้ใช้, ข้อความ, บทบาท, เวลา
- 🔘 กรองแสดงเฉพาะข้อความผู้ใช้ หรือ คำตอบ AI

### 💵 Revenue (รายได้)
- 💎 จำนวน Pro Subscribers
- 💰 MRR (Monthly Recurring Revenue)
- 📊 กราฟแนวโน้มรายได้ 30 วัน
- 📋 รายชื่อสมาชิก Pro

### 🔔 Notifications (การแจ้งเตือน)
- 📰 กิจกรรมล่าสุด 20 รายการ
- 👤 ผู้สมัครใหม่
- 🏃 ออกกำลังเสร็จแล้ว
- 💬 ข้อความออกมาจาก AI

### ⚙️ Settings (ตั้งค่า)
- 📊 แสดงสถิติฐานข้อมูล
- 🛢️ จำนวนตารางและข้อมูล
- 🟢 สถานะเชื่อมต่อ

---

## 🚀 วิธีเริ่มต้น

### 1. ตั้งค่า Environment Variables
สร้างไฟล์ `.env.local` ในโฟลเดอร์ `web-dashboard/`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key_here
```

### 2. ติดตั้ง Dependencies
```bash
cd web-dashboard
npm install
```

### 3. รัน Development Server
```bash
npm run dev
```
### 4. Build สำหรับ Production
```bash
npm run build
npm start
```

---

## 📁 โครงสร้างไฟล์

```
web-dashboard/
├── app/
│   ├── components/
│   │   ├── Dashboard.tsx          ← หน้าหลัก (จัดการเปลี่ยนหน้า)
│   │   ├── Sidebar.tsx            ← เมนูด้านซ้าย
│   │   ├── StatCard.tsx           ← การ์ดแสดงสถิติ (ใช้ซ้ำได้)
│   │   ├── PageHeader.tsx         ← หัวข้อหน้า (ใช้ซ้ำได้)
│   │   ├── DashboardPage.tsx      ← หน้า Dashboard
│   │   ├── AnalyticsPage.tsx      ← หน้า Analytics
│   │   ├── UsersPage.tsx          ← หน้า Users
│   │   ├── ContentPage.tsx        ← หน้า Content
│   │   ├── AICoachPage.tsx        ← หน้า AI Coach
│   │   ├── RevenuePage.tsx        ← หน้า Revenue
│   │   ├── NotificationsPage.tsx  ← หน้า Notifications
│   │   └── SettingsPage.tsx       ← หน้า Settings
│   ├── layout.tsx                 ← Layout หลัก
│   ├── page.tsx                   ← หน้าแรก
│   └── globals.css                ← Styles
├── lib/
│   └── supabase.ts                ← ตั้งค่าเชื่อมต่อ Supabase
├── package.json
└── tsconfig.json
```

---

## 🔗 ตารางในฐานข้อมูล

### `users` - ข้อมูลผู้ใช้
```
id (UUID) → รหัสผู้ใช้
email (Text) → อีเมล
name (Text) → ชื่อ
goal (Text) → เป้าหมาย (weight_loss / muscle_gain / toned / lifestyle)
weight (Float) → น้ำหนัก (กก.)
plan (Text) → แผน (free / pro)
created_at (Timestamp) → วันที่สมัคร
```

### `workouts` - ข้อมูลการออกกำลัง
```
id (UUID) → รหัสการออกกำลัง
user_id (UUID) → รหัสผู้ใช้
title (Text) → ชื่อแบบฝึกหัด
duration (Int) → ระยะเวลา (นาที)
completed (Bool) → เสร็จแล้ว? (true/false)
created_at (Timestamp) → วันที่ออกกำลัง
```

### `ai_chats` - ข้อมูลแชท AI
```
id (UUID) → รหัสแชท
user_id (UUID) → รหัสผู้ใช้
message (Text) → ข้อความ
role (Text) → บทบาท (user / assistant)
created_at (Timestamp) → เวลาส่ง
```

---

## 🎨 ดีไซน์

- **สีพื้นหลัง**: `#0f0f0f` (ดำเข้ม)
- **สีการ์ด**: `#1a1a1a` (ดำ)
- **สีเน้น**: `#22c55e` (เขียวสดใส)
- **ธีม**: Dark Mode 🌙

---

## 💡 วิธีใช้

### 1. เปลี่ยนหน้า
คลิกเมนูด้านซ้ายเพื่อเปลี่ยนไปหน้าต่างๆ

### 2. ค้นหาแบบ Filter
- ที่หน้า "Users" - ค้นหาชื่อ หรือกรองตามแผน
- ที่หน้า "Content" - กรองตามสถานะเสร็จ/ยังไม่เสร็จ
- ที่หน้า "AI Coach" - กรองข้อความผู้ใช้ หรือ คำตอบ AI

### 3. ดูสถิติ
มีข้อมูลสถิติปรากฏที่:
- Dashboard - สรุปย่อ
- Analytics - รายละเอียดเพิ่มเติม
- Revenue - สถิติรายได้
- Settings - แสดงขนาดฐานข้อมูล

---

## 🛠️ Technologies Used

| เทคโนโลยี | ใช้สำหรับ |
|-----------|----------|
| **Next.js 16** | Web Framework |
| **React 19** | UI Components |
| **TypeScript** | Type Safety |
| **Tailwind CSS** | Styling |
| **Supabase** | Database & API |
| **Recharts** | Charts & Graphs |
| **Lucide Icons** | Icons |

---

## 📊 ข้อมูล Real-time

- ไม่มีข้อมูลปลอม (Mock Data) ❌
- ข้อมูลทั้งหมดดึงจากฐานข้อมูล Supabase ✅
- อัปเดตตามเวลาจริง ✅
- ใช้ `useEffect` + `useState` สำหรับการดึงข้อมูล ✅

---

## ✨ Features พิเศษ

✅ **Loading Spinner** - แสดงขณะดึงข้อมูล  
✅ **Error Handling** - แสดงข้อความขอโทษถ้ามีข้อผิดพลาด  
✅ **Format ตัวเลข** - ใช้ `toLocaleString()` สำหรับแสดงหลักพัน  
✅ **Format วันที่** - ใช้ Thai Locale ตามที่กำหนด  
✅ **Active State** - เมนูบอกว่าเรากำลังอยู่หน้าไหน  
✅ **Reusable Components** - StatCard และ PageHeader ใช้ซ้ำในหลายหน้า

---

## 🐛 Troubleshooting

### ❌ ดึงข้อมูล Error
```
Error: Cannot connect to database
```
**วิธีแก้**: ตรวจสอบ `.env.local` ว่ากำหนด URL และ Key ถูกต้อง

### ❌ Loading ไม่หายไป
**วิธีแก้**: ตรวจสอบ Network ว่าเชื่อมต่อฐานข้อมูลได้

### ❌ Icons ไม่แสดง
**วิธีแก้**: ตรวจสอบว่า `lucide-react` ติดตั้งแล้ว
```bash
npm install lucide-react
```

---

## 📝 Notes

- ทุกหน้าดึงข้อมูลแยกกัน (Independent Fetching)
- สามารถเพิ่ม/แก้ไข/ลบหน้าได้ง่าย
- โค้ดมีความยืดหยุ่นและไม่ผูกติดกัน (Loosely Coupled)
- ดีบักง่ายด้วย TypeScript ✅

---

## 🎯 ขั้นต่อไป (Future Improvements)

- [ ] เพิ่มระบบ Authentication (Login)
- [ ] Export ข้อมูลเป็น CSV/PDF
- [ ] เพิ่มคำเตือนเมื่อตัวเลขเปลี่ยนแปลง
- [ ] Dark/Light Mode Toggle
- [ ] Real-time Notifications ด้วย WebSocket
- [ ] Pagination สำหรับตารางขนาดใหญ่


