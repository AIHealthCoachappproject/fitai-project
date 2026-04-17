// Workout plan templates per body goal

export interface WorkoutDay {
  day: number;
  focus: string;
  isRest: boolean;
}

export interface WorkoutWeek {
  week: number;
  label: string;
  days: WorkoutDay[];
}

export interface GoalPlan {
  goalId: string;
  goalLabel: string;
  weeks: WorkoutWeek[];
}

const buildWeek = (week: number, label: string, focuses: string[]): WorkoutWeek => ({
  week,
  label,
  days: focuses.map((focus, i) => ({
    day: i + 1,
    focus,
    isRest: focus === 'Rest',
  })),
});

export const WORKOUT_PLANS: Record<string, GoalPlan> = {
  weight_loss: {
    goalId: 'weight_loss',
    goalLabel: 'Weight Loss',
    weeks: [
      buildWeek(1, 'Cardio Foundation', ['Full Body HIIT', 'Lower Body', 'Cardio Burn', 'Upper Body', 'Core & Abs', 'Active Recovery', 'Rest']),
      buildWeek(2, 'Fat Burn Boost', ['Cardio Blast', 'Legs & Glutes', 'HIIT Circuit', 'Arms & Shoulders', 'Core Sculpt', 'Steady Cardio', 'Rest']),
      buildWeek(3, 'Endurance Push', ['Full Body HIIT', 'Lower Body Power', 'Cardio Intervals', 'Upper Body Tone', 'Core & Plank', 'Active Recovery', 'Rest']),
      buildWeek(4, 'Peak Week', ['Total Body Burn', 'Leg Blast', 'HIIT Finisher', 'Push & Pull', 'Core Challenge', 'Light Cardio', 'Rest']),
    ],
  },
  muscle_gain: {
    goalId: 'muscle_gain',
    goalLabel: 'Muscle Gain',
    weeks: [
      buildWeek(1, 'Strength Base', ['Chest & Triceps', 'Back & Biceps', 'Legs & Glutes', 'Shoulders & Abs', 'Full Body Strength', 'Active Recovery', 'Rest']),
      buildWeek(2, 'Hypertrophy', ['Chest & Shoulders', 'Back & Arms', 'Leg Day Heavy', 'Push Day', 'Pull Day', 'Core & Cardio', 'Rest']),
      buildWeek(3, 'Power Build', ['Upper Push', 'Lower Body', 'Upper Pull', 'Legs & Core', 'Full Body Power', 'Active Recovery', 'Rest']),
      buildWeek(4, 'Max Strength', ['Chest Blast', 'Back & Biceps', 'Heavy Legs', 'Shoulder Press', 'Total Body', 'Light Recovery', 'Rest']),
    ],
  },
  toned_body: {
    goalId: 'toned_body',
    goalLabel: 'Toned Body',
    weeks: [
      buildWeek(1, 'Tone & Define', ['Upper Body Tone', 'Lower Body Sculpt', 'Pilates Core', 'Arms & Shoulders', 'Glutes & Legs', 'Yoga Flow', 'Rest']),
      buildWeek(2, 'Sculpt Phase', ['Full Body Circuit', 'Lower Body Burn', 'Core & Balance', 'Upper Body Define', 'Leg Sculpt', 'Stretch & Recover', 'Rest']),
      buildWeek(3, 'Definition', ['Push & Tone', 'Glute Focus', 'Core Pilates', 'Pull & Define', 'Lower Body Power', 'Active Recovery', 'Rest']),
      buildWeek(4, 'Final Polish', ['Total Body Tone', 'Legs & Abs', 'Upper Sculpt', 'Booty Burn', 'Full Body Finisher', 'Yoga Stretch', 'Rest']),
    ],
  },
  healthy: {
    goalId: 'healthy',
    goalLabel: 'Healthy Lifestyle',
    weeks: [
      buildWeek(1, 'Balanced Start', ['Light Cardio', 'Bodyweight Strength', 'Yoga & Stretch', 'Walking & Core', 'Full Body Light', 'Mindful Movement', 'Rest']),
      buildWeek(2, 'Build Habits', ['Morning Cardio', 'Functional Fitness', 'Flexibility Flow', 'Strength Basics', 'Outdoor Walk', 'Yoga Session', 'Rest']),
      buildWeek(3, 'Active Living', ['Cardio Mix', 'Core & Balance', 'Gentle Strength', 'Stretching', 'Full Body Flow', 'Active Recovery', 'Rest']),
      buildWeek(4, 'Consistency', ['Light HIIT', 'Bodyweight Circuit', 'Yoga Practice', 'Walking & Breath', 'Functional Move', 'Relaxation', 'Rest']),
    ],
  },
};

/** Calculate current week (0-3) and day (0-6) based on start date */
export const getProgressFromStart = (startDate: string): { week: number; day: number; totalDays: number } => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const totalDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const week = Math.min(Math.floor(totalDays / 7), 3);
  const day = totalDays < 28 ? totalDays % 7 : 6; // cap at last day of week 4
  return { week, day, totalDays };
};

/** Get the actual date for a specific week/day offset from start date */
export const getDateForDay = (startDate: string, weekIndex: number, dayIndex: number): Date => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const offset = weekIndex * 7 + dayIndex;
  const date = new Date(start);
  date.setDate(date.getDate() + offset);
  return date;
};

/** Format date as "16 Apr" */
export const formatShortDate = (date: Date): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()} ${months[date.getMonth()]}`;
};

/** Calculate weekly goal and active days from activity level */
export const getWeeklyGoalFromActivityLevel = (activityLevel: string): number => {
  if (activityLevel.includes('Sedentary')) return 7; // Light health-focused, 7 days
  if (activityLevel.includes('Lightly Active')) return 3; // 1-3 days/week
  if (activityLevel.includes('Moderately Active')) return 5; // 3-5 days/week
  if (activityLevel.includes('Very Active')) return 7; // 6-7 days/week
  return 7; // default
};

/** Get array of day indices (0-6) that should be marked as active based on weekly goal */
export const getActiveDaysOfWeek = (weeklyGoal: number): number[] => {
  if (weeklyGoal >= 7) return [0, 1, 2, 3, 4, 5, 6]; // All days
  if (weeklyGoal === 5) return [0, 1, 3, 4, 6]; // Mon, Tue, Thu, Fri, Sun (distributed)
  if (weeklyGoal === 3) return [0, 3, 6]; // Mon, Thu, Sun (distributed)
  if (weeklyGoal === 0) return []; // No days (shouldn't happen)
  return [];
};
