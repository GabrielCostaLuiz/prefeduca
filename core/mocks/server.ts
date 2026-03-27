import { setupServer } from 'msw/native';

import { classHandlers } from './handlers/class.handlers';
import { schoolHandlers } from './handlers/school.handlers';
import { studentHandlers } from './handlers/student.handlers';

export const server = setupServer(...schoolHandlers, ...classHandlers, ...studentHandlers);
