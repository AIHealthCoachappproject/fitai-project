import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StatusBar,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Types ────────────────────────────────────────────────────────────────────

type WorkoutType = "Cardio" | "Strength" | "HIIT" | "Rest";
type Intensity = "Low" | "Medium" | "High" | "Rest";

interface Exercise {
  name: string;
  detail: string;
}

interface DayWorkout {
  dayLabel: string;
  dayNumber: number;
  type: WorkoutType;
  duration: string;
  title: string;
  description: string;
  intensity: Intensity;
  exercises: Exercise[];
}

interface WeekData {
  weekNumber: number;
  theme: string;
  days: DayWorkout[];
}

// ─── Config Maps ──────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  WorkoutType,
  { color: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }
> = {
  Cardio: { color: "#3B82F6", icon: "run-fast" },
  Strength: { color: "#F59E0B", icon: "dumbbell" },
  HIIT: { color: "#EF4444", icon: "fire" },
  Rest: { color: "#6B7280", icon: "sleep" },
};

const INTENSITY_CONFIG: Record<Intensity, { color: string; label: string }> = {
  Low: { color: "#10B981", label: "Low" },
  Medium: { color: "#F59E0B", label: "Medium" },
  High: { color: "#EF4444", label: "High" },
  Rest: { color: "#6B7280", label: "Rest" },
};

// ─── 30-Day Workout Plan Data ─────────────────────────────────────────────────

