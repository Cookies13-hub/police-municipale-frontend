import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Category, InterventionType } from '../types';
import { useTheme } from '../theme';

interface CategoryCardProps {
  item: Category | InterventionType;
  onPress: () => void;
  count?: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ item, onPress, count }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
        <MaterialCommunityIcons
          name={item.icon as any}
          size={28}
          color={item.color}
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={1}>
          {item.description}
        </Text>
      </View>
      <View style={styles.chevronContainer}>
        {count !== undefined && (
          <View style={[styles.badge, { backgroundColor: item.color }]}>
            <Text style={styles.badgeText}>{count}</Text>
          </View>
        )}
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={theme.textTertiary}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
  },
  chevronContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
