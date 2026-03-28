import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* 1. หน้าแรก (ต้องมีไฟล์ app/index.tsx) */}
      <Stack.Screen
        name="index"
        options={{ title: 'Home', headerShown: false }}
      />

      {/* 2. หน้า Login (ต้องตรงกับโฟลเดอร์ app/auth/Login.tsx) */}
      {/* ให้แก้ name เป็น "auth/Login" */}
      <Stack.Screen
        name="auth/Login" 
        options={{
          title: 'Login',
          presentation: 'modal',
          headerShown: true,
        }}
      />

      {/* 3. หน้า Register (app/auth/Register.tsx) */}
      <Stack.Screen
        name="auth/Register"
        options={{ title: 'Register' }}
      />

      {/* 4. หน้า Tabs (ถ้าคุณใช้โฟลเดอร์ (tabs)) */}
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}