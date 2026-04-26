import client from './client';

export const authApi = {
  login: (credentials) => client.post('/auth/login', credentials),
  register: (data) => client.post('/auth/register', data),
  getProfile: () => client.get('/auth/me'),
  updateProfile: (data) => client.patch('/auth/me', data),
  forgotPassword: (email) => client.post('/auth/forgot-password', { email }),
  resetPassword: (data) => client.post('/auth/reset-password', data),
};
