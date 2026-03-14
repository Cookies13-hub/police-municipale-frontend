import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useStore } from '../../src/store/useStore';
import { Fiche } from '../../src/types';
import * as api from '../../src/services/api';

export default function FicheDetailScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isFavorite, toggleFavorite, categories, interventionTypes } = useStore();
  
  const [fiche, setFiche] = useState<Fiche | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFiche();
  }, [id]);

  const loadFiche = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await api.getFicheById(id);
      setFiche(data);
    } catch (err: any) {
      setError('Impossible de charger la fiche');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryNames = () => {
    if (!fiche) return [];
    return categories
      .filter(c => fiche.category_ids.includes(c.id))
      .map(c => ({ name: c.name, color: c.color }));
  };

  const getInterventionNames = () => {
    if (!fiche) return [];
    return interventionTypes
      .filter(i => fiche.intervention_type_ids.includes(i.id))
      .map(i => ({ name: i.name, color: i.color }));
  };

  const formatContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // Handle headers
      if (line.startsWith('# ')) {
        return (
          <Text key={index} style={[styles.h1, isDark ? styles.textDark : styles.textLight]}>
            {line.substring(2)}
          </Text>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <Text key={index} style={[styles.h2, isDark ? styles.textDark : styles.textLight]}>
            {line.substring(3)}
          </Text>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <Text key={index} style={[styles.h3, isDark ? styles.textDark : styles.textLight]}>
            {line.substring(4)}
          </Text>
        );
      }
      // Handle bullet points
      if (line.startsWith('- ')) {
        return (
          <View key={index} style={styles.bulletItem}>
            <Text style={[styles.bullet, isDark ? styles.textDark : styles.textLight]}>•</Text>
            <Text style={[styles.bulletText, isDark ? styles.textDark : styles.textLight]}>
              {formatInlineStyles(line.substring(2))}
            </Text>
          </View>
        );
      }
      // Handle tables (simple implementation)
      if (line.startsWith('|')) {
        const cells = line.split('|').filter(c => c.trim());
        const isHeader = lines[index + 1]?.includes('---');
        return (
          <View key={index} style={[styles.tableRow, isHeader && styles.tableHeader]}>
            {cells.map((cell, cellIndex) => (
              <Text
                key={cellIndex}
                style={[
                  styles.tableCell,
                  isDark ? styles.textDark : styles.textLight,
                  isHeader && styles.tableCellHeader
                ]}
              >
                {cell.trim()}
              </Text>
            ))}
          </View>
        );
      }
      // Skip table separator lines
      if (line.includes('---')) {
        return null;
      }
      // Regular paragraph
      if (line.trim()) {
        return (
          <Text key={index} style={[styles.paragraph, isDark ? styles.textDark : styles.textLight]}>
            {formatInlineStyles(line)}
          </Text>
        );
      }
      // Empty line
      return <View key={index} style={styles.spacer} />;
    });
  };

  const formatInlineStyles = (text: string) => {
    // Simple bold handling
    const parts = text.split(/\*\*(.+?)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <Text key={index} style={styles.bold}>{part}</Text>;
      }
      return part;
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !fiche) {
    return (
      <SafeAreaView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={48} color="#EF4444" />
          <Text style={[styles.errorText, isDark ? styles.textDark : styles.textLight]}>
            {error || 'Fiche non trouv\u00e9e'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadFiche}>
            <Text style={styles.retryButtonText}>R\u00e9essayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const favorite = isFavorite(fiche.id);
  const categoryTags = getCategoryNames();
  const interventionTags = getInterventionNames();

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerRight: () => (
            <TouchableOpacity onPress={() => toggleFavorite(fiche.id)} style={styles.favoriteHeaderButton}>
              <MaterialCommunityIcons
                name={favorite ? 'star' : 'star-outline'}
                size={24}
                color={favorite ? '#F59E0B' : (isDark ? '#9CA3AF' : '#6B7280')}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]} edges={['bottom']}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Title */}
          <View style={styles.headerSection}>
            <Text style={[styles.title, isDark ? styles.textDark : styles.textLight]}>
              {fiche.title}
            </Text>
            {fiche.summary && (
              <Text style={[styles.summary, isDark ? styles.textMutedDark : styles.textMutedLight]}>
                {fiche.summary}
              </Text>
            )}
          </View>

          {/* Tags */}
          {(categoryTags.length > 0 || interventionTags.length > 0) && (
            <View style={styles.tagsSection}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categoryTags.map((tag, index) => (
                  <View key={`cat-${index}`} style={[styles.tag, { backgroundColor: tag.color + '20' }]}>
                    <Text style={[styles.tagText, { color: tag.color }]}>{tag.name}</Text>
                  </View>
                ))}
                {interventionTags.map((tag, index) => (
                  <View key={`int-${index}`} style={[styles.tag, { backgroundColor: tag.color + '20' }]}>
                    <Text style={[styles.tagText, { color: tag.color }]}>{tag.name}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Content */}
          <View style={[styles.contentSection, isDark ? styles.contentSectionDark : styles.contentSectionLight]}>
            {formatContent(fiche.content)}
          </View>

          {/* Keywords */}
          {fiche.keywords.length > 0 && (
            <View style={styles.keywordsSection}>
              <Text style={[styles.keywordsTitle, isDark ? styles.textMutedDark : styles.textMutedLight]}>
                Mots-cl\u00e9s
              </Text>
              <View style={styles.keywordsContainer}>
                {fiche.keywords.map((keyword, index) => (
                  <View key={index} style={[styles.keyword, isDark ? styles.keywordDark : styles.keywordLight]}>
                    <Text style={[styles.keywordText, isDark ? styles.keywordTextDark : styles.keywordTextLight]}>
                      {keyword}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: '#F9FAFB',
  },
  containerDark: {
    backgroundColor: '#030712',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  favoriteHeaderButton: {
    padding: 8,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
  },
  summary: {
    fontSize: 16,
    marginTop: 8,
    lineHeight: 22,
  },
  tagsSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
  },
  contentSection: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  contentSectionLight: {
    backgroundColor: '#FFFFFF',
  },
  contentSectionDark: {
    backgroundColor: '#1F2937',
  },
  h1: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 12,
  },
  h2: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  h3: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    paddingLeft: 8,
  },
  bullet: {
    marginRight: 8,
    fontSize: 15,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  bold: {
    fontWeight: '700',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 8,
  },
  tableHeader: {
    borderBottomWidth: 2,
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    paddingHorizontal: 4,
  },
  tableCellHeader: {
    fontWeight: '600',
  },
  spacer: {
    height: 8,
  },
  keywordsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  keywordsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  keyword: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  keywordLight: {
    backgroundColor: '#E5E7EB',
  },
  keywordDark: {
    backgroundColor: '#374151',
  },
  keywordText: {
    fontSize: 12,
  },
  keywordTextLight: {
    color: '#4B5563',
  },
  keywordTextDark: {
    color: '#D1D5DB',
  },
  textLight: {
    color: '#111827',
  },
  textDark: {
    color: '#F9FAFB',
  },
  textMutedLight: {
    color: '#6B7280',
  },
  textMutedDark: {
    color: '#9CA3AF',
  },
  bottomPadding: {
    height: 32,
  },
});
