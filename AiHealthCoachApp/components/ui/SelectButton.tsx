import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

interface SelectButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  icon?: string; //  เพิ่มไอคอน (Optional)
  description?: string; //  เพิ่มคำอธิบาย (Optional)
  containerStyles?: string;
  textStyles?: string;
}

const SelectButton = ({ 
  label, 
  isSelected, 
  onPress, 
  icon, 
  description, 
  containerStyles, 
  textStyles 
}: SelectButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      //  ใช้สี border ตามสถานะการเลือก
      className={`border-2 rounded-2xl p-4 flex-row items-center ${
        isSelected ? "border-primary bg-primary/10" : "border-secondary-text/20 bg-secondary"
      } ${containerStyles}`}
    >
      {/*  แสดงไอคอนเฉพาะถ้ามีการส่งมา (ไม่กระทบหน้าเก่า) */}
      {icon && (
        <View className="mr-4 w-10 h-10 items-center justify-center bg-background rounded-full">
          <Text className="text-xl">{icon}</Text> 
        </View>
      )}

      <View className="flex-1">
        <Text className={`font-bold ${isSelected ? "text-primary" : "text-white"} ${textStyles}`}>
          {label}
        </Text>
        
        {/*  แสดงคำอธิบายเฉพาะถ้ามีการส่งมา (ไม่กระทบหน้าเก่า) */}
        {description && (
          <Text className="text-secondary-text text-xs mt-1">{description}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SelectButton;