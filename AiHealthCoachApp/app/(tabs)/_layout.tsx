import { Tabs } from 'expo-router';
import CustomTabBar from '@/components/ui/CustomTabBar';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="AiWorkoutCoach" />
      <Tabs.Screen name="TrackProgress" />
      <Tabs.Screen name="AIHealthCoachChat" />
      <Tabs.Screen name="Profile" options={{ href: null }} />
      <Tabs.Screen name="DailyPlanDetail" options={{ href: null }} />
    </Tabs>
  );
}