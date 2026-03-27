import { http, HttpAdapter } from '@/core/http/http.adapter';
import { Student, CreateStudentDTO } from './student.types';

export interface StudentRepository {
  fetchByClass(classId: string): Promise<Student[]>;
  create(classId: string, data: CreateStudentDTO): Promise<Student>;
  delete(id: string): Promise<void>;
  update(id: string, name: string): Promise<Student>;
}

export class HttpStudentRepository implements StudentRepository {
  constructor(private readonly client: HttpAdapter = http) {}

  async fetchByClass(classId: string): Promise<Student[]> {
    return await this.client.get<Student[]>(`/classes/${classId}/students`);
  }

  async create(classId: string, data: CreateStudentDTO): Promise<Student> {
    return await this.client.post<Student>(
      `/classes/${classId}/students`,
      data,
    );
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(`/students/${id}`);
  }

  async update(id: string, name: string): Promise<Student> {
    return await this.client.put<Student>(`/students/${id}`, { name });
  }
}