const WORKOUT_PLAN: WeekData[] = [
  {
    weekNumber: 1,
    theme: "Base Fitness",
    days: [
      {
        dayLabel: "Mon", dayNumber: 1, type: "Cardio", duration: "40m",
        title: "Moderate Cardio",
        description: "Build your aerobic base with steady-state cardio. Focus on a consistent pace that keeps your heart rate in the fat-burning zone.",
        intensity: "Medium",
        exercises: [
          { name: "Running / Cycling", detail: "40 minutes @ 65% max HR" },
          { name: "Cool Down Stretch", detail: "5 minutes" },
        ],
      },
      {
        dayLabel: "Tue", dayNumber: 2, type: "Strength", duration: "45m",
        title: "Upper Body Push",
        description: "Target chest, shoulders, and triceps to build foundational upper body strength.",
        intensity: "Medium",
        exercises: [
          { name: "Push-ups", detail: "3 × 12 reps" },
          { name: "Dumbbell Shoulder Press", detail: "3 × 10 reps" },
          { name: "Tricep Dips", detail: "3 × 15 reps" },
        ],
      },
      {
        dayLabel: "Wed", dayNumber: 3, type: "Rest", duration: "Rest",
        title: "Active Recovery",
        description: "Rest and recover. Light walking or stretching is encouraged. Focus on hydration and sleep.",
        intensity: "Rest",
        exercises: [{ name: "Light Walk / Stretching", detail: "20–30 min optional" }],
      },
      {
        dayLabel: "Thu", dayNumber: 4, type: "HIIT", duration: "30m",
        title: "HIIT Intervals",
        description: "High-intensity intervals to boost metabolism and cardiovascular fitness. Push hard on the work periods.",
        intensity: "High",
        exercises: [
          { name: "Jumping Jacks", detail: "30 sec on / 15 sec off × 5" },
          { name: "Burpees", detail: "30 sec on / 15 sec off × 5" },
          { name: "Mountain Climbers", detail: "30 sec on / 15 sec off × 5" },
        ],
      },
      {
        dayLabel: "Fri", dayNumber: 5, type: "Strength", duration: "45m",
        title: "Lower Body Strength",
        description: "Focus on quads, hamstrings, and glutes to build a strong foundation for all athletic movement.",
        intensity: "Medium",
        exercises: [
          { name: "Squats", detail: "3 × 15 reps" },
          { name: "Lunges", detail: "3 × 12 reps each side" },
          { name: "Glute Bridges", detail: "3 × 20 reps" },
        ],
      },
      {
        dayLabel: "Sat", dayNumber: 6, type: "Cardio", duration: "40m",
        title: "Long Steady Cardio",
        description: "A longer, easy-paced cardio session to build endurance and burn fat without stressing your muscles.",
        intensity: "Low",
        exercises: [
          { name: "Brisk Walk / Jog", detail: "40 minutes steady pace" },
          { name: "Cool Down", detail: "5 minutes stretching" },
        ],
      },
      {
        dayLabel: "Sun", dayNumber: 7, type: "Rest", duration: "Rest",
        title: "Full Rest Day",
        description: "Complete rest for muscle recovery. Hydrate well and prepare mentally for Week 2.",
        intensity: "Rest",
        exercises: [{ name: "Rest & Hydration", detail: "No exercise required" }],
      },
    ],
  },
  {
    weekNumber: 2,
    theme: "Building Momentum",
    days: [
      {
        dayLabel: "Mon", dayNumber: 8, type: "HIIT", duration: "35m",
        title: "Cardio HIIT Blast",
        description: "Step up the intensity with a longer HIIT session to accelerate calorie burn and cardiovascular gains.",
        intensity: "High",
        exercises: [
          { name: "Jump Rope", detail: "40 sec on / 20 sec off × 6" },
          { name: "High Knees", detail: "40 sec on / 20 sec off × 6" },
          { name: "Box Jumps", detail: "40 sec on / 20 sec off × 4" },
        ],
      },
      {
        dayLabel: "Tue", dayNumber: 9, type: "Strength", duration: "50m",
        title: "Pull Day",
        description: "Back and bicep focus for balanced upper body development. Slow and controlled reps.",
        intensity: "Medium",
        exercises: [
          { name: "Pull-ups / Lat Pulldown", detail: "3 × 10 reps" },
          { name: "Dumbbell Rows", detail: "3 × 12 reps" },
          { name: "Bicep Curls", detail: "3 × 15 reps" },
        ],
      },
      {
        dayLabel: "Wed", dayNumber: 10, type: "Cardio", duration: "45m",
        title: "Endurance Run",
        description: "Moderate pace run to build aerobic capacity. Find a rhythm you can sustain for the full session.",
        intensity: "Medium",
        exercises: [
          { name: "Running", detail: "45 minutes @ 70% max HR" },
          { name: "Stretching", detail: "5–10 minutes" },
        ],
      },
      {
        dayLabel: "Thu", dayNumber: 11, type: "Rest", duration: "Rest",
        title: "Recovery Day",
        description: "Mid-week rest to allow muscles to repair and grow stronger before the Friday push.",
        intensity: "Rest",
        exercises: [{ name: "Yoga / Light Stretching", detail: "20 minutes optional" }],
      },
      {
        dayLabel: "Fri", dayNumber: 12, type: "HIIT", duration: "35m",
        title: "Full Body HIIT",
        description: "Engage every muscle group with compound HIIT movements for maximum metabolic output.",
        intensity: "High",
        exercises: [
          { name: "Squat Jumps", detail: "30 sec on / 15 sec off × 5" },
          { name: "Push-up to T", detail: "30 sec on / 15 sec off × 5" },
          { name: "Plank Hold", detail: "30 sec on / 15 sec off × 5" },
        ],
      },
      {
        dayLabel: "Sat", dayNumber: 13, type: "Strength", duration: "50m",
        title: "Leg Power Day",
        description: "Increase leg training volume for greater strength and muscle mass. Focus on depth and form.",
        intensity: "High",
        exercises: [
          { name: "Romanian Deadlifts", detail: "4 × 10 reps" },
          { name: "Step-ups", detail: "3 × 12 reps each" },
          { name: "Calf Raises", detail: "3 × 25 reps" },
        ],
      },
      {
        dayLabel: "Sun", dayNumber: 14, type: "Rest", duration: "Rest",
        title: "Full Rest Day",
        description: "Well-deserved rest after 6 active days. Eat well and prepare for Week 3's peak training.",
        intensity: "Rest",
        exercises: [{ name: "Rest & Nutrition Focus", detail: "No exercise required" }],
      },
    ],
  },
  {
    weekNumber: 3,
    theme: "Peak Training",
    days: [
      {
        dayLabel: "Mon", dayNumber: 15, type: "Strength", duration: "55m",
        title: "Upper Body Max",
        description: "Push your upper body to new limits with increased weight and volume. Progressive overload is key.",
        intensity: "High",
        exercises: [
          { name: "Bench Press / Push-ups", detail: "4 × 10 reps" },
          { name: "Overhead Press", detail: "4 × 8 reps" },
          { name: "Tricep Extensions", detail: "3 × 12 reps" },
        ],
      },
      {
        dayLabel: "Tue", dayNumber: 16, type: "HIIT", duration: "40m",
        title: "Tabata Challenge",
        description: "Classic Tabata protocol — 20 seconds all out, 10 seconds rest. Eight rounds per exercise.",
        intensity: "High",
        exercises: [
          { name: "Burpees", detail: "20 sec on / 10 sec off × 8" },
          { name: "Sprint in place", detail: "20 sec on / 10 sec off × 8" },
          { name: "Jump Squats", detail: "20 sec on / 10 sec off × 8" },
        ],
      },
      {
        dayLabel: "Wed", dayNumber: 17, type: "Cardio", duration: "50m",
        title: "Long Distance Run",
        description: "Your longest cardio session yet. Pace yourself, stay hydrated, and enjoy the journey.",
        intensity: "Medium",
        exercises: [
          { name: "Running / Cycling", detail: "50 minutes steady" },
          { name: "Foam Rolling", detail: "10 minutes" },
        ],
      },
      {
        dayLabel: "Thu", dayNumber: 18, type: "Strength", duration: "55m",
        title: "Back & Bicep Max",
        description: "Pull-focused session to build a strong, defined back. Control every rep on the way down.",
        intensity: "High",
        exercises: [
          { name: "Weighted Pull-ups", detail: "4 × 8 reps" },
          { name: "Cable Rows", detail: "4 × 10 reps" },
          { name: "Hammer Curls", detail: "3 × 12 reps" },
        ],
      },
      {
        dayLabel: "Fri", dayNumber: 19, type: "Rest", duration: "Rest",
        title: "Recovery Day",
        description: "Rest before the final weekend sessions. Prioritize sleep and high-protein nutrition.",
        intensity: "Rest",
        exercises: [{ name: "Light Stretching / Meditation", detail: "15–20 minutes" }],
      },
      {
        dayLabel: "Sat", dayNumber: 20, type: "HIIT", duration: "40m",
        title: "Sprint Intervals",
        description: "Outdoor sprint session for maximum calorie burn and speed development. Go all out.",
        intensity: "High",
        exercises: [
          { name: "Sprint 200m", detail: "8 reps with 90 sec rest" },
          { name: "Walking Recovery", detail: "Between each sprint" },
        ],
      },
      {
        dayLabel: "Sun", dayNumber: 21, type: "Rest", duration: "Rest",
        title: "Full Rest Day",
        description: "Three weeks done! Rest completely, reflect on your progress, and prepare for the final push.",
        intensity: "Rest",
        exercises: [{ name: "Rest & Reflect", detail: "No exercise required" }],
      },
    ],
  },
  {
    weekNumber: 4,
    theme: "Power & Endurance",
    days: [
      {
        dayLabel: "Mon", dayNumber: 22, type: "HIIT", duration: "45m",
        title: "Power HIIT",
        description: "Final week — push harder than ever before. Max effort on every interval. No holding back.",
        intensity: "High",
        exercises: [
          { name: "Plyometric Push-ups", detail: "30 sec on / 15 sec off × 6" },
          { name: "Jump Lunges", detail: "30 sec on / 15 sec off × 6" },
          { name: "Tuck Jumps", detail: "30 sec on / 15 sec off × 5" },
        ],
      },
      {
        dayLabel: "Tue", dayNumber: 23, type: "Strength", duration: "60m",
        title: "Full Body Strength",
        description: "Compound movements only. Heavy weight, full range of motion, and perfect form throughout.",
        intensity: "High",
        exercises: [
          { name: "Deadlifts", detail: "4 × 6 reps" },
          { name: "Bench Press", detail: "4 × 8 reps" },
          { name: "Pull-ups", detail: "4 × max reps" },
        ],
      },
      {
        dayLabel: "Wed", dayNumber: 24, type: "Cardio", duration: "55m",
        title: "Endurance Challenge",
        description: "Your longest and most challenging cardio session of the entire 30-day program. You've earned this.",
        intensity: "Medium",
        exercises: [
          { name: "Running / Swimming", detail: "55 minutes @ 70% HR" },
          { name: "Full Body Cool Down", detail: "10 minutes stretching" },
        ],
      },
      {
        dayLabel: "Thu", dayNumber: 25, type: "HIIT", duration: "45m",
        title: "Metabolic Finisher",
        description: "Complex HIIT circuit designed to torch remaining fat stores and spike your metabolism.",
        intensity: "High",
        exercises: [
          { name: "Kettlebell Swings", detail: "45 sec on / 15 sec off × 6" },
          { name: "Battle Ropes", detail: "45 sec on / 15 sec off × 6" },
          { name: "Sled Push / Sprint", detail: "45 sec on / 15 sec off × 4" },
        ],
      },
      {
        dayLabel: "Fri", dayNumber: 26, type: "Strength", duration: "60m",
        title: "Legs & Glutes Max",
        description: "Final lower body session of the program. Go heavy and complete every single rep.",
        intensity: "High",
        exercises: [
          { name: "Back Squats", detail: "5 × 5 reps" },
          { name: "Bulgarian Split Squats", detail: "4 × 10 each leg" },
          { name: "Hip Thrusts", detail: "4 × 12 reps" },
        ],
      },
      {
        dayLabel: "Sat", dayNumber: 27, type: "Cardio", duration: "55m",
        title: "Victory Run",
        description: "You made it to the final cardio session. Celebrate every step — you've transformed yourself.",
        intensity: "Low",
        exercises: [
          { name: "Easy Run / Walk", detail: "55 minutes at enjoyment pace" },
          { name: "Full Body Stretch", detail: "15 minutes" },
        ],
      },
      {
        dayLabel: "Sun", dayNumber: 28, type: "Rest", duration: "Rest",
        title: "Program Complete!",
        description: "You have completed the 30-Day FitAI Program! Rest, celebrate your achievement, and plan your next fitness challenge.",
        intensity: "Rest",
        exercises: [{ name: "Celebrate & Rest", detail: "28 days — DONE!" }],
      },
    ],
  },
];

