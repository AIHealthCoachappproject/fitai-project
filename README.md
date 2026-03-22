# AI Health Coach App
แอปโค้ชสุขภาพด้วย AI 

## Features
- แชทกับ AI Health Coach
- แผนอาหารส่วนตัว
- ติดตามการออกกำลังกาย
- มีคลิปเเนะนำการออกกำลังกาย
  

## Team
- คนที่ 1 — UI/UX Design
- คนที่ 2 — AI & Development

สิ่งที่ต้องทำทั้งหมด font
Mobile App (8 หน้า)

login,signin 
/ Health Profile setup
/Choose Body Goal
/Loading screen
/Today Health Status
/AI Workout Coach
/Track Progress
/AI Health Coach Chat

Web Admin Dashboard

Dashboard + Analytics
Users / Content / AI Coach management
Revenue + Notifications + Settings

ข้อมูล

Name: users
Columns:
- id          (uuid, primary key) ← มีให้อัตโนมัติ
- email       (text)
- name        (text)
- goal        (text)  ← weight_loss / muscle_gain / toned / lifestyle
- weight      (float)
- plan        (text)  ← free / pro
- created_at  (timestamp) ← มีให้อัตโนมัติ

Name: workouts
Columns:
- id          (uuid, primary key)
- user_id     (uuid) ← foreign key → users.id
- title       (text)
- duration    (int)
- completed   (bool)
- created_at  (timestamp)

Name: ai_chats
Columns:
- id          (uuid, primary key)
- user_id     (uuid) ← foreign key → users.id
- message     (text)
- role        (text) ← user / assistant
- created_at  (timestamp)