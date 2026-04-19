import { THAI_WORKOUT_LINKS } from '@/components/constants/workoutLinks';

export type Level = 'easy' | 'medium' | 'hard';

export type WorkoutVideo = {
  id: string;
  title: string;
  duration: string;
  calories: number;
  level: Level;
  resourceUrl: string;
  source: string;
  thumbnailUrl: string;
};

export const LEVEL_CONFIG: Record<Level, { label: string; color: string }> = {
  easy:   { label: 'Beginner',     color: '#39FF14' },
  medium: { label: 'Intermediate', color: '#FACC15' },
  hard:   { label: 'Advanced',     color: '#EF4444' },
};

export const WORKOUT_VIDEOS: WorkoutVideo[] = [
  // EASY - 5 VIDEOS (unique durations & calories)
  { id: '1', title: 'Beginner Cardio Workout',      duration: '20 min', calories: 150, level: 'easy',
    resourceUrl: THAI_WORKOUT_LINKS.easy1.url, source: THAI_WORKOUT_LINKS.easy1.source, thumbnailUrl: THAI_WORKOUT_LINKS.easy1.thumbnailUrl },
  { id: '2', title: 'Easy Full Body Stretch',       duration: '15 min', calories: 90,  level: 'easy',
    resourceUrl: THAI_WORKOUT_LINKS.easy2.url, source: THAI_WORKOUT_LINKS.easy2.source, thumbnailUrl: THAI_WORKOUT_LINKS.easy2.thumbnailUrl },
  { id: '3', title: 'Low Impact Morning Workout',   duration: '25 min', calories: 110, level: 'easy',
    resourceUrl: THAI_WORKOUT_LINKS.easy3.url, source: THAI_WORKOUT_LINKS.easy3.source, thumbnailUrl: THAI_WORKOUT_LINKS.easy3.thumbnailUrl },
  { id: '10', title: 'Beginner Yoga Flow',          duration: '18 min', calories: 85,  level: 'easy',
    resourceUrl: THAI_WORKOUT_LINKS.easy4.url, source: THAI_WORKOUT_LINKS.easy4.source, thumbnailUrl: THAI_WORKOUT_LINKS.easy4.thumbnailUrl },
  { id: '11', title: 'Gentle Pilates for Beginners',duration: '22 min', calories: 100, level: 'easy',
    resourceUrl: THAI_WORKOUT_LINKS.easy5.url, source: THAI_WORKOUT_LINKS.easy5.source, thumbnailUrl: THAI_WORKOUT_LINKS.easy5.thumbnailUrl },
  // MEDIUM - 5 VIDEOS (unique durations & calories)
  { id: '4', title: 'Full Body Strength Training',  duration: '30 min', calories: 220, level: 'medium',
    resourceUrl: THAI_WORKOUT_LINKS.medium1.url, source: THAI_WORKOUT_LINKS.medium1.source, thumbnailUrl: THAI_WORKOUT_LINKS.medium1.thumbnailUrl },
  { id: '5', title: 'Core & Abs Blast',             duration: '20 min', calories: 200, level: 'medium',
    resourceUrl: THAI_WORKOUT_LINKS.medium2.url, source: THAI_WORKOUT_LINKS.medium2.source, thumbnailUrl: THAI_WORKOUT_LINKS.medium2.thumbnailUrl },
  { id: '6', title: 'Intermediate Cardio Circuit',  duration: '25 min', calories: 280, level: 'medium',
    resourceUrl: THAI_WORKOUT_LINKS.medium3.url, source: THAI_WORKOUT_LINKS.medium3.source, thumbnailUrl: THAI_WORKOUT_LINKS.medium3.thumbnailUrl },
  { id: '12', title: 'Upper Body Toning',           duration: '28 min', calories: 240, level: 'medium',
    resourceUrl: THAI_WORKOUT_LINKS.medium4.url, source: THAI_WORKOUT_LINKS.medium4.source, thumbnailUrl: THAI_WORKOUT_LINKS.medium4.thumbnailUrl },
  { id: '13', title: 'Intermediate Dance Cardio',   duration: '35 min', calories: 260, level: 'medium',
    resourceUrl: THAI_WORKOUT_LINKS.medium5.url, source: THAI_WORKOUT_LINKS.medium5.source, thumbnailUrl: THAI_WORKOUT_LINKS.medium5.thumbnailUrl },
  // HARD - 5 VIDEOS (unique durations & calories)
  { id: '7', title: 'HIIT Fat Burner',              duration: '25 min', calories: 350, level: 'hard',
    resourceUrl: THAI_WORKOUT_LINKS.hard1.url, source: THAI_WORKOUT_LINKS.hard1.source, thumbnailUrl: THAI_WORKOUT_LINKS.hard1.thumbnailUrl },
  { id: '8', title: 'Advanced Power Training',      duration: '35 min', calories: 420, level: 'hard',
    resourceUrl: THAI_WORKOUT_LINKS.hard2.url, source: THAI_WORKOUT_LINKS.hard2.source, thumbnailUrl: THAI_WORKOUT_LINKS.hard2.thumbnailUrl },
  { id: '9', title: 'Extreme CrossFit Challenge',   duration: '40 min', calories: 480, level: 'hard',
    resourceUrl: THAI_WORKOUT_LINKS.hard3.url, source: THAI_WORKOUT_LINKS.hard3.source, thumbnailUrl: THAI_WORKOUT_LINKS.hard3.thumbnailUrl },
  { id: '14', title: 'Advanced Circuit Workout',     duration: '30 min', calories: 400, level: 'hard',
    resourceUrl: THAI_WORKOUT_LINKS.hard4.url, source: THAI_WORKOUT_LINKS.hard4.source, thumbnailUrl: THAI_WORKOUT_LINKS.hard4.thumbnailUrl },
  { id: '15', title: 'Maximum Strength Challenge',   duration: '45 min', calories: 500, level: 'hard',
    resourceUrl: THAI_WORKOUT_LINKS.hard5.url, source: THAI_WORKOUT_LINKS.hard5.source, thumbnailUrl: THAI_WORKOUT_LINKS.hard5.thumbnailUrl },
];