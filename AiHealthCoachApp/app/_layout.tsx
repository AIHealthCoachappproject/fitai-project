import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import "./global.css";
import { ProfileProvider } from "@/context/ProfileContext";
import { AuthProvider, useAuthContext } from "@/context/AuthContext";

function InitialLayout() {
  const { session, loading, profile } = useAuthContext();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;
    if (session && !profile) return; // profile fetch in-flight — wait

    const inTabs = segments[0] === "(tabs)";
    const inOnboarding = segments[0] === "(onboarding)";
    const inLoading = segments[0] === "loading";

    if (!session) {
      if (inTabs || inOnboarding) router.replace("/");
      return;
    }

    if (!profile?.onboarding_completed) {
      if (!inOnboarding) router.replace("/(onboarding)/SetUpYourHealthProfile");
    } else {
      if (!inTabs && !inLoading) router.replace("/(tabs)");
    }
  }, [session, loading, profile, segments]);

  if (loading || (session && !profile)) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#39FF14" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="loading" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(onboarding)/SetUpYourHealthProfile" />
      <Stack.Screen name="(onboarding)/ChooseYourBodyGoal" />
      <Stack.Screen name="(auth)/Register" />
      <Stack.Screen name="(auth)/Login" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <InitialLayout />
      </ProfileProvider>
    </AuthProvider>
  );
}
