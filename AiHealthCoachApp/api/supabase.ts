import { createClient } from '@supabase/supabase-js';

// 1. ไปขอค่า 2 ตัวนี้จากเพื่อนที่ทำ Backend มาใส่ครับ
const supabaseUrl = 'https://xxxxxxx.supabase.co'; // Project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Anon Key

// 2. สร้างตัว Client สำหรับเรียกใช้ทั่วแอป
export const supabase = createClient(supabaseUrl, supabaseAnonKey);