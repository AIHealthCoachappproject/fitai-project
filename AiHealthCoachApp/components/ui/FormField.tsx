import { View, Text, TextInput, TouchableOpacity, KeyboardTypeOptions } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";


interface FormFieldProps {
  title: string;
  value: string;
  placeholder: string;
  handleChangeText: (e: string) => void;
  otherStyles?: string;
  containerStyles?: string;
  // เปลี่ยนจากเดิม ให้ใช้ KeyboardTypeOptions ของ React Native โดยตรง
  keyboardType?: KeyboardTypeOptions; 
  errorMessage?: string;
  
}

const FormField = ({ 
  title, 
  value, 
  placeholder, 
  handleChangeText, 
  otherStyles, 
  containerStyles,
  keyboardType = "default", // กำหนดค่าเริ่มต้นเป็น default
  errorMessage 
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-primary font-medium ml-1 text-sm mb-3">{title}</Text>

      {/* เพิ่มการเปลี่ยนสีขอบเป็นสีแดงเมื่อมี Error */}
      <View className={`w-full h-16 px-4 bg-secondary rounded-3xl border flex-row items-center focus:border-primary ${
        errorMessage ? "border-red-500" : "border-white/10"
      }`}>
        <TextInput
          className="flex-1 text-white font-semibold text-base "
          value={value}
          placeholder={placeholder}
          placeholderTextColor={COLORS.muted}
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize="none" // ป้องกันพิมพ์ตัวใหญ่ตัวแรกอัตโนมัติ 
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons 
              name={showPassword ? "eye-off" : "eye"} 
              size={24} 
              color={COLORS.muted}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* ✅ แสดงข้อความ Error ใต้ช่องกรอก */}
      {errorMessage ? (
        <Text className="text-red-500 text-xs mt-1 ml-1 font-medium italic">
          * {errorMessage}
        </Text>
      ) : null}
    </View>
  );
};

export default FormField;