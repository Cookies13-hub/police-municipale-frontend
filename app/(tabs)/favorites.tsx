import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useStore } from '../../src/store/useStore';
import { FicheCard } from '../../src/components/FicheCard';
import { EmptyState } from '../../src/components/EmptyState';

export default function FavoritesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  
  const { favorites, isLoading, loadFavorites, initializeApp, deviceId } = useStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!deviceId) {
      initializeApp();
    } else {
      loadFavorites();
    }
  }, [deviceId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  }, []);

  const navigateToFiche = (ficheId: string) => {
    router.push(`/fiche/${ficheId}`);
  };

  if (isLoading && favorites.length === 0 && !deviceId) {
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
          Favoris
        </Text>
        <Text style={[styles.headerSubtitle, isDark ? styles.textMutedDark : styles.textMutedLight]}>
          Vos fiches enregistr\u00e9es
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {favorites.length === 0 ? (
          <EmptyState
            icon="star-outline"
            title="Aucun favori"
            message="Ajoutez des fiches \u00e0 vos favoris pour un acc\u00e8s rapide"
          />
        ) : (
          favorites.map((fiche) => (
            <FicheCard
              key={fiche.id}
              fiche={fiche}
              onPress={() => navigateToFiche(fiche.id)}
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
