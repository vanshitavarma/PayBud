import client from './client';

export const expensesApi = {
  getAll: (params) => client.get('/expenses', { params }),
  getById: (id) => client.get(`/expenses/${id}`),
  create: (data) => client.post('/expenses', data),
  update: (id, data) => client.patch(`/expenses/${id}`, data),
  delete: (id) => client.delete(`/expenses/${id}`),
  getByGroup: (groupId, params) => client.get(`/groups/${groupId}/expenses`, { params }),
};
