import React from "react";
import { Stack, useSegments, Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import "./global.css";
import { ProfileProvider } from "@/context/ProfileContext";
import { AuthProvider, useAuthContext } from "@/context/AuthContext";

// Screens outside (tabs) that authenticated+onboarded users may visit freely.
// Add new stack screens here to prevent the auth guard from redirecting them.
const AUTHENTICATED_STACK_SCREENS = ["DailyPlanScreen"];

function InitialLayout() {
  const { session, loading, profile } = useAuthContext();
  const segments = useSegments();

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

  const inTabs = segments[0] === "(tabs)";
  const inOnboarding = segments[0] === "(onboarding)";
  const inLoading = segments[0] === "loading";
  const inAuthenticatedStack = AUTHENTICATED_STACK_SCREENS.includes(
    segments[0] ?? ""
  );

  if (!session && (inTabs || inOnboarding || inAuthenticatedStack)) {
    return <Redirect href="/" />;
  }

  if (session && !profile?.onboarding_completed && !inOnboarding) {
    return <Redirect href="/(onboarding)/SetUpYourHealthProfile" />;
  }

  if (
    session &&
    profile?.onboarding_completed &&
    !inTabs &&
    !inLoading &&
    !inOnboarding &&
    !inAuthenticatedStack
  ) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="loading" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="DailyPlanScreen" options={{ animation: "slide_from_right" }} />
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
