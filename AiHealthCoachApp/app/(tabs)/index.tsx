import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MetricCard from "@/components/dashboard/MetricCard";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "@/constants/theme";
import { useProfile } from "@/context/ProfileContext";
import { useAuthContext } from "@/context/AuthContext";
import { useMeals } from "@/hooks/useMeals";
import { useWorkouts } from "@/hooks/useWorkouts";
import EditHealthModal from "@/components/dashboard/EditHealthModal";
import FoodScannerModal from "@/components/food/FoodScannerModal";
import { calculateTDEE } from "@/lib/health";

const getBmiStatus = (bmiValue: number) => {
  if (bmiValue >= 30) return "Obese";
  if (bmiValue >= 25) return "Overweight";
  if (bmiValue < 18.5 && bmiValue > 0) return "Underweight";
  return "Normal";
};

const getTodayStr = () => new Date().toISOString().split('T')[0];

const TodayHealthStatus = () => {
  const router = useRouter();
  const { profile, updateProfileField, calculateBMI } = useProfile();
  const { user, profile: authProfile, upsertProfile } = useAuthContext();
  const { meals, loading: mealsLoading, error: mealsError, addMeal, refresh: refreshMeals } = useMeals(user?.id);
  const { workouts, loading: workoutsLoading, error: workoutsError, refresh: refreshWorkouts } = useWorkouts(user?.id);
  const [showEditHealthModal, setShowEditHealthModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const brandGreen = COLORS.primary;

  // Real calories from today's meals
  const todayStr = getTodayStr();
  const todayCalories = useMemo(() => {
    return meals
      .filter((m) => m.logged_at?.startsWith(todayStr))
      .reduce((sum, m) => sum + (m.calories ?? 0), 0);
  }, [meals, todayStr]);

  // Real workout count today
  const todayWorkouts = useMemo(() => {
    return workouts.filter((w) => w.completed_at?.startsWith(todayStr));
  }, [workouts, todayStr]);

  // Compute BMI from user_profiles.weight_kg + height_cm
  const bmiValue = useMemo(() => {
    const w = authProfile?.weight_kg ?? 0;
    const hCm = authProfile?.height_cm ?? 0;
    if (w > 0 && hCm > 0) {
      const hM = hCm / 100;
      return w / (hM * hM);
    }
    if (profile.bmi && profile.bmi !== "0") return parseFloat(profile.bmi);
    return 0;
  }, [authProfile?.weight_kg, authProfile?.height_cm, profile.bmi]);

  const calorieGoal = useMemo(() => {
    if ((authProfile?.daily_calorie_goal ?? 0) > 0) return authProfile!.daily_calorie_goal;
    return calculateTDEE(
      authProfile?.weight_kg ?? 0,
      authProfile?.height_cm ?? 0,
      authProfile?.age ?? 0,
      authProfile?.gender ?? '',
      authProfile?.activity_level ?? '',
    );
  }, [authProfile]);

  const userData = {
    bmi: bmiValue > 0 ? bmiValue.toFixed(1) : "—",
    bmiStatus: bmiValue > 0 ? getBmiStatus(bmiValue) : "Not set",
    caloriesIn: todayCalories,
    calorieGoal,
    workoutsDone: todayWorkouts.length,
  };

  const handleSaveHealth = async (height: string, weight: string, activityLevel: string) => {
    updateProfileField('height', height);
    updateProfileField('weight', weight);
    updateProfileField('activityLevel', activityLevel);
    setTimeout(() => { calculateBMI(); }, 0);

    const tdee = calculateTDEE(
      parseFloat(weight),
      parseFloat(height),
      authProfile?.age ?? 0,
      authProfile?.gender ?? '',
      activityLevel,
    );
    await upsertProfile({
      height_cm: parseFloat(height),
      weight_kg: parseFloat(weight),
      activity_level: activityLevel,
      daily_calorie_goal: tdee,
    });
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

            <View className="px-5 pb-5">
              {authProfile?.name ? (
                <Text className="text-white/70 text-sm font-medium mb-1">
                  Hello, {authProfile.name}
                </Text>
              ) : null}
              <Text className="text-white text-3xl font-black leading-9">
                Today Health{"\n"}Status
              </Text>
            </View>
          </ImageBackground>
        </View>

        <View className="px-4 gap-3">
          {/* ─── Loading / Error ─── */}
          {(mealsLoading || workoutsLoading) && (
            <View className="items-center py-2">
              <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
          )}
          {(mealsError || workoutsError) && (
            <TouchableOpacity
              onPress={() => { refreshMeals(); refreshWorkouts(); }}
              className="bg-red-900/40 rounded-2xl px-4 py-3 flex-row items-center justify-between"
            >
              <Text className="text-red-400 text-sm">โหลดข้อมูลไม่สำเร็จ — แตะเพื่อลองใหม่</Text>
              <Ionicons name="refresh" size={16} color="#f87171" />
            </TouchableOpacity>
          )}
          {/* ─── BMI & Calories ─── */}
          <View className="flex-row gap-3">
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
              label="Workouts Today"
              value={userData.workoutsDone}
              status={`${userData.workoutsDone} completed`}
              statusColor="text-purple-400"
              icon={<FontAwesome5 name="heart" size={22} color="#A855F7" />}
            />
            <MetricCard
              label="Meals Logged"
              value={meals.length}
              status="Total logged"
              statusColor="text-orange-400"
              icon={
                <MaterialCommunityIcons name="food" size={26} color="#FB923C" />
              }
            />
          </View>

          {/* ─── Scan Food ─── */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowScanner(true)}
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

          {/* ─── Weight & Daily Plan ─── */}
          <View className="flex-row gap-3">
            <MetricCard
              label="Current Weight"
              value={authProfile?.weight_kg ?? "—"}
              unit={authProfile?.weight_kg ? "kg" : undefined}
              status={`BMI: ${userData.bmi}`}
              statusColor="text-orange-400"
              icon={
                <MaterialCommunityIcons name="scale" size={26} color="#FB923C" />
              }
              onPress={handleEditBMI}
            />

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

      <FoodScannerModal
        visible={showScanner}
        onClose={() => setShowScanner(false)}
        onConfirm={async (food) => {
          await addMeal({ ...food, user_id: user!.id });
          setShowScanner(false);
        }}
      />

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
