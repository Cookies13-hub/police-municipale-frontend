import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useStore } from '../../src/store/useStore';
import { SearchBar } from '../../src/components/SearchBar';
import { FicheCard } from '../../src/components/FicheCard';
import { EmptyState } from '../../src/components/EmptyState';
import { FAB } from '../../src/components/FAB';
import { useTheme } from '../../src/theme';

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  
  const {
    fiches,
    categories,
    isLoading,
    error,
    initializeApp,
    searchFiches,
    loadFiches,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [refreshing, setRefreshing] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    initializeApp();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await initializeApp();
    setRefreshing(false);
  }, []);

  const handleSearch = () => {
    if (localSearch.trim()) {
      searchFiches(localSearch.trim());
    } else {
      loadFiches();
      setSearchQuery('');
    }
  };

  const handleSearchChange = (text: string) => {
    setLocalSearch(text);
    if (!text.trim()) {
      loadFiches();
      setSearchQuery('');
    }
  };

  const navigateToFiche = (ficheId: string) => {
    router.push(`/fiche/${ficheId}`);
  };

  if (isLoading && fiches.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Chargement des fiches...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="shield-check" size={32} color={theme.primary} />
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Guide Terrain
          </Text>
        </View>
        {error && (
          <View style={styles.offlineBadge}>
            <MaterialCommunityIcons name="wifi-off" size={14} color={theme.warning} />
            <Text style={[styles.offlineText, { color: theme.warning }]}>Hors-ligne</Text>
          </View>
        )}
      </View>

      <SearchBar
        value={localSearch}
        onChangeText={handleSearchChange}
        onSubmit={handleSearch}
        placeholder="Rechercher une fiche..."
      />

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
        {searchQuery && (
          <View style={styles.searchResultHeader}>
            <Text style={[styles.searchResultText, { color: theme.textSecondary }]}>
              Résultats pour "{searchQuery}" ({fiches.length})
            </Text>
            <TouchableOpacity onPress={() => {
              setLocalSearch('');
              loadFiches();
              setSearchQuery('');
            }}>
              <Text style={[styles.clearSearchText, { color: theme.primary }]}>Effacer</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Access Categories */}
        {!searchQuery && categories.length > 0 && (
          <View style={styles.quickAccessSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Accès rapide
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickAccessScroll}>
              {categories.slice(0, 5).map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.quickAccessCard, { backgroundColor: cat.color + '15' }]}
                  onPress={() => router.push(`/category/${cat.id}`)}
                >
                  <MaterialCommunityIcons name={cat.icon as any} size={24} color={cat.color} />
                  <Text style={[styles.quickAccessText, { color: cat.color }]} numberOfLines={1}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* All Fiches or Search Results */}
        <View style={styles.fichesSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {searchQuery ? 'Résultats' : 'Toutes les fiches'}
          </Text>
          
          {fiches.length === 0 ? (
            <EmptyState
              icon="file-document-outline"
              title="Aucune fiche trouv\u00e9e"
              message={searchQuery ? 'Essayez avec d\'autres mots-cl\u00e9s' : 'Aucune fiche disponible'}
            />
          ) : (
            fiches.map((fiche) => (
              <FicheCard
                key={fiche.id}
                fiche={fiche}
                onPress={() => navigateToFiche(fiche.id)}
              />
            ))
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
      
      <FAB
        icon="plus"
        onPress={() => router.push('/fiche/new')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 10,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  offlineText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  searchResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchResultText: {
    fontSize: 14,
  },
  clearSearchText: {
    fontSize: 14,
    fontWeight: '500',
  },
  quickAccessSection: {
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  quickAccessScroll: {
    paddingLeft: 16,
  },
  quickAccessCard: {
    width: 100,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 12,
  },
  quickAccessText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  fichesSection: {
    paddingTop: 24,
  },
  bottomPadding: {
    height: 32,
  },
});
