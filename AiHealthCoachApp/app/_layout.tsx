import React from "react";
import { Stack } from "expo-router";
import "./global.css";
import { ProfileProvider } from "@/context/ProfileContext";

export default function RootLayout() {
  return (
    <ProfileProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* หน้า index หลัก */}
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)/SetUpYourHealthProfile" />
        
        {/* บอก Stack ว่ามีกลุ่มหน้าในโฟลเดอร์ auth */}
        <Stack.Screen name="(auth)/Register" />
        <Stack.Screen name="(auth)/Login" />
      </Stack>
    </ProfileProvider>
  );
}