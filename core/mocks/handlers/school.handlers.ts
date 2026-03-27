import { http, HttpResponse } from 'msw';
import { db, recalculateClassCounts } from '../db';
import { API_URL } from './constants';

export const schoolHandlers = [
  http.get(`${API_URL}/schools`, () => {
    recalculateClassCounts();
    return HttpResponse.json(db.schools);
  }),

  http.post(`${API_URL}/schools`, async ({ request }) => {
    const newSchool = (await request.json()) as any;
    const schoolWithId = {
      ...newSchool,
      id: Math.random().toString(36).substr(2, 9),
      classCount: 0,
    };
    db.schools.push(schoolWithId);
    recalculateClassCounts();
    return HttpResponse.json(schoolWithId, { status: 201 });
  }),

  http.put(`${API_URL}/schools/:id`, async ({ request, params }) => {
    const { id } = params;
    const body = (await request.json()) as any;
    const index = db.schools.findIndex((s) => s.id === id);
    if (index > -1) {
      db.schools[index] = { ...db.schools[index], ...body };
      recalculateClassCounts();
      return HttpResponse.json(db.schools[index]);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.get(`${API_URL}/schools/:id`, ({ params }) => {
    const { id } = params;
    const school = db.schools.find((s) => s.id === id);
    if (!school) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(school);
  }),

  http.delete(`${API_URL}/schools/:id`, ({ params }) => {
    const { id } = params;
    const index = db.schools.findIndex((s) => s.id === id);
    if (index > -1) {
      db.schools.splice(index, 1);
      recalculateClassCounts();
    }
    return new HttpResponse(null, { status: 204 });
  }),
];
