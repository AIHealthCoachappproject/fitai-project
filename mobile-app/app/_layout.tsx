import React from 'react';
import { Stack } from 'expo-router';
import "./global.css";

export default function RootLayout() {
  return (
    <Stack>
      {/* 1. หน้าแรก (ต้องมีไฟล์ app/index.tsx) */}
      <Stack.Screen
        name="index"
        options={{ title: 'Home', headerShown: false }}
      />

      

      {/* 4. หน้า Tabs (ถ้าคุณใช้โฟลเดอร์ (tabs)) */}
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}