import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/context/AuthContext';

const useOrbitDotStyle = (rotation: SharedValue<number>, index: number) => {
  return useAnimatedStyle(() => {
    const angle = (index * Math.PI) / 2;
    const radius = 35;
    const x = Math.cos(rotation.value * 2 * Math.PI + angle) * radius;
    const y = Math.sin(rotation.value * 2 * Math.PI + angle) * radius;
    return { transform: [{ translateX: x }, { translateY: y }] };
  }, [index, rotation]);
};

const LoadingScreen = () => {
  const router = useRouter();
  const { session, loading } = useAuthContext();
  const rotation = useSharedValue(0);
  const dotStyle0 = useOrbitDotStyle(rotation, 0);
  const dotStyle1 = useOrbitDotStyle(rotation, 1);
  const dotStyle2 = useOrbitDotStyle(rotation, 2);
  const dotStyle3 = useOrbitDotStyle(rotation, 3);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.linear }),
      -1
    );
  }, [rotation]);

  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      router.replace(session ? '/(tabs)' : '/');
    }, 3000);
    return () => clearTimeout(timer);
  }, [session, loading, router]);

  return (
    <View style={styles.container}>
      <View style={styles.centerFix}>
        <Animated.View style={[styles.dot, { backgroundColor: '#FF7E7E' }, dotStyle0]} />
        <Animated.View style={[styles.dot, { backgroundColor: '#83D475' }, dotStyle1]} />
        <Animated.View style={[styles.dot, { backgroundColor: '#7E9CFF' }, dotStyle2]} />
        <Animated.View style={[styles.dot, { backgroundColor: '#D483FF' }, dotStyle3]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerFix: {
    width: 0,
    height: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});

export default LoadingScreen;
