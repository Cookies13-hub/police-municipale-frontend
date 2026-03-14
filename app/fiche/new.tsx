import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useStore } from '../../src/store/useStore';
import * as api from '../../src/services/api';

export default function NewFicheScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const { categories, interventionTypes, loadFiches } = useStore();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleIntervention = (id: string) => {
    setSelectedInterventions(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
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
      await api.createFiche({
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
        category_ids: selectedCategories,
        intervention_type_ids: selectedInterventions,
        is_default: false,
      });
      await loadFiches();
      Alert.alert('Succ\u00e8s', 'Fiche cr\u00e9\u00e9e avec succ\u00e8s', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de cr\u00e9er la fiche');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              style={styles.saveButton}
            >
              <Text style={[styles.saveButtonText, saving && styles.saveButtonTextDisabled]}>
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SafeAreaView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]} edges={['bottom']}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark ? styles.textDark : styles.textLight]}>Titre *</Text>
              <TextInput
                style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
                value={title}
                onChangeText={setTitle}
                placeholder="Titre de la fiche"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              />
            </View>

            {/* Summary */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark ? styles.textDark : styles.textLight]}>R\u00e9sum\u00e9</Text>
              <TextInput
                style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
                value={summary}
                onChangeText={setSummary}
                placeholder="Br\u00e8ve description"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              />
            </View>

            {/* Content */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark ? styles.textDark : styles.textLight]}>Contenu *</Text>
              <TextInput
                style={[styles.textArea, isDark ? styles.inputDark : styles.inputLight]}
                value={content}
                onChangeText={setContent}
                placeholder="Contenu de la fiche (format Markdown support\u00e9)"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                multiline
                numberOfLines={10}
                textAlignVertical="top"
              />
            </View>

            {/* Keywords */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark ? styles.textDark : styles.textLight]}>Mots-cl\u00e9s</Text>
              <TextInput
                style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
                value={keywords}
                onChangeText={setKeywords}
                placeholder="alcool, contr\u00f4le, permis (s\u00e9par\u00e9s par des virgules)"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              />
            </View>

            {/* Categories */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark ? styles.textDark : styles.textLight]}>Cat\u00e9gories</Text>
              <View style={styles.chipContainer}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.chip,
                      selectedCategories.includes(cat.id)
                        ? { backgroundColor: cat.color }
                        : isDark ? styles.chipDark : styles.chipLight
                    ]}
                    onPress={() => toggleCategory(cat.id)}
                  >
                    <MaterialCommunityIcons
                      name={cat.icon as any}
                      size={16}
                      color={selectedCategories.includes(cat.id) ? '#FFFFFF' : cat.color}
                    />
                    <Text
                      style={[
                        styles.chipText,
                        selectedCategories.includes(cat.id)
                          ? styles.chipTextSelected
                          : { color: cat.color }
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Intervention Types */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark ? styles.textDark : styles.textLight]}>Types d'intervention</Text>
              <View style={styles.chipContainer}>
                {interventionTypes.map((int) => (
                  <TouchableOpacity
                    key={int.id}
                    style={[
                      styles.chip,
                      selectedInterventions.includes(int.id)
                        ? { backgroundColor: int.color }
                        : isDark ? styles.chipDark : styles.chipLight
                    ]}
                    onPress={() => toggleIntervention(int.id)}
                  >
                    <MaterialCommunityIcons
                      name={int.icon as any}
                      size={16}
                      color={selectedInterventions.includes(int.id) ? '#FFFFFF' : int.color}
                    />
                    <Text
                      style={[
                        styles.chipText,
                        selectedInterventions.includes(int.id)
                          ? styles.chipTextSelected
                          : { color: int.color }
                      ]}
                    >
                      {int.name}
                    </Text>
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
  containerLight: {
    backgroundColor: '#F9FAFB',
  },
  containerDark: {
    backgroundColor: '#030712',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  saveButtonText: {
    color: '#3B82F6',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButtonTextDisabled: {
    opacity: 0.5,
  },
  inputGroup: {
    marginTop: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  inputLight: {
    backgroundColor: '#FFFFFF',
    color: '#111827',
  },
  inputDark: {
    backgroundColor: '#1F2937',
    color: '#F9FAFB',
  },
  textArea: {
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    minHeight: 200,
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
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  chipLight: {
    backgroundColor: '#FFFFFF',
  },
  chipDark: {
    backgroundColor: '#1F2937',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  textLight: {
    color: '#111827',
  },
  textDark: {
    color: '#F9FAFB',
  },
  bottomPadding: {
    height: 32,
  },
});
