import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import { WORKOUT_PLANS, getProgressFromStart, getDateForDay, formatShortDate, getWeeklyGoalFromActivityLevel, getActiveDaysOfWeek } from '@/components/constants/workoutPlans';
import type { GoalPlan } from '@/components/constants/workoutPlans';

export interface WorkoutEntry {
  weekIndex: number;
  dayIndex: number;
  date: string; // ISO date
  weight: number;
  notes?: string;
  focus: string;
}

interface WorkoutPlanState {
  selectedGoal: string;
  startDate: string; // ISO date string of registration
  completedDays: boolean[][]; // [weekIndex][dayIndex]
  currentStreak: number;
  personalBest: number;
  activityLevel: string;
  workoutEntries: WorkoutEntry[]; // History of logged workouts with weight
}

interface WorkoutPlanContextType {
  state: WorkoutPlanState;
  plan: GoalPlan | null;
  currentWeek: number;
  currentDay: number;
  weeklyProgress: number;
  weeklyGoal: number;
  activeDaysOfWeek: number[];
  totalWeeks: number;
  completedWeeks: number;
  todayFocus: string;
  nextWorkoutFocus: string;
  getTodayWeight: () => number | null;
  getDayDate: (weekIndex: number, dayIndex: number) => string;
  setGoal: (goalId: string, activityLevel: string) => void;
  completeToday: () => void;
  logWorkoutEntry: (weekIndex: number, dayIndex: number, weight: number, notes?: string) => void;
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
    activityLevel: '',
    workoutEntries: [],
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

  const weeklyGoal = useMemo(
    () => getWeeklyGoalFromActivityLevel(state.activityLevel),
    [state.activityLevel],
  );

  const activeDaysOfWeek = useMemo(
    () => getActiveDaysOfWeek(weeklyGoal),
    [weeklyGoal],
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

  const getTodayWeight = useCallback((): number | null => {
    const todayEntry = state.workoutEntries.find(
      (entry) => entry.weekIndex === currentWeek && entry.dayIndex === currentDay
    );
    return todayEntry ? todayEntry.weight : null;
  }, [state.workoutEntries, currentWeek, currentDay]);

  const setGoal = useCallback((goalId: string, activityLevel: string) => {
    setState({
      selectedGoal: goalId,
      startDate: new Date().toISOString(),
      completedDays: createEmptyDays(),
      currentStreak: 0,
      personalBest: 0,
      activityLevel,
      workoutEntries: [],
    });
  }, []);

  const completeToday = useCallback(() => {
    setState((prev) => {
      if (prev.completedDays[currentWeek]?.[currentDay]) return prev;

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

  const logWorkoutEntry = useCallback((weekIndex: number, dayIndex: number, weight: number, notes?: string) => {
    setState((prev) => {
      const focus = plan?.weeks[weekIndex]?.days[dayIndex]?.focus ?? 'Unknown';
      const date = getDateForDay(prev.startDate, weekIndex, dayIndex).toISOString();
      
      const newEntry: WorkoutEntry = {
        weekIndex,
        dayIndex,
        date,
        weight,
        notes,
        focus,
      };

      const updatedEntries = prev.workoutEntries.filter(
        (entry) => !(entry.weekIndex === weekIndex && entry.dayIndex === dayIndex)
      );

      return {
        ...prev,
        workoutEntries: [...updatedEntries, newEntry],
      };
    });
  }, [plan]);

  const value = useMemo<WorkoutPlanContextType>(
    () => ({
      state,
      plan,
      currentWeek,
      currentDay,
      weeklyProgress,
      weeklyGoal,
      activeDaysOfWeek,
      totalWeeks: 4,
      completedWeeks,
      todayFocus,
      nextWorkoutFocus,
      getTodayWeight,
      getDayDate,
      setGoal,
      completeToday,
      logWorkoutEntry,
    }),
    [state, plan, currentWeek, currentDay, weeklyProgress, weeklyGoal, activeDaysOfWeek, completedWeeks, todayFocus, nextWorkoutFocus, getTodayWeight, getDayDate, setGoal, completeToday, logWorkoutEntry],
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
