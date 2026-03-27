import { http, HttpResponse } from 'msw';
import { db, recalculateStudentCounts } from '../db';
import { API_URL } from './constants';

export const studentHandlers = [
  http.get(`${API_URL}/classes/:classId/students`, ({ params }) => {
    const { classId } = params;
    return HttpResponse.json(db.students.filter((s) => s.classId === classId));
  }),

  http.get(`${API_URL}/students`, () => {
    return HttpResponse.json(db.students);
  }),

  http.post(`${API_URL}/classes/:classId/students`, async ({ request, params }) => {
    const { classId } = params;
    const body = await request.json() as any;

    const classStudents = db.students.filter((s) => s.classId === classId);
    const maxCallNumber = classStudents.length > 0 
      ? Math.max(...classStudents.map((s) => s.callNumber)) 
      : 0;

    const newStudent = {
      id: Math.random().toString(36).substr(2, 9),
      name: body.name,
      callNumber: maxCallNumber + 1,
      classId: classId as string,
    };

    db.students.push(newStudent);
    recalculateStudentCounts();
    return HttpResponse.json(newStudent, { status: 201 });
  }),

  http.put(`${API_URL}/students/:id`, async ({ request, params }) => {
    const { id } = params;
    const body = await request.json() as any;
    const index = db.students.findIndex((s) => s.id === id);
    if (index > -1) {
      db.students[index] = { ...db.students[index], ...body };
      recalculateStudentCounts();
      return HttpResponse.json(db.students[index]);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.delete(`${API_URL}/students/:id`, ({ params }) => {
    const { id } = params;
    const index = db.students.findIndex((s) => s.id === id);
    if (index > -1) {
      db.students.splice(index, 1);
      recalculateStudentCounts();
    }
    return new HttpResponse(null, { status: 204 });
  }),
];
