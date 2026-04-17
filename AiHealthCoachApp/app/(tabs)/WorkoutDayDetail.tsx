import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useWorkoutPlan } from '@/context/WorkoutPlanContext';
import { useProfile } from '@/context/ProfileContext';
import PageHeader from '@/components/ui/PageHeader';
import ActionButtons from '@/components/ui/ActionButtons';
import { WORKOUT_PLANS } from '@/components/constants/workoutPlans';

const WorkoutDayDetail = () => {
  const router = useRouter();
  const { weekIndex: wIdx, dayIndex: dIdx } = useLocalSearchParams();
  const { state, currentWeek, currentDay, getDayDate, completeToday, logWorkoutEntry } = useWorkoutPlan();
  const { profile } = useProfile();
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const weekIndex = wIdx ? parseInt(String(wIdx)) : 0;
  const dayIndex = dIdx ? parseInt(String(dIdx)) : 0;

  // Check if this is today's workout
  const isToday = useMemo(
    () => weekIndex === currentWeek && dayIndex === currentDay,
    [weekIndex, dayIndex, currentWeek, currentDay]
  );

  // Get the current goal's plan
  const plan = state.selectedGoal ? WORKOUT_PLANS[state.selectedGoal] : null;

  if (!plan) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <PageHeader
          title="Workout"
          onBack={() => router.back()}
        />
        <View className="flex-1 justify-center items-center px-8">
          <MaterialCommunityIcons name="dumbbell" size={48} color={COLORS.muted} />
          <Text style={{ color: COLORS.muted, fontSize: 16, textAlign: 'center', marginTop: 16 }}>
            No workout plan available
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const workout = plan.weeks[weekIndex]?.days[dayIndex];
  const dateStr = getDayDate(weekIndex, dayIndex);
  const isDone = state.completedDays[weekIndex]?.[dayIndex];
  const lastWeight = profile.weight;

  const handleComplete = async () => {
    if (!workout.isRest && !weight.trim()) {
      Alert.alert('Weight Required', 'Please enter your weight to complete this workout.');
      return;
    }

    setIsLoading(true);
    try {
      if (!workout.isRest && weight.trim()) {
        logWorkoutEntry(weekIndex, dayIndex, parseFloat(weight), notes);
      }
      completeToday();
      Alert.alert('Success! 🎉', 'Workout logged successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to save workout. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <PageHeader
          title={workout.focus}
          subtitle={dateStr}
          onBack={() => router.back()}
          rightIcon={isDone ? <MaterialCommunityIcons name="check-circle" size={24} color={COLORS.primary} /> : undefined}
        />

        <View className="px-5 gap-4">
          {/* View Only Mode Indicator */}
          {!isToday && (
            <View
              className="rounded-2xl px-4 py-3 flex-row items-center"
              style={{ backgroundColor: 'rgba(100,150,255,0.08)', borderColor: 'rgba(100,150,255,0.2)', borderWidth: 1 }}
            >
              <MaterialCommunityIcons name="eye" size={16} color="rgba(100,150,255,0.7)" />
              <Text style={{ fontSize: 12, color: 'rgba(100,150,255,0.8)', marginLeft: 8 }}>
                View only • Edit today's workout only
              </Text>
            </View>
          )}
          {/* Workout Info Card */}
          {!workout.isRest && (
            <View
              className="rounded-3xl border p-5"
              style={{ backgroundColor: COLORS.secondary, borderColor: 'rgba(57,255,20,0.2)' }}
            >
              <View className="flex-row items-center mb-3">
                <MaterialCommunityIcons name="dumbbell" size={20} color={COLORS.primary} />
                <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.muted, marginLeft: 8 }}>
                  TODAY'S FOCUS
                </Text>
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.white, lineHeight: 26 }}>
                {workout.focus}
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.muted, marginTop: 8 }}>
                Complete this workout and log your weight to track progress
              </Text>
            </View>
          )}

          {/* Rest Day Card */}
          {workout.isRest && (
            <View
              className="rounded-3xl border p-5"
              style={{ backgroundColor: COLORS.secondary, borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <View className="flex-row items-center mb-3">
                <MaterialCommunityIcons name="sleep" size={20} color={COLORS.muted} />
                <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.muted, marginLeft: 8 }}>
                  REST DAY
                </Text>
              </View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.white }}>
                Take it easy today! 😌
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.muted, marginTop: 8 }}>
                Recovery is important. Hydrate and prepare for tomorrow!
              </Text>
            </View>
          )}

          {/* Weight Input Section (only for workout days) */}
          {!workout.isRest && (
            <>
              {/* Last Weight Display */}
              <View
                className="rounded-3xl border p-4"
                style={{ backgroundColor: 'rgba(57,255,20,0.05)', borderColor: 'rgba(57,255,20,0.15)' }}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.muted, marginBottom: 8 }}>
                  Last recorded weight
                </Text>
                <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.primary }}>
                  {lastWeight} kg
                </Text>
              </View>

              {/* Weight Input */}
              <View>
                <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.white, marginBottom: 8 }}>
                  Enter your weight (kg)
                </Text>
                <View
                  className="flex-row items-center rounded-2xl px-4 py-3 border"
                  style={{
                    backgroundColor: COLORS.secondary,
                    borderColor: isToday ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                    opacity: isToday ? 1 : 0.6,
                  }}
                >
                  <TextInput
                    style={{
                      flex: 1,
                      color: COLORS.white,
                      fontSize: 16,
                      fontWeight: '600',
                    }}
                    placeholder="Enter your weight (kg)"
                    placeholderTextColor={COLORS.muted}
                    keyboardType="decimal-pad"
                    value={weight}
                    onChangeText={setWeight}
                    editable={isToday}
                    selectTextOnFocus={isToday}
                  />
                </View>
              </View>
            </>
          )}

          {/* Action Buttons */}
          <ActionButtons
            onComplete={isToday ? handleComplete : undefined}
            onCancel={() => router.back()}
            completeLabel="Complete Workout"
            isLoading={isLoading}
            isDisabled={!isToday}
            disabledReason={!isToday ? 'Only today\'s workout can be edited' : undefined}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WorkoutDayDetail;
