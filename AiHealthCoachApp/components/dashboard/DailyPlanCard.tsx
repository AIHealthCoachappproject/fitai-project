import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { useWorkoutPlan } from '@/context/WorkoutPlanContext';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const DailyPlanCard = () => {
  const router = useRouter();
  const { plan, state, currentWeek, currentDay, completedWeeks, totalWeeks } = useWorkoutPlan();

  if (!plan) {
    return (
      <View className="flex-1 bg-secondary rounded-3xl border border-white/10 p-5" style={{ minHeight: 140, justifyContent: 'center', alignItems: 'center' }}>
        <MaterialCommunityIcons name="calendar-clock" size={28} color={COLORS.muted} />
        <Text style={{ color: COLORS.muted, fontSize: 13, marginTop: 8, textAlign: 'center' }}>
          Choose a body goal to get your plan
        </Text>
      </View>
    );
  }

  const weekLabel = plan.weeks[currentWeek]?.label ?? '';

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => router.push('/(tabs)/DailyPlanDetail')}
      className="flex-1 bg-secondary rounded-3xl border border-white/10 p-5"
      style={{ minHeight: 140, justifyContent: 'space-between' }}
    >
      <View className="flex-row justify-between items-center">
        <MaterialCommunityIcons name="lightning-bolt" size={22} color={COLORS.primary} />
        <Text style={{ fontSize: 11, color: COLORS.muted, fontWeight: '600' }}>
          {completedWeeks}/{totalWeeks} weeks
        </Text>
      </View>

      <View>
        <Text style={{ fontSize: 10, color: COLORS.muted, marginBottom: 2 }}>{weekLabel}</Text>
        <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.white }}>Daily Plan</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DailyPlanCard;
