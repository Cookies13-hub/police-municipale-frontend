import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const menuItems = [
    {
      icon: 'file-document-plus',
      title: 'Ajouter une fiche',
      subtitle: 'Créer une nouvelle fiche',
      onPress: () => router.push('/fiche/new'),
      color: '#3B82F6',
    },
    {
      icon: 'theme-light-dark',
      title: 'Thème',
      subtitle: isDark ? 'Mode sombre actif' : 'Mode clair actif',
      onPress: () => {},
      color: '#8B5CF6',
      disabled: true,
      note: 'Suit le thème du système',
    },
    {
      icon: 'information',
      title: 'À propos',
      subtitle: 'Guide Terrain Police v1.0',
      onPress: () => router.push('/about'), // Maintenant ça ouvre la page !
      color: '#6366F1',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDark ? styles.textDark : styles.textLight]}>
          Paramètres
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, isDark ? styles.menuItemDark : styles.menuItemLight]}
              onPress={item.onPress}
              disabled={item.disabled}
              activeOpacity={item.disabled ? 1 : 0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
              </View>
              <View style={styles.menuContent}>
                <Text style={[styles.menuTitle, isDark ? styles.textDark : styles.textLight]}>
                  {item.title}
                </Text>
                <Text style={[styles.menuSubtitle, isDark ? styles.textMutedDark : styles.textMutedLight]}>
                  {item.subtitle}
                </Text>
                {item.note && (
                  <Text style={[styles.menuNote, isDark ? styles.textMutedDark : styles.textMutedLight]}>
                    {item.note}
                  </Text>
                )}
              </View>
              {!item.disabled && (
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={isDark ? '#6B7280' : '#9CA3AF'}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoSection}>
          <MaterialCommunityIcons
            name="shield-check"
            size={48}
            color={isDark ? '#374151' : '#D1D5DB'}
          />
          <Text style={[styles.infoTitle, isDark ? styles.textMutedDark : styles.textMutedLight]}>
            PolicePocket
          </Text>
          <Text style={[styles.infoText, isDark ? styles.textMutedDark : styles.textMutedLight]}>
            Application de référence pour les forces de l'ordre
          </Text>
          <Text style={[styles.versionText, isDark ? styles.textMutedDark : styles.textMutedLight]}>
            Version 1.0.0
          </Text>
        </View>

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
  scrollView: {
    flex: 1,
  },
  section: {
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
  },
  menuItemLight: {
    backgroundColor: '#FFFFFF',
  },
  menuItemDark: {
    backgroundColor: '#1F2937',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  menuNote: {
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 4,
  },
  infoSection: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  versionText: {
    fontSize: 12,
    marginTop: 8,
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