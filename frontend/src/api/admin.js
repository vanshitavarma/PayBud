import client from './client';

export const adminApi = {
  getAllUsers: () => client.get('/admin/users'),
  addBalance: (userId, amount) => client.post('/admin/add-balance', { userId, amount }),
};
