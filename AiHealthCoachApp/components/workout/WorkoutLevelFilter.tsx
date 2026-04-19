import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Level, LEVEL_CONFIG } from '@/components/constants/workoutData';

type Props = {
  selected: Level | null;
  onSelect: (level: Level | null) => void;
};

const LEVELS: Level[] = ['easy', 'medium', 'hard'];

const WorkoutLevelFilter = ({ selected, onSelect }: Props) => {
  const [open, setOpen] = useState(false);
  const config = selected 
    ? LEVEL_CONFIG[selected] 
    : { label: 'All Videos', color: '#39FF14' };

  return (
    <View className="mb-5 self-start" style={{ zIndex: 10 }}>
      {/* Trigger */}
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        activeOpacity={0.8}
        className="flex-row items-center gap-2 bg-[#1A1A1A] rounded-full px-4 py-2 border"
        style={{ borderColor: config.color }}
      >
        <View
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: config.color }}
        />
        <Text className="font-bold text-sm" style={{ color: config.color }}>
          {config.label}
        </Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={config.color}
        />
      </TouchableOpacity>

      {/* Dropdown */}
      {open && (
        <View
          className="absolute top-11 left-0 bg-[#1C1C1C] rounded-2xl overflow-hidden border border-white/10"
          style={{ minWidth: 180, zIndex: 20 }}
        >
          {/* Individual Levels Only */}
          {LEVELS.map((level) => {
            const cfg = LEVEL_CONFIG[level];
            const isSelected = level === selected;
            return (
              <TouchableOpacity
                key={level}
                onPress={() => { onSelect(level); setOpen(false); }}
                activeOpacity={0.7}
                className={`flex-row items-center gap-3 px-4 py-3 ${isSelected ? 'bg-white/5' : ''}`}
              >
                <View
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cfg.color }}
                />
                <Text
                  className="text-sm font-semibold flex-1"
                  style={{ color: isSelected ? cfg.color : '#999' }}
                >
                  {cfg.label}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark" size={14} color={cfg.color} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default WorkoutLevelFilter;