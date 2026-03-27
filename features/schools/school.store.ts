import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { School, CreateSchoolDTO, UpdateSchoolDTO } from './school.types';
import { makeSchoolRepository } from './school.factory';

const schoolRepository = makeSchoolRepository();

interface SchoolState {
  schools: School[];
  isLoading: boolean;
  error: string | null;
  fetchSchools: () => Promise<void>;
  addSchool: (data: CreateSchoolDTO) => Promise<void>;
  updateSchool: (id: string, data: UpdateSchoolDTO) => Promise<void>;
  deleteSchool: (id: string) => Promise<void>;
  getSchool: (id: string) => School | undefined;
  updateClassCount: (id: string, increment: number) => void;
}

export const useSchoolStore = create<SchoolState>()(
  persist(
    (set, get) => ({
  schools: [],
  isLoading: false,
  error: null,

  fetchSchools: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await schoolRepository.fetchAll();
      set({ schools: data });
    } catch (error: any) {
      set({ error: error.message || 'Erro ao carregar escolas' });
    } finally {
      set({ isLoading: false });
    }
  },

  addSchool: async (data) => {
    try {
      const newSchool = await schoolRepository.create(data);
      set((state) => ({ schools: [...state.schools, newSchool] }));
    } catch (error) {
      console.error('Failed to create school', error);
    }
  },

  updateSchool: async (id, data) => {
    try {
      const updated = await schoolRepository.update(id, data);
      set((state) => ({
        schools: state.schools.map((s) => (s.id === id ? updated : s)),
      }));
    } catch (error) {
      console.error('Failed to update school', error);
    }
  },

  deleteSchool: async (id) => {
    try {
      await schoolRepository.delete(id);
      set((state) => ({
        schools: state.schools.filter((s) => s.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete school', error);
    }
  },

  getSchool: (id) => get().schools.find((s) => s.id === id),

  updateClassCount: (id, increment) => {
    set((state) => ({
      schools: state.schools.map((s) => 
        s.id === id ? { ...s, classCount: Math.max(0, s.classCount + increment) } : s
      )
    }));
  },
}), {
  name: 'prefeduca-schools',
  storage: createJSONStorage(() => AsyncStorage),
}));
