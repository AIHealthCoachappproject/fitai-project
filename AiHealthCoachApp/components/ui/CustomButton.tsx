// components/ui/CustomButton.tsx
import { TouchableOpacity, Text, ActivityIndicator, Animated } from "react-native";
import React, { useRef } from "react";
import { COLORS } from "@/constants/theme";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline"; 
  isLoading?: boolean;
  containerStyles?: string;
  textStyles?: string;
}

const CustomButton = ({ 
  title, 
  onPress, 
  variant = "primary", 
  isLoading, 
  containerStyles = "", 
  textStyles = "" 
}: CustomButtonProps) => {
  
  const isOutline = variant === "outline";
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        disabled={isLoading}
        style={[
          {
            elevation: isLoading ? 0 : 8,
            shadowColor: isOutline ? "#39FF14" : "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isOutline ? 0.3 : 0.25,
            shadowRadius: 8,
          }
        ]}
        className={`h-16 w-full justify-center items-center rounded-full ${
          isOutline ? "border-2 border-primary bg-transparent" : "bg-primary"
        } ${isLoading ? "opacity-50" : ""} ${containerStyles}`}
      >
        {isLoading ? (
          <ActivityIndicator color={isOutline ? COLORS.primary : COLORS.black} size="large" />
        ) : (
          <Text className={`text-lg font-extrabold ${
            isOutline ? "text-primary" : "text-background"
          } ${textStyles}`}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CustomButton;