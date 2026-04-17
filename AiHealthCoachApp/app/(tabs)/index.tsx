import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MetricCard from "@/components/dashboard/MetricCard";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { COLORS } from "@/constants/theme";
import { useProfile } from "@/context/ProfileContext";
import EditHealthModal from "@/components/dashboard/EditHealthModal";
import { useWorkoutPlan } from "@/context/WorkoutPlanContext";
import DailyPlanCard from "@/components/dashboard/DailyPlanCard";
import WeeklyGoalCard from "@/components/dashboard/WeeklyGoalCard";

const defaultData = {
  bmi: "21.0",
  bmiStatus: "Normal",
  caloriesIn: 1450,
  calorieGoal: 2000,
};

const getBmiStatus = (bmiValue: number) => {
  if (bmiValue >= 30) return "Obese";
  if (bmiValue >= 25) return "Overweight";
  if (bmiValue < 18.5 && bmiValue > 0) return "Underweight";
  return "Normal";
};

const TodayHealthStatus = () => {
  const router = useRouter();
  const { bmi: paramBmi } = useLocalSearchParams();
  const { profile, setProfile, updateProfileField, calculateBMI } = useProfile();
  const [showEditHealthModal, setShowEditHealthModal] = useState(false);
  const { state, weeklyProgress, weeklyGoal } = useWorkoutPlan();
  const brandGreen = COLORS.primary;

  // Use BMI from profile context, fallback to params, then default
  const bmiValue = useMemo(() => {
    if (profile.bmi && profile.bmi !== "0") {
      return parseFloat(profile.bmi);
    }
    if (paramBmi) {
      const parsed = parseFloat(String(paramBmi));
      return Number.isFinite(parsed) ? parsed : parseFloat(defaultData.bmi);
    }
    return parseFloat(defaultData.bmi);
  }, [profile.bmi, paramBmi]);

  const userData = {
    ...defaultData,
    bmi: bmiValue.toFixed(1),
    bmiStatus: getBmiStatus(bmiValue),
  };

  const handleSaveHealth = (height: string, weight: string, activityLevel: string) => {
    // คำนวณ BMI ก่อน
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height) / 100;
    const calculatedBmi = (weightNum > 0 && heightNum > 0) 
      ? (weightNum / (heightNum * heightNum)).toFixed(1)
      : "0";
    
    // อัปเดท profile ทั้งหมดพร้อมกันในครั้งเดียว
    setProfile({
      ...profile,
      height,
      weight,
      activityLevel,
      bmi: calculatedBmi,
    });
  };

  const handleEditBMI = () => {
    setShowEditHealthModal(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ─── Header with Profile Button ─── */}
        <View className="h-56 w-full overflow-hidden mb-6 relative">
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
            }}
            className="flex-1 justify-end"
            style={{ borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: 'hidden' }}
          >
            <View className="absolute inset-0 bg-black/55" />
            
            {/* Profile Button - Top Right */}
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/Profile")}
              className="absolute top-6 right-5 z-10"
              activeOpacity={0.7}
            >
              <View
                className="w-14 h-14 rounded-full border-2 justify-center items-center"
                style={{
                  borderColor: COLORS.primary,
                  backgroundColor: COLORS.secondary,
                }}
              >
                {profile.profileImage ? (
                  <Image
                    source={{ uri: profile.profileImage }}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <Ionicons name="person" size={24} color={COLORS.primary} />
                )}
              </View>
            </TouchableOpacity>

            <Text className="text-white text-3xl font-black leading-9 px-5 pb-6">
              Today Health{"\n"}Status
            </Text>
          </ImageBackground>
        </View>

        <View className="px-4 gap-3">
          {/* ─── BMI & Calories ─── */}
          <View className="flex-row gap-3">
            <View className="flex-1" style={{ height: 140 }}>
              <MetricCard
                label="Current BMI"
                value={userData.bmi}
                status={userData.bmiStatus}
                statusColor="text-cyan-400"
                icon={
                  <MaterialCommunityIcons name="scale-bathroom" size={24} color="#22D3EE" />
                }
                onPress={handleEditBMI}
              />
            </View>
            <View className="flex-1" style={{ height: 140 }}>
              <MetricCard
                label="Calories Today"
                value={userData.caloriesIn}
                status={`Goal: ${userData.calorieGoal} kcal`}
                statusColor="text-primary"
                icon={
                  <MaterialCommunityIcons name="food-apple" size={24} color={brandGreen} />
                }
              />
            </View>
          </View>

          {/* ─── Workout & Streak ─── */}
          <View className="flex-row gap-3">
            <View className="flex-1" style={{ height: 140 }}>
              <MetricCard
                label="Workout Progress"
                value={`${weeklyProgress}/${weeklyGoal}`}
                status={`${weeklyGoal > 0 ? Math.round((weeklyProgress / weeklyGoal) * 100) : 0}%`}
                statusColor="text-purple-400"
                icon={<FontAwesome5 name="heart" size={20} color="#A855F7" />}
              />
            </View>
            <View className="flex-1" style={{ height: 140 }}>
              <MetricCard
                label="Day Streak"
                value={state.currentStreak}
                status={`Personal Best: ${state.personalBest}`}
                statusColor="text-orange-400"
                icon={
                  <MaterialCommunityIcons name="fire" size={24} color="#FB923C" />
                }
              />
            </View>
          </View>

          {/* ─── Scan Food ─── */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-secondary rounded-3xl border border-white/8 overflow-hidden"
          >
            <View className="flex-row items-center px-5 py-6 gap-4">
              <View
                style={{ backgroundColor: brandGreen }}
                className="w-12 h-12 rounded-lg justify-center items-center"
              >
                <Ionicons name="camera-outline" size={24} color="black" />
              </View>
              <View className="flex-1">
                <Text className="text-whiteText text-base font-bold">Scan Food</Text>
                <Text className="text-secondary-text text-xs mt-1">
                  Scan to calculate calories
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#444" />
            </View>
          </TouchableOpacity>

          {/* ─── Weekly Goal & Daily Plan ─── */}
          <View className="flex-row gap-3">
            <WeeklyGoalCard />
            <DailyPlanCard />
          </View>
        </View>
      </ScrollView>

      {/* Edit Health Modal - for editing height, weight, activity level */}
      <EditHealthModal
        visible={showEditHealthModal}
        onClose={() => setShowEditHealthModal(false)}
        onSave={handleSaveHealth}
        initialHeight={profile.height}
        initialWeight={profile.weight}
        initialActivityLevel={profile.activityLevel}
      />
    </SafeAreaView>
  );
};

export default TodayHealthStatus;
