import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Fiche } from '../types';
import { useStore } from '../store/useStore';
import { useTheme } from '../theme';

interface FicheCardProps {
  fiche: Fiche;
  onPress: () => void;
  showFavorite?: boolean;
}

export const FicheCard: React.FC<FicheCardProps> = ({ fiche, onPress, showFavorite = true }) => {
  const { theme, isDark } = useTheme();
  const { isFavorite, toggleFavorite } = useStore();
  const favorite = isFavorite(fiche.id);

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(fiche.id);
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {fiche.title}
        </Text>
        <Text style={[styles.summary, { color: theme.textSecondary }]} numberOfLines={2}>
          {fiche.summary}
        </Text>
        {fiche.keywords.length > 0 && (
          <View style={styles.keywords}>
            {fiche.keywords.slice(0, 3).map((keyword, index) => (
              <View key={index} style={[styles.keyword, { backgroundColor: theme.surfaceAlt }]}>
                <Text style={[styles.keywordText, { color: theme.textSecondary }]}>
                  {keyword}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
      {showFavorite && (
        <TouchableOpacity onPress={handleFavoritePress} style={styles.favoriteButton}>
          <MaterialCommunityIcons
            name={favorite ? 'star' : 'star-outline'}
            size={24}
            color={favorite ? theme.warning : theme.textTertiary}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  summary: {
    fontSize: 14,
    marginBottom: 8,
  },
  keywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  keyword: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  keywordText: {
    fontSize: 11,
  },
  favoriteButton: {
    padding: 4,
    marginLeft: 8,
  },
});
