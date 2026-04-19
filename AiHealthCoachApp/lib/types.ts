/* ── Matches `user_profiles` table (auto-created by trigger on register) ── */
export interface UserProfile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  age: number | null;
  gender: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  goal: string | null;
  activity_level: string | null;
  daily_calorie_goal: number | null;
  daily_protein_goal: number | null;
  onboarding_completed: boolean;
}

/* ── Convenience: flat profile used throughout the app ── */
export interface Profile {
  id: string;
  email: string;
  created_at: string;
  // user_profiles columns
  name: string;
  avatar_url: string;
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
  goal: string;
  activity_level: string;
  daily_calorie_goal: number;
  daily_protein_goal: number;
  onboarding_completed: boolean;
}

/* ── Matches `food_logs` table ── */
export interface FoodLog {
  id: string;
  user_id: string;
  food_name: string;
  food_name_th: string | null;
  meal_type: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  amount_g: number | null;
  image_uri: string | null;
  logged_at: string;
}

/* ── Matches `workouts` table ── */
export interface WorkoutLog {
  id: string;
  user_id: string;
  title: string;
  type: string | null;
  duration_min: number | null;
  calories_burned: number | null;
  completed: boolean;
  completed_at: string;
}

/* ── Matches `weight_logs` table ── */
export interface WeightLog {
  id: string;
  user_id: string;
  weight_kg: number;
  bmi: number | null;
  note: string | null;
  logged_at: string;
}

/* ── Matches `ai_chats` table ── */
export interface AiChat {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}

/* ── Matches `daily_summaries` table ── */
export interface DailySummary {
  id: string;
  user_id: string;
  summary_date: string;
  calories_in: number;
  calories_out: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  workout_done: boolean;
  streak_day: number;
}

/* ── Matches `workout_plans` table ── */
export interface WorkoutPlan {
  id: string;
  user_id: string;
  plan_name: string;
  goal_type: string | null;
  days_per_week: number | null;
  exercises: unknown | null;
  generated_by_ai: boolean;
  is_active: boolean;
}

/* ── Matches `skill_logs` table ── */
export interface SkillLog {
  id: string;
  user_id: string;
  skill_name: string;
  duration_min: number;
  successful_attempts: number;
  logged_at: string;
}

export type InsertFoodLog = Omit<FoodLog, 'id' | 'logged_at'>;
export type InsertWorkoutLog = Omit<WorkoutLog, 'id' | 'completed_at'>;
export type InsertWeightLog = Omit<WeightLog, 'id' | 'logged_at'>;
export type InsertSkillLog = Omit<SkillLog, 'id' | 'logged_at'>;
