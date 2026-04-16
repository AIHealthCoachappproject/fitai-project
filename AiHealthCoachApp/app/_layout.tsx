import React from "react";
import { Stack } from "expo-router";
import "./global.css";
import { ProfileProvider } from "@/context/ProfileContext";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(onboarding)/SetUpYourHealthProfile" />
          <Stack.Screen name="(auth)/Register" />
          <Stack.Screen name="(auth)/Login" />
        </Stack>
      </ProfileProvider>
    </AuthProvider>
  );
}