import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { setCredentials, logout as logoutAction, setLoading, setAuthError } from '@/store/authSlice';
import { authApi } from '@/api';

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const login = useCallback(async (credentials) => {
    try {
      dispatch(setLoading(true));
      const { data } = await authApi.login(credentials);
      localStorage.setItem('paysplit_token', data.token);
      dispatch(setCredentials({ user: data.user, token: data.token }));
      return data;
    } catch (err) {
      dispatch(setAuthError(err.response?.data?.message || 'Login failed'));
      throw err;
    }
  }, [dispatch]);

  const register = useCallback(async (userData) => {
    try {
      dispatch(setLoading(true));
      const { data } = await authApi.register(userData);
      localStorage.setItem('paysplit_token', data.token);
      dispatch(setCredentials({ user: data.user, token: data.token }));
      return data;
    } catch (err) {
      dispatch(setAuthError(err.response?.data?.message || 'Registration failed'));
      throw err;
    }
  }, [dispatch]);

  const logout = useCallback(() => {
    localStorage.removeItem('paysplit_token');
    dispatch(logoutAction());
  }, [dispatch]);

  const loadUser = useCallback(async () => {
    const storedToken = localStorage.getItem('paysplit_token');
    if (!storedToken) return;
    try {
      dispatch(setLoading(true));
      const { data } = await authApi.getProfile();
      dispatch(setCredentials({ user: data.user, token: storedToken }));
    } catch {
      localStorage.removeItem('paysplit_token');
      dispatch(logoutAction());
    }
  }, [dispatch]);

  return { user, token, isAuthenticated, loading, error, login, register, logout, loadUser };
}
