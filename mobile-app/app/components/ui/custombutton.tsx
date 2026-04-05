import React from "react";
import { 
  TouchableOpacity, 
  Text, 
  ActivityIndicator, 
  ViewStyle, 
  Platform 
} from "react-native";
import { Colors } from "@/constants/theme";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export default function CustomButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
}: CustomButtonProps) {
  
  const theme = Colors.dark;

  // จัดกลุ่ม Class ตาม Variant
  const containerVariants = {
    primary: "bg-[#A3E635]", 
    secondary: "bg-transparent border-2 border-[#A3E635]",
    danger: "bg-red-500",
  };

  const textVariants = {
    primary: "text-black",
    secondary: "text-[#A3E635]",
    danger: "text-white",
  };

  // Logic สำหรับสี Loading Indicator
  const loaderColor = variant === "primary" ? "#000" : (variant === "danger" ? "#fff" : "#A3E635");

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      // ใช้ className แบบ Dynamic ตาม Variant และสถานะ Disabled
      className={`
        w-full py-4 rounded-2xl flex-row justify-center items-center
        ${disabled ? "bg-neutral-800 opacity-60" : containerVariants[variant]}
      `}
      style={[
        // เงา (Shadow) สำหรับ iOS/Android ที่ NativeWind บางทีคุมความฟุ้งยาก
        !disabled && variant !== "secondary" && {
          shadowColor: variant === "danger" ? "#EF4444" : "#A3E635",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={loaderColor} size="small" />
      ) : (
        <Text 
          className={`text-lg font-bold tracking-tight ${disabled ? "text-neutral-500" : textVariants[variant]}`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}