import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useWorkoutPlan } from '@/context/WorkoutPlanContext';

const WeeklyGoalCard = () => {
  const { plan, currentWeek, todayFocus, nextWorkoutFocus } = useWorkoutPlan();

  if (!plan) {
    return (
      <View className="flex-1 bg-secondary rounded-3xl border border-white/10 p-5" style={{ minHeight: 140, justifyContent: 'center', alignItems: 'center' }}>
        <MaterialCommunityIcons name="dumbbell" size={28} color={COLORS.muted} />
        <Text style={{ color: COLORS.muted, fontSize: 13, marginTop: 8, textAlign: 'center' }}>
          No plan yet
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-secondary rounded-3xl border border-white/10 p-5" style={{ minHeight: 140, justifyContent: 'space-between' }}>
      <View className="flex-row justify-between items-center">
        <MaterialCommunityIcons name="dumbbell" size={22} color={COLORS.white} />
        <Text style={{ fontSize: 11, color: COLORS.muted, fontWeight: '600' }}>
          Week {currentWeek + 1}
        </Text>
      </View>

      <View>
        <Text style={{ fontSize: 10, color: COLORS.muted, marginBottom: 2 }}>today</Text>
        <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.white }} numberOfLines={1}>
          {todayFocus}
        </Text>
      </View>

      <View>
        <Text style={{ fontSize: 10, color: COLORS.muted, marginBottom: 2 }}>next</Text>
        <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.primary }} numberOfLines={1}>
          {nextWorkoutFocus}
        </Text>
      </View>
    </View>
  );
};

export default WeeklyGoalCard;
