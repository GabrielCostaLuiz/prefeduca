import { http, HttpResponse } from 'msw';
import { db, recalculateClassCounts, recalculateStudentCounts } from '../db';
import { API_URL } from './constants';

export const classHandlers = [
  http.get(`${API_URL}/classes`, () => {
    const classesWithSchool = db.classes.map((c) => {
      const school = db.schools.find((s) => s.id === c.schoolId);
      return { ...c, schoolName: school?.name };
    });
    return HttpResponse.json(classesWithSchool);
  }),

  http.get(`${API_URL}/schools/:schoolId/classes`, ({ params }) => {
    const { schoolId } = params;
    const school = db.schools.find((s) => s.id === schoolId);
    const classes = db.classes
      .filter((c) => c.schoolId === schoolId)
      .map((c) => ({ ...c, schoolName: school?.name }));
    return HttpResponse.json(classes);
  }),

  http.post(
    `${API_URL}/schools/:schoolId/classes`,
    async ({ request, params }) => {
      const { schoolId } = params;
      const body = (await request.json()) as any;
      const classWithId = {
        ...body,
        id: Math.random().toString(36).substr(2, 9),
        schoolId: schoolId as string,
        studentsCount: 0,
      };
      db.classes.push(classWithId);
      recalculateClassCounts();
      return HttpResponse.json(classWithId, { status: 201 });
    },
  ),

  http.put(`${API_URL}/classes/:id`, async ({ request, params }) => {
    const { id } = params;
    const updatedData = (await request.json()) as any;
    const index = db.classes.findIndex((c) => c.id === id);
    if (index > -1) {
      db.classes[index] = { ...db.classes[index], ...updatedData };
      return HttpResponse.json(db.classes[index]);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.delete(`${API_URL}/classes/:id`, ({ params }) => {
    const { id } = params;
    const index = db.classes.findIndex((c) => c.id === id);
    if (index > -1) {
      db.classes.splice(index, 1);
      recalculateClassCounts();
      recalculateStudentCounts();
    }
    return new HttpResponse(null, { status: 204 });
  }),
];
