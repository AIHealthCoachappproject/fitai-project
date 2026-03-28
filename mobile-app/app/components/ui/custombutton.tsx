import React from "react";
import { Colors } from "@/constants/theme";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
} from "react-native";

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

  //  background style
  const getBackgroundStyle = () => {
    if (disabled) {
      return { backgroundColor: "#333" };
    }

    switch (variant) {
      case "primary":
        return { backgroundColor: theme.primary };

      case "secondary":
        return {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: theme.primary,
        };

      case "danger":
        return { backgroundColor: "#EF4444" };

      default:
        return { backgroundColor: theme.primary };
    }
  };

  // text color
  const getTextStyle = () => {
    if (disabled) {
      return { color: "#666" };
    }

    if (variant === "primary") {
      return { color: "#000" }; // พื้นเขียว → ตัวหนังสือดำ
    }

    return { color: theme.primary };
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      className="w-full py-4 rounded-xl flex-row justify-center items-center"
      style={[
        getBackgroundStyle(),

        // ✨ Glow effect
        {
          shadowColor: theme.primary,
          shadowOpacity: disabled ? 0 : 0.4,
          shadowRadius: 10,
          elevation: disabled ? 0 : 5,
        },

        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? "#000" : theme.primary}
        />
      ) : (
        <Text style={getTextStyle()} className="font-bold text-lg">
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}