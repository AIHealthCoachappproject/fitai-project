import React, { useRef } from 'react';
import { ScrollView, TouchableOpacity, Text, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type QuickReply = {
  id: string;
  label: string;
  icon: string;
  iconLib: 'Ionicons' | 'MaterialCommunityIcons';
  iconColor: string;
};

const QUICK_REPLIES: QuickReply[] = [
  {
    id: '1',
    label: 'What should I eat today?',
    icon: 'restaurant-outline',
    iconLib: 'Ionicons',
    iconColor: '#A78BFA',
  },
  {
    id: '2',
    label: 'Weight Record',
    icon: 'chart-timeline-variant',
    iconLib: 'MaterialCommunityIcons',
    iconColor: '#38BDF8',
  },
  {
    id: '3',
    label: 'Start exercising',
    icon: 'flash',
    iconLib: 'Ionicons',
    iconColor: '#39FF14',
  },
];

type Props = {
  onSelect: (text: string) => void;
};

const QuickReplyBar = ({ onSelect }: Props) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ flexGrow: 0 }}
      contentContainerStyle={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 8,
        alignItems: 'center',
      }}
    >
      {QUICK_REPLIES.map((item) => (
        <QuickReplyButton key={item.id} item={item} onSelect={onSelect} />
      ))}
    </ScrollView>
  );
};

const QuickReplyButton = ({ item, onSelect }: { item: QuickReply; onSelect: (text: string) => void }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.92,
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
        onPress={() => onSelect(item.label)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[
          {
            elevation: 4,
            shadowColor: item.iconColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }
        ]}
        className="h-9 self-center flex-row items-center gap-2 bg-[#1A1A1A] rounded-full px-3 border border-white/15 active:border-white/30"
      >
        {item.iconLib === 'Ionicons' ? (
          <Ionicons name={item.icon as any} size={12} color={item.iconColor} />
        ) : (
          <MaterialCommunityIcons name={item.icon as any} size={12} color={item.iconColor} />
        )}
        <Text className="text-white/80 text-[11px] font-semibold">{item.label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default QuickReplyBar;