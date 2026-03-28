// ไฟล์สำหรับเก็บค่าสีกลางของแอป (Centralized Theme)
export const Colors = {
  neon: {
    green: '#39FF14',        // สีเขียวนีออนหลัก
    greenLow: 'rgba(57, 255, 20, 0.05)', // สีเขียวนีออนจางๆ สำหรับตกแต่ง
    greenMid: 'rgba(57, 255, 20, 0.08)',
  },
  base: {
    black: '#000000',        // ดำสนิท
    darkGray: '#1A1A1A',     // เทาเข้ม (พื้นหลังฟอร์ม)
    cardBlack: '#121212',    // ดำสำหรับช่อง Input
    white: '#FFFFFF',
  },
  text: {
    main: '#FFFFFF',
    sub: '#858597',          // เทาสำหรับตัวหนังสือรอง
    placeholder: '#4A4A4A',
    muted: '#B0B0C3',
  },
  border: {
    default: '#333333',      // สีเส้นขอบทั่วไป
  }
};

export const Fonts = {
  rounded: 'System', // หรือชื่อฟอนต์ที่คุณลงไว้
  mono: 'SpaceMono', // ชื่อฟอนต์มาตรฐานของ Expo
};

export const Theme = {
  colors: Colors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 12,
    lg: 25,
    xl: 30,
  }
  
};