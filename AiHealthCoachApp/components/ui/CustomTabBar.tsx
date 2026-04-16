import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { COLORS } from '@/constants/theme';

const TAB_ICON_MAP: Record<string, string> = {
  index: 'home-variant-outline',
  AiWorkoutCoach: 'dumbbell',
  TrackProgress: 'heart-pulse',
  AIHealthCoachChat: 'star-four-points',
};

const TAB_LABEL_MAP: Record<string, string> = {
  index: 'Home',
  AiWorkoutCoach: 'Workout',
  TrackProgress: 'Progress',
  AIHealthCoachChat: 'AI Coach',
};

const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const currentRouteName = state.routes[state.index]?.name;
  if (currentRouteName === 'AIHealthCoachChat' || currentRouteName === 'Profile' || currentRouteName === 'DailyPlanDetail') {
    return null;
  }

  const visibleRoutes = state.routes.filter((route) => TAB_ICON_MAP[route.name]);

  return (
    <View className="absolute bottom-8 left-5 right-5">
      <View 
        className="bg-secondary/95 flex-row items-center rounded-[30px] border border-white/10 px-2 py-2"
        style={styles.shadow}
      >
        {visibleRoutes.map((route) => {
          const index = state.routes.findIndex((item) => item.key === route.key);
          const isActive = state.index === index;
          const iconName = TAB_ICON_MAP[route.name] ?? 'circle';
          const label = TAB_LABEL_MAP[route.name] ?? route.name;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.8}
              className={`h-12 flex-1 items-center justify-center mx-1 rounded-full ${
                isActive ? 'flex-row px-4' : ''
              }`}
              style={isActive ? { backgroundColor: COLORS.primary } : {}}
            >
              <MaterialCommunityIcons
                name={iconName as any}
                size={isActive ? 20 : 19}
                color={isActive ? COLORS.black : '#7f7f7f'}
              />
              {isActive && (
                <Text 
                  className="text-black font-bold ml-2 text-[13px]"
                  numberOfLines={1}
                >
                  {label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default CustomTabBar;