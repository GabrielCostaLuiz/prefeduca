import { School } from '@/features/schools/school.types';
import { Class } from '@/features/classes/class.types';
import { Student } from '@/features/students/student.types';

import { mockSchools } from '@/features/schools/school.mocks';
import { mockClasses } from '@/features/classes/class.mocks';
import { mockStudents } from '@/features/students/student.mocks';

export type MockDB = {
  schools: School[];
  classes: Class[];
  students: Student[];
};

export const db: MockDB = {
  schools: [...mockSchools],
  classes: [...mockClasses],
  students: [...mockStudents],
};

export const recalculateClassCounts = () => {
  db.schools.forEach((school) => {
    school.classCount = db.classes.filter(
      (c) => c.schoolId === school.id,
    ).length;
  });
};

export const recalculateStudentCounts = () => {
  db.classes.forEach((clazz) => {
    clazz.studentsCount = db.students.filter(
      (s) => s.classId === clazz.id,
    ).length;
  });
};

recalculateClassCounts();
recalculateStudentCounts();
