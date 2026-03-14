/**
 * Palette de couleurs pour le mode clair et sombre
 * Basé sur Tailwind CSS et adapté pour la Police Municipale
 */

export const colors = {
  light: {
    // Backgrounds
    background: '#F9FAFB',      // gray-50
    surface: '#FFFFFF',          // white
    surfaceAlt: '#F3F4F6',      // gray-100
    
    // Text
    text: '#111827',             // gray-900
    textSecondary: '#6B7280',    // gray-500
    textTertiary: '#9CA3AF',     // gray-400
    
    // Primary (Police blue)
    primary: '#3B82F6',          // blue-500
    primaryDark: '#2563EB',      // blue-600
    primaryLight: '#60A5FA',     // blue-400
    
    // Borders
    border: '#E5E7EB',           // gray-200
    borderDark: '#D1D5DB',       // gray-300
    
    // Status colors
    success: '#10B981',          // green-500
    warning: '#F59E0B',          // amber-500
    error: '#EF4444',            // red-500
    info: '#3B82F6',             // blue-500
    
    // Card shadow
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  
  dark: {
    // Backgrounds
    background: '#030712',       // gray-950
    surface: '#111827',          // gray-900
    surfaceAlt: '#1F2937',       // gray-800
    
    // Text
    text: '#F9FAFB',             // gray-50
    textSecondary: '#9CA3AF',    // gray-400
    textTertiary: '#6B7280',     // gray-500
    
    // Primary (Police blue - adjusted for dark mode)
    primary: '#60A5FA',          // blue-400
    primaryDark: '#3B82F6',      // blue-500
    primaryLight: '#93C5FD',     // blue-300
    
    // Borders
    border: '#1F2937',           // gray-800
    borderDark: '#374151',       // gray-700
    
    // Status colors (slightly brighter for dark mode)
    success: '#34D399',          // green-400
    warning: '#FBBF24',          // amber-400
    error: '#F87171',            // red-400
    info: '#60A5FA',             // blue-400
    
    // Card shadow
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};

export type Theme = typeof colors.light;
