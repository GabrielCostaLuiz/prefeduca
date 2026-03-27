import { HttpClassRepository } from './class.repository';

export const makeClassRepository = () => {
  return new HttpClassRepository();
};
