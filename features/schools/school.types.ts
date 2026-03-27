export interface School {
  id: string;
  name: string;
  address: string;
  classCount: number;
}

export type CreateSchoolDTO = Omit<School, 'id' | 'classCount'>;
export type UpdateSchoolDTO = Partial<CreateSchoolDTO>;
