import { HttpSchoolRepository } from './school.repository';

export const makeSchoolRepository = () => {
  return new HttpSchoolRepository();
};
