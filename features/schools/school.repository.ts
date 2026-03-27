import { http, HttpAdapter } from '@/core/http/http.adapter';
import { School, CreateSchoolDTO, UpdateSchoolDTO } from './school.types';

export interface SchoolRepository {
  fetchAll(): Promise<School[]>;
  fetchById(id: string): Promise<School>;
  create(data: CreateSchoolDTO): Promise<School>;
  update(id: string, data: UpdateSchoolDTO): Promise<School>;
  delete(id: string): Promise<void>;
}

export class HttpSchoolRepository implements SchoolRepository {
  constructor(private readonly client: HttpAdapter = http) {}

  async fetchAll(): Promise<School[]> {
    return await this.client.get<School[]>('/schools');
  }

  async fetchById(id: string): Promise<School> {
    return await this.client.get<School>(`/schools/${id}`);
  }

  async create(data: CreateSchoolDTO): Promise<School> {
    return await this.client.post<School>('/schools', data);
  }

  async update(id: string, data: UpdateSchoolDTO): Promise<School> {
    return await this.client.put<School>(`/schools/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(`/schools/${id}`);
  }
}
