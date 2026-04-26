import client from './client';

export const paymentsApi = {
  settle: (data) => client.post('/payments/settle', data),
  getHistory: (params) => client.get('/payments/transactions', { params }),
  getBalance: () => client.get('/payments/balance'),
};
