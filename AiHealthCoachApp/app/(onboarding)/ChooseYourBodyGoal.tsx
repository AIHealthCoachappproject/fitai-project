import { View, Text, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import CustomButton from "@/components/ui/CustomButton";
import SelectButton from "@/components/ui/SelectButton";
import { useAuthContext } from "@/context/AuthContext";

const BODY_GOALS = [
  { id: "weight_loss", label: "Weight Loss", icon: "🏃", desc: "Burn fat and get lean" },
  { id: "muscle_gain", label: "Muscle Gain", icon: "💪", desc: "Build strength and mass" },
  { id: "toned_body", label: "Toned Body", icon: "🧘", desc: "Shape and define your muscles" },
  { id: "healthy", label: "Healthy Lifestyle", icon: "🥗", desc: "Stay fit and eat well" },
];

const ChooseYourBodyGoal = () => {
  const router = useRouter();
  const { upsertProfile } = useAuthContext();
  const [selectedGoal, setSelectedGoal] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!selectedGoal) {
      setError("Please select your goal");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await upsertProfile({ goal: selectedGoal, onboarding_completed: true });
      if (!result.success) {
        Alert.alert("Error", result.error ?? "Failed to save goal");
        return;
      }
      router.push("/loading");
    } catch (err) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-5">
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
        >
          {/* Header */}
          <View className="mb-10 mt-5">
            <Text className="text-3xl font-extrabold text-white italic uppercase text-center tracking-wider">
              Choose Your
            </Text>
            <Text className="text-3xl font-extrabold text-white italic uppercase text-center tracking-wider">
              Body Goal
            </Text>
            <Text className="text-secondary-text text-center mt-3 text-base">
              Select the best path for your fitness
            </Text>
          </View>

          {/* Goal Selection List */}
          <View style={{ gap: 16 }}> 
            {BODY_GOALS.map((goal) => (
              <SelectButton
                key={goal.id}
                label={goal.label}
                icon={goal.icon}
                description={goal.desc}
                isSelected={selectedGoal === goal.id}
                onPress={() => {
                  setSelectedGoal(goal.id);
                  setError("");
                }}
                // การ์ดมนพิเศษ 32px
                containerStyles="h-28 rounded-[32px]" 
                textStyles="text-xl"
              />
            ))}
          </View>

          {error ? (
            <Text className="text-red-500 text-center font-medium mt-6">{error}</Text>
          ) : null}
          
          {/* ส่วนของปุ่มด้านล่าง - เรียกใช้แบบ Reusable */}
          <View className="mt-14 mb-6"> 
            <CustomButton 
              title="Continue" 
              onPress={handleContinue} 
              // ไม่ต้องส่ง h-16 หรือ rounded-full มาแล้ว เพราะดึงจากแม่แบบอัตโนมัติ
            />
            
            <View className="mt-4">
              <CustomButton 
                title="Back" 
                variant="outline" // ใช้โหมดขอบขาวโปร่งใสที่สร้างไว้
                onPress={() => router.back()} 
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ChooseYourBodyGoal;