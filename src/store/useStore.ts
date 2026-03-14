import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category, InterventionType, Fiche } from '../types';
import * as api from '../services/api';
import uuid from 'react-native-uuid';

const DEVICE_ID_KEY = '@police_guide_device_id';
const OFFLINE_CATEGORIES_KEY = '@police_guide_categories';
const OFFLINE_INTERVENTION_TYPES_KEY = '@police_guide_intervention_types';
const OFFLINE_FICHES_KEY = '@police_guide_fiches';
const OFFLINE_FAVORITES_KEY = '@police_guide_favorites';

interface AppState {
  // Data
  categories: Category[];
  interventionTypes: InterventionType[];
  fiches: Fiche[];
  favorites: Fiche[];
  favoriteIds: Set<string>;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  deviceId: string;
  isSeeded: boolean;
  
  // Actions
  initializeApp: () => Promise<void>;
  loadCategories: () => Promise<void>;
  loadInterventionTypes: () => Promise<void>;
  loadFiches: (params?: { category_id?: string; intervention_type_id?: string }) => Promise<void>;
  searchFiches: (query: string) => Promise<void>;
  loadFavorites: () => Promise<void>;
  toggleFavorite: (ficheId: string) => Promise<void>;
  isFavorite: (ficheId: string) => boolean;
  setSearchQuery: (query: string) => void;
  clearError: () => void;
  
  // Offline support
  saveToOffline: () => Promise<void>;
  loadFromOffline: () => Promise<void>;
}

const generateDeviceId = (): string => {
  return 'device-' + Math.random().toString(36).substring(2, 15);
};

export const useStore = create<AppState>((set, get) => ({
  categories: [],
  interventionTypes: [],
  fiches: [],
  favorites: [],
  favoriteIds: new Set(),
  isLoading: false,
  error: null,
  searchQuery: '',
  deviceId: '',
  isSeeded: false,

  initializeApp: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Get or create device ID
      let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
      if (!deviceId) {
        deviceId = generateDeviceId();
        await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
      }
      set({ deviceId });
      
      // Try to seed the database first
      try {
        const seedResult = await api.seedDatabase();
        set({ isSeeded: seedResult.seeded });
      } catch (e) {
        console.log('Seed check failed, might be already seeded');
      }
      
      // Load all data
      await get().loadCategories();
      await get().loadInterventionTypes();
      await get().loadFiches();
      await get().loadFavorites();
      
      // Save to offline storage
      await get().saveToOffline();
      
    } catch (error: any) {
      console.error('Init error:', error);
      // Try to load from offline storage
      await get().loadFromOffline();
      set({ error: 'Mode hors-ligne activé' });
    } finally {
      set({ isLoading: false });
    }
  },

  loadCategories: async () => {
    try {
      const categories = await api.getCategories();
      set({ categories });
    } catch (error: any) {
      console.error('Load categories error:', error);
    }
  },

  loadInterventionTypes: async () => {
    try {
      const interventionTypes = await api.getInterventionTypes();
      set({ interventionTypes });
    } catch (error: any) {
      console.error('Load intervention types error:', error);
    }
  },

  loadFiches: async (params) => {
    try {
      const fiches = await api.getFiches(params);
      set({ fiches });
    } catch (error: any) {
      console.error('Load fiches error:', error);
    }
  },

  searchFiches: async (query: string) => {
    try {
      set({ isLoading: true });
      const fiches = await api.getFiches({ search: query });
      set({ fiches, searchQuery: query });
    } catch (error: any) {
      console.error('Search error:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  loadFavorites: async () => {
    try {
      const { deviceId } = get();
      if (!deviceId) return;
      
      const favorites = await api.getFavorites(deviceId);
      const favoriteIds = new Set(favorites.map(f => f.id));
      set({ favorites, favoriteIds });
    } catch (error: any) {
      console.error('Load favorites error:', error);
    }
  },

  toggleFavorite: async (ficheId: string) => {
    try {
      const { deviceId, favoriteIds, favorites, fiches } = get();
      if (!deviceId) return;
      
      if (favoriteIds.has(ficheId)) {
        await api.removeFavorite(deviceId, ficheId);
        const newFavoriteIds = new Set(favoriteIds);
        newFavoriteIds.delete(ficheId);
        set({ 
          favoriteIds: newFavoriteIds,
          favorites: favorites.filter(f => f.id !== ficheId)
        });
      } else {
        await api.addFavorite(deviceId, ficheId);
        const newFavoriteIds = new Set(favoriteIds);
        newFavoriteIds.add(ficheId);
        const fiche = fiches.find(f => f.id === ficheId);
        if (fiche) {
          set({ 
            favoriteIds: newFavoriteIds,
            favorites: [...favorites, fiche]
          });
        }
      }
    } catch (error: any) {
      console.error('Toggle favorite error:', error);
    }
  },

  isFavorite: (ficheId: string) => {
    return get().favoriteIds.has(ficheId);
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  clearError: () => {
    set({ error: null });
  },

  saveToOffline: async () => {
    try {
      const { categories, interventionTypes, fiches, favorites } = get();
      await AsyncStorage.setItem(OFFLINE_CATEGORIES_KEY, JSON.stringify(categories));
      await AsyncStorage.setItem(OFFLINE_INTERVENTION_TYPES_KEY, JSON.stringify(interventionTypes));
      await AsyncStorage.setItem(OFFLINE_FICHES_KEY, JSON.stringify(fiches));
      await AsyncStorage.setItem(OFFLINE_FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Save to offline error:', error);
    }
  },

  loadFromOffline: async () => {
    try {
      const categoriesJson = await AsyncStorage.getItem(OFFLINE_CATEGORIES_KEY);
      const interventionTypesJson = await AsyncStorage.getItem(OFFLINE_INTERVENTION_TYPES_KEY);
      const fichesJson = await AsyncStorage.getItem(OFFLINE_FICHES_KEY);
      const favoritesJson = await AsyncStorage.getItem(OFFLINE_FAVORITES_KEY);
      
      if (categoriesJson) set({ categories: JSON.parse(categoriesJson) });
      if (interventionTypesJson) set({ interventionTypes: JSON.parse(interventionTypesJson) });
      if (fichesJson) set({ fiches: JSON.parse(fichesJson) });
      if (favoritesJson) {
        const favorites = JSON.parse(favoritesJson);
        set({ 
          favorites,
          favoriteIds: new Set(favorites.map((f: Fiche) => f.id))
        });
      }
    } catch (error) {
      console.error('Load from offline error:', error);
    }
  },
}));
