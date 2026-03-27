export interface Class {
  id: string;
  name: string;
  room: string;
  studentsCount: number;
  schoolId: string;
  schoolName?: string;
}

export type CreateClassDTO = Omit<Class, 'id' | 'schoolId' | 'studentsCount' | 'schoolName'>;
export type UpdateClassDTO = Partial<CreateClassDTO>;
