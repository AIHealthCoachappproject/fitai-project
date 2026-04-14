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

const defaultData = {
  bmi: "21.0",
  bmiStatus: "Normal",
  caloriesIn: 1450,
  calorieGoal: 2000,
  workoutProgress: "3/5",
  workoutPercentage: "70%",
  streak: 10,
  streakBest: 15,
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
  const { profile, updateProfileField, calculateBMI } = useProfile();
  const [showEditHealthModal, setShowEditHealthModal] = useState(false);
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
    updateProfileField('height', height);
    updateProfileField('weight', weight);
    updateProfileField('activityLevel', activityLevel);
    setTimeout(() => {
      calculateBMI();
    }, 0);
  };

  const handleEditBMI = () => {
    setShowEditHealthModal(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* ─── Header with Profile Button ─── */}
        <View className="h-48 w-full overflow-hidden mb-4 relative">
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

            <Text className="text-white text-3xl font-black leading-9 px-5 pb-5">
              Today Health{"\n"}Status
            </Text>
          </ImageBackground>
        </View>

        <View className="px-4 gap-3">
          {/* ─── BMI & Calories ─── */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <MetricCard
                label="Current BMI"
                value={userData.bmi}
                status={userData.bmiStatus}
                statusColor="text-cyan-400"
                icon={
                  <MaterialCommunityIcons name="scale-bathroom" size={26} color="#22D3EE" />
                }
                onPress={handleEditBMI}
              />
            </View>
            <MetricCard
              label="Calories Today"
              value={userData.caloriesIn}
              status={`Goal: ${userData.calorieGoal} kcal`}
              statusColor="text-primary"
              icon={
                <MaterialCommunityIcons name="food-apple" size={26} color={brandGreen} />
              }
            />
          </View>

          {/* ─── Workout & Streak ─── */}
          <View className="flex-row gap-3">
            <MetricCard
              label="Workout Progress"
              value={userData.workoutProgress}
              status={userData.workoutPercentage}
              statusColor="text-purple-400"
              icon={<FontAwesome5 name="heart" size={22} color="#A855F7" />}
            />
            <MetricCard
              label="Day Streak"
              value={userData.streak}
              status={`Personal Best: ${userData.streakBest}`}
              statusColor="text-orange-400"
              icon={
                <MaterialCommunityIcons name="fire" size={26} color="#FB923C" />
              }
            />
          </View>

          {/* ─── Scan Food ─── */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-secondary rounded-[28px] border border-white/8 overflow-hidden"
          >
            <View className="flex-row items-center px-5 py-4 gap-4">
              <View
                style={{ backgroundColor: brandGreen }}
                className="w-12 h-12 rounded-2xl justify-center items-center"
              >
                <Ionicons name="camera-outline" size={24} color="black" />
              </View>
              <View className="flex-1">
                <Text className="text-whiteText text-base font-bold">Scan Food</Text>
                <Text className="text-secondary-text text-xs mt-0.5">
                  Scan to calculate calories
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#444" />
            </View>
          </TouchableOpacity>

          {/* ─── Next Workout & Daily Plan ─── */}
          <View className="flex-row gap-3">
            {/* Next Workout */}
            <TouchableOpacity
              activeOpacity={0.75}
              className="flex-1 bg-secondary rounded-[28px] border border-white/8 p-5"
              style={{ minHeight: 120, justifyContent: 'space-between' }}
            >
              <MaterialCommunityIcons name="dumbbell" size={22} color="white" />
              <View>
                <Text className="text-secondary-text text-[11px] mb-1">next: </Text>
                <Text className="text-whiteText text-lg font-bold">Leg day</Text>
              </View>
            </TouchableOpacity>

            {/* Daily Plan */}
            <TouchableOpacity
              activeOpacity={0.75}
              className="flex-1 bg-secondary rounded-[28px] border border-white/8 p-5"
              style={{ minHeight: 120, justifyContent: 'space-between' }}
            >
              <MaterialCommunityIcons name="lightning-bolt" size={22} color={brandGreen} />
              <View>
                <Text className="text-secondary-text text-[11px] mb-1">goal</Text>
                <Text className="text-whiteText text-lg font-bold">Daily Plan</Text>
              </View>
            </TouchableOpacity>
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
