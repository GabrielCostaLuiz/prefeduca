import { HttpStudentRepository } from './student.repository';

export const makeStudentRepository = () => {
  return new HttpStudentRepository();
};
