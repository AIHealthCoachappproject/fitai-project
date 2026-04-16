/* ── Matches `users` table ── */
export interface UserRow {
  id: string;
  email: string;
  name: string;
  goal: string;
  weight: number;
  plan: string;
  created_at: string;
}

/* ── Matches `user_profiles` table ── */
export interface UserProfile {
  id: string;          // FK → users.id
  age: number;
  height_cm: number;
  gender: string;
  activity_level: string;
  target_weight_kg: number;
  daily_calorie: number;
  bmr: number;
}

/* ── Convenience: joined user + profile ── */
export interface Profile {
  id: string;
  email: string;
  name: string;
  goal: string;
  weight: number;
  plan: string;
  created_at: string;
  // from user_profiles
  age: number;
  height_cm: number;
  gender: string;
  activity_level: string;
  target_weight_kg: number;
  daily_calorie: number;
  bmr: number;
}

/* ── Matches `food_logs` table ── */
export interface FoodLog {
  id: string;
  user_id: string;
  food_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  meal_type: string;
  logged_at: string;
}

/* ── Matches `workouts` table ── */
export interface WorkoutLog {
  id: string;
  user_id: string;
  title: string;
  duration: number;
  completed: boolean;
  created_at: string;
}

/* ── Matches `weight_logs` table ── */
export interface WeightLog {
  id: string;
  user_id: string;
  weight_kg: number;
  bmi: number;
  logged_at: string;
}

export type InsertFoodLog = Omit<FoodLog, 'id' | 'logged_at'>;
export type InsertWorkoutLog = Omit<WorkoutLog, 'id' | 'created_at'>;
export type InsertWeightLog = Omit<WeightLog, 'id' | 'logged_at'>;
