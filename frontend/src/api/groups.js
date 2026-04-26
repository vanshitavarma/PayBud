import client from './client';

export const groupsApi = {
  getAll: () => client.get('/groups'),
  getById: (id) => client.get(`/groups/${id}`),
  create: (data) => client.post('/groups', data),
  update: (id, data) => client.put(`/groups/${id}`, data),
  delete: (id) => client.delete(`/groups/${id}`),
  addMember: (groupId, email) => client.post(`/groups/${groupId}/invite`, { email }),
  getBalances: (groupId) => client.get(`/groups/${groupId}/balances`),
};
