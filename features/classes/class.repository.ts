import { http, HttpAdapter } from '@/core/http/http.adapter';
import { Class, CreateClassDTO, UpdateClassDTO } from './class.types';

export interface ClassRepository {
  fetchAll(): Promise<Class[]>;
  fetchBySchool(schoolId: string): Promise<Class[]>;
  fetchById(id: string): Promise<Class>;
  create(schoolId: string, data: CreateClassDTO): Promise<Class>;
  update(id: string, data: UpdateClassDTO): Promise<Class>;
  delete(id: string): Promise<void>;
}

export class HttpClassRepository implements ClassRepository {
  constructor(private readonly client: HttpAdapter = http) {}

  async fetchAll(): Promise<Class[]> {
    return await this.client.get<Class[]>('/classes');
  }

  async fetchBySchool(schoolId: string): Promise<Class[]> {
    return await this.client.get<Class[]>(`/schools/${schoolId}/classes`);
  }

  async fetchById(id: string): Promise<Class> {
    return await this.client.get<Class>(`/classes/${id}`);
  }

  async create(schoolId: string, data: CreateClassDTO): Promise<Class> {
    return await this.client.post<Class>(`/schools/${schoolId}/classes`, data);
  }

  async update(id: string, data: UpdateClassDTO): Promise<Class> {
    return await this.client.put<Class>(`/classes/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(`/classes/${id}`);
  }
}
