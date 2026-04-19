const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  'Sedentary': 1.2,
  'Lightly Active': 1.375,
  'Moderately Active': 1.55,
  'Very Active': 1.725,
};

function getActivityMultiplier(activityLevel: string): number {
  for (const [key, value] of Object.entries(ACTIVITY_MULTIPLIERS)) {
    if (activityLevel.includes(key)) return value;
  }
  return 1.2;
}

export function calculateTDEE(
  weight_kg: number,
  height_cm: number,
  age: number,
  gender: string,
  activity_level: string,
): number {
  if (!weight_kg || !height_cm || !age) return 0;

  let bmr: number;
  const g = gender.toLowerCase();
  if (g === 'male') {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
  } else if (g === 'female') {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
  } else {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 78;
  }

  return Math.round(bmr * getActivityMultiplier(activity_level));
}
