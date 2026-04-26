import client from './client';

export const usersApi = {
  getProfile: () => client.get('/users/profile'),
  updateProfile: (data) => client.put('/users/profile', data),
  updateAvatar: (avatarUrl) => client.put('/users/avatar', { avatarUrl }),
  searchByUpi: (upiId) => client.get(`/users/search/${upiId}`),
};
