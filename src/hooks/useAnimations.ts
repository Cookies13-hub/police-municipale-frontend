import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

export const useFadeIn = (duration: number = 300, delay: number = 0) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return opacity;
};

export const useSlideIn = (duration: number = 300, from: 'left' | 'right' | 'bottom' = 'bottom') => {
  const translation = useRef(new Animated.Value(from === 'bottom' ? 50 : from === 'left' ? -50 : 50)).current;

  useEffect(() => {
    Animated.spring(translation, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 8,
    }).start();
  }, []);

  return {
    transform: from === 'bottom' ? [{ translateY: translation }] : [{ translateX: translation }],
  };
};

export const useScale = (duration: number = 200) => {
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 80,
      friction: 7,
    }).start();
  }, []);

  return { transform: [{ scale }] };
};
