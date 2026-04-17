import type { WorkoutEntry } from '@/context/WorkoutPlanContext';

/** Maximum weeks displayed in the weight progress chart */
export const MAX_DISPLAY_WEEKS = 8;

/** Day labels for weekly charts */
export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

/**
 * Given workoutEntries and a start date, compute weekly average weights.
 * If a day has no entry, the most recent previous weight is carried forward.
 * Returns an array of { weekLabel, avgWeight } for up to MAX_DISPLAY_WEEKS.
 */
export function getWeeklyWeightAverages(
  entries: WorkoutEntry[],
  startDate: string,
  initialWeight: number,
  totalWeeksElapsed: number,
): { weekLabel: string; avgWeight: number }[] {
  const weeks = Math.min(totalWeeksElapsed, MAX_DISPLAY_WEEKS);
  if (weeks <= 0) return [];

  const result: { weekLabel: string; avgWeight: number }[] = [];
  let lastKnownWeight = initialWeight;

  for (let w = 0; w < weeks; w++) {
    const dailyWeights: number[] = [];

    for (let d = 0; d < 7; d++) {
      const entry = entries.find(
        (e) => e.weekIndex === w && e.dayIndex === d,
      );
      if (entry) {
        lastKnownWeight = entry.weight;
      }
      dailyWeights.push(lastKnownWeight);
    }

    const avg =
      dailyWeights.reduce((sum, v) => sum + v, 0) / dailyWeights.length;
    result.push({
      weekLabel: `week${w + 1}`,
      avgWeight: parseFloat(avg.toFixed(1)),
    });
  }

  return result;
}

/**
 * Compute the total weight change from the first week's average to the last.
 */
export function getTotalWeightChange(
  weeklyAverages: { avgWeight: number }[],
): number {
  if (weeklyAverages.length < 2) return 0;
  const first = weeklyAverages[0].avgWeight;
  const last = weeklyAverages[weeklyAverages.length - 1].avgWeight;
  return parseFloat((last - first).toFixed(1));
}

/**
 * For the current week, return an array of 7 booleans indicating
 * whether a workout was completed each day.
 */
export function getWeeklyConsistency(
  completedDays: boolean[][],
  weekIndex: number,
): boolean[] {
  return completedDays[weekIndex] ?? Array(7).fill(false);
}

/**
 * Get BMI category label and color key.
 */
export function getBMICategory(bmi: number): {
  label: string;
  colorKey: 'underweight' | 'normal' | 'overweight' | 'obese' | 'extremeObese';
} {
  if (bmi < 18.5) return { label: 'Underweight', colorKey: 'underweight' };
  if (bmi < 25) return { label: 'Normal weight', colorKey: 'normal' };
  if (bmi < 30) return { label: 'Overweight', colorKey: 'overweight' };
  if (bmi < 35) return { label: 'Obese', colorKey: 'obese' };
  return { label: 'Extreme Obese', colorKey: 'extremeObese' };
}

/**
 * Placeholder: daily calorie data for the week.
 * In a real app this would come from a photo-based calorie tracker.
 * Returns calories per day (0 if not tracked).
 */
export function getWeeklyCalories(
  _weekIndex: number,
): number[] {
  // Stub: returns zeroes — to be replaced when calorie tracking is implemented
  return Array(7).fill(0);
}
