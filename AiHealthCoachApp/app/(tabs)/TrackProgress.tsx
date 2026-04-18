import { View, Text, ScrollView, TextInput, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useMeals } from "@/hooks/useMeals";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useProgress } from "@/hooks/useProgress";
import CustomButton from "@/components/ui/CustomButton";
import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import type { InsertFoodLog, InsertWorkoutLog, InsertWeightLog } from "@/lib/types";

type TabKey = "meal" | "workout" | "weight";

export default function TrackProgress() {
  const { user, profile } = useAuthContext();
  const { meals, addMeal } = useMeals(user?.id);
  const { workouts, addWorkout } = useWorkouts(user?.id);
  const { weightLogs, addWeight } = useProgress(user?.id);

  const [activeTab, setActiveTab] = useState<TabKey>("meal");
  const [submitting, setSubmitting] = useState(false);

  // Meal form
  const [mealName, setMealName] = useState("");
  const [mealCalories, setMealCalories] = useState("");
  const [mealProtein, setMealProtein] = useState("");
  const [mealCarbs, setMealCarbs] = useState("");
  const [mealFat, setMealFat] = useState("");

  // Workout form
  const [workoutTitle, setWorkoutTitle] = useState("");
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [workoutCalories, setWorkoutCalories] = useState("");

  // Weight form
  const [weightKg, setWeightKg] = useState("");

  const handleAddMeal = async () => {
    if (!mealName.trim() || !mealCalories.trim()) {
      Alert.alert("Error", "Meal name and calories are required");
      return;
    }
    setSubmitting(true);
    const result = await addMeal({
      user_id: user!.id,
      food_name: mealName.trim(),
      calories: parseFloat(mealCalories) || 0,
      protein_g: parseFloat(mealProtein) || 0,
      carbs_g: parseFloat(mealCarbs) || 0,
      fat_g: parseFloat(mealFat) || 0,
      meal_type: 'other',
    });
    setSubmitting(false);
    if (result.success) {
      setMealName(""); setMealCalories(""); setMealProtein(""); setMealCarbs(""); setMealFat("");
      Alert.alert("Success", "Meal logged!");
    } else {
      Alert.alert("Error", result.error ?? "Failed to log meal");
    }
  };

  const handleAddWorkout = async () => {
    if (!workoutTitle.trim() || !workoutDuration.trim()) {
      Alert.alert("Error", "Title and duration are required");
      return;
    }
    setSubmitting(true);
    const result = await addWorkout({
      user_id: user!.id,
      title: workoutTitle.trim(),
      duration_min: parseInt(workoutDuration, 10) || 0,
      calories_burned: parseFloat(workoutCalories) || 0,
      completed: true,
    });
    setSubmitting(false);
    if (result.success) {
      setWorkoutTitle(""); setWorkoutDuration(""); setWorkoutCalories("");
      Alert.alert("Success", "Workout logged!");
    } else {
      Alert.alert("Error", result.error ?? "Failed to log workout");
    }
  };

  const handleAddWeight = async () => {
    if (!weightKg.trim()) {
      Alert.alert("Error", "Weight is required");
      return;
    }
    const kg = parseFloat(weightKg);
    const heightM = (profile?.height_cm ?? 170) / 100;
    const bmi = heightM > 0 ? kg / (heightM * heightM) : 0;

    setSubmitting(true);
    const result = await addWeight({
      user_id: user!.id,
      weight_kg: kg,
      bmi: parseFloat(bmi.toFixed(1)),
    });
    setSubmitting(false);
    if (result.success) {
      setWeightKg("");
      Alert.alert("Success", "Weight logged!");
    } else {
      Alert.alert("Error", result.error ?? "Failed to log weight");
    }
  };

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "meal", label: "Meal", icon: "restaurant" },
    { key: "workout", label: "Workout", icon: "barbell" },
    { key: "weight", label: "Weight", icon: "scale" },
  ];

  const inputStyle = "bg-[#1a1a1a] border border-gray-700 rounded-2xl px-4 py-3 text-white text-base mb-3";

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <Text className="text-white text-lg">Please log in to track progress</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <Text className="text-white text-3xl font-bold mb-6">Track Progress</Text>

        {/* Tab Selector */}
        <View className="flex-row mb-6 bg-[#1a1a1a] rounded-2xl p-1">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 rounded-xl items-center ${activeTab === tab.key ? "bg-[#39FF14]" : ""}`}
            >
              <Ionicons
                name={tab.icon as keyof typeof Ionicons.glyphMap}
                size={18}
                color={activeTab === tab.key ? "#000" : "#888"}
              />
              <Text className={`text-xs mt-1 font-semibold ${activeTab === tab.key ? "text-black" : "text-gray-400"}`}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Meal Form */}
        {activeTab === "meal" && (
          <View>
            <TextInput placeholder="Meal name" placeholderTextColor="#666" value={mealName} onChangeText={setMealName} className={inputStyle} />
            <TextInput placeholder="Calories" placeholderTextColor="#666" value={mealCalories} onChangeText={setMealCalories} keyboardType="numeric" className={inputStyle} />
            <TextInput placeholder="Protein (g)" placeholderTextColor="#666" value={mealProtein} onChangeText={setMealProtein} keyboardType="numeric" className={inputStyle} />
            <TextInput placeholder="Carbs (g)" placeholderTextColor="#666" value={mealCarbs} onChangeText={setMealCarbs} keyboardType="numeric" className={inputStyle} />
            <TextInput placeholder="Fat (g)" placeholderTextColor="#666" value={mealFat} onChangeText={setMealFat} keyboardType="numeric" className={inputStyle} />
            <CustomButton title="Log Meal" onPress={handleAddMeal} isLoading={submitting} containerStyles="mt-2" />

            {meals.length > 0 && (
              <View className="mt-6">
                <Text className="text-white font-bold text-lg mb-3">Recent Meals</Text>
                {meals.slice(0, 5).map((m) => (
                  <View key={m.id} className="bg-[#1a1a1a] rounded-2xl p-4 mb-2 border border-gray-800">
                    <Text className="text-white font-semibold">{m.food_name}</Text>
                    <Text className="text-gray-400 text-sm">{m.calories} kcal · P:{m.protein_g}g · C:{m.carbs_g}g · F:{m.fat_g}g</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Workout Form */}
        {activeTab === "workout" && (
          <View>
            <TextInput placeholder="Workout title" placeholderTextColor="#666" value={workoutTitle} onChangeText={setWorkoutTitle} className={inputStyle} />
            <TextInput placeholder="Duration (min)" placeholderTextColor="#666" value={workoutDuration} onChangeText={setWorkoutDuration} keyboardType="numeric" className={inputStyle} />
            <TextInput placeholder="Calories burned" placeholderTextColor="#666" value={workoutCalories} onChangeText={setWorkoutCalories} keyboardType="numeric" className={inputStyle} />
            <CustomButton title="Log Workout" onPress={handleAddWorkout} isLoading={submitting} containerStyles="mt-2" />

            {workouts.length > 0 && (
              <View className="mt-6">
                <Text className="text-white font-bold text-lg mb-3">Recent Workouts</Text>
                {workouts.slice(0, 5).map((w) => (
                  <View key={w.id} className="bg-[#1a1a1a] rounded-2xl p-4 mb-2 border border-gray-800">
                    <Text className="text-white font-semibold">{w.title}</Text>
                    <Text className="text-gray-400 text-sm">{w.duration_min} min · {w.completed ? 'Completed' : 'In progress'}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Weight Form */}
        {activeTab === "weight" && (
          <View>
            <TextInput placeholder="Weight (kg)" placeholderTextColor="#666" value={weightKg} onChangeText={setWeightKg} keyboardType="numeric" className={inputStyle} />
            <CustomButton title="Log Weight" onPress={handleAddWeight} isLoading={submitting} containerStyles="mt-2" />

            {weightLogs.length > 0 && (
              <View className="mt-6">
                <Text className="text-white font-bold text-lg mb-3">Weight History</Text>
                {weightLogs.slice(0, 10).map((w) => (
                  <View key={w.id} className="bg-[#1a1a1a] rounded-2xl p-4 mb-2 border border-gray-800">
                    <View className="flex-row justify-between">
                      <Text className="text-white font-semibold">{w.weight_kg} kg</Text>
                      <Text className="text-gray-400 text-sm">BMI: {w.bmi}</Text>
                    </View>
                    <Text className="text-gray-500 text-xs mt-1">
                      {new Date(w.logged_at).toLocaleDateString()}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}