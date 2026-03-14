import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../src/theme';

function RootNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.surface,
          },
          headerTintColor: theme.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="fiche/[id]"
          options={{
            title: 'Fiche',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="fiche/edit/[id]"
          options={{
            title: 'Modifier la fiche',
            presentation: 'modal',
          }}
        />

        <Stack.Screen
          name="fiche/new"
          options={{
            title: 'Nouvelle fiche',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="category/[id]"
          options={{
            title: 'Cat\u00e9gorie',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="intervention/[id]"
          options={{
            title: 'Intervention',
            presentation: 'card',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
