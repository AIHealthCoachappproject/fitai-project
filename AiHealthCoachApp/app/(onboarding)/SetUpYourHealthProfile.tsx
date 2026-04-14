import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import FormField from "@/components/ui/FormField";
import CustomButton from "@/components/ui/CustomButton";
import SelectButton from "@/components/ui/SelectButton";
import { GENDER_OPTIONS, ACTIVITY_LEVELS } from "@/components/constants/healthData";
import { useProfile } from "@/context/ProfileContext";

const SetUpYourHealthProfile = () => {
  const router = useRouter();
  const { setProfile } = useProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});

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

  const handleContinue = () => {
  if (!validate()) return;
  setIsSubmitting(true);

  setTimeout(() => {
    // Save to Profile Context
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

    setIsSubmitting(false);
    router.push({
      pathname: "/(onboarding)/ChooseYourBodyGoal",
      params: {
        bmi: currentBMI,
        weight: form.weight,
        height: form.height,
      }
    });
  }, 1500);
};

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }} showsVerticalScrollIndicator={false}>
        
        <View className="mb-10 mt-5">
          <Text className="text-4xl font-extrabold text-primary italic uppercase">Set Up Profile</Text>
        </View>

        {/* Username & Age (FormField จะมนตามมาตรฐานของมันอยู่แล้ว) */}
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

        {/* Gender - ปรับ rounded-2xl ให้มนเท่าช่องกรอกชื่อ */}
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
                containerStyles="flex-1 mx-1 h-14 rounded-2xl" // ✅ เพิ่มความมนระดับ 2xl
              />
            ))}
          </View>
          {errors.gender && <Text className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.gender}</Text>}
        </View>

        {/* Activity Level - ปรับความมนของการ์ดกิจกรรม */}
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
                // ปรับความสูงและดีไซน์ให้มนรับกับช่อง Input
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

        {/* BMI DISPLAY - ปรับให้มนเท่ากัน */}
        {parseFloat(currentBMI) > 0 && (
          <View className="mb-10 p-4 bg-secondary rounded-2xl border border-primary/20">
            <Text className="text-white text-center text-sm font-medium">
              Your BMI: <Text className="text-primary font-bold text-xl">{currentBMI}</Text>
            </Text>
          </View>
        )}

        {/* Continue Button - ปรับ rounded-full (เพื่อให้มนที่สุดและสะดุดตาเหมือนปุ่มหลัก) */}
        <CustomButton
          title="Continue"
          onPress={handleContinue}
          isLoading={isSubmitting}
          //  ปรับ h-16 และ rounded-full เพื่อความพรีเมียมและกดง่าย
          containerStyles="rounded-full h-16 mb-10" 
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SetUpYourHealthProfile;