import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

interface CheckboxProps {
  label: string | React.ReactNode;
  checked: boolean;
  onPress: () => void;
  error?: string;
  touched?: boolean;
}

export default function Checkbox({
  label,
  checked,
  onPress,
  error,
  touched,
}: CheckboxProps) {
  const hasError = touched && error;
  const primaryColor = Colors?.dark?.primary || "#A3E635"; // ใช้สีเขียวจากธีม

  // 1. จัดการ Style ของกล่อง Checkbox ตามสถานะ
  // checked -> สีเขียว, error -> สีแดง, default -> สีเทาเข้ม
  const boxVariantClass = checked
    ? "bg-[#A3E635] border-[#A3E635]"
    : hasError
    ? "bg-transparent border-red-500"
    : "bg-transparent border-neutral-600";

  return (
    <View className="mb-5">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="flex-row items-start" // ใช้ items-start เผื่อ label มีหลายบรรทัด
      >
        {/* ตัวกล่อง Checkbox */}
        <View
          className={`w-6 h-6 rounded-md border-2 items-center justify-center transition-all ${boxVariantClass}`}
          style={checked ? {
            // ใส่เงา Glow เบาๆ เมื่อติ๊กถูก
            shadowColor: primaryColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 3,
          } : {}}
        >
          {checked && (
            <Ionicons name="checkmark" size={16} color="black" />
          )}
        </View>

        {/* ข้อความ Label */}
        <View className="ml-3 flex-1 pt-0.5">
          {typeof label === "string" ? (
            <Text className={`text-sm leading-5 ${hasError ? "text-red-400" : "text-neutral-400"}`}>
              {label}
            </Text>
          ) : (
            label
          )}
        </View>
      </TouchableOpacity>

      {/* แสดง Error Message */}
      {hasError && (
        <Text className="text-red-500 text-xs mt-1.5 ml-9 font-medium">
          {error}
        </Text>
      )}
    </View>
  );
}