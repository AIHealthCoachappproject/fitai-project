import { View, Text, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import FormField from "@/components/ui/FormField";
import CustomButton from "@/components/ui/CustomButton";
import SelectButton from "@/components/ui/SelectButton";
import { GENDER_OPTIONS, ACTIVITY_LEVELS } from "@/components/constants/healthData";
import { useProfile } from "@/context/ProfileContext";
import { useAuthContext } from "@/context/AuthContext";
import { calculateTDEE } from "@/lib/health";

const SetUpYourHealthProfile = () => {
  const router = useRouter();
  const { setProfile } = useProfile();
  const { upsertProfile } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    activityLevel: "",
    height: "",
    weight: "",
  });

  const weightNum = parseFloat(form.weight);
  const heightNum = parseFloat(form.height) / 100;
  const currentBMI = (weightNum > 0 && heightNum > 0) 
    ? (weightNum / (heightNum * heightNum)).toFixed(1) 
    : "0";

  const validate = () => {
    let newErrors: any = {};
    if (!form.name.trim()) newErrors.name = "Please fill in your username";
    if (!form.age.trim()) newErrors.age = "Please fill in your age";
    else if (!/^\d+$/.test(form.age.trim())) newErrors.age = "Please enter numbers only";
    if (!form.gender) newErrors.gender = "Please select your gender";
    if (!form.activityLevel) newErrors.activityLevel = "Please select your activity level";
    if (!form.height.trim()) newErrors.height = "Please fill in height";
    else if (!/^\d+$/.test(form.height.trim())) newErrors.height = "Please enter numbers only";
    if (!form.weight.trim()) newErrors.weight = "Please fill in weight";
    else if (!/^\d+$/.test(form.weight.trim())) newErrors.weight = "Please enter numbers only";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    console.log("[handleContinue] 1 — button pressed, running validation");
    if (!validate()) {
      console.log("[handleContinue] 1.1 — validation FAILED, aborting");
      return;
    }

    console.log("[handleContinue] 2 — validation passed, setting isSubmitting=true");
    setIsSubmitting(true);

    try {
      // ── Step 3: update local ProfileContext ──────────────────────────────
      console.log("[handleContinue] 3 — updating local ProfileContext");
      setProfile({
        name: form.name,
        age: form.age,
        gender: form.gender,
        activityLevel: form.activityLevel,
        height: form.height,
        weight: form.weight,
        bmi: currentBMI,
        profileImage: null,
      });

      // ── Step 4: build Supabase payload ───────────────────────────────────
      const activityDbValue =
        ACTIVITY_LEVELS.find((l) => l.label === form.activityLevel)?.dbValue ??
        form.activityLevel;
      const tdee = calculateTDEE(
        parseFloat(form.weight),
        parseFloat(form.height),
        parseInt(form.age, 10),
        form.gender,
        activityDbValue,
      );
      const payload = {
        name: form.name,
        weight_kg: parseFloat(form.weight),
        age: parseInt(form.age, 10),
        gender: form.gender.toLowerCase(),
        activity_level: activityDbValue,
        height_cm: parseFloat(form.height),
        daily_calorie_goal: tdee,
      };
      console.log("[handleContinue] 4 — Supabase payload built:", JSON.stringify(payload));

      // ── Step 5: send to Supabase (most likely hang point) ────────────────
      console.log("[handleContinue] 5 — calling upsertProfile, waiting for Supabase...");
      const result = await upsertProfile(payload);
      console.log("[handleContinue] 5.1 — upsertProfile resolved, result:", JSON.stringify(result));

      // ── Step 6: handle Supabase error ────────────────────────────────────
      if (!result.success) {
        console.warn("[handleContinue] 6 — upsertProfile returned error:", result.error);
        Alert.alert("Error", result.error ?? "Failed to save profile");
        return; // finally will still run and reset isSubmitting
      }

      // ── Step 7: navigate — use replace so Back can't return to this form ─
      console.log("[handleContinue] 7 — upsert successful, calling router.replace");
      router.replace({
        pathname: "/(onboarding)/ChooseYourBodyGoal",
        params: { bmi: currentBMI, weight: form.weight, height: form.height },
      });
      console.log("[handleContinue] 7.1 — router.replace called (navigation is async; screen will change shortly)");
    } catch (err) {
      console.error("[handleContinue] CATCH — unexpected error:", err);
      Alert.alert("Error", "Failed to save profile. Please try again.");
    } finally {
      console.log("[handleContinue] FINALLY — resetting isSubmitting=false");
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }} showsVerticalScrollIndicator={false}>
        
        <View className="mb-10 mt-5">
          <Text className="text-4xl font-extrabold text-primary italic uppercase">Set Up Profile</Text>
        </View>

        {/* Username & Age */}
        <View className="mb-6">
          <FormField
            title="Username"
            value={form.name}
            placeholder="enter your username"
            handleChangeText={(e) => {
              setForm({ ...form, name: e });
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
          />
          {errors.name && <Text className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.name}</Text>}
        </View>

        <View className="mb-6">
          <FormField
            title="Age"
            value={form.age}
            placeholder="enter your age"
            handleChangeText={(e) => {
              setForm({ ...form, age: e });
              if (errors.age) setErrors({ ...errors, age: undefined });
            }}
          />
          {errors.age && <Text className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.age}</Text>}
        </View>

        {/* Gender */}
        <View className="mb-8">
          <Text className="text-primary font-bold text-sm mb-4 ml-1 uppercase">Gender</Text>
          <View className="flex-row justify-between">
            {GENDER_OPTIONS.map((gender) => (
              <SelectButton
                key={gender}
                label={gender}
                isSelected={form.gender === gender}
                onPress={() => {
                  setForm({ ...form, gender });
                  if (errors.gender) setErrors({ ...errors, gender: undefined });
                }}
                containerStyles="flex-1 mx-1 h-14 rounded-2xl"
              />
            ))}
          </View>
          {errors.gender && <Text className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.gender}</Text>}
        </View>

        {/* Activity Level */}
        <View className="mb-8">
          <Text className="text-primary font-bold text-sm mb-4 ml-1 uppercase">Activity Level</Text>
          <View style={{ gap: 12 }}> 
            {ACTIVITY_LEVELS.map((level) => (
              <SelectButton
                key={level.label}
                label={level.label}
                isSelected={form.activityLevel === level.label}
                onPress={() => {
                  setForm({ ...form, activityLevel: level.label });
                  if (errors.activityLevel) setErrors({ ...errors, activityLevel: undefined });
                }}
                containerStyles="w-full h-20 items-start px-5 py-3 rounded-2xl" 
                description={level.desc}
              />
            ))}
          </View>
          {errors.activityLevel && <Text className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.activityLevel}</Text>}
        </View>

        {/* Height & Weight */}
        <View className="flex-row justify-between mb-8">
          <View className="w-[48%]">
            <FormField
              title="Height"
              value={form.height}
              placeholder="cm" 
              handleChangeText={(e) => {
                setForm({ ...form, height: e });
                if (errors.height) setErrors({ ...errors, height: undefined });
              }}
            />
            {errors.height && <Text className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.height}</Text>}
          </View>
          <View className="w-[48%]">
            <FormField
              title="Weight"
              value={form.weight}
              placeholder="kg" 
              handleChangeText={(e) => {
                setForm({ ...form, weight: e });
                if (errors.weight) setErrors({ ...errors, weight: undefined });
              }}
            />
            {errors.weight && <Text className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.weight}</Text>}
          </View>
        </View>

        {/* BMI DISPLAY */}
        {parseFloat(currentBMI) > 0 && (
          <View className="mb-10 p-4 bg-secondary rounded-2xl border border-primary/20">
            <Text className="text-white text-center text-sm font-medium">
              Your BMI: <Text className="text-primary font-bold text-xl">{currentBMI}</Text>
            </Text>
          </View>
        )}

        {/* Continue Button */}
        <CustomButton
          title="Continue"
          onPress={handleContinue}
          isLoading={isSubmitting}
          containerStyles="rounded-full h-16 mb-10" 
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SetUpYourHealthProfile;