import { create } from 'zustand';
import { Student, CreateStudentDTO } from './student.types';
import { makeStudentRepository } from './student.factory';
import { useClassStore } from '../classes/class.store';

const studentRepository = makeStudentRepository();

interface StudentState {
  students: Student[];
  isLoading: boolean;
  error: string | null;
  fetchStudents: (classId: string) => Promise<void>;
  addStudent: (classId: string, name: string) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  updateStudent: (id: string, name: string) => Promise<void>;
}

export const useStudentStore = create<StudentState>((set, get) => ({
  students: [],
  isLoading: false,
  error: null,

  fetchStudents: async (classId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await studentRepository.fetchByClass(classId);
      set({ students: data });
    } catch (error: any) {
      set({ error: error.message || 'Erro ao carregar alunos' });
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
}));
