import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme"; // ดึงสีจากธีมมาใช้

interface CheckboxProps {
  label: string | React.ReactNode; // รองรับทั้งข้อความธรรมดาและ Component (เช่น Link)
  checked: boolean;
  onPress: () => void;
  error?: string;
  touched?: boolean;
}

export default function Checkbox({ label, checked, onPress, error, touched }: CheckboxProps) {
  const hasError = touched && error;
  const primaryColor = Colors?.dark?.primary || "#39FF14"; // สีเขียวสะท้อนแสง

  return (
    <View className="mb-6">
      <TouchableOpacity 
        onPress={onPress} 
        activeOpacity={0.7}
        className="flex-row items-center"
      >
        {/* ตัวกล่อง Checkbox */}
        <View 
          className={`w-5 h-5 rounded border-2 items-center justify-center`}
          style={{
            // ถ้า checked ให้พื้นหลังเป็นเขียว ถ้า error เป็นแดง ถ้าปกติเป็นเทาเข้ม
            backgroundColor: checked ? primaryColor : "transparent",
            borderColor: checked ? primaryColor : hasError ? "#EF4444" : "#4A4A4A",
          }}
        >
          {checked && <Ionicons name="checkmark" size={14} color="black" />}
        </View>

        {/* ข้อความ Label */}
        <View className="ml-3 flex-1">
           {/* เช็คว่าเป็น String หรือ Component */}
           {typeof label === 'string' ? (
             <Text className="text-[#AAA] text-sm">{label}</Text>
           ) : (
             label
           )}
        </View>
      </TouchableOpacity>

      {/* แสดง Error */}
      {hasError && (
        <Text className="text-red-500 text-xs mt-1 ml-8">
          {error}
        </Text>
      )}
    </View>
  );
}