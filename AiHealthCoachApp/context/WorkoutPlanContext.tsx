import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import { WORKOUT_PLANS, getProgressFromStart, getDateForDay, formatShortDate } from '@/components/constants/workoutPlans';
import type { GoalPlan } from '@/components/constants/workoutPlans';

interface WorkoutPlanState {
  selectedGoal: string;
  startDate: string; // ISO date string of registration
  completedDays: boolean[][]; // [weekIndex][dayIndex]
  currentStreak: number;
  personalBest: number;
}

interface WorkoutPlanContextType {
  state: WorkoutPlanState;
  plan: GoalPlan | null;
  currentWeek: number;
  currentDay: number;
  weeklyProgress: number;
  totalWeeks: number;
  completedWeeks: number;
  todayFocus: string;
  nextWorkoutFocus: string;
  getDayDate: (weekIndex: number, dayIndex: number) => string;
  setGoal: (goalId: string) => void;
  completeToday: () => void;
}

const WorkoutPlanContext = createContext<WorkoutPlanContextType | undefined>(undefined);

const createEmptyDays = (): boolean[][] =>
  Array.from({ length: 4 }, () => Array(7).fill(false));

export const WorkoutPlanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WorkoutPlanState>({
    selectedGoal: '',
    startDate: '',
    completedDays: createEmptyDays(),
    currentStreak: 0,
    personalBest: 0,
  });

  const { week: currentWeek, day: currentDay } = useMemo(
    () => state.startDate ? getProgressFromStart(state.startDate) : { week: 0, day: 0 },
    [state.startDate],
  );

  const plan = useMemo(
    () => WORKOUT_PLANS[state.selectedGoal] ?? null,
    [state.selectedGoal],
  );

  const weeklyProgress = useMemo(
    () => state.completedDays[currentWeek]?.filter(Boolean).length ?? 0,
    [state.completedDays, currentWeek],
  );

  const completedWeeks = useMemo(
    () => state.completedDays.filter((week) => week.every(Boolean)).length,
    [state.completedDays],
  );

  const todayFocus = useMemo(
    () => plan?.weeks[currentWeek]?.days[currentDay]?.focus ?? '-',
    [plan, currentWeek, currentDay],
  );

  const nextWorkoutFocus = useMemo(() => {
    if (!plan) return '-';
    // look ahead from tomorrow
    for (let offset = 1; offset <= 7; offset++) {
      const d = (currentDay + offset) % 7;
      const w = currentDay + offset >= 7 ? Math.min(currentWeek + 1, 3) : currentWeek;
      const day = plan.weeks[w]?.days[d];
      if (day && !day.isRest) return day.focus;
    }
    return plan.weeks[currentWeek]?.days[0]?.focus ?? '-';
  }, [plan, currentWeek, currentDay]);

  const getDayDate = useCallback((weekIndex: number, dayIndex: number): string => {
    if (!state.startDate) return '';
    return formatShortDate(getDateForDay(state.startDate, weekIndex, dayIndex));
  }, [state.startDate]);

  const setGoal = useCallback((goalId: string) => {
    setState({
      selectedGoal: goalId,
      startDate: new Date().toISOString(),
      completedDays: createEmptyDays(),
      currentStreak: 0,
      personalBest: 0,
    });
  }, []);

  const completeToday = useCallback(() => {
    setState((prev) => {
      if (prev.completedDays[currentWeek][currentDay]) return prev; // already done

      const newDays = prev.completedDays.map((w) => [...w]);
      newDays[currentWeek][currentDay] = true;

      const newStreak = prev.currentStreak + 1;
      const newBest = Math.max(prev.personalBest, newStreak);

      return {
        ...prev,
        completedDays: newDays,
        currentStreak: newStreak,
        personalBest: newBest,
      };
    });
  }, [currentWeek, currentDay]);

  const value = useMemo<WorkoutPlanContextType>(
    () => ({
      state,
      plan,
      currentWeek,
      currentDay,
      weeklyProgress,
      totalWeeks: 4,
      completedWeeks,
      todayFocus,
      nextWorkoutFocus,
      getDayDate,
      setGoal,
      completeToday,
    }),
    [state, plan, currentWeek, currentDay, weeklyProgress, completedWeeks, todayFocus, nextWorkoutFocus, getDayDate, setGoal, completeToday],
  );

  return (
    <WorkoutPlanContext.Provider value={value}>{children}</WorkoutPlanContext.Provider>
  );
};

export const useWorkoutPlan = () => {
  const ctx = useContext(WorkoutPlanContext);
  if (!ctx) throw new Error('useWorkoutPlan must be used within WorkoutPlanProvider');
  return ctx;
};
