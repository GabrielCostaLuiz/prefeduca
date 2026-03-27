export interface Student {
  id: string;
  name: string;
  callNumber: number;
  classId: string;
}

export type CreateStudentDTO = { name: string };
