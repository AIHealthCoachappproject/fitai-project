import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type GoalOption = {
  id: string;
  label: string;
  description: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  iconLib: 'Ionicons' | 'MaterialCommunityIcons';
};

const GOAL_OPTIONS: GoalOption[] = [
  {
    id: 'lose_weight',
    label: 'Lose weight',
    description: 'Burn fat',
    icon: 'fire',
    iconColor: '#FB923C',
    iconBg: '#2A1A0A',
    iconLib: 'MaterialCommunityIcons',
  },
  {
    id: 'build_muscle',
    label: 'Build muscle',
    description: 'Increase strength',
    icon: 'barbell-outline',
    iconColor: '#818CF8',
    iconBg: '#12123A',
    iconLib: 'Ionicons',
  },
  {
    id: 'health',
    label: 'Take care of your health',
    description: 'Eat well, sleep comfortably',
    icon: 'heart',
    iconColor: '#EC4899',
    iconBg: '#2A0A1A',
    iconLib: 'Ionicons',
  },
];

type Props = {
  onSelect: (label: string) => void;
};

const GoalOptionCard = ({ onSelect }: Props) => {
  return (
    <View className="mt-3 gap-3">
      {GOAL_OPTIONS.map((opt) => (
        <GoalOptionItem key={opt.id} option={opt} onSelect={onSelect} />
      ))}
    </View>
  );
};

const GoalOptionItem = ({ option: opt, onSelect }: { option: GoalOption; onSelect: (label: string) => void }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.97,
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
        key={opt.id}
        onPress={() => onSelect(opt.label)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[
          {
            elevation: 6,
            shadowColor: '#39FF14',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 6,
          }
        ]}
        className="flex-row items-center gap-4 bg-[#1A1A1A] rounded-2xl px-5 py-4 border border-white/8"
      >
        {/* Icon Container with gradient effect */}
        <View
          className="w-11 h-11 rounded-full justify-center items-center flex-shrink-0"
          style={{ 
            backgroundColor: opt.iconBg,
            borderWidth: 1,
            borderColor: opt.iconColor + '15'
          }}
        >
          {opt.iconLib === 'Ionicons' ? (
            <Ionicons name={opt.icon as any} size={20} color={opt.iconColor} />
          ) : (
            <MaterialCommunityIcons name={opt.icon as any} size={20} color={opt.iconColor} />
          )}
        </View>

        {/* Text Content */}
        <View className="flex-1">
          <Text className="text-white text-base font-bold tracking-tight">{opt.label}</Text>
          <Text className="text-white/50 text-xs font-medium mt-0.5 leading-3">{opt.description}</Text>
        </View>

        {/* Chevron */}
        <Ionicons name="chevron-forward" size={18} color="#39FF14" />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default GoalOptionCard;