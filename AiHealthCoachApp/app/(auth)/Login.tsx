import { View, Text, ScrollView, TouchableOpacity, } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import FormField from "@/components/ui/FormField";
import CustomButton from "@/components/ui/CustomButton";
import { Ionicons } from "@expo/vector-icons";

const Login = () => {
  const router = useRouter();

  // 1. States สำหรับข้อมูล และ ข้อความ Error
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = () => {
    // รีเซ็ต Error ก่อนตรวจสอบใหม่
    setErrors({ email: undefined, password: undefined });
    let isValid = true;
    const newErrors: { email?: string; password?: string } = { email: undefined, password: undefined };

    // ตรวจสอบ Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "กรุณากรอกอีเมล";
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "กรุณากรอกอีเมลให้ถูกต้อง";
      isValid = false;
    }

    // ตรวจสอบ Password
    if (!form.password.trim()) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "รหัสผ่านอย่างน้อย 6 ตัว";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors); // แสดง Error สีแดงใต้ช่อง
      return;
    }

    setIsSubmitting(true);
    // Logic การเข้าสู่ระบบ
    // ในหน้า Login.tsx
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/(onboarding)/SetUpYourHealthProfile"); // ไปหน้าตั้งค่าโปรไฟล์
    }, 1000);
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
          Login
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

        {/* Login Button (เขียวสะท้อนแสง + มนเท่า Google) */}
        <CustomButton
          title="Login"
          onPress={handleLogin}
          isLoading={isSubmitting}
          containerStyles="w-full bg-[#39FF14] shadow-2xl shadow-[#39FF14]/40 rounded-2xl"
          textStyles="text-black font-bold"
        />

        {/* Divider */}
        <View className="flex-row items-center my-8">
          <View className="flex-1 h-[1px] bg-white/10" />
          <Text className="text-white/40 px-4 text-xs italic">
            or Login with
          </Text>
          <View className="flex-1 h-[1px] bg-white/10" />
        </View>

        {/* Google Login (มน 2xl เท่ากัน) */}
        <TouchableOpacity className="w-full h-14 border border-white/10 rounded-2xl items-center justify-center flex-row">
          <Ionicons name="logo-google" size={20} color="white" />
          <Text className="text-white font-semibold ml-3">Google Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Login;
