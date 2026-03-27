import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateStorage, createJSONStorage } from 'zustand/middleware';

const memoryStore = new Map<string, string>();
let useMemoryFallback = false;

const rawStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (useMemoryFallback) return memoryStore.get(name) || null;

    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        return window.localStorage.getItem(name);
      }
      return await AsyncStorage.getItem(name);
    } catch (e: unknown) {
      if (e instanceof Error && e?.message?.includes('Native module is null')) {
        useMemoryFallback = true;
        return memoryStore.get(name) || null;
      }
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (useMemoryFallback) {
      memoryStore.set(name, value);
      return;
    }

    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.localStorage.setItem(name, value);
        return;
      }
      await AsyncStorage.setItem(name, value);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error?.message?.includes('Native module is null')
      ) {
        useMemoryFallback = true;
        memoryStore.set(name, value);
      }
    }
  },
  removeItem: async (name: string): Promise<void> => {
    if (useMemoryFallback) {
      memoryStore.delete(name);
      return;
    }

    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.localStorage.removeItem(name);
        return;
      }
      await AsyncStorage.removeItem(name);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error?.message?.includes('Native module is null')
      ) {
        useMemoryFallback = true;
        memoryStore.delete(name);
      }
    }
  },
};

export const storageAdapter = createJSONStorage(() => rawStorage);
