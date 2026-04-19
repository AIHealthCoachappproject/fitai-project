import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import FormField from "@/components/ui/FormField";
import CustomButton from "@/components/ui/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "@/context/AuthContext";

const Register = () => {
  const router = useRouter();
  const { signUp } = useAuthContext();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    setErrors({ email: undefined, password: undefined });
    let isValid = true;
    const newErrors: { email?: string; password?: string } = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "Please enter your email";
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!form.password.trim()) {
      newErrors.password = "Please enter your password";
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signUp(form.email.trim(), form.password);
      if (!result.success) {
        Alert.alert("Registration Failed", result.error ?? "Could not create account");
      }
      // Routing handled by _layout.tsx: detects session + onboarding_completed=false → onboarding
    } catch (err) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6 py-10"
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center mb-8"
        >
          <Ionicons name="chevron-back" size={24} color="#39FF14" />
          <Text className="text-primary text-lg ml-1 font-semibold">Back</Text>
        </TouchableOpacity>

        <Text className="text-primary text-4xl font-bold mb-10 italic">
          REGISTER
        </Text>

        {/* Email Field */}
        <FormField
          title="Email"
          value={form.email}
          placeholder="example@email.com"
          handleChangeText={(e) => {
            setForm({ ...form, email: e });
            setErrors({ ...errors, email: undefined }); // พิมพ์แล้ว Error หาย
          }}
          otherStyles="mb-4"
          keyboardType="email-address"
          errorMessage={errors.email} // ส่ง Error ไปแสดงสีแดงใต้ช่อง
        />

        {/* Password Field */}
        <FormField
          title="Password"
          value={form.password}
          placeholder="enter your password"
          handleChangeText={(e) => {
            setForm({ ...form, password: e });
            setErrors({ ...errors, password: undefined });
          }}
          otherStyles="mb-4"
          errorMessage={errors.password}
        />

        {/* Register Button (เขียวสะท้อนแสง + มนเท่า Google) */}
        <CustomButton
          title="Register"
          onPress={handleRegister}
          isLoading={isSubmitting}
          containerStyles="w-full bg-[#39FF14] shadow-2xl shadow-[#39FF14]/40 rounded-2xl"
          textStyles="text-black font-bold"
        />

        {/* Divider */}
        <View className="flex-row items-center my-8">
          <View className="flex-1 h-[1px] bg-white/10" />
          <Text className="text-white/40 px-4 text-xs italic">
            or Register with
          </Text>
          <View className="flex-1 h-[1px] bg-white/10" />
        </View>

        {/* Google Register (มน 2xl เท่ากัน) */}
        <TouchableOpacity className="w-full h-14 border border-white/10 rounded-2xl items-center justify-center flex-row">
          <Ionicons name="logo-google" size={20} color="white" />
          <Text className="text-white font-semibold ml-3">Google Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Register;
