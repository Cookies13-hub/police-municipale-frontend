import axios from 'axios';
import { Category, InterventionType, Fiche, Favorite } from '../types';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Categories
export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/categories');
  return response.data;
};

export const createCategory = async (data: Omit<Category, 'id' | 'created_at'>): Promise<Category> => {
  const response = await api.post('/categories', data);
  return response.data;
};

// Intervention Types
export const getInterventionTypes = async (): Promise<InterventionType[]> => {
  const response = await api.get('/intervention-types');
  return response.data;
};

export const createInterventionType = async (data: Omit<InterventionType, 'id' | 'created_at'>): Promise<InterventionType> => {
  const response = await api.post('/intervention-types', data);
  return response.data;
};

// Fiches
export const getFiches = async (params?: {
  category_id?: string;
  intervention_type_id?: string;
  search?: string;
}): Promise<Fiche[]> => {
  const response = await api.get('/fiches', { params });
  return response.data;
};

export const getFicheById = async (id: string): Promise<Fiche> => {
  const response = await api.get(`/fiches/${id}`);
  return response.data;
};

export const createFiche = async (data: Omit<Fiche, 'id' | 'created_at' | 'updated_at'>): Promise<Fiche> => {
  const response = await api.post('/fiches', data);
  return response.data;
};

export const updateFiche = async (id: string, data: Partial<Fiche>): Promise<Fiche> => {
  const response = await api.put(`/fiches/${id}`, data);
  return response.data;
};

export const deleteFiche = async (id: string): Promise<void> => {
  await api.delete(`/fiches/${id}`);
};

// Favorites
export const getFavorites = async (deviceId: string): Promise<Fiche[]> => {
  const response = await api.get(`/favorites/${deviceId}`);
  return response.data;
};

export const addFavorite = async (deviceId: string, ficheId: string): Promise<Favorite> => {
  const response = await api.post('/favorites', { device_id: deviceId, fiche_id: ficheId });
  return response.data;
};

export const removeFavorite = async (deviceId: string, ficheId: string): Promise<void> => {
  await api.delete(`/favorites/${deviceId}/${ficheId}`);
};

export const checkFavorite = async (deviceId: string, ficheId: string): Promise<boolean> => {
  const response = await api.get(`/favorites/check/${deviceId}/${ficheId}`);
  return response.data.is_favorite;
};

// Seed database
export const seedDatabase = async (): Promise<{ seeded: boolean; message: string }> => {
  const response = await api.post('/seed');
  return response.data;
};

export default api;
