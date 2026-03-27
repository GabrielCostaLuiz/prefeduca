import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Student } from './student.types';
import { makeStudentRepository } from './student.factory';
import { useClassStore } from '../classes/class.store';

const studentRepository = makeStudentRepository();

interface StudentState {
  students: Student[];
  isLoading: boolean;
  error: string | null;
  fetchStudents: (classId: string) => Promise<void>;
  fetchAllStudents: () => Promise<void>;
  addStudent: (classId: string, name: string) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  updateStudent: (id: string, name: string) => Promise<void>;
}

export const useStudentStore = create<StudentState>()(
  persist(
    (set, get) => ({
      students: [],
      isLoading: false,
      error: null,

      fetchStudents: async (classId) => {
        set({ isLoading: true, error: null });
        try {
          const data = await studentRepository.fetchByClass(classId);
          set((state) => {
            const merged = [...data];
            state.students.forEach((local) => {
              if (
                local.classId === classId &&
                !merged.find((s) => s.id === local.id)
              ) {
                merged.push(local);
              } else if (local.classId !== classId) {
                merged.push(local);
              }
            });
            return { students: merged };
          });
        } catch (error: unknown) {
          set({ error: (error as Error).message || 'Erro ao carregar alunos' });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchAllStudents: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await studentRepository.fetchAll();
          set((state) => {
            const merged = [...data];
            state.students.forEach((local) => {
              if (!merged.find((s) => s.id === local.id)) {
                merged.push(local);
              }
            });
            return { students: merged };
          });
        } catch (error: unknown) {
          set({ error: (error as Error).message || 'Erro ao carregar alunos' });
        } finally {
          set({ isLoading: false });
        }
      },

      addStudent: async (classId, name) => {
        try {
          const newStudent = await studentRepository.create(classId, { name });
          set((state) => ({ students: [...state.students, newStudent] }));
          useClassStore.getState().updateStudentCount(classId, 1);
        } catch (error) {
          console.error('Failed to create student', error);
        }
      },

      deleteStudent: async (id) => {
        try {
          const student = get().students.find(s => s.id === id);
          await studentRepository.delete(id);
          set((state) => ({
            students: state.students.filter((s) => s.id !== id),
          }));
          if (student) {
            useClassStore.getState().updateStudentCount(student.classId, -1);
          }
        } catch (error) {
          console.error('Failed to delete student', error);
        }
      },

      updateStudent: async (id, name) => {
        try {
          const updated = await studentRepository.update(id, name);
          set((state) => ({
            students: state.students.map((s) => (s.id === id ? updated : s)),
          }));
        } catch (error) {
          console.error('Failed to update student', error);
        }
      },
    }),
    {
      name: 'prefeduca-students',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
