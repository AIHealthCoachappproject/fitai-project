import React, { useMemo } from 'react';
import { View, Text, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useProfile } from '@/context/ProfileContext';
import { useWorkoutPlan } from '@/context/WorkoutPlanContext';
import {
  getWeeklyWeightAverages,
  getTotalWeightChange,
  getWeeklyConsistency,
  getWeeklyCalories,
} from '@/components/constants/progressData';
import WeightProgressChart from '@/components/progress/WeightProgressChart';
import BMITrendGauge from '@/components/progress/BMITrendGauge';
import WorkoutConsistencyChart from '@/components/progress/WorkoutConsistencyChart';
import NutritionBalanceChart from '@/components/progress/NutritionBalanceChart';

export default function TrackProgress() {
  const { profile } = useProfile();
  const { state, currentWeek } = useWorkoutPlan();

  const initialWeight = parseFloat(profile.weight) || 70;
  const weeksElapsed = currentWeek + 1;

  const weeklyAverages = useMemo(
    () =>
      getWeeklyWeightAverages(
        state.workoutEntries,
        state.startDate,
        initialWeight,
        weeksElapsed,
      ),
    [state.workoutEntries, state.startDate, initialWeight, weeksElapsed],
  );
  const totalChange = useMemo(
    () => getTotalWeightChange(weeklyAverages),
    [weeklyAverages],
  );

  const consistency = useMemo(
    () => getWeeklyConsistency(state.completedDays, currentWeek),
    [state.completedDays, currentWeek],
  );

  const bmi = parseFloat(profile.bmi) || 0;

  const calories = useMemo(
    () => getWeeklyCalories(currentWeek),
    [currentWeek],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ─── Hero Header ─── */}
        <View className="h-44 w-full overflow-hidden mb-6">
          <ImageBackground
            source={{
              uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
            }}
            className="flex-1 justify-end"
            style={{
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
              overflow: 'hidden',
            }}
          >
            <View className="absolute inset-0 bg-black/60" />
            <View className="px-5 pb-5 z-10 flex-row justify-between items-end">
              <View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.primary }}>
                  Your Health Summary
                </Text>
                <Text style={{ fontSize: 28, fontWeight: '800', color: COLORS.white, marginTop: 2 }}>
                  Track your{'\n'}progress
                </Text>
              </View>
              <Ionicons name="heart-circle" size={36} color={COLORS.primary} />
            </View>
          </ImageBackground>
        </View>

        {/* ─── Charts ─── */}
        <WeightProgressChart data={weeklyAverages} totalChange={totalChange} />
        <BMITrendGauge bmi={bmi > 0 ? bmi : 22.5} />
        <WorkoutConsistencyChart consistency={consistency} />
        <NutritionBalanceChart calories={calories} />
      </ScrollView>
    </SafeAreaView>
  );
}