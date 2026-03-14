import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useStore } from '../../../src/store/useStore';
import { useTheme } from '../../../src/theme';
import * as api from '../../../src/services/api';
import { Fiche } from '../../../src/types';

export default function EditFicheScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { categories, interventionTypes, loadFiches } = useStore();

  const [fiche, setFiche] = useState<Fiche | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadFiche();
  }, [id]);

  const loadFiche = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await api.getFicheById(id);
      setFiche(data);
      setTitle(data.title);
      setSummary(data.summary);
      setContent(data.content);
      setKeywords(data.keywords.join(', '));
      setSelectedCategories(data.category_ids);
      setSelectedInterventions(data.intervention_type_ids);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger la fiche');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId) ? prev.filter(c => c !== categoryId) : [...prev, categoryId]
    );
  };

  const toggleIntervention = (interventionId: string) => {
    setSelectedInterventions(prev =>
      prev.includes(interventionId) ? prev.filter(i => i !== interventionId) : [...prev, interventionId]
    );
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Erreur', 'Le titre est obligatoire');
      return;
    }
    if (!content.trim()) {
      Alert.alert('Erreur', 'Le contenu est obligatoire');
      return;
    }

    try {
      setSaving(true);
      await api.updateFiche(id!, {
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
        category_ids: selectedCategories,
        intervention_type_ids: selectedInterventions,
      });
      await loadFiches();
      Alert.alert('Succès', 'Fiche modifiée avec succès', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier la fiche');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (fiche?.is_default) {
      Alert.alert('Erreur', 'Les fiches par défaut ne peuvent pas être supprimées');
      return;
    }

    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cette fiche ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteFiche(id!);
              await loadFiches();
              Alert.alert('Succès', 'Fiche supprimée', [
                { text: 'OK', onPress: () => router.replace('/(tabs)') }
              ]);
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer la fiche');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Modifier la fiche',
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              {!fiche?.is_default && (
                <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                  <MaterialCommunityIcons name="delete" size={24} color={theme.error} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleSave}
                disabled={saving}
                style={styles.saveButton}
              >
                <Text style={[styles.saveButtonText, { color: theme.primary }, saving && { opacity: 0.5 }]}>
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['bottom']}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.text }]}>Titre *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                value={title}
                onChangeText={setTitle}
                placeholder="Titre de la fiche"
                placeholderTextColor={theme.textTertiary}
              />
            </View>

            {/* Summary */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.text }]}>Résumé</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                value={summary}
                onChangeText={setSummary}
                placeholder="Résumé court de la fiche"
                placeholderTextColor={theme.textTertiary}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Content */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.text }]}>Contenu * (Markdown)</Text>
              <TextInput
                style={[styles.input, styles.contentArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                value={content}
                onChangeText={setContent}
                placeholder="Contenu de la fiche en Markdown..."
                placeholderTextColor={theme.textTertiary}
                multiline
                numberOfLines={15}
              />
            </View>

            {/* Keywords */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.text }]}>Mots-clés</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                value={keywords}
                onChangeText={setKeywords}
                placeholder="mot1, mot2, mot3..."
                placeholderTextColor={theme.textTertiary}
              />
              <Text style={[styles.hint, { color: theme.textSecondary }]}>Séparez les mots-clés par des virgules</Text>
            </View>

            {/* Categories */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.text }]}>Catégories</Text>
              <View style={styles.chipContainer}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.chip,
                      { borderColor: cat.color },
                      selectedCategories.includes(cat.id) && { backgroundColor: cat.color + '20' }
                    ]}
                    onPress={() => toggleCategory(cat.id)}
                  >
                    <MaterialCommunityIcons
                      name={cat.icon as any}
                      size={16}
                      color={cat.color}
                    />
                    <Text style={[styles.chipText, { color: cat.color }]}>{cat.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Intervention Types */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.text }]}>Types d'intervention</Text>
              <View style={styles.chipContainer}>
                {interventionTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.chip,
                      { borderColor: type.color },
                      selectedInterventions.includes(type.id) && { backgroundColor: type.color + '20' }
                    ]}
                    onPress={() => toggleIntervention(type.id)}
                  >
                    <MaterialCommunityIcons
                      name={type.icon as any}
                      size={16}
                      color={type.color}
                    />
                    <Text style={[styles.chipText, { color: type.color }]}>{type.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.bottomPadding} />
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  contentArea: {
    minHeight: 300,
    textAlignVertical: 'top',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    marginRight: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    marginRight: 16,
  },
  bottomPadding: {
    height: 32,
  },
});
