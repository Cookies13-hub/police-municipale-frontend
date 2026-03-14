import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useStore } from '../../src/store/useStore';
import { CategoryCard } from '../../src/components/CategoryCard';
import { EmptyState } from '../../src/components/EmptyState';

export default function InterventionsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  
  const { interventionTypes, fiches, isLoading, initializeApp } = useStore();

  useEffect(() => {
    if (interventionTypes.length === 0) {
      initializeApp();
    }
  }, []);

  const getFicheCountForIntervention = (interventionId: string) => {
    return fiches.filter(f => f.intervention_type_ids.includes(interventionId)).length;
  };

  if (isLoading && interventionTypes.length === 0) {
    return (
      <SafeAreaView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDark ? styles.textDark : styles.textLight]}>
          Types d'intervention
        </Text>
        <Text style={[styles.headerSubtitle, isDark ? styles.textMutedDark : styles.textMutedLight]}>
          Fiches par type d'action
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {interventionTypes.length === 0 ? (
          <EmptyState
            icon="shield-alert-outline"
            title="Aucun type d'intervention"
            message="Les types d'intervention apparaîtront ici"
          />
        ) : (
          interventionTypes.map((intervention) => (
            <CategoryCard
              key={intervention.id}
              item={intervention}
              count={getFicheCountForIntervention(intervention.id)}
              onPress={() => router.push(`/intervention/${intervention.id}`)}
            />
          ))
        )}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 15,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    paddingTop: 8,
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
