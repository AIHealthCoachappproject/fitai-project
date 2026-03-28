// constants/theme.ts

const neonGreen = '#39FF14'; // สีหลัก
const deepBlack = '#0A0A0A'; // พื้นหลังหลังที่มืดกว่าเดิมเล็กน้อย (จะช่วยให้สีเขียวลอยออกมา)
const surfaceGray = '#161616'; // สำหรับพื้นหลัง Input หรือ Card

export const Colors = {
  light: {
    // แนะนำให้ใช้โทนเดียวกันถ้าอยากได้สไตล์นี้ทั้งสองโหมด
    // หรือจะคงค่าเดิมไว้ก็ได้ครับ
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000', // ดำสนิทจะทำให้สีเขียวเด่นมาก
    card: '#000000',       // ปรับให้เท่า background เพื่อให้ Label ลอยเนียนๆ
    input: '#121212',      // สีเทาเข้มมากสำหรับช่อง Input
    tint: '#39FF14',
    primary: '#39FF14',    // สีเขียวนีออน
    border: '#333333',     // สีขอบตอนปกติ
    borderActive: '#39FF14', // สีขอบตอนกด (ถ้ามี)
    buttonText: '#000000', // สำคัญ: ตัวหนังสือบนปุ่มเขียวต้องสีดำถึงจะเหมือนรูป
    secondaryText: '#8E8E93', // สีเทาอ่อนสำหรับข้อความรอง
    placeholder: '#4A4A4A',
    link: neonGreen,          // สำหรับคำว่า "Privacy Policy"
  },
};