import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme';

interface FABProps {
  icon: string;
  onPress: () => void;
  color?: string;
  position?: 'bottom-right' | 'bottom-center';
}

export const FAB: React.FC<FABProps> = ({
  icon,
  onPress,
  color,
  position = 'bottom-right',
}) => {
  const { theme } = useTheme();
  const bgColor = color || theme.primary;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        { backgroundColor: bgColor },
        position === 'bottom-center' ? styles.fabCenter : styles.fabRight,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <MaterialCommunityIcons name={icon as any} size={28} color="#FFFFFF" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    bottom: 24,
  },
  fabRight: {
    right: 24,
  },
  fabCenter: {
    alignSelf: 'center',
    marginHorizontal: 'auto',
  },
});
