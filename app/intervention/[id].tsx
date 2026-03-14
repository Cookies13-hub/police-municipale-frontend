import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useStore } from '../../src/store/useStore';
import { FicheCard } from '../../src/components/FicheCard';
import { EmptyState } from '../../src/components/EmptyState';
import { InterventionType, Fiche } from '../../src/types';

export default function InterventionDetailScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { interventionTypes, fiches, loadFiches } = useStore();
  
  const [intervention, setIntervention] = useState<InterventionType | null>(null);
  const [interventionFiches, setInterventionFiches] = useState<Fiche[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const int = interventionTypes.find(i => i.id === id);
      setIntervention(int || null);
      const filtered = fiches.filter(f => f.intervention_type_ids.includes(id));
      setInterventionFiches(filtered);
      setLoading(false);
    }
  }, [id, interventionTypes, fiches]);

  const navigateToFiche = (ficheId: string) => {
    router.push(`/fiche/${ficheId}`);
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

  if (!intervention) {
    return (
      <SafeAreaView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
        <EmptyState
          icon="shield-alert"
          title="Type d'intervention non trouv\u00e9"
          message="Ce type d'intervention n'existe pas"
        />
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: intervention.name,
          headerStyle: {
            backgroundColor: isDark ? '#111827' : '#FFFFFF',
          },
        }}
      />
      <SafeAreaView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]} edges={['bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: intervention.color + '20' }]}>
            <MaterialCommunityIcons
              name={intervention.icon as any}
              size={32}
              color={intervention.color}
            />
          </View>
          <Text style={[styles.description, isDark ? styles.textMutedDark : styles.textMutedLight]}>
            {intervention.description}
          </Text>
          <Text style={[styles.count, isDark ? styles.textMutedDark : styles.textMutedLight]}>
            {interventionFiches.length} fiche{interventionFiches.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {interventionFiches.length === 0 ? (
            <EmptyState
              icon="file-document-outline"
              title="Aucune fiche"
              message="Aucune fiche pour ce type d'intervention"
            />
          ) : (
            interventionFiches.map((fiche) => (
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
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontSize: 15,
    marginTop: 12,
    textAlign: 'center',
  },
  count: {
    fontSize: 13,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
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
