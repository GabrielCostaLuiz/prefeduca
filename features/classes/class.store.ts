import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Class, CreateClassDTO, UpdateClassDTO } from './class.types';
import { makeClassRepository } from './class.factory';
import { useSchoolStore } from '../schools/school.store';

const classRepository = makeClassRepository();

interface ClassState {
  classes: Class[];
  isLoading: boolean;
  error: string | null;
  fetchClasses: (schoolId: string) => Promise<void>;
  fetchAllClasses: () => Promise<void>;
  addClass: (schoolId: string, data: CreateClassDTO) => Promise<void>;
  updateClass: (id: string, data: UpdateClassDTO) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  getClass: (id: string) => Class | undefined;
  updateStudentCount: (id: string, increment: number) => void;
}

export const useClassStore = create<ClassState>()(
  persist(
    (set, get) => ({
      classes: [],
      isLoading: false,
      error: null,

      fetchClasses: async (schoolId) => {
        set({ isLoading: true, error: null });
        try {
          const data = await classRepository.fetchBySchool(schoolId);
      set((state) => {
        const merged = [...data];
        state.classes.forEach(local => {
          if (local.schoolId === schoolId && !merged.find(c => c.id === local.id)) {
            merged.push(local);
          } else if (local.schoolId !== schoolId) {
            merged.push(local);
          }
        });
        return { classes: merged };
      });
        } catch (error: any) {
          set({ error: error.message || 'Erro ao carregar turmas' });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchAllClasses: async () => {
        set({ isLoading: true });
        try {
          const data = await classRepository.fetchAll();
      set((state) => {
        const merged = [...data];
        state.classes.forEach(local => {
          if (!merged.find(c => c.id === local.id)) {
            merged.push(local);
          }
        });
        return { classes: merged };
      });
        } catch (error) {
          console.error('Failed to fetch all classes', error);
        } finally {
          set({ isLoading: false });
        }
      },

      addClass: async (schoolId, data) => {
        try {
          const newClass = await classRepository.create(schoolId, data);
          set((state) => ({ classes: [...state.classes, newClass] }));
          useSchoolStore.getState().updateClassCount(schoolId, 1);
        } catch (error) {
          console.error('Failed to create class', error);
        }
      },

      updateClass: async (id, data) => {
        try {
          const updated = await classRepository.update(id, data);
          set((state) => ({
            classes: state.classes.map((c) => (c.id === id ? updated : c)),
          }));
        } catch (error) {
          console.error('Failed to update class', error);
        }
      },

      deleteClass: async (id) => {
        try {
          const clazz = get().classes.find(c => c.id === id);
          await classRepository.delete(id);
          set((state) => ({
            classes: state.classes.filter((c) => c.id !== id),
          }));
          if (clazz) {
            useSchoolStore.getState().updateClassCount(clazz.schoolId, -1);
          }
        } catch (error) {
          console.error('Failed to delete class', error);
        }
      },

      getClass: (id) => get().classes.find((c) => c.id === id),

      updateStudentCount: (id, increment) => {
        set((state) => ({
          classes: state.classes.map((c) => 
            c.id === id ? { ...c, studentsCount: Math.max(0, c.studentsCount + increment) } : c
          )
        }));
      },
    }),
    {
      name: 'prefeduca-classes',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
