import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useWorkoutPlan } from '@/context/WorkoutPlanContext';

const DailyPlanDetail = () => {
  const router = useRouter();
  const { plan, state, currentWeek, currentDay, completedWeeks, totalWeeks, getDayDate } = useWorkoutPlan();

  if (!plan) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View className="flex-row items-center px-5 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={{ fontSize: 22, fontWeight: '700', color: COLORS.primary, marginLeft: 12 }}>
            Daily Plan
          </Text>
        </View>
        <View className="flex-1 justify-center items-center px-8">
          <MaterialCommunityIcons name="calendar-clock" size={48} color={COLORS.muted} />
          <Text style={{ color: COLORS.muted, fontSize: 16, textAlign: 'center', marginTop: 16 }}>
            Choose a body goal first to get your workout plan
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="flex-row items-center px-5 py-4 mb-2">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.primary }}>
              Daily Plan
            </Text>
            <Text style={{ fontSize: 13, color: COLORS.muted, marginTop: 2 }}>
              {plan.goalLabel} · {completedWeeks}/{totalWeeks} weeks done
            </Text>
          </View>
        </View>

        {/* Weeks */}
        {plan.weeks.map((week, wIndex) => {
          const isCurrentWeek = wIndex === currentWeek;
          const allDone = state.completedDays[wIndex]?.every(Boolean);
          const doneCount = state.completedDays[wIndex]?.filter(Boolean).length ?? 0;

          return (
            <View
              key={wIndex}
              className="mx-5 mb-4 rounded-3xl border p-5"
              style={{
                backgroundColor: COLORS.secondary,
                borderColor: isCurrentWeek ? 'rgba(57,255,20,0.2)' : 'rgba(255,255,255,0.06)',
              }}
            >
              {/* Week header */}
              <View className="flex-row items-center justify-between mb-1">
                <View className="flex-row items-center">
                  {allDone ? (
                    <MaterialCommunityIcons name="check-circle" size={20} color={COLORS.primary} />
                  ) : isCurrentWeek ? (
                    <MaterialCommunityIcons name="play-circle" size={20} color={COLORS.primary} />
                  ) : (
                    <MaterialCommunityIcons name="circle-outline" size={20} color={COLORS.muted} />
                  )}
                  <Text style={{
                    fontSize: 17,
                    fontWeight: '800',
                    color: isCurrentWeek ? COLORS.primary : allDone ? COLORS.white : COLORS.muted,
                    marginLeft: 8,
                  }}>
                    Week {wIndex + 1}
                  </Text>
                  {isCurrentWeek && (
                    <View style={{ backgroundColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 }}>
                      <Text style={{ fontSize: 10, fontWeight: '800', color: COLORS.black }}>NOW</Text>
                    </View>
                  )}
                </View>
                <Text style={{ fontSize: 12, color: COLORS.muted, fontWeight: '600' }}>
                  {doneCount}/7
                </Text>
              </View>

              {/* Week label */}
              <Text style={{ fontSize: 13, color: COLORS.muted, marginBottom: 12, marginLeft: 28 }}>
                {week.label} · {getDayDate(wIndex, 0)} - {getDayDate(wIndex, 6)}
              </Text>

              {/* Days list */}
              {week.days.map((day, dIndex) => {
                const isDone = state.completedDays[wIndex]?.[dIndex];
                const isToday = isCurrentWeek && dIndex === currentDay;
                const isLast = dIndex === week.days.length - 1;

                return (
                  <View key={dIndex}>
                    <View
                      className="flex-row items-center rounded-2xl px-4 py-3"
                      style={{
                        backgroundColor: isToday
                          ? 'rgba(57,255,20,0.08)'
                          : isDone
                            ? 'rgba(57,255,20,0.03)'
                            : 'transparent',
                        borderWidth: isToday ? 1 : 0,
                        borderColor: isToday ? 'rgba(57,255,20,0.25)' : 'transparent',
                      }}
                    >
                      {/* Day dot */}
                      <View style={{
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        backgroundColor: isDone ? COLORS.primary : 'transparent',
                        borderWidth: isDone ? 0 : 1.5,
                        borderColor: isToday ? COLORS.primary : 'rgba(255,255,255,0.1)',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                        {isDone ? (
                          <MaterialCommunityIcons name="check" size={14} color={COLORS.black} />
                        ) : day.isRest ? (
                          <MaterialCommunityIcons name="sleep" size={12} color={COLORS.muted} />
                        ) : null}
                      </View>

                      {/* Day label */}
                      <Text style={{
                        fontSize: 13,
                        fontWeight: '700',
                        color: isToday ? COLORS.primary : COLORS.muted,
                        width: 52,
                        marginLeft: 12,
                      }}>
                        {getDayDate(wIndex, dIndex)}
                      </Text>

                      {/* Focus */}
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: isDone || isToday ? '700' : '500',
                          color: day.isRest ? COLORS.muted : isDone ? COLORS.primary : COLORS.white,
                          flex: 1,
                        }}
                        numberOfLines={1}
                      >
                        {day.focus}
                      </Text>

                      {isToday && !isDone && (
                        <View style={{ backgroundColor: 'rgba(57,255,20,0.15)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 }}>
                          <Text style={{ fontSize: 10, fontWeight: '800', color: COLORS.primary }}>TODAY</Text>
                        </View>
                      )}

                      {isDone && (
                        <MaterialCommunityIcons name="check-circle-outline" size={16} color={COLORS.primary} style={{ opacity: 0.5 }} />
                      )}
                    </View>

                    {/* Divider */}
                    {!isLast && (
                      <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.04)', marginHorizontal: 16, marginVertical: 2 }} />
                    )}
                  </View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DailyPlanDetail;
