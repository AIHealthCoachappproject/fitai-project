import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  status?: string;
  statusColor?: string;
  icon: React.ReactNode;
  containerStyles?: string;
  onPress?: () => void;
  isFullWidth?: boolean;
}

const MetricCard = ({ 
  label, value, unit, status, statusColor = "text-primary", 
  icon, containerStyles, onPress, isFullWidth 
}: MetricCardProps) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
      className={`bg-secondary p-5 rounded-[28px] border border-white/10 ${isFullWidth ? 'w-full' : 'w-[48%]'} ${containerStyles}`}
    >
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row items-baseline">
          <Text className="text-4xl font-black text-whiteText">{value}</Text>
          {unit && <Text className="text-secondary-text ml-1 text-xs">{unit}</Text>}
        </View>
        <View className="opacity-80">
          {icon}
        </View>
      </View>
      
      <Text className="text-secondary-text text-sm font-medium">{label}</Text>
      {status && (
        <Text className={`text-xs mt-1 font-bold ${statusColor}`}>
          {status}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default MetricCard;