const TOTAL_DAYS = WORKOUT_PLAN.reduce((acc, w) => acc + w.days.length, 0);

// ─── WorkoutDetailModal ───────────────────────────────────────────────────────

interface WorkoutDetailModalProps {
  visible: boolean;
  day: DayWorkout | null;
  isCompleted: boolean;
  onClose: () => void;
  onMarkComplete: (dayNumber: number) => void;
}

function WorkoutDetailModal({
  visible,
  day,
  isCompleted,
  onClose,
  onMarkComplete,
}: WorkoutDetailModalProps) {
  if (!day) return null;

  const typeConfig = TYPE_CONFIG[day.type];
  const intensityConfig = INTENSITY_CONFIG[day.intensity];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={s.modalOverlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          onPress={onClose}
          activeOpacity={1}
        />
        <View style={s.modalSheet}>
          {/* Handle */}
          <View style={s.modalHandle} />

          {/* Close Button */}
          <TouchableOpacity style={s.closeBtn} onPress={onClose} hitSlop={12}>
            <Ionicons name="close" size={20} color={COLORS.muted} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Type Badge */}
            <View
              style={[
                s.typeBadge,
                { backgroundColor: typeConfig.color + "22" },
              ]}
            >
              <MaterialCommunityIcons
                name={typeConfig.icon}
                size={14}
                color={typeConfig.color}
              />
              <Text style={[s.typeBadgeText, { color: typeConfig.color }]}>
                {day.type}
              </Text>
            </View>

            {/* Title */}
            <Text style={s.modalTitle}>{day.title}</Text>

            {/* Subtitle */}
            <Text style={s.modalSubtitle}>
              Day {day.dayNumber} · {day.dayLabel}
            </Text>

            {/* Pills Row */}
            <View style={s.pillsRow}>
              <View style={s.pillDuration}>
                <Ionicons
                  name="time-outline"
                  size={13}
                  color={COLORS.primary}
                />
                <Text style={s.pillDurationText}>{day.duration}</Text>
              </View>
              <View
                style={[
                  s.pillIntensity,
                  { backgroundColor: intensityConfig.color + "22" },
                ]}
              >
                <MaterialCommunityIcons
                  name="gauge"
                  size={13}
                  color={intensityConfig.color}
                />
                <Text
                  style={[s.pillIntensityText, { color: intensityConfig.color }]}
                >
                  {intensityConfig.label} Intensity
                </Text>
              </View>
            </View>

            {/* Description */}
            <Text style={s.modalDesc}>{day.description}</Text>

            {/* Divider */}
            <View style={s.divider} />

            {/* Exercises */}
            <Text style={s.sectionLabel}>EXERCISES</Text>
            {day.exercises.map((ex, i) => (
              <View key={i} style={s.exerciseRow}>
                <View
                  style={[s.exDot, { backgroundColor: typeConfig.color }]}
                />
                <View style={{ flex: 1 }}>
                  <Text style={s.exName}>{ex.name}</Text>
                  <Text style={s.exDetail}>{ex.detail}</Text>
                </View>
              </View>
            ))}

            {/* Mark Complete Button */}
            <TouchableOpacity
              style={[
                s.completeBtn,
                isCompleted && s.completeBtnDone,
              ]}
              onPress={() => {
                if (!isCompleted) onMarkComplete(day.dayNumber);
              }}
              activeOpacity={0.85}
            >
              {isCompleted ? (
                <>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={[s.completeBtnText, { color: COLORS.primary }]}>
                    Completed!
                  </Text>
                </>
              ) : (
                <Text style={s.completeBtnText}>Mark as Complete</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── DayButton ────────────────────────────────────────────────────────────────

const DAY_BTN_SIZE =
  (SCREEN_WIDTH - 32 - 32 - 6 * 6) / 7; // screen pad + card pad + 6 gaps

function DayButton({
  day,
  isCompleted,
  onPress,
}: {
  day: DayWorkout;
  isCompleted: boolean;
  onPress: () => void;
}) {
  const typeConfig = TYPE_CONFIG[day.type];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{ width: DAY_BTN_SIZE }}
    >
      <View
        style={[
          s.dayBtn,
          {
            borderColor: isCompleted ? COLORS.primary : COLORS.border,
            backgroundColor: isCompleted ? COLORS.primary + "18" : "#111",
          },
        ]}
      >
        {isCompleted && (
          <Ionicons
            name="checkmark-circle"
            size={10}
            color={COLORS.primary}
            style={s.dayCheckIcon}
          />
        )}
        <Text
          style={[
            s.dayBtnLabel,
            { color: isCompleted ? COLORS.primary : COLORS.white },
          ]}
        >
          {day.dayLabel}
        </Text>
        <View
          style={[s.dayTypeDot, { backgroundColor: typeConfig.color }]}
        />
        <Text style={s.dayBtnDuration}>{day.duration}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── WeekCard ─────────────────────────────────────────────────────────────────

function WeekCard({
  week,
  completedDays,
  onDayPress,
}: {
  week: WeekData;
  completedDays: Set<number>;
  onDayPress: (day: DayWorkout) => void;
}) {
  const completedCount = week.days.filter((d) =>
    completedDays.has(d.dayNumber)
  ).length;
  const progress = completedCount / week.days.length;

  return (
    <View style={s.weekCard}>
      {/* Header Row */}
      <View style={s.weekHeader}>
        <View>
          <Text style={s.weekTitle}>Week {week.weekNumber}</Text>
          <Text style={s.weekTheme}>{week.theme}</Text>
        </View>
        <Text style={s.weekCount}>
          {completedCount}
          <Text style={s.weekCountTotal}>/7</Text>
        </Text>
      </View>

      {/* Day Grid */}
      <View style={s.dayGrid}>
        {week.days.map((day) => (
          <DayButton
            key={day.dayNumber}
            day={day}
            isCompleted={completedDays.has(day.dayNumber)}
            onPress={() => onDayPress(day)}
          />
        ))}
      </View>

      {/* Progress Bar */}
      <View style={s.progressTrack}>
        <View
          style={[
            s.progressFill,
            { width: `${Math.round(progress * 100)}%` },
          ]}
        />
      </View>
      <Text style={s.progressLabel}>{Math.round(progress * 100)}% complete</Text>
    </View>
  );
}

// ─── DailyPlanScreen ─────────────────────────────────────────────────────────

export default function DailyPlanScreen() {
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [selectedDay, setSelectedDay] = useState<DayWorkout | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleDayPress = useCallback((day: DayWorkout) => {
    setSelectedDay(day);
    setModalVisible(true);
  }, []);

  const handleMarkComplete = useCallback((dayNumber: number) => {
    setCompletedDays((prev) => {
      const next = new Set(prev);
      next.add(dayNumber);
      return next;
    });
    setModalVisible(false);
  }, []);

  const overallProgress = completedDays.size / TOTAL_DAYS;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* ─── Header ─── */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={s.backBtn}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.white} />
        </TouchableOpacity>

        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>Your 30-Day Plan</Text>
          <Text style={s.headerSub}>
            {completedDays.size}/{TOTAL_DAYS} completed
          </Text>
        </View>

        {/* Spacer to balance back button */}
        <View style={{ width: 40 }} />
      </View>

      {/* ─── Overall Progress Bar ─── */}
      <View style={s.overallBarWrap}>
        <View style={s.overallBarTrack}>
          <View
            style={[
              s.overallBarFill,
              { width: `${Math.round(overallProgress * 100)}%` },
            ]}
          />
        </View>
        <Text style={s.overallBarLabel}>
          {Math.round(overallProgress * 100)}% of program complete
        </Text>
      </View>

      {/* ─── Week Cards ─── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {WORKOUT_PLAN.map((week) => (
          <WeekCard
            key={week.weekNumber}
            week={week}
            completedDays={completedDays}
            onDayPress={handleDayPress}
          />
        ))}
      </ScrollView>

      {/* ─── Workout Detail Modal ─── */}
      <WorkoutDetailModal
        visible={modalVisible}
        day={selectedDay}
        isCompleted={
          selectedDay ? completedDays.has(selectedDay.dayNumber) : false
        }
        onClose={() => setModalVisible(false)}
        onMarkComplete={handleMarkComplete}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.white,
  },
  headerSub: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },

  // Overall progress
  overallBarWrap: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
  },
  overallBarTrack: {
    height: 4,
    backgroundColor: COLORS.secondary,
    borderRadius: 2,
    overflow: "hidden",
  },
  overallBarFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  overallBarLabel: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 5,
    textAlign: "right",
  },

  // Scroll
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 120,
    gap: 14,
  },

  // Week Card
  weekCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
  },
  weekTheme: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  weekCount: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
  weekCountTotal: {
    color: COLORS.muted,
    fontWeight: "400",
  },

  // Day Grid
  dayGrid: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 14,
  },
  dayBtn: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 62,
    position: "relative",
  },
  dayCheckIcon: {
    position: "absolute",
    top: 3,
    right: 3,
  },
  dayBtnLabel: {
    fontSize: 9,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  dayTypeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  dayBtnDuration: {
    fontSize: 8,
    color: COLORS.muted,
    fontWeight: "500",
  },

  // Progress Bar
  progressTrack: {
    height: 3,
    backgroundColor: "#2A2A2A",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 5,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 11,
    color: COLORS.muted,
    textAlign: "right",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#0C0C0C",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 44,
    maxHeight: "82%",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  modalHandle: {
    width: 38,
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 14,
  },
  closeBtn: {
    alignSelf: "flex-end",
    padding: 4,
    marginBottom: 4,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.primary,
    lineHeight: 32,
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 16,
  },
  pillsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  pillDuration: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pillDurationText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.white,
  },
  pillIntensity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pillIntensityText: {
    fontSize: 13,
    fontWeight: "600",
  },
  modalDesc: {
    fontSize: 14,
    color: COLORS.muted,
    lineHeight: 22,
    marginBottom: 20,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.muted,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  exDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
  },
  exName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
  },
  exDetail: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  completeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 17,
    marginTop: 26,
  },
  completeBtnDone: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  completeBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.black,
  },
});